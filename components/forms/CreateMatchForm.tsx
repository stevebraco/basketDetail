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
import { matchSchema } from "@/schema/validation";
import { createMatch } from "@/lib/actions/match.action";

type MatchFormValues = z.infer<typeof matchSchema>;

export function CreateMatchForm({ players }: { players: any }) {
  const methods = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      nom: "",
      versus: "",
      videoId: "",
      playerIds: [],
    },
  });

  async function onSubmit(data: MatchFormValues) {
    await createMatch(data);
  }

  const { watch, setValue } = methods;
  const selectedJoueurs = watch("playerIds");

  // Gestion sélection checkbox, on empêche de dépasser 10 joueurs sélectionnés
  function handleToggleJoueur(id: string) {
    if (selectedJoueurs.includes(id)) {
      // Décocher : retirer id
      setValue(
        "playerIds",
        selectedJoueurs.filter((j) => j !== id),
        { shouldValidate: true }
      );
    } else {
      // Cocher : ajouter id si moins de 10 joueurs sélectionnés
      if (selectedJoueurs.length < 10) {
        setValue("playerIds", [...selectedJoueurs, id], {
          shouldValidate: true,
        });
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

                {/* Équipe adverse */}
                <FormField
                  control={methods.control}
                  name="versus"
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

                {/* Vidéo / lien */}
                <FormField
                  control={methods.control}
                  name="videoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vidéo ou lien du match</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="playerIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>Sélectionnez les joueurs (max 10)</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-auto border rounded p-2 bg-black/20">
                          {players.map(({ id, nom, prenom }) => (
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
                              <span>
                                {prenom} {nom}
                              </span>
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
              </div>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
