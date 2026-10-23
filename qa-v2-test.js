/**
 * V2 QA 測試 (STEP 27–28)
 * 六條驗收流程 + 行動版斷點 + Console 錯誤 + SEO/結構化資料檢查
 */
const { chromium } = require("playwright");

const EXEC = "/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome";
const BASE = process.env.BASE_URL || "http://localhost:3113";

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
}

async function withPage(browser, viewport, fn) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  let result;
  try {
    result = await fn(page, errors);
  } finally {
    await ctx.close();
  }
  return result !== undefined ? result : errors;
}

(async () => {
  const browser = await chromium.launch({
    executablePath: EXEC,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const desktop = { width: 1440, height: 900 };

  // ============ 流程 1：首頁 → 產品類別 → 產品詳情 ============
  await withPage(browser, desktop, async (page) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    const h1 = await page.locator("h1").first().innerText();
    check("流程1.1 首頁載入", h1.length > 0, h1.slice(0, 40));

    // 四大核心入口
    const coreLinks = await page.locator('a[href="/products"]').count();
    const dictLinks = await page.locator('a[href="/dictionary"]').count();
    const askLinks = await page.locator('a[href="/ask"]').count();
    check(
      "流程1.2 首頁四核心入口齊全",
      coreLinks > 0 && dictLinks > 0 && askLinks > 0,
      `products=${coreLinks} dictionary=${dictLinks} ask=${askLinks}`,
    );

    // 進入產品庫（用可見的 hero CTA，避免 header 導航）
    await page.locator('a[href="/products"]:visible').first().click();
    await page.waitForURL(/\/products/, { timeout: 10000 });
    check(
      "流程1.3 產品庫載入",
      page.url().includes("/products"),
      page.url(),
    );
  });

  // ============ 流程 2：篩選 → 加入比較 → 四層比較 ============
  await withPage(browser, desktop, async (page) => {
    await page.goto(BASE + "/products", { waitUntil: "networkidle" });
    const found = await page.locator("text=找到").first().innerText();
    check("流程2.1 產品數量顯示", /找到\s*\d+/.test(found), found.trim());

    // 加入 3 個產品到比較
    const addButtons = page.locator('button:has-text("加入比較")');
    const n = await addButtons.count();
    check("流程2.2 有加入比較按鈕", n > 0, `${n} 個`);

    await addButtons.nth(0).click();
    await page.waitForTimeout(300);
    await addButtons.nth(1).click();
    await page.waitForTimeout(300);
    await addButtons.nth(2).click();
    await page.waitForTimeout(500);

    await page.goto(BASE + "/compare", { waitUntil: "networkidle" });
    const tabs = await page.locator('[role="tab"]').allInnerTexts();
    check(
      "流程2.3 比較頁四層 tab 齊全",
      tabs.length === 4,
      tabs.join(" | ").slice(0, 80),
    );

    // 快速差異
    await page.locator('[role="tab"]').first().click();
    await page.waitForTimeout(300);
    const diffText = await page.locator("text=差異").first().count();
    check("流程2.4 快速差異層有內容", diffText > 0);

    // 完整比較表
    await page.locator('[role="tab"]').nth(1).click();
    await page.waitForTimeout(300);
    const tableCount = await page.locator("table").count();
    check("流程2.5 完整比較表存在", tableCount > 0, `${tableCount} 個 table`);

    // 差異解釋
    await page.locator('[role="tab"]').nth(2).click();
    await page.waitForTimeout(300);
    const bodyText = await page.locator("body").innerText();
    check(
      "流程2.6 差異解釋層有機制說明",
      bodyText.includes("差異") && bodyText.length > 500,
    );

    // 應問的問題
    await page.locator('[role="tab"]').nth(3).click();
    await page.waitForTimeout(300);
    const copyBtn = await page.locator('button:has-text("複製")').count();
    check("流程2.7 應問的問題層有複製按鈕", copyBtn > 0, `${copyBtn} 個`);
  });

  // ============ 流程 3：術語字典 → 術語頁 ============
  await withPage(browser, desktop, async (page) => {
    await page.goto(BASE + "/dictionary", { waitUntil: "networkidle" });
    const termCards = await page.locator('a[href^="/dictionary/"]').count();
    check("流程3.1 字典有術語連結", termCards >= 30, `${termCards} 個`);

    // A-Z 索引
    const letterLinks = await page.locator('a[href^="#letter-"]').count();
    const letterTargets = await page
      .locator('section[id^="letter-"]')
      .count();
    check(
      "流程3.2 A-Z 索引存在且對應章節齊全",
      letterLinks >= 15 && letterLinks === letterTargets,
      `索引 ${letterLinks} 個字母 / 章節 ${letterTargets} 個`,
    );

    await page.locator('a[href="/dictionary/deductible"]').first().click();
    await page.waitForURL(/\/dictionary\/deductible/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    const t = await page.locator("body").innerText();
    const h2 = (await page.locator("h2").allTextContents()).join("|");
    check(
      "流程3.3 術語頁有答案、誤解與比較重點",
      t.includes("一句話答案") &&
        h2.includes("常見誤解") &&
        h2.includes("比較產品時要看的重點"),
      h2.slice(0, 80),
    );
  });

  // ============ 流程 4：問保險問題 → 引用來源 ============
  await withPage(browser, desktop, async (page) => {
    await page.goto(BASE + "/ask", { waitUntil: "networkidle" });
    await page
      .getByPlaceholder(/例如：自付額高會怎樣/)
      .fill("自付額係咩");
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(800);
    const t = await page.locator("body").innerText();
    check("流程4.1 問答產生直接回答", t.includes("直接回答"));
    check("流程4.2 回答附資料庫依據", t.includes("回答依據"));
    check("流程4.3 顯示界線說明", t.includes("界線"));
  });

  // ============ 流程 5：回報資料問題（不收集個資） ============
  await withPage(browser, desktop, async (page) => {
    await page.goto(BASE + "/products/harbor-shield-hospital-plan", {
      waitUntil: "networkidle",
    });
    const t = await page.locator("body").innerText();
    check(
      "流程5.1 產品頁有核實狀態與資料來源",
      t.includes("已核實") || t.includes("部分核實") || t.includes("尚未核實"),
    );
    check("流程5.2 產品頁有一句話答案", t.includes("快速判斷"));
    check("流程5.3 產品頁有資料來源區塊", t.includes("資料來源"));

    const report = page.locator('button:has-text("回報資料問題")').first();
    check("流程5.4 有回報資料問題按鈕", (await report.count()) > 0);
    if ((await report.count()) > 0) {
      await report.click();
      await page.waitForTimeout(400);
      const modal = await page.locator('[role="dialog"]').innerText();
      check(
        "流程5.5 回報彈窗聲明不收集個資",
        modal.includes("不會要求你提供") && modal.includes("個人資料"),
      );
      check(
        "流程5.6 回報彈窗有問題類型選項",
        modal.includes("保障範圍或限額有誤") &&
          modal.includes("資料來源不正確"),
      );
    }
  });

  // ============ 流程 6：主題指南 → 產品並列 ============
  await withPage(browser, desktop, async (page) => {
    await page.goto(BASE + "/medical-insurance", { waitUntil: "networkidle" });
    const t = await page.locator("body").innerText();
    check("流程6.1 Hub 有一句話答案", t.includes("一句話答案"));
    check("流程6.2 Hub 有章節分類標籤", t.includes("概念解釋") || t.includes("比較重點"));
    check("流程6.3 Hub 有目錄", t.includes("本頁目錄"));
    check("流程6.4 Hub 掛接產品", t.includes("涉及的產品資料"));
    check("流程6.5 Hub 說明不排名", t.includes("不排名任何產品"));
  });

  // ============ /admin-preview 資料營運預覽 ============
  await withPage(browser, desktop, async (page) => {
    await page.goto(BASE + "/admin-preview", { waitUntil: "networkidle" });
    const t = await page.locator("body").innerText();
    check(
      "QA.1 admin-preview 有完整度與資料品質表",
      t.includes("完整度") && t.includes("核實狀態"),
    );
    const meta = await page.locator('meta[name="robots"]').getAttribute("content");
    check(
      "QA.2 admin-preview 為 noindex",
      !!meta && meta.includes("noindex"),
      meta || "(無)",
    );
  });

  // ============ SEO / 結構化資料 ============
  await withPage(browser, desktop, async (page) => {
    await page.goto(BASE + "/products/harbor-shield-hospital-plan", {
      waitUntil: "networkidle",
    });
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = [];
    let parseError = false;
    for (const raw of ld) {
      try {
        const j = JSON.parse(raw);
        if (Array.isArray(j)) j.forEach((x) => types.push(x["@type"]));
        else types.push(j["@type"]);
      } catch {
        parseError = true;
      }
    }
    check(
      "QA.3 產品頁有 JSON-LD 且含 InsuranceProduct + BreadcrumbList",
      !parseError &&
        types.includes("InsuranceProduct") &&
        types.includes("BreadcrumbList"),
      types.join(","),
    );
    check(
      "QA.4 無 Review/AggregateRating 標記",
      !ld.join("").includes("AggregateRating") && !ld.join("").includes("Review"),
    );

    const canon = await page.locator('link[rel="canonical"]').getAttribute("href");
    check("QA.5 有 canonical", !!canon, canon || "(無)");

    // sitemap
    await page.goto(BASE + "/sitemap.xml", { waitUntil: "networkidle" });
    const xml = await page.locator("body").innerText();
    check(
      "QA.6 sitemap 含新路由（dictionary/hubs/insurers/ask/trust）",
      xml.includes("/dictionary/") &&
        xml.includes("/medical-insurance") &&
        xml.includes("/insurers/") &&
        xml.includes("/ask") &&
        xml.includes("/trust"),
    );

    // robots
    await page.goto(BASE + "/robots.txt", { waitUntil: "networkidle" });
    const robots = await page.locator("body").innerText();
    check(
      "QA.7 robots 允許索引但擋工具頁",
      robots.includes("Allow: /") &&
        robots.includes("/admin-preview") &&
        robots.includes("Sitemap:"),
      robots.replace(/\n/g, " ").slice(0, 100),
    );
  });

  // ============ 中立性：全站掃描禁止詞 ============
  {
    const pages = [
      "/",
      "/products",
      "/compare",
      "/dictionary",
      "/ask",
      "/learn",
      "/insurers",
      "/trust",
      "/needs",
      "/medical-insurance",
      "/products/harbor-shield-hospital-plan",
      "/dictionary/deductible",
    ];
    // 禁止詞只允許出現在「明確否定句」中（例如：唔會使用「最適合你」）
    const NEGATION_CUES = [
      "唔會",
      "不會",
      "不排名",
      "不做排名",
      "不做",
      "沒有排名",
      "沒有依據",
      "禁止",
      "無法",
      "不會使用",
    ];
    let violations = [];
    for (const p of pages) {
      const ctx = await browser.newContext({ viewport: desktop });
      const page = await ctx.newPage();
      await page.goto(BASE + p, { waitUntil: "networkidle" });
      const t = await page.locator("body").innerText();
      for (const w of [
        "最適合你",
        "一定最好",
        "保證最划算",
        "編輯推介",
        "編輯精選",
        "性價比之王",
      ]) {
        if (!t.includes(w)) continue;
        // 逐句檢查：該詞所在句子必須帶否定訊號
        const sentences = t.split(/[。；]/).filter((s) => s.includes(w));
        for (const sent of sentences) {
          if (!NEGATION_CUES.some((c) => sent.includes(c))) {
            violations.push(`${p}: 「${sent.trim().slice(0, 60)}」`);
          }
        }
      }
      await ctx.close();
    }
    check(
      "QA.8 禁止詞只出現在明確否定句中",
      violations.length === 0,
      violations.length ? violations.join(" | ") : "無違規",
    );
  }

  // ============ 行動版斷點 (STEP 19) ============
  for (const w of [375, 390, 430, 768]) {
    await withPage(browser, { width: w, height: 844 }, async (page) => {
      const routes = [
        "/",
        "/products",
        "/products/harbor-shield-hospital-plan",
        "/compare",
        "/dictionary",
        "/dictionary/deductible",
        "/ask",
        "/insurers",
        "/trust",
        "/medical-insurance",
      ];
      let overflow = [];
      let consoleErrs = [];
      for (const r of routes) {
        const errsBefore = consoleErrs.length;
        await page.goto(BASE + r, { waitUntil: "networkidle" });
        const scrollW = await page.evaluate(
          () => document.documentElement.scrollWidth,
        );
        const clientW = await page.evaluate(
          () => document.documentElement.clientWidth,
        );
        if (scrollW > clientW + 2) {
          overflow.push(`${r} (${scrollW}>${clientW})`);
        }
        consoleErrs = consoleErrs.concat(consoleErrs.slice(errsBefore));
      }
      check(
        `QA.9 ${w}px 無水平溢出`,
        overflow.length === 0,
        overflow.length ? overflow.join(", ") : "全部頁面 OK",
      );
    });
  }

  // ============ Console 錯誤掃描 ============
  const allErrors = [];
  for (const r of [
    "/",
    "/products",
    "/products/harbor-shield-hospital-plan",
    "/compare",
    "/dictionary",
    "/dictionary/deductible",
    "/ask",
    "/learn",
    "/insurers",
    "/trust",
    "/needs",
    "/admin-preview",
    "/medical-insurance",
    "/search?q=自付額",
  ]) {
    const errs = await withPage(browser, desktop, async (page) => {
      await page.goto(BASE + r, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
    });
    for (const e of errs) allErrors.push(`${r}: ${e}`);
  }
  check(
    "QA.10 全站無 console 錯誤",
    allErrors.length === 0,
    allErrors.length ? allErrors.slice(0, 5).join(" | ") : "0 個錯誤",
  );

  // QA.11：全量路由巡檢—— 直接由 sitemap 撈出所有 URL 逐一驗證 200。
  // 呢條測試係為咗捉「建構期殘留舊錯誤產物」呢類問題：
  // 之前有一個產品頁的靜態 HTML 內容係 __next_error__，但單頁測試剛好抽唔中。
  const sm = await withPage(browser, desktop, async (page) => {
    await page.goto(`${BASE}/sitemap.xml`, { waitUntil: "domcontentloaded" });
    return await page.content();
  });
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/")
    .filter((u) => !u.includes("/admin-preview"));
  const uniqueUrls = [...new Set(urls)];
  const routeFails = [];
  for (const u of uniqueUrls) {
    const code = await withPage(browser, desktop, async (page) => {
      const r = await page.goto(`${BASE}${u}`, { waitUntil: "domcontentloaded" });
      return r ? r.status() : 0;
    });
    if (code !== 200) routeFails.push(`${code} ${u}`);
  }
  check(
    `QA.11 sitemap 內全部 ${uniqueUrls.length} 條路由都回 200`,
    routeFails.length === 0,
    routeFails.length ? routeFails.slice(0, 8).join(" | ") : "全部 200",
  );

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n===== 總結：${results.length - failed.length}/${results.length} 通過 =====`);
  if (failed.length) {
    console.log("失敗項目：");
    for (const f of failed) console.log(`  - ${f.name} ${f.detail}`);
    process.exit(1);
  }
})();
