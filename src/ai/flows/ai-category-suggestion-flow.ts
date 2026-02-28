'use server';
/**
 * @fileOverview An AI agent for suggesting expense categories.
 *
 * - aiCategorySuggestion - A function that handles the expense category suggestion process.
 * - AICategorySuggestionInput - The input type for the aiCategorySuggestion function.
 * - AICategorySuggestionOutput - The return type for the aiCategorySuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICategorySuggestionInputSchema = z.object({
  expenseDescription: z.string().describe('The description of the expense entered by the user.'),
  availableCategories: z.array(z.string()).describe('A list of available expense categories that the AI can suggest. If "Miscellaneous" is a possible suggestion, it should be included in this list.'),
});
export type AICategorySuggestionInput = z.infer<typeof AICategorySuggestionInputSchema>;

const AICategorySuggestionOutputSchema = z.object({
  suggestedCategory: z.string().describe('The most relevant expense category suggested by the AI based on the description and available categories. This must be one of the provided availableCategories, including "Miscellaneous" if it was provided and none other are suitable.'),
});
export type AICategorySuggestionOutput = z.infer<typeof AICategorySuggestionOutputSchema>;

export async function aiCategorySuggestion(input: AICategorySuggestionInput): Promise<AICategorySuggestionOutput> {
  return aiCategorySuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCategorySuggestionPrompt',
  input: {schema: AICategorySuggestionInputSchema},
  output: {schema: AICategorySuggestionOutputSchema},
  prompt: `You are an AI assistant designed to categorize expenses.
Given the expense description and a list of available categories, your task is to suggest the single most relevant category.
The suggested category MUST be one of the categories from the provided list. If none of the provided categories are suitable, you MUST suggest "Miscellaneous" (assuming "Miscellaneous" is in the available categories list).

Available Categories:
{{#each availableCategories}}
- {{this}}
{{/each}}

Expense Description: {{{expenseDescription}}}`,
});

const aiCategorySuggestionFlow = ai.defineFlow(
  {
    name: 'aiCategorySuggestionFlow',
    inputSchema: AICategorySuggestionInputSchema,
    outputSchema: AICategorySuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
