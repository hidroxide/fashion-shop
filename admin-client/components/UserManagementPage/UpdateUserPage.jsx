import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button, message } from "antd";
import Header from "@/components/Header";
import Heading from "@/components/Heading";

const UpdateUserPage = ({ user_id, onSuccess }) => {
  const [userData, setUserData] = useState({
    email: "",
    customer_name: "",
    phone_number: "",
    address: "",
    new_password: "", // Thêm vào đây
  });

  useEffect(() => {
    if (user_id) fetchUser();
  }, [user_id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/users/${user_id}`
      );
      const { email, Customer_Info } = res.data.user;
      setUserData({
        email,
        customer_name: Customer_Info.customer_name,
        phone_number: Customer_Info.phone_number,
        address: Customer_Info.address,
        new_password: "", // reset lại khi fetch
      });
    } catch (err) {
      console.error(err);
      message.error("Không thể lấy dữ liệu người dùng");
    }
  };

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/users/${user_id}`,
        userData
      );
      message.success("Cập nhật người dùng thành công");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại, vui lòng thử lại");
    }
  };

  return (
    <div className="update-user-page">
      <Header title="Cập nhật người dùng" />
      <div className="wrapper">
        <Heading title="Thông tin người dùng" />
        <div className="form-group">
          <label>Email</label>
          <Input
            value={userData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu mới</label>
          <Input.Password
            value={userData.new_password}
            onChange={(e) => handleChange("new_password", e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
        </div>
        <div className="form-group">
          <label>Tên khách hàng</label>
          <Input
            value={userData.customer_name}
            onChange={(e) => handleChange("customer_name", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <Input
            value={userData.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <Input
            value={userData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <Button type="primary" onClick={handleUpdate}>
          Cập nhật
        </Button>
      </div>
    </div>
  );
};

export default UpdateUserPage;
