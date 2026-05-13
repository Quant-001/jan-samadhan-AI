from urllib.parse import quote

from django.conf import settings
from django.core import signing
from django.core.mail import send_mail
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes

from .models import User


EMAIL_VERIFICATION_SALT = "grievance_app.email_verification"


def make_email_verification_token(user):
    return signing.dumps(
        {"user_id": user.pk, "email": user.email},
        salt=EMAIL_VERIFICATION_SALT,
    )


def make_email_verification_link(user):
    token = make_email_verification_token(user)
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173").rstrip("/")
    return f"{frontend_url}/verify-email/{uidb64}/{quote(token, safe='')}"


def send_verification_email(user):
    if not user.email:
        return False

    verification_link = make_email_verification_link(user)
    subject = "Verify your Jan Samadhan AI email"
    message = (
        f"Hello {user.first_name or user.username},\n\n"
        "Please verify your email address before submitting a complaint on Jan Samadhan AI.\n\n"
        f"Verify email: {verification_link}\n\n"
        "This link will expire automatically."
    )
    sent = send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=getattr(settings, "DEBUG", False),
    )
    return sent > 0


def verify_email_token(uidb64, token):
    user_id = force_str(urlsafe_base64_decode(uidb64))
    payload = signing.loads(
        token,
        salt=EMAIL_VERIFICATION_SALT,
        max_age=getattr(settings, "EMAIL_VERIFICATION_MAX_AGE_SECONDS", 172800),
    )
    user = User.objects.get(pk=user_id, email=payload.get("email"))
    if int(payload.get("user_id")) != user.pk:
        raise signing.BadSignature("User mismatch")
    return user
