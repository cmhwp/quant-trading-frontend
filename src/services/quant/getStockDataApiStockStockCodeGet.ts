// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** Get Stock Data GET /api/stock/${param0} */
export async function getStockDataApiStockStockCodeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStockDataApiStockStockCodeGetParams,
  options?: { [key: string]: any }
) {
  const { stock_code: param0, ...queryParams } = params;
  return request<any>(`/api/stock/${param0}`, {
    method: "GET",
    params: {
      // days has a default value: 30
      days: "30",
      ...queryParams,
    },
    ...(options || {}),
  });
}
