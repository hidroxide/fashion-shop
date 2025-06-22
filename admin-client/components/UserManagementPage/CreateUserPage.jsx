import React, { useState } from "react";
import axios from "axios";
import { Input, Button, message } from "antd";
import Header from "@/components/Header";
import Heading from "@/components/Heading";

const CreateUserPage = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    customer_name: "",
    phone_number: "",
    address: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    if (!formData.email || !formData.password) {
      message.error("Email và mật khẩu là bắt buộc");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/admin/users", formData);
      message.success("Tạo người dùng thành công");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      message.error("Tạo người dùng thất bại");
    }
  };

  return (
    <div className="create-user-page">
      <Header title="Thêm người dùng" />
      <div className="wrapper">
        <Heading title="Thông tin người dùng" />
        <div className="form-group">
          <label>Email</label>
          <Input
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <Input.Password
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Nhập mật khẩu"
          />
        </div>
        <div className="form-group">
          <label>Tên khách hàng</label>
          <Input
            value={formData.customer_name}
            onChange={(e) => handleChange("customer_name", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <Input
            value={formData.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <Input
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <Button type="primary" onClick={handleCreate}>
          Thêm người dùng
        </Button>
      </div>
    </div>
  );
};

export default CreateUserPage;
