import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Create Account",
};

/**
 * RegisterPage — Server component wrapper
 *
 * Exports metadata (requires server component) and renders
 * the RegisterForm client component that handles all form logic.
 */
export default function RegisterPage() {
  return <RegisterForm />;
}
