import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact · Book a Consultation",
  description:
    "Book a complimentary consultation with SAMBARAM Events. Call, WhatsApp, email, or request a callback.",
};

export default function ContactPage() {
  return <ContactClient />;
}
