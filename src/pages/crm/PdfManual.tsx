import PageHeader from "../../components/layout/PageHeader";
import { PdfManualIcon } from "../../components/svg/icons";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export default function PdfManual() {
    return (
        <>
            <PageHeader title="PDF Manual" route="pdf-manual" />

            <div className="flex gap-4 flex-wrap">
                <div className="fileDownloadDv">
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
                            <p>Enable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Disable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Edit</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Delete</p>
                            </Link>
                        </div>
                        </PopoverPanel>
                    </Popover>
                    <div className="iconDv"><PdfManualIcon /></div>
                    <h3>PDF Manual</h3>
                </div>
                <div className="fileDownloadDv">
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
                            <p>Enable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Disable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Edit</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Delete</p>
                            </Link>
                        </div>
                        </PopoverPanel>
                    </Popover>
                    <div className="iconDv"><PdfManualIcon /></div>
                    <h3>PDF Manual</h3>
                </div>
                <div className="fileDownloadDv">
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
                            <p>Enable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Disable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Edit</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Delete</p>
                            </Link>
                        </div>
                        </PopoverPanel>
                    </Popover>
                    <div className="iconDv"><PdfManualIcon /></div>
                    <h3>PDF Manual</h3>
                </div>
                <div className="fileDownloadDv">
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
                            <p>Enable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Disable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Edit</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Delete</p>
                            </Link>
                        </div>
                        </PopoverPanel>
                    </Popover>
                    <div className="iconDv"><PdfManualIcon /></div>
                    <h3>PDF Manual</h3>
                </div>
                <div className="fileDownloadDv">
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
                            <p>Enable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Disable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Edit</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Delete</p>
                            </Link>
                        </div>
                        </PopoverPanel>
                    </Popover>
                    <div className="iconDv"><PdfManualIcon /></div>
                    <h3>PDF Manual</h3>
                </div>
                <div className="fileDownloadDv">
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
                            <p>Enable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Disable</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Edit</p>
                            </Link>
                            <Link to="/" className="action-menu-item">
                            <p>Delete</p>
                            </Link>
                        </div>
                        </PopoverPanel>
                    </Popover>
                    <div className="iconDv"><PdfManualIcon /></div>
                    <h3>PDF Manual</h3>
                </div>
            </div>
        </>
    )
}