import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import {
  Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Sector
} from 'recharts';
import ChartSkeleton from '../../maincomponents/Skeletons/ChartSkeleton';

export const UnifiedChart = ({
  data, type = 'bar', config = {}, title, isRTL = false, className = '',
  chartHeight = 'aspect-[4/3]', showLegend = false, currentLanguage = 'en', loading = false
}) => {
  if (loading) return <ChartSkeleton type={type} isRTL={isRTL} className={className} />;

  const chartTextColor = 'hsl(var(--foreground) / 0.7)';

  const renderAreaChart = () => {
    const xAxisKey = config?.xAxisKey || 'name';
    const area = config?.areas?.[0] || { dataKey: 'value', name: 'Value', color: '#10b981' };
    const gradientId = `color-${area.dataKey}`;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={area.color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700/50" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 12, fill: chartTextColor }} stroke={chartTextColor} />
          <YAxis tick={{ fontSize: 12, fill: chartTextColor }} stroke={chartTextColor} />
          <ChartTooltip
            cursor={{ stroke: area.color, strokeWidth: 1, strokeDasharray: '3 3' }}
            content={<ChartTooltipContent
              className="bg-background/95 backdrop-blur-sm"
              labelClassName="font-bold text-foreground"
            />}
          />
          <Area type="monotone" dataKey={area.dataKey} stroke={area.color} strokeWidth={2} fillOpacity={1} fill={`url(#${gradientId})`} name={area.name} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderDonutChart = () => {
    const colors = config?.colors || ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];
    const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

    const ActiveShape = (props) => {
      const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
      return (
        <g>
          <text x={cx} y={cy} dy={-8} textAnchor="middle" className="fill-foreground text-3xl font-bold">{payload.value}</text>
          <text x={cx} y={cy} dy={12} textAnchor="middle" className="fill-muted-foreground text-sm">{payload.name}</text>
          <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 4} startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={5} />
        </g>
      );
    };

    const [activeIndex, setActiveIndex] = useState(null);
    const onPieEnter = (_, index) => setActiveIndex(index);
    const onPieLeave = () => setActiveIndex(null);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value"
            paddingAngle={5} cornerRadius={8} activeIndex={activeIndex} activeShape={ActiveShape}
            onMouseEnter={onPieEnter} onMouseLeave={onPieLeave}
          >
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} className="stroke-background/50 stroke-2" />)}
          </Pie>
          {activeIndex === null && (
             <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-0.5em" className="text-3xl font-bold fill-foreground">{totalValue}</tspan>
                <tspan x="50%" dy="1.5em" className="text-sm fill-muted-foreground">{currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}</tspan>
             </text>
          )}
          {showLegend && <Legend wrapperStyle={{ color: chartTextColor }} />}
           <ChartTooltip content={<ChartTooltipContent className="bg-background/95 backdrop-blur-sm" />} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">{currentLanguage === 'ar' ? 'لا توجد بيانات للرسم البياني' : 'No chart data available'}</p>
        </div>
      );
    }
    switch (type) {
      case 'donut': return renderDonutChart();
      case 'curve': return renderAreaChart();
      default: return null;
    }
  };

  return (
    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card ${className}`}>
      <CardHeader className="pb-4"><CardTitle className={`text-lg font-bold text-card-foreground ${isRTL ? 'text-left' : ''}`}>{title}</CardTitle></CardHeader>
      <CardContent className="p-0"><ChartContainer config={{}} className={chartHeight}>{renderChart()}</ChartContainer></CardContent>
    </Card>
  );
};