#!/bin/bash

# Pull latest images
docker pull woutjuuh02/deelfabriek-kortrijk-2025-frontend:latest
docker pull woutjuuh02/deelfabriek-kortrijk-2025-backend:latest

# Get container directory from docker compose project
COMPOSE_DIR=$(docker inspect webhook-service | grep -o '"com.docker.compose.project.working_dir": "[^"]*"' | cut -d'"' -f4)

# Restart containers
cd $COMPOSE_DIR
docker-compose down frontend backend
docker-compose up -d frontend backend

# Log update
echo "$(date): Containers updated successfully" >> /scripts/update-log.txt