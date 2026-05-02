import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart.tsx";
import { TooltipContent,Tooltip, TooltipTrigger } from "./ui/tooltip.tsx";
import { motion } from "framer-motion";

interface StadisticsPieComponentProps {
  title: string;
  subtitle: string;
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  labelPassed: string;
  footerText?: string;
  subFooterText?: string;
  showMetricTag?: boolean;
  setShowMetricTag?: (value: boolean) => void;
}

export default function StadisticsPieComponent({
  title,
  subtitle,
  data,
  labelPassed,
  footerText,
  subFooterText,
  showMetricTag,
  setShowMetricTag,
}: StadisticsPieComponentProps) {
  const chartConfig: ChartConfig = {
    labelPassed: {
      label: labelPassed,
    },
    ...Object.fromEntries(
      data.map((item) => [item.name, { label: item.name, color: item.color }])
    ),
  } satisfies ChartConfig;
  return (
    <Card className="flex flex-col bg-white dark:bg-gray-800 h-full">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center justify-between w-full">
        <CardTitle>{title}</CardTitle>
        {showMetricTag !== undefined && setShowMetricTag && (
          <Tooltip delayDuration={500}>
          <TooltipTrigger>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowMetricTag(!showMetricTag)} className={`p-2 border ${showMetricTag ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors`}>
              <TrendingUp className="w-4 h-4" />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={5}><p className="max-w-xs">{showMetricTag ? "Mostrar por botón" : "Mostrar por MetricTag"}</p></TooltipContent>
        </Tooltip>
        )}
        </div>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full">
        <div className="flex flex-col gap-2 mb-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-bold">
                {item.name.toUpperCase()} : {item.value}
              </span>
            </div>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-[600px] max-h-[500px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              labelLine={false}
              label={({ payload, ...props }) => {
                const total = data.reduce((acc, item) => acc + item.value, 0);
                const percentage = ((payload.value / total) * 100).toFixed(2);
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill={payload.color}
                    className="text-[15px] font-bold"
                  >
                    {percentage}%
                  </text>
                );
              }}
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {footerText} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {subFooterText}
        </div>
      </CardFooter>
    </Card>
  );
}
