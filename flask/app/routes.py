from flask import Flask, request, jsonify, Blueprint

create_story = Blueprint('create_story', __name__)

@create_story.route('/add', methods=['POST'])
def add():
  print('in /add')
  pass
