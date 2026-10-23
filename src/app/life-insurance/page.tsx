import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHub } from "@/data/hubs";
import { pageMetadata } from "@/lib/structured-data";
import { HubView } from "@/components/hub-view";

const SLUG = "life-insurance";

export function generateMetadata(): Metadata {
  const hub = getHub(SLUG);
  if (!hub) return {};
  return pageMetadata({
    title: hub.metaTitle,
    description: hub.metaDescription,
    path: `/${SLUG}`,
    updatedAt: hub.updatedAt,
  });
}

export default function HubRoute() {
  const hub = getHub(SLUG);
  if (!hub) notFound();
  return <HubView hub={hub} />;
}
