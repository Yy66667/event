"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vendor/leads`
      );
    const data = await res.json();

    setLeads(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Available Leads
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead: any) => (
          <div
            key={lead.id}
            className="border rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold">
              {lead.event_summary?.event_type}
            </h2>

            <p className="mt-3">
              📍 {lead.event_summary?.city}
            </p>

            <p>
              👥 {lead.event_summary?.guest_count}
            </p>

            <p>
              📅 {lead.event_summary?.event_date}
            </p>

            <p className="text-green-600 font-bold mt-4">
              ₹ {lead.lead_price}
            </p>
<button
  onClick={() => {
    console.log("Clicked", lead.id);
    router.push(`/vendor/leads/${lead.id}`);
  }}
  className="mt-5 w-full bg-black text-white py-2 rounded-lg"
>
  View Lead
</button>
          </div>
        ))}
      </div>
    </div>
  );
}