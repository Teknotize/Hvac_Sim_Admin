import PageHeader from "../components/layout/PageHeader";
import CsvFileIcon from "../assets/images/icon-file-csv.png";
import FileLockIcon from "../assets/images/logo-filelock.png";
import CombustionIcon from "../assets/images/icon-combustion.png";
import RefrigerantIcon from "../assets/images/icon-refrigerant.png";
import {
  Button,
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { DialogDeleteIcon, DownloadIcon } from "../components/svg/icons";
// import ToastButtons from "../components/toast/toastTesting";
import { useEffect, useState } from "react";

import useToastStore from "../store/useToastStore";
import {
  updateBadge,
  getAllSubCategoriesWithBadges,
  deleteBadge,
} from "../api/AppData";
import Loader from "../components/loader";

interface SubCategory {
  _id: string;
  name: string;
  subcategories: Badge[];
}

interface Badge {
  _id: string;
  name: string;
  is_locked: boolean;
}

export default function AppData() {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>("");
  const [isDeleteItemConfirmation, setIsDeleteItemConfirmation] =
    useState(false);
  const combustionSubcategories = subcategories.filter(
    (sub) => sub.name.toLowerCase() === "combustion"
  );
  const refrigerantSubcategories = subcategories.filter(
    (sub) => sub.name.toLowerCase() === "refrigerant"
  );

  const handleEnableDisable = async (id: string, is_locked: boolean) => {
    try {
      const response = await updateBadge(id, is_locked);
      if (response.status === 200) {
        setRefreshFlag((prev) => !prev);
        showToast(
          response.message || "Status updated successfully!",
          "success"
        );
      } else {
        showToast(response.message || "Failed to update status", "error");
      }
    } catch (error: any) {
      showToast(error.message || "Error updating status", "error");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteBadge(id);
      if (response.status === 200) {
        setRefreshFlag((prev) => !prev);
        setIsDeleteItemConfirmation(false);
        showToast("Badge deleted successfully!", "success");
      } else {
        throw new Error(response.message || "Failed to delete badge");
      }
    } catch (error: any) {
      showToast(error.message || "Error deleting badge", "error");
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchSubCategories = async () => {
      try {
        const res = await getAllSubCategoriesWithBadges();
        setSubcategories(res.data);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [refreshFlag]);

  return (
    <>
      {/* <ToastButtons /> */}
      <PageHeader
        title="Templates"
        route="app-data"
        setRefreshFlag={setRefreshFlag}
      />
      <div className="flex gap-6 flex-wrap mb-20">
        <div className="fileDownloadDv">
          <a
            href="/files/com-Condition 00 no flame.csv"
            download
            className="downloadBtn flex items-center justify-center"
          >
            <DownloadIcon />
          </a>
          <div className="iconDv">
            <img src={CsvFileIcon} alt="CSV File" />
          </div>
          <div className="templateInfo">
            <figure>
              <img src={CombustionIcon} alt="Combustion" />
            </figure>
            <h3>Combustion</h3>
            <p>
              Last Updated: <strong>Jan 15, 2025</strong>
            </p>
          </div>
        </div>

        <div className="fileDownloadDv">
          <a
            href="/files/ref-Condition 02.csv"
            download
            className="downloadBtn flex items-center justify-center"
          >
            <DownloadIcon />
          </a>
          <div className="iconDv">
            <img src={CsvFileIcon} alt="CSV File" />
          </div>
          <div className="templateInfo">
            <figure>
              <img src={RefrigerantIcon} alt="Refrigerant" />
            </figure>
            <h3>Refrigerant</h3>
            <p>
              Last Updated: <strong>Jan 15, 2025</strong>
            </p>
          </div>
        </div>
      </div>
      {loading ? (
        <Loader size="xl" />
      ) : (
        <>
          <div className="page-header">
            <div className="flex items-center">
              <div className="flex-1">
                <h1 className="page-title">Combustion Data</h1>
              </div>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap mb-20">
            {/* <div className="fileDownloadDv locked">
              <span className="fileLockIcon">
                <img src={FileLockIcon} alt="File Lock" />
              </span>
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
                      <p>Delete</p>
                    </Link>
                  </div>
                </PopoverPanel>
              </Popover>
              <div className="iconDv">
                <img src={CsvFileIcon} alt="CSV File" />
              </div>
              <h3>No Flame</h3>
            </div> */}
            {combustionSubcategories.map((sub) =>
              sub?.subcategories.map((subcat) => (
                <div
                  key={subcat._id}
                  className={`fileDownloadDv  ${subcat.is_locked && "locked"}`}
                >
                  {subcat.is_locked && (
                    <span className="fileLockIcon">
                      <img src={FileLockIcon} alt="File Lock" />
                    </span>
                  )}
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
                        {subcat.is_locked ? (
                          <Link
                            to={""}
                            className="action-menu-item"
                            onClick={() =>
                              handleEnableDisable(subcat._id, false)
                            }
                          >
                            <p>Unlock</p>
                          </Link>
                        ) : (
                          <Link
                            to={""}
                            className="action-menu-item"
                            onClick={() =>
                              handleEnableDisable(subcat._id, true)
                            }
                          >
                            <p>Lock</p>
                          </Link>
                        )}

                        <Link
                          to={""}
                          className="action-menu-item"
                          onClick={() => {
                            setSelectedBadgeId(subcat._id);
                            setIsDeleteItemConfirmation(true);
                          }}
                        >
                          <p>Delete</p>
                        </Link>
                      </div>
                    </PopoverPanel>
                  </Popover>
                  <div
                    className={`iconDv ${
                      subcat.is_locked ? "grayscale-100" : ""
                    }`}
                  >
                    <img src={CsvFileIcon} alt="CSV File" />
                  </div>
                  <h3>{subcat?.name}</h3>
                </div>
              ))
            )}
          </div>
          <div className="page-header">
            <div className="flex items-center">
              <div className="flex-1">
                <h1 className="page-title">Refrigerant Data</h1>
              </div>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            {/* <div className="fileDownloadDv locked">
              <span className="fileLockIcon">
                <img src={FileLockIcon} alt="File Lock" />
              </span>
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
                      <p>Delete</p>
                    </Link>
                  </div>
                </PopoverPanel>
              </Popover>
              <div className="iconDv">
                <img src={CsvFileIcon} alt="CSV File" />
              </div>
              <h3>No Flame</h3>
            </div> */}
            {refrigerantSubcategories?.map((sub) =>
              sub?.subcategories?.map((subcat) => (
                <div
                  key={subcat._id}
                  className={`fileDownloadDv  ${subcat.is_locked && "locked"}`}
                >
                  {subcat.is_locked && (
                    <span className="fileLockIcon">
                      <img src={FileLockIcon} alt="File Lock" />
                    </span>
                  )}
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
                        {subcat.is_locked ? (
                          <Link
                            to={""}
                            className="action-menu-item"
                            onClick={() =>
                              handleEnableDisable(subcat._id, false)
                            }
                          >
                            <p>Unlock</p>
                          </Link>
                        ) : (
                          <Link
                            to={""}
                            className="action-menu-item"
                            onClick={() =>
                              handleEnableDisable(subcat._id, true)
                            }
                          >
                            <p>Lock</p>
                          </Link>
                        )}

                        <Link
                          to={""}
                          className="action-menu-item"
                          onClick={() => {
                            setSelectedBadgeId(subcat._id);
                            setIsDeleteItemConfirmation(true);
                          }}
                        >
                          <p>Delete</p>
                        </Link>
                      </div>
                    </PopoverPanel>
                  </Popover>
                  <div
                    className={`iconDv ${
                      subcat.is_locked ? "grayscale-100" : ""
                    }`}
                  >
                    <img src={CsvFileIcon} alt="CSV File" />
                  </div>
                  <h3>{subcat.name}</h3>
                </div>
              ))
            )}

            {/* <div className="fileDownloadDv">
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
              <div className="iconDv">
                <img src={CsvFileIcon} alt="CSV File" />
              </div>
              <h3>PDF Manual</h3>
            </div> */}
          </div>{" "}
        </>
      )}

      <Dialog
        open={isDeleteItemConfirmation}
        onClose={() => setIsDeleteItemConfirmation(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/40 dialog-item dialog-notification dialog-email-success">
          <DialogPanel className="max-w-full w-xl space-y-4 border bg-white p-6 rounded-xl dialog-panel">
            <div className="dialog-body">
              <Button
                className="closeBtn"
                onClick={() => setIsDeleteItemConfirmation(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>

              <div className="icon">
                <DialogDeleteIcon />
              </div>
              <h3>Confirm Deletion?</h3>
              <p>
                Before you proceed, double-check your decision to delete. This
                action cannot be undone, and you may lose important data
                permanently.
              </p>

              <div className="btn-row">
                <Button
                  className="btn btn-primary-outline"
                  onClick={() => setIsDeleteItemConfirmation(false)}
                >
                  Not Now
                </Button>
                <Button
                  className="btn btn-primary"
                  onClick={() => handleDelete(selectedBadgeId)}
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
