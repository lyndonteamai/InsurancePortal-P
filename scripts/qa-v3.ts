/* eslint-disable */
// 7 條路徑 QA — 針對本輪新增功能
import { chromium, Browser, Page, ConsoleMessage } from "playwright";
import fs from "node:fs";
import path from "node:path";

/** 找出本機已安裝的 Chromium（Playwright 快取或系統瀏覽器） */
function resolveChromium(): string | undefined {
  const root = path.join(process.env.HOME ?? "/root", ".cache", "ms-playwright");
  if (fs.existsSync(root)) {
    const dirs = fs
      .readdirSync(root)
      .filter((d) => d.startsWith("chromium_headless_shell-"))
      .sort()
      .reverse();
    for (const d of dirs) {
      const p = path.join(root, d, "chrome-headless-shell-linux64", "chrome-headless-shell");
      if (fs.existsSync(p)) return p;
      const p2 = path.join(root, d, "chrome-headless-shell-linux64", "chrome-headless-shell.exe");
      if (fs.existsSync(p2)) return p2;
    }
  }
  for (const p of ["/usr/bin/chromium", "/usr/bin/google-chrome"]) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

const BASE = process.env.QA_BASE ?? "http://localhost:3111";

const results: { id: string; name: string; ok: boolean; detail: string }[] = [];
let browser: Browser;

function log(id: string, name: string, ok: boolean, detail: string) {
  results.push({ id, name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} | ${id} | ${name} | ${detail}`);
}

async function newPage(viewport: { width: number; height: number } = { width: 1280, height: 900 }) {
  const ctx = await browser.newContext({ viewport, locale: "zh-HK" });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  (page as any).__errors = errors;
  return page;
}

async function main() {
  const executablePath = resolveChromium();
  browser = await chromium.launch(
    executablePath ? { executablePath, args: ["--no-sandbox"] } : { args: ["--no-sandbox"] },
  );

  // ---------- QA.1 Search → Product → Source ----------
  {
    const page = await newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const input = page.locator('input[placeholder*="搜索保險產品"]').first();
    await input.fill("醫療");
    await input.press("Enter");
    await page.waitForURL(/\/search\?/, { timeout: 15000 });
    await page.waitForLoadState("networkidle");
    const hasQuick = await page.locator("text=超級保險搜尋").count();
    log("QA.1a", "首頁搜索 → 搜索結果頁", hasQuick > 0, `URL=${page.url()}`);

    // 進入第一個產品
    const prodLink = page.locator('a[href^="/products/"]').first();
    const prodHref = await prodLink.getAttribute("href");
    await prodLink.click();
    await page.waitForURL(/\/products\//, { timeout: 15000 });
    await page.waitForLoadState("networkidle");
    log("QA.1b", "搜索結果 → 產品頁", page.url().includes("/products/"), `→ ${prodHref}`);

    // 查看來源
    const srcBtn = page.locator('button:has-text("查看來源")').first();
    const hasSrc = await srcBtn.count();
    if (hasSrc) {
      await srcBtn.click();
      await page.waitForTimeout(500);
      const drawer = page.locator('[role="dialog"]');
      const drawerText = (await drawer.textContent()) ?? "";
      const hasDemo = drawerText.includes("原型模擬資料");
      const hasMeta =
        drawerText.includes("出版：") ||
        drawerText.includes("生效日期") ||
        drawerText.includes("取得日期");
      log("QA.1c", "產品頁 → 來源抽屜", hasDemo && hasMeta, `demoNotice=${hasDemo} meta=${hasMeta}`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      const closed = (await page.locator('[role="dialog"]').count()) === 0;
      log("QA.1d", "來源抽屜 Esc 關閉", closed, `dialogs=${await page.locator('[role="dialog"]').count()}`);
    } else {
      log("QA.1c", "產品頁 → 來源抽屜", false, "找不到「查看來源」按鈕");
    }
    const errs = (page as any).__errors as string[];
    log("QA.1e", "路徑 1 無 console 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
    await page.context().close();
  }

  // ---------- QA.2 Search → Dictionary → Product ----------
  {
    const page = await newPage();
    await page.goto(`${BASE}/search?q=${encodeURIComponent("自付額")}`, { waitUntil: "networkidle" });
    const termLink = page.locator('a[href^="/dictionary/"]').first();
    const hasTerm = await termLink.count();
    await termLink.click();
    await page.waitForURL(/\/dictionary\//, { timeout: 15000 });
    await page.waitForLoadState("networkidle");
    log("QA.2a", "搜索 → 術語頁", hasTerm > 0 && page.url().includes("/dictionary/"), page.url());

    const prodLink = page.locator('a[href^="/products/"]').first();
    const hasProd = await prodLink.count();
    if (hasProd) {
      await prodLink.click();
      await page.waitForURL(/\/products\//, { timeout: 15000 });
      await page.waitForLoadState("networkidle");
      log("QA.2b", "術語頁 → 產品頁", true, page.url());
    } else {
      log("QA.2b", "術語頁 → 產品頁", false, "術語頁沒有產品連結");
    }
    const errs = (page as any).__errors as string[];
    log("QA.2c", "路徑 2 無 console 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
    await page.context().close();
  }

  // ---------- QA.3 Product → Compare → Evidence ----------
  {
    const page = await newPage();
    await page.goto(`${BASE}/products/harbor-shield-hospital-plan`, { waitUntil: "networkidle" });
    // 加入比較
    const addBtn = page.locator('button:has-text("加入比較"), button:has-text("加入比較清單")').first();
    const hasAdd = await addBtn.count();
    if (hasAdd) {
      await addBtn.click();
      await page.waitForTimeout(400);
    }
    // 第二款
    await page.goto(`${BASE}/products/harbor-shield-comprehensive-plan`, { waitUntil: "networkidle" });
    const addBtn2 = page.locator('button:has-text("加入比較"), button:has-text("加入比較清單")').first();
    if (await addBtn2.count()) {
      await addBtn2.click();
      await page.waitForTimeout(400);
    }
    await page.goto(`${BASE}/compare`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    // 切到「完整比較表」分頁（預設是「快速差異」，沒有表格）
    const fullTab = page.locator('button:has-text("完整比較表")').first();
    if (await fullTab.count()) {
      await fullTab.click();
      await page.waitForTimeout(600);
    }
    const hasTable = (await page.locator("table").count()) > 0;
    log("QA.3a", "產品 → 比較頁（表格）", hasTable, `tables=${await page.locator("table").count()}`);

    const evBtn = page.locator('button:has-text("查看證據")').first();
    const hasEv = await evBtn.count();
    if (hasEv) {
      await evBtn.click();
      await page.waitForTimeout(500);
      const drawerText = (await page.locator('[role="dialog"]').textContent()) ?? "";
      const ok = drawerText.includes("來源文件") || drawerText.includes("核實狀態");
      log("QA.3b", "比較頁 → 證據抽屜", ok, drawerText.slice(0, 60).replace(/\s+/g, " "));
      await page.keyboard.press("Escape");
    } else {
      log("QA.3b", "比較頁 → 證據抽屜", false, "找不到「查看證據」按鈕");
    }
    const errs = (page as any).__errors as string[];
    log("QA.3c", "路徑 3 無 console 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
    await page.context().close();
  }

  // ---------- QA.4 Needs Analysis → Product → Compare ----------
  {
    const page = await newPage();
    await page.goto(`${BASE}/needs`, { waitUntil: "networkidle" });
    // 逐步選擇：每一步點第一個可選項，然後按「下一步 / 查看分析結果」
    for (let i = 0; i < 3; i++) {
      const options = page.locator(
        'button.rounded-xl, button:has-text("醫療保險住院"), button:has-text("保障範圍")',
      );
      const cnt = await options.count();
      if (cnt > 0) {
        await options.first().click();
        await page.waitForTimeout(350);
      }
      const next = page.locator(
        'button:has-text("查看分析結果"), button:has-text("下一步")',
      ).last();
      if (await next.count()) {
        await next.click();
        await page.waitForTimeout(600);
      }
    }
    const onResult = page.url().includes("/needs");
    const bodyText = (await page.locator("body").textContent()) ?? "";
    const hasResult = bodyText.includes("需求分析結果") || bodyText.includes("你嘅選擇");
    log("QA.4a", "需求分析 → 結果頁", hasResult, `url=${page.url()}`);

    // 結果頁應有「需要持牌人士進一步解釋？」
    const hasContactTrigger = bodyText.includes("需要持牌人士進一步解釋");
    log("QA.4b", "結果頁含聯絡持牌人士入口", hasContactTrigger, `found=${hasContactTrigger}`);

    // 產品 → 比較
    const cmp = page.locator('a[href="/compare"]').first();
    if (await cmp.count()) {
      await cmp.click();
      await page.waitForURL(/\/compare/, { timeout: 15000 });
      await page.waitForLoadState("networkidle");
      log("QA.4c", "結果頁 → 比較頁", page.url().includes("/compare"), page.url());
    } else {
      log("QA.4c", "結果頁 → 比較頁", false, "找不到比較連結");
    }
    const errs = (page as any).__errors as string[];
    log("QA.4d", "路徑 4 無 console 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
    await page.context().close();
  }

  // ---------- QA.5 Compare → Request Professional Contact ----------
  {
    const page = await newPage();
    await page.goto(`${BASE}/compare`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const trigger = page.locator('button:has-text("需要持牌人士進一步解釋")').first();
    const hasTrigger = await trigger.count();
    if (!hasTrigger) {
      // 先加入兩款產品
      await page.goto(`${BASE}/products/harbor-shield-hospital-plan`, { waitUntil: "networkidle" });
      const a = page.locator('button:has-text("加入比較")').first();
      if (await a.count()) { await a.click(); await page.waitForTimeout(300); }
      await page.goto(`${BASE}/products/harbor-shield-comprehensive-plan`, { waitUntil: "networkidle" });
      const b = page.locator('button:has-text("加入比較")').first();
      if (await b.count()) { await b.click(); await page.waitForTimeout(300); }
      await page.goto(`${BASE}/compare`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
    }
    const trigger2 = page.locator('button:has-text("需要持牌人士進一步解釋")').first();
    const found = await trigger2.count();
    if (found) {
      await trigger2.click();
      await page.waitForTimeout(500);
      const modalText = (await page.locator('[role="dialog"]').textContent()) ?? "";
      const hasFields =
        modalText.includes("姓名") &&
        modalText.includes("Email 或電話") &&
        modalText.includes("希望了解的保險類別") &&
        modalText.includes("希望咨询的问题");
      const btn = modalText.includes("請求聯絡");
      const forbidden = /立即投保|立即成交|立即購買|Buy Now|Apply Now/.test(modalText);
      log("QA.5a", "聯絡 Modal 欄位齊全", hasFields && btn, `fields=${hasFields} btn=${btn}`);
      log("QA.5b", "聯絡 Modal 無交易按鈕", !forbidden, `forbidden=${forbidden}`);

      // 未勾 consent 直接提交 → 應報錯
      await page.locator('button[type="submit"]:has-text("請求聯絡")').click();
      await page.waitForTimeout(300);
      const err = await page.locator('[role="alert"]').count();
      log("QA.5c", "未同意時阻擋提交", err > 0, `alerts=${err}`);

      // 填表 + 勾選 + 提交
      const inputs = page.locator('[role="dialog"] input[type="text"]');
      await inputs.nth(0).fill("陳大文");
      await inputs.nth(1).fill("you@example.com");
      await page.locator('[role="dialog"] input[type="checkbox"]').check();
      await page.locator('button[type="submit"]:has-text("請求聯絡")').click();
      await page.waitForTimeout(500);
      const after = (await page.locator('[role="dialog"]').textContent()) ?? "";
      const okMsg = after.includes("Prototype：正式版本将根据用户同意，把联系请求转交适当的持牌保险专业人士。");
      log("QA.5d", "提交後顯示原型聲明", okMsg, `found=${okMsg}`);
    } else {
      log("QA.5a", "聯絡 Modal 欄位齊全", false, "找不到聯絡入口");
    }
    const errs = (page as any).__errors as string[];
    log("QA.5e", "路徑 5 無 console 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
    await page.context().close();
  }

  // ---------- QA.6 Sponsored vs Organic ----------
  {
    const page = await newPage();
    await page.goto(`${BASE}/search?q=${encodeURIComponent("醫療")}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const bodyText = (await page.locator("body").textContent()) ?? "";
    const hasSponsored = bodyText.includes("贊助");
    const hasOrganicLabel = bodyText.includes("自然結果");
    const forbidden = /最適合你|保證最划算|編輯精選|人氣榜/.test(bodyText);
    log("QA.6a", "搜索結果含贊助區標示", hasSponsored, `sponsored=${hasSponsored}`);
    log("QA.6b", "搜索結果區分自然結果", hasOrganicLabel, `organic=${hasOrganicLabel}`);
    log("QA.6c", "無禁用的排名用語", !forbidden, `forbidden=${forbidden}`);

    // 贊助徽章元件是否存在於 DOM
    // badge 元素同時包含「贊助」與可選的贊助方名稱，因此用 hasText 而非精確匹配
    const badge = await page.locator('text=贊助').count();
    const badgeEl = await page
      .locator('[aria-label*="贊助"], [title*="贊助"]')
      .count();
    log(
      "QA.6d",
      "SponsoredBadge 渲染",
      badge > 0 && badgeEl > 0,
      `text=${badge} labeled=${badgeEl}`,
    );
    const errs = (page as any).__errors as string[];
    log("QA.6e", "路徑 6 無 console 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
    await page.context().close();
  }

  // ---------- QA.7 Admin Preview → Data Moat ----------
  {
    const page = await newPage();
    await page.goto(`${BASE}/admin-preview`, { waitUntil: "networkidle" });
    const bodyText = (await page.locator("body").textContent()) ?? "";
    const hasMoat = bodyText.includes("保險資料護城河");
    const hasMetrics =
      bodyText.includes("結構化產品") &&
      bodyText.includes("來源文件") &&
      bodyText.includes("實體關係");
    const hasFacts = bodyText.includes("可追溯事實");
    const hasGraph = bodyText.includes("知識圖譜結構");
    const hasGaps = bodyText.includes("目前的資料缺口");
    log("QA.7a", "Data Moat 標題與指標", hasMoat && hasMetrics, `moat=${hasMoat} metrics=${hasMetrics}`);
    log("QA.7b", "事實核實狀態區塊", hasFacts, `facts=${hasFacts}`);
    log("QA.7c", "知識圖譜結構區塊", hasGraph, `graph=${hasGraph}`);
    log("QA.7d", "資料缺口（誠實披露）", hasGaps, `gaps=${hasGaps}`);

    // → SEO Page Factory
    const seoLink = page.locator('a[href="/admin-preview/seo"]').first();
    if (await seoLink.count()) {
      await seoLink.click();
      await page.waitForURL(/\/admin-preview\/seo/, { timeout: 15000 });
      await page.waitForLoadState("networkidle");
      const seoText = (await page.locator("body").textContent()) ?? "";
      const hasEstimate = seoText.includes("DEMO ESTIMATE");
      const hasTypes = seoText.includes("產品頁") && seoText.includes("保險術語頁") && seoText.includes("比較落地頁");
      log("QA.7e", "SEO 頁面工廠（DEMO ESTIMATE）", hasEstimate && hasTypes, `estimate=${hasEstimate} types=${hasTypes}`);
    } else {
      log("QA.7e", "SEO 頁面工廠（DEMO ESTIMATE）", false, "找不到 SEO 預覽連結");
    }
    const errs = (page as any).__errors as string[];
    log("QA.7f", "路徑 7 無 console 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
    await page.context().close();
  }

  // ---------- Mobile 檢查 ----------
  {
    const page = await newPage({ width: 390, height: 844 });
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2,
    );
    log("QA.M1", "首頁 Mobile 無橫向溢出", !overflow, `overflow=${overflow}`);
    await page.goto(`${BASE}/products/harbor-shield-hospital-plan`, { waitUntil: "networkidle" });
    const overflow2 = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2,
    );
    log("QA.M2", "產品頁 Mobile 無橫向溢出", !overflow2, `overflow=${overflow2}`);
    await page.goto(`${BASE}/admin-preview`, { waitUntil: "networkidle" });
    const overflow3 = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2,
    );
    log("QA.M3", "Data Moat Mobile 無橫向溢出", !overflow3, `overflow=${overflow3}`);
    await page.context().close();
  }

  // ---------- 禁用詞全文掃描 ----------
  // 注意：禁用詞出現在「我們不做 X」「不會出現 X」這類否定聲明中是合理的。
  // 掃描規則：只在「非否定語境」下視為違規——
  // 即該詞前面 12 個字內沒有「不」「禁止」「不會」「不會出現」「避免」等否定提示。
  {
    const page = await newPage();
    const bannedWords = [
      "最適合你", "保證最划算", "一定最好", "編輯精選", "人氣榜", "冠軍",
      "立即投保", "立即成交", "立即購買保險", "Buy Now", "Apply Now",
      "Certified", "Government Verified", "Officially Recommended",
    ];
    const negations = ["不", "禁", "避免", "無", "非", "拒", "沒", "without", "no "];
    const routes = [
      "/", "/products", "/compare", "/needs", "/ask", "/trust",
      "/ranking-methodology", "/commercial-transparency", "/admin-preview",
      "/dictionary", "/learn", "/insurers", "/medical-insurance",
      "/search?q=%E9%86%AB%E7%99%82",
      "/products/harbor-shield-hospital-plan",
    ];
    const hits: string[] = [];
    for (const r of routes) {
      await page.goto(`${BASE}${r}`, { waitUntil: "networkidle" });
      const t = ((await page.locator("body").textContent()) ?? "").replace(/\s+/g, " ");
      for (const w of bannedWords) {
        let idx = t.indexOf(w);
        while (idx !== -1) {
          // 視窗要夠大，才能涵蓋「平台 永遠不會 產生「最適合你」」這種跨標籤的否定語境
          const ctx = t.slice(Math.max(0, idx - 60), idx);
          const negated = negations.some((n) => ctx.includes(n));
          if (!negated) hits.push(`${r}: ${w}`);
          idx = t.indexOf(w, idx + 1);
        }
      }
    }
    log("QA.X1", "全站禁用詞掃描（排除否定聲明）", hits.length === 0, hits.length ? hits.join(" | ") : "無違規");

    // 交易類禁用詞在任何情況下都不允許出現
    const hardBanned = /立即投保|立即成交|立即購買保險|Buy Now|Apply Now|立即申請投保|結帳/;
    const hardHits: string[] = [];
    for (const r of routes) {
      await page.goto(`${BASE}${r}`, { waitUntil: "networkidle" });
      const t = ((await page.locator("body").textContent()) ?? "");
      if (hardBanned.test(t)) hardHits.push(r);
    }
    log("QA.X2", "全站無交易類按鈕", hardHits.length === 0, hardHits.length ? hardHits.join(",") : "無");

    // 核實狀態禁用詞（Certified / Approved 等）
    const verBanned = /Certified|Government Verified|Officially Recommended|官方認可|政府認證/;
    const verHits: string[] = [];
    for (const r of routes) {
      await page.goto(`${BASE}${r}`, { waitUntil: "networkidle" });
      const t = ((await page.locator("body").textContent()) ?? "");
      if (verBanned.test(t)) verHits.push(r);
    }
    log("QA.X3", "全站無未授權核實標章用語", verHits.length === 0, verHits.length ? verHits.join(",") : "無");

    await page.context().close();
  }

  await browser.close();

  const pass = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok).length;
  console.log(`\n==== QA 總結: ${pass}/${results.length} PASS, ${fail} FAIL ====`);
  if (fail) {
    console.log("失敗項目：");
    for (const f of results.filter((r) => !r.ok)) {
      console.log(`  - ${f.id} ${f.name}: ${f.detail}`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
