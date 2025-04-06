"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getMarketNewsApiMarketNewsGet, 
  getMarketSectorsApiMarketSectorsGet,
  getMarketBreadthApiMarketMarketBreadthGet,
  getEconomicIndicatorsApiMarketEconomicIndicatorsGet,
  getMarketCalendarApiMarketCalendarGet,
  getInstitutionalSentimentApiMarketInstitutionalSentimentGet
} from "@/services/quant/market";

export default function MarketPage() {
  const [news, setNews] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [breadth, setBreadth] = useState<any>(null);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, sectorsData, breadthData, indicatorsData, calendarData, sentimentData] = await Promise.all([
          getMarketNewsApiMarketNewsGet({ limit: 10 }),
          getMarketSectorsApiMarketSectorsGet(),
          getMarketBreadthApiMarketMarketBreadthGet(),
          getEconomicIndicatorsApiMarketEconomicIndicatorsGet(),
          getMarketCalendarApiMarketCalendarGet({ days: 7 }),
          getInstitutionalSentimentApiMarketInstitutionalSentimentGet(),
        ]);

        setNews(newsData.data || []);
        setSectors(sectorsData.data || []);
        setBreadth(breadthData.data || null);
        setIndicators(indicatorsData.data || []);
        setCalendar(calendarData.data || []);
        setSentiment(sentimentData.data || null);
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">市场行情</h1>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">市场概览</TabsTrigger>
            <TabsTrigger value="sectors">行业板块</TabsTrigger>
            <TabsTrigger value="news">财经新闻</TabsTrigger>
            <TabsTrigger value="calendar">市场日历</TabsTrigger>
            <TabsTrigger value="indicators">经济指标</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>市场宽度</CardTitle>
                </CardHeader>
                <CardContent>
                  {breadth && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>上涨家数</span>
                        <span className="font-medium text-green-600">{breadth.advancing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>下跌家数</span>
                        <span className="font-medium text-red-600">{breadth.declining}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>平盘家数</span>
                        <span className="font-medium">{breadth.unchanged}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>涨停家数</span>
                        <span className="font-medium text-green-600">{breadth.limit_up}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>跌停家数</span>
                        <span className="font-medium text-red-600">{breadth.limit_down}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>机构情绪</CardTitle>
                </CardHeader>
                <CardContent>
                  {sentiment && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>北向资金流入(亿)</span>
                        <span className={`font-medium ${sentiment.northbound_flow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sentiment.northbound_flow}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>融资余额变化(亿)</span>
                        <span className={`font-medium ${sentiment.margin_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sentiment.margin_change}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>机构净买入(亿)</span>
                        <span className={`font-medium ${sentiment.institutional_buy_sell_ratio >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                          {sentiment.institutional_net_buy}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sectors" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>行业板块表现</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sectors.map((sector, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{sector.name}</span>
                        <span className={`font-medium ${sector.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sector.change_percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>最新财经新闻</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {news.map((item, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span>{item.source}</span>
                        <span className="mx-2">•</span>
                        <span>{item.date}</span>
                      </div>
                      {item.summary && (
                        <div className="text-sm mt-2">{item.summary}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>市场日历</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {calendar.map((event, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between">
                        <span className="font-medium">{event.date}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          event.importance === 'high' ? 'bg-red-100 text-red-800' : 
                          event.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {event.importance === 'high' ? '重要' : 
                           event.importance === 'medium' ? '中等' : '一般'}
                        </span>
                      </div>
                      <div className="mt-1">{event.event}</div>
                      {event.details && (
                        <div className="text-sm text-gray-600 mt-1">{event.details}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="indicators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>经济指标</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {indicators.map((indicator, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{indicator.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({indicator.date})</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{indicator.value}</span>
                        {indicator.previous && (
                          <span className={`text-sm ml-2 ${
                            indicator.value > indicator.previous ? 'text-green-600' : 
                            indicator.value < indicator.previous ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            ({indicator.value > indicator.previous ? '↑' : indicator.value < indicator.previous ? '↓' : '='} 前值: {indicator.previous})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 