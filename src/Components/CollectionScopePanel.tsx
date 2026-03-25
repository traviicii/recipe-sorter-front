import { useMemo, useState } from 'react';

import type { CollectionSummary } from '../types/recipe-sorter';

type CollectionScopePanelProps = {
    collections: CollectionSummary[];
    selectedCollectionIds: string[] | null;
    onSelectAll: () => void;
    onToggleCollection: (collectionId: string) => void;
};

const getSelectionSummary = (collections: CollectionSummary[], allSelected: boolean) => {
    if (collections.length === 0) {
        return 'No collections selected.';
    }
    if (allSelected) {
        return `Showing recipes from all ${collections.length} collections.`;
    }
    if (collections.length === 1) {
        return `Showing recipes from ${collections[0].name}.`;
    }
    return `Showing recipes from ${collections.length} selected collections.`;
};

const getStatusBadge = (collection: CollectionSummary) => {
    if (collection.status === 'processing' || collection.status === 'queued') {
        return {
            label: 'Parsing',
            className: 'bg-[color:rgba(185,133,46,0.14)] text-[color:var(--amber)]',
        };
    }
    if (collection.status === 'failed') {
        return {
            label: 'Needs review',
            className: 'bg-[color:rgba(201,109,59,0.12)] text-[color:var(--clay)]',
        };
    }
    return {
        label: 'Ready',
        className: 'bg-[color:var(--paper)] text-[color:var(--ink)]',
    };
};

const getCollectionSummary = (collection: CollectionSummary) => {
    const details = [`${collection.parsedRecipes} recipes`];

    if (collection.failedRecipes === 0 && collection.partialRecipes === 0) {
        details.push('all complete');
    } else {
        if (collection.completeRecipes > 0) {
            details.push(`${collection.completeRecipes} complete`);
        }
        if (collection.partialRecipes > 0) {
            details.push(`${collection.partialRecipes} partial`);
        }
        if (collection.failedRecipes > 0) {
            details.push(`${collection.failedRecipes} failed`);
        }
    }

    if (collection.reused) {
        details.push('cached');
    }

    return details.join(' · ');
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
    const selectionSummary = getSelectionSummary(selectedCollections, allSelected);

    return (
        <section className="rounded-[28px] border border-[color:var(--mist)] bg-white/90 p-5 shadow-[0_18px_40px_rgba(31,36,48,0.05)]">
            <div>
                <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--forest)]">
                        Source filter
                    </div>
                    <h3 className="mt-1 text-lg text-[color:var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                        Choose collections
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-[color:var(--ink-muted)]">{selectionSummary}</p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {!allSelected && (
                        <button
                            type="button"
                            onClick={onSelectAll}
                            className="rounded-full border border-[color:var(--mist)] bg-[color:var(--paper)] px-3 py-[7px] text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink)] transition hover:border-[color:var(--ink-muted)]"
                        >
                            Include all
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setOpen((current) => !current)}
                        aria-expanded={open}
                        className="rounded-full bg-[color:var(--ink)] px-3.5 py-[9px] text-[13px] font-semibold text-white transition hover:bg-[color:var(--forest)]"
                    >
                        {open ? 'Hide list' : 'Show list'}
                    </button>
                </div>
            </div>

            {open && (
                <div className="mt-3 max-h-80 space-y-2.5 overflow-y-auto pr-1">
                    {collections.map((collection) => {
                        const isSelected = allSelected || selectedSet.has(collection.id);
                        const statusBadge = getStatusBadge(collection);

                        return (
                            <label
                                key={collection.id}
                                className={`block cursor-pointer rounded-[22px] border px-4 py-[14px] transition ${
                                    isSelected
                                        ? 'border-[color:var(--forest)] bg-[color:rgba(111,138,69,0.08)]'
                                        : 'border-[color:var(--mist)] bg-white hover:border-[color:var(--forest)]'
                                }`}
                            >
                                <div className="flex items-start gap-2.5">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => onToggleCollection(collection.id)}
                                        className="mt-1 h-4 w-4 rounded border-[color:var(--mist)] text-[color:var(--forest)] focus:ring-[color:var(--forest)]"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="truncate text-[15px] font-semibold leading-5 text-[color:var(--ink)]">
                                                    {collection.name}
                                                </div>
                                                <div className="mt-1 truncate text-sm leading-5 text-[color:var(--ink-muted)]">
                                                    {collection.sourceFilename}
                                                </div>
                                            </div>

                                            <span
                                                className={`mt-0.5 shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusBadge.className}`}
                                            >
                                                {statusBadge.label}
                                            </span>
                                        </div>

                                        <div className="mt-2 text-xs leading-5 text-[color:var(--ink-muted)]">
                                            {getCollectionSummary(collection)}
                                        </div>

                                        {(collection.status === 'processing' || collection.status === 'queued') && (
                                            <div className="mt-3">
                                                <div className="mb-1 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--ink-muted)]">
                                                    <span>{collection.step || 'Processing'}</span>
                                                    <span>{Math.round(collection.progress)}%</span>
                                                </div>
                                                <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--mist)]">
                                                    <div
                                                        className="h-full rounded-full bg-[color:var(--forest)] transition-all"
                                                        style={{ width: `${collection.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
