import { useState } from 'react';
import { JobManagement } from '../features/admin/components/JobManagement';
import { UserManagement } from '../features/admin/components/UserManagement';

export const AdminPage = () => {
  // Toggle between 'jobs' and 'users'
  const [activeTab, setActiveTab] = useState<'jobs' | 'users'>('jobs');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. Header Section */}
      <header className="bg-white border-b border-slate-200 pt-12 pb-8 px-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
            Platform Control
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Manage listings, moderate users, and monitor system activity.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8">
        {/* 2. Custom Tab Switcher */}
        <div className="flex gap-8 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'jobs'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Job Listings
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'users'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            User Accounts
          </button>
        </div>

        {/* 3. Dynamic Feature Rendering */}
        <div className="transition-all duration-300">
          {activeTab === 'jobs' ? (
            <JobManagement />
          ) : (
            <UserManagement />
          )}
        </div>
      </main>
    </div>
  );
};