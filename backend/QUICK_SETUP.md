# Quick Setup Guide

## 5-Minute Setup

### 1. Install Dependencies (2 min)
```bash
cd backend
npm install
```

### 2. Configure Environment (1 min)
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
DATABASE_URL=mysql://root:password@localhost:3306/amk_motors_db
JWT_SECRET=your-super-secret-key
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Setup Database (1 min)
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE amk_motors_db;"

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### 4. Start Server (1 min)
```bash
npm run dev
```

Server will be at `http://localhost:5000`

---

## Docker Setup (Recommended)

### Prerequisites
- Docker and Docker Compose installed

### Start Everything
```bash
docker-compose up -d
```

Services will be available at:
- **API**: http://localhost:5000
- **Database**: localhost:3306
- **phpMyAdmin**: http://localhost:8080

### Stop Everything
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f backend
```

---

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@localhost:3306/db` |
| `JWT_SECRET` | Token signing key | `your-secret-key` |
| `JWT_EXPIRE` | Token expiration | `24h` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_USER` | Email account | `your@gmail.com` |
| `SMTP_PASS` | Email app password | `xxxx xxxx xxxx xxxx` |
| `CLOUDINARY_NAME` | File storage service | From Cloudinary dashboard |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## Database Setup

### Option 1: Using MySQL CLI
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE amk_motors_db;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'app_password';
GRANT ALL PRIVILEGES ON amk_motors_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Option 2: Using Docker
```bash
docker run -d \
  --name amk_db \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=amk_motors_db \
  -p 3306:3306 \
  mysql:8.0
```

### Option 3: Using Docker Compose
```bash
docker-compose up -d db
```

---

## Gmail Setup (for emails)

1. **Enable 2FA** on your Google Account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
3. **Add to .env**:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```

---

## Cloudinary Setup (for file uploads)

1. **Create account** at https://cloudinary.com
2. **Get credentials** from dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. **Add to .env**:
   ```
   CLOUDINARY_NAME=your-name
   CLOUDINARY_API_KEY=your-key
   CLOUDINARY_API_SECRET=your-secret
   ```

---

## First Test

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "success",
  "message": "Server is running"
}
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

---

## Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1;"

# Check DATABASE_URL in .env
# Format: mysql://user:password@host:port/database
```

### Port Already in Use
```bash
# Change PORT in .env or Docker
# Or kill existing process:
lsof -i :5000  # Find process
kill -9 <PID>   # Kill it
```

### Email Not Sending
- Verify SMTP credentials
- Check "Less secure apps" is enabled for Gmail
- Use generated app password, not regular password
- Check firewall allows port 587

### Docker Issues
```bash
# Rebuild everything
docker-compose down -v
docker-compose up --build -d

# View logs
docker-compose logs -f backend
```

---

## Next Steps

1. ✅ Backend running
2. 📚 Read full [README.md](./README.md)
3. 📖 Read [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
4. 🧪 Run tests: `npm test`
5. 🚀 Deploy to production

---

## Development Commands

```bash
# Start dev server with auto-reload
npm run dev

# Build TypeScript
npm run build

# Start production build
npm start

# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm test

# Database commands
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run migrations
npm run prisma:seed       # Seed database
npm run prisma:studio     # Open Prisma Studio
```

---

## Production Checklist

Before deploying:

- [ ] Update all `.env` values for production
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT secrets
- [ ] Configure production database
- [ ] Setup HTTPS/SSL
- [ ] Configure email service
- [ ] Setup Cloudinary
- [ ] Enable CORS for your domain
- [ ] Run database migrations
- [ ] Test all endpoints
- [ ] Setup monitoring/logging
- [ ] Configure backups
- [ ] Setup CI/CD pipeline

---

## Support

- 📖 Full Documentation: [README.md](./README.md)
- 🛠️ Implementation Details: [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- 💻 API Endpoints: Check README.md for full API docs
- 🐳 Docker Help: See [docker-compose.yml](./docker-compose.yml)
