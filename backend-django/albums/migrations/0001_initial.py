# Generated migration file for albums app

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('album_type', models.CharField(choices=[('wedding', 'Wedding'), ('pre_wedding', 'Pre-Wedding'), ('engagement', 'Engagement'), ('birthday', 'Birthday'), ('corporate', 'Corporate Event'), ('portrait', 'Portrait'), ('family', 'Family'), ('other', 'Other')], default='wedding', max_length=20)),
                ('event_date', models.DateField(blank=True, null=True)),
                ('cover_image', models.ImageField(blank=True, help_text='Upload high-resolution cover image (Recommended: 1920x1080px, Max: 10MB)', max_length=500, null=True, upload_to='album_covers/')),
                ('status', models.CharField(choices=[('draft', 'Draft'), ('processing', 'Processing'), ('ready', 'Ready'), ('delivered', 'Delivered')], default='draft', max_length=20)),
                ('is_public', models.BooleanField(default=False)),
                ('password', models.CharField(blank=True, max_length=50)),
                ('view_count', models.IntegerField(default=0)),
                ('download_count', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customer_albums', to=settings.AUTH_USER_MODEL)),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='albums', to='accounts.studioprofile')),
            ],
            options={
                'db_table': 'albums',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('image', models.ImageField(help_text='Upload high-resolution photo (Recommended: 3000x2000px, Max: 20MB)', max_length=500, upload_to='album_photos/')),
                ('thumbnail', models.ImageField(blank=True, help_text='Auto-generated thumbnail (300x300px)', max_length=500, null=True, upload_to='album_thumbnails/')),
                ('title', models.CharField(blank=True, max_length=255)),
                ('description', models.TextField(blank=True)),
                ('order', models.IntegerField(default=0)),
                ('is_featured', models.BooleanField(default=False)),
                ('is_downloadable', models.BooleanField(default=True)),
                ('download_count', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='albums.album')),
            ],
            options={
                'db_table': 'photos',
                'ordering': ['order', 'created_at'],
            },
        ),
        migrations.CreateModel(
            name='AlbumShare',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('shared_with_email', models.EmailField(max_length=254)),
                ('can_download', models.BooleanField(default=True)),
                ('expires_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shares', to='albums.album')),
                ('shared_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'album_shares',
                'unique_together': {('album', 'shared_with_email')},
            },
        ),
    ]
