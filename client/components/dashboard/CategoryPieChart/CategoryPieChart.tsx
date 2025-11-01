import { normalizeData } from '@/libs/normalize';
import { Cell, Pie, PieChart, PieLabelRenderProps } from 'recharts';

const RADIAN = Math.PI / 180;
const COLORS = ['#763df1', '#00C49F', '#FFBB28', '#FF8042', '#3498db', '#e74c3c']; 

// 1. Destructure 'percent' along with other props
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const inner = Number(innerRadius);
  const outer = Number(outerRadius);
  const radius = inner + (outer - inner) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  // 2. Calculate and format the percentage
  const formattedPercent = (Number(percent ?? 0) * 100).toFixed(0);
  
  // 3. Combine the name and the percentage
  const labelText = `${name} - ${formattedPercent}%`;

  return (
    <text x={x + 2} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central" fontWeight="bold" color='#000'>
      {labelText}
    </text>
  );
};

export default function PieChartWithCustomizedLabel({ isAnimationActive = true, allExpenses }: { isAnimationActive?: boolean, allExpenses: expenseType[] }) {
  const chartData = normalizeData(allExpenses);

  return (
    <PieChart style={{ width: '100%', maxWidth: '500px', maxHeight: '25rem', aspectRatio: 1 }} responsive>
      <Pie
        data={chartData} 
        dataKey="amount"
        nameKey="category" 
        labelLine={false}
        label={renderCustomizedLabel} // This function now handles Category + %
        fill="#8884d8"
        isAnimationActive={isAnimationActive}
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${entry.category}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}