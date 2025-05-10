# AI-Powered Chat Laravel

This project is a real-time chat application built with Laravel 11, Laravel Reverb, Inertia.js, React, Vite, MySQL, and Redis. The entire development environment runs in Docker using a single container for the Laravel app, Vite dev server, and Reverb WebSocket server.

## Features
- Real-time chat using Laravel Reverb
- React frontend with hot reload via Vite
- MySQL and Redis for storage and queues
- All-in-one Docker setup for easy development

## Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ai-powered-chat-laravel
   ```

2. **Copy the example environment file and edit as needed:**
   ```bash
   cp .env.example .env
   # Edit .env to set your REVERB_APP_KEY, DB credentials, etc.
   ```
   > **Note:** Do not use quotes around your environment variable values.

3. **Start the containers:**
   ```bash
   docker compose up -d --build
   ```

4. **Generate the Laravel application key and clear config cache:**
   ```bash
   docker compose exec app php artisan key:generate
   docker compose exec app php artisan config:clear
   ```

5. **Run migrations:**
   ```bash
   docker compose exec app php artisan migrate
   ```

6. **Access the app:**
   - Laravel app: [http://localhost:8000](http://localhost:8000)
   - Vite dev server: [http://localhost:5173](http://localhost:5173)
   - Reverb WebSocket: ws://localhost:8080
   - Adminer (DB UI): [http://localhost:8081](http://localhost:8081)

## Development Notes
- All code changes (PHP, JS, React) are hot-reloaded.
- The `app` service runs Laravel, Vite, and Reverb together.
- You **do not need** `Dockerfile.reverb` or `Dockerfile.vite` anymore.
- Environment variables for Reverb and Vite must not be quoted.

## Troubleshooting
- If you see `Application does not exist` in the WebSocket logs, ensure your `REVERB_APP_KEY` matches everywhere and is not quoted.
- To view logs:
  ```bash
  docker compose logs -f app
  docker compose exec app cat /var/www/storage/logs/reverb.log
  docker compose exec app cat /var/www/storage/logs/vite.log
  ```

## License
MIT
