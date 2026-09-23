# Linear Clone

Project → Issues → Sub-issues，加上 Releases 的 Linear 风格项目管理工具。

- **frontend**：Vite + React 19 + Tailwind 4 + TanStack Query + react-router
- **backend**：NestJS 12（code-first GraphQL）+ TypeORM + PostgreSQL
- **契约**：`backend/schema.graphql`。前端用 graphql-codegen 从它生成类型化的 GraphQL 文档，后端改了 schema，前端类型检查就会报错

## 启动

```bash
npm install
```

数据库二选一：

- 没有现成的 PostgreSQL：`npm run db:dev`（在 `backend/.pgdata` 里起一个嵌入式 PostgreSQL，端口 54329，保持该终端运行）
- 用自己的 PostgreSQL：建好库后把 `backend/.env` 里的 `DATABASE_URL` 改成你的连接串

```bash
cp backend/.env.example backend/.env   # 首次，记得把 JWT_SECRET 换成随机字符串
npm run seed -w backend                # 跑迁移 + 灌演示数据（库里已有数据会跳过）
npm run dev:backend                    # http://localhost:4000/graphql（GraphiQL）
npm run dev:frontend                   # http://localhost:5173
```

后端启动时会自动执行迁移。种子数据里 4 个用户的密码都是 `password123`（如 `ada@example.com`），登录页也能自己注册新账号。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run codegen` | 重新生成 `backend/schema.graphql`，再生成前端 `src/graphql/generated`（改了 resolver / 前端 GraphQL 文档后运行） |
| `npm test` | 后端 + 前端单测 |
| `npm run build` | 后端 `nest build`，前端 `tsc -b && vite build` |

## 功能

- **登录**：邮箱 + 密码，JWT（`Authorization: Bearer`），token 存在浏览器 `localStorage`；除了 `login` / `register` 之外的 GraphQL 操作都要求登录
- **Projects**：名称、2–5 位 key（issue 编号前缀，如 `WEB-12`）、状态、优先级、负责人、成员（多选）、开始/目标日期、按 issue 完成度算出的进度；新建 project 用的是仿 Linear 的大面板（图标 + 大标题 + 一排属性 chip + 描述）
- **Issues**：状态（Backlog → Done / Canceled）、优先级、负责人、截止日期；列表视图和看板视图（拖拽换状态，乐观更新）；筛选；`C` 快捷键新建
- **Sub-issues**：任意层级嵌套；父 issue 上显示子 issue 进度；详情页可直接添加子 issue、修改父级
- **Releases**：属于某个 project，状态（Planned / In Progress / Completed / Canceled）、版本号、目标日期、进度；issue 可归入 release，release 页可批量添加 issue
- **Labels**：工作区级的标签（内置 Feature / Bug / Improvement，只读），一个 issue 可打多个标签；列表行、看板卡片展示标签 chip，详情页属性栏和新建弹窗里可多选
- **Description 里可以放图片**：往 issue / project / release 的描述框里粘贴或拖拽图片（PNG/JPEG/GIF/WebP，≤8MB），会自动上传并以 `![](url)` 形式插入；非编辑状态下这类图片会直接渲染出来

业务规则（都在后端 service 层，有单测）：

- 子 issue 必须和父 issue 在同一个 project；移动 issue 时禁止形成环（用递归 CTE 检查祖先链）
- issue 只能加入所属 project 的 release
- 状态变为 Done 时记录 `completedAt`，离开 Done 时清空；release 变为 Completed 时记录 `releasedAt`
- 删除父 issue 后子 issue 变成顶层 issue；删除 release 后其 issue 保留在 project 里；删除 project 级联删除其 issue 和 release
- 进度只统计未取消的 issue
- 密码用 bcrypt 哈希（`users.password_hash`，`select: false`，默认查询不会带出来）；邮箱重复注册会报错
- Project 成员是独立的多对多表 `project_members`（不是 entity 上的字段），通过 DataLoader 批量查询；成员 id 必须都存在，否则整个创建/更新会报错
- 图片上传是一个单独的 REST 端点（`POST /uploads`，登录态保护，用的是同一个 JWT guard），不是 GraphQL 的一部分；文件存在 `backend/uploads/`（已 gitignore），按 `/uploads/<uuid>.<ext>` 静态托管
- 标签是独立的多对多表 `issue_labels`（不在 `issues` 表上加字段）；`labelIds` 是全量替换，传 `[]` 清空，去重后校验 id 是否存在，不存在则整个创建/更新报错；删除 issue 时关联记录级联删除

## 分层

两端都是 UI → controller → service → repository，不跳层。

| 层 | backend | frontend |
| --- | --- | --- |
| UI | — | `pages/` `components/` `ui/`，只负责渲染 |
| controller | `*.resolver.ts`（参数、字段解析） | `controllers/`（React Query hooks，把 UI 和 service 接起来） |
| service | `*.service.ts`（业务规则） | `services/`（校验、排序/分组、用例编排） |
| repository | `*.repository.ts`（TypeORM，唯一碰数据库的地方） | `repositories/`（GraphQL 文档，唯一碰网络的地方） |

后端的关联字段（assignee / project / sub-issues / progress）通过每个请求一份的 DataLoader 批量加载，避免 N+1。

## 说明

- 没有角色 / 权限分级：登录后所有人共用一个工作区，能看到和改动所有 project/issue/release
- 前端开发服务器把 `/graphql` 代理到 `localhost:4000`；部署时可用 `VITE_GRAPHQL_URL` 指定后端地址
