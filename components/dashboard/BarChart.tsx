import { memo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

interface BarChartProps {
  velocityData: Array<{ name: string; count: number }>;
  height?: number;
}

const BarChart = memo(({ velocityData, height = 300 }: BarChartProps) => {
  return (
    <div className={`h-[${height}px] w-full `}>
      <ResponsiveBar
        data={velocityData}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Sprint',
          legendPosition: 'middle',
          legendOffset: 60
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '所用时间（h）',
          legendPosition: 'middle',
          legendOffset: -50
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        role="application"
        ariaLabel="Sprint velocity chart"
        barAriaLabel={e => `${e.id}: ${e.formattedValue} in Sprint: ${e.indexValue}`}
        tooltip={({ id, value, indexValue, data }) => (
          <div style={{ padding: 12, background: '#fff', border: '1px solid #ccc' }}>
            <strong>{indexValue}</strong><br />
            所用时间: {value} h<br />
          </div>
        )}
      />
    </div>
  );
});

BarChart.displayName = "BarChart";

export default BarChart;