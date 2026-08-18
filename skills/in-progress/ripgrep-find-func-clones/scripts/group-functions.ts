#!/usr/bin/env -S node --experimental-strip-types --disable-warning=MODULE_TYPELESS_PACKAGE_JSON

import { stdin } from "node:process";
import { text } from "node:stream/consumers";

type CurrentRecord = {
  readonly path: string;
  readonly lineno: number;
  readonly first: string;
};

type CloneGroup = {
  readonly name: string;
  readonly params: string;
  readonly locations: readonly string[];
  readonly packages: readonly string[];
};

const MATCH_RE = /^(?<path>.*):(?<line>\d+):(?<text>.*)$/;
const CONTEXT_RE = /^(?<path>.*)-(?<line>\d+)-(?<text>.*)$/;
const NAME_RE =
  /(?:function\s+(?<fn>[A-Za-z_]\w*)\s*\(|const\s+(?<cn>[A-Za-z_]\w*)\s*=\s*(?:async\s*)?\(|(?:public|private|protected)\s+(?:static\s+)?(?:async\s+)?(?<mn>[A-Za-z_]\w*)\s*\(|async\s+(?<an>[A-Za-z_]\w*)\s*\()/;
const SKIP_NAMES = new Set([
  "constructor",
  "if",
  "for",
  "while",
  "switch",
  "catch",
  "function",
]);

function capturedName(match: RegExpMatchArray): string | undefined {
  const groups = match.groups;
  if (!groups) {
    return undefined;
  }
  return groups.fn ?? groups.cn ?? groups.mn ?? groups.an;
}

function normalizeParams(source: string): string {
  const start = source.indexOf("(");
  if (start < 0) {
    return "";
  }
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth -= 1;
      if (depth === 0) {
        const inner = source.slice(start + 1, index);
        return inner
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\s+/g, " ")
          .trim();
      }
    }
  }
  const inner = source
    .slice(start + 1)
    .replace(/\s+/g, " ")
    .trim()
    .replace(/,+$/, "");
  return `${inner} …`;
}

function posixPath(value: string): string {
  return value.replaceAll("\\", "/").replace(/\/$/, "");
}

function parsePackageRoots(argv: readonly string[]): readonly string[] {
  const roots: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--package-root") {
      const root = argv[index + 1];
      if (root !== undefined && root.length > 0 && !root.startsWith("--")) {
        roots.push(posixPath(root));
        index += 1;
      }
      continue;
    }
    if (arg.startsWith("--package-root=")) {
      const root = arg.slice("--package-root=".length);
      if (root.length > 0) {
        roots.push(posixPath(root));
      }
    }
  }
  return roots;
}

function packageOf(filePath: string, roots: readonly string[]): string {
  const normalized = posixPath(filePath);
  let best: string | undefined;
  for (const root of roots) {
    if (normalized === root || normalized.startsWith(`${root}/`)) {
      if (best === undefined || root.length > best.length) {
        best = root;
      }
    }
  }
  return best ?? "(other)";
}

function parseRecords(raw: string): Map<string, string[]> {
  const bySig = new Map<string, string[]>();
  const seen = new Set<string>();
  let current: CurrentRecord | undefined;
  let bodyLines: string[] = [];

  const flush = (): void => {
    if (!current) {
      return;
    }
    const record = current;
    const seenKey = `${record.path}:${String(record.lineno)}`;
    current = undefined;
    const lines = bodyLines;
    bodyLines = [];
    if (seen.has(seenKey)) {
      return;
    }
    seen.add(seenKey);
    const nameMatch = NAME_RE.exec(record.first);
    if (!nameMatch) {
      return;
    }
    const name = capturedName(nameMatch);
    if (!name || SKIP_NAMES.has(name)) {
      return;
    }
    const params = normalizeParams(lines.join("\n"));
    const location = `${record.path}:${String(record.lineno)}`;
    const sigKey = `${name}\0${params}`;
    const locations = bySig.get(sigKey) ?? [];
    locations.push(location);
    bySig.set(sigKey, locations);
  };

  for (const line of raw.split(/\r?\n/)) {
    if (line === "--") {
      flush();
      continue;
    }
    const matched = MATCH_RE.exec(line);
    if (matched?.groups) {
      flush();
      const path = matched.groups.path;
      const lineText = matched.groups.text;
      const lineNumber = matched.groups.line;
      if (
        path === undefined ||
        lineText === undefined ||
        lineNumber === undefined
      ) {
        continue;
      }
      if (path.endsWith(".d.ts")) {
        continue;
      }
      current = {
        path,
        lineno: Number.parseInt(lineNumber, 10),
        first: lineText,
      };
      bodyLines = [lineText];
      continue;
    }
    const context = CONTEXT_RE.exec(line);
    if (
      context?.groups &&
      current !== undefined &&
      context.groups.path === current.path &&
      context.groups.text !== undefined
    ) {
      bodyLines.push(context.groups.text);
    }
  }
  flush();
  return bySig;
}

function clip(value: string, width: number): string {
  if (value.length <= width) {
    return value;
  }
  return `${value.slice(0, width - 3)}...`;
}

function splitSigKey(key: string): {
  readonly name: string;
  readonly params: string;
} {
  const separator = key.indexOf("\0");
  if (separator < 0) {
    return { name: key, params: "" };
  }
  return { name: key.slice(0, separator), params: key.slice(separator + 1) };
}

function toCloneGroups(
  bySig: Map<string, string[]>,
  packageRoots: readonly string[],
): CloneGroup[] {
  const groups: CloneGroup[] = [];
  for (const [key, locations] of bySig) {
    if (locations.length < 2) {
      continue;
    }
    const { name, params } = splitSigKey(key);
    const packages = [
      ...new Set(locations.map((location) => {
        const path = location.replace(/:\d+$/, "");
        return packageOf(path, packageRoots);
      })),
    ].sort((left, right) => left.localeCompare(right));
    groups.push({ name, params, locations, packages });
  }
  groups.sort((left, right) => {
    const spanDiff = right.packages.length - left.packages.length;
    if (spanDiff !== 0) {
      return spanDiff;
    }
    const countDiff = right.locations.length - left.locations.length;
    if (countDiff !== 0) {
      return countDiff;
    }
    const nameDiff = left.name.localeCompare(right.name);
    if (nameDiff !== 0) {
      return nameDiff;
    }
    return left.params.localeCompare(right.params);
  });
  return groups;
}

function formatGroup(group: CloneGroup): string {
  const params = clip(group.params || "(none)", 120);
  const spanLabel = `span=${String(group.packages.length)}  ${group.packages.join(", ")}`;
  const header = `${group.name}(${params})  x${String(group.locations.length)}  ${spanLabel}`;
  const body = group.locations.map((location) => `  ${location}`).join("\n");
  return `\n${header}\n${body}`;
}

async function main(): Promise<void> {
  const packageRoots = parsePackageRoots(process.argv.slice(2));
  const groups = toCloneGroups(parseRecords(await text(stdin)), packageRoots);

  console.log("=== function clones (same name+params, count >= 2) ===");
  for (const group of groups) {
    console.log(formatGroup(group));
  }
  console.log(`\nCLONE_GROUPS=${String(groups.length)}`);
}

await main();
