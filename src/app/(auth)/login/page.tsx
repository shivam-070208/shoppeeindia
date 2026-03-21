import AuthLayout from "@/modules/auth/component/auth-layout";
import LoginForm from "@/modules/auth/component/login-form";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>...Loading</div>}>
      <AuthLayout authType="login">
        <LoginForm />{" "}
      </AuthLayout>
    </Suspense>
  );
};

export default page;
