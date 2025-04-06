"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { getStockListApiStocksListGet } from "@/services/quant/getStockListApiStocksListGet";
import { getStockCorrelationApiAnalysisCorrelationGet } from "@/services/quant/analysis";

export default function AnalysisPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<any[]>([]);
  
  const [correlationData, setCorrelationData] = useState<any>(null);
  const [days, setDays] = useState<number>(90);
  
  const [isLoading, setIsLoading] = useState(true);
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

  const handleAnalyzeCorrelation = async () => {
    if (selectedStocks.length < 2) {
      alert("请至少选择2只股票进行相关性分析");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await getStockCorrelationApiAnalysisCorrelationGet({
        stocks: selectedStocks.join(","),
        days: days
      });
      
      setCorrelationData(response.data || null);
    } catch (error) {
      console.error("Error analyzing correlation:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStockNameByCode = (code: string) => {
    const stock = stocks.find((s) => s.code === code);
    return stock ? stock.name : code;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">数据分析</h1>

      <Card>
        <CardHeader>
          <CardTitle>股票相关性分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索股票代码或名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="天数"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-24"
                />
              </div>
              <div>
                <Button 
                  onClick={handleAnalyzeCorrelation}
                  disabled={selectedStocks.length < 2 || isAnalyzing}
                >
                  {isAnalyzing ? "分析中..." : "分析相关性"}
                </Button>
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

            <div className="border rounded-md overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>代码</TableHead>
                      <TableHead>名称</TableHead>
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
                        <TableCell>{stock.industry}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {correlationData && (
        <Card>
          <CardHeader>
            <CardTitle>相关性矩阵 (过去 {days} 天)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    {correlationData.stocks.map((stock: string) => (
                      <TableHead key={stock} className="text-center min-w-[100px]">
                        <div className="font-medium">{getStockNameByCode(stock)}</div>
                        <div className="text-xs text-gray-500">{stock}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {correlationData.matrix.map((row: number[], rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      <TableCell className="font-medium">
                        <div className="font-medium">{getStockNameByCode(correlationData.stocks[rowIndex])}</div>
                        <div className="text-xs text-gray-500">{correlationData.stocks[rowIndex]}</div>
                      </TableCell>
                      {row.map((value: number, colIndex: number) => (
                        <TableCell 
                          key={colIndex} 
                          className="text-center"
                          style={{
                            backgroundColor: rowIndex === colIndex 
                              ? '#f0f9ff' 
                              : value >= 0.7 
                                ? `rgba(239, 68, 68, ${Math.abs(value) * 0.5})` 
                                : value <= -0.7 
                                  ? `rgba(16, 185, 129, ${Math.abs(value) * 0.5})`
                                  : `rgba(209, 213, 219, ${Math.abs(value) * 0.3})`
                          }}
                        >
                          {value.toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-md border p-4 bg-gray-50">
                <h3 className="font-medium mb-2">相关系数解释</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
                    <span>0.7 ~ 1.0: 强正相关</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-red-300 mr-2"></div>
                    <span>0.3 ~ 0.7: 中等正相关</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-gray-300 mr-2"></div>
                    <span>-0.3 ~ 0.3: 弱相关或无相关</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-green-300 mr-2"></div>
                    <span>-0.7 ~ -0.3: 中等负相关</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
                    <span>-1.0 ~ -0.7: 强负相关</span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-4 md:col-span-2">
                <h3 className="font-medium mb-2">高相关性股票对</h3>
                <div className="space-y-2">
                  {correlationData.high_correlations && correlationData.high_correlations.map((pair: any, index: number) => (
                    <div key={index} className="flex justify-between border-b pb-1 last:border-b-0">
                      <div className="flex">
                        <span className="text-gray-600">{getStockNameByCode(pair.stock1)}</span>
                        <span className="mx-2">—</span>
                        <span className="text-gray-600">{getStockNameByCode(pair.stock2)}</span>
                      </div>
                      <span className={pair.correlation >= 0 ? "text-red-600" : "text-green-600"}>
                        {pair.correlation.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 