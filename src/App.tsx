import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { StockDetailPage } from './pages/StockDetailPage';
import { StockOverviewPage } from './pages/StockOverviewPage';

function App() {
  return (
    <main className="container">
      <Routes>
        <Route path="/" element={<StockOverviewPage />} />
        <Route path="/detail/:symbol" element={<StockDetailPage />}></Route>
      </Routes>
    </main>
  );
}

export default App;
