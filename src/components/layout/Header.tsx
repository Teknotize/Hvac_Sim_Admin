import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { UserMenuIconLogout } from '../svg/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import useLogout from '../logout';
import Toast from '../toast';
import { useState } from 'react';
export default function Header() {

  const navigate = useNavigate();
  // const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const logout = useLogout();

  const handleLogout = () => {
    logout()
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        {/* <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1> */}
      </div>
      <div className="flex items-center pe-4">
        <div className="relative ml-3">
          <div className="flex items-center gap-4">

            <Popover className="user-info">
              <PopoverButton className="block">
                <span>Umair Farooq</span> <FontAwesomeIcon icon={faChevronDown} />
              </PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom end"
                className="user-info-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
              >
                <div className="user-label border-b-1 border-gray-200 pb-3 mb-3">
                  <p>Signed in as</p>
                  <p>umairfarooq@gmail.com</p>
                </div>
                <div className="user-menu">
                  <Link to="/logout" className="user-menu-item">
                    <UserMenuIconLogout />
                    <p>Logout</p>
                  </Link>
                </div>
              </PopoverPanel>
            </Popover>

          </div>
        </div>
      </div>
    </header>
  );
} 