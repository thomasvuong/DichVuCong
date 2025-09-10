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
    .describe('A list of missing documents, if any.'),
  incorrectFileType: z
    .array(z.string())
    .describe('A list of documents with incorrect file types, if any.'),
});
export type ValidateSubmissionOutput = z.infer<typeof ValidateSubmissionOutputSchema>;

export async function validateSubmission(
  input: ValidateSubmissionInput
): Promise<ValidateSubmissionOutput> {
  return validateSubmissionFlow(input);
}

const validateSubmissionFlow = ai.defineFlow(
  {
    name: 'validateSubmissionFlow',
    inputSchema: ValidateSubmissionInputSchema,
    outputSchema: ValidateSubmissionOutputSchema,
  },
  async input => {
    const {requiredDocuments, uploadedDocuments} = input;

    const missingDocuments = requiredDocuments.filter(
      doc => !uploadedDocuments.some(uploadedDoc => uploadedDoc.startsWith(doc))
    );

    // Assuming file type is indicated by the extension (e.g., .pdf, .jpg)
    const incorrectFileType: string[] = [];

    const isValid = missingDocuments.length === 0 && incorrectFileType.length === 0;

    return {
      isValid,
      missingDocuments,
      incorrectFileType,
    };
  }
);
