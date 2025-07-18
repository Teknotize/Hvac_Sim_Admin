import { Popover } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";


type OptionType = {
  label: string;
  value: "currentMonth" | "lastMonth"; // Narrow the type
};



export default function InquiryMonthPopover({
  onSelect,
  options,
  selected
}: {
  onSelect: (val: string) => void;
  options: OptionType[];
  selected: string;
}) {
  return (
    <Popover className="action-drop">
      {({ close }) => (
        <>
          <Popover.Button className="block cursor-pointer w-5 h-5">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </Popover.Button>
          <Popover.Panel
            anchor="bottom end"
            className="action-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
          >
            <div className="action-menu">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onSelect(opt.value);
                    close(); // ✅ Close the popover on select
                  }}
                  className={`action-menu-item ${
                    selected === opt.value ? "bg-gray-100 font-bold" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
