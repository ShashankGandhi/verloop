"""Data models."""
from sqlalchemy.dialects.mysql import INTEGER, VARCHAR, TINYINT, FLOAT, MEDIUMTEXT, DATE, DATETIME, DECIMAL, JSON
from . import db
from datetime import datetime

class Sentence(db.Model):
    __tablename__ = 'sentences'
    """
    1 sentence is made up of 15 words
    """
    id = db.Column(INTEGER(11),primary_key=True)
    paragraph_id = db.Column(db.ForeignKey('paragraphs.id'))
    words = db.Column(JSON)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updatedAt = db.Column(db.DateTime, nullable=False, default=datetime.now)
