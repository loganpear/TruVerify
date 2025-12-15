import React from 'react';
import { ShieldCheck, ScanFace, Smartphone, Lock, ChevronRight, Activity, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { AppView } from '../types';

interface LandingProps {
  onNavigate: (view: AppView) => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-brand-600 p-1.5 rounded-lg">
              <ScanFace className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TruVerify AI</span>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => onNavigate(AppView.CLIENT_DASHBOARD)}
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors hidden sm:block"
            >
              Client Dashboard
            </button>
            <Button onClick={() => onNavigate(AppView.VERIFICATION_FLOW)} variant="primary" className="py-2 px-4 text-sm">
              Try Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-grow">
        <div className="relative overflow-hidden pt-16 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                Identity verification for the <span className="text-brand-600">modern web</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Prevent fraud and build trust with AI-powered ID verification. Seamlessly integrate biometric checks into your app with our developer-first API.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={() => onNavigate(AppView.VERIFICATION_FLOW)} className="h-12 text-lg">
                  Start Verification Demo
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button onClick={() => onNavigate(AppView.CLIENT_DASHBOARD)} variant="outline" className="h-12 text-lg">
                  View Business Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Document Analysis</h3>
                <p className="text-gray-600">
                  Instantly validate government-issued IDs from over 190 countries using advanced OCR and fraud detection.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-6">
                  <ScanFace className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Biometric Matching</h3>
                <p className="text-gray-600">
                  Compare ID photos with live selfies using Gemini's vision capabilities to ensure the person is who they claim to be.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time API</h3>
                <p className="text-gray-600">
                  Webhooks and a RESTful API allow you to integrate verification status updates directly into your user flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 TruVerify AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};