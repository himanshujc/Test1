"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Expense, Category, SuperCategory } from "@/lib/types";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from "recharts";
import { getSpendingInsightSummary } from "@/ai/flows/spending-insight-summary";
import { Sparkles, Info, Filter, BookOpen, Lightbulb, TrendingUp, ShieldCheck, GraduationCap, Gavel } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardViewProps {
  expenses: Expense[];
  categories: Category[];
  currency: string;
}

export function DashboardView({ expenses, categories, currency }: DashboardViewProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [filter, setFilter] = useState<SuperCategory | 'All'>('All');

  const filteredExpenses = filter === 'All' 
    ? expenses 
    : expenses.filter(e => e.superCategory === filter || (!e.superCategory && filter === 'Personal'));

  const totalSpending = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryData = categories.map(cat => {
    const amount = filteredExpenses
      .filter(e => e.categoryId === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: cat.name, value: amount, color: cat.color };
  }).filter(d => d.value > 0);

  useEffect(() => {
    async function fetchInsight() {
      if (filteredExpenses.length === 0) {
        setInsight(null);
        return;
      }
      setLoadingInsight(true);
      try {
        const breakdown: Record<string, number> = {};
        categoryData.forEach(d => breakdown[d.name] = d.value);
        const periodDesc = filter === 'All' ? "this month (overall)" : `this month for ${filter}`;
        const res = await getSpendingInsightSummary({
          periodDescription: periodDesc,
          totalSpending,
          categoryBreakdown: breakdown,
          currency
        });
        setInsight(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingInsight(false);
      }
    }
    fetchInsight();
  }, [filteredExpenses.length, currency, filter, categoryData, totalSpending]);

  return (
    <div className="space-y-6 pb-24 px-4 pt-4">
      {/* Super Category Filter */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
          <Filter className="w-3 h-3" />
          Filter by life domain
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
          <TabsList className="grid grid-cols-4 w-full h-9 bg-muted/50 p-1">
            <TabsTrigger value="All" className="text-[10px] uppercase font-bold tracking-tighter">All</TabsTrigger>
            <TabsTrigger value="Personal" className="text-[10px] uppercase font-bold tracking-tighter">Personal</TabsTrigger>
            <TabsTrigger value="Family" className="text-[10px] uppercase font-bold tracking-tighter">Family</TabsTrigger>
            <TabsTrigger value="P&F" className="text-[10px] uppercase font-bold tracking-tighter">P&F</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-4 flex flex-col justify-center min-h-[100px]">
            <span className="text-xs font-medium opacity-80 mb-1 uppercase tracking-wider">
              {filter} Spending
            </span>
            <span className="text-2xl font-bold font-headline">{currency} {totalSpending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-4 flex flex-col justify-center min-h-[100px]">
             <span className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Transactions</span>
             <span className="text-2xl font-bold font-headline text-primary">{filteredExpenses.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Card */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-accent/5 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <CardTitle className="text-sm font-headline uppercase tracking-wide">PocketTrack Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loadingInsight ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
          ) : insight ? (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{insight}</p>
          ) : (
            <div className="space-y-2">
               <p className="text-sm text-muted-foreground font-medium">Tracking {filter === 'All' ? 'Everyday' : filter} Expenses</p>
               <p className="text-[11px] text-muted-foreground/80 leading-relaxed italic">
                 Start adding expenses to generate AI-powered insights. Our Daily Expense Tracker analyzes your habits to provide actionable financial advice tailored to your pocket tracker data.
               </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Education Section - Essential Publisher Content for AdSense */}
      <Card className="border-none shadow-sm bg-blue-50/40">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-primary">
            <GraduationCap className="w-5 h-5" />
            <CardTitle className="text-sm font-headline uppercase tracking-wide">Financial Education Hub</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground">Mastering the 50/30/20 Budgeting Framework</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Effective financial management is built on a solid foundation. The 50/30/20 rule is a world-renowned budgeting technique that simplifies your monthly cash flow. It suggests that 50% of your after-tax income should cover your absolute "Needs" like housing, groceries, and insurance. 30% is allocated for "Wants"—lifestyle choices. Finally, 20% must be channeled into "Savings" and debt reduction.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground">The Psychological Impact of Daily Tracking</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Behavioral finance shows that recording an expense reduces impulse spending. By using a pocket tracker, you create a "mindfulness gap" between the desire to purchase and the actual transaction. This habit cultivates long-term discipline and prioritizes value over convenience.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Wealth Building Section - Essential Publisher Content for AdSense */}
      <Card className="border-none shadow-sm bg-green-50/40">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-green-700">
            <TrendingUp className="w-5 h-5" />
            <CardTitle className="text-sm font-headline uppercase tracking-wide">Wealth Building Strategies</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground">Strategic Emergency Fund Planning</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              A robust emergency fund is the ultimate insurance policy. Experts generally recommend maintaining a liquid cash reserve equal to 3 to 6 months of essential living expenses. Use the "Family" and "Personal" filters in PocketTrack to calculate your baseline survival cost.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground">The compounding Effect of Small Savings</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Compound interest works best when you have consistent, surplus cash flow. Identifying and eliminating small wastes through your pocket tracker can grow into significant wealth over decades. PocketTrack helps you find what's possible.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mission & Transparency Section */}
      <Card className="border-none shadow-sm border-t-2 border-primary/20 bg-muted/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gavel className="w-5 h-5" />
            <CardTitle className="text-xs font-headline uppercase tracking-wide">Mission & Transparency</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            PocketTrack is dedicated to providing high-quality financial tracking tools for the global community. Our mission is to democratize financial literacy by offering an ad-supported, zero-cost platform for all.
          </p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary/60" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Privacy Verified: Local Storage Only</span>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Expense Breakdown</CardTitle>
            <CardDescription>{filter === 'All' ? 'Overall' : filter} distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] pt-0">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value: number) => [`${currency} ${value.toFixed(2)}`, 'Amount']} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                 <div className="p-3 bg-muted rounded-full">
                    <BookOpen className="w-8 h-8 opacity-20" />
                 </div>
                 <div className="text-center px-6">
                    <p className="text-xs font-bold text-foreground mb-1">Visualizing Your Habits</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Once you log your transactions, this area will transform into an interactive breakdown.
                    </p>
                 </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
