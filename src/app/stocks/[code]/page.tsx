"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStockDataApiStockStockCodeGet } from "@/services/quant/getStockDataApiStockStockCodeGet";
import { getTechnicalIndicatorsApiAnalysisTechnicalStockCodeGet } from "@/services/quant/analysis";
import { analyzeRiskApiPortfolioRiskStockCodeGet } from "@/services/quant/portfolio";

export default function StockDetailPage() {
  const params = useParams();
  const stockCode = params.code as string;
  
  const [stockData, setStockData] = useState<any>(null);
  const [technicalData, setTechnicalData] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockResponse, technicalResponse, riskResponse] = await Promise.all([
          getStockDataApiStockStockCodeGet({ stock_code: stockCode }),
          getTechnicalIndicatorsApiAnalysisTechnicalStockCodeGet({ stock_code: stockCode }),
          analyzeRiskApiPortfolioRiskStockCodeGet({ stock_code: stockCode }),
        ]);

        setStockData(stockResponse.data || null);
        setTechnicalData(technicalResponse.data || null);
        setRiskData(riskResponse.data || null);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (stockCode) {
      fetchData();
    }
  }, [stockCode]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : stockData ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{stockData.name} ({stockData.code})</h1>
              <p className="text-gray-500">{stockData.exchange} • {stockData.industry}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stockData.price}</div>
              <div className={`flex items-center ${stockData.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span>{stockData.change}</span>
                <span className="mx-1">|</span>
                <span>{stockData.change_percent}%</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">基本信息</TabsTrigger>
              <TabsTrigger value="technical">技术指标</TabsTrigger>
              <TabsTrigger value="risk">风险分析</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>股票信息</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">开盘价</span>
                        <span>{stockData.open}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">最高价</span>
                        <span>{stockData.high}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">最低价</span>
                        <span>{stockData.low}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">收盘价</span>
                        <span>{stockData.close}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">成交量</span>
                        <span>{stockData.volume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">市值</span>
                        <span>{stockData.market_cap}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">PE</span>
                        <span>{stockData.pe_ratio}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>最新财务数据</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stockData.financials && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">每股收益</span>
                          <span>{stockData.financials.eps}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">营收</span>
                          <span>{stockData.financials.revenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">净利润</span>
                          <span>{stockData.financials.net_income}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">净资产</span>
                          <span>{stockData.financials.equity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">资产总计</span>
                          <span>{stockData.financials.total_assets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">负债总计</span>
                          <span>{stockData.financials.total_liabilities}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>技术指标</CardTitle>
                </CardHeader>
                <CardContent>
                  {technicalData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">MA(5)</span>
                          <span>{technicalData.ma5}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">MA(10)</span>
                          <span>{technicalData.ma10}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">MA(20)</span>
                          <span>{technicalData.ma20}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">MA(60)</span>
                          <span>{technicalData.ma60}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">RSI(14)</span>
                          <span>{technicalData.rsi14}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">MACD</span>
                          <span>{technicalData.macd}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">MACD信号线</span>
                          <span>{technicalData.macd_signal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">MACD柱状</span>
                          <span>{technicalData.macd_hist}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">布林上轨</span>
                          <span>{technicalData.bollinger_upper}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">布林中轨</span>
                          <span>{technicalData.bollinger_middle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">布林下轨</span>
                          <span>{technicalData.bollinger_lower}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>信号分析</CardTitle>
                </CardHeader>
                <CardContent>
                  {technicalData && technicalData.signals && (
                    <div className="space-y-2">
                      {Object.entries(technicalData.signals).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span>{key}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            value === 'buy' ? 'bg-green-100 text-green-800' : 
                            value === 'sell' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {value === 'buy' ? '买入' : value === 'sell' ? '卖出' : '持有'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="risk" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>风险分析</CardTitle>
                </CardHeader>
                <CardContent>
                  {riskData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Beta</span>
                          <span>{riskData.beta}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">夏普比率</span>
                          <span>{riskData.sharpe_ratio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Alpha</span>
                          <span>{riskData.alpha}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">年化波动率</span>
                          <span>{riskData.volatility}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">最大回撤</span>
                          <span>{riskData.max_drawdown}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">信息比率</span>
                          <span>{riskData.information_ratio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">索提诺比率</span>
                          <span>{riskData.sortino_ratio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">风险评级</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            riskData.risk_level === 'high' ? 'bg-red-100 text-red-800' : 
                            riskData.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {riskData.risk_level === 'high' ? '高风险' : 
                             riskData.risk_level === 'medium' ? '中等风险' : '低风险'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">未找到股票信息</div>
        </div>
      )}
    </div>
  );
} 