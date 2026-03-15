import AuthLayout from "@/modules/auth/component/auth-layout";
import LoginForm from "@/modules/auth/component/login-form";

const page = () => {
  return (
    <AuthLayout authType="login">
      <LoginForm />{" "}
    </AuthLayout>
  );
};

export default page;
