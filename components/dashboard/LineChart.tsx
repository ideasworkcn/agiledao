import { memo, useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';

interface DataPoint {
  x: string | number | null;
  y: number | null;
}

interface LineChartProps {
  burndownChartData: DataPoint[];
  idealBurndownData: DataPoint[];
}

const LineChart = memo<LineChartProps>(({ burndownChartData, idealBurndownData }) => {
    const [chartData, setChartData] = useState([
      {
        id: "理想燃尽线",
        data: idealBurndownData.filter((d: DataPoint) => d.x !== null && d.y !== null),
      },
      {
        id: "实际燃尽线",
        data: burndownChartData.filter((d: DataPoint) => d.x !== null && d.y !== null),
      },
    ]);

    useEffect(() => {
      // 只有当数据实际发生变化时才更新状态
      const newIdealData = idealBurndownData.filter((d: DataPoint) => d.x !== null && d.y !== null);
      const newBurndownData = burndownChartData.filter((d: DataPoint) => d.x !== null && d.y !== null);
      
      if (JSON.stringify(newIdealData) !== JSON.stringify(chartData[0].data) ||
          JSON.stringify(newBurndownData) !== JSON.stringify(chartData[1].data)) {
        setChartData([
          {
            id: "理想燃尽线",
            data: newIdealData,
          },
          {
            id: "实际燃尽线",
            data: newBurndownData,
          },
        ]);
      }
    }, [burndownChartData, idealBurndownData, chartData]);

    return (
      <div className="w-full h-48 md:h-64 lg:h-80" style={{ height: "300px" }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 50, right: 40, bottom: 40, left: 40 }}
          xScale={{
            type: "point",
          }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 16,
            tickRotation: -45,
            tickValues: 5,
            format: (value: string | number) => {
              if (typeof value === 'string' && value.includes('T')) {
                return value.split('T')[0];
              }
              return value;
            },
            legend: "时间",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 0,
            tickValues: 5,
            tickPadding: 16,
            legend: "任务量",
            legendOffset: -32,
            legendPosition: "middle",
          }}
          colors={["#2563eb", "#e11d48"]}
          pointSize={6}
          useMesh={true}
          enableGridX={false}
          enableGridY={true}
          gridYValues={5}
          theme={{
            tooltip: {
              chip: {
                borderRadius: "9999px",
              },
              container: {
                fontSize: "12px",
                textTransform: "capitalize",
                borderRadius: "6px",
              },
            },
            grid: {
              line: {
                stroke: "#f3f4f6",
              },
            },
          }}
          role="application"
          legends={[
            {
              anchor: "top",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: -30,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    );
  });
  
  LineChart.displayName = 'LineChart';

export default LineChart;