import { useEffect, useState } from "react";

import AccountSidebar from "@/components/accountSidebar";
import useCustomerStore from "@/store/customerStore";

const ChangePassword = () => {
  const customerId = useCustomerStore(
    (state) => state.customerInfor?.customerId
  );
  return (
    <div className="change-password-page container">
      <div className="row">
        <div className="col-4">
          <AccountSidebar />
        </div>
        <div className="col-8">
          <h2>Đổi mật khẩu</h2>
          <form>
            <div className="form-group mb-3">
              <label>Mật khẩu hiện tại</label>
              <input type="password" className="form-control" />
            </div>

            <div className="form-group mb-3">
              <label>Mật khẩu mới</label>
              <input type="password" className="form-control" />
            </div>

            <div className="form-group mb-3">
              <label>Xác nhận mật khẩu mới</label>
              <input type="password" className="form-control" />
            </div>

            <button type="submit" className="btn btn-primary">
              Đổi mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
