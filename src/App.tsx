import "./App.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import AutoCompleteContainer from "./containers/AutoComplete";
// import CommentContainer from "./containers/Comments";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AutoCompleteContainer />
    </ThemeProvider>
  );
}

export default App;
