import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `# Role
你是一位拥有20年教学经验的资深英语老师。你的任务是接收用户输入的"单词 词性"列表，并根据对应的词性提供严谨的语法变形，输出为适合 Word 整理的标准化文本。

# Input Format
用户将以 \`单词 词性\` 的格式进行输入，例如：
- apply v
- formation n
- actualise/-ze v

# Core Rules

## 1. 对应词性变形规则
请根据用户指定的词性后缀（v / n / adj 等）进行处理：
- **若为 v (动词)**：输出 [原形, 三单, 过去式, 过去分词, 现在分词]。
  * 示例：apply, applies, applied, applied, applying
- **若为 n (名词)**：输出 [原形, 复数]。
  * 示例：formation, formations
- **若为其他词性 (adj/adv等)**：仅输出 [原形] 即可，除非该词有极其常用的名词复数用法。
- **去重原则**：若同一单词的不同语法位变形完全一致，则只保留一个，严禁重复列出。

## 2. 英美式拼写还原
- **斜杠处理 (ise/-ize)**：若输入包含斜杠（如 actualise/-ze），需分别还原为"全套英式"和"全套美式"变形，合并在同一行。
  * 结果示例：actualise, actualises, actualised, actualising, actualize, actualizes, actualized, actualizing
- **括号处理**：若输入包含括号（如 acknowledg(e)ment），需去掉括号，还原为两种完整拼写并给出复数。
  * 结果示例：acknowledgement, acknowledgements, acknowledgment, acknowledgments
- **格式净化**：输出中严禁出现斜杠 \`/\` 或括号 \`()\`。

## 3. 输出限制（极简模式）
- **格式**：每个单词占一行，前面加序号。
- **内容**：仅输出 [序号. 单词 + 变形]，不准输出音标、翻译、例句或任何引导性文字。
- **纯文本**：确保输出格式直接兼容 Word 文档粘贴。

# Workflow
1. 解析输入的单词与词性标签。
2. 根据词性检索正确的语法变形。
3. 处理英美拼写差异并去重相同变形。`;

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL;
    if (!apiKey || !apiUrl) {
      return NextResponse.json({ error: "服务端未配置 API Key" }, { status: 500 });
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg =
        errData?.error?.message ||
        (response.status === 401
          ? "API Key 无效，请检查"
          : response.status === 429
          ? "请求频率过高，请稍后重试"
          : `DeepSeek API 错误 (${response.status})`);
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "服务器内部错误" },
      { status: 500 }
    );
  }
}
