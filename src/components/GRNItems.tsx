import React from 'react';
import MasterPage from './MasterPage';

const GRNItems: React.FC = () => {
  const fields = [
    { name: 'grn', label: 'GRN Number', type: 'select-api', apiEndpoint: '/warehouse-ops/grn', displayKey: 'grnNumber', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    {
      name: 'item',
      label: 'Item Name',
      type: 'select-api',
      apiEndpoint: '/inventory/items',
      displayKey: 'itemName',
      optionValueKey: 'itemCode',
      populateFields: {
        itemDescription: 'itemName',
        itemCategory: 'itemCategory',
        unit: 'unit'
      },
      required: true
    },
    { name: 'receivedQuantity', label: 'Qty Received', type: 'number', required: true },
    { 
      name: 'warehouse', 
      label: 'Destination Warehouse', 
      type: 'select-api', 
      apiEndpoint: '/master/warehouses', 
      displayKey: 'warehouseName',
      optionValueKey: 'warehouseCode',
      required: true 
    },
    { 
      name: 'warehouseLocation', 
      label: 'Specific Bin/Location', 
      type: 'select-api', 
      apiEndpoint: '/inventory/locations', 
      displayKey: 'locationName',
      optionValueKey: 'locationName',
      filterBy: 'warehouse',
      required: true 
    },
    { name: 'qcStatus', label: 'Initial QC', type: 'select', options: ['pending', 'passed', 'failed'], required: true }
  ];
  
  return (
    <MasterPage 
      moduleName="Stock In" 
      endpoint="warehouse-ops/grn-items" 
      submitEndpoint="warehouse-ops/grn-items/with-logic"
      tableFields={['grn', 'itemDescription', 'itemCategory', 'unit', 'receivedQuantity']}
      fields={fields as any} 
    />
  );
};

export default GRNItems;
