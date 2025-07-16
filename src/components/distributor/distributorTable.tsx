import { Fragment, useState, useEffect } from "react";
import { faCheck, faEllipsisVertical, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Field,
  Input,
  PopoverButton, PopoverPanel ,
  Popover,
  Dialog,
  DialogPanel
} from "@headlessui/react";
import { DialogDeleteIcon } from "../svg/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AddDistrubutorForm from "./addDistrubutorForm";
import { getDistributors, toggleDistributorStatus, deleteDistributor } from "../../api/DistributorData";
import EditDistrubutor from "./editDistributor";
import useToastStore from "../../store/useToastStore"; 
import Loader from "../../components/loader";


const DistributorTable = () => {
    const { showToast } = useToastStore();


    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editDistributor, setEditDistributor] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [distributors, setDistributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedDistributorId, setSelectedDistributorId] = useState<string | null>(null);
    

    const fetchDistributors = async () => {
        try {
        const res = await getDistributors();
        console.log("API response:", res.data); // 🐞 DEBUG HERE
        setDistributors(res.data); // OR setDistributors(res.data.distributors);
        } catch (err) {
        console.error("Error fetching distributors", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
    fetchDistributors();
    }, []);

    const filteredDistributors = distributors.filter((d) => {
    const query = searchQuery.toLowerCase();
    return (
        d.distributorName?.toLowerCase().includes(query) ||
        d.state?.toLowerCase().includes(query) ||
        d.Status?.toLowerCase() === query ||
        d.salesperson1?.toLowerCase().includes(query) ||
        d.salesperson2?.toLowerCase().includes(query) ||
        d.salesperson3?.toLowerCase().includes(query)
    );
    });

    const totalPages = Math.ceil(filteredDistributors.length / rowsPerPage);

    const paginatedDistributors = filteredDistributors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
    );


    const handleToggleStatus = async (id: string) => {
        // Find the distributor to get the current status
        const target = distributors.find((dist) => dist._id === id);
        if (!target) return;

        const isActive = target.Status === "Active";

        try {
            await toggleDistributorStatus(id);

            // Optimistically update the UI
            setDistributors((prev) =>
            prev.map((dist) =>
                dist._id === id
                ? {
                    ...dist,
                    Status: dist.Status === "Active" ? "Inactive" : "Active",
                    }
                : dist
            )
            );

            showToast("Status updated successfully!", "success");
        } catch (error) {
            console.error("Failed to toggle distributor status:", error);
            showToast("Status update failed", "error");
        }
    };


        const handleDeleteDistributor = (id: string) => {
            setSelectedDistributorId(id);
            setIsDeleteConfirmOpen(true);
            };

            const confirmDeleteDistributor = async () => {
            if (!selectedDistributorId) return;

            try {
                await deleteDistributor(selectedDistributorId);
                setDistributors((prev) => prev.filter((d) => d._id !== selectedDistributorId));
                showToast("Distributor deleted successfully!", "success");
            } catch (err) {
                console.error("Failed to delete distributor:", err);
                showToast("Deletion failed", "error");
            } finally {
                setIsDeleteConfirmOpen(false);
                setSelectedDistributorId(null);
            }
        };



  return (
    <>
    {/* Header */}
      <div className="page-header container mx-auto">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="page-title text-lg">Distributors</p>
          </div>

          <div className="filterArea">
            <Field className="search-field">
              <FontAwesomeIcon className="z-1" icon={faSearch} />
              <Input as={Fragment}>
                  <input
                    name="search"
                    placeholder="Search"
                    className="search-field text-md h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </Input>
            </Field>
                <Button
                    className="btn btn-primary"
                    onClick={() => setIsOpen(true)}
                >
                    <FontAwesomeIcon className="font-bold" icon={faPlus} /> <span className="font-semibold text-xs">Add New</span>
                </Button>
            

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-2">
                <Dialog.Panel className="w-full max-w-4xl rounded-lg bg-white shadow-lg">
                    <div className="flex justify-between py-[19px] px-[25px]">
                        <p className="text-2xl font-bold text-[#232D42]">Add Distributor</p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className=" cursor-pointer"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#EDF2F7"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.96967 6.96967C7.26256 6.67678 7.73744 6.67678 8.03033 6.96967L12 10.9393L15.9697 6.96967C16.2626 6.67678 16.7374 6.67678 17.0303 6.96967C17.3232 7.26256 17.3232 7.73744 17.0303 8.03033L13.0607 12L17.0303 15.9697C17.3232 16.2626 17.3232 16.7374 17.0303 17.0303C16.7374 17.3232 16.2626 17.3232 15.9697 17.0303L12 13.0607L8.03033 17.0303C7.73744 17.3232 7.26256 17.3232 6.96967 17.0303C6.67678 16.7374 6.67678 16.2626 6.96967 15.9697L10.9393 12L6.96967 8.03033C6.67678 7.73744 6.67678 7.26256 6.96967 6.96967Z" fill="#707A8A"/>
                                </svg>
                        </button>
                    </div>
                    {/* Your form goes here */}
                    
                {<AddDistrubutorForm onSuccess={fetchDistributors} onClose={() => setIsOpen(false)} />}
                </Dialog.Panel>
                </div>
            </Dialog>
            <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-2">
                    <Dialog.Panel className="w-full max-w-4xl rounded-lg bg-white shadow-lg">
                    <div className="flex justify-between py-[19px] px-[25px]">
                        <p className="text-2xl font-bold text-[#232D42]">Edit Distributor</p>
                        <button
                        onClick={() => setIsEditOpen(false)}
                        className="cursor-pointer"
                        >
                        {/* Close Icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="12" fill="#EDF2F7" />
                            <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.96967 6.96967C7.26256 6.67678 7.73744 6.67678 8.03033 6.96967L12 10.9393L15.9697 6.96967C16.2626 6.67678 16.7374 6.67678 17.0303 6.96967C17.3232 7.26256 17.3232 7.73744 17.0303 8.03033L13.0607 12L17.0303 15.9697C17.3232 16.2626 17.3232 16.7374 17.0303 17.0303C16.7374 17.3232 16.2626 17.3232 15.9697 17.0303L12 13.0607L8.03033 17.0303C7.73744 17.3232 7.26256 17.3232 6.96967 17.0303C6.67678 16.7374 6.67678 16.2626 6.96967 15.9697L10.9393 12L6.96967 8.03033C6.67678 7.73744 6.67678 7.26256 6.96967 6.96967Z"
                            fill="#707A8A"
                            />
                        </svg>
                        </button>
                    </div>
                    
                    {/* Edit form with passed distributor */}
                    {editDistributor && (
                        <EditDistrubutor
                        distributor={editDistributor}
                        onClose={() => setIsEditOpen(false)}
                        onSuccess={fetchDistributors}
                        />
                    )}
                    </Dialog.Panel>
                </div>
            </Dialog>

          </div>
        </div>

      </div>

    <section className="container mx-auto">
        <div className="flex flex-col">
                        <table className="w-full bg-white overflow-x-auto">
                            <thead className="bg-white">
                                <tr className="border-t text-xs" style={{ borderTopColor: "#e9ecef" }}>
                                    <th scope="col" className="py-3.5 px-4 font-semibold text-left rtl:text-right text-black ">Distributors</th>
                                    <th scope="col" className="px-4 py-3.5 font-semibold text-left rtl:text-right text-black">Country/State</th>
                                    <th scope="col" className="px-4 py-3.5 font-semibold text-left rtl:text-right text-black ">Salesperson 1</th>
                                    <th scope="col" className="px-4 py-3.5 font-semibold text-left rtl:text-right text-black">Salesperson 2</th>
                                    <th scope="col" className="px-4 py-3.5 font-semibold text-left rtl:text-right text-black">Salesperson 3</th>
                                    <th scope="col" className="px-4 py-3.5 font-semibold text-left rtl:text-right text-black ">Status</th>
                                    <th scope="col" className="px-4 py-3.5 font-semibold text-left rtl:text-right text-black "></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {loading ? (
                                <tr>
                                    <td colSpan={7} ><Loader size="xl"/></td>
                                </tr>
                                ) : distributors.length > 0 ? (
                                paginatedDistributors.map((item, index) => (
                                    <tr key={item._id || index} className="border-t" style={{borderColor:"#CEDBE980"}}>
                                    <td className="px-4 py-4 text-sm text-gray-500">{item.distributorName}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500">{item.state}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500">{item.salesperson1}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500">{item.salesperson2}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500">{item.salesperson3}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500">
                                        <span className={`p-1 px-2 rounded-2xl font-medium ${
                                        item.Status === "Active"
                                            ? "bg-[#E7F4EE] text-[#0D894F]"
                                            : "bg-[#F4433626] text-[#F51909]"
                                        }`}>
                                        {item.Status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-gray-500  whitespace-nowrap">
                                            <div className="table-cell text-xl cell-action justify-end">
                                                <Popover className="relative cursor-pointer">
                                                    {({ close }) => (
                                                        <>
                                                        <Popover.Button className="block cursor-pointer">
                                                            <FontAwesomeIcon icon={faEllipsisVertical} />
                                                        </Popover.Button>

                                                        <Popover.Panel className="absolute right-0 z-10 mt-2 w-50 bg-white shadow-lg border rounded-md" style={{ borderColor: "#e9ecef" }}>
                                                            <div className="p-2 space-y-2 font-medium">
                                                            <button
                                                                onClick={() => {
                                                                setEditDistributor(item);
                                                                setIsEditOpen(true);
                                                                // ✅ Close popover
                                                                }}
                                                                className="block w-full rounded-md px-4 py-2 text-left cursor-pointer text-sm text-[#425466] transition-colors duration-200 rounded-md valid"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                handleToggleStatus(item._id);
                                                                close(); // ✅ Close popover
                                                                }}
                                                                className="block w-full rounded-md px-4 py-2 text-left cursor-pointer text-sm text-[#425466] transition-colors duration-200 rounded-md valid"
                                                            >
                                                                {item.Status === "Active" ? "Deactivate" : "Activate"}
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                handleDeleteDistributor(item._id);
                                                                // ✅ Close popover
                                                                }}
                                                                className="block w-full rounded-md px-4 py-2 text-left cursor-pointer text-sm text-[#425466] transition-colors duration-200 rounded-md valid"
                                                            >
                                                                Delete
                                                            </button>
                                                            </div>
                                                        </Popover.Panel>
                                                        </>
                                                    )}
                                                </Popover>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-6 text-gray-400">No distributors found</td>
                                </tr>
                                )}
                            </tbody>
                            <Dialog
                                open={isDeleteConfirmOpen}
                                onClose={() => setIsDeleteConfirmOpen(false)}
                                className="relative z-50"
                                >
                                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/40 dialog-item dialog-notification dialog-email-success">
                                    <DialogPanel className="max-w-full w-xl space-y-4 border bg-white p-6 rounded-xl dialog-panel">
                                    <div className="dialog-body">
                                        <Button
                                        className="closeBtn"
                                        onClick={() => setIsDeleteConfirmOpen(false)}
                                        >
                                        <FontAwesomeIcon icon={faXmark} />
                                        </Button>

                                        <div className="icon">
                                        <DialogDeleteIcon />
                                        </div>

                                        <h3>Confirm Deletion?</h3>
                                        <p>
                                        Are you sure you want to delete this distributor? This action cannot be undone.
                                        </p>

                                        <div className="btn-row flex gap-4 justify-end">
                                        <Button
                                            className="btn btn-primary-outline"
                                            onClick={() => setIsDeleteConfirmOpen(false)}
                                        >
                                            Not Now
                                        </Button>
                                        <Button className="btn btn-primary" onClick={confirmDeleteDistributor}>
                                            Yes, Delete
                                        </Button>
                                        </div>
                                    </div>
                                    </DialogPanel>
                                </div>
                            </Dialog>

                        </table>
                    
        </div>
        <div className="table-footer flex justify-end mt-5">
            <div className="table-row">
                <div className="table-cell pagination-cell">
                <div className="pagination flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                    className="pagination-button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    >
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="chevron-left"
                        className="svg-inline--fa fa-chevron-left"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                    >
                        <path
                        fill="currentColor"
                        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                        />
                    </svg>
                    </button>

                    {/* Page Numbers */}
                    {/* Page Numbers */}
<div className="pagination-numbers flex space-x-1 text-sm">
  {Array.from({ length: totalPages }, (_, i) => i + 1)
    .slice(
      Math.max(currentPage - 2, 0),
      Math.min(currentPage + 1, totalPages)
    )
    .map((page) => (
      <p
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`cursor-pointer px-2 py-1 rounded-md ${
          page === currentPage
            ? "!text-white bg-[#B92825]"
            : "text-gray-700"
        }`}
      >
        {page}
      </p>
    ))}

  {/* Ellipsis and Last Page */}
  {currentPage + 1 < totalPages && (
    <>
      <p className="px-2">...</p>
      {!Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(
          Math.max(currentPage - 2, 0),
          Math.min(currentPage + 1, totalPages)
        )
        .includes(totalPages) && (
        <p
          className="cursor-pointer px-2 py-1 text-gray-700 hover:bg-gray-100 rounded-md"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </p>
      )}
    </>
  )}
</div>


                    {/* Next Button */}
                    <button
                    className="pagination-button"
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    >
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="chevron-right"
                        className="svg-inline--fa fa-chevron-right"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                    >
                        <path
                        fill="currentColor"
                        d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                        />
                    </svg>
                    </button>
                </div>
                </div>
            </div>
        </div>


        
    </section>
    </>
  );
};

export default DistributorTable;
