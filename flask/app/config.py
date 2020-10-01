import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Set Flask configuration from env variables."""

    # General Config
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY')
    HOST = os.getenv('FLASK_HOST')
    PORT = os.getenv('FLASK_PORT')
    CSRF_ENABLED = True

    # Database
    FLASK_CONNECTION = os.getenv('FLASK_CONNECTION')
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')
    SQLALCHEMY_DATABASE_URI = os.getenv('FLASK_CONNECTION') + '/' + os.getenv('MYSQL_DATABASE')
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
