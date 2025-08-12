"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const joueursMock = [
  { id: "1", nom: "James" },
  { id: "2", nom: "Kyrie" },
  { id: "3", nom: "LeBron" },
  { id: "4", nom: "Anthony" },
  { id: "5", nom: "Kevin" },
  { id: "6", nom: "Stephen" },
  { id: "7", nom: "Draymond" },
  { id: "8", nom: "Klay" },
  { id: "9", nom: "Russell" },
  { id: "10", nom: "Giannis" },
  { id: "11", nom: "Luka" },
  { id: "12", nom: "Joel" },
];

const matchSchema = z.object({
  nom: z.string().min(1, "Nom du match requis"),
  dateHeure: z.string().min(1, "Date et heure requises"),
  equipeLocale: z.string().min(1, "Équipe locale requise"),
  equipeAdverse: z.string().min(1, "Équipe adverse requise"),
  lieu: z.string().min(1, "Lieu requis"),
  duree: z.string().min(1, "Durée du match requise"),
  videoUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  joueurs: z
    .array(z.string())
    .min(1, "Sélectionnez au moins un joueur")
    .max(10, "Vous ne pouvez sélectionner que 10 joueurs au maximum"),
});

type MatchFormValues = z.infer<typeof matchSchema>;

export function CreateMatchForm() {
  const methods = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      nom: "",
      dateHeure: "",
      equipeLocale: "",
      equipeAdverse: "",
      lieu: "",
      duree: "",
      videoUrl: "",
      joueurs: [],
    },
  });

  function onSubmit(data: MatchFormValues) {
    console.log("Match data:", data);
    // Ici tu envoies les données au backend ou mets à jour le state parent
  }

  const { watch, setValue } = methods;
  const selectedJoueurs = watch("joueurs");

  // Gestion sélection checkbox, on empêche de dépasser 10 joueurs sélectionnés
  function handleToggleJoueur(id: string) {
    if (selectedJoueurs.includes(id)) {
      // Décocher : retirer id
      setValue(
        "joueurs",
        selectedJoueurs.filter((j) => j !== id),
        { shouldValidate: true }
      );
    } else {
      // Cocher : ajouter id si moins de 10 joueurs sélectionnés
      if (selectedJoueurs.length < 10) {
        setValue("joueurs", [...selectedJoueurs, id], { shouldValidate: true });
      }
    }
  }

  return (
    // <Card className="w-full max-w-4xl mx-auto">
    <Card>
      <CardHeader>
        <CardTitle className="text-white text-xl">Ajouter un match</CardTitle>
        <CardDescription className="text-sm text-white/60">
          Remplissez les informations générales du match.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormProvider {...methods}>
          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              {/* Nom du match */}
              <FormField
                control={methods.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du match</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Match 1, Finale régionale..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date et heure */}
              <FormField
                control={methods.control}
                name="dateHeure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date et heure</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Équipe locale */}
              <FormField
                control={methods.control}
                name="equipeLocale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Équipe locale</FormLabel>
                    <FormControl>
                      <Input placeholder="Équipe locale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Équipe adverse */}
              <FormField
                control={methods.control}
                name="equipeAdverse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Équipe adverse</FormLabel>
                    <FormControl>
                      <Input placeholder="Équipe adverse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lieu */}
              <FormField
                control={methods.control}
                name="lieu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu (stade / gymnase)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Stade Municipal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Durée */}
              <FormField
                control={methods.control}
                name="duree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée du match</FormLabel>
                    <FormControl>
                      <Input placeholder="48 minutes, 4x12min..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Vidéo / lien */}
              <FormField
                control={methods.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vidéo ou lien du match</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://exemple.com/video-match"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sélection joueurs */}
              <FormField
                control={methods.control}
                name="joueurs"
                render={() => (
                  <FormItem>
                    <FormLabel>Sélectionnez les joueurs (max 10)</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-auto border rounded p-2 bg-black/20">
                        {joueursMock.map(({ id, nom }) => (
                          <label
                            key={id}
                            className="flex items-center gap-2 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={selectedJoueurs.includes(id)}
                              onChange={() => handleToggleJoueur(id)}
                              disabled={
                                !selectedJoueurs.includes(id) &&
                                selectedJoueurs.length >= 10
                              }
                              className="w-4 h-4"
                            />
                            <span>{nom}</span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter>
                <Button type="submit" className="w-full">
                  Enregistrer le match
                </Button>
              </CardFooter>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
