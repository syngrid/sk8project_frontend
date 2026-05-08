import React from 'react';
import MasterPage from './MasterPage';

const Tasks: React.FC = () => {
  const fields = [
    { name: 'project', label: 'Link to Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'taskName', label: 'Task Name (e.g. Motor Purchase)', type: 'text', required: true },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    { name: 'assignedTo', label: 'Assigned To', type: 'select-api', apiEndpoint: '/master/users', displayKey: 'firstName' },
    { name: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'critical'] },
    { name: 'progressPercentage', label: 'Progress (%)', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: ['pending', 'inProgress', 'completed'] }
  ];

  return <MasterPage moduleName="WBS & Tasks" endpoint="project/tasks" fields={fields as any} />;
};

export default Tasks;
