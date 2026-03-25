import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// RSS → JSON parser (no external dependency)
// ─────────────────────────────────────────────────────────────────────────────

function tag(xml: string, name: string): string {
  const re = new RegExp(`<${name}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${name}>`, "i");
  return (xml.match(re)?.[1] ?? "").trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

interface ParsedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author: string;
}

function parseRSS(xml: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    items.push({
      title: tag(m[1], "title"),
      description: stripHtml(tag(m[1], "description") || tag(m[1], "content:encoded") || ""),
      link: tag(m[1], "link"),
      pubDate: tag(m[1], "pubDate"),
      author: tag(m[1], "dc:creator") || tag(m[1], "author"),
    });
  }
  return items;
}

// ─────────────────────────────────────────────────────────────────────────────
// Feed definitions
// Add / remove feeds here — all fetches are server-side (no CORS issues)
// ─────────────────────────────────────────────────────────────────────────────

const FEEDS = [
  { sourceId: "jck",             url: "https://www.jckonline.com/feed/" },
  { sourceId: "national-jeweler",url: "https://www.nationaljeweler.com/feed" },
  { sourceId: "pro-jeweller",    url: "https://www.professionaljeweller.com/feed/" },
  { sourceId: "watchpro",        url: "https://www.watchpro.com/feed/" },
  { sourceId: "hodinkee",        url: "https://www.hodinkee.com/feed" },
  { sourceId: "europa-star",     url: "https://www.europastar.com/feed/" },
];

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/rss
// Query params:
//   sources  — comma-separated sourceIds to filter (optional)
//   limit    — max articles per feed (default 10)
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sourcesParam = searchParams.get("sources");
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  const feeds = sourcesParam
    ? FEEDS.filter((f) => sourcesParam.split(",").includes(f.sourceId))
    : FEEDS;

  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "RodierCo-ContentStudio/1.0" },
        next: { revalidate: 1800 }, // cache 30 min
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const items = parseRSS(xml).slice(0, limit);
      return { sourceId: feed.sourceId, items };
    })
  );

  const articles: object[] = [];
  let errors: string[] = [];

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      r.value.items.forEach((item, j) => {
        articles.push({
          id: `${feeds[i].sourceId}-${j}`,
          sourceId: feeds[i].sourceId,
          title: item.title,
          summary: item.description.slice(0, 280) + (item.description.length > 280 ? "…" : ""),
          url: item.link,
          publishedAt: new Date(item.pubDate || Date.now()).toISOString(),
          author: item.author,
        });
      });
    } else {
      errors.push(`${feeds[i].sourceId}: ${(r.reason as Error).message}`);
    }
  });

  // Sort by date desc
  articles.sort((a: any, b: any) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json({ articles, errors, fetchedAt: new Date().toISOString() });
}
