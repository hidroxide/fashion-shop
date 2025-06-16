import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback } from "react";

import AccountSidebar from "@/components/accountSidebar";
import ChangePasswordForm from "@/components/changePasswordPage/changePasswordForm";
import { swtoast } from "@/mixins/swal.mixin";
import queries from "@/queries";
import customerService from "@/services/customerService";

const ChangePasswordPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleChangePassword = useCallback(async (formData) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = formData;

      await customerService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      swtoast.success({ text: "Đổi mật khẩu thành công!" });

      // Optional: redirect hoặc logout sau khi đổi mật khẩu
      // await customerService.logout();
      router.push("/");
    } catch (err) {
      console.log(err);
      swtoast.error({
        text: "Có lỗi khi cập nhật tài khoản vui lòng thử lại!",
      });
    }
  }, []);

  return (
    <div className="change-password-page container">
      <div className="change-password row">
        <div className="col-4">
          <AccountSidebar />
        </div>
        <div className="col-8">
          <ChangePasswordForm handleChangePassword={handleChangePassword} />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
