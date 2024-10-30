#!/bin/bash

MOGU_DIR="/root/mogu_web"
DOCKER_CONTAINER="vue_mogu_web"
NGINX_PATH="/usr/share/nginx/html"

cd "$MOGU_DIR" || { echo "Failed to change directory to $MOGU_DIR"; exit 1; }

unzip dist.zip || { echo "Failed to unzip dist.zip"; exit 1; }

docker exec "$DOCKER_CONTAINER" bash -c "rm -rf $NGINX_PATH/*"

docker cp "$MOGU_DIR/dist/" "$DOCKER_CONTAINER:$NGINX_PATH/" || { echo "Failed to copy dist directory to Docker container"; exit 1; }

docker exec "$DOCKER_CONTAINER" bash -c "
  cd dist && \
  cp -r * $NGINX_PATH/ && \
  cd .. && \
  rm -rf $NGINX_PATH/dist/ && \
  sed -i 's/\r$//' $NGINX_PATH/env.sh && \
  chmod +x $NGINX_PATH/env.sh
" || { echo "Failed to deploy in Docker container"; exit 1; }

docker restart "$DOCKER_CONTAINER" || { echo "Failed to restart Docker container"; exit 1; }

rm -rf $MOGU_DIR/*

echo "Web deploy completed"
