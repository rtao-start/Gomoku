from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from game import Gomoku

app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)
game = Gomoku()

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/board', methods=['GET'])
def get_board():
    return jsonify({
        'board': game.get_board(),
        'current_player': game.get_current_player(),
        'winner': game.get_winner()
    })

@app.route('/move', methods=['POST'])
def make_move():
    data = request.json
    x, y = data['x'], data['y']
    success = game.make_move(x, y)
    return jsonify({'success': success, 'winner': game.get_winner()})

@app.route('/reset', methods=['POST'])
def reset():
    game.reset()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True,port=13200)