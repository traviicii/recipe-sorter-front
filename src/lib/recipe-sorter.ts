import type {
    CollectionSummary,
    FilterState,
    QuickPresetId,
    Recipe,
    SortMode,
} from '../types/recipe-sorter';

export const cookingMethodOptions = ['All', 'Oven', 'Stovetop', 'Air Fryer', 'Blender', 'No Cook', 'Other'];

export const sortModeOptions: Array<{ value: SortMode; label: string }> = [
    { value: 'protein-desc', label: 'Protein: high to low' },
    { value: 'calories-asc', label: 'Calories: low to high' },
    { value: 'fat-asc', label: 'Fat: low to high' },
    { value: 'fiber-desc', label: 'Fiber: high to low' },
    { value: 'prepTime-asc', label: 'Prep time: quick first' },
];

export const quickPresets: Record<
    QuickPresetId,
    {
        label: string;
        description: string;
        filters: FilterState;
        sortMode: SortMode;
    }
> = {
    'high-protein': {
        label: 'High Protein',
        description: 'Bias toward meals that hit protein targets first.',
        filters: {
            proteinMin: 30,
            caloriesMax: 700,
            fatMax: 40,
            fiberMin: 0,
            prepTimeMax: 60,
            cookingMethod: 'All',
            showIncompleteData: true,
        },
        sortMode: 'protein-desc',
    },
    'lower-calorie': {
        label: 'Lower Calorie',
        description: 'Keep calories tighter while preserving usable protein.',
        filters: {
            proteinMin: 20,
            caloriesMax: 500,
            fatMax: 28,
            fiberMin: 0,
            prepTimeMax: 60,
            cookingMethod: 'All',
            showIncompleteData: true,
        },
        sortMode: 'calories-asc',
    },
    'quick-prep': {
        label: 'Quick Prep',
        description: 'Surface recipes that stay fast enough for weekday prep.',
        filters: {
            proteinMin: 15,
            caloriesMax: 700,
            fatMax: 40,
            fiberMin: 0,
            prepTimeMax: 20,
            cookingMethod: 'All',
            showIncompleteData: true,
        },
        sortMode: 'prepTime-asc',
    },
};

export const defaultFilters = { ...quickPresets['high-protein'].filters };
export const defaultSortMode: SortMode = quickPresets['high-protein'].sortMode;

const compareNullable = (left: number | null, right: number | null, ascending: boolean) => {
    if (left == null && right == null) return 0;
    if (left == null) return 1;
    if (right == null) return -1;
    return ascending ? left - right : right - left;
};

const meetsMinimum = (value: number | null, min: number, showIncompleteData: boolean) => {
    if (value == null) return showIncompleteData;
    return value >= min;
};

const meetsMaximum = (value: number | null, max: number, showIncompleteData: boolean) => {
    if (value == null) return showIncompleteData;
    return value <= max;
};

export function filterRecipes(recipes: Recipe[], filters: FilterState): Recipe[] {
    return recipes.filter((recipe) => {
        if (recipe.macroStatus === 'failed') {
            return false;
        }
        if (!filters.showIncompleteData && recipe.macroStatus !== 'complete') {
            return false;
        }
        if (!meetsMinimum(recipe.protein, filters.proteinMin, filters.showIncompleteData)) {
            return false;
        }
        if (!meetsMaximum(recipe.calories, filters.caloriesMax, filters.showIncompleteData)) {
            return false;
        }
        if (!meetsMaximum(recipe.fat, filters.fatMax, filters.showIncompleteData)) {
            return false;
        }
        if (!meetsMinimum(recipe.fiber, filters.fiberMin, filters.showIncompleteData)) {
            return false;
        }
        if (!meetsMaximum(recipe.prepTime, filters.prepTimeMax, filters.showIncompleteData)) {
            return false;
        }
        if (filters.cookingMethod !== 'All') {
            return (recipe.cookingMethod || 'Other') === filters.cookingMethod;
        }
        return true;
    });
}

export function sortRecipes(recipes: Recipe[], sortMode: SortMode): Recipe[] {
    const sorted = [...recipes];
    sorted.sort((left, right) => {
        switch (sortMode) {
            case 'protein-desc':
                return compareNullable(left.protein, right.protein, false);
            case 'calories-asc':
                return compareNullable(left.calories, right.calories, true);
            case 'fat-asc':
                return compareNullable(left.fat, right.fat, true);
            case 'fiber-desc':
                return compareNullable(left.fiber, right.fiber, false);
            case 'prepTime-asc':
                return compareNullable(left.prepTime, right.prepTime, true);
            default:
                return 0;
        }
    });
    return sorted;
}

export function formatCountLabel(collection: CollectionSummary): string {
    return `${collection.completeRecipes} complete, ${collection.partialRecipes} partial, ${collection.failedRecipes} failed`;
}

export function getSelectedCollections(
    collections: CollectionSummary[],
    selectedCollectionIds: string[] | null,
): CollectionSummary[] {
    if (!selectedCollectionIds || selectedCollectionIds.length === 0) {
        return collections;
    }
    const selectedSet = new Set(selectedCollectionIds);
    return collections.filter((collection) => selectedSet.has(collection.id));
}

export function formatLibraryScope(
    collections: CollectionSummary[],
    selectedCollectionIds: string[] | null,
): string {
    if (!selectedCollectionIds || selectedCollectionIds.length === 0) {
        return 'All collections';
    }
    const selected = getSelectedCollections(collections, selectedCollectionIds);
    if (selected.length === 1) {
        return selected[0].name;
    }
    return `${selected.length} collections selected`;
}
