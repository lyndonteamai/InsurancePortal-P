import { knowledgeGraph, relationsForProduct, relationsForTerm } from "../src/lib/relationships";
import { products } from "../src/data/products";
import { dictionary } from "../src/data/dictionary";

const g = knowledgeGraph();
console.log("nodes:", g.totalNodes, "edges:", g.totalEdges);
console.log("counts:", g.counts);
console.log("edgeCounts:", g.edgeCounts);

for (const p of products.slice(0, 3)) {
  const r = relationsForProduct(p);
  console.log(
    `${p.id}: terms=${r.terms.length} articles=${r.articles.length} products=${r.products.length} faqs=${r.faqs.length} hubs=${r.hubs.length}`,
  );
}
const t = dictionary.find((x) => x.relatedProductIds.length > 0)!;
const tr = relationsForTerm(t);
console.log(`term ${t.slug}: products=${tr.products.length} articles=${tr.articles.length} terms=${tr.terms.length}`);

// 檢查是否有指向不存在節點的邊
const ids = new Set(g.nodes.map((n) => n.id));
const dangling = g.edges.filter((e) => !ids.has(e.from) || !ids.has(e.to));
console.log("dangling edges:", dangling.length);
if (dangling.length) console.log(dangling.slice(0, 10));
