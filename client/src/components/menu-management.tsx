import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Utensils, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Dish, InsertDish, DishCategory } from "@shared/schema";
import { useAppSettings } from "@/hooks/use-app-settings";

export default function MenuManagement() {
  const settings = useAppSettings();
  const DISH_CATEGORIES = settings.dishCategories;
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishCategory, setDishCategory] = useState<DishCategory>(Object.keys(settings.dishCategories)[0] || "primi");
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dishes = [], isLoading } = useQuery<Dish[]>({
    queryKey: ["/api/dishes"],
  });

  const addDishMutation = useMutation({
    mutationFn: async (dish: InsertDish) => {
      const response = await apiRequest("POST", "/api/dishes", dish);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Piatto aggiunto",
        description: "Il piatto è stato aggiunto al menù",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/dishes"] });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiunta del piatto",
        variant: "destructive",
      });
    },
  });

  const updateDishMutation = useMutation({
    mutationFn: async ({ id, dish }: { id: string; dish: Partial<InsertDish> }) => {
      const response = await apiRequest("PUT", `/api/dishes/${id}`, dish);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Piatto aggiornato",
        description: "Il piatto è stato aggiornato con successo",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/dishes"] });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento del piatto",
        variant: "destructive",
      });
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/dishes/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Piatto eliminato",
        description: "Il piatto è stato rimosso dal menù",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dishes"] });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'eliminazione del piatto",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setDishName("");
    setDishPrice("");
    setDishCategory("primi");
    setEditingDish(null);
  };

  const startEdit = (dish: Dish) => {
    setEditingDish(dish);
    setDishName(dish.name);
    setDishPrice(dish.price);
    setDishCategory(dish.category as DishCategory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dishName || !dishPrice) {
      toast({
        title: "Campi mancanti",
        description: "Compila tutti i campi",
        variant: "destructive",
      });
      return;
    }

    const dishData: InsertDish = {
      name: dishName,
      price: parseFloat(dishPrice).toFixed(2),
      category: dishCategory,
    };

    if (editingDish) {
      updateDishMutation.mutate({ id: editingDish.id, dish: dishData });
    } else {
      addDishMutation.mutate(dishData);
    }
  };



  if (isLoading) {
    return (
      <div className="text-center py-8">
        Caricamento menù...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add Dish Form */}
      <Card className="bg-white rounded-xl shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="text-primary mr-3" />
            {editingDish ? "Modifica Piatto" : "Aggiungi Piatto"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="dishName">Nome Piatto</Label>
              <Input
                id="dishName"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="Es. Spaghetti al pomodoro"
              />
            </div>

            <div>
              <Label htmlFor="dishPrice">Prezzo di Vendita ({settings.currencySymbol})</Label>
              <Input
                id="dishPrice"
                type="number"
                step="0.01"
                value={dishPrice}
                onChange={(e) => setDishPrice(e.target.value)}
                placeholder="12.50"
              />
            </div>

            <div>
              <Label htmlFor="dishCategory">Categoria</Label>
              <Select value={dishCategory} onValueChange={(value: DishCategory) => setDishCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DISH_CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>



            <div className="flex space-x-2">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-blue-700 text-white"
                disabled={addDishMutation.isPending || updateDishMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingDish ? "Aggiorna" : "Aggiungi al Menù"}
              </Button>
              {editingDish && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Annulla
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Menu List */}
      <div className="lg:col-span-2">
        <Card className="bg-white rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="text-primary mr-3" />
              Menù Attuale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Piatto</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Categoria</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700">Prezzo</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {dishes
                    .sort((a, b) => {
                      const categoryOrder = Object.keys(DISH_CATEGORIES);
                      const categoryAIndex = categoryOrder.indexOf(a.category);
                      const categoryBIndex = categoryOrder.indexOf(b.category);
                      if (categoryAIndex !== categoryBIndex) {
                        return categoryAIndex - categoryBIndex;
                      }
                      return a.name.localeCompare(b.name);
                    })
                    .map((dish) => {
                      const price = parseFloat(dish.price);

                      return (
                        <tr
                          key={dish.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-2 font-medium">{dish.name}</td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                              {DISH_CATEGORIES[dish.category as DishCategory] || dish.category}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right text-secondary font-semibold">
                            {settings.currencySymbol}{price.toFixed(2)}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-primary hover:text-blue-700 mr-2"
                              onClick={() => startEdit(dish)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-red-700"
                              onClick={() => deleteDishMutation.mutate(dish.id)}
                              disabled={deleteDishMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {dishes.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Nessun piatto nel menù
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
