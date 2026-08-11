// Renders a JSON-LD structured-data block. No "use client" so it works in both
// server and client components (client components are still SSR'd, so the script
// lands in the initial HTML where crawlers read it).
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; there is no user-controlled
      // markup here, only our own structured data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
