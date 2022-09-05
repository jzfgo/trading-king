import { Autocomplete } from '../components/Autocomplete';
import { StockList } from '../components/StockList';

export const StockOverviewPage = () => {
  return (
    <div>
      <h2>StockOverviewPage</h2>
      <Autocomplete />
      <StockList />
    </div>
  );
};
