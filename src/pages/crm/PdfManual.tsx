import { useEffect, useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import { DialogDeleteIcon, PdfManualIcon } from "../../components/svg/icons";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Button, Field, Input, Label, Checkbox } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileLockIcon from "../../assets/images/logo-filelock.png";
import {
  faEllipsisVertical,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  addPdfManuals,
  deletePdfManuals,
  getPdfManuals,
  updatePdfManual,
  updatePdfManualStatus,
} from "../../api/PdfManualApi";

import Loader from "../../components/loader";
import useToastStore from "../../store/useToastStore";

export default function PdfManual() {
  const [manuals, setManuals] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const { showToast } = useToastStore();
  const [isAddNewPdfOpen, setIsAddNewPdfOpen] = useState(false);
  const [isEditPdfManualOpen, setIsEditPdfManualOpen] = useState(false);
  const [formData, setFormData] = useState({
    manual_name: "",
    view_link: "",
    download_link: "",
    status: false,
  });

  const [isDeleteItemConfirmation, setIsDeleteItemConfirmation] =
    useState(false);
  const [selectedManaualId, setselectedManaualId] = useState<string>("");
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddManual = async () => {
    const { manual_name, view_link, download_link } = formData;

    if (!manual_name || !view_link || !download_link) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      if (isEditPdfManualOpen && selectedManaualId) {
        await updatePdfManual(selectedManaualId, formData);
        showToast("PDF Manual updated successfully", "success");
      } else {
        await addPdfManuals(formData);
        showToast("PDF Manual added successfully", "success");
      }

      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error("Error submitting manual:", error);
      showToast("Failed to submit manual", "error");
    } finally {
      setIsAddNewPdfOpen(false);
      setIsEditPdfManualOpen(false);
      setFormData({
        manual_name: "",
        view_link: "",
        download_link: "",
        status: false,
      });
      setselectedManaualId("");
    }
  };

  const handleDeleteManual = async (id: any) => {
    try {
      await deletePdfManuals(id);
      showToast("PDF Manual deleted successfully", "success");
      setRefreshFlag(!refreshFlag);
      setIsDeleteItemConfirmation(false);
      setselectedManaualId("");
    } catch (error) {
      console.error("Error deleting manual:", error);
    }
  };
  const handleUpdateStatus = async (id: string, status: boolean) => {
    try {
      const updated = await updatePdfManualStatus(id, status);

      if (updated.status === true) {
        showToast("PDF Manual unlocked successfully", "success");
      } else {
        showToast("PDF Manual locked successfully", "success");
      }

      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error("Error updating manual status:", error);
      showToast("Failed to update manual status", "error");
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchManuals = async () => {
      try {
        const data = await getPdfManuals();
        setManuals(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch manuals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManuals();
  }, [refreshFlag]);
  return (
    <>
      <PageHeader
        title="PDF Manual"
        route="pdf-manual"
        onAddNewPdfClick={() => setIsAddNewPdfOpen(true)}
      />
      {loading ? (
        <Loader size="xl" />
      ) : (
        <div className="flex gap-6 flex-wrap">
          {manuals.map((manual: any, index: number) => {
            return (
              <div
                key={index}
                className={`fileDownloadDv ${!manual.status && "locked"} `}
              >
                {!manual?.status && (
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
                      {manual.status ? (
                        <Link
                          onClick={() => handleUpdateStatus(manual._id, false)}
                          to={""}
                          className="action-menu-item"
                        >
                          <p>Disable</p>
                        </Link>
                      ) : (
                        <Link
                          onClick={() => handleUpdateStatus(manual._id, true)}
                          className="action-menu-item"
                          to={""}
                        >
                          <p>Enable</p>
                        </Link>
                      )}

                      <Link
                        to={""}
                        className="action-menu-item"
                        onClick={() => {
                          setselectedManaualId(manual._id);
                          setIsEditPdfManualOpen(true);
                          setFormData(manual);
                        }}
                      >
                        <p>Edit</p>
                      </Link>
                      <Link
                        to={""}
                        className="action-menu-item"
                        onClick={() => {
                          setselectedManaualId(manual._id);
                          setIsDeleteItemConfirmation(true);
                        }}
                      >
                        <p>Delete</p>
                      </Link>
                    </div>
                  </PopoverPanel>
                </Popover>
                <div
                  className={`iconDv ${manual?.status ? "" : "grayscale-100"}`}
                >
                  <PdfManualIcon />
                </div>
                <h3>{manual?.manual_name}</h3>
              </div>
            );
          })}

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
            <div className="iconDv">
              <PdfManualIcon />
            </div>
            <h3>PDF Manual</h3>
          </div>
        </div>
      )}

      <Dialog
        open={isAddNewPdfOpen}
        onClose={() => {
          setIsAddNewPdfOpen(false);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/40 dialog-item dialog-item-add-new-pdf">
          <DialogPanel className="max-w-full w-4xl space-y-4 border bg-white p-6 rounded-xl dialog-panel">
            <div className="dialog-header">
              <h3>Add PDF Manual</h3>
              <Button
                className="closeBtn"
                onClick={() => {
                  setFormData({
                    manual_name: "",
                    view_link: "",
                    download_link: "",
                    status: false,
                  });
                  setIsAddNewPdfOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
            <div className="dialog-body">
              <div className="grid grid-cols-2 gap-4">
                <Field className="fieldDv">
                  <Label>Manual Name</Label>
                  <Input
                    name="manual_name"
                    placeholder="Enter Manual Name"
                    value={formData.manual_name}
                    onChange={handleChange}
                  />
                </Field>
                <Field className="fieldDv">
                  <Label>View Link</Label>
                  <Input
                    name="view_link"
                    placeholder="Enter View Link"
                    value={formData.view_link}
                    onChange={handleChange}
                  />
                </Field>
                <Field className="fieldDv">
                  <Label>Download Link</Label>
                  <Input
                    name="download_link"
                    placeholder="Enter Download Link"
                    value={formData.download_link}
                    onChange={handleChange}
                  />
                </Field>
                <Field className="fieldDv">
                  <Label>Status</Label>
                  <div className="hv-check-group-item">
                    <Checkbox
                      checked={formData.status}
                      onChange={(checked) =>
                        setFormData((prev) => ({ ...prev, status: checked }))
                      }
                      className="group hv-checkbox-item data-[checked]:checked"
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="opacity-0 group-data-[checked]:opacity-100"
                      />
                    </Checkbox>
                    <Label>Enable</Label>
                  </div>
                </Field>
              </div>
            </div>
            <div className="dialog-footer">
              {/* <Button className="btn btn-primary-outline" onClick={() => setIsAddNewPdfOpen(false)}>Cancel</Button> */}
              <Button className="btn btn-primary" onClick={handleAddManual}>
                Save Changes
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog
        open={isEditPdfManualOpen}
        onClose={() => {
          setFormData({
            manual_name: "",
            view_link: "",
            download_link: "",
            status: false,
          });
          setIsEditPdfManualOpen(false);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/40 dialog-item dialog-item-add-new-pdf">
          <DialogPanel className="max-w-full w-4xl space-y-4 border bg-white p-6 rounded-xl dialog-panel">
            <div className="dialog-header">
              <h3>Edit PDF Manual</h3>
              <Button
                className="closeBtn"
                onClick={() => {
                  setFormData({
                    manual_name: "",
                    view_link: "",
                    download_link: "",
                    status: false,
                  });
                  setIsEditPdfManualOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
            <div className="dialog-body">
              <div className="grid grid-cols-2 gap-4">
                <Field className="fieldDv">
                  <Label>Manual Name</Label>
                  <Input
                    name="manual_name"
                    placeholder="Enter Manual Name"
                    value={formData.manual_name}
                    onChange={handleChange}
                  />
                </Field>
                <Field className="fieldDv">
                  <Label>View Link</Label>
                  <Input
                    name="view_link"
                    placeholder="Enter View Link"
                    value={formData.view_link}
                    onChange={handleChange}
                  />
                </Field>
                <Field className="fieldDv">
                  <Label>Download Link</Label>
                  <Input
                    name="download_link"
                    placeholder="Enter Download Link"
                    value={formData.download_link}
                    onChange={handleChange}
                  />
                </Field>
                <Field className="fieldDv">
                  <Label>Status</Label>
                  <div className="hv-check-group-item">
                    <Checkbox
                      checked={formData.status}
                      onChange={(checked) =>
                        setFormData((prev) => ({ ...prev, status: checked }))
                      }
                      className="group hv-checkbox-item data-[checked]:checked"
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="opacity-0 group-data-[checked]:opacity-100"
                      />
                    </Checkbox>
                    <Label>Enable</Label>
                  </div>
                </Field>
              </div>
            </div>
            <div className="dialog-footer">
              {/* <Button className="btn btn-primary-outline" onClick={() => setIsAddNewPdfOpen(false)}>Cancel</Button> */}
              <Button className="btn btn-primary" onClick={handleAddManual}>
                Save Changes
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
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
                  onClick={() => handleDeleteManual(selectedManaualId)}
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
