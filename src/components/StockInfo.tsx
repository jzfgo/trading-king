import { useEffect, useState } from 'react';
import finnHub from '../lib/api/finnhub';

type Props = {
  symbol: string;
};

/*
{
  "country": "US",
  "currency": "USD",
  "exchange": "NASDAQ/NMS (GLOBAL MARKET)",
  "ipo": "1980-12-12",
  "marketCapitalization": 1415993,
  "name": "Apple Inc",
  "phone": "14089961010",
  "shareOutstanding": 4375.47998046875,
  "ticker": "AAPL",
  "weburl": "https://www.apple.com/",
  "logo": "https://static.finnhub.io/logo/87cb30d8-80df-11ea-8951-00000000092a.png",
  "finnhubIndustry":"Technology"
}
*/

type StockInfoResponse = {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
};

export const StockInfo = ({ symbol }: Props) => {
  const [stockInfo, setStockInfo] = useState<StockInfoResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await finnHub.get<StockInfoResponse>('/stock/profile2', {
          params: { symbol },
        });

        if (isMounted) {
          setStockInfo(res.data);
        }
        return () => {
          isMounted = false;
        };
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  return (
    <div>
      {stockInfo && (
        <div className="row border bg-white rounded shadow-sm p-4 mt-5">
          <div className="col">
            <div>
              <span className="fw-bold">Name: </span>
              {stockInfo.name}
            </div>
            <div>
              <span className="fw-bold">Country: </span>
              {stockInfo.country}
            </div>
            <div>
              <span className="fw-bold">Ticker: </span>
              {stockInfo.ticker}
            </div>
          </div>
          <div className="col">
            <div>
              <span className="fw-bold">Exchange: </span>
              {stockInfo.exchange}
            </div>
            <div>
              <span className="fw-bold">Industry: </span>
              {stockInfo.finnhubIndustry}
            </div>
            <div>
              <span className="fw-bold">IPO: </span>
              {stockInfo.ipo}
            </div>
          </div>
          <div className="col">
            <div>
              <span className="fw-bold">Market cap.: </span>
              {stockInfo.marketCapitalization}
            </div>
            <div>
              <span className="fw-bold">Shares Outstanding: </span>
              {stockInfo.shareOutstanding}
            </div>
            <div>
              <span className="fw-bold">URL: </span>
              <a href={stockInfo.weburl}>{stockInfo.weburl}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
