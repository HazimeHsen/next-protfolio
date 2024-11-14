import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();
    const myEmail = process.env.MY_EMAIL || "";
    const myPassword = process.env.MY_PASSWORD || "";

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: myEmail,
        pass: myPassword,
      },
    });

    const toThem = {
      from: myEmail,
      to: data.email,
      subject: "Portfolio Contact",
      text: "Hey, this is Hsen. Thanks for messaging me. I will get back to you as soon as possible!",
    };

    const toMe = {
      from: {
        name: "Contact form",
        address: myEmail,
      },
      to: myEmail,
      subject: "Portfolio Contact",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong> ${data.message}</p>
        </div>
      `,
    };

    await transport.sendMail(toThem);
    await transport.sendMail(toMe);

    return NextResponse.json({ message: "Email sent" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
