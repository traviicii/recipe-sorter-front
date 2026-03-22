import { formatLibraryScope, getSelectedCollections } from '../lib/recipe-sorter';
import type { CollectionSummary } from '../types/recipe-sorter';

type CollectionHeaderProps = {
    collections: CollectionSummary[];
    selectedCollectionIds: string[] | null;
};

export default function CollectionHeader({ collections, selectedCollectionIds }: CollectionHeaderProps) {
    const selectedCollections = getSelectedCollections(collections, selectedCollectionIds);
    const scopeLabel = formatLibraryScope(collections, selectedCollectionIds);
    const usableRecipes = selectedCollections.reduce((sum, collection) => sum + collection.parsedRecipes, 0);
    const completeRecipes = selectedCollections.reduce((sum, collection) => sum + collection.completeRecipes, 0);
    const partialRecipes = selectedCollections.reduce((sum, collection) => sum + collection.partialRecipes, 0);

    const stats = [
        {
            label: 'Selected sources',
            value: String(selectedCollections.length),
            detail: selectedCollections.length === 1 ? '1 collection in scope' : `${selectedCollections.length} collections in scope`,
        },
        {
            label: 'Usable recipes',
            value: String(usableRecipes),
            detail: 'Ready to filter and sort',
        },
        {
            label: 'Macro coverage',
            value: `${completeRecipes} complete`,
            detail: partialRecipes > 0 ? `${partialRecipes} still partial` : 'All visible recipes are complete',
        },
    ];

    return (
        <section className="mt-6 rounded-[28px] border border-[color:var(--mist)] bg-white/90 p-6 shadow-[0_18px_40px_rgba(31,36,48,0.05)]">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-2xl">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                        Library view
                    </div>
                    <h2 className="mt-1 text-2xl text-[color:var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                        {scopeLabel}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
                        Compare recipes across your selected uploads, then tighten the macro guardrails until the list matches what you want to prep.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-[color:var(--mist)] bg-[color:rgba(255,255,255,0.72)] px-4 py-3"
                        >
                            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                                {stat.label}
                            </div>
                            <div className="mt-2 text-lg font-semibold text-[color:var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                                {stat.value}
                            </div>
                            <div className="mt-1 text-sm text-[color:var(--ink-muted)]">{stat.detail}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
