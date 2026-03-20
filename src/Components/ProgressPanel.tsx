import type { CollectionSummary } from '../types/recipe-sorter';

type ProgressPanelProps = {
    collection: CollectionSummary | null;
};

const stageLabels = [
    { key: 'extracting', label: 'Read' },
    { key: 'segmenting', label: 'Segment' },
    { key: 'parsing_macros', label: 'Parse' },
    { key: 'reprocessing', label: 'Refine' },
    { key: 'complete', label: 'Done' },
];

export default function ProgressPanel({ collection }: ProgressPanelProps) {
    if (!collection) {
        return null;
    }

    const currentStep = collection.step;
    const currentIndex = stageLabels.findIndex((item) => item.key === currentStep);
    const isFailed = collection.status === 'failed';
    const isComplete = collection.status === 'complete';
    const headerText = isFailed
        ? `Parse failed for ${collection.name}`
        : isComplete
            ? `Finished parsing ${collection.name}`
            : `Parsing ${collection.name}`;

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
                    <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            isFailed
                                ? 'bg-[color:rgba(201,109,59,0.12)] text-[color:var(--clay)]'
                                : isComplete
                                    ? 'bg-white text-[color:var(--forest)]'
                                    : 'bg-white text-[color:var(--ink)]'
                        }`}
                    >
                        {isFailed ? 'Failed' : isComplete ? 'Complete' : `${Math.min(collection.progress, 100)}%`}
                    </span>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="font-semibold text-[color:var(--ink)]">{collection.name}</div>
                            <div className="text-sm text-[color:var(--ink-muted)]">{collection.message || collection.step}</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {stageLabels.map((stage) => {
                                const stageIndex = stageLabels.findIndex((item) => item.key === stage.key);
                                const isActive = currentStep === stage.key;
                                const isDone = collection.progress >= 100 || currentIndex > stageIndex;
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

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:var(--paper)]">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                                isFailed ? 'bg-[color:var(--clay)]' : 'bg-[color:var(--forest)]'
                            }`}
                            style={{ width: `${Math.min(collection.progress, 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
