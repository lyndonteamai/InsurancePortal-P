const { chromium } = require("playwright");
const EXEC = "/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome";
const BASE = "https://a635c5dda023162b0.app.workbuddy.host";
const SC = "4JCDI64U6X";
const results = [];
function check(n, ok, d = "") { results.push({n, ok}); console.log(`${ok?"PASS":"FAIL"}  ${n}${d?"  — "+d:""}`); }

(async () => {
  const b = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox","--disable-dev-shm-usage"] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", e => errs.push(e.message));
  p.on("console", m => { if (m.type()==="error" && !/favicon|Failed to load resource/i.test(m.text())) errs.push(m.text()); });

  // 首頁
  await p.goto(`${BASE}/?sharecode=${SC}`, { waitUntil: "networkidle", timeout: 60000 });
  check("云端首頁載入", (await p.locator("h1").first().innerText()).includes("香港保險"));

  // Hero 搜尋
  await p.getByPlaceholder("搜尋醫療保險、危疾保險、保單條款或保險問題").fill("自付額是什麼");
  await p.waitForTimeout(600);
  check("云端搜尋可用", (await p.locator("text=自付額是什麼").count()) > 0);

  // 產品列表 + 篩選
  await p.goto(`${BASE}/products?sharecode=${SC}`, { waitUntil: "networkidle" });
  check("云端產品列表", (await p.locator("text=找到").first().innerText()).includes("12"));
  await p.getByText("危疾保險", { exact: true }).first().click();
  await p.waitForTimeout(400);
  check("云端篩選生效", (await p.locator("text=找到").first().innerText()).includes("3"));

  // 加入比較
  await p.goto(`${BASE}/products/hs-med-01?sharecode=${SC}`, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: /^加入比較/ }).first().click();
  await p.waitForTimeout(500);
  await p.goto(`${BASE}/products/ml-ci-01?sharecode=${SC}`, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: /^加入比較/ }).first().click();
  await p.waitForTimeout(500);
  const ls = await p.evaluate(() => localStorage.getItem("ic-compare-list"));
  check("云端加入比較 + 跨頁保持", ls && JSON.parse(ls).length === 2, ls);

  // 比較頁
  await p.goto(`${BASE}/compare?sharecode=${SC}`, { waitUntil: "networkidle" });
  const th = await p.locator("table thead th").count();
  check("云端比較表渲染（1 字段列 + 2 產品）", th === 3, `表頭 ${th}`);
  check("云端差異摘要", (await p.locator("text=這些產品有什麼不同？").count()) > 0);

  // 需求分析
  await p.goto(`${BASE}/needs?sharecode=${SC}`, { waitUntil: "networkidle" });
  await p.getByText("醫療保險", { exact: true }).first().click();
  await p.getByRole("button", { name: /下一步/ }).click(); await p.waitForTimeout(300);
  await p.getByText("保障範圍", { exact: true }).first().click();
  await p.getByRole("button", { name: /下一步/ }).click(); await p.waitForTimeout(300);
  await p.getByText("保險入門", { exact: true }).first().click();
  await p.getByRole("button", { name: /查看分析結果/ }).click(); await p.waitForTimeout(600);
  check("云端需求分析四步完成", (await p.locator("text=需要進一步理解的保障項目").count()) > 0);

  // 知識
  await p.goto(`${BASE}/learn?sharecode=${SC}`, { waitUntil: "networkidle" });
  await p.getByPlaceholder("搜尋文章標題及內容").fill("續保");
  await p.waitForTimeout(500);
  check("云端知識搜尋", /找到 [1-9]\d* 篇/.test(await p.locator("text=找到").first().innerText()));

  // 站内链接可点
  await p.goto(`${BASE}/?sharecode=${SC}`, { waitUntil: "networkidle" });
  await p.getByRole("link", { name: "保險需求分析", exact: true }).first().click();
  await p.waitForURL("**/needs**", { timeout: 20000 });
  check("云端站內導航", p.url().includes("/needs"));

  check("云端零 Console 錯誤", errs.length === 0, errs.slice(0,2).join(" | "));

  await p.screenshot({ path: "/tmp/cloud-home.png" });
  await p.goto(`${BASE}/compare?sharecode=${SC}`, { waitUntil: "networkidle" });
  await p.screenshot({ path: "/tmp/cloud-compare.png" });
  await b.close();
  const f = results.filter(r => !r.ok);
  console.log(`\n=== ${results.length - f.length}/${results.length} 通過 ===`);
  if (f.length) process.exit(1);
})();
