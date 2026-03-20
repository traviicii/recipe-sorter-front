import { cookingMethodOptions } from '../lib/recipe-sorter';
import type { FilterState } from '../types/recipe-sorter';

type FilterRailProps = {
    filters: FilterState;
    mobileOpen: boolean;
    onToggleMobile: () => void;
    onReset: () => void;
    onChange: (next: Partial<FilterState>) => void;
};

const controlClassName =
    'mt-2 w-full rounded-2xl border border-[color:var(--mist)] bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-[color:var(--forest)]';

type RangeControlProps = {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
    accentColor: string;
    onChange: (value: number) => void;
};

function RangeControl({
    label,
    value,
    min,
    max,
    step = 1,
    suffix = '',
    accentColor,
    onChange,
}: RangeControlProps) {
    const safeValue = Number.isFinite(value) ? value : min;

    return (
        <label className="block">
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-[color:var(--ink)]">{label}</div>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        value={safeValue}
                        onChange={(event) => onChange(Number(event.target.value))}
                        className="w-24 rounded-2xl border border-[color:var(--mist)] bg-white px-3 py-2 text-right text-sm text-[color:var(--ink)] outline-none transition focus:border-[color:var(--forest)]"
                    />
                    {suffix && <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">{suffix}</span>}
                </div>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={safeValue}
                onChange={(event) => onChange(Number(event.target.value))}
                className="mt-3 w-full"
                style={{ accentColor }}
            />

            <div className="mt-1 flex justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--ink-muted)]">
                <span>{min}</span>
                <span>{max}{suffix}</span>
            </div>
        </label>
    );
}

export default function FilterRail({ filters, mobileOpen, onToggleMobile, onReset, onChange }: FilterRailProps) {
    return (
        <div>
            <button
                type="button"
                onClick={onToggleMobile}
                className="mb-3 flex w-full items-center justify-between rounded-2xl border border-[color:var(--mist)] bg-white px-4 py-3 text-left text-sm font-semibold text-[color:var(--ink)] lg:hidden"
            >
                <span>Filters</span>
                <span>{mobileOpen ? 'Hide' : 'Show'}</span>
            </button>

            <aside className={`${mobileOpen ? 'block' : 'hidden'} lg:sticky lg:top-6 lg:block`}>
                <div className="rounded-[28px] border border-[color:var(--mist)] bg-white/90 p-5 shadow-[0_18px_40px_rgba(31,36,48,0.05)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                                Filter rail
                            </div>
                            <h3 className="mt-1 text-xl text-[color:var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                                Macro guardrails
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={onReset}
                            className="text-sm font-medium text-[color:var(--forest)] transition hover:text-[color:var(--ink)]"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="mt-5 space-y-5">
                        <RangeControl
                            label="Protein minimum"
                            value={filters.proteinMin}
                            min={0}
                            max={60}
                            suffix="g"
                            accentColor="var(--forest)"
                            onChange={(value) => onChange({ proteinMin: value })}
                        />

                        <RangeControl
                            label="Calories maximum"
                            value={filters.caloriesMax}
                            min={200}
                            max={900}
                            suffix=""
                            accentColor="var(--clay)"
                            onChange={(value) => onChange({ caloriesMax: value })}
                        />

                        <RangeControl
                            label="Fat maximum"
                            value={filters.fatMax}
                            min={5}
                            max={60}
                            suffix="g"
                            accentColor="var(--amber)"
                            onChange={(value) => onChange({ fatMax: value })}
                        />

                        <RangeControl
                            label="Fiber minimum"
                            value={filters.fiberMin}
                            min={0}
                            max={20}
                            suffix="g"
                            accentColor="var(--forest)"
                            onChange={(value) => onChange({ fiberMin: value })}
                        />

                        <RangeControl
                            label="Prep time maximum"
                            value={filters.prepTimeMax}
                            min={5}
                            max={90}
                            suffix="m"
                            accentColor="var(--ink)"
                            onChange={(value) => onChange({ prepTimeMax: value })}
                        />

                        <label className="block">
                            <div className="text-sm font-medium text-[color:var(--ink)]">Cooking method</div>
                            <select
                                value={filters.cookingMethod}
                                onChange={(event) => onChange({ cookingMethod: event.target.value })}
                                className={controlClassName}
                            >
                                {cookingMethodOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex items-start gap-3 rounded-2xl bg-[color:var(--paper)] px-4 py-3">
                            <input
                                type="checkbox"
                                checked={filters.showIncompleteData}
                                onChange={(event) => onChange({ showIncompleteData: event.target.checked })}
                                className="mt-1"
                            />
                            <span>
                                <span className="block text-sm font-medium text-[color:var(--ink)]">Show incomplete data</span>
                                <span className="block text-xs leading-5 text-[color:var(--ink-muted)]">
                                    Keep partial recipes visible when a macro value is still unknown.
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            </aside>
        </div>
    );
}
