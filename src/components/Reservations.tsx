import React from 'react';
import MasterPage from './MasterPage';

const Reservations: React.FC = () => {
  const fields = [
    { name: 'reservationNumber', label: 'Reservation #', type: 'text', required: true },
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', optionValueKey: 'projectCode', required: true },
    { name: 'warehouse', label: 'Warehouse', type: 'select-api', apiEndpoint: '/inventory/warehouses', displayKey: 'warehouseName', optionValueKey: 'warehouseCode', required: true },
    { name: 'item', label: 'Item', type: 'select-api', apiEndpoint: '/inventory/items', displayKey: 'itemName', optionValueKey: 'itemCode', required: true },
    { name: 'requiredQuantity', label: 'Required Qty', type: 'number', required: true },
    { name: 'reservedQuantity', label: 'Reserved Qty', type: 'number' },
    { name: 'requiredDate', label: 'Required Date', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: ['pending', 'fulfilled', 'cancelled'], required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Reservation" endpoint="inventory/reservations" fields={fields as any} />;
};

export default Reservations;
