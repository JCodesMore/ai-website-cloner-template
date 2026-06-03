# Data Integrity Guard — 数据完整性自动保障系统

**状态:** DRAFT
**日期:** 2026-06-01
**问题:** 项目反复因 DB 数据与 JSON 源数据不一致导致返工，缺乏自动化检测和修复机制

## 目标

每次 `npm run dev` 或部署启动时，自动校验 DB 数据与 JSON 源数据的一致性，发现问题自动修复，无法自动修复的生成报告。同时提供 CLI 命令用于手动检查和补抓数据。

## 架构

```
                    ┌─────────────────────────┐
                    │   instrumentation.ts     │
                    │   (Next.js 启动钩子)      │
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                  ▼
     ┌────────────┐    ┌────────────┐    ┌────────────────┐
     │seedAllTables│    │validateAnd │    │printDataReport │
     │  (已有)     │    │ Repair()   │    │    (新增)       │
     │ 首次播种    │    │  (新增)    │    │  控制台报告     │
     └────────────┘    └─────┬──────┘    └────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │ products   │  │institutions│  │  articles  │  ...
     │ 校验规则   │  │ 校验规则   │  │ 校验规则   │
     └────────────┘  └────────────┘  └────────────┘
```

## 新增文件

| 文件 | 职责 |
|------|------|
| `src/lib/data-guard/types.ts` | 规则/报告/修复结果的类型定义 |
| `src/lib/data-guard/rules.ts` | 4 个数据域的校验规则声明 |
| `src/lib/data-guard/repair.ts` | 自动修复逻辑（INSERT/UPDATE）|
| `src/lib/data-guard/runner.ts` | 规则执行引擎 + 报告生成 |
| `src/instrumentation.ts` | 在 `seedAllTables()` 之后调用 runner |
| `scripts/data-check.ts` | CLI: `npm run data:check` (只读，不修复) |
| `scripts/data-scrape.ts` | CLI: `npm run data:scrape` (补抓缺失数据) |

## 校验规则设计

每个数据域定义一组声明式规则：

```typescript
// src/lib/data-guard/types.ts
interface DataRule {
  /** 规则名称 (用于报告) */
  name: string;
  /** 严重级别: error=自动修复, warn=仅报告 */
  severity: "error" | "warn";
  /** 校验函数: 返回差异列表, 空数组=通过 */
  check: () => Promise<DataIssue[]>;
  /** 修复函数: error 级别必填, warn 级别可选 */
  repair?: (issues: DataIssue[]) => Promise<RepairResult>;
}

interface DataIssue {
  type: "missing_row" | "empty_field" | "wrong_value" | "dirty_data" | "orphan_ref";
  table: string;
  id?: number;
  field?: string;
  expected?: string;
  actual?: string;
}

interface RepairResult {
  fixed: number;
  skipped: number;
  errors: string[];
}
```

### Products (产品) 校验规则

| # | 规则 | 级别 | 检查内容 |
|---|------|------|----------|
| P1 | row_count | error | DB 行数应 = JSON 去重后数量 (815)。DB 少的行从 JSON 补入 |
| P2 | category_distribution | warn | 4 个 category (fast/company/person/pledge) 每个至少 > 0 |
| P3 | empty_name | error | name 字段不应为空 |
| P4 | orphan_institution | warn | products.institution 应在 institutions 表中能找到匹配 |

### Institutions (机构) 校验规则

| # | 规则 | 级别 | 检查内容 |
|---|------|------|----------|
| I1 | row_count | error | DB 行数应 = JSON 数量 (392) |
| I2 | name_fullname_swapped | error | 检测 name 字段含"股份有限公司"但 fullName 不含的情况 (12 个已知问题) |
| I3 | empty_logo | warn | logo 字段为空的比例 |
| I4 | product_count_mismatch | warn | institutions.products 数组长度 vs 实际 products 表中该机构的记录数 |

### Articles (文章) 校验规则

| # | 规则 | 级别 | 检查内容 |
|---|------|------|----------|
| A1 | row_count | error | DB 行数应 = 4 个 category JSON 的总和 (983) |
| A2 | empty_body | error | body 为空的行数。从 articleDetails.json 或 category description 自动补 |
| A3 | empty_date | error | date 为空的行数。从 category JSON 自动补 |
| A4 | dirty_body | error | body 含抓取残留 (`rich-text-content`, `<style>`, `yinmaiquan-keyword`)。自动清洗 |
| A5 | short_body | warn | body 长度 < 100 字符 (只有 description 没有正文)。标记，建议补抓 |

### Comments (评论) 校验规则

| # | 规则 | 级别 | 检查内容 |
|---|------|------|----------|
| C1 | row_count | warn | DB 行数 vs JSON 数量 |
| C2 | empty_content | error | content 字段为空 |

## 启动流程

```
instrumentation.ts 启动顺序:
1. seedAllTables()           ← 已有 (首次播种)
2. validateAndRepair()       ← 新增 (每次启动校验)
3. printDataReport()         ← 新增 (控制台报告)
```

控制台报告格式:
```
╔══════════════════════════════════════════════════════╗
║           DATA INTEGRITY REPORT                      ║
╠══════════════════════════════════════════════════════╣
║ products:     ✓ 815 rows  ✓ categories  ✓ no orphans║
║ institutions: ✓ 392 rows  ⚠ 3 swapped   ✓ logos     ║
║ articles:     ✓ 983 rows  ✓ bodies     ✓ dates      ║
║               ⚠ 12 short bodies (use data:scrape)   ║
║ comments:     ✓ 0 rows    (intentionally empty)      ║
╠══════════════════════════════════════════════════════╣
║ Auto-fixed: 2 issues. Warnings: 3. See above.       ║
╚══════════════════════════════════════════════════════╝
```

## CLI 命令

### `npm run data:check`
只读校验，不修改 DB。输出详细报告，退出码反映是否有 error 级别问题（可用作 CI 门禁）。

### `npm run data:scrape`
调用 Playwright 从 bbxin.com 补抓标记为 `short_body` 或缺失的文章数据。每次运行前打印预计抓取数量，要求确认。

## 与原 instrumentation.ts 的关系

现有 `seedAllTables()` 保持不变（首次播种逻辑）。`validateAndRepair()` 是独立新增的函数，在 seed 之后运行。两者互不依赖。

## 不做什么

- 不引入新数据库或外部服务
- 不修改 drizzle schema
- 不做实时监控/定时任务（Phase 2 可考虑）
- 不做 JSON 文件本身的语法校验（那是 build 阶段的事）
