from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import random
import time
import copy
import requests
import os

app = Flask(__name__)
CORS(app)

# Access the Gemini API key from the environment variable
gemini_api_key = os.getenv('GEMINI_API_KEY')

goal_interval = 14
exponent = 0

initialCompanies = [
    {
        "id": 'tech-1',
        "name": 'NexaTech Solutions',
        "ticker": 'NTS',
        "description": 'Leading provider of cloud computing and AI solutions',
        "sector": 'Technology',
        "initialPrice": 245.75,
        "currentPrice": 245.75,
        "priceHistory": [245.75],
        "volatility": 0.8
    },
    {
        "id": 'tech-2',
        "name": 'Quantum Dynamics',
        "ticker": 'QDY',
        "description": 'Specializes in quantum computing and advanced algorithms',
        "sector": 'Technology',
        "initialPrice": 189.30,
        "currentPrice": 189.30,
        "priceHistory": [189.30],
        "volatility": 0.9
    },
    {
        "id": 'energy-1',
        "name": 'SolarPeak Energy',
        "ticker": 'SPE',
        "description": 'Renewable energy company focused on solar power solutions',
        "sector": 'Energy',
        "initialPrice": 78.45,
        "currentPrice": 78.45,
        "priceHistory": [78.45],
        "volatility": 0.6
    },
    {
        "id": 'finance-1',
        "name": 'Atlas Financial Group',
        "ticker": 'AFG',
        "description": 'Global financial services and investment management',
        "sector": 'Finance',
        "initialPrice": 156.20,
        "currentPrice": 156.20,
        "priceHistory": [156.20],
        "volatility": 0.5
    },
    {
        "id": 'health-1',
        "name": 'BioGenesis Labs',
        "ticker": 'BGL',
        "description": 'Biotechnology company developing innovative treatments',
        "sector": 'Healthcare',
        "initialPrice": 112.80,
        "currentPrice": 112.80,
        "priceHistory": [112.80],
        "volatility": 0.7
    },
    {
        "id": 'consumer-1',
        "name": 'Evergreen Goods',
        "ticker": 'EVG',
        "description": 'Consumer goods company with sustainable product lines',
        "sector": 'Consumer Goods',
        "initialPrice": 67.35,
        "currentPrice": 67.35,
        "priceHistory": [67.35],
        "volatility": 0.4
    },
    {
        "id": 'manufacturing-1',
        "name": 'Titan Industries',
        "ticker": 'TTI',
        "description": 'Heavy machinery and industrial equipment manufacturer',
        "sector": 'Manufacturing',
        "initialPrice": 92.15,
        "currentPrice": 92.15,
        "priceHistory": [92.15],
        "volatility": 0.5
    },
    {
        "id": 'retail-1',
        "name": 'Urban Marketplace',
        "ticker": 'UMP',
        "description": 'E-commerce platform for urban lifestyle products',
        "sector": 'Retail',
        "initialPrice": 45.60,
        "currentPrice": 45.60,
        "priceHistory": [45.60],
        "volatility": 0.6
    }
]

newsTemplates = {
    "positive": [
        {"headline": "{company} Reports Record Quarterly Profits", "impact": 0.15},
        {"headline": "{company} Announces Revolutionary New Product", "impact": 0.2},
        {"headline": "{company} Expands into New Markets", "impact": 0.1},
        {"headline": "{company} Exceeds Analyst Expectations", "impact": 0.12},
        {"headline": "Investors Bullish on {company}'s Future", "impact": 0.08},
        {"headline": "{company} Secures Major Partnership Deal", "impact": 0.15},
        {"headline": "{company} Stock Upgraded by Analysts", "impact": 0.1}
    ],
    "negative": [
        {"headline": "{company} Faces Regulatory Investigation", "impact": -0.18},
        {"headline": "{company} Recalls Defective Products", "impact": -0.15},
        {"headline": "{company} CEO Steps Down Amid Controversy", "impact": -0.2},
        {"headline": "{company} Reports Disappointing Earnings", "impact": -0.12},
        {"headline": "{company} Loses Key Client", "impact": -0.1},
        {"headline": "Analysts Downgrade {company} Stock", "impact": -0.08},
        {"headline": "{company} Faces Increased Competition", "impact": -0.1}
    ],
    "neutral": [
        {"headline": "{company} Announces Leadership Restructuring", "impact": 0.03},
        {"headline": "{company} to Present at Industry Conference", "impact": 0.02},
        {"headline": "{company} Maintains Current Outlook", "impact": 0.01},
        {"headline": "{company} Releases Sustainability Report", "impact": 0.02},
        {"headline": "{company} Updates Corporate Policies", "impact": 0.01}
    ],
    'market': [
        {"headline": "Market Rallies on Economic Data", "impact": 0.05, "isMarketWide": True},
        {"headline": "Investors Concerned About Inflation", "impact": -0.05, "isMarketWide": True},
        {"headline": "Central Bank Adjusts Interest Rates", "impact": -0.03, "isMarketWide": True},
        {"headline": "Economic Growth Exceeds Expectations", "impact": 0.04, "isMarketWide": True},
        {"headline": "Global Trade Tensions Escalate", "impact": -0.06, "isMarketWide": True}
    ]
}

def generate_news_body(headline):
    return f"{headline}. Analysts are closely watching how this development will impact the company's financial performance and market position in the coming quarters."

def generate_news_events(companies):
    MAX_NEWS_PER_DAY = 3
    news_count = random.randint(1, MAX_NEWS_PER_DAY)
    news = []

    #20% chance of market event occuring
    if random.random() < 0.2:
        market_news = random.choice(newsTemplates['market'])
        news.append({
            "id": str(uuid.uuid4()),
            "headline": market_news['headline'],
            "body": generate_news_body(market_news['headline']),
            "affectedCompanies": [company['id'] for company in companies],
            "sentiment": market_news['impact'],
            "timestamp": int(time.time())
        })
    #generate 1-3 news
    while len(news) < news_count:
        company = random.choice(companies)
        sentiment_roll = random.random()
        if sentiment_roll < 0.33:
            news_category = 'positive'
        elif sentiment_roll < 0.66:
            news_category = 'negative'
        else:
            news_category = 'neutral'
         
        template = random.choice(newsTemplates[news_category])
        news.append({
            "id": str(uuid.uuid4()),
            "headline": template['headline'].format(company=company['name']),
            "body": generate_news_body(template['headline'].format(company=company['name'])),
            "affectedCompanies": [company['id']],
            "sentiment": template['impact'],
            "timestamp": int(time.time())
        })
    return news

initialGameState = {
    "day": 0,
    "companies": initialCompanies,
    "news": [],
    "nextDayNews": generate_news_events(initialCompanies),
    "portfolio": {
        "cash": 10000,
        "holdings": {},
        "transactionHistory": [],
        "netWorth": 10000
    },
    "leaderboard": [],
    "marketTrend": 0,
    "goalAmount": 10500.00,         #(set initial goal)
    "showResult": False,
    "daysUntilGoal": goal_interval  #(initially set to goal_interval days)
}

gameState = copy.deepcopy(initialGameState)

def update_stock_prices(game_state, news):
    BASE_MARKET_FLUCTUATION = 0.02
    updated_companies = game_state["companies"]
    market_trend = game_state["marketTrend"] + (random.uniform(-0.1, 0.1))
    bounded_market_trend = max(-1, min(1, market_trend))

    for company in updated_companies:
        price_change = (random.uniform(-1, 1)) * BASE_MARKET_FLUCTUATION
        price_change += bounded_market_trend * 0.01

        for news_item in news:
            if company["id"] in news_item["affectedCompanies"] or len(news_item["affectedCompanies"]) == len(updated_companies):
                price_change += news_item["sentiment"] * company["volatility"]

        new_price = company["currentPrice"] * (1 + price_change)
        company["priceHistory"].append(new_price)
        company["currentPrice"] = max(0.01, new_price)

    return updated_companies

def calculate_market_trend(companies):
    total_change = 0
    for company in companies:
        history_length = len(company["priceHistory"])
        if history_length > 1:
            total_change += (company["priceHistory"][-1] - company["priceHistory"][-2]) / company["priceHistory"][-2]
    return max(-1, min(1, total_change / len(companies) * 5))
        
def calculate_portfolio_value(portfolio, companies):
    stock_value = 0
    for company_id, holding in portfolio["holdings"].items():
        company = next((c for c in companies if c["id"] == company_id), None)
        if company:
            stock_value += holding["shares"] * company["currentPrice"]
    portfolio["netWorth"] = portfolio["cash"] + stock_value
    return portfolio

@app.route('/api/gamestate', methods=['GET'])
def get_game_state():
    return jsonify(gameState)

@app.route('/api/gamestate', methods=['POST'])
def update_game_state():
    global gameState
    gameState = request.json
    return jsonify(gameState)

@app.route('/api/advance-day', methods=['POST'])
def advance_day():
    global gameState, exponent, goal_interval
    news = generate_news_events(gameState["companies"])
    updated_companies = update_stock_prices(gameState, news)
    new_market_trend = calculate_market_trend(updated_companies)
    updated_portfolio = calculate_portfolio_value(gameState["portfolio"], updated_companies)

    gameState["day"] += 1
    gameState["companies"] = updated_companies
    gameState["news"] = (gameState["news"] + news)[-10:]
    gameState["portfolio"] = updated_portfolio
    gameState["marketTrend"] = new_market_trend

    # Decrease days until goal
    gameState["daysUntilGoal"] -= 1

    # Update the game goal and reset the counter every "goal_interval" days
    if gameState["daysUntilGoal"] <= 0:
        gameState["showResult"] = True
        print(gameState["showResult"])
        gameState["goalAmount"] += round(500 * (1.25 ** exponent), 2)
        exponent += 0.05
        gameState["daysUntilGoal"] = goal_interval  # Reset the goal countdown

    return jsonify(gameState)

@app.route('/api/buy', methods=['POST'])
def buy_stock():
    global gameState
    data = request.json
    company_id = data['companyId']
    shares = data['shares']

    company = next((c for c in gameState['companies'] if c['id'] == company_id), None)
    if not company:
        return jsonify({'error': 'Company not found'}), 404

    cost = shares * company['currentPrice']
    if gameState['portfolio']['cash'] < cost:
        return jsonify({'error': 'Insufficient funds'}), 400

    gameState['portfolio']['cash'] -= cost
    if company_id in gameState['portfolio']['holdings']:
        gameState['portfolio']['holdings'][company_id]['shares'] += shares
    else:
        gameState['portfolio']['holdings'][company_id] = {'shares': shares}

    gameState['portfolio'] = calculate_portfolio_value(gameState['portfolio'], gameState['companies'])
    return jsonify(gameState)

@app.route('/api/sell', methods=['POST'])
def sell_stock():
    global gameState
    data = request.json
    company_id = data['companyId']
    shares = data['shares']

    company = next((c for c in gameState['companies'] if c['id'] == company_id), None)
    if not company:
        return jsonify({'error': 'Company not found'}), 404

    if company_id not in gameState['portfolio']['holdings'] or gameState['portfolio']['holdings'][company_id]['shares'] < shares:
        return jsonify({'error': 'Insufficient shares'}), 400

    revenue = shares * company['currentPrice']
    gameState['portfolio']['cash'] += revenue
    gameState['portfolio']['holdings'][company_id]['shares'] -= shares
    if gameState['portfolio']['holdings'][company_id]['shares'] == 0:
        del gameState['portfolio']['holdings'][company_id]

    gameState['portfolio'] = calculate_portfolio_value(gameState['portfolio'], gameState['companies'])
    return jsonify(gameState)

@app.route('/api/reset', methods=['POST'])
def reset_game():
    global gameState
    gameState = copy.deepcopy(initialGameState)
    return jsonify(initialGameState)

if __name__ == '__main__':
    print(f"{gemini_api_key}")
    app.run(debug=True)