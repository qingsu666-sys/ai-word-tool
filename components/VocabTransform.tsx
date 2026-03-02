"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Download, Loader2, AlertCircle } from "lucide-react";
import { Document, Paragraph, TextRun, Packer } from "docx";
import { saveAs } from "file-saver";

export default function VocabTransform() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `请求失败 (${res.status})`);
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "未知错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = async () => {
    if (!result) return;

    const lines = result.split("\n").filter((l) => l.trim());
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: lines.map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    font: "Times New Roman",
                    size: 24,
                  }),
                ],
                spacing: { after: 120 },
              })
          ),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "词汇变形.docx");
  };

  const placeholderText = `apply v
formation n
actualise/-ze v
acknowledg(e)ment n
happy adj`;

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1A1A2E",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #0052FF, #3B7BFF)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={16} color="#fff" strokeWidth={2.5} />
          </span>
          词汇变形
        </h1>
        <p style={{ margin: "8px 0 0", color: "#6B7A99", fontSize: 14 }}>
          输入单词和词性，AI 自动生成完整语法变形，支持英美拼写处理
        </p>
      </div>

      {/* Input Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #E8EDF5",
          padding: "20px",
          marginBottom: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "#4A5568",
            marginBottom: 10,
          }}
        >
          输入词汇列表
          <span style={{ fontWeight: 400, color: "#A0AABE", marginLeft: 8 }}>
            每行一个，格式：单词 词性
          </span>
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholderText}
          rows={8}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 8,
            border: "1.5px solid #E8EDF5",
            fontSize: 14,
            fontFamily: "monospace",
            resize: "vertical",
            outline: "none",
            color: "#1A1A2E",
            lineHeight: 1.7,
            background: "#FAFBFF",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#0052FF")}
          onBlur={(e) => (e.target.style.borderColor = "#E8EDF5")}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <span style={{ fontSize: 12, color: "#A0AABE" }}>
            {input.split("\n").filter((l) => l.trim()).length} 个词条
          </span>
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              background:
                loading || !input.trim()
                  ? "#C5D3F5"
                  : "linear-gradient(135deg, #0052FF 0%, #3B7BFF 100%)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              boxShadow:
                loading || !input.trim()
                  ? "none"
                  : "0 4px 14px rgba(0,82,255,0.3)",
              transition: "all 0.15s ease",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                生成中...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                生成变形
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            borderRadius: 8,
            background: "#FFF5F5",
            border: "1px solid #FED7D7",
            color: "#C53030",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #E8EDF5",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          {/* Result Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom: "1px solid #E8EDF5",
              background: "#FAFBFF",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#4A5568" }}>
              变形结果
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#0052FF",
                  background: "#EBF1FF",
                  padding: "2px 8px",
                  borderRadius: 20,
                }}
              >
                {result.split("\n").filter((l) => l.trim()).length} 条
              </span>
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleCopy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 7,
                  border: "1.5px solid #E8EDF5",
                  background: "#fff",
                  color: copied ? "#22C55E" : "#4A5568",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  borderColor: copied ? "#22C55E" : "#E8EDF5",
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "已复制" : "复制全文"}
              </button>
              <button
                onClick={handleDownloadWord}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 7,
                  border: "none",
                  background: "linear-gradient(135deg, #0052FF 0%, #3B7BFF 100%)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,82,255,0.25)",
                }}
              >
                <Download size={14} />
                下载 Word
              </button>
            </div>
          </div>

          {/* Result Content */}
          <div style={{ padding: "20px" }}>
            <pre
              style={{
                margin: 0,
                fontFamily: "monospace",
                fontSize: 14,
                lineHeight: 2,
                color: "#1A1A2E",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {result}
            </pre>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
