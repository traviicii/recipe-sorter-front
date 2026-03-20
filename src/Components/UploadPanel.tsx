import type { FormEvent } from 'react';

type UploadPanelProps = {
    compact?: boolean;
    submitting: boolean;
    clearingLibrary: boolean;
    canClearLibrary: boolean;
    selectedFileName: string | null;
    totalCollections: number;
    totalRecipes: number;
    infoMessage: string | null;
    errorMessage: string | null;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onFileChange: (file: File | null) => void;
    onClearLibrary: () => void;
};

export default function UploadPanel({
    compact = false,
    submitting,
    clearingLibrary,
    canClearLibrary,
    selectedFileName,
    totalCollections,
    totalRecipes,
    infoMessage,
    errorMessage,
    onSubmit,
    onFileChange,
    onClearLibrary,
}: UploadPanelProps) {
    return (
        <section className="rounded-[28px] border border-[color:var(--mist)] bg-white/90 p-6 shadow-[0_20px_60px_rgba(31,36,48,0.08)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[color:var(--paper)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                        Macro-first recipe search
                    </div>
                    <h1
                        className={`text-[color:var(--ink)] ${compact ? 'text-3xl' : 'text-4xl md:text-5xl'}`}
                        style={{ fontFamily: 'var(--font-display)', lineHeight: 1.05 }}
                    >
                        Upload a recipe collection and find meals that match your macros.
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--ink-muted)] md:text-base">
                        Drop in a PDF of recipes, wait a moment while we read it, then filter the resulting cards by the
                        macros you care about most.
                    </p>
                </div>

                <div className="rounded-2xl border border-[color:var(--mist)] bg-[color:var(--paper)] px-4 py-3 text-left">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--forest)]">
                        Library snapshot
                    </div>
                    <div className="mt-1 text-base font-semibold text-[color:var(--ink)]">
                        {totalCollections} collections
                    </div>
                    <div className="text-sm text-[color:var(--ink-muted)]">
                        {totalRecipes} recipes currently in your searchable library
                    </div>
                    <button
                        type="button"
                        onClick={onClearLibrary}
                        disabled={!canClearLibrary || clearingLibrary}
                        className="mt-3 rounded-full border border-[color:rgba(201,109,59,0.28)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--clay)] transition hover:bg-[color:rgba(201,109,59,0.08)] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        {clearingLibrary ? 'Clearing...' : 'Clear library'}
                    </button>
                </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center">
                <label className="flex-1 rounded-2xl border border-dashed border-[color:var(--mist)] bg-[color:var(--paper)] px-4 py-4 transition hover:border-[color:var(--forest)]">
                    <div className="text-sm font-medium text-[color:var(--ink)]">
                        {selectedFileName || 'Choose a PDF recipe collection'}
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--ink-muted)]">
                        PDF only. Large collections are okay; cards will appear as parsing progresses.
                    </div>
                    <input
                        type="file"
                        accept="application/pdf"
                        className="mt-3 block w-full text-sm text-[color:var(--ink-muted)]"
                        onChange={(event) => onFileChange(event.target.files?.[0] || null)}
                    />
                </label>

                <button
                    type="submit"
                    disabled={submitting}
                    className="min-w-[220px] rounded-2xl bg-[color:var(--ink)] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[color:var(--forest)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? 'Creating collection...' : 'Analyze collection'}
                </button>
            </form>

            {infoMessage && (
                <div className="mt-4 inline-flex rounded-full bg-[color:var(--paper)] px-4 py-2 text-sm font-medium text-[color:var(--forest)]">
                    {infoMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mt-4 rounded-2xl bg-[color:rgba(201,109,59,0.12)] px-4 py-3 text-sm text-[color:var(--clay)]">
                    {errorMessage}
                </div>
            )}
        </section>
    );
}
