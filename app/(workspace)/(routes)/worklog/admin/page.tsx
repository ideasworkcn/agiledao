const StatisticPeriodSummary = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">统计周期总结</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">指标名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推荐统计周期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">原因</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">任务完成率</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">每日 + 每周</td>
              <td className="px-6 py-4 text-sm text-gray-500">高频指标，每日监控进展，每周评估整体效率</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">工时偏差</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">每周 + 每冲刺</td>
              <td className="px-6 py-4 text-sm text-gray-500">需要一定时间积累数据，每周监控估算准确性，冲刺周期评估整体偏差</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">冲刺目标达成率</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">每冲刺</td>
              <td className="px-6 py-4 text-sm text-gray-500">与冲刺周期直接相关，冲刺结束后统计最合适</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">任务耗时分析</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">每周 + 每月</td>
              <td className="px-6 py-4 text-sm text-gray-500">需要一定时间积累数据，每周监控耗时分布，每月评估长期趋势</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">任务分配均衡度</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">每周 + 每冲刺</td>
              <td className="px-6 py-4 text-sm text-gray-500">需要一定时间积累数据，每周监控分配公平性，冲刺周期评估整体分配情况</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatisticPeriodSummary;

// 找出偷懒的员工和关键员工需要结合数据指标和行为分析，避免仅凭单一指标做出判断。以下是基于你的表结构和Scrum实践的科学方法：
// ---
// 1. 任务完成率异常低
// 数据来源: Task 表的 status 和 member_id 字段
// 分析方法:
// 设置阈值
// - 关注点:
// 任务完成率显著低于团队平均水平。
// 长期未完成任务（如超过冲刺周期）。
// ---
// 2. 工时记录异常
// 数据来源: TaskHour 表的 hours 和 create_time 字段
// 分析方法:
// 设置阈值（如每周最低工时）
// - 关注点:
// 工时记录明显少于团队平均水平。
// 工时记录不规律（如集中在某几天）。
// ---
// 3. 任务状态长期停滞
// 数据来源: Task 表的 status 和 update_time 字段
// 分析方法:
// 设置阈值（如超过7天未更新）
// - 关注点:
// 任务状态长期未更新（如“进行中”超过冲刺周期）。
// 任务频繁被重新分配或延期。
// ---
// 4. 任务估算偏差过大
// 数据来源: Task 表的 estimated_hours 和 hours 字段
// 分析方法:
// ）
// - 关注点:
// 任务估算偏差显著高于团队平均水平。
// 频繁低估任务复杂度。
// ---
// 5. 任务分配拒绝率高
// 数据来源: Task 表的 member_id 和 assigner_id 字段
// 分析方法:
// ）
// - 关注点:
// 频繁拒绝任务分配。
// 任务分配后长期未开始。