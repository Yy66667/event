import type { Metadata } from "next";
import PlannerClient from "./PlannerClient";

export const metadata: Metadata = {
  title: "Event Planner · AI-Guided Studio Experience",
  description:
    "Plan your event with SAMBARAM — a beautiful multi-step planner guided by AI that suggests themes, budgets, timelines and recommended services.",
};

export default function PlannerPage() {
  return <PlannerClient />;
}
