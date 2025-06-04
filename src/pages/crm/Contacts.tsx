import { useState, useEffect } from "react";
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
  _id: string;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  tags: string[];
  createdAt: string;
  subscriptionLevel?: string;
  isChecked?: boolean;
}

interface TagsFilterData {
  tags: string[];
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface SubscriptionFilterData {
  subscriptionLevels: string[];
}

export default function Contacts() {
  const [enabled, setEnabled] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const setCRMUsers = useCRMStore((state) => state.setCRMUsers);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const crmUsers = useCRMStore((state) => state.crmUsers);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [checkedUser, setCheckedUser] = useState<CRMUser[]>([]);
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
  const [allPagesSelected, setAllPagesSelected] = useState(false);
  const [activeSubscriptionLevels, setActiveSubscriptionLevels] = useState<
    string[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const tagLabelMap: { [key: string]: string } = {
    "contact us": "Contact Us Form",
    workbook: "Download Manual",
    "contact rep": "Product Inquiry",
    app: "App User",
    "mobile user": "Mobile User",
    ghl: "GHL",
    distributor: "Distributor",
    mlc: "MLC",
    "hvac-school": "HVAC School",
  };

  const tagColors: { [key: string]: string } = {
    "app-user": "clr-indigo",
    "contact-us-form": "clr-orange",
    "download-manual": "clr-pink",
    "product-inquiry": "clr-skyblue",
    "product-inquiry1": "clr-darkblue",
    "product-inquiry2": "clr-green",
    "product-inquiry3": "clr-green",
    ghl: "clr-teal",
    distributor: "clr-olive",
    mlc: "clr-violet",
    "hvac-school": "clr-cyan",
    "hvac-excellence": "clr-vividgreen",
  };

  const getTagColor = (tag: string) => {
    const trimmed = tag.trim();
    const tagText = trimmed.toLowerCase().replace(/\s+/g, "-");
    return tagColors[tagText] || "default-color";
  };

  // Normalize tag for comparison
  const normalizeTag = (tag: string) => {
    return tag.toLowerCase().trim();
  };

  // Handle checkbox changes
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

      // Update checkedUser array for email
      const checkedUsers = updatedUsers.filter((user) => user.isChecked);
      setCheckedUser(checkedUsers);
      setShowEmail(checkedUsers.length > 0);
    } else {
      // "Select All" for current page
      const newSelectedIds = new Set(selectedIds);
      const currentPageIds = crmUsers.map((user) => user._id);
      const allChecked = crmUsers.every((user) => selectedIds.has(user._id));

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

      // Update checkedUser array for email
      const checkedUsers = updatedUsers.filter((user) => user.isChecked);
      setCheckedUser(checkedUsers);
      setShowEmail(checkedUsers.length > 0);
    }
  };

  // Handle select all pages
  const handleSelectAllPages = async () => {
    try {
      setLoading(true);
      // Build query parameters for all users
      const queryParams = new URLSearchParams({
        page: "1",
        fetchAll: "true",
      });

      // Add filter parameters if they exist
      if (activeTags.length > 0) {
        queryParams.append("tags", activeTags.join(","));
      }
      if (currentDateRange.startDate) {
        queryParams.append(
          "startDate",
          currentDateRange.startDate.toISOString()
        );
      }
      if (currentDateRange.endDate) {
        queryParams.append("endDate", currentDateRange.endDate.toISOString());
      }
      if (activeSubscriptionLevels.length > 0) {
        activeSubscriptionLevels.forEach((level) => {
          const formattedLevel = level.toLowerCase().replace(/\s+/g, "-");
          queryParams.append("subscriptionLevel", formattedLevel);
        });
      }
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }

      const apiUrl = `/admin/get-crm-users?${queryParams.toString()}`;

      const response = await apiClient.get(apiUrl);
      const { data: allUsers } = response.data;

      if (!allUsers || allUsers.length === 0) {
        showToast("No users found to select", "error");
        return;
      }

      // Map all users for email with proper tag normalization
      const mappedUsers: CRMUser[] = allUsers.map((user: any) => {
        // Ensure tags is always an array
        const userTags = Array.isArray(user.tags)
          ? user.tags
          : typeof user.tags === "string"
          ? [user.tags]
          : [];

        const normalizedTags = userTags.filter(Boolean).map((tag: string) => {
          const normalizedTag = normalizeTag(tag);
          const mappedTag = tagLabelMap[normalizedTag];
          return mappedTag || tag;
        });

        return {
          _id: user._id || "",
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          business: user.business || "",
          tags: normalizedTags,
          createdAt: user.createdAt || new Date().toISOString(),
          subscriptionLevel: user.subscriptionLevel || "",
          isChecked: true,
        };
      });

      // First update the checked users
      setCheckedUser(mappedUsers);

      // Then update other states
      setAllPagesSelected(true);
      setEnabled(true);
      setShowEmail(true);

      // Update selected IDs for all users
      const allUserIds = new Set(mappedUsers.map((user) => user._id));
      setSelectedIds(allUserIds);

      // Update current page users
      const currentPageUsers = crmUsers.map((user) => ({
        ...user,
        isChecked: true,
      }));
      setCRMUsers(currentPageUsers);
    } catch (error: any) {
      console.error("Error selecting all users:", error);
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("Error selecting all users", "error");
      }
      // Reset states on error
      setAllPagesSelected(false);
      setShowEmail(false);
      setCheckedUser([]);
      setSelectedIds(new Set());
      setEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedIds(new Set());
    setAllPagesSelected(false);
    setEnabled(false);
    setCheckedUser([]);
    setShowEmail(false);

    // Update current page users to show unchecked state
    const updatedUsers = crmUsers.map((user) => ({
      ...user,
      isChecked: false,
    }));
    setCRMUsers(updatedUsers);
  };

  // Handle uncheck all users
  const uncheckAllUsers = () => {
    const updatedUsers = crmUsers.map((user) => ({
      ...user,
      isChecked: false,
    }));

    setCRMUsers(updatedUsers);

    setEnabled(false);
    setCheckedUser([]);
    setSelectedIds(new Set());
    setShowEmail(false);
  };

  // Handle delete user
  const handleDelete = async (userId: string | null) => {
    if (!userId) return;

    try {
      const res = await deleteContactUserById(userId);
      if (res.status !== 200) {
        showToast("Failed to delete user", "error");
        return;
      }

      setRefreshFlag((prev) => !prev);
      showToast(res.message || "User deleted successfully", "success");
      setIsDeleteItemConfirmation(false);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Handle toggle subscription
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

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Update checked users when selection changes
  useEffect(() => {
    if (allPagesSelected) {
      return;
    }
    const checkedUsers = crmUsers.filter((user) => user.isChecked);
    setCheckedUser(checkedUsers);
    setShowEmail(checkedUsers.length > 0 || allPagesSelected);
  }, [selectedIds, crmUsers, allPagesSelected]);

  // Add a new effect to handle all pages selection
  useEffect(() => {
    if (allPagesSelected) {
      setShowEmail(true);
    }
  }, [allPagesSelected]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      // Reset selection when changing pages
      setSelectedIds(new Set());
      setEnabled(false);
      setAllPagesSelected(false);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setCurrentPage(1);
    setActiveTags([]);
    setActiveSubscriptionLevels([]);
    setCurrentDateRange({
      startDate: null,
      endDate: null,
    });
    setSelectedIds(new Set());
    setEnabled(false);
    setAllPagesSelected(false);
  };

  // Handle individual filter clear
  const handleClearIndividualFilter = (
    filterType: "date" | "tags" | "subscription"
  ) => {
    if (filterType === "date") {
      setCurrentDateRange({
        startDate: null,
        endDate: null,
      });
    } else if (filterType === "tags") {
      setActiveTags([]);
    } else if (filterType === "subscription") {
      setActiveSubscriptionLevels([]);
    }
    setCurrentPage(1);
    setSelectedIds(new Set());
    setEnabled(false);
    setAllPagesSelected(false);
  };

  // Handle tags filter change
  const handleTagsFilterChange = (data: TagsFilterData) => {
    setActiveTags(data.tags);
    setCurrentPage(1); // Reset to first page when filter changes
    setSelectedIds(new Set());
    setEnabled(false);
    setAllPagesSelected(false);
  };

  // Handle subscription filter change
  const handleSubscriptionFilterChange = (data: SubscriptionFilterData) => {
    setActiveSubscriptionLevels(data.subscriptionLevels);
    setCurrentPage(1); // Reset to first page when filter changes
    setSelectedIds(new Set());
    setEnabled(false);
    setAllPagesSelected(false);
  };

  // Handle date filter change
  const handleDateFilterChange = (startDate: Date, endDate: Date) => {
    setCurrentDateRange({
      startDate,
      endDate,
    });
    setCurrentPage(1); // Reset to first page when filter changes
    setSelectedIds(new Set());
    setEnabled(false);
    setAllPagesSelected(false);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Calculate skip value
        const skip = (currentPage - 1) * itemsPerPage;

        // Build query parameters
        const queryParams = new URLSearchParams({
          page: Math.max(1, currentPage).toString(),
          limit: itemsPerPage.toString(),
          skip: skip.toString(),
        });

        // Add search parameter if it exists
        if (searchQuery && searchQuery.trim() !== "") {
          queryParams.append("search", searchQuery.trim());
        }

        // Add filter parameters if they exist
        if (activeTags.length > 0) {
          queryParams.append("tags", activeTags.join(","));
        }

        // Add date range filter with proper formatting
        if (currentDateRange.startDate) {
          const startDate = new Date(currentDateRange.startDate);
          startDate.setHours(0, 0, 0, 0); // Set to start of day
          queryParams.append("startDate", startDate.toISOString());
        }
        if (currentDateRange.endDate) {
          const endDate = new Date(currentDateRange.endDate);
          endDate.setHours(23, 59, 59, 999); // Set to end of day
          queryParams.append("endDate", endDate.toISOString());
        }

        if (activeSubscriptionLevels.length > 0) {
          activeSubscriptionLevels.forEach((level) => {
            const formattedLevel = level.toLowerCase().replace(/\s+/g, "-");
            queryParams.append("subscriptionLevel", formattedLevel);
          });
        }

        const apiUrl = `/admin/get-crm-users?${queryParams.toString()}`;

        const response = await apiClient.get(apiUrl);

        const { data: users, pagination } = response.data;

        // Map the users data with proper type checking and tag normalization
        const mappedUsers: CRMUser[] = users.map((user: any) => {
          // Ensure tags is always an array
          const userTags = Array.isArray(user.tags)
            ? user.tags
            : typeof user.tags === "string"
            ? [user.tags]
            : [];

          const normalizedTags = userTags.filter(Boolean).map((tag: string) => {
            const normalizedTag = normalizeTag(tag);
            const mappedTag = tagLabelMap[normalizedTag];
            return mappedTag || tag;
          });

          return {
            _id: user._id || "",
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            business: user.business || "",
            tags: normalizedTags,
            createdAt: user.createdAt || new Date().toISOString(),
            subscriptionLevel: user.subscriptionLevel || "",
            isChecked: false,
          };
        });

        setCRMUsers(mappedUsers);

        // Update pagination state using the backend's pagination info

        // Use backend's pagination values directly
        setTotalPages(pagination.totalPages);
        setTotalItems(pagination.totalItems);

        // If current page is greater than total pages, reset to last page
        if (currentPage > pagination.totalPages) {
          setCurrentPage(pagination.totalPages);
        }

        // Log if we're missing records on the last page
        if (
          pagination.isLastPage &&
          mappedUsers.length !== pagination.remainingRecords
        ) {
          console.warn("Last page record count mismatch:", {
            expected: pagination.remainingRecords,
            actual: mappedUsers.length,
            totalItems: pagination.totalItems,
            itemsPerPage: pagination.itemsPerPage,
          });
        }
      } catch (error) {
        console.error("Error fetching CRM users:", error);
        showToast("No matched users", "error");
        // Reset state on error
        setCRMUsers([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    currentPage,
    itemsPerPage,
    activeTags,
    currentDateRange,
    activeSubscriptionLevels,
    refreshFlag,
    searchQuery,
    totalItems,
  ]);

  // Pagination info for display
  const paginationInfo = {
    start: totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
    end: Math.min((currentPage - 1) * itemsPerPage + itemsPerPage, totalItems),
    total: totalItems,
  };

  return (
    <>
      <PageHeader
        title="Contacts"
        onSearchChange={handleSearchChange}
        route="contacts"
        onSendEmailClick={() => {
          if (checkedUser.length > 0) {
            setShowEmailPopup(true);
          } else {
            showToast("Please select at least one user to send email", "error");
          }
        }}
        showEmail={showEmail}
        onTagsFilterChange={handleTagsFilterChange}
        onSubscriptionFilterChange={handleSubscriptionFilterChange}
        clearFilter={handleClearFilters}
        dateSelectedCallback={handleDateFilterChange}
        onClearIndividualFilter={handleClearIndividualFilter}
      />
      {!loading ? (
        <div className="table-container table-contacts-page">
          <div className="table-wrapper">
            <div className="mailsection">
              <div className="masgRow">
                {enabled && !allPagesSelected && (
                  <p className="text-sm">
                    All <strong>{crmUsers.length}</strong> users on this page
                    are selected.{" "}
                    <a
                      href="#"
                      className="text-blue-600 underline"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectAllPages();
                      }}
                    >
                      Select all {totalItems} users
                    </a>
                  </p>
                )}

                {allPagesSelected && (
                  <p className="text-sm">
                    All <strong>{totalItems}</strong> users are selected.{" "}
                    <a
                      href="#"
                      className="text-red-600 underline"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClearSelection();
                      }}
                    >
                      Clear Selection
                    </a>
                  </p>
                )}
              </div>
            </div>
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
                <div className="table-cell cell-business">Subscription</div>
                <div className="table-cell cell-tags">Tags</div>
                <div className="table-cell cell-date">Date</div>
                <div className="table-cell cell-action">Action</div>
              </div>
            </div>
            <div className="table-body">
              {crmUsers.length > 0 ? (
                crmUsers.map((contact) => (
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
                        {contact.tags.includes("Mobile User") && (
                          <ApprovedEmailIcon />
                        )}{" "}
                        <span>{contact.email}</span>
                      </p>
                    </div>
                    <div className="table-cell cell-business">
                      <p>{contact.business || "N/A"}</p>
                    </div>
                    <div className="table-cell cell-business">
                      <p className="subscription">
                        {contact.subscriptionLevel && (
                          <span
                            key={contact.subscriptionLevel}
                            className={`capitalize  ${
                              contact.subscriptionLevel === "admin-paid"
                                ? "bg-[#1943A1]"
                                : "bg-[#1F9E8A]"
                            } `}
                          >
                            {contact.subscriptionLevel === "admin-paid"
                              ? "Admin Paid"
                              : "Free"}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="table-cell cell-tags">
                      <p className="tags">
                        <div className="flex flex-col gap-1">
                          {contact.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className={`${getTagColor(tag)} capitalize`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </p>
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
                                    <p>Mark As Admin Paid</p>
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
                  Showing {paginationInfo.start} to {paginationInfo.end} of{" "}
                  {paginationInfo.total} records
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
                          let start = Math.max(2, currentPage - 1);
                          let end = Math.min(totalPages - 1, currentPage + 1);

                          // Adjust if near start
                          if (currentPage <= 3) {
                            end = 4;
                          }
                          // Adjust if near end
                          if (currentPage >= totalPages - 2) {
                            start = totalPages - 3;
                          }

                          const pages = [];
                          for (let i = start; i <= end; i++) {
                            if (i > 1 && i < totalPages) {
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
                          }
                          return pages;
                        })()}

                        {/* Show right ellipsis if needed */}
                        {currentPage < totalPages - 2 && <p>...</p>}

                        {/* Always show last page */}
                        {totalPages > 1 && (
                          <p
                            className={
                              currentPage === totalPages ? "active" : ""
                            }
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </p>
                        )}
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
          handleClearSelection();
        }}
        onSuccess={() => {
          setIsEmailSentSuccess(true);
          uncheckAllUsers();
          handleClearSelection();
        }}
      />
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
