# Generated manually for the Supabase Auth identity link.

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='supabase_user_id',
            field=models.UUIDField(blank=True, null=True, unique=True),
        ),
    ]
