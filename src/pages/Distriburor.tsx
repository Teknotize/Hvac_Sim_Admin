import PageHeader from "../components/layout/PageHeader";
import { faCheck, faChevronLeft, faChevronRight, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ApprovedEmailIcon } from "../components/svg/icons";


export default function Distriburor() {
    return (
        <>
            <PageHeader 
                title="Distriburors"
                route="distributors"
                onSearchChange={() => {}}
                onSendEmailClick={() => {}}
                showEmail={false}
                onTagsFilterChange={() => {}}
                onSubscriptionFilterChange={() => {}}
             />


        <div className="table-container table-contacts-page">
          <div className="table-wrapper">
            <div className="table-header">
              <div className="table-row">
                <div className="table-cell cell-checkbox">
                  <Checkbox
                    checked={false}
                    onChange={() => {}}
                    className="group table-checkbox-item data-[checked]:checked"
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="opacity-0 group-data-[checked]:opacity-100"
                    />
                  </Checkbox>
                </div>
                <div className="table-cell cell-distributor">Distributors</div>
                <div className="table-cell cell-country">Country/State</div>
                <div className="table-cell cell-email">Salesperson 1</div>
                <div className="table-cell cell-email">Salesperson 2</div>
                <div className="table-cell cell-email">Salesperson 3</div>
                <div className="table-cell cell-status">Status</div>
                <div className="table-cell cell-action">Action</div>
              </div>
            </div>
            <div className="table-body">
                
                <div className="table-row" key={1}>
                    <div className="table-cell cell-checkbox">
                        <Checkbox
                        checked={false}
                        onChange={() => {}}
                        className="group table-checkbox-item data-[checked]:checked"
                        >
                        <FontAwesomeIcon
                            icon={faCheck}
                            className="opacity-0 group-data-[checked]:opacity-100"
                        />
                        </Checkbox>
                    </div>
                    <div className="table-cell cell-distributor">
                        <p>Soutern Education Systems</p>
                    </div>
                    <div className="table-cell cell-country">
                        <p>California</p>
                    </div>
                    <div className="table-cell cell-email">
                        <p className="email-item">
                        <ApprovedEmailIcon />
                        <span>test@test.com</span>
                        </p>
                    </div>
                    <div className="table-cell cell-email">
                        <p className="email-item">
                        <ApprovedEmailIcon />
                        <span>test@test.com</span>
                        </p>
                    </div>
                    <div className="table-cell cell-email">
                        <p className="email-item">
                        <ApprovedEmailIcon />
                        <span>test@test.com</span>
                        </p>
                    </div>
                    <div className="table-cell cell-status">
                        <p className="status">
                            <span className="active">Active</span>
                        </p>
                    </div>
                    <div className="table-cell cell-action justify-end">
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
                            <span
                                onClick={() => {}}
                                className="action-menu-item cursor-pointer"
                            >
                                <p>Delete</p>
                            </span>
                            
                            </div>
                        </PopoverPanel>
                        </Popover>
                    </div>
                </div>
                <div className="table-row" key={2}>
                    <div className="table-cell cell-checkbox">
                        <Checkbox
                        checked={false}
                        onChange={() => {}}
                        className="group table-checkbox-item data-[checked]:checked"
                        >
                        <FontAwesomeIcon
                            icon={faCheck}
                            className="opacity-0 group-data-[checked]:opacity-100"
                        />
                        </Checkbox>
                    </div>
                    <div className="table-cell cell-distributor">
                        <p>Soutern Education Systems</p>
                    </div>
                    <div className="table-cell cell-country">
                        <p>California</p>
                    </div>
                    <div className="table-cell cell-email">
                        <p className="email-item">
                        <ApprovedEmailIcon />
                        <span>test@test.com</span>
                        </p>
                    </div>
                    <div className="table-cell cell-email">
                        <p className="email-item">
                        <ApprovedEmailIcon />
                        <span>test@test.com</span>
                        </p>
                    </div>
                    <div className="table-cell cell-email">
                        <p className="email-item">
                        <ApprovedEmailIcon />
                        <span>test@test.com</span>
                        </p>
                    </div>
                    <div className="table-cell cell-status">
                        <p className="status">
                            <span className="inactive">Inactive</span>
                        </p>
                    </div>
                    <div className="table-cell cell-action justify-end">
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
                            <span
                                onClick={() => {}}
                                className="action-menu-item cursor-pointer"
                            >
                                <p>Delete</p>
                            </span>
                            
                            </div>
                        </PopoverPanel>
                        </Popover>
                    </div>
                </div>

            </div>
          </div>
          <div className="table-footer">
            <div className="table-row">
              <div className="table-cell pagination-cell">
                <p className="pagination-info" style={{ marginRight: "20px" }}>
                  Showing 1 to 10 of 100 records
                </p>

                <div className="pagination">
                  <button
                    className="pagination-button"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <div className="pagination-numbers">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                  </div>

                  <button
                    className="pagination-button"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        </>
    )
}