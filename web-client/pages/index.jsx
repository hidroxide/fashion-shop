import { useQuery } from "@tanstack/react-query";
import Slider from "@/components/slider";
import { ArrowUpOutlined, FireOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import ProductItem from "@/components/productsPage/productItem";
import { formatPrice } from "@/helpers/format";
import queries from "@/queries";

const HomePage = () => {
  const { data: newestData, isLoading: isNewestLoading } = useQuery(
    queries.products.newest(5)
  );

  const { data: bestData, isLoading: isBestLoading } = useQuery(
    queries.products.bestSelling(5)
  );

  const renderProduts = (list) => {
    const productList = list?.data;

    if (!productList.length) {
      return (
        <div className="d-flex" style={{ width: "100%", height: "300px" }}>
          <Empty style={{ margin: "auto" }} />
        </div>
      );
    }
    return productList.map((product) => {
      const variant = product.variants?.[0];

      return (
        <ProductItem
          product_id={product.product_id}
          name={product.product_name}
          img={variant?.product_image}
          price={formatPrice(variant?.price)}
          colour_id={variant?.colour_id}
          sizes={variant?.sizes}
          rating={product.rating}
          sold={product.sold}
          feedback_quantity={product.feedback_quantity}
        />
      );
    });
  };

  return (
    <>
      <div className="homepage">
        <div className="container-fluid g-0">
          <Slider />
        </div>
      </div>
      <div className="container mt-5 mb-5">
        <div className="section-title d-flex align-items-center gap-2">
          <ArrowUpOutlined />
          <h4 className="m-0">Sản phẩm mới nhất</h4>
        </div>
        <div className="product-page container">
          <div className="product-list row pt-4">
            {isNewestLoading ? <p>Đang tải...</p> : renderProduts(newestData)}
          </div>
        </div>
        <div className="section-title mt-5 d-flex align-items-center gap-2">
          <FireOutlined />
          <h4 className="m-0">Sản phẩm bán chạy</h4>
        </div>
        <div className="product-page container">
          <div className="product-list row pt-4">
            {isBestLoading ? <p>Đang tải...</p> : renderProduts(bestData)}
          </div>
        </div>
      </div>
    </>
  );
};
export default HomePage;
