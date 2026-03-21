import AuthLayout from "@/modules/auth/component/auth-layout";
import SignupForm from "@/modules/auth/component/signup-form";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>...Loading</div>}>
      <AuthLayout authType="signup">
        <SignupForm />
      </AuthLayout>
    </Suspense>
  );
};

export default page;
