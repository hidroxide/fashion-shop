import { useQuery } from "@tanstack/react-query";
import { Empty, Breadcrumb, Select } from "antd";
import { useRouter } from "next/router";

import ProductItem from "@/components/productsPage/productItem";
import { formatPrice } from "@/helpers/format";
import queries from "@/queries";

const ProductsPage = () => {
  const router = useRouter();
  const { category, search, sort } = router.query;

  const { isError, error, data } = useQuery(
    queries.products.list({ category, search, sort })
  );

  if (isError) console.log(error);
  const productList = data?.data;
  const categoryTitle = productList?.[0]?.category_title;

  return (
    <>
      <Breadcrumb
        className="custom-breadcrumb"
        items={[
          { title: "Trang chủ", href: "/" },
          category && category !== "undefined"
            ? { title: "Danh mục", href: "/products" }
            : null,
          search
            ? { title: `Kết quả tìm kiếm: "${search}"` }
            : category && category !== "undefined"
            ? { title: categoryTitle || "..." }
            : sort === "sold_desc"
            ? { title: "Sản phẩm bán chạy" }
            : { title: "Tất cả sản phẩm" },
        ].filter(Boolean)} // lọc bỏ null
      />

      <div className="d-flex justify-content-end my-3 me-4">
        <Select
          value={sort || ""}
          style={{ width: 200 }}
          onChange={(value) => {
            router.push({
              pathname: "/products",
              query: {
                ...router.query,
                sort: value || undefined, // loại bỏ nếu rỗng
              },
            });
          }}
          options={[
            { value: "", label: "Sắp xếp mặc định" },
            { value: "asc", label: "Giá tăng dần" },
            { value: "desc", label: "Giá giảm dần" },
            { value: "sold_desc", label: "Bán chạy nhất" },
          ]}
        />
      </div>

      <div className="product-page container">
        <div className="product-list row pt-4 pb-4">
          {productList && productList.length ? (
            productList.map((product, index) => {
              const defaultVariant = product.variants?.[0];

              return (
                <ProductItem
                  key={index}
                  product_id={product.product_id}
                  name={product.product_name}
                  img={defaultVariant?.product_image}
                  price={formatPrice(defaultVariant?.price)}
                  colour_id={defaultVariant?.colour_id}
                  sizes={defaultVariant?.sizes}
                  rating={product.rating}
                  sold={product.sold}
                  feedback_quantity={product.feedback_quantity}
                />
              );
            })
          ) : (
            <div className="d-flex" style={{ width: "100%", height: "400px" }}>
              <Empty style={{ margin: "auto" }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
