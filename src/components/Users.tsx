import React from 'react';
import MasterPage from './MasterPage';

const Users: React.FC = () => {
  const fields = [
    { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select-api', apiEndpoint: '/master/roles', displayKey: 'roleName' },
    { name: 'department', label: 'Department', type: 'select-api', apiEndpoint: '/master/departments', displayKey: 'departmentName' },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'text', required: true },
    { name: 'mobileNumber', label: 'Mobile Number', type: 'text' },
    { name: 'designation', label: 'Designation', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'remarks', label: 'Remarks', type: 'textarea' },
  ];

  return <MasterPage moduleName="Employee Directory" endpoint="master/users" fields={fields as any} />;
};

export default Users;
