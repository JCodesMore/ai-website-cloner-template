import * as fs from "fs";

const API_KEY = process.env.ANTHROPIC_AUTH_TOKEN || "";
const BASE_URL = "https://api.deepseek.com";
const MODEL = "deepseek-v4-flash";

const SYSTEM_PROMPT = `你是一个金融产品编辑。你的任务是根据产品结构化数据，生成六个模块的 Markdown 产品介绍。

## 输出格式（严格遵循，只输出 Markdown）

## 产品概述
{产品名}是{机构全名}旗下的{产品类型}产品，最高额度{金额}，期限{期限}，参考年化利率{利率}，支持{还款方式}。

## 核心参数
| 参数 | 详情 |
|------|------|
| 产品名称 | {产品名} |
| 所属机构 | {机构全名} |
| 最高额度 | {金额} |
| 贷款期限 | {期限} |
| 参考年利率 | {利率} |
| 还款方式 | {还款方式} |
| 申请渠道 | {根据机构名推断} |

## 产品特点
- **{特点1标题}**：{一句话描述}
- **{特点2标题}**：{一句话描述}
- **{特点3标题}**：{一句话描述}
- **{特点4标题}**：{一句话描述}

## 适用人群
- {条件1}
- {条件2}
- {条件3}

## 申请方式
{根据机构名和产品类型描述申请渠道和流程，60-100字}

## 常见问题
**问：{产品名}申请需要什么条件？**
答：{根据产品类型回答，40-80字}

**问：{产品名}多久能审批通过？**
答：{根据产品类型回答，30-60字}

**问：{产品名}可以提前还款吗？**
答：{根据产品类型回答，30-60字}

**问：{产品名}额度最高多少？利率是多少？**
答：最高额度{金额}，参考年化利率{利率}，具体以审批结果为准。

**问：{产品名}逾期会有什么后果？**
答：逾期会产生罚息，并可能影响个人征信记录，严重者将影响后续贷款申请。建议按时还款保持良好信用。

## 规则
1. 只输出 Markdown，从 ## 产品概述 开始。不要输出任何解释、确认、代码块包裹或 HTML 标签。
2. 产品特点和适用人群必须根据产品类型（个人消费贷/企业贷/抵押贷/助学贷等）定制，不能泛泛而谈。
3. 回答要具体，能用数据就用数据，不要用"视情况而定"。
4. 机构全名优先用提供的全名，如果只有简称则根据常识补全。
5. 金额、利率、期限直接使用提供的数据，不编造。`;

async function rewriteIntro(product: any): Promise<string> {
  const info = [
    `产品名：${product.name}`,
    `机构：${product.institution || ""}`,
    `机构全名：${product.institution_full_name || product.institution || ""}`,
    `额度：${product.max_amount || ""}`,
    `期限：${product.term || ""}`,
    `利率：${product.rate || ""}`,
    `还款方式：${product.repayment || ""}`,
    `分类：${product.category || ""}`,
  ].join("\n");

  const body = {
    model: MODEL,
    max_tokens: 2048,
    temperature: 0.7,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `请根据以下产品信息生成介绍：\n\n${info}` }
    ]
  };

  const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json() as any;
  return data.choices[0].message.content;
}

async function main() {
  const args = process.argv.slice(2);
  const batchFile = args[0];
  const outputDir = args[1] || "./scripts/output";

  if (!batchFile) {
    console.error("Usage: npx tsx scripts/rewrite-intros.ts <batch-file.json> [output-dir]");
    process.exit(1);
  }

  const products: any[] = JSON.parse(fs.readFileSync(batchFile, "utf-8"));
  fs.mkdirSync(outputDir, { recursive: true });

  let success = 0;
  let fail = 0;

  for (const product of products) {
    try {
      console.log(`[${success + fail + 1}/${products.length}] #${product.id} ${product.name}...`);
      const md = await rewriteIntro(product);
      const outFile = `${outputDir}/${product.id}.md`;
      fs.writeFileSync(outFile, md);
      success++;
      await new Promise(r => setTimeout(r, 150));
    } catch (err: any) {
      console.error(`  FAIL #${product.id}: ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone. ${success} ok, ${fail} failed`);
}

main();
