import React from 'react';
import MasterPage from './MasterPage';

const DispatchPlanning: React.FC = () => {
  const fields = [
    { name: 'dispatchNumber', label: 'Dispatch #', type: 'text', required: true },
    { name: 'dispatchDate', label: 'Plan Date', type: 'date', required: true },
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', optionValueKey: 'projectCode', required: true },
    { name: 'dispatchRequest', label: 'Request Ref', type: 'select-api', apiEndpoint: '/logistics/requests', displayKey: 'dispatchRequestNumber', optionValueKey: 'dispatchRequestNumber' },
    { name: 'vehicle', label: 'Vehicle Number', type: 'text', required: true },
    { name: 'driver', label: 'Driver Name', type: 'text', required: true },
    { name: 'warehouse', label: 'Pickup Point', type: 'select-api', apiEndpoint: '/inventory/warehouses', displayKey: 'warehouseName' },
    { name: 'deliveryLocation', label: 'Site Address', type: 'text' },
    { name: 'plannedDeliveryDate', label: 'ETA Date', type: 'date' },
    { name: 'dispatchStatus', label: 'Planning Status', type: 'select', options: ['Planning', 'Assigned', 'Ready for Dispatch'], required: true }
  ];

  return (
    <MasterPage 
      moduleName="Vehicle Assignment" 
      endpoint="logistics/planning" 
      fields={fields as any} 
    />
  );
};

export default DispatchPlanning;
