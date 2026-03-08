"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { BookOpen, CheckCircle2, Star, Zap } from "lucide-react";

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
              <CardTitle className="text-lg font-headline">1. Dashboard Overview</CardTitle>
            </div>
            <CardDescription>Your financial command center at a glance.</CardDescription>
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
              The dashboard provides a real-time summary of your <strong>Pocket Tracker</strong> data. View total spending, transaction counts, and interactive category charts. Use the Super Category filter to toggle between Personal, Family, and P&F views.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-5 h-5" />
              <CardTitle className="text-lg font-headline">2. Adding Expenses</CardTitle>
            </div>
            <CardDescription>Log transactions in seconds with AI help.</CardDescription>
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
              Click the <span className="font-bold text-primary">+</span> button to add a new expense. Type a description and watch our AI automatically suggest the best category! Don't forget to select a <strong>Super Category</strong> to keep your personal and family life organized.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-primary">
              <Star className="w-5 h-5" />
              <CardTitle className="text-lg font-headline">3. Custom Categories</CardTitle>
            </div>
            <CardDescription>Organize your money exactly how you want.</CardDescription>
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
              Navigate to the "Folders" tab to manage your spending buckets. You can create custom categories with unique icons and colors, tailored to your specific <strong>Daily Expense Tracker</strong> needs.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="bg-primary/5 rounded-2xl p-6 space-y-4 border border-primary/10">
        <div className="flex items-center gap-2 text-primary">
          <BookOpen className="w-6 h-6" />
          <h3 className="font-headline font-bold text-lg">Pro Tips for Success</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-primary">1</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Check AI Insights:</strong> Review the Sparkles section on the dashboard for personalized financial advice generated from your <strong>pocket tracker</strong> data.
            </p>
          </li>
          <li className="flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-primary">2</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Export Regularly:</strong> Use the export feature in settings to keep a CSV backup of your <strong>Daily Expense Tracker</strong> records.
            </p>
          </li>
          <li className="flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-primary">3</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Privacy Check:</strong> Remember that all your data stays on your device. Clearing your browser data will reset your tracker!
            </p>
          </li>
        </ul>
      </section>

      <div className="text-center py-4">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">© 2024 PocketTrack - The Ultimate Pocket Tracker</p>
      </div>
    </div>
  );
}
