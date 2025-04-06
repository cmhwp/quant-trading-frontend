"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  optimizePortfolioApiPortfolioOptimizePost,
  analyzePortfolioPerformanceApiPortfolioPerformancePost
} from "@/services/quant/portfolio";
import { getStockListApiStocksListGet } from "@/services/quant/getStockListApiStocksListGet";

export default function PortfolioPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<any[]>([]);
  
  const [portfolio, setPortfolio] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [optimizationType, setOptimizationType] = useState<string>("sharpe");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await getStockListApiStocksListGet({ limit: 100 });
        setStocks(response.data || []);
        setFilteredStocks(response.data || []);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
    
    // Set default start date to 1 year ago
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    setStartDate(date.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = stocks.filter(
        (stock) =>
          stock.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks(stocks);
    }
  }, [searchTerm, stocks]);

  const handleStockSelection = (code: string) => {
    if (selectedStocks.includes(code)) {
      setSelectedStocks(selectedStocks.filter((stockCode) => stockCode !== code));
    } else {
      setSelectedStocks([...selectedStocks, code]);
    }
  };

  const handleOptimize = async () => {
    if (selectedStocks.length < 2) {
      alert("请至少选择2只股票进行组合优化");
      return;
    }

    setIsOptimizing(true);
    try {
      const response = await optimizePortfolioApiPortfolioOptimizePost(
        { 
          days: 365, 
          optimization_type: optimizationType 
        },
        selectedStocks
      );
      
      setPortfolio(response.data || null);
    } catch (error) {
      console.error("Error optimizing portfolio:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAnalyzePerformance = async () => {
    if (!portfolio || !portfolio.weights || Object.keys(portfolio.weights).length === 0) {
      alert("请先优化投资组合");
      return;
    }

    setIsAnalyzing(true);
    try {
      const stocks = Object.entries(portfolio.weights).map(([code, weight]: [string, any]) => ({
        code,
        weight
      }));

      const response = await analyzePortfolioPerformanceApiPortfolioPerformancePost({
        stocks,
        start_date: startDate,
      });
      
      setPerformance(response.data || null);
    } catch (error) {
      console.error("Error analyzing portfolio performance:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">投资组合</h1>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="builder">投资组合构建</TabsTrigger>
          <TabsTrigger value="performance">绩效分析</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>选择股票</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="搜索股票代码或名称..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-auto">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedStocks([])}
                        disabled={selectedStocks.length === 0}
                      >
                        清空
                      </Button>
                      <Button 
                        onClick={handleOptimize}
                        disabled={selectedStocks.length < 2 || isOptimizing}
                      >
                        {isOptimizing ? "优化中..." : "优化组合"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedStocks.map((code) => {
                    const stock = stocks.find((s) => s.code === code);
                    return (
                      <div 
                        key={code}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                      >
                        <span>{stock ? `${stock.name} (${code})` : code}</span>
                        <button 
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => handleStockSelection(code)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex mb-4 space-x-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">起始日期</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">优化目标</label>
                    <select
                      value={optimizationType}
                      onChange={(e) => setOptimizationType(e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="sharpe">最大夏普比率</option>
                      <option value="min_volatility">最小波动率</option>
                      <option value="max_return">最大回报</option>
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">加载中...</div>
                  </div>
                ) : (
                  <div className="border rounded-md max-h-80 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>代码</TableHead>
                          <TableHead>名称</TableHead>
                          <TableHead>最新价</TableHead>
                          <TableHead>涨跌幅</TableHead>
                          <TableHead>行业</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStocks.map((stock) => (
                          <TableRow 
                            key={stock.code}
                            className={selectedStocks.includes(stock.code) ? "bg-blue-50" : ""}
                          >
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedStocks.includes(stock.code)}
                                onChange={() => handleStockSelection(stock.code)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{stock.code}</TableCell>
                            <TableCell>{stock.name}</TableCell>
                            <TableCell>{stock.price}</TableCell>
                            <TableCell className={stock.change_percent >= 0 ? "text-green-600" : "text-red-600"}>
                              {stock.change_percent}%
                            </TableCell>
                            <TableCell>{stock.industry}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {portfolio && (
            <Card>
              <CardHeader>
                <CardTitle>优化结果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">组合指标</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">预期年化收益</span>
                          <span>{portfolio.expected_return}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">年化波动率</span>
                          <span>{portfolio.volatility}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">夏普比率</span>
                          <span>{portfolio.sharpe_ratio}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">权重分配</h3>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleAnalyzePerformance}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? "分析中..." : "分析表现"}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {portfolio.weights && Object.entries(portfolio.weights).map(([code, weight]: [string, any]) => {
                          const stock = stocks.find((s) => s.code === code);
                          return (
                            <div key={code} className="flex justify-between">
                              <span>{stock ? `${stock.name} (${code})` : code}</span>
                              <span>{(weight * 100).toFixed(2)}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          {performance ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>投资组合表现</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">累计收益</span>
                        <span className={performance.total_return >= 0 ? "text-green-600" : "text-red-600"}>
                          {performance.total_return}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">年化收益</span>
                        <span className={performance.annualized_return >= 0 ? "text-green-600" : "text-red-600"}>
                          {performance.annualized_return}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">年化波动率</span>
                        <span>{performance.volatility}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">夏普比率</span>
                        <span>{performance.sharpe_ratio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">最大回撤</span>
                        <span className="text-red-600">{performance.max_drawdown}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Beta</span>
                        <span>{performance.beta}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Alpha</span>
                        <span>{performance.alpha}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">索提诺比率</span>
                        <span>{performance.sortino_ratio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">信息比率</span>
                        <span>{performance.information_ratio}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>回测结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">初始投资</span>
                        <span className="text-gray-500 ml-2">¥10,000</span>
                      </div>
                      <div>
                        <span className="font-medium">最终价值</span>
                        <span className={`ml-2 ${performance.final_value > 10000 ? "text-green-600" : "text-red-600"}`}>
                          ¥{performance.final_value.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>月份</TableHead>
                            <TableHead>收益率</TableHead>
                            <TableHead>相对指数</TableHead>
                            <TableHead>回撤</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {performance.monthly_returns && performance.monthly_returns.map((month: any) => (
                            <TableRow key={month.date}>
                              <TableCell>{month.date}</TableCell>
                              <TableCell className={month.return >= 0 ? "text-green-600" : "text-red-600"}>
                                {month.return}%
                              </TableCell>
                              <TableCell className={month.vs_index >= 0 ? "text-green-600" : "text-red-600"}>
                                {month.vs_index > 0 ? "+" : ""}{month.vs_index}%
                              </TableCell>
                              <TableCell className="text-red-600">
                                {month.drawdown}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 border rounded-md bg-gray-50">
              <div className="text-center">
                <p className="text-gray-500 mb-4">尚未进行组合分析</p>
                <Button onClick={() => document.querySelector('[data-value="builder"]')?.click()}>
                  构建组合
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 