import { Fragment, useState } from "react";
import {
  Button,
  Field,
  Input,
  Popover,
  PopoverButton,
  Dialog,
  DialogPanel,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AddDistrubutorForm from "./addDistrubutorForm";

const DistributorTable = () => {

    const [isOpen, setIsOpen] = useState(false);
  return (
    <>
    {/* Header */}
      <div className="page-header">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="page-title">Distributors</h1>
          </div>

          <div className="filterArea">
            <Field className="search-field">
              <FontAwesomeIcon icon={faSearch} />
              <Input as={Fragment}>
                  <input
                    name="search"
                    placeholder="Search"
                    className="search-field"
                  />
              </Input>
            </Field>

            <Popover className="action-drop">
                <Popover.Button className="block">
                <Button
                    className="btn btn-primary"
                    onClick={() => setIsOpen(true)}
                >
                    <FontAwesomeIcon icon={faPlus} /> Add New
                </Button>
                </Popover.Button>
            </Popover>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
            {/* Your form goes here */}
           {<AddDistrubutorForm/>}

            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-sm text-gray-500 hover:text-red-500"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
          </div>
        </div>

      </div>

    <section className="container px-4 mx-auto">
        <div className="flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Distributors</th>
                                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Country/State</th>
                                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Salesperson 1</th>
                                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Salesperson 2</th>
                                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Salesperson 3</th>
                                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Status</th>

                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                <tr>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">Jan 6, 2022</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">Jan 6, 2022</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">Jan 6, 2022</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">Jan 6, 2022</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">Jan 6, 2022</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">Jan 6, 2022</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                        <div className="dropdown">
                                        <div tabIndex={0} role="button" className="btn m-1">Click</div>
                                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                            <li><a>Activate/Deactivate</a></li>
                                            <li><a>Edit</a></li>
                                            <li><a>Update</a></li>
                                            <li><a>Delete</a></li>
                                        </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        
        <div className="table-footer flex justify-end mt-5">
        <div className="table-row">
            <div className="table-cell pagination-cell">

            <div className="pagination">
                <button className="pagination-button" disabled>
                <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="chevron-left"
                    className="svg-inline--fa fa-chevron-left"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                >
                    <path
                    fill="currentColor"
                    d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                    />
                </svg>
                </button>

                <div className="pagination-numbers">
                <p className="active">1</p>
                <p className="">2</p>
                <p className="">3</p>
                <p className="">4</p>
                <p>...</p>
                <p className="">1371</p>
                </div>

                <button className="pagination-button">
                <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="chevron-right"
                    className="svg-inline--fa fa-chevron-right"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                >
                    <path
                    fill="currentColor"
                    d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                    />
                </svg>
                </button>
            </div>
            </div>
        </div>
        </div>

    </section>
    </>
  );
};

export default DistributorTable;
