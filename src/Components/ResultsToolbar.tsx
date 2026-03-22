import { quickPresets, sortModeOptions } from '../lib/recipe-sorter';
import type { QuickPresetId, SortMode } from '../types/recipe-sorter';

type ResultsToolbarProps = {
    visibleCount: number;
    totalCount: number;
    selectedCollectionCount: number;
    activePreset: QuickPresetId | null;
    sortMode: SortMode;
    onPresetSelect: (preset: QuickPresetId) => void;
    onSortModeChange: (sortMode: SortMode) => void;
};

export default function ResultsToolbar({
    visibleCount,
    totalCount,
    selectedCollectionCount,
    activePreset,
    sortMode,
    onPresetSelect,
    onSortModeChange,
}: ResultsToolbarProps) {
    return (
        <div className="rounded-[28px] border border-[color:var(--mist)] bg-white/90 p-5 shadow-[0_18px_40px_rgba(31,36,48,0.05)]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-2xl">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                        Results
                    </div>
                    <div className="mt-1 text-2xl text-[color:var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                        {visibleCount} recipes ready to compare
                    </div>
                    <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
                        {totalCount} usable recipes across {selectedCollectionCount} {selectedCollectionCount === 1 ? 'selected collection' : 'selected collections'}.
                    </p>

                    <div className="mt-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                            Meal-prep presets
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {(Object.entries(quickPresets) as Array<[QuickPresetId, (typeof quickPresets)[QuickPresetId]]>).map(([key, preset]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => onPresetSelect(key)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        activePreset === key
                                            ? 'bg-[color:var(--forest)] text-white'
                                            : 'bg-[color:var(--paper)] text-[color:var(--ink)] hover:bg-[color:var(--mist)]'
                                    }`}
                                    title={preset.description}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--mist)] bg-[color:rgba(255,255,255,0.72)] px-4 py-3 xl:min-w-[240px]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                        Sort results
                    </div>
                    <select
                        value={sortMode}
                        onChange={(event) => onSortModeChange(event.target.value as SortMode)}
                        className="mt-2 w-full rounded-2xl border border-[color:var(--mist)] bg-white px-4 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-[color:var(--forest)]"
                    >
                        {sortModeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
