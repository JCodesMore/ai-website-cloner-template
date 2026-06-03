# 筛选系统维护手册

## 架构总览

```
bbxin.com (实时数据源)
     │
     ├── build-filter-maps.cjs ──► src/lib/filter-maps.ts (静态ID映射)
     │                                       │
     │                                       ▼
     │                              src/lib/filters.ts (过滤引擎)
     │                                       │
     │                                       ▼
     │                              page.tsx (company / person / pledge)
     │
     └── compare-filters.cjs ──► 对比本地 vs bbxin，检测漂移
         verify-filters.cjs   ──► 按产品 ID 精确对比，抽查关键组合
```

## 三页面对比

| 页面 | bbxin 筛选维度 | 本地筛选实现 | filter-maps 数据 |
|------|---------------|-------------|-----------------|
| 企业贷款 (company) | 7 tag + 8 adv + 组合 | `filterByIk` → `filterByTagAndAdv` | companyFilterMap（36 条） |
| 个人贷款 (person) | 7 adv（无 tag） | `filterByIk` → `filterByAdv` | personFilterMap（7 条） |
| 抵押贷款 (pledge) | 仅机构类型 (ik) | `filterByIk` | 无（不需要 tag/adv 映射） |

## 核心文件

| 文件 | 职责 |
|------|------|
| `src/lib/filter-maps.ts` | 静态映射表。companyFilterMap（36 条）+ personFilterMap（7 条）。**这是唯一的数据源。** |
| `src/lib/filters.ts` | 过滤引擎。`filterByIk`（机构类型）、`filterByTag`、`filterByAdv`、`filterByTagAndAdv`（标签/优势）。 |
| `src/app/products/company/page.tsx` | 企业贷款：ik → tag+adv 组合过滤 |
| `src/app/products/person/page.tsx` | 个人贷款：ik → adv 过滤（无 tag，无组合） |
| `src/app/products/pledge/page.tsx` | 抵押贷款：仅 ik 过滤（bbxin 抵押页无 tag/adv） |
| `scripts/build-filter-maps.cjs` | **同步脚本** — 从 bbxin 刮取所有页面的产品 ID，重新生成 `filter-maps.ts`。 |
| `scripts/compare-filters.cjs` | **对比脚本** — 逐个组合对比 bbxin 和本地的产品名称，发现漂移。 |
| `scripts/verify-filters.cjs` | **快速验证** — 按产品 ID 精确对比关键组合，无硬编码期望值。 |

## 数据流

```
1. build-filter-maps.cjs 刮取 bbxin
   ↓
   提取 href="/products/{category}/{ID}.html" 中的数字 ID
   ↓
   写入 filter-maps.ts（companyFilterMap + personFilterMap）
   ↓
2. 用户访问 /products/company?tag=29&adv=35
   ↓
3. page.tsx → filterByIk → filterByTagAndAdv(products, "29", "35", "company")
   ↓
4. filters.ts → getFilteredProductIds("company", "29", "35")
   ↓
5. filter-maps.ts → 查找 "tag=29&adv=35" → 返回 Set{20,24,46,48,151,190,194}
   ↓
6. 过滤 products 数组，只保留 id 在集合中的产品
```

## 筛选 Key 速查

### 企业贷款 — 标签 (tag)

| ID | 名称 |
|----|------|
| 24 | 专精特新 |
| 25 | 国高新 |
| 26 | 科技类 |
| 27 | 创新类 |
| 29 | 涉农类 |
| 37 | 小巨人 |
| 38 | 专利贷 |

### 企业贷款 — 优势 (adv)

| ID | 名称 |
|----|------|
| 35 | 3-5年 |
| 40 | 国有银行 |
| 41 | 先息后本 |
| 42 | 法人不连带 |
| 44 | 法人不占股 |
| 51 | 轻视征信 |
| 58 | 负债高 |
| 60 | 线下 |

### 个人贷款 — 优势 (adv)

| ID | 名称 |
|----|------|
| 45 | 极速下款 |
| 46 | 社保公积金 |
| 53 | 征信宽松 |
| 54 | 3-5年 |
| 55 | 先息后本 |
| 61 | 线下 |
| 62 | 消费分期 |

### 抵押贷款

无 tag/adv 筛选，仅按机构类型 (ik) 过滤，与 bbxin 一致。

## 日常维护

### 发现筛选结果不一致时

**第一步：快速验证**
```bash
node scripts/verify-filters.cjs
```
按产品 ID 精确对比 8 个关键组合。全绿 = 没问题。

**第二步：全面对比**
```bash
node scripts/compare-filters.cjs
```
逐个组合对比所有 tag、adv、combo（共 24 组），列出具体差异。

**第三步：重新同步**
```bash
node scripts/build-filter-maps.cjs
```
从 bbxin 刮取最新数据，自动更新 `filter-maps.ts` 和 `scripts/company-filter-map.ts`。

**第四步：再次验证**
```bash
node scripts/compare-filters.cjs
```
确认 24/24 MATCH。

### bbxin 新增/移除产品后

筛选结果会自动漂移。运行 `node scripts/build-filter-maps.cjs` 重新同步即可。脚本会：
- 逐个请求 bbxin 的每个筛选组合页面
- 从 HTML 中提取 `href="/products/company/{ID}.html"` 的产品 ID
- 生成完整的 TypeScript 映射文件

### bbxin 新增筛选标签/优势时

1. 在 `build-filter-maps.cjs` 的 `tags` 或 `advs` 数组中添加新条目
2. 如果需要组合测试，在 `combos` 数组中添加
3. 运行 `node scripts/build-filter-maps.cjs`

## 常见问题

### Q: 为什么用静态 ID 映射而不是动态请求 bbxin？

动态请求会让每次用户访问都依赖 bbxin 的响应速度（慢 2-5 秒），且 bbxin 宕机会导致本站不可用。静态映射让本站独立运行。

### Q: 静态映射会不会漂移？

会。bbxin 增删产品时，映射就会过期。所以提供了 `build-filter-maps.cjs` 一键重新同步。建议每周跑一次对比。

### Q: 组合筛选在 filter-maps.ts 中找不到时怎么办？

`getFilteredProductIds()` 会走交集降级：分别查 `tag={id}` 和 `adv={id}` 的映射，取交集返回。如果单个也找不到，返回 `null`，`filters.ts` 会走关键词匹配兜底。

### Q: 为什么用产品 ID 而不是产品名称做映射？

- 同名产品：两个"科创贷"（农业银行 id=29，中国银行 id=183）
- 名称变化：产品改名后名称匹配失效
- ID 是稳定的主键，不会变

### Q: 抵押贷款 (pledge) 为什么没有筛选映射？

bbxin 抵押贷款页面只有机构类型 (ik) 筛选，无任何 tag/adv 维度。本地页面也只提供 ik 筛选，完全一致。

## 故障排查

| 现象 | 可能原因 | 解决 |
|------|----------|------|
| 某组合返回 0 结果 | filter-maps.ts 中该 key 不存在或 ID 数组为空 | 运行 `build-filter-maps.cjs` |
| 结果数量对但产品不对 | 本地产品 ID 和 bbxin 产品 ID 不一致 | 检查数据库产品 ID 是否与 bbxin 同步 |
| 某组合始终走关键词匹配 | filter-maps.ts 中缺少该 key | 检查 build-filter-maps.cjs 的 combos 数组是否包含该组合 |
| compare 脚本报错 | bbxin 或本地站点不可达 | 确认 `http://localhost:3000` 可访问，bbxin 可访问 |
