import { Popover } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export default function PopoverMenuInquiry({
  onSelect,
  selectedRange,
}: {
  onSelect: (range: string) => void;
  selectedRange?: string;
}) {
  const ranges = ["7", "15", "30"];

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
              {ranges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    onSelect(range);
                    close(); // ✅ close the Popover after selection
                  }}
                  className={`action-menu-item ${
                    selectedRange === range ? "font-bold" : ""
                  }`}
                >
                  {range === "7"
                    ? "Last 7 days"
                    : range === "15"
                    ? "Last 15 days"
                    : "Last month"}
                </button>
              ))}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
