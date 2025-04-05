// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** Get Stock List GET /api/stocks/list */
export async function getStockListApiStocksListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStockListApiStocksListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/stocks/list", {
    method: "GET",
    params: {
      // limit has a default value: 50
      limit: "50",
      ...params,
    },
    ...(options || {}),
  });
}
