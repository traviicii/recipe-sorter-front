import { useMemo, useState } from 'react';

import { formatCountLabel } from '../lib/recipe-sorter';
import type { CollectionSummary } from '../types/recipe-sorter';

type CollectionScopePanelProps = {
    collections: CollectionSummary[];
    selectedCollectionIds: string[] | null;
    onSelectAll: () => void;
    onToggleCollection: (collectionId: string) => void;
};

export default function CollectionScopePanel({
    collections,
    selectedCollectionIds,
    onSelectAll,
    onToggleCollection,
}: CollectionScopePanelProps) {
    const [open, setOpen] = useState(false);
    const selectedSet = useMemo(() => new Set(selectedCollectionIds ?? []), [selectedCollectionIds]);
    const allSelected = !selectedCollectionIds || selectedCollectionIds.length === 0;
    const selectedCollections = useMemo(() => {
        if (allSelected) {
            return collections;
        }
        return collections.filter((collection) => selectedSet.has(collection.id));
    }, [allSelected, collections, selectedSet]);
    const selectedRecipeCount = selectedCollections.reduce((sum, collection) => sum + collection.parsedRecipes, 0);
    const scopeLabel = allSelected
        ? 'All collections'
        : selectedCollections.length === 1
            ? selectedCollections[0].name
            : `${selectedCollections.length} collections selected`;

    return (
        <section className="rounded-[28px] border border-[color:var(--mist)] bg-white/90 p-5 shadow-[0_18px_40px_rgba(31,36,48,0.05)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                        Collection scope
                    </div>
                    <h3 className="mt-1 text-lg text-[color:var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                        {scopeLabel}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
                        {selectedRecipeCount} recipes across {selectedCollections.length} {selectedCollections.length === 1 ? 'collection' : 'collections'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {!allSelected && (
                        <button
                            type="button"
                            onClick={onSelectAll}
                            className="rounded-full bg-[color:var(--paper)] px-4 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--mist)]"
                        >
                            All
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setOpen((current) => !current)}
                        className="rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--forest)]"
                    >
                        {open ? 'Hide list' : 'Choose'}
                    </button>
                </div>
            </div>

            {open && (
                <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                    {collections.map((collection) => {
                        const isSelected = allSelected || selectedSet.has(collection.id);
                        return (
                            <label
                                key={collection.id}
                                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                                    isSelected
                                        ? 'border-[color:var(--forest)] bg-[color:rgba(111,138,69,0.08)]'
                                        : 'border-[color:var(--mist)] bg-white hover:border-[color:var(--forest)]'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => onToggleCollection(collection.id)}
                                    className="mt-1"
                                />
                                <span className="min-w-0 flex-1">
                                    <span className="block font-semibold text-[color:var(--ink)]">{collection.name}</span>
                                    <span className="block truncate text-sm text-[color:var(--ink-muted)]">
                                        {collection.sourceFilename}
                                    </span>
                                    <span className="mt-2 block text-xs uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                                        {collection.parsedRecipes} recipes · {formatCountLabel(collection)}
                                    </span>
                                </span>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                                        collection.status === 'processing' || collection.status === 'queued'
                                            ? 'bg-[color:rgba(185,133,46,0.14)] text-[color:var(--amber)]'
                                            : collection.status === 'failed'
                                                ? 'bg-[color:rgba(201,109,59,0.12)] text-[color:var(--clay)]'
                                                : 'bg-[color:var(--paper)] text-[color:var(--ink)]'
                                    }`}
                                >
                                    {collection.status}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
