import numpy as np
import ast
import json
# from data_point_module import DataPoint

class DataPoint:

    def __init__(self, x, y, value, type, color):
        self.x = x
        self.y = y
        self.value = value
        self.type = type
        self.color = color

    def __str__(self):
        return f"DataPoint(x={self.x}, y={self.y}, value={self.value}, type={self.type}, color={self.color})"
    
class Bar:

    def __init__(self, x, y, height, width, color, data = []):
        self.x = x
        self.y = y
        self.height = height
        self.width = width
        self.color = color
        self.data = data

    
    def __str__(self):
        return f"Bar(x={self.x}, y={self.y}, height={self.height}, width={self.width}, color={self.color}, data={self.data})"
    
class Column:

    def __init__(self, index, data = []):
        self.index = index
        self.data = data

class Grid: 

    def __init__(self, filePath):
        self.filePath = filePath


    def _guess_type(value):
        try:
            # Check for integer
            int(value)
            return 'i'
        except ValueError:
            pass
        try:
            # Check for float
            float(value)
            return 'f'
        except ValueError:
            pass
        if len(value) == 0:
            # Check for empty string
            return 'e'
        if value.lower() in ['true', 'false']:
            # Check for boolean
            return 'b'
        try:
            # Safely evaluate literals
            evaluated_value = ast.literal_eval(value)
            if isinstance(evaluated_value, list):
                return 'l'
            elif isinstance(evaluated_value, tuple):
                return 't'
            elif isinstance(evaluated_value, dict):
                return 'd'
            elif isinstance(evaluated_value, set):
                return 'S'
        except (ValueError, SyntaxError):
            pass
        return 's'
    
    def define_color (type):
        # Define the color mapping
        color_map = {
            's': 'green',
            'e': 'grey',
            'i': 'blue',
            'f': 'black',
            'b': 'red',
            'l': 'purple', ##for now list, set and tuple are treated the same
            't': 'purple',
            'd': 'orange',
            'S': 'purple'
        }

        return color_map.get(type, 'unknown')
    
    ## DONE: Read file and assign data points using the class

    def create_matrix(self): 
        rows = []
        with open(self.filePath, 'r') as file:
            y = 0
            for line in file:
                x = 0
                words = line.strip().split(',')
                meta_data = []
                for word in words:
                    type = Grid._guess_type(word)
                    data_point = DataPoint(x, y, word, type, color= Grid.define_color(type))
                    meta_data.append(data_point)
                    x += 1
                rows.append(meta_data)
                y += 1

        rows_matrix = np.array(rows)
        columns = rows_matrix.T
        return columns
    
    ## Done: Make this so that it clsuters the whole matrix such that they are ready to be JSONified
    def custom_clustering(self, data):
    
        clustered_columns = []

        for i, column in enumerate(data):
            clusters = []
            current_cluster = [column[0]]
            for i in range(1, len(column)):
                if column[i].type == column[i-1].type:
                    current_cluster.append(column[i])
                else:
                    clusters.append(current_cluster)
                    current_cluster = [column[i]]
            clusters.append(current_cluster)  # Append the last cluster
            clustered_columns.append(clusters)
    
        return clustered_columns
    
    def generate_bars(self):

        matrix = self.create_matrix()
        clustered_columns = self.custom_clustering(matrix)

        bars = []

        for i, column in enumerate(clustered_columns):
            y = 20
            for j, cluster in enumerate(column):
                bar = Bar((i+1)*20, y, len(cluster), 10, cluster[0].color, cluster)
                bars.append(bar)
                y += len(cluster)    
        
        return bars
    
    ## This is where you make it suitable for JSON. If you decide to drop JSON, then leave the rest as
    ## it is.
    
    def write_grid(self, clusering_type = 'non_adjacent'):
        bars = self.generate_bars()
        JSON_data = []

        for bar in bars: 
            data = []
            for data_point in bar.data:
                data.append({
                    # 'x': data_point.x,
                    # 'y': data_point.y,  ## This is not needed for now
                    'value': data_point.value,
                    'type': data_point.type,
                    'color': data_point.color
                })
            JSON_data.append({
                'x': bar.x,
                'y': bar.y,
                'height': bar.height,
                'width': bar.width,
                'fill': bar.color,
                'data': data
            })

        return JSON_data


        
        
        
# grid1 = Grid('./Data/archive/2015-16/champs.csv')
# # # print(grid1.custom_clustering(grid1.create_matrix()))
# # # print(grid1.write_grid())


# json_grid1 = './15-16-grid-breakdown.json'

# with open(json_grid1, 'w') as write_data:
#      json.dump(grid1.write_grid(), write_data, indent=4)




    