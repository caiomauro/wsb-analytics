import groupDataBySegments from "./SegmentDataUtil";

type timeline_data = {
    day: string;
    positive: number;
    positiveColor: string;
    negative: number;
    negativeColor: string;
    mixed: number;
    mixedColor: string;
  };

  /* eslint-disable no-restricted-globals */
self.onmessage = (e) => {
  const data = e.data.data;
  const stock = e.data.stock; // Extracting data and entries from the message;
  const days = e.data.days;
  console.log(days)
  console.log(stock)
  console.log(data)
  try {
    const result = visualizationTimeline(stock, data, days, );
    self.postMessage(result);
    console.log(result)
  } catch (error) {
    console.error("Error in visualization:", error);
  }
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

export default visualizationTimeline;