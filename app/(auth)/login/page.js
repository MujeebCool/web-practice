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
export default function LoginPage({ searchParams }) {
  const nextPath =
    typeof searchParams?.next === "string" &&
    searchParams.next.startsWith("/") &&
    !searchParams.next.startsWith("//")
      ? searchParams.next
      : "/dashboard";

  return (
    <LoginForm
      nextPath={nextPath}
      authError={searchParams?.error === "auth_callback_failed"}
      registered={searchParams?.registered === "1"}
      confirmed={searchParams?.confirmed === "1"}
    />
  );
}
