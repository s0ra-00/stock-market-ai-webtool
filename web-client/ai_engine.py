from flask import Flask, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import yfinance as yf
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()

def get_nlp_sentiment(ticker):
    company = ticker.replace(".NS", "")
    query = urllib.parse.quote(f"{company} stock India")
    rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"
    
    try:
        req = urllib.request.Request(rss_url, headers={'User-Agent': 'Mozilla/5.0'})
        xml_data = urllib.request.urlopen(req).read()
        root = ET.fromstring(xml_data)
        
        headlines = [item.find('title').text for item in root.findall('.//channel/item')[:5]]
        
        if not headlines:
            return 50, ["No major breaking news found."]
            
        total_score = sum([analyzer.polarity_scores(h)['compound'] for h in headlines])
        avg_score = total_score / len(headlines)
        
        sentiment_100 = int(((avg_score + 1) / 2) * 100)
        return sentiment_100, headlines

    except Exception as e:
        print(f"⚠️ NLP Scraper Error: {e}")
        return 50, ["Network error while fetching news."]

def get_ml_prediction(ticker):
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period="3mo")
        
        if df.empty or len(df) < 15:
            return 50
            
        df['SMA_5'] = df['Close'].rolling(window=5).mean()
        df['SMA_10'] = df['Close'].rolling(window=10).mean()
        
        df['Target'] = df['Close'].shift(-1)
        
        df.dropna(inplace=True)
        
        X = df[['Close', 'SMA_5', 'SMA_10']]
        y = df['Target']
        
        model = LinearRegression()
        model.fit(X, y)

        latest_data = stock.history(period="1d")
        if latest_data.empty: return 50
        
        today_close = latest_data['Close'].iloc[-1]
        
        full_df = stock.history(period="15d")
        today_sma5 = full_df['Close'].tail(5).mean()
        today_sma10 = full_df['Close'].tail(10).mean()
        
        prediction_features = pd.DataFrame({'Close': [today_close], 'SMA_5': [today_sma5], 'SMA_10': [today_sma10]})
        predicted_tomorrow = model.predict(prediction_features)[0]

        percent_change = ((predicted_tomorrow - today_close) / today_close) * 100
        
        ml_score = 50 + (percent_change * 15) 
        ml_score = int(max(0, min(100, ml_score)))
        
        return ml_score
        
    except Exception as e:
        print(f"⚠️ ML Engine Error: {e}")
        return 50


@app.route('/analyze', methods=['GET'])
def analyze_stock():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({"error": "No ticker provided"}), 400

    nlp_score, headlines = get_nlp_sentiment(ticker)
    ml_score = get_ml_prediction(ticker)
    
    final_hybrid_score = int((ml_score * 0.6) + (nlp_score * 0.4))
    
    if final_hybrid_score >= 60:
        trend = "BUY"
    elif final_hybrid_score <= 40:
        trend = "SELL"
    else:
        trend = "HOLD"

    print(f"\n[{ticker}] NLP Sentiment: {nlp_score}/100 | ML Prediction: {ml_score}/100")
    print(f"[{ticker}] HYBRID SCORE:  {final_hybrid_score}/100 -> {trend}\n")

    return jsonify({
        "ticker": ticker,
        "sentimentScore": final_hybrid_score,
        "predictedTrend": trend,
        "analyzedHeadlines": headlines
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)