import React from "react";
import { ColorTheme, CopyrightStyles, Locales } from "..";
type ConditionalCryptoCoinsHeatmapDataSetProps = {
    hasTopBar?: true;
    isSetDataSetEnabled?: boolean;
} | {
    hasTopBar?: false;
    isSetDataSetEnabled?: never;
};
export type CryptoCoinsHeatmapProps = {
    dataSource?: "Crypto" | "CryptoWithoutBTC" | "CryptoWithoutStable" | "CryptoDeFi";
    blockSize?: "market_cap_calc" | "market_cap_diluted_calc" | "24h_vol_cmc" | "tvl" | "24h_vol_to_market_cap" | "market_cap_to_tvl";
    blockColor?: "change|60" | "change|240" | "change" | "Perf.W" | "Perf.1M" | "Perf.3M" | "Perf.6M" | "Perf.YTD" | "Perf.Y" | "24h_vol_change_cmc" | "24h_vol_cmc" | "Volatility.D" | "gap";
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
} & ConditionalCryptoCoinsHeatmapDataSetProps;
declare const _default: React.NamedExoticComponent<CryptoCoinsHeatmapProps>;
export default _default;
