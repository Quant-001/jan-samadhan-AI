from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("grievance_app", "0006_relax_legacy_user_columns"),
    ]

    operations = [
        migrations.AddField(
            model_name="complaint",
            name="complainant_email",
            field=models.EmailField(blank=True, max_length=254),
        ),
    ]
