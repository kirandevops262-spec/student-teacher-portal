# Student–Teacher Portal — Three Tier Application

A full-stack three-tier application built with React.js, Node.js, and MySQL. Supports both **local Docker** deployment and **AWS ECS + RDS** deployment from a single branch.

## Project Structure

```
├── backend/        # Node.js Express API
├── frontend/       # React.js UI
├── database/       # MySQL Dockerfile
└── docker-compose.yaml
```

## Local Deployment

```bash
docker-compose up --build
```

Visit: http://localhost:80

## AWS ECS Deployment

1. Store DB credentials in AWS SSM Parameter Store:
   - `/myapp/db/host`
   - `/myapp/db/user`
   - `/myapp/db/password`
   - `/myapp/db/name`

2. Set environment variable in your ECS task definition:
   ```
   USE_SSM=true
   AWS_REGION=us-east-1
   ```

3. Backend health check endpoints:
   - `GET /health` — used by ALB target group
   - `GET /health/db` — checks RDS connectivity

## Environment Variables

### Backend
| Variable | Local | AWS ECS |
|----------|-------|---------|
| `USE_SSM` | `false` | `true` |
| `host` | `db` (container name) | not needed (SSM) |
| `user` | `root` | not needed (SSM) |
| `password` | `mysql123` | not needed (SSM) |
| `database` | `school` | not needed (SSM) |
| `AWS_REGION` | not needed | `us-east-1` |

### Frontend
| Variable | Value |
|----------|-------|
| `REACT_APP_API_BASE_URL` | `http://localhost:3500` (local) or ALB DNS (AWS) |
