import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

function getTheme(theme) {
  return createMuiTheme({
    palette: {
      type: theme.paletteType,
      text: {
        secondary: "#9096A8"
      },
      primary: {
        main: "#556cd6"
      },
      secondary: {
        main: theme.paletteType === "light" ? "#f1f6fb" : "#252830"
      },
      error: {
        main: red.A400
      },
      background: {
        paper: theme.paletteType === "light" ? "#ffffff" : "#2d323c"
      }
    },
    shape: {
      borderRadius: 10
    },
    typography: {
      fontFamily: ["Nunito", "Roboto", "sans-serif"],
      fontWeightMedium: 600
    }
  });
}
const lightTheme = getTheme({
  paletteType: "light"
});

const darkTheme = getTheme({
  paletteType: "dark"
});

export default {
  lightTheme,
  darkTheme
};
