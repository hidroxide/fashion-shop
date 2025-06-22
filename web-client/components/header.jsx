import { swalert, swtoast } from "@/mixins/swal.mixin";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { FaAngleDown, FaShoppingCart } from "react-icons/fa";
import { AutoComplete } from "antd";

import logo from "@/public/img/logo.png";
import queries from "@/queries";
import customerService from "@/services/customerService";
import productService from "@/services/productService";
import useCustomerStore from "@/store/customerStore";
import useCartStore from "@/store/cartStore";
import Login from "./login";
import Register from "./register";
import ForgotPassword from "./forgotPassword";

const Header = () => {
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
  const setCustomerLogout = useCustomerStore(
    (state) => state.setCustomerLogout
  );

  const { isError, error, data } = useQuery({
    ...queries.categories.list(),
  });
  if (isError) console.log(error);
  const categoryList = data?.data;

  const toClose = () => {
    setIsLogInOpen(false);
    setIsRegisterOpen(false);
  };

  const handleLoginClick = () => {
    setIsLogInOpen(true);
  };

  const handleLogoutClick = () => {
    swalert
      .fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            await customerService.logout();
            return { isError: false };
          } catch (error) {
            console.log(error);
            return { isError: true };
          }
        },
        title: "Đăng xuất",
        icon: "warning",
        text: "Bạn muốn đăng xuất?",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setCustomerLogout();
          swtoast.success({ text: "Đăng xuất thành công!" });
        }
      });
  };

  const cartItems = useCartStore((state) => state.productList);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState([]);
  const router = useRouter();

  const handleSearch = async (value) => {
    setSearchValue(value);
    if (!value) {
      setOptions([]);
      return;
    }

    try {
      const res = await productService.searchProduct(value);
      const productList = res.data;

      const formattedOptions = productList.map((product) => {
        const defaultColourId = product.variants?.[0]?.colour_id || 1;

        return {
          value: `${product.product_id}|${defaultColourId}`,
          label: (
            <div className="d-flex align-items-center gap-2">
              <img
                src={product.variants?.[0]?.product_image || "/img/default.jpg"}
                alt="thumb"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <span>{product.product_name}</span>
            </div>
          ),
          product_name: product.product_name,
        };
      });

      setOptions(formattedOptions);
    } catch (error) {
      console.log("Search error", error);
    }
  };

  const handleSelect = (value) => {
    const [productId, colourId] = value.split("|");
    setSearchValue("");
    router.push(`/product/${productId}?colour=${colourId}`);
  };

  return (
    <div className="header-wrapper position-relation">
      {!isLoggedIn && (
        <>
          <div className={!isLogInOpen ? `d-none` : ""}>
            <Login
              toRegister={() => {
                setIsLogInOpen(false);
                setIsRegisterOpen(true);
              }}
              toForgotPassword={() => {
                setIsLogInOpen(false);
                setIsForgotOpen(true);
              }}
              toClose={() => {
                setIsLogInOpen(false);
                setIsRegisterOpen(false);
                setIsForgotOpen(false);
              }}
            />
          </div>

          <div className={!isRegisterOpen ? `d-none` : ""}>
            <Register
              toLogin={() => {
                setIsRegisterOpen(false);
                setIsLogInOpen(true);
              }}
              toClose={() => {
                setIsLogInOpen(false);
                setIsRegisterOpen(false);
                setIsForgotOpen(false);
              }}
            />
          </div>

          <div className={!isForgotOpen ? `d-none` : ""}>
            <ForgotPassword
              toLogin={() => {
                setIsForgotOpen(false);
                setIsLogInOpen(true);
              }}
              toClose={() => {
                setIsLogInOpen(false);
                setIsRegisterOpen(false);
                setIsForgotOpen(false);
              }}
            />
          </div>
        </>
      )}

      <div className="header w-100 d-flex align-items-center">
        <div className="logo-box p-2">
          <Link href="/">
            <Image className="logo" src={logo} alt="" />
          </Link>
        </div>
        <ul className="menu p-2">
          <li className="menu-item fw-bold text-uppercase position-relative">
            <Link href="/" className="d-flex align-items-center">
              Trang chủ
            </Link>
          </li>
          {categoryList &&
            categoryList.map((categoryLevel1, index) => {
              return (
                <li
                  className="menu-item fw-bold text-uppercase position-relative"
                  key={index}
                >
                  <Link href="#" className="d-flex align-items-center">
                    {categoryLevel1.title}
                    <span>
                      <FaAngleDown />
                    </span>
                  </Link>
                  <ul className="sub-menu position-absolute">
                    {categoryLevel1.children &&
                      categoryLevel1.children.map((category, index) => {
                        return (
                          <li key={index} className="w-100">
                            <Link
                              href={{
                                pathname: "/products",
                                query: {
                                  category: category.category_id,
                                },
                              }}
                            >
                              {category.title}
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </li>
              );
            })}
        </ul>

        <div className="search-box px-2" style={{ width: "300px" }}>
          <AutoComplete
            style={{ width: "100%" }}
            placeholder="Tìm kiếm"
            options={options}
            value={searchValue}
            onChange={(val) => setSearchValue(val)}
            onSearch={handleSearch}
            onSelect={handleSelect}
            allowClear
            optionLabelProp="label"
            filterOption={false}
          />
        </div>

        <ul className="menu p-5 ms-auto">
          {!isLoggedIn ? (
            <li
              onClick={handleLoginClick}
              className="menu-item fw-bold text-uppercase"
            >
              <a href="#">Đăng Nhập</a>
            </li>
          ) : (
            <>
              <li className="menu-item fw-bold text-uppercase position-relative">
                <Link href="#" className="d-flex align-items-center">
                  Tài Khoản
                  <span>
                    <FaAngleDown />
                  </span>
                </Link>
                <ul className="sub-menu position-absolute">
                  <li className="w-100">
                    <Link href="/account/infor">Thông Tin</Link>
                  </li>
                  <li className="w-100" onClick={handleLogoutClick}>
                    <a href="#">Đăng Xuất</a>
                  </li>
                </ul>
              </li>
            </>
          )}
          <li className="cart menu-item fw-bold text-uppercase position-relative">
            <Link href="/cart">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="cart-count position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger mt-4">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
