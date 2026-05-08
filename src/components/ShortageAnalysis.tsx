import React from 'react';
import MasterPage from './MasterPage';

const ShortageAnalysis: React.FC = () => {
  const fields = [
    { name: 'project', label: 'Project', type: 'text', required: true },
    { name: 'item', label: 'Item/Material', type: 'text', required: true },
    { name: 'requiredQuantity', label: 'Required', type: 'number' },
    { name: 'availableStock', label: 'Current Stock', type: 'number' },
    { name: 'shortageQuantity', label: 'Shortage', type: 'number' },
    { name: 'status', label: 'Supply Status', type: 'text' }
  ];

  return (
    <MasterPage 
      moduleName="Live Material Shortage Analysis" 
      endpoint="bom/shortage-analysis-report" 
      fields={fields as any} 
    />
  );
};

export default ShortageAnalysis;
