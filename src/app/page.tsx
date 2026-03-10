"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/use-expenses";
import { DashboardView } from "@/components/DashboardView";
import { ExpensesView } from "@/components/ExpensesView";
import { CategoryView } from "@/components/CategoryView";
import { UserGuide } from "@/components/UserGuide";
import { ExpenseDialog } from "@/components/ExpenseDialog";
import { CategoryDialog } from "@/components/CategoryDialog";
import { PrivacyDialog } from "@/components/PrivacyDialog";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { AdBanner } from "@/components/AdBanner";
import { LayoutGrid, PieChart, Plus, ReceiptText, Settings2, ShieldCheck, Zap, Info, ScrollText, HeartHandshake, BookOpen, Fingerprint, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Expense, Category, SUPPORTED_CURRENCIES } from "@/lib/types";

function PocketTrackLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 1024 1024" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <rect width="1024" height="1024" rx="220" fill="#FBBF24"/>
      <rect x="340" y="240" width="120" height="200" rx="12" fill="#34D399" transform="rotate(-15 340 240)"/>
      <rect x="440" y="200" width="140" height="220" rx="12" fill="#10B981"/>
      <rect x="580" y="250" width="100" height="180" rx="12" fill="#60A5FA" transform="rotate(10 580 250)"/>
      <circle cx="510" cy="280" r="15" fill="#065F46" opacity="0.3"/>
      <path d="M212 420C212 364.772 256.772 320 312 320H712C767.228 320 812 364.772 812 420V670C812 725.228 767.228 770 712 770H312C256.772 770 212 725.228 212 670V420Z" fill="#F59E0B"/>
      <path d="M212 420C212 364.772 256.772 320 312 320H712C767.228 320 812 364.772 812 420H212Z" fill="#D97706" opacity="0.3"/>
      <circle cx="412" cy="540" r="48" fill="#451A03"/>
      <circle cx="428" cy="522" r="14" fill="white"/>
      <circle cx="612" cy="540" r="48" fill="#451A03"/>
      <circle cx="628" cy="522" r="14" fill="white"/>
      <circle cx="330" cy="590" r="35" fill="#F87171" opacity="0.5"/>
      <circle cx="694" cy="590" r="35" fill="#F87171" opacity="0.5"/>
      <path d="M462 640C462 667.614 484.386 690 512 690C539.614 690 562 667.614 562 640H462Z" fill="#991B1B"/>
      <path d="M720 500H812V590H740C728.954 590 720 581.046 720 570V500Z" fill="#D97706"/>
      <circle cx="785" cy="545" r="15" fill="#FBBF24"/>
      <circle cx="850" cy="200" r="90" fill="#EF4444" opacity="0.9"/>
      <path d="M850 230C850 230 890 190 890 165C890 150 875 140 865 140C855 140 850 150 850 150C850 150 845 140 835 140C825 140 810 150 810 165C810 190 850 230 850 230Z" fill="white"/>
      <circle cx="170" cy="240" r="90" fill="#10B981" opacity="0.9"/>
      <path d="M130 240L155 265L210 210" stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M150 750L165 720L180 750L210 765L180 780L165 810L150 780L120 765L150 750Z" fill="white" opacity="0.9" />
      <path d="M900 450L910 430L920 450L940 460L920 470L910 490L900 470L880 460L900 450Z" fill="white" opacity="0.9" />
      <path d="M780 880L790 865L800 880L815 890L800 900L790 915L780 900L765 890L780 880Z" fill="white" opacity="0.9" />
    </svg>
  );
}

export default function PocketTrackApp() {
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

  const [activeTab, setActiveTab] = useState<"dashboard" | "expenses" | "categories" | "guide" | "settings">("dashboard");
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-6">
        <PocketTrackLogo className="w-24 h-24 shadow-2xl drop-shadow-lg" />
        <div className="text-primary font-headline font-bold text-3xl tracking-tighter">PocketTrack</div>
      </div>
    </div>
  );

  const handleExportCSV = () => {
    if (expenses.length === 0) return;

    // Privacy Consent Step
    const hasConsent = confirm(
      "Privacy Consent: You are about to export your financial data to a CSV file. Once downloaded, this file is stored on your device and is no longer protected by PocketTrack's local-first security. Do you consent to export your data?"
    );

    if (!hasConsent) return;

    const headers = ["Date", "Description", "Amount", "Currency", "Category", "Super Category"];
    const rows = expenses.map(e => {
      const cat = categories.find(c => c.id === e.categoryId)?.name || 'Uncategorized';
      return [
        e.date,
        `"${(e.description || '').replace(/"/g, '""')}"`,
        e.amount,
        currency,
        `"${cat}"`,
        e.superCategory || 'Personal'
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pockettrack_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="flex items-center gap-4">
          <div className="p-0.5 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <PocketTrackLogo className="w-12 h-12 rounded-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-headline tracking-tight text-primary leading-tight">PocketTrack</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Daily Expense Tracker</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-primary animate-pulse" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <AdBanner />

        {activeTab === "dashboard" && (
          <div className="px-6 py-10 bg-gradient-to-b from-primary/5 to-transparent text-center space-y-4 border-b border-primary/5">
            <h2 className="text-3xl font-black font-headline text-primary tracking-tight leading-tight">
              PocketTrack – Free Daily Expense Tracker
            </h2>
            <p className="text-[13px] text-muted-foreground font-medium leading-relaxed max-w-[300px] mx-auto">
              Track your spending, analyze your habits, and manage your personal finances easily with our ad-supported pocket tracker.
            </p>
          </div>
        )}
        
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
        {activeTab === "guide" && (
          <UserGuide />
        )}
        {activeTab === "settings" && (
          <div className="p-6 space-y-10 pb-24">
             <div className="text-center">
                <Settings2 className="w-16 h-16 mx-auto opacity-20 mb-4" />
                <h2 className="text-xl font-headline font-bold">App Settings & Info</h2>
                <p className="text-sm text-muted-foreground">Manage your Pocket Tracker preferences and learn about our mission.</p>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-full bg-white">
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

                {/* Detailed Publisher Content Sections for AdSense Approval */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="font-bold font-headline text-sm uppercase tracking-wide">Data Privacy & Security Policy</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      PocketTrack is built on the foundation of absolute financial privacy. In an era of data harvesting, we stand apart by utilizing a "Zero-Server" architecture for all personal transactions. Your budget, categories, and specific spending habits never leave your device.
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      We use the browser's persistent storage (IndexedDB/LocalStorage) to keep your records local. This means you are the sole custodian of your financial data. We do not maintain user accounts or cloud databases for expenses, ensuring that your sensitive information remains private even from us.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-primary">
                    <ScrollText className="w-5 h-5" />
                    <h3 className="font-bold font-headline text-sm uppercase tracking-wide">Terms of Service & Usage</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      PocketTrack is a decision-support tool designed for personal financial tracking. By using this application, you acknowledge that it is provided for informational purposes only. It is not intended to serve as professional tax, legal, or investment advice.
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      The AI-powered classification and insight summaries are generated algorithms and should be verified against your actual records. Users are responsible for maintaining their own backups via the CSV export tool provided in this menu.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-primary">
                    <HeartHandshake className="w-5 h-5" />
                    <h3 className="font-bold font-headline text-sm uppercase tracking-wide">Our Global Mission</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Our mission is to empower individuals globally with the tools of financial literacy. We believe that clarity in spending is the first step toward financial freedom. By providing a free, ad-supported pocket tracker, we remove the financial barriers to high-quality money management tools.
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Every update we push is focused on making tracking faster, smarter, and more private. We believe in a world where everyone has the awareness to build a secure financial future for themselves and their families.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-primary">
                    <Fingerprint className="w-5 h-5" />
                    <h3 className="font-bold font-headline text-sm uppercase tracking-wide">AdSense & Advertiser Disclosure</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    PocketTrack is made free for all users through the support of Google AdSense and our advertising partners. These ads allow us to maintain and improve the app without charging a subscription fee. We strive to only work with advertisers that provide value to our financially-conscious audience.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("guide")}>Read Full User Guide</Button>
                  <Button variant="outline" className="w-full" onClick={() => setFeedbackDialogOpen(true)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send App Feedback
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleExportCSV}
                    disabled={expenses.length === 0}
                  >
                    Export All Data (CSV)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive hover:bg-destructive/5"
                    onClick={() => {
                      if (confirm("Are you sure? This will permanently erase all transaction and category data from this device.")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                  >
                    Reset & Clear All Data
                  </Button>
                </div>
             </div>

             <div className="text-center pt-8 border-t">
               <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">© 2024 PocketTrack - Professional Pocket Tracker App</p>
               <div className="flex justify-center gap-4 mt-2">
                 <button 
                  className="text-[10px] font-bold text-primary underline"
                  onClick={() => setPrivacyDialogOpen(true)}
                 >
                   Privacy Center
                 </button>
                 <button className="text-[10px] font-bold text-primary underline" onClick={() => setActiveTab("guide")}>Help & Documentation</button>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {activeTab !== "categories" && activeTab !== "settings" && activeTab !== "guide" && (
        <div className="absolute bottom-24 right-6 z-50">
          <Button 
            size="icon" 
            className="w-14 h-14 rounded-full shadow-2xl scale-110 active:scale-95 transition-transform bg-primary"
            onClick={handleAddExpenseClick}
          >
            <Plus className="w-8 h-8" />
          </Button>
        </div>
      )}

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
        <div className="w-14" />
        <NavButton 
          active={activeTab === "categories"} 
          onClick={() => setActiveTab("categories")}
          icon={<LayoutGrid className="w-6 h-6" />}
          label="Folders"
        />
        <NavButton 
          active={activeTab === "guide" || activeTab === "settings"} 
          onClick={() => setActiveTab(activeTab === "guide" ? "guide" : "settings")}
          icon={activeTab === "guide" ? <BookOpen className="w-6 h-6" /> : <Settings2 className="w-6 h-6" />}
          label={activeTab === "guide" ? "Help" : "Info"}
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

      <PrivacyDialog
        open={privacyDialogOpen}
        onOpenChange={setPrivacyDialogOpen}
      />

      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
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
