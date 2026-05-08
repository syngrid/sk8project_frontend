import React from 'react';
import MasterPage from './MasterPage';

const Locations: React.FC = () => {
  const fields = [
    { 
      name: 'warehouse', 
      label: 'Warehouse', 
      type: 'select-api', 
      apiEndpoint: '/master/warehouses', 
      displayKey: 'warehouseName', 
      optionValueKey: 'warehouseCode', 
      required: true 
    },
    { name: 'locationName', label: 'Location Name', type: 'text', required: true },
    { 
      name: 'dedicatedItem', 
      label: 'Assign Item', 
      type: 'select-api', 
      apiEndpoint: '/inventory/items', 
      displayKey: 'itemName',
      optionValueKey: 'itemCode' // Store the code for linking
    },
    { name: 'initialQuantity', label: 'Initial Quantity', type: 'number' },
    { name: 'rackNumber', label: 'Rack Number', type: 'text' },
    { name: 'shelfNumber', label: 'Shelf Number', type: 'text' },
    { name: 'binNumber', label: 'Bin Number', type: 'text' },
    { name: 'capacity', label: 'Capacity', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return (
    <MasterPage 
      moduleName="Locations" 
      endpoint="inventory/locations" 
      fields={fields as any} 
      tableFields={['locationName', 'warehouse', 'dedicatedItem', 'status']}
    />
  );
};

export default Locations;
