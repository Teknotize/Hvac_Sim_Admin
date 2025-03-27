import { Button, Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
// import { UserMenuIconLogout } from '../svg/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
// import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useSidebar } from '../../context/SidebarContext';

export default function Header() {
  const { toggleSidebar } = useSidebar();

  // const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
 

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <Button className='sidebar-toggle-btn' onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </Button>
        {/* <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1> */}
      </div>
      <div className="flex items-center pe-4">
        <div className="relative ml-3">
          <div className="flex items-center gap-4">

            {/* <Popover className="user-info">
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
                <div className="user-menu" >
                  <button className="user-menu-item" style={{ width: "100%",cursor:'pointer'}} >
                    <UserMenuIconLogout />
                    <p>Logout</p>
                  </button>
                </div>

              </PopoverPanel>
            </Popover> */}

          </div>
        </div>
      </div>
    </header>
  );
} 