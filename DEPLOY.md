# 部署到 Proxmox 容器（Docker Compose）

假设容器是全新的 Debian/Ubuntu，什么都还没装。

## 1. 装 Docker

```bash
curl -fsSL https://get.docker.com | sh
```

如果这个 Proxmox 容器是 **非特权 LXC**（unprivileged），Docker 大概率跑不起来（cgroup/namespace 权限不够）。两种解法：
- 在 Proxmox 宿主机上把这个 LXC 建成 **特权容器**（Options → 勾 "Unprivileged container" 为否），或者
- 直接用一个轻量 VM 代替 LXC 跑 Docker

装完之后验证一下：

```bash
docker run --rm hello-world
```

## 2. 拉代码

```bash
git clone <你的仓库地址> pulse
cd pulse
```

## 3. 配置环境变量

```bash
cp .env.production.example .env
```

编辑 `.env`，至少要改：
- `POSTGRES_PASSWORD`：随便一个强密码
- `JWT_SECRET`：`openssl rand -base64 48` 生成一个
- `FRONTEND_ORIGIN`：容器的访问地址，比如 `http://192.168.1.100`（局域网 IP）或以后配了域名就填域名
- `HTTP_PORT`：不想用 80 就改成别的，比如 `8080`

## 4. 起服务

```bash
docker compose up -d --build
```

首次启动会：build 前端/后端镜像 → 起 Postgres → 后端自动跑数据库迁移（`migrationsRun: true`，不需要手动建表）。

看日志确认都起来了：

```bash
docker compose ps
docker compose logs -f backend
```

打开 `http://<容器IP或域名>:<HTTP_PORT>`，在登录页点注册，建你自己的账号（种子数据不会自动灌，是空的工作区）。

如果想要仓库自带的演示数据（4 个示例用户 + 项目/issue）：

```bash
docker compose exec backend node dist/cli/seed.js
```

## 5. 更新部署

以后改了代码（不管是在这边 develop 还是别处），在容器里：

```bash
git pull
docker compose up -d --build
```

后端容器重启时会自动跑新增的 migration。

## 6. 备份

- 数据库：`docker compose exec db pg_dump -U postgres linear > backup.sql`
- 上传的图片：数据卷 `pulse_uploads-data`（`docker volume inspect pulse_uploads-data` 看实际路径）

## 架构说明

```
浏览器 → nginx(frontend 容器, 80端口) ──┬─ / 静态文件（前端产物）
                                        ├─ /graphql  → backend:4000
                                        └─ /uploads  → backend:4000
                                    backend:4000 → db:5432 (Postgres)
```

前端和后端同源（都走 nginx 的 80 端口），所以浏览器里不会有跨域请求，也就不需要额外配置 CORS 白名单去匹配具体域名/IP——`FRONTEND_ORIGIN` 这个变量目前基本用不上，只有极少数直连后端 4000 端口的场景才会校验它，保留是为了以后可能有别的客户端直连时兜底。

## 和这边 Claude Code 开发环境的关系

这个云端会话（Claude Code）是一个独立的临时沙箱，跟你 Proxmox 容器里跑的生产实例完全不共享任何东西（没有网络直连、没有共享数据库）。工作流建议：

1. 在这边继续开发、提交、推送到 GitHub（当前分支/PR：`claude/beautiful-johnson-qwcdyx` / <https://github.com/Summer-luna/pulse/pull/1>）
2. 需要发布新版本时，去 Proxmox 容器里 `git pull` 对应分支 + `docker compose up -d --build`

两边完全解耦，容器里的生产数据不会因为这边继续开发而受影响。
