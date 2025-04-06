"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  getMarketSectorsApiMarketSectorsGet,
  getIndustryStocksApiMarketIndustryStocksGet,
  getConceptStocksApiMarketConceptStocksGet
} from "@/services/quant/market";

export default function SectorsPage() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [industryStocks, setIndustryStocks] = useState<any[]>([]);
  const [conceptStocks, setConceptStocks] = useState<any[]>([]);
  
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedConcept, setSelectedConcept] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingIndustry, setIsLoadingIndustry] = useState(false);
  const [isLoadingConcept, setIsLoadingConcept] = useState(false);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await getMarketSectorsApiMarketSectorsGet();
        setSectors(response.data || []);
      } catch (error) {
        console.error("Error fetching sectors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSectors();
  }, []);

  const fetchIndustryStocks = async (industry: string) => {
    setIsLoadingIndustry(true);
    try {
      const response = await getIndustryStocksApiMarketIndustryStocksGet({ industry });
      setIndustryStocks(response.data || []);
    } catch (error) {
      console.error("Error fetching industry stocks:", error);
    } finally {
      setIsLoadingIndustry(false);
    }
  };

  const fetchConceptStocks = async (concept: string) => {
    setIsLoadingConcept(true);
    try {
      const response = await getConceptStocksApiMarketConceptStocksGet({ concept });
      setConceptStocks(response.data || []);
    } catch (error) {
      console.error("Error fetching concept stocks:", error);
    } finally {
      setIsLoadingConcept(false);
    }
  };

  const handleSelectIndustry = (industry: string) => {
    setSelectedIndustry(industry);
    fetchIndustryStocks(industry);
  };

  const handleSelectConcept = (concept: string) => {
    setSelectedConcept(concept);
    fetchConceptStocks(concept);
  };

  const filteredSectors = sectors.filter((sector) => 
    sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sector.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">行业与概念</h1>

      <Tabs defaultValue="industry" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="industry">行业板块</TabsTrigger>
          <TabsTrigger value="concept">概念板块</TabsTrigger>
        </TabsList>
        
        <TabsContent value="industry" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-1/3">
              <CardHeader>
                <CardTitle>行业板块</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="搜索行业..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-gray-500">加载中...</div>
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                      {filteredSectors
                        .filter(sector => sector.type === 'industry')
                        .map((sector, index) => (
                        <div 
                          key={index}
                          className={`flex justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                            selectedIndustry === sector.name ? 'bg-blue-50 hover:bg-blue-50' : ''
                          }`}
                          onClick={() => handleSelectIndustry(sector.name)}
                        >
                          <span>{sector.name}</span>
                          <span className={sector.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {sector.change_percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <CardTitle>
                  {selectedIndustry ? `${selectedIndustry}行业股票` : '选择行业查看股票列表'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingIndustry ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">加载中...</div>
                  </div>
                ) : !selectedIndustry ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    请从左侧选择行业
                  </div>
                ) : industryStocks.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    未找到相关股票
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>代码</TableHead>
                          <TableHead>名称</TableHead>
                          <TableHead>最新价</TableHead>
                          <TableHead>涨跌幅</TableHead>
                          <TableHead>成交量</TableHead>
                          <TableHead>市值</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {industryStocks.map((stock) => (
                          <TableRow key={stock.code}>
                            <TableCell className="font-medium">
                              <Link href={`/stocks/${stock.code}`} className="text-blue-600 hover:underline">
                                {stock.code}
                              </Link>
                            </TableCell>
                            <TableCell>{stock.name}</TableCell>
                            <TableCell>{stock.price}</TableCell>
                            <TableCell className={stock.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {stock.change_percent}%
                            </TableCell>
                            <TableCell>{stock.volume}</TableCell>
                            <TableCell>{stock.market_cap}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="concept" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-1/3">
              <CardHeader>
                <CardTitle>概念板块</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="搜索概念..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-gray-500">加载中...</div>
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                      {filteredSectors
                        .filter(sector => sector.type === 'concept')
                        .map((sector, index) => (
                        <div 
                          key={index}
                          className={`flex justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                            selectedConcept === sector.name ? 'bg-blue-50 hover:bg-blue-50' : ''
                          }`}
                          onClick={() => handleSelectConcept(sector.name)}
                        >
                          <span>{sector.name}</span>
                          <span className={sector.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {sector.change_percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <CardTitle>
                  {selectedConcept ? `${selectedConcept}概念股票` : '选择概念查看股票列表'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingConcept ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">加载中...</div>
                  </div>
                ) : !selectedConcept ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    请从左侧选择概念
                  </div>
                ) : conceptStocks.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    未找到相关股票
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>代码</TableHead>
                          <TableHead>名称</TableHead>
                          <TableHead>最新价</TableHead>
                          <TableHead>涨跌幅</TableHead>
                          <TableHead>成交量</TableHead>
                          <TableHead>市值</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conceptStocks.map((stock) => (
                          <TableRow key={stock.code}>
                            <TableCell className="font-medium">
                              <Link href={`/stocks/${stock.code}`} className="text-blue-600 hover:underline">
                                {stock.code}
                              </Link>
                            </TableCell>
                            <TableCell>{stock.name}</TableCell>
                            <TableCell>{stock.price}</TableCell>
                            <TableCell className={stock.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {stock.change_percent}%
                            </TableCell>
                            <TableCell>{stock.volume}</TableCell>
                            <TableCell>{stock.market_cap}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 