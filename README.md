# 成交宝

客户跟进 + AI 成交助手。

当前版本已经具备这些能力：
- 管理员登录
- Dashboard 控制台
- 客户新增 / 编辑 / 删除 / 导出 CSV
- 客户搜索 / 阶段筛选
- 跟进记录新增
- AI 话术生成与保存
- 本地持久化数据存储
- OpenRouter 真 AI 接口接入位（未配置 key 时自动回退本地生成）
- Health 检查接口
- Docker / docker-compose 部署入口

---

## 默认登录信息

默认管理员账号密码在 `.env` 里：

```env
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="12345678"
```

**上线前务必改掉。**

---

## 环境变量

复制并编辑：

```bash
cp .env.example .env
```

关键配置：

```env
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="12345678"
OPENROUTER_API_KEY="你的key"
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
OPENROUTER_MODEL="openai/gpt-4o-mini"
```

---

## 本地开发

```bash
npm install
npm run dev
```

打开：
- <http://localhost:3000>
- <http://localhost:3000/login>

---

## 生产启动

```bash
npm install
npm run build
npm run start:prod
```

默认监听：
- `http://0.0.0.0:3000`

---

## 健康检查

接口：

```bash
curl http://localhost:3000/api/health
```

本地检查脚本：

```bash
npm run check
```

---

## Docker 部署

### 方式 1：docker build + docker run

```bash
docker build -t chengjiaobao .
docker run -d \
  --name chengjiaobao \
  -p 3000:3000 \
  --restart unless-stopped \
  --env-file .env \
  -v $(pwd)/data:/app/data \
  chengjiaobao
```

### 方式 2：docker compose

```bash
docker compose up -d --build
```

---

## Nginx 反代

示例配置文件：

- `deploy/nginx.chengjiaobao.conf.example`

把域名改成你自己的，然后反代到：
- `http://127.0.0.1:3000`

---

## 数据存储

当前版本为了快速成品，使用：
- `data/customers.json`

适合：
- 单机
- 单管理员
- 快速上线验证

后续如需正式 SaaS，可再迁到 PostgreSQL。

---

## 当前成品路线

这是**最快成品方案**：
- 单管理员登录
- 文件持久化
- OpenRouter 可选接入
- 先把能跑、能用、能演示、能继续部署的系统做出来

建议下一步：
1. 修改管理员密码
2. 确认 OpenRouter key 生效
3. 用 Docker / VPS 部署
4. 后续再切数据库和多用户
