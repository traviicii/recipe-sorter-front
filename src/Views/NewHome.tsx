import { useState, useEffect } from 'react';



const NewHome = () => {

    const [rawPDF, setRawPDF] = useState(null)


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
    const [proteinMin, setProteinMin] = useState(20);
    const [proteinMax, setProteinMax] = useState(45);
    const [caloriesMin, setCaloriesMin] = useState(200);
    const [caloriesMax, setCaloriesMax] = useState(600);
    const [fatMin, setFatMin] = useState(5);
    const [fatMax, setFatMax] = useState(40);
    const [saturatedFatMin, setSaturatedFatMin] = useState(0);
    const [saturatedFatMax, setSaturatedFatMax] = useState(15);
    const [fiberMin, setFiberMin] = useState(0);
    const [fiberMax, setFiberMax] = useState(15);
    const [prepTimeMin, setPrepTimeMin] = useState(5);
    const [prepTimeMax, setPrepTimeMax] = useState(60);
    const [ingredientsMin, setIngredientsMin] = useState(3);
    const [ingredientsMax, setIngredientsMax] = useState(12);
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

    // PDF Upload
    async function uploadPDF(rawPDF: File) {
        console.log("Uploading file:", rawPDF, typeof rawPDF);
        // Create a FormData object and append the PDF file.
        const formData = new FormData();
        formData.append('file', rawPDF);

        try {

            // backend local 'http://127.0.0.1:8000/parse-recipes'
            // frontend hosted 'https://recipe-sorter-back.onrender.com/parse-recipes'
            const response = await fetch('http://127.0.0.1:8000/parse-recipes', {
                method: 'POST',
                body: formData,
                // Do NOT manually set the "Content-Type" header;
                // browser will automatically set it to "multipart/form-data" with a proper boundary.
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            // Parse and log the JSON response from backend
            const result = await response.json();
            console.log('Parsed Recipes:', result);
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
            await uploadPDF(rawPDF);
        }
    };

    return (
        <div >
            <button
                type="submit"
                id="uploadButton"
                className="
                    p-2 
                    rounded-md 
                    mr-2 
                    bg-emerald-500 
                    hover:bg-emerald-600 
                    hover:shadow-lg 
                    transform 
                    hover:-translate-y-1 
                    transition 
                    duration-300 
                    ease-in-out 
                    text-white 
                    font-semibold
                "
            >
                Export PDF
            </button>
        </div>
    );
};

export default NewHome;