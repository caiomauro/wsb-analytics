import { Suspense, lazy, useEffect, useState } from "react";
import BottomHeader from "../Components/BottomHeader";
import Navbar from "../Components/Navbar";
import { fetchData, fetchDataRange, fetchLimitStockMentions } from "../Services/ServerApi";
import getPreviousWeekStartDate from "../Utils/PreviousWeekStrUtil";
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
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Pulling data");


  useEffect(() => {
    setLoading(true);
    setLoadingText("Establishing web-workers")

    const workerBar = new Worker(new URL('../Utils/VisualizationUtil', import.meta.url));
    const workerBarTimeline = new Worker(new URL('../Utils/VisualizationTimelineUtil', import.meta.url));
    const workerPie = new Worker(new URL('../Utils/VisualizationPieUtil', import.meta.url));

    function handleResize() {
      setIsTooLarge(window.innerWidth > 1337);
    }

    workerBar.onmessage = (e) => {
      setData(e.data);
    };
    
    workerBarTimeline.onmessage = (e) => {
      setRangeData(e.data);
    }

    workerPie.onmessage = (e) => {
      setPieData(e.data);
    }

    setLoadingText("Processing main data")

    Promise.all([
      fetchData(10000, 10).then(({ sortedStocks, stockSentiments, entries }) => {
        setAllStocks(sortedStocks);
        workerBar.postMessage({ data: stockSentiments, entries });
      }),
      fetchLimitStockMentions(10).then((limitStockMentions) => {
        workerPie.postMessage({ data: limitStockMentions.limitStockMentions.reverse() });
      }),
      fetchDataRange("NVDA", getPreviousWeekStartDate(), 1).then(({ stockSentiments, days, stock }) => {
        workerBarTimeline.postMessage({ data: stockSentiments, days, stock });
      })
    ]).then(() => {
      setLoadingText("Enjoy!");
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false in case of error
    });
    
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

  type pie_data = {
    stock: string
    label: string
    value: number
    color: string
}

  return (
    <div className="flex flex-col w-full h-full custom-background-img-mobile sm:custom-background-img-desktop">
      <Navbar />
      {loading ? (
        <div className="flex flex-col h-screen w-full items-center gap-2 pt-40">
        <div role="status">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>
        <h1 className="font-bold text-2xl sm:text-4xl text-blue-500">{loadingText}</h1>
        </div>
        ) : (
      <div
        id="analytics-container"
        className="flex flex-col h-max w-full items-center overflow-y-auto gap-2 pt-8"
      >
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
      )}
      <BottomHeader />
    </div>
  );
}

export default AnalyticsPage;
