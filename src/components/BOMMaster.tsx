import React from 'react';
import MasterPage from './MasterPage';

const BOMMaster: React.FC = () => {
  const fields = [
    { name: 'bomNumber', label: 'BOM Number', type: 'text' },
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', optionValueKey: 'projectCode', required: true },
    { name: 'bomTitle', label: 'BOM Title', type: 'text', required: true },
    { name: 'bomType', label: 'BOM Type', type: 'select', options: ['engineering', 'production', 'procurement'] },
    { name: 'revisionNumber', label: 'Revision Number', type: 'text' },
    { name: 'projectStage', label: 'Project Stage', type: 'text' },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="BOM Entry" endpoint="bom/master" fields={fields as any} />;
};

export default BOMMaster;
