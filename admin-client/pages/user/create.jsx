import React from "react";
import { useRouter } from "next/router";
import CreateUserPage from "@/components/UserManagementPage/CreateUserPage";

const CreateUser = () => {
  const router = useRouter();

  return <CreateUserPage onSuccess={() => router.push("/user/manage")} />;
};

export default CreateUser;
