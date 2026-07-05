#!/usr/bin/env node
// Quick test script for regulatory-monitor MCP server
import { spawn } from "child_process";

const server = spawn("npx", ["tsx", "src/index.ts"], {
  cwd: "/Users/bowler/Documents/apps/app-main/mcp/regulatory-monitor",
  stdio: ["pipe", "pipe", "pipe"],
});

let output = "";
server.stdout.on("data", (data) => {
  output += data.toString();
  console.log("[SERVER OUT]", data.toString().trim());
});
server.stderr.on("data", (data) => {
  console.error("[SERVER ERR]", data.toString().trim());
});

setTimeout(() => {
  const initMsg = {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test", version: "1.0.0" },
    },
  };
  server.stdin.write(JSON.stringify(initMsg) + "\n");
}, 500);

setTimeout(() => {
  const listTools = {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  };
  server.stdin.write(JSON.stringify(listTools) + "\n");
}, 1000);

setTimeout(() => {
  server.kill();
  console.log("\n--- Test completed ---");
}, 2000);
