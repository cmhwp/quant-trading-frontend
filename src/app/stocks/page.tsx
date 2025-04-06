"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { getStockListApiStocksListGet } from "@/services/quant/getStockListApiStocksListGet";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function StocksPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">股票列表</h1>

      <div className="w-full md:w-1/3">
        <Input
          placeholder="搜索股票代码或名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>代码</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>最新价</TableHead>
                <TableHead>涨跌幅</TableHead>
                <TableHead>成交量</TableHead>
                <TableHead>市值</TableHead>
                <TableHead>所属行业</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <TableRow key={stock.code}>
                    <TableCell className="font-medium">
                      <Link 
                        href={`/stocks/${stock.code}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {stock.code}
                      </Link>
                    </TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>{stock.price}</TableCell>
                    <TableCell className={stock.change_percent >= 0 ? "text-green-600" : "text-red-600"}>
                      {stock.change_percent}%
                    </TableCell>
                    <TableCell>{stock.volume}</TableCell>
                    <TableCell>{stock.market_cap}</TableCell>
                    <TableCell>{stock.industry}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    未找到匹配的股票
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 