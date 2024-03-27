import { Suspense, lazy, useEffect, useState } from "react";
import BottomHeader from "../Components/BottomHeader";
import Navbar from "../Components/Navbar";
import { fetchData, fetchDataRange, fetchLimitStockMentions } from "../Services/ServerApi";
import getPreviousWeekStartDate from "../Utils/PreviousWeekStrUtil";
import visualizationPieChart from "../Utils/VisualizationPieUtil";
import visualizationTimeline from "../Utils/VisualizationTimelineUtil";
import visualization from "../Utils/VisualizationUtil";

// Lazy load chart components
const MyResponsiveBar = lazy(() => import("../Components/MyResponsiveBar"));
const MyResponsiveBarMobile = lazy(() => import("../Components/MyResponsiveBarMobile"));
const MyResponsivePie = lazy(() => import("../Components/MyResponsivePie"));
const MyResponsiveTimelineBar = lazy(() => import("../Components/MyResponsiveTimelineBar"));
const MyResponsiveTimelineBarMobile = lazy(() => import("../Components/MyResponsiveTimelineBarMobile"));

function AnalyticsPage() {
  const [data, setData] = useState<graph_data[]>([]);
  const [rangeData, setRangeData] = useState<timeline_data[]>([]);
  const [pieData, setPieData] = useState<pie_data[]>([]);
  const [isTooLarge, setIsTooLarge] = useState(false);
  const [stock, setStock] = useState("NVDA");
  const [allStocks, setAllStocks] = useState<string[]>([]);


  useEffect(() => {

    const worker = new Worker(new URL('../Utils/VisualizationUtil', import.meta.url));

    function handleResize() {
      setIsTooLarge(window.innerWidth > 1337);
    }

    worker.onmessage = (e) => {
      setData(e.data);
    };

    fetchData(10000, 10).then(({ sortedStocks, stockSentiments, entries }) => {
      setAllStocks(sortedStocks);
      worker.postMessage({ data: stockSentiments, entries }); // Post message to worker
    });

    /*
    fetchData(10000, 10).then(({ sortedStocks, stockSentiments, entries }) => {
      setAllStocks(sortedStocks);
      setData(visualization(stockSentiments, entries));
    });
    */

    fetchLimitStockMentions(10).then(( limitStockMentions ) => {
      setPieData(visualizationPieChart(limitStockMentions.limitStockMentions.reverse()));
    })

    fetchDataRange("NVDA",getPreviousWeekStartDate(), 1).then(({ stockSentiments, days, stock }) => {
      setRangeData(visualizationTimeline(stock, stockSentiments, days));
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
    
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      worker.terminate();
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

  type pie_data = {
    stock: string
    label: string
    value: number
    color: string
}

  return (
    <div className="flex flex-col w-full h-full custom-background-img-mobile sm:custom-background-img-desktop">
      <Navbar />
      <div
        id="analytics-container"
        className="flex flex-col h-max w-full items-center overflow-y-auto gap-2 pt-8"
      >
        <h1>Sentiment Analysis</h1>
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
          <Suspense fallback={<div>Loading...</div>}>
            {isTooLarge
              ? data.length > 0 && <MyResponsiveBar data={data} />
              : data.length > 0 && <MyResponsiveBarMobile data={data} />}
          </Suspense>
        </div>

      <div 
      id="pie-chart"
      className="flex flex-col h-80 w-full sm:h-202 sm:w-4/6 sm:mx-auto pl-4 sm:pt-20 items-center">
        <Suspense fallback={<div>Loading...</div>}>
          <MyResponsivePie data={pieData} />
        </Suspense>
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
          <Suspense fallback={<div>Loading...</div>}>
            {isTooLarge
              ? rangeData.length > 0 && (
                  <MyResponsiveTimelineBar data={rangeData} />
                )
              : rangeData.length > 0 && (
                  <MyResponsiveTimelineBarMobile data={rangeData} />
                )}
          </Suspense>
        </div>
      </div>
      <BottomHeader />
    </div>
  );
}

export default AnalyticsPage;
