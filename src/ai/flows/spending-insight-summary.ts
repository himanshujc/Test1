'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating natural language summaries and insights
 * about user spending trends on the dashboard.
 *
 * - getSpendingInsightSummary - A function that handles the generation of spending insights.
 * - SpendingInsightSummaryInput - The input type for the getSpendingInsightSummary function.
 * - SpendingInsightSummaryOutput - The return type for the getSpendingInsightSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingInsightSummaryInputSchema = z.object({
  periodDescription: z.string().describe('A description of the time period the summary covers (e.g., "this month", "last week").'),
  totalSpending: z.number().describe('The total amount spent during the specified period.'),
  categoryBreakdown: z.record(z.string(), z.number()).describe('An object where keys are expense categories and values are the total amount spent in that category during the period.'),
  currency: z.string().optional().describe('The currency symbol used for the display.'),
});
export type SpendingInsightSummaryInput = z.infer<typeof SpendingInsightSummaryInputSchema>;

export type SpendingInsightSummaryOutput = string;

// Internal schema for prompt validation that matches the transformed array structure
const PromptInputSchema = z.object({
  periodDescription: z.string(),
  totalSpending: z.number(),
  currency: z.string(),
  categoryBreakdown: z.array(z.object({
    key: z.string(),
    value: z.number(),
  })),
});

// Using an object schema for prompt output is significantly more robust in Genkit
const PromptOutputSchema = z.object({
  insight: z.string().describe('A natural language summary and insights about spending trends.'),
});

const spendingInsightSummaryPrompt = ai.definePrompt({
  name: 'spendingInsightSummaryPrompt',
  input: {schema: PromptInputSchema},
  output: {schema: PromptOutputSchema},
  prompt: `You are a helpful financial assistant named SpendWise. Your goal is to provide concise, natural language summaries and actionable insights on personal spending habits, helping users understand their financial behavior and identify areas for improvement.

Analyze the following spending data for {{periodDescription}}:

Total Spending: {{currency}} {{totalSpending}}

Category-wise Spending:
{{#each categoryBreakdown}}
- {{key}}: {{../currency}} {{value}}
{{/each}}

Please provide:
1.  A high-level summary of the spending for the period, noting the total amount spent.
2.  Key insights or observations based on the category breakdown. For example, identify the top spending categories, or any categories with unusually high spending.
3.  Actionable suggestions or areas for improvement, especially if certain categories seem to consume a significant portion of the budget.
4.  Ensure the tone is encouraging and easy to understand.`,
});

const spendingInsightSummaryFlow = ai.defineFlow(
  {
    name: 'spendingInsightSummaryFlow',
    inputSchema: SpendingInsightSummaryInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    // Transform categoryBreakdown object into an array of {key, value} for easier Handlebars iteration.
    const categoryArray = Object.entries(input.categoryBreakdown).map(([key, value]) => ({
      key,
      value,
    }));

    try {
      const {output} = await spendingInsightSummaryPrompt({
        periodDescription: input.periodDescription,
        totalSpending: input.totalSpending,
        currency: input.currency || '$',
        categoryBreakdown: categoryArray,
      });
      
      // If the model response is valid, return the insight field
      if (output && output.insight) {
        return output.insight;
      }
      
      return "I've analyzed your spending, but I couldn't formulate a specific insight right now. Keep tracking your expenses to see detailed trends!";
    } catch (error) {
      console.error("Spending insight generation failed:", error);
      return "I'm having a little trouble analyzing your data at the moment. Please try again in a few minutes.";
    }
  }
);

export async function getSpendingInsightSummary(input: SpendingInsightSummaryInput): Promise<SpendingInsightSummaryOutput> {
  return spendingInsightSummaryFlow(input);
}
