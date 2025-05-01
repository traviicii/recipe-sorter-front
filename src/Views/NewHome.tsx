import { useState, useEffect } from 'react';
import FilterSection from '../Components/filterSection';



const NewHome = () => {

    const [rawPDF, setRawPDF] = useState(null)
    const [loading, setLoading] = useState(false)

    const [sortKey, setSortKey] = useState('protein');
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'


    // State for recipe data
    const [recipes, setRecipes] = useState([])
    // const [recipes] = useState([
    //     {
    //         title: "Harissa Spiced Meatballs",
    //         prepTime: 30,
    //         calories: 543,
    //         protein: 30,
    //         fat: 27,
    //         saturatedFat: 7,
    //         fiber: 3,
    //         ingredientCount: 10,
    //         cookingMethod: "Oven"
    //     },
    //     {
    //         title: "Sofrito Chicken Sandwich",
    //         prepTime: 50,
    //         calories: 570,
    //         protein: 36,
    //         fat: 20,
    //         saturatedFat: 3,
    //         fiber: 4,
    //         ingredientCount: 9,
    //         cookingMethod: "Stovetop"
    //     },
    //     {
    //         title: "One Pan Burrito Casserole",
    //         prepTime: 45,
    //         calories: 498,
    //         protein: 33,
    //         fat: 27,
    //         saturatedFat: 12,
    //         fiber: 5,
    //         ingredientCount: 7,
    //         cookingMethod: "Oven"
    //     },
    //     {
    //         title: "Matar Paneer",
    //         prepTime: 20,
    //         calories: 508,
    //         protein: 35,
    //         fat: 33,
    //         saturatedFat: 21,
    //         fiber: 6,
    //         ingredientCount: 11,
    //         cookingMethod: "Stovetop"
    //     },
    //     {
    //         title: "Easy Beef Enchiladas",
    //         prepTime: 45,
    //         calories: 640,
    //         protein: 31,
    //         fat: 37,
    //         saturatedFat: 17,
    //         fiber: 9,
    //         ingredientCount: 6,
    //         cookingMethod: "Oven"
    //     },
    //     {
    //         title: "Air Fryer Salami Pizza",
    //         prepTime: 20,
    //         calories: 515,
    //         protein: 24,
    //         fat: 20,
    //         saturatedFat: 10,
    //         fiber: 3,
    //         ingredientCount: 5,
    //         cookingMethod: "Air Fryer"
    //     },
    //     {
    //         title: "Chocolate Smoothie",
    //         prepTime: 5,
    //         calories: 558,
    //         protein: 33,
    //         fat: 24,
    //         saturatedFat: 3,
    //         fiber: 20,
    //         ingredientCount: 10,
    //         cookingMethod: "Blender"
    //     },
    //     {
    //         title: "Overnight Oats",
    //         prepTime: 10,
    //         calories: 445,
    //         protein: 32,
    //         fat: 17,
    //         saturatedFat: 3,
    //         fiber: 7,
    //         ingredientCount: 8,
    //         cookingMethod: "No Cook"
    //     }
    // ]);

    // Filtered recipes
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    // Filter ranges
    const [proteinMin, setProteinMin] = useState(0);
    const [proteinMax, setProteinMax] = useState(60);
    const [caloriesMin, setCaloriesMin] = useState(0);
    const [caloriesMax, setCaloriesMax] = useState(700);
    const [fatMin, setFatMin] = useState(0);
    const [fatMax, setFatMax] = useState(60);
    const [saturatedFatMin, setSaturatedFatMin] = useState(0);
    const [saturatedFatMax, setSaturatedFatMax] = useState(30);
    const [fiberMin, setFiberMin] = useState(0);
    const [fiberMax, setFiberMax] = useState(20);
    const [prepTimeMin, setPrepTimeMin] = useState(0);
    const [prepTimeMax, setPrepTimeMax] = useState(60);
    const [ingredientsMin, setIngredientsMin] = useState(0);
    const [ingredientsMax, setIngredientsMax] = useState(15);
    const [cookingMethod, setCookingMethod] = useState('All');

    // Apply filters when they change
    useEffect(() => {
        const filtered = recipes.filter(recipe => {
            const proteinMatch = recipe.protein >= proteinMin && recipe.protein <= proteinMax;
            const caloriesMatch = recipe.calories >= caloriesMin && recipe.calories <= caloriesMax;
            const fatMatch = recipe.fat >= fatMin && recipe.fat <= fatMax;
            const satFatMatch = recipe.saturatedFat >= saturatedFatMin && recipe.saturatedFat <= saturatedFatMax;
            const fiberMatch = recipe.fiber >= fiberMin && recipe.fiber <= fiberMax;
            const prepTimeMatch = recipe.prepTime >= prepTimeMin && recipe.prepTime <= prepTimeMax;
            const ingredientsMatch = recipe.ingredientCount >= ingredientsMin && recipe.ingredientCount <= ingredientsMax;
            const methodMatch = cookingMethod === 'All' || recipe.cookingMethod === cookingMethod;

            filtered.sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a[sortKey] - b[sortKey];
                } else {
                    return b[sortKey] - a[sortKey];
                }
            });

            setFilteredRecipes(filtered);

            return proteinMatch && caloriesMatch && fatMatch && satFatMatch &&
                fiberMatch && prepTimeMatch && ingredientsMatch && methodMatch;
        });

        setFilteredRecipes(filtered);
    }, [
        recipes, proteinMin, proteinMax, caloriesMin, caloriesMax,
        fatMin, fatMax, saturatedFatMin, saturatedFatMax, fiberMin,
        fiberMax, prepTimeMin, prepTimeMax, ingredientsMin, ingredientsMax, cookingMethod
    ]);

    // Reset all filters
    const resetFilters = () => {
        setProteinMin(20);
        setProteinMax(45);
        setCaloriesMin(200);
        setCaloriesMax(600);
        setFatMin(5);
        setFatMax(40);
        setSaturatedFatMin(0);
        setSaturatedFatMax(15);
        setFiberMin(0);
        setFiberMax(15);
        setPrepTimeMin(5);
        setPrepTimeMax(60);
        setIngredientsMin(3);
        setIngredientsMax(12);
        setCookingMethod('All');
    };

    // Get available cooking methods
    const cookingMethods = ['All', 'Oven', 'Stovetop', 'Air Fryer', 'Blender', 'No Cook'];

    async function uploadPDF(rawPDF: File) {
        console.log("Uploading file:", rawPDF, typeof rawPDF);
        // Create a FormData object and append the PDF file.
        const formData = new FormData();
        formData.append('file', rawPDF);

        // backend local 'http://127.0.0.1:8000/parse-recipes'
        // frontend hosted 'https://recipe-sorter-back.onrender.com/parse-recipes'

        try {
            const url = BACK_END_URL + '/parse-recipes'
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                // Do NOT manually set the "Content-Type" header;
                // browser will automatically set it to "multipart/form-data" with a proper boundary.
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            // Parse and log the JSON response from your backend.
            const result = await response.json();
            console.log('Parsed Recipes:', result);
            setLoading(false)
            setRecipes(result.recipes)
            return result;
        } catch (error) {
            console.error('Error uploading PDF:', error);
        }
    }

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        if (rawPDF) {
            console.log("Selected file:", rawPDF);
            setLoading(true)
            await uploadPDF(rawPDF);
        }
    };

    return (
        <div >
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button
                        onClick={resetFilters}
                        className="text-blue-600 hover:underline"
                    >
                        Reset All
                    </button>
                </div>

                <FilterSection title="Protein">
                    {/* Protein min/max inputs */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="font-medium">Protein</label>
                            <div>
                                <input
                                    type="number"
                                    value={proteinMin}
                                    onChange={(e) => setProteinMin(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> - </span>
                                <input
                                    type="number"
                                    value={proteinMax}
                                    onChange={(e) => setProteinMax(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> g</span>
                            </div>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                    width: `${(proteinMax - proteinMin) / 0.6}%`,
                                    marginLeft: `${proteinMin / 0.6}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </FilterSection>

                <FilterSection title="Calories">
                    {/* Calories min/max inputs */}
                </FilterSection>

                <FilterSection title="Fat">
                    {/* Fat min/max inputs */}
                </FilterSection>

                <FilterSection title="Saturated Fat">
                    {/* Saturated Fat min/max inputs */}
                </FilterSection>

                <FilterSection title="Fiber">
                    {/* Fiber min/max inputs */}
                </FilterSection>

                <FilterSection title="Prep Time">
                    {/* Prep Time min/max inputs */}
                </FilterSection>

                <FilterSection title="# of Ingredients">
                    {/* Ingredients min/max inputs */}
                </FilterSection>

                <FilterSection title="Cooking Method">
                    {/* Cooking Method buttons */}
                </FilterSection>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                    <label className="mr-2 font-medium">Sort by:</label>
                    <select
                        className="border rounded p-1"
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                    >
                        <option value="protein">Protein</option>
                        <option value="calories">Calories</option>
                        <option value="fat">Fat</option>
                        <option value="fiber">Fiber</option>
                        <option value="prepTime">Prep Time</option>
                        <option value="ingredientCount"># of Ingredients</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <label className="mr-2 font-medium">Order:</label>
                    <select
                        className="border rounded p-1"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="desc">High → Low</option>
                        <option value="asc">Low → High</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default NewHome;