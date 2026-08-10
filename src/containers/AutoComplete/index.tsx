import { useState, useEffect, useRef } from "react";
import { useDebounce } from "../../utils/useDebounce";
import AutoComplete from "./components/Autocomplete";
import { useCache } from "../../utils/useCache";

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

interface RecipeSearchResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}
const AutoCompleteContainer = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [data, setData] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const debounceInput = useDebounce(userInput, 250);
  const abortControllerref = useRef<AbortController | null>(null);

  const {
    set: setCache,
    get: getCache,
    has: hasCache,
  } = useCache<string, Recipe[]>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const getRecipe = async (userInput: string) => {
    if (hasCache(userInput)) {
      setData(getCache(userInput) ?? []);
      return;
    }
    abortControllerref.current?.abort();
    const controller = new AbortController();
    abortControllerref.current = controller;

    setLoading(true);
    try {
      const data = await fetch(
        `https://dummyjson.com/recipes/search?q=${userInput}`,
        { signal: controller.signal },
      );
      const res: RecipeSearchResponse = await data.json();
      console.log(res);
      setData(res.recipes);
      setCache(userInput, res.recipes);
      setLoading(false);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : String(err));
      setData([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceInput.length > 0) {
      getRecipe(debounceInput);
    } else {
      setData([]);
      abortControllerref.current?.abort();
    }
  }, [debounceInput]);
  return (
    <>
      <div className="main">
        <input
          autoFocus={true}
          type="text"
          value={userInput}
          onChange={handleInputChange}
        />
        <AutoComplete loading={loading} data={data} error={error} />
      </div>
    </>
  );
};

export default AutoCompleteContainer;
