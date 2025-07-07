import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function PopoverMenu() {
  return (
    <Popover className="action-drop">
      <PopoverButton className="block cursor-pointer w-5 h-5">
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom end"
        className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
      >
        <div className="action-menu">
          <Link to="/" className="action-menu-item">
            <p>Last 7 days</p>
          </Link>
          <Link to="/" className="action-menu-item">
            <p>Last 15 days</p>
          </Link>
          <Link to="/" className="action-menu-item">
            <p>Last month</p>
          </Link>
          {/* <Link to="/" className="action-menu-item">
            <p>Delete</p>
          </Link> */}
        </div>
      </PopoverPanel>
    </Popover>
  );
}