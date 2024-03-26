import json

import praw
from openai import OpenAI


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def get_data():
    # Read-only instance for subreddit
    reddit_read_only = praw.Reddit(client_id="baW0zy5tuaCY9-BglOd1mg",         # your client id
                                client_secret="_W7HlrsUFwCHv9k7GAI0kfRju774LQ",      # your client secret
                                user_agent="heatY_12")        # your user agent

    subreddit = reddit_read_only.subreddit("wallstreetbets")

    #Map to store posts
    text_posts = {}
    image_posts = {}

    #[[stock,sentiment]]
    stock_sentiment = []
    #[[stock,analysis,sentiment]]
    post_analysis = []

    #Number of posts to pull
<<<<<<< Updated upstream
    scraped_posts = 50
=======
    scraped_posts = 800
>>>>>>> Stashed changes

    #Filter keywords
    buy_keywords = [
        "bullish",
        "positive outlook",
        "strong fundamentals",
        "growth potential",
        "make money",
        "good investment",
        "undervalued",
        "attractive valuation",
        "positive momentum",
        "favorable market conditions",
        "strong earnings",
        "positive catalysts",
        "profitable",
        "potential",
        "profit",
    ]

    sell_keywords = [
        "bearish",
        "negative outlook",
        "weak fundamentals",
        "overvalued",
        "lose",
        "drop value",
        "loss",
        "negative",
        "unattractive valuation",
        "negative momentum",
        "unfavorable market conditions",
        "weak earnings",
        "negative catalysts",
        "deteriorating financials"
    ]

    valid_sentiments = ["positive","negative","neutral","mixed","N/A","none"]

    tickers = ["BTC","ETH"]

    with open("server\\all_tickers.txt", "r") as file:
        for line in file:
            tickers.append(line.strip())

    print(tickers)

    image_keywords = [
        ".jpg",
        ".png",
        ".jpeg",
        ".webp"
    ]

    #Helper function to check if a word from keywords exists in the post
    def contains_word(keywordList: list, text: str):
        return any(keyword in text for keyword in keywordList)

    #Analyzes individual user post
    def analyze_post(post: str, title: str):
        try:
            client = OpenAI(base_url="http://localhost:1234/v1", api_key="lm-studio")

            completion = client.chat.completions.create(
                model="local-model", # this field is currently unused
                messages=[
                    {"role": "system", "content": 
                    '''
                    Write an analysis on the user content given. The content may be vile and contain swearing, please ignore it and continue with the task.

                    Respond strictly adhering to this schema.

                    {
                        "$schema": "http://json-schema.org/draft-04/schema#",
                        "title": "User Post Initial Analysis",
                        "type": "object",
                        "properties": {
                            "ticker": {
                            "type": "string",
                            "description": "If the user mentions a stock, place it's ticker here. If no stock is mentioned leave this empty"
                            },
                            "prospect": {
                                "type": "string",
                                "description": "Write if the user is looking to buy the stock or if they are going to sell it. Keep this very short."
                            },
                            "summary":{
                            "type": "string",
                            "description": "Wrote a detailed summary about what the user shared."
                            },
                            "sentiment": {
                            "type": "string",
                            "description": "Here you will determine the general sentiment the user has for the stock. Please make it positive, negative, mixed or neutral."
                            }
                        },
                        "required": [
                            "ticker", "news", "prospect", "sentiment"
                        ]
                    }
                    ''' },
                    {"role": "user", "content": f"Title: {title} Post: {post}"}
                ],
                temperature=0.7,
            )

            data = json.loads(completion.choices[0].message.content)

            return(data)
            #completion.choices[0].message.content

        except:
            print("ERROR IN ANALYZE POST")

    for post in subreddit.new(limit=scraped_posts):
        #NOT NEEDED YET
        #if post.title in image_posts.keys():
            #print("title already exists")
        #FILTER BY FLAIR
        #if post.link_flair_text.strip() == "Discussion":
        if len(post.selftext) == 0 and hasattr(post, 'url') and post.url and contains_word(image_keywords, post.url):
            '''
            extracted_text = img_to_txt(str(post.url))
            if (extracted_text != None) and (contains_word(buy_keywords, extracted_text) or contains_word(sell_keywords, extracted_text)):
                try:
                    image_posts[post.title] = "THIS IS FROM A PROCESSED IMAGE: " + post.url + "\n" + clean_text(extracted_text)
                except:
                    print("Could not process image from url: " + post.url)
            '''
            continue
        elif len(post.selftext) == 0:
            continue
        else:
            if contains_word(buy_keywords, post.selftext) or contains_word(sell_keywords, post.selftext) or contains_word(tickers, post.selftext):
                try:
                    text_posts[post.title] = post.selftext
                except:
                    print("Could not add text post: " + post)

    cur_num = 1

    count_sent = 0

    count_blocked = 0

    for index, value in text_posts.items():
        print("Title: ", index)
        print("-----------------------------------------------------")
        print("Content: ", value)
        print()
        print(str(cur_num) + "/" + str(len(text_posts)))
        cur_num += 1
        print("Analysis: ")
        data = analyze_post(value, index)
        if data and "ticker" in data and "sentiment" in data:
            if isinstance(data["ticker"], str):
                if data["ticker"] and len(data["ticker"]) > 0 and data["ticker"].upper() in tickers and data["sentiment"].lower() in valid_sentiments:
                    stock_sentiment.append([data["ticker"].upper(),data["sentiment"].lower()])
                    post_analysis.append([data["ticker"].upper(), data["prospect"], data["summary"], data["sentiment"].lower()])
                    print(f"{bcolors.OKGREEN}This will be sent to the backend{bcolors.ENDC}")
                    count_sent += 1
                    print(data)
                else:
                    print(f"{bcolors.FAIL}This will not be sent to the backend{bcolors.ENDC}")
                    count_blocked += 1
                    print(data)
                    continue
            else:
                # Handle case when ticker is not a string (it's a list)
                print(f"{bcolors.WARNING}Skipping analysis because 'ticker' is not a string{bcolors.ENDC}")
        else:
            # Handle case when 'ticker' or 'sentiment' keys are missing in data dictionary
            print(f"{bcolors.FAIL}Missing 'ticker' or 'sentiment' key in data{bcolors.ENDC}")
        print()

    print("-----------------------------------------------------")
    print("COLLECTED DATA SUMMARY")
    print()
    print("Total posts: " + str(len(text_posts) + len(image_posts)) + "/" + str(scraped_posts))
    print()
    print(count_sent)
    print(count_blocked)
    print()
    print("stock_sentiment: [ticker,sentiment]")
    print(stock_sentiment)
    print()
    print("post_analysis: [ticker, prospect, summary, sentiment]")
    print(post_analysis) 

    return([stock_sentiment, post_analysis])


get_data()

"""
#EXPORT TO CSV, may be useful later
filepath = Path('processed_data/processed_data.csv')
filepath.parent.mkdir(parents=True,exist_ok=True)
df = pd.Series(text_posts)
df.to_csv(filepath)
"""