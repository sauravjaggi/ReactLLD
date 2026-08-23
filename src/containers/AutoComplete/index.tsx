import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { useDebounce } from "../../utils/useDebounce";
import AutoComplete from "./components/Autocomplete";
import { useCache } from "../../utils/useCache";
import "./index.scss";

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

  const handleClear = () => {
    setUserInput("");
    setData([]);
    setError("");
    abortControllerref.current?.abort();
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
    setError("");
    try {
      const data = await fetch(
        `https://dummyjson.com/recipes/search?q=${userInput}`,
        { signal: controller.signal },
      );
      const res: RecipeSearchResponse = await data.json();
      setData(res.recipes);
      setCache(userInput, res.recipes);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : String(err));
      setData([]);
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
    <Box className="recipe-search">
      <Box className="recipe-search__panel">
        <Typography component="p" className="recipe-search__eyebrow">
          Recipe Finder
        </Typography>
        <Typography component="h1" className="recipe-search__heading">
          Find your next recipe
        </Typography>
        <Typography component="p" className="recipe-search__subheading">
          Search by name, ingredient, or cuisine.
        </Typography>

        <TextField
          id="search"
          autoFocus
          fullWidth
          value={userInput}
          onChange={handleInputChange}
          placeholder='Try "pasta" or "chicken curry"'
          className="recipe-search__input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon className="recipe-search__search-icon" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={18} thickness={5} />
                ) : userInput ? (
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    aria-label="Clear search"
                  >
                    <ClearRoundedIcon fontSize="small" />
                  </IconButton>
                ) : null}
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography component="p" className="recipe-search__error">
            Something went wrong: {error}
          </Typography>
        )}

        <Box className="recipe-search__results">
          <AutoComplete loading={loading} data={data} error={error} />
        </Box>
      </Box>
    </Box>
  );
};

export default AutoCompleteContainer;
