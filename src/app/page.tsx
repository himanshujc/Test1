
"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/use-expenses";
import { DashboardView } from "@/components/DashboardView";
import { ExpensesView } from "@/components/ExpensesView";
import { CategoryView } from "@/components/CategoryView";
import { ExpenseDialog } from "@/components/ExpenseDialog";
import { AdBanner } from "@/components/AdBanner";
import { LayoutGrid, PieChart, Plus, ReceiptText, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Expense } from "@/lib/types";

export default function SpendWiseApp() {
  const { 
    expenses, 
    categories, 
    addExpense, 
    updateExpense, 
    deleteExpense,
    isLoaded 
  } = useExpenses();

  const [activeTab, setActiveTab] = useState<"dashboard" | "expenses" | "categories" | "settings">("dashboard");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-primary font-headline font-bold text-2xl">SpendWise</div>
    </div>
  );

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingExpense(undefined);
    setDialogOpen(true);
  };

  const handleSubmit = (data: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
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
          <DashboardView expenses={expenses} categories={categories} />
        )}
        {activeTab === "expenses" && (
          <ExpensesView 
            expenses={expenses} 
            categories={categories} 
            onDelete={deleteExpense}
            onEdit={handleEditClick}
          />
        )}
        {activeTab === "categories" && (
          <CategoryView 
            categories={categories} 
            onAdd={() => alert("Custom categories coming soon!")}
          />
        )}
        {activeTab === "settings" && (
          <div className="p-10 text-center space-y-4">
             <Settings2 className="w-16 h-16 mx-auto opacity-20" />
             <h2 className="text-xl font-headline font-bold">App Settings</h2>
             <p className="text-muted-foreground text-sm">Configure backup, notifications, and currency options here.</p>
             <Button variant="outline" className="w-full">Export Data (CSV)</Button>
             <Button variant="outline" className="w-full text-destructive hover:bg-destructive/5">Reset All Data</Button>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="absolute bottom-24 right-6 z-50">
        <Button 
          size="icon" 
          className="w-14 h-14 rounded-full shadow-2xl scale-110 active:scale-95 transition-transform bg-primary"
          onClick={handleAddClick}
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
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        categories={categories}
        initialExpense={editingExpense}
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
