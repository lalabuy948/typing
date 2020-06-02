#!/bin/bash 

cd ..
cd backend
docker build -t typing-backend -f Dockerfile .
docker run -v $(pwd)/:/go/src/builder typing-backend go get
docker run -v $(pwd)/:/go/src/builder typing-backend go build
kill -9 `cat run.pid`
nohup ./backend  >/var/log/go-server.log 2>&1 & echo $! > run.pid
cd ..
cd frontend
docker build -t typing-frontend -f Dockerfile .
docker run -v $(pwd)/:/frontend typing-frontend npm install
docker run -v $(pwd)/:/frontend typing-frontend npm run build
cd ..
service nginx restart
