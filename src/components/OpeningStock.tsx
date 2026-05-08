import React from 'react';
import MasterPage from './MasterPage';

const OpeningStock: React.FC = () => {
  const fields = [
    { name: 'item', label: 'Item', type: 'text', required: true },
    { name: 'warehouse', label: 'Warehouse', type: 'text', required: true },
    { name: 'openingQuantity', label: 'Opening Qty', type: 'number', required: true },
    { name: 'openingValue', label: 'Opening Value', type: 'number' },
    { name: 'unitCost', label: 'Unit Cost', type: 'number' },
    { name: 'openingDate', label: 'Opening Date', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Opening Stock" endpoint="inventory/opening-stock" fields={fields as any} />;
};

export default OpeningStock;
