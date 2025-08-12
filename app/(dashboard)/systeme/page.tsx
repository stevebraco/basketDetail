import SystemList from "@/components/system/SystemList";
import TacticBoard from "@/components/TacticsBoard";

export default function SystemPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <SystemList title="Liste des Système" />
      </div>
      <TacticBoard />
    </div>
  );
}
