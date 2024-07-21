import numpy as np
import ast
import json

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

    def data_value (self):
        rows = []
        with open(self.filePath, 'r') as file:
            for line in file:
                words = line.strip().split(',')
                value = []
                for word in words:
                    value.append(word)
                rows.append(value)

        rows_matrix = np.array(rows)
        comlumns = rows_matrix.T
        return comlumns
    
    def define_metadata(self): 
        rows = []
        with open(self.filePath, 'r') as file:
            for line in file:
                words = line.strip().split(',')
                meta_data = []
                for word in words:
                    meta_data.append(Grid._guess_type(word))
                rows.append(meta_data)

        rows_matrix = np.array(rows)
        columns = rows_matrix.T
        return columns
    
    def color_matrix(self):
        matrix = self.define_metadata()
        # Define the color mapping
        color_map = {
            's': 'green',
            'e': 'white',
            'i': 'blue',
            'f': 'black',
            'b': 'red',
            'l': 'purple', ##for now list, set and tuple are treated the same
            't': 'purple',
            'd': 'orange',
            'S': 'purple'
        }

        # Vectorized approach using numpy's vectorize function
        value_to_color = np.vectorize(lambda x: color_map.get(x, 'unknown'))
        color_matrix = value_to_color(matrix)

        return color_matrix
    
    def _custom_clustering(data):
        # Custom clustering function to cluster rows according to types
        clusters = []
        current_cluster = [data[0]]

        for i in range(1, len(data)):
            if data[i] == data[i-1]:
                current_cluster.append(data[i])
            else:
                clusters.append(current_cluster)
                current_cluster = [data[i]]

        clusters.append(current_cluster)  # Append the last cluster

        return clusters
    
    def _normalise_column_length(column):
        # Normalise the length of each cluster within a column
        cluster_length = []
        for cluster in column:
            cluster_length.append(len(cluster)/len(column))

        total = sum(cluster_length)
        normalized_data = [round(val / total, 5) for val in cluster_length]
        return normalized_data

    def normalise_all_columns(self, columns):
        # Normalise the length of each cluster within columns
        # And return the normalised columns and color matrix
      
        normalised_columns = []
        normalised_color_matrix = []
        
        for column in columns:
            normalised_columns.append(Grid._normalise_column_length(Grid._custom_clustering(column)))
            colour_cluster = []
            for colour_list in Grid._custom_clustering(column):
                colour_cluster.append(colour_list[0])
            normalised_color_matrix.append(colour_cluster)
        # print(normalised_color_matrix)
        # print(normalised_columns)

        return normalised_columns, normalised_color_matrix
    

    def _levenshtein_distance(str1, str2):
        # Get the lengths of the input strings
        m = len(str1)
        n = len(str2)
    
        # Initialize two rows for dynamic programming
        prev_row = [j for j in range(n + 1)]
        curr_row = [0] * (n + 1)
    
        # Dynamic programming to fill the matrix
        for i in range(1, m + 1):
            # Initialize the first element of the current row
            curr_row[0] = i
    
            for j in range(1, n + 1):
                if str1[i - 1] == str2[j - 1]:
                    # Characters match, no operation needed
                    curr_row[j] = prev_row[j - 1]
                else:
                    # Choose the minimum cost operation
                    curr_row[j] = 1 + min(
                        curr_row[j - 1],  # Insert
                        prev_row[j],      # Remove
                        prev_row[j - 1]    # Replace
                    )
    
            # Update the previous row with the current row
            prev_row = curr_row.copy()
    
        # The final element in the last row contains the Levenshtein distance
        return curr_row[n]
    
    def _cluster_adjacent_columns(self, columns):
    # Cluster columns based on the Levenshtein distance, considering only columns in order
        # columns = self.color_matrix()
        clusters = []
        i = 0
        
        while i < len(columns):
            # Create a new cluster starting with the current column
            new_cluster = [i]
            current_column = columns[i]
            
            # Check subsequent columns to see if they belong in the same cluster
            for j in range(i + 1, len(columns)):
                next_column = columns[j]
                distance = Grid._levenshtein_distance(current_column, next_column)
                if distance <= 20: #find a stable metric
                    new_cluster.append(j)
                    current_column = next_column  # Update current column to the last matched column
                else:
                    break  # Stop clustering if the next column doesn't match
            
            clusters.append(new_cluster)
            i = new_cluster[-1] + 1  # Move to the next unclustered column
        
        return clusters
    
    def cluster_columns (self):

        data = self.color_matrix()

        normalised_columns = []
        normalised_color_matrix = []

        for clusters in self._cluster_adjacent_columns(data):
            normalised_columns.append(self.normalise_all_columns(data[clusters])[0])
            normalised_color_matrix.append(self.normalise_all_columns(data[clusters])[1])
        
        return normalised_columns, normalised_color_matrix
    
    
    def generate_grid(self, clustering_type = 'non_adjacent'):

        if clustering_type == 'non_adjacent':
            return self.normalise_all_columns(self.color_matrix())
        elif clustering_type == 'adjacent':
            return self.cluster_columns()
        

    def write_grid(self, clusering_type = 'non_adjacent'):

        blocks = []
        x_coordinate = 100

        if clusering_type == 'non_adjacent':
            grid = self.generate_grid()
            for cluster_index in range (0, len(grid[0])):
                y_coordinate = 26
                for i in range(0, len(grid[0][cluster_index])) :
                    data = {}
                    data['x'] = x_coordinate
                    data['y'] = y_coordinate
                    data['height'] = round(grid[0][cluster_index][i], 5) * 100
                    data['width'] = 10
                    data['fill'] = grid[1][cluster_index][i]
                    blocks.append(data)
                    y_coordinate += data['height']
                x_coordinate += 15


        elif clusering_type == 'adjacent':
            grid = self.generate_grid('adjacent')
            height = grid[0]
            fill = grid[1]
            for cluster_index in range(0, len(height)): 
                width = 12/len(height[cluster_index])
                for col_index in range(0, len(height[cluster_index])):
                    y_coordinate = 146
                    for bar_index in range (0, len(height[cluster_index][col_index])):
                        data = {}
                        data['x'] = x_coordinate
                        data['y'] = y_coordinate
                        data['height'] = height[cluster_index][col_index][bar_index] * 100
                        data['width'] = width
                        data['fill'] = fill[cluster_index][col_index][bar_index]
                        blocks.append(data)
                        y_coordinate += data['height']
                    x_coordinate += width + 2
                x_coordinate += 5
                
        return blocks
        
        
# grid1 = Grid('./Data/archive/2015-16/champs.csv')
# print(grid1.write_grid())
# print(grid1.write_grid('adjacent'))


# ## TO DO: make this in a separate file
# json_grid1 = './json/15-16-summarised-grid-non_adjacent.json'

# with open(json_grid1, 'w') as write_data:
#      json.dump(grid1.write_grid(), write_data, indent=4)

# json_grid2 = './json/15-16-summarised-grid-adjacent.json'

# with open(json_grid2, 'w') as write_data:
#      json.dump(grid1.write_grid('adjacent'), write_data, indent=4)



    