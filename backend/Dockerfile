# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /source

# Copy project file and restore
COPY *.csproj .
RUN dotnet restore

# Copy everything else and publish
COPY . .
RUN dotnet publish --configuration Release --output /app

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app
COPY --from=build /app .

# Copy the Uploads directory to include initial content
# This ensures your uploaded files are included in the container
COPY Uploads/ /app/Uploads/

# Create directory with proper permissions before the volume is mounted
RUN mkdir -p /app/Uploads && \
    chown -R 1000:1000 /app/Uploads && \
    chmod -R 777 /app/Uploads

# Define a safe default port
EXPOSE 3001

# Use dotnet instead of a native binary unless you self-contained
ENTRYPOINT ["dotnet", "deelfabriek-backend.dll"]



# docker build -t deelfabriek-backend
# docker run -d -p 3001:3001 deelfabriek-backend
#docker buildx build --platform linux/arm64 -t woutjuuh02/deelfabriek-kortrijk-2025-backend:arm64 --push -f backend/Dockerfile backend/