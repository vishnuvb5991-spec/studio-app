# Generated migration file for bookings app

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
            name='Service',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('service_type', models.CharField(choices=[('photography', 'Photography'), ('videography', 'Videography'), ('album', 'Photo Album'), ('editing', 'Photo Editing'), ('drone', 'Drone Shots'), ('package', 'Complete Package')], max_length=20)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('duration_hours', models.IntegerField(default=1)),
                ('includes', models.JSONField(default=list)),
                ('is_active', models.BooleanField(default=True)),
                ('image', models.ImageField(blank=True, help_text='Upload high-resolution service image (Recommended: 800x600px, Max: 5MB)', max_length=500, null=True, upload_to='services/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='services', to='accounts.studioprofile')),
            ],
            options={
                'db_table': 'services',
            },
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('event_type', models.CharField(choices=[('wedding', 'Wedding'), ('pre_wedding', 'Pre-Wedding Shoot'), ('engagement', 'Engagement'), ('birthday', 'Birthday Party'), ('corporate', 'Corporate Event'), ('reception', 'Reception'), ('haldi', 'Haldi Ceremony'), ('mehendi', 'Mehendi Ceremony'), ('sangeet', 'Sangeet'), ('other', 'Other')], max_length=20)),
                ('event_name', models.CharField(max_length=255)),
                ('event_date', models.DateField()),
                ('event_time', models.TimeField()),
                ('event_end_date', models.DateField(blank=True, null=True)),
                ('venue_name', models.CharField(max_length=255)),
                ('venue_address', models.TextField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('advance_amount', models.DecimalField(decimal_places=2, default=0, max_digits=12)),
                ('advance_paid', models.BooleanField(default=False)),
                ('balance_amount', models.DecimalField(decimal_places=2, default=0, max_digits=12)),
                ('special_requests', models.TextField(blank=True)),
                ('guests_count', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customer_bookings', to=settings.AUTH_USER_MODEL)),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='accounts.studioprofile')),
                ('services', models.ManyToManyField(related_name='bookings', to='bookings.service')),
            ],
            options={
                'db_table': 'bookings',
                'ordering': ['-event_date'],
            },
        ),
        migrations.CreateModel(
            name='BookingNote',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('booking', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to='bookings.booking')),
            ],
            options={
                'db_table': 'booking_notes',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='TimeSlot',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('is_available', models.BooleanField(default=True)),
                ('booking', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='bookings.booking')),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='time_slots', to='accounts.studioprofile')),
            ],
            options={
                'db_table': 'time_slots',
                'unique_together': {('studio', 'date', 'start_time')},
            },
        ),
    ]
