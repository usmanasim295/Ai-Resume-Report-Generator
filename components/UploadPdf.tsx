'use client';

import React, { useState } from 'react';

import ReactMarkdown from 'react-markdown';
interface ApiResponse {
  success: boolean;
  extractedText: string;
  aiResponse: string;
}

export default function UploadPdf() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null); 
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file first!');
      return;
    }

    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const data: ApiResponse = await response.json();
      setResult(data);
      setSelectedFile(null); 
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const extractScore = (text: string): string => {
    const match = text.match(/(\d+)%/);
    return match ? `${match[1]}%` : 'N/A';
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl w-full mx-auto">
      
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm transition-all hover:shadow-md">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Candidate Evaluation</h2>
          <p className="text-sm text-slate-500">Upload a Full-Stack developer resume to extract insights, scores, and project breakdowns instantly.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 rounded-xl">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 cursor-pointer transition-colors"
          />
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white transition-all shadow-sm shrink-0
              ${!selectedFile || isUploading 
                ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow shadow-indigo-200 active:scale-[0.98]'
              }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : 'Run AI Screening'}
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC RESULTS DASHBOARD */}
      {result && (
        <div className="flex flex-col gap-6 animate-fade-in">
          
          {/* HEADER SUMMARY SECTION */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vetting Report</h1>
              <p className="text-slate-500 text-sm">Automated screening insights powered by Mistral AI</p>
            </div>
            <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Analysis Complete
            </span>
          </div>

          {/* METRIC CARD STRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Metric 1: Skill Compatibility */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Full-Stack Match</p>
                <h3 className="text-3xl font-black text-indigo-950">{extractScore(result.aiResponse)}</h3>
              </div>
              <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-600 text-2xl">⚡</div>
            </div>

            {/* Metric 2: Document Processed */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-100 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Candidate Profile</p>
                <h3 className="text-lg font-bold text-slate-800 truncate max-w-[180px]">Resume Evaluated</h3>
              </div>
              <div className="p-3 bg-slate-200 text-slate-600 rounded-xl text-xl">📄</div>
            </div>
          </div>

          {/* FULL REPORT MARKDOWN DISPLAY BOX */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
              <span className="text-slate-400">📝</span>
              <h3 className="font-semibold text-slate-700 text-sm">Detailed Summary &amp; Project Breakdown</h3>
            </div>
            

<div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-indigo-600 font-bold">📋</span>
      <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">
        Recruiter Executive Summary
      </h3>
    </div>
    <span className="text-xs text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded font-mono">
      ATS-Parsed
    </span>
  </div>
  
  {/* Recruiter Optimized Layout */}
  <div className="p-6 md:p-8 bg-gradient-to-b from-white to-slate-50/30">
    {result.aiResponse ? (
      <div className="prose max-w-none text-slate-700
        /* Headings Styling */
        prose-headings:text-slate-900 prose-headings:font-extrabold prose-headings:tracking-tight
        prose-h1:text-xl prose-h1:border-b prose-h1:pb-2 prose-h1:mt-6 prose-h1:mb-4
        prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-indigo-950
        prose-h3:text-base prose-h3:mt-4 prose-h3:text-slate-800
        
        /* Strong text styling for quick scanning */
        prose-strong:text-slate-900 prose-strong:font-bold prose-strong:bg-yellow-50 prose-strong:px-1 prose-strong:rounded
        
        /* Paragraph spacing */
        prose-p:text-sm prose-p:md:text-base prose-p:leading-relaxed prose-p:mb-4 prose-p:text-slate-600
        
        /* Clean Custom Project Bullet Lists */
        prose-ul:list-none prose-ul:pl-0 prose-ul:my-4
        prose-li:relative prose-li:pl-6 prose-li:my-2.5 prose-li:text-sm prose-li:md:text-base prose-li:text-slate-600
        prose-li:before:content-['✓'] prose-li:before:absolute prose-li:before:left-0 prose-li:before:text-emerald-600 prose-li:before:font-bold">
        
        <ReactMarkdown>{result.aiResponse}</ReactMarkdown>
      </div>
    ) : (
      <p className="text-slate-400 text-center py-6 text-sm italic">
        No assessment information available.
      </p>
    )}
  </div>
</div>
          </div>

          {/* 3. DEBUG ACCORDION */}
          <details className="group border border-slate-200 rounded-xl bg-white overflow-hidden transition-all text-xs">
            <summary className="flex items-center justify-between px-4 py-3 font-medium text-slate-500 hover:text-slate-700 cursor-pointer bg-slate-50/50 group-open:border-b group-open:border-slate-200">
              <span>View Raw Extracted Text from PDF Parse</span>
              <span className="transition-transform group-open:rotate-180 text-slate-400">▼</span>
            </summary>
            <div className="p-4 bg-slate-900 text-slate-300 font-mono overflow-auto max-h-48 leading-normal whitespace-pre-wrap">
              {result.extractedText || "No plaintext content extracted."}
            </div>
          </details>

        </div>
      )}
    </div>
  );
}
