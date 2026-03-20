type EmptyStateProps = {
    variant: 'no-file' | 'parsing' | 'no-match' | 'failed';
};

const copy = {
    'no-file': {
        eyebrow: 'Ready when you are',
        title: 'Upload a PDF collection to start sorting recipes by macros.',
        description: 'The main flow is intentionally tight: analyze the collection, watch parsing progress, then filter the resulting cards by protein, calories, fat, fiber, and prep time.',
    },
    parsing: {
        eyebrow: 'Working',
        title: 'Recipe cards will appear here as macro parsing finishes.',
        description: 'This view updates while the parser reads pages, segments recipes, and fills in macro fields.',
    },
    'no-match': {
        eyebrow: 'No matches',
        title: 'Nothing fits the current macro guardrails.',
        description: 'Try loosening one of the limits or turn on incomplete data to keep partial cards in the grid.',
    },
    failed: {
        eyebrow: 'Parse failed',
        title: 'No usable recipes were recovered from this collection.',
        description: 'Try re-uploading the file or adjusting the source PDF if it is especially low quality.',
    },
};

export default function EmptyState({ variant }: EmptyStateProps) {
    const content = copy[variant];

    return (
        <div className="rounded-[28px] border border-dashed border-[color:var(--mist)] bg-white/70 px-6 py-12 text-center shadow-[0_12px_28px_rgba(31,36,48,0.04)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                {content.eyebrow}
            </div>
            <h3 className="mt-3 text-2xl text-[color:var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                {content.title}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[color:var(--ink-muted)]">
                {content.description}
            </p>
        </div>
    );
}
