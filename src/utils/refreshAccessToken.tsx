import axios from "axios";
import { BASE_URL } from "../config";
import { useAuthStore } from "../store/useAuthStore";
async function refreshAccessToken() {
    try {
        const { refreshToken, setTokens } = useAuthStore.getState(); // ✅ Access Zustand store

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // ✅ Store new tokens in Zustand instead of localStorage
        setTokens(accessToken, newRefreshToken);

        return accessToken;
    } catch (error) {
        console.error("Failed to refresh access token:", error);

        // ✅ If refresh fails, clear Zustand store & redirect
        useAuthStore.getState().clearTokens();
        window.location.href = "/login";

        return null;
    }
}

export default refreshAccessToken;
