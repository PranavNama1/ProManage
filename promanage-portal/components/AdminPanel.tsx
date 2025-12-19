
import React, { useState, useEffect } from 'react';
import { Project, Client, ContactResponse, Subscription } from '../types';
import { storageService } from '../services/storageService';
import ImageCropper from './ImageCropper';
import { GoogleGenAI } from "@google/genai";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'clients' | 'contacts' | 'subs'>('projects');
  
  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'project' | 'client'>('project');
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  
  // Project Form
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  
  // Client Form
  const [cName, setCName] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cDesig, setCDesig] = useState('');

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProjects(storageService.getProjects());
    setClients(storageService.getClients());
    setContacts(storageService.getContacts());
    setSubs(storageService.getSubscriptions());
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPendingImage(e.target.files[0]);
    }
  };

  const onCropped = (base64: string) => {
    setCroppedImage(base64);
    setPendingImage(null);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pDesc || !croppedImage) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: pName,
      description: pDesc,
      image: croppedImage
    };
    storageService.saveProject(newProject);
    resetForms();
    refreshData();
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cDesc || !cDesig || !croppedImage) return;

    const newClient: Client = {
      id: crypto.randomUUID(),
      name: cName,
      description: cDesc,
      designation: cDesig,
      image: croppedImage
    };
    storageService.saveClient(newClient);
    resetForms();
    refreshData();
  };

  const resetForms = () => {
    setShowForm(false);
    setPendingImage(null);
    setCroppedImage(null);
    setPName(''); setPDesc('');
    setCName(''); setCDesc(''); setCDesig('');
  };

  const handleDeleteProject = (id: string) => {
    storageService.deleteProject(id);
    refreshData();
  };

  const handleDeleteClient = (id: string) => {
    storageService.deleteClient(id);
    refreshData();
  };

  // AI Feature: Generate description using Gemini
  const generateAIDescription = async () => {
    if (!pName && !cName) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Write a professional 2-sentence marketing ${formType === 'project' ? 'project description' : 'client testimonial'} for a real estate/construction company named ProManage. The ${formType === 'project' ? 'project' : 'client'} name is ${formType === 'project' ? pName : cName}.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      if (formType === 'project') setPDesc(response.text || '');
      else setCDesc(response.text || '');
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-bold">A</div>
          <span className="text-xl font-bold tracking-tight">Admin Central</span>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'projects' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
             Projects
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'clients' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
             Clients
          </button>
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'contacts' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
             Inquiries
          </button>
          <button 
            onClick={() => setActiveTab('subs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'subs' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
             Subscriptions
          </button>
        </nav>
        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4 text-xs text-slate-400">
            Signed in as <span className="text-indigo-400">Master Admin</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeTab} Management</h2>
          {(activeTab === 'projects' || activeTab === 'clients') && (
            <button 
              onClick={() => { setShowForm(true); setFormType(activeTab === 'projects' ? 'project' : 'client'); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition shadow-md"
            >
              + Add {activeTab === 'projects' ? 'Project' : 'Client'}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-auto p-10">
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 group">
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                    <img src={p.image} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleDeleteProject(p.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{p.name}</h4>
                  <p className="text-sm text-slate-500 line-clamp-3">{p.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {clients.map(c => (
                <div key={c.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 group">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={c.image} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{c.name}</h4>
                      <p className="text-xs text-indigo-600 font-medium">{c.designation}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteClient(c.id)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 italic">"{c.description}"</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase">Name</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase">Email</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase">Mobile</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase">City</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contacts.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">{c.fullName}</td>
                      <td className="px-6 py-4 text-slate-600">{c.email}</td>
                      <td className="px-6 py-4 text-slate-600">{c.mobile}</td>
                      <td className="px-6 py-4 text-slate-600">{c.city}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-400">No inquiries yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'subs' && (
            <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase">Email Address</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase">Subscribed On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subs.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-800">{s.email}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(s.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {subs.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-20 text-center text-slate-400">No subscribers yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-2xl font-bold text-slate-800">Add New {formType}</h3>
                <button onClick={resetForms} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <form onSubmit={formType === 'project' ? handleAddProject : handleAddClient} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formType === 'project' ? pName : cName}
                    onChange={e => formType === 'project' ? setPName(e.target.value) : setCName(e.target.value)}
                  />
                </div>

                {formType === 'client' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Designation</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. CEO, Developer"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={cDesig}
                      onChange={e => setCDesig(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Description</label>
                    <button 
                      type="button"
                      onClick={generateAIDescription}
                      disabled={isGenerating || (formType === 'project' ? !pName : !cName)}
                      className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 disabled:opacity-50"
                    >
                      {isGenerating ? 'Thinking...' : '✨ Generate with AI'}
                    </button>
                  </div>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formType === 'project' ? pDesc : cDesc}
                    onChange={e => formType === 'project' ? setPDesc(e.target.value) : setCDesc(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Image Upload (450x350 Crop)</label>
                  {!croppedImage && !pendingImage && (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                          <p className="text-sm text-slate-500">Click to upload image</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  )}

                  {pendingImage && (
                    <ImageCropper 
                      imageFile={pendingImage} 
                      targetWidth={450} 
                      targetHeight={350} 
                      onCropped={onCropped} 
                    />
                  )}

                  {croppedImage && (
                    <div className="relative group rounded-2xl overflow-hidden shadow-md">
                      <img src={croppedImage} className="w-full aspect-[450/350] object-cover" />
                      <button 
                        type="button"
                        onClick={() => { setCroppedImage(null); setPendingImage(null); }}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition"
                      >
                        Change Image
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition"
                  >
                    Save {formType === 'project' ? 'Project' : 'Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
