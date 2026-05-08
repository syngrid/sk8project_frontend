import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, FileText,
  Undo2, Info, Package
} from 'lucide-react';
import api from '../utils/api';

interface PendingPR {
  _id: string;
  prNumber: string;
  project: string;
  requestDate: string;
  approvalStatus: string;
  requestedBy: string;
  department: string;
  priority: string;
  remarks?: string;
}

const PurchaseApproval: React.FC = () => {
  const [pendingPRs, setPendingPRs] = useState<PendingPR[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPR, setSelectedPR] = useState<PendingPR | null>(null);
  const [prItems, setPrItems] = useState<any[]>([]);
  const [comments, setComments] = useState('');

  useEffect(() => {
    loadPendingPRs();
  }, []);

  const loadPendingPRs = async () => {
    try {
      const res = await api.get('/procurement/pr');
      setPendingPRs(res.data.filter((pr: any) => pr.approvalStatus === 'Pending Approval'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPRItems = async (pr: PendingPR) => {
    setSelectedPR(pr);
    try {
      const res = await api.get(`/procurement/pr-items?purchaseRequest=${pr.prNumber}`);
      setPrItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (action: 'approve' | 'reject' | 'send-back', prId: string) => {
    try {
      await api.post(`/procurement/pr/${prId}/${action}`, { comments, approver: 'Admin' });
      setSelectedPR(null);
      setPrItems([]);
      setComments('');
      loadPendingPRs();
      alert(`PR ${action.replace('-', ' ')} successfully!`);
    } catch (err) {
      console.error(err);
      alert('Action failed. Please try again.');
    }
  };

  const calculateTotal = () => {
    return prItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  };

  return (
    <div className="h-full flex flex-col space-y-6 bg-slate-50/50 p-6 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-black uppercase tracking-tight">Purchase Approval</h1>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
          {pendingPRs.length} Pending Requests • Manager Review Required
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
        {/* Left Side: List of Pending PRs */}
        <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar">
          {pendingPRs.map((pr) => (
            <div 
              key={pr._id}
              onClick={() => loadPRItems(pr)}
              className={`
                bg-white p-6 rounded-[32px] border transition-all cursor-pointer group
                ${selectedPR?._id === pr._id ? 'border-black shadow-xl scale-[1.02]' : 'border-slate-100 shadow-sm hover:border-slate-200'}
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl transition-all ${selectedPR?._id === pr._id ? 'bg-black text-white' : 'bg-slate-50 text-slate-400'}`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-black">{pr.prNumber}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(pr.requestDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  pr.priority === 'Urgent' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                }`}>
                  {pr.priority}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Project</p>
                  <p className="text-xs font-bold text-black">{pr.project}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Requested By</p>
                  <p className="text-xs font-bold text-black">{pr.requestedBy}</p>
                </div>
              </div>
            </div>
          ))}

          {!loading && pendingPRs.length === 0 && (
            <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-black text-black uppercase tracking-tight">All Clear!</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">No pending purchase requests to approve.</p>
            </div>
          )}
        </div>

        {/* Right Side: Details & Action Pane */}
        <div className="h-full">
          {selectedPR ? (
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-8 space-y-6 flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-black uppercase tracking-tight">Review Details</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Status: {selectedPR.approvalStatus}</p>
                </div>
                <div className="p-4 bg-slate-50 text-black rounded-3xl text-center min-w-[120px]">
                  <p className="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Est. Total</p>
                  <p className="text-sm font-black">₹{calculateTotal().toLocaleString()}</p>
                </div>
              </div>

              {/* Items Grid for Review */}
              <div className="bg-slate-50 rounded-[32px] p-6 flex-1 overflow-y-auto no-scrollbar">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Package size={14} /> Requested Materials
                </h3>
                <div className="space-y-3">
                  {prItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-black">{item.item}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Qty: {item.requestedQuantity} {item.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-black">₹{item.estimatedCost?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Decision Comments</p>
                  <textarea 
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add approval notes or reasons for rejection/revision..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleAction('approve', selectedPR._id)}
                      className="bg-emerald-500 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 size={18} /> Approve
                    </button>
                    <button 
                      onClick={() => handleAction('reject', selectedPR._id)}
                      className="bg-red-50 text-red-500 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                  <button 
                    onClick={() => handleAction('send-back', selectedPR._id)}
                    className="w-full bg-slate-100 text-slate-500 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    <Undo2 size={16} /> Send Back for Revision
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100/50 rounded-[40px] border border-dashed border-slate-200 h-full flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
              <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                <Info size={32} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest">Select a request to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseApproval;
