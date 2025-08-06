"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { optionsPoste, optionsRole } from "@/data/players";

// Schema de validation
const formSchema = z.object({
  name: z.string().min(2),
  lastName: z.string().min(2),
  poste: z.string().min(3),
  age: z.string().min(1),
  taille: z.string().min(1),
  poids: z.string().min(1),
  role: z.string().min(1),
  equipe: z.string().optional(),
  remarque: z.string().optional(),

  // Compétences
  tir_2pts: z.number().min(0).max(10),
  tir_3pts: z.number().min(0).max(10),
  lancers_francs: z.number().min(0).max(10),
  creation_tir: z.number().min(0).max(10),

  lecture_jeu: z.number().min(0).max(10),
  vision_jeu: z.number().min(0).max(10),
  prise_decision: z.number().min(0).max(10),
  leadership: z.number().min(0).max(10),

  vitesse: z.number().min(0).max(10),
  agilite: z.number().min(0).max(10),
  puissance: z.number().min(0).max(10),
  endurance: z.number().min(0).max(10),
  saut_vertical: z.number().min(0).max(10),

  defense_1v1: z.number().min(0).max(10),
  defense_collective: z.number().min(0).max(10),
  anticipation: z.number().min(0).max(10),
  contre: z.number().min(0).max(10),

  dribble: z.number().min(0).max(10),
  finition: z.number().min(0).max(10),
  jeu_sans_ballon: z.number().min(0).max(10),
  footwork: z.number().min(0).max(10),
  passe: z.number().min(0).max(10),

  travail: z.number().min(0).max(10),
  potentiel: z.number().min(0).max(10),
  concentration: z.number().min(0).max(10),
  resilience: z.number().min(0).max(10),
});

type FormData = z.infer<typeof formSchema>;

function SliderField({ name, label }: { name: keyof FormData; label: string }) {
  const { control, watch } = useFormContext<FormData>();
  const value = watch(name) || 0;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange } }) => (
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[value || 0]}
                    onValueChange={(val) => onChange(val[0])}
                    className="flex-grow"
                  />
                )}
              />
              <span className="w-6 text-right">{value}</span>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function CreatePlayerForm() {
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      poste: "",
      age: "",
      taille: "",
      poids: "",
      role: "",
      equipe: "Aucune",
      remarque: "",

      tir_2pts: 5,
      tir_3pts: 5,
      lancers_francs: 5,
      creation_tir: 5,

      lecture_jeu: 5,
      vision_jeu: 5,
      prise_decision: 5,
      leadership: 5,

      vitesse: 5,
      agilite: 5,
      puissance: 5,
      endurance: 5,
      saut_vertical: 5,

      defense_1v1: 5,
      defense_collective: 5,
      anticipation: 5,
      contre: 5,

      dribble: 5,
      finition: 5,
      jeu_sans_ballon: 5,
      footwork: 5,
      passe: 5,

      travail: 5,
      potentiel: 5,
      concentration: 5,
      resilience: 5,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Joueur :", data);
  };

  return (
    <div className="min-h-screen bg-[#121424] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-6xl bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            Ajouter un joueur
          </CardTitle>
          <CardDescription className="text-sm text-white/60">
            Remplissez les informations du joueur, y compris ses statistiques.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormProvider {...methods}>
            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* === Infos de base === */}
                <FormField
                  control={methods.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Steve" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Braco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="poste"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poste</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un poste" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {optionsPoste.map((option) => (
                            <SelectItem key={option.id} value={option.poste}>
                              {option.id} - {option.poste}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Âge</FormLabel>
                      <FormControl>
                        <Input placeholder="34" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="taille"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taille</FormLabel>
                      <FormControl>
                        <Input placeholder="1m83" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="poids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poids</FormLabel>
                      <FormControl>
                        <Input placeholder="73kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* === Sliders === */}
                <div className="pt-4 border-t border-white/10 space-y-6">
                  {/* 🔫 Tir */}
                  <h3 className="text-lg font-semibold text-white">🔫 Tir</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SliderField
                      name="tir_2pts"
                      label="Tir à mi-distance (2 pts)"
                    />
                    <SliderField name="tir_3pts" label="Tir à 3 points" />
                    <SliderField name="lancers_francs" label="Lancers francs" />
                    <SliderField name="creation_tir" label="Création de tir" />
                  </div>

                  {/* 🧠 Q.I. Basket */}
                  <h3 className="text-lg font-semibold text-white">
                    🧠 Q.I. Basket
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SliderField name="lecture_jeu" label="Lecture du jeu" />
                    <SliderField name="vision_jeu" label="Vision de jeu" />
                    <SliderField
                      name="prise_decision"
                      label="Prise de décision"
                    />
                    <SliderField name="leadership" label="Leadership" />
                  </div>

                  {/* 💪 Physique */}
                  <h3 className="text-lg font-semibold text-white">
                    💪 Physique
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SliderField name="vitesse" label="Vitesse" />
                    <SliderField name="agilite" label="Agilité" />
                    <SliderField name="puissance" label="Puissance" />
                    <SliderField name="endurance" label="Endurance" />
                    <SliderField name="saut_vertical" label="Saut vertical" />
                  </div>

                  {/* 🛡️ Défense */}
                  <h3 className="text-lg font-semibold text-white">
                    🛡️ Défense
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SliderField name="defense_1v1" label="Défense 1v1" />
                    <SliderField
                      name="defense_collective"
                      label="Défense collective"
                    />
                    <SliderField
                      name="anticipation"
                      label="Anticipation / Interceptions"
                    />
                    <SliderField name="contre" label="Contre" />
                  </div>

                  {/* ✋ Techniques individuelles */}
                  <h3 className="text-lg font-semibold text-white">
                    ✋ Techniques individuelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SliderField name="dribble" label="Dribble / Handle" />
                    <SliderField
                      name="finition"
                      label="Finition proche du panier"
                    />
                    <SliderField
                      name="jeu_sans_ballon"
                      label="Jeu sans ballon"
                    />
                    <SliderField
                      name="footwork"
                      label="Pied de pivot / footwork"
                    />
                    <SliderField name="passe" label="Passe" />
                  </div>

                  {/* 🚀 Mentalité / Potentiel */}
                  <h3 className="text-lg font-semibold text-white">
                    🚀 Mentalité / Potentiel
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SliderField name="travail" label="Travail / Éthique" />
                    <SliderField name="potentiel" label="Potentiel" />
                    <SliderField name="concentration" label="Concentration" />
                    <SliderField name="resilience" label="Résilience" />
                  </div>
                </div>

                <FormField
                  control={methods.control}
                  name="remarque"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarque</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ajoutez des remarques si nécessaire."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </FormProvider>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            Ajouter le joueur
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
