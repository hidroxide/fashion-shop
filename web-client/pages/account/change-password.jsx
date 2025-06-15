import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback } from "react";

import AccountSidebar from "@/components/accountSidebar";
import ChangePasswordForm from "@/components/changePasswordPage/changePasswordForm";
import { swtoast } from "@/mixins/swal.mixin";
import queries from "@/queries";
import customerService from "@/services/customerService";

const ChangePassword = () => {
  return (
    <div className="change-password-page container">
      <div className="change-password row">
        <div className="col-4">
          <AccountSidebar />
        </div>
        <div className="col-8">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
