import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';
import { ApplicationDocument } from '@/lib/types';
import { calculateCompletion } from '@/lib/application-utils';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('applicant') && !session.roles.includes('super_admin') && !session.roles.includes('college_admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Applicant session required.' }, { status: 401 });
    }

    let applicant = portalDb.getApplicantByUserId(session.id);
    if (!applicant && (session.roles.includes('super_admin') || session.roles.includes('college_admin'))) {
      applicant = portalDb.getApplicantByUserId('usr-applicant-uuid') || null;
    }

    if (!applicant) {
      return NextResponse.json({ success: false, error: 'Applicant record not found.' }, { status: 404 });
    }

    const application = portalDb.getOrCreateApplicationForApplicant(applicant.id);

    if (application.status === 'submitted') {
      return NextResponse.json({
        success: false,
        error: 'Application has already been submitted and cannot be modified.'
      }, { status: 403 });
    }

    const contentType = request.headers.get('content-type') || '';

    let documentType: ApplicationDocument['document_type'];
    let fileName: string;
    let fileSize: number;
    let mimeType: string;
    let storagePath: string;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      documentType = (formData.get('document_type') as ApplicationDocument['document_type']) || 'other';

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided in form submission.' }, { status: 400 });
      }

      fileName = file.name;
      fileSize = file.size;
      mimeType = file.type || 'application/octet-stream';
      // In this environment, simulate secure object storage URL
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      storagePath = `/uploads/applications/${application.id}/${documentType}-${uniqueSuffix}-${file.name.replace(/\s+/g, '_')}`;
    } else {
      const body = await request.json();
      documentType = body.document_type;
      fileName = body.file_name || 'document.pdf';
      fileSize = Number(body.file_size) || 102400;
      mimeType = body.mime_type || 'application/pdf';
      storagePath = body.storage_path || `/uploads/applications/${application.id}/${documentType}-${Date.now()}.pdf`;
    }

    if (!documentType) {
      return NextResponse.json({ success: false, error: 'Document type is required.' }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      return NextResponse.json({
        success: false,
        error: `Invalid file format '${mimeType}'. Allowed formats: JPG, PNG, WEBP, and PDF.`
      }, { status: 400 });
    }

    // Validate File Size
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: `File size exceeds the 5MB limit. Please upload a compressed document.`
      }, { status: 400 });
    }

    const uploadedDoc = portalDb.uploadDocument(application.id, {
      document_type: documentType,
      file_name: fileName,
      file_size: fileSize,
      mime_type: mimeType,
      storage_path: storagePath
    });

    const updated = portalDb.getApplicationById(application.id)!;
    const { percentage, steps } = calculateCompletion(updated);

    return NextResponse.json({
      success: true,
      message: `Document '${fileName}' uploaded successfully.`,
      document: uploadedDoc,
      application: updated,
      completionPercentage: percentage,
      stepsStatus: steps
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
