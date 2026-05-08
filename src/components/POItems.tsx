import React from 'react';
import MasterPage from './MasterPage';

const POItems: React.FC = () => {
  const fields = [
    { name: 'purchaseOrder', label: 'PO #', type: 'text', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'item', label: 'Item', type: 'text', required: true },
    { name: 'orderedQuantity', label: 'Ordered Qty', type: 'number', required: true },
    { name: 'receivedQuantity', label: 'Received Qty', type: 'number' },
    { name: 'unitPrice', label: 'Unit Price', type: 'number' },
    { name: 'totalAmount', label: 'Total', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: ['pending', 'partiallyReceived', 'fullyReceived'], required: true }
  ];
  return <MasterPage moduleName="PO Items" endpoint="procurement/po-items" fields={fields as any} />;
};

export default POItems;
