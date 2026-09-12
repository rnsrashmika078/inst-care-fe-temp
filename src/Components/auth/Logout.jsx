import { HOME_BASE } from "../../config";

export const doFrontendLogout = () => {
  ["isLoggedIn", "token", "role", "user_id", "technician_id"].forEach((key) =>
    sessionStorage.removeItem(key),
  );
  window.location.href = `${HOME_BASE}/auth_api/logout`;
};