import { swtoast } from "@/mixins/swal.mixin";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { object, ref, string } from "yup";

import InputField from "@/components/inputField";
import customerService from "@/services/customerService";
import useCustomerStore from "@/store/customerStore";

const Register = (props) => {
  const setCustomerLogin = useCustomerStore((state) => state.setCustomerLogin);
  const schema = object({
    fullName: string()
      .trim()
      .required("Vui lòng nhập Họ và tên của bạn")
      .max(255, "Họ và tên không được vượt quá 255 ký tự"),
    phoneNumber: string()
      .trim()
      .required("Vui lòng nhập Số điện thoại của bạn")
      .matches(/^\d{10}$/, "Số điện thoại không hợp lệ"),
    email: string()
      .trim()
      .required("Vui lòng nhập Email của bạn")
      .max(255, "Email không được vượt quá 255 ký tự")
      .email("Email không hợp lệ"),
    password: string()
      .trim()
      .required("Vui lòng nhập Mật khẩu của bạn")
      .max(255, "Mật khẩu không được vượt quá 255 ký tự"),
    confirmPassword: string()
      .trim()
      .required("Vui lòng nhập Mật khẩu của bạn")
      .oneOf([ref("password"), null], "Mật khẩu nhập lại không khớp")
      .max(255, "Mật khẩu không được vượt quá 255 ký tự"),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const handleRegister = async (values) => {
    try {
      const data = {
        email: values.email,
        password: values.password,
        customer_name: values.fullName,
        phone_number: values.phoneNumber,
      };
      await customerService.register(data); // Không cần lấy access token

      swtoast.success({
        text: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
      });

      props.toLogin(); // Chuyển về form đăng nhập
    } catch (error) {
      swtoast.error({
        text: error.response?.data?.message,
      });
    }
  };

  return (
    <div
      className="user register w-100 position-absolute d-flex"
      onClick={props.toClose}
    >
      <div
        className="user-box position-relative register-box border-radius"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="header-form position-absolute" onClick={props.toClose}>
          <FaTimes />
        </div>
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="form-user form-register"
        >
          <h3 className="heading text-center">Đăng ký tài khoản</h3>
          <div className="mb-3">
            <InputField
              name="fullName"
              control={control}
              placeholder={"Họ và tên"}
            />
          </div>
          <div className="mb-3">
            <InputField
              name="phoneNumber"
              control={control}
              placeholder={"Số điện thoại"}
            />
          </div>
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
          <div className="mb-3">
            <InputField
              name="confirmPassword"
              control={control}
              password
              placeholder={"Nhập lại mật khẩu"}
            />
          </div>
          <div
            className={"btn-container" + (isSubmitting ? " btn-loading" : "")}
          >
            <Button htmlType="submit" loading={isSubmitting}>
              {!isSubmitting && "Đăng ký"}
            </Button>
          </div>
        </form>
        <div className="footer-form d-flex justify-content-center">
          <a className="footer-form-item" href="#" onClick={props.toLogin}>
            Trở lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
