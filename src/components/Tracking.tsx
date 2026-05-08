import React from 'react';
import MasterPage from './MasterPage';

const Tracking: React.FC = () => {
  const fields = [
    { name: 'trackingNumber', label: 'Tracking #', type: 'text', required: true },
    { name: 'dispatch', label: 'Dispatch Ref', type: 'select-api', apiEndpoint: '/logistics/planning', displayKey: 'dispatchNumber', optionValueKey: 'dispatchNumber', required: true },
    { name: 'vehicle', label: 'Vehicle', type: 'text' },
    { name: 'driver', label: 'Driver', type: 'text' },
    { name: 'dispatchDate', label: 'Dispatch Date', type: 'date', required: true },
    { name: 'expectedDeliveryDate', label: 'Expected Date', type: 'date' },
    { name: 'currentLocation', label: 'Last Known Location', type: 'text' },
    { name: 'deliveryStatus', label: 'Live Status', type: 'select', options: ['Loaded', 'In Transit', 'Near Site', 'Delivered'], required: true },
    { name: 'remarks', label: 'Status Notes', type: 'textarea' }
  ];

  return (
    <MasterPage 
      moduleName="Material Dispatch" 
      endpoint="logistics/tracking" 
      fields={fields as any} 
    />
  );
};

export default Tracking;
