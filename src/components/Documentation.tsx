import React, { useState, useEffect } from 'react';
import { 
  Folder, File, Upload, Plus, Search, Download, Trash2, ArrowLeft,
  HardDrive, Edit2, X
} from 'lucide-react';
import api from '../utils/api';

interface FolderItem {
  _id: string;
  folderName: string;
  project: string;
  parentFolder: string | null;
  createdAt: string;
  fileCount?: number;
}

interface DocItem {
  _id: string;
  documentName: string;
  documentType: string;
  size?: string;
  uploadFile?: string;
  createdAt: string;
  preparedBy: string;
}

const Documentation: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<{ id: string; name: string } | null>(null);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [path, setPath] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState<any[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDocType, setUploadDocType] = useState('PDF');

  useEffect(() => {
    loadData();
    fetchProjects();
  }, [currentFolder]);

  const loadData = async () => {
    setLoading(true);
    try {
      const parentId = currentFolder ? currentFolder.id : null;
      const [foldersRes, docsRes] = await Promise.all([
        api.get('/docs/folders', { params: { parentFolder: parentId } }),
        api.get('/docs/docs', { params: { folder: parentId } })
      ]);
      setFolders(foldersRes.data || []);
      setDocs(docsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/project/projects');
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFolderClick = (folder: FolderItem) => {
    const newPath = [...path, { id: folder._id, name: folder.folderName }];
    setPath(newPath);
    setCurrentFolder({ id: folder._id, name: folder.folderName });
  };

  const navigateBack = () => {
    if (path.length === 0) return;
    const newPath = [...path];
    newPath.pop();
    setPath(newPath);
    setCurrentFolder(newPath.length > 0 ? newPath[newPath.length - 1] : null);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName || !selectedProject) return alert('Folder name and project are required');
    try {
      if (isEditing && editId) {
        await api.put(`/docs/folders/${editId}`, {
          folderName: newFolderName,
          project: selectedProject
        });
      } else {
        await api.post('/docs/folders', {
          folderName: newFolderName,
          project: selectedProject,
          parentFolder: currentFolder ? currentFolder.id : null
        });
      }
      setNewFolderName('');
      setSelectedProject('');
      setIsFolderModalOpen(false);
      setIsEditing(false);
      setEditId(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this folder and its contents?')) return;
    try {
      await api.delete(`/docs/folders/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.delete(`/docs/docs/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditFolder = (f: FolderItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setNewFolderName(f.folderName);
    setSelectedProject(f.project);
    setEditId(f._id);
    setIsEditing(true);
    setIsFolderModalOpen(true);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return alert('Please select a file');
    
    const formData = new FormData();
    formData.append('uploadFile', selectedFile);
    formData.append('documentName', selectedFile.name);
    formData.append('documentType', uploadDocType);
    formData.append('project', currentFolder ? folders.find(f => f._id === currentFolder.id)?.project || '' : '');
    formData.append('folder', currentFolder ? currentFolder.id : '');

    try {
      await api.post('/docs/docs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error uploading file');
    }
  };

  const filteredFolders = folders.filter(f => f.folderName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDocs = docs.filter(d => d.documentName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full flex flex-col space-y-6 bg-slate-50/50 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentFolder && (
            <button 
              onClick={navigateBack}
              className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-slate-400 hover:text-black"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">
              {currentFolder ? currentFolder.name : 'Documentation'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {folders.length + docs.length} Items Total
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Storage</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group mr-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:ring-2 focus:ring-black/5 transition-all shadow-sm" 
            />
          </div>
          <button 
            onClick={() => { setIsEditing(false); setNewFolderName(''); setIsFolderModalOpen(true); }}
            className="bg-white text-black border border-slate-200 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-3"
          >
            <Plus size={16} />
            Create Folder
          </button>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-black text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-3"
          >
            <Upload size={16} />
            Upload File
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Name</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Project</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Created At</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Size/Count</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                      <div className="w-20 h-2 bg-slate-100 rounded-full"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {filteredFolders.map((f) => (
                    <tr key={f._id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => handleFolderClick(f)}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl group-hover:scale-110 transition-all shadow-sm">
                            <Folder size={20} fill="currentColor" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-black">{f.folderName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{f.project}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-[10px] font-bold text-slate-400">{new Date(f.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-8 py-6 text-center text-[10px] font-bold text-slate-400">
                        {f.fileCount || 0} Files
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => openEditFolder(f, e)}
                            className="p-2 text-slate-300 hover:text-black transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteFolder(f._id, e)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDocs.map((d) => (
                    <tr key={d._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl group-hover:scale-110 transition-all shadow-sm">
                            <File size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-black">{d.documentName}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{d.documentType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-bold text-slate-600">{d.preparedBy || 'Admin'}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-[10px] font-bold text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-8 py-6 text-center text-[10px] font-bold text-slate-400">
                        {d.size || '152 KB'}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a 
                            href={`http://localhost:5000${d.uploadFile}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 text-slate-300 hover:text-black transition-colors"
                          >
                            <Download size={16} />
                          </a>
                          <button 
                            onClick={() => handleDeleteDoc(d._id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredFolders.length === 0 && filteredDocs.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-200">
                          <HardDrive size={48} strokeWidth={1} />
                          <p className="text-[10px] font-black uppercase tracking-widest">No matching items found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-black uppercase tracking-tight">{isEditing ? 'Edit Folder' : 'Create Folder'}</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Organize your project docs</p>
              </div>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-slate-300 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Folder Name</p>
                <input 
                  type="text" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none"
                />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Link to Project</p>
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none"
                >
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p._id} value={p.projectName}>{p.projectName}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsFolderModalOpen(false)}
                  className="flex-1 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateFolder}
                  className="flex-[2] bg-black text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 transition-all"
                >
                  {isEditing ? 'Update Folder' : 'Save Folder'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-black uppercase tracking-tight">Upload File</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add documents to this folder</p>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-300 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Document Type</p>
                <select 
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="CAD">CAD File</option>
                  <option value="Solidworks">Solidworks</option>
                  <option value="Image">Image</option>
                </select>
              </div>
              <div className="relative">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">File</p>
                <input 
                  type="file" 
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8 cursor-pointer hover:bg-slate-50 transition-all gap-3"
                >
                  <div className="p-4 bg-slate-100 rounded-full text-slate-400"><Upload size={24} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {selectedFile ? selectedFile.name : 'Click to select file'}
                  </p>
                </label>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleFileUpload}
                  className="flex-[2] bg-black text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 transition-all"
                >
                  Start Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentation;
