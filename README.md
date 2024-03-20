# WSBanalytics
 
WSB analytics displays visualizes sentiment analysis data gathered by a fine-tuned OpenHermes-2.5-Mistral-7b model. First the model was trained to take user text posts and return a synopsis on the cleaned text. This analysis included things like the stock mentioned, money gained/lost, new/reasoning for results, and finally general sentiment. Then the model was trained to take that analysis and return a string that could be perfectly parsed into useable data. The Django backend, hosted on Google Cloud App Engine, runs an automated script every hour to process the last 20 posts. The React TSX front visualizes that data, displaying a Top Stocks graph and a timeline view of that stocks sentiment of the past 7 days. While still rough around the edges the project is live and collecting data. 

To Do:
- Better filtering to clear backend of "N/A" data and Tesla (instead of TSLA) data.
