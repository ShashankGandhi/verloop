"""Data models."""
from sqlalchemy.dialects.mysql import INTEGER, VARCHAR, TINYINT, FLOAT, MEDIUMTEXT, DATE, DATETIME, JSON
from . import db
from datetime import datetime

class Story(db.Model):
    __tablename__ = 'stories'
    """
    Title is made up of 2 words
    Story is made up of 7 paragraphs
    """

    id = db.Column(INTEGER(11),primary_key=True)
    title = db.Column(VARCHAR(256),index=False,unique=True,nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updatedAt = db.Column(db.DateTime, nullable=False, default=datetime.now)
