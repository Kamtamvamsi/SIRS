from flask import Flask, request, jsonify
from flask_cors import CORS
import os, json
from utils import generate_token, save_user_data, load_data_by_token

app = Flask(__name__)
CORS(app)  # Allow frontend requests

USER_DIR = 'data/users'
TOKEN_FILE = 'data/tokens.json'

# Create folders if missing
os.makedirs(USER_DIR, exist_ok=True)
if not os.path.exists(TOKEN_FILE):
    with open(TOKEN_FILE, 'w') as f:
        json.dump({}, f)

@app.route('/api/generate-token', methods=['POST'])
def generate_and_store():
    content = request.json
    print("Got request:", content)

    email = content.get('email')
    data = content.get('data')

    if not email or not data:
        return jsonify({'error': 'Missing email or data'}), 400

    token = generate_token()
    save_user_data(email, data, token, USER_DIR, TOKEN_FILE)

    print(f"Saved data for {email} with token: {token}")
    return jsonify({'token': token})

@app.route('/api/access-data', methods=['POST'])
def access_data():
    content = request.json
    token = content.get('token')

    data = load_data_by_token(token, TOKEN_FILE, USER_DIR)
    if data:
        return jsonify({'data': data})
    else:
        return jsonify({'error': 'Token not found'}), 404

if __name__ == '__main__':
    app.run(port=3001)
