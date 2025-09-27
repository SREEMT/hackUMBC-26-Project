# Hackathon Docker + Rails Guide

## 1. Common Docker + Rails Issues and Fixes

### Issue 1: `debug/prelude` load error
**Problem:** Rails 8 auto-adds the `debug` gem, which fails inside Docker.

**Fix:** Remove or comment it in `backend/Gemfile`:

```ruby
# gem "debug", "~> 1.0", group: :development
```

Then rebuild:

```bash
docker-compose build web
docker-compose run --rm web bundle install
```

---

### Issue 2: Missing `master.key`
**Problem:** Docker build fails because `config/master.key` doesn’t exist yet.

**Fix 1:** Create a dummy key for development:

```bash
touch backend/config/master.key
chmod 600 backend/config/master.key
```

**Fix 2:** Or ignore it in Docker:

Add to `backend/.dockerignore`:

```
config/master.key
```

---

### Issue 3: Rails container not accessible in browser
**Problem:** WSL/Docker networking or Rails binding issues.

**Fix:** Always start Rails with:

```bash
docker-compose run --rm --service-ports web rails s -b 0.0.0.0 -p 3000
```

- `-b 0.0.0.0` binds Rails to all interfaces inside the container.
- Use `http://localhost:3000` in your browser (or WSL IP if needed).

**Optional:** Detached mode:

```bash
docker-compose up -d web
docker-compose logs -f web
```

---

### Issue 4: Git file ownership issues
**Problem:** Git cannot create `.git/index.lock` because files were created by `sudo` or another user.

**Fix:** Change ownership:

```bash
sudo chown -R $(whoami):$(whoami) /home/tmeer/hackUMBC-26-Project/backend
```

---

### Issue 5: `backend/` nested Git repo
**Problem:** Rails backend has its own `.git` folder, preventing adding to main repo.

**Fix:** Remove nested Git folder:

```bash
rm -rf backend/.git
git add backend/
git commit -m "Add Rails backend"
```

---

## 2. Commands to Start/Stop Rails + Docker

### Build Docker images
```bash
docker-compose build
```

### Start Rails in development (foreground)
```bash
docker-compose run --rm --service-ports web rails s -b 0.0.0.0 -p 3000
```

### Start Rails in detached mode (background)
```bash
docker-compose up -d web
```

### Follow Rails logs
```bash
docker-compose logs -f web
```

### Stop Rails container
```bash
docker-compose stop web
```

### Stop all containers
```bash
docker-compose down
```

---

This workflow ensures:

1. Docker builds without errors.
2. Rails runs correctly in WSL/Mac/Windows.
3. Git works safely without ownership or nested repo issues.