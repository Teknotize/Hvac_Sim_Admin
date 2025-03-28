import { Fragment, useState } from 'react'
import { Button, Checkbox } from '@headlessui/react';
import { FilterIcon } from '../../components/svg/icons';
import { Field, Input } from '@headlessui/react';
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faChevronDown, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Link } from "react-router-dom";

const tags = [
    {
        id: 1,
        name: 'Membership',
        checked: true
    },
    {
        id: 2,
        name: 'Curriculum',
        checked: false
    },
    {
        id: 3,
        name: 'App User',
        checked: false
    }
]

export default function PageHeader({ 
    title, 
    route, 
    onSendEmailClick,
    onSearchChange,
    showEmail,
    onAddNewPdfClick
  }: { 
    title: string, 
    route?: string,
    onSendEmailClick?: () => void,
    onSearchChange?: (value: string) => void,
    onAddNewPdfClick?: () => void,
    showEmail?: boolean
  }) {

    const [filterActive, setFilterActive] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleCheckboxChange = (id: string, checked: boolean, type: string) => {
        setSelectedTags(prev => [...prev, id]);
    };
      
    return (
        <div className="page-header">
            <div className="flex items-center">
                <div className="flex-1">
                    <h1 className="page-title">{title}</h1>
                </div>
                {route === 'contacts' && (
                    <div className="filterArea">

                        {!filterActive && <>

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

                        </>}

                        {filterActive && <div className='filters'>
                            <div className='filter-item'>
                                
                                <Popover className="action-drop">
                                    <PopoverButton className="block">
                                        <Button className="btn btn-outline-grey icon-end active--">
                                            <span>
                                                Filter <FontAwesomeIcon icon={faChevronDown} />
                                            </span>
                                            <span className='active'>
                                                Filter <FontAwesomeIcon icon={faXmark} />
                                            </span>
                                        </Button>
                                    </PopoverButton>
                                    <PopoverPanel
                                    transition
                                    anchor="bottom end"
                                    className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                                    >
                                    <div className="list-menu">
                                        <div className='list-group'>
                                            {tags.map((tag) => (
                                            <div className='list-group-item'>
                                                <Checkbox
                                                    checked={tag.checked}
                                                    onChange={(checked) => handleCheckboxChange(tag.id.toString(), checked,"single")}
                                                    className="group list-checkbox-item data-[checked]:checked"
                                                >
                                                    <FontAwesomeIcon icon={faCheck} className='opacity-0 group-data-[checked]:opacity-100' />
                                                </Checkbox>
                                                <span>{tag.name}</span>
                                            </div>
                                            ))}
                                        </div>
                                        <div className='btnRow'>
                                            <Button className='btn btn-link' disabled>Reset</Button>
                                            <Button className='btn btn-primary' disabled>Apply</Button>
                                        </div>
                                    </div>
                                    </PopoverPanel>
                                </Popover>
                                
                                <Button className="btn btn-link">Clear Filter</Button>
                            </div>
                        </div>}
                        <Button className="btn btn-outline-grey icon-start" onClick={()=>{ setFilterActive(!filterActive); }}><FilterIcon /> Filter <b>2</b></Button>
                    </div>
                )}
                {route === 'pdf-manual' && (
                    <div className="filterArea">
                        <Button className="btn btn-primary" onClick={()=>{ onAddNewPdfClick?.(); }}><FontAwesomeIcon icon={faPlus} /> Add New</Button>
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