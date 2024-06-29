"use server";
import { Resend } from "resend";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const { name, email, message } = formData;

  try {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "hazimehussein01@gmail.com",
      subject: "Portfolio",
      reply_to: email,
      text: `name: ${name}\nmessage: ${message}`,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to send email");
    }
  }
};
