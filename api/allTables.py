# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Album(models.Model):
    permalink = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    story = models.TextField()
    content_category = models.CharField(max_length=255, blank=True, null=True)
    genre = models.CharField(max_length=255)
    album_type = models.IntegerField()
    date_added = models.DateTimeField()
    date_updated = models.DateTimeField()
    album_status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'album'


class AlbumCast(models.Model):
    content_id = models.IntegerField()
    cast = models.ForeignKey('Cast', models.DO_NOTHING)
    cast_type = models.CharField(max_length=255)
    is_episode = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'album_cast'


class AlbumNew(models.Model):
    permalink = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    story = models.TextField()
    content_category = models.CharField(max_length=255, blank=True, null=True)
    genre = models.CharField(max_length=255)
    album_type = models.IntegerField()
    date_added = models.DateTimeField()
    date_updated = models.DateTimeField()
    album_status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'album_new'


class Blog(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    date_added = models.DateField()
    date_updated = models.DateField()

    class Meta:
        managed = False
        db_table = 'blog'


class Cast(models.Model):
    name = models.CharField(max_length=255)
    permalink = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    date_added = models.DateTimeField()
    date_updated = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'cast'


class Category(models.Model):
    name = models.CharField(max_length=255)
    permalink = models.CharField(max_length=255)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'category'


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Genre(models.Model):
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'genre'


class Song(models.Model):
    album_id = models.IntegerField()
    name = models.CharField(max_length=255, blank=True, null=True)
    details = models.CharField(max_length=255, blank=True, null=True)
    song_file_name = models.CharField(max_length=255)
    poster = models.TextField()
    is_converted = models.IntegerField()
    is_episode = models.IntegerField()
    duration = models.CharField(max_length=100)
    song_added = models.DateTimeField()
    song_updated = models.DateTimeField()
    song_status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'song'


class SongNew(models.Model):
    album = models.ForeignKey(AlbumNew, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    details = models.CharField(max_length=255, blank=True, null=True)
    song_file_name = models.CharField(max_length=255)
    poster = models.CharField(max_length=255)
    is_converted = models.IntegerField()
    is_episode = models.IntegerField()
    duration = models.CharField(max_length=100)
    song_added = models.DateTimeField()
    song_updated = models.DateTimeField()
    song_status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'song_new'


class User(models.Model):
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    date_registered = models.DateTimeField()
    date_updated = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user'
