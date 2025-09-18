'use client';

import { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormFieldConfig, UserInfo } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Loader2, Upload } from 'lucide-react';
import { extractFormData as extractFormDataAction } from '@/app/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';

const createZodSchema = (fields: FormFieldConfig[]) => {
  const schema: Record<string, z.ZodType<any, any>> = {};
  fields.forEach(field => {
    schema[field.id] = z.string().min(1, { message: `${field.label} là bắt buộc.` });
  });
  return z.object(schema);
};

interface RenderFieldProps {
  fieldConfig: FormFieldConfig;
}

const RenderField = ({ fieldConfig }: RenderFieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[fieldConfig.id];

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldConfig.id} className={error ? 'text-destructive' : ''}>
        {fieldConfig.label}
      </Label>
      <Input
        id={fieldConfig.id}
        {...register(fieldConfig.id)}
        placeholder={fieldConfig.placeholder}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-sm text-destructive">{error.message as string}</p>}
    </div>
  );
};


export default function OnlineForm({ 
    fields, 
    userInfo,
    onFormSubmit,
    isSubmitting,
}: { 
    fields: FormFieldConfig[];
    userInfo: UserInfo | null;
    onFormSubmit: (data: any) => void;
    isSubmitting: boolean;
}) {
  const formSchema = createZodSchema(fields);
  const { toast } = useToast();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const demoImageUrl = "https://www.dropbox.com/scl/fi/djr5uk00yly5pvc97818a/Birth-Cert-Original.jpg?rlkey=fopchhvk88a6w2ea21adcx6c0&raw=1";
  
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
        let value = '';
        if (userInfo) {
            if (field.id === 'ho_ten_nguoi_yeu_cau') value = userInfo.fullName;
            if (field.id === 'dia_chi_nguoi_yeu_cau') value = userInfo.address;
        }
        acc[field.id] = value;
        return acc;
    }, {} as Record<string, string>),
  });

  const { handleSubmit, reset } = methods;

  const processFileForExtraction = async (fileOrUrl: File | string) => {
    setIsExtracting(true);
    toast({
        title: 'Đang trích xuất thông tin...',
        description: 'AI đang đọc dữ liệu từ ảnh. Vui lòng đợi.',
    });

    try {
        let dataUri = '';
        if (typeof fileOrUrl === 'string') {
            const response = await fetch(fileOrUrl);
            const blob = await response.blob();
            dataUri = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } else {
            dataUri = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(fileOrUrl);
            });
        }

        const result = await extractFormDataAction({ photoDataUri: dataUri });
        reset(result.formData);
        toast({
            title: 'Trích xuất thành công!',
            description: 'Dữ liệu đã được điền vào biểu mẫu.',
        });

    } catch(error) {
        console.error('Extraction failed', error);
        toast({
            variant: 'destructive',
            title: 'Trích xuất thất bại',
            description: 'AI không thể đọc được thông tin từ hình ảnh này. Vui lòng thử lại.',
        });
    } finally {
        setIsExtracting(false);
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast({
            variant: 'destructive',
            title: 'Tệp không hợp lệ',
            description: 'Vui lòng chỉ tải lên tệp hình ảnh.',
        });
        return;
    }
    processFileForExtraction(file);
  }

  const handleUseDemoDocument = async () => {
    setDemoModalOpen(false);
    processFileForExtraction(demoImageUrl);
  }


  return (
    <>
    <Card className="w-full">
        <CardHeader>
            <CardTitle>Khai báo trực tuyến</CardTitle>
            <CardDescription>Điền thông tin vào biểu mẫu dưới đây hoặc tải ảnh chụp tờ khai đã điền sẵn để AI tự động điền.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-6">
                <Label htmlFor="photo-upload" className="w-full">
                     <Alert className="hover:bg-secondary/50 transition-colors cursor-pointer">
                        <Camera className="h-4 w-4" />
                        <AlertTitle>Dùng AI để điền tự động!</AlertTitle>
                        <AlertDescription>
                           Tải lên ảnh chụp tờ khai đã điền của bạn để trích xuất thông tin tự động.
                        </AlertDescription>
                    </Alert>
                </Label>
                <Input id="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoUpload} disabled={isExtracting}/>
                <div className="text-center mt-2">
                    <Button variant="link" size="sm" onClick={() => setDemoModalOpen(true)}>
                        Hoặc sử dụng tài liệu demo
                    </Button>
                </div>
            </div>
            {isExtracting && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground my-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>AI đang phân tích hình ảnh...</span>
                </div>
            )}
            <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map(field => <RenderField key={field.id} fieldConfig={field} />)}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || isExtracting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4"/>}
                    Xác nhận nộp tờ khai
                </Button>
            </form>
            </FormProvider>
        </CardContent>
    </Card>
    <Dialog open={isDemoModalOpen} onOpenChange={setDemoModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Tài liệu demo: Giấy khai sinh</DialogTitle>
                <DialogDescription>
                    Đây là một ảnh mẫu để trình diễn tính năng trích xuất thông tin tự động bằng AI.
                </DialogDescription>
            </DialogHeader>
            <div className="flex-grow relative overflow-y-auto -mx-6 px-6">
                <div className="relative aspect-[_7/10_] min-h-[500px]">
                    <Image 
                        src={demoImageUrl}
                        alt="Mock birth certificate" 
                        fill
                        className="object-contain rounded-md"
                    />
                </div>
            </div>
            <div className="flex-shrink-0 pt-4">
                <Button onClick={handleUseDemoDocument} disabled={isExtracting} className="w-full">
                    {isExtracting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                    Sử dụng ảnh này để điền tự động
                </Button>
            </div>
        </DialogContent>
    </Dialog>
    </>
  );
}
