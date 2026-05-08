import React from 'react';
import MasterPage from './MasterPage';

const Transfers: React.FC = () => {
  const fields = [
    { name: 'transferNumber', label: 'Transfer #', type: 'text', required: true },
    { name: 'fromWarehouse', label: 'From Warehouse', type: 'text', required: true },
    { name: 'toWarehouse', label: 'To Warehouse', type: 'text', required: true },
    { name: 'item', label: 'Item', type: 'text', required: true },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'transferStatus', label: 'Status', type: 'select', options: ['pending', 'inTransit', 'completed', 'cancelled'], required: true },
    { name: 'transferReason', label: 'Reason', type: 'textarea' },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Stock Transfers" endpoint="inventory/transfers" fields={fields as any} />;
};

export default Transfers;
