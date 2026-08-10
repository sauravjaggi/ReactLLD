import { Recipe } from "../index.tsx";

interface AutoCompleteProps {
  loading: boolean;
  data: Recipe[];
  error?: string;
}

const AutoComplete = ({ loading, data, error }: AutoCompleteProps) => {
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="autocomplete">
          {error && <div className="error">{error}</div>}
          {data &&
            data.map((item, index) => {
              return <div key={item.id ?? index}>{item.name}</div>;
            })}
        </div>
      )}
    </>
  );
};

export default AutoComplete;
