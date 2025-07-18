import {
  Button,
  Popover,
  PopoverButton,
  Input
  
} from "@headlessui/react";
import { addDistributor } from "../../api/DistributorData";
import { useState } from "react";
import useToastStore from "../../store/useToastStore"; 

type Props = {
  onSuccess: () => void;
  onClose: () => void;
};

const AddDistrubutorForm = ({ onSuccess, onClose }: Props) => {
  

  const [formData, setFormData] = useState({
    distributorName: "",
    state: "",
    salesperson1: "",
    salesperson2: "",
    salesperson3: "",
  });

    const { showToast } = useToastStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async () => {
  const { distributorName, state, salesperson1, salesperson2, salesperson3 } = formData;

  // ✅ Check if any field is empty
  if (
    !distributorName.trim() ||
    !state.trim() ||
    !salesperson1.trim() ||
    !salesperson2.trim() ||
    !salesperson3.trim()
  ) {
    showToast("Please fill in all the fields.", "error");
    return;
  }

  // ✅ Basic email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmail = [salesperson1, salesperson2, salesperson3].find(
    (email) => !emailRegex.test(email)
  );

  if (invalidEmail) {
    showToast(`Invalid email format: ${invalidEmail}`, "error");
    return;
  }

  // ✅ Check for duplicate emails
  const emails = [salesperson1, salesperson2, salesperson3];
  const hasDuplicates = new Set(emails).size !== emails.length;

  if (hasDuplicates) {
    showToast("Salesperson emails must not be the same.", "error");
    return;
  }

  // 🔄 Submit logic
  try {
    await addDistributor({ ...formData, Status: "Active" });
    showToast("Distributor added successfully!", "success");

    setFormData({
      distributorName: "",
      state: "",
      salesperson1: "",
      salesperson2: "",
      salesperson3: "",
    });

    if (onSuccess) onSuccess();
    if (onClose) onClose();
  } catch (error) {
    showToast("Error adding distributor.", "error");
    console.error(error);
  }
};



  return (
    <>
    <div className="mt-4 border-t border-gray-200">

    </div>
    <div className="mt-8 mb-8 grid grid-cols-2 gap-8 m-y-8 text-black px-6 py-4">
        <div className="">
            <p className="text-medium text-xs pb-[5px]">Distributor Name</p>
            <Input
            value={formData.distributorName}
            onChange={handleChange} 
            name="distributorName" 
            placeholder="Enter" 
            className="border px-[16px] py-[14px] border-gray-200 w-full rounded-lg text-sm text-black" />
        </div>
        <div>
            <p className="text-medium text-xs pb-[5px]">State</p>
            <select 
            defaultValue="Select"
            value={formData.state}
            onChange={handleChange}
            name="state" 
            className="select border px-[16px] py-[14px] border-gray-200 w-full rounded-lg text-sm text-black">
                <option >Select State</option>
                <option value="Alabama">Alabama</option>
                <option value="Alaska">Alaska</option>
                <option value="Arizona">Arizona</option>
                <option value="Arkansas">Arkansas</option>
                <option value="California">California</option>
                <option value="Colorado">Colorado</option>
                <option value="Connecticut">Connecticut</option>
                <option value="Delaware">Delaware</option>
                <option value="Florida">Florida</option>
                <option value="Georgia">Georgia</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Idaho">Idaho</option>
                <option value="Illinois">Illinois</option>
                <option value="Indiana">Indiana</option>
                <option value="Iowa">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="Kansas">Kentucky</option>
                <option value="Louisiana">Louisiana</option>
                <option value="Maine">Maine</option>
                <option value="Maryland">Maryland</option>
                <option value="Massachusetts">Massachusetts</option>
                <option value="Michigan">Michigan</option>
                <option value="Minnesota">Minnesota</option>
                <option value="Mississippi">Mississippi</option>
                <option value="Missouri">Missouri</option>
                <option value="Montana">Montana</option>
                <option value="Nebraska">Nebraska</option>
                <option value="Nevada">Nevada</option>
                <option value="New Hampshire">New Hampshire</option>
                <option value="New Jersey">New Jersey</option>
                <option value="New Mexico">New Mexico</option>
                <option value="New York">New York</option>
                <option value="North Carolina">North Carolina</option>
                <option value="North Dakota">North Dakota</option>
                <option value="Ohio">Ohio</option>
                <option value="Oklahoma">Oklahoma</option>
                <option value="Oregon">Oregon</option>
                <option value="Pennsylvania">Pennsylvania</option>
                <option value="Rhode Island">Rhode Island</option>
                <option value="South Carolina">South Carolina</option>
                <option value="South Dakota">South Dakota</option>
                <option value="Tennessee">Tennessee</option>
                <option value="Texas">Texas</option>
                <option value="Utah">Utah</option>
                <option value="Vermont">Vermont</option>
                <option value="Virginia">Virginia</option>
                <option value="Washington">Washington</option>
                <option value="West Virginia">West Virginia</option>
                <option value="Wisconsin">Wisconsin</option>
                <option value="Wyoming">Wyoming</option>

            </select>
        </div>
        <div>
            <p className="text-medium text-xs pb-[5px]">Salesperson1 Email</p>
            <input
            name="salesperson1"
            value={formData.salesperson1}
            onChange={handleChange} 
            placeholder="Enter" 
            className="border px-[16px] py-[14px] border-gray-200 w-full rounded-lg text-sm text-black" />
        </div>
        <div>
            <p className="text-medium text-xs pb-[5px]">Salesperson2 Email</p>
            <input
            name="salesperson2"
            value={formData.salesperson2}
            onChange={handleChange} 
            placeholder="Enter" 
            className="border px-[16px] py-[14px] border-gray-200 w-full rounded-lg text-sm text-black" />
        </div>
        <div>
            <p className="text-medium text-xs pb-[5px]">Salesperson3 Email</p>
            <input
            name="salesperson3"
            value={formData.salesperson3}
            onChange={handleChange} 
            placeholder="Enter" 
            className="border px-[16px] py-[14px] border-gray-200 w-full rounded-lg text-sm text-black" />
        </div>
    </div>
    <div className="filterArea p-4 flex justify-end border-gray-200 border-t px-[25px] py-[19px]">
                <Popover className="action-drop">
                  <PopoverButton className="block">
                    <Button
                    onClick={handleSubmit} 
                    className="btn-primary px-[20px] py-[12px] rounded-3xl cursor-pointer">
                      <span className="text-sm ">Save Changes</span>
                    </Button>
                  </PopoverButton>
                </Popover>
    </div>
    </>
  )
}

export default AddDistrubutorForm
