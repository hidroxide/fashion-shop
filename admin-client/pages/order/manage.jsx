import React, { useState, useEffect } from "react";
import { Empty } from "antd";
import axios from "axios";

import Header from "@/components/Header";
import Heading from "@/components/Heading";
import OrderRow from "@/components/OrderManagementPage/OrderRow";

const OrderManagementPage = () => {
  let [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const getOrderList = async () => {
      try {
        const result = await axios.get(
          "http://localhost:8080/api/order/admin/list"
        );
        setOrderList(result.data);
      } catch (err) {
        console.log(err);
        // setOrderList(fakeOrderList);
      }
    };
    getOrderList();
  }, []);

  const refreshOrderTable = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/api/order/admin/list"
      );
      setOrderList(result.data);
    } catch (err) {
      console.log(err);
      setOrderList(fakeOrderList);
    }
  };

  return (
    <div className="">
      <Header title="Quản Lý Đơn Hàng" />
      <div className="wrapper manager-box">
        <Heading title="Tất cả đơn hàng" />
        <div className="wrapper-product-admin table-responsive">
          <table className="table order-manage-table w-100">
            <thead className="w-100 align-middle text-center">
              <tr className="fs-6 w-100">
                <th title="Mã đơn hàng" className="col-order-id">
                  Mã đơn hàng
                </th>
                <th title="Trạng thái" className="col-state">
                  Trạng thái
                </th>
                <th title="Ngày tạo" className="col-create-at">
                  Ngày tạo
                </th>
                <th title="Tổng giá trị" className="col-total-value">
                  Tổng giá trị
                </th>
                <th title="Thao tác" className="col-action manipulation">
                  Thao tác
                </th>
              </tr>
            </thead>
          </table>
          {orderList.length ? (
            orderList.map((order, index) => {
              return (
                <OrderRow
                  key={index}
                  order_id={order.order_id}
                  state_id={order.state_id}
                  state_name={order.state_name}
                  created_at={order.created_at}
                  total_order_value={order.total_order_value}
                  refreshOrderTable={refreshOrderTable}
                />
              );
            })
          ) : (
            <table
              className="table w-100 table-hover align-middle table-bordered"
              style={{ height: "400px" }}
            >
              <tbody>
                <tr>
                  <td colSpan={6}>
                    <Empty />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagementPage;
