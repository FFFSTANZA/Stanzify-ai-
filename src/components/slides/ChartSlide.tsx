import { BaseSlide, BaseSlideProps } from './BaseSlide';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export interface ChartSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'donut';
  data: Array<{ name: string; value: number }>;
  description?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function ChartSlide({
  title,
  chartType,
  data,
  description,
  xAxisLabel,
  yAxisLabel,
  ...baseProps
}: ChartSlideProps) {
  const renderChart = () => {
    // Generate colors based on palette if available
    const paletteColors = baseProps.palette
      ? [
          baseProps.palette.primary,
          baseProps.palette.secondary,
          baseProps.palette.accent,
          '#60A5FA', // fallback blue
          '#34D399', // fallback green
          '#F472B6', // fallback pink
        ]
      : COLORS;

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" stroke="currentColor" />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'currentColor' }} stroke="currentColor" />
              <Tooltip 
                 contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', borderRadius: '8px', border: 'none' }}
              />
              <Legend />
              <Bar dataKey="value" fill={paletteColors[0]} radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={paletteColors[index % paletteColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" stroke="currentColor" />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'currentColor' }} stroke="currentColor" />
              <Tooltip 
                 contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', borderRadius: '8px', border: 'none' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={paletteColors[0]}
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" stroke="currentColor" />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'currentColor' }} stroke="currentColor" />
              <Tooltip 
                 contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', borderRadius: '8px', border: 'none' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke={paletteColors[0]}
                fill={paletteColors[0]}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie':
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={160}
                innerRadius={chartType === 'donut' ? 100 : 0}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={chartType === 'donut' ? 5 : 0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={paletteColors[index % paletteColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', borderRadius: '8px', border: 'none' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
        {title && (
          <h1 
            className="text-4xl md:text-5xl font-bold mb-8 text-center"
            style={{ color: baseProps.palette?.primary }}
          >
            {title}
          </h1>
        )}
        
        <div className="flex-1 w-full min-h-[400px]">
          {renderChart()}
        </div>
        
        {description && (
          <div className="mt-8 text-center max-w-3xl mx-auto">
            <p className="text-lg opacity-80">{description}</p>
          </div>
        )}
      </div>
    </BaseSlide>
  );
}
