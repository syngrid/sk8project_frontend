import React from 'react';
import MasterPage from './MasterPage';

const PRItems: React.FC = () => {
  const fields = [
    { name: 'purchaseRequest', label: 'PR #', type: 'select-api', apiEndpoint: '/procurement/pr', displayKey: 'prNumber', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'item', label: 'Item', type: 'select-api', apiEndpoint: '/inventory/items', displayKey: 'itemName', required: true },
    { name: 'requestedQuantity', label: 'Qty', type: 'number', required: true },
    { name: 'estimatedCost', label: 'Est Cost', type: 'number' },
    { name: 'supplier', label: 'Supplier', type: 'select-api', apiEndpoint: '/master/suppliers', displayKey: 'supplierName' },
    { name: 'status', label: 'Status', type: 'select', options: ['pending', 'ordered', 'cancelled'], required: true }
  ];
  return <MasterPage moduleName="PR Items" endpoint="procurement/pr-items" fields={fields as any} />;
};

export default PRItems;
