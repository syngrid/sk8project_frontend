import React from 'react';
import MasterPage from './MasterPage';

const Transactions: React.FC = () => {
  const fields = [
    { name: 'transactionNumber', label: 'Transaction #', type: 'text', required: true },
    { name: 'transactionType', label: 'Type', type: 'select', options: ['stockIn', 'stockOut', 'return'], required: true },
    { name: 'item', label: 'Item', type: 'text', required: true },
    { name: 'warehouse', label: 'Warehouse', type: 'text' },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'referenceNumber', label: 'Ref #', type: 'text' },
    { name: 'project', label: 'Project', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['completed', 'pending', 'cancelled'], required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Stock Movement History" endpoint="inventory/transactions" fields={fields as any} />;
};

export default Transactions;
