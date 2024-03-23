
const fetchData = (count: number, entries: number): Promise<{ sortedStocks: string[], stockSentiments: any[], entries: number }> => {
    return new Promise((resolve, reject) => {
        fetch(`http://127.0.0.1:8000/api/sentiment-pairs/?count=${count}`)
        .then((response) => {
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            const stocks_arr = new Set<string>();
            //setData(visualization(data.stock_sentiments, entries));
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
            //setAllStocks(Array.from(stocks_arr).sort());
            const sortedStocks = Array.from(stocks_arr).sort();
            resolve({ sortedStocks, stockSentiments: data.stock_sentiments, entries });
        })
        .catch((error) => {
            reject(error);
        });
    });
};

const fetchDataRange = (stock: string, range: string, days: number): Promise<{ stockSentiments: any[], days: number, stock: string }> => {
    return new Promise((resolve, reject) => {
        fetch(
        `http://127.0.0.1:8000/api/sentiment-pairs/range/?starting_date=${range}`
        )
        .then((response) => {
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            //setRangeData(visualizationTimeline(stock, data.stock_sentiments, days));
            resolve({ stockSentiments: data.stock_sentiments, days, stock });
        })
        .catch((error) => {
            reject(error);
        });
    });
};

const fetchAllStockMentions = (): Promise<{}> => {
    return new Promise((resolve, reject) => {
        fetch(
        `http://127.0.0.1:8000/api/stock-mentions/`
        )
        .then((response) => {
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            //setRangeData(visualizationTimeline(stock, data.stock_sentiments, days));
            resolve({ allStockMentions: data.stock_mentions });
        })
        .catch((error) => {
            reject(error);
        });
    });
};

const fetchLimitStockMentions = ( limit: number ): Promise<{ limitStockMentions: any[] }> => {
    return new Promise((resolve, reject) => {
        fetch(
        `http://127.0.0.1:8000/api/stock-mentions/limit/?limit=${limit}`
        )
        .then((response) => {
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            //setRangeData(visualizationTimeline(stock, data.stock_sentiments, days));
            resolve({ limitStockMentions: data.stock_mentions });
        })
        .catch((error) => {
            reject(error);
        });
    });
};

const fetchStocksMention = ( stock: string ): Promise<{ stocksMention: any[] }> => {
    return new Promise((resolve, reject) => {
        fetch(
        `http://127.0.0.1:8000/api/stock-mentions/stock/?stock=${stock}`
        )
        .then((response) => {
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            //setRangeData(visualizationTimeline(stock, data.stock_sentiments, days));
            resolve({ stocksMention: data.stock_stat });
        })
        .catch((error) => {
            reject(error);
        });
    });
};
  

export { fetchAllStockMentions, fetchData, fetchDataRange, fetchLimitStockMentions, fetchStocksMention };
  