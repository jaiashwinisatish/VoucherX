import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileImage, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

interface VoucherProofUploadProps {
  voucherId: string;
  currentProofUrl?: string;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
}

type UploadStatus = 'idle' | 'validating' | 'uploading' | 'success' | 'error';

export default function VoucherProofUpload({
  voucherId,
  currentProofUrl,
  onUploadComplete,
  onRemove,
}: VoucherProofUploadProps) {
  const [status, setStatus] = useState<UploadStatus>(currentProofUrl ? 'success' : 'idle');
  const [preview, setPreview] = useState<string | null>(currentProofUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a PNG, JPG, or PDF file.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 5 MB.`;
    }
    return null;
  };

  const handleFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      setStatus('validating');

      const validationError = validateFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        setStatus('error');
        return;
      }

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      setFileName(file.name);
      setStatus('uploading');
      setProgress(0);

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 150);

        const fileExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
        const filePath = `${voucherId}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('voucher-proofs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        clearInterval(progressInterval);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from('voucher-proofs').getPublicUrl(data.path);

        // Update the voucher record with the proof URL
        const { error: updateError } = await supabase
          .from('vouchers')
          .update({ proof_url: publicUrl })
          .eq('id', voucherId);

        if (updateError) throw updateError;

        setProgress(100);
        setStatus('success');
        onUploadComplete(publicUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
        setErrorMessage(message);
        setStatus('error');
        setProgress(0);
      }
    },
    [voucherId, onUploadComplete],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    setStatus('idle');
    setErrorMessage(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onRemove?.();
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Proof of Voucher
      </label>

      {/* Success state — show preview / file name */}
      {status === 'success' && (preview || fileName) && (
        <div className="relative bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            {preview ? (
              <img
                src={preview}
                alt="Voucher proof"
                className="w-16 h-16 object-cover rounded-lg border border-emerald-200"
              />
            ) : (
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FileImage className="h-7 w-7 text-emerald-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-emerald-800">Proof uploaded</span>
              </div>
              {fileName && (
                <p className="text-xs text-emerald-600 truncate mt-0.5">{fileName}</p>
              )}
            </div>
            <button
              onClick={handleRemove}
              className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
              title="Remove proof"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Uploading state */}
      {status === 'uploading' && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
            <span className="text-sm font-medium text-blue-800">
              Uploading{fileName ? ` ${fileName}` : ''}…
            </span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && errorMessage && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            <button
              onClick={() => {
                setStatus('idle');
                setErrorMessage(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 underline mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Idle / validating — drop zone */}
      {(status === 'idle' || status === 'validating') && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-teal-500 bg-teal-50'
              : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleInputChange}
            className="hidden"
          />
          <Upload
            className={`h-8 w-8 mx-auto mb-2 ${
              dragActive ? 'text-teal-600' : 'text-slate-400'
            }`}
          />
          <p className="text-sm font-medium text-slate-700">
            {dragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG, or PDF — max 5 MB</p>
        </div>
      )}
    </div>
  );
}
