import { createQueryKeys } from "@lukemorales/query-key-factory";

import feedbackService from "@/services/feedbackService";
import productService from "@/services/productService";

export default createQueryKeys("products", {
  list: (params) => ({
    queryKey: ["list", params],
    queryFn: () => productService.getProductList(params),
  }),

  detail: (productId) => {
    return {
      queryKey: [productId],
      queryFn: () => productService.getDetail(productId),
    };
  },
  feedbackList: (productId) => {
    return {
      queryKey: [productId],
      queryFn: () => feedbackService.getFeedBackList(productId),
    };
  },
  colourList: (productId) => {
    return {
      queryKey: [productId],
      queryFn: () => productService.getColourList(productId),
    };
  },
  sizeList: (productId, colourList, selectedColourIndex) => {
    const colourId =
      colourList &&
      selectedColourIndex != null &&
      colourList[selectedColourIndex]?.colour_id;
    return {
      queryKey: [productId, colourId],
      queryFn: () => productService.getSizeList(productId, colourId),
    };
  },
  variant: (
    productId,
    colourList,
    selectedColourIndex,
    sizeList,
    selectedSizeIndex
  ) => {
    const colourId =
      colourList &&
      selectedColourIndex != null &&
      colourList[selectedColourIndex]?.colour_id;
    const sizeId =
      sizeList &&
      selectedSizeIndex != null &&
      sizeList[selectedSizeIndex]?.size_id;
    return {
      queryKey: [productId, colourId, sizeId],
      queryFn: () => productService.getVariant(productId, colourId, sizeId),
    };
  },

  newest: (limit = 5) => ({
    queryKey: ["newest", limit],
    queryFn: () => productService.getNewestProducts(limit),
  }),

  bestSelling: (limit = 5) => ({
    queryKey: ["bestSelling", limit],
    queryFn: () => productService.getBestSellingProducts(limit),
  }),
});
