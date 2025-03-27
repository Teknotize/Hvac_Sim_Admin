import { Fragment } from 'react'
import { Button } from '@headlessui/react';
import { FilterIcon } from '../../components/svg/icons';
import { Field, Input } from '@headlessui/react';
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useState } from 'react';
import useEmailToastStore from '../../store/userEmailToastStore';

export default function PageHeader({ 
    title, 
    route, 
    onSendEmailClick,
    onSearchChange,
    showEmail
  }: { 
    title: string, 
    route?: string,
    onSendEmailClick?: () => void,
    onSearchChange?: (value: string) => void,
    showEmail?: boolean
  }) {
      const { startProgress, updateProgress, completeProgress } = useEmailToastStore();
      const [showPopup, setShowPopup] = useState(false);
  
      // Test function to trigger the progress
      const testEmailProgress = () => {
          setShowPopup(true);
          
          // Hardcoded values
          const totalEmails = 10;
          let currentProgress = 0;
  
          // Initialize progress
          startProgress(totalEmails);
          
          // Update progress every 2 seconds
          const interval = setInterval(() => {
            currentProgress += 1;
            updateProgress(currentProgress);
            console.log(`Progress: ${currentProgress}/${totalEmails}`); // Debug log
  
            // Complete when done
            if (currentProgress >= totalEmails) {
              clearInterval(interval);
              completeProgress(true);
              setShowPopup(false);
            }
          }, 2000);
  
          return () => clearInterval(interval);
      };
    return (
        <div className="page-header">
            <div className="flex items-center">
                <div className="flex-1">
                    <h1 className="page-title">{title}</h1>
                </div>
                {route === 'contacts' && (
                    <div className="filterArea">
                        {showEmail&&
                        <Button className="btn btn-primary" onClick={()=>{  onSendEmailClick?.();testEmailProgress();} }>
                            Send Email
                            </Button>}

                        <Field className="search-field">
                        <FontAwesomeIcon icon={faSearch} />
                        <Input as={Fragment}>
                            {({ focus, hover }) => (
                                <input
                                name="search"
                                placeholder="Search"
                                className={clsx(focus && 'itemfocus', hover && 'itemhover')}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                />
                            )}
                            </Input>
                        </Field>
                        <Button className="btn btn-outline-grey icon-start"><FilterIcon /> Filter</Button>
                    </div>
                )}
                {route === 'pdf-manual' && (
                    <div className="filterArea">
                        <Button className="btn btn-primary"><FontAwesomeIcon icon={faPlus} /> Add New</Button>
                    </div>
                )}
                {route === 'app-data' && (
                    <div className="filterArea">

                        <Popover className="action-drop">
                            <PopoverButton className="block">
                            <Button className="btn btn-primary"><FontAwesomeIcon icon={faPlus} /> Add New</Button>
                            </PopoverButton>
                            <PopoverPanel
                            transition
                            anchor="bottom end"
                            className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                            >
                            <div className="action-menu">
                                <Link to="/" className="action-menu-item">
                                <p>Combustion</p>
                                </Link>
                                <Link to="/" className="action-menu-item">
                                <p>Refrigerant</p>
                                </Link>
                            </div>
                            </PopoverPanel>
                        </Popover>

                    </div>
                )}
            </div>
        </div>
    )
}