import React from "react";
import RadarChart from "./RadarChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "./ui/card";
import ZoneStats from "./ZoneStats";
import BasketballCourtSVG from "./BasketballCourtSVG";
import AllShots from "./AllShots";

export default function PlayerStatsDetails({ playerDetail, playerTirs }: any) {
  console.log("playerTirs", playerTirs);
  return (
    <Card className="overflow-x-auto">
      <div className="min-w-[300px]">
        <Tabs defaultValue="competences" className="w-full bg-[#1B1E2B]">
          <TabsList>
            <TabsTrigger value="competences">Compétences</TabsTrigger>
            <TabsTrigger value="stats_par_zone">Stats par zone</TabsTrigger>
            <TabsTrigger value="tirs_par_zone">Tirs par zone</TabsTrigger>
          </TabsList>
          <TabsContent value="competences">
            <RadarChart competences={playerDetail.competences} />
          </TabsContent>
          <TabsContent value="stats_par_zone">
            <ZoneStats playerTirs={playerTirs} />
          </TabsContent>
          <TabsContent value="tirs_par_zone">
            {/* <BasketballCourtSVG /> */}
            <AllShots playerTirs={playerTirs} />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
