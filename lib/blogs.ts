import "server-only";

import fs from "node:fs";
import path from "node:path";
import { inflateRawSync } from "node:zlib";

export type BlogBlock =
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "paragraph"; text: string; emphasis?: boolean }
  | { type: "callout"; text: string }
  | { type: "list-item"; text: string }
  | { type: "table"; rows: string[][] };

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  category: string;
  updated?: string;
  readingTime: number;
  blocks: BlogBlock[];
};

type BlogSource = {
  file: string;
  slug: string;
  category: string;
  seoTitle: string;
  description: string;
};

const sources: BlogSource[] = [
  {
    file: "AI in BIM by 2030.docx",
    slug: "ai-in-bim-by-2030",
    category: "Future of BIM",
    seoTitle: "AI in BIM by 2030: Future-Proof Your BIM Career",
    description: "Explore how AI will reshape BIM modelling, coordination, quality control, digital twins, and the skills BIM professionals need before 2030.",
  },
  {
    file: "BIM Career Roadmap 2027.docx",
    slug: "bim-career-roadmap-2027",
    category: "Career guide",
    seoTitle: "BIM Career Roadmap 2027: Skills, Roles and Software",
    description: "A practical BIM career roadmap covering essential software, project skills, entry-level roles, and progression into coordination and management.",
  },
  {
    file: "Top BIM Training Institutes in India in 2027.docx",
    slug: "top-bim-training-institutes-india-2027",
    category: "Training guide",
    seoTitle: "Best BIM Training Institutes in India: 2027 Guide",
    description: "Compare leading BIM training options in India and learn how to assess curriculum, mentors, projects, fees, career support, and learning formats.",
  },
  {
    file: "NXD Phase - 1 Content - 1.docx",
    slug: "what-is-bim-beginners-guide",
    category: "BIM fundamentals",
    seoTitle: "What Is BIM? A Beginner's Guide for 2026",
    description: "Understand Building Information Modeling, how BIM differs from CAD, its dimensions and software, and why it matters for construction careers.",
  },
  {
    file: "Phase - 1 content - 2.docx",
    slug: "bim-vs-cad",
    category: "BIM fundamentals",
    seoTitle: "BIM vs CAD: What Civil Engineers Should Learn First",
    description: "Learn the practical differences between BIM and CAD, where each is used, and the best learning path for civil engineering students and graduates.",
  },
  {
    file: "phase - 1 content - 3.docx",
    slug: "five-bim-skills-civil-engineers",
    category: "Skills",
    seoTitle: "5 Essential BIM Skills for Civil Engineers in 2026",
    description: "Discover five practical BIM skills civil engineers need, from modelling and clash detection to quantities, coordination, and information management.",
  },
  {
    file: "Phase - 1 content - 4.docx",
    slug: "what-does-a-bim-engineer-do",
    category: "Career guide",
    seoTitle: "What Does a BIM Engineer Do? Roles, Skills and Tools",
    description: "A clear guide to a BIM Engineer's responsibilities, daily workflows, essential software, required skills, and career progression.",
  },
  {
    file: "Phase - 1 content - 5.docx",
    slug: "bim-career-paths",
    category: "Career guide",
    seoTitle: "BIM Career Paths: Roles and Progression Guide",
    description: "Explore BIM career options from BIM Modeler and Engineer to Coordinator, Manager, VDC professional, consultant, and digital construction roles.",
  },
  {
    file: "phase - 1 content - 6.docx",
    slug: "top-bim-training-institutes-india-2026",
    category: "Training guide",
    seoTitle: "Top BIM Training Institutes in India: 2026 Guide",
    description: "Review notable BIM training providers in India and the practical criteria students should use when comparing courses, faculty, and career support.",
  },
];

function readZipEntry(file: Buffer, entryName: string) {
  let eocd = -1;
  for (let i = file.length - 22; i >= Math.max(0, file.length - 65_557); i -= 1) {
    if (file.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }

  if (eocd < 0) throw new Error("Invalid DOCX archive: directory not found");

  const entries = file.readUInt16LE(eocd + 10);
  let offset = file.readUInt32LE(eocd + 16);

  for (let i = 0; i < entries; i += 1) {
    if (file.readUInt32LE(offset) !== 0x02014b50) break;

    const method = file.readUInt16LE(offset + 10);
    const compressedSize = file.readUInt32LE(offset + 20);
    const nameLength = file.readUInt16LE(offset + 28);
    const extraLength = file.readUInt16LE(offset + 30);
    const commentLength = file.readUInt16LE(offset + 32);
    const localOffset = file.readUInt32LE(offset + 42);
    const name = file.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");

    if (name === entryName) {
      const localNameLength = file.readUInt16LE(localOffset + 26);
      const localExtraLength = file.readUInt16LE(localOffset + 28);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const data = file.subarray(start, start + compressedSize);

      if (method === 0) return data.toString("utf8");
      if (method === 8) return inflateRawSync(data).toString("utf8");
      throw new Error(`Unsupported DOCX compression method: ${method}`);
    }

    offset += 46 + nameLength + extraLength + commentLength;
  }

  throw new Error(`Missing ${entryName} in DOCX archive`);
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function paragraphText(xml: string) {
  const text = [...xml.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)]
    .map((match) => decodeXml(match[1]))
    .join("");
  return text.replace(/\s+/g, " ").trim();
}

function isBold(xml: string) {
  const tag = xml.match(/<w:b\b([^>]*)\/?\s*>/);
  return Boolean(tag && !/w:val="(?:0|false|off)"/i.test(tag[1]));
}

function parseParagraph(xml: string): BlogBlock | null {
  const text = paragraphText(xml);
  if (!text) return null;
  if (/<w:numPr\b/.test(xml)) return { type: "list-item", text };
  if (isBold(xml)) return { type: "heading", text, level: 2 };
  return { type: "paragraph", text };
}

function parseTable(xml: string): BlogBlock | null {
  const rows = [...xml.matchAll(/<w:tr\b[\s\S]*?<\/w:tr>/g)]
    .map(([row]) =>
      [...row.matchAll(/<w:tc\b[\s\S]*?<\/w:tc>/g)].map(([cell]) =>
        [...cell.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)]
          .map(([paragraph]) => paragraphText(paragraph))
          .filter(Boolean)
          .join(" "),
      ),
    )
    .filter((row) => row.some(Boolean));

  return rows.length ? { type: "table", rows } : null;
}

function parseDocument(xml: string) {
  const body = xml.match(/<w:body\b[\s\S]*?<\/w:body>/)?.[0] ?? "";
  const blocks: BlogBlock[] = [];

  for (const match of body.matchAll(/<w:(p|tbl)\b[\s\S]*?<\/w:\1>/g)) {
    const block = match[1] === "tbl" ? parseTable(match[0]) : parseParagraph(match[0]);
    if (block) blocks.push(block);
  }

  return blocks;
}

const textCorrections: Record<string, string> = {
  "AD is commonly used for:": "CAD is commonly used for:",
  "hould Civil Engineers Learn CAD or BIM First?": "Should Civil Engineers Learn CAD or BIM First?",
  "requently Asked Questions": "Frequently Asked Questions",
};

const h3Pattern = /^(?:In one sentence|Here['’]s why|Professionals who|Typical responsibilities|Learning BIM helps|Benefits of BIM|Learn CAD|Learn BIM|The ideal learning path|Traditional CAD|Building Information Modeling \(BIM\)|In CAD|In BIM|Career Roles in|Where .+ Performs Well|Something to Consider|A Different Value Proposition|Best suited for|Skills? to develop|Skills worth learning|What this means for your career|What should you learn\?|Career opportunity|Future-proof skill combination)/i;
const h2Pattern = /^(?:Frequently Asked Questions|Final Thoughts|Conclusion|What Is (?:BIM|CAD)\?|Why is BIM Important\?|BIM vs Traditional CAD|Understanding 3D|Most Popular BIM Software|Who Uses BIM\?|What Does a BIM Engineer Do\?|Why Should Civil|Where Can Civil Engineers Learn BIM|How to Start Learning BIM|BIM vs CAD: The Biggest Differences|Why Construction Companies Prefer BIM|Should Civil Engineers Learn|Is BIM Replacing AutoCAD|Career Opportunities:|Why Learn BIM with|What Software Does|What Skills (?:Does|Do)|Is BIM Engineering|How Can You Become|BIM Engineer vs|Which BIM Career|Can Fresh Graduates|How Does a BIM Career|Is BIM a Good Career|How Should You Choose|Which BIM Institute|What Should a Good BIM Course|Top BIM Training Options|Novatr vs|How Much Should|10 Things to Check|Which BIM Course|Should You Choose Online|Is a BIM Certificate|So, Which BIM Institute|Price Should Matter|The Best BIM Course|Looking for More|First, Will AI Replace|The BIM Professional of 2030|What Will Happen to BIM Modelers|What Skills Should You Start Learning|A Practical AI-BIM Career Roadmap|Career Roles That May Grow|What Should You NOT Do|Will BIM Still Exist|The Biggest Career Opportunity|How Should a Beginner Start|How Nextudy Sees|Why Consider a BIM Career|Who Can Start a Career|BIM Career Roadmap for Beginners|What BIM Jobs Can Beginners|Is Revit Enough|Do You Need to Learn Every|How Long Does It Take|The Biggest Mistake BIM|What Does the Future BIM|A Simple BIM Career Roadmap|Start With the Foundation)/i;
const calloutPattern = /(?:→|\+|\bKey strength:|^Best suited for:|^Note:|^Software \+|^Certificate \+|^Course Fee →|^AutoCAD →|^".*"$)/i;

function organiseBlocks(blocks: BlogBlock[], slug: string) {
  const organised: BlogBlock[] = [];
  let inFaq = false;
  let nestedNumberedList = false;
  let skipDuplicateNextudy = false;

  for (const original of blocks) {
    const block =
      original.type === "table"
        ? original
        : { ...original, text: textCorrections[original.text] ?? original.text };

    if (slug === "top-bim-training-institutes-india-2027") {
      if (block.type === "heading" && block.text === "4. Nextudy") {
        skipDuplicateNextudy = true;
        continue;
      }
      if (skipDuplicateNextudy) {
        if (block.type !== "heading" || !/^Novatr vs/i.test(block.text)) continue;
        skipDuplicateNextudy = false;
      }
    }

    if (block.type !== "heading") {
      organised.push(block);
      continue;
    }

    const text = block.text.trim();
    const isFaqHeading = /^Frequently Asked Questions/i.test(text);
    const closesFaq = /^(?:Final Thoughts|Conclusion|Why Learn BIM|Looking for More)/i.test(text);

    if (isFaqHeading) inFaq = true;
    else if (closesFaq) inFaq = false;

    if (/^(?:10 Things to Check|How Should You Choose|A Simple BIM Career Roadmap|How to Start Learning BIM)/i.test(text)) {
      nestedNumberedList = true;
    } else if (
      nestedNumberedList &&
      /^(?:Which BIM Institute|Which BIM Course|Should You Choose Online|Start With the Foundation|Frequently Asked Questions|Final Thoughts)/i.test(text)
    ) {
      nestedNumberedList = false;
    }

    if (calloutPattern.test(text) || /\s[–—-]\s/.test(text)) {
      organised.push({ type: "callout", text });
    } else if (text.length > 95 || /[.!]$/.test(text)) {
      organised.push({ type: "paragraph", text, emphasis: true });
    } else if (isFaqHeading) {
      organised.push({ type: "heading", text, level: 2 });
    } else if (inFaq && /\?$/.test(text)) {
      organised.push({ type: "heading", text, level: 3 });
    } else if (h2Pattern.test(text)) {
      organised.push({ type: "heading", text, level: 2 });
    } else if (/^\d+\./.test(text)) {
      organised.push({ type: "heading", text, level: nestedNumberedList ? 3 : 2 });
    } else if (h3Pattern.test(text) || /^Best suited for$/i.test(text)) {
      organised.push({ type: "heading", text, level: 3 });
    } else {
      organised.push({ type: "heading", text, level: 3 });
    }
  }

  return organised;
}

function loadPost(source: BlogSource): BlogPost {
  const file = fs.readFileSync(path.join(process.cwd(), "blogs", source.file));
  let blocks = parseDocument(readZipEntry(file, "word/document.xml"));
  const titleBlock = blocks.shift();

  if (!titleBlock || titleBlock.type === "table") {
    throw new Error(`Blog document has no title: ${source.file}`);
  }

  const title = titleBlock.text;
  const updatedIndex = blocks.findIndex(
    (block) => block.type !== "table" && /^Updated:/i.test(block.text),
  );
  const updated =
    updatedIndex >= 0 && blocks[updatedIndex].type !== "table"
      ? blocks[updatedIndex].text.replace(/^Updated:\s*/i, "")
      : undefined;

  if (updatedIndex >= 0) blocks.splice(updatedIndex, 1);

  blocks = organiseBlocks(blocks, source.slug);

  const excerpt = source.description;
  const wordCount = blocks.reduce((total, block) => {
    const text = block.type === "table" ? block.rows.flat().join(" ") : block.text;
    return total + text.split(/\s+/).filter(Boolean).length;
  }, title.split(/\s+/).length);

  return {
    ...source,
    title,
    excerpt,
    updated,
    readingTime: Math.max(1, Math.ceil(wordCount / 220)),
    blocks,
  };
}

let postCache: BlogPost[] | undefined;

export function getAllPosts() {
  postCache ??= sources.map(loadPost);
  return postCache;
}

export function getPost(slug: string) {
  return getAllPosts().find((post) => post.slug === slug);
}
