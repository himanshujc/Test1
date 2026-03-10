"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { BookOpen, CheckCircle2, Star, Zap, ShieldCheck, TrendingUp, Info } from "lucide-react";

export function UserGuide() {
  const dashboardImg = PlaceHolderImages.find(img => img.id === 'guide-dashboard');
  const expenseImg = PlaceHolderImages.find(img => img.id === 'guide-add-expense');
  const categoriesImg = PlaceHolderImages.find(img => img.id === 'guide-categories');

  return (
    <div className="p-4 space-y-8 pb-32">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black font-headline text-primary tracking-tight">PocketTrack Guide</h2>
        <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Master Your Daily Expense Tracker</p>
      </div>

      <section className="space-y-6">
        <Card className="border-none shadow-md overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-5 h-5" />
              <CardTitle className="text-lg font-headline">1. Dashboard Analytics</CardTitle>
            </div>
            <CardDescription>Visualizing your financial health at a glance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-muted">
              {dashboardImg && (
                <Image 
                  src={dashboardImg.imageUrl} 
                  alt={dashboardImg.description} 
                  fill 
                  className="object-cover"
                  data-ai-hint={dashboardImg.imageHint}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The PocketTrack dashboard is your financial command center. It provides real-time totals, transaction counts, and interactive charts that help you identify where your money is going. Use the <strong>Super Category</strong> filter to switch between your personal budget, family expenses, and professional costs (P&F). This separation is crucial for maintaining a healthy balance between your different life domains.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-5 h-5" />
              <CardTitle className="text-lg font-headline">2. Recording Transactions</CardTitle>
            </div>
            <CardDescription>Speed and accuracy with AI assistance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-muted">
              {expenseImg && (
                <Image 
                  src={expenseImg.imageUrl} 
                  alt={expenseImg.description} 
                  fill 
                  className="object-cover"
                  data-ai-hint={expenseImg.imageHint}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To log a purchase, simply tap the <span className="font-bold text-primary">+</span> button. Start typing a description (e.g., "Starbucks coffee"), and our advanced <strong>AI Category Suggestion</strong> will instantly recommend the most appropriate folder. Assigning a Super Category helps you filter your data later for deep analysis. Consistent daily tracking is the secret to uncovering small spending leaks that could be sabotaging your savings goals.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-primary">
              <Star className="w-5 h-5" />
              <CardTitle className="text-lg font-headline">3. Custom Folders & Categories</CardTitle>
            </div>
            <CardDescription>Tailored organization for your unique life.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-muted">
              {categoriesImg && (
                <Image 
                  src={categoriesImg.imageUrl} 
                  alt={categoriesImg.description} 
                  fill 
                  className="object-cover"
                  data-ai-hint={categoriesImg.imageHint}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every individual's spending is unique. Navigate to the <strong>Folders</strong> tab to customize your category list. You can add new folders with specific icons and vibrant colors that make sense for your lifestyle. Whether it's "Pet Care," "Streaming Services," or "Freelance Supplies," PocketTrack adapts to your organizational style.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Extended Publisher Content for AdSense */}
      <section className="bg-primary/5 rounded-2xl p-6 space-y-6 border border-primary/10">
        <div className="flex items-center gap-2 text-primary">
          <TrendingUp className="w-6 h-6" />
          <h3 className="font-headline font-bold text-lg">Financial Success Strategies</h3>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-primary" />
              The Importance of Local Privacy
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              In an increasingly digital world, your financial data is your most sensitive asset. PocketTrack prioritizes your security by ensuring that 100% of your transactional data is stored locally on your device. We never sync your expenses to our servers, protecting you from potential cloud data breaches. Your pocket tracker is truly your own private ledger.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wide">
              <Info className="w-4 h-4 text-primary" />
              Building Sustainable Habits
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Financial freedom isn't about how much you earn; it's about how much you keep. By using PocketTrack to log your daily expenses, you build an awareness that naturally curtails wasteful spending. Experts suggest reviewing your dashboard weekly to spot trends and adjust your budget before the month ends. This proactive approach is the hallmark of wealthy individuals.
            </p>
          </div>
        </div>
      </section>

      <div className="text-center py-4 border-t border-gray-100">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">© 2024 PocketTrack - Official Documentation</p>
        <p className="text-[9px] text-muted-foreground mt-1 px-8">Our mission is to provide free, high-quality financial tracking tools to everyone, everywhere.</p>
      </div>
    </div>
  );
}
