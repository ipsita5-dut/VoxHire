"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn, getTechLogos } from "@/lib/utils";

interface TechIcon {
  tech: string;
  url: string;
}

interface DisplayTechIconsProps {
  techStack: string[];
  size?: number;
}

const DisplayTechIcons: React.FC<DisplayTechIconsProps> = ({ techStack }) => {
  const [techIcons, setTechIcons] = useState<TechIcon[]>([]);

  useEffect(() => {
    async function fetchTechIcons() {
      if (!techStack || !Array.isArray(techStack)) {
        setTechIcons([]);
        return;
      }
      const icons = await getTechLogos(techStack);
      setTechIcons(icons);
    }
    fetchTechIcons();
  }, [techStack]);

  if (!techIcons.length) return null;

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image src={url} alt={tech} width={40} height={40} className="size-10" />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
