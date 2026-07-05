#!/usr/bin/env node
/**
 * Regulatory Monitor MCP Server
 * Watches FAA/EASA dockets and drafts comment letters for PilotRecognition
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Data Storage ---
const DATA_DIR = join(__dirname, "..", "data");
const TRACKED_FILE = join(DATA_DIR, "tracked_dockets.json");

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function loadTracked(): any[] {
  ensureDataDir();
  if (!existsSync(TRACKED_FILE)) return [];
  try {
    return JSON.parse(readFileSync(TRACKED_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveTracked(dockets: any[]) {
  ensureDataDir();
  writeFileSync(TRACKED_FILE, JSON.stringify(dockets, null, 2));
}

// --- FAA Regulations.gov API ---
const REGULATIONS_API_BASE = "https://www.regulations.gov/api/v4";

async function searchFaaDockets(keywords: string, postedSince?: string) {
  const params = new URLSearchParams({
    "filter[agencyId]": "DOT",
    "filter[docketType]": "Rulemaking",
    "filter[searchTerm]": keywords,
    sort: "postedDateDesc",
    "page[size]": "20",
  });
  if (postedSince) params.append("filter[postedDate][ge]", postedSince);

  const res = await fetch(`${REGULATIONS_API_BASE}/documents?${params.toString()}`, {
    headers: { Accept: "application/vnd.api+json" },
  });
  if (!res.ok) throw new Error(`Regulations.gov error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function getFaaDocketDetails(docketId: string) {
  const res = await fetch(`${REGULATIONS_API_BASE}/documents/${docketId}`, {
    headers: { Accept: "application/vnd.api+json" },
  });
  if (!res.ok) throw new Error(`Regulations.gov error: ${res.status}`);
  return res.json();
}

// --- EASA Rulemaking (HTML scraping fallback) ---
async function searchEasaRulemaking(keywords: string) {
  const res = await fetch(
    `https://www.easa.europa.eu/regulations/rulemaking?search=${encodeURIComponent(keywords)}`,
    { headers: { Accept: "text/html" } }
  );
  if (!res.ok) throw new Error(`EASA fetch error: ${res.status}`);
  const html = await res.text();
  // Extract rulemaking task titles and links with a simple regex
  const matches: { title: string; url: string; code: string }[] = [];
  const taskRegex = /href="(\/regulations\/rulemaking\/[^"]+)"[^>]*>([^<]+RMT[^<]+)</g;
  let m;
  while ((m = taskRegex.exec(html)) !== null) {
    const url = `https://www.easa.europa.eu${m[1]}`;
    const title = m[2].trim();
    const codeMatch = title.match(/RMT\.\d+/);
    matches.push({ title, url, code: codeMatch ? codeMatch[0] : "" });
  }
  // Deduplicate
  const seen = new Set<string>();
  return matches.filter((x) => {
    if (seen.has(x.url)) return false;
    seen.add(x.url);
    return true;
  });
}

// --- Comment Letter Templates ---
const COMMENT_TEMPLATE_FAA = `Submitted via Regulations.gov Docket {docketId}

To: Department of Transportation / Federal Aviation Administration
Re: {docketTitle}

PilotRecognition, Inc. — Aviation Verification Infrastructure

Dear Sir/Madam,

PilotRecognition maintains the aviation industry’s verified pilot competency infrastructure. Our platform tracks over 50,000 verified pilot profiles, including flight time attestations, type-rating verifications, and simulator-based competency metrics. We write today to urge the FAA to incorporate verified digital competency records as a recognized pathway within the proposed regulatory framework.

Our data reveals a structural mismatch in the current pilot pipeline:

1. Hour-bar inflation does not correlate with safety outcomes. Our analysis shows that 6,000-hour Certified Flight Instructors are routinely rejected by Part 121 carriers while 1,500-hour candidates with identical logbook signatures are accepted. The difference is not competence; it is data transparency.

2. Manufacturer-controlled asset scarcity (lease-rate escalation, delivery delays) has forced airlines to raise hiring thresholds not because pilots are less capable, but because airlines lack tools to verify capability at lower hour totals.

3. Competency-Based Training and Assessment (CBTA) has been proven effective in EASA jurisdictions and in the FAA’s own Advanced Qualification Program (AQP). The missing link is an interoperable, tamper-evident verification layer that connects training outcomes to hiring decisions.

We respectfully recommend the following:

(a) Recognize verified digital competency profiles — anchored to blockchain-attested flight logs and simulator telemetry — as supplemental evidence of qualification alongside raw flight hours.

(b) Direct the Aviation Rulemaking Advisory Committee (ARAC) to study the correlation between verified competency metrics and operational safety, using anonymized datasets from platforms such as PilotRecognition.

(c) Align any new flight-crew training requirements with ICAO Doc 9995 (PANS-Training) provisions for CBTA, ensuring U.S. carriers remain competitive in global talent markets.

We welcome the opportunity to brief the FAA on our dataset and to provide technical input as this rulemaking proceeds.

Respectfully submitted,
PilotRecognition Regulatory Affairs
Date: {date}
`;

const COMMENT_TEMPLATE_EASA = `Submitted via EASA Comment Response Tool (CRT)
Notice of Proposed Amendment: {npaReference}

PilotRecognition, Inc. — Aviation Verification Infrastructure

Dear EASA Rulemaking Directorate,

PilotRecognition operates the aviation industry’s verified pilot competency infrastructure, encompassing over 50,000 verified pilot profiles across EASA and third-country jurisdictions. We comment on the proposed amendments with the following observations.

Structural analysis of the European pilot pipeline reveals a margin squeeze in the middle layer:

• OEM duopoly (Airbus / Boeing) controls lease pricing and delivery schedules, restricting airline fleet expansion.
• Airlines respond by raising experience bars (type-rating prerequisites, minimum flight-time requirements), which locks out otherwise competent candidates.
• Approved Training Organisations (ATOs) and Type Rating Centres (TRCs) absorb the operational risk but possess zero pricing power against either the OEM ceiling or the regulatory floor.

Our data indicates that this squeeze is producing two harmful outcomes:

1. Qualified instructors with 5,000+ hours are denied airline positions because their extensive multi-engine, instrument, and instructional time is invisible to automated hiring filters.
2. Graduates of integrated MPL and ATPL programmes are forced into unpaid or low-paid “hour-building” roles that do not enhance competence, merely to satisfy prescriptive totals.

We recommend the following amendments:

(i) Expand the CBTA pathway so that a verified competency profile — including simulator-assessed non-technical skills (NTS), line-oriented flight training (LOFT) outcomes, and multi-crew cooperation (MCC) ratings — may substitute for up to 50% of the prescriptive flight-time requirement, subject to AQP-style oversight.

(ii) Mandate interoperability standards for verified pilot data, enabling ATOs, operators, and National Aviation Authorities (NAAs) to query a single, tamper-evident record rather than re-verifying paper logbooks at every career transition.

(iii) Task EASA’s Safety Analysis and Research Department with a correlation study between verified-competency hiring and long-term operational safety, using anonymised datasets contributed by industry verification platforms.

We stand ready to provide technical evidence and to participate in any working group established to advance these objectives.

Respectfully submitted,
PilotRecognition Regulatory Affairs
Date: {date}
`;

// --- MCP Tool Definitions ---
const TOOLS: Tool[] = [
  {
    name: "search_faa_dockets",
    description:
      "Search FAA rulemaking dockets on Regulations.gov by keyword. Returns open/closed dockets, titles, posted dates, and comment deadlines.",
    inputSchema: {
      type: "object",
      properties: {
        keywords: {
          type: "string",
          description:
            'Search terms. E.g. "pilot training", "flight time", "competency based", "CBTA", "Part 141"',
        },
        postedSince: {
          type: "string",
          description:
            'ISO date (YYYY-MM-DD) to filter dockets posted on or after this date. Optional.',
        },
      },
      required: ["keywords"],
    },
  },
  {
    name: "get_faa_docket_details",
    description:
      "Fetch full details for a specific Regulations.gov docket ID, including comment period status, abstract, and attached documents.",
    inputSchema: {
      type: "object",
      properties: {
        docketId: {
          type: "string",
          description: "The Regulations.gov docket/document ID (e.g., FAA-2022-1356)",
        },
      },
      required: ["docketId"],
    },
  },
  {
    name: "search_easa_rulemaking",
    description:
      "Search EASA rulemaking tasks and Notice of Proposed Amendments (NPAs) by keyword on easa.europa.eu.",
    inputSchema: {
      type: "object",
      properties: {
        keywords: {
          type: "string",
          description: 'Search terms. E.g. "CBTA", "pilot training", "RMT.0379"',
        },
      },
      required: ["keywords"],
    },
  },
  {
    name: "draft_comment_letter",
    description:
      "Generate a formal regulatory comment letter from the PilotRecognition template for FAA or EASA.",
    inputSchema: {
      type: "object",
      properties: {
        agency: {
          type: "string",
          enum: ["FAA", "EASA"],
          description: "Target regulator",
        },
        docketId: {
          type: "string",
          description: "Docket ID or NPA reference",
        },
        docketTitle: {
          type: "string",
          description: "Title of the rulemaking action",
        },
        customNotes: {
          type: "string",
          description: "Optional additional paragraphs to append",
        },
      },
      required: ["agency", "docketId", "docketTitle"],
    },
  },
  {
    name: "track_docket",
    description:
      "Add a docket or rulemaking task to the local tracking list. Use this to build a watchlist of items to monitor or file comments on.",
    inputSchema: {
      type: "object",
      properties: {
        agency: { type: "string", enum: ["FAA", "EASA", "ICAO", "UK_CAA", "TC"] },
        docketId: { type: "string", description: "Docket / NPA / reference number" },
        title: { type: "string" },
        url: { type: "string" },
        commentDeadline: { type: "string", description: "ISO date YYYY-MM-DD, if known" },
        status: {
          type: "string",
          enum: ["monitoring", "drafting", "filed", "closed"],
          description: "Current tracking status",
        },
      },
      required: ["agency", "docketId", "title"],
    },
  },
  {
    name: "list_tracked_dockets",
    description:
      "List all dockets currently being tracked, optionally filtered by agency or status.",
    inputSchema: {
      type: "object",
      properties: {
        agency: { type: "string", description: "Filter by agency code" },
        status: { type: "string", description: "Filter by status" },
      },
    },
  },
  {
    name: "update_docket_status",
    description: "Update the status of a tracked docket (e.g., from 'drafting' to 'filed').",
    inputSchema: {
      type: "object",
      properties: {
        docketId: { type: "string" },
        status: { type: "string", enum: ["monitoring", "drafting", "filed", "closed"] },
        notes: { type: "string", description: "Optional notes to append" },
      },
      required: ["docketId", "status"],
    },
  },
];

// --- Server Setup ---
const server = new Server(
  { name: "regulatory-monitor", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (!args) throw new Error(`No arguments provided for tool ${name}`);

  // 1. search_faa_dockets
  if (name === "search_faa_dockets") {
    const data = await searchFaaDockets(args.keywords as string, args.postedSince as string | undefined);
    const docs = data.data?.map((d: any) => ({
      id: d.id,
      title: d.attributes?.title || d.attributes?.documentType || "Untitled",
      postedDate: d.attributes?.postedDate,
      commentEndDate: d.attributes?.commentEndDate,
      openComment: d.attributes?.openComment,
      docketId: d.attributes?.docketId,
      summary: d.attributes?.summary?.substring(0, 300) + "...",
    })) || [];
    return {
      content: [
        {
          type: "text",
          text: `Found ${docs.length} FAA dockets for "${args.keywords}":\n\n${JSON.stringify(docs, null, 2)}`,
        },
      ],
    };
  }

  // 2. get_faa_docket_details
  if (name === "get_faa_docket_details") {
    const data = await getFaaDocketDetails(args.docketId as string);
    const attr = data.data?.attributes || {};
    return {
      content: [
        {
          type: "text",
          text: `Docket: ${args.docketId}\nTitle: ${attr.title || attr.documentType}\nPosted: ${attr.postedDate}\nComment End: ${attr.commentEndDate}\nOpen for Comment: ${attr.openComment}\nSummary: ${attr.summary || "N/A"}\n\nFull JSON:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  // 3. search_easa_rulemaking
  if (name === "search_easa_rulemaking") {
    const results = await searchEasaRulemaking(args.keywords as string);
    return {
      content: [
        {
          type: "text",
          text: `Found ${results.length} EASA rulemaking tasks for "${args.keywords}":\n\n${JSON.stringify(results, null, 2)}`,
        },
      ],
    };
  }

  // 4. draft_comment_letter
  if (name === "draft_comment_letter") {
    const agency = args.agency as string;
    const template = agency === "EASA" ? COMMENT_TEMPLATE_EASA : COMMENT_TEMPLATE_FAA;
    let letter = template
      .replace(/{docketId}/g, args.docketId as string)
      .replace(/{docketTitle}/g, (args.docketTitle as string) || "")
      .replace(/{npaReference}/g, args.docketId as string)
      .replace(/{date}/g, new Date().toISOString().split("T")[0]);
    if (args.customNotes) {
      letter += `\n\nADDITIONAL COMMENTS:\n${args.customNotes}\n`;
    }
    return {
      content: [
        {
          type: "text",
          text: `--- Draft Comment Letter (${agency}) ---\n\n${letter}\n\n--- End of Draft ---\n\nSave this to a file and submit via ${agency === "EASA" ? "comments.easa.europa.eu" : "regulations.gov"}.`,
        },
      ],
    };
  }

  // 5. track_docket
  if (name === "track_docket") {
    const tracked = loadTracked();
    const entry = {
      id: `${args.agency}-${args.docketId}`,
      agency: args.agency,
      docketId: args.docketId,
      title: args.title,
      url: args.url || "",
      commentDeadline: args.commentDeadline || "",
      status: args.status || "monitoring",
      addedDate: new Date().toISOString(),
      notes: "",
    };
    const existingIdx = tracked.findIndex((d: any) => d.id === entry.id);
    if (existingIdx >= 0) tracked[existingIdx] = { ...tracked[existingIdx], ...entry };
    else tracked.push(entry);
    saveTracked(tracked);
    return {
      content: [
        {
          type: "text",
          text: `Tracked docket: ${entry.id}\nStatus: ${entry.status}\nTotal tracked: ${tracked.length}`,
        },
      ],
    };
  }

  // 6. list_tracked_dockets
  if (name === "list_tracked_dockets") {
    let tracked = loadTracked();
    if (args.agency) tracked = tracked.filter((d: any) => d.agency === args.agency);
    if (args.status) tracked = tracked.filter((d: any) => d.status === args.status);
    return {
      content: [
        {
          type: "text",
          text: `Tracked dockets (${tracked.length}):\n\n${JSON.stringify(tracked, null, 2)}`,
        },
      ],
    };
  }

  // 7. update_docket_status
  if (name === "update_docket_status") {
    const tracked = loadTracked();
    const idx = tracked.findIndex((d: any) => d.docketId === args.docketId);
    if (idx < 0) throw new Error(`Docket ${args.docketId} not found in tracker.`);
    tracked[idx].status = args.status;
    if (args.notes) {
      tracked[idx].notes = tracked[idx].notes
        ? `${tracked[idx].notes}\n${new Date().toISOString()}: ${args.notes}`
        : `${new Date().toISOString()}: ${args.notes}`;
    }
    saveTracked(tracked);
    return {
      content: [
        {
          type: "text",
          text: `Updated ${args.docketId} → ${args.status}\nNotes: ${tracked[idx].notes || "None"}`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// --- Start ---
const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
  console.error("Server error:", err);
  process.exit(1);
});
