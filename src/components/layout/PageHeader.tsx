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
import fileIcon from "../../../public/images/file-icon.png";

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
  onClearIndividualFilter,
}: {
  title: string;
  route?: string;
  onSendEmailClick?: () => void;
  onSearchChange?: (value: string) => void;
  onAddNewPdfClick?: () => void;
  setRefreshFlag?: any;
  showEmail?: boolean;
  onTagsFilterChange?: (filters: { tags: string[] }) => void;
  clearFilter?: () => void;
  dateSelectedCallback?: (startDate: Date, endDate: Date) => void;
  onClearIndividualFilter?: (filterType: "date" | "tags") => void;
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
    onClearIndividualFilter?.("tags");
  };

  const handleResetDate = () => {
    setDateState([defaultDate]);
    setDateChanged(false);
    onClearIndividualFilter?.("date");
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
        count += 1;
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
  const validateAndSetFile = (file: File) => {
    setFileError(""); // Reset error
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension !== "csv") {
      setFileError("Please select a CSV file only");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    const fileNameWithoutExtension = file.name.replace(".csv", "");
    setFormData((prev) => ({
      ...prev,
      name: fileNameWithoutExtension,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
      e.target.value = ""; // Reset input
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
            {!filterActive && !(filterCount > 0) && (
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResetDate();
                                  }}
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
                                  setDateChanged(true);
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResetTags();
                                  }}
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
                <FontAwesomeIcon
                  onClick={() => setSelectedFile(null)}
                  icon={faXmark}
                />
              </Button>
            </div>
            <div className="dialog-body">
              <Field className="fieldDv">
                {/* <Label>CSV File</Label> */}
                <div className="flex flex-col lg:flex-row gap-[25px]">
                  <div className="basis-full lg:basis-1/2">
                    <div className="relative mb-[24px]">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file1"
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          className={`${
                            false
                              ? "error-dropzone-file-container"
                              : "file-dropzone-container"
                          } mb-2 flex flex-col items-center justify-center w-full h-64 cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mb-4"
                              width={14}
                              height={17}
                              viewBox="0 0 14 18"
                              fill="none"
                            >
                              <path
                                d="M4 7.5293V13.5293H10V7.5293H14L7 0.529297L0 7.5293H4ZM7 3.3293L9.2 5.5293H8V11.5293H6V5.5293H4.8L7 3.3293ZM14 15.5293H0V17.5293H14V15.5293Z"
                                fill="#B92825"
                              />
                            </svg>
                            <div className="mb-[10px] fs-14-600 text-color-0F0F0F">
                              Drag & drop file or{" "}
                              <span className="dark-red-color underline">
                                Browse
                              </span>
                            </div>
                            <div className="fs-12-400 text-color-718096 dark:text-gray-400">
                              Supported formate: csv
                            </div>
                          </div>
                          <input
                            name="sec4_img"
                            id="dropzone-file1"
                            type="file"
                            className="hidden"
                            accept=".csv"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="uploaded-thumbnail-files-container">
                      <div className="uploaded-thumbnail-files-list">
                        <div className="uploaded-thumbnail-file-item flex items-center justify-between mb-2">
                          {selectedFile && (
                            <div className="flex items-center gap-2">
                              <img src={fileIcon} alt="file icon" />
                              <div>
                                <>
                                  {" "}
                                  <div className="fs-12-600 text-color-1A202C mb-1">
                                    {selectedFile?.name}
                                  </div>
                                </>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
