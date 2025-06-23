import axiosClient from "@/services/axiosClient";
import axiosJWT from "./axiosJWT";

const customerService = {
  register: async (data) => {
    return await axiosClient.post("/customer/register", data);
  },

  login: async (data) => {
    return await axiosClient.post("/customer/login", data);
  },

  logout: async () => {
    return await axiosClient.post("/customer/logout");
  },

  refreshAccessToken: async () => {
    return await axiosClient.post("/customer/refresh");
  },

  getInfor: async () => {
    return await axiosJWT.get("/customer/infor");
  },

  update: async (data) => {
    return await axiosJWT.put("/customer/update", data);
  },

  changePassword: async (data) => {
    return await axiosJWT.put("/customer/change-password", data);
  },

  verifyEmail: async (token) => {
    return await axiosClient.get("/customer/verify-email", {
      params: { token },
    });
  },

  forgotPassword: async (data) => {
    return await axiosClient.post("/customer/forgot-password", data);
  },

  resetPassword: async ({ token, new_password, confirm_password }) => {
    return await axiosClient.put("/customer/reset-password", {
      token,
      new_password,
      confirm_password,
    });
  },

  googleLogin: async (credential) => {
    return await axiosClient.post("/customer/google-login", {
      credential,
    });
  },
};

export default customerService;
