
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/lib/types";
import { 
  Utensils, Bus, Film, ShoppingBag, HeartPulse, Zap, LayoutGrid, 
  Car, Home, Coffee, GraduationCap, Plane, Gift, Wallet, Phone, Dumbbell
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (category: Omit<Category, 'id'>) => void;
  initialCategory?: Category;
}

const AVAILABLE_ICONS = [
  { name: 'Utensils', icon: Utensils },
  { name: 'Bus', icon: Bus },
  { name: 'Car', icon: Car },
  { name: 'Home', icon: Home },
  { name: 'Coffee', icon: Coffee },
  { name: 'Film', icon: Film },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'HeartPulse', icon: HeartPulse },
  { name: 'Zap', icon: Zap },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Plane', icon: Plane },
  { name: 'Gift', icon: Gift },
  { name: 'Wallet', icon: Wallet },
  { name: 'Phone', icon: Phone },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'LayoutGrid', icon: LayoutGrid },
];

const PRESET_COLORS = [
  '#FF6B6B', '#4DABF7', '#9775FA', '#FCC419', '#51CF66', '#FF922B', 
  '#868E96', '#E64980', '#BE4BDB', '#228BE6', '#12B886', '#FAB005'
];

export function CategoryDialog({ open, onOpenChange, onSubmit, initialCategory }: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("LayoutGrid");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setSelectedIcon(initialCategory.icon);
      setSelectedColor(initialCategory.color);
    } else {
      setName("");
      setSelectedIcon("LayoutGrid");
      setSelectedColor(PRESET_COLORS[0]);
    }
  }, [initialCategory, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor
    });
    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialCategory ? 'Edit Category' : 'Add Custom Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Subscriptions" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Select Icon</Label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedIcon(item.name)}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-xl border-2 transition-all",
                      selectedIcon === item.name 
                        ? "border-primary bg-primary/10 text-primary scale-110" 
                        : "border-transparent bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Select Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-full aspect-square rounded-full border-2 transition-all",
                    selectedColor === color 
                      ? "border-white ring-2 ring-primary scale-110" 
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full h-12 text-lg font-headline">
              {initialCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
