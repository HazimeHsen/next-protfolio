"use client";
import React, { MouseEvent } from "react";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { cn } from "@/utils/cn";
import { Textarea } from "@/components/Textarea";
import { FaDiscord, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import Button from "@/components/Button";
import { BackgroundBeams } from "@/components/background-beams";
import { Container } from "@/components/Container";

export default function Contact() {
  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="relative w-full">
      <BackgroundBeams />
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
                <FaWhatsapp size={24} />
                <FaDiscord size={24} />
              </ul>
            </div>
          </div>

          <div className="w-full max-w-md">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="hsen" type="text" />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="hsen@gmail.com" type="email" />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Helloooooo" />
            </LabelInputContainer>
            <div className="flex w-full justify-center">
              <Button
                containerClassName="max-w-full"
                className="w-full"
                onClick={(e) => handleSubmit(e)}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
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
