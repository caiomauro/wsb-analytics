To optimize your code by breaking it into different files and reducing backend requests, you can follow these steps:

1. **Component Separation**:
   - Separate the `MyResponsiveBar`, `MyResponsiveBarMobile`, `MyResponsiveTimelineBar`, and `MyResponsiveTimelineBarMobile` components into their own files under a `Components` directory.
   - Create separate files for each of these components, such as `ResponsiveBar.tsx` and `ResponsiveTimelineBar.tsx`, and export the components from there.

2. **Service File**:
   - Create a service file, let's call it `apiService.ts`, to handle API requests.
   - Move the `fetchData` and `fetchDataRange` functions to this service file.
   - These functions can then be imported and used in your `AnalyticsPage` component.

3. **Util Functions**:
   - Create a `utils` directory and move the `visualization` and `groupDataBySegments` functions to a file named `dataProcessing.ts`.
   - Export these functions from the file so they can be imported where needed.

4. **Constants**:
   - If there are any constants or configurations used across multiple files, such as `theme`, consider creating a `constants.ts` file and exporting them from there.

5. **Refactoring useEffect**:
   - Consider moving the `useEffect` hook responsible for fetching initial data to the service file or creating a custom hook to manage this logic separately.

6. **Directory Structure**:
   - After separating components, services, and utilities, your directory structure might look like this:
     ```
     src/
     ├── Components/
     │   ├── ResponsiveBar.tsx
     │   ├── ResponsiveTimelineBar.tsx
     │   └── ...
     ├── Services/
     │   └── apiService.ts
     ├── Utils/
     │   └── dataProcessing.ts
     ├── Constants/
     │   └── constants.ts
     ├── Pages/
     │   └── AnalyticsPage.tsx
     └── ...
     ```

7. **Reduce Backend Requests**:
   - Instead of fetching data for each stock separately, consider fetching data for all stocks at once and then processing it locally to extract the required information. This can reduce the number of backend requests.
   - Cache data where appropriate to avoid redundant requests.

By following these steps, you can organize your codebase better, reduce redundancy, and improve maintainability while also optimizing backend requests for better performance.


fetchData(10, 20)
  .then(({ sortedStocks, stockSentiments, entries }) => {
    // Use the returned data here
    console.log(sortedStocks);
    console.log(stockSentiments);
    console.log(entries);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

  const fetchData = (count: number, entries: number) => {
    fetch(
      `http://127.0.0.1:8000/api/stock-sentiments/?count=${count}`
    ) // Use backticks for template literals
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response)
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
      fetchData(1000, 10)
      .then(({ sortedStocks, stockSentiments, entries }) => {
        // Use the returned data here
        setAllStocks(sortedStocks);
        setData(visualization(stockSentiments, entries));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });;
      // Append the script to the DOM element
      container.current?.appendChild(script);
    }

    // Cleanup function
    return () => {
      runScript = false;
    };
  }, []);


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