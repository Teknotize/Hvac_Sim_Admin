import { Field, Input, Label } from "@headlessui/react";
import fileIcon from "../../../../public/images/file-icon.png";
import useToastStore from "../../../store/useToastStore";
import { UploadIcon } from "../../../components/svg/icons";

const WhatsNewSection3 = ({ data, onChange }: { data: any; onChange: any }) => {
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
    onChange("sec3_image", file);
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
    onChange("sec3_image", file);
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
      {" "}
      <div className="row">
        <div className="col">
          <Field className="fieldDv">
            <Label>Heading</Label>
            <Input
              name="Heading"
              value={data?.sec3_heading}
              onChange={(e) => onChange("sec3_heading", e.target.value)}
            />
          </Field>
        </div>
        <div className="col">
          <Field className="fieldDv">
            <Label>Learn More Link</Label>
            <Input
              name="Learn More Link"
              value={data.sec3_link}
              onChange={(e) => onChange("sec3_link", e.target.value)}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col"></div>
      </div>
      <div className="col">
        {" "}
        <Field className="fieldDv">
          <Label>Description</Label>
          <textarea
            name="Description"
            value={data.sec3_description}
            onChange={(e) => onChange("sec3_description", e.target.value)}
          />
        </Field>
      </div>
      <div className="row">
        <div className="col">
          <div className="w-full ">
            <div className="dialog-body">
              <div className="uploadAreaDv ">
                {/* <Label>CSV File</Label> */}
                <div className="uploadArea">
                  <label
                    htmlFor="dropzone-file1"
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
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
                      accept="image/*"
                      onChange={handleFileInputChange}
                    />
                  </label>
                  {data.sec3_image && (
                    <div className="uploaded-files-container">
                      <div className="upload-item">
                        {data.sec3_image instanceof File ? (
                          <div className="flex items-center gap-5">
                            <img src={fileIcon} alt="file icon" />{" "}
                            <div className="fs-12-600 text-color-1A202C mb-1">
                              {data.sec3_image.name}
                            </div>
                            <div className="fs-10-400 light-dark-color">
                              {`${(
                                data.sec3_image.size /
                                (1024 * 1024)
                              ).toFixed(2)} MB`}
                            </div>
                          </div>
                        ) : (
                          <a
                            href={data.sec3_image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon flex items-center gap-5"
                          >
                            <img src={fileIcon} alt="file icon" />
                            {getFileName(data.sec3_image)}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* {fileError && (
                    <p className="text-red-500 text-sm mt-1">{fileError}</p>
                  )} */}
              </div>
            </div>
          </div>
        </div>
        <div className="col"></div>
      </div>
      {/* <Field className="fieldDv">
            <Label>File</Label>
            <Input
              type="file"
              name="full_name"
              onChange={(e) => {
                if (e.target.files) {
                  onChange("sec3_image", e.target.files[0]);
                }
              }}
              accept="image/*"
            />
          </Field>
          {data.sec3_image && data.sec3_image instanceof File && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {data.sec3_image.name}
            </p>
          )} */}
    </>
  );
};

export default WhatsNewSection3;
