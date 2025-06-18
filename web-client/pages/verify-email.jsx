import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "antd";
import { FaTimes } from "react-icons/fa";

import { swtoast } from "@/mixins/swal.mixin";
import customerService from "@/services/customerService";

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await customerService.verifyEmail(token);
        setStatus("success");
        setMessage(res.data.message || "Xác thực thành công");
        swtoast.success({ text: res.data.message });
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Xác thực thất bại");
        swtoast.error({ text: err.response?.data?.message });
      }
    };

    verify();
  }, [token]);
  return (
    <div
      className="user verify-email w-100 position-absolute d-flex"
      onClick={() => router.push("/")}
    >
      <div
        className="user-box position-relative border-radius"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="header-form position-absolute"
          onClick={() => router.push("/")}
        >
          <FaTimes />
        </div>
        <div className="form-user form-verify">
          <h3 className="heading text-center">Xác thực Email</h3>
          <div className="mb-3 text-center">
            {status === "loading" && <p>Đang xác thực email...</p>}
            {status === "success" && <p className="text-success">{message}</p>}
            {status === "error" && <p className="text-danger">{message}</p>}
          </div>
          {status !== "loading" && (
            <div className="btn-container d-flex justify-content-center">
              <Button type="primary" onClick={() => router.push("/")}>
                Quay về trang chủ
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
