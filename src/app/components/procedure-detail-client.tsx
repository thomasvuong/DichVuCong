'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import { ProcedureDetail, UserInfo } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FileText, User, Upload, CheckCircle, AlertCircle, Loader2, XCircle, Download, CircleDashed } from 'lucide-react';
import { mockUserInfo } from '@/app/lib/data';
import { validateDocuments, validateDocumentContentFlow } from '@/app/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type SubmissionStep = 'details' | 'upload' | 'confirm';

type FileStatus = {
    file: File | null;
    status: 'pending' | 'validating' | 'valid' | 'invalid';
    validationMessage: string | null;
}

export default function ProcedureDetailClient({ procedure }: { procedure: ProcedureDetail }) {
  const [step, setStep] = useState<SubmissionStep>('details');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>(
    procedure.requiredDocuments.reduce((acc, doc) => ({
      ...acc,
      [doc.id]: { file: null, status: 'pending', validationMessage: null }
    }), {})
  );
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, docId: string, requiredDocName: string) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      handleRemoveFile(docId);
      return;
    }
    
    // Check file type on client
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setFileStatuses(prev => ({
        ...prev,
        [docId]: { file, status: 'invalid', validationMessage: 'Loại tệp không hợp lệ. Chỉ chấp nhận PDF, JPG, PNG.' }
      }));
      return;
    }

    setFileStatuses(prev => ({
      ...prev,
      [docId]: { file, status: 'validating', validationMessage: 'Đang kiểm tra nội dung...' }
    }));

    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (event) => {
            const dataUri = event.target?.result as string;
            if (!dataUri) {
                 setFileStatuses(prev => ({
                    ...prev,
                    [docId]: { file, status: 'invalid', validationMessage: 'Không thể đọc tệp.' }
                }));
                return;
            }

            const validationResult = await validateDocumentContentFlow({
                requiredDocumentName: requiredDocName,
                documentDataUri: dataUri,
            });

            if (validationResult.isRelevant) {
                 setFileStatuses(prev => ({
                    ...prev,
                    [docId]: { file, status: 'valid', validationMessage: 'Tệp hợp lệ.' }
                }));
            } else {
                setFileStatuses(prev => ({
                    ...prev,
                    [docId]: { file, status: 'invalid', validationMessage: validationResult.reason || 'Nội dung tệp có vẻ không đúng yêu cầu.' }
                }));
            }
        };
    } catch (error) {
        console.error("Error during content validation:", error);
        setFileStatuses(prev => ({
            ...prev,
            [docId]: { file, status: 'invalid', validationMessage: 'Lỗi khi xác thực nội dung.' }
        }));
    }
  };

  const handleRemoveFile = (docId: string) => {
    setFileStatuses(prev => ({ ...prev, [docId]: { file: null, status: 'pending', validationMessage: null } }));
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId]!.value = '';
    }
  };

  const handleSubmitDocuments = async () => {
    // Check if all required documents have been uploaded and are valid
    const missingDocs = Object.entries(fileStatuses)
        .filter(([_, status]) => status.status !== 'valid')
        .map(([docId, _]) => procedure.requiredDocuments.find(d => d.id === docId)?.name)
        .filter(Boolean) as string[];

    if (missingDocs.length > 0) {
        toast({
            variant: 'destructive',
            title: 'Hồ sơ chưa hoàn tất',
            description: `Vui lòng tải lên và xác thực các giấy tờ sau: ${missingDocs.join(', ')}.`,
        });
        return;
    }
    
    setIsSubmitting(true);
    // Simulate final submission process
    await new Promise(res => setTimeout(res, 1000));
    setSubmissionRef(`DVC-${Date.now()}`);
    setStep('confirm');
    toast({
        title: 'Nộp hồ sơ thành công!',
        description: 'Hồ sơ của bạn đã được ghi nhận.',
    });
    setIsSubmitting(false);
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
                        {Object.values(fileStatuses).filter(f => f.file).map((status, i) => (
                            <li key={i} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground"/>
                                <span>{status.file!.name}</span>
                                <Badge variant="secondary" className="ml-auto">{(status.file!.size / 1024).toFixed(2)} KB</Badge>
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
    const allFilesValid = Object.values(fileStatuses).every(s => s.status === 'valid');
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Nộp hồ sơ cho: {procedure.title}</CardTitle>
                <CardDescription>Vui lòng tải lên các giấy tờ được yêu cầu bên dưới. Hệ thống sẽ dùng AI để kiểm tra nội dung tệp.</CardDescription>
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
                    <div key={doc.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                             <label htmlFor={doc.id} className="font-medium flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                {doc.name}
                            </label>
                            {doc.templateUrl && (
                                <Link href={doc.templateUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="link" size="sm" className="h-auto p-0">
                                        <Download className="mr-1 h-4 w-4" />
                                        Mẫu đơn
                                    </Button>
                                </Link>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                             <Input
                                id={doc.id}
                                type="file"
                                ref={el => fileInputRefs.current[doc.id] = el}
                                onChange={(e) => handleFileChange(e, doc.id, doc.name)}
                                className="flex-grow"
                                accept=".pdf,.jpg,.jpeg,.png"
                                disabled={fileStatuses[doc.id]?.status === 'validating'}
                            />
                        </div>
                         {fileStatuses[doc.id]?.status !== 'pending' && (
                            <div className="text-sm flex items-center gap-2 mt-2 p-2 bg-secondary/50 rounded-md">
                                {fileStatuses[doc.id].status === 'validating' && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />}
                                {fileStatuses[doc.id].status === 'valid' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {fileStatuses[doc.id].status === 'invalid' && <AlertCircle className="h-4 w-4 text-destructive" />}
                               <span className={`flex-grow ${fileStatuses[doc.id].status === 'invalid' ? 'text-destructive' : 'text-muted-foreground'}`}>
                                 {fileStatuses[doc.id].file?.name}
                               </span>
                               {fileStatuses[doc.id].status !== 'validating' && (
                                 <button onClick={() => handleRemoveFile(doc.id)} className="p-1 text-muted-foreground hover:text-destructive">
                                     <XCircle className="h-4 w-4" />
                                 </button>
                               )}
                            </div>
                        )}
                        {fileStatuses[doc.id]?.validationMessage && (
                            <p className={`text-xs ${
                                fileStatuses[doc.id].status === 'valid' ? 'text-green-600' :
                                fileStatuses[doc.id].status === 'invalid' ? 'text-destructive' : 'text-muted-foreground'
                            }`}>
                                {fileStatuses[doc.id].validationMessage}
                            </p>
                        )}
                    </div>
                ))}
                </div>
                <Button onClick={handleSubmitDocuments} disabled={isSubmitting || !allFilesValid} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4"/>}
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
                           <div>
                             <span>{doc.name}</span>
                              {doc.templateUrl && (
                                <Link href={doc.templateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-primary hover:underline">
                                    <Download className="mr-1 h-3 w-3" />
                                    Mẫu đơn, tờ khai mẫu
                                </Link>
                              )}
                           </div>
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
