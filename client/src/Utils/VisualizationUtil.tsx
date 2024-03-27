type graph_data = {
    stock: string;
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
  const entries = e.data.entries; // Extracting data and entries from the message;
  console.log(entries);
  console.log(data);
  try {
    const result = visualization(data, entries);
    self.postMessage(result);
  } catch (error) {
    console.error("Error in visualization:", error);
  }
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

export default visualization;