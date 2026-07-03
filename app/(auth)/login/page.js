import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign In",
};

/**
 * LoginPage — Server component wrapper
 *
 * Exports metadata (requires server component) and renders
 * the LoginForm client component that handles all form logic.
 */
export default function LoginPage() {
  return <LoginForm />;
}
