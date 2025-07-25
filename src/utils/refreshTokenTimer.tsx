import { useEffect } from "react";
import refreshAccessToken from "./refreshAccessToken";
import { useAuthStore } from "../store/useAuthStore";

const useTokenRefresh = () => {
  console.log("Hook initialized");

  useEffect(() => {
    const { accessToken } = useAuthStore.getState(); // ✅ Get token from Zustand
    console.log("Retrieved access token:", accessToken);

    if (!accessToken) {
      console.log("No access token, skipping refresh setup");
      return;
    }

    console.log("Access token exists, setting up refresh");

    if (!accessToken) {
      // ✅ Refresh once immediately
      refreshAccessToken().then(() => {
        console.log("Access token refreshed immediately after login");
      });
    }

    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    const refreshTokenInterval = setInterval(async () => {
      console.log("Inside interval - attempting refresh");
      await refreshAccessToken();
      console.log("Access token refreshed via interval");
    // }, 420000); // 14.5 minutes
}, TWENTY_FOUR_HOURS)
    return () => {
      console.log("Clearing interval on unmount");
      clearInterval(refreshTokenInterval);
    };
  }, []); // ✅ Runs once on mount
};

export default useTokenRefresh;
