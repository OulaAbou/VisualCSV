from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
import numpy as np

# Load pre-trained model
model = SentenceTransformer('all-MiniLM-L6-v2')

def guess_category(words):
    # Generate embeddings for each word
    embeddings = model.encode(words)

    # Perform KMeans clustering to find categories
    num_clusters = 3  # You can adjust this number based on expected categories
    kmeans = KMeans(n_clusters=num_clusters)
    kmeans.fit(embeddings)
    labels = kmeans.labels_

    # Create a dictionary to count words in each cluster
    cluster_dict = {i: [] for i in range(num_clusters)}
    for word, label in zip(words, labels):
        cluster_dict[label].append(word)

    # Determine the category based on the most frequent cluster
    largest_cluster = max(cluster_dict, key=lambda k: len(cluster_dict[k]))
    guessed_category = cluster_dict[largest_cluster]

    return guessed_category

# Example usage
array = ["cat", "dog", "fish"]
print(guess_category(array))  # Output: Most frequent words in the largest cluster
