import { Link, useLocation } from 'react-router-dom';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import logo from '../../assets/images/logo.png';
import profileImage from '../../assets/images/profileImageAdmin.png';
import { UserIcon, UserMenuIconProfile, UserMenuIconSettings, UserMenuIconLogout, MainMenuNavDashboard, MainMenuNavCMS, MainMenuNavCRM, MainMenuNavDistributors, MainMenuNavAppData } from '../svg/icons';
import { useNavigate } from 'react-router-dom';
import useLogout from '../logout';
import { useSidebar } from '../../context/SidebarContext';
import { useEffect,useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../config';
import { useUserInfoStore } from '../../store/useUserInfoStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: <MainMenuNavDashboard /> },
  { name: 'Distributors', href: '/distributors', icon: <MainMenuNavDistributors /> },
  { name: 'AppData', href: '/app-data', icon: <MainMenuNavAppData /> },
  { 
    name: 'CRM', 
    href: '/crm', 
    icon: <MainMenuNavCRM />,
    children: [
      { name: 'Contacts', href: '/crm/contacts' },
      { name: 'PDF Manual', href: '/crm/pdf-manual' }
    ]
  },
  { name: 'CMS', href: '/cms', icon: <MainMenuNavCMS /> },
];

export default function Sidebar() {
  const location = useLocation();
  const logout = useLogout();
  const navigate = useNavigate();
  const { isOpen } = useSidebar();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { name, email, setUser } = useUserInfoStore();

  const handleLogout = () => {
    logout()
    navigate('/login');
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) return;
  
      try {
        const response = await apiClient.get("admin/profile-info");
        setUser(response.data); // Expects { name, email }
      } catch (error: any) {
        console.error("Failed to fetch user info:", error);
      }
    };
  
    fetchUserInfo();
  }, [accessToken, setUser]);
   
  return (
    <div className={`flex h-full flex-col sidebar ${isOpen ? 'active' : ''}`}>
      <div className='sidebar-inner'>
        <div className="flex h-16 items-center gap-4 p-4 border-b-2 border-gray-800">
          <a href="/" className="logo">
            <img src={logo} alt="HVAC Sim Admin" />
          </a>

          <Popover className="user-info">
            <PopoverButton className="block">
              <UserIcon />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom end"
              className="user-info-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
              <div className="user-label border-b-1 border-gray-200 pb-3 mb-3">
                <p>Signed in as</p>
                <p>{email}</p>
              </div>
              <div className="user-menu">
                <Link to="/profile" className="user-menu-item">
                  <UserMenuIconProfile />
                  <p>Profile</p>
                </Link>
                <Link to="/settings" className="user-menu-item">
                  <UserMenuIconSettings />
                  <p>Settings</p>
                </Link>
                {/* <Link to="/logout" className="user-menu-item">
                  <UserMenuIconLogout />
                  <p>Logout</p>
                </Link> */}
                
                <button onClick={handleLogout} className="user-menu-item" style={{ width: "100%",cursor:'pointer'}} >
                        <UserMenuIconLogout />
                        <p>Logout</p>
                      </button>
                    
              </div>
            </PopoverPanel>
          </Popover>


        </div>
        <div className="flex justify-center">
          <div className='user-card'>
            <figure className='user-dp'>
              <img src={profileImage} alt="Umair Farooq" />
            </figure>
            <div className='user-card-body'>
              <h4>{name}</h4>
              <p>{email}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <nav className="mainNav">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.children && item.children.some(child => location.pathname === child.href));
              return (
                <div 
                  key={item.name} 
                  className={`nav-item-group ${item.children && isActive ? 'active' : ''}`}
                >
                  {item.children ? (
                    <div
                      className={`nav-item has-sub-items flex ${
                        isActive
                          ? 'active'
                          : ''
                      }`}
                      onClick={item.children ? (e) => {
                        e.preventDefault();
                        // Toggle active class for items with children
                        const currentTarget = e.currentTarget;
                        if (currentTarget.parentElement) {
                          currentTarget.parentElement.classList.toggle('active');
                        }
                      } : undefined}
                    >
                      <div className="nav-item-inner">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {item.children && (
                          <svg className="h-4 w-4 sub-item-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`nav-item flex ${
                        isActive
                          ? 'active'
                          : ''
                      }`}
                    >
                      <div className="nav-item-inner">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  )}
                  
                  {item.children && (
                    <div className="sub-item-group flex flex-col">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.href;
                        return (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`nav-sub-item ${
                              isChildActive
                              ? 'active'
                              : ''
                            }`}
                          >
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
} 