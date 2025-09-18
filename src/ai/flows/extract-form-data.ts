'use server';
/**
 * @fileOverview Extracts structured data from an image of a form.
 *
 * - extractFormData - A function that extracts data from a form image.
 * - ExtractFormDataInput - The input type for the extractFormData function.
 * - ExtractFormDataOutput - The return type for the extractFormData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormDataSchema = z.object({
    ho_ten_nguoi_yeu_cau: z.string().describe("Họ và tên của người yêu cầu"),
    dia_chi_nguoi_yeu_cau: z.string().describe("Địa chỉ của người yêu cầu"),
    sdt_nguoi_yeu_cau: z.string().describe("Số điện thoại của người yêu cầu"),
    ho_ten_nguoi_duoc_khai_sinh: z.string().describe("Họ và tên của người được khai sinh"),
    ngay_sinh: z.string().describe("Ngày tháng năm sinh của người được khai sinh (dạng dd/mm/yyyy)"),
    gioi_tinh: z.string().describe("Giới tính của người được khai sinh"),
    dan_toc: z.string().describe("Dân tộc của người được khai sinh"),
    quoc_tich: z.string().describe("Quốc tịch của người được khai sinh"),
    noi_sinh: z.string().describe("Nơi sinh của người được khai sinh"),
    que_quan: z.string().describe("Quê quán của người được khai sinh"),
    ho_ten_cha: z.string().describe("Họ và tên cha"),
    dan_toc_cha: z.string().describe("Dân tộc của cha"),
    quoc_tich_cha: z.string().describe("Quốc tịch của cha"),
    noi_cu_tru_cha: z.string().describe("Nơi cư trú của cha"),
    ho_ten_me: z.string().describe("Họ và tên mẹ"),
    dan_toc_me: z.string().describe("Dân tộc của mẹ"),
    quoc_tich_me: z.string().describe("Quốc tịch của mẹ"),
    noi_cu_tru_me: z.string().describe("Nơi cư trú của mẹ"),
}).describe("Dữ liệu được trích xuất từ tờ khai đăng ký khai sinh. Điền tất cả các trường có thể tìm thấy trong ảnh. Nếu không tìm thấy thông tin cho một trường, hãy để trống chuỗi đó.");
export type FormData = z.infer<typeof FormDataSchema>;


const ExtractFormDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the filled-out birth registration form, as a public URL or a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractFormDataInput = z.infer<typeof ExtractFormDataInputSchema>;

const ExtractFormDataOutputSchema = z.object({
    formData: FormDataSchema
});
export type ExtractFormDataOutput = z.infer<typeof ExtractFormDataOutputSchema>;


export async function extractFormData(
  input: ExtractFormDataInput
): Promise<ExtractFormDataOutput> {
  return extractFormDataFlow(input);
}


const extractPrompt = ai.definePrompt({
    name: 'extractFormDataPrompt',
    input: { schema: ExtractFormDataInputSchema },
    output: { schema: ExtractFormDataOutputSchema },
    prompt: `You are an expert at extracting information from documents.
    Analyze the provided image of a Vietnamese birth registration form ("Tờ khai đăng ký khai sinh").
    Extract all the key information and return it as a structured JSON object.
    Pay close attention to field labels and the corresponding handwritten or typed values.

    Image of the form: {{media url=photoDataUri}}

    Extract the data and format it according to the output schema.
    `,
});


const extractFormDataFlow = ai.defineFlow(
  {
    name: 'extractFormDataFlow',
    inputSchema: ExtractFormDataInputSchema,
    outputSchema: ExtractFormDataOutputSchema,
  },
  async (input) => {
    const { output } = await extractPrompt(input);
    return output!;
  }
);
