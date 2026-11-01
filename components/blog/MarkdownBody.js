import { parseInline, parseMarkdown, safeImage, safeLink } from '../../lib/blog/markdown';

function Inline({ text }) {
  return parseInline(text).map((node, index) => {
    if (node.type === 'strong') return <strong key={index}>{node.text}</strong>;
    if (node.type === 'em') return <em key={index}>{node.text}</em>;
    if (node.type === 'code') {
      return (
        <code key={index} className="rounded bg-[#f3ecdf] px-1 py-0.5 text-[0.92em] text-[#1a2f4a]">
          {node.text}
        </code>
      );
    }
    if (node.type === 'link') {
      const href = safeLink(node.href);
      if (!href) return <span key={index}>{node.text}</span>;
      const external = href.startsWith('http');
      return (
        <a
          key={index}
          href={href}
          className="text-[#9a7209] underline decoration-[#e2cfa2] underline-offset-2"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {node.text}
        </a>
      );
    }
    if (node.type === 'image') {
      const src = safeImage(node.src);
      if (!src) return null;
      return (
        <img
          key={index}
          src={src}
          alt={node.alt || ''}
          className="my-4 w-full rounded-xl"
          loading="lazy"
        />
      );
    }
    return <span key={index}>{node.text}</span>;
  });
}

export default function MarkdownBody({ source }) {
  const blocks = parseMarkdown(source);
  if (!blocks.length) return null;

  return (
    <div className="space-y-5 text-[17px] leading-8 text-[#3d2a22]">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const Tag = block.level === 1 ? 'h2' : block.level === 2 ? 'h3' : 'h4';
          return (
            <Tag key={index} className="font-display text-[#1a2f4a] tracking-tight text-2xl sm:text-[1.7rem] leading-tight pt-2">
              <Inline text={block.text} />
            </Tag>
          );
        }
        if (block.type === 'quote') {
          return (
            <blockquote key={index} className="border-l-2 border-[#c9a96e] pl-4 text-[#4a2518]">
              <Inline text={block.text} />
            </blockquote>
          );
        }
        if (block.type === 'ul' || block.type === 'ol') {
          const Tag = block.type === 'ol' ? 'ol' : 'ul';
          return (
            <Tag key={index} className={block.type === 'ol' ? 'list-decimal pl-5 space-y-1.5' : 'list-disc pl-5 space-y-1.5'}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Inline text={item} />
                </li>
              ))}
            </Tag>
          );
        }
        if (block.type === 'code') {
          return (
            <pre key={index} className="overflow-x-auto rounded-xl bg-[#1a2f4a] px-4 py-3 text-sm leading-6 text-[#f7f1e6]">
              <code>{block.text}</code>
            </pre>
          );
        }
        if (block.type === 'image') {
          const src = safeImage(block.src);
          if (!src) return null;
          return (
            <figure key={index}>
              <img src={src} alt={block.alt || ''} className="w-full rounded-xl" loading="lazy" />
            </figure>
          );
        }
        return (
          <p key={index}>
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
