// Keyword Refinement Flow
'use server';
/**
 * @fileOverview Automatically refines search queries if the initial search returns no results.
 *
 * - refineKeyword - A function that refines the keyword.
 * - RefineKeywordInput - The input type for the refineKeyword function.
 * - RefineKeywordOutput - The return type for the refineKeyword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineKeywordInputSchema = z.object({
  originalKeyword: z
    .string()
    .describe('The original keyword that returned no search results.'),
});
export type RefineKeywordInput = z.infer<typeof RefineKeywordInputSchema>;

const RefineKeywordOutputSchema = z.object({
  refinedKeyword: z
    .string()
    .describe('The refined keyword to use for a second search attempt.'),
});
export type RefineKeywordOutput = z.infer<typeof RefineKeywordOutputSchema>;

export async function refineKeyword(input: RefineKeywordInput): Promise<RefineKeywordOutput> {
  return refineKeywordFlow(input);
}

const refineKeywordPrompt = ai.definePrompt({
  name: 'refineKeywordPrompt',
  input: {schema: RefineKeywordInputSchema},
  output: {schema: RefineKeywordOutputSchema},
  prompt: `The user's initial search query, "{{originalKeyword}}", returned no results. Please shorten or refine the query to increase the likelihood of finding relevant results.  Focus on extracting the core meaning of the query. Return only the refined keyword. Do not include any additional explanation.`,
});

const refineKeywordFlow = ai.defineFlow(
  {
    name: 'refineKeywordFlow',
    inputSchema: RefineKeywordInputSchema,
    outputSchema: RefineKeywordOutputSchema,
  },
  async input => {
    const {output} = await refineKeywordPrompt(input);
    return output!;
  }
);
