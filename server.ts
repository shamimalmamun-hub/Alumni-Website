import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  app.use(express.json());

  // API Routes
  app.post('/api/send-confirmation', async (req, res) => {
    const { name, email, registrationId } = req.body;

    if (!resend) {
      console.warn('RESEND_API_KEY is not configured. Email not sent.');
      return res.status(200).json({ status: 'mocked', message: 'Resend key not configured' });
    }

    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${registrationId}`;
      const successUrl = `${process.env.APP_URL || 'http://localhost:3000'}/success/${registrationId}`;

      const { data, error } = await resend.emails.send({
        from: 'Reunion Pro <onboarding@resend.dev>', // Replace with verified domain if available
        to: [email],
        subject: 'Registration Successful! - প্রাক্তন শিক্ষার্থী পুনর্মিলনী',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a1a1a; margin-bottom: 10px;">Registration Confirmed!</h1>
              <p style="color: #6b7280; font-style: italic;">আপনার রেজিস্ট্রেশন সফল হয়েছে।</p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border-radius: 20px; text-align: center; margin-bottom: 30px;">
              <h2 style="margin: 0 0 5px 0;">Hello, ${name}</h2>
              <p style="color: #6b7280; margin-top: 0;">Welcome to the Alumni Reunion 2026</p>
              
              <div style="background-color: white; padding: 20px; display: inline-block; border-radius: 20px; border: 1px solid #eee; margin: 20px 0;">
                <img src="${qrUrl}" alt="QR Code" width="200" height="200" />
                <p style="font-size: 10px; color: #9ca3af; margin-top: 10px; font-weight: bold; letter-spacing: 2px;">YOUR ENTRY PASS</p>
              </div>
              
              <p style="font-size: 14px; color: #4b5563;">Registration ID: <strong>${registrationId.slice(-8).toUpperCase()}</strong></p>
            </div>

            <div style="text-align: center;">
              <a href="${successUrl}" style="background-color: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
                View Online Ticket
              </a>
            </div>

            <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
              This is an automated message. Please do not reply.<br/>
              Venue: Main Campus Auditorium | Date: Dec 20, 2026
            </p>
          </div>
        `,
      });

      if (error) {
        return res.status(400).json(error);
      }

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
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
    console.log(`🚀 [Server]: Server is successfully running at http://0.0.0.0:${PORT}`);
    console.log(`👉 [Mode]: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}`);
  });
}

startServer();
