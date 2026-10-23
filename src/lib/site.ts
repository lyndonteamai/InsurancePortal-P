export const site = {
  nameZh: "保險指南",
  nameEn: "Insurance Compass HK",
  tagline: "香港保險，先了解，再選擇。",
  description:
    "保險指南（Insurance Compass HK）是一個香港保險資訊及比較平台原型，整理不同保險類別的保障內容、條款重點及常見問題，協助消費者在投保前先了解。",
  url: "https://prototype.insurancecompass.hk",
  isPrototype: true,
  prototypeNotice:
    "本網站為 Prototype 演示項目。所有保險公司名稱、產品、條款、保費及文章內容均為虛構模擬資料，並非真實香港保險市場的產品或報價，亦不構成任何保險、法律或投資建議。",
  contact: {
    email: "hello@prototype.insurancecompass.hk",
    address: "香港 · Prototype 團隊",
    hours: "星期一至五 10:00 – 18:00（示例）",
  },
};

export const navItems = [
  { href: "/products", label: "保險產品" },
  { href: "/compare", label: "產品比較" },
  { href: "/learn", label: "保險知識" },
  { href: "/needs", label: "保險需求分析" },
];

export const footerLinks = [
  {
    title: "關於",
    items: [
      { href: "/about", label: "關於我們" },
      { href: "/transparency", label: "資料來源及更新方式" },
      { href: "/contact", label: "聯絡我們" },
    ],
  },
  {
    title: "資料",
    items: [
      { href: "/transparency#data", label: "產品資料說明" },
      { href: "/transparency#sources", label: "資料來源" },
      { href: "/transparency#update", label: "更新方式" },
    ],
  },
  {
    title: "法律",
    items: [
      { href: "/legal/disclaimer", label: "免責聲明" },
      { href: "/legal/privacy", label: "私隱政策" },
      { href: "/legal/prototype", label: "原型開發說明" },
    ],
  },
];
