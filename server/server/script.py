import re
import urllib
from pathlib import Path
import matplotlib.pyplot as plt
import time

import nltk
import numpy as np
import pandas as pd
import praw
import pytesseract

from openai import OpenAI

from threading import Thread
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
from PIL import Image
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

def get_data():
    nltk.download('all')
    # Read-only instance for subreddit
    reddit_read_only = praw.Reddit(client_id="baW0zy5tuaCY9-BglOd1mg",         # your client id
                                client_secret="_W7HlrsUFwCHv9k7GAI0kfRju774LQ",      # your client secret
                                user_agent="heatY_12")        # your user agent

    subreddit = reddit_read_only.subreddit("wallstreetbets")

    #initialize sentiment analysis tool from NLTK
    #sia = SentimentIntensityAnalyzer()

    #Map to store posts
    text_posts = {}
    image_posts = {}

    #List of post analysis
    post_analysis = []

    #Stock + Sentiment:
    stock_sentiments = []

    #Number of posts to pull
    scraped_posts = 10


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
        "positive catalysts"
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

    tickers = ["AAPL", "MSFT", "GOOG", "AMZN", "FB", "TSLA", 
                "JD.A", "BABA", "SBUX", "V",
                "JNJ", "PM", "WMT", "MA", "BA", "AVGO", "CVX", "KO", "EMN", "PYPL", "COST",
                "UNH", "INTC", "CTAS", "MMM", "ADP", "ADSK", "PEP", "HD", "NOW", "CRBP",
                "NTDOY", "GRMN", "CAT", "SQ", "JNPR", "COG", "NFLX", "CSCO", "A", "LOW",
                "AMT", "HAS", "VZ", "MCD", "WBA", "ORCL", "GS", "MAS", "SBUX", "PFE", "UNP",
                "DG", "K", "CATC", "BIIB", "NDAQ", "TMO", "WWE", "AET", "HSY", "VNO", "MKC",
                "JCI", "WFRD", "WPCS", "UHS", "PGR", "ABBV", "CME", "SONO", "WNS", "FOSL",
                "LRCX", "ATVI", "TROW", "CTSH", "VFC", "NLSN", "BKNG", "GILD", "FIS", "COG.A",
                "IMAX", "DGX", "SPGI", "PPL", "JKS", "AAPL.B"]

    image_keywords = [
        ".jpg",
        ".png",
        ".jpeg",
        ".webp"
    ]

    #Helper function to preprocess the text
    def preprocess_text(text):
        try:
            text = text.lower()
            text = re.sub(r'^\d+','',text)
            text = re.sub(r'[^\w\s]','',text)
            tokens = nltk.word_tokenize(text)
            return tokens
        except:
            print("Error preprocessing text")

    #Helper function to remove stopwords
    def remove_stopwords(tokens):
        try:
            stop_words = set(stopwords.words('english'))
            filtered_tokens = [word for word in tokens if word not in stop_words]
            return filtered_tokens
        except: 
            print("Error removing stopwords")

    #Helper function to lemmatize words
    def lemmatize_words(tokens):
        try:
            lemmatizer = nltk.WordNetLemmatizer()
            lemmatized_tokens = [lemmatizer.lemmatize(token) for token in tokens]
            return lemmatized_tokens
        except:
            print("Error lemmatizing words")

    #Helper function to clean text
    def clean_text(text):
        try:
            print("Cleaning text")
            tokens = preprocess_text(text)
            filtered_tokens = remove_stopwords(tokens)
            lemmatize_tokens = lemmatize_words(filtered_tokens)
            clean_text = ' '.join(lemmatize_tokens)
            print("Text cleaned, returning cleaned text")
            return clean_text
        except:
            print("Failure in clean text")

    #Helper function to check if a word from keywords exists in the post
    def contains_word(keywordList: list, text: str):
        return any(keyword in text for keyword in keywordList)

    '''
    #Helper function to process text from an image with the url
    def img_to_txt(url: str):
        try:
            urllib.request.urlretrieve(url, 'image')
            # Open the image file
            image = Image.open('image')
            # Perform OCR using PyTesseract
            text = pytesseract.image_to_string(image, timeout=10)

            if text == None:
                print("No text found in image")
                return
            else:
                return None
        except Exception as e:
            print("Error trying image: " + str(e))
    '''

    #Get the drop on the AI fr
    def analyze_post(post: str, title: str):
        try:
            client = OpenAI(base_url="http://localhost:1234/v1", api_key="not-needed")

            completion = client.chat.completions.create(
                model="local-model", # this field is currently unused
                messages=[
                    {"role": "system", "content": 
                        '''
                        Create a short analyis/report on reddit posts regarding stocks/crypto. Follow these examples:

                        REMEBER YOLO MEANS YOU ONLY LIVE ONCE AND IS NOT A TICKER

                        user_input:
                        I first bought Intel at around 24€/26$ in March of last year and increased my position in intel every 3 months with an average gain of around 55%. However despite the other tech stocks going up, Intels shares are only affected little by the positive market environment, even though they announced their contract with Microsoft and might receive 10 billion in subsidies from the US. Now they are a lot cheaper alternative to AMD for example, so it shouldn't surprise if intel started to catch up soon. What do you think?s

                        output:
                        Stock/Crypto: Intel (INTC)
                        How much profit/loss: Not specified, however bought Intel at around $26 and increased position every 3 months with for an average gain of 55%
                        Expectations for stock/crypto: Expected increase in value as well as to catch up to other tech stocks soon
                        Reasoning for expectations: Intel's contract with Microsoft and the potential subsidies from the US government. They also believe that Intel is a cheaper alternative to AMD.
                        News shared: The user shared news about Intel's contract with Microsoft and the potential subsidies from the US government.
                        General sentiment about stock/crypto: The user seems to have a positive sentiment towards Intel and believes that it will catch up to other tech stocks soon and be very profitable.

                        user_input: 
                        Title: k iova yolo Post: iova absolutely mooning continue moon melanoma treatment call cheap considering upside 30 yesterday another 30 today 7 hour fresh pt double today price offering already happened friday close tomorrow biotech legend wayne rothbaum bought 5000000 share friday oh yeah 20 short probably worse due insider

                        output:
                        Stock/Crypto: Iovance Biotherapeutics (IOVA)
                        How much profit/loss: Not specified, but the user seems to be considering investing heavily in Iovance Biotherapeutics.
                        Expectations for stock/crypto: The user expects Iovance Biotherapeutics to perform well based on its recent price movements and the fact that biotech legend Wayne Rothbaum bought 5,000,000 shares on Friday.
                        Reasoning for expectations: The user's reasoning is based on Iovance Biotherapeutics' recent price movements and the fact that biotech legend Wayne Rothbaum bought 5,000,000 shares on Friday.
                        News shared: The user shared news about Iovance Biotherapeutics' recent price movements and the fact that biotech legend Wayne Rothbaum bought 5,000,000 shares on Friday.
                        General sentiment about stock/crypto: The user seems to have a positive sentiment towards Iovance Biotherapeutics and believes that it will perform well.
                        '''},
                    {"role": "user", "content": f"Title: {title} Post: {post}"}
                ],
                temperature=0.7,
            )

            return(completion.choices[0].message.content)

        except:
            print("ERROR IN ANALYZE POST")

    #Final report
    def analysis_to_array(analysis: str):
        try:
            client = OpenAI(base_url="http://localhost:1234/v1", api_key="not-needed")

            completion = client.chat.completions.create(
                model="local-model", # this field is currently unused
                messages=[
                    {"role": "system", "content": '''
                    Follow these examples perfectly, it is very important that there is no deviation:

                    Here are some rules:

                    If there are multiple stocks follow this:
                    stock A ticker,sentiment;stock B ticker,sentiment;stock C ticker,sentiment

                    If No stocks or cryptos were explicitly mentioned in the input follow this:
                    N/A,N/A

                    if the sentiment is mixed follow this:
                    stock ticker,mixed
                    
                    Only address the stock by its ticker

                    Here are some examples:

                    input:
                    Stock/Crypto: True North Commercial REIT (TNT.UN)
                    How much profit/loss: Not specified, but the user seems to be considering investing heavily in True North Commercial REIT.
                    Expectations for stock/crypto: The user expects True North Commercial REIT to perform well based on various financial metrics, such as occupancy rates, lease renewals, and government credit-related tenants.
                    Reasoning for expectations: The user's reasoning is based on the company's financial metrics, including occupancy rates, lease renewals, and the presence of government credit-related tenants. They also mention the CEO purchasing shares and the company's plan to bring back dividends in June.
                    News shared: The user shared news about the CEO purchasing shares and the company's plan to bring back dividends in June.
                    General sentiment about stock/crypto: The user seems to have a positive sentiment towards True North Commercial REIT and believes that it will perform well in the long term.

                    output:
                    REIT,positive

                    input:
                    Stock/Crypto: NVIDIA (NVDA)
                    How much profit/loss: Not specified, but the user seems to have purchased NVIDIA shares in 2017.
                    Expectations for stock/crypto: The user seems to have a negative sentiment towards NVIDIA and believes that the CEO is using the old NVIDIA investment to pump the stock. They also mention a put play and potential expiration date.
                    Reasoning for expectations: The user's reasoning is based on their belief that the CEO is manipulating the stock and dodging questions about ongoing opportunities. They also mention a misunderstanding in the media and inaccurately hyped NVIDIA's holding.
                    News shared: The user shared news about the CEO's actions and the potential manipulation of the stock.
                    General sentiment about stock/crypto: The user seems to have a negative sentiment towards NVIDIA and believes that the CEO's actions are misleading investors. They also mention the failure of SoundHound, a company associated with the CEO.


                    output:
                    NVDA,negative

                    input:
                    Stock/Crypto: Nvidia (NVDA), Super Micro Computer Inc. (SMCI)
                    How much profit/loss: Not specified, but the user seems to be actively trading options on Nvidia and Super Micro Computer Inc.
                    Expectations for stock/crypto: The user expects Nvidia and Super Micro Computer Inc. to experience upswings and believes that Nvidia will reach $700 in the next 4 weeks.
                    Reasoning for expectations: The user's reasoning is based on the upswings they have observed and their decision to chase the stock.
                    News shared: No specific news shared.
                    General sentiment about stock/crypto: The user seems to have a mixed sentiment, experiencing stress and emotions while trading Nvidia and Super Micro Computer Inc.

                    output:
                    NVDA,mixed;SMCI,mixed

                    input:
                    
                    '''},
                    {"role": "user", "content": f"input: {str(analysis)} output:"}
                ],
                temperature=0.7,
            )
            #Provide a report on the data you are given from the wallstreetbets subreddit. Include every stock mentioned and list the top positive sentiment stocks with explanations, the top negative sentiment stocks with explanations, and if niether put the stock in a nuetral sentiment with explanation:
            return(completion.choices[0].message.content)

        except:
            print("ERROR IN CONVERTING TO PARSABLE STRING")

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
                    text_posts[post.title] = clean_text(post.selftext)
                except:
                    print("Could not add text post: " + post)

    #sentiment = 0.000
    
    cur_num = 1

    for index, value in text_posts.items():
        print("Title: ", index)
        print("-----------------------------------------------------")
        print("Content: ", value)
        #score = sia.polarity_scores(value)
        #print(score)
        #sentiment += score["compound"]
        print()
        print(str(cur_num) + "/" + str(len(text_posts)))
        cur_num += 1
        print("Analysis: ")
        analysis = analyze_post(value, index)
        print(analysis)
        post_analysis.append(str(analysis))
        print()

    '''
    print("-----------------------------------------------------")
    print("LOOPING THROUGH IMAGE POSTS")
    print("-----------------------------------------------------")

    for index, value in image_posts.items():
        print("Title: ", index)
        print("-----------------------------------------------------")
        print("Content: ", value)
        score = sia.polarity_scores(value)
        print(score)
        sentiment += score["compound"]
        print()
    '''
    print("-----------------------------------------------------")
    print("COLLECTED DATA SUMMARY")
    print()
    print("Total posts: " + str(len(text_posts) + len(image_posts)) + "/" + str(scraped_posts))
    print()
    print("Amount of text posts: " + str(len(text_posts)))
    #print()
    #print("Final sentiment score: " + str(sentiment))
    print()

    cur_analysis = 1

    print("Geting parsable data:")
    if len(text_posts) > 0:
        for analysis in post_analysis:
            string = analysis_to_array(analysis)
            print(string + " " + str(cur_analysis) + "/" + str(len(post_analysis)))
            cur_analysis += 1
            if ";" in string:
                arr = string.split(";")
                for pair in arr:
                    stock_sentiments.append(pair.split(","))
            else:
                stock_sentiments.append(string.split(","))
    else:
        print("No text or image posts to analyze")

    for arr in stock_sentiments:
        if len(arr) != 2 or len(arr[0]) > 5 or arr[0] =="N/A":
            stock_sentiments.remove(arr)
            
    print(stock_sentiments)

    return(stock_sentiments)

"""
#EXPORT TO CSV, may be useful later
filepath = Path('processed_data/processed_data.csv')
filepath.parent.mkdir(parents=True,exist_ok=True)
df = pd.Series(text_posts)
df.to_csv(filepath)
"""