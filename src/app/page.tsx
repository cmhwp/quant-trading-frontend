"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIndicesApiIndicesGet } from "@/services/quant/getIndicesApiIndicesGet";
import { getMarketNewsApiMarketNewsGet } from "@/services/quant/market";
import { getHotSectorsApiMarketHotSectorsGet } from "@/services/quant/market";

export default function Home() {
  const [indices, setIndices] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [hotSectors, setHotSectors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [indicesData, newsData, hotSectorsData] = await Promise.all([
          getIndicesApiIndicesGet({}),
          getMarketNewsApiMarketNewsGet({ limit: 5 }),
          getHotSectorsApiMarketHotSectorsGet({ limit: 5 }),
        ]);

        setIndices(indicesData.data || []);
        setNews(newsData.data || []);
        setHotSectors(hotSectorsData.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">市场概览</h1>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {indices.map((index) => (
              <Card key={index.code}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{index.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{index.price}</div>
                  <div className={`text-sm ${index.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {index.change} ({index.change_percent}%)
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>热门行业</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotSectors.map((sector) => (
                    <div key={sector.name} className="flex justify-between items-center">
                      <div>{sector.name}</div>
                      <div className={`font-medium ${sector.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {sector.change_percent}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>市场新闻</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {news.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
