declare namespace API {
  type analyzeRiskApiPortfolioRiskStockCodeGetParams = {
    stock_code: string;
    days?: number;
  };

  type BacktestRequest = {
    /** Stock Code */
    stock_code: string;
    /** Strategy */
    strategy: string;
    /** Start Date */
    start_date?: string | null;
    /** End Date */
    end_date?: string | null;
    /** Params */
    params?: Record<string, any>;
  };

  type backtestStrategyApiAnalysisBacktestStockCodeGetParams = {
    stock_code: string;
    ma_short?: number;
    ma_long?: number;
    days?: number;
  };

  type getConceptStocksApiMarketConceptStocksGetParams = {
    concept?: string | null;
  };

  type getHotSectorsApiMarketHotSectorsGetParams = {
    limit?: number;
  };

  type getIndustryStocksApiMarketIndustryStocksGetParams = {
    industry?: string | null;
  };

  type getMarketCalendarApiMarketCalendarGetParams = {
    days?: number;
  };

  type getMarketNewsApiMarketNewsGetParams = {
    category?: string;
    limit?: number;
  };

  type getStockCorrelationApiAnalysisCorrelationGetParams = {
    stocks: string;
    days?: number;
  };

  type getStockDataApiStockStockCodeGetParams = {
    stock_code: string;
    days?: number;
  };

  type getStockListApiStocksListGetParams = {
    limit?: number;
  };

  type getTechnicalIndicatorsApiAnalysisTechnicalStockCodeGetParams = {
    stock_code: string;
    days?: number;
  };

  type HTTPValidationError = {
    /** Detail */
    detail?: ValidationError[];
  };

  type optimizePortfolioApiPortfolioOptimizePostParams = {
    days?: number;
    optimization_type?: string;
  };

  type Portfolio = {
    /** Stocks */
    stocks: StockWeight[];
    /** Start Date */
    start_date: string;
    /** End Date */
    end_date?: string;
  };

  type StockWeight = {
    /** Code */
    code: string;
    /** Weight */
    weight: number;
  };

  type ValidationError = {
    /** Location */
    loc: (string | number)[];
    /** Message */
    msg: string;
    /** Error Type */
    type: string;
  };
}
