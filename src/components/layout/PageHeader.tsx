import { Fragment } from 'react'
import { Button } from '@headlessui/react';
import { FilterIcon } from '../../components/svg/icons';
import { Field, Input } from '@headlessui/react';
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function PageHeader({ 
  title, 
  route, 
  onSendEmailClick ,
  onSearchChange 
}: { 
  title: string, 
  route?: string,
  onSendEmailClick?: () => void ,
  onSearchChange?: (value: string) => void
}) {
    return (
        <div className="page-header">
            <div className="flex items-center">
                <div className="flex-1">
                    <h1 className="page-title">{title}</h1>
                </div>
                {route === 'contacts' && (
                    <div className="filterArea">
                        <Button className="btn btn-primary" onClick={onSendEmailClick}>Send Email</Button>
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
            </div>
        </div>
    )
}