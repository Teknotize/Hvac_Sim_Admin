import { Fragment, useEffect, useState } from "react";
import { Button, Checkbox } from "@headlessui/react";
import { FilterIcon, UploadIcon } from "../../components/svg/icons";
import { Field, Input } from "@headlessui/react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faChevronDown,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverButton, PopoverPanel,Transition } from "@headlessui/react";

import { DateRangePicker, Range } from "react-date-range";
import { tags, defaultDate } from "../../utils/constants";
import { Dialog, DialogPanel } from "@headlessui/react";

import useToastStore from "../../store/useToastStore";
import { createBadgeWithCSV } from "../../api/AppData";
import { Link } from "react-router-dom";
import CsvFileIcon from "../../assets/images/icon-file-csv.png";

interface PageHeaderProps {
  title: string;
  route?: string;
  onSendEmailClick?: () => void;
  onSearchChange?: (value: string) => void;
  onAddNewPdfClick?: () => void;
  setRefreshFlag?: any;
  showEmail?: boolean;
  onTagsFilterChange?: (filters: { tags: string[] }) => void;
  onSubscriptionFilterChange?: (filters: {
    subscriptionLevels: string[];
  }) => void;
  clearFilter?: () => void;
  dateSelectedCallback?: (startDate: Date, endDate: Date) => void;
  onClearIndividualFilter?: (
    filterType: "date" | "tags" | "subscription"
  ) => void;
}

export default function PageHeader({
  title,
  route,
  onSendEmailClick,
  onSearchChange,
  showEmail,
  onAddNewPdfClick,
  onTagsFilterChange,
  onSubscriptionFilterChange,
  clearFilter,
  dateSelectedCallback,
  setRefreshFlag,
  onClearIndividualFilter,
}: PageHeaderProps) {
  const [filterActive, setFilterActive] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState({
    tags: false,
    subscription: false,
    date: false,
  });
  const [lastAppliedTags, setLastAppliedTags] = useState(
  tags.map((tag) => ({ ...tag, checked: false }))
);
const [lastAppliedSubscriptionLevels, setLastAppliedSubscriptionLevels] = useState([
  { id: 1, name: "free", checked: false },
  { id: 2, name: "paid", checked: false },
  { id: 3, name: "admin-paid", checked: false },
]);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToastStore();
  const [shouldResetOnClose, setShouldResetOnClose] = useState(true);
  const [formData, setFormData] = useState<any>({
    name: "",
    icon: "https://hvac-project-teknotize.s3.ap-south-1.amazonaws.com/noflame_new.png",
    is_locked: false,
    unlock_condition: "Unlock with Fingerprint",
    type: "Conditional",
    condition_type: "free",
    AppCategory: "Knowledge Evaluator",
    category: "",
    chapter: "",
    sequence:null
  });

  const [selectedTags, setSelectedTags] = useState(
    tags.map((tag) => ({ ...tag, checked: false }))
  );
  const [selectedSubscriptionLevels, setSelectedSubscriptionLevels] = useState([
    { id: 1, name: "free", checked: false },
    { id: 2, name: "paid", checked: false },
    { id: 3, name: "admin-paid", checked: false },
  ]);

  const handleResetTags = () => {
  setSelectedTags(tags.map((tag) => ({ ...tag, checked: false })));
  setLastAppliedTags(tags.map((tag) => ({ ...tag, checked: false })));
  setFiltersApplied((prev) => ({ ...prev, tags: false }));
  onClearIndividualFilter?.("tags");
};
  

  const handleResetDate = () => {
    setDateState([defaultDate]);
    setDateChanged(false);
    setFiltersApplied((prev) => ({ ...prev, date: false }));
    onClearIndividualFilter?.("date");
  };

  const handleResetSubscription = () => {
  const resetLevels = [
    { id: 1, name: "free", checked: false },
    { id: 2, name: "paid", checked: false },
    { id: 3, name: "admin-paid", checked: false },
  ];
  setSelectedSubscriptionLevels(resetLevels);
  setLastAppliedSubscriptionLevels(resetLevels);
  setFiltersApplied((prev) => ({ ...prev, subscription: false }));
  onClearIndividualFilter?.("subscription");
};

  const handleResetAll = () => {
    handleResetTags();
    handleResetDate();
    handleResetSubscription();
    clearFilter?.();
    setDateState([defaultDate]);
    setFilterCount(0);
    setFiltersApplied({ tags: false, subscription: false, date: false });
  };

  const [datSstate, setDateState] = useState<Range[]>([defaultDate]);
  const handleApplyFilters = () => {
  const selectedTagNames = selectedTags
    .filter((tag) => tag.checked)
    .map((tag) => tag.name);

  onTagsFilterChange?.({
    tags: selectedTagNames,
  });
  setFiltersApplied((prev) => ({ ...prev, tags: true }));
  
  // Store the applied state
  setLastAppliedTags([...selectedTags]);
};

  const handleSubscriptionCheckboxChange = (id: number, checked: boolean) => {
    setSelectedSubscriptionLevels((prev) =>
      prev.map((level) => (level.id === id ? { ...level, checked } : level))
    );
  };

  const handleApplySubscriptionFilters = () => {
  const selectedLevels = selectedSubscriptionLevels
    .filter((level) => level.checked)
    .map((level) => level.name);

  onSubscriptionFilterChange?.({
    subscriptionLevels: selectedLevels,
  });
  setFiltersApplied((prev) => ({ ...prev, subscription: true }));
  
  // Store the applied state
  setLastAppliedSubscriptionLevels([...selectedSubscriptionLevels]);
};

  
  useEffect(() => {
    const totalSelectedFilters = () => {
      let count = 0;

      if (selectedTags.some((tag) => tag.checked)) {
        count += 1;

        setShouldResetOnClose(true);
      }

      if (selectedSubscriptionLevels.some((level) => level.checked)) {
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

    if (filterCount > 0 && newCount === 0) {
      clearFilter?.();
    }
  }, [selectedTags, selectedSubscriptionLevels, datSstate]);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedTags((prev) =>
      prev.map((tag) => (tag.id === id ? { ...tag, checked } : tag))
    );
  };

  const handleFileUpload = (category: string, AppCategory: string,chapter?:string) => {
    setSelectedCategory(category);
    console.log(chapter)
    setFormData((prev:any) => ({
      ...prev,
      category: category,
      AppCategory: AppCategory,
    chapter:chapter
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
    setFormData((prev:any) => ({
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
      console.log('formdata',formData)
      if (
        !formData.name ||
        !formData.icon ||
        !formData.unlock_condition ||
        !formData.type ||
        !formData.category ||
        !formData.AppCategory ||
        !formData.category ||
  formData.sequence === null || // Add this check
  formData.sequence === ""     // And this check
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
   // After successful upload
setFormData({
  name: "",
  icon: "https://hvac-project-teknotize.s3.ap-south-1.amazonaws.com/noflame_new.png",
  is_locked: false,
  unlock_condition: "Unlock with Fingerprint",
  type: "Conditional",
  condition_type: "free",
  AppCategory: "Knowledge Evaluator",
  category: "",
  chapter: "",
  sequence: null // or some default value if appropriate
});
      } catch (error) {
        setFileError("Error uploading file. Please try again.");
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDateFilterChange = (startDate: Date, endDate: Date) => {
    setDateState([{ ...defaultDate, startDate, endDate }]);
    setDateChanged(true);
    setFiltersApplied((prev) => ({ ...prev, date: true }));
    dateSelectedCallback?.(startDate, endDate);
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
                              {datSstate[0]?.startDate?.toLocaleDateString()} -{" "}
                              {datSstate[0]?.endDate?.toLocaleDateString()}
                              {filtersApplied.date && (
                                <FontAwesomeIcon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResetDate();
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
                                    handleDateFilterChange(startDate, endDate);
                                    close();
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
                              {filtersApplied.tags && (
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
                          <Transition
                            afterLeave={() => {
                              // Only reset to last applied state if user didn't click Apply
                              if (shouldResetOnClose && filtersApplied.tags) {
                                // Revert to last applied state
                                setSelectedTags([...lastAppliedTags]);
                              } else if (shouldResetOnClose && !filtersApplied.tags) {
                                // Reset to empty if no filters were ever applied
                                setSelectedTags(tags.map((tag) => ({ ...tag, checked: false })));
                              }
                              setShouldResetOnClose(true); // Reset for next time
                            }}
                          >

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
                                    setShouldResetOnClose(false);
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
                          </Transition>
                        </>
                      )}
                    </Popover>

                    <Popover className="action-drop">
                      {({ close }) => (
                        <>
                          <PopoverButton
                            className={`block btn btn-outline-grey icon-end ${
                              selectedSubscriptionLevels.filter(
                                (level) => level.checked
                              ).length > 0 && "active"
                            }`}
                          >
                            <span>
                              Subscription{" "}
                              <FontAwesomeIcon icon={faChevronDown} />
                            </span>
                            <span className="active">
                              Subscription
                              <b>
                                {selectedSubscriptionLevels.filter(
                                  (level) => level.checked
                                ).length !== 0
                                  ? selectedSubscriptionLevels.filter(
                                      (level) => level.checked
                                    ).length
                                  : ""}
                              </b>
                              {filtersApplied.subscription && (
                                <FontAwesomeIcon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResetSubscription();
                                  }}
                                  icon={faXmark}
                                  className="cursor-pointer"
                                />
                              )}
                            </span>
                          </PopoverButton>
                            <Transition
                              afterLeave={() => {
                                // Only reset to last applied state if user didn't click Apply
                                if (filtersApplied.subscription) {
                                  // Revert to last applied state
                                  setSelectedSubscriptionLevels([...lastAppliedSubscriptionLevels]);
                                } else {
                                  // Reset to empty if no filters were ever applied
                                  setSelectedSubscriptionLevels([
                                    { id: 1, name: "free", checked: false },
                                    { id: 2, name: "paid", checked: false },
                                    { id: 3, name: "admin-paid", checked: false },
                                  ]);
                                }
                              }}
                            >
                          <PopoverPanel
                            transition
                            anchor="bottom end"
                            className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                          >
                            <div className="list-menu">
                              <div className="list-group">
                                {selectedSubscriptionLevels.map((level) => (
                                  <div
                                    className="list-group-item"
                                    key={level.id}
                                    onClick={() =>
                                      handleSubscriptionCheckboxChange(
                                        level.id,
                                        !level.checked
                                      )
                                    }
                                  >
                                    <Checkbox
                                      checked={level.checked}
                                      onChange={(checked) =>
                                        handleSubscriptionCheckboxChange(
                                          level.id,
                                          checked
                                        )
                                      }
                                      className="group list-checkbox-item data-[checked]:checked"
                                    >
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="opacity-0 group-data-[checked]:opacity-100"
                                      />
                                    </Checkbox>
                                    <span className="capitalize">
                                      {level.name === "admin-paid"
                                        ? "Admin Paid"
                                        : level.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="btnRow">
                                <Button
                                  className="btn btn-link flex-1"
                                  onClick={handleResetSubscription}
                                >
                                  Reset
                                </Button>
                                <Button
                                  className="btn btn-primary flex-1"
                                  onClick={() => {
                                    handleApplySubscriptionFilters();
                                    close();
                                  }}
                                  disabled={selectedSubscriptionLevels.every(
                                    (level) => !level.checked
                                  )}
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>
                          </PopoverPanel>
                              </Transition>
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
        {route === "distributors" && (
          <div className="filterArea">
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
            <Button
              className="btn btn-primary"
              onClick={() => {}}
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
                  {/* Megacore */}
                  <div className="action-menu-item-box">
                    <p className="parentLink">Megacore</p>
                    <div className="childLinks">
                      <Link
                        to=""
                        className="action-menu-item"
                        onClick={() =>
                          handleFileUpload("Combustion", "Mega Core")
                        }
                      >
                        Combustion
                      </Link>
                      <Link
                        to=""
                        className="action-menu-item"
                        onClick={() =>
                          handleFileUpload("Refrigerant", "Mega Core")
                        }
                      >
                        Refrigerant
                      </Link>
                    </div>
                  </div>

                  {/* Knowledge Evaluator */}
                  <div className="action-menu-item-box">
                    <p className="parentLink">
                      Knowledge Evaluator
                    </p>
                    <div className="childLinks">
                      <Link
                        to=""
                        className="action-menu-item"
                        onClick={() =>
                          handleFileUpload("Combustion", "Knowledge Evaluator")
                        }
                      >
                        Combustion
                      </Link>
                      <Link
                        to=""
                        className="action-menu-item"
                        onClick={() =>
                          handleFileUpload("Refrigerant", "Knowledge Evaluator")
                        }
                      >
                        Refrigerant
                      </Link>
                    </div>
                  </div>

                  {/* Comfort Cooling */}
                  <div className="action-menu-item-box">
                    <p className="parentLink">
                      Comfort Cooling Simulator
                    </p>
                    <div className="childLinks">
                      <Link
                        to=""
                        className="action-menu-item"
                        onClick={() =>
                          handleFileUpload(
                            "Refrigerant",
                            "Comfort Cooling Simulator",
                            "Chapter 4",
                            
                          )
                        }
                      >
                        Chapter 4
                      </Link>
                      <Link
                        to=""
                        className="action-menu-item"
                        onClick={() =>
                          handleFileUpload(
                            "Refrigerant",
                            "Comfort Cooling Simulator",
                            "Chapter 5",
                            
                          )
                        }
                      >
                        Chapter 5
                      </Link>
                    </div>
                  </div>
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
              <div className="uploadAreaDv ">
                {/* <Label>CSV File</Label> */}
                <div className="uploadArea">
                  <label
                    htmlFor="dropzone-file1"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`${
                      false ? "error-file" : ""
                    } file-dropzone-container`}
                  >
                    <div className="inner">
                      <UploadIcon />
                      <p>
                        Drag your file to start uploading <span>or</span>{" "}
                        <button
                          className="btn btn-primary-outline"
                          onClick={(e) => {
                            e.preventDefault();
                            const input =
                              document.getElementById("dropzone-file1");
                            if (input) (input as HTMLInputElement).click(); // trigger input
                          }}
                        >
                          Browse
                        </button>
                      </p>
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
                  <div className="uploaded-files-container">
                    {selectedFile && (
                      <div className="upload-item">
                        <div className="icon">
                          <img src={CsvFileIcon} alt="file icon" />
                        </div>
                        <div className="info">
                          <p>{selectedFile?.name}</p>
                          <p>{selectedFile?.size}</p>
                        </div>
                        <div
                          className="action"
                          onClick={() => setSelectedFile(null)}
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

<div className="mt-4">
  <label
    htmlFor="sequence"
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    Set sequence number at which this badge/template should appear.
  </label>

 <input
  type="number"
  id="sequence"
  value={formData.sequence}
  onChange={(e) => {
  const value = e.target.value;
  setFormData((p: any) => ({
    ...p,
    sequence: value === "" ? null : Number(value),
  }));
}}



    className="w-full px-3 py-2 border border-[#B92825] rounded-md focus:outline-none focus:border-[#B92825]"
    placeholder="Enter sequence index"
  />

  {fileError && (
    <p className="text-red-500 text-sm mt-1">{fileError}</p>
  )}
</div>

                {fileError && (
                  <p className="text-red-500 text-sm mt-1">{fileError}</p>
                )}
              </div>
            </div>
            <div className="dialog-footer">
              <Button
                className="btn btn-primary"
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isUploading ||formData.sequence === ""||formData.sequence === null}
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
