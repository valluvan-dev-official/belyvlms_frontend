import { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
    Upload,
    FileSpreadsheet,
    X,
    CheckCircle2,
    AlertCircle,
    Download,
    FileText,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface BulkUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUploadComplete?: () => void;
}

interface ValidationRow {
    row: number;
    data: any;
    errors: string[];
    status: 'valid' | 'error';
}

export function BulkUploadModal({ open, onOpenChange, onUploadComplete }: BulkUploadModalProps) {
    const [step, setStep] = useState<'upload' | 'validating' | 'preview' | 'uploading' | 'complete'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [validationData, setValidationData] = useState<ValidationRow[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0 && files[0].type === 'text/csv') {
            setFile(files[0]);
        } else {
            toast.error("Please upload a valid CSV file");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const simulateValidation = () => {
        setStep('validating');
        let p = 0;
        const interval = setInterval(() => {
            p += 10;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                // Mock validation results
                setValidationData([
                    { row: 1, data: { name: 'John Doe', email: 'john@example.com', role: 'admin' }, errors: [], status: 'valid' },
                    { row: 2, data: { name: 'Jane Smith', email: 'jane@example.com', role: 'student' }, errors: [], status: 'valid' },
                    { row: 3, data: { name: 'Bob Wilson', email: 'bob', role: 'manager' }, errors: ['Invalid email format', 'Role does not exist'], status: 'error' },
                ]);
                setStep('preview');
                setProgress(0);
            }
        }, 200);
    };

    const handleUpload = () => {
        setStep('uploading');
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setStep('complete');
                toast.success("Users imported successfully");
                onUploadComplete?.();
            }
        }, 100);
    };

    const reset = () => {
        setFile(null);
        setStep('upload');
        setProgress(0);
        setValidationData([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const validCount = validationData.filter(r => r.status === 'valid').length;
    const errorCount = validationData.filter(r => r.status === 'error').length;

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) reset();
            onOpenChange(val);
        }}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Bulk User Upload</DialogTitle>
                    <DialogDescription>Import multiple users via CSV file</DialogDescription>
                </DialogHeader>

                <div className="min-h-[300px] flex flex-col">
                    {step === 'upload' && (
                        <div
                            className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />

                            {file ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileSpreadsheet size={32} />
                                    </div>
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500 mb-4">{(file.size / 1024).toFixed(2)} KB</p>
                                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                                        Remove File
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Upload size={32} />
                                    </div>
                                    <p className="font-semibold text-gray-900 text-lg mb-1">Click to upload or drag and drop</p>
                                    <p className="text-sm text-gray-500 mb-6">CSV files only (max 5MB)</p>
                                    <div className="flex justify-center gap-4">
                                        <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                                            <Download size={14} className="mr-2" />
                                            Download Template
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'validating' && (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <Loader2 size={40} className="text-blue-600 animate-spin" />
                            <div className="text-center space-y-2">
                                <p className="font-medium">Validating file contents...</p>
                                <Progress value={progress} className="w-[300px]" />
                            </div>
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Total Rows</p>
                                    <p className="text-2xl font-bold text-gray-900">{validationData.length}</p>
                                </div>
                                <div className="w-px h-10 bg-gray-200" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Valid</p>
                                    <p className="text-2xl font-bold text-green-600">{validCount}</p>
                                </div>
                                <div className="w-px h-10 bg-gray-200" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Errors</p>
                                    <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                                </div>
                            </div>

                            {errorCount > 0 && (
                                <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex gap-2 text-sm text-red-700">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <p>Found {errorCount} rows with errors. These rows will be skipped during import.</p>
                                </div>
                            )}

                            <div className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium text-gray-500">Row</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-500">Data Preview</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {validationData.map((row) => (
                                            <tr key={row.row} className={row.status === 'error' ? 'bg-red-50/30' : ''}>
                                                <td className="px-4 py-2 text-gray-500">#{row.row}</td>
                                                <td className="px-4 py-2">
                                                    <div className="font-medium">{row.data.name}</div>
                                                    <div className="text-xs text-gray-500">{row.data.email}</div>
                                                    {row.errors.length > 0 && (
                                                        <div className="text-xs text-red-600 mt-1">
                                                            {row.errors.join(', ')}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {row.status === 'valid' ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                            Valid
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                            Error
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {step === 'uploading' && (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <Upload size={40} className="text-blue-600 animate-bounce" />
                            <div className="text-center space-y-2">
                                <p className="font-medium">Importing users...</p>
                                <Progress value={progress} className="w-[300px]" />
                            </div>
                        </div>
                    )}

                    {step === 'complete' && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Import Successful</h3>
                                <p className="text-gray-500 mt-1">successfully imported {validCount} users.</p>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Button variant="outline" onClick={reset}>Upload Another</Button>
                                <Button onClick={() => onOpenChange(false)}>Close</Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-6">
                    {step === 'upload' && (
                        <Button onClick={simulateValidation} disabled={!file}>
                            Continue to Validate
                        </Button>
                    )}
                    {step === 'preview' && (
                        <div className="flex justify-between w-full">
                            <Button variant="ghost" onClick={reset}>Cancel</Button>
                            <Button onClick={handleUpload} disabled={validCount === 0}>
                                Import {validCount} Users
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
