import { ResponsiveBar } from "@nivo/bar";
import "flowbite";
import { useEffect, useRef, useState } from "react";
import { TickerSymbol, TickerTape } from "react-ts-tradingview-widgets";
import BottomHeader from "../Components/BottomHeader";
import Navbar from "../Components/Navbar";

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
  interface MyResponsiveBarProps {
    data: graph_data[];
  }

  interface MyResponsiveTimelineBarProps {
    data: timeline_data[];
  }

  const visualization = (data: Array<Array<string>>, entries: number) => {
    const stock: { [key: string]: Array<string> } = {};
    const stock_sentiment_count: { [key: string]: Array<number> } = {};
    const final_data: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const key = data[i][0];
      const value = data[i][1];

      if (!stock[key]) {
        stock[key] = []; // Create an empty array if the key doesn't exist
      }
      stock[key].push(value);
    }

    Object.entries(stock).forEach(([key, value]) => {
      stock_sentiment_count[key] = [0, 0, 0];
      for (let i = 0; i < value.length; i++) {
        if (value[i] == "positive") {
          stock_sentiment_count[key][0] = stock_sentiment_count[key][0] + 1;
        } else if (value[i] == "negative") {
          stock_sentiment_count[key][1] = stock_sentiment_count[key][1] + 1;
        } else {
          stock_sentiment_count[key][2] = stock_sentiment_count[key][2] + 1;
        }
      }
    });

    Object.entries(stock_sentiment_count).forEach(([key, value]) => {
      if (key === "N/A" || key === "Tesla" || key === "bonds") {
        return; // Skip this iteration
      }

      const stock_data: graph_data[] = [
        {
          stock: key,
          positive: value[0],
          positiveColor: "hsl(288, 70%, 50%)",
          negative: value[1],
          negativeColor: "hsl(2, 70%, 50%))",
          mixed: value[2],
          mixedColor: "hsl(323, 70%, 50%)",
        },
      ];

      final_data.push(stock_data[0]);
    });

    final_data.sort((a: graph_data, b: graph_data) => {
      // Calculate the sum of positive, negative, and mixed values for each object
      const sumA = a.positive + a.negative + a.mixed;
      const sumB = b.positive + b.negative + b.mixed;

      // Sort in decreasing order based on the sum
      return sumB - sumA;
    });

    return final_data.slice(0, entries);
  };

  function groupDataBySegments(data: any[], days: number) {
    const segments: { [key: string]: any[] } = {};

    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();

    const segmentDuration = 24 * 60 * 60 * 1000;

    data.forEach(([sentiment, timestamp]) => {
      const timestampNum = parseInt(timestamp);

      const daysAgo = Math.floor(
        (currentTimestamp - timestampNum) / (segmentDuration * days)
      );
      const segmentStart = currentTimestamp - daysAgo * segmentDuration * days;
      const segmentKey = new Date(segmentStart).toISOString().slice(0, 10);

      if (!segments[segmentKey]) {
        segments[segmentKey] = [0, 0, 0];
      }

      if (sentiment == "positive") {
        segments[segmentKey][0] = segments[segmentKey][0] + 1;
      } else if (sentiment == "negative") {
        segments[segmentKey][1] = segments[segmentKey][1] + 1;
      } else {
        segments[segmentKey][2] = segments[segmentKey][2] + 1;
      }

      // Add data point to the segment
      //segments[segmentKey].push([sentiment, timestamp]);
    });
    return segments;
  }

  const visualizationTimeline = (
    stock: string,
    data: Array<Array<string>>,
    days: number
  ) => {
    const stock_date_sentiment: { [key: string]: Array<Array<string>> } = {};
    const printHolder: { [key: string]: { [date: string]: Array<number> } } =
      {};
    const final_data: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const stock = data[i][0];
      const sentiment = data[i][1];
      const dateObject: Date = new Date(data[i][2]);
      const unixTimestamp: number = dateObject.getTime();

      if (!stock_date_sentiment[stock]) {
        stock_date_sentiment[stock] = [];
      }
      stock_date_sentiment[stock].push([sentiment, unixTimestamp.toString()]);
    }

    Object.entries(stock_date_sentiment).forEach(([stock, data]) => {
      printHolder[stock] = groupDataBySegments(data, days);
    });

    Object.entries(printHolder[stock]).forEach(([date, sentiments]) => {
      const stock_data: timeline_data[] = [
        {
          day: date,
          positive: sentiments[0],
          positiveColor: "hsl(288, 70%, 50%)",
          negative: sentiments[1],
          negativeColor: "hsl(2, 70%, 50%))",
          mixed: sentiments[2],
          mixedColor: "hsl(323, 70%, 50%)",
        },
      ];

      final_data.push(stock_data[0]);
    });

    return final_data;
  };

  const fetchData = (count: number, entries: number) => {
    fetch(
      `https://wsb-analytics-server.ue.r.appspot.com/api/stock-sentiments/?count=${count}`
    ) // Use backticks for template literals
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const stocks_arr = new Set<string>();
        setData(visualization(data.stock_sentiments, entries));
        for (let i = 0; i < data.stock_sentiments.length; i++) {
          if (
            data.stock_sentiments[i][0].length > 5 ||
            data.stock_sentiments[i][0] === "N/A" ||
            data.stock_sentiments[i][0] === "Tesla" ||
            data.stock_sentiments[i][0] === "bonds"
          ) {
            continue;
          } else {
            stocks_arr.add(data.stock_sentiments[i][0]);
          }
        }
        setAllStocks(Array.from(stocks_arr).sort());
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });
  };

  const fetchDataRange = (stock: string, range: string, days: number) => {
    fetch(
      `https://wsb-analytics-server.ue.r.appspot.com/api/stock-sentiments/range/?starting_date=${range}`
    ) // Use backticks for template literals
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRangeData(visualizationTimeline(stock, data.stock_sentiments, days));
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });
  };

  const theme = {
    labels: { text: { fontSize: 15, fill: "black" } },
    axis: {
      ticks: {
        text: { fontSize: 13, fill: "white" },
        line: { strokeWidth: 0 },
      },
      legend: { text: { fontSize: 15, fill: "white" } },
      domain: { line: { strokeWidth: 2, stroke: "white" } },
    },
    legends: {
      text: { fontSize: 15, fill: "white" },
    },
    grid: {
      line: { strokeWidth: 0 },
    },
  };

  const MyResponsiveBar: React.FC<MyResponsiveBarProps> = ({ data }) => (
    <ResponsiveBar
      data={data}
      keys={["positive", "negative", "mixed"]}
      indexBy="stock"
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#22ff00", "#ff0000", "#ffcc00"]}
      colorBy="id"
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisLeft={null}
      layout="vertical"
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        truncateTickAt: 5,
        format: (value) => `${value}`, // format x-axis tick labels
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      borderWidth={1}
      theme={theme}
      role="application"
      tooltip={(data) => {
        return (
          <div className="flex flex-row bg-white p-1 px-2 rounded-md text-black">
            <p>
              <span className="font-bold italic">{data.indexValue}</span>: +
              {data.formattedValue} {data.id}
            </p>
          </div>
        );
      }}
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
    />
  );

  const MyResponsiveBarMobile: React.FC<MyResponsiveBarProps> = ({ data }) => (
    <ResponsiveBar
      data={data}
      keys={["positive", "negative", "mixed"]}
      indexBy="stock"
      margin={{ top: 50, right: 40, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#22ff00", "#ff0000", "#ffcc00"]}
      colorBy="id"
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      layout="horizontal"
      labelSkipWidth={12}
      labelSkipHeight={12}
      borderWidth={1}
      theme={theme}
      role="application"
      tooltip={(data) => {
        return (
          <div className="flex flex-row bg-white p-1 px-2 rounded-md text-black">
            <p>
              <span className="font-bold italic">{data.indexValue}</span>: +
              {data.formattedValue} {data.id}
            </p>
          </div>
        );
      }}
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
    />
  );

  const MyResponsiveTimelineBar: React.FC<MyResponsiveTimelineBarProps> = ({
    data,
  }) => (
    <ResponsiveBar
      data={data}
      keys={["positive", "negative", "mixed"]}
      indexBy="day"
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#22ff00", "#ff0000", "#ffcc00"]}
      colorBy="id"
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{ tickValues: 9 }}
      layout="vertical"
      labelSkipWidth={12}
      labelSkipHeight={12}
      borderWidth={1}
      theme={theme}
      role="application"
      tooltip={(data) => {
        return (
          <div className="flex flex-row bg-white p-1 px-2 rounded-md text-black">
            <p>
              <span className="font-bold italic">{data.indexValue}</span>: +
              {data.formattedValue} {data.id}
            </p>
          </div>
        );
      }}
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
    />
  );

  const MyResponsiveTimelineBarMobile: React.FC<
    MyResponsiveTimelineBarProps
  > = ({ data }) => (
    <ResponsiveBar
      data={data}
      keys={["positive", "negative", "mixed"]}
      indexBy="day"
      margin={{ top: 50, right: 40, bottom: 50, left: 85 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#22ff00", "#ff0000", "#ffcc00"]}
      colorBy="id"
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{ tickValues: 8 }}
      layout="horizontal"
      labelSkipWidth={12}
      labelSkipHeight={12}
      borderWidth={1}
      theme={theme}
      role="application"
      tooltip={(data) => {
        return (
          <div className="flex flex-row bg-white p-1 px-2 rounded-md text-black">
            <p>
              <span className="font-bold italic">{data.indexValue}</span>: +
              {data.formattedValue} {data.id}
            </p>
          </div>
        );
      }}
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
    />
  );

  const container = useRef<HTMLDivElement>(null);

  let runScript = true;

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
                {
                    "symbols": [
                        [
                            "Apple",
                            "AAPL|1D"
                        ],
                        [
                            "Google",
                            "GOOGL|1D"
                        ],
                        [
                            "Microsoft",
                            "MSFT|1D"
                        ],
                        [
                            "NASDAQ:NVDA|1D"
                        ],
                        [
                            "NYSE:TSM|1D"
                        ],
                        [
                            "AMEX:SPY|1D"
                        ],
                        [
                            "NASDAQ:TSLA|1D"
                        ],
                        [
                            "NASDAQ:AMD|1D"
                        ],
                        [
                            "BCBA:TSMC|1D"
                        ],
                        [
                            "NASDAQ:INTC|1D"
                        ],
                        [
                            "NYSE:VRT|1D"
                        ]
                    ],
                    "chartOnly": false,
                    "width": 100%,
                    "height": 100%,
                    "locale": "en",
                    "colorTheme": "dark",
                    "autosize": false,
                    "showVolume": false,
                    "showMA": false,
                    "hideDateRanges": false,
                    "hideMarketStatus": false,
                    "hideSymbolLogo": false,
                    "scalePosition": "right",
                    "scaleMode": "Normal",
                    "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
                    "fontSize": "10",
                    "noTimeScale": false,
                    "valuesTracking": "1",
                    "changeMode": "price-and-percent",
                    "chartType": "area",
                    "maLineColor": "#2962FF",
                    "maLineWidth": 1,
                    "maLength": 9,
                    "backgroundColor": "rgba(19, 23, 34, 0)",
                    "lineWidth": 2,
                    "lineType": 0,
                    "dateRanges": [
                        "1w|15",
                    ],
                    "dateFormat": "yyyy-MM-dd"
                }`;

    if (runScript) {
      fetchData(1000, 10);
      // Append the script to the DOM element
      container.current?.appendChild(script);
    }

    // Cleanup function
    return () => {
      runScript = false;
    };
  }, []);

  const getPreviousWeekStartDate = (): string => {
    const currentDate = new Date();
    const previousWeekStartDate = new Date(currentDate);
    previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
    return previousWeekStartDate.toISOString().slice(0, 10);
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
              fetchData(10000, 10);
            }}
          >
            Top 10 Stocks
          </button>
          <button
            className="text-white bg-white/10 hover:ring-2 hover:ring-amber-300 focus:ring-2 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 text-center inline-flex items-center"
            onClick={() => {
              fetchData(10000, 15);
            }}
          >
            Top 15 Stocks
          </button>
          <button
            className="text-white bg-white/10 hover:ring-2 hover:ring-amber-300 focus:ring-2 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 text-center inline-flex items-center"
            onClick={() => {
              fetchData(10000, 20);
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
              fetchDataRange(e.target.value,getPreviousWeekStartDate(), 1);
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
      <BottomHeader />
    </div>
  );
}

export default AnalyticsPage;
