// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** Backtest Strategy Backtest a trading strategy POST /api/strategies/backtest */
export async function backtestStrategyApiStrategiesBacktestPost(
  body: API.BacktestRequest,
  options?: { [key: string]: any }
) {
  return request<any>("/api/strategies/backtest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** List Strategies List available trading strategies GET /api/strategies/list */
export async function listStrategiesApiStrategiesListGet(options?: {
  [key: string]: any;
}) {
  return request<any>("/api/strategies/list", {
    method: "GET",
    ...(options || {}),
  });
}
