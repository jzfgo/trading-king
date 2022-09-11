import { Autocomplete } from '../components/Autocomplete';
import { StockList } from '../components/StockList';
import tradingKing from '../assets/images/trading-king.png';

export const StockOverviewPage = () => {
  return (
    <div>
      <div className="text-center">
        <img src={tradingKing} alt="Trading King" />
      </div>
      <Autocomplete />
      <StockList />
    </div>
  );
};
