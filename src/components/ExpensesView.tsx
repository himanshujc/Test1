
"use client";

import { Expense, Category } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit2, ShoppingBag, Utensils, Bus, Film, HeartPulse, Zap, LayoutGrid, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExpensesViewProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const IconMap: Record<string, any> = {
  Utensils, Bus, Film, ShoppingBag, HeartPulse, Zap, LayoutGrid
};

export function ExpensesView({ expenses, categories, onDelete, onEdit }: ExpensesViewProps) {
  const getCategory = (id: string) => categories.find(c => c.id === id) || categories[categories.length - 1];

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by month
  const groupedExpenses: Record<string, Expense[]> = {};
  sortedExpenses.forEach(e => {
    const month = new Date(e.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    if (!groupedExpenses[month]) groupedExpenses[month] = [];
    groupedExpenses[month].push(e);
  });

  return (
    <div className="pb-32 pt-4">
      {Object.entries(groupedExpenses).map(([month, items]) => (
        <div key={month} className="mb-8">
          <div className="px-6 mb-3">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider font-headline">{month}</h3>
          </div>
          <div className="space-y-3 px-4">
            {items.map((expense) => {
              const cat = getCategory(expense.categoryId);
              const IconComp = IconMap[cat.icon] || LayoutGrid;
              return (
                <Card key={expense.id} className="border-none shadow-sm card-hover overflow-hidden">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-semibold text-base truncate font-headline">{expense.description || cat.name}</h4>
                        <span className="font-bold text-base text-foreground font-headline">
                          ${expense.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-normal text-[10px] px-1.5 py-0 h-4 border-muted-foreground/20 text-muted-foreground">
                            {cat.name}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => onEdit(expense)}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(expense.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      
      {expenses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center text-muted-foreground">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <LayoutGrid className="w-10 h-10 opacity-20" />
          </div>
          <h3 className="font-headline font-semibold text-lg mb-2">No expenses yet</h3>
          <p className="text-sm">Tap the '+' button to start tracking your spending habits!</p>
        </div>
      )}
    </div>
  );
}
