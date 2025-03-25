import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faCheck, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Checkbox } from '@headlessui/react'
import { useState } from 'react';
import { ApprovedEmailIcon } from '../../components/svg/icons';
const contacts = [
  {
    id: 1,
    name: 'John Doe',
    phone: '0300 1234567',
    email: 'john.doe@example.com',
    emailApproved: true,
    business: 'Business Name',
    tags: ['Lead', 'Prospect', 'New', 'Old'],
    date: 'March 24, 2025',
    time: '10:00 AM',
    checked: false
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '0300 1234567',
    email: 'jane.smith@example.com',
    emailApproved: false,
    business: 'Business Name',
    tags: ['New', 'Prospect'],
    date: 'March 24, 2025',
    time: '10:00 AM',
    checked: true
  },
  {
    id: 3,
    name: 'Mike Johnson',
    phone: '0300 1234567',
    email: 'mike.johnson@example.com',
    emailApproved: true,
    business: 'Business Name',
    tags: ['New', 'Prospect'],
    date: 'March 24, 2025',
    time: '10:00 AM',
    checked: false
  },
  {
    id: 4,
    name: 'John Doe',
    phone: '0300 1234567',
    email: 'john.doe@example.com',
    emailApproved: true,
    business: 'Business Name',
    tags: ['Lead', 'Prospect', 'New', 'Old'],
    date: 'March 24, 2025',
    time: '10:00 AM',
    checked: false
  },
  {
    id: 5,
    name: 'John Doe',
    phone: '0300 1234567',
    email: 'john.doe@example.com',
    emailApproved: true,
    business: 'Business Name',
    tags: ['Lead', 'Prospect', 'New', 'Old'],
    date: 'March 24, 2025',
    time: '10:00 AM',
    checked: false
  },
  {
    id: 6,
    name: 'John Doe',
    phone: '0300 1234567',
    email: 'john.doe@example.com',
    emailApproved: true,
    business: 'Business Name',
    tags: ['Lead', 'Prospect', 'New', 'Old'],
    date: 'March 24, 2025',
    time: '10:00 AM',
    checked: false
  },
  {
    id: 7,
    name: 'John Doe',
    phone: '0300 1234567',
    email: 'john.doe@example.com',
    emailApproved: true,
    business: 'Business Name',
    tags: ['Lead', 'Prospect', 'New', 'Old'],
    date: 'March 24, 2025',
    time: '10:00 AM',
    checked: false
  },
  {
    id: 8,
    name: 'John Doe',
    phone: '0300 1234567',
    email: 'john.doe@example.com',
    emailApproved: true,
    business: 'Business Name',
    tags: ['Lead', 'Prospect', 'New', 'Old'],
    date: 'March 24, 2025',
    time: '10:00 AM',
    checked: false
  },
  {
    id: 9,
    name: 'John Doe',
    phone: '0300 1234567',
    email: 'john.doe@example.com',
    emailApproved: true,
    business: 'Business Name',
    tags: ['Lead', 'Prospect', 'New', 'Old'],
    date: 'March 24, 2025',
    time: '10:00 AM',
    checked: false
  },
  {
    id: 10,
    name: 'John Doe',
    phone: '0300 1234567',
    email: 'john.doe@example.com',
    emailApproved: true,
    business: 'Business Name',
    tags: ['Lead', 'Prospect', 'New', 'Old'],
    date: 'March 24, 2025',
    time: '10:00 AM',
    checked: false
  }
]



export default function Contacts() {
  const [enabled, setEnabled] = useState(false)

  return (
    <>
    <PageHeader title="Contacts" route="contacts" />
    
    <div className='table-container'>
      <div className="table-wrapper">
        <div className='table-header'>
          <div className='table-row'>
            <div className='table-cell cell-checkbox'>
              <Checkbox
                checked={enabled}
                onChange={setEnabled}
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
          {contacts.map((contact) => (
            <div className='table-row' key={contact.id}>
              <div className='table-cell cell-checkbox'>
                <Checkbox
                checked={contact.checked || false}
                onChange={(checked) => {
                  contact.checked = checked;
                }}
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
              <p className='email-item'>{contact.emailApproved && <ApprovedEmailIcon />} <span>{contact.email}</span></p>
            </div>
            <div className='table-cell cell-business'>
              <p>{contact.business}</p>
            </div>
            <div className='table-cell cell-tags'>
              <p className='tags'>
                {contact.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </p>
            </div>
            <div className='table-cell cell-date'>
              <p className='date'>{contact.date} <span className='time'>{contact.time}</span></p>
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
    
    
    </>
  );
}