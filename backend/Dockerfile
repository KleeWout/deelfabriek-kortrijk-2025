# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Set environment variables to optimize build
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ENV DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
ENV DOTNET_NOLOGO=1

WORKDIR /source

# Copy project file and restore
COPY *.csproj .
RUN dotnet restore --verbosity minimal

# Copy everything else and publish
COPY . .
RUN dotnet publish --configuration Release --output /app --no-restore --verbosity minimal

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app
COPY --from=build /app .

# Define a safe default port
EXPOSE 3001

# Use dotnet instead of a native binary unless you self-contained
ENTRYPOINT ["dotnet", "deelfabriek-backend.dll"]
