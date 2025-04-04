import { Link } from 'react-router-dom';
import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faCheck, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel,  } from '@headlessui/react';
import { Checkbox } from '@headlessui/react'
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
interface TagsFilterData {
  tags: string[];
}
export default function Contacts() {
  const [enabled, setEnabled] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const setCRMUsers = useCRMStore((state) => state.setCRMUsers);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const crmUsers = useCRMStore((state) => state.crmUsers);
  const [originalUsers, setOriginalUsers] = useState<CRMUser[]>([]); // Renamed for clarity
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedUser,setCheckedUser]=useState<CRMUser[]>([])
  const itemsPerPage = 10; 
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [showEmail,setShowEmail] = useState(false)
  const [reRun,setReRun] = useState(false)
  
  useEffect(() => {
    const hasCheckedUser = crmUsers.some(user => user.isChecked) || originalUsers.some(user => user.isChecked);
    setShowEmail(hasCheckedUser);
  }, [crmUsers, originalUsers]);

  const handleCheckboxChange = (id: string, checked: boolean, type: string) => {
    if (type === "single") {
      const newSelectedIds = new Set(selectedIds);
      if (checked) {
        newSelectedIds.add(id);
      } else {
        newSelectedIds.delete(id);
      }
      setSelectedIds(newSelectedIds);
      
      // Update the isChecked state for display
      const updatedUsers = crmUsers.map(user => 
        user._id === id ? { ...user, isChecked: checked } : user
      );
      setCRMUsers(updatedUsers);
    } else {
      // "Select All" for current page
      const newSelectedIds = new Set(selectedIds);
      const currentPageIds = paginatedUsers.map(user => user._id);
      const allChecked = paginatedUsers.every(user => selectedIds.has(user._id));
      
      currentPageIds.forEach(id => {
        if (allChecked) {
          newSelectedIds.delete(id);
        } else {
          newSelectedIds.add(id);
        }
      });
      
      setSelectedIds(newSelectedIds);
      setEnabled(!allChecked);
      
      // Update isChecked for display
      const updatedUsers = crmUsers.map(user => {
        const shouldCheck = currentPageIds.includes(user._id) ? !allChecked : user.isChecked;
        return { ...user, isChecked: shouldCheck };
      });
      setCRMUsers(updatedUsers);
    }
  };
  const uncheckAllUsers = () => {
    // Update all users in the main array
    const updatedUsers = crmUsers.map(user => ({
      ...user,
      isChecked: false
    }));
  
    // Update all relevant states
    setCRMUsers(updatedUsers);
    setOriginalUsers(prev => prev.map(user => ({ ...user, isChecked: false }))); // Also update originalUsers if needed
    setEnabled(false); // Uncheck the "Select All" checkbox
    setCheckedUser([]); // Clear all checked users
    setSelectedIds(new Set()); // Clear the selected IDs if using Set approach
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
        useCRMStore.setState({ originalUsers: users });
        
      } catch (error) {
        setLoading(false)
        console.error('Error fetching CRM users:', error);
      }
    };
  
    const storedOriginalUsers = useCRMStore.getState().originalUsers;

    if (crmUsers.length===0) fetchData();
    console.log("CRM Users",crmUsers.length,originalUsers.length)
    if (crmUsers.length!==0  && crmUsers.length!== storedOriginalUsers.length) fetchData()
      if(originalUsers.length===0 && storedOriginalUsers.length!==0){
        setOriginalUsers(storedOriginalUsers)
      }
  }, [setCRMUsers]);

  useEffect(() => {
  setCheckedUser(crmUsers.filter(user => selectedIds.has(user._id)));
}, [selectedIds, crmUsers,reRun]);
const filterUsers = (users: CRMUser[], searchTerm: string, tags: string[], startDate?: string, endDate?: string) => {
  let filteredUsers = [...users];

  // Apply search filter if search term exists
  if (searchTerm.trim()) {
    const term = searchTerm.trim().toLowerCase();
    filteredUsers = filteredUsers.filter(user => (
      (user.name?.toLowerCase().includes(term)) ||
      (user.email?.toLowerCase().includes(term)) ||
      (user.phone?.toLowerCase().includes(term)) ||
      (user.business?.toLowerCase().includes(term))
    ));
  }

  // Apply tags filter if tags exist
  if (tags.length > 0) {
    filteredUsers = filteredUsers.filter(user => {
      if (typeof user.tags === 'string') {
        return tags.some(tag => 
          String(user.tags).toLowerCase() === String(tag).toLowerCase()
        );
      } else {
        return false;
      }
    });
  }

  // Apply date range filter if both startDate and endDate are provided
  if (startDate && endDate) {
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    filteredUsers = filteredUsers.filter(user => {
      const userDate = new Date(user.createdAt).getTime();
      return userDate >= start && userDate <= end;
    });
  }

  return filteredUsers.map(user => ({
    ...user,
    isChecked: selectedIds.has(user._id)
  }));
};
const handleDateFilterChange = (startDate: Date, endDate: Date) => {
  const filteredUsers = filterUsers(originalUsers, '', activeTags, startDate.toISOString(), endDate.toISOString());
  setCRMUsers(filteredUsers);
  setCurrentPage(1);
};


const handleTagsFilterChange = (data: TagsFilterData) => {
  const tags = data.tags; // Extract the array from the object
  setActiveTags(tags);
  const filteredUsers = filterUsers(originalUsers, '', tags);
  setCRMUsers(filteredUsers);
  setCurrentPage(1);
};

const handleSearchChange = (value: string) => {
  const filteredUsers = filterUsers(originalUsers, value, activeTags);
  setCRMUsers(filteredUsers);
  setCurrentPage(1);
};

const totalPages = Math.ceil(crmUsers.length / itemsPerPage);
  const paginatedUsers = crmUsers.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  useEffect(() => {
    const allChecked = paginatedUsers.length > 0 && 
                     paginatedUsers.every(user => selectedIds.has(user._id));
    setEnabled(allChecked);
  }, [paginatedUsers, selectedIds]);
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleClearFilters = () => {
    setCRMUsers(originalUsers);
    setActiveTags([]);
    setCurrentPage(1);
    setSelectedIds(new Set()); 
    setEnabled(false);
  };
  return (
    <>
    <PageHeader 
      title="Contacts" 
      onSearchChange={(value) => handleSearchChange(value)} 
      route="contacts" 
      onSendEmailClick={() => setShowEmailPopup(true)}
      showEmail={showEmail}
      onTagsFilterChange={(data) => handleTagsFilterChange(data)}
      clearFilter={()=>{handleClearFilters()}}
      // dateSelectedCallback={(startDate, endDate) => {console.log(startDate, endDate)}}
  dateSelectedCallback={handleDateFilterChange}
    />
    {!loading ?
    <div className='table-container table-contacts-page'>
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
  {totalPages <= 5 ? (
    // Show all pages if 5 or fewer
    Array.from({ length: totalPages }, (_, i) => (
      <p
        key={i + 1}
        className={currentPage === i + 1 ? 'active' : ''}
        onClick={() => handlePageChange(i + 1)}
      >
        {i + 1}
      </p>
    ))
  ) : (
    // Smart pagination for more than 5 pages
    <>
      {/* Always show first page */}
      <p
        className={currentPage === 1 ? 'active' : ''}
        onClick={() => handlePageChange(1)}
      >
        1
      </p>

      {/* Show left ellipsis if needed */}
      {currentPage > 3 && <p>...</p>}

      {/* Show middle pages */}
      {(() => {
        let start, end;
        
        if (currentPage <= 3) {
          // Near start: show 2, 3, 4
          start = 2;
          end = 4;
        } else if (currentPage >= totalPages - 2) {
          // Near end: show n-3, n-2, n-1
          start = totalPages - 3;
          end = totalPages - 1;
        } else {
          // Middle: show current-1, current, current+1
          start = currentPage - 1;
          end = currentPage + 1;
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
          pages.push(
            <p
              key={i}
              className={currentPage === i ? 'active' : ''}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </p>
          );
        }
        return pages;
      })()}

      {/* Show right ellipsis if needed */}
      {currentPage < totalPages - 2 && <p>...</p>}

      {/* Always show last page */}
      <p
        className={currentPage === totalPages ? 'active' : ''}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </p>
    </>
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

      <EmailPopup isOpen={showEmailPopup} recipients={checkedUser} onClose={() => {setShowEmailPopup(false);setReRun(!reRun);uncheckAllUsers()}} />   
    </>
  );
}