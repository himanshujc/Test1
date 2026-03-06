
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Expense, Category, SuperCategory, SUPER_CATEGORIES } from "@/lib/types";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { getSpendingInsightSummary } from "@/ai/flows/spending-insight-summary";
import { Sparkles, Info, Filter } from "lucide-react";
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

  // Group by category
  const categoryData = categories.map(cat => {
    const amount = filteredExpenses
      .filter(e => e.categoryId === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: cat.name, value: amount, color: cat.color };
  }).filter(d => d.value > 0);

  // Group by date (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const amount = filteredExpenses
      .filter(e => e.date === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);
    return { date: dateStr.split('-').slice(1).join('/'), amount };
  }).reverse();

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
  }, [filteredExpenses.length, currency, filter]);

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
              <Skeleton className="h-4 w-[80%]" />
            </div>
          ) : insight ? (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{insight}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Add {filter === 'All' ? 'expenses' : `${filter} expenses`} to see AI-powered financial insights.</p>
          )}
        </CardContent>
      </Card>

      {/* Official AdSense Unit */}
      <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col items-center justify-center min-h-[100px] shadow-sm">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2 w-full justify-start">
          <Info className="w-3 h-3" />
          Sponsored
        </div>
        <AdSenseUnit slot="3927802258" />
      </div>

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
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`${currency} ${value.toFixed(2)}`, 'Amount']}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                No data for this filter
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-headline">7-Day Trend</CardTitle>
            <CardDescription>Habits for {filter}</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
                <YAxis hide />
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`${currency} ${value.toFixed(2)}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
