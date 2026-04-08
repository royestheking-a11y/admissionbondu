import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
};

const SITE_NAME = "Admission Bondhu";
const DEFAULT_OG_IMAGE = "/og-image.jpg";

function getSiteUrl() {
  return (import.meta.env.VITE_SITE_URL as string | undefined) || "";
}

export function Seo({ title, description, keywords, canonicalPath, ogImage }: SeoProps) {
  const siteUrl = getSiteUrl();
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  const normalizedSiteUrl = siteUrl.replace(/\/+$/, "");

  const canonicalUrl =
    normalizedSiteUrl && canonicalPath
      ? `${normalizedSiteUrl}${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}`
      : undefined;

  const resolvedOgImage =
    ogImage || (normalizedSiteUrl ? `${normalizedSiteUrl}${DEFAULT_OG_IMAGE}` : undefined);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={SITE_NAME} />

      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:type" content="website" />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {resolvedOgImage ? <meta property="og:image" content={resolvedOgImage} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      {resolvedOgImage ? <meta name="twitter:image" content={resolvedOgImage} /> : null}
    </Helmet>
  );
}

