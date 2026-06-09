import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Resend email API endpoint for dev server
    {
      name: 'resend-api',
      configureServer(server) {
        server.middlewares.use('/api/contact', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const { name, email, project } = JSON.parse(body);

              const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': 'Bearer re_jat1Fj6P_N1iP8LJerdem3QmDaFECdJXT',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: 'Portfolio Contact <onboarding@resend.dev>',
                  to: ['malmaxhuni212@gmail.com'],
                  subject: `New Project Inquiry from ${name}`,
                  html: `
                    <h2>New Project Pipeline Request</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr />
                    <h3>Project Brief:</h3>
                    <p>${project.replace(/\n/g, '<br/>')}</p>
                  `,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, id: data.id }));
              } else {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: data }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        });
      },
    },
  ],
});
