import { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Checkbox, Button } from "@headlessui/react";
import {
  ApprovedEmailIcon,
  DialogDeleteIcon,
  DialogueCheckMarkIcon,
} from "../../components/svg/icons";
import { apiClient } from "../../config";
import { useEffect } from "react";
import useCRMStore from "../../store/useCRMStore";
import formatDateTime from "../../utils/DateConversion";
import EmailPopup from "../../components/emailPopup";
import Loader from "../../components/loader";

import {
  deleteContactUserById,
  updateSubscriptionLevel,
} from "../../api/ContactsApi";
import useToastStore from "../../store/useToastStore";

interface CRMUser {
  [key: string]: any;
}
interface TagsFilterData {
  tags: string[];
}
interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export default function Contacts() {
  const [enabled, setEnabled] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const setCRMUsers = useCRMStore((state) => state.setCRMUsers);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const crmUsers = useCRMStore((state) => state.crmUsers);
  const [originalUsers, setOriginalUsers] = useState<CRMUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedUser, setCheckedUser] = useState<CRMUser[]>([]);
  const itemsPerPage = 10;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { showToast } = useToastStore();
  const [showEmail, setShowEmail] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const [isEmailSentSuccess, setIsEmailSentSuccess] = useState(false);

  const [isDeleteItemConfirmation, setIsDeleteItemConfirmation] =
    useState(false);

  const tagColors: any = {
    "app-user": "clr-indigo",
    "contact-us-form": "clr-orange",
    "download-manual": "clr-pink",
    "product-inquiry": "clr-skyblue",
    "product-inquiry1": "clr-darkblue",
    "product-inquiry2": "clr-green",
    "product-inquiry3": "clr-green",
  };

  const getTagColor = (tag: string) => {
    let tagText = tag?.toLowerCase().replace(/\s+/g, "-");
    return tagColors[tagText]; // Default fallback color if tag not found
  };

  useEffect(() => {
    const hasCheckedUser =
      crmUsers.some((user) => user.isChecked) ||
      originalUsers.some((user) => user.isChecked);

    setShowEmail(hasCheckedUser);
  }, [crmUsers, originalUsers]);

  const handleCheckboxChange = (id: string, checked: boolean, type: string) => {
    if (type === "single") {
      const newSelectedIds = new Set(selectedIds);
      if (checked) {
        newSelectedIds.add(id);
      } else {
        newSelectedIds.delete(id);
      }
      setSelectedIds(newSelectedIds);

      // Update the isChecked state for display
      const updatedUsers = crmUsers.map((user) =>
        user._id === id ? { ...user, isChecked: checked } : user
      );
      setCRMUsers(updatedUsers);
    } else {
      // "Select All" for current page
      const newSelectedIds = new Set(selectedIds);
      const currentPageIds = paginatedUsers.map((user) => user._id);
      const allChecked = paginatedUsers.every((user) =>
        selectedIds.has(user._id)
      );

      currentPageIds.forEach((id) => {
        if (allChecked) {
          newSelectedIds.delete(id);
        } else {
          newSelectedIds.add(id);
        }
      });

      setSelectedIds(newSelectedIds);
      setEnabled(!allChecked);

      // Update isChecked for display
      const updatedUsers = crmUsers.map((user) => {
        const shouldCheck = currentPageIds.includes(user._id)
          ? !allChecked
          : user.isChecked;
        return { ...user, isChecked: shouldCheck };
      });
      setCRMUsers(updatedUsers);
    }
  };
  const uncheckAllUsers = () => {
    // Update all users in the main array
    const updatedUsers = crmUsers.map((user) => ({
      ...user,
      isChecked: false,
    }));

    // Update all relevant states
    setCRMUsers(updatedUsers);
    setOriginalUsers((prev) =>
      prev.map((user) => ({ ...user, isChecked: false }))
    ); // Also update originalUsers if needed
    setEnabled(false); // Uncheck the "Select All" checkbox
    setCheckedUser([]); // Clear all checked users
    setSelectedIds(new Set()); // Clear the selected IDs if using Set approach
  };
  const handleDelete = async (userId: any) => {
    try {
      const res = await deleteContactUserById(userId);
      if (res.status !== 200) {
        showToast("Failed to delete user", "error");
        return;
      }

      // First update the refresh flag
      setRefreshFlag((prev) => !prev);

      // Then show success message
      showToast(res.message || "User deleted successfully", "success");
      setIsDeleteItemConfirmation(false);

      // After successful deletion, reapply current filters
      const filteredUsers = filterUsers(
        originalUsers.filter((user) => user._id !== userId), // Remove deleted user from original data
        "",
        activeTags,
        currentDateRange.startDate?.toISOString(),
        currentDateRange.endDate?.toISOString()
      );
      setCRMUsers(filteredUsers);
      setOriginalUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/admin/get-crm-users");
        const users = response.data.map((user: any) => ({
          ...user,
          isChecked: false,
        }));
        setOriginalUsers(users);

        // After fetching new data, reapply current filters
        const filteredUsers = filterUsers(
          users,
          "",
          activeTags,
          currentDateRange.startDate?.toISOString(),
          currentDateRange.endDate?.toISOString()
        );
        setCRMUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching CRM users:", error);
        showToast("Error fetching users", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setCRMUsers, refreshFlag]);

  useEffect(() => {
    setCheckedUser(crmUsers.filter((user) => selectedIds.has(user._id)));
  }, [selectedIds, crmUsers, reRun]);
  const filterUsers = (
    users: CRMUser[],
    searchTerm: string,
    tags: string[],
    startDate?: string,
    endDate?: string
  ) => {
    let filteredUsers = [...users];

    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term) ||
          user.business?.toLowerCase().includes(term)
      );
    }

    // Apply tags filter if tags exist
    if (tags.length > 0) {
      filteredUsers = filteredUsers.filter((user) => {
        if (typeof user.tags === "string") {
          return tags.some(
            (tag) =>
              String(user.tags).toLowerCase() === String(tag).toLowerCase()
          );
        }
        return false;
      });
    }

    // Apply date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);

      filteredUsers = filteredUsers.filter((user) => {
        const userDate = new Date(user.createdAt).getTime();
        return userDate >= start && userDate <= end;
      });
    }

    return filteredUsers.map((user) => ({
      ...user,
      isChecked: selectedIds.has(user._id),
    }));
  };

  const handleDateFilterChange = (startDate: Date, endDate: Date) => {
    // Update date range state
    setCurrentDateRange({
      startDate,
      endDate,
    });

    // Apply both date and tags filters together
    const filteredUsers = filterUsers(
      originalUsers,
      "",
      activeTags,
      startDate.toISOString(),
      endDate.toISOString()
    );
    setCRMUsers(filteredUsers);
    setCurrentPage(1);
  };

  const handleTagsFilterChange = (data: TagsFilterData) => {
    const tags = data.tags;
    setActiveTags(tags);

    // Apply both date and tags filters together
    const filteredUsers = filterUsers(
      originalUsers,
      "",
      tags,
      currentDateRange.startDate?.toISOString(),
      currentDateRange.endDate?.toISOString()
    );
    setCRMUsers(filteredUsers);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    const filteredUsers = filterUsers(originalUsers, value, activeTags);
    setCRMUsers(filteredUsers);
    setCurrentPage(1);
  };

  const handleToggleSubscription = async (id: string) => {
    try {
      await updateSubscriptionLevel(id);
      setRefreshFlag(!refreshFlag);
      showToast("Subscription level updated successfully", "success");
    } catch (error) {
      console.error("Failed to update subscription level:", error);
      showToast("Failed to update subscription level", "error");
    }
  };

  const totalPages = Math.ceil(crmUsers.length / itemsPerPage);
  const paginatedUsers = crmUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log("paginatedUsers", paginatedUsers);
  useEffect(() => {
    const allChecked =
      paginatedUsers.length > 0 &&
      paginatedUsers.every((user) => selectedIds.has(user._id));
    setEnabled(allChecked);
  }, [paginatedUsers, selectedIds]);
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleClearFilters = () => {
    setCRMUsers(originalUsers);
    setActiveTags([]);
    setCurrentDateRange({
      startDate: null,
      endDate: null,
    });
    setCurrentPage(1);
    setSelectedIds(new Set());
    setEnabled(false);
  };

  // Add new function to handle clearing individual filters
  const handleClearIndividualFilter = (filterType: "date" | "tags") => {
    if (filterType === "date") {
      // Clear only date filter
      setCurrentDateRange({
        startDate: null,
        endDate: null,
      });
      // Reapply only tags filter
      const filteredUsers = filterUsers(originalUsers, "", activeTags);
      setCRMUsers(filteredUsers);
    } else if (filterType === "tags") {
      // Clear only tags filter
      setActiveTags([]);
      // Reapply only date filter if it exists
      if (currentDateRange.startDate && currentDateRange.endDate) {
        const filteredUsers = filterUsers(
          originalUsers,
          "",
          [],
          currentDateRange.startDate.toISOString(),
          currentDateRange.endDate.toISOString()
        );
        setCRMUsers(filteredUsers);
      } else {
        // If no date filter, show all data
        setCRMUsers(originalUsers);
      }
    }
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader
        title="Contacts"
        onSearchChange={(value) => handleSearchChange(value)}
        route="contacts"
        onSendEmailClick={() => setShowEmailPopup(true)}
        showEmail={showEmail}
        onTagsFilterChange={(data) => handleTagsFilterChange(data)}
        clearFilter={() => handleClearFilters()}
        dateSelectedCallback={handleDateFilterChange}
        onClearIndividualFilter={handleClearIndividualFilter}
      />
      {!loading ? (
        <div className="table-container table-contacts-page">
          <div className="table-wrapper">
            <div className="table-header">
              <div className="table-row">
                <div className="table-cell cell-checkbox">
                  <Checkbox
                    checked={enabled}
                    onChange={() => {
                      handleCheckboxChange("123", enabled, "all");
                      setEnabled(!enabled);
                    }}
                    className="group table-checkbox-item data-[checked]:checked"
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="opacity-0 group-data-[checked]:opacity-100"
                    />
                  </Checkbox>
                </div>
                <div className="table-cell cell-user">Name</div>
                <div className="table-cell cell-phone">Phone</div>
                <div className="table-cell cell-email">Email</div>
                <div className="table-cell cell-business">Business</div>
                <div className="table-cell cell-tags">Tags</div>
                <div className="table-cell cell-date">Date</div>
                <div className="table-cell cell-action">Action</div>
              </div>
            </div>
            <div className="table-body">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((contact) => (
                  <div className="table-row" key={contact._id}>
                    <div className="table-cell cell-checkbox">
                      <Checkbox
                        checked={contact.isChecked}
                        onChange={(checked) =>
                          handleCheckboxChange(contact._id, checked, "single")
                        }
                        className="group table-checkbox-item data-[checked]:checked"
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="opacity-0 group-data-[checked]:opacity-100"
                        />
                      </Checkbox>
                    </div>
                    <div className="table-cell cell-user">
                      <div
                        className={`user-dp-card type0${
                          Math.floor(Math.random() * 3) + 1
                        }`}
                      >
                        <figure>
                          <span>{contact?.name?.charAt(0)}</span>
                        </figure>
                        <span>{contact.name}</span>
                      </div>
                    </div>
                    <div className="table-cell cell-phone">
                      <p>{contact.phone || "N/A"}</p>
                    </div>
                    <div className="table-cell cell-email">
                      <p className="email-item">
                        {contact.tags === "mobile user" && (
                          <ApprovedEmailIcon />
                        )}{" "}
                        <span>{contact.email}</span>
                      </p>
                    </div>
                    <div className="table-cell cell-business">
                      <p>{contact.business || "N/A"}</p>
                    </div>
                    <div className="table-cell cell-tags">
                      <span className="flex flex-col gap-1">
                        <p className="subscription">
                          {contact.subscriptionLevel && (
                            <span
                              key={contact.subscriptionLevel}
                              className="capitalize"
                            >
                              {contact.subscriptionLevel === "admin-paid"
                                ? "Paid"
                                : contact.subscriptionLevel}
                            </span>
                          )}
                        </p>
                        <p className="tags">
                          <div className="flex flex-col gap-1">
                            {" "}
                            {contact.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className={`${getTagColor(
                                  tag
                                )} capitalize px-2 py-1 rounded-full mr-2`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </p>
                      </span>
                    </div>
                    <div className="table-cell cell-date">
                      <p className="date">
                        {formatDateTime(contact.createdAt).date}{" "}
                        <span className="time">
                          {formatDateTime(contact.createdAt).time}
                        </span>
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
                            {/* <a
                              href="javascript:void(0)"
                              onClick={() => {
                                setIsEditContactItem(true);
                              }}
                              className="action-menu-item"
                            >
                              <p>Edit</p>
                            </a> */}
                            <span
                              onClick={() => {
                                setSelectedUserId(contact._id);
                                setIsDeleteItemConfirmation(true);
                              }}
                              className="action-menu-item cursor-pointer"
                            >
                              <p>Delete</p>
                            </span>
                            {contact.subscriptionLevel && (
                              <>
                                {contact.subscriptionLevel === "free" ? (
                                  <span
                                    onClick={() =>
                                      handleToggleSubscription(contact._id)
                                    }
                                    className="action-menu-item cursor-pointer"
                                  >
                                    <p>Mark As Paid</p>
                                  </span>
                                ) : contact.subscriptionLevel ===
                                  "admin-paid" ? (
                                  <span
                                    onClick={() =>
                                      handleToggleSubscription(contact._id)
                                    }
                                    className="action-menu-item cursor-pointer"
                                  >
                                    <p>Mark As Free</p>
                                  </span>
                                ) : null}
                              </>
                            )}
                          </div>
                        </PopoverPanel>
                      </Popover>
                    </div>
                  </div>
                ))
              ) : (
                <div className="noData">
                  <p>No data found</p>
                </div>
              )}
            </div>
          </div>
          <div className="table-footer">
            <div className="table-row">
              <div className="table-cell pagination-cell">
                <p className="pagination-info" style={{ marginRight: "20px" }}>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, crmUsers.length)} of{" "}
                  {crmUsers.length} records
                </p>

                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <div className="pagination-numbers">
                    {totalPages <= 5 ? (
                      // Show all pages if 5 or fewer
                      Array.from({ length: totalPages }, (_, i) => (
                        <p
                          key={i + 1}
                          className={currentPage === i + 1 ? "active" : ""}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </p>
                      ))
                    ) : (
                      // Smart pagination for more than 5 pages
                      <>
                        {/* Always show first page */}
                        <p
                          className={currentPage === 1 ? "active" : ""}
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </p>

                        {/* Show left ellipsis if needed */}
                        {currentPage > 3 && <p>...</p>}

                        {/* Show middle pages */}
                        {(() => {
                          let start, end;

                          if (currentPage <= 3) {
                            // Near start: show 2, 3, 4
                            start = 2;
                            end = 4;
                          } else if (currentPage >= totalPages - 2) {
                            // Near end: show n-3, n-2, n-1
                            start = totalPages - 3;
                            end = totalPages - 1;
                          } else {
                            // Middle: show current-1, current, current+1
                            start = currentPage - 1;
                            end = currentPage + 1;
                          }

                          const pages = [];
                          for (let i = start; i <= end; i++) {
                            pages.push(
                              <p
                                key={i}
                                className={currentPage === i ? "active" : ""}
                                onClick={() => handlePageChange(i)}
                              >
                                {i}
                              </p>
                            );
                          }
                          return pages;
                        })()}

                        {/* Show right ellipsis if needed */}
                        {currentPage < totalPages - 2 && <p>...</p>}

                        {/* Always show last page */}
                        <p
                          className={currentPage === totalPages ? "active" : ""}
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </p>
                      </>
                    )}
                  </div>

                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader size="xl" />
        </div>
      )}
      <EmailPopup
        isOpen={showEmailPopup}
        recipients={checkedUser}
        onClose={() => {
          setShowEmailPopup(false);
          setReRun(!reRun);
          uncheckAllUsers();
        }}
        onSuccess={() => setIsEmailSentSuccess(true)}
      />
      {/* <Dialog
        open={isEditContactItem}
        onClose={() => setIsEditContactItem(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/40 dialog-item dialog-item-edit-contact">
          <DialogPanel className="max-w-full w-4xl space-y-4 border bg-white p-6 rounded-xl dialog-panel">
            <div className="dialog-header">
              <h3>Edit Contact</h3>
              <Button
                className="closeBtn"
                onClick={() => setIsEditContactItem(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
            <div className="dialog-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field className="fieldDv">
                    <Label>Name</Label>
                    <Input
                      name="name"
                      placeholder="Enter Name"
                      value={formData.name}
                    />
                  </Field>
                  <Field className="fieldDv">
                    <Label>Phone</Label>
                    <Input
                      name="phone"
                      placeholder="Enter Phone"
                      value={formData.phone}
                    />
                  </Field>
                  <Field className="fieldDv">
                    <Label>Email</Label>
                    <Input
                      name="email"
                      placeholder="Enter Email"
                      value={formData.email}
                    />
                  </Field>
                  <Field className="fieldDv">
                    <Label>Business</Label>
                    <Input
                      name="business"
                      placeholder="Enter Business"
                      value={formData.business}
                    />
                  </Field>
                  <Field className="fieldDv">
                    <Label>Tags</Label>
                    <Input
                      name="tags"
                      placeholder="Enter Tags"
                      value={formData.tags}
                    />
                  </Field>
                </div>
                <div>
                  <Field className="fieldDv">
                    <Label>Date</Label>
                    <Calendar
                      onChange={(item) => setDate(item)}
                      date={date}
                      color={"#B92825"}
                    />
                  </Field>
                </div>
              </div>
            </div>
            <div className="dialog-footer">
              {/* <Button className="btn btn-primary-outline" onClick={() => setIsEditContactItem(false)}>Cancel</Button> */}
      {/* <Button
                className="btn btn-primary"
                onClick={() => setIsEditContactItem(false)}
              >
                Save Changes
              </Button> */}
      {/* </div>
          </DialogPanel>
        </div>
      </Dialog> */}{" "}
      <Dialog
        open={isEmailSentSuccess}
        onClose={() => setIsEmailSentSuccess(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/40 dialog-item dialog-notification dialog-email-success">
          <DialogPanel className="max-w-full w-xl space-y-4 border bg-white p-6 rounded-xl dialog-panel">
            <div className="dialog-body">
              <Button
                className="closeBtn"
                onClick={() => setIsEmailSentSuccess(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>

              <div className="icon">
                <DialogueCheckMarkIcon />
              </div>
              <h3>Successfully Sent Email</h3>
              <p>
                Your email has been successfully delivered to the recipient.
                Please check your "Sent" folder for confirmation or await a
                response.
              </p>

              <div className="btn-row">
                <Button
                  className="btn btn-primary"
                  onClick={() => setIsEmailSentSuccess(false)}
                >
                  Okay, Great!
                </Button>
              </div>
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
                  onClick={() => handleDelete(selectedUserId)}
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
