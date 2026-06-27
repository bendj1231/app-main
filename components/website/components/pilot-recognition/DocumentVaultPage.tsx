import React, { useState, useRef, useEffect, useCallback } from 'react';
import { safeRedirect } from '@/lib/url-validator';
import { supabase } from '../../@/lib/supabase';
import { useAccountTier } from '../../@/hooks/useAccountTier';
import { 
  Upload, FileText, Check, AlertCircle, X, Camera, FileCheck, Shield, 
  Lock, Clock, History, ChevronRight, FileDigit, Stethoscope, Plane, 
  BookOpen, File as FileIcon, Scan, HardDrive, Fingerprint, Star,
  AlertTriangle
} from 'lucide-react';

interface DocumentVaultPageProps {
  onBack: () => void;
  onViewAtlasCV?: () => void;
  userProfile?: {
    id?: string;
    firstName?: string;
    lastName?: string;
  } | null;
}

interface UploadedDocument {
  id: string;
  type: 'license' | 'medical' | 'rating' | 'logbook' | 'other';
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  status: 'uploading' | 'processing' | 'verified' | 'rejected' | 'pending_review';
  extractedData?: {
    licenseNumber?: string;
    expiryDate?: string;
    issueDate?: string;
    issuingAuthority?: string;
  };
  verificationNotes?: string;
}

interface VerificationHistory {
  id: string;
  date: Date;
  action: string;
  documentType: string;
  status: string;
}

const DOCUMENT_TYPES = [
  { 
    value: 'license', 
    label: 'PILOT LICENSE', 
    icon: FileDigit, 
    description: 'CPL, ATPL, PPL certificate',
    format: 'Required: Part-FCL or FAA Form 8060',
    accent: '#dc2626'
  },
  { 
    value: 'medical', 
    label: 'MEDICAL CERTIFICATE', 
    icon: Stethoscope, 
    description: 'Class 1, 2, or 3 medical',
    format: 'Required: ICAO/EASA Medical Form',
    accent: '#059669'
  },
  { 
    value: 'rating', 
    label: 'TYPE RATING', 
    icon: Plane, 
    description: 'A320, B737, etc.',
    format: 'Required: ATO Completion Certificate',
    accent: '#2563eb'
  },
  { 
    value: 'logbook', 
    label: 'FLIGHT LOGBOOK', 
    icon: BookOpen, 
    description: 'Digital or scanned pages',
    format: 'Supported: PDF, JPG (max 50 pages)',
    accent: '#7c3aed'
  },
  { 
    value: 'other', 
    label: 'OTHER DOCUMENT', 
    icon: FileIcon, 
    description: 'Training certificates, etc.',
    format: 'Supported: PDF, JPG, PNG',
    accent: '#6b7280'
  }
];

const CORPORATE_BLUE = '#003366';
const EMERALD = '#10b981';
const SLATE = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a'
};

export const DocumentVaultPage: React.FC<DocumentVaultPageProps> = ({ onBack, onViewAtlasCV, userProfile }) => {
  const { isRecognitionPlus, tier, loading: tierLoading } = useAccountTier(userProfile?.id);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [showOCRConfirm, setShowOCRConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<VerificationHistory[]>([]);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const loadDocuments = useCallback(async () => {
    if (!userProfile?.id) return;
    const { data } = await supabase
      .from('pilot_documents')
      .select('*')
      .eq('pilot_id', userProfile.id)
      .order('uploaded_at', { ascending: false });
    if (data) {
      const mapped: UploadedDocument[] = data.map((d: Record<string, unknown>) => ({
        id: d.id as string,
        type: d.doc_type as UploadedDocument['type'],
        fileName: d.file_name as string,
        fileSize: (d.file_size_bytes as number) ?? 0,
        uploadDate: new Date(d.uploaded_at as string),
        status: (d.status as UploadedDocument['status']) === 'pending_review' ? 'pending_review'
          : (d.status as UploadedDocument['status']),
        extractedData: (d.extracted_license_number || d.extracted_expiry_date) ? {
          licenseNumber: d.extracted_license_number as string | undefined,
          expiryDate: d.extracted_expiry_date as string | undefined,
          issueDate: d.extracted_issue_date as string | undefined,
          issuingAuthority: d.extracted_issuing_authority as string | undefined,
        } : undefined,
        verificationNotes: d.admin_notes as string | undefined,
      }));
      setDocuments(mapped);
      setLastSync(new Date());
      const verified = mapped.filter(d => d.status === 'verified');
      setHistory(verified.map(d => ({
        id: d.id,
        date: d.uploadDate,
        action: `${DOCUMENT_TYPES.find(t => t.value === d.type)?.label ?? d.type} Verified`,
        documentType: DOCUMENT_TYPES.find(t => t.value === d.type)?.label ?? d.type,
        status: 'Verified',
      })));
    }
  }, [userProfile?.id]);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && selectedDocType) {
      processFile(files[0], selectedDocType);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedDocType) {
      processFile(file, selectedDocType);
      setShowUploadModal(false);
    }
  };

  const processFile = async (file: File, docType: string) => {
    if (!userProfile?.id) return;
    const tempId = Date.now().toString();
    const newDoc: UploadedDocument = {
      id: tempId,
      type: docType as UploadedDocument['type'],
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date(),
      status: 'uploading',
    };
    setDocuments(prev => [...prev, newDoc]);

    try {
      const ext = file.name.split('.').pop() ?? 'bin';
      const storagePath = `${userProfile.id}/${docType}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('pilot-documents')
        .upload(storagePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      setDocuments(prev => prev.map(d => d.id === tempId ? { ...d, status: 'processing' } : d));

      const { data: row, error: dbError } = await supabase
        .from('pilot_documents')
        .insert({
          pilot_id: userProfile.id,
          doc_type: docType,
          file_name: file.name,
          file_size_bytes: file.size,
          storage_path: storagePath,
          storage_bucket: 'pilot-documents',
          status: 'pending_review',
        })
        .select('id')
        .single();

      if (dbError) throw dbError;

      setDocuments(prev => prev.map(d =>
        d.id === tempId ? { ...d, id: row.id, status: 'pending_review' } : d
      ));
      setLastSync(new Date());
    } catch (err) {
      console.error('Upload failed:', err);
      setDocuments(prev => prev.filter(d => d.id !== tempId));
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getStatusIcon = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'uploading':
        return <div style={{ width: '20px', height: '20px', border: '2px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />;
      case 'processing':
        return <div style={{ width: '20px', height: '20px', border: '2px solid #e5e7eb', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />;
      case 'verified':
        return <Check style={{ width: '20px', height: '20px', color: '#10b981' }} />;
      case 'rejected':
        return <X style={{ width: '20px', height: '20px', color: '#ef4444' }} />;
      case 'pending_review':
        return <AlertCircle style={{ width: '20px', height: '20px', color: '#f59e0b' }} />;
    }
  };

  const getStatusText = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing OCR...';
      case 'verified': return 'Verified';
      case 'rejected': return 'Rejected';
      case 'pending_review': return 'Pending Review';
    }
  };

  const getStatusColor = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'uploading': return '#2563eb';
      case 'processing': return '#f59e0b';
      case 'verified': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending_review': return '#f59e0b';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const pendingCount = documents.filter(d => d.status === 'pending_review').length;
  const totalCount = documents.length;
  
  const selectedTypeInfo = DOCUMENT_TYPES.find(t => t.value === selectedDocType);
  const SelectedIcon = selectedTypeInfo?.icon || FileDigit;

  return (
    <div style={{ minHeight: '100vh', background: SLATE[100], fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: `1px solid ${SLATE[200]}`, padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: SLATE[600],
              fontWeight: 500,
              letterSpacing: '0.025em'
            }}
          >
            ← BACK TO PROFILE
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield style={{ width: '20px', height: '20px', color: EMERALD }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: SLATE[800], letterSpacing: '0.05em' }}>
              SECURE DOCUMENT VAULT
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: SLATE[500] }}>
            <Clock style={{ width: '14px', height: '14px' }} />
            <span>LAST SYNC: {lastSync.toLocaleTimeString()}</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Status Control Panel */}
        <div style={{ 
          background: 'white', 
          border: `1px solid ${SLATE[200]}`,
          borderRadius: '8px',
          padding: '1.25rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.625rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Total Documents
              </p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '1.75rem', fontWeight: 700, color: SLATE[700], fontFamily: 'JetBrains Mono, monospace' }}>
                {totalCount.toString().padStart(2, '0')}
              </p>
            </div>
            <div style={{ width: '1px', height: '40px', background: SLATE[200] }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.625rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Verified
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <Shield style={{ width: '16px', height: '16px', color: EMERALD }} />
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: EMERALD, fontFamily: 'JetBrains Mono, monospace' }}>
                  {verifiedCount.toString().padStart(2, '0')}
                </p>
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: SLATE[200] }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.625rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Pending Review
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <Clock style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace' }}>
                  {pendingCount.toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
          
          {totalCount > 0 && onViewAtlasCV && (
            <button
              onClick={onViewAtlasCV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: CORPORATE_BLUE,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.025em'
              }}
            >
              VIEW ATLAS CV
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          )}
        </div>

        {/* Document Type Grid */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Select Document Type
            </p>
            {!isRecognitionPlus && !tierLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', background: '#fef3c7', borderRadius: '4px', border: '1px solid #fbbf24' }}>
                <Star style={{ width: '14px', height: '14px', color: '#d97706' }} />
                <span style={{ fontSize: '0.625rem', color: '#92400e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recognition+ Required for Uploads
                </span>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {DOCUMENT_TYPES.map(type => {
              const Icon = type.icon;
              const isSelected = selectedDocType === type.value;
              const hasUpload = documents.some(d => d.type === type.value);
              
              return (
                <button
                  key={type.value}
                  onClick={() => {
                    setSelectedDocType(type.value);
                    if (isRecognitionPlus) {
                      setShowUploadModal(true);
                    } else {
                      setShowUpgradePrompt(true);
                    }
                  }}
                  style={{
                    padding: '1.25rem',
                    border: `1px solid ${isSelected ? type.accent : SLATE[200]}`,
                    borderLeft: `4px solid ${isSelected ? type.accent : 'transparent'}`,
                    borderRadius: '6px',
                    background: isSelected ? SLATE[50] : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                    opacity: hasUpload || isRecognitionPlus ? 1 : 0.7
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <Icon style={{ width: '20px', height: '20px', color: type.accent, strokeWidth: 1.5 }} />
                    {hasUpload && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: EMERALD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check style={{ width: '12px', height: '12px', color: 'white' }} />
                      </div>
                    )}
                    {!hasUpload && !isRecognitionPlus && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star style={{ width: '12px', height: '12px', color: '#d97706' }} />
                      </div>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: SLATE[800], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {type.label}
                  </p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.625rem', color: SLATE[500], lineHeight: 1.4 }}>
                    {isRecognitionPlus ? type.format : 'Recognition+ required for upload'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload Terminal */}
        <div style={{ background: 'white', border: `1px solid ${SLATE[200]}`, borderRadius: '8px', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${SLATE[200]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Scan style={{ width: '18px', height: '18px', color: SLATE[600], strokeWidth: 1.5 }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: SLATE[700], textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                {selectedDocType ? `Upload ${selectedTypeInfo?.label}` : 'Select Document Type Above'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', background: SLATE[100], borderRadius: '4px' }}>
              <Lock style={{ width: '12px', height: '12px', color: SLATE[500] }} />
              <span style={{ fontSize: '0.625rem', color: SLATE[600], fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SSL 256-bit Encrypted
              </span>
            </div>
          </div>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => selectedDocType && setShowUploadModal(true)}
            style={{
              border: `1px solid ${isDragging ? CORPORATE_BLUE : SLATE[200]}`,
              borderRadius: '6px',
              margin: '1.5rem',
              padding: '3rem',
              textAlign: 'center',
              background: isDragging ? SLATE[50] : 'white',
              transition: 'all 0.15s',
              cursor: selectedDocType ? 'pointer' : 'not-allowed'
            }}
          >
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              background: SLATE[100], 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              {selectedDocType ? (
                <SelectedIcon style={{ width: '24px', height: '24px', color: CORPORATE_BLUE, strokeWidth: 1.5 }} />
              ) : (
                <Upload style={{ width: '24px', height: '24px', color: SLATE[400], strokeWidth: 1.5 }} />
              )}
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: selectedDocType ? SLATE[700] : SLATE[400], textTransform: 'uppercase', letterSpacing: '0.025em' }}>
              {selectedDocType ? `DROP ${selectedTypeInfo?.label} HERE` : 'SELECT DOCUMENT TYPE'}
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: SLATE[500] }}>
              {selectedDocType ? 'or click to browse files (PDF, JPG, PNG • max 10MB)' : 'Choose a category above to begin upload'}
            </p>
          </div>
        </div>

        {/* Documents List */}
        {documents.length > 0 && (
          <div style={{ background: 'white', border: `1px solid ${SLATE[200]}`, borderRadius: '8px', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${SLATE[200]}` }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Uploaded Documents
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {documents.map((doc, index) => {
                const TypeIcon = DOCUMENT_TYPES.find(t => t.value === doc.type)?.icon || FileDigit;
                const typeInfo = DOCUMENT_TYPES.find(t => t.value === doc.type);
                
                return (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1.25rem 1.5rem',
                      borderBottom: index < documents.length - 1 ? `1px solid ${SLATE[100]}` : 'none',
                      background: 'white'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      background: SLATE[50],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${SLATE[200]}`
                    }}>
                      <TypeIcon style={{ width: '20px', height: '20px', color: typeInfo?.accent || SLATE[600], strokeWidth: 1.5 }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: SLATE[800], fontFamily: 'JetBrains Mono, monospace' }}>
                          {doc.fileName}
                        </span>
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          background: doc.status === 'verified' ? '#d1fae5' : doc.status === 'pending_review' ? '#fef3c7' : SLATE[100],
                          color: doc.status === 'verified' ? '#065f46' : doc.status === 'pending_review' ? '#92400e' : SLATE[600]
                        }}>
                          {getStatusText(doc.status)}
                        </span>
                        {doc.status === 'pending_review' && (
                          <span style={{ fontSize: '0.625rem', color: SLATE[500] }}>
                            • 24-48h turnaround
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: SLATE[500] }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatFileSize(doc.fileSize)}</span>
                        <span>•</span>
                        <span>{typeInfo?.label}</span>
                        <span>•</span>
                        <span>{doc.uploadDate.toLocaleDateString()}</span>
                      </div>

                      {/* OCR Extracted Data */}
                      {doc.extractedData && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: SLATE[50], borderRadius: '6px', border: `1px solid ${SLATE[200]}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Fingerprint style={{ width: '14px', height: '14px', color: SLATE[500] }} />
                            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: SLATE[600], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              OCR Extracted Data
                            </span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                            {doc.extractedData.licenseNumber && (
                              <div>
                                <span style={{ fontSize: '0.625rem', color: SLATE[500], textTransform: 'uppercase' }}>License #</span>
                                <p style={{ margin: '0.125rem 0 0', fontSize: '0.875rem', fontWeight: 600, color: SLATE[800], fontFamily: 'JetBrains Mono, monospace' }}>
                                  {doc.extractedData.licenseNumber}
                                </p>
                              </div>
                            )}
                            {doc.extractedData.expiryDate && (
                              <div>
                                <span style={{ fontSize: '0.625rem', color: SLATE[500], textTransform: 'uppercase' }}>Expiry</span>
                                <p style={{ margin: '0.125rem 0 0', fontSize: '0.875rem', fontWeight: 600, color: SLATE[800], fontFamily: 'JetBrains Mono, monospace' }}>
                                  {doc.extractedData.expiryDate}
                                </p>
                              </div>
                            )}
                          </div>
                          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                            <button style={{ padding: '0.375rem 0.75rem', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: EMERALD, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                              Confirm Accurate
                            </button>
                            <button style={{ padding: '0.375rem 0.75rem', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'white', color: SLATE[600], border: `1px solid ${SLATE[300]}`, borderRadius: '4px', cursor: 'pointer' }}>
                              Edit Data
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {getStatusIcon(doc.status)}
                      <button
                        onClick={() => removeDocument(doc.id)}
                        style={{
                          padding: '0.5rem',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          opacity: 0.4,
                          transition: 'opacity 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
                      >
                        <X style={{ width: '18px', height: '18px', color: SLATE[500] }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State with Guide */}
        {totalCount === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <HardDrive style={{ width: '48px', height: '48px', color: SLATE[300], strokeWidth: 1 }} />
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: SLATE[500] }}>
                No documents uploaded yet
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: SLATE[400] }}>
                Select a document type above to begin
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: SLATE[400] }}>
                <span style={{ fontSize: '0.75rem' }}>Get Started</span>
                <ChevronRight style={{ width: '16px', height: '16px', transform: 'rotate(90deg)' }} />
              </div>
            </div>
          </div>
        )}

        {/* Verification Tiers */}
        <div style={{ background: 'white', border: `1px solid ${SLATE[200]}`, borderRadius: '8px', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${SLATE[200]}` }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Verification Tiers
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
            {/* Self-Reported - Grayed Out */}
            <div style={{ padding: '1.25rem', background: SLATE[50], borderRadius: '6px', border: `1px solid ${SLATE[200]}`, opacity: 0.7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <FileText style={{ width: '18px', height: '18px', color: SLATE[400], strokeWidth: 1.5 }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Self-Reported
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: SLATE[500], lineHeight: 1.5 }}>
                Manual data entry. Visible as "Pending" on ATLAS CV until verified.
              </p>
            </div>

            {/* Upload Verified - Blue Accent */}
            <div style={{ padding: '1.25rem', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <FileCheck style={{ width: '18px', height: '18px', color: '#2563eb', strokeWidth: 1.5 }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Upload Verified
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: SLATE[600], lineHeight: 1.5 }}>
                Document uploaded with OCR extraction. Shows as "Document Uploaded" on ATLAS CV.
              </p>
            </div>

            {/* Third-Party Verified - Premium Emerald */}
            <div style={{ 
              padding: '1.25rem', 
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', 
              borderRadius: '6px', 
              border: `1px solid ${EMERALD}`,
              boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '0.75rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Shield style={{ width: '18px', height: '18px', color: EMERALD, strokeWidth: 1.5 }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Third-Party Verified
                  </span>
                </div>
                <span style={{ 
                  padding: '0.125rem 0.5rem', 
                  background: EMERALD, 
                  color: 'white', 
                  fontSize: '0.625rem', 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRadius: '4px'
                }}>
                  Recommended
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: SLATE[600], lineHeight: 1.5 }}>
                <strong>Gold Standard:</strong> Guaranteed for Airline Recruitment. Veremark background check with green "Verified" badge on ATLAS CV.
              </p>
              <button style={{ 
                marginTop: '1rem', 
                width: '100%',
                padding: '0.625rem 1rem', 
                background: EMERALD, 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                fontSize: '0.75rem', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
              }}>
                Request Verification — $15
              </button>
            </div>
          </div>
        </div>

        {/* Verification History Log */}
        {history.length > 0 && (
          <div style={{ background: 'white', border: `1px solid ${SLATE[200]}`, borderRadius: '8px' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${SLATE[200]}`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History style={{ width: '16px', height: '16px', color: SLATE[500] }} />
              <p style={{ margin: 0, fontSize: '0.75rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Verification History
              </p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: SLATE[50] }}>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.625rem', fontWeight: 700, color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${SLATE[200]}` }}>Date</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.625rem', fontWeight: 700, color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${SLATE[200]}` }}>Action</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.625rem', fontWeight: 700, color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${SLATE[200]}` }}>Document</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.625rem', fontWeight: 700, color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${SLATE[200]}` }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={item.id} style={{ background: index % 2 === 0 ? 'white' : SLATE[50] }}>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', color: SLATE[600], fontFamily: 'JetBrains Mono, monospace', borderBottom: `1px solid ${SLATE[100]}` }}>
                      {item.date.toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', color: SLATE[700], borderBottom: `1px solid ${SLATE[100]}` }}>
                      {item.action}
                    </td>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', color: SLATE[600], borderBottom: `1px solid ${SLATE[100]}` }}>
                      {item.documentType}
                    </td>
                    <td style={{ padding: '0.75rem 1.5rem', borderBottom: `1px solid ${SLATE[100]}` }}>
                      <span style={{ 
                        padding: '0.125rem 0.5rem', 
                        fontSize: '0.625rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        borderRadius: '4px',
                        background: item.status === 'Verified' ? '#d1fae5' : '#fef3c7',
                        color: item.status === 'Verified' ? '#065f46' : '#92400e'
                      }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Upload Modal - Swiss Design */}
      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '8px', maxWidth: '420px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ padding: '1.5rem', borderBottom: `1px solid ${SLATE[200]}` }}>
              <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: SLATE[800], textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                Upload {selectedTypeInfo?.label}
              </h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: SLATE[500] }}>
                {selectedTypeInfo?.format}
              </p>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '1.25rem',
                    border: `1px solid ${SLATE[200]}`,
                    borderRadius: '6px',
                    background: SLATE[50],
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s'
                  }}
                >
                  <HardDrive style={{ width: '24px', height: '24px', color: SLATE[600], marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: SLATE[700], textTransform: 'uppercase', letterSpacing: '0.025em' }}>Browse</p>
                </button>
                <button
                  style={{
                    padding: '1.25rem',
                    border: `1px solid ${SLATE[200]}`,
                    borderRadius: '6px',
                    background: SLATE[50],
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <Camera style={{ width: '24px', height: '24px', color: SLATE[600], marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: SLATE[700], textTransform: 'uppercase', letterSpacing: '0.025em' }}>Camera</p>
                </button>
              </div>

              <div style={{ marginTop: '1rem', padding: '0.75rem', background: SLATE[50], borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock style={{ width: '14px', height: '14px', color: SLATE[400] }} />
                <span style={{ fontSize: '0.625rem', color: SLATE[500] }}>All uploads are encrypted and stored securely</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${SLATE[200]}`, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'transparent',
                  color: SLATE[600],
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Prompt Modal - Free Users */}
      {showUpgradePrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '8px', maxWidth: '420px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ padding: '1.5rem', borderBottom: `1px solid ${SLATE[200]}`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star style={{ width: '20px', height: '20px', color: '#d97706' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: SLATE[800], textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                  Recognition+ Required
                </h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: SLATE[500] }}>
                  Document uploads are a premium feature
                </p>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: SLATE[600], lineHeight: 1.5 }}>
                Free users can claim their profile by entering text data. To upload and verify official documents (license, medical, ratings), upgrade to <strong>Recognition+</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: SLATE[50], borderRadius: '4px' }}>
                  <Check style={{ width: '16px', height: '16px', color: EMERALD }} />
                  <span style={{ fontSize: '0.75rem', color: SLATE[600] }}>Upload license, medical, and rating documents</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: SLATE[50], borderRadius: '4px' }}>
                  <Check style={{ width: '16px', height: '16px', color: EMERALD }} />
                  <span style={{ fontSize: '0.75rem', color: SLATE[600] }}>OCR extraction with admin verification</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: SLATE[50], borderRadius: '4px' }}>
                  <Check style={{ width: '16px', height: '16px', color: EMERALD }} />
                  <span style={{ fontSize: '0.75rem', color: SLATE[600] }}>Verified badges on ATLAS CV</span>
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe', marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: SLATE[600], textAlign: 'center' }}>
                  <strong>Alternative:</strong> Use the <em>Pilot Licensure & Experience Data Entry</em> page to enter your credentials as text (free tier).
                </p>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${SLATE[200]}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowUpgradePrompt(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'transparent',
                  color: SLATE[600],
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => safeRedirect('/recognition-plus')}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: '#d97706',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                Upgrade to Recognition+
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DocumentVaultPage;
