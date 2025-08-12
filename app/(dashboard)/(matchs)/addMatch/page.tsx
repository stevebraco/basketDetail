import { CreateMatchForm } from "@/components/forms/CreateMatchForm";
import React from "react";

export default function AddMatchPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <CreateMatchForm />
      </div>
    </div>
  );
}
