import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

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
      scope: ['https://www.googleapis.com/auth/drive.file'],
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
      
      // Convert base64 to stream or buffer
      const buffer = Buffer.from(pdfBase64.split(',')[1], 'base64');
      
      const response = await drive.files.create({
        requestBody: {
          name: fileName || 'Mission_Fiche.pdf',
          mimeType: 'application/pdf',
        },
        media: {
          mimeType: 'application/pdf',
          body: buffer as any,
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
