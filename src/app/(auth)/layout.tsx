import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - Destinopia",
  description: "Sign in or create an account with Destinopia",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
