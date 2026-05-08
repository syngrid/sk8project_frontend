import React from 'react';
import MasterPage from './MasterPage';

const ItemMaster: React.FC = () => {
  const fields = [
    { name: 'itemName', label: 'Item Name', type: 'text', required: true },
    { name: 'itemCategory', label: 'Category', type: 'select-api', apiEndpoint: '/master/categories', displayKey: 'categoryName' },
    { name: 'unit', label: 'Unit', type: 'select-api', apiEndpoint: '/master/units', displayKey: 'unitName' },
    { name: 'itemCost', label: 'Cost Price', type: 'number' },
    { name: 'warehouse', label: 'Primary Warehouse', type: 'select-api', apiEndpoint: '/master/warehouses', displayKey: 'warehouseName' },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'discontinued'] }
  ];

  return <MasterPage moduleName="Item Master" endpoint="inventory/items" fields={fields as any} />;
};

export default ItemMaster;
