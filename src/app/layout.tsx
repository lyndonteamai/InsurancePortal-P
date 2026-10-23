import type { Metadata } from "next";
import { Noto_Sans_TC, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CompareProvider } from "@/lib/compare-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const notoTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nameZh} ${site.nameEn}｜香港保險資訊及比較平台（Prototype）`,
    template: `%s｜${site.nameZh}（Prototype）`,
  },
  description: site.description,
  applicationName: site.nameZh,
  keywords: ["香港保險", "醫療保險", "危疾保險", "人壽保險", "旅遊保險", "保險比較", "保險知識"],
  openGraph: {
    title: `${site.nameZh} ${site.nameEn}`,
    description: site.description,
    type: "website",
    locale: "zh_HK",
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK" className={`${notoTC.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <CompareProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CompareProvider>
      </body>
    </html>
  );
}
