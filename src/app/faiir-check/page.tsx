import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AssessmentRunner from "@/components/AssessmentRunner";
import { faiirCheck } from "@/lib/assessment/faiir";

export const metadata: Metadata = {
  title: "FAIIR AI Self-Check · Av{ai}lable Law",
  description:
    "A 15-question check on your AI compliance posture, across the five FAIIR pillars: Fitness for purpose, Accountability, Integrity of data, Informed use, Risk management.",
};

export default function FaiirCheckPage() {
  return (
    <>
      <Header />
      <main>
        <AssessmentRunner definition={faiirCheck} context="page" />
      </main>
      <Footer />
    </>
  );
}
