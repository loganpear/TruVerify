import React, { useState } from 'react';
import { Landing } from './pages/Landing';
import { VerificationPortal } from './pages/VerificationPortal';
import { ClientDashboard } from './pages/ClientDashboard';
import { AppView, VerificationSession } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  
  // Mock database state shared between views
  const [sessions, setSessions] = useState<VerificationSession[]>([
    {
      id: "abc-123",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: "COMPLETED",
      userProvidedName: "Michael Scott",
      result: {
        isIdValid: true,
        isNameMatch: true,
        isFaceMatch: true,
        confidenceScore: 92,
        extractedName: "Michael Gary Scott",
        reasoning: "ID appears authentic. Face structure in selfie matches ID photo consistently.",
        verdict: "APPROVED"
      }
    }
  ]);

  const handleVerificationComplete = (newSession: VerificationSession) => {
    setSessions(prev => [newSession, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING:
        return <Landing onNavigate={setCurrentView} />;
      case AppView.VERIFICATION_FLOW:
        return <VerificationPortal onNavigate={setCurrentView} onComplete={handleVerificationComplete} />;
      case AppView.CLIENT_DASHBOARD:
        return <ClientDashboard onNavigate={setCurrentView} sessions={sessions} />;
      default:
        return <Landing onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="font-sans text-gray-900">
      {renderView()}
    </div>
  );
}

export default App;