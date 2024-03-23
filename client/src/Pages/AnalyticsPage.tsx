import { useEffect, useState } from "react";
import { TickerSymbol, TickerTape } from "react-ts-tradingview-widgets";
import BottomHeader from "../Components/BottomHeader";
import MyResponsiveBar from "../Components/MyResponsiveBar";
import MyResponsiveBarMobile from "../Components/MyResponsiveBarMobile";
import MyResponsiveTimelineBar from "../Components/MyResponsiveTimelineBar";
import MyResponsiveTimelineBarMobile from "../Components/MyResponsiveTimelineBarMobile";
import Navbar from "../Components/Navbar";
import { fetchAllStockMentions, fetchData, fetchDataRange, fetchLimitStockMentions, fetchStocksMention } from "../Services/ServerApi";
import getPreviousWeekStartDate from "../Utils/PreviousWeekStrUtil";
import visualizationTimeline from "../Utils/VisualizationTimelineUtil";
import visualization from "../Utils/VisualizationUtil";

function AnalyticsPage() {
  const [data, setData] = useState<graph_data[]>([]);
  const [rangeData, setRangeData] = useState<timeline_data[]>([]);
  const [isTooLarge, setIsTooLarge] = useState(false);
  const [stock, setStock] = useState("NVDA");
  const [allStocks, setAllStocks] = useState<string[]>([]);


  useEffect(() => {
    function handleResize() {
      setIsTooLarge(window.innerWidth > 1337);
    }

    fetchAllStockMentions().then(( allStockMentions ) => {
      // Use the returned data here
      console.log(allStockMentions)
    })

    fetchLimitStockMentions(3).then(( limitStockMentions ) => {
      console.log(limitStockMentions);
    })

    fetchStocksMention("NVDA").then(( stocksMention ) => {
      console.log(stocksMention);
    })

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  type graph_data = {
    stock: string;
    positive: number;
    positiveColor: string;
    negative: number;
    negativeColor: string;
    mixed: number;
    mixedColor: string;
  };

  type timeline_data = {
    day: string;
    positive: number;
    positiveColor: string;
    negative: number;
    negativeColor: string;
    mixed: number;
    mixedColor: string;
  };

  const symbols: TickerSymbol[] = [
    {
      proName: "NASDAQ:NVDA",
      title: "NVDA",
    },
    {
      proName: "AMEX:SPY",
      title: "SPY",
    },
    {
      proName: "NASDAQ:TSLA",
      title: "TSLA",
    },
    {
      proName: "NASDAQ:AMD",
      title: "AMD",
    },
    {
      proName: "NYSE:TSM",
      title: "TSM",
    },
    {
      proName: "NYSE:PATH",
      title: "PATH",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full custom-background-img-mobile sm:custom-background-img-desktop">
      <Navbar />
      <div
        id="analytics-container"
        className="flex flex-col h-max w-full items-center overflow-y-auto gap-2 pt-8"
      >
        <TickerTape
          colorTheme="dark"
          symbols={symbols}
          isTransparent={true}
        ></TickerTape>
        <div
          id="count-button-container"
          className="flex flex-row w-full sm:w-2/4 justify-around item-center pt-8"
        >
          <button
            className="text-white bg-white/10 hover:ring-2 hover:ring-amber-300 focus:ring-2 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 text-center inline-flex items-center"
            onClick={() => {
              fetchData(10000, 10).then(({ sortedStocks, stockSentiments, entries }) => {
                // Use the returned data here
                setAllStocks(sortedStocks);
                setData(visualization(stockSentiments, entries));
              });
            }}
          >
            Top 10 Stocks
          </button>
          <button
            className="text-white bg-white/10 hover:ring-2 hover:ring-amber-300 focus:ring-2 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 text-center inline-flex items-center"
            onClick={() => {
              fetchData(10000, 15).then(({ sortedStocks, stockSentiments, entries }) => {
                // Use the returned data here
                setAllStocks(sortedStocks);
                setData(visualization(stockSentiments, entries));
              });
            }}
          >
            Top 15 Stocks
          </button>
          <button
            className="text-white bg-white/10 hover:ring-2 hover:ring-amber-300 focus:ring-2 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 text-center inline-flex items-center"
            onClick={() => {
              fetchData(10000, 20).then(({ sortedStocks, stockSentiments, entries }) => {
                // Use the returned data here
                setAllStocks(sortedStocks);
                setData(visualization(stockSentiments, entries));
              });
            }}
          >
            Top 20 Stocks
          </button>
        </div>
        <div
          id="count-container"
          className="flex flex-col h-128 w-full sm:h-128 sm:w-4/6 sm:mx-auto pl-4"
        >
          {isTooLarge
            ? data.length > 0 && <MyResponsiveBar data={data} />
            : data.length > 0 && <MyResponsiveBarMobile data={data} />}
        </div>

        <div className="w-5/6 sm:w-4/6 flex flex-row justify-between items-center sm:pt-20">
          <p className="text-white text-lg sm:text-2xl">
            Currently viewing:{" "}
            <span className="font-bold text-blue-500">{stock}</span>
          </p>
          <select
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
              fetchDataRange(e.target.value,getPreviousWeekStartDate(), 1).then(({ stockSentiments, days, stock }) => {
                setRangeData(visualizationTimeline(stock, stockSentiments, days));
              })
              .catch((error) => {
                console.error("Error fetching data:", error);
              });
            }}
            className="block bg-white/10 hover:ring-2 hover:ring-amber-300 focus:ring-2 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm w-3/6"
          >
            <option className="bg-black" value={stock}>
              {stock ? stock : "Select a stock"}
            </option>
            {[...allStocks].map((stock, index) => (
              <option className="bg-black" key={index} value={stock}>
                {stock}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M15.293 15.293l-4.854-4.854A5.957 5.957 0 0 0 11 6c0-3.309-2.691-6-6-6S-1 2.691-1 6s2.691 6 6 6c1.286 0 2.475-.399 3.469-1.078l4.854 4.854c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414zM1 6c0-2.206 1.794-4 4-4s4 1.794 4 4-1.794 4-4 4-4-1.794-4-4z" />
            </svg>
          </div>
        </div>
        <div
          id="count-container"
          className="flex flex-col h-128 w-full sm:h-128 sm:w-4/6 pl-4 sm:mx-auto "
        >
          {isTooLarge
            ? rangeData.length > 0 && (
                <MyResponsiveTimelineBar data={rangeData} />
              )
            : rangeData.length > 0 && (
                <MyResponsiveTimelineBarMobile data={rangeData} />
              )}
        </div>
      </div>
      <div id="pie-chart"></div>
      <BottomHeader />
    </div>
  );
}

export default AnalyticsPage;
