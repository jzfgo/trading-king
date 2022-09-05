import { useParams } from 'react-router-dom';

export const StockDetailPage = () => {
  const params = useParams();

  return <div>StockDetailPage {params.symbol}</div>;
};
