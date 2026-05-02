"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrdersTrackingForm() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = orderNumber.trim().toUpperCase();
    if (!normalized) return;
    router.push(`/orders/${encodeURIComponent(normalized)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        placeholder="ORD-XXXXXXXX"
      />
      <Button type="submit" className="w-full">
        <Search className="mr-2 h-4 w-4" />
        Voir ma commande
      </Button>
    </form>
  );
}
