// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** Optimize Portfolio Optimize portfolio weights based on historical data POST /api/portfolio/optimize */
export async function optimizePortfolioApiPortfolioOptimizePost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.optimizePortfolioApiPortfolioOptimizePostParams,
  body: string[],
  options?: { [key: string]: any }
) {
  return request<any>("/api/portfolio/optimize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      // days has a default value: 365
      days: "365",
      // optimization_type has a default value: sharpe
      optimization_type: "sharpe",
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** Analyze Portfolio Performance Analyze the performance of a portfolio over time POST /api/portfolio/performance */
export async function analyzePortfolioPerformanceApiPortfolioPerformancePost(
  body: API.Portfolio,
  options?: { [key: string]: any }
) {
  return request<any>("/api/portfolio/performance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Analyze Risk Analyze risk metrics for a specific stock GET /api/portfolio/risk/${param0} */
export async function analyzeRiskApiPortfolioRiskStockCodeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.analyzeRiskApiPortfolioRiskStockCodeGetParams,
  options?: { [key: string]: any }
) {
  const { stock_code: param0, ...queryParams } = params;
  return request<any>(`/api/portfolio/risk/${param0}`, {
    method: "GET",
    params: {
      // days has a default value: 90
      days: "90",
      ...queryParams,
    },
    ...(options || {}),
  });
}
