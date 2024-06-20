import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/**
 * Chart component to display the data in a bar chart
 * It uses the recharts library to display the data
 * The data is passed as a prop to the component
 * The data is an array of objects, where each object has a timestamp key and a value key
 * @param data { [key: string]: string | number }[] data to be displayed in the chart
 * @returns a bar chart component
 */
const Chart = ({ data }: { data: { [key: string]: string | number }[] }) => {
  console.log(data);

  return (
    <BarChart
      width={0.95 * window.innerWidth}
      height={0.5 * window.innerHeight}
      data={data}
      margin={{
        top: 0.1 * window.innerHeight,
        right: 0.05 * window.innerWidth,
        left: 0.05 * window.innerWidth,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      {data.map((entry, index) => {
        const timestamp = entry.timestamp;
        return (
          <React.Fragment key={index}>
            <Bar dataKey={timestamp + " good"} fill="#50c878" />
            <Bar dataKey={timestamp + " bad"} fill="#c05050" />
          </React.Fragment>
        );
      })}
    </BarChart>
  );
};

export default Chart;
