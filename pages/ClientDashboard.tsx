import React from 'react';
import { ArrowLeft, Search, Filter, MoreHorizontal, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { AppView, VerificationSession } from '../types';

interface ClientDashboardProps {
  onNavigate: (view: AppView) => void;
  sessions: VerificationSession[];
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ onNavigate, sessions }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
             <button 
                onClick={() => onNavigate(AppView.LANDING)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            <h1 className="text-xl font-bold text-gray-900">Verification Requests</h1>
            <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
              Demo Mode
            </span>
          </div>
          <div className="flex items-center space-x-3">
             <button 
                onClick={() => onNavigate(AppView.VERIFICATION_FLOW)}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
              >
                + New Verification
              </button>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200">
              AC
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Verifications</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{sessions.length}</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Approval Rate</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {sessions.length > 0 
                      ? Math.round((sessions.filter(s => s.result?.verdict === 'APPROVED').length / sessions.length) * 100) 
                      : 0}%
                  </h3>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Review</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                     {sessions.filter(s => s.result?.verdict === 'MANUAL_REVIEW').length}
                  </h3>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or ID..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none w-full sm:w-64"
                />
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                        No verifications yet. Click "+ New Verification" to test the system.
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
                              {session.userProvidedName.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{session.userProvidedName}</div>
                              <div className="text-sm text-gray-500">ID: {session.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(session.timestamp).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{new Date(session.timestamp).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {session.result ? (
                             <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    session.result.confidenceScore > 80 ? 'bg-green-500' :
                                    session.result.confidenceScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`} 
                                  style={{ width: `${session.result.confidenceScore}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{session.result.confidenceScore}%</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           {session.result?.verdict === 'APPROVED' && (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                               Approved
                             </span>
                           )}
                           {session.result?.verdict === 'REJECTED' && (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                               Rejected
                             </span>
                           )}
                           {(!session.result || session.result.verdict === 'MANUAL_REVIEW') && (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                               Review Needed
                             </span>
                           )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};