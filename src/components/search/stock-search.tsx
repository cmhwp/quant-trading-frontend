"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stock {
  code: string;
  name: string;
  price: number;
  change_percent: number;
  volume: number;
}

interface StockSearchProps {
  onSelectStock: (code: string, name: string) => void;
}

export default function StockSearch({ onSelectStock }: StockSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch stock list on component mount
    fetchStockList();
  }, []);

  const fetchStockList = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/stocks/list");
      if (!response.ok) {
        throw new Error("Failed to fetch stock list");
      }
      const data = await response.json();
      setStocks(data);
      setError(null);
    } catch (err) {
      setError("Error fetching stock list");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter stocks based on search query
  const filteredStocks = stocks.filter(
    (stock) =>
      stock.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Stocks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search by code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={fetchStockList}>Refresh</Button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change %</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No stocks found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStocks.slice(0, 10).map((stock) => (
                    <TableRow
                      key={stock.code}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => onSelectStock(stock.code, stock.name)}
                    >
                      <TableCell className="font-medium">{stock.code}</TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell className="text-right">{stock.price.toFixed(2)}</TableCell>
                      <TableCell
                        className={`text-right ${
                          stock.change_percent >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stock.change_percent >= 0 ? "+" : ""}
                        {stock.change_percent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {(stock.volume / 10000).toFixed(2)}万
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}