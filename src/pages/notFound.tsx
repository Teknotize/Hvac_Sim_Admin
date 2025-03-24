import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const NotFoundPage = () => {
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full text-center">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                404
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Oops! The page you are looking for does not exist.
              </p>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default NotFoundPage;
