import { createContext, PropsWithChildren, useEffect, useState } from 'react';

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

interface WatchListContextInterface {
  watchList: StockWatchList;
  addStock: (symbol: StockSymbol) => void;
  removeStock: (symbol: StockSymbol) => void;
}

export const WatchListContext = createContext<WatchListContextInterface>({
  watchList: [],
  addStock: (symbol: StockSymbol) => {},
  removeStock: (symbol: StockSymbol) => {},
});

export const WatchListContextProvider = ({ children }: PropsWithChildren) => {
  const currentWatchList = JSON.parse(
    localStorage.getItem('watchList') + ''
  ) || ['AAPL'];
  const [watchList, setWatchList] = useState<StockWatchList>(currentWatchList);

  useEffect(() => {
    localStorage.setItem('watchList', JSON.stringify(watchList));
  }, [watchList]);

  const addStock = (symbol: StockSymbol) => {
    if (!watchList.includes(symbol)) {
      setWatchList([...watchList, symbol]);
    }
  };

  const removeStock = (symbol: StockSymbol) => {
    setWatchList(watchList.filter((stock) => stock !== symbol));
  };

  return (
    <WatchListContext.Provider
      value={{
        watchList,
        addStock,
        removeStock,
      }}
    >
      {children}
    </WatchListContext.Provider>
  );
};
