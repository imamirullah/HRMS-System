import os
from pathlib import Path
from dotenv import load_dotenv
from mongoengine import connect

# =========================
# Load environment variables
# =========================
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# =========================
# Core Settings
# =========================
SECRET_KEY = os.getenv("SECRET_KEY", "unsafe-secret-key")

DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# Render + local safe
ALLOWED_HOSTS = ["*"]  # OK for now, restrict later

# =========================
# Applications
# =========================
INSTALLED_APPS = [
    # Django default apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party apps
    "corsheaders",
    "rest_framework",

    # Local apps
    "employees",
    "attendance",
]

# =========================
# Middleware
# =========================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True

# =========================
# URL / WSGI
# =========================
ROOT_URLCONF = "hrms.urls"
WSGI_APPLICATION = "hrms.wsgi.application"

# =========================
# DATABASE (Disable Django ORM)
# =========================
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.dummy"
    }
}

# =========================
# MongoDB (MongoEngine)
# =========================
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
MONGO_DB_URL = os.getenv("MONGO_DB_URL")

if MONGO_DB_NAME and MONGO_DB_URL:
    connect(
        db=MONGO_DB_NAME,
        host=MONGO_DB_URL,
        uuidRepresentation="standard",
    )
else:
    print("⚠️ MongoDB ENV variables not set")

# =========================
# Django REST Framework (JSON only)
# =========================
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
    ),
    "DEFAULT_PARSER_CLASSES": (
        "rest_framework.parsers.JSONParser",
    ),
    "UNAUTHENTICATED_USER": None,
}

# =========================
# Internationalization
# =========================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# =========================
# Static Files
# =========================
STATIC_URL = "/static/"

# =========================
# Default PK
# =========================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
