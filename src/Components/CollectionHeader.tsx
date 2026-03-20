import { formatCountLabel, formatLibraryScope, getSelectedCollections } from '../lib/recipe-sorter';
import type { CollectionSummary } from '../types/recipe-sorter';

type CollectionHeaderProps = {
    collections: CollectionSummary[];
    selectedCollectionIds: string[] | null;
};

export default function CollectionHeader({ collections, selectedCollectionIds }: CollectionHeaderProps) {
    const selectedCollections = getSelectedCollections(collections, selectedCollectionIds);
    const totalUsable = selectedCollections.reduce((sum, collection) => sum + collection.parsedRecipes, 0);
    const scopeLabel = formatLibraryScope(collections, selectedCollectionIds);

    return (
        <section className="mt-6 rounded-[28px] border border-[color:var(--mist)] bg-white/90 p-6 shadow-[0_18px_40px_rgba(31,36,48,0.05)]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                        Viewing
                    </div>
                    <h2 className="mt-1 text-2xl text-[color:var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                        {scopeLabel}
                    </h2>
                    <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
                        {selectedCollectionIds && selectedCollectionIds.length > 0
                            ? 'Use the collection selector to widen or narrow the source scope.'
                            : 'New uploads are added to this library automatically.'}
                    </p>
                </div>

                <div className="grid gap-2 text-sm text-[color:var(--ink-muted)] md:grid-cols-2 xl:text-right">
                    <div>{selectedCollections.length} selected collections</div>
                    <div>{totalUsable} usable recipes</div>
                    <div>{collections.length} collections total</div>
                    <div>
                        {selectedCollections.length === 1
                            ? formatCountLabel(selectedCollections[0])
                            : `${selectedCollections.reduce((sum, item) => sum + item.completeRecipes, 0)} complete recipes`}
                    </div>
                </div>
            </div>
        </section>
    );
}
