import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart.tsx";

interface StadisticsAreaChartComponentProps {
  title: string;
  description: string;
  labelPassed: string;
  data: {
    date: string;
    [key: string]: string | number;
  }[];
  colors?: Record<string, string>;
}

function groupByDay<T extends { date: string }>(
  data: T[],
  keys: (keyof T)[]
): Array<{ date: string } & Record<string, string>> {
  const grouped: Record<string, { date: string } & Record<string, string>> = {};

  data.forEach((item) => {
    const day = new Date(item.date).toISOString().slice(0, 10);
    if (!grouped[day]) {
      grouped[day] = {
        date: day,
        ...Object.fromEntries(keys.map((key) => [key as string, 0])),
      };
    }
    keys.forEach((key) => {
      grouped[day][key as string] += Number(item[key] ?? 0);
    });
  });

  return Object.values(grouped);
}

export default function StadisticsAreaChartComponent({
  title,
  description,
  labelPassed,
  data,
  colors = {},
}: StadisticsAreaChartComponentProps) {
  const labelMap: Record<string, string> = {
    verificado: "verificado",
    noVerificado: "no verificado",
  };
  const areaKeys = Object.keys(data[0] ?? {}).filter((key) => key !== "date");
  const groupedData = useMemo(
    () => groupByDay(data, areaKeys),
    [data, areaKeys]
  );
  const chartConfig: ChartConfig = {
    labelPassed: { label: labelPassed },
    ...Object.fromEntries(
      areaKeys.map((key) => [
        key,
        { label: labelMap[key] || key, color: colors[key] ?? "#8884d8" },
      ])
    ),
  };

  return (
    <Card className="pt-0 bg-white dark:bg-gray-800 flex flex-1 max-w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row flex-wrap">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="h-[100px] sm:h-[200px] md:h-[250px] lg:h-[350px] w-full"
        >
          <AreaChart data={groupedData}>
            <defs>
              {areaKeys.map((key) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={colors[key] ?? "#8884d8"} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[key] ?? "#8884d8"} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {areaKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill${key})`}
                stroke={colors[key] ?? "#8884d8"}
                strokeWidth={2}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
