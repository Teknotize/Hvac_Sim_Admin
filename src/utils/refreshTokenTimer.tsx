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

    if(!accessToken) {
    // ✅ Refresh once immediately
    refreshAccessToken().then(() => {
      console.log("Access token refreshed immediately after login");
    });
    }
    // ✅ Set interval to refresh token every 14.5 minutes
    const refreshTokenInterval = setInterval(async () => {
      console.log("Inside interval - attempting refresh");
      await refreshAccessToken();
      console.log("Access token refreshed via interval");
    }, 870000); // 14.5 minutes

    return () => {
      console.log("Clearing interval on unmount");
      clearInterval(refreshTokenInterval);
    };
  }, []); // ✅ Runs once on mount

};

export default useTokenRefresh;
