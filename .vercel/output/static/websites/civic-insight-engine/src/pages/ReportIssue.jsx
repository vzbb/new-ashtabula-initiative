import { useState } from 'react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, AlertCircle, CheckCircle2, ChevronRight, Info, Shield } from 'lucide-react';
import MapPicker from '../components/MapPicker';

export default function ReportIssue() {
  const addIssue = useAppStore(state => state.addIssue);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'roads',
    description: '',
    location: '',
    coordinates: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Simulate Gemini AI Analysis
    setIsAnalyzingPhoto(true);
    
    setTimeout(() => {
      // Randomly pick an analysis result for the demo
      const analysisResults = [
        { title: 'Pothole on Main Ave', category: 'roads', description: 'Large pothole detected in the center of the lane. Potential hazard for cyclists and small vehicles.' },
        { title: 'Damaged Guardrail', category: 'roads', description: 'Impact damage identified on the roadside safety barrier. Needs immediate structural assessment.' },
        { title: 'Illegal Dumping', category: 'safety', description: 'Assorted household debris and tires identified on the public right-of-way.' },
        { title: 'Overgrown Vegetation', category: 'zoning', description: 'Sightline obstruction at the intersection due to unmaintained private property vegetation.' }
      ];
      
      const result = analysisResults[Math.floor(Math.random() * analysisResults.length)];
      
      setFormData(prev => ({
        ...prev,
        title: result.title,
        category: result.category,
        description: `[AI Assisted Description]: ${result.description}`
      }));
      
      setIsAnalyzingPhoto(false);
    }, 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      // If no coordinates were picked, generate random ones near Ashtabula for the demo
      const finalFormData = { ...formData };
      if (!finalFormData.coordinates) {
        finalFormData.coordinates = [
          41.8797 + (Math.random() - 0.5) * 0.05,
          -80.7891 + (Math.random() - 0.5) * 0.05
        ];
      }
      
      addIssue(finalFormData);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (location, coords) => {
    // Simulate reverse geocoding
    let address = location;
    if (coords && !location) {
      const areas = ['Main Ave', 'Lake Rd', 'Harbor St', '5th Ave', 'Walnut St', 'Elm St'];
      const randomArea = areas[Math.floor(Math.random() * areas.length)];
      const randomNum = Math.floor(Math.random() * 900) + 100;
      address = `${randomNum} ${randomArea}, Ashtabula, OH`;
    }
    setFormData({ ...formData, location: address, coordinates: coords ? [coords.lat, coords.lng] : null });
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 animate-in zoom-in duration-500">
        <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-emerald-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
             <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Issue Logged</h2>
          <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
            Your report has been sent to the Ashtabula Township clerk. You can track its status on the public dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/')} 
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => setIsSuccess(false)} 
              className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
            >
              Report Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-4xl font-black text-gray-900 tracking-tight">Report an Issue</h1>
           <p className="text-slate-500 font-medium mt-1">Help improve Ashtabula Township by reporting maintenance needs.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-xs font-bold uppercase tracking-widest">
           <Shield className="h-3.5 w-3.5" />
           Anonymous Reporting
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 lg:p-10 space-y-8">
              <div className="space-y-4">
                <label htmlFor="title" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Issue Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition text-slate-800 font-bold placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="e.g., Damaged guardrail on Lake Rd"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Set Location</label>
                <MapPicker value={formData.location} onChange={handleLocationChange} />
                <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition text-slate-800 font-bold placeholder:text-slate-300 placeholder:font-medium"
                      placeholder="Address or intersection"
                    />
                  </div>
              </div>

              <div className="space-y-4">
                  <label htmlFor="category" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition text-slate-800 font-bold appearance-none cursor-pointer"
                  >
                    <option value="roads">Roads & Streets</option>
                    <option value="utilities">Utilities & Lighting</option>
                    <option value="zoning">Zoning & Code</option>
                    <option value="safety">Public Safety</option>
                    <option value="parks">Parks & Rec</option>
                    <option value="other">Other</option>
                  </select>
                </div>

              <div className="space-y-4">
                <label htmlFor="description" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Full Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none text-slate-700 leading-relaxed placeholder:text-slate-300"
                  placeholder="Please provide as much detail as possible to help our crews identify the problem..."
                ></textarea>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Attach Photo Evidence</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`group relative border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    isAnalyzingPhoto ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50 hover:border-blue-200'
                  }`}>
                    {isAnalyzingPhoto ? (
                      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                        <div className="h-12 w-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Gemini Analyzing Image...</p>
                      </div>
                    ) : (
                      <>
                        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-white transition shadow-sm">
                           <Camera className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition" />
                        </div>
                        <p className="text-sm text-slate-600 font-bold mb-1">Click to Capture/Upload</p>
                        <p className="text-xs text-slate-400 font-medium italic">AI will auto-categorize your report</p>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>

                  {photoPreview && (
                    <div className="relative rounded-2xl overflow-hidden shadow-md group animate-in zoom-in-95 duration-500">
                      <img src={photoPreview} alt="Issue Preview" className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                         <div className="text-white">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Detected Object</p>
                            <p className="text-sm font-bold">{formData.title || 'Analyzing...'}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => { setPhotoPreview(null); setFormData(prev => ({ ...prev, title: '', description: '' })); }}
                        className="absolute top-2 right-2 h-8 w-8 bg-black/40 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition backdrop-blur-sm"
                      >
                         <AlertCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-8 lg:px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm font-bold text-slate-400 hover:text-slate-600 transition uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-3 shadow-lg shadow-blue-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Report <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 opacity-10">
                 <Shield className="h-32 w-32 -mr-8 -mt-8" />
              </div>
              <h3 className="text-lg font-bold mb-4 relative z-10">Why Report?</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">
                Reports through the Civic Insight Engine are directly queued into the township's priority list. This ensures transparency and accountability for all maintenance tasks.
              </p>
              <div className="space-y-4 relative z-10">
                 <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-200">Public trackable status</span>
                 </div>
                 <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-200">Direct clerk notification</span>
                 </div>
                 <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-200">History and audit trail</span>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                 <Info className="h-5 w-5 text-blue-500" />
                 <h3 className="font-bold text-slate-800">Need Help?</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                If this is a life-threatening emergency, please call **911** immediately. For non-urgent utility outages, contact the Department of Public Works at **(555) 0123**.
              </p>
              <button className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition">
                 Call Dispatch
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
