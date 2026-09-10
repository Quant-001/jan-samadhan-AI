from django.core.management.base import BaseCommand, CommandError

from grievance_app.models import Complaint, ComplaintHistory, Department, Notification, User


class Command(BaseCommand):
    help = "Delete all application data. Requires --confirm."

    def add_arguments(self, parser):
        parser.add_argument(
            "--confirm",
            action="store_true",
            help="Confirm permanent deletion of users, complaints, departments, and notifications.",
        )

    def handle(self, *args, **options):
        if not options["confirm"]:
            raise CommandError("This permanently deletes application data. Re-run with --confirm.")

        ComplaintHistory.objects.all().delete()
        Notification.objects.all().delete()
        Complaint.objects.all().delete()
        Department.objects.all().delete()
        deleted_users, _ = User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f"Application data reset. Deleted {deleted_users} database rows."))