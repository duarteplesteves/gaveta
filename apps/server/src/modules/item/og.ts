interface OgMetadata {
  description: string | null;
  imageUrl: string | null;
  title: string | null;
}

function extractMetaContent(html: string, property: string): string | null {
  const pattern = new RegExp(
    `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(pattern);
  if (match?.[1]) {
    return match[1];
  }

  // Try reversed attribute order (content before property)
  const reversed = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`,
    "i"
  );
  const reverseMatch = html.match(reversed);
  return reverseMatch?.[1] ?? null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match?.[1]?.trim() ?? null;
}

/**
 * Fetch Open Graph metadata from a URL.
 * Returns partial metadata — never throws. 5s timeout.
 */
export async function fetchOgMetadata(url: string): Promise<OgMetadata> {
  const empty: OgMetadata = { description: null, imageUrl: null, title: null };

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Gaveta/1.0 (Open Graph Fetcher)" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return empty;
    }

    const html = await response.text();

    return {
      description: extractMetaContent(html, "og:description"),
      imageUrl: extractMetaContent(html, "og:image"),
      title: extractMetaContent(html, "og:title") ?? extractTitle(html),
    };
  } catch {
    return empty;
  }
}
