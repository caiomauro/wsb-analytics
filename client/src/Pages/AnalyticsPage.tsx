import { ResponsiveBar } from '@nivo/bar';
import 'flowbite';
import { useState } from 'react';
import BottomHeader from "../Components/BottomHeader";
import Navbar from "../Components/Navbar";

function AnalyticsPage(){

    const [data, setData] = useState([]);

    type graph_data = {
        stock: string;
        positive: number;
        positiveColor: string;
        negative: number;
        negativeColor: string;
        mixed: number;
        mixedColor: string;
    }

    interface MyResponsiveBarProps {
        data: graph_data[];
    }

    const visualization = (data: Array<Array<string>>) => {
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
        console.log(final_data)
        return(final_data);
    }

    const fetchData = (count: number) => {
        fetch(`http://127.0.0.1:8000/api/stock-sentiments/?count=${count}`)  // Use backticks for template literals
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setData(visualization(data.stock_sentiments));
            })
            .catch(error => {
                console.error('There was a problem fetching the data:', error);
            });
    };

    const theme = {
        labels: { text: { fontSize: 15, fill: "white" } },
        axis: {
          ticks: { text: { fontSize: 15, fill: "white" } },
          legend: { text: { fontSize: 15, fill: "white"} }
        },
        legends: {
            text: { fontSize: 15, fill: "white" },
        }
      };

    const MyResponsiveBar: React.FC<MyResponsiveBarProps> = ({ data }) => (
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
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Tickers',
                legendPosition: 'middle',
                legendOffset: 45,
                format: value => `${value}` // format x-axis tick labels
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85
                }
            ]}
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

    return(
        <div className="flex flex-col w-full h-screen custom-background-img-mobile sm:custom-background-img-desktop">
            <Navbar />
                <div id="analytics-container" className="flex flex-col h-screen w-full">
                    <p>Test</p>
                    
                    <button className="text-white w-40 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => {fetchData(30)}}>Dropdown button</button>
                    <div>
                        <p>{data.toString()}</p>
                    </div>
                    <div id="count-container" className="flex flex-col h-screen w-[200%] overflow-x-auto sm:h-4/5 sm:w-3/4 sm:mx-auto">
                        {data.length > 0 && <MyResponsiveBar data={data} />}
                    </div>
                </div>
            <BottomHeader />
        </div>
    )
}

export default AnalyticsPage