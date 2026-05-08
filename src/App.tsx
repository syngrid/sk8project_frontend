import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Warehouses from './components/Warehouses';

// Import Master Pages
import Users from './components/Users';
import Roles from './components/Roles';
import Departments from './components/Departments';
import Units from './components/Units';
import Categories from './components/Categories';
import CostCenters from './components/CostCenters';
import Suppliers from './components/Suppliers';

// Project Management Pages
import Projects from './components/Projects';
import ProjectPlanning from './components/ProjectPlanning';
import Tasks from './components/Tasks';

// Inventory Management Pages
import ItemMaster from './components/ItemMaster';
import Locations from './components/Locations';
import Balances from './components/Balances';
import Reservations from './components/Reservations';
import OpeningStock from './components/OpeningStock';
import Transfers from './components/Transfers';
import Adjustments from './components/Adjustments';

// Phase 4: BOM Management Pages
import BOMMaster from './components/BOMMaster';
import BOMItems from './components/BOMItems';
import BOMRevisions from './components/BOMRevisions';
import MaterialPlanning from './components/MaterialPlanning';
import ShortageAnalysis from './components/ShortageAnalysis';
import MaterialReservation from './components/MaterialReservation';

// Phase 5: Procurement Pages
import PurchaseRequest from './components/PurchaseRequest';
import PurchaseApproval from './components/PurchaseApproval';
import PurchaseOrder from './components/PurchaseOrder';

// Phase 6: Warehouse Operations
import GRN from './components/GRN';
import GRNItems from './components/GRNItems';
import QC from './components/QC';
import StockUpdate from './components/StockUpdate';

// Phase 7: Logistics
import DispatchRequests from './components/DispatchRequests';
import DispatchPlanning from './components/DispatchPlanning';
import Tracking from './components/Tracking';
import Acknowledgements from './components/Acknowledgements';
import Documentation from './components/Documentation';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-primary overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 bg-white overflow-hidden lg:rounded-tl-[60px] p-4 md:p-8">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        
        <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Phase 1-3 Routes */}
        <Route path="/User" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/Role" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
        <Route path="/Department" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
        <Route path="/Units" element={<ProtectedRoute><Units /></ProtectedRoute>} />
        <Route path="/Warehouses" element={<ProtectedRoute><Warehouses /></ProtectedRoute>} />
        <Route path="/Categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/CostCenters" element={<ProtectedRoute><CostCenters /></ProtectedRoute>} />
        <Route path="/Suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
        <Route path="/Projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/Planning" element={<ProtectedRoute><ProjectPlanning /></ProtectedRoute>} />
        <Route path="/Tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/ItemMaster" element={<ProtectedRoute><ItemMaster /></ProtectedRoute>} />
        <Route path="/Locations" element={<ProtectedRoute><Locations /></ProtectedRoute>} />
        <Route path="/Balances" element={<ProtectedRoute><Balances /></ProtectedRoute>} />
        <Route path="/Reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
        <Route path="/OpeningStock" element={<ProtectedRoute><OpeningStock /></ProtectedRoute>} />
        <Route path="/Transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
        <Route path="/Adjustments" element={<ProtectedRoute><Adjustments /></ProtectedRoute>} />

        {/* Phase 4-9 Routes */}
        <Route path="/BOMMaster" element={<ProtectedRoute><BOMMaster /></ProtectedRoute>} />
        <Route path="/BOMItems" element={<ProtectedRoute><BOMItems /></ProtectedRoute>} />
        <Route path="/BOMRevisions" element={<ProtectedRoute><BOMRevisions /></ProtectedRoute>} />
        <Route path="/MaterialPlanning" element={<ProtectedRoute><MaterialPlanning /></ProtectedRoute>} />
        <Route path="/ShortageAnalysis" element={<ProtectedRoute><ShortageAnalysis /></ProtectedRoute>} />
        <Route path="/MaterialReservation" element={<ProtectedRoute><MaterialReservation /></ProtectedRoute>} />
        
        <Route path="/PR" element={<ProtectedRoute><PurchaseRequest /></ProtectedRoute>} />
        <Route path="/PRApproval" element={<ProtectedRoute><PurchaseApproval /></ProtectedRoute>} />
        <Route path="/PO" element={<ProtectedRoute><PurchaseOrder /></ProtectedRoute>} />
        
        <Route path="/GRN" element={<ProtectedRoute><GRN /></ProtectedRoute>} />
        <Route path="/GRNItems" element={<ProtectedRoute><GRNItems /></ProtectedRoute>} />
        <Route path="/QC" element={<ProtectedRoute><QC /></ProtectedRoute>} />
        <Route path="/StockUpdate" element={<ProtectedRoute><StockUpdate /></ProtectedRoute>} />
        
        <Route path="/DispatchRequests" element={<ProtectedRoute><DispatchRequests /></ProtectedRoute>} />
        <Route path="/VehicleAssignment" element={<ProtectedRoute><DispatchPlanning /></ProtectedRoute>} />
        <Route path="/MaterialDispatch" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
        <Route path="/Acknowledgements" element={<ProtectedRoute><Acknowledgements /></ProtectedRoute>} />
        
        <Route path="/Documentation" element={<ProtectedRoute><Documentation /></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/Dashboard" replace />} />
        <Route path="*" element={<Navigate to="/Dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
