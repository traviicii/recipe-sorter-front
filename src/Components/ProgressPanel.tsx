import type { CollectionSummary } from '../types/recipe-sorter';

type ProgressPanelProps = {
    collection: CollectionSummary | null;
    retryingCollectionId?: string | null;
    onRetryFailedRecipes?: (collectionId: string) => void;
};

const stageLabels = [
    { key: 'extracting', label: 'Read' },
    { key: 'segmenting', label: 'Segment' },
    { key: 'parsing_macros', label: 'Parse' },
    { key: 'reprocessing', label: 'Refine' },
    { key: 'complete', label: 'Done' },
];

export default function ProgressPanel({
    collection,
    retryingCollectionId = null,
    onRetryFailedRecipes,
}: ProgressPanelProps) {
    if (!collection) {
        return null;
    }

    const currentStep = collection.step;
    const currentIndex = stageLabels.findIndex((item) => item.key === currentStep);
    const isFailed = collection.status === 'failed';
    const isComplete = collection.status === 'complete';
    const progressValue = Math.min(collection.progress, 100);
    const showRetryAction = Boolean(
        onRetryFailedRecipes
        && collection.failedRecipes > 0
        && !['queued', 'processing'].includes(collection.status)
    );
    const isRetrying = retryingCollectionId === collection.id;
    const headerText = isFailed
        ? `Parse failed for ${collection.name}`
        : isComplete
            ? `Finished parsing ${collection.name}`
            : `Parsing ${collection.name}`;

    const statPills = [
        {
            label: 'Complete',
            value: collection.completeRecipes,
            tone: 'bg-[color:rgba(111,138,69,0.12)] text-[color:var(--forest)]',
        },
        {
            label: 'Partial',
            value: collection.partialRecipes,
            tone: 'bg-[color:rgba(185,133,46,0.12)] text-[color:var(--amber)]',
        },
        {
            label: 'Failed',
            value: collection.failedRecipes,
            tone: 'bg-[color:rgba(201,109,59,0.12)] text-[color:var(--clay)]',
        },
    ].filter((item) => item.value > 0 || isComplete || isFailed);

    return (
        <section className="mt-4 rounded-[24px] border border-[color:var(--mist)] bg-[color:var(--paper)] px-5 py-4">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                            Parse progress
                        </div>
                        <div className="mt-1 text-base font-medium text-[color:var(--ink)]">
                            {headerText}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {showRetryAction && (
                            <button
                                type="button"
                                onClick={() => onRetryFailedRecipes?.(collection.id)}
                                disabled={isRetrying}
                                className="rounded-full border border-[color:rgba(201,109,59,0.28)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--clay)] transition hover:bg-[color:rgba(201,109,59,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isRetrying ? 'Retrying...' : collection.failedRecipes === 1 ? 'Retry failed recipe' : 'Retry failed recipes'}
                            </button>
                        )}
                        <span
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                isFailed
                                    ? 'bg-[color:rgba(201,109,59,0.12)] text-[color:var(--clay)]'
                                    : isComplete
                                        ? 'bg-white text-[color:var(--forest)]'
                                        : 'bg-white text-[color:var(--ink)]'
                            }`}
                        >
                            {isFailed ? 'Failed' : isComplete ? 'Complete' : `${progressValue}%`}
                        </span>
                    </div>
                </div>

                <div className="rounded-2xl bg-white px-4 py-4 shadow-[0_10px_24px_rgba(31,36,48,0.04)]">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <div className="font-semibold text-[color:var(--ink)]">{collection.name}</div>
                                {!(statPills.length > 0 && (isComplete || isFailed)) && (
                                    <div className="mt-1 text-sm leading-6 text-[color:var(--ink-muted)]">
                                        {collection.message || collection.step}
                                    </div>
                                )}
                                {statPills.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {statPills.map((pill) => (
                                            <span
                                                key={pill.label}
                                                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${pill.tone}`}
                                            >
                                                {pill.value} {pill.label.toLowerCase()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {stageLabels.map((stage) => {
                                    const stageIndex = stageLabels.findIndex((item) => item.key === stage.key);
                                    const isActive = currentStep === stage.key;
                                    const isDone = progressValue >= 100 || currentIndex > stageIndex;
                                    return (
                                        <span
                                            key={stage.key}
                                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                                                isActive
                                                    ? 'bg-[color:var(--forest)] text-white'
                                                    : isDone
                                                        ? 'bg-[color:var(--paper)] text-[color:var(--ink)]'
                                                        : 'bg-[color:rgba(31,36,48,0.06)] text-[color:var(--ink-muted)]'
                                            }`}
                                        >
                                            {stage.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-muted)]">
                                <span>{currentStep.replaceAll('_', ' ')}</span>
                                <span>{progressValue}%</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:var(--paper)]">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        isFailed ? 'bg-[color:var(--clay)]' : 'bg-[color:var(--forest)]'
                                    }`}
                                    style={{ width: `${progressValue}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
