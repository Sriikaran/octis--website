const SAFE_LINK = /^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*)$/;
const SAFE_IMAGE = /^(\/uploads\/blog\/[a-zA-Z0-9][a-zA-Z0-9._-]{0,120}|https:\/\/[^\s]+)$/;

export function safeLink(url) {
  const value = String(url || '').trim();
  if (!value || value.includes('..') || value.toLowerCase().startsWith('javascript:')) return null;
  if (!SAFE_LINK.test(value)) return null;
  return value;
}

export function safeImage(url) {
  const value = String(url || '').trim();
  if (!value || value.includes('..')) return null;
  if (!SAFE_IMAGE.test(value)) return null;
  return value;
}

function isBlockStart(line) {
  return (
    line.startsWith('```') ||
    /^#{1,3}\s+/.test(line) ||
    line.startsWith('> ') ||
    /^[-*]\s+/.test(line) ||
    /^\d+\.\s+/.test(line) ||
    /^!\[[^\]]*\]\([^)]+\)$/.test(line.trim())
  );
}

export function parseInline(text) {
  const source = String(text || '');
  const nodes = [];
  const re = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let match;
  while ((match = re.exec(source))) {
    if (match.index > last) nodes.push({ type: 'text', text: source.slice(last, match.index) });
    if (match[0].startsWith('![')) nodes.push({ type: 'image', alt: match[1], src: match[2] });
    else if (match[3] !== undefined) nodes.push({ type: 'link', text: match[3], href: match[4] });
    else if (match[5] !== undefined) nodes.push({ type: 'code', text: match[5] });
    else if (match[6] !== undefined) nodes.push({ type: 'strong', text: match[6] });
    else if (match[7] !== undefined) nodes.push({ type: 'em', text: match[7] });
    last = match.index + match[0].length;
  }
  if (last < source.length) nodes.push({ type: 'text', text: source.slice(last) });
  return nodes;
}

export function parseMarkdown(source) {
  const lines = String(source || '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() });
      i += 1;
      continue;
    }

    if (line.startsWith('> ')) {
      const quote = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quote.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push({ type: 'quote', text: quote.join(' ') });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    const image = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line.trim());
    if (image) {
      blocks.push({ type: 'image', alt: image[1], src: image[2] });
      i += 1;
      continue;
    }

    const para = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      para.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ type: 'p', text: para.join(' ') });
  }

  return blocks;
}
