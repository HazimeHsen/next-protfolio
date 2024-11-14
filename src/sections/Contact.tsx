"use client";
import React, { MouseEvent, useState, ChangeEvent } from "react";
import { Label } from "@/components/common/Label";
import { Input } from "@/components/common/Input";
import { cn } from "@/utils/cn";
import { Textarea } from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import StarBg from "@/components/Animations/StarBg";
import { sendEmail } from "@/lib/useSendEmail";
import BlurFade from "@/components/Animations/BlurFade";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { contactContent } from "@/data";

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
  const { ref, inView } = useInView({ threshold: 0.3 });

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
        setFormData({ name: "", email: "", message: "" });
        setErrors({ name: "", email: "", message: "" });
        toast.success(contactContent.successMessage, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="contact" className="relative w-full">
      <Toaster />
      <StarBg
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
            <BlurFade
              delay={0.1}
              inView={inView}
              className="font-extrabold text-2xl md:text-3xl text-neutral-200">
              {contactContent.title}
            </BlurFade>
            <BlurFade
              delay={0.2}
              inView={inView}
              className="text-sm max-w-sm mt-4 text-neutral-300">
              {contactContent.description}
            </BlurFade>
            <div className="mt-5 md:mt-10">
              <BlurFade
                delay={0.3}
                inView={inView}
                className="text-neutral-200 text-base font-bold">
                {contactContent.socialsTitle}
              </BlurFade>

              <BlurFade
                delay={0.4}
                inView={inView}
                className="flex mt-4 space-x-4">
                {contactContent.socialLinks.map((link, index) => (
                  <Link href={link.href} key={index}>
                    <link.icon size={24} />
                  </Link>
                ))}
              </BlurFade>
            </div>
          </div>

          <div className="w-full max-w-md">
            <BlurFade delay={0.5} inView={inView}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  error={errors.name}
                  id="name"
                  placeholder={contactContent.placeholders.name}
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
              </LabelInputContainer>
            </BlurFade>
            <BlurFade delay={0.6} inView={inView}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  error={errors.email}
                  id="email"
                  placeholder={contactContent.placeholders.email}
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </LabelInputContainer>
            </BlurFade>
            <BlurFade delay={0.7} inView={inView}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  error={errors.message}
                  id="message"
                  placeholder={contactContent.placeholders.message}
                  value={formData.message}
                  onChange={handleChange}
                />
              </LabelInputContainer>
            </BlurFade>
            <BlurFade
              delay={0.8}
              inView={inView}
              className="flex w-full justify-center">
              <Button
                disabled={isSubmitting}
                containerClassName="max-w-full"
                className="w-full"
                onClick={(e) => handleSubmit(e)}>
                {isSubmitting
                  ? contactContent.submittingButton
                  : contactContent.submitButton}
              </Button>
            </BlurFade>
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
