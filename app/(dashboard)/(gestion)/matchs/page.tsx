import { TeamForm } from "@/components/forms/TeamForm";
import { TeamTable } from "@/components/gestions/TeamTable";
import { prisma } from "@/lib/prisma";

export default async function Equipes() {
  const matchs = await prisma.match.findMany();
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      MATCHS
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <TeamTable matchs={matchs} />
      </div>
      <div className="col-span-12 xl:col-span-5"></div>
    </div>
  );
}
