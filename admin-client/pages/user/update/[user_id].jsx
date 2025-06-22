import React from "react";
import { useRouter } from "next/router";
import UpdateUserPage from "@/components/UserManagementPage/UpdateUserPage";

const UpdateUser = () => {
  const router = useRouter();
  const { user_id } = router.query;

  return (
    <UpdateUserPage
      user_id={user_id}
      onSuccess={() => router.push("/user/manage")}
    />
  );
};

export default UpdateUser;
