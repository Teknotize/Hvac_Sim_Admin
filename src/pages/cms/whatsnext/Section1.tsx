import { Field, Input, Label } from "@headlessui/react";
import fileIcon from "../../../../public/images/file-icon.png";
import useToastStore from "../../../store/useToastStore";
const WhatsNewSection1 = ({ data, onChange }: any) => {
  const { showToast } = useToastStore();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showToast(
        `File "${file.name}" is too large. Max allowed size is 5MB.`,
        "error"
      );
      return;
    }
    onChange("sec1_image", file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showToast(
        `File "${file.name}" is too large. Max allowed size is 5MB.`,
        "error"
      );
      return;
    }
    onChange("sec1_image", file);
  };
  const getFileName = (img: any) => {
    if (!img) return "No Image";

    // Check if it's a File object
    if (img instanceof File) {
      return img.name;
    }

    // Otherwise, treat it as a URL
    const pathWithoutQuery = img.split("?")[0];
    const fileName = pathWithoutQuery.split("/").pop();
    return fileName.split("_").slice(1).join("_");
  };
  return (
    <>
      <div className="row">
        <div className="col">
          <Field className="fieldDv">
            <Label>Heading</Label>
            <Input
              name="Heading"
              value={data.sec1_heading}
              onChange={(e) => onChange("sec1_heading", e.target.value)}
            />
          </Field>
        </div>
        <div className="col">
          {" "}
          <Field className="fieldDv">
            <Label>Learn More Link</Label>
            <Input
              name="Learn More Link"
              value={data.sec1_link}
              onChange={(e) => onChange("sec1_link", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="col">
        {" "}
        <Field className="fieldDv">
          <Label>Description</Label>
          <textarea
            name="Description"
            value={data.sec1_description}
            onChange={(e) => onChange("sec1_description", e.target.value)}
          />
        </Field>
      </div>
      <div className="col">
        <div className="flex flex-col lg:flex-row gap-[25px]">
          <div className="basis-full lg:basis-1/2">
            <label className="mb-[11px] block fs-12-400 light-dark-color">
              Image File
            </label>
            <div className="relative mb-[24px]">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file1"
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className={`${
                    false
                      ? "error-dropzone-file-container"
                      : "file-dropzone-container"
                  } mb-2 flex flex-col items-center justify-center w-full h-64 cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
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
                      Drag & drop files or{" "}
                      <span className="dark-red-color underline">Browse</span>
                    </div>
                    <div className="fs-12-400 text-color-718096 dark:text-gray-400">
                      Supported formats: JPG/JPEC/PNG
                    </div>
                  </div>
                  <input
                    name="sec4_img"
                    id="dropzone-file1"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInputChange}
                  />
                </label>
              </div>
              <div className="fs-12-400 text-color-718096 dark:text-gray-400">
                File limit 5 mb
              </div>
            </div>
            <div className="uploaded-thumbnail-files-container">
              <div className="uploaded-thumbnail-files-list">
                {data.sec1_image && (
                  <div className="uploaded-thumbnail-file-item flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={fileIcon} alt="file icon" />
                      <div>
                        {data.sec1_image instanceof File ? (
                          <>
                            {" "}
                            <div className="fs-12-600 text-color-1A202C mb-1">
                              {data.sec1_image.name}
                            </div>
                            <div className="fs-10-400 light-dark-color">
                              {`${(
                                data.sec1_image.size /
                                (1024 * 1024)
                              ).toFixed(2)} MB`}
                            </div>
                          </>
                        ) : (
                          <div className="fs-12-600 text-color-1A202C mb-1">
                            <a
                              href={data.sec1_image}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {getFileName(data.sec1_image)}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <div>
                            {data.sec1_image instanceof File && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="17"
                                viewBox="0 0 16 17"
                                fill="none"
                                // onClick={() =>
                                //   handleDeleteFile(sectionId, formData.sec4_img)
                                // }
                              >
                                <path
                                  d="M10.6364 3.2251H14.6511C14.8285 3.2251 14.9987 3.29424 15.1242 3.41731C15.2497 3.54038 15.3202 3.7073 15.3202 3.88135C15.3202 4.0554 15.2497 4.22232 15.1242 4.34539C14.9987 4.46846 14.8285 4.5376 14.6511 4.5376H13.911L12.9047 13.4311C12.8138 14.2337 12.4243 14.9753 11.8107 15.5139C11.1971 16.0525 10.4026 16.3502 9.57917 16.3501H6.34064C5.51722 16.3502 4.72269 16.0525 4.10912 15.5139C3.49554 14.9753 3.10603 14.2337 3.01512 13.4311L2.00743 4.5376H1.26873C1.09127 4.5376 0.921073 4.46846 0.79559 4.34539C0.670106 4.22232 0.599609 4.0554 0.599609 3.88135C0.599609 3.7073 0.670106 3.54038 0.79559 3.41731C0.921073 3.29424 1.09127 3.2251 1.26873 3.2251H5.28343C5.28343 2.5289 5.56542 1.86123 6.06735 1.36894C6.56929 0.876659 7.25006 0.600098 7.9599 0.600098C8.66975 0.600098 9.35052 0.876659 9.85245 1.36894C10.3544 1.86123 10.6364 2.5289 10.6364 3.2251ZM7.9599 1.9126C7.60498 1.9126 7.2646 2.05088 7.01363 2.29702C6.76266 2.54316 6.62167 2.877 6.62167 3.2251H9.29814C9.29814 2.877 9.15715 2.54316 8.90618 2.29702C8.65521 2.05088 8.31483 1.9126 7.9599 1.9126ZM5.95255 7.1626V12.4126C5.95255 12.5866 6.02305 12.7536 6.14853 12.8766C6.27401 12.9997 6.44421 13.0688 6.62167 13.0688C6.79913 13.0688 6.96932 12.9997 7.09481 12.8766C7.22029 12.7536 7.29079 12.5866 7.29079 12.4126V7.1626C7.29079 6.98855 7.22029 6.82163 7.09481 6.69856C6.96932 6.57549 6.79913 6.50635 6.62167 6.50635C6.44421 6.50635 6.27401 6.57549 6.14853 6.69856C6.02305 6.82163 5.95255 6.98855 5.95255 7.1626ZM9.29814 6.50635C9.12068 6.50635 8.95049 6.57549 8.825 6.69856C8.69952 6.82163 8.62902 6.98855 8.62902 7.1626V12.4126C8.62902 12.5866 8.69952 12.7536 8.825 12.8766C8.95049 12.9997 9.12068 13.0688 9.29814 13.0688C9.4756 13.0688 9.64579 12.9997 9.77128 12.8766C9.89676 12.7536 9.96726 12.5866 9.96726 12.4126V7.1626C9.96726 6.98855 9.89676 6.82163 9.77128 6.69856C9.64579 6.57549 9.4756 6.50635 9.29814 6.50635Z"
                                  fill="#F16063"
                                />
                              </svg>
                            )}
                          </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsNewSection1;
