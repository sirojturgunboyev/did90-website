import { Resend } from "resend";
import { client } from "@/sanity/client";

export async function POST(request: Request) {
  const data = await request.formData();
  const name = String(data.get("name") ?? "").trim().slice(0, 120);
  const email = String(data.get("email") ?? "").trim().slice(0, 200);
  const message = String(data.get("message") ?? "").trim().slice(0, 4000);
  const honeypot = String(data.get("company") ?? "");

  if (honeypot) return Response.json({ ok: true }); // silently drop bots
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });

  const settings = await client.fetch<{ to?: string; email?: string } | null>(`*[_id == "siteSettings"][0]{"to": contactRecipient, email}`);
  const to = settings?.to || settings?.email || process.env.CONTACT_TO;
  if (!to) return Response.json({ ok: false, error: "no_recipient" }, { status: 503 });

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM || "DID90 sayt <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Saytdan yangi xabar: ${name}`,
    text: `Ism: ${name}\nEmail: ${email}\n\n${message}`,
  });
  if (error) return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  return Response.json({ ok: true });
}
