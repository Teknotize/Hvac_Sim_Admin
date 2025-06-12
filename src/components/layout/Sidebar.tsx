import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import logo from "../../assets/images/logo.png";
import profileImage from "../../assets/images/profileImageAdmin.png";
import {
  UserIcon,
  UserMenuIconProfile,
  UserMenuIconLogout,
  MainMenuNavDashboard,
  MainMenuNavCMS,
  MainMenuNavCRM,
  MainMenuNavDistributors,
  MainMenuNavAppData,
  ProfileEditIcon,
} from "../svg/icons";
import { useNavigate } from "react-router-dom";
import useLogout from "../logout";
import { useSidebar } from "../../context/SidebarContext";
import { useEffect, useRef, useState } from "react";

import { apiClient } from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { updateProfile } from "../../api/User";
import useToastStore from "../../store/useToastStore";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: <MainMenuNavDashboard /> },
  {
    name: "Distributors",
    href: "/distributors",
    icon: <MainMenuNavDistributors />,
  },
  { name: "AppData", href: "/app-data", icon: <MainMenuNavAppData /> },
  {
    name: "CRM",
    href: "/crm",
    icon: <MainMenuNavCRM />,
    children: [
      { name: "Contacts", href: "/crm/contacts" },
      { name: "PDF Manual", href: "/crm/pdf-manual" },
    ],
  },
  { name: "CMS", href: "/cms", icon: <MainMenuNavCMS /> },
];

export default function Sidebar() {
  const { showToast } = useToastStore();
  const location = useLocation();
  const logout = useLogout();
  const navigate = useNavigate();
  const { isOpen } = useSidebar();
  const [userData, setUserData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    location: "",
    profilePic: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProfilePopOpen, setisProfilePopOpen] = useState(false);
  console.log("userData", userData);
  const handleEditClick = () => {
    fileInputRef.current?.click(); // Trigger file input on icon click
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const previewURL = URL.createObjectURL(file);
    setUserData((prev: any) => ({ ...prev, profilePic: previewURL }));

    // Store actual file to send in API
    setSelectedFile(file);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", userData.name);

      const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      if (!userData.email) {
        showToast("Email field cannot be empty.", "error");
        setLoading(false);
        return; // 🛑 stop execution
      }

      if (!isValidEmail(userData.email)) {
        showToast("Invalid email format.", "error");
        setLoading(false);
        return; // 🛑 stop execution
      }

      formData.append("email", userData.email);
      formData.append("phone", userData.phone || "");
      formData.append("place", userData.location || "");

      if (selectedFile instanceof File) {
        formData.append("profilePic", selectedFile);
      }

      const res = await updateProfile(formData);
      console.log("res:", res); // 🔍 Debug log

      if (res?.success) {
        showToast(res.message || "Profile updated successfully.", "success");
        setRefresh(!refresh);
      } else {
        showToast(res.message || "Failed to update profile.", "error");
      }

      if (res.user) {
        setUserData({
          name: res.user.name || "",
          email: res.user.username || "",
          phone: res.user.phone || "",
          location: res.user.location || "",
          profilePic: res.user.profilePic || "",
        });
      }

      setisProfilePopOpen(false);
      setLoading(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);

      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while updating profile.";

      showToast(errorMessage, "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await apiClient.get("/admin/profile-info");
        const user = response.data.user;

        setUserData({
          name: user.name,
          email: user.username,
          phone: user.phone,
          location: user.location,
          profilePic: user.profilePic, // pre-signed URL from S3
        });
      } catch (error: any) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, [refresh]);

  return (
    <>
      <div className={`flex h-full flex-col sidebar ${isOpen ? "active" : ""}`}>
        <div className="sidebar-inner">
          <div className="flex h-16 items-center gap-4 p-4 border-b-2 border-gray-800">
            <a href="/" className="logo">
              <img src={logo} alt="HVAC Sim Admin" />
            </a>

            <Popover className="user-info">
              <PopoverButton className="block">
                <UserIcon />
              </PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom end"
                className="user-info-popover shadow-xl transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
              >
                <div className="user-label border-b-1 border-gray-200 pb-3 mb-3">
                  <p>Signed in as</p>
                  <p>{userData?.email}</p>
                </div>
                <div className="user-menu">
                  <a
                    href="javascript:void(0)"
                    className="user-menu-item"
                    onClick={() => setisProfilePopOpen(true)}
                  >
                    <UserMenuIconProfile />
                    <p>Profile</p>
                  </a>

                  {/* <Link to="/logout" className="user-menu-item">
                    <UserMenuIconLogout />
                    <p>Logout</p>
                  </Link> */}

                  <button
                    onClick={handleLogout}
                    className="user-menu-item"
                    style={{ width: "100%", cursor: "pointer" }}
                  >
                    <UserMenuIconLogout />
                    <p>Logout</p>
                  </button>
                </div>
              </PopoverPanel>
            </Popover>
          </div>
          <div className="flex justify-center">
            <div className="user-card">
              <figure className="user-dp">
                {userData?.profilePic ? (
                  <img src={userData.profilePic} alt={userData?.name} />
                ) : (
                  <img src={profileImage} alt={userData?.name} />
                )}
              </figure>
              <div className="user-card-body">
                <h4>{userData?.name}</h4>
                <p>{userData?.email}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <nav className="mainNav">
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.children &&
                    item.children.some(
                      (child) => location.pathname === child.href
                    ));
                return (
                  <div
                    key={item.name}
                    className={`nav-item-group ${
                      item.children && isActive ? "active" : ""
                    }`}
                  >
                    {item.children ? (
                      <div
                        className={`nav-item has-sub-items flex ${
                          isActive ? "active" : ""
                        }`}
                        onClick={
                          item.children
                            ? (e) => {
                                e.preventDefault();
                                // Toggle active class for items with children
                                const currentTarget = e.currentTarget;
                                if (currentTarget.parentElement) {
                                  currentTarget.parentElement.classList.toggle(
                                    "active"
                                  );
                                }
                              }
                            : undefined
                        }
                      >
                        <div className="nav-item-inner">
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                        {item.children && (
                          <svg
                            className="h-4 w-4 sub-item-arrow"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={`nav-item flex ${isActive ? "active" : ""}`}
                      >
                        <div className="nav-item-inner">
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    )}

                    {item.children && (
                      <div className="sub-item-group flex flex-col">
                        {item.children.map((child) => {
                          const isChildActive =
                            location.pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              className={`nav-sub-item ${
                                isChildActive ? "active" : ""
                              }`}
                            >
                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <Dialog
        open={isProfilePopOpen}
        onClose={() => setisProfilePopOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/40 dialog-item">
          <DialogPanel className="max-w-full w-xl space-y-4 border bg-white p-6 rounded-xl dialog-panel">
            <Button
              className="closeBtn"
              onClick={() => {
                setRefresh(!refresh);
                setisProfilePopOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
            <div className="dialog-body">
              <div className="profileCard">
                <figure>
                  {userData?.profilePic ? (
                    <img src={userData.profilePic} alt={userData?.name} />
                  ) : (
                    <img src={profileImage} alt={userData?.name} />
                  )}

                  <span
                    onClick={handleEditClick}
                    className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer"
                  >
                    <ProfileEditIcon />
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </figure>
                <div className="profileCard-body">
                  <h4>{userData?.name}</h4>
                  <p>{userData?.email}</p>
                </div>
              </div>

              <div className="fieldItem">
                <p>Name</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder={userData?.name ? "Enter name" : "Add name"}
                  value={userData?.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                />
              </div>

              <div className="fieldItem">
                <p>Email account</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder={
                    userData?.phone ? "Enter  number" : "Add  number"
                  }
                  value={userData?.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              </div>

              <div className="fieldItem">
                <p>Mobile number</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder={
                    userData?.phone ? "Enter  number" : "Add  number"
                  }
                  value={userData?.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                />
              </div>

              <div className="fieldItem">
                <p>Location</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder={
                    userData?.location ? "Enter location" : "Add Location"
                  }
                  value={userData?.location}
                  onChange={(e) =>
                    setUserData({ ...userData, location: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="dialog-footer">
              <Button
                className="btn btn-primary"
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? "Saving Changes" : "Save Changes"}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
