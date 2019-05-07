from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.views.generic import TemplateView
from api.models import *
from .recom_engine import genre_recommendations
import json
import os
class HomePageView(TemplateView):
    template_name = "home.html"


def showAlbums(request, slug =''):
    castDetails = {}
    recommend = {}
    catlist = data.getMenu()
    result = data.getAlbumDetails(slug)
    album = result['album']
    songs = result['songs']
    title = ''
    album_type = 0
    recommendStatus = 0
    for i in album:
        title = i.title
        album_type = i.album_type
        castDetails = data.getCastDetailsOfContent(i.id, i.is_episode)
    if album_type == 0:
        arr = genre_recommendations(str(title))
        recommend = arr.to_dict('records')
        recommendStatus = 1
    return render(request, 'album.html', {"albums" : album, "recommended" : recommend,"songs" : songs, "casts" :castDetails, "menu" : catlist, "title" : "Albums", "detailsPage" : 1, 'recommendStatus' : recommendStatus})
def homePage(request):
    catlist = data.getMenu()
    newSingle = data.getSingle()
    newAlbum = data.getMulti()
    return render(request, 'home.html',{'menu' : catlist,'title' : 'Sound Studio', 'newSingle' : newSingle['data'], 'newAlbum' : newAlbum['data']})
def showCategory(request, slug =''):
    catlist = data.getMenu()
    catDetails = data.getCategoryDetails(slug)
    legalCat = 0
    totalAlbums = 0
    albums = []
    if(catDetails):
        legalCat = 1
        albums = data.getAlbums(catDetails.id)
        totalAlbums =  len(list(albums))
    return render(request, 'category.html',{'albums' : albums, 'menu' : catlist,'title' : 'Sound Studio', 'legalCat' : legalCat, 'totalAlbums' : totalAlbums})
def showCastDetails(request, slug =''):
    legalCast = 0
    totalAlbums = 0
    castname = ""
    albums = []
    catlist = data.getMenu()
    castDetails = data.getCastDetails(slug)
    if(castDetails['details'] != ""):
        legalCast = 1
        castname = castDetails['details']['name']
    if(castDetails['album'] != ""):
        totalAlbums = len(list(castDetails['album']))
        albums = castDetails['album']
    return render(request, 'artist.html',{'menu' : catlist, 'title' : castname, 'legalCast' : legalCast, 'totalAlbums' : totalAlbums, 'albums' : albums})
def getAllSongs(request):
    album_id = request.POST.get('album_id')
    songlist = data.getSongList(album_id)
    return JsonResponse(songlist)
def songList(request):
    list = data.getSongs()
    return JsonResponse(list)
def homePage(request):
    catlist = data.getMenu()
    return render(request, 'abiutus.html',{'menu' : catlist,'title' : 'Sound Studio'})
