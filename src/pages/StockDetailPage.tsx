import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StockChart } from '../components/StockChart';
import { StockInfo } from '../components/StockInfo';
import finnHub from '../lib/api/finnhub';

type StockCandleResponse = {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  s: string;
  t: number[];
  v: number[];
};

type ChartDataPoint = {
  x: number;
  y: number;
};

export type ChartData = {
  day: ChartDataPoint[];
  week: ChartDataPoint[];
  year: ChartDataPoint[];
};

const formatData = (data: StockCandleResponse): ChartDataPoint[] =>
  data.t.map((time, index) => ({
    x: time * 1000,
    y: Math.floor(data.c[index] * 100) / 100,
  }));

export const StockDetailPage = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const { symbol } = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      let to = Math.floor(new Date().getTime() / 1000);
      // Exclude weekends
      if (new Date().getDay() === 0) {
        to -= 86400 * 2;
      } else if (new Date().getDay() === 6) {
        to -= 86400;
      }
      const aDayAgo = to - 60 * 60 * 24;
      const aWeekAgo = to - 60 * 60 * 24 * 7;
      const aYearAgo = to - 60 * 60 * 24 * 365;
      const resolutionDay = 30;
      const resolutionWeek = 60;
      const resolutionYear = 'W';

      try {
        const resDay = await finnHub.get('/stock/candle', {
          params: { symbol, from: aDayAgo, to, resolution: resolutionDay },
        });
        const resWeek = await finnHub.get('/stock/candle', {
          params: { symbol, from: aWeekAgo, to, resolution: resolutionWeek },
        });
        const resYear = await finnHub.get('/stock/candle', {
          params: { symbol, from: aYearAgo, to, resolution: resolutionYear },
        });

        const responses = await Promise.all([resDay, resWeek, resYear]);

        const day = formatData(responses[0].data);
        const week = formatData(responses[1].data);
        const year = formatData(responses[2].data);

        setChartData({ day, week, year });

        return () => {
          isMounted = false;
        };
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <div>
      {chartData && symbol && (
        <div>
          <StockChart symbol={symbol} chartData={chartData} />
        </div>
      )}
      {symbol && (
        <div>
          <StockInfo symbol={symbol} />
        </div>
      )}
    </div>
  );
};
