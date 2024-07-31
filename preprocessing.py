import pandas as pd

# # Read the CSV file
# df = pd.read_csv('data/name.basics.csv')

# # Select the top 1000 rows
# df_top_1000 = df.head(10)

# # Write the top 1000 rows to a new CSV file
# df_top_1000.to_csv('data/top_1000_films.csv', index=False)


# Define the input and output file paths
input_file_path = 'data/name.basics.csv'
output_file_path = 'data/top_1000_films.csv.csv'

# Initialize a counter to keep track of the number of lines read
line_count = 0

# Open the input file for reading and the output file for writing
with open(input_file_path, 'r') as input_file, open(output_file_path, 'w') as output_file:
    # Loop through each line in the input file
    for line in input_file:
        # Write the line to the output file
        output_file.write(line)
        # Increment the counter
        line_count += 1
        # Stop after writing 1000 lines
        if line_count >= 1000:
            break
