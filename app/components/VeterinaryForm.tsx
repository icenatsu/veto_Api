"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { VeterinaryFormSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { env } from "@lib/env";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Veterinaries, Veterinary } from "../../utils/schema";

type VeterinaryFormProps = {
  defaultValues?: Veterinary;
  onClose?: () => void;
};

const VeterinaryForm = forwardRef<HTMLDivElement, VeterinaryFormProps>(
  ({ defaultValues, onClose }, ref) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    console.log(onClose);

    const form = useForm<z.infer<typeof VeterinaryFormSchema>>({
      resolver: zodResolver(VeterinaryFormSchema),
      mode: "onBlur",
      defaultValues: {
        clinicName: defaultValues ? defaultValues.nom : "",
        phone: defaultValues ? defaultValues.telephone : "",
        streetName: defaultValues ? defaultValues.adresse : "",
        postalCode: defaultValues ? defaultValues.ville.codePostal : "",
        city: defaultValues ? defaultValues.ville.nom : "",
        openingHours: defaultValues ? defaultValues.horaires : "",
        website: defaultValues
          ? defaultValues.website
            ? defaultValues.website
            : ""
          : "",
        latitude: defaultValues ? defaultValues.latitude : "",
        longitude: defaultValues ? defaultValues.longitude : "",
        isOpen24Hours: defaultValues ? defaultValues.isOpen24Hours : false,
      },
    });

    const { trigger } = form;

    const handleVeterinarySubmission = async (
      data: z.infer<typeof VeterinaryFormSchema>
    ) => {
      try {
        const response = await fetch(
          defaultValues
            ? `${env.NEXT_PUBLIC_API_URL}/api/veterinaries/${defaultValues.id}`
            : `${env.NEXT_PUBLIC_API_URL}/api/veterinaries`,
          {
            method: defaultValues ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        }

        return response.json();
      } catch (error: any) {
        toast.error(
          error.message ||
            "Une erreur est survenue lors de l'envoi du formulaire."
        );
        throw error;
      }
    };

    const handleSubmitMutation = useMutation({
      mutationFn: handleVeterinarySubmission,
      onSuccess: async (response) => {
        const data = response;

        if (defaultValues && defaultValues.id) {
          queryClient.setQueryData(
            ["veterinary", defaultValues.id],
            (oldData: Veterinary) => {
              if (!oldData) {
                console.error("Aucune donnée trouvée pour cet ID");
                return data; // Retourne les nouvelles données si aucune ancienne donnée n'existe
              }

              const updatedVeterinary = {
                ...oldData,
                ...data,
              };

              return updatedVeterinary;
            }
          );

          await queryClient.invalidateQueries({
            queryKey: ["veterinary", defaultValues.id],
          });

          await queryClient.invalidateQueries({
            queryKey: ["veterinaries"],
          });

          router.push(`/veterinaries/${defaultValues.id}`);
          toast.success("Les coordonnées ont été mises à jour.");
        } else {
          queryClient.setQueryData(
            ["veterinaries"],
            (oldData: Veterinaries | undefined) => {
              const newVeterinaries = oldData ? [...oldData, data] : [data];
              return newVeterinaries;
            }
          );

          queryClient.invalidateQueries({
            queryKey: ["veterinaries"],
          });

          router.push(`/veterinaries/`);
          toast.success("La clinique vétérinaire a bien été ajoutée.");
        }

        if (onClose) {
          onClose();
        }
      },
      onError: (error: any) => {
        console.log(error.message);

        toast.error("Une erreur est survenue, veuillez reessayer plus tard");
      },
    });

    function capitalizeFirstLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    async function onSubmit(data: z.infer<typeof VeterinaryFormSchema>) {
      data.city = capitalizeFirstLetter(data.city);
      await handleSubmitMutation.mutateAsync(data);
    }

    return (
      <Card className="w-full p-4 xl:w-1/2" ref={ref}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row md:gap-5"
          >
            <fieldset className="flex-1 space-y-4">
              <FormField
                control={form.control}
                name="clinicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la Clinique</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Clinique vétérinaire Le Merlan"
                        {...field}
                        onBlur={() => trigger("clinicName")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Numéro de téléphone"
                        {...field}
                        onBlur={() => trigger("phone")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="streetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la rue</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom de la rue"
                        {...field}
                        onBlur={() => trigger("streetName")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Postal</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Code postal"
                        {...field}
                        onBlur={() => trigger("postalCode")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ville"
                        {...field}
                        onBlur={() => trigger("city")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <fieldset className="flex-1 space-y-4">
              <FormField
                control={form.control}
                name="openingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horaires</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Exemple : Lundi : 9h - 18h&#10;Mardi : 9h - 18h"
                        {...field}
                        onBlur={() => trigger("openingHours")}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Web</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://votre-clinique.com"
                        {...field}
                        onBlur={() => trigger("website")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="43.34957380625404"
                        {...field}
                        onBlur={() => trigger("latitude")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="5.429961699288883"
                        {...field}
                        onBlur={() => trigger("longitude")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isOpen24Hours"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl className="mt-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Clinique ouverte 24h/24</FormLabel>
                  </FormItem>
                )}
              />
              <Button type="submit">
                {defaultValues ? "Mettre à jour" : "Envoyer"}
              </Button>
            </fieldset>
          </form>
        </Form>
      </Card>
    );
  }
);

VeterinaryForm.displayName = "VeterinaryForm";

export default VeterinaryForm;
