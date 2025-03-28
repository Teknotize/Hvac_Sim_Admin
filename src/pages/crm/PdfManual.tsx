import { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import { PdfManualIcon } from "../../components/svg/icons";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Dialog, DialogPanel } from '@headlessui/react';
import { Button } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export default function PdfManual() {
    const [isAddNewPdfOpen,setIsAddNewPdfOpen] = useState(false);

    return (
        <>
            <PageHeader title="PDF Manual" route="pdf-manual" onAddNewPdfClick={() => setIsAddNewPdfOpen(true)} />

            <div className="flex gap-6 flex-wrap">
                <div className="fileDownloadDv locked">
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

            <Dialog open={isAddNewPdfOpen} onClose={() => setIsAddNewPdfOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/40 dialog-item dialog-item-add-new-pdf">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-6 rounded-xl dialog-panel">
                        <div className="dialog-header">
                            <h3>Add New PDF</h3>
                            <Button className='closeBtn' onClick={() => setIsAddNewPdfOpen(false)}>
                            <FontAwesomeIcon icon={faXmark} />
                            </Button>
                        </div>
                        <div className="dialog-body">
                            <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                        </div>
                        <div className="dialog-footer">
                            <button onClick={() => setIsAddNewPdfOpen(false)}>Cancel</button>
                            <button onClick={() => setIsAddNewPdfOpen(false)}>Deactivate</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

        </>
    )
}