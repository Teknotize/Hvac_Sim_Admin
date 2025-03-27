import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import useToastStore from "../../store/useToastStore";

const Toast = () => {
  const { message, type, isOpen, hideToast } = useToastStore();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000); // Auto-hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, hideToast]);

  if (!isOpen) return null; // Don't render if toast is not open

  return (
    <Transition
      as={Fragment}
      appear
      show={isOpen}
      enter="transform transition duration-300"
      enterFrom="translate-x-10 opacity-0"
      enterTo="translate-x-0 opacity-100"
      leave="transform transition duration-300"
      leaveFrom="translate-x-0 opacity-100"
      leaveTo="translate-x-10 opacity-0"
    >
      <div className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm transition-all duration-300 
          ${type === "success" ? "bg-green-700" : "bg-red-700"}`}>
        <span>{message}</span>
        <button onClick={hideToast} className="text-white hover:text-gray-200">
          <div className="h-5 w-5">x</div>
        </button>
      </div>
    </Transition>
  );
};

export default Toast;
