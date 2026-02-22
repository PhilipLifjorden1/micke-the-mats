import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, email, date, city, message } = req.body || {};

    if (!name || !phone || !email || !date || !city) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const toEmail =
      process.env.CONTACT_TO_EMAIL || "mikaellifjorden@gmail.com";

    const replyLink = `mailto:${email}?subject=${encodeURIComponent(
      `Angående bokning ${date}`
    )}`;

    const from = "Micke & The Mats <info@mickeandthemats.se>";

    await resend.emails.send({
      from,
      to: toEmail,
      subject: `Ny bokningsförfrågan: ${name} (${date})`,
      html: `
        <h2>Ny bokningsförfrågan</h2>
        <p><strong>Namn:</strong> ${name}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>E-post:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Datum:</strong> ${date}</p>
        <p><strong>Plats/Stad:</strong> ${city}</p>
        <p><strong>Meddelande:</strong><br/>${(message || "(inget)").replace(/\n/g,"<br/>")}</p>
        <hr/>
        <p>
          <a href="${replyLink}" style="
            display:inline-block;
            padding:12px 16px;
            border-radius:12px;
            background:#ff2d55;
            color:white;
            text-decoration:none;
            font-weight:800;
          ">
            Svara kund
          </a>
        </p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}