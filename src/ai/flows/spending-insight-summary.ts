
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
});
export type SpendingInsightSummaryInput = z.infer<typeof SpendingInsightSummaryInputSchema>;

const SpendingInsightSummaryOutputSchema = z.string().describe('A natural language summary and insights about spending trends.');
export type SpendingInsightSummaryOutput = z.infer<typeof SpendingInsightSummaryOutputSchema>;

const spendingInsightSummaryPrompt = ai.definePrompt({
  name: 'spendingInsightSummaryPrompt',
  input: {schema: SpendingInsightSummaryInputSchema},
  output: {schema: SpendingInsightSummaryOutputSchema},
  prompt: `You are a helpful financial assistant named SpendWise. Your goal is to provide concise, natural language summaries and actionable insights on personal spending habits, helping users understand their financial behavior and identify areas for improvement.

Analyze the following spending data for {{periodDescription}}:

Total Spending: \${{totalSpending}}

Category-wise Spending:
{{#each categoryBreakdown}}
- {{key}}: \${{value}}
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
    outputSchema: SpendingInsightSummaryOutputSchema,
  },
  async (input) => {
    // Transform categoryBreakdown object into an array of {key, value} for easier Handlebars iteration.
    const categoryArray = Object.entries(input.categoryBreakdown).map(([key, value]) => ({
      key,
      value,
    }));

    const {output} = await spendingInsightSummaryPrompt({
      periodDescription: input.periodDescription,
      totalSpending: input.totalSpending,
      categoryBreakdown: categoryArray,
    });
    return output!;
  }
);

export async function getSpendingInsightSummary(input: SpendingInsightSummaryInput): Promise<SpendingInsightSummaryOutput> {
  return spendingInsightSummaryFlow(input);
}
