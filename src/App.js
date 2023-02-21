import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home></Home> } ></Route>
        <Route path="/memory" element={<div>memory</div>} ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
