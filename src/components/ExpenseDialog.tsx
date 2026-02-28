
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expense, Category } from "@/lib/types";
import { aiCategorySuggestion } from "@/ai/flows/ai-category-suggestion-flow";
import { Sparkles, Loader2 } from "lucide-react";

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  categories: Category[];
  initialExpense?: Expense;
}

export function ExpenseDialog({ open, onOpenChange, onSubmit, categories, initialExpense }: ExpenseDialogProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (initialExpense) {
      setAmount(initialExpense.amount.toString());
      setDescription(initialExpense.description);
      setCategoryId(initialExpense.categoryId);
      setDate(initialExpense.date);
    } else {
      setAmount("");
      setDescription("");
      setCategoryId(categories[0]?.id || "");
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialExpense, open, categories]);

  const handleSuggestCategory = async () => {
    if (!description.trim()) return;
    setIsSuggesting(true);
    try {
      const result = await aiCategorySuggestion({
        expenseDescription: description,
        availableCategories: categories.map(c => c.name)
      });
      const matched = categories.find(c => c.name.toLowerCase() === result.suggestedCategory.toLowerCase());
      if (matched) {
        setCategoryId(matched.id);
      }
    } catch (error) {
      console.error("AI Suggestion error", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !date) return;
    onSubmit({
      amount: parseFloat(amount),
      description,
      categoryId,
      date
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input 
                id="amount" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="flex gap-2">
              <Input 
                id="description" 
                placeholder="What did you buy?" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => !initialExpense && description && handleSuggestCategory()}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="shrink-0"
                onClick={handleSuggestCategory}
                disabled={isSuggesting || !description}
              >
                {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-accent" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full h-12 text-lg font-headline">
              {initialExpense ? 'Save Changes' : 'Record Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
