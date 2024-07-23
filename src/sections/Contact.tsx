"use client";
import React, { MouseEvent, useState, ChangeEvent } from "react";
import { Label } from "@/components/common/Label";
import { Input } from "@/components/common/Input";
import { cn } from "@/utils/cn";
import { Textarea } from "@/components/common/Textarea";
import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import Button from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import HeroBg from "@/components/Animations/HeroBg";
import { sendEmail } from "@/lib/useSendEmail";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const validate = () => {
    let valid = true;
    let errors = { name: "", email: "", message: "" };

    if (!formData.name) {
      errors.name = "Name is required";
      valid = false;
    }

    if (!formData.email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
      valid = false;
    }

    if (!formData.message) {
      errors.message = "Message is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (validate()) {
        setIsSubmitting(true);
        await sendEmail(formData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative w-full">
      <HeroBg
        className="absolute inset-0"
        quantity={100}
        ease={100}
        size={0.4}
        staticity={40}
        color={"#ffffff"}
      />
      <Container>
        <div className="relative grid sm:grid-cols-2 items-start gap-10 md:gap-16 p-4 mx-auto py-20 max-w-5xl">
          <div>
            <h2 className="font-extrabold text-2xl md:text-3xl text-neutral-200">
              Get in Touch
            </h2>
            <p className="text-sm max-w-sm mt-4 text-neutral-300">
              Have a question or want to work together? Fill out the form below
              and I will get back to you as soon as possible.
            </p>
            <div className="mt-5 md:mt-10">
              <h2 className="text-neutral-200 text-base font-bold">Socials</h2>

              <ul className="flex mt-4 space-x-4">
                <FaInstagram size={24} />
                <FaFacebook size={24} />
                <FaLinkedinIn size={24} />
                <FaDiscord size={24} />
              </ul>
            </div>
          </div>

          <div className="w-full max-w-md">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input
                error={errors.name}
                id="name"
                placeholder="hsen"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                error={errors.email}
                id="email"
                placeholder="hsen@gmail.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="message">Message</Label>
              <Textarea
                error={errors.message}
                id="message"
                placeholder="Helloooooo"
                value={formData.message}
                onChange={handleChange}
              />
            </LabelInputContainer>
            <div className="flex w-full justify-center">
              <Button
                containerClassName="max-w-full"
                className="w-full"
                onClick={(e) => handleSubmit(e)}>
                {isSubmitting ? "Submitting..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
