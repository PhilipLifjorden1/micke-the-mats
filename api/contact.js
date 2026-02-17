import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, contact, date, city, message } = req.body || {};

    // Basic validation
    if (!name || !contact || !date || !city) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "mikaellifjorden@gmail.com";

    const subject = `Ny bokningsförfrågan: ${name} (${date})`;
    const text = [
      `Namn: ${name}`,
      `Kontakt: ${contact}`,
      `Datum: ${date}`,
      `Plats/Stad: ${city}`,
      `Meddelande: ${message || "(inget)"}`,
    ].join("\n");

    // NOTE: Resend requires a verified "from" domain/email.
    // If you haven't set up a domain yet, Resend usually provides an onboarding sender.
    const from = "Micke & The Mats <onboarding@resend.dev>";

    const result = await resend.emails.send({
      from,
      to: toEmail,
      subject,
      text,
    });

    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}