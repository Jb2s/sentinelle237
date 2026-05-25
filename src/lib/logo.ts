export function getDomainFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export function getClearbitLogoUrl(url: string): string | null {
  const domain = getDomainFromUrl(url);
  return domain ? `https://logo.clearbit.com/${domain}` : null;
}

export function getFaviconUrl(url: string): string | null {
  const domain = getDomainFromUrl(url);
  return domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : null;
}