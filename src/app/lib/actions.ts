'use server';

import { refineKeyword } from '@/ai/flows/keyword-refinement';
import { validateSubmission, ValidateSubmissionInput } from '@/ai/flows/submission-validator';
import { mockProcedureDetails, mockSearchResults } from './data';
import type { Service, ProcedureDetail } from './types';

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function searchServices(query: string): Promise<Service[]> {
  await delay(500);

  // Simulate fetching from an external source and parsing HTML.
  // In this mock, we filter our data.
  const lowerCaseQuery = query.toLowerCase();
  let results = mockSearchResults.filter(service =>
    service.title.toLowerCase().includes(lowerCaseQuery) || service.description.toLowerCase().includes(lowerCaseQuery)
  );
  
  // If no results, use AI to refine keyword and retry
  if (results.length === 0 && query.trim().length > 0) {
    try {
      console.log(`No results for "${query}", refining keyword...`);
      const { refinedKeyword } = await refineKeyword({ originalKeyword: query });
      console.log(`Refined keyword: "${refinedKeyword}", searching again...`);
      
      await delay(500);
      
      const lowerCaseRefinedQuery = refinedKeyword.toLowerCase();
      results = mockSearchResults.filter(service =>
        service.title.toLowerCase().includes(lowerCaseRefinedQuery) || service.description.toLowerCase().includes(lowerCaseRefinedQuery)
      );
    } catch (error) {
        console.error("Error refining keyword:", error);
        return [];
    }
  }
  
  return results;
}

export async function getProcedureDetails(id: string): Promise<ProcedureDetail | undefined> {
    await delay(300);
    return mockProcedureDetails.find(p => p.id === id);
}

export async function validateDocuments(input: ValidateSubmissionInput) {
    // The AI flow is very basic in this starter. 
    // It only checks if the filenames start with the required doc names.
    // e.g., required: "Tờ khai", uploaded: "Tờ khai.pdf" -> OK
    // e.g., required: "Tờ khai", uploaded: "To khai.pdf" -> Fail
    return validateSubmission(input);
}
