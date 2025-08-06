"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { useState } from "react";

// Définition du schéma de validation Zod pour le match
const formSchema = z.object({
  date: z.string().min(1, { message: "La date est requise." }),
  team: z.string().min(1, { message: "L'équipe adverse est requise." }),
  location: z.string().min(1, { message: "Le lieu est requis." }),
  finalScore: z.string().min(1, { message: "Le score final est requis." }),
});

type MatchFormData = z.infer<typeof formSchema>;

type Match = {
  id: number;
  date: string;
  team: string;
  location: string;
  finalScore: string;
};

export function MatchForm() {
  const [matches, setMatches] = useState<Match[]>([]);

  const form = useForm<MatchFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      team: "",
      location: "",
      finalScore: "",
    },
  });

  const onSubmit = (data: MatchFormData) => {
    // Créer un nouvel objet match et l'ajouter à la liste des matchs
    setMatches((prevMatches: any) => [
      ...prevMatches,
      {
        id: prevMatches.length + 1,
        date: data.date,
        team: data.team,
        location: data.location,
        finalScore: data.finalScore,
      },
    ]);
    form.reset(); // Réinitialiser le formulaire après soumission
  };

  return (
    <div>
      {/* Formulaire de saisie de match */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="JJ/MM/AAAA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Équipe Adverse</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'équipe adverse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu</FormLabel>
                <FormControl>
                  <Input placeholder="Lieu du match" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finalScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score Final</FormLabel>
                <FormControl>
                  <Input placeholder="Score du match (ex: 80-70)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Ajouter Match</Button>
        </form>
      </Form>

      {/* Tableau des matchs */}
      <Table>
        <TableCaption>Liste des matchs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Équipe Adverse</TableCell>
            <TableCell>Lieu</TableCell>
            <TableCell>Score Final</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match: any) => (
            <TableRow key={match.id}>
              <TableCell>{match.date}</TableCell>
              <TableCell>{match.team}</TableCell>
              <TableCell>{match.location}</TableCell>
              <TableCell>{match.finalScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
