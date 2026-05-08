import React from 'react';
import MasterPage from './MasterPage';

const GRN: React.FC = () => {
  const fields = [
    { name: 'grnNumber', label: 'GRN Number', type: 'text', required: true },
    { name: 'purchaseOrder', label: 'Link to PO', type: 'select-api', apiEndpoint: '/procurement/po', displayKey: 'poNumber', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'grnDate', label: 'Date Received', type: 'date', required: true },
    { name: 'warehouse', label: 'Store Location', type: 'select-api', apiEndpoint: '/master/warehouses', displayKey: 'warehouseName', required: true },
    { name: 'grnStatus', label: 'Status', type: 'select', options: ['completed', 'pending'] }
  ];
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black">Stock In Header</p>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
            Item name, category, and unit are shown in <span className="text-black">Stock In</span>.
          </p>
        </div>
        <a
          href="/GRNItems"
          className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-[0.25em] hover:bg-slate-800 transition-all"
        >
          Open Stock In
        </a>
      </div>
      <MasterPage moduleName="Stock In" endpoint="warehouse-ops/grn" fields={fields as any} />
    </div>
  );
};

export default GRN;
