"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StockData {
  日期: string;
  开盘: number;
  收盘: number;
  最高: number;
  最低: number;
  成交量: number;
  [key: string]: any;
}

interface StockChartProps {
  stockCode: string;
  stockName?: string;
  days?: number;
}

export default function StockChart({
  stockCode,
  stockName = "",
  days = 90,
}: StockChartProps) {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [technicalData, setTechnicalData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when stockCode changes
    setLoading(true);
    setError(null);

    // Fetch basic stock data
    fetch(`http://localhost:8000/api/stock/${stockCode}?days=${days}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch stock data");
        }
        return response.json();
      })
      .then((data) => {
        setStockData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch technical analysis data
    fetch(`http://localhost:8000/api/analysis/technical/${stockCode}?days=${days}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch technical data");
        }
        return response.json();
      })
      .then((data) => {
        setTechnicalData(data);
      })
      .catch((err) => {
        console.error("Error fetching technical data:", err);
      });
  }, [stockCode, days]);

  // Prepare data for ECharts
  const dates = stockData.map((item) => item.日期);
  const prices = stockData.map((item) => [item.开盘, item.收盘, item.最低, item.最高]);
  const volumes = stockData.map((item) => item.成交量);

  // Technical indicators
  const ma5 = technicalData.map((item) => item.MA5);
  const ma10 = technicalData.map((item) => item.MA10);
  const ma20 = technicalData.map((item) => item.MA20);
  const ma60 = technicalData.map((item) => item.MA60);
  const rsi = technicalData.map((item) => item.RSI);

  // Basic options for candlestick chart
  const candlestickOption = {
    title: {
      text: `${stockName || stockCode} Price Chart`,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    legend: {
      data: ["Candlestick", "MA5", "MA10", "MA20", "MA60"],
      top: 30,
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    xAxis: {
      type: "category",
      data: dates,
      scale: true,
    },
    yAxis: {
      type: "value",
      scale: true,
      splitArea: {
        show: true,
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 50,
        end: 100,
      },
      {
        show: true,
        type: "slider",
        top: "90%",
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        name: "Candlestick",
        type: "candlestick",
        data: prices,
        itemStyle: {
          color: "#ef4444",
          color0: "#22c55e",
          borderColor: "#ef4444",
          borderColor0: "#22c55e",
        },
      },
      {
        name: "MA5",
        type: "line",
        data: ma5,
        smooth: true,
        lineStyle: {
          width: 1,
        },
      },
      {
        name: "MA10",
        type: "line",
        data: ma10,
        smooth: true,
        lineStyle: {
          width: 1,
        },
      },
      {
        name: "MA20",
        type: "line",
        data: ma20,
        smooth: true,
        lineStyle: {
          width: 1,
        },
      },
      {
        name: "MA60",
        type: "line",
        data: ma60,
        smooth: true,
        lineStyle: {
          width: 1,
        },
      },
    ],
  };

  // Volume chart options
  const volumeOption = {
    title: {
      text: "Volume",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    xAxis: {
      type: "category",
      data: dates,
      scale: true,
    },
    yAxis: {
      type: "value",
      scale: true,
    },
    dataZoom: [
      {
        type: "inside",
        start: 50,
        end: 100,
      },
      {
        show: true,
        type: "slider",
        top: "90%",
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        name: "Volume",
        type: "bar",
        data: volumes,
        itemStyle: {
          color: "#3b82f6",
        },
      },
    ],
  };

  // RSI indicator options
  const rsiOption = {
    title: {
      text: "RSI Indicator",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    xAxis: {
      type: "category",
      data: dates,
      scale: true,
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      splitLine: {
        show: true,
      },
      axisLabel: {
        formatter: "{value}",
      },
    },
    visualMap: {
      show: false,
      dimension: 1,
      pieces: [
        {
          gt: 70,
          lte: 100,
          color: "#ef4444",
        },
        {
          gt: 30,
          lte: 70,
          color: "#3b82f6",
        },
        {
          gt: 0,
          lte: 30,
          color: "#22c55e",
        },
      ],
    },
    dataZoom: [
      {
        type: "inside",
        start: 50,
        end: 100,
      },
      {
        show: true,
        type: "slider",
        top: "90%",
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        name: "RSI",
        type: "line",
        data: rsi,
        markLine: {
          symbol: "none",
          data: [
            {
              yAxis: 70,
              lineStyle: {
                color: "#ef4444",
                type: "dashed",
              },
            },
            {
              yAxis: 30,
              lineStyle: {
                color: "#22c55e",
                type: "dashed",
              },
            },
          ],
        },
      },
    ],
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-96">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-96">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{stockName || stockCode} Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price">
          <TabsList className="mb-4">
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>
          <TabsContent value="price" className="h-[500px]">
            <ReactECharts option={candlestickOption} style={{ height: "100%" }} />
          </TabsContent>
          <TabsContent value="volume" className="h-[500px]">
            <ReactECharts option={volumeOption} style={{ height: "100%" }} />
          </TabsContent>
          <TabsContent value="technical" className="h-[500px]">
            <ReactECharts option={rsiOption} style={{ height: "100%" }} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 