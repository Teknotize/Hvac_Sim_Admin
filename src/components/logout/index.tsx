import { useNavigate } from "react-router-dom";
import useToastStore from "../../store/useToastStore";
import { apiClient } from "../../config";
import { useAuthStore } from "../../store/useAuthStore"; // ✅ Import Zustand auth store

const useLogout = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast); // ✅ Access the showToast function
  const clearTokens = useAuthStore.getState().clearTokens; // ✅ Get Zustand's clearTokens

  const logout = async () => {
    try {
      const result = await apiClient.post("auth/logout");

      if (!result.data.success) {
        throw new Error(result.data.message || "Logout failed.");
      }
  
      clearTokens();

      showToast("Logged out successfully!", "success");

      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      showToast(error.message || "Logout failed. Please try again.", "error");
    }
  };

  return logout;
};

export default useLogout;
