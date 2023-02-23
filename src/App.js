import { BrowserRouter, Route, Routes } from "react-router-dom";
import Book from "./pages/book";
import './App.css';
import Home from "./pages/home";
import Memory from "./pages/memory";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={ <Home></Home> }></Route>
        <Route path="/" element={ <Book></Book> } ></Route>
        <Route path="/memory" element={ <Memory></Memory> } ></Route>
      </Routes>
    </BrowserRouter>
  );
}



export default App;
