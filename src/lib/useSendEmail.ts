export const sendEmail = async (formData: {
  name: string;
  email: string;
  message: string;
}) => {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...formData }),
  });

  if (!response.ok) {
    throw new Error("Failed to send email");
  }

  return response.json();
};
