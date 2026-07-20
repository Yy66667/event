import type { Metadata } from "next";
import PartnerApplication from "./PartnerApplicationV2";

export const metadata: Metadata = {
  title: "Become a Partner",
  description: "Join SAMBARAM's carefully curated network of premium event and photography partners.",
};

export default function BecomeAPartnerPage() {
  return <PartnerApplication />;
}
