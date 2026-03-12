import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeSelector = () => {
  const { setTheme } = useContext(ThemeContext);

  return (
    <select onChange={(e) => setTheme(e.target.value)}>
      <option value="pastel">🌸 Pastel</option>
      <option value="forest">🌿 Forest</option>
      <option value="midnight">🌙 Midnight</option>
    </select>
  );
};

export default ThemeSelector;
