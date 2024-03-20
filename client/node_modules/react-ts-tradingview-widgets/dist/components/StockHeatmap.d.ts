import React from "react";
import { ColorTheme, CopyrightStyles, Exchanges, Locales } from "..";
type ConditionalStockHeatmapDataSetProps = {
    hasTopBar?: true;
    isSetDataSetEnabled?: boolean;
} | {
    hasTopBar?: false;
    isSetDataSetEnabled?: never;
};
export type StockHeatmapProps = {
    dataSource?: string;
    exchanges?: Exchanges[];
    grouping?: "no_group" | "sector";
    blockSize?: "market_cap_basic" | "number_of_employees" | "dividend_yield_recent" | "price_earnings_ttm" | "price_sales_current" | "price_book_fq" | "volume|60" | "volume|240" | "volume" | "volume|1W" | "volume|1M" | "Value.Traded|60" | "Value.Traded|240" | "Value.Traded" | "Value.Traded|1W" | "Value.Traded|1M";
    blockColor?: "change|60" | "change|240" | "change" | "Perf.W" | "Perf.1M" | "Perf.3M" | "Perf.6M" | "Perf.YTD" | "Perf.Y" | "premarket_change" | "postmarket_change" | "relative_volume_10d_calc" | "Volatility.D" | "gap";
    locale?: Locales;
    autoSize?: boolean;
    height?: number | string;
    width?: number | string;
    symbolUrl?: string;
    colorTheme?: ColorTheme;
    isZoomEnabled?: boolean;
    hasSymbolTooltip?: boolean;
    children?: never;
    copyrightStyles?: CopyrightStyles;
} & ConditionalStockHeatmapDataSetProps;
declare const _default: React.NamedExoticComponent<StockHeatmapProps>;
export default _default;
