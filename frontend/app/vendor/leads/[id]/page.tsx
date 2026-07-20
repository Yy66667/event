"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VendorLeadDetailsPage() {
  const { id } = useParams();

  const [lead, setLead] = useState<any>(null);

  useEffect(() => {
    loadLead();
  }, []);

  async function loadLead() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vendor/leads/${id}`
    );

    const data = await res.json();

    setLead(data);
  }

  if (!lead) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        {lead.event_summary?.event_type}
      </h1>

      <div className="space-y-4 border rounded-xl p-6">

        <p><strong>City:</strong> {lead.event_summary?.city}</p>

        <p><strong>Date:</strong> {lead.event_summary?.event_date}</p>

        <p><strong>Guests:</strong> {lead.event_summary?.guest_count}</p>

        <p><strong>Budget:</strong> {lead.event_summary?.budget}</p>

        <p><strong>Theme:</strong> {lead.event_summary?.theme}</p>

        <hr />

        <h2 className="text-2xl font-semibold">
          Lead Price
        </h2>

        <p className="text-3xl font-bold text-green-600">
          ₹ {lead.lead_price}
        </p>

        <button
          className="mt-6 w-full bg-black text-white py-3 rounded-lg"
        >
          Acquire Lead
        </button>

      </div>
    </div>
  );
}