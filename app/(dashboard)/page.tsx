import BasketballCourtSVG from "@/components/BasketballCourtSVG";
import TacticBoard from "@/components/TacticsBoard";
import { prisma } from "@/lib/prisma";

export default function Test() {
  return (
    <div>
      <BasketballCourtSVG />
      <TacticBoard />
    </div>
  );
}
