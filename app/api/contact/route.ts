import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            contactReason,
            fullName,
            phoneNumber,
            email,
            additionalInfo,
        } = body;

        if (!contactReason || !fullName || !email) {
            return NextResponse.json({ status: "error", message: "Champs requis manquants" }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465, // true pour 465, false pour autres
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Formulaire Contact" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL,
            subject: `📬 Nouveau contact: ${contactReason}`,
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                    <h2 style="color: #2c3e50;">📬 Nouveau message de contact</h2>
                    <p><strong>👤 Nom :</strong> ${fullName}</p>
                    <p><strong>📧 Email :</strong> <a href="mailto:${email}" style="color: #1d72b8;">${email}</a></p>
                    <p><strong>📞 Téléphone :</strong> ${phoneNumber || 'Non renseigné'}</p>
                    <p><strong>📌 Raison :</strong> ${contactReason}</p>
                    <p><strong>💬 Message :</strong><br/>
                    <span style="white-space: pre-line; background: #f8f8f8; display: inline-block; padding: 10px; border-radius: 4px;">${additionalInfo || 'Aucun message'}</span>
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ status: "success" });
    } catch (error: any) {
        console.error("Erreur POST /api/contact :", error);
        return NextResponse.json({ status: "error", message: "Erreur interne" }, { status: 500 });
    }
}
