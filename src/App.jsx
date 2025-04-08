import './App.css'
import MapChart from './components/MapChart';
import { budgetData } from './data/budgetData';

function App() {

  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>Peta Test Svg</h1>
      <MapChart data={ budgetData} />
    </div>
  );
}

export default App
