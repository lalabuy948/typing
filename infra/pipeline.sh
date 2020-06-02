#!/bin/bash 

cd ..
cd backend
echo "building backend image..."
docker build -t typing-backend -f Dockerfile .
echo "getting go dependencies..."
docker run -v $(pwd)/:/go/src/builder typing-backend go get
echo "building go application..."
docker run -v $(pwd)/:/go/src/builder typing-backend go build
echo "killing previous backend..."
kill -9 `cat run.pid`
echo "starting new backend..."
nohup ./backend  >/var/log/go-server.log 2>&1 & echo $! > run.pid
echo "going to frontend folder..."
cd ..
cd frontend
echo "building frontend image..."
docker build -t typing-frontend -f Dockerfile .
echo "getting npm dependencies..."
docker run -v $(pwd)/:/frontend typing-frontend npm install
echo "building react application..."
docker run -v $(pwd)/:/frontend typing-frontend npm run build
echo "restarting nginx..."
service nginx restart
