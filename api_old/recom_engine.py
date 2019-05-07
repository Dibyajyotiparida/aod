import pandas as pd
import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import requests
import json
from django.http import HttpResponse,JsonResponse
# Reading ratings file
# Ignore the timestamp column
def genre_recommendations(movie_title):
    r = requests.get('http://127.0.0.1:8000/song-list/')
    x = r.json()
    dataset = pd.DataFrame(x['data'])
    #df = pd.DataFrame(pd.read_json(json.dumps(r, indent=4, sort_keys=True, default=str)).to_dict('r'))
    #fp = os.getcwd()+"/api/"
    #dataset = pd.read_csv(fp+'song.csv', sep='\t', encoding='latin-1', usecols=['title', 'genres', 'story'])
    #dataset = pd.read_csv(fp+'song.csv', usecols=['id','permalink','title','genres','song_id'])


    #audio_dataset = pd.read_csv(fp+'')
    # Reading users file
    # users = pd.read_csv(fp+'users.csv', sep='\t', encoding='latin-1', usecols=['user_id', 'gender', 'zipcode', 'age_desc', 'occ_desc'])
    # # Reading movies file
    # movies = pd.read_csv(fp+'movies.csv', sep='\t', encoding='latin-1', usecols=['movie_id', 'title', 'genres'])
    #
    # dataset = pd.merge(pd.merge(movies, ratings),users)

    #print(dataset, 'merge_dataset') #replace audio_dataset inplace of  dataset

    # Make a census of the genre keywords
    genre_labels = set()
    try:
        dataset_genre = dataset['genres'].str.split(',')
    except ValueError:
        dataset_genre = dataset['genres'].str
    else:
        dataset_genre = dataset['genres']
    for s in dataset_genre.values:
        genre_labels = genre_labels.union(set(s))



    # Calling this function gives access to a list of genre keywords which are sorted by decreasing frequency
    keyword_occurences, dum = count_word(dataset, 'genres', genre_labels)
    # keyword_occurences[:5]
    # Break up the big genre string into a string array
    dataset['genres'] = dataset_genre # movies['genre'] = ''.join(i for i in movies['genre'])

    # Convert genres to string value
    dataset['genres'] = dataset['genres'].fillna("").astype('str')
    # I do not have a quantitative metric to judge our machine's performance so this will have to be done qualitatively.
    # In order to do so, I'll use TfidfVectorizer function from scikit-learn,
    #  which transforms text to feature vectors that can be used as input to estimator.
    tf = TfidfVectorizer(analyzer='word',ngram_range=(1, 2),min_df=0, stop_words='english')
    tfidf_matrix = tf.fit_transform(dataset['genres'])
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    # Build a 1-dimensional array with movie titles
    titles = dataset[['id','permalink','title','story','genres','album_type','content_category','date_added','song_id','song_file_name','poster','duration']]
    genres = dataset['genres']
    indices = pd.Series(dataset.index, index=dataset['title'])
    movie_indices = recommendations(movie_title,indices,cosine_sim,titles,genres)
    # g_list = genres.iloc[movie_indices]
    m_list = titles.iloc[movie_indices]

    return m_list


# Function that get movie recommendations based on the cosine similarity score of movie genres
def recommendations(title,indices,cosine_sim,titles,genres):
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:21]
    movie_indices = [i[0] for i in sim_scores]
    return movie_indices
    # Function that counts the number of times each of the genre keywords appear

def count_word(dataset, ref_col, census):
    keyword_count = dict()
    for s in census:
        keyword_count[s] = 0
    for census_keywords in dataset[ref_col].str.split('|'):
        if type(census_keywords) == float and pd.isnull(census_keywords):
            continue
        for s in [s for s in census_keywords if s in census]:
            if pd.notnull(s):
                keyword_count[s] += 1
        #______________________________________________________________________
        # convert the dictionary in a list to sort the keywords by frequency
    keyword_occurences = []
    for k,v in keyword_count.items():
        keyword_occurences.append([k,v])
    keyword_occurences.sort(key = lambda x:x[1], reverse = True)
    return keyword_occurences, keyword_count
