"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Expense, Category, SuperCategory } from "@/lib/types";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from "recharts";
import { getSpendingInsightSummary } from "@/ai/flows/spending-insight-summary";
import { Sparkles, Info, Filter, BookOpen, Lightbulb, TrendingUp, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdSenseUnit } from "./AdSenseUnit";
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

      {/* Static Publisher Content Section 1: Financial Wellness */}
      <Card className="border-none shadow-sm bg-blue-50/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-primary">
            <Lightbulb className="w-4 h-4" />
            <CardTitle className="text-xs font-headline uppercase tracking-wide">Financial Wellness Guide</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-foreground">Understanding the 50/30/20 Rule</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Achieving financial stability starts with a structured budget. The 50/30/20 rule suggests allocating 50% of your income to needs (rent, groceries, utilities), 30% to wants (dining out, entertainment), and 20% to savings or debt repayment. PocketTrack allows you to tag expenses so you can see exactly how your spending aligns with this classic financial framework.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-foreground">The Power of Micro-Tracking</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Financial leakage often occurs through small, repetitive purchases. A daily pocket tracker helps you identify "the latte factor"—small daily costs that can add up to thousands of dollars over a year. By logging every transaction, you build the awareness necessary to reclaim control over your discretionary spending.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Official AdSense Unit */}
      <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px] shadow-sm">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2 w-full justify-start">
          <Info className="w-3 h-3" />
          Sponsored Advertisement
        </div>
        <AdSenseUnit slot="3927802258" />
      </div>

      {/* Static Publisher Content Section 2: Wealth Building */}
      <Card className="border-none shadow-sm bg-green-50/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-green-700">
            <TrendingUp className="w-4 h-4" />
            <CardTitle className="text-xs font-headline uppercase tracking-wide">Wealth Building Strategies</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-foreground">Building an Emergency Fund</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Experts recommend having 3-6 months of essential living expenses saved in an accessible account. Use the "Personal" filter in PocketTrack to calculate your average monthly survival cost. This number serves as your target for a fully-funded emergency buffer, protecting you from unexpected life events.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-foreground">Tracking Family vs. Personal Growth</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Managing a household requires distinguishing between communal family costs and individual professional expenses. Our "Super Category" feature helps families coordinate their budgets while maintaining individual financial autonomy, a key component of long-term financial harmony.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Category Breakdown</CardTitle>
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
                 <p className="text-xs text-muted-foreground text-center px-8 leading-relaxed">
                   Once you add expenses, this chart will show your spending distribution. Use your Daily Expense Tracker to keep tabs on your budget.
                 </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Final Educational Section for AdSense Crawlers */}
        <div className="px-2 py-4 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Privacy & Safety First</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-white rounded-xl border border-gray-100">
               <h4 className="text-[11px] font-bold text-primary mb-1">Local Data Storage</h4>
               <p className="text-[10px] text-muted-foreground leading-relaxed">
                 PocketTrack respects your financial privacy. Unlike traditional trackers that sync your sensitive data to the cloud, our application uses advanced local-first technology. Your expenses are stored securely in your browser's private storage, ensuring that your financial details never leave your device.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
