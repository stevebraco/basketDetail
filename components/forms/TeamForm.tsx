"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Input from "../input/Input";
import { Textarea } from "../input/TextArea";

// 👉 Schéma Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom de l'équipe est requis." }),
  category: z.string().nonempty({ message: "La catégorie est requise." }),
  coach: z.string().optional(),
  season: z.string(),
  notes: z.string().optional(),
});

// 👉 Type inféré pour plus de clarté
type TeamFormValues = z.infer<typeof formSchema>;

export function TeamForm() {
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      coach: "",
      season: "2024-2025",
      notes: "",
    },
  });

  function onSubmit(values: TeamFormValues) {
    console.log("✅ Équipe créée :", values);
    // Ici tu peux appeler ton backend ou afficher une notif de succès
  }

  return (
    <div className="max-w-full p-6 bg-white rounded-xl shadow">
      {/* <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow"> */}
      <h2 className="text-xl font-semibold mb-6">Créer une nouvelle équipe</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom de l’équipe */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l’équipe</FormLabel>
                <FormControl>
                  <Input placeholder="Ex : U15 Garçons A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Catégorie */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="U11">U11</SelectItem>
                    <SelectItem value="U13">U13</SelectItem>
                    <SelectItem value="U15">U15</SelectItem>
                    <SelectItem value="U17">U17</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Loisir">Loisir</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Coach */}
          <FormField
            control={form.control}
            name="coach"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coach principal</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du coach (optionnel)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Saison */}
          <FormField
            control={form.control}
            name="season"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Saison</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormDescription>Détecté automatiquement.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Commentaires internes, objectifs de saison…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Créer l’équipe
          </Button>
        </form>
      </Form>
    </div>
  );
}
