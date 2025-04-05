// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** Backtest Strategy Backtest a simple Moving Average crossover strategy GET /api/analysis/backtest/${param0} */
export async function backtestStrategyApiAnalysisBacktestStockCodeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.backtestStrategyApiAnalysisBacktestStockCodeGetParams,
  options?: { [key: string]: any }
) {
  const { stock_code: param0, ...queryParams } = params;
  return request<any>(`/api/analysis/backtest/${param0}`, {
    method: "GET",
    params: {
      // ma_short has a default value: 5
      ma_short: "5",
      // ma_long has a default value: 20
      ma_long: "20",
      // days has a default value: 365
      days: "365",
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** Get Stock Correlation Get correlation matrix between stocks GET /api/analysis/correlation */
export async function getStockCorrelationApiAnalysisCorrelationGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStockCorrelationApiAnalysisCorrelationGetParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/analysis/correlation", {
    method: "GET",
    params: {
      // days has a default value: 90
      days: "90",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get Technical Indicators Get technical indicators for a stock GET /api/analysis/technical/${param0} */
export async function getTechnicalIndicatorsApiAnalysisTechnicalStockCodeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTechnicalIndicatorsApiAnalysisTechnicalStockCodeGetParams,
  options?: { [key: string]: any }
) {
  const { stock_code: param0, ...queryParams } = params;
  return request<any>(`/api/analysis/technical/${param0}`, {
    method: "GET",
    params: {
      // days has a default value: 90
      days: "90",
      ...queryParams,
    },
    ...(options || {}),
  });
}
