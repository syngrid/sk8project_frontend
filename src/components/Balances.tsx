import React, { useEffect, useState } from 'react';
import api from '../utils/api';

type BalanceRow = {
  item: string;
  itemName: string;
  warehouse: string;
  warehouseLocation: string;
  stockInQty: number;
  availableQty: number;
  grn?: string;
};

const Balances: React.FC = () => {
  const [rows, setRows] = useState<BalanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRows = async () => {
      try {
        const res = await api.get('/inventory/balances/summary');
        setRows(res.data || []);
      } catch (err) {
        console.error('Balance summary fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRows();
  }, []);

  return (
    <div className="h-full min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
           <h1 className="text-xl font-semibold uppercase tracking-tight text-black">Storage Inventory</h1>
           <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Item tracking by Warehouse & Bin</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar">
        {loading ? (
          <div className="p-6 text-xs font-semibold uppercase tracking-widest text-slate-300">Loading balance...</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-xs font-semibold uppercase tracking-widest text-slate-300">No storage records found</div>
        ) : (
          <table className="w-full border-collapse min-w-[900px]">
            <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Item Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Warehouse</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Location/Bin</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">Stock Qty</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">Ref (GRN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                     <p className="text-xs font-semibold text-black uppercase tracking-tight">{row.itemName}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-widest">{row.warehouse}</td>
                  <td className="px-6 py-4">
                     <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        {row.warehouseLocation}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-semibold text-black">{row.stockInQty ?? 0}</td>
                  <td className="px-6 py-4 text-center text-xs font-bold text-slate-400 italic">{row.grn || 'Manual'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Balances;
