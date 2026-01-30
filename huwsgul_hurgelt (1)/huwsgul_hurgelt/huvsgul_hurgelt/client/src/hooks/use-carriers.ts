import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateCarrierRequest, type UpdateCarrierRequest, type DeleteCarrierRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCarriers() {
  return useQuery({
    queryKey: [api.carriers.list.path],
    queryFn: async () => {
      const res = await fetch(api.carriers.list.path);
      if (!res.ok) throw new Error("Failed to fetch carriers");
      return api.carriers.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCarrier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateCarrierRequest) => {
      const validated = api.carriers.create.input.parse(data);
      const res = await fetch(api.carriers.create.path, {
        method: api.carriers.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.carriers.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create carrier");
      }
      return api.carriers.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.carriers.list.path] });
      toast({
        title: "Success!",
        description: "Your carrier profile has been created.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCarrier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateCarrierRequest) => {
      const validated = api.carriers.update.input.parse(updates);
      const url = buildUrl(api.carriers.update.path, { id });
      
      const res = await fetch(url, {
        method: api.carriers.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Incorrect PIN");
        if (res.status === 404) throw new Error("Carrier not found");
        throw new Error("Failed to update profile");
      }
      
      return api.carriers.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.carriers.list.path] });
      toast({
        title: "Updated",
        description: "Carrier profile updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCarrier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, pin }: { id: number } & DeleteCarrierRequest) => {
      const validated = api.carriers.delete.input.parse({ pin });
      const url = buildUrl(api.carriers.delete.path, { id });
      
      const res = await fetch(url, {
        method: api.carriers.delete.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Incorrect PIN");
        if (res.status === 404) throw new Error("Carrier not found");
        throw new Error("Failed to delete profile");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.carriers.list.path] });
      toast({
        title: "Deleted",
        description: "Carrier profile has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
