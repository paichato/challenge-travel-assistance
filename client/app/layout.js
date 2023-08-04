import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const router = useRouter();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
