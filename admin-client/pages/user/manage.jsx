import React, { useState, useEffect } from "react";
import axios from "axios";
import { Empty } from "antd";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import UserAdmin from "@/components/UserManagementPage/UserAdmin";
import Router from "next/router";

const UserManagementPage = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/users");
      setUserList(res.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="user-manager">
      <Header title="Quản lý người dùng" />
      <div className="wrapper manager-box">
        <div className="to-add-product-page">
          <button
            onClick={() => Router.push("/user/create")}
            className="to-add-product-page-btn"
          >
            Thêm người dùng
          </button>
        </div>
        <Heading title="Tất cả người dùng" />
        <div className="wrapper-user-admin table-responsive">
          <table className="table user-admin w-100">
            <thead className="w-100 align-middle text-center">
              <tr className="fs-6 w-100">
                <th className="col-email">Email</th>
                <th className="col-name">Tên khách hàng</th>
                <th className="col-phone">Số điện thoại</th>
                <th className="col-address">Địa chỉ</th>
                <th className="col-action">Thao tác</th>
              </tr>
            </thead>
            <tbody className="w-100 text-center">
              {userList.length ? (
                userList.map((user, index) => (
                  <UserAdmin
                    key={index}
                    user={user}
                    refreshUsers={fetchUsers}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <Empty />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
