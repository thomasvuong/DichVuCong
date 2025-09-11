'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ProcedureDetail, UserInfo, RequiredDocument } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FileText, User, Upload, CheckCircle, AlertCircle, Loader2, XCircle } from 'lucide-react';
import { mockUserInfo } from '@/app/lib/data';
import { validateDocuments } from '@/app/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type SubmissionStep = 'details' | 'upload' | 'confirm';

export default function ProcedureDetailClient({ procedure }: { procedure: ProcedureDetail }) {
  const [step, setStep] = useState<SubmissionStep>('details');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionRef, setSubmissionRef] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleStartSubmission = () => {
    setLoginModalOpen(true);
  };

  const handleLogin = () => {
    setUserInfo(mockUserInfo);
    setLoginModalOpen(false);
    setStep('upload');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0] || null;
    setUploadedFiles(prev => ({ ...prev, [docId]: file }));
  };

  const handleRemoveFile = (docId: string) => {
    setUploadedFiles(prev => ({ ...prev, [docId]: null }));
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId]!.value = '';
    }
  };

  const handleSubmitDocuments = async () => {
    setIsSubmitting(true);
    const uploadedDocumentNames = Object.values(uploadedFiles)
      .filter((file): file is File => file !== null)
      .map(file => file.name);
      
    const requiredDocumentNames = procedure.requiredDocuments.map(doc => doc.name);

    try {
      const validationResult = await validateDocuments({
        requiredDocuments: requiredDocumentNames,
        uploadedDocuments: uploadedDocumentNames,
      });

      if (validationResult.isValid) {
        setSubmissionRef(`DVC-${Date.now()}`);
        setStep('confirm');
        toast({
          title: 'Nộp hồ sơ thành công!',
          description: 'Hồ sơ của bạn đã được ghi nhận.',
        });
      } else {
        let description = 'Vui lòng kiểm tra lại hồ sơ.';
        if (validationResult.missingDocuments && validationResult.missingDocuments.length > 0) {
            description = `Thiếu các giấy tờ sau: ${validationResult.missingDocuments.join(', ')}.`;
        } else if (validationResult.incorrectFileType && validationResult.incorrectFileType.length > 0) {
          description = `Tệp không hợp lệ: ${validationResult.incorrectFileType.join(', ')}. Chỉ chấp nhận tệp PDF, JPG, PNG.`;
        }
        
        toast({
          variant: 'destructive',
          title: 'Hồ sơ không hợp lệ',
          description,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
          variant: 'destructive',
          title: 'Đã có lỗi xảy ra',
          description: 'Không thể nộp hồ sơ. Vui lòng thử lại.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderDetailItem = (label: string, value: string) => (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 font-medium">{value}</dd>
    </div>
  );

  if (step === 'confirm' && submissionRef) {
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <CardTitle className="text-2xl">Nộp Hồ Sơ Thành Công</CardTitle>
                <CardDescription>Hồ sơ của bạn đã được gửi đi và đang chờ xử lý.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 bg-secondary rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Mã tham chiếu hồ sơ của bạn</p>
                    <p className="text-xl font-bold tracking-wider">{submissionRef}</p>
                </div>
                <Separator/>
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Thông tin người nộp</h3>
                    {userInfo && (
                        <dl className="space-y-2 text-sm">
                            {renderDetailItem("Họ và tên", userInfo.fullName)}
                            {renderDetailItem("Số CCCD", userInfo.idNumber)}
                            {renderDetailItem("Ngày sinh", userInfo.dateOfBirth)}
                            {renderDetailItem("Địa chỉ", userInfo.address)}
                        </dl>
                    )}
                </div>
                <Separator/>
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Giấy tờ đã nộp</h3>
                     <ul className="space-y-2">
                        {Object.values(uploadedFiles).filter(f => f).map((file, i) => (
                            <li key={i} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground"/>
                                <span>{file!.name}</span>
                                <Badge variant="secondary" className="ml-auto">{(file!.size / 1024).toFixed(2)} KB</Badge>
                            </li>
                        ))}
                    </ul>
                </div>
                <Button onClick={() => window.location.reload()} className="w-full">Hoàn tất</Button>
            </CardContent>
        </Card>
    )
  }

  if (step === 'upload') {
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Nộp hồ sơ cho: {procedure.title}</CardTitle>
                <CardDescription>Vui lòng tải lên các giấy tờ được yêu cầu bên dưới.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {userInfo && (
                     <Card>
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <User className="h-8 w-8 text-primary"/>
                            <div>
                                <h3 className="font-semibold">{userInfo.fullName}</h3>
                                <p className="text-sm text-muted-foreground">CCCD: {userInfo.idNumber}</p>
                            </div>
                        </CardHeader>
                    </Card>
                 )}
                <div className="space-y-4">
                <h3 className="font-semibold text-lg">Giấy tờ cần nộp</h3>
                {procedure.requiredDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-lg space-y-2">
                        <label htmlFor={doc.id} className="font-medium flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            {doc.name}
                        </label>
                        <div className="flex items-center gap-4">
                             <Input
                                id={doc.id}
                                type="file"
                                ref={el => fileInputRefs.current[doc.id] = el}
                                onChange={(e) => handleFileChange(e, doc.id)}
                                className="flex-grow"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </div>
                        {uploadedFiles[doc.id] && (
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2 p-2 bg-secondary/50 rounded-md">
                               <CheckCircle className="h-4 w-4 text-green-500" />
                               <span className="flex-grow">{uploadedFiles[doc.id]?.name}</span>
                               <button onClick={() => handleRemoveFile(doc.id)} className="p-1 text-muted-foreground hover:text-destructive">
                                 <XCircle className="h-4 w-4" />
                               </button>
                            </div>
                        )}
                    </div>
                ))}
                </div>
                <Button onClick={handleSubmitDocuments} disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Xác nhận nộp hồ sơ
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{procedure.agency}</Badge>
                    <CardTitle className="text-3xl">{procedure.title}</CardTitle>
                    <CardDescription className="text-base">{procedure.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Separator />
                    <dl className="space-y-4">
                        {renderDetailItem("Trình tự thực hiện", procedure.procedure)}
                        {renderDetailItem("Cách thức thực hiện", procedure.submissionMethod)}
                        {renderDetailItem("Thời hạn giải quyết", procedure.processingTime)}
                        {renderDetailItem("Phí, lệ phí", procedure.fee)}
                    </dl>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Giấy tờ phải nộp</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {procedure.requiredDocuments.map(doc => (
                        <li key={doc.id} className="flex items-start gap-3">
                            <FileText className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                            <span>{doc.name}</span>
                        </li>
                        ))}
                    </ul>
                    <Button onClick={handleStartSubmission} className="w-full mt-6">
                        <Upload className="mr-2 h-4 w-4" />
                        Nộp hồ sơ
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
      <Dialog open={isLoginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
                <DialogDescription>
                    Bạn cần đăng nhập bằng tài khoản VNeID để có thể nộp hồ sơ trực tuyến.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center">
                <Button onClick={handleLogin} size="lg">
                    <User className="mr-2 h-4 w-4" />
                    Đăng nhập bằng VNeID (Demo)
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
