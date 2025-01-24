import requests
from bs4 import BeautifulSoup
import json
import sqlite3
from datetime import datetime

def create_database():
    conn = sqlite3.connect('products.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT,
            description TEXT,
            image_url TEXT,
            product_url TEXT,
            votes INTEGER,
            categories TEXT,
            launch_date TEXT,
            maker TEXT,
            pricing TEXT,
            last_updated TEXT
        )
    ''')
    conn.commit()
    conn.close()

def scrape_product_hunt():
    headers = {
        'Authorization': 'Bearer your_developer_token_here',  # 替换为你的 Developer Token
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Host': 'api.producthunt.com'  # 添加 Host 头
    }
    
    try:
        response = requests.get(
            'https://api.producthunt.com/v2/api/graphql',
            headers=headers,
            json={
                'query': '''
                {
                    posts(first: 10, order: RANKING) {
                        edges {
                            node {
                                id
                                name
                                tagline
                                description
                                thumbnail {
                                    url
                                }
                                website
                                votesCount
                                topics {
                                    edges {
                                        node {
                                            name
                                        }
                                    }
                                }
                                makers {
                                    name
                                }
                                priceInfo
                            }
                        }
                    }
                }
                '''
            },
            verify=True  # 确保 HTTPS 验证
        )
        
        if response.status_code == 200:
            return process_response(response.json())
        else:
            print(f"Error: {response.status_code}")
            print(f"Response: {response.text}")
            return []
            
    except Exception as e:
        print(f"Error fetching data: {str(e)}")
        return []

def process_response(data):
    try:
        products = []
        for edge in data['data']['posts']['edges']:
            node = edge['node']
            product = {
                'name': node['name'],
                'description': node['tagline'],
                'image_url': node['thumbnail']['url'],
                'product_url': node['website'],
                'votes': node['votesCount'],
                'categories': [topic['node']['name'] for topic in node['topics']['edges']],
                'maker': [maker['name'] for maker in node['makers']],
                'pricing': node['priceInfo'],
                'launch_date': datetime.now().strftime('%Y-%m-%d')
            }
            products.append(product)
        return products
    except Exception as e:
        print(f"Error processing response: {str(e)}")
        return []

def save_to_database(products):
    conn = sqlite3.connect('products.db')
    c = conn.cursor()
    
    for product in products:
        c.execute('''
            INSERT OR REPLACE INTO products 
            (name, description, image_url, product_url, votes, categories, 
             maker, pricing, launch_date, last_updated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product['name'],
            product['description'],
            product['image_url'],
            product['product_url'],
            product['votes'],
            json.dumps(product['categories']),
            json.dumps(product['maker']),
            product['pricing'],
            product['launch_date'],
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ))
    
    conn.commit()
    conn.close()

def export_to_js():
    conn = sqlite3.connect('products.db')
    c = conn.cursor()
    
    c.execute('SELECT * FROM products ORDER BY votes DESC LIMIT 10')
    products = c.fetchall()
    
    product_data = []
    for p in products:
        product_data.append({
            'id': p[0],
            'name': p[1],
            'description': p[2],
            'image': p[3],
            'link': p[4],
            'votes': p[5],
            'categories': json.loads(p[6]),
            'maker': json.loads(p[7]),
            'pricing': p[8],
            'launchDate': p[9]
        })
    
    js_content = f'''
// 自动从 Product Hunt 获取的产品数据
const productHuntData = {json.dumps(product_data, indent=4)};

// 将数据保存到 localStorage
if (!localStorage.getItem('productHuntData')) {{
    localStorage.setItem('productHuntData', JSON.stringify(productHuntData));
}}

// 确保数据总是可用
if (!JSON.parse(localStorage.getItem('productHuntData'))) {{
    localStorage.setItem('productHuntData', JSON.stringify(productHuntData));
}}
'''
    
    with open('../js/products.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    conn.close()

if __name__ == '__main__':
    create_database()
    products = scrape_product_hunt()
    save_to_database(products)
    export_to_js() 