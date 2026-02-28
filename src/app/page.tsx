
"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/use-expenses";
import { DashboardView } from "@/components/DashboardView";
import { ExpensesView } from "@/components/ExpensesView";
import { CategoryView } from "@/components/CategoryView";
import { ExpenseDialog } from "@/components/ExpenseDialog";
import { CategoryDialog } from "@/components/CategoryDialog";
import { AdBanner } from "@/components/AdBanner";
import { LayoutGrid, PieChart, Plus, ReceiptText, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Expense, Category, SUPPORTED_CURRENCIES } from "@/lib/types";

export default function SpendWiseApp() {
  const { 
    expenses, 
    categories, 
    currency,
    setCurrency,
    addExpense, 
    updateExpense, 
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    isLoaded 
  } = useExpenses();

  const [activeTab, setActiveTab] = useState<"dashboard" | "expenses" | "categories" | "settings">("dashboard");
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-primary font-headline font-bold text-2xl">SpendWise</div>
    </div>
  );

  const handleEditExpenseClick = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseDialogOpen(true);
  };

  const handleAddExpenseClick = () => {
    setEditingExpense(undefined);
    setExpenseDialogOpen(true);
  };

  const handleExpenseSubmit = (data: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
  };

  const handleCategorySubmit = (data: Omit<Category, 'id'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
    } else {
      addCategory(data);
    }
    setEditingCategory(undefined);
  };

  const handleEditCategoryClick = (category: Category) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleAddCategoryClick = () => {
    setEditingCategory(undefined);
    setCategoryDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative shadow-2xl">
      {/* Header */}
      <header className="p-6 pb-2 pt-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-headline tracking-tight text-primary">SpendWise</h1>
          <p className="text-sm text-muted-foreground font-medium">Tracking your wealth</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-accent animate-pulse" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <AdBanner />
        
        {activeTab === "dashboard" && (
          <DashboardView expenses={expenses} categories={categories} currency={currency} />
        )}
        {activeTab === "expenses" && (
          <ExpensesView 
            expenses={expenses} 
            categories={categories} 
            currency={currency}
            onDelete={deleteExpense}
            onEdit={handleEditExpenseClick}
          />
        )}
        {activeTab === "categories" && (
          <CategoryView 
            categories={categories} 
            onAdd={handleAddCategoryClick}
            onEdit={handleEditCategoryClick}
            onDelete={deleteCategory}
          />
        )}
        {activeTab === "settings" && (
          <div className="p-10 text-center space-y-6">
             <Settings2 className="w-16 h-16 mx-auto opacity-20" />
             <h2 className="text-xl font-headline font-bold">App Settings</h2>
             
             <div className="text-left space-y-2">
                <Label>Default Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <SelectItem key={c.symbol} value={c.symbol}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>

             <div className="space-y-3">
               <Button variant="outline" className="w-full">Export Data (CSV)</Button>
               <Button 
                variant="outline" 
                className="w-full text-destructive hover:bg-destructive/5"
                onClick={() => {
                  if (confirm("Are you sure? This will erase all local data.")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                Reset All Data
              </Button>
             </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="absolute bottom-24 right-6 z-50">
        <Button 
          size="icon" 
          className="w-14 h-14 rounded-full shadow-2xl scale-110 active:scale-95 transition-transform bg-primary"
          onClick={handleAddExpenseClick}
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t h-20 flex items-center justify-around px-2 mobile-nav-shadow max-w-md mx-auto z-40">
        <NavButton 
          active={activeTab === "dashboard"} 
          onClick={() => setActiveTab("dashboard")}
          icon={<PieChart className="w-6 h-6" />}
          label="Overview"
        />
        <NavButton 
          active={activeTab === "expenses"} 
          onClick={() => setActiveTab("expenses")}
          icon={<ReceiptText className="w-6 h-6" />}
          label="Expenses"
        />
        <div className="w-14" /> {/* Spacer for FAB */}
        <NavButton 
          active={activeTab === "categories"} 
          onClick={() => setActiveTab("categories")}
          icon={<LayoutGrid className="w-6 h-6" />}
          label="Folders"
        />
        <NavButton 
          active={activeTab === "settings"} 
          onClick={() => setActiveTab("settings")}
          icon={<Settings2 className="w-6 h-6" />}
          label="Settings"
        />
      </nav>

      <ExpenseDialog 
        open={expenseDialogOpen} 
        onOpenChange={setExpenseDialogOpen} 
        onSubmit={handleExpenseSubmit}
        categories={categories}
        currency={currency}
        initialExpense={editingExpense}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onSubmit={handleCategorySubmit}
        initialCategory={editingCategory}
      />
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-xl transition-all",
        active ? "bg-primary/10" : "bg-transparent"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
