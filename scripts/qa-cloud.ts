/* eslint-disable */
// 線上驗證：確認本輪新增功能已在雲端生效
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://a635c5dda023162b0.app.workbuddy.host";
const SC = "4JCDI64U6X";
const EXEC =
  "/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome";

const results: { n: string; ok: boolean; d: string }[] = [];
function check(n: string, ok: boolean, d = "") {
  results.push({ n, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`);
}

async function main() {
  const b = await chromium.launch({
    executablePath: fs.existsSync(EXEC) ? EXEC : undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs: string[] = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error" && !/favicon|Failed to load resource/i.test(m.text()))
      errs.push(m.text());
  });

  // 加上 cache-buster，避免 CDN 的 s-maxage 快取影響驗證結果
  let cb = Date.now();
  const go = (path: string) =>
    p.goto(
      `${BASE}${path}${path.includes("?") ? "&" : "?"}sharecode=${SC}&cb=${cb++}`,
      { waitUntil: "networkidle", timeout: 60000 },
    );

  // 1. 新路由存在
  for (const r of [
    "/ranking-methodology",
    "/commercial-transparency",
    "/admin-preview/seo",
  ]) {
    await go(r);
    const h1 = (await p.locator("h1").first().innerText().catch(() => "")) ?? "";
    check(`雲端 ${r}`, p.url().includes(r) && h1.length > 0, h1.slice(0, 30));
  }

  // 2. 首頁搜索 → 產品 → 來源抽屜
  await go("/");
  await p
    .locator('input[placeholder*="搜索保險產品"]')
    .first()
    .fill("醫療");
  await p.keyboard.press("Enter");
  await p.waitForURL(/\/search/, { timeout: 20000 });
  await p.waitForLoadState("networkidle");
  const sText = (await p.locator("body").textContent()) ?? "";
  check("雲端超級搜索（自然結果區）", sText.includes("自然結果"), "");
  check("雲端贊助區與自然區分離", sText.includes("贊助結果"), "");

  await p.locator('a[href^="/products/"]').first().click();
  await p.waitForURL(/\/products\//, { timeout: 20000 });
  await p.waitForLoadState("networkidle");
  await p.locator('button:has-text("查看來源")').first().click();
  await p.waitForTimeout(600);
  const dText = (await p.locator('[role="dialog"]').textContent()) ?? "";
  check(
    "雲端來源抽屜（Source-First）",
    dText.includes("原型模擬資料") && dText.includes("生效日期"),
    "",
  );

  // 3. 比較頁證據
  await go("/products/harbor-shield-hospital-plan");
  await p.locator('button:has-text("加入比較")').first().click();
  await p.waitForTimeout(500);
  await go("/products/harbor-shield-comprehensive-plan");
  await p.locator('button:has-text("加入比較")').first().click();
  await p.waitForTimeout(500);
  await go("/compare");
  await p.waitForTimeout(800);
  await p.locator('button:has-text("完整比較表")').first().click();
  await p.waitForTimeout(600);
  await p.locator('button:has-text("查看證據")').first().click();
  await p.waitForTimeout(600);
  const eText = (await p.locator('[role="dialog"]').textContent()) ?? "";
  check("雲端比較證據抽屜", eText.includes("來源文件"), "");

  // 4. 聯絡持牌人士
  await p.keyboard.press("Escape");
  await p.waitForTimeout(300);
  await p.locator('button:has-text("需要持牌人士進一步解釋")').first().click();
  await p.waitForTimeout(600);
  const cText = (await p.locator('[role="dialog"]').textContent()) ?? "";
  check(
    "雲端聯絡 Modal（Contact-Only）",
    cText.includes("請求聯絡") && cText.includes("平台不會完成保險交易"),
    "",
  );

  // 5. Data Moat
  await go("/admin-preview");
  const mText = (await p.locator("body").textContent()) ?? "";
  check(
    "雲端 Data Moat 儀表板",
    mText.includes("保險資料護城河") &&
      mText.includes("知識圖譜結構") &&
      mText.includes("目前的資料缺口"),
    "",
  );

  // 6. 問保險 AI 五段式
  await go("/ask");
  const aText = (await p.locator("body").textContent()) ?? "";
  check(
    "雲端問保險 AI（五段式答案契約）",
    aText.includes("問保險 AI") &&
      aText.includes("簡單答案") &&
      aText.includes("官方來源") &&
      aText.includes("進一步比較"),
    "",
  );

  // RSC payload 的 "Failed to fetch ... Falling back to browser navigation" 是
  // Next.js 在帶 cache-buster 參數時的預取降級提示，不是應用程式錯誤。
  const realErrs = errs.filter(
    (e) => !/Failed to fetch RSC payload|Falling back to browser navigation/i.test(e),
  );
  check("雲端無 JS 錯誤", realErrs.length === 0, realErrs.slice(0, 3).join(" | "));

  await b.close();
  const pass = results.filter((r) => r.ok).length;
  console.log(`\n==== 線上驗證: ${pass}/${results.length} PASS ====`);
  if (pass !== results.length) process.exit(1);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
