import React, { useState } from 'react';
import {
  UserCircle, Briefcase, Shield, ChevronRight, ChevronLeft,
  ChevronDown, Ruler, Warehouse, Tags, Landmark, Truck,
  FolderKanban, ClipboardList, ListTodo, History, FileText,
  Box, MapPin, ArrowRightLeft,
  Scale, ShoppingCart, PackageCheck, TruckIcon, FolderLock,
  LayoutDashboard, Settings2
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const location = useLocation();

  const toggleSection = (section: string) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenSection(openSection === section ? null : section);
  };

  const menuSections = [
    {
      id: 'masters',
      label: 'Masters',
      icon: <Settings2 size={22} />,
      items: [
        { name: 'Users', icon: <UserCircle size={18} />, path: '/User' },
        { name: 'Roles', icon: <Shield size={18} />, path: '/Role' },
        { name: 'Departments', icon: <Briefcase size={18} />, path: '/Department' },
        { name: 'Suppliers', icon: <Truck size={18} />, path: '/Suppliers' },
        { name: 'Cost Centers', icon: <Landmark size={18} />, path: '/CostCenters' },
      ]
    },
    {
      id: 'project',
      label: 'Project Management',
      icon: <FolderKanban size={22} />,
      items: [
        { name: 'Projects', icon: <FolderKanban size={18} />, path: '/Projects' },
        { name: 'Planning', icon: <ClipboardList size={18} />, path: '/Planning' },
        { name: 'Tasks', icon: <ListTodo size={18} />, path: '/Tasks' },
      ]
    },
    {
      id: 'item-master',
      label: 'Item Master',
      icon: <Box size={22} />,
      items: [
        { name: 'Items', icon: <Box size={18} />, path: '/ItemMaster' },
        { name: 'Units', icon: <Ruler size={18} />, path: '/Units' },
        { name: 'Categories', icon: <Tags size={18} />, path: '/Categories' },
      ]
    },
    {
      id: 'warehouse',
      label: 'Warehouse',
      icon: <Warehouse size={22} />,
      items: [
        { name: 'Warehouses', icon: <Warehouse size={18} />, path: '/Warehouses' },
        { name: 'Locations', icon: <MapPin size={18} />, path: '/Locations' },
      ]
    },
    {
      id: 'stock-engine',
      label: 'Inventory',
      icon: <ArrowRightLeft size={22} />,
      items: [
        { name: 'Stock In', icon: <ListTodo size={18} />, path: '/GRNItems' },
        { name: 'Reservation', icon: <History size={18} />, path: '/Reservations' },
        { name: 'Transfer', icon: <TruckIcon size={18} />, path: '/DispatchRequests' },
        { name: 'Balance', icon: <Scale size={18} />, path: '/Balances' },
      ]
    },
    {
      id: 'bom',
      label: 'Bill Of Materials',
      icon: <FileSpreadsheet size={22} />,
      items: [
        { name: 'Bill Of Materials Master', icon: <FileSpreadsheet size={18} />, path: '/BOMMaster' },
        { name: 'Bill Of Materials Items', icon: <ListTodo size={18} />, path: '/BOMItems' },
      ]
    },
    {
      id: 'procurement',
      label: 'Procurement',
      icon: <ShoppingCart size={22} />,
      items: [
        { name: 'Purchase Request', icon: <FileText size={18} />, path: '/PR' },
        { name: 'Purchase Approval', icon: <PackageCheck size={18} />, path: '/PRApproval' },
        { name: 'Purchase Order', icon: <ShoppingCart size={18} />, path: '/PO' },
      ]
    },
    {
      id: 'logistics',
      label: 'Logistics',
      icon: <TruckIcon size={22} />,
      items: [
        { name: 'Dispatch Request', icon: <ClipboardList size={18} />, path: '/DispatchRequests' },
        { name: 'Vehicle Assignment', icon: <TruckIcon size={18} />, path: '/VehicleAssignment' },
        { name: 'Material Dispatch', icon: <MapPin size={18} />, path: '/MaterialDispatch' },
        { name: 'Acknowledgement', icon: <History size={18} />, path: '/Acknowledgements' },
      ]
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: <FolderLock size={22} />,
      path: '/Documentation'
    }
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`
        fixed lg:static inset-y-0 left-0 z-[101]
        bg-primary flex flex-col shadow-2xl lg:shadow-none
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-[85px]' : 'w-[280px]'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 mb-2 flex items-center justify-between relative overflow-visible">
          <div className={`
             bg-white rounded-lg flex items-center justify-center shadow-lg transition-all duration-300
             ${isCollapsed ? 'w-12 h-12 p-2' : 'w-[160px] h-[54px] px-4 py-2'}
          `}>
            <img src="/company_Logo.png" alt="" className="h-full w-auto object-contain" />
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              hidden lg:flex absolute top-1/2 -translate-y-1/2 right-[-14px] 
              w-7 h-7 bg-white text-primary rounded-full shadow-xl 
              items-center justify-center border border-primary/10 
              hover:scale-110 active:scale-95 transition-all z-[110]
            `}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
          <Link
            to="/Dashboard"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold text-base capitalize tracking-widest ${
              location.pathname === '/Dashboard'
                ? 'bg-white text-primary shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="whitespace-nowrap">Dashboard</span>
          </Link>

          {menuSections.map((section) => (
            <div key={section.id}>
              {section.path ? (
                <Link
                  to={section.path}
                  onClick={onClose}
                  className={`
                    w-full flex items-center gap-4 px-3.5 py-3 rounded-lg transition-all font-semibold text-sm capitalize tracking-widest group/item
                    ${location.pathname === section.path ? 'bg-white text-primary shadow-md' : 'text-white hover:bg-white/5'}
                  `}
                >
                  <div className="flex-shrink-0 text-inherit transition-colors">{section.icon}</div>
                  {!isCollapsed && <span className="transition-all duration-300 whitespace-nowrap">{section.label}</span>}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`
                        w-full flex items-center justify-between gap-4 px-3.5 py-3 rounded-lg transition-all font-semibold text-sm capitalize tracking-widest group/item
                        ${openSection === section.id && !isCollapsed ? 'text-white' : 'text-white hover:bg-white/5'}
                      `}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 text-white group-hover/item:text-white transition-colors">{section.icon}</div>
                      {!isCollapsed && <span className="transition-all duration-300 whitespace-nowrap">{section.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown size={14} className={`transition-transform duration-300 ${openSection === section.id ? 'rotate-180' : ''}`} />
                    )}

                    {isCollapsed && (
                      <div className="fixed left-[95px] px-3 py-2 bg-white text-primary text-xs font-semibold capitalize tracking-widest rounded-xl shadow-2xl opacity-0 translate-x-[-10px] pointer-events-none transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0 z-[110]">
                        {section.label}
                        <div className="absolute top-1/2 left-0 -ml-1 -mt-1 w-2 h-2 bg-white rotate-45"></div>
                      </div>
                    )}
                  </button>

                  <div className={`
                      mt-1 space-y-1 overflow-hidden transition-all duration-300
                      ${openSection === section.id && !isCollapsed ? 'max-h-[800px] opacity-100 ml-4 border-l border-white/5 pl-2 pb-4' : 'max-h-0 opacity-0'}
                    `}>
                    {section.items?.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                    className={`
                         flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-sm
                         ${location.pathname === item.path
                        ? 'bg-white text-primary shadow-md'
                        : 'text-white hover:bg-white/10'}
                       `}
                  >
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const FileSpreadsheet = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M8 13h2" /><path d="M8 17h2" /><path d="M14 13h2" /><path d="M14 17h2" /></svg>
);

export default Sidebar;
