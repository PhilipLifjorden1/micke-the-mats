import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, contact, date, location, message } = req.body;

  try {
    await resend.emails.send({
      from: 'Micke & The Mats <onboarding@resend.dev>',
      to: 'mikaellifjorden@gmail.com',
      subject: 'Ny bokningsförfrågan!',
      html: `
        <h2>Ny bokning</h2>
        <p><strong>Namn:</strong> ${name}</p>
        <p><strong>Kontakt:</strong> ${contact}</p>
        <p><strong>Datum:</strong> ${date}</p>
        <p><strong>Plats:</strong> ${location}</p>
        <p><strong>Meddelande:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}