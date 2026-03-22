export type Recipe = {
    id: string;
    collectionId?: string;
    collectionName?: string;
    collectionSourceFilename?: string;
    title: string | null;
    prepTime: number | null;
    ingredients: string[];
    ingredientCount: number | null;
    calories: number | null;
    protein: number | null;
    fat: number | null;
    saturatedFat: number | null;
    fiber: number | null;
    instructions?: string | null;
    cookingMethod: string | null;
    confidence?: Record<string, number | null>;
    sources?: Record<string, string | null>;
    macroStatus: 'queued' | 'complete' | 'partial' | 'failed';
    ingredientStatus: 'idle' | 'pending' | 'queued' | 'processing' | 'complete' | 'failed';
    pageNumbers: number[];
};

export type CollectionSummary = {
    id: string;
    name: string;
    sourceFilename: string;
    pdfHash: string;
    parserVersion: string;
    status: 'queued' | 'processing' | 'complete' | 'failed';
    step: string;
    progress: number;
    macroStatus: 'queued' | 'processing' | 'complete' | 'failed';
    ingredientStatus: 'idle' | 'pending' | 'queued' | 'processing' | 'complete' | 'failed';
    pageCount: number;
    totalBlocks: number;
    totalRecipes: number;
    parsedRecipes: number;
    completeRecipes: number;
    partialRecipes: number;
    failedRecipes: number;
    ocrRecipes: number;
    enrichedRecipes: number;
    reused: boolean;
    lastJobId: string | null;
    message: string;
    error: string | null;
    createdAt: string;
    updatedAt: string;
};

export type SortMode =
    | 'protein-desc'
    | 'calories-asc'
    | 'fat-asc'
    | 'fiber-desc'
    | 'prepTime-asc';

export type QuickPresetId = 'high-protein' | 'lower-calorie' | 'quick-prep';

export type FilterState = {
    useProtein: boolean;
    proteinMin: number;
    useCalories: boolean;
    caloriesMax: number;
    useFat: boolean;
    fatMax: number;
    useFiber: boolean;
    fiberMin: number;
    usePrepTime: boolean;
    prepTimeMax: number;
    cookingMethod: string;
    showIncompleteData: boolean;
};
