import { useNavigate } from "react-router-dom";
import useToastStore from "../../store/useToastStore";
import { sendRequest } from "../../config";

const useLogout = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast); // Access the showToast function

  const logout = async () => {
    try {
      // Send logout request to the backend
      const result = await sendRequest("auth/logout", "POST");
 console.log(result);
      if (!result.success) {
        throw new Error(result.message || "Logout failed.");
      }
      else{

      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      showToast("Logged out successfully!", "success");

      navigate("/login");
    }
    } catch (error:any) {
      console.error("Logout error:", error);
      showToast(error.message || "Logout failed. Please try again.", "error");
    }
  };

  return logout;
};

export default useLogout;
