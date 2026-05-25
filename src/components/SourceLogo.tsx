import { useState } from 'react';
import { getClearbitLogoUrl, getFaviconUrl } from '@/lib/logo';
import { Rss } from 'lucide-react';

interface SourceLogoProps {
  url: string;
  name: string;
  size?: number;
  className?: string;
}

type Stage = 'clearbit' | 'favicon' | 'fallback';

export function SourceLogo({ url, name, size = 32, className = '' }: SourceLogoProps) {
  const [stage, setStage] = useState<Stage>('clearbit');

  const src: Record<Stage, string | null> = {
    clearbit: getClearbitLogoUrl(url),
    favicon:  getFaviconUrl(url),
    fallback: null,
  };

  const advance = () => {
    setStage((prev) =>
      prev === 'clearbit' ? 'favicon' : 'fallback'
    );
  };

  if (stage === 'fallback' || !src[stage]) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded bg-slate-100 text-slate-400 ${className}`}
        style={{ width: size, height: size }}
        title={name}
      >
        <Rss size={size * 0.55} />
      </span>
    );
  }

  return (
    <img
      src={src[stage]!}
      alt={name}
      width={size}
      height={size}
      className={`rounded object-contain ${className}`}
      onError={advance}
    />
  );
}