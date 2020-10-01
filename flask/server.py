from app import app, db
app.config.from_object('app.config.Config')

# Run Server
if __name__ == '__main__':
    db.create_all()
    print(' done with tables')
    app.secret_key = app.config['SECRET_KEY']
    app.run(
        debug=app.config['DEBUG'],
        host=app.config['HOST'],
        port=app.config['PORT']
    )
