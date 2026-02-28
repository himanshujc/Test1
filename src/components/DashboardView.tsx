
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Expense, Category } from "@/lib/types";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { getSpendingInsightSummary } from "@/ai/flows/spending-insight-summary";
import { Sparkles, TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardViewProps {
  expenses: Expense[];
  categories: Category[];
  currency: string;
}

export function DashboardView({ expenses, categories, currency }: DashboardViewProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoryData = categories.map(cat => {
    const amount = expenses
      .filter(e => e.categoryId === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: cat.name, value: amount, color: cat.color };
  }).filter(d => d.value > 0);

  // Group by date (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const amount = expenses
      .filter(e => e.date === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);
    return { date: dateStr.split('-').slice(1).join('/'), amount };
  }).reverse();

  useEffect(() => {
    async function fetchInsight() {
      if (expenses.length === 0) return;
      setLoadingInsight(true);
      try {
        const breakdown: Record<string, number> = {};
        categoryData.forEach(d => breakdown[d.name] = d.value);
        
        const res = await getSpendingInsightSummary({
          periodDescription: "this month",
          totalSpending,
          categoryBreakdown: breakdown
        });
        setInsight(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingInsight(false);
      }
    }
    fetchInsight();
  }, [expenses.length]);

  return (
    <div className="space-y-6 pb-24 px-4 pt-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-4 flex flex-col justify-center min-h-[100px]">
            <span className="text-xs font-medium opacity-80 mb-1 uppercase tracking-wider">Total Spending</span>
            <span className="text-2xl font-bold font-headline">{currency} {totalSpending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-4 flex flex-col justify-center min-h-[100px]">
             <span className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Transactions</span>
             <span className="text-2xl font-bold font-headline text-primary">{expenses.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Card */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-accent/5 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <CardTitle className="text-sm font-headline uppercase tracking-wide">SpendWise Insights</CardTitle>
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
            <p className="text-sm text-muted-foreground italic">Add expenses to see AI-powered financial insights.</p>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Category Breakdown</CardTitle>
            <CardDescription>Where your money goes</CardDescription>
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
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-headline">7-Day Trend</CardTitle>
            <CardDescription>Daily spending habits</CardDescription>
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
