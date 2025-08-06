import { TeamForm } from "@/components/forms/TeamForm";
import { TeamTable } from "@/components/gestions/TeamTable";

export default function Equipes() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <TeamTable />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <TeamForm />
      </div>
    </div>
  );
}
