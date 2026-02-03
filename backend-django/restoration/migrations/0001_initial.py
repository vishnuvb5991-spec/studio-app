# Generated migration file for restoration app

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
            name='RestorationOrder',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('service_type', models.CharField(choices=[('basic', 'Basic Restoration'), ('advanced', 'Advanced Restoration'), ('colorization', 'Colorization'), ('enhancement', 'Enhancement'), ('reconstruction', 'Reconstruction')], max_length=20)),
                ('priority', models.CharField(choices=[('normal', 'Normal (5-7 days)'), ('express', 'Express (2-3 days)'), ('urgent', 'Urgent (24 hours)')], default='normal', max_length=20)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('reviewing', 'Under Review'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('delivered', 'Delivered'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('estimated_price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('final_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('is_paid', models.BooleanField(default=False)),
                ('due_date', models.DateField(blank=True, null=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='restoration_orders', to=settings.AUTH_USER_MODEL)),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='restoration_orders', to='accounts.studioprofile')),
            ],
            options={
                'db_table': 'restoration_orders',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='RestorationImage',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('image', models.ImageField(upload_to='restoration/')),
                ('image_type', models.CharField(choices=[('original', 'Original Image'), ('restored', 'Restored Image')], max_length=20)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='restoration.restorationorder')),
            ],
            options={
                'db_table': 'restoration_images',
            },
        ),
        migrations.CreateModel(
            name='RestorationReview',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('rating', models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('comment', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='review', to='restoration.restorationorder')),
            ],
            options={
                'db_table': 'restoration_reviews',
            },
        ),
    ]
