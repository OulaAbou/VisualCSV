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

    def __init__(self, id, x, y, height, width, color, data = []):
        self.id = id
        self.x = x
        self.y = y
        self.height = height
        self.width = width
        self.color = color
        self.data = data

    
    def __str__(self):
        return f"Bar(x={self.x}, y={self.y}, height={self.height}, width={self.width}, color={self.color}, data={self.data})"
    
class Column:

    def __init__(self, id, x, y, height, width, color, data = []):
        self.id = id
        self.x = x
        self.y = y
        self.height = height
        self.width = width
        self.color = color
        self.data = data
    
    def __str__(self):
        return f"Column(x={self.x}, y={self.y}, height={self.height}, width={self.width}, color={self.color}, data={self.data})"

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
            's': '#4caf50',  # Darker muted green
            'e': '#757575',  # Darker muted grey
            'i': '#3f51b5',  # Darker muted blue
            'f': '#212121',  # Very dark grey (near black)
            'b': '#d32f2f',  # Darker muted red
            'l': '#7b1fa2',  # Darker muted purple
            't': '#7b1fa2',  # Darker muted purple (same as 'l')
            'd': '#f57c00',  # Darker muted orange
            'S': '#7b1fa2'   # Darker muted purple (same as 'l' and 't')
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

        # Find the maximum length of the subarrays
        max_length = max(len(subarray) for subarray in rows)
        # Create a new array with the same number of subarrays, each of max_length, filled with empty strings
        filled_array = np.full((len(rows), max_length),None,  dtype=object)

        # # Copy the elements from the original subarrays to the new array
        # for i, subarray in enumerate(rows):
        #     filled_array[i, :len(subarray)] = subarray

        # Copy the elements from the original subarrays to the new array and fill the rest with DataPoint objects
        light_grey_js = '#D3D3D3'

        for y, subarray in enumerate(rows):
            for x in range(max_length):
                if x < len(subarray):
                    filled_array[y, x] = subarray[x]
                else:
                    filled_array[y, x] = DataPoint(x, y, '', None, light_grey_js)

        rows_matrix = np.array(filled_array)
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

        id = 0

        for i, column in enumerate(clustered_columns):
            y = 20
            for j, cluster in enumerate(column):
                bar = Bar(id, (i+1)*12, y, len(cluster), 10, cluster[0].color, cluster)
                bars.append(bar)
                y += len(cluster) 
                id += 1   
        
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
                'id': bar.id,
                'x': bar.x,
                'y': bar.y,
                'height': bar.height,
                'width': bar.width,
                'fill': bar.color,
                'data': data
            })

        return JSON_data

    def generate_columns(self):
        matrix = self.create_matrix()
        columns = []

        id = 0
        x = 12

        for i, column in enumerate(matrix):
            # Dictionary to count occurrences of each type
            type_counts = {
                's': 0,
                'e': 0,
                'i': 0,
                'f': 0,
                'b': 0,
                'l': 0,
                't': 0,
                'd': 0,
                'S': 0
            }

            # Count the types in the column
            for data_point in column:
                if data_point.type:
                    type_counts[data_point.type] += 1

            # Calculate the total number of data points in the column
            total_count = len(column)

            # Calculate the percentage of each type
            color_percentages = {}
            for type_key, count in type_counts.items():
                percentage = (count / total_count) * 100 if total_count > 0 else 0
                color = Grid.define_color(type_key)
                if percentage > 0:
                    color_percentages[color] = percentage

            # Calculate the sum of percentages
            total_percentage = sum(color_percentages.values())

            # If the total percentage is less than 100, add the remaining as grey
            if total_percentage < 100:
                color_percentages['grey'] = 100 - total_percentage

            # Create a Column object with color percentages as its color attribute
            column_object = Column(id, x, 20, len(column), 10, color_percentages, column)
            columns.append(column_object)
            x += 12
            id += 1

        return columns

    
    def write_columns (self):
        columns = self.generate_columns()
        JSON_data = []

        for column in columns:
            data = []
            for data_point in column.data:
                data.append({
                    'value': data_point.value,
                    'type': data_point.type,
                    'color': data_point.color
                })
            JSON_data.append({
                'id': column.id,
                'x': column.x,
                'y': column.y,
                'height': column.height,
                'width': column.width,
                'fill': column.color,
                'data': data
            })
        return JSON_data


        
        
        
grid1 = Grid('./Data/top_1000_films.csv')
# # print(grid1.custom_clustering(grid1.create_matrix()))
# # print(grid1.write_grid())


json_grid1 = './top_1000_films_columns.json'

with open(json_grid1, 'w') as write_data:
     json.dump(grid1.write_columns(), write_data, indent=4)




    