# 备份恢复说明

> 创建日期：2026-05-30
> 备份文件：`C:\Users\Z1858\my-clone-backup-2026-05-30.tar.gz`

## 备份内容

| 内容 | 大小 | 说明 |
|------|------|------|
| 源码 `src/` | 5.2 MB | 全部页面、组件、路由 |
| 静态资源 `public/` | 237 MB | 图片、SEO 文件、视频 |
| 数据 `data/` | 1.3 MB | JSON 数据文件 |
| Git 元数据 `.git/` | ~5 MB | 配置、索引、钩子（不含对象库） |
| 配置 | — | package.json, tsconfig, 环境变量等 |
| 文档 `docs/` | ~840 KB | 研究文档、设计参考、技能文件 |

### 未包含（可重建）

| 内容 | 原因 | 恢复方式 |
|------|------|----------|
| `node_modules/` | npm 安装产物 | `npm install` |
| `.next/` | 构建缓存 | `npm run build` |
| `docs/compare/` | 2.2GB 截图 | 重新运行对比脚本 |
| `bun.lock` / `package-lock.json` | 锁文件 | `npm install` 重新生成 |
| `tsconfig.tsbuildinfo` | 编译缓存 | 自动生成 |

---

## 恢复步骤

### 完整恢复（推荐）

```bash
# 1. 进入用户目录
cd /c/Users/Z1858

# 2. 解压备份
tar xzf my-clone-backup-2026-05-30.tar.gz

# 3. 进入项目
cd my-clone

# 4. 安装依赖
npm install

# 5. 构建
npm run build
```

### 部分恢复（只恢复源码）

```bash
# 只解压 src 目录
tar xzf /c/Users/Z1858/my-clone-backup-2026-05-30.tar.gz -C /c/Users/Z1858 my-clone/src
```

### 查看备份内容

```bash
# 列出备份中的所有文件
tar tzf /c/Users/Z1858/my-clone-backup-2026-05-30.tar.gz | less

# 只看顶层目录
tar tzf /c/Users/Z1858/my-clone-backup-2026-05-30.tar.gz | awk -F/ '{print $2}' | sort -u
```

---

## 备份地址

```
C:\Users\Z1858\my-clone-backup-2026-05-30.tar.gz
```

如需移动到其他位置：

```bash
# 复制到 D 盘
cp /c/Users/Z1858/my-clone-backup-2026-05-30.tar.gz /d/backups/

# 或移动到外置硬盘
cp /c/Users/Z1858/my-clone-backup-2026-05-30.tar.gz /e/
```
