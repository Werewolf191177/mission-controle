import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { Readable } from 'stream';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Google OAuth Client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`
  );

  // Endpoint to get Auth URL
  app.get('/api/auth/google/url', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/tasks',
        'https://www.googleapis.com/auth/spreadsheets'
      ],
      prompt: 'consent'
    });
    res.json({ url });
  });

  // OAuth Callback
  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      // In a real app, we would store this in a session or database.
      // For this demo context, we'll pass the access token back to the client via postMessage
      // Note: In production, passing access tokens via URL or postMessage is generally discouraged,
      // but here we are in a sandboxed preview environment.
      
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'GOOGLE_AUTH_SUCCESS', 
                  tokens: ${JSON.stringify(tokens)} 
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentification réussie. Fermeture de la fenêtre...</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      res.status(500).send('Authentication failed');
    }
  });

  // Endpoint to upload PDF to Drive
  app.post('/api/drive/upload', async (req, res) => {
    const { tokens, pdfBase64, fileName } = req.body;
    
    if (!tokens || !pdfBase64) {
      return res.status(400).json({ error: 'Missing tokens or PDF data' });
    }

    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials(tokens);
      
      const drive = google.drive({ version: 'v3', auth });
      
      // Convert base64 to stream
      const buffer = Buffer.from(pdfBase64.split(',')[1], 'base64');
      const stream = Readable.from(buffer);
      
      const mimeType = req.body.mimeType || 'application/pdf';
      const response = await drive.files.create({
        requestBody: {
          name: fileName || 'Mission_Fiche.pdf',
          mimeType: mimeType,
        },
        media: {
          mimeType: mimeType,
          body: stream,
        },
        fields: 'id, webViewLink',
      });

      res.json({ 
        success: true, 
        fileId: response.data.id, 
        webViewLink: response.data.webViewLink 
      });
    } catch (error) {
      console.error('Error uploading to Drive:', error);
      res.status(500).json({ error: 'Failed to upload to Drive' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/sheets/export', async (req, res) => {
    const { tokens, title, sheets } = req.body;
    if (!tokens || !title || !sheets) return res.status(400).json({ error: 'Missing required parameters' });
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: tokens.access_token || tokens });
      
      const sheetsApi = google.sheets({ version: 'v4', auth });
      
      // Create new spreadsheet
      const spreadsheet = await sheetsApi.spreadsheets.create({
        requestBody: {
          properties: { title },
          sheets: sheets.map((s: any) => ({ properties: { title: s.title } }))
        }
      });
      
      const spreadsheetId = spreadsheet.data.spreadsheetId;
      
      if (!spreadsheetId) {
        throw new Error('Could not create spreadsheet');
      }

      // Update values for each sheet
      const data = sheets.map((s: any) => ({
        range: `${s.title}!A1`,
        values: s.data
      }));

      await sheetsApi.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data
        }
      });

      res.json({ url: spreadsheet.data.spreadsheetUrl });
    } catch (error: any) {
      console.error('Sheets export error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/calendar/event', async (req, res) => {
    const { tokens, summary, description, dueDate } = req.body;
    if (!tokens || !summary || !dueDate) return res.status(400).json({ error: 'Missing required parameters' });
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: tokens.access_token || tokens });
      
      const calendar = google.calendar({ version: 'v3', auth });
      const dateStr = new Date(dueDate).toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary,
          description,
          start: { date: dateStr },
          end: { date: dateStr }
        }
      });
      res.json({ eventLink: response.data.htmlLink });
    } catch (error: any) {
      console.error('Calendar error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/tasks/task', async (req, res) => {
    const { tokens, title, notes, due } = req.body;
    if (!tokens || !title) return res.status(400).json({ error: 'Missing required parameters' });
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: tokens.access_token || tokens });
      
      const tasks = google.tasks({ version: 'v1', auth });
      
      // Find default task list (usually @default)
      const response = await tasks.tasks.insert({
        tasklist: '@default',
        requestBody: {
          title,
          notes,
          ...(due && { due: new Date(due).toISOString() })
        }
      });
      res.json({ task: response.data });
    } catch (error: any) {
      console.error('Tasks error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const customKey = req.headers['x-gemini-api-key'] as string;
      const key = customKey || process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(401).json({ error: 'Clé API Gemini manquante. Veuillez configurer votre clé dans les options.' });
      }

      const tools: any = [{
        functionDeclarations: [
          {
            name: 'get_calendar_events',
            description: 'Récupère les événements à venir dans le Google Agenda de l\'utilisateur.',
            parameters: {
              type: 'OBJECT',
              properties: {
                maxResults: { type: 'INTEGER', description: 'Nombre maximum d\'événements à récupérer (par défaut 10)' }
              }
            }
          },
          {
            name: 'get_tasks',
            description: 'Récupère les tâches à venir dans Google Tasks.',
            parameters: {
              type: 'OBJECT',
              properties: {
                maxResults: { type: 'INTEGER', description: 'Nombre maximum de tâches à récupérer (par défaut 10)' }
              }
            }
          },
          {
            name: 'search_drive',
            description: 'Recherche des fichiers dans Google Drive.',
            parameters: {
              type: 'OBJECT',
              properties: {
                query: { type: 'STRING', description: 'La requête de recherche (ex: "name contains \'photo\'")' }
              },
              required: ['query']
            }
          },
          {
            name: 'create_task',
            description: 'Crée une tâche dans Google Tasks.',
            parameters: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING', description: 'Le titre de la tâche' },
                notes: { type: 'STRING', description: 'Description ou notes complémentaires' },
                due: { type: 'STRING', description: 'La date d\'échéance au format ISO (ex: YYYY-MM-DD)' }
              },
              required: ['title']
            }
          },
          {
            name: 'create_calendar_event',
            description: 'Crée un événement sur la journée dans Google Agenda.',
            parameters: {
              type: 'OBJECT',
              properties: {
                summary: { type: 'STRING', description: 'Le titre de l\'événement' },
                description: { type: 'STRING', description: 'La description de l\'événement' },
                date: { type: 'STRING', description: 'La date au format YYYY-MM-DD' }
              },
              required: ['summary', 'date']
            }
          }
        ]
      }];

      const ai = new GoogleGenAI({ 
        apiKey: key
      });
      
      const contents = (history || []).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const systemInstruction = `Tu es le Directeur de Production & Manager IA de cette application de gestion de missions photographiques "Mission Contrôle". Ton rôle est d'analyser en profondeur les performances, d'accompagner l'utilisateur (producteur, photographe, coordinateur) et de lui fournir un encadrement extrêmement constructif, comme un véritable Manager de studio.

Tu dois toujours chercher à faire évoluer l'utilisateur et le projet de manière constructive, en mettant l'accent sur deux piliers majeurs :

1. ANALYSE DES FAMILLES DE PRODUIT :
   - Évalue la charge de travail par famille de produits (AT, PUNT, HARD PRO, PWB, SBIN, Portraits, etc.) en fonction des missions en attente, en cours, ou terminées.
   - Identifie les goulots d'étranglement (ex : trop de missions 'en cours' ou 'shooté' en attente de post-production).
   - Propose une meilleure répartition de l'effort ou de l'ordre des tâches pour débloquer la production.

2. ANALYSE ET EXPLOITATION DES NOTATIONS (RATINGS) :
   - Inspecte les notations (notes de 0 à 5 étoiles) appliquées aux tâches et livrables.
   - Fais le lien entre ces notes et d'autres critères (ex: 'un format particulier a-t-il souvent de moins bonnes notes ?', 'le support vidéo obtient-il de meilleures notes que la photo ?', 'certaines familles ont-elles besoin d'ajustements techniques ou créatifs ?').
   - Fournis des feedbacks techniques extrêmement concrets et constructifs pour hausser la qualité (ex : conseils sur la lumière, le cadrage, l'angle, ou la post-production pour corriger les faiblesses des familles les moins bien notées).

3. MÉTHODE DE RECOMMANDATION CONSTRUCTIVE (STYLE LEADERSHIP DIRECTEUR) :
   - Ne te contente pas de lister les données brutes : donne du sens (insights) !
   - Adopte une posture de leader bienveillant, exigeant, inspirant et analytique. Tu encourages l'utilisateur à s'améliorer continuellement ("évoluer dans les tâches").
   - À chaque audit ou rapport, structure ta réponse avec des rubriques claires :
     - 📊 **Audits Statistiques de Production** : Notation moyenne globale, notations par famille de produit, goulots d'étranglement détectés.
     - ⚠️ **Alertes Managériales & Risques** (Deadlines serrées, dossiers bloqués).
     - 🛠️ **Directives Techniques et Artistiques** (Conseils précis de cadrage, de stylisme de produit, gestion de la lumière ou retouche post-prod adaptés aux résultats analysés).
     - 📋 **Plan d'Action du Manager** (Une To-Do list ordonnée par priorité absolue pour aujourd'hui).

IMPORTANT : Tu dois IMPÉRATIVEMENT demander la confirmation de l'utilisateur AVANT d'utiliser les outils create_task ou create_calendar_event. Ne les exécute jamais à la première demande, décris d'abord l'action et attends le feu vert.

Données actuelles des missions de l'application (à analyser dynamiquement pour calculer les moyennes de notations par famille, compter les états d'avancement, croiser les formats etc.) :
${JSON.stringify(req.body.missions || [])}
`;

      let response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents,
        config: {
          systemInstruction,
          tools: req.body.googleToken ? tools : undefined
        }
      });

      let iteration = 0;
      while (response.functionCalls && response.functionCalls.length > 0 && iteration < 3) {
        iteration++;
        const call = response.functionCalls[0];
        const { name, args } = call;
        let functionResponse;

        if (req.body.googleToken) {
          try {
            const auth = new google.auth.OAuth2();
            auth.setCredentials({ access_token: req.body.googleToken });

            if (name === 'get_calendar_events') {
              const calendar = google.calendar({ version: 'v3', auth });
              const resCall = (await calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                maxResults: Number(args.maxResults || 10),
                singleEvents: true,
                orderBy: 'startTime'
              })) as any;
              functionResponse = resCall.data.items;
            } else if (name === 'get_tasks') {
              const tasks = google.tasks({ version: 'v1', auth });
              const resCall = (await tasks.tasks.list({
                 tasklist: '@default',
                 maxResults: Number(args.maxResults || 10)
              })) as any;
              functionResponse = resCall.data.items;
            } else if (name === 'search_drive') {
              const drive = google.drive({ version: 'v3', auth });
              const resCall = (await drive.files.list({
                q: String(args.query),
                pageSize: 10,
                fields: 'files(id, name, webViewLink, mimeType)'
              })) as any;
              functionResponse = resCall.data.files;
            } else if (name === 'create_task') {
              const tasks = google.tasks({ version: 'v1', auth });
              const resCall = (await tasks.tasks.insert({
                tasklist: '@default',
                requestBody: {
                  title: String(args.title),
                  notes: args.notes ? String(args.notes) : undefined,
                  ...(args.due && { due: new Date(String(args.due)).toISOString() })
                }
              })) as any;
              functionResponse = { status: 'success', task: resCall.data };
            } else if (name === 'create_calendar_event') {
              const calendar = google.calendar({ version: 'v3', auth });
              const resCall = (await calendar.events.insert({
                calendarId: 'primary',
                requestBody: {
                  summary: String(args.summary),
                  description: args.description ? String(args.description) : undefined,
                  start: { date: String(args.date) },
                  end: { date: String(args.date) }
                }
              })) as any;
              functionResponse = { status: 'success', eventLink: resCall.data.htmlLink };
            }
          } catch (err: any) {
            console.error('Tool error:', err);
            functionResponse = { error: err.message };
          }
        } else {
          functionResponse = { error: 'Aucun token Google fourni.' };
        }

        // Store exact previous turn
        contents.push({ role: 'model', parts: response.candidates?.[0]?.content?.parts || [{ functionCall: call }] });
        // Provide the result
        contents.push({ role: 'user', parts: [{ functionResponse: { name, id: call.id, response: { result: functionResponse } } }] });

        response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents,
          config: {
            systemInstruction,
            tools: req.body.googleToken ? tools : undefined
          }
        });
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la génération de la réponse' });
    }
  });

  // Gestion des routes API non trouvées
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'Route API introuvable' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
