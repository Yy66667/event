import { Suspense } from "react";
import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio · Weddings, Milestones & Cultural Celebrations",
  description:
    "Explore SAMBARAM's portfolio — weddings, birthdays, engagements, corporate events, housewarming and private parties across India.",
};

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PortfolioClient />
    </Suspense>
  );
}
