"""Data models."""
from sqlalchemy.dialects.mysql import INTEGER, VARCHAR, TINYINT, FLOAT, MEDIUMTEXT, DATE, DATETIME, DECIMAL, JSON
from . import db
from datetime import datetime

class Paragraph(db.Model):
    __tablename__ = 'paragraphs'

    """
    1 paragraph is made up of 10 sentences
    """
    id = db.Column(INTEGER(11),primary_key=True)
    story_id = db.Column(db.ForeignKey('stories.id'))
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updatedAt = db.Column(db.DateTime, nullable=False, default=datetime.now)
