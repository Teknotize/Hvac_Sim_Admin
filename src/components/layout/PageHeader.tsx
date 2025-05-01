import { Fragment, useEffect, useState } from "react";
import { Button, Checkbox } from "@headlessui/react";
import { FilterIcon } from "../../components/svg/icons";
import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faChevronDown,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

import { DateRangePicker, Range } from "react-date-range";
import { tags, defaultDate } from "../../utils/constants";
import { Dialog, DialogPanel } from "@headlessui/react";

import useToastStore from "../../store/useToastStore";
import { createBadgeWithCSV } from "../../api/AppData";
import { Link } from "react-router-dom";

export default function PageHeader({
  title,
  route,
  onSendEmailClick,
  onSearchChange,
  showEmail,
  onAddNewPdfClick,
  onTagsFilterChange,
  clearFilter,
  dateSelectedCallback,
  setRefreshFlag,
}: {
  title: string;
  route?: string;
  onSendEmailClick?: () => void;
  onSearchChange?: (value: string) => void;
  onAddNewPdfClick?: () => void;
  setRefreshFlag?: any;
  showEmail?: boolean;
  onTagsFilterChange?: (filters: {
    tags: string[];
    // ; dateRange: Range[]
  }) => void;
  clearFilter?: () => void;
  dateSelectedCallback?: (startDate: Date, endDate: Date) => void;
}) {
  const [filterActive, setFilterActive] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToastStore();
  const [formData, setFormData] = useState({
    name: "",
    icon: "https://hvac-project-teknotize.s3.ap-south-1.amazonaws.com/noflame_new",
    is_locked: false,
    unlock_condition: "Unlock with Fingerprint",
    type: "Conditional",
    condition_type: "free",
    AppCategory: "Knowledge Evaluator",
    category: "",
  });

  const [selectedTags, setSelectedTags] = useState(
    tags.map((tag) => ({ ...tag, checked: false }))
  );
  const handleResetTags = () => {
    setSelectedTags(tags.map((tag) => ({ ...tag, checked: false })));
    setFiltersApplied(false);
  };

  const handleResetDate = () => {
    setDateState([defaultDate]);
    setDateChanged(false);
  };

  const handleResetAll = () => {
    handleResetTags();
    handleResetDate();
    clearFilter?.();
    setDateState([defaultDate]);
    setFilterCount(0);
    setFiltersApplied(false);
  };

  const [datSstate, setDateState] = useState<Range[]>([defaultDate]);
  const handleApplyFilters = () => {
    const selectedTagNames = selectedTags
      .filter((tag) => tag.checked)
      .map((tag) => tag.name);

    onTagsFilterChange?.({
      tags: selectedTagNames,
    });
    setFiltersApplied(true);
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
      if (
        startDate &&
        endDate &&
        startDate.toDateString() !== endDate.toDateString()
      ) {
        setDateChanged(true);
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
      prev.map((tag) => (tag.id === id ? { ...tag, checked } : tag))
    );
  };

  const handleFileUpload = (category: string) => {
    setSelectedCategory(category);
    setFormData((prev) => ({
      ...prev,
      category: category,
    }));
    setIsFileUploadOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(""); // Reset error message
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension !== "csv") {
        setFileError("Please select a CSV file only");
        setSelectedFile(null);
        e.target.value = ""; // Clear the file input
        return;
      }

      setSelectedFile(file);
      // Remove .csv extension from the name
      const fileNameWithoutExtension = file.name.replace(".csv", "");
      setFormData((prev) => ({
        ...prev,
        name: fileNameWithoutExtension,
      }));
    }
  };

  const handleUploadSubmit = async (e: any) => {
    if (selectedFile) {
      // Validate required fields
      if (
        !formData.name ||
        !formData.icon ||
        !formData.unlock_condition ||
        !formData.type ||
        !formData.category ||
        !formData.AppCategory ||
        !formData.category
      ) {
        setFileError("All fields are required");
        return;
      }

      try {
        e.preventDefault();
        setIsUploading(true);

        const result = await createBadgeWithCSV(formData, selectedFile);
        setRefreshFlag((prev: any) => !prev); // Trigger refresh in parent component
        showToast(result.message || "File uploaded successfully!", "success");

        // Close dialog and reset state
        setIsFileUploadOpen(false);
        setSelectedFile(null);
        setSelectedCategory("");
        setFormData({
          name: "",
          icon: "https://hvac-project-teknotize.s3.ap-south-1.amazonaws.com/noflame_new",
          is_locked: false,
          unlock_condition: "Unlock with Fingerprint",
          type: "Conditional",
          condition_type: "free",
          AppCategory: "Knowledge Evaluator",
          category: "",
        });
      } catch (error) {
        setFileError("Error uploading file. Please try again.");
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="page-header">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="page-title">{title}</h1>
        </div>
        {route === "contacts" && (
          <div className="filterArea">
            {showEmail && (
              <Button
                className="btn btn-primary"
                onClick={() => {
                  onSendEmailClick?.();
                }}
              >
                Send Email
              </Button>
            )}
            {!filterActive && (
              <>
                <Field className="search-field">
                  <FontAwesomeIcon icon={faSearch} />
                  <Input as={Fragment}>
                    {({ focus, hover }) => (
                      <input
                        name="search"
                        placeholder="Search"
                        className={clsx(
                          focus && "itemfocus",
                          hover && "itemhover"
                        )}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                      />
                    )}
                  </Input>
                </Field>
              </>
            )}

            {filterActive && (
              <>
                <div className="filters">
                  <div className="filter-item">
                    <>
                      <Popover className="action-drop">
                        {({ close }) => (
                          <>
                            <PopoverButton
                              className={clsx(
                                "block btn btn-outline-grey icon-end",
                                dateChanged && "active"
                              )}
                            >
                              <span>
                                Date <FontAwesomeIcon icon={faChevronDown} />
                              </span>
                              <span className="active">
                                {datSstate[0]?.startDate?.toLocaleDateString()}{" "}
                                - {datSstate[0]?.endDate?.toLocaleDateString()}
                                <FontAwesomeIcon
                                  onClick={handleResetDate}
                                  icon={faXmark}
                                />
                              </span>
                            </PopoverButton>

                            <PopoverPanel
                              transition
                              anchor="bottom end"
                              className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                            >
                              <DateRangePicker
                                onChange={(item) => {
                                  setDateState([item.selection]);
                                }}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                ranges={datSstate}
                                direction="horizontal"
                                rangeColors={["#B92825"]}
                              />

                              <div className="btnRow justify-end">
                                <Button
                                  className="btn btn-link"
                                  onClick={handleResetDate}
                                >
                                  Reset
                                </Button>
                                <Button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    const startDate = datSstate[0]?.startDate;
                                    const endDate = datSstate[0]?.endDate;

                                    if (
                                      startDate instanceof Date &&
                                      endDate instanceof Date
                                    ) {
                                      dateSelectedCallback?.(
                                        startDate,
                                        endDate
                                      );
                                      setFilterCount(
                                        (prevCount) => prevCount + 1
                                      );

                                      close(); // Close dropdown
                                    }
                                  }}
                                  disabled={!dateChanged}
                                >
                                  Apply
                                </Button>
                              </div>
                            </PopoverPanel>
                          </>
                        )}
                      </Popover>
                    </>

                    <Popover className="action-drop">
                      {({ close }) => (
                        <>
                          <PopoverButton
                            className={`block btn btn-outline-grey icon-end ${
                              selectedTags.filter((tag) => tag.checked).length >
                                0 && "active"
                            }`}
                          >
                            <span>
                              Tags <FontAwesomeIcon icon={faChevronDown} />
                            </span>
                            <span className="active">
                              Tags
                              <b>
                                {selectedTags.filter((tag) => {
                                  return tag.checked;
                                }).length !== 0
                                  ? selectedTags.filter((tag) => {
                                      return tag.checked;
                                    }).length
                                  : ""}
                              </b>
                              {filtersApplied && (
                                <FontAwesomeIcon
                                  onClick={handleResetTags}
                                  icon={faXmark}
                                  className="cursor-pointer"
                                />
                              )}
                            </span>
                          </PopoverButton>
                          <PopoverPanel
                            transition
                            anchor="bottom end"
                            className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                          >
                            <div className="list-menu">
                              <div className="list-group">
                                {selectedTags.map((tag) => (
                                  <div
                                    className="list-group-item"
                                    key={tag.id}
                                    onClick={() =>
                                      handleCheckboxChange(tag.id, !tag.checked)
                                    }
                                  >
                                    <Checkbox
                                      checked={tag.checked}
                                      onChange={(checked) =>
                                        handleCheckboxChange(tag.id, checked)
                                      }
                                      className="group list-checkbox-item data-[checked]:checked"
                                    >
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="opacity-0 group-data-[checked]:opacity-100"
                                      />
                                    </Checkbox>
                                    <span>{tag.name}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="btnRow">
                                <Button
                                  className="btn btn-link flex-1"
                                  onClick={handleResetTags}
                                >
                                  Reset
                                </Button>
                                <Button
                                  className="btn btn-primary flex-1"
                                  onClick={() => {
                                    handleApplyFilters();
                                    close(); // Close dropdown
                                  }}
                                  disabled={selectedTags.every(
                                    (tag) => !tag.checked
                                  )}
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
                </div>
              </>
            )}
            {filterActive && (
              <Button
                disabled={filterCount === 0}
                className="btn btn-link"
                onClick={handleResetAll}
              >
                Clear Filter
              </Button>
            )}

            <Button
              className={`btn icon-start ${
                filterActive ? "btn-primary" : "btn-outline-grey"
              }`}
              onClick={() => {
                setFilterActive(!filterActive);
              }}
            >
              <FilterIcon /> Filter <b>{filterCount > 0 ? filterCount : ""}</b>
            </Button>
          </div>
        )}
        {route === "pdf-manual" && (
          <div className="filterArea">
            <Button
              className="btn btn-primary"
              onClick={() => {
                onAddNewPdfClick?.();
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add New
            </Button>
          </div>
        )}
        {route === "app-data" && (
          <div className="filterArea">
            <Popover className="action-drop">
              <PopoverButton className="block">
                <Button className="btn btn-primary">
                  <FontAwesomeIcon icon={faPlus} /> Add New
                </Button>
              </PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom end"
                className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
              >
                <div className="action-menu">
                  <Link
                    to={""}
                    className="action-menu-item"
                    onClick={() => handleFileUpload("Combustion")}
                  >
                    <p>Combustion</p>
                  </Link>
                  <Link
                    to={""}
                    className="action-menu-item"
                    onClick={() => handleFileUpload("Refrigerant")}
                  >
                    <p>Refrigerant</p>
                  </Link>
                </div>
              </PopoverPanel>
            </Popover>
          </div>
        )}
      </div>

      {/* File Upload Dialog */}
      <Dialog
        open={isFileUploadOpen}
        onClose={() => setIsFileUploadOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/40 dialog-item">
          <DialogPanel className="max-w-full w-xl space-y-4 border bg-white p-6 rounded-xl dialog-panel">
            <div className="dialog-header">
              <h3>Upload {selectedCategory} File</h3>
              <Button
                className="closeBtn"
                onClick={() => {
                  setIsFileUploadOpen(false);
                  setFileError("");
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
            <div className="dialog-body">
              <Field className="fieldDv">
                <Label>CSV File</Label>
                <Input type="file" accept=".csv" onChange={handleFileChange} />
                {fileError && (
                  <p className="text-red-500 text-sm mt-1">{fileError}</p>
                )}
              </Field>
            </div>
            <div className="dialog-footer">
              <Button
                className="btn btn-primary"
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
