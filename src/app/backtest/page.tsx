"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  backtestStrategyApiStrategiesBacktestPost,
  listStrategiesApiStrategiesListGet
} from "@/services/quant/strategies";
import { getStockListApiStocksListGet } from "@/services/quant/getStockListApiStocksListGet";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function BacktestPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [params, setParams] = useState<Record<string, any>>({});
  
  const [backtestResult, setBacktestResult] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stocksResponse, strategiesResponse] = await Promise.all([
          getStockListApiStocksListGet({ limit: 100 }),
          listStrategiesApiStrategiesListGet(),
        ]);
        
        setStocks(stocksResponse.data || []);
        setFilteredStocks(stocksResponse.data || []);
        setStrategies(strategiesResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set default dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    setStartDate(startDate.toISOString().split('T')[0]);
    setEndDate(endDate.toISOString().split('T')[0]);
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

  const handleSelectStock = (stock: any) => {
    setSelectedStock(stock.code);
    setSearchTerm("");
  };

  const handleChangeParam = (key: string, value: string) => {
    setParams({
      ...params,
      [key]: isNaN(Number(value)) ? value : Number(value)
    });
  };

  const handleBacktest = async () => {
    if (!selectedStock || !selectedStrategy) {
      alert("请选择股票和策略");
      return;
    }

    setIsTesting(true);
    try {
      const response = await backtestStrategyApiStrategiesBacktestPost({
        stock_code: selectedStock,
        strategy: selectedStrategy,
        start_date: startDate,
        end_date: endDate,
        params: params
      });
      
      setBacktestResult(response.data || null);
    } catch (error) {
      console.error("Error running backtest:", error);
    } finally {
      setIsTesting(false);
    }
  };

  const getStrategyParamFields = () => {
    if (!selectedStrategy) return null;
    
    const strategy = strategies.find(s => s.id === selectedStrategy);
    if (!strategy || !strategy.params) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {Object.entries(strategy.params).map(([key, param]: [string, any]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{param.name}</label>
            <Input
              type={param.type === 'number' ? 'number' : 'text'}
              value={params[key] || param.default}
              onChange={(e) => handleChangeParam(key, e.target.value)}
              placeholder={param.description}
            />
            {param.description && (
              <p className="text-xs text-gray-500 mt-1">{param.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">策略回测</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>回测参数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">选择股票</label>
                <div className="relative">
                  <Input
                    placeholder="搜索股票..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border max-h-60 overflow-auto">
                      {filteredStocks.length > 0 ? (
                        filteredStocks.slice(0, 10).map((stock) => (
                          <div
                            key={stock.code}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectStock(stock)}
                          >
                            {stock.name} ({stock.code})
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">未找到匹配的股票</div>
                      )}
                    </div>
                  )}
                </div>
                {selectedStock && (
                  <div className="mt-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md">
                    {stocks.find(s => s.code === selectedStock)?.name || ''} ({selectedStock})
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">选择策略</label>
                <select
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择策略</option>
                  {strategies.map((strategy) => (
                    <option key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </option>
                  ))}
                </select>
                {selectedStrategy && (
                  <p className="text-sm mt-1 text-gray-500">
                    {strategies.find(s => s.id === selectedStrategy)?.description || ''}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">开始日期</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">结束日期</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {getStrategyParamFields()}

              <Button 
                className="w-full mt-4" 
                onClick={handleBacktest}
                disabled={!selectedStock || !selectedStrategy || isTesting}
              >
                {isTesting ? "回测中..." : "运行回测"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 border rounded-md">
              <div className="text-gray-500">加载中...</div>
            </div>
          ) : backtestResult ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>回测结果摘要</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">总收益</div>
                      <div className={`text-xl font-bold ${backtestResult.total_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {backtestResult.total_return}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">年化收益</div>
                      <div className={`text-xl font-bold ${backtestResult.annualized_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {backtestResult.annualized_return}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">最大回撤</div>
                      <div className="text-xl font-bold text-red-600">
                        {backtestResult.max_drawdown}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">夏普比率</div>
                      <div className="text-xl font-bold">
                        {backtestResult.sharpe_ratio}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">胜率</div>
                      <div className="text-xl font-bold">
                        {backtestResult.win_rate}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">交易次数</div>
                      <div className="text-xl font-bold">
                        {backtestResult.trade_count}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">获利因子</div>
                      <div className="text-xl font-bold">
                        {backtestResult.profit_factor}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">投资金额</div>
                      <div className="text-xl font-bold">
                        ¥{Number(backtestResult.initial_capital).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>交易记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>日期</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>价格</TableHead>
                          <TableHead>数量</TableHead>
                          <TableHead>收益</TableHead>
                          <TableHead>收益率</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {backtestResult.trades && backtestResult.trades.map((trade: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{trade.date}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${trade.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {trade.type === 'buy' ? '买入' : '卖出'}
                              </span>
                            </TableCell>
                            <TableCell>{trade.price}</TableCell>
                            <TableCell>{trade.shares}</TableCell>
                            <TableCell className={trade.type === 'sell' ? (trade.profit >= 0 ? 'text-green-600' : 'text-red-600') : ''}>
                              {trade.type === 'sell' ? trade.profit : '-'}
                            </TableCell>
                            <TableCell className={trade.type === 'sell' ? (trade.profit_pct >= 0 ? 'text-green-600' : 'text-red-600') : ''}>
                              {trade.type === 'sell' ? `${trade.profit_pct}%` : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>月度收益</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>月份</TableHead>
                          <TableHead>收益率</TableHead>
                          <TableHead>累计收益</TableHead>
                          <TableHead>基准收益</TableHead>
                          <TableHead>超额收益</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {backtestResult.monthly_returns && backtestResult.monthly_returns.map((month: any) => (
                          <TableRow key={month.date}>
                            <TableCell>{month.date}</TableCell>
                            <TableCell className={month.return >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {month.return}%
                            </TableCell>
                            <TableCell className={month.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {month.cumulative}%
                            </TableCell>
                            <TableCell className={month.benchmark >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {month.benchmark}%
                            </TableCell>
                            <TableCell className={month.alpha >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {month.alpha > 0 ? '+' : ''}{month.alpha}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 border rounded-md bg-gray-50">
              <div className="text-center">
                <p className="text-gray-500 mb-2">选择股票和策略来运行回测</p>
                <p className="text-sm text-gray-400">回测结果将显示在这里</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 