import { CreatePlayerForm } from "@/components/forms/CreatePlayerForm";
import React from "react";

export default function addPlayerPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <CreatePlayerForm />
      </div>
    </div>
  );
}
