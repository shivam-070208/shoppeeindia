import AuthLayout from "@/modules/auth/component/auth-layout";
import SignupForm from "@/modules/auth/component/signup-form";

const page = () => {
  return (
    <AuthLayout authType="signup">
      <SignupForm />
    </AuthLayout>
  );
};

export default page;
