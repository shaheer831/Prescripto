import { Route, Routes } from "react-router-dom";
import Accordian from "./components/Accordian";
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h1>Home</h1>
            <Accordian />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
