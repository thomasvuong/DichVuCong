'use server';
/**
 * @fileOverview A flow for validating the content of an uploaded document.
 *
 * - validateDocumentContent - A function that validates the document content.
 * - ValidateDocumentContentInput - The input type for the validateDocumentContent function.
 * - ValidateDocumentContentOutput - The return type for the validateDocumentContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateDocumentContentInputSchema = z.object({
  requiredDocumentName: z
    .string()
    .describe('The name of the required document (e.g., "Tờ khai đăng ký khai sinh").'),
  documentDataUri: z
    .string()
    .describe(
      "The uploaded document file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ValidateDocumentContentInput = z.infer<typeof ValidateDocumentContentInputSchema>;

const ValidateDocumentContentOutputSchema = z.object({
  isRelevant: z.boolean().describe('Whether the document content is relevant to the required document name.'),
  reason: z.string().describe('The reason for the validation result, especially if it is not relevant.'),
});
export type ValidateDocumentContentOutput = z.infer<typeof ValidateDocumentContentOutputSchema>;


export async function validateDocumentContent(
  input: ValidateDocumentContentInput
): Promise<ValidateDocumentContentOutput> {
  return validateDocumentContentFlow(input);
}


const contentValidationPrompt = ai.definePrompt({
    name: 'documentContentValidationPrompt',
    input: { schema: ValidateDocumentContentInputSchema },
    output: { schema: ValidateDocumentContentOutputSchema },
    prompt: `You are an expert document validator for a Vietnamese government public services portal.
    Your task is to determine if the content of an uploaded file is relevant for a specific requirement.

    Requirement: The user needs to upload a "{{requiredDocumentName}}".

    Uploaded File: {{media url=documentDataUri}}

    Analyze the content of the file (it could be an image or a PDF).
    - Determine if the content of the file matches the requirement "{{requiredDocumentName}}".
    - Be flexible. For example, if the requirement is "Giấy chứng sinh" (Birth Certificate), the document could be a photo of a birth certificate.
    - If the document seems relevant, set isRelevant to true and provide a brief confirmation reason.
    - If the document is clearly incorrect (e.g., a picture of a car for a birth certificate, or a blank/unrelated form), set isRelevant to false and provide a clear, simple reason in Vietnamese why it's not suitable. For example: "Tài liệu này có vẻ là hóa đơn, không phải giấy khai sinh." (This document appears to be an invoice, not a birth certificate).

    Return your analysis based on the content.`,
});


const validateDocumentContentFlow = ai.defineFlow(
  {
    name: 'validateDocumentContentFlow',
    inputSchema: ValidateDocumentContentInputSchema,
    outputSchema: ValidateDocumentContentOutputSchema,
  },
  async (input) => {
    const { output } = await contentValidationPrompt(input);
    return output!;
  }
);
