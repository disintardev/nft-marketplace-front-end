import "./App.css";
import Home from "./components/Home";
import Web3Provider from "./contexts/Web3Provider";

function App() {
  return (
    <Web3Provider>
      <Home />
    </Web3Provider>
  );
}

export default App;
