import React from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { swtoast, swalert } from "@/mixins/swal.mixin"; // nếu bạn dùng mixin toast
import axios from "axios";

const UserAdmin = ({ user, refreshUsers }) => {
  const handleDelete = async () => {
    const result = await swalert.fire({
      title: "Xóa người dùng?",
      text: "Bạn có chắc chắn muốn xóa người dùng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8080/api/admin/users/${user.user_id}`
        );
        swtoast.success({ text: "Xoá người dùng thành công" });
        refreshUsers();
      } catch (err) {
        console.error(err);
        swtoast.error({ text: "Xoá người dùng thất bại" });
      }
    }
  };

  return (
    <tr>
      <td className="col-email">{user.email}</td>
      <td className="col-name">{user.Customer_Info?.customer_name}</td>
      <td className="col-phone">{user.Customer_Info?.phone_number}</td>
      <td className="col-address">{user.Customer_Info?.address}</td>
      <td className="col-action">
        <FaTrash
          className="action-icon delete"
          onClick={handleDelete}
          title="Xoá người dùng"
        />
      </td>
    </tr>
  );
};

export default UserAdmin;
