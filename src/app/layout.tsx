import type { Metadata } from "next";
import { Noto_Sans_TC, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CompareProvider } from "@/lib/compare-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { organizationJsonLd, websiteJsonLd, jsonLdScript } from "@/lib/structured-data";

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
    siteName: site.nameZh,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nameZh} ${site.nameEn}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
  // SEO 架構（STEP 10）：
  // 平台本身是「資料層」，有實際內容需要被索引；
  // 個別頁面（/search、/admin-preview）另外用 robots 覆蓋為 noindex。
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK" className={`${notoTC.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd()) }}
        />
        <CompareProvider>
          <div className="flex min-h-screen flex-col">
            {/* 鍵盤使用者可以直接跳到主要內容（STEP 20 可及性） */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-[13.5px] focus:font-semibold focus:text-white"
            >
              跳到主要內容
            </a>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </CompareProvider>
      </body>
    </html>
  );
}
