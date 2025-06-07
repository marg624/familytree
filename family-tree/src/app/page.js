"use client";
import { useState } from "react";
import FamilyTree from '../components/FamilyTree';

export default function Home() {
  const [pw, setPw] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("campana");

  function checkPassword() {
    if (pw === "hilaria") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password. For access, please email marg624@gmail.com");
      setIsAuthenticated(false);
    }
  }

  const families = [
    { id: "campana", name: "Campana", color: "emerald" },
    { id: "guerrero", name: "Guerrero", color: "blue" },
    { id: "miranda", name: "Miranda", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {!isAuthenticated && (
        <main className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Family Tree
                </h1>
                <p className="text-slate-600">
                  Campana • Guerrero • Miranda
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Enter Password
                  </label>
                  <input
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkPassword()}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Family password"
                  />
                </div>
                <button
                  onClick={checkPassword}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Access Family Tree
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500">
                  For access, contact marg624@gmail.com
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {isAuthenticated && (
        <main className="min-h-screen">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">Family Tree</h1>
                </div>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Family Tabs */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-8">
                {families.map((family) => (
                  <button
                    key={family.id}
                    onClick={() => setActiveTab(family.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === family.id
                        ? `border-${family.color}-500 text-${family.color}-600`
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {family.name} Family
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FamilyTree familyName={activeTab} />
          </div>
        </main>
      )}
    </div>
  )
}