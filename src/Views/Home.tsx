import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const BACK_END_URL = import.meta.env.VITE_BACK_END_API_URL

const Home = () => {

    const [rawPDF, setRawPDF] = useState(null)
    const [loading, setLoading] = useState(false)


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

    // Toggle Filters
    const [enableProtein, setEnableProtein] = useState(true);
    const [enableCalories, setEnableCalories] = useState(true);
    const [enableFat, setEnableFat] = useState(true);
    const [enableSaturatedFat, setEnableSaturatedFat] = useState(true);
    const [enableFiber, setEnableFiber] = useState(true);
    const [enablePrepTime, setEnablePrepTime] = useState(true);
    const [enableIngredients, setEnableIngredients] = useState(true);

    // Sort Criteria
    const [sortField, setSortField] = useState('protein');
    const [sortDirection, setSortDirection] = useState('desc');

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
            const proteinMatch = !enableProtein || recipe.protein >= proteinMin && recipe.protein <= proteinMax;
            const caloriesMatch = !enableCalories || recipe.calories >= caloriesMin && recipe.calories <= caloriesMax;
            const fatMatch = !enableFat || recipe.fat >= fatMin && recipe.fat <= fatMax;
            const satFatMatch = !enableSaturatedFat || recipe.saturatedFat >= saturatedFatMin && recipe.saturatedFat <= saturatedFatMax;
            const fiberMatch = !enableFiber || recipe.fiber >= fiberMin && recipe.fiber <= fiberMax;
            const prepTimeMatch = !enablePrepTime || recipe.prepTime >= prepTimeMin && recipe.prepTime <= prepTimeMax;
            const ingredientsMatch = !enableIngredients || recipe.ingredientCount >= ingredientsMin && recipe.ingredientCount <= ingredientsMax;
            const methodMatch = cookingMethod === 'All' || recipe.cookingMethod === cookingMethod;

            return proteinMatch && caloriesMatch && fatMatch && satFatMatch &&
                fiberMatch && prepTimeMatch && ingredientsMatch && methodMatch;
        });

        const sorted = [...filtered].sort((a, b) => {
            if (sortDirection === 'asc') return a[sortField] - b[sortField];
            return b[sortField] - a[sortField];
        });

        setFilteredRecipes(sorted);
    }, [
        recipes, proteinMin, proteinMax, caloriesMin, caloriesMax,
        fatMin, fatMax, saturatedFatMin, saturatedFatMax, fiberMin,
        fiberMax, prepTimeMin, prepTimeMax, ingredientsMin, ingredientsMax,
        cookingMethod, sortDirection, sortField,
        enableProtein, enableCalories, enableFat, enableSaturatedFat,
        enableFiber, enablePrepTime, enableIngredients
    ]);

    // Reset all filters
    const resetFilters = () => {
        setProteinMin(0);
        setProteinMax(60);
        setCaloriesMin(0);
        setCaloriesMax(700);
        setFatMin(0);
        setFatMax(60);
        setSaturatedFatMin(0);
        setSaturatedFatMax(30);
        setFiberMin(0);
        setFiberMax(20);
        setPrepTimeMin(0);
        setPrepTimeMax(60);
        setIngredientsMin(0);
        setIngredientsMax(15);
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
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Recipe Filter</h1>


            {/* File Upload */}
            <div className="bg-blue-50 p-4 rounded mb-6">
                <form onSubmit={handleSubmit}>
                    <div className='flex items-center'>
                        <label htmlFor="myfile" className='"
                            p-2 
                            rounded-md 
                            mr-2 
                            bg-green-500
                            hover:bg-green-600
                            hover:shadow-lg 
                            transform 
                            hover:-translate-y-1 
                            transition 
                            duration-300 
                            ease-in-out 
                             
                            font-semibold
                        "'>Select a PDF file:</label>
                        <input type="file" accept="application/pdf" id="myfile" name="file" onChange={(e) => { setRawPDF(e.target.files[0]) }} />

                        {
                            loading ?
                                <div className="flex items-center justify-center p-2">
                                    <div className="w-6 h-6 border-2 border-gray-300 border-t-green-500 border-solid rounded-full animate-spin"></div>
                                </div>
                                :
                                <button
                                    type="submit"
                                    className="
                            p-2 
                            rounded-md 
                            mr-2 
                            bg-green-500 
                            hover:bg-green-600 
                            hover:shadow-lg 
                            transform 
                            hover:-translate-y-1 
                            transition 
                            duration-300 
                            ease-in-out 
                             
                            font-semibold
                        "
                                >
                                    Export PDF
                                </button>

                        }

                    </div>

                </form>
            </div>

            {/* Filter Controls */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Protein Filter */}
                    <div >
                        <div className='flex mb-1 justify-between'>
                            <div className="flex">
                                <div >
                                    <input type="checkbox" className='mr-2' checked={enableProtein} onChange={() => setEnableProtein(!enableProtein)} />
                                </div>
                                <label className="font-medium">Protein</label>

                            </div>
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

                    {/* Calories Filter */}
                    <div>

                        <div className="flex justify-between mb-1">
                            <div className='flex'>
                                <input type="checkbox" className='mr-2' checked={enableCalories} onChange={() => setEnableCalories(!enableCalories)} />
                                <label className="font-medium mr-2">Calories</label>

                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={caloriesMin}
                                    onChange={(e) => setCaloriesMin(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> - </span>
                                <input
                                    type="number"
                                    value={caloriesMax}
                                    onChange={(e) => setCaloriesMax(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                            </div>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                    width: `${(caloriesMax - caloriesMin) / 7}%`,
                                    marginLeft: `${caloriesMin / 7}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Fat Filter */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <div className='flex'>

                                <input type="checkbox" className='mr-2' checked={enableFat} onChange={() => setEnableFat(!enableFat)} />
                                <label className="font-medium">Fat</label>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={fatMin}
                                    onChange={(e) => setFatMin(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> - </span>
                                <input
                                    type="number"
                                    value={fatMax}
                                    onChange={(e) => setFatMax(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> g</span>
                            </div>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                    width: `${(fatMax - fatMin) / 0.6}%`,
                                    marginLeft: `${fatMin / 0.6}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Saturated Fat Filter */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <div>
                                <input type="checkbox" className='mr-2' checked={enableSaturatedFat} onChange={() => setEnableSaturatedFat(!enableSaturatedFat)} />
                                <label className="font-medium">Saturated Fat</label>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={saturatedFatMin}
                                    onChange={(e) => setSaturatedFatMin(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> - </span>
                                <input
                                    type="number"
                                    value={saturatedFatMax}
                                    onChange={(e) => setSaturatedFatMax(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> g</span>
                            </div>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                    width: `${(saturatedFatMax - saturatedFatMin) / 0.3}%`,
                                    marginLeft: `${saturatedFatMin / 0.3}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Fiber Filter */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <div>
                                <input type="checkbox" className='mr-2' checked={enableFiber} onChange={() => setEnableFiber(!enableFiber)} />
                                <label className="font-medium">Fiber</label>

                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={fiberMin}
                                    onChange={(e) => setFiberMin(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> - </span>
                                <input
                                    type="number"
                                    value={fiberMax}
                                    onChange={(e) => setFiberMax(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> g</span>
                            </div>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                    width: `${(fiberMax - fiberMin) / 0.2}%`,
                                    marginLeft: `${fiberMin / 0.2}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Prep Time Filter */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <div>
                                <input type="checkbox" className='mr-2' checked={enablePrepTime} onChange={() => setEnablePrepTime(!enablePrepTime)} />
                                <label className="font-medium">Prep Time</label>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={prepTimeMin}
                                    onChange={(e) => setPrepTimeMin(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> - </span>
                                <input
                                    type="number"
                                    value={prepTimeMax}
                                    onChange={(e) => setPrepTimeMax(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> min</span>
                            </div>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                    width: `${(prepTimeMax - prepTimeMin) / 0.6}%`,
                                    marginLeft: `${prepTimeMin / 0.6}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Ingredients Filter */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <div>
                                <input type="checkbox" className='mr-2' checked={enableIngredients} onChange={() => setEnableIngredients(!enableIngredients)} />
                                <label className="font-medium">Ingredients</label>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={ingredientsMin}
                                    onChange={(e) => setIngredientsMin(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                                <span> - </span>
                                <input
                                    type="number"
                                    value={ingredientsMax}
                                    onChange={(e) => setIngredientsMax(Number(e.target.value))}
                                    className="w-16 text-center border rounded"
                                />
                            </div>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                    width: `${(ingredientsMax - ingredientsMin) / 0.15}%`,
                                    marginLeft: `${ingredientsMin / 0.15}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Cooking Method */}
                <div className="flex justify-between content-end mt-6">
                    <div>
                        <h3 className="font-medium mb-2">Cooking Method</h3>
                        <div className="flex flex-wrap gap-2">
                            {cookingMethods.map(method => (
                                <button
                                    key={method}
                                    className={`px-3 py-1 rounded-full text-sm ${cookingMethod === method ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
                                    onClick={() => setCookingMethod(method)}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sorting */}
                    <div>
                        <select className='mr-4 rounded-lg p-1 bg-green-500' value={sortField} onChange={e => setSortField(e.target.value)}>
                            <option value="protein">Protein</option>
                            <option value="calories">Calories</option>
                            <option value="fat">Fat</option>
                        </select>
                        <button className='rounded-lg p-1 bg-green-500' onClick={() => setSortDirection(dir => dir === 'asc' ? 'desc' : 'asc')}>
                            Toggle ↑↓
                        </button>
                    </div>

                </div>

                {/* Results Count */}
                <div className="mt-6 p-3 bg-gray-50 rounded">
                    <div className="text-sm">
                        Found <span className="font-semibold">{filteredRecipes.length}</span> of <span className="font-semibold">{recipes.length}</span> recipes
                    </div>
                </div>
            </div>

            {/* Recipe Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map((recipe, idx) => (
                    <div key={idx} className="border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between">
                            <h3 className="font-medium">{recipe.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${recipe.cookingMethod === 'Oven' ? 'bg-red-100 text-red-800' :
                                recipe.cookingMethod === 'Stovetop' ? 'bg-blue-100 text-blue-800' :
                                    recipe.cookingMethod === 'Air Fryer' ? 'bg-orange-100 text-orange-800' :
                                        recipe.cookingMethod === 'Blender' ? 'bg-green-100 text-green-800' :
                                            'bg-purple-100 text-purple-800'
                                }`}>
                                {recipe.cookingMethod}
                            </span>
                        </div>

                        <div className="mt-2 text-sm text-gray-500">
                            <div className="flex justify-between">
                                <span>{recipe.prepTime} min</span>
                                <span>{recipe.ingredientCount} ingredients</span>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <div className="bg-blue-50 p-2 rounded">
                                <div className="font-semibold">{recipe.calories}</div>
                                <div className="text-xs text-gray-500">calories</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                                <div className="font-semibold">{recipe.protein}g</div>
                                <div className="text-xs text-gray-500">protein</div>
                            </div>
                            <div className="bg-yellow-50 p-2 rounded">
                                <div className="font-semibold">{recipe.fat}g</div>
                                <div className="text-xs text-gray-500">fat</div>
                            </div>
                        </div>

                        <div className="mt-3 text-sm text-gray-600">
                            <div className="flex justify-between border-t pt-2">
                                <span>Saturated Fat</span>
                                <span>{recipe.saturatedFat}g</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Fiber</span>
                                <span>{recipe.fiber}g</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredRecipes.length === 0 && (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded">
                    No recipes match your current filters. Try adjusting your criteria.
                </div>
            )}
        </div>
    );
};

export default Home;