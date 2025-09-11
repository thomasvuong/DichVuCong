'use server';

/**
 * @fileOverview Document submission validator flow.
 *
 * - validateSubmission - A function that validates the document submission.
 * - ValidateSubmissionInput - The input type for the validateSubmission function.
 * - ValidateSubmissionOutput - The return type for the validateSubmission function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateSubmissionInputSchema = z.object({
  requiredDocuments: z
    .array(z.string())
    .describe('A list of the names of required documents.'),
  uploadedDocuments: z
    .array(z.string())
    .describe(
      'A list of the names of uploaded documents including their file extensions.'
    ),
});
export type ValidateSubmissionInput = z.infer<typeof ValidateSubmissionInputSchema>;

const ValidateSubmissionOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the submission is valid or not.'),
  missingDocuments: z
    .array(z.string())
    .describe('A list of missing required documents, if any. This should be derived from the requiredDocuments input list.'),
  incorrectFileType: z
    .array(z.string())
    .describe('A list of uploaded document names that have an invalid file type (not PDF, JPG, PNG, DOC, or DOCX).'),
});
export type ValidateSubmissionOutput = z.infer<typeof ValidateSubmissionOutputSchema>;

export async function validateSubmission(
  input: ValidateSubmissionInput
): Promise<ValidateSubmissionOutput> {
  return validateSubmissionFlow(input);
}

const validationPrompt = ai.definePrompt({
    name: 'submissionValidationPrompt',
    input: { schema: ValidateSubmissionInputSchema },
    output: { schema: ValidateSubmissionOutputSchema },
    prompt: `You are a document submission validator. Your task is to check if the uploaded documents meet the requirements.

    Required documents:
    {{#each requiredDocuments}}
    - {{this}}
    {{/each}}

    Uploaded documents:
    {{#each uploadedDocuments}}
    - {{this}}
    {{/each}}

    Rules:
    1.  For each required document, check if there is a corresponding uploaded document. The name matching should be flexible (e.g., "Tờ khai" matches "To khai.pdf").
    2.  Identify any required documents that are missing from the uploaded list.
    3.  Check the file extension of each uploaded document. Only .pdf, .jpg, .jpeg, .png, .doc, and .docx are allowed.
    4.  List any uploaded documents that have an incorrect file type.
    5.  Set 'isValid' to true only if all required documents are present AND all uploaded files have a valid file type. Otherwise, set it to false.

    Analyze the provided lists and return the validation result.`,
});


const validateSubmissionFlow = ai.defineFlow(
  {
    name: 'validateSubmissionFlow',
    inputSchema: ValidateSubmissionInputSchema,
    outputSchema: ValidateSubmissionOutputSchema,
  },
  async (input) => {
    const { output } = await validationPrompt(input);
    return output!;
  }
);
