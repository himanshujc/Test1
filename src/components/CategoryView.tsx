
"use client";

import { Category } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Utensils, Bus, Film, ShoppingBag, HeartPulse, Zap, LayoutGrid, Plus,
  Car, Home, Coffee, GraduationCap, Plane, Gift, Wallet, Phone, Dumbbell,
  Edit2, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryViewProps {
  categories: Category[];
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const IconMap: Record<string, any> = {
  Utensils, Bus, Film, ShoppingBag, HeartPulse, Zap, LayoutGrid,
  Car, Home, Coffee, GraduationCap, Plane, Gift, Wallet, Phone, Dumbbell
};

export function CategoryView({ categories, onAdd, onEdit, onDelete }: CategoryViewProps) {
  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-headline text-foreground">Categories</h2>
          <p className="text-sm text-muted-foreground">Manage your spending buckets</p>
        </div>
        <Button onClick={onAdd} size="icon" className="rounded-full h-12 w-12 shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => {
          const IconComp = IconMap[cat.icon] || LayoutGrid;
          return (
            <Card key={cat.id} className="border-none shadow-sm card-hover relative group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  <IconComp className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-sm font-headline truncate w-full mb-2">{cat.name}</h4>
                
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(cat);
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete the "${cat.name}" category? Expenses in this category will still exist but might lose their folder assignment.`)) {
                        onDelete(cat.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
