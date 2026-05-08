import React from 'react';
import MasterPage from './MasterPage';

const MaterialPlanning: React.FC = () => {
  const fields = [
    { name: 'project', label: 'Project', type: 'text', required: true },
    { name: 'bom', label: 'BOM #', type: 'text' },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'requiredDate', label: 'Req Date', type: 'date' },
    { name: 'availableItems', label: 'Available', type: 'number' },
    { name: 'shortageItems', label: 'Shortage', type: 'number' },
    { name: 'procurementRequired', label: 'Procure?', type: 'select', options: ['true', 'false'] },
    { name: 'planningStatus', label: 'Status', type: 'select', options: ['pending', 'completed'], required: true }
  ];
  return <MasterPage moduleName="Material Planning" endpoint="bom/planning" fields={fields as any} />;
};

export default MaterialPlanning;
