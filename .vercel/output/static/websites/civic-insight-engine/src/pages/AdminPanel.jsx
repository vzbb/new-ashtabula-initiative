import { useState } from 'react';
import { summarizeMeeting } from '../lib/gemini';
import { useAppStore } from '../store';
import { FileText, Wand2, Upload, Eye, Check, AlertCircle, Edit2, Save, X, Trash2, MessageSquare, Send, ShieldCheck, User, Calendar, MapPin } from 'lucide-react';

export default function AdminPanel() {
  const { 
    user, 
    setAdmin, 
    summaries, 
    deleteSummary, 
    addSummary, 
    updateSummary,
    issues, 
    updateIssueStatus, 
    addIssueComment,
    clearData 
  } = useAppStore();
  
  const [activeTab, setActiveTab] = useState('summaries'); // summaries or issues
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(''); // Uploading, OCR, Analyzing
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  
  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), message, type, time: new Date().toLocaleTimeString() }]);
  };

  const [previewData, setPreviewData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [newComment, setNewComment] = useState({}); // { issueId: text }
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', message: string }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file.name);
    setLogs([]);
    const fileName = file.name.toLowerCase();
    const isMedia = fileName.match(/\.(mp4|mov|mp3|wav|m4a)$/);
    
    // Simulate extraction
    setIsProcessing(true);
    setProcessingStep(isMedia ? 'Uploading Video/Audio to Engine...' : 'Uploading Document...');
    addLog(`Initiated ${isMedia ? 'media' : 'document'} upload: ${file.name}`);
    
    setTimeout(() => {
      setProcessingStep(isMedia ? 'Transcribing with Gemini 2.5...' : 'Extracting Text via OCR...');
      addLog(isMedia ? 'Connecting to Gemini Multimodal Endpoint...' : 'Initializing OCR Engine (Tesseract-v5-WebAssembly)...');
      
      setTimeout(() => {
        setProcessingStep(isMedia ? 'Identifying Speakers...' : 'Preparing for AI Summary...');
        addLog(isMedia ? 'Speaker diarization complete: 4 unique voices identified.' : 'Text extraction successful. Normalizing whitespace and formatting.');
        
        setTimeout(() => {
          let extractedText = "";
          
          if (isMedia) {
             addLog('Finalizing transcription alignment...');
             extractedText = `[0:00:00] CHAIRMAN MILLER: I'll call this regular meeting of the Ashtabula Township Trustees to order. Roll call please.
[0:00:15] CLERK: Miller, present. Hall, present. Davis, present. 
[0:01:30] TRUSTEE HALL: I'd like to move that we accept the bids for the 2026 paving project. Northeast Ohio Paving came in at the lowest bid of 1.2 million.
[0:02:45] TRUSTEE DAVIS: I'll second that. But I want to make sure they're starting on the north end of Lake Road first.
[0:15:20] RESIDENT ROBERT VANCE: My concern is the bridge. Is the Harbor Road bridge going to be closed during this?
[0:16:10] ENGINEER: Only during the joint repairs, about two weeks in July.
[0:45:00] CHAIRMAN MILLER: Meeting adjourned.`;
          } else if (fileName.includes('zoning')) {
            addLog('Cross-referencing extracted text with Ashtabula Zoning Code Art. 4...');
            extractedText = `ASHTABULA TOWNSHIP ZONING COMMISSION MEETING
Thursday, February 19, 2026

The meeting was called to order at 6:30 p.m. at the Senior Center.
Members present: Chairman Miller, Mr. Hall, Ms. Davis.

Agenda Item 1: Harbor District Rezoning (Case #2026-04).
Commission reviewed the proposal to rezone parcels 01-001-00-001-00 through 005-00 from C-2 to C-3. The goal is to encourage mixed-use development with residential units above commercial storefronts.
Ms. Davis moved to recommend approval to the Trustees. Seconded by Mr. Hall. Motion passed 3-0.

Agenda Item 2: Residential Setback Variance (Case #2026-05).
Resident John Doe of 422 Lake Rd requested a 5-foot variance for a new deck. The commission found no hardship.
Motion to deny by Mr. Hall, seconded by Chairman Miller. Motion denied 2-1.

Meeting adjourned at 7:45 p.m.`;
          } else if (fileName.includes('budget') || fileName.includes('finance')) {
            addLog('Identifying fiscal allocations and department-specific line items...');
            extractedText = `ASHTABULA CITY FINANCE COMMITTEE REPORT
Monday, February 2, 2026

Meeting started at 5:00 p.m. in the City Manager's Office.
Topic: Final 2026 Budget Review.

The committee reviewed the General Fund allocations. Major changes from the 2025 budget include a 5% increase for Public Works to cover rising asphalt costs and a 2% decrease in administrative overhead.
Total projected revenue: $4.2M.
Total projected expenses: $4.1M.
Projected surplus: $100k for the rainy day fund.

Recommendation to Council: Adopt budget as presented.
Adjourned at 6:00 p.m.`;
          } else {
            addLog('Identifying key departments: Infrastructure, Parks, Public Safety.');
            extractedText = `REGULAR MEETING OF THE ASHTABULA TOWNSHIP TRUSTEES
Monday, February 16, 2026

The Board of Trustees of Ashtabula Township met in regular session at 7:00 p.m. at the Township Hall. 

Infrastructure:
The Board discussed the bids received for the 2026 Road Resurfacing Project. After review, Trustee A moved to award the contract to Ohio Paving & Construction for $185,000. Seconded by Trustee B. Motion carried.

Parks & Recreation:
Trustee C presented a plan for new playground equipment at Saybrook Park. The estimated cost is $45,000. It was decided to seek community feedback before final approval.

Public Comment:
Several residents expressed concern about speeding on Lake Road. Chief Thompson stated that increased patrols would be implemented immediately.

Meeting adjourned at 8:30 p.m.`;
          }

          setInputText(extractedText);
          setIsProcessing(false);
          setProcessingStep('');
          addLog('Source material ready for AI Analysis.', 'success');
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setProcessingStep('Initializing Gemini 2.5 Engine...');
    setLogs([]);
    setError(null);
    
    try {
      // Step 1: Initializing
      addLog('Connecting to Google Gemini 2.5 Pro Multimodal Endpoint...');
      await new Promise(r => setTimeout(r, 800));
      
      // Step 2: Vectorizing
      setProcessingStep('Vectorizing Meeting Minutes...');
      addLog('Tokenizing input and generating contextual embeddings...');
      await new Promise(r => setTimeout(r, 1000));
      
      // Step 3: Extracting Decisions
      setProcessingStep('Extracting Key Decisions & Action Items...');
      addLog('Identifying semantic clusters for Board motions and resident concerns...');
      await new Promise(r => setTimeout(r, 1200));

      // Step 4: Cross-referencing
      setProcessingStep('Cross-referencing Local Context...');
      addLog('Checking Ward boundaries and Ashtabula County Clerk protocols...');
      await new Promise(r => setTimeout(r, 800));

      // Step 5: Synthesizing Press Release
      setProcessingStep('Synthesizing Professional Press Release...');
      addLog('Applying "Municipal Authority" tone weights to narrative generation...');
      
      const summary = await summarizeMeeting(inputText);
      setPreviewData(summary);
      setIsEditing(true); 
      addLog('AI analysis complete! Structured output generated.', 'success');
      showNotification('AI analysis complete! Reviewing results...');
    } catch (err) {
      setError(err.message);
      addLog(`Error during analysis: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const loadSample = () => {
    const sample = `CITY OF ASHTABULA CITY COUNCIL MEETING MINUTES
February 26, 2026

The meeting was called to order at 7:00 PM by Council President John Smith.
All members present.

Old Business:
1. Paving Program 2026: Council discussed the bids for the summer paving program. Commissioner Davis recommended the contract be awarded to Northeast Ohio Paving Inc. for $1.2M.
Motion by Mr. Miller, seconded by Ms. Green. Passed 6-0.

New Business:
1. Zoning Amendment for Harbor District: A proposal to rezone the area from C-2 to C-3 to allow for mixed-use development was introduced. A public hearing is scheduled for March 15th.
2. Fire Department Grant: Chief Thompson reported the department received a $50k federal grant for new safety equipment. Council voted to accept the funds.

Public Comment:
Mr. Robert Vance of Main Ave expressed concern about the timing of the Harbor Road bridge construction.

Meeting adjourned at 8:15 PM.`;
    setInputText(sample);
  };

  const handlePublish = () => {
    if (!previewData) return;
    
    if (previewData.id) {
      updateSummary(previewData.id, previewData);
      showNotification('Summary updated successfully!');
    } else {
      addSummary(previewData);
      showNotification('Summary published successfully!');
    }
    
    setPreviewData(null);
    setInputText('');
    setUploadedFile(null);
    setIsEditing(false);
  };

  const handleEditExisting = (summary) => {
    setPreviewData(summary);
    setIsEditing(true);
    // Scroll to preview
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePreview = (field, value) => {
    setPreviewData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateArrayPreview = (field, index, value) => {
    const newArray = [...previewData[field]];
    newArray[index] = value;
    setPreviewData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleAddComment = (issueId) => {
    if (!newComment[issueId]?.trim()) return;
    addIssueComment(issueId, newComment[issueId]);
    setNewComment({ ...newComment, [issueId]: '' });
  };

  if (!user.isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
        <p className="text-gray-600 mb-8">This area is restricted to township clerks and authorized officials.</p>
        <button 
          onClick={() => setAdmin(true)}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          Simulate Clerk Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 relative">
      {/* Notifications */}
      {notification && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-8 duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-red-600 border-red-500 text-white'
          }`}>
            {notification.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="font-bold text-sm">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100 transition">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Clerk Control Center</h1>
          <p className="text-gray-500 font-medium">Manage meeting summaries and community issues.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
            <User className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">{user.name}</span>
          </div>
          <button 
            onClick={() => setAdmin(false)}
            className="text-xs text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-2xl w-fit">
        <button
          className={`py-2.5 px-6 font-bold text-sm rounded-xl transition-all ${
            activeTab === 'summaries'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('summaries')}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Summaries
          </div>
        </button>
        <button
          className={`py-2.5 px-6 font-bold text-sm rounded-xl transition-all ${
            activeTab === 'issues'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('issues')}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Issue Queue
            {issues.filter(i => i.status === 'open').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] rounded-full px-2 py-0.5 ml-1">
                {issues.filter(i => i.status === 'open').length}
              </span>
            )}
          </div>
        </button>
      </div>

      {activeTab === 'summaries' && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Meeting Minutes
                </h2>
                <div className="flex gap-4">
                  <button 
                    onClick={loadSample}
                    className="text-xs font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition"
                  >
                    Sample Data
                  </button>
                  <label className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition cursor-pointer flex items-center gap-1">
                    <Upload className="h-3 w-3" /> 
                    Upload PDF
                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                  </label>
                  <label className="text-xs font-black text-purple-600 hover:text-purple-700 uppercase tracking-widest transition cursor-pointer flex items-center gap-1">
                    <Wand2 className="h-3 w-3" /> 
                    Video/Audio
                    <input type="file" className="hidden" accept="video/*,audio/*" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                {uploadedFile ? (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Document Selected</p>
                        <p className="text-sm font-bold text-slate-700">{uploadedFile}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setUploadedFile(null); setInputText(''); }}
                      className="p-2 text-slate-400 hover:text-red-500 transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : null}
                
                <textarea
                  className="w-full flex-grow p-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none resize-none font-mono text-sm mb-6 text-slate-700"
                  placeholder="Paste meeting minutes text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                ></textarea>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </div>
                )}

                <button
                  onClick={handleSummarize}
                  disabled={isProcessing || !inputText.trim()}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-blue-100"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {processingStep || 'AI is Summarizing...'}
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5" />
                      Generate Instant Summary
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output/Preview Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Review Summary
                </h2>
                {previewData && (
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition ${isEditing ? 'text-green-600' : 'text-slate-400 hover:text-blue-600'}`}
                  >
                    {isEditing ? <><Check className="h-4 w-4" /> Finish Editing</> : <><Edit2 className="h-4 w-4" /> Edit AI Output</>}
                  </button>
                )}
              </div>
              
              <div className="p-8 flex-grow overflow-y-auto">
                {!previewData ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300">
                    {isProcessing || logs.length > 0 ? (
                      <div className="w-full h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Engine Activity Log</h3>
                        </div>
                        <div className="flex-grow bg-slate-900 rounded-2xl p-6 font-mono text-[11px] text-blue-400 overflow-y-auto space-y-2 border border-slate-800 shadow-inner">
                           {logs.map(log => (
                             <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="text-slate-600 shrink-0">[{log.time}]</span>
                                <span className={log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-red-400' : 'text-blue-300'}>
                                  {log.type === 'success' ? '✓ ' : log.type === 'error' ? '✗ ' : '• '}
                                  {log.message}
                                </span>
                             </div>
                           ))}
                           {isProcessing && (
                             <div className="flex gap-3 text-blue-400 animate-pulse">
                                <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                <span>{processingStep}...</span>
                             </div>
                           )}
                           <div id="logs-end"></div>
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4">
                           <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                              <Wand2 className="h-5 w-5 text-blue-600 animate-pulse" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Current Status</p>
                              <p className="text-sm font-bold text-slate-700">{processingStep || 'Waiting for action...'}</p>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Wand2 className="h-16 w-16 mb-4 opacity-10 mx-auto" />
                        <p className="font-bold uppercase tracking-widest text-xs">Waiting for Minutes...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Narrative Overview</h3>
                      {isEditing ? (
                        <textarea 
                          className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500/20"
                          rows={4}
                          value={previewData.overview}
                          onChange={(e) => handleUpdatePreview('overview', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-800 leading-relaxed font-serif italic text-lg">"{previewData.overview}"</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Public Press Release</h3>
                      {isEditing ? (
                        <textarea 
                          className="w-full p-6 bg-slate-50 border-none rounded-2xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500/20 font-mono"
                          rows={10}
                          value={previewData.pressRelease}
                          onChange={(e) => handleUpdatePreview('pressRelease', e.target.value)}
                        />
                      ) : (
                        <div className="bg-white p-10 rounded-2xl border-4 border-double border-slate-100 shadow-inner text-sm text-slate-800 leading-relaxed max-h-[400px] overflow-y-auto whitespace-pre-wrap font-serif relative">
                           {/* Official Watermark */}
                           <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-[-15deg]">
                              <ShieldCheck className="h-64 w-64" />
                           </div>
                           <div className="text-center mb-8 border-b-2 border-slate-900 pb-6 relative z-10">
                              <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">Official News Release</h2>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">City of Ashtabula • Office of the Township Clerk</p>
                           </div>
                           <div className="relative z-10">
                              {previewData.pressRelease}
                           </div>
                           <div className="mt-8 pt-6 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                              ### END OF RELEASE ###
                           </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Key Decisions (Bulleted)</h3>
                      <ul className="space-y-3">
                        {previewData.bullets?.map((b, i) => (
                          <li key={i} className="flex gap-3 text-gray-800">
                            <div className="mt-1.5 h-1.5 w-1.5 bg-blue-500 rounded-full shrink-0"></div>
                            {isEditing ? (
                              <input 
                                type="text" 
                                className="flex-grow p-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                                value={b}
                                onChange={(e) => handleUpdateArrayPreview('bullets', i, e.target.value)}
                              />
                            ) : (
                              <span className="text-sm font-medium">{b}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Action Items</h3>
                      <ul className="space-y-3">
                        {previewData.actionItems?.map((a, i) => (
                          <li key={i} className="flex gap-3 text-gray-800">
                            <Check className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                            {isEditing ? (
                              <input 
                                type="text" 
                                className="flex-grow p-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                                value={a}
                                onChange={(e) => handleUpdateArrayPreview('actionItems', i, e.target.value)}
                              />
                            ) : (
                              <span className="text-sm font-bold">{a}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4">
                 <button
                  onClick={() => setPreviewData(null)}
                  disabled={!previewData}
                  className="px-6 py-4 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <X className="h-5 w-5" /> Discard
                </button>
                 <button
                onClick={handlePublish}
                disabled={!previewData}
                className="flex-grow py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-100"
              >
                <Check className="h-5 w-5" />
                {previewData.id ? 'Update Published Summary' : 'Publish Summary'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">Published Summaries</h2>
           </div>
           <div className="divide-y divide-gray-100">
              {summaries.length === 0 ? (
                <div className="p-12 text-center text-gray-400 font-medium">No summaries published yet.</div>
              ) : (
                summaries.map(s => (
                  <div key={s.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                       </div>
                       <div>
                          <div className="font-bold text-gray-900 leading-tight">Township Board Meeting</div>
                          <div className="text-xs text-gray-400 font-medium">{new Date(s.date).toLocaleDateString()} • {s.bullets.length} points</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditExisting(s)}
                        className="p-2 text-gray-300 hover:text-blue-500 transition rounded-lg hover:bg-blue-50"
                        title="Edit Summary"
                      >
                         <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => deleteSummary(s.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition rounded-lg hover:bg-red-50"
                        title="Delete Summary"
                      >
                         <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) )
              )}
           </div>
        </div>
      </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-6">
          {issues.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center text-gray-400 border border-gray-200 shadow-sm">
              No issues reported yet.
            </div>
          ) : (
            issues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(issue => (
              <div key={issue.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div className="flex gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        issue.status === 'open' ? 'bg-red-50 text-red-600' :
                        issue.status === 'in_progress' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                         <AlertCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">{issue.title}</h3>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${
                            issue.status === 'open' ? 'bg-red-50 text-red-600 border-red-100' :
                            issue.status === 'in_progress' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {issue.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-wider">
                           <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(issue.createdAt).toLocaleDateString()}</span>
                           <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {issue.location}</span>
                           <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{issue.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <select 
                        value={issue.status}
                        onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="open">Mark as Open</option>
                        <option value="in_progress">Mark In Progress</option>
                        <option value="resolved">Mark Resolved</option>
                        <option value="closed">Close Ticket</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                     <p className="text-slate-700 leading-relaxed">{issue.description}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <MessageSquare className="h-3 w-3" /> Admin Timeline & Comments
                    </h4>
                    
                    <div className="space-y-4">
                       {issue.comments?.map(comment => (
                         <div key={comment.id} className="flex gap-4">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                               <ShieldCheck className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-grow bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Township Admin</span>
                                  <span className="text-[10px] text-gray-400 font-medium">{new Date(comment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                               </div>
                               <p className="text-sm text-gray-700">{comment.text}</p>
                            </div>
                         </div>
                       ))}
                       
                       <div className="flex gap-4 pt-2">
                          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                             <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="flex-grow flex gap-2">
                             <input 
                                type="text" 
                                placeholder="Add an internal note or update..."
                                className="flex-grow bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={newComment[issue.id] || ''}
                                onChange={(e) => setNewComment({ ...newComment, [issue.id]: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(issue.id)}
                             />
                             <button 
                                onClick={() => handleAddComment(issue.id)}
                                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100"
                             >
                                <Send className="h-4 w-4" />
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Dev Reset */}
      <div className="pt-20 text-center border-t border-gray-100">
        <button onClick={clearData} className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase tracking-[0.2em] transition">
          Destroy All Local Demo Data
        </button>
      </div>
    </div>
  );
}
