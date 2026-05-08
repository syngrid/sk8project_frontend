import React from 'react';
import MasterPage from './MasterPage';

const MaterialReservation: React.FC = () => {
  const fields = [
    { name: 'reservationNumber', label: 'Res #', type: 'text', required: true },
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', optionValueKey: 'projectCode', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'item', label: 'Item', type: 'text', required: true },
    { name: 'reservedQuantity', label: 'Qty', type: 'number', required: true },
    { name: 'reservationStatus', label: 'Status', type: 'select', options: ['pending', 'allocated', 'released'], required: true }
  ];
  return <MasterPage moduleName="Material Reservation" endpoint="bom/reservations" fields={fields as any} />;
};

export default MaterialReservation;
