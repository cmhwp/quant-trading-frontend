// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** Get Market Calendar Get market events calendar for upcoming days GET /api/market/calendar */
export async function getMarketCalendarApiMarketCalendarGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMarketCalendarApiMarketCalendarGetParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/market/calendar", {
    method: "GET",
    params: {
      // days has a default value: 7
      days: "7",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get Concept Stocks Get concept stocks and their performance GET /api/market/concept_stocks */
export async function getConceptStocksApiMarketConceptStocksGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getConceptStocksApiMarketConceptStocksGetParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/market/concept_stocks", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get Economic Indicators Get key economic indicators GET /api/market/economic/indicators */
export async function getEconomicIndicatorsApiMarketEconomicIndicatorsGet(options?: {
  [key: string]: any;
}) {
  return request<any>("/api/market/economic/indicators", {
    method: "GET",
    ...(options || {}),
  });
}

/** Get Hot Sectors Get top performing sectors GET /api/market/hot_sectors */
export async function getHotSectorsApiMarketHotSectorsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHotSectorsApiMarketHotSectorsGetParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/market/hot_sectors", {
    method: "GET",
    params: {
      // limit has a default value: 10
      limit: "10",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get Industry Stocks Get industry stocks and their performance GET /api/market/industry_stocks */
export async function getIndustryStocksApiMarketIndustryStocksGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getIndustryStocksApiMarketIndustryStocksGetParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/market/industry_stocks", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get Institutional Sentiment Get institutional investor sentiment metrics GET /api/market/institutional/sentiment */
export async function getInstitutionalSentimentApiMarketInstitutionalSentimentGet(options?: {
  [key: string]: any;
}) {
  return request<any>("/api/market/institutional/sentiment", {
    method: "GET",
    ...(options || {}),
  });
}

/** Get Market Breadth Get market breadth indicators (advance/decline) GET /api/market/market_breadth */
export async function getMarketBreadthApiMarketMarketBreadthGet(options?: {
  [key: string]: any;
}) {
  return request<any>("/api/market/market_breadth", {
    method: "GET",
    ...(options || {}),
  });
}

/** Get Market News Get latest market news GET /api/market/news */
export async function getMarketNewsApiMarketNewsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMarketNewsApiMarketNewsGetParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/market/news", {
    method: "GET",
    params: {
      // category has a default value: finance
      category: "finance",
      // limit has a default value: 20
      limit: "20",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get Market Sectors Get performance of market sectors GET /api/market/sectors */
export async function getMarketSectorsApiMarketSectorsGet(options?: {
  [key: string]: any;
}) {
  return request<any>("/api/market/sectors", {
    method: "GET",
    ...(options || {}),
  });
}
