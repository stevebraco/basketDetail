"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";

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
import { createPlayerSchema } from "@/schema/validation";
import { createPlayerValues } from "@/schema/defaultValues";
import { z } from "zod";
import { skillSections } from "@/data/skillSections";
import { createPlayer } from "@/lib/actions/player.action";

type FormData = z.infer<typeof createPlayerSchema>;

export function CreatePlayerForm() {
  const methods = useForm<FormData>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: { ...createPlayerValues },
  });

  async function onSubmit(data: any) {
    await createPlayer(data);
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-white text-xl">Ajouter un joueur</CardTitle>
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
              {skillSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {section.skills.map(({ name, label }, skillIndex) => {
                      const fieldName = name as keyof FormData;
                      return (
                        <FormField
                          key={skillIndex}
                          control={methods.control}
                          name={fieldName}
                          render={({ field }) => {
                            const value = methods.watch(fieldName) || 0;
                            return (
                              <FormItem className="mb-4">
                                <FormLabel>{label}</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-4">
                                    <Controller
                                      control={methods.control}
                                      name={fieldName}
                                      render={({
                                        field: { value, onChange },
                                      }) => (
                                        <Slider
                                          min={0}
                                          max={10}
                                          step={1}
                                          value={[Number(value) || 0]}
                                          onValueChange={(val) =>
                                            onChange(val[0])
                                          }
                                          className="flex-grow"
                                        />
                                      )}
                                    />
                                    <span className="w-6 text-right">
                                      {value}
                                    </span>
                                  </div>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

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
              <CardFooter>
                <Button type="submit" className="w-full">
                  Ajouter le joueur
                </Button>
              </CardFooter>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
