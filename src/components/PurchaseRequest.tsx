import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, AlertTriangle
} from 'lucide-react';
import api from '../utils/api';

interface PRItem {
  item: string;
  itemDescription: string;
  unit: string;
  requestedQuantity: number;
  availableQuantity: number;
  shortageQuantity: number;
  estimatedCost: number;
  suggestedSupplier: string;
}

const PurchaseRequest: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [boms, setBoms] = useState<any[]>([]);
  const [currentBomItems, setCurrentBomItems] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    project: '',
    bom: '',
    department: '',
    requestedBy: '',
    requiredDate: '',
    priority: 'Medium',
    remarks: '',
    items: [] as PRItem[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prRes, projRes, itemRes, bomRes, deptRes, userRes] = await Promise.all([
        api.get('/procurement/pr'),
        api.get('/project/projects'),
        api.get('/inventory/items'),
        api.get('/bom/master'),
        api.get('/master/departments'),
        api.get('/master/users')
      ]);
      setRecords(prRes.data);
      setProjects(projRes.data);
      setInventoryItems(itemRes.data);
      setBoms(bomRes.data);
      setDepartments(deptRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      
    }
  };

  useEffect(() => {
    if (formData.bom) {
      loadBomItems(formData.bom);
    } else {
      setCurrentBomItems([]);
    }
  }, [formData.bom]);

  const loadBomItems = async (bomNo: string) => {
    try {
      const res = await api.get(`/bom/items?bom=${bomNo}`);
      setCurrentBomItems(res.data || []);
    } catch (err) {
      console.error('Error loading BOM items:', err);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { 
        item: '', 
        itemDescription: '', 
        unit: '', 
        requestedQuantity: 0, 
        availableQuantity: 0, 
        shortageQuantity: 0, 
        estimatedCost: 0, 
        suggestedSupplier: '' 
      }]
    });
  };

  const handleItemChange = (index: number, field: keyof PRItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'item' || field === 'requestedQuantity') {
      // Try to find in current BOM items first, then global inventory
      const sourceList = formData.bom ? currentBomItems.map(bi => ({
        itemName: bi.item,
        description: bi.itemDescription,
        unit: bi.unit,
        currentStock: bi.availableStock || 0,
        shortageQuantity: bi.shortageQuantity || 0
      })) : inventoryItems;

      const selectedItem = sourceList.find(i => i.itemName === newItems[index].item);
      if (selectedItem) {
        newItems[index].itemDescription = selectedItem.description || '';
        newItems[index].unit = selectedItem.unit || '';
        newItems[index].availableQuantity = (selectedItem as any).currentStock || 0;
        
        // If it's a BOM item, use its calculated shortage as default qty if qty is 0
        if (formData.bom && newItems[index].requestedQuantity === 0) {
          newItems[index].requestedQuantity = (selectedItem as any).shortageQuantity || 0;
        }

        newItems[index].shortageQuantity = Math.max(0, (newItems[index].requestedQuantity || 0) - (newItems[index].availableQuantity || 0));
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const handleEdit = async (record: any) => {
    setEditingId(record._id);
    try {
      const itemsRes = await api.get(`/procurement/pr-items?purchaseRequest=${record.prNumber}`);
      setFormData({
        project: record.project,
        bom: record.bom,
        department: record.department,
        requestedBy: record.requestedBy,
        requiredDate: record.requiredDate ? new Date(record.requiredDate).toISOString().split('T')[0] : '',
        priority: record.priority,
        remarks: record.remarks,
        items: itemsRes.data
      });
      setIsFormOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this PR?')) return;
    try {
      await api.delete(`/procurement/pr/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (formData.items.length === 0) return alert('Please add at least one item');
    try {
      if (editingId) {
        await api.put(`/procurement/pr/${editingId}`, formData);
        // Simplified: delete and recreate items for update
        const pr = records.find(r => r._id === editingId);
        await api.delete(`/procurement/pr-items?purchaseRequest=${pr.prNumber}`); // Assuming bulk delete works or handling it properly
        for (const item of formData.items) {
          await api.post('/procurement/pr-items', { ...item, purchaseRequest: pr.prNumber });
        }
      } else {
        const prNumber = `PR-${Date.now().toString().slice(-6)}`;
        await api.post('/procurement/pr', { ...formData, prNumber, approvalStatus: 'Pending Approval' });
        for (const item of formData.items) {
          await api.post('/procurement/pr-items', { ...item, purchaseRequest: prNumber });
        }
      }

      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        project: '', bom: '', department: '', requestedBy: '', requiredDate: '', priority: 'Medium', remarks: '', items: []
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 bg-slate-50/50 p-6 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-black capitalize tracking-tight">Purchase Requests</h1>
          <p className="text-xs font-semibold capitalize tracking-widest text-slate-400 mt-1">
            {records.length} Total Requests • Material Requisition
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ project: '', bom: '', department: '', requestedBy: '', requiredDate: '', priority: 'Medium', remarks: '', items: [] });
            setIsFormOpen(true);
          }}
          className="bg-black text-white px-6 py-4 rounded-lg text-xs font-semibold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-3"
        >
          <Plus size={16} />
          New Request
        </button>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-semibold capitalize tracking-widest text-slate-400">PR Details</th>
                <th className="px-8 py-5 text-xs font-semibold capitalize tracking-widest text-slate-400">Project / BOM</th>
                <th className="px-8 py-5 text-xs font-semibold capitalize tracking-widest text-slate-400 text-center">Required Date</th>
                <th className="px-8 py-5 text-xs font-semibold capitalize tracking-widest text-slate-400 text-center">Status</th>
                <th className="px-8 py-5 text-xs font-semibold capitalize tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map((record) => (
                <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-xs font-semibold text-black">{record.prNumber}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">{new Date(record.requestDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-semibold text-black">{record.project}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">{record.bom || 'Manual'}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                      {record.requiredDate ? new Date(record.requiredDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest ${
                      record.approvalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                      record.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-600' : 
                      record.approvalStatus === 'PO Created' ? 'bg-blue-100 text-blue-600' : 
                      record.approvalStatus === 'Draft' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {record.approvalStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(record)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-black hover:text-white transition-all shadow-sm"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(record._id)}
                        className="p-2.5 rounded-xl bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-black uppercase tracking-tight">{editingId ? 'Edit PR' : 'Purchase Request'}</h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">Material Requisition Form</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-lg hover:rotate-90 transition-all">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 no-scrollbar flex-1">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Project</p>
                  <select 
                    value={formData.project}
                    onChange={(e) => setFormData({...formData, project: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p.projectCode}>{p.projectName}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">BOM Reference</p>
                  <select 
                    value={formData.bom}
                    onChange={(e) => setFormData({...formData, bom: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  >
                    <option value="">Manual / Select BOM</option>
                    {boms.filter(b => b.project === formData.project).map(b => <option key={b._id} value={b.bomNumber}>{b.bomNumber}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Requested By</p>
                  <select 
                    value={formData.requestedBy}
                    onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  >
                    <option value="">Select User</option>
                    {users.map(u => <option key={u._id} value={u.firstName + ' ' + (u.lastName || '')}>{u.firstName} {u.lastName}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Department</p>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  >
                    <option value="">Select Dept</option>
                    {departments.map(d => <option key={d._id} value={d.departmentName}>{d.departmentName}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Priority</p>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Required Date</p>
                  <input type="date" value={formData.requiredDate} onChange={(e) => setFormData({...formData, requiredDate: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all" />
                </div>
                <div className="col-span-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Remarks</p>
                  <input 
                    type="text" 
                    value={formData.remarks} 
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})} 
                    placeholder="Brief description of the requirement..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all" 
                  />
                </div>
              </div>

              {/* Items Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black">Request Items</h3>
                  <button onClick={handleAddItem} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400">Item</th>
                        <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400 text-center">Qty</th>
                        <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400 text-center">Avail</th>
                        <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400 text-center">Shortage</th>
                        <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400 text-right">Est. Cost</th>
                        <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index} className="bg-white rounded-lg shadow-sm">
                          <td className="px-4 py-3 rounded-l-2xl min-w-[200px]">
                            <select 
                              value={item.item}
                              onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                              className="w-full bg-transparent text-xs font-bold focus:outline-none"
                            >
                              <option value="">Select Item</option>
                              {formData.bom ? (
                                currentBomItems.map(bi => <option key={bi._id} value={bi.item}>{bi.item}</option>)
                              ) : (
                                inventoryItems.map(i => <option key={i._id} value={i.itemName}>{i.itemName}</option>)
                              )}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input type="number" value={item.requestedQuantity} onChange={(e) => handleItemChange(index, 'requestedQuantity', Number(e.target.value))} className="w-16 bg-slate-50 rounded-lg px-2 py-1 text-xs font-bold text-center focus:outline-none" />
                          </td>
                          <td className="px-4 py-3 text-center text-xs font-bold text-slate-400">{item.availableQuantity}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-semibold ${item.shortageQuantity > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{item.shortageQuantity}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <input type="number" value={item.estimatedCost} onChange={(e) => handleItemChange(index, 'estimatedCost', Number(e.target.value))} className="w-20 bg-slate-50 rounded-lg px-2 py-1 text-xs font-bold text-right focus:outline-none" />
                          </td>
                          <td className="px-4 py-3 text-center rounded-r-2xl">
                            <button onClick={() => {
                              const newItems = formData.items.filter((_, i) => i !== index);
                              setFormData({...formData, items: newItems});
                            }} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-amber-500 bg-amber-50 px-4 py-2 rounded-xl">
                  <AlertTriangle size={16} />
                  <p className="text-xs font-semibold uppercase tracking-widest">Inventory mapping is active</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsFormOpen(false)} className="px-8 py-4 rounded-lg text-xs font-semibold uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={handleSave} className="bg-black text-white px-12 py-4 rounded-lg text-xs font-semibold uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all">{editingId ? 'Update PR' : 'Submit PR'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequest;
