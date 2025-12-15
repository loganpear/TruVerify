import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, ChevronRight, User, Fingerprint, FileBadge, ScanFace, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { FileUpload } from '../components/FileUpload';
import { AppView, Step, VerificationResult, VerificationSession } from '../types';
import { verifyIdentity } from '../services/geminiService';
import { DEMO_PROFILES, loadDemoProfile } from '../utils/demoData';

interface VerificationPortalProps {
  onNavigate: (view: AppView) => void;
  onComplete: (session: VerificationSession) => void;
}

export const VerificationPortal: React.FC<VerificationPortalProps> = ({ onNavigate, onComplete }) => {
  const [step, setStep] = useState<Step>(Step.DETAILS);
  const [name, setName] = useState('');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleNext = async () => {
    if (step === Step.DETAILS) setStep(Step.UPLOAD_ID);
    else if (step === Step.UPLOAD_ID) setStep(Step.UPLOAD_SELFIE);
    else if (step === Step.UPLOAD_SELFIE) {
      setStep(Step.ANALYSIS);
      await processVerification();
    }
  };

  const processVerification = async () => {
    if (!idFile || !selfieFile) return;
    
    setIsProcessing(true);
    try {
      let verificationResult: VerificationResult;

      // DEMO MODE INTERCEPTION
      // If the user is using one of the pre-set demo profiles, we return a mocked result.
      // This ensures the demo "just works" even though the placeholder images don't actually match the names.
      const demoProfile = DEMO_PROFILES.find(p => p.name === name);
      
      if (demoProfile) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        if (demoProfile.type === 'VALID') {
          verificationResult = {
            isIdValid: true,
            isNameMatch: true,
            isFaceMatch: true,
            confidenceScore: 98,
            extractedName: demoProfile.name,
            reasoning: "DEMO MODE: High-resolution ID detected. OCR confirmed name match. Biometric analysis indicates 99.8% facial vector similarity.",
            verdict: 'APPROVED'
          };
        } else {
          verificationResult = {
            isIdValid: true,
            isNameMatch: true,
            isFaceMatch: false,
            confidenceScore: 12,
            extractedName: demoProfile.name,
            reasoning: "DEMO MODE: Face mismatch detected. The subject in the selfie does not match the photo on the ID card. Potential identity fraud.",
            verdict: 'REJECTED'
          };
        }
      } else {
        // Real AI Verification for user uploads
        verificationResult = await verifyIdentity(name, idFile, selfieFile);
      }

      setResult(verificationResult);
      setStep(Step.RESULTS);
      
      // Save session to "mock database" in parent
      const session: VerificationSession = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        status: 'COMPLETED',
        userProvidedName: name,
        result: verificationResult,
      };
      onComplete(session);

    } catch (err) {
      console.error(err);
      alert("Verification failed. Please check your API key.");
      setStep(Step.DETAILS);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadDemo = async (type: 'VALID' | 'FRAUD') => {
    setIsLoadingDemo(true);
    try {
      const profile = DEMO_PROFILES.find(p => p.type === type);
      if (profile) {
        const data = await loadDemoProfile(profile);
        setName(data.name);
        setIdFile(data.idFile);
        setSelfieFile(data.selfieFile);
        // Move to the final step so user sees the files are loaded
        setStep(Step.UPLOAD_SELFIE);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load demo data. Please try again.");
    } finally {
      setIsLoadingDemo(false);
    }
  };

  const renderProgressBar = () => {
    const steps = [
      { num: 1, label: "Details", icon: User },
      { num: 2, label: "ID Scan", icon: FileBadge },
      { num: 3, label: "Selfie", icon: ScanFace },
    ];
    
    return (
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 -z-10 rounded transition-all duration-500"
          style={{ width: `${((Math.min(step, 4) - 1) / 2) * 100}%` }}
        ></div>
        
        {steps.map((s) => {
          const isActive = step >= s.num;
          const isCurrent = step === s.num;
          const Icon = s.icon;
          return (
            <div key={s.num} className="flex flex-col items-center bg-white px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                isActive ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-gray-300 text-gray-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-brand-700' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(AppView.LANDING)}
          className="text-gray-500 hover:text-gray-900 flex items-center text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancel Verification
        </button>
        <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Secure Session</span>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          
          {step < Step.ANALYSIS && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Verify your identity</h2>
                <p className="text-gray-500 mt-1">Please complete the steps below to verify your account.</p>
              </div>
              
              {step === Step.DETAILS && (
                <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Quick Test (Demo Mode)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleLoadDemo('VALID')}
                      disabled={isLoadingDemo}
                      className="text-xs bg-white border border-indigo-200 text-indigo-700 py-2 rounded hover:bg-indigo-100 transition-colors"
                    >
                      {isLoadingDemo ? 'Loading...' : 'Auto-Fill: Approved'}
                    </button>
                    <button 
                       onClick={() => handleLoadDemo('FRAUD')}
                       disabled={isLoadingDemo}
                       className="text-xs bg-white border border-red-200 text-red-700 py-2 rounded hover:bg-red-50 transition-colors"
                    >
                      {isLoadingDemo ? 'Loading...' : 'Auto-Fill: Rejected'}
                    </button>
                  </div>
                </div>
              )}

              {renderProgressBar()}
            </>
          )}

          {step === Step.DETAILS && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Legal Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleNext}
                disabled={name.length < 3}
              >
                Continue
              </Button>
            </div>
          )}

          {step === Step.UPLOAD_ID && (
            <div className="space-y-6">
              <FileUpload 
                label="Government ID"
                description="Upload a clear photo of your Driver's License or Passport."
                value={idFile}
                onChange={setIdFile}
              />
              <Button 
                className="w-full" 
                onClick={handleNext}
                disabled={!idFile}
              >
                Continue to Selfie
              </Button>
            </div>
          )}

          {step === Step.UPLOAD_SELFIE && (
            <div className="space-y-6">
              <FileUpload 
                label="Take a Selfie"
                description="Take a clear photo of your face now. No glasses or hats."
                value={selfieFile}
                onChange={setSelfieFile}
                accept="image/*;capture=user"
              />
              <Button 
                className="w-full" 
                onClick={handleNext}
                disabled={!selfieFile}
              >
                Start Verification
              </Button>
            </div>
          )}

          {step === Step.ANALYSIS && (
            <div className="text-center py-12">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanFace className="w-10 h-10 text-brand-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verifying Identity...</h3>
              <div className="text-gray-500 space-y-1 text-sm">
                <p>Analyzing document security features</p>
                <p>Comparing biometric markers</p>
                <p>Validating text data</p>
              </div>
            </div>
          )}

          {step === Step.RESULTS && result && (
            <div className="space-y-6">
              <div className="text-center">
                {result.verdict === 'APPROVED' ? (
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                ) : result.verdict === 'REJECTED' ? (
                   <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-12 h-12 text-yellow-600" />
                  </div>
                )}
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {result.verdict === 'APPROVED' ? 'Verification Successful' : 'Verification Failed'}
                </h2>
                <p className="text-gray-500 text-sm">
                  Confidence Score: <span className="font-semibold text-gray-900">{result.confidenceScore}%</span>
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">ID Validity</span>
                  <span className={result.isIdValid ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {result.isIdValid ? "Valid" : "Invalid"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Name Match</span>
                  <span className={result.isNameMatch ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {result.isNameMatch ? "Matched" : "No Match"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Face Match</span>
                  <span className={result.isFaceMatch ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {result.isFaceMatch ? "Matched" : "No Match"}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
                <strong>Analysis:</strong> {result.reasoning}
              </div>

              <Button onClick={() => onNavigate(AppView.CLIENT_DASHBOARD)} variant="outline" className="w-full">
                Return to Dashboard
              </Button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};