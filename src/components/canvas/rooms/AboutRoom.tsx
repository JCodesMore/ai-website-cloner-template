"use client";

import { content } from "@/data/content";
import { useSketchMaterial } from "@/hooks/useSketchMaterial";

const SKILL_SPHERE_SPACING = 0.9;
const SKILL_SPHERE_WAVE_AMPLITUDE = 0.6;
const SKILL_SPHERE_DEPTH_STEP = 0.4;
const SELF_SPHERE_RADIUS = 1.5;
const SKILL_SPHERE_RADIUS = 0.4;
const SPHERE_SEGMENTS = 12;
const SKILL_SPHERE_SEGMENTS = 8;

export function AboutRoom() {
  const cloudMaterial = useSketchMaterial("#ffffff");
  const skills = [...content.coreCompetencies, ...content.softSkills];

  return (
    <>
      <mesh material={cloudMaterial} position={[0, 0, 0]}>
        <sphereGeometry args={[SELF_SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS]} />
      </mesh>
      {skills.map((skill, index) => (
        <mesh
          key={typeof skill === "string" ? skill : skill.name}
          material={cloudMaterial}
          position={[
            (index - skills.length / 2) * SKILL_SPHERE_SPACING,
            Math.sin(index) * SKILL_SPHERE_WAVE_AMPLITUDE,
            -index * SKILL_SPHERE_DEPTH_STEP,
          ]}
        >
          <sphereGeometry args={[SKILL_SPHERE_RADIUS, SKILL_SPHERE_SEGMENTS, SKILL_SPHERE_SEGMENTS]} />
        </mesh>
      ))}
    </>
  );
}
