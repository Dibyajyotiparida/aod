from django.conf.urls import url, include
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from . import views


urlpatterns = [
    url(r'^$', views.homePage, name='home'),
    url(r'^album/(?P<slug>[\w-]+)/$', views.showAlbums, name='album'),
    url(r'^category/(?P<slug>[\w-]+)/$', views.showCategory, name='category'),
    url(r'^artist/(?P<slug>[\w-]+)/$', views.showCastDetails, name='artist'),
    url(r'^get-all-song-list/$', views.getAllSongs, name='get-all-song-list'),
    url(r'^song-list/$', views.songList, name='song-list'),
    url(r'^about-us/$', views.aboutus, name='about-us'),
]
