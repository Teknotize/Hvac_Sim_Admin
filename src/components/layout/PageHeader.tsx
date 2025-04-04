import { Fragment, useEffect, useState } from 'react'
import { Button, Checkbox } from '@headlessui/react';
import { FilterIcon } from '../../components/svg/icons';
import { Field, Input } from '@headlessui/react';
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faChevronDown, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Link } from "react-router-dom";
import { DateRangePicker, Range } from 'react-date-range';
import { tags,defaultDate } from '../../utils/constants';
export default function PageHeader({ 
    title, 
    route, 
    onSendEmailClick,
    onSearchChange,
    showEmail,
    onAddNewPdfClick,
    onTagsFilterChange,
    clearFilter
  }: { 
    title: string, 
    route?: string,
    onSendEmailClick?: () => void,
    onSearchChange?: (value: string) => void,
    onAddNewPdfClick?: () => void,
    showEmail?: boolean
    onTagsFilterChange?: (filters: { tags: string[]
        // ; dateRange: Range[] 
    }) => void; 
    clearFilter?:()=>void
  }) {

    const [filterActive, setFilterActive] = useState(false); 
    const [filterCount,setFilterCount]=useState(0)
    const [selectedTags, setSelectedTags] = useState(tags.map(tag => ({ ...tag, checked: false })));
    const handleReset=()=>{
        setSelectedTags(  tags.map(tag => ({ ...tag, checked: false })) 
        )
    }
    const [datSstate, setDateState] = useState<Range[]>([
        defaultDate
    ]);
    const handleApplyFilters = () => {
        const selectedTagNames = selectedTags
          .filter(tag => tag.checked)
          .map(tag => tag.name);
        
          onTagsFilterChange?.({
          tags: selectedTagNames,
        });
      };
      useEffect(() => {
        const totalSelectedFilters = () => {
          let count = 0;
          let isCheckedCount = 0;
          
          selectedTags.forEach((tag) => {
            if (tag.checked) isCheckedCount += 1;
          });
      
          if (isCheckedCount > 0) {
            count += 1;
          }
      
          const { startDate, endDate } = datSstate[0];
          if (startDate && endDate && startDate.toDateString() !== endDate.toDateString()) {
            count += 1;
          }
      
          return count;
        };
      
        const newCount = totalSelectedFilters();
        setFilterCount(newCount);
      
        // Only call clearFilter if count transitions from >0 to 0
        if (filterCount > 0 && newCount === 0) {
          clearFilter?.();
        }
      }, [selectedTags, datSstate]);
      
    const handleCheckboxChange = (id: number, checked: boolean) => {
        setSelectedTags((prev) =>
            prev.map((tag) =>
                tag.id === id ? { ...tag, checked } : tag
            )
        );
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
                        {filterCount>0 && <Button className="btn btn-link"onClick={()=>{handleReset();setDateState([defaultDate]);clearFilter?.() }}>Clear Filter</Button>}
                          
                        {filterActive && <div className='filters'>
                            <div className='filter-item'>
                                
                                
                                <Popover className="action-drop">
                                    <PopoverButton className={clsx("block btn btn-outline-grey icon-end", 'active--')}>
                                        <span>
                                            Date <FontAwesomeIcon icon={faChevronDown} />
                                        </span>
                                        <span className='active'>
                                            {datSstate[0]?.startDate?.toLocaleDateString()} - {datSstate[0]?.endDate?.toLocaleDateString()} <FontAwesomeIcon icon={faXmark} />
                                        </span>
                                    </PopoverButton>
                                    <PopoverPanel
                                    transition
                                    anchor="bottom end"
                                    className="action-popover w-5xl shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                                    >
                                    
                                        <DateRangePicker
                                       onChange={item => {
                                        setDateState([item.selection]);
                                        // onFilterChange?.({
                                        //   tags: selectedTags.filter(tag => tag.checked).map(tag => tag.name),
                                        //   dateRange: [item.selection]
                                        // });
                                      }}
                                       moveRangeOnFirstSelection={false}
                                        months={2}
                                        ranges={datSstate}
                                        direction="horizontal"
                                        rangeColors={['#B92825']}
                                        />
                                    </PopoverPanel>
                                </Popover>

                                <Popover className="action-drop">
                            {({ open, close }) => (
                                <>
                                <PopoverButton className="block btn btn-outline-grey icon-end active--">
                                    <span>
                                    Tags <FontAwesomeIcon icon={faChevronDown} />
                                    </span>
                                    <span className='active'>
                                    Tags <FontAwesomeIcon icon={faXmark} />
                                    </span>
                                </PopoverButton>
                                <PopoverPanel
                                    transition
                                    anchor="bottom end"
                                    className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                                >
                                    <div className="list-menu">
                                    <div className='list-group'>
                                        {selectedTags.map((tag) => (
                                        <div className='list-group-item' key={tag.id}>
                                            <Checkbox
                                            checked={tag.checked}
                                            onChange={(checked) => handleCheckboxChange(tag.id, checked)}
                                            className="group list-checkbox-item data-[checked]:checked"
                                            >
                                            <FontAwesomeIcon icon={faCheck} className='opacity-0 group-data-[checked]:opacity-100' />
                                            </Checkbox>
                                            <span>{tag.name}</span>
                                        </div>
                                        ))}
                                    </div>
                                    <div className='btnRow'>
                                        <Button className='btn btn-link' onClick={handleReset}>Reset</Button>
                                        <Button
                                        className='btn btn-primary'
                                        onClick={() => {
                                            handleApplyFilters();
                                            close(); // Close dropdown
                                        }}
                                        disabled={selectedTags.every(tag => !tag.checked)}
                                        >
                                        Apply
                                        </Button>
                                    </div>
                                    </div>
                                </PopoverPanel>
                                </>
                            )}
                            </Popover>

                            </div>
                        </div>}
                        <Button className={`btn btn-outline-grey icon-start ${filterActive ? "bg-primary text-white" : ""}`} onClick={() => { setFilterActive(!filterActive);console.log('clciked') }}>
                            <FilterIcon /> Filter <b>{filterCount>0?filterCount:""}</b>
                        </Button>
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