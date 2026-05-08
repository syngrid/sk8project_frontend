import React from 'react';
import MasterPage from './MasterPage';

const DispatchRequests: React.FC = () => {
  const fields = [
    { name: 'dispatchRequestNumber', label: 'Dispatch Req #', type: 'text', required: true },
    { name: 'requestDate', label: 'Request Date', type: 'date', required: true },
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', optionValueKey: 'projectCode', required: true },
    { name: 'reservationNumber', label: 'Reservation Ref', type: 'select-api', apiEndpoint: '/inventory/reservations', displayKey: 'reservationNumber', optionValueKey: 'reservationNumber' },
    {
      name: 'item',
      label: 'Material',
      type: 'select-api',
      apiEndpoint: '/inventory/items',
      displayKey: 'itemName',
      optionValueKey: 'itemCode',
      populateFields: {
        itemDescription: 'itemName',
        unit: 'unit'
      },
      required: true
    },
    { name: 'quantity', label: 'Qty to Dispatch', type: 'number', required: true },
    { name: 'priority', label: 'Priority', type: 'select', options: ['Normal', 'High', 'Urgent'] },
    { name: 'dispatchStatus', label: 'Status', type: 'select', options: ['pending', 'assigned', 'dispatched', 'delivered'], required: true }
  ];

  return (
    <MasterPage
      moduleName="Dispatch Request"
      endpoint="logistics/requests"
      fields={fields as any}
    />
  );
};

export default DispatchRequests;
