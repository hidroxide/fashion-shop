import { useQuery } from "@tanstack/react-query";
import { Empty, Breadcrumb } from "antd";
import { useRouter } from "next/router";

import ProductItem from "@/components/collectionPage/productItem";
import { formatPrice } from "@/helpers/format";
import queries from "@/queries";

const CollectionPage = () => {
  const router = useRouter();
  const { category } = router.query;

  const { isError, error, data } = useQuery(queries.products.list(category));
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
            ? {
                title: "Danh mục",
                href: `/products?category=${category}`,
              }
            : { title: "Tất cả" },
          category && category !== "undefined" && { title: categoryTitle },
        ].filter(Boolean)}
      />
      <div className="product-page container">
        <div className="product-list row pt-4">
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

export default CollectionPage;
