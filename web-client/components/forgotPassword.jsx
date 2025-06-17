import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { object, string } from "yup";

import InputField from "@/components/inputField";
import { swtoast } from "@/mixins/swal.mixin";
import customerService from "@/services/customerService";

const ForgotPassword = (props) => {
  const schema = object({
    email: string()
      .trim()
      .required("Vui lòng nhập Email")
      .max(255, "Email không được vượt quá 255 ký tự")
      .email("Email không hợp lệ"),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { email: "" },
    resolver: yupResolver(schema),
  });

  const handleForgotPassword = async (values) => {
    try {
      await customerService.forgotPassword(values); // Gửi email reset
      swtoast.success({
        text: "Vui lòng kiểm tra email để đặt lại mật khẩu.",
      });
      props.toClose(); // Đóng form
    } catch (error) {
      swtoast.error({
        text: error.response?.data?.message || "Đã xảy ra lỗi!",
      });
    }
  };

  return (
    <div
      className="user forgot-password w-100 position-absolute d-flex"
      onClick={props.toClose}
    >
      <div
        className="user-box position-relative forgot-box text-center border-radius"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="header-form position-absolute" onClick={props.toClose}>
          <FaTimes />
        </div>
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="form-user form-forgot"
        >
          <h3 className="heading">Quên mật khẩu</h3>
          <div className="mb-3">
            <InputField
              name="email"
              control={control}
              placeholder={"Nhập email của bạn"}
            />
          </div>
          <div
            className={"btn-container" + (isSubmitting ? " btn-loading" : "")}
          >
            <Button htmlType="submit" loading={isSubmitting}>
              {!isSubmitting && "Gửi yêu cầu"}
            </Button>
          </div>
        </form>
        <div className="footer-form d-flex justify-content-center">
          {!isSubmitting && (
            <a className="footer-form-item" href="#" onClick={props.toLogin}>
              Trở lại đăng nhập
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
