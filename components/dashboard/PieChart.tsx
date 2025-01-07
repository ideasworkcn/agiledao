import { memo } from 'react';
import { ResponsivePie } from '@nivo/pie';

interface PieChartProps {
  workloadData: Array<{
    id: string | number;
    value: number;
    [key: string]: any;
  }>;
}

const PieChart = memo<PieChartProps>(({ workloadData }) => {
    console.log(workloadData);
    return (
      <div className="w-full h-[300px]  h-40 md:h-48">
        {workloadData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">暂无数据</p>
          </div>
        ) : (
          <ResponsivePie
            data={workloadData}
            sortByValue
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            cornerRadius={0}
            padAngle={0.5}
            borderWidth={1}
            borderColor={"#ffffff"}
            enableArcLinkLabels={false}
            arcLabel={(d: { id: string | number }) => `${d.id}`}
            arcLabelsTextColor={"#ffffff"}
            arcLabelsRadiusOffset={0.65}
            colors={{ scheme: 'nivo' }}
            theme={{
              labels: {
                text: {
                  fontSize: "18px",
                },
              },
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
            }}
            role="application"
          />
        )}
      </div>
    );
  });
  
  PieChart.displayName = 'PieChart';

  export default PieChart;