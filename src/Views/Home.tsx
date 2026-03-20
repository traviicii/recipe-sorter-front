import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router';

import CollectionHeader from '../Components/CollectionHeader';
import CollectionScopePanel from '../Components/CollectionScopePanel';
import EmptyState from '../Components/EmptyState';
import FilterRail from '../Components/FilterRail';
import ProgressPanel from '../Components/ProgressPanel';
import RecipeGrid from '../Components/RecipeGrid';
import ResultsToolbar from '../Components/ResultsToolbar';
import UploadPanel from '../Components/UploadPanel';
import {
    defaultFilters,
    defaultSortMode,
    filterRecipes,
    getSelectedCollections,
    quickPresets,
    sortRecipes,
} from '../lib/recipe-sorter';
import type {
    CollectionSummary,
    FilterState,
    QuickPresetId,
    Recipe,
    SortMode,
} from '../types/recipe-sorter';

const BACK_END_URL = import.meta.env.VITE_BACK_END_API_URL;
const TRANSIENT_STATUS_CODES = new Set([502, 503, 504]);
const RETRY_DELAYS_MS = [500, 1500, 3000];
const POLL_INTERVAL_MS = 3000;

type LocationState = {
    reused?: boolean;
    uploadedCollectionId?: string;
    uploadedCollectionName?: string;
};

const wait = (ms: number) =>
    new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
    });

async function getResponseErrorMessage(response: Response, fallback: string) {
    const raw = await response.text().catch(() => '');
    if (!raw) {
        return fallback;
    }

    try {
        const payload = JSON.parse(raw) as { detail?: string; message?: string };
        return payload.detail || payload.message || fallback;
    } catch {
        return raw.trim() || fallback;
    }
}

async function fetchJsonWithRetry<T>(url: string, init?: RequestInit): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
        try {
            const response = await fetch(url, init);
            if (!response.ok) {
                const fallback = `Request failed (${response.status})`;
                const message = await getResponseErrorMessage(response, fallback);
                if (attempt < RETRY_DELAYS_MS.length && TRANSIENT_STATUS_CODES.has(response.status)) {
                    await wait(RETRY_DELAYS_MS[attempt]);
                    continue;
                }
                throw new Error(message);
            }

            return (await response.json()) as T;
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                throw error;
            }

            lastError = error instanceof Error ? error : new Error('Request failed.');
            if (attempt < RETRY_DELAYS_MS.length && error instanceof TypeError) {
                await wait(RETRY_DELAYS_MS[attempt]);
                continue;
            }
            break;
        }
    }

    throw lastError ?? new Error('Request failed.');
}

export default function Home() {
    const { collectionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const locationState = (location.state as LocationState | null) ?? null;
    const pollRef = useRef<number | null>(null);
    const pollInFlightRef = useRef(false);

    const [rawPDF, setRawPDF] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [clearingLibrary, setClearingLibrary] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);
    const [collections, setCollections] = useState<CollectionSummary[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [progressCollectionId, setProgressCollectionId] = useState<string | null>(null);
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[] | null>(null);
    const [filters, setFilters] = useState<FilterState>({ ...defaultFilters });
    const [sortMode, setSortMode] = useState<SortMode>(defaultSortMode);
    const [activePreset, setActivePreset] = useState<QuickPresetId | null>('high-protein');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const selectedCollections = useMemo(
        () => getSelectedCollections(collections, selectedCollectionIds),
        [collections, selectedCollectionIds]
    );
    const usableRecipes = useMemo(
        () => recipes.filter((recipe) => recipe.macroStatus !== 'failed'),
        [recipes]
    );
    const visibleRecipes = useMemo(
        () => sortRecipes(filterRecipes(recipes, filters), sortMode),
        [recipes, filters, sortMode]
    );
    const totalLibraryRecipes = useMemo(
        () => collections.reduce((sum, collection) => sum + collection.parsedRecipes, 0),
        [collections]
    );
    const progressCollection = useMemo(() => {
        if (progressCollectionId) {
            return collections.find((collection) => collection.id === progressCollectionId) ?? null;
        }
        return collections.find(
            (collection) => collection.status === 'queued' || collection.status === 'processing'
        ) ?? null;
    }, [collections, progressCollectionId]);

    useEffect(() => {
        if (collectionId) {
            setSelectedCollectionIds([collectionId]);
            return;
        }
        const queryIds = (searchParams.get('collections') || '')
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);
        setSelectedCollectionIds(queryIds.length > 0 ? queryIds : null);
    }, [collectionId, searchParams]);

    useEffect(() => {
        if (!locationState) return;
        if (locationState.uploadedCollectionId) {
            setProgressCollectionId(locationState.uploadedCollectionId);
        }
        if (locationState.uploadedCollectionName) {
            setInfoMessage(
                locationState.reused
                    ? `"${locationState.uploadedCollectionName}" is already in your library.`
                    : `Added "${locationState.uploadedCollectionName}" to your library.`
            );
        } else if (locationState.reused) {
            setInfoMessage('Opened an existing collection from your library.');
        }
    }, [location.key, locationState]);

    useEffect(() => {
        return () => {
            if (pollRef.current) {
                window.clearInterval(pollRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (progressCollectionId && !collections.some((collection) => collection.id === progressCollectionId)) {
            setProgressCollectionId(null);
            return;
        }
        if (!progressCollectionId) {
            const activeCollection = collections.find(
                (collection) => collection.status === 'queued' || collection.status === 'processing'
            );
            if (activeCollection) {
                setProgressCollectionId(activeCollection.id);
            }
        }
    }, [collections, progressCollectionId]);

    useEffect(() => {
        let active = true;
        const query = selectedCollectionIds && selectedCollectionIds.length > 0
            ? `?collectionIds=${selectedCollectionIds.join(',')}`
            : '';

        const stopPolling = () => {
            if (pollRef.current) {
                window.clearInterval(pollRef.current);
                pollRef.current = null;
            }
            pollInFlightRef.current = false;
        };

        const syncSelectionWithAvailableCollections = (nextCollections: CollectionSummary[]) => {
            if (!selectedCollectionIds || selectedCollectionIds.length === 0) {
                return;
            }

            const availableIds = new Set(nextCollections.map((collection) => collection.id));
            const remainingSelected = selectedCollectionIds.filter((id) => availableIds.has(id));
            if (remainingSelected.length === selectedCollectionIds.length) {
                return;
            }

            if (remainingSelected.length === 0) {
                navigate('/', { replace: true });
                return;
            }
            if (remainingSelected.length === 1) {
                navigate(`/collections/${remainingSelected[0]}`, { replace: true });
                return;
            }
            navigate(`/?collections=${remainingSelected.join(',')}`, { replace: true });
        };

        const fetchLibraryState = async () => {
            try {
                const [collectionsPayload, recipesPayload] = await Promise.all([
                    fetchJsonWithRetry<{ collections?: CollectionSummary[] }>(`${BACK_END_URL}/collections`),
                    fetchJsonWithRetry<{ recipes?: Recipe[] }>(`${BACK_END_URL}/recipes${query}`),
                ]);
                if (!active) return false;

                const nextCollections = collectionsPayload.collections ?? [];
                setCollections(nextCollections);
                setRecipes(recipesPayload.recipes ?? []);
                setErrorMessage(null);
                syncSelectionWithAvailableCollections(nextCollections);

                const busy = nextCollections.some(
                    (collection: CollectionSummary) =>
                        collection.status === 'queued' || collection.status === 'processing'
                );
                if (!busy) {
                    stopPolling();
                }
                return busy;
            } catch (error) {
                if (!active) return false;
                console.error('Error loading library:', error);
                setErrorMessage('Failed to load your recipe library.');
                stopPolling();
                return false;
            } finally {
                pollInFlightRef.current = false;
            }
        };

        void (async () => {
            const busy = await fetchLibraryState();
            if (!active || !busy) {
                return;
            }
            stopPolling();
            pollRef.current = window.setInterval(() => {
                if (pollInFlightRef.current) {
                    return;
                }
                pollInFlightRef.current = true;
                void fetchLibraryState();
            }, POLL_INTERVAL_MS);
        })();

        return () => {
            active = false;
            stopPolling();
        };
    }, [location.key, navigate, selectedCollectionIds]);

    const applyPreset = (presetId: QuickPresetId) => {
        const preset = quickPresets[presetId];
        setFilters({ ...preset.filters });
        setSortMode(preset.sortMode);
        setActivePreset(presetId);
    };

    const resetFilters = () => {
        applyPreset('high-protein');
    };

    const updateFilters = (next: Partial<FilterState>) => {
        setFilters((current) => ({ ...current, ...next }));
        setActivePreset(null);
    };

    const selectAllCollections = () => {
        setSelectedCollectionIds(null);
        navigate('/');
    };

    const toggleCollectionSelection = (targetCollectionId: string) => {
        const allIds = collections.map((collection) => collection.id);
        const currentIds = selectedCollectionIds && selectedCollectionIds.length > 0
            ? selectedCollectionIds
            : allIds;

        let nextIds = currentIds.includes(targetCollectionId)
            ? currentIds.filter((id) => id !== targetCollectionId)
            : [...currentIds, targetCollectionId];

        if (nextIds.length === 0 || nextIds.length === allIds.length) {
            setSelectedCollectionIds(null);
            navigate('/');
            return;
        }

        nextIds = allIds.filter((id) => nextIds.includes(id));
        setSelectedCollectionIds(nextIds);
        if (nextIds.length === 1) {
            navigate(`/collections/${nextIds[0]}`);
        } else {
            navigate(`/?collections=${nextIds.join(',')}`);
        }
    };

    async function startCollectionUpload(file: File) {
        setSubmitting(true);
        setErrorMessage(null);
        setInfoMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${BACK_END_URL}/collections`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const message = await getResponseErrorMessage(
                    response,
                    `Server error (${response.status})`
                );
                throw new Error(message);
            }

            const payload = await response.json();
            const uploadedCollectionId = payload.collection?.id as string | undefined;
            const uploadedCollectionName = payload.collection?.name as string | undefined;
            if (uploadedCollectionId) {
                setProgressCollectionId(uploadedCollectionId);
            }
            navigate('/', {
                state: {
                    reused: Boolean(payload.reused),
                    uploadedCollectionId,
                    uploadedCollectionName,
                },
            });
            setRawPDF(null);
        } catch (error) {
            console.error('Error creating collection:', error);
            setErrorMessage('Failed to upload and add this collection to your library.');
        } finally {
            setSubmitting(false);
        }
    }

    async function clearLibrary() {
        const confirmed = window.confirm(
            'Clear your entire recipe library? This will remove all uploaded collections and parsed recipes.'
        );
        if (!confirmed) {
            return;
        }

        setClearingLibrary(true);
        setErrorMessage(null);
        setInfoMessage(null);

        try {
            const response = await fetch(`${BACK_END_URL}/collections`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const message = await getResponseErrorMessage(
                    response,
                    `Request failed (${response.status})`
                );
                throw new Error(message);
            }

            if (pollRef.current) {
                window.clearInterval(pollRef.current);
                pollRef.current = null;
            }

            setCollections([]);
            setRecipes([]);
            setProgressCollectionId(null);
            setSelectedCollectionIds(null);
            setRawPDF(null);
            setInfoMessage('Library cleared.');
            navigate('/');
        } catch (error) {
            console.error('Error clearing library:', error);
            setErrorMessage(
                error instanceof Error ? error.message : 'Failed to clear the library.'
            );
        } finally {
            setClearingLibrary(false);
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!rawPDF) {
            setErrorMessage('Choose a PDF collection first.');
            return;
        }
        await startCollectionUpload(rawPDF);
    };

    const selectedCollectionCount = selectedCollectionIds?.length ?? collections.length;
    const hasCollections = collections.length > 0;
    const hasProcessing = collections.some((collection) => collection.status === 'queued' || collection.status === 'processing');
    const showParsingEmpty = hasCollections && usableRecipes.length === 0 && hasProcessing;
    const showFailedEmpty = hasCollections && usableRecipes.length === 0 && !hasProcessing;
    const showNoMatch = hasCollections && usableRecipes.length > 0 && visibleRecipes.length === 0;

    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
                <UploadPanel
                    compact={hasCollections}
                    submitting={submitting}
                    clearingLibrary={clearingLibrary}
                    canClearLibrary={hasCollections && !hasProcessing && !submitting}
                    selectedFileName={rawPDF?.name || null}
                    totalCollections={collections.length}
                    totalRecipes={totalLibraryRecipes}
                    infoMessage={infoMessage}
                    errorMessage={errorMessage}
                    onSubmit={handleSubmit}
                    onFileChange={setRawPDF}
                    onClearLibrary={clearLibrary}
                />

                {hasCollections ? (
                    <>
                        <ProgressPanel collection={progressCollection} />
                        <CollectionHeader collections={collections} selectedCollectionIds={selectedCollectionIds} />

                        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                            <div className="space-y-6">
                                <FilterRail
                                    filters={filters}
                                    mobileOpen={mobileFiltersOpen}
                                    onToggleMobile={() => setMobileFiltersOpen((open) => !open)}
                                    onReset={resetFilters}
                                    onChange={updateFilters}
                                />
                                <CollectionScopePanel
                                    collections={collections}
                                    selectedCollectionIds={selectedCollectionIds}
                                    onSelectAll={selectAllCollections}
                                    onToggleCollection={toggleCollectionSelection}
                                />
                            </div>

                            <main className="space-y-6">
                                <ResultsToolbar
                                    visibleCount={visibleRecipes.length}
                                    totalCount={selectedCollections.reduce((sum, collection) => sum + collection.parsedRecipes, 0)}
                                    selectedCollectionCount={selectedCollectionCount}
                                    activePreset={activePreset}
                                    sortMode={sortMode}
                                    onPresetSelect={applyPreset}
                                    onSortModeChange={setSortMode}
                                />

                                {showParsingEmpty && <EmptyState variant="parsing" />}
                                {showFailedEmpty && <EmptyState variant="failed" />}
                                {showNoMatch && <EmptyState variant="no-match" />}
                                {visibleRecipes.length > 0 && <RecipeGrid recipes={visibleRecipes} />}
                            </main>
                        </div>
                    </>
                ) : (
                    <div className="mt-6">
                        <EmptyState variant="no-file" />
                    </div>
                )}
            </div>
        </div>
    );
}
