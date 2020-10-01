from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

from .manage import app, db

ma = Marshmallow(app)


from app.routes import create_story

app.register_blueprint(create_story)


db.create_all()
