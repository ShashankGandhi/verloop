# verloop

# Steps to start


1. Go to verloop1/docker
2. Do docker-compose build
3. Do docker-compose up -d (-d is for detached mode)
4. Do docker ps, you will see 2 containers (web_1 and db_1)
5. Wait for some time to create database and set up, then go in db container with this command
  - “docker exec -it db_1 /bin/bash”  OR
  - mysql -uuser -p -h127.0.0.1 (If you have mysql installed locally). Password is defined in docker/env-variables (MYSQL_PASSWORD)
  - CREATE DATABASE IF NOT EXISTS verloop; (Use this to create database if not created already)
6. Now in a new terminal, open web container with this command
  - “docker exec -it web_1 /bin/bash”
7. Node modules will be installed automatically with web docker startup
8. Go the folder where node app is there
  - cd /root/web
9. Check if forever process is stopped, that is because the database is not created till then, if STOPPED then do
  - forever restartall
  - tai
  Else Start app.js with 
  - node or 
  - nodemon (will have to start this)
  - forever via this command “forever start -c "node --max_old_space_size=$NODE_THREAD_SIZE" -f app.js”
10. (If doing via forever process) Then do forever list to see all forever processes
11. (If doing via forever process)  Tail the logfile to see logs
12. On node startup, all models will be synced with the database and tables will be created


# Points for improvement

1. Tried with Flask but there were some module issue with auto-create tables hence started with node
2. In node, 
  - Divided the words in sentence with a space, this could be any other separator.
  - For get /stories API, expecting to get those params in by extracting it from req.query. Sample request: 
    localhost:4000/stories?limit=100&offset=20&order=asc&sort=created_at
  - For get /stories API, default value if parameter not present
    limit: 100
    offset: 0
    sort: ‘created_at’
    order: asc
