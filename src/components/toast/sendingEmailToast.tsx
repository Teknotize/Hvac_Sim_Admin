import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import useSendEmailToastStore from "../../store/userEmailToastStore";

const ProgressToast = () => {
    const {
        message,
        type,
        isOpen,
        hideToast,
        progress,
        total,
        completed
    } = useSendEmailToastStore();

    useEffect(() => {
        if (isOpen && type !== 'progress') {
            const timer = setTimeout(() => {
                hideToast();
            }, 120000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, type, hideToast]);

    if (!isOpen) return null;

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
            <div className={`fixed bottom-4 right-4 w-80 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 
                ${type === 'success' ? 'bg-green-600' :
                    type === 'error' ? 'bg-red-600' :
                        'bg-red-600'}`}>

                {/* Progress bar for progress type */}
                {type === 'progress' && (
                    <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                            <span>{message}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-green-400 h-2.5 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-300 mt-1">
                            Processed {completed} of {total} emails
                        </div>
                    </div>
                )}

                {/* Regular message for success/error */}
                {type !== 'progress' && (
                    <div className="flex items-center justify-between">
                        <span>{message}</span>
                        <button
                            onClick={hideToast}
                            className="text-white hover:text-gray-200 ml-2 focus:outline-none"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </Transition>
    );
};

export default ProgressToast;