import React from 'react';
import MasterPage from './MasterPage';

const StockUpdate: React.FC = () => {
  const fields = [
    { name: 'transactionNumber', label: 'Trans #', type: 'text', required: true },
    { name: 'transactionType', label: 'Type', type: 'select', options: ['Consumption', 'Adjustment', 'Return'] },
    { name: 'item', label: 'Item', type: 'select-api', apiEndpoint: '/inventory/items', displayKey: 'itemName', required: true },
    { name: 'warehouse', label: 'Warehouse', type: 'select-api', apiEndpoint: '/master/warehouses', displayKey: 'warehouseName', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'quantity', label: 'Qty', type: 'number', required: true },
    { name: 'updatedStock', label: 'Final Stock', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: ['completed', 'pending'], required: true }
  ];
  return <MasterPage moduleName="Stock Update" endpoint="warehouse-ops/stock-updates" fields={fields as any} />;
};

export default StockUpdate;
