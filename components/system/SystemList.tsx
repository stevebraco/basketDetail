"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type System = {
  id: number;
  name: string;
  type: string;
  description: string;
  players: string;
  createdAt: string;
  data?: {
    time: number;
    players: { x: number; y: number }[];
    ball: { x: number; y: number };
    comment: string;
  };
};

const systems = [
  {
    id: 1,
    name: "Pick & Roll A",
    type: "Offensif",
    description: "Classique 1-5",
    players: "1, 5",
    data: [
      {
        time: 1745004451259,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 400, y: 250 },
        comment: "",
      },
      {
        time: 1745004458309,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 103, y: 116 },
        comment: "",
      },
      {
        time: 1745004460555,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 174, y: 116 },
        comment: "",
      },
      {
        time: 1745004463036,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 262, y: 104 },
        comment: "",
      },
      {
        time: 1745004465228,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 335, y: 105 },
        comment: "",
      },
      {
        time: 1745004468965,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 407, y: 106 },
        comment: "",
      },
      {
        time: 1745004469148,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 407, y: 106 },
        comment: "",
      },
    ],
    createdAt: "14/04/2025",
  },
  {
    id: 2,
    name: "Zone Press",
    type: "Défensif",
    description: "Pression tout terrain",
    players: "Tous",
    createdAt: "12/03/2025",
    data: [
      {
        time: 1745004451259,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 400, y: 250 },
        comment: "",
      },
      {
        time: 1745004458309,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 103, y: 116 },
        comment: "",
      },
      {
        time: 1745004460555,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 174, y: 116 },
        comment: "",
      },
      {
        time: 1745004463036,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 262, y: 104 },
        comment: "",
      },
      {
        time: 1745004465228,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 335, y: 105 },
        comment: "",
      },
      {
        time: 1745004468965,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 407, y: 106 },
        comment: "",
      },
      {
        time: 1745004469148,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 407, y: 106 },
        comment: "",
      },
    ],
  },
  {
    id: 3,
    name: "Remise rapide",
    type: "Remise",
    description: "Sortie de zone rapide",
    players: "1, 2, 3",
    createdAt: "20/01/2025",
    data: [
      {
        time: 1745004451259,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 400, y: 250 },
        comment: "",
      },
      {
        time: 1745004458309,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 103, y: 116 },
        comment: "",
      },
      {
        time: 1745004460555,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 174, y: 116 },
        comment: "",
      },
      {
        time: 1745004463036,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 262, y: 104 },
        comment: "",
      },
      {
        time: 1745004465228,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 335, y: 105 },
        comment: "",
      },
      {
        time: 1745004468965,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 407, y: 106 },
        comment: "",
      },
      {
        time: 1745004469148,
        players: [
          { x: 100, y: 100 },
          { x: 180, y: 100 },
          { x: 260, y: 100 },
          { x: 340, y: 100 },
          { x: 420, y: 100 },
        ],
        ball: { x: 407, y: 106 },
        comment: "",
      },
    ],
  },
  {
    id: 4,
    name: "Système exemple",
    type: "Offensif",
    description: "Configuration avec balle à l’aile",
    players: "1, 2, 3, 4, 5",
    createdAt: "18/04/2025",
    data: {
      time: 1744977261503,
      players: [
        { x: 280, y: 235 },
        { x: 191, y: 95 },
        { x: 260, y: 358 },
        { x: 88, y: 310 },
        { x: 45, y: 174 },
      ],
      ball: { x: 66, y: 174 },
      comment: "",
    },
  },
];

export default function SystemList({ title }: { title: string }) {
  return (
    <Card className="">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Joueurs</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {systems.map((system) => (
              <TableRow key={system.id}>
                <TableCell>{system.name}</TableCell>
                <TableCell>{system.type}</TableCell>
                <TableCell>{system.description}</TableCell>
                <TableCell>{system.players}</TableCell>
                <TableCell>{system.createdAt}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    Éditer
                  </Button>
                  <Button variant="destructive" size="sm">
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
