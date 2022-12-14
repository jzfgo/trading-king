import { useContext, useEffect, useState } from 'react';
import finnHub from '../lib/api/finnhub';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import { WatchListContext } from '../context/watchListContext';
import { useNavigate } from 'react-router-dom';

type StockSymbol = string;
type StockData = {
  c: number;
  d: number | null;
  dp: number | null;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
};

type StockWatchList = StockSymbol[];

type StockTuple = [StockSymbol, StockData];
type Stocks = Map<StockSymbol, StockData> | null;

export const StockList = () => {
  const [stocks, setStocks] = useState<Stocks>(null);
  const { watchList, removeStock } = useContext(WatchListContext);
  const navigate = useNavigate();

  const changeColor = (value: number | null) => {
    if (value === null) {
      return 'text-gray-500';
    } else if (value > 0) {
      return 'text-success';
    } else if (value < 0) {
      return 'text-danger';
    }
  };

  const changeIcon = (value: number | null) => {
    if (value === null) {
      return '';
    } else if (value > 0) {
      return <BsFillCaretUpFill />;
    } else if (value < 0) {
      return <BsFillCaretDownFill />;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const stocksArr: StockTuple[] = await Promise.all(
          watchList.map(async (symbol): Promise<StockTuple> => {
            const res = await finnHub.get<StockData>('/quote', {
              params: { symbol },
            });
            return [symbol, res.data];
          })
        );
        const stocks: Stocks = new Map(stocksArr);

        if (isMounted) {
          setStocks(stocks);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [watchList]);

  const handleStockSelect = (symbol: string) => {
    navigate(`/detail/${symbol}`);
  };

  return (
    <div>
      <table className="table hover mt-5">
        <thead style={{ color: 'rgb(79,89,102)' }}>
          <tr>
            <th scope="col">Symbol</th>
            <th scope="col">Price</th>
            <th scope="col">Change</th>
            <th scope="col">Change %</th>
            <th scope="col">High</th>
            <th scope="col">Low</th>
            <th scope="col">Open</th>
            <th scope="col">Close</th>
          </tr>
        </thead>
        <tbody>
          {stocks &&
            Array.from(stocks).map(([symbol, data]) => (
              <tr
                onClick={() => handleStockSelect(symbol)}
                key={symbol}
                className="table-row"
                style={{ cursor: 'pointer' }}
              >
                <th scope="row">{symbol}</th>
                <td>{data.c.toFixed(2)}</td>
                <td className={changeColor(data.d)}>
                  {data.d ? data.d.toFixed(2) : 'N/A'} {changeIcon(data.d)}
                </td>
                <td className={changeColor(data.dp)}>
                  {data.dp ? data.dp.toFixed(2) : 'N/A'} {changeIcon(data.dp)}
                </td>
                <td>{data.h.toFixed(2)}</td>
                <td>{data.l.toFixed(2)}</td>
                <td>{data.o.toFixed(2)}</td>
                <td>
                  {data.pc.toFixed(2)}
                  <button
                    className="btn btn-danger btn-sm ml-3 d-inline-block delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStock(symbol);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
