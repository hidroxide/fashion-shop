import axiosClient from "@/services/axiosClient";

const productService = {
  getProductList: async ({ category, search, sort }) => {
    return await axiosClient.get("/product/customer/list", {
      params: {
        ...(category && { category }),
        ...(search && { search }),
        ...(sort && { sort }),
      },
    });
  },

  getDetail: async (productId) => {
    return await axiosClient.get(`/product/customer/detail/${productId}`);
  },

  getColourList: async (productId) => {
    return await axiosClient.get(`/product/customer/list-colour/${productId}`);
  },

  getSizeList: async (productId, colourId) => {
    return await axiosClient.get(
      `/product/customer/list-size/${productId}/${colourId}`
    );
  },

  getVariant: async (productId, colourId, sizeId) => {
    return axiosClient.get(
      `/product-variant/customer/detail/${productId}/${colourId}/${sizeId}`
    );
  },

  searchProduct: async (keyword) => {
    return await axiosClient.get(`/product/customer/search`, {
      params: { search: keyword },
    });
  },

  getNewestProducts: async (limit = 5) => {
    return await axiosClient.get("/product/customer/newest", {
      params: { limit },
    });
  },

  getBestSellingProducts: async (limit = 5) => {
    return await axiosClient.get("/product/customer/best-seller", {
      params: { limit },
    });
  },
};

export default productService;
