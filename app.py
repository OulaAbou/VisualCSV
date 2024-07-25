from flask import Flask, jsonify, render_template, request
# from grid_module import Grid  # Ensure you import the Grid class
from grid_breakdown import Grid  # Ensure you import the Grid class
from inspect_bars_data import  write_bar_data
import os

print("the following is the current working directory:/n")
print(os.getcwd())

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_data', methods=['GET'])
def get_data():
    file_name = request.args.get('file')
    if not file_name:
        return jsonify({"error": "File name is required"}), 400
    
    file_path = f'data/{file_name}'  # Adjust the path as needed
    try:
        grid = Grid(file_path)
        data = grid.write_grid()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/post_bar_data', methods=['POST'])
def post_bar_data():
    data = request.json

    try:
        bar_data = write_bar_data(data)
        return jsonify({"status": "success", "result": bar_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#     bar = request.args.get('data')
#     # if not file_name:
#     #     return jsonify({"error": "File name is required"}), 400
    
#     # file_path = f'data/{file_name}'  # Adjust the path as needed
#     try:
#         # grid = Grid(file_path)
#         data = write_bar_data(bar)
#         return jsonify(data)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    

# @app.route('/get_adjacent_data', methods=['GET'])
# def get_adjacent_data():
#     file_name = request.args.get('file')
#     if not file_name:
#         return jsonify({"error": "File name is required"}), 400
        
#     file_path = f'data/{file_name}'  # Adjust the path as needed
#     try:
#         grid = Grid(file_path)
#         data = grid.write_grid('adjacent')
#         return jsonify(data)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True)
