import { useRouter } from "next/router";
import { swtoast } from "@/mixins/swal.mixin";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import { object, ref, string } from "yup";

import InputField from "@/components/inputField";
import customerService from "@/services/customerService";
import { useEffect } from "react";

const schema = object({
  newPassword: string()
    .required("Vui lòng nhập mật khẩu mới")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(255, "Mật khẩu không được vượt quá 255 ký tự"),
  confirmPassword: string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([ref("newPassword")], "Mật khẩu không khớp"),
});

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (router.isReady && !token) {
      swtoast.error({ text: "Token không hợp lệ hoặc đã hết hạn." });
      router.push("/"); // hoặc redirect tới trang quên mật khẩu
    }
  }, [router.isReady, token]);

  const onSubmit = async (values) => {
    console.log("Submitting values:", values);
    try {
      await customerService.resetPassword({
        token,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      });

      swtoast.success({ text: "Đặt lại mật khẩu thành công!" });

      setTimeout(() => {
        router.push("/"); // Chuyển hướng sang trang chủ hoặc login
      }, 1500);
    } catch (error) {
      swtoast.error({
        text: error.response?.data?.message || "Lỗi khi đặt lại mật khẩu",
      });
    }
  };

  return (
    <div className="reset-password container py-5">
      <h2 className="text-center mb-4">Đặt lại mật khẩu</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto"
        style={{ maxWidth: 400 }}
      >
        <div className="mb-3">
          <InputField
            name="newPassword"
            control={control}
            password
            placeholder="Mật khẩu mới"
          />
        </div>
        <div className="mb-3">
          <InputField
            name="confirmPassword"
            control={control}
            password
            placeholder="Xác nhận mật khẩu mới"
          />
        </div>
        <div className={"btn-container" + (isSubmitting ? " btn-loading" : "")}>
          <Button htmlType="submit" loading={isSubmitting}>
            {!isSubmitting && "Đặt lại mật khẩu"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
