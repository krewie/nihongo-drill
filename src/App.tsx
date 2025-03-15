import { Routes, Route, Link } from "react-router-dom";
import { Quiz } from "./components/Quiz";

function App() {
  return (
    <div className="app">
      <h1>My Quiz App</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/demoquiz">Demo Quiz</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demoquiz" element={<Quiz />} />
      </Routes>
    </div>
  );
}

function Home() {
  return <h2>Welcome! Select a quiz from the navigation.</h2>;
}

export default App;
