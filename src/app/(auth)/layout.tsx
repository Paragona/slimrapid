import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - RapidMove24",
  description: "Sign in or create an account with RapidMove24",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
