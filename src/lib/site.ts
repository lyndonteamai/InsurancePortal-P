export const site = {
  nameZh: "保險指南",
  nameEn: "Insurance Compass HK",
  tagline: "香港保險，先了解，再選擇。",
  description:
    "保險指南（Insurance Compass HK）是一個香港保險資訊及比較平台，整理不同保險類別的保障內容、條款重點、常見問題與術語解釋，協助消費者在投保前先了解。",
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

// 主導航：對應 V2 的四個核心入口 + 比較
export const navItems = [
  { href: "/products", label: "保險產品" },
  { href: "/compare", label: "產品比較" },
  { href: "/dictionary", label: "保險術語" },
  { href: "/ask", label: "問保險 AI" },
  { href: "/learn", label: "保險知識" },
];

// 次級導航（放在「更多」選單中）
export const secondaryNavItems = [
  { href: "/medical-insurance", label: "醫療保險指南" },
  { href: "/critical-illness-insurance", label: "危疾保險指南" },
  { href: "/life-insurance", label: "人壽保險指南" },
  { href: "/travel-insurance", label: "旅遊保險指南" },
  { href: "/insurers", label: "保險公司" },
  { href: "/needs", label: "需求分析" },
  { href: "/trust", label: "信任中心" },
  { href: "/ranking-methodology", label: "排序方法" },
  { href: "/commercial-transparency", label: "商業透明度" },
];

export const footerLinks = [
  {
    title: "找資料",
    items: [
      { href: "/products", label: "保險產品" },
      { href: "/compare", label: "產品比較" },
      { href: "/insurers", label: "保險公司列表" },
      { href: "/dictionary", label: "保險術語字典" },
      { href: "/ask", label: "問保險 AI" },
    ],
  },
  {
    title: "主題指南",
    items: [
      { href: "/medical-insurance", label: "醫療保險指南" },
      { href: "/critical-illness-insurance", label: "危疾保險指南" },
      { href: "/life-insurance", label: "人壽保險指南" },
      { href: "/travel-insurance", label: "旅遊保險指南" },
      { href: "/needs", label: "保險需求分析" },
    ],
  },
  {
    title: "關於平台",
    items: [
      { href: "/about", label: "關於我們" },
      { href: "/transparency", label: "資料來源及更新方式" },
      { href: "/trust", label: "信任中心" },
      { href: "/ranking-methodology", label: "排序方法" },
      { href: "/commercial-transparency", label: "商業透明度" },
      { href: "/contact", label: "聯絡我們" },
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
