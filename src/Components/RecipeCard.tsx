import type { Recipe } from '../types/recipe-sorter';

type RecipeCardProps = {
    recipe: Recipe;
};

const displayValue = (value: number | null, suffix = '') => {
    if (value == null) return 'Unknown';
    return `${value}${suffix}`;
};

const getMissingMacroLabel = (recipe: Recipe) => {
    const missing = [
        recipe.calories == null ? 'calories' : null,
        recipe.protein == null ? 'protein' : null,
        recipe.fat == null ? 'fat' : null,
        recipe.fiber == null ? 'fiber' : null,
    ].filter((value): value is string => Boolean(value));

    if (missing.length === 0) {
        return null;
    }
    if (missing.length === 1) {
        return `Missing ${missing[0]}`;
    }
    if (missing.length === 2) {
        return `Missing ${missing[0]} + ${missing[1]}`;
    }
    if (missing.length === 3) {
        return `Missing ${missing[0]}, ${missing[1]} + ${missing[2]}`;
    }
    return 'Missing macro data';
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const pageLabel = recipe.pageNumbers.length ? `Page ${recipe.pageNumbers.join(', ')}` : 'Page unknown';
    const method = recipe.cookingMethod || 'Other';
    const partial = recipe.macroStatus === 'partial';
    const missingMacroLabel = getMissingMacroLabel(recipe);

    return (
        <article
            className={`min-w-0 overflow-hidden rounded-[28px] border bg-white/95 p-5 shadow-[0_18px_32px_rgba(31,36,48,0.05)] transition hover:-translate-y-0.5 ${
                partial ? 'border-[color:rgba(185,133,46,0.45)]' : 'border-[color:var(--mist)]'
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                        {pageLabel}
                    </div>
                    <h3 className="mt-2 text-xl text-[color:var(--ink)] break-words" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                        {recipe.title || 'Untitled recipe'}
                    </h3>
                    {recipe.collectionName && (
                        <div className="mt-2 text-sm text-[color:var(--ink-muted)]">
                            From <span className="font-medium text-[color:var(--ink)]">{recipe.collectionName}</span>
                        </div>
                    )}
                </div>
                <div className="flex max-w-[42%] flex-col items-end gap-2">
                    <span className="max-w-full truncate rounded-full bg-[color:var(--paper)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--ink)]">
                        {method}
                    </span>
                </div>
            </div>

            {partial && missingMacroLabel && (
                <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[color:rgba(185,133,46,0.28)] bg-[color:rgba(185,133,46,0.08)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--amber)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber)]" aria-hidden="true" />
                    <span className="truncate">{missingMacroLabel}</span>
                </div>
            )}

            <div className="mt-5 grid grid-cols-3 gap-2.5">
                {[
                    {
                        label: 'Protein',
                        value: displayValue(recipe.protein, 'g'),
                        tone: 'bg-[color:rgba(111,138,69,0.14)] text-[color:var(--forest)]',
                    },
                    {
                        label: 'Calories',
                        value: displayValue(recipe.calories),
                        tone: 'bg-[color:rgba(201,109,59,0.12)] text-[color:var(--clay)]',
                    },
                    {
                        label: 'Fat',
                        value: displayValue(recipe.fat, 'g'),
                        tone: 'bg-[color:rgba(185,133,46,0.12)] text-[color:var(--amber)]',
                    },
                ].map((item) => (
                    <div key={item.label} className={`min-w-0 rounded-2xl px-2.5 py-3 sm:px-3 ${item.tone}`}>
                        <div className="truncate text-base font-semibold leading-none sm:text-lg" style={{ fontFamily: 'var(--font-mono)' }}>
                            {item.value}
                        </div>
                        <div className="mt-1 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.04em] leading-none opacity-80 sm:text-[10px]">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[color:var(--ink-muted)]">
                <div className="min-w-0 rounded-2xl border border-[color:var(--mist)] px-3 py-2">
                    <div className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.06em] sm:text-[10px]">Fiber</div>
                    <div className="mt-1 break-words text-[color:var(--ink)]">{displayValue(recipe.fiber, 'g')}</div>
                </div>
                <div className="min-w-0 rounded-2xl border border-[color:var(--mist)] px-3 py-2">
                    <div className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.06em] sm:text-[10px]">Prep time</div>
                    <div className="mt-1 break-words text-[color:var(--ink)]">{displayValue(recipe.prepTime, ' min')}</div>
                </div>
            </div>
        </article>
    );
}
