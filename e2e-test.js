const { chromium } = require("playwright");

const EXEC = "/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome";
const BASE = "http://localhost:3000";

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: EXEC,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  // 1. 首頁
  await page.goto(BASE, { waitUntil: "networkidle" });
  check("1. 首頁正常顯示", (await page.locator("h1").first().innerText()).includes("香港保險"));

  // 3. 搜尋（hero）
  const heroInput = page.getByPlaceholder("搜尋醫療保險、危疾保險、保單條款或保險問題");
  await heroInput.fill("自付額是什麼");
  await page.waitForTimeout(400);
  const panel = await page.locator("text=自付額是什麼").count();
  check("3. 產品搜尋正常工作（hero 即時結果）", panel > 0, `匹配 ${panel} 個元素`);

  // 2. 產品列表
  await page.goto(BASE + "/products", { waitUntil: "networkidle" });
  const countText = await page.locator("text=找到").first().innerText();
  check("2. 產品列表正常顯示", countText.includes("12"), countText.trim());

  // 4. 篩選
  await page.getByText("危疾保險", { exact: true }).first().click();
  await page.waitForTimeout(300);
  const afterFilter = await page.locator("text=找到").first().innerText();
  check("4. 產品篩選正常工作", afterFilter.includes("3"), afterFilter.trim());

  // 排序
  await page.selectOption("#sort", "premium-asc");
  await page.waitForTimeout(300);
  const firstCardPremium = await page.locator("text=模擬保費（年）").first().locator("xpath=following-sibling::p").first().innerText();
  check("4b. 排序功能生效（危疾類最低為 bc-ci-01 HK$2,650）", firstCardPremium.includes("2,650"), firstCardPremium);

  // 清除篩選
  await page.getByRole("button", { name: /清除全部篩選/ }).first().click();
  await page.waitForTimeout(300);
  const afterClear = await page.locator("text=找到").first().innerText();
  check("4c. 清除篩選功能", afterClear.includes("12"), afterClear.trim());

  // 5. 產品詳情
  await page.goto(BASE + "/products/hs-med-01", { waitUntil: "networkidle" });
  const h1 = await page.locator("h1").first().innerText();
  const hasTable = await page.locator("table").count();
  check("5. 產品詳情正常開啟", h1.includes("Harbor Shield") && hasTable > 0, `${h1.slice(0, 30)} / 表格 ${hasTable}`);

  // 6. 加入比較清單（詳情頁）
  await page.getByRole("button", { name: /加入比較/ }).first().click();
  await page.waitForTimeout(300);
  let ls = await page.evaluate(() => localStorage.getItem("ic-compare-list"));
  check("6. 可以加入比較清單", ls && JSON.parse(ls).includes("hs-med-01"), ls);

  // 從列表頁加入第二、三個
  await page.goto(BASE + "/products", { waitUntil: "networkidle" });
  const addBtns = page.getByRole("button", { name: /^加入比較/ });
  await addBtns.nth(0).click();
  await page.waitForTimeout(200);
  await addBtns.nth(1).click();
  await page.waitForTimeout(300);
  ls = await page.evaluate(() => localStorage.getItem("ic-compare-list"));
  check("6b. 跨頁面保持比較狀態", JSON.parse(ls || "[]").length === 3, ls);

  // 7. 移除
  await page.goto(BASE + "/compare", { waitUntil: "networkidle" });
  const rowsBefore = await page.locator("table thead th").count();
  check("8. 比較表至少兩個產品", rowsBefore >= 4, `表頭欄位 ${rowsBefore}`);
  await page.getByRole("button", { name: /^移除 / }).first().click();
  await page.waitForTimeout(400);
  ls = await page.evaluate(() => localStorage.getItem("ic-compare-list"));
  check("7. 可以移除比較產品", JSON.parse(ls || "[]").length === 2, ls);

  // 8. 比較結果更新
  const insights = await page.locator("text=這些產品有什麼不同？").count();
  const diffBadge = await page.locator("table tbody tr").count();
  check("9. 比較結果會根據模擬資料更新", insights > 0 && diffBadge > 0, `差異摘要區塊 ${insights}，資料列 ${diffBadge}`);

  // 條款說明
  await page.getByRole("button", { name: "了解 自付額" }).click();
  await page.waitForTimeout(200);
  const helpOpen = await page.locator("text=保險公司計算賠償前").count();
  check("9b. 比較欄位有「了解這項條款」說明", helpOpen > 0);

  // 清除全部
  await page.getByRole("button", { name: /清除全部/ }).click();
  await page.waitForTimeout(400);
  const emptyMsg = await page.locator("text=請加入至少兩個產品").count();
  check("7b. 可以清除比較清單", emptyMsg > 0);

  // 10. 知識文章
  await page.goto(BASE + "/learn/deductible-explained", { waitUntil: "networkidle" });
  const aH1 = await page.locator("h1").first().innerText();
  const takeaways = await page.locator("text=重要資訊摘要").count();
  check("10. 知識文章可以正常開啟", aH1.includes("自付額") && takeaways > 0, aH1.slice(0, 24));

  // 11. 知識搜尋
  await page.goto(BASE + "/learn", { waitUntil: "networkidle" });
  await page.getByPlaceholder("搜尋文章標題及內容").fill("續保");
  await page.waitForTimeout(400);
  const found = await page.locator("text=找到").first().innerText();
  check("11. 知識搜尋正常工作", /找到 [1-9]\d* 篇/.test(found), found.trim());

  // FAQ 搜尋
  await page.getByPlaceholder("例如：自付額是什麼？").fill("續保");
  await page.waitForTimeout(400);
  const faqHitText = await page.locator("text=找到").last().innerText();
  check("13. FAQ 問答可以搜尋（續保）", /找到 [1-9]\d* 條相關答案/.test(faqHitText), faqHitText.trim());
  await page.getByText("什麼是保證續保？").first().click();
  await page.waitForTimeout(300);
  const faqOpen = await page.locator("text=保證續保是指保險公司在指定條件下批准續保的承諾").count();
  check("13b. FAQ 答案可以展開", faqOpen > 0);

  // 12. 需求分析四步
  await page.goto(BASE + "/needs", { waitUntil: "networkidle" });
  await page.getByText("醫療保險", { exact: true }).first().click();
  await page.getByRole("button", { name: /下一步/ }).click();
  await page.waitForTimeout(300);
  await page.getByText("保費預算", { exact: true }).first().click();
  await page.getByRole("button", { name: /下一步/ }).click();
  await page.waitForTimeout(300);
  await page.getByText("條款解釋", { exact: true }).first().click();
  await page.getByRole("button", { name: /查看分析結果/ }).click();
  await page.waitForTimeout(500);
  const resultOk = await page.locator("text=需要進一步理解的保障項目").count();
  check("12. 需求分析工具可以完成四個步驟", resultOk > 0);

  // 12b. 結果包含導航
  const nav = await page.locator("text=可以閱讀的知識文章").count();
  const prodNav = await page.locator("text=可以進入的產品比較").count();
  check("12b. 分析結果包含文章與產品導航", nav > 0 && prodNav > 0);

  // 全站搜尋
  await page.goto(BASE + "/search?q=" + encodeURIComponent("香港醫療保險"), { waitUntil: "networkidle" });
  const sr = await page.locator("li a[href^='/products/']").count();
  const sa = await page.locator("li a[href^='/learn/']").count();
  check("全站搜尋結果分類展示", sr > 0 && sa > 0, `產品 ${sr} / 文章 ${sa}`);

  // 15. 導航連結
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "保險知識", exact: true }).first().click();
  await page.waitForURL("**/learn");
  await page.getByRole("link", { name: "保險需求分析", exact: true }).first().click();
  await page.waitForURL("**/needs");
  await page.getByRole("link", { name: "產品比較", exact: true }).first().click();
  await page.waitForURL("**/compare");
  check("15. 所有主要頁面都能正常導航", true);

  // 14. 手機版
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mp = await mobile.newPage();
  await mp.goto(BASE, { waitUntil: "networkidle" });
  const menuBtn = await mp.getByRole("button", { name: /開啟選單/ }).count();
  await mp.getByRole("button", { name: /開啟選單/ }).click();
  await mp.waitForTimeout(300);
  const mobileNav = await mp.locator("text=保險需求分析").count();
  check("14. 手機版響應式導航可用", menuBtn > 0 && mobileNav > 0);

  await mp.goto(BASE + "/products", { waitUntil: "networkidle" });
  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("14b. 手機版無橫向溢出（產品頁）", overflow <= 2, `溢出 ${overflow}px`);

  // 手機版比較表可橫向滑動
  await mp.goto(BASE + "/products/hs-med-01", { waitUntil: "networkidle" });
  await mp.getByRole("button", { name: /加入比較/ }).first().click();
  await mp.waitForTimeout(200);
  await mp.goto(BASE + "/products/ml-ci-01", { waitUntil: "networkidle" });
  await mp.getByRole("button", { name: /加入比較/ }).first().click();
  await mp.waitForTimeout(300);
  await mp.goto(BASE + "/compare", { waitUntil: "networkidle" });
  const tableScroll = await mp.evaluate(() => {
    const el = document.querySelector("table")?.parentElement;
    if (!el) return null;
    return { scrollW: el.scrollWidth, clientW: el.clientWidth, overflowX: getComputedStyle(el).overflowX };
  });
  check("14c. 手機版比較表可橫向滑動", tableScroll && tableScroll.scrollW > tableScroll.clientW && tableScroll.overflowX === "auto", JSON.stringify(tableScroll));

  const mo = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("14d. 手機版無橫向溢出（比較頁）", mo <= 2, `溢出 ${mo}px`);

  await mp.screenshot({ path: "/tmp/shot-mobile-compare.png", fullPage: false });
  await page.screenshot({ path: "/tmp/shot-home.png", fullPage: false });

  // Console errors
  const realErrors = errors.filter((e) => !/favicon|404 \(Not Found\)|Failed to load resource/i.test(e));
  check("無 React Console 錯誤", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} 通過 ===`);
  if (failed.length) {
    console.log("失敗項：");
    failed.forEach((f) => console.log(" - " + f.name + " " + f.detail));
    process.exit(1);
  }
})();
