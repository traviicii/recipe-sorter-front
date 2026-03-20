import RecipeCard from './RecipeCard';
import type { Recipe } from '../types/recipe-sorter';

type RecipeGridProps = {
    recipes: Recipe[];
};

export default function RecipeGrid({ recipes }: RecipeGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {recipes.map((recipe) => (
                <RecipeCard
                    key={recipe.collectionId ? `${recipe.collectionId}:${recipe.id}` : recipe.id}
                    recipe={recipe}
                />
            ))}
        </div>
    );
}
