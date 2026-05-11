import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Plus, Edit, Trash2, X, Search, Loader2,
  CheckCircle, FileText, Package, Database,
  ArrowRight
} from 'lucide-react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'boolean' | 'textarea' | 'date' | 'select-api' | 'file';
  options?: string[];
  apiEndpoint?: string;
  displayKey?: string;
  optionValueKey?: string;
  populateFields?: Record<string, string>;
  filterBy?: string;
  required?: boolean;
}

interface MasterPageProps {
  moduleName: string;
  endpoint: string;
  fields: Field[];
  submitEndpoint?: string;
  tableFields?: string[];
  listEndpoint?: string;
  transformData?: (data: any, context: { editingItem: any }) => any;
}

const normalizeApiPath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const getOptionLabel = (opt: any, displayKey?: string) => {
  const candidateKeys = [
    displayKey,
    'name', 'title', 'label', 'projectName', 'itemName', 'warehouseName',
    'unitName', 'categoryName', 'roleName', 'departmentName', 'supplierName',
    'costCenterName', 'costCenterCode', 'dispatchRequestNumber', 'reservationNumber',
    'grnNumber', 'bomNumber', 'prNumber', 'poNumber', 'documentNumber'
  ].filter(Boolean) as string[];

  for (const key of candidateKeys) {
    const value = opt?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return opt?._id || '';
};

const MasterPage: React.FC<MasterPageProps> = ({ moduleName, endpoint, fields, submitEndpoint, tableFields, listEndpoint, transformData }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [apiOptions, setApiOptions] = useState<any>({});

  // Location Specific Stock Viewing & Adding
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [currentLocationForStock, setCurrentLocationForStock] = useState<any | null>(null);
  const [showAddStockForm, setShowAddStockForm] = useState(false);
  const [quickStockData, setQuickStockData] = useState({ item: '', quantity: 0 });

  useEffect(() => {
    fetchData();
    fetchApiOptions();
  }, [endpoint]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${listEndpoint || endpoint}`);
      setData(res.data);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiOptions = async () => {
    const apiFields = fields.filter(f => f.type === 'select-api');
    const options: any = {};
    for (const f of apiFields) {
      if (f.apiEndpoint) {
        try {
          const res = await api.get(normalizeApiPath(f.apiEndpoint));
          options[f.name] = res.data;
        } catch (err) {
          console.error(`Options Error:`, err);
        }
      }
    }
    // Also fetch items for the quick add form if in Locations
    if (moduleName === 'Locations') {
      try {
        const res = await api.get('/inventory/items');
        options['quickAddItems'] = res.data;
      } catch (err) { }
    }
    setApiOptions(options);
  };

  const viewLocationStock = async (location: any) => {
    setCurrentLocationForStock(location);
    setIsStockLoading(true);
    setShowAddStockForm(false);
    try {
      const res = await api.get(`/inventory/balances/by-location/${location.locationName}`);
      setStockItems(res.data || []);
    } catch (err) {
      console.error('Stock Fetch Error:', err);
    } finally {
      setIsStockLoading(false);
    }
  };

  const handleQuickAddStock = async () => {
    if (!quickStockData.item || !quickStockData.quantity) return alert('Select item and quantity');
    setIsStockLoading(true);
    try {
      await api.post('/inventory/balances/quick-add', {
        item: quickStockData.item,
        warehouse: currentLocationForStock.warehouse,
        warehouseLocation: currentLocationForStock.locationName,
        quantity: quickStockData.quantity
      });
      setQuickStockData({ item: '', quantity: 0 });
      setShowAddStockForm(false);
      viewLocationStock(currentLocationForStock); // Refresh list
    } catch (err) {
      alert('Error adding stock');
    } finally {
      setIsStockLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setFormData({ ...formData, [name]: file });
    } else {
      const nextValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      const activeField = fields.find(f => f.name === name);

      if (activeField?.type === 'select-api' && activeField.populateFields) {
        const selectedOption = apiOptions[name]?.find((opt: any) => {
          const optionValue = activeField.optionValueKey
            ? (opt[activeField.optionValueKey] || getOptionLabel(opt, activeField.displayKey))
            : getOptionLabel(opt, activeField.displayKey);
          return String(optionValue) === String(nextValue);
        });

        const populatedValues: Record<string, any> = {};
        if (selectedOption) {
          Object.entries(activeField.populateFields).forEach(([targetField, sourceField]) => {
            const selectedValue = selectedOption?.[sourceField];
            if (selectedValue !== undefined && selectedValue !== null && selectedValue !== '') {
              populatedValues[targetField] = selectedValue;
            }
          });
        }
        setFormData({ ...formData, [name]: nextValue, ...populatedValues });
        return;
      }
      setFormData({ ...formData, [name]: nextValue });
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setShowSuccessOverlay(true);
    setTimeout(() => setShowSuccessOverlay(false), 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    const hasFile = fields.some(f => f.type === 'file' && formData[f.name] instanceof File);
    let submissionData: any;
    const headers: any = {};

    if (hasFile) {
      submissionData = new FormData();
      fields.forEach(f => {
        if (formData[f.name] !== undefined) submissionData.append(f.name, formData[f.name]);
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      submissionData = {};
      fields.forEach(f => {
        if (formData[f.name] !== undefined && formData[f.name] !== '') submissionData[f.name] = formData[f.name];
      });
    }

    const finalEndpoint = submitEndpoint || endpoint;
    const payload = transformData ? transformData(submissionData, { editingItem }) : submissionData;
    const url = editingItem ? `/${finalEndpoint}/${editingItem._id}` : `/${finalEndpoint}`;
    const method = editingItem ? 'put' : 'post';

    try {
      await api[method](url, payload, { headers });
      setShowModal(false);
      setEditingItem(null);
      setFormData({});
      fetchData();
      triggerSuccess(editingItem ? 'Updated' : 'Saved');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/${endpoint}/${itemToDelete}`);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      fetchData();
      triggerSuccess('Deleted');
    } catch (err) {
      setMessage({ type: 'error', text: 'Error' });
      setShowDeleteConfirm(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-4 overflow-hidden relative p-4 md:p-6">
      {/* Messages & Overlays */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />
          <div className="relative bg-white w-full max-w-[200px] p-8 rounded-xl shadow-2xl border border-slate-50 flex flex-col items-center text-center animate-zoom-in">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-xl">
              <CheckCircle size={28} strokeWidth={3} />
            </div>
            <p className="text-xs font-semibold text-black capitalize tracking-[0.3em]">{successMsg}</p>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]" />
          <div className="relative bg-white w-full max-w-[300px] p-8 rounded-xl shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-zoom-in">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6"><Trash2 size={32} /></div>
            <h2 className="text-xs font-semibold text-black capitalize tracking-widest mb-2">Confirm Delete</h2>
            <p className="text-xs font-bold text-slate-400 capitalize tracking-widest mb-10 leading-relaxed">This record will be permanently removed.</p>
            <div className="flex flex-col w-full gap-3">
              <button onClick={handleDelete} className="w-full py-4 bg-red-500 text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/10">Yes, Delete</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 bg-slate-50 text-slate-400 rounded-lg text-xs font-semibold uppercase tracking-widest hover:text-black transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`fixed top-4 right-4 z-[520] px-4 py-3 rounded-lg text-xs font-semibold capitalize tracking-widest shadow-2xl ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-black capitalize tracking-tight">{moduleName}</h1>
          {/* <p className="text-xs font-bold text-slate-400 capitalize tracking-[0.2em]">{data.length} Records</p> */}
        </div>
        <button
          onClick={() => { setEditingItem(null); setFormData({}); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#E89731] text-white px-6 py-3 rounded-full hover:bg-[#d6862a] transition-all active:scale-95 shadow-xl shadow-[#E89731]/20"
        >
          <Plus size={16} /><span className="text-xs font-semibold capitalize tracking-widest hidden sm:inline">Add {moduleName.endsWith('s') ? moduleName.slice(0, -1) : moduleName}</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-300 flex flex-col min-h-0 overflow-hidden premium-shadow">
        <div className="p-4 border-b border-slate-100 bg-slate-50/10">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-300 rounded-lg text-xs font-bold text-black placeholder:text-slate-600 focus:outline-none focus:border-black transition-all" />
          </div>
        </div>

        <div className="flex-1 overflow-auto no-scrollbar table-responsive">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-black/10" size={32} />
              <p className="text-xs font-semibold capitalize tracking-[0.5em] text-black/10">Fetching</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale"><Plus size={40} className="mb-4" /><p className="text-xs font-semibold capitalize tracking-widest">No data found</p></div>
          ) : (
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="sticky top-0 bg-slate-200 backdrop-blur-sm z-10 border-b border-slate-100">
                <tr>
                  {(tableFields?.length ? tableFields : fields.slice(0, 5).map(f => f.name)).map(fieldName => {
                    const fieldMeta = fields.find(f => f.name === fieldName);
                    return <th key={fieldName} className="px-6 py-4 text-left text-sm font-semibold text-slate-600 capitalize tracking-widest">{fieldMeta?.label || fieldName}</th>;
                  })}
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600 capitalize tracking-widest">Options</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr
                    key={item._id}
                    className={`
    ${idx % 2 === 0 ? 'bg-white/70' : 'bg-slate-200/50'}
    hover:bg-slate-200/60
    transition-all
    cursor-default
  `}
                  >
                    {(tableFields?.length ? tableFields : fields.slice(0, 5).map(f => f.name)).map((fieldName, idx) => (
                      <td key={fieldName} className={`px-6 py-3 text-sm font-semibold text-black tracking-tight ${idx === 0 ? 'cursor-pointer hover:text-primary hover:underline' : ''}`} onClick={() => idx === 0 ? setViewingItem(item) : null}>
                        {item[fieldName] || <span className="text-slate-100 italic">none</span>}
                      </td>
                    ))}
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {moduleName === 'Locations' && (
                          <button
                            onClick={() => viewLocationStock(item)}
                            className="p-2.5 rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="View Items"
                          >
                            <Database size={16} />
                          </button>
                        )}
                        <button onClick={() => handleEdit(item)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-black hover:text-white transition-all shadow-sm" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => confirmDelete(item._id)} className="p-2.5 rounded-xl bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Item Stock Modal (Location Specific) */}
      {currentLocationForStock && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCurrentLocationForStock(null)} />
          <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-zoom-in flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-[11px] font-semibold text-black uppercase tracking-[0.2em]">Stored Items In: {currentLocationForStock.locationName}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time inventory in this bin</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddStockForm(true)}
                  className="bg-[#E89731] text-white px-5 py-3 rounded-lg text-xs font-semibold capitalize tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#E89731]/20"
                >
                  Add Item
                </button>
                <button onClick={() => setCurrentLocationForStock(null)} className="w-10 h-10 flex items-center justify-center bg-white text-slate-300 hover:text-black rounded-lg transition-all shadow-sm"><X size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
              {showAddStockForm ? (
                <div className="space-y-6 bg-slate-50 p-8 rounded-xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-black uppercase tracking-widest">New Stock Entry</p>
                    <button onClick={() => setShowAddStockForm(false)} className="text-xs font-bold text-slate-400 hover:text-black uppercase underline">Cancel</button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] ml-1">Select Item</label>
                      <select
                        value={quickStockData.item}
                        onChange={(e) => setQuickStockData({ ...quickStockData, item: e.target.value })}
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-lg text-xs font-bold text-black focus:outline-none focus:border-black transition-all mt-1"
                      >
                        <option value="">Choose Item...</option>
                        {apiOptions['quickAddItems']?.map((opt: any) => (
                          <option key={opt._id} value={opt.itemCode}>{opt.itemName} ({opt.itemCode})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] ml-1">Quantity to Add</label>
                      <input
                        type="number"
                        value={quickStockData.quantity || ''}
                        onChange={(e) => setQuickStockData({ ...quickStockData, quantity: Number(e.target.value) })}
                        placeholder="0.00"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-lg text-xs font-bold text-black focus:outline-none focus:border-black transition-all mt-1"
                      />
                    </div>
                    <button
                      onClick={handleQuickAddStock}
                      className="w-full py-5 bg-blue-600 text-white rounded-lg text-xs font-semibold uppercase tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/10 mt-2"
                    >
                      Submit Stock <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {isStockLoading ? (
                    <div className="flex flex-col items-center py-10 gap-3"><Loader2 className="animate-spin text-slate-200" size={32} /></div>
                  ) : stockItems.length === 0 ? (
                    <div className="flex flex-col items-center py-10 opacity-30 gap-3"><Package size={40} /><p className="text-xs font-semibold uppercase tracking-widest">This location is empty</p></div>
                  ) : (
                    <div className="space-y-3">
                      {stockItems.map((item, idx) => (
                        <div key={idx} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-black transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-300 group-hover:text-black transition-colors"><Package size={20} /></div>
                            <div>
                              <p className="text-xs font-semibold text-black uppercase tracking-tight">{item.itemName}</p>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.item}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[12px] font-semibold text-black tracking-tight">{item.availableQty}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-50 overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
              <div>
                <h2 className="text-[11px] font-semibold text-black uppercase tracking-[0.2em]">{editingItem ? 'Modify' : 'Create'} {moduleName.slice(0, -1)}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Fill all mandatory details</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-black rounded-lg transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
              <div className="p-8 space-y-6 overflow-y-auto no-scrollbar bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {fields.map((field) => (
                    <div key={field.name} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                      <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{field.label}</label>
                        {field.required && <span className="text-xs font-semibold text-primary uppercase">Required</span>}
                      </div>
                      {field.type === 'textarea' ? (
                        <textarea name={field.name} required={field.required} value={formData[field.name] || ''} onChange={handleInputChange} rows={3} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-black focus:outline-none focus:border-black transition-all resize-none shadow-sm" />
                      ) : field.type === 'select' || field.type === 'select-api' ? (
                        <select name={field.name} required={field.required} value={formData[field.name] || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-black focus:outline-none focus:border-black transition-all appearance-none cursor-pointer shadow-sm">
                          <option value="">Select Option</option>
                          {field.type === 'select' ? field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>) : apiOptions[field.name]?.filter((opt: any) => {
                            if (!field.filterBy) return true;
                            const filterValue = formData[field.filterBy];
                            if (!filterValue) return true;
                            return String(opt.warehouse) === String(filterValue) || String(opt.warehouseCode) === String(filterValue) || String(opt.parent) === String(filterValue);
                          }).map((opt: any) => <option key={opt._id || getOptionLabel(opt, field.displayKey)} value={field.optionValueKey ? (opt[field.optionValueKey] || getOptionLabel(opt, field.displayKey)) : getOptionLabel(opt, field.displayKey)}>{getOptionLabel(opt, field.displayKey)}</option>)}
                        </select>
                      ) : field.type === 'file' ? (
                        <div className="relative group/file">
                          <input type="file" name={field.name} required={field.required} onChange={handleInputChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 border-dashed rounded-xl text-xs font-bold text-slate-400 group-hover/file:border-black group-hover/file:bg-slate-100/50 transition-all flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover/file:text-black transition-colors"><Plus size={16} /></div>
                            <span>{formData[field.name] instanceof File ? (formData[field.name] as File).name : formData[field.name] || 'Choose File'}</span>
                          </div>
                        </div>
                      ) : (
                        <input type={field.type} name={field.name} required={field.required} value={formData[field.name] || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-black focus:outline-none focus:border-black transition-all shadow-sm" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 bg-slate-50/20 border-t border-slate-50"><button type="submit" disabled={loading} className="w-full py-5 bg-[#E89731] text-white rounded-xl text-xs font-semibold capitalize tracking-[0.3em] hover:bg-[#d6862a] transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50">{loading ? <Loader2 className="animate-spin" size={16} /> : `Save ${moduleName.endsWith('s') ? moduleName.slice(0, -1) : moduleName}`}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Card View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-[450] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={() => setViewingItem(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-50 overflow-hidden animate-zoom-in p-10 flex flex-col items-center max-h-[90vh]">
            <button onClick={() => setViewingItem(null)} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-black rounded-lg transition-all"><X size={20} /></button>
            <div className="w-full h-[450px] bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 mb-8 overflow-hidden group/preview relative">
              {(() => {
                const fileField = fields.find(f => f.type === 'file');
                const filePath = fileField ? viewingItem[fileField.name] : null;
                const fileUrl = filePath ? `http://localhost:5000${filePath}` : null;
                if (!fileUrl) return <div className="flex flex-col items-center opacity-40"><FileText size={48} className="mb-3" /><p className="text-xs font-semibold uppercase tracking-widest text-center">No Document Attached</p></div>;
                const isPdf = filePath?.toLowerCase().endsWith('.pdf');
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath || '');
                if (isPdf) return <object data={fileUrl} type="application/pdf" className="w-full h-full rounded-xl"><div className="flex flex-col items-center p-8 text-center"><FileText size={48} className="text-primary mb-3" /><p className="text-xs font-semibold uppercase tracking-widest mb-4">PDF Preview not available</p><a href={fileUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-black text-white rounded-full text-xs font-semibold uppercase tracking-widest">Open PDF</a></div></object>;
                if (isImage) return <img src={fileUrl} className="w-full h-full object-contain" alt="Preview" />;
                return <div className="flex flex-col items-center p-8 text-center"><FileText size={48} className="text-primary mb-3" /><p className="text-xs font-semibold uppercase tracking-widest mb-2">{filePath?.split('/').pop()}</p><a href={fileUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary underline uppercase tracking-widest">Download to View</a></div>;
              })()}
            </div>
            <h2 className="text-sm font-semibold text-black uppercase tracking-[0.2em] mb-2">{viewingItem[fields[0].name]}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Document Viewer</p>
            {(() => {
              const fileField = fields.find(f => f.type === 'file');
              const filePath = fileField ? viewingItem[fileField.name] : null;
              const fileUrl = filePath ? `http://localhost:5000${filePath}` : null;
              if (fileUrl) return <a href={fileUrl} target="_blank" rel="noreferrer" className="w-full py-5 bg-black text-white rounded-xl text-xs font-semibold uppercase tracking-[0.3em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl">Open in New Tab</a>;
              return null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterPage;
