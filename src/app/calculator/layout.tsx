export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50 overflow-y-auto">
      {children}
    </main>
  );
}
