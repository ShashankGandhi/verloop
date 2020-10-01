from __future__ import absolute_import
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager

# from models.story import Story
# from models.paragraph import Paragraph
# from models.sentence import Sentence
# Init app
app = Flask(__name__)
app.config.from_object('app.config.Config')

# Init db
db = SQLAlchemy(app)


if __name__ == "__main__":
    manager = Manager(app)
    manager.run()
