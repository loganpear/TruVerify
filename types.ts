export enum AppView {
  LANDING = 'LANDING',
  VERIFICATION_FLOW = 'VERIFICATION_FLOW',
  CLIENT_DASHBOARD = 'CLIENT_DASHBOARD',
}

export interface VerificationResult {
  isIdValid: boolean;
  isNameMatch: boolean;
  isFaceMatch: boolean;
  confidenceScore: number;
  extractedName: string;
  reasoning: string;
  verdict: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
}

export interface VerificationSession {
  id: string;
  timestamp: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  userProvidedName: string;
  idImage?: string; // base64
  selfieImage?: string; // base64
  result?: VerificationResult;
}

export enum Step {
  DETAILS = 1,
  UPLOAD_ID = 2,
  UPLOAD_SELFIE = 3,
  ANALYSIS = 4,
  RESULTS = 5,
}