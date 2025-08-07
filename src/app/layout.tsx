// src/app/layout.tsx
import "../styles/globals.css";

export const metadata = {
  title: "User Dashboard",
  description: "Protected CRUD dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
