import { useEffect } from "react";
import refreshAccessToken from "./refreshAccessToken";
import { useAuthStore } from "../store/useAuthStore";

const useTokenRefresh = () => {
  useEffect(() => {
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      return;
    }

    if (!accessToken) {
      refreshAccessToken().then(() => {});
    }

    const refreshTokenInterval = setInterval(async () => {
      await refreshAccessToken();
    }, 420000); // 14.5 minutes

    return () => {
      clearInterval(refreshTokenInterval);
    };
  }, []);
};

export default useTokenRefresh;
