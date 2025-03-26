import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faCheck, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel,  } from '@headlessui/react';
import { Checkbox } from '@headlessui/react'
import { useState } from 'react';
import { ApprovedEmailIcon } from '../../components/svg/icons';
import { apiClient } from '../../config';
import { useEffect } from 'react';
import useCRMStore from '../../store/useCRMStore';
import formatDateTime from '../../utils/DateConversion';
import EmailPopup from '../../components/emailPopup';

interface CRMUser {
  [key: string]: any;
}

export default function Contacts() {
  const [enabled, setEnabled] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const setCRMUsers = useCRMStore((state) => state.setCRMUsers);
  const crmUsers = useCRMStore((state) => state.crmUsers);
  const [originalUsers, setOriginalUsers] = useState<CRMUser[]>([]); // Renamed for clarity


  const handleCheckboxChange = (id: string, checked: boolean, type: string) => {
    if (type === "single") {
      setCRMUsers(
        crmUsers.map((user) =>
          user._id === id ? { ...user, isChecked: checked } : user
        )
      );
    } else {
      setCRMUsers(
        crmUsers.map((user) => ({ ...user, isChecked: !enabled }))
      );
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/admin/get-crm-users');
        const users = response.data.map((user: any) => ({ ...user, isChecked: false }));
        
        setOriginalUsers(users); 
        setCRMUsers(users);     
      } catch (error) {
        console.error('Error fetching CRM users:', error);
      }
    };
  
    if (originalUsers.length === 0) fetchData();
  }, [setCRMUsers]);

  useEffect(() => {
    console.log('crm',crmUsers);
  }, [crmUsers]);

  const handleSearchChange = (value: string) => {
    const searchTerm = value.trim().toLowerCase();
    
    if (!searchTerm) {
      // Reset to all users when search is empty
      setCRMUsers(originalUsers);
      return;
    }
  
    const filteredUsers = originalUsers.filter(user =>
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.phone?.toLowerCase().includes(searchTerm)
    );
  
    setCRMUsers(filteredUsers);
  };
  return (
    <>
    <PageHeader 
      title="Contacts" 
      onSearchChange={(value) => handleSearchChange(value)} 
      route="contacts" 
      onSendEmailClick={() => setShowEmailPopup(true)}
    />
    
    <div className='table-container'>
      <div className="table-wrapper">
        <div className='table-header'>
          <div className='table-row'>
            <div className='table-cell cell-checkbox'>
              <Checkbox
                checked={enabled}
                onChange={()=>{handleCheckboxChange("123",enabled,"all");setEnabled(!enabled)}}
                className="group table-checkbox-item data-[checked]:checked"
              >
                <FontAwesomeIcon icon={faCheck} className='opacity-0 group-data-[checked]:opacity-100' />
              </Checkbox>
            </div>
            <div className='table-cell cell-user'>Name</div>
            <div className='table-cell cell-phone'>Phone</div>
            <div className='table-cell cell-email'>Email</div>
            <div className='table-cell cell-business'>Business</div>
            <div className='table-cell cell-tags'>Tags</div>
            <div className='table-cell cell-date'>Date</div>
            <div className='table-cell cell-action'>Action</div>
          </div>
        </div>
        <div className='table-body'>
          {crmUsers.map((contact) => (
            <div className='table-row' key={contact._id}>
              <div className='table-cell cell-checkbox'>
                <Checkbox
                checked={contact.isChecked}
                onChange={(checked) => handleCheckboxChange(contact._id, checked,"single")}
                className="group table-checkbox-item data-[checked]:checked"
              >
                <FontAwesomeIcon icon={faCheck} className='opacity-0 group-data-[checked]:opacity-100' />
              </Checkbox>
            </div>
            <div className='table-cell cell-user'>
              <div className='user-dp-card'>
                <figure><span>{contact.name.charAt(0)}</span></figure>
                <span>{contact.name}</span>
              </div>
            </div>
            <div className='table-cell cell-phone'>
              <p>{contact.phone}</p>
            </div>
            <div className='table-cell cell-email'>
              <p className='email-item'>
                {
                // contact.emailApproved 
                true&& <ApprovedEmailIcon />} <span>{contact.email}</span></p>
            </div>
            <div className='table-cell cell-business'>
              <p>{contact.business}</p>
            </div>
            <div className='table-cell cell-tags'>
              <p className='tags'>
                {/* {contact.tags.map((tag:string) => (
                  <span key={tag}>{tag}</span>
                ))} */}
                  <span >{contact.tags}</span>
              </p>
            </div>
            <div className='table-cell cell-date'>
              <p className='date'>{formatDateTime(contact.createdAt).date} <span className='time'>{formatDateTime(contact.createdAt).time}</span></p>
            </div>
            <div className='table-cell cell-action justify-end'>

              <Popover className="action-drop">
                <PopoverButton className="block">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </PopoverButton>
                <PopoverPanel
                  transition
                  anchor="bottom end"
                  className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                >
                  <div className="action-menu">
                    <Link to="/" className="action-menu-item">
                      <p>Edit</p>
                    </Link>
                    <Link to="/" className="action-menu-item">
                      <p>Delete</p>
                    </Link>
                  </div>
                </PopoverPanel>
              </Popover>

            </div>
          </div>
          ))}
        </div>
      </div>
      <div className='table-footer'>
        <div className='table-row'>
          <div className='table-cell'></div>
          <div className='table-cell pagination-cell'>
            <div className='pagination'>
              <button className='pagination-button'>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <div className='pagination-numbers'>
                <p className='active'>1</p>
                <p>2</p>
                <p>3</p>
                <p>...</p>
                <p>5</p>
              </div>
              <button className='pagination-button'>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    

   
<EmailPopup isOpen={showEmailPopup} onClose={() => setShowEmailPopup(false)} />   
    </>
  );
}