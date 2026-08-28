import React from "react";

// Renderiza el contenido del editor de bloques (WYSIWYG) de Strapi v5 sin
// dependencias externas. Soporta lo que la dueña puede crear desde el admin:
// párrafos, encabezados, listas (UL/OL) con items, enlaces, citas, código, y
// texto en negrita/cursiva/subrayado/tachado.

type BlockNode = {
  type?: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  url?: string;
  level?: number;
  format?: "ordered" | "unordered";
  children?: BlockNode[];
};

function renderText(node: BlockNode, key: React.Key): React.ReactNode {
  let el: React.ReactNode = node.text ?? "";
  if (node.bold) el = <strong>{el}</strong>;
  if (node.italic) el = <em>{el}</em>;
  if (node.underline) el = <u>{el}</u>;
  if (node.strikethrough) el = <s>{el}</s>;
  if (node.code) el = <code className="rounded bg-brand-bg px-1 py-0.5 text-sm">{el}</code>;
  return <React.Fragment key={key}>{el}</React.Fragment>;
}

function renderChildren(children?: BlockNode[]): React.ReactNode {
  return (children ?? []).map((child, i) => renderNode(child, i));
}

function renderNode(node: BlockNode, key: React.Key): React.ReactNode {
  if (node.type === "text" || node.text !== undefined) return renderText(node, key);

  if (node.type === "link") {
    return (
      <a
        key={key}
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-brown underline hover:text-brand-brown-hover"
      >
        {renderChildren(node.children)}
      </a>
    );
  }

  switch (node.type) {
    case "heading": {
      const level = Math.min(Math.max(node.level ?? 2, 1), 6);
      const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
      return (
        <Tag key={key} className="mb-3 font-semibold text-brand-text">
          {renderChildren(node.children)}
        </Tag>
      );
    }
    case "list": {
      const ordered = node.format === "ordered";
      const Tag = ordered ? "ol" : "ul";
      return (
        <Tag key={key} className={`mb-4 space-y-1 pl-5 ${ordered ? "list-decimal" : "list-disc"}`}>
          {renderChildren(node.children)}
        </Tag>
      );
    }
    case "list-item":
      return <li key={key}>{renderChildren(node.children)}</li>;
    case "quote":
      return (
        <blockquote key={key} className="mb-4 border-l-4 border-brand-border pl-4 italic text-brand-muted">
          {renderChildren(node.children)}
        </blockquote>
      );
    case "code":
      return (
        <pre key={key} className="mb-4 overflow-x-auto rounded-lg bg-brand-bg p-3 text-sm">
          <code>{renderChildren(node.children)}</code>
        </pre>
      );
    case "paragraph":
    default:
      return (
        <p key={key} className="mb-3 last:mb-0">
          {renderChildren(node.children)}
        </p>
      );
  }
}

// Acepta `unknown[]` porque el body viene tipado laxo desde el servicio de
// Strapi; internamente se trata como los nodos de bloque de Strapi.
export function RichText({ content, className }: { content?: unknown[] | null; className?: string }) {
  if (!Array.isArray(content) || content.length === 0) return null;
  return <div className={className}>{(content as BlockNode[]).map((node, i) => renderNode(node, i))}</div>;
}

function collectText(nodes?: BlockNode[]): string {
  return (nodes ?? []).map((node) => (node.text !== undefined ? node.text : collectText(node.children))).join("");
}

// Texto plano de un bloque de Strapi (sin formato ni enlaces) — para
// FAQPage/JSON-LD u otros usos donde solo hace falta el contenido, no el
// markup.
export function blocksToPlainText(content?: unknown[] | null): string {
  if (!Array.isArray(content) || content.length === 0) return "";
  return (content as BlockNode[])
    .map((node) => collectText(node.children))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
