import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { object, string } from "yup";

import InputField from "@/components/inputField";
import { swtoast } from "@/mixins/swal.mixin";
import customerService from "@/services/customerService";
import useCustomerStore from "@/store/customerStore";
import { useEffect, useRef } from "react";
import jwtDecode from "jwt-decode";

const Login = (props) => {
  const setCustomerLogin = useCustomerStore((state) => state.setCustomerLogin);
  const schema = object({
    email: string()
      .trim()
      .required("Vui lòng nhập Email của bạn")
      .max(255, "Email không được vượt quá 255 ký tự")
      .email("Email không hợp lệ"),
    password: string()
      .trim()
      .required("Vui lòng nhập Mật khẩu của bạn")
      .max(255, "Mật khẩu không được vượt quá 255 ký tự"),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schema),
  });

  const handleLogin = async (values) => {
    try {
      const respond = await customerService.login(values);
      const customerInfor = {
        accessToken: respond?.data?.access_token,
        accessTokenExpires: respond?.data?.access_token_expires,
      };
      setCustomerLogin(customerInfor);
      swtoast.success({
        text: "Đăng nhập tài khoản thành công!",
      });
      props.toClose();
    } catch (error) {
      swtoast.error({
        text: error.response?.data?.message,
      });
    }
  };

  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (window.google && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // bạn cần khai báo env này
        callback: handleGoogleLogin,
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    }
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const res = await customerService.googleLogin(response.credential);
      const customerInfor = {
        accessToken: res?.data?.access_token,
        accessTokenExpires: res?.data?.access_token_expires,
      };
      setCustomerLogin(customerInfor);
      swtoast.success({
        text: "Đăng nhập bằng Google thành công!",
      });
      props.toClose();
    } catch (error) {
      swtoast.error({
        text: error.response?.data?.message || "Đăng nhập Google thất bại",
      });
    }
  };

  return (
    <div
      className="user login w-100 position-absolute d-flex"
      onClick={props.toClose}
    >
      <div
        className="user-box position-relative login-box text-center border-radius"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="header-form position-absolute" onClick={props.toClose}>
          <FaTimes />
        </div>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="form-user form-login"
        >
          <h3 className="heading">Đăng nhập</h3>
          <div className="mb-3">
            <InputField name="email" control={control} placeholder={"Email"} />
          </div>
          <div className="mb-3">
            <InputField
              name="password"
              control={control}
              password
              placeholder={"Mật khẩu"}
            />
          </div>
          <div
            className={"btn-container" + (isSubmitting ? " btn-loading" : "")}
          >
            <Button htmlType="submit" loading={isSubmitting}>
              {!isSubmitting && "Đăng nhập"}
            </Button>
          </div>
        </form>
        <div className="mt-3">
          <div id="google-login-btn" ref={googleBtnRef}></div>
        </div>

        <div className="footer-form d-flex justify-content-center flex-column align-items-center">
          {!isSubmitting && (
            <>
              <div className="footer-form-item">
                Bạn chưa có tài khoản?{" "}
                <a href="#" onClick={props.toRegister}>
                  Đăng ký
                </a>
              </div>
              <a
                className="footer-form-item"
                href="#"
                onClick={props.toForgotPassword}
              >
                Quên mật khẩu?
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
