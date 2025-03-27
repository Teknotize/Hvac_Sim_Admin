import { Fragment } from 'react'
import { Button } from '@headlessui/react';
import { FilterIcon } from '../../components/svg/icons';
import { Field, Input } from '@headlessui/react';
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Link } from "react-router-dom";

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
      
    return (
        <div className="page-header">
            <div className="flex items-center">
                <div className="flex-1">
                    <h1 className="page-title">{title}</h1>
                </div>
                {route === 'contacts' && (
                    <div className="filterArea">
                        {showEmail&&
                        <Button className="btn btn-primary" onClick={()=>{  onSendEmailClick?.();} }>
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