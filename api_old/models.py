from django.db import models
from api.allTables import *
from django.http import HttpResponse
from django.db.models import Sum,Avg,Max,Min,Count,F,Q
import json
class data():
    def getMenu():
        catList = list(Category.objects.filter(status = 1).values('id','permalink','name'))
        return catList
    def getCategoryDetails(cpermalink = ''):
        category = []
        if cpermalink != '':
            category = Category.objects.get(permalink = cpermalink)
        return category
    def getAlbums(content_category):
        sql_data = 'SELECT a.id,a.permalink,a.title,a.story,a.genre,a.album_type,a.content_category,a.date_added,s.id as song_id,s.song_file_name,s.poster,s.duration FROM album a,song s WHERE a.id=s.album_id AND a.album_status=1 AND s.is_episode = 0 AND FIND_IN_SET({}, a.content_category)'.format(content_category)
        res = Album.objects.raw(sql_data)
        return res
    def getSongs():
        songDetails = {}
        data = []
        sql_data = 'SELECT a.id,a.permalink,a.title,a.story,a.genre,a.album_type,a.content_category,a.date_added,s.id as song_id,s.song_file_name,s.poster,s.duration FROM album a, song s WHERE a.id=s.album_id';
        res = Album.objects.raw(sql_data)
        for i in res:
            songData = {
                "id" : i.id,
                "permalink" : i.permalink,
                "title" : i.title,
                "story" : i.story,
                "genres" : i.genre,
                "album_type" : i.album_type,
                "content_category": i.content_category,
                "date_added" : i.date_added,
                "song_id" : i.song_id,
                "song_file_name" : i.song_file_name,
                "poster" : i.poster,
                "duration" : i.duration if i.duration else "00:00",
            }
            data.append(songData)
        songDetails = {
            'data': data
        }
        return songDetails
    def getSingle():
        songDetails = {}
        data = []
        sql_data = 'SELECT a.id,a.permalink,a.title,a.story,a.genre,a.album_type,a.content_category,a.date_added,s.id as song_id,s.song_file_name,s.poster,s.duration FROM album a, song s WHERE a.id=s.album_id AND a.album_type=0 ORDER BY date_added DESC LIMIT 10';
        res = Album.objects.raw(sql_data)
        for i in res:
            songData = {
                "id" : i.id,
                "permalink" : i.permalink,
                "title" : i.title,
                "story" : i.story,
                "genres" : i.genre,
                "album_type" : i.album_type,
                "content_category": i.content_category,
                "date_added" : i.date_added,
                "song_id" : i.song_id,
                "song_file_name" : i.song_file_name,
                "poster" : i.poster,
                "duration" : i.duration if i.duration else "00:00",
            }
            data.append(songData)
        songDetails = {
            'data': data
        }
        return songDetails
    def getMulti():
        songDetails = {}
        data = []
        sql_data = 'SELECT a.id,a.permalink,a.title,a.story,a.genre,a.album_type,a.content_category,a.date_added,s.id as song_id,s.song_file_name,s.poster,s.duration FROM album a, song s WHERE a.id=s.album_id AND a.album_type=1 AND s.is_episode=0 ORDER BY date_added DESC LIMIT 10';
        res = Album.objects.raw(sql_data)
        for i in res:
            songData = {
                "id" : i.id,
                "permalink" : i.permalink,
                "title" : i.title,
                "story" : i.story,
                "genres" : i.genre,
                "album_type" : i.album_type,
                "content_category": i.content_category,
                "date_added" : i.date_added,
                "song_id" : i.song_id,
                "song_file_name" : i.song_file_name,
                "poster" : i.poster,
                "duration" : i.duration if i.duration else "00:00",
            }
            data.append(songData)
        songDetails = {
            'data': data
        }
        return songDetails
    def getAlbumDetails(permalink):
        result = {
            'album': '',
            'songs': ''
        }
        sql_data = 'SELECT a.id,a.permalink,a.title,a.story,a.genre,a.album_type,a.content_category,s.id as song_id,s.song_file_name,s.poster,s.duration,s.is_episode FROM album a,song s WHERE a.id=s.album_id AND a.album_status=1 AND s.is_episode = 0 AND a.permalink="{}"'.format(permalink)
        result['album'] = Album.objects.raw(sql_data)
        for i in result['album']:
            if i.album_type == 1:
                sql_data1 = 'SELECT a.permalink,s.id ,s.album_id, s.name,s.details,s.song_file_name,s.poster,s.duration,s.is_episode FROM album a,song s WHERE a.id=s.album_id AND a.album_status=1 AND s.song_status = 1 AND s.is_converted = 1 AND s.is_episode = 1 AND a.permalink="{}"'.format(permalink)
                result['songs'] = Song.objects.raw(sql_data1)
        return result
    def getCastDetailsOfContent(content_id, is_episode = 0):
        castDetails = {}
        sql_data = 'SELECT c.name, c.permalink, ac.id, ac.cast_type FROM cast c,album_cast ac WHERE c.id = ac.cast_id AND ac.content_id = {} AND is_episode = {}'.format(content_id, is_episode)
        res = AlbumCast.objects.raw(sql_data)
        i = 0
        for cast in res:
            castDetails[i] = {
                'cast_name' : cast.name,
                'cpermalink' : cast.permalink,
                'cast_type' : cast.cast_type
            }
            i +=1
        return  castDetails
    def getCastDetails(permalink):
        cast = {
            'details' : '',
            'album' : ''
        }
        castData = {}
        contentIds = []
        sql_data = 'SELECT c.name, c.permalink, c.id, ac.content_id FROM cast c,album_cast ac WHERE c.id = ac.cast_id AND permalink = "{}"'.format(permalink )
        res = Cast.objects.raw(sql_data)
        for i in res:
            contentIds.append(i.content_id)
            castData = {
                'name' : i.name,
                'cpermalink' : i.permalink,
            }
        cast['details'] = castData
        if(contentIds != []):
            content_ids = ','.join(str(x) for x in contentIds)
            sql_data = 'SELECT a.id,a.permalink,a.title,a.story,a.genre,a.album_type,a.content_category,a.date_added,s.id as song_id,s.song_file_name,s.poster,s.duration FROM album a,song s WHERE a.id=s.album_id AND a.album_status=1 AND s.is_converted = 1 AND s.is_episode = 0 AND a.id IN ({})'.format(content_ids)
            cast['album'] = Album.objects.raw(sql_data)
        return cast
    def getSongList(album_id):
        songDetails = {
            'data': []
        }
        songData = {}
        data = []
        parent = Song.objects.get(is_episode = 0, id = album_id)
        poster = parent.poster
        album = Album.objects.values('permalink').get(pk=album_id)
        permalink = album['permalink']
        songs = list(Song.objects.filter(is_episode = 1, is_converted = 1, album_id = album_id).values('id','name','details','song_file_name','poster','duration','is_episode'))
        if songs != []:
            for song in songs:
                songData = {
                    "title" : song['name'],
                    "url" : 'http://localhost/soundstudio/uploads/media/'+song['song_file_name'],
                    "audio_poster" : 'http://localhost/soundstudio/uploads/image/'+poster,
                    "permalink" : '/album/'+permalink,
                    "duration" : song['duration'],
                    "is_episode" : str(song['is_episode']),
                    "content_id": str(song['id']),
                    "uniq_id":"0",
                    "movie_id": str(album_id),
                    "video_resolution":"",
                    "content_types_id":"5",
                    "cast":"",
                    "is_favourite" : "0"
                }
                data.append(songData)
            songDetails = {
                'data': data
            }
        return songDetails
