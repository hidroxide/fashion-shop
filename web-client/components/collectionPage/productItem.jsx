import { StarFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { formatRate } from "@/helpers/format";

const ProductItem = (props) => {
  return (
    <div className="product-item col-6 col-md-4 col-lg-3 col-xxl">
      <Link
        href={{
          pathname: `/product/${props.product_id}`,
          query: { colour: props.colour_id },
        }}
      >
        <div className="product-thumbnails position-relative">
          <Image className="img" src={props.img} fill alt={props.name} />
          <div className="position-absolute rate-box">
            <span className="d-flex justify-content-start align-items-center mt-1">
              <span
                className="rating-box text-dark px-2 py-1 rounded d-flex align-items-center gap-1"
                style={{
                  backgroundColor: "#fff9e6",
                  border: "1px solid #ffdd57",
                }}
              >
                <span className="rating d-flex justify-content-start align-items-center">
                  {formatRate(props.rating)}
                </span>
                <StarFilled className="d-flex justify-content-start align-items-center text-warning" />
              </span>

              <span className="sold_quantity d-flex justify-content-start align-items-center ms-2">
                Đã bán {props.sold}
              </span>
            </span>
          </div>
        </div>
      </Link>
      <div className="infor-product">
        <Link
          href={{
            pathname: `/product/${props.product_id}`,
            query: { colour: props.colour_id },
          }}
        >
          <h6>{props.name}</h6>
        </Link>
        <div className="d-flex justify-content-start">
          <p className="price-after text-danger fw-bold">{props.price}đ</p>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductItem);
