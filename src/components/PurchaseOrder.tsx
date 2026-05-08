import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, X, Send
} from 'lucide-react';
import api from '../utils/api';

interface POItem {
  item: string;
  itemCode: string;
  itemDescription: string;
  unit: string;
  orderedQuantity: number;
  unitPrice: number;
  tax: number;
  totalAmount: number;
}

const PurchaseOrder: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [approvedPRs, setApprovedPRs] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    poNumber: '',
    poDate: new Date().toISOString().split('T')[0],
    supplier: '',
    project: '',
    prReference: '',
    deliveryDate: '',
    paymentTerms: 'Net 30',
    deliveryAddress: '',
    remarks: '',
    poStatus: 'Draft',
    items: [] as POItem[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [poRes, projRes, supRes, prRes, whRes] = await Promise.all([
        api.get('/procurement/po'),
        api.get('/project/projects'),
        api.get('/master/suppliers'),
        api.get('/procurement/pr'),
        api.get('/master/warehouses')
      ]);
      setRecords(poRes.data);
      setProjects(projRes.data);
      setSuppliers(supRes.data);
      setApprovedPRs(prRes.data.filter((pr: any) => pr.approvalStatus === 'Approved'));
      setWarehouses(whRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      
    }
  };

  const handlePRSelection = async (prNumber: string) => {
    const pr = approvedPRs.find(p => p.prNumber === prNumber);
    if (!pr) return;

    try {
      const itemsRes = await api.get(`/procurement/pr-items?purchaseRequest=${prNumber}`);
      const poItems = itemsRes.data.map((item: any) => ({
        item: item.item,
        itemCode: item.itemCode || 'N/A',
        itemDescription: item.itemDescription,
        unit: item.unit,
        orderedQuantity: item.requestedQuantity,
        unitPrice: 0,
        tax: 0,
        totalAmount: 0
      }));

      setFormData({
        ...formData,
        prReference: prNumber,
        project: pr.project,
        items: poItems
      });
    } catch (err) {
      console.error('Error fetching PR items:', err);
    }
  };

  const handleItemChange = (index: number, field: keyof POItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'unitPrice' || field === 'orderedQuantity' || field === 'tax') {
      newItems[index].totalAmount = (newItems[index].orderedQuantity * newItems[index].unitPrice) + (newItems[index].tax || 0);
    }
    setFormData({ ...formData, items: newItems });
  };

  const calculateGrandTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  const handleEdit = async (record: any) => {
    setEditingId(record._id);
    try {
      const itemsRes = await api.get(`/procurement/po-items?purchaseOrder=${record.poNumber}`);
      setFormData({
        poNumber: record.poNumber,
        poDate: record.poDate ? new Date(record.poDate).toISOString().split('T')[0] : '',
        supplier: record.supplier,
        project: record.project,
        prReference: record.prReference,
        deliveryDate: record.deliveryDate ? new Date(record.deliveryDate).toISOString().split('T')[0] : '',
        paymentTerms: record.paymentTerms,
        deliveryAddress: record.deliveryAddress,
        remarks: record.remarks,
        poStatus: record.poStatus,
        items: itemsRes.data
      });
      setIsFormOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this PO?')) return;
    try {
      await api.delete(`/procurement/po/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (status: string = 'Draft') => {
    if (!formData.supplier) return alert('Please select a supplier');
    try {
      const payload = { ...formData, poStatus: status, totalAmount: calculateGrandTotal() };
      if (editingId) {
        await api.put(`/procurement/po/${editingId}`, payload);
      } else {
        const poNumber = `PO-${Date.now().toString().slice(-6)}`;
        await api.post('/procurement/po/with-logic', { ...payload, poNumber });
      }

      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        poNumber: '', poDate: new Date().toISOString().split('T')[0],
        supplier: '', prReference: '', project: '',
        deliveryDate: '', paymentTerms: 'Net 30', deliveryAddress: '', 
        remarks: '', poStatus: 'Draft', items: []
      });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save PO');
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 bg-slate-50/50 p-6 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-black capitalize tracking-tight">Purchase Orders</h1>
          <p className="text-xs font-semibold capitalize tracking-widest text-slate-400 mt-1">
            {records.length} Total Orders • Procurement & Supply Chain
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({
              poNumber: '', poDate: new Date().toISOString().split('T')[0],
              supplier: '', prReference: '', project: '',
              deliveryDate: '', paymentTerms: 'Net 30', deliveryAddress: '', 
              remarks: '', poStatus: 'Draft', items: []
            });
            setIsFormOpen(true);
          }}
          className="bg-black text-white px-6 py-4 rounded-lg text-xs font-semibold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-3"
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-semibold capitalize tracking-widest text-slate-400">PO Details</th>
                <th className="px-8 py-5 text-xs font-semibold capitalize tracking-widest text-slate-400">Supplier & Project</th>
                <th className="px-8 py-5 text-xs font-semibold capitalize tracking-widest text-slate-400 text-center">Amount</th>
                <th className="px-8 py-5 text-xs font-semibold capitalize tracking-widest text-slate-400 text-center">Status</th>
                <th className="px-8 py-5 text-xs font-semibold capitalize tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map((record) => (
                <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-xs font-semibold text-black">{record.poNumber}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">{new Date(record.poDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-semibold text-black">{record.supplier}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">{record.project}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <p className="text-xs font-semibold text-black">₹{record.totalAmount?.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest ${
                      record.poStatus === 'Sent' ? 'bg-indigo-100 text-indigo-600' : 
                      record.poStatus === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {record.poStatus}
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
          <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-black uppercase tracking-tight">{editingId ? 'Edit PO' : 'New Purchase Order'}</h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">Order Ref: {formData.poNumber || 'Drafting...'}</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-lg hover:rotate-90 transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 no-scrollbar flex-1">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">PR Reference</p>
                  <select 
                    value={formData.prReference}
                    onChange={(e) => handlePRSelection(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  >
                    <option value="">Select Approved PR</option>
                    {approvedPRs.map(pr => <option key={pr._id} value={pr.prNumber}>{pr.prNumber} - {pr.project}</option>)}
                  </select>
                </div>
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
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Supplier</p>
                  <select 
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s._id} value={s.supplierName}>{s.supplierName}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">PO Date</p>
                  <input type="date" value={formData.poDate} onChange={(e) => setFormData({...formData, poDate: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Delivery Date</p>
                  <input type="date" value={formData.deliveryDate} onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Payment Terms</p>
                  <input type="text" value={formData.paymentTerms} onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Delivery Address</p>
                  <select 
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-5 py-4 text-xs font-bold focus:outline-none appearance-none"
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map(wh => <option key={wh._id} value={wh.address}>{wh.warehouseName}</option>)}
                  </select>
                </div>
              </div>

              {/* Item Grid */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Line Items</h3>
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400">Item</th>
                      <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400 text-center">Qty</th>
                      <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400 text-right">Price</th>
                      <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400 text-right">Tax</th>
                      <th className="px-4 py-2 text-[8px] font-semibold uppercase text-slate-400 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <p className="text-xs font-semibold text-black">{item.item}</p>
                          <p className="text-xs font-bold text-slate-400">Code: {item.itemCode}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="number" value={item.orderedQuantity} onChange={(e) => handleItemChange(index, 'orderedQuantity', Number(e.target.value))} className="w-16 bg-white border border-slate-100 rounded-lg px-2 py-1 text-center text-xs font-bold" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))} className="w-24 bg-white border border-slate-100 rounded-lg px-2 py-1 text-right text-xs font-bold" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input type="number" value={item.tax} onChange={(e) => handleItemChange(index, 'tax', Number(e.target.value))} className="w-20 bg-white border border-slate-100 rounded-lg px-2 py-1 text-right text-xs font-bold" />
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-semibold">₹{item.totalAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-6">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 ml-1">Remarks</p>
                  <textarea value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-4 text-xs font-bold focus:outline-none resize-none" rows={3} />
                </div>
                <div className="w-80 bg-black text-white p-8 rounded-xl flex flex-col justify-center">
                  <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Grand Total</p>
                  <p className="text-3xl font-semibold">₹{calculateGrandTotal().toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <button onClick={() => setIsFormOpen(false)} className="px-8 py-4 rounded-lg text-xs font-semibold uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={() => handleSave('Draft')} className="bg-slate-100 text-black px-8 py-4 rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-slate-200 transition-all">Save Draft</button>
                <button onClick={() => handleSave('Sent')} className="bg-black text-white px-10 py-4 rounded-lg text-xs font-semibold uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                  <Send size={16} /> Issue PO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;
