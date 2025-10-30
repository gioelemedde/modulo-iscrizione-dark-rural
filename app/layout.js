import CookieBanner from "./cookies";
import "./globals.css";
export const metadata = {
  title: "dark rural",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
