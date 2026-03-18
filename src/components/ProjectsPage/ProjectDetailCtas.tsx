"use client";

import { useRouter } from "next/navigation";
import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";
import Button from "@/components/common/Button";

interface ProjectDetailCtasProps {
  liveLink: string;
}

const ProjectDetailCtas = ({ liveLink }: ProjectDetailCtasProps) => {
  const router = useRouter();

  const handleVisitLiveSite = () => {
    window.open(liveLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <Button
        type="button"
        variant="solid"
        onClick={handleVisitLiveSite}
        containerClassName="!max-w-none !min-w-[180px]">
        Visit Live Site
        <FaExternalLinkAlt className="text-xs" />
      </Button>
    </div>
  );
};

export default ProjectDetailCtas;
