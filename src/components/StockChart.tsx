import { ChartData } from '../pages/StockDetailPage';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useState } from 'react';

type Props = {
  symbol: string;
  chartData: ChartData;
};

enum TimeFrame {
  Day = 'day',
  Week = 'week',
  Year = 'year',
}

export const StockChart = ({ symbol, chartData }: Props) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(TimeFrame.Day);

  const color =
    chartData[timeFrame][0].y > chartData[timeFrame].slice(-1)[0].y
      ? '#26c281'
      : '#ed3419';

  const options: ApexOptions = {
    colors: [color],
    title: {
      text: symbol,
      align: 'center',
      style: {
        fontSize: '24px',
      },
    },
    chart: {
      id: 'stock-chart',
      animations: {
        speed: 1300,
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
      },
    },
    tooltip: {
      x: {
        format: 'dd MMM HH:mm',
      },
    },
  };

  const series: ApexAxisChartSeries = [
    { name: symbol, data: chartData[timeFrame] },
  ];

  const buttonClassName = (buttonTimeFrame: TimeFrame) =>
    `btn m-1 btn${timeFrame === buttonTimeFrame ? '' : '-outline'}-primary`;

  return (
    <div className="mt-5 p-4 shadow-sm bg-white">
      <Chart
        options={options}
        series={series}
        type="area"
        width="100%"
        height="400"
      />
      <div>
        <button
          onClick={() => setTimeFrame(TimeFrame.Day)}
          className={buttonClassName(TimeFrame.Day)}
        >
          Day
        </button>
        &nbsp;
        <button
          onClick={() => setTimeFrame(TimeFrame.Week)}
          className={buttonClassName(TimeFrame.Week)}
        >
          Week
        </button>
        &nbsp;
        <button
          onClick={() => setTimeFrame(TimeFrame.Year)}
          className={buttonClassName(TimeFrame.Year)}
        >
          Year
        </button>
      </div>
    </div>
  );
};
