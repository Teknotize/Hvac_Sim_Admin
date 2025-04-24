import PageHeader from "../components/layout/PageHeader";
import CsvFileIcon from "../assets/images/icon-file-csv.png";
import FileLockIcon from "../assets/images/logo-filelock.png";
import CombustionIcon from "../assets/images/icon-combustion.png";
import RefrigerantIcon from "../assets/images/icon-refrigerant.png";
import {
  Button,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { DownloadIcon } from "../components/svg/icons";
import ToastButtons from "../components/toast/toastTesting";
export default function AppData() {
  return (
    <>
      <ToastButtons />
      <PageHeader title="Templates" route="app-data" />
      <div className="flex gap-6 flex-wrap mb-20">
        <div className="fileDownloadDv">
          <a
            href="/files/com-Condition 03.csv"
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

      <div className="page-header">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="page-title">Combustion Data</h1>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-wrap mb-20">
        <div className="fileDownloadDv locked">
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
        </div>
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
            <img src={CsvFileIcon} alt="CSV File" />
          </div>
          <h3>PDF Manual</h3>
        </div>
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
            <img src={CsvFileIcon} alt="CSV File" />
          </div>
          <h3>PDF Manual</h3>
        </div>
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
            <img src={CsvFileIcon} alt="CSV File" />
          </div>
          <h3>PDF Manual</h3>
        </div>
      </div>

      <div className="page-header">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="page-title">Refrigerant Data</h1>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-wrap">
        <div className="fileDownloadDv locked">
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
          <h3>No Flame</h3>
        </div>
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
            <img src={CsvFileIcon} alt="CSV File" />
          </div>
          <h3>PDF Manual</h3>
        </div>
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
            <img src={CsvFileIcon} alt="CSV File" />
          </div>
          <h3>PDF Manual</h3>
        </div>
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
            <img src={CsvFileIcon} alt="CSV File" />
          </div>
          <h3>PDF Manual</h3>
        </div>
      </div>
    </>
  );
}
