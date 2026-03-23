type EmptyStateProps = {
    variant: 'no-file' | 'parsing' | 'no-match' | 'failed';
};

const copy = {
    'no-file': {
        eyebrow: 'Ready when you are',
        title: 'Upload a PDF collection to start sorting recipes by macros.',
        description: 'Once it is analyzed, you can scan your recipes, compare macros at a glance, and quickly find meals that fit your current goals.',
    },
    parsing: {
        eyebrow: 'Working',
        title: 'Recipe cards will start appearing here as your collection is processed.',
        description: 'We are reading the PDF, separating the recipes, and pulling in the macro details for each one.',
    },
    'no-match': {
        eyebrow: 'No matches',
        title: 'Nothing matches your current filters.',
        description: 'Try loosening a filter or turn on incomplete data to keep partially parsed recipes in view.',
    },
    failed: {
        eyebrow: 'Parse failed',
        title: 'We could not recover usable recipes from this collection.',
        description: 'Try uploading it again, or use a cleaner PDF if this one is especially low quality or image-based.',
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
