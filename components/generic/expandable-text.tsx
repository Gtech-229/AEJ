'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const CLAMP: Record<number, string> = {
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
};

/**
 * Long text that collapses to `clampLines` lines with a "Voir plus" / "Voir
 * moins" toggle. The toggle only appears when the text actually overflows the
 * clamp (measured), so short text renders plainly.
 */
export function ExpandableText({
  text,
  clampLines = 3,
  className,
}: {
  text: string;
  clampLines?: 2 | 3 | 4 | 5;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [text, clampLines]);

  return (
    <div className={className}>
      <p
        ref={ref}
        className={cn('text-sm whitespace-pre-line text-muted-foreground', !expanded && CLAMP[clampLines])}
      >
        {text}
      </p>
      {(overflows || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-medium text-primary hover:underline"
        >
          {expanded ? 'Voir moins' : 'Voir plus'}
        </button>
      )}
    </div>
  );
}
