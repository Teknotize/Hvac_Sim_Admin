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
import Loader from '../../components/loader';

interface CRMUser {
  [key: string]: any;
}

export default function Contacts() {
  const [enabled, setEnabled] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const setCRMUsers = useCRMStore((state) => state.setCRMUsers);
  const crmUsers = useCRMStore((state) => state.crmUsers);
  const [originalUsers, setOriginalUsers] = useState<CRMUser[]>([]); // Renamed for clarity
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 
  const [showEmail,setShowEmail] = useState(false)
  
  useEffect(() => {
    const hasCheckedUser = crmUsers.some(user => user.isChecked) || originalUsers.some(user => user.isChecked);
    setShowEmail(hasCheckedUser);
  }, [crmUsers, originalUsers]);

  const handleCheckboxChange = (id: string, checked: boolean, type: string) => {
    if (type === "single") {
      setCRMUsers(
        crmUsers.map((user) =>
          user._id === id ? { ...user, isChecked: checked } : user
        )
      );
    } else {
      setShowEmail(false)
      setCRMUsers(
        crmUsers.map((user) => ({ ...user, isChecked: !enabled }))
      );
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await apiClient.get('/admin/get-crm-users');
        const users = response.data.map((user: any) => ({ ...user, isChecked: false }));
        setOriginalUsers(users); 
        setCRMUsers(users);
        setLoading(false)     
      } catch (error) {
        setLoading(false)
        console.error('Error fetching CRM users:', error);
      }
    };
  
    if (originalUsers.length === 0) fetchData();
  }, [setCRMUsers]);

  const handleSearchChange = (value: string) => {
    const searchTerm = value.trim().toLowerCase();
    
    if (!searchTerm) {
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
  const totalPages = Math.ceil(crmUsers.length / itemsPerPage);
  const paginatedUsers = crmUsers.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <>
    <PageHeader 
      title="Contacts" 
      onSearchChange={(value) => handleSearchChange(value)} 
      route="contacts" 
      onSendEmailClick={() => setShowEmailPopup(true)}
      showEmail={showEmail}
    />
    {!loading ?
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
          {paginatedUsers.length > 0 ?
          paginatedUsers.map((contact) => (
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
              <p>{contact.phone||"N/A"}</p>
            </div>
            <div className='table-cell cell-email'>
              <p className='email-item'>
                {
                contact.tags==="mobile user" 
                && <ApprovedEmailIcon />} <span>{contact.email}</span></p>
            </div>
            <div className='table-cell cell-business'>
              <p>{contact.business||"N/A"}</p>
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
          )) :
          <div className='noData'><p>No data found</p></div>
          }
        </div>
      </div>
      <div className='table-footer'>
  <div className='table-row'>
    <div className='table-cell'></div>
    <div className='table-cell pagination-cell'>
      
    <p className="pagination-info" style={{marginRight:"20px"}}>
  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
  {Math.min(currentPage * itemsPerPage, crmUsers.length)} of {crmUsers.length} records
</p>

      <div className='pagination'>
        <button
          className='pagination-button'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className='pagination-numbers'>
          {totalPages > 5 ? (
            <>
              {currentPage > 3 && <p onClick={() => handlePageChange(1)}>1</p>}
              {currentPage > 4 && <p>...</p>}

              {Array.from({ length: 5 }, (_, i) => {
                const page = Math.min(Math.max(currentPage - 2 + i, 1), totalPages);
                return (
                  <p
                    key={page}
                    className={currentPage === page ? 'active' : ''}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </p>
                );
              })}

              {currentPage < totalPages - 3 && <p>...</p>}
              {currentPage < totalPages - 2 && (
                <p onClick={() => handlePageChange(totalPages)}>{totalPages}</p>
              )}
            </>
          ) : (
            Array.from({ length: totalPages }, (_, i) => (
              <p
                key={i}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </p>
            ))
          )}
        </div>

        <button
          className='pagination-button'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

    </div>
  </div>
</div>


    </div>
    :
    <div style={{height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
    <Loader size="xl"/>
    </div>
    }
    

   
<EmailPopup isOpen={showEmailPopup} onClose={() => setShowEmailPopup(false)} />   
    </>
  );
}