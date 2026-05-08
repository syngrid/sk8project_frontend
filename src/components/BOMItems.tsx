import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus, Search, Edit, Trash2, Archive, Loader2
} from 'lucide-react';
import api from '../utils/api';

type ProjectOption = {
  _id: string;
  projectCode?: string;
  projectName?: string;
  projectStatus?: string;
};

type BomMaster = {
  _id: string;
  bomNumber: string;
  project?: string;
  bomTitle?: string;
  bomStatus?: string;
};

type InventoryItem = {
  _id: string;
  itemCode: string;
  itemName: string;
  description?: string;
  unit?: string;
  itemCategory?: string;
};

type BOMItemRow = {
  _id?: string;
  bom: string;
  item: string;
  itemDescription?: string;
  itemCategory?: string;
  unit?: string;
  requiredQuantity?: number;
  availableStock?: number;
  reservedQuantity?: number;
  shortageQuantity?: number;
  status?: string;
};

const initialItemForm = {
  item: '',
  itemDescription: '',
  unit: '',
  requiredQuantity: '',
  remarks: ''
};


const BOMItems: React.FC = () => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [masters, setMasters] = useState<BomMaster[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedBomNumber, setSelectedBomNumber] = useState('');
  const [bomItems, setBomItems] = useState<BOMItemRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemForm, setItemForm] = useState(initialItemForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectRes, masterRes, itemRes] = await Promise.all([
        api.get('/project/projects'),
        api.get('/bom/master'),
        api.get('/inventory/items')
      ]);
      setProjects(projectRes.data || []);
      setMasters(masterRes.data || []);
      setInventoryItems(itemRes.data || []);
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadBOMItems = async (bomNo: string) => {
    if (!bomNo) return;
    setLoading(true);
    try {
      const res = await api.get(`/bom/items?bom=${bomNo}`);
      setBomItems(res.data || []);
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to load BOM items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBomNumber) {
      loadBOMItems(selectedBomNumber);
    } else {
      setBomItems([]);
    }
  }, [selectedBomNumber]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 3000);
  };

  const currentProject = projects.find(p => p._id === selectedProjectId);
  const currentBOM = masters.find(m => m.bomNumber === selectedBomNumber);

  const filteredItems = useMemo(() => {
    return bomItems.filter(item =>
      item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.itemDescription || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bomItems, searchQuery]);

  const handleSaveItem = async () => {
    if (!selectedBomNumber) return showMessage('error', 'Select a BOM first');
    if (!itemForm.item || !itemForm.requiredQuantity) return showMessage('error', 'Item and Quantity are required');

    setSaving(true);
    try {
      const itemDoc = inventoryItems.find(i => i.itemCode === itemForm.item);
      const data = {
        ...itemForm,
        bom: selectedBomNumber,
        itemDescription: itemForm.itemDescription || itemDoc?.description || itemDoc?.itemName,
        unit: itemForm.unit || itemDoc?.unit,
        itemCategory: itemDoc?.itemCategory,
        requiredQuantity: Number(itemForm.requiredQuantity)
      };

      if (editingId) {
        await api.put(`/bom/items/${editingId}`, data);
        showMessage('success', 'Item updated');
      } else {
        await api.post('/bom/items', data);
        showMessage('success', 'Item added');
      }

      setItemForm(initialItemForm);
      setIsFormOpen(false);
      setEditingId(null);
      loadBOMItems(selectedBomNumber);
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/bom/items/${id}`);
      showMessage('success', 'Item deleted');
      loadBOMItems(selectedBomNumber);
    } catch (err) {
      showMessage('error', 'Failed to delete');
    }
  };


  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-slate-100 text-slate-500';
    switch (status.toLowerCase()) {
      case 'shortage': return 'bg-red-100 text-red-600';
      case 'available': return 'bg-emerald-100 text-emerald-600';
      case 'reserved': return 'bg-blue-100 text-blue-600';
      default: return 'bg-amber-100 text-amber-600';
    }
  };


  return (
    <div className="h-full overflow-y-auto no-scrollbar p-6 space-y-8 bg-slate-50/50">
      {message && (
        <div className={`fixed top-6 right-6 z-[600] px-6 py-4 rounded-3xl text-xs font-black uppercase tracking-widest shadow-2xl animate-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">BOM Items</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{filteredItems.length} Records</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Inventory Mapping</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Selector */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 min-w-[200px]">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Select Project</p>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedBomNumber('');
              }}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-[10px] font-bold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">Select project</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.projectName} ({p.projectCode})</option>)}
            </select>
          </div>

          {/* BOM Selector */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 min-w-[200px]">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Select BOM</p>
            <select
              value={selectedBomNumber}
              onChange={(e) => setSelectedBomNumber(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-[10px] font-bold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">Select BOM</option>
              {masters.filter(m => m.project === currentProject?.projectName || m.project === currentProject?.projectCode).map(m => (
                <option key={m._id} value={m.bomNumber}>{m.bomNumber} - {m.bomTitle}</option>
              ))}
            </select>
          </div>

          {/* Add Entry Button */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-3 bg-black text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10"
          >
            <Plus size={16} />
            Add Entry
          </button>
        </div>
      </div>

      {/* Main List Area */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* List Header */}
        <div className="p-6 md:px-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search items, descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold focus:ring-0 focus:bg-slate-100 transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Items</p>
              <p className="text-xs font-black text-black">{filteredItems.length}</p>
            </div>
            <div className="w-[1px] h-8 bg-slate-100"></div>
            <div className="text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Status</p>
              <p className="text-xs font-black text-emerald-500 uppercase tracking-tight">{currentBOM?.bomStatus || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Item Details</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Unit</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Qty Required</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Shortage</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2 size={32} className="animate-spin mx-auto text-slate-200" />
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-300">
                      <Archive size={48} strokeWidth={1} />
                      <span className="text-[10px] font-black uppercase tracking-widest">No records found</span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.map((item) => (
                <tr key={item._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-black group-hover:text-emerald-600 transition-colors">{item.item}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.itemDescription}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-slate-600">{item.itemCategory || 'General'}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-[10px] font-bold text-slate-500">{item.unit || 'Nos'}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-black text-black">{item.requiredQuantity}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-xs font-black ${Number(item.shortageQuantity) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {item.shortageQuantity || 0}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setItemForm({
                            item: item.item,
                            itemDescription: item.itemDescription || '',
                            unit: item.unit || '',
                            requiredQuantity: String(item.requiredQuantity || ''),
                            remarks: ''
                          });
                          setEditingId(item._id || null);
                          setIsFormOpen(true);
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-black hover:text-white transition-all shadow-sm"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => item._id && handleDeleteItem(item._id)}
                        className="p-2.5 rounded-xl bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-black uppercase tracking-tight">{editingId ? 'Edit BOM Item' : 'Add BOM Item'}</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Project-linked material entry</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-300 hover:text-black transition-colors">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Item</p>
                  <select
                    value={itemForm.item}
                    onChange={(e) => {
                      const itm = inventoryItems.find(i => i.itemCode === e.target.value);
                      setItemForm({
                        ...itemForm,
                        item: e.target.value,
                        itemDescription: itm?.description || itm?.itemName || '',
                        unit: itm?.unit || ''
                      });
                    }}
                    className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none"
                  >
                    <option value="">Select an item</option>
                    {inventoryItems.map(i => <option key={i._id} value={i.itemCode}>{i.itemName} ({i.itemCode})</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Required Quantity</p>
                  <input
                    type="number"
                    value={itemForm.requiredQuantity}
                    onChange={(e) => setItemForm({ ...itemForm, requiredQuantity: e.target.value })}
                    placeholder="Enter quantity"
                    className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Remarks</p>
                  <textarea
                    value={itemForm.remarks}
                    onChange={(e) => setItemForm({ ...itemForm, remarks: e.target.value })}
                    placeholder="Add notes..."
                    rows={3}
                    className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={saving}
                  className="flex-[2] bg-black text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Save Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BOMItems;
