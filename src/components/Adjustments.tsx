import React from 'react';
import MasterPage from './MasterPage';

const Adjustments: React.FC = () => {
  const fields = [
    { name: 'adjustmentNumber', label: 'Adjustment #', type: 'text', required: true },
    { name: 'warehouse', label: 'Warehouse', type: 'text', required: true },
    { name: 'item', label: 'Item', type: 'text', required: true },
    { name: 'adjustmentType', label: 'Type', type: 'select', options: ['addition', 'subtraction'], required: true },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected'], required: true },
    { name: 'reason', label: 'Reason', type: 'textarea' },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Stock Adjustments" endpoint="inventory/adjustments" fields={fields as any} />;
};

export default Adjustments;
