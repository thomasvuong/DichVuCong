import { config } from 'dotenv';
config();

import '@/ai/flows/submission-validator.ts';
import '@/ai/flows/keyword-refinement.ts';
import '@/ai/flows/document-content-validator.ts';
import '@/ai/flows/extract-form-data.ts';
