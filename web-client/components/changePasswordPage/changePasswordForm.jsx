import InputField from "@/components/inputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { object, ref, string } from "yup";

const ChangePasswordForm = ({ handleChangePassword }) => {
  const schema = object({
    oldPassword: string().trim().required("Vui lòng nhập mật khẩu cũ"),
    newPassword: string().trim().required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: string()
      .trim()
      .oneOf([ref("newPassword")], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu mới"),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    resolver: yupResolver(schema),
  });
  return (
    <form
      className="changePassword-tab"
      onSubmit={handleSubmit(handleChangePassword)}
    >
      <div className="title">Đổi mật khẩu</div>
      <div className="changePassword-tab-item col-12 row d-flex align-items-center">
        <div className="col-3">Mât khẩu cũ</div>
        <div className="col-7">
          <div className="mb-3">
            <InputField
              name="oldPassword"
              control={control}
              placeholder={"Nhập mật khẩu cũ"}
              password={true}
            />
          </div>
        </div>
      </div>
      <div className="changePassword-item col-12 row d-flex align-items-center">
        <div className="col-3">Mật khẩu mới</div>
        <div className="col-7">
          <div className="mb-3">
            <InputField
              name="newPassword"
              control={control}
              placeholder={"Nhập mật khẩu mới"}
              password={true}
            />
          </div>
        </div>
      </div>
      <div className="changePassword-item col-12 row d-flex align-items-center">
        <div className="col-3">Xác nhận mật khẩu mới</div>
        <div className="col-7">
          <div className="mb-3">
            <InputField
              name="confirmPassword"
              control={control}
              placeholder={"Nhập xác nhận mật khẩu mới"}
              password={true}
            />
          </div>
        </div>
      </div>
      <div className="changePassword-item col-12 row d-flex align-items-center">
        <div className="col-3">
          <div
            className={"btn-container" + (isSubmitting ? " btn-loading" : "")}
          >
            <Button htmlType="submit" loading={isSubmitting}>
              {!isSubmitting && "Đổi mật khẩu"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default memo(ChangePasswordForm);
