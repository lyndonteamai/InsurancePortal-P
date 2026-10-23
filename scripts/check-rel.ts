import { relationsForProduct } from "../src/lib/relationships";
import { products } from "../src/data/products";
import { dictionary } from "../src/data/dictionary";

const p = products[0];
const r = relationsForProduct(p);
console.log(p.name);
console.log("terms:", r.terms.map((t) => `${t.slug}(${t.zh})`).join(", "));
console.log("faqs:", r.faqs.map((f) => f.id).join(", "));
console.log("articles:", r.articles.map((a) => a.slug).join(", "));

// 術語 -> 產品覆蓋
for (const t of dictionary.slice(0, 6)) {
  const rel = dictionary.filter((x) => x.relatedTerms.includes(t.term) || x.relatedTerms.includes(t.slug));
  console.log(`${t.slug}: 關聯術語 ${rel.length}`);
}
