import { CreateMatchForm } from "@/components/forms/CreateMatchForm";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function AddMatchPage() {
  const players = await prisma.player.findMany();
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <CreateMatchForm players={players} />
      </div>
    </div>
  );
}
