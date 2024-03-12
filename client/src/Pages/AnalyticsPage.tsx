import { ResponsiveBar } from '@nivo/bar';
import 'flowbite';
import { useEffect, useRef, useState } from 'react';
import BottomHeader from "../Components/BottomHeader";
import Navbar from "../Components/Navbar";

function AnalyticsPage(){

    const [data, setData] = useState([]);
    const [rangeData, setRangeData] = useState({});
    const [isTooLarge, setIsTooLarge] = useState(false);

    useEffect(() => {
        function handleResize(){
            setIsTooLarge(window.innerWidth > 1337);
        }
        
        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    type graph_data = {
        stock: string;
        positive: number;
        positiveColor: string;
        negative: number;
        negativeColor: string;
        mixed: number;
        mixedColor: string;
    }

    type timeline_data = {
        week: number;
        stock: string;
        positive: number;
        negative: number;
        mixed: number
        created_at: string;
    }
    interface MyResponsiveBarProps {
        data: graph_data[];
    }

    const visualization = (data: Array<Array<string>>, entries: number) => {
        const stock: {[key:string]:Array<string>} = {}
        const stock_sentiment_count: {[key:string]: Array<number>} ={}
        const final_data: any = []

        for (let i=0; i < data.length; i++){
            const key = data[i][0];
            const value = data[i][1];
            
            if (!stock[key]) {
                stock[key] = []; // Create an empty array if the key doesn't exist
            }
            stock[key].push(value);
        }

        Object.entries(stock).forEach(([key, value]) => {
            stock_sentiment_count[key] = [0,0,0]
            for (let i=0; i < value.length; i++) {
                if (value[i] == 'positive')
                {
                    stock_sentiment_count[key][0] = stock_sentiment_count[key][0] + 1
                }
                else if (value[i] == 'negative')
                {
                    stock_sentiment_count[key][1] = stock_sentiment_count[key][1] + 1
                }
                else 
                {
                    stock_sentiment_count[key][2] = stock_sentiment_count[key][2] + 1
                }
            }
        });

        console.log(stock)
        console.log(stock_sentiment_count)

        Object.entries(stock_sentiment_count).forEach(([key, value]) => {

            const stock_data: graph_data[] = [
                {
                    stock: key,
                    positive: value[0],
                    positiveColor: "hsl(288, 70%, 50%)",
                    negative: value[1],
                    negativeColor: "hsl(2, 70%, 50%))",
                    mixed: value[2],
                    mixedColor: "hsl(323, 70%, 50%)",
                }
            ];
            

            final_data.push(stock_data[0])
        });

        final_data.sort((a: graph_data, b: graph_data) => {
            // Calculate the sum of positive, negative, and mixed values for each object
            const sumA = a.positive + a.negative + a.mixed;
            const sumB = b.positive + b.negative + b.mixed;
        
            // Sort in decreasing order based on the sum
            return sumB - sumA;
        });

        console.log(final_data)
        return(final_data.slice(0,entries));
    }

    const visualizationTimeline = (data: Array<Array<string>>) => {
        const stock: Array<timeline_data> = []
        console.log("This is the data", data)


        for (let i=0; i < data.length; i++){

            const sample: timeline_data[] = [
                week: 1,
                stock: string;
                positive: number;
                negative: number;
                mixed: number
                created_at: string;
            ]
            
        }


        console.log(stock);
        return(stock);
        };

    const fetchData = (count: number, entries: number) => {
        fetch(`http://127.0.0.1:8000/api/stock-sentiments/?count=${count}`)  // Use backticks for template literals
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setData(visualization(data.stock_sentiments, entries));
            })
            .catch(error => {
                console.error('There was a problem fetching the data:', error);
            });
    };

    const fetchDataRange = (range: string) => {
        fetch(`http://127.0.0.1:8000/api/stock-sentiments/range/?starting_date=${range}`)  // Use backticks for template literals
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setRangeData(visualizationTimeline(data.stock_sentiments));
                console.log(rangeData);
            })
            .catch(error => {
                console.error('There was a problem fetching the data:', error);
            });
    }

    const theme = {
        labels: { text: { fontSize: 15, fill: "white" } },
        axis: {
          ticks: { text: { fontSize: 13, fill: "white" }, line: { strokeWidth: 0} },
          legend: { text: { fontSize: 15, fill: "white"} }
        },
        legends: {
            text: { fontSize: 15, fill: "white" },
        },
        grid: {
            line: { strokeWidth: 0}
        }
      };

    const MyResponsiveBar: React.FC<MyResponsiveBarProps> = ({ data }) => (
        <ResponsiveBar
            data={data}
            keys={['positive', 'negative', 'mixed']}
            indexBy="stock"
            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={['#6AFF73', '#FF6A6A','#FFBB6A']}
            colorBy="id"
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            layout='vertical'
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                truncateTickAt: 5,
                format: value => `${value}` // format x-axis tick labels
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            borderWidth={1}
            theme={theme}
            role="application"
            tooltip={data => {
                return(
                    <div className="flex flex-row bg-white p-1 px-2 rounded-md text-black">
                        <p><span className="font-bold italic">{data.indexValue}</span>: +{data.formattedValue}  {data.id}</p>
                    </div>
                )
              }}
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
        />
    );

    const MyResponsiveBarMobile: React.FC<MyResponsiveBarProps> = ({ data }) => (
        <ResponsiveBar
            data={data}
            keys={['positive', 'negative', 'mixed']}
            indexBy="stock"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={['#6AFF73', '#FF6A6A','#FFBB6A']}
            colorBy="id"
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{tickValues: 9}}
            layout='horizontal'
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            borderWidth={1}
            theme={theme}
            role="application"
            tooltip={data => {
                return(
                    <div className="flex flex-row bg-white p-1 px-2 rounded-md text-black">
                        <p><span className="font-bold italic">{data.indexValue}</span>: +{data.formattedValue}  {data.id}</p>
                    </div>
                )
              }}
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
        />
    );


        const container = useRef<HTMLDivElement>(null);
        let runScript = true;
      
        useEffect(() => {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
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
                    "width": 800,
                    "height": 400,
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
                        "1d|1",
                        "1m|30",
                        "3m|60",
                        "12m|1D",
                        "60m|1W",
                        "all|1M"
                    ],
                    "dateFormat": "yyyy-MM-dd"
                }`;
        
            if (runScript) {
                fetchData(1000,10)
                // Append the script to the DOM element
                container.current?.appendChild(script);
            }
        
            // Cleanup function
            return () => {
                runScript = false;
            };
        }, []);
        

    return(
        <div className="flex flex-col w-full h-full custom-background-img-mobile sm:custom-background-img-desktop">
            <Navbar />
                <div id="analytics-container" className="flex flex-col h-max w-full items-center overflow-y-auto gap-2">
                    <button className="bg-blue-500 text-white p-2" onClick={()=>{fetchDataRange("2024-03-01");}}>Range test</button>
                    <div id="count-button-container" className="flex flex-row w-full sm:w-2/4 justify-around item-center pt-2">
                        <button className="text-white bg-white/10 hover:ring-2 hover:ring-amber-300 focus:ring-2 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" onClick={() => {fetchData(1000,10)}}>Top 10 Stocks</button>
                        <button className="text-white bg-white/10 hover:ring-2 hover:ring-amber-300 focus:ring-2 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" onClick={() => {fetchData(1000,15)}}>Top 15 Stocks</button>
                        <button className="text-white bg-white/10 hover:ring-2 hover:ring-amber-300 focus:ring-2 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" onClick={() => {fetchData(1000,20)}}>Top 20 Stocks</button>
                    </div>
                    <div id="count-container" className="flex flex-col h-128 w-full sm:h-128 sm:w-4/6 sm:mx-auto">
                        {isTooLarge ? (
                            data.length > 0 && <MyResponsiveBar data={data} />
                        ) : (
                            data.length > 0 && <MyResponsiveBarMobile data={data} />
                        )}
                    </div>
                    <div className="flex flex-col h-screen w-max sm:h-max sm:w-4/6 sm:mx-auto items-center">
                        <div className="tradingview-widget-container" ref={container}>
                            <div className="tradingview-widget-container__widget"></div>
                            <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
                        </div>
                    </div>
                </div>
            <BottomHeader />
        </div>
    )
}

export default AnalyticsPage