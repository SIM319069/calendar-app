# Configuration
$DOCKER_USERNAME = "sim31906"
$VERSION = "1.0.0"

Write-Host "Building and deploying Calendar App..." -ForegroundColor Green

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
Set-Location frontend
docker build -f Dockerfile.prod -t ${DOCKER_USERNAME}/calendar-frontend:${VERSION} .
docker tag ${DOCKER_USERNAME}/calendar-frontend:${VERSION} ${DOCKER_USERNAME}/calendar-frontend:latest

# Build backend
Write-Host "Building backend..." -ForegroundColor Yellow
Set-Location ../backend
docker build -t ${DOCKER_USERNAME}/calendar-backend:${VERSION} .
docker tag ${DOCKER_USERNAME}/calendar-backend:${VERSION} ${DOCKER_USERNAME}/calendar-backend:latest

# Push to Docker Hub
Write-Host "Pushing to Docker Hub..." -ForegroundColor Yellow
docker push ${DOCKER_USERNAME}/calendar-frontend:${VERSION}
docker push ${DOCKER_USERNAME}/calendar-frontend:latest
docker push ${DOCKER_USERNAME}/calendar-backend:${VERSION}
docker push ${DOCKER_USERNAME}/calendar-backend:latest

Write-Host "Deployment complete!" -ForegroundColor Green