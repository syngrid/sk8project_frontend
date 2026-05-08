import React from 'react';
import MasterPage from './MasterPage';

const Scheduling: React.FC = () => {
  const fields = [
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', required: true },
    { name: 'task', label: 'Task', type: 'select-api', apiEndpoint: '/project/tasks', displayKey: 'taskName' },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    { name: 'assignedResource', label: 'Assigned Resource', type: 'select-api', apiEndpoint: '/master/users', displayKey: 'firstName' },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Scheduling" endpoint="project/schedules" fields={fields as any} />;
};

export default Scheduling;
