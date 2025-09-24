import React from "react";
import RadarChart from "./RadarChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "./ui/card";
import ZoneStats from "./ZoneStats";
import BasketballCourtSVG from "./BasketballCourtSVG";

export default function PlayerStatsDetails({ playerDetail, playerTirs }: any) {
  return (
    <Card>
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
        </TabsContent>
      </Tabs>
    </Card>
  );
}
