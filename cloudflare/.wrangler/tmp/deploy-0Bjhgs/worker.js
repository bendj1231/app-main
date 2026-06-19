var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../../../../opt/homebrew/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// worker.ts
var jwksCache = null;
var JWKS_CACHE_MS = 24 * 60 * 60 * 1e3;
async function getJWKS(env2) {
  if (jwksCache && Date.now() - jwksCache.fetchedAt < JWKS_CACHE_MS) {
    return jwksCache.keys;
  }
  const jwksUrl = `https://${env2.AUTH0_DOMAIN}/.well-known/jwks.json`;
  const jwksRes = await fetch(jwksUrl, { cf: { cacheTtl: 3600 } });
  if (!jwksRes.ok) throw new Response(JSON.stringify({ error: "Failed to fetch JWKS" }), { status: 500 });
  const jwks = await jwksRes.json();
  jwksCache = { keys: jwks.keys, fetchedAt: Date.now() };
  return jwks.keys;
}
__name(getJWKS, "getJWKS");
async function verifyAuth0Token(request, env2) {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401 });
  }
  const token = header.slice(7);
  const jwksKeys = await getJWKS(env2);
  const parts = token.split(".");
  if (parts.length !== 3) throw new Response(JSON.stringify({ error: "Invalid JWT" }), { status: 401 });
  const headerJson = JSON.parse(atob(parts[0]));
  const kid = headerJson.kid;
  const keyData = jwksKeys.find((k) => k.kid === kid);
  if (!keyData) throw new Response(JSON.stringify({ error: "Signing key not found" }), { status: 401 });
  const jwk = {
    kty: keyData.kty,
    n: keyData.n,
    e: keyData.e,
    alg: "RS256",
    ext: true
  };
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const encoder = new TextEncoder();
  const signature = base64UrlDecode(parts[2]);
  const valid = await crypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    signature,
    encoder.encode(parts[0] + "." + parts[1])
  );
  if (!valid) throw new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
  const payload = JSON.parse(atob(parts[1]));
  if (payload.exp * 1e3 < Date.now()) throw new Response(JSON.stringify({ error: "Token expired" }), { status: 401 });
  return payload;
}
__name(verifyAuth0Token, "verifyAuth0Token");
function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = 4 - base64.length % 4;
  const padded = pad !== 4 ? base64 + "=".repeat(pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
__name(base64UrlDecode, "base64UrlDecode");
function corsHeaders(origin) {
  const allowed = ["https://pilotterminal.com", "https://pilotrecognition.com", "http://localhost:5173"];
  const reflect = origin && allowed.some((a) => origin.startsWith(a)) ? origin : allowed[0];
  return {
    "Access-Control-Allow-Origin": reflect,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json"
  };
}
__name(corsHeaders, "corsHeaders");
function jsonResponse(data, status = 200, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin)
  });
}
__name(jsonResponse, "jsonResponse");
async function getProfileByAuth0Id(db, auth0Id) {
  return db.prepare("SELECT * FROM profiles WHERE auth0_id = ?").bind(auth0Id).first();
}
__name(getProfileByAuth0Id, "getProfileByAuth0Id");
async function getProfileById(db, id) {
  return db.prepare("SELECT * FROM profiles WHERE id = ?").bind(id).first();
}
__name(getProfileById, "getProfileById");
function validateRequiredFields(body, required) {
  for (const field of required) {
    if (!(field in body) || body[field] === null || body[field] === void 0 || body[field] === "") {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}
__name(validateRequiredFields, "validateRequiredFields");
async function ensureProfile(db, auth0Id, email, name, originJurisdiction) {
  let profile3 = await getProfileByAuth0Id(db, auth0Id);
  if (!profile3) {
    const id = crypto.randomUUID();
    const displayName = name || email.split("@")[0];
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await db.prepare(`
      INSERT INTO profiles (id, auth0_id, email, display_name, role, status, subscription_tier, origin_jurisdiction, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, auth0Id, email, displayName, "pilot", "active", "free", originJurisdiction || null, now, now).run();
    profile3 = await getProfileById(db, id);
  }
  return profile3;
}
__name(ensureProfile, "ensureProfile");
var MAX_BODY_SIZE = 1 * 1024 * 1024;
var RATE_LIMIT_WINDOW_MS = 60 * 1e3;
var RATE_LIMIT_MAX = 60;
var rateLimitMap = /* @__PURE__ */ new Map();
function isRateLimited(identifier) {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}
__name(isRateLimited, "isRateLimited");
async function handleRequest(request, env2) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin") || void 0;
  const path = url.pathname;
  const method = request.method;
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  const contentLength = request.headers.get("Content-Length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return jsonResponse({ error: "Request body too large" }, 413, origin);
  }
  const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
  if (isRateLimited(`${method}:${path}:${clientIp}`)) {
    return jsonResponse({ error: "Rate limit exceeded" }, 429, origin);
  }
  if (path === "/api/health") {
    try {
      await env2.DB.prepare("SELECT 1").first();
      return jsonResponse({ status: "ok", db: "connected" }, 200, origin);
    } catch {
      return jsonResponse({ status: "error", db: "disconnected" }, 503, origin);
    }
  }
  if (path === "/api/webhooks/dodo" && method === "POST") {
    return handleDodoWebhook(request, env2);
  }
  if (path === "/api/webhooks/veremark" && method === "POST") {
    return handleVeremarkWebhook(request, env2);
  }
  let auth;
  try {
    auth = await verifyAuth0Token(request, env2);
  } catch (err) {
    if (err instanceof Response) return err;
    return jsonResponse({ error: "Unauthorized" }, 401, origin);
  }
  const db = env2.DB;
  if (path === "/api" && method === "POST") {
    const body = await request.json();
    const action = body.action;
    const params = body.params || {};
    if (!action) {
      return jsonResponse({ error: "Missing action" }, 400, origin);
    }
    if (action === "createProfile") {
      params._originJurisdiction = request.headers.get("CF-IPCountry") || void 0;
    }
    if (action === "batch") {
      const requests = body.requests;
      if (!Array.isArray(requests)) {
        return jsonResponse({ error: "batch requires requests array" }, 400, origin);
      }
      const results = {};
      for (const req of requests) {
        try {
          results[req.action] = await handleAction(req.action, req.params || {}, db, auth, env2);
        } catch (err) {
          results[req.action] = { error: err instanceof Error ? err.message : String(err) };
        }
      }
      return jsonResponse(results, 200, origin);
    }
    try {
      const result = await handleAction(action, params, db, auth, env2);
      return jsonResponse(result, 200, origin);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const status = msg === "Forbidden" ? 403 : msg === "Not found" ? 404 : 400;
      return jsonResponse({ error: msg }, status, origin);
    }
  }
  return jsonResponse({ error: "Not found" }, 404, origin);
}
__name(handleRequest, "handleRequest");
async function handleAction(action, params, db, auth, env2) {
  switch (action) {
    // ── Profile ──
    case "getProfile": {
      if (params.me === 1 || params.me === "1" || params.me === true) {
        const profile3 = await getProfileByAuth0Id(db, auth.sub);
        if (!profile3) throw new Error("Not found");
        return profile3;
      }
      if (params.id) {
        const profile3 = await getProfileById(db, params.id);
        if (!profile3) throw new Error("Not found");
        return profile3;
      }
      if (params.auth0_id) {
        const profile3 = await getProfileByAuth0Id(db, params.auth0_id);
        if (!profile3) throw new Error("Not found");
        return profile3;
      }
      throw new Error("Missing param: auth0_id, id, or me");
    }
    case "createProfile": {
      const missing = validateRequiredFields(params, ["email"]);
      if (missing) throw new Error(missing);
      const originJurisdiction = params._originJurisdiction;
      return ensureProfile(db, auth.sub, params.email, params.name, originJurisdiction);
    }
    case "updateProfile": {
      const id = params.id;
      if (!id) throw new Error("Missing id");
      const existing = await getProfileById(db, id);
      if (!existing) throw new Error("Not found");
      if (existing["auth0_id"] !== auth.sub) {
        const me = await getProfileByAuth0Id(db, auth.sub);
        if (!me || me["role"] !== "super_admin") throw new Error("Forbidden");
      }
      const allowed = /* @__PURE__ */ new Set([
        "display_name",
        "first_name",
        "last_name",
        "phone",
        "country_code",
        "date_of_birth",
        "nationality",
        "avatar_url",
        "profile_image_url",
        "current_flight_hours",
        "total_flight_hours",
        "mentorship_hours",
        "foundation_progress",
        "overall_recognition_score",
        "current_level",
        "current_occupation",
        "license_id",
        "country_of_license",
        "ratings",
        "is_enrolled_in_foundational",
        "subscription_status",
        "wallet_id",
        "wallet_email",
        "wallet_did",
        "referral_code"
      ]);
      for (const key of Object.keys(params)) {
        if (key.startsWith("_")) continue;
        if (!allowed.has(key)) throw new Error(`Field '${key}' is not allowed for update`);
      }
      const sets = [];
      const values = [];
      for (const key of allowed) {
        if (key in params) {
          sets.push(`${key} = ?`);
          values.push(params[key]);
        }
      }
      if (sets.length === 0) throw new Error("No fields to update");
      sets.push("updated_at = datetime('now')");
      values.push(id);
      await db.prepare(`UPDATE profiles SET ${sets.join(", ")} WHERE id = ?`).bind(...values).run();
      return getProfileById(db, id);
    }
    case "deleteProfile": {
      const id = params.id;
      if (!id) throw new Error("Missing id");
      const existing = await getProfileById(db, id);
      if (!existing) throw new Error("Not found");
      if (existing["auth0_id"] !== auth.sub) {
        const me = await getProfileByAuth0Id(db, auth.sub);
        if (!me || me["role"] !== "super_admin") throw new Error("Forbidden");
      }
      await db.prepare("DELETE FROM profiles WHERE id = ?").bind(id).run();
      return { deleted: true };
    }
    // ── Verification Status ──
    case "getVerificationStatus": {
      const userId = params.user_id;
      if (!userId) throw new Error("Missing user_id");
      const targetProfile = await getProfileById(db, userId);
      if (!targetProfile) throw new Error("Not found");
      if (targetProfile["auth0_id"] !== auth.sub) {
        const me = await getProfileByAuth0Id(db, auth.sub);
        if (!me || me["role"] !== "super_admin") throw new Error("Forbidden");
      }
      const { results } = await db.prepare(`
        SELECT credential_type, status, issued_at, expires_at, revoked_at
        FROM pilot_credentials
        WHERE user_id = ?
        ORDER BY credential_type ASC
      `).bind(userId).all();
      const credentialTypes = ["license", "medical", "radio_license", "english_proficiency", "flight_hours"];
      const statusMap = {};
      for (const type of credentialTypes) statusMap[type] = { valid: false, status: "missing" };
      for (const row of results || []) {
        const r = row;
        const type = r["credential_type"];
        const st = r["status"];
        statusMap[type] = {
          valid: st === "active",
          status: st,
          issued_at: r["issued_at"],
          expires_at: r["expires_at"]
        };
      }
      return {
        license: statusMap["license"],
        medical: statusMap["medical"],
        radio_license: statusMap["radio_license"],
        english_proficiency: statusMap["english_proficiency"],
        flight_hours: statusMap["flight_hours"]
      };
    }
    // ── Recognition ──
    case "getRecognitionScore": {
      const userId = params.user_id;
      if (!userId) throw new Error("Missing user_id");
      const row = await db.prepare("SELECT * FROM recognition_scores WHERE user_id = ?").bind(userId).first();
      if (!row) throw new Error("Not found");
      return row;
    }
    case "saveRecognitionScore": {
      const missing = validateRequiredFields(params, ["user_id"]);
      if (missing) throw new Error(missing);
      const userId = params.user_id;
      const existing = await db.prepare("SELECT id FROM recognition_scores WHERE user_id = ?").bind(userId).first();
      if (existing) {
        await db.prepare(`
          UPDATE recognition_scores SET
            total_score = ?, hours_score = ?, experience_score = ?, assessment_score = ?,
            mentorship_score = ?, score_tier = ?, breakdown = ?, recommendations = ?,
            last_calculated_at = datetime('now'), updated_at = datetime('now')
          WHERE user_id = ?
        `).bind(
          params.total_score || 0,
          params.hours_score || 0,
          params.experience_score || 0,
          params.assessment_score || 0,
          params.mentorship_score || 0,
          params.score_tier || "bronze",
          JSON.stringify(params.breakdown || {}),
          JSON.stringify(params.recommendations || []),
          userId
        ).run();
      } else {
        const id = crypto.randomUUID();
        await db.prepare(`
          INSERT INTO recognition_scores (id, user_id, total_score, hours_score, experience_score,
            assessment_score, mentorship_score, score_tier, breakdown, recommendations)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id,
          userId,
          params.total_score || 0,
          params.hours_score || 0,
          params.experience_score || 0,
          params.assessment_score || 0,
          params.mentorship_score || 0,
          params.score_tier || "bronze",
          JSON.stringify(params.breakdown || {}),
          JSON.stringify(params.recommendations || [])
        ).run();
      }
      return db.prepare("SELECT * FROM recognition_scores WHERE user_id = ?").bind(userId).first();
    }
    // ── Payments ──
    case "getPayments": {
      const userId = params.user_id;
      if (!userId) throw new Error("Missing user_id");
      const { results } = await db.prepare("SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC").bind(userId).all();
      return results || [];
    }
    case "createPayment": {
      const missing = validateRequiredFields(params, ["user_id", "amount_cents"]);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO payments (id, user_id, amount_cents, currency, tier_purchased,
          tax_amount, tax_rate_percent, dodo_payment_id, dodo_invoice_id, dodo_checkout_id,
          status, payment_method, receipt_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        params.user_id,
        params.amount_cents,
        params.currency || "USD",
        params.tier_purchased,
        params.tax_amount || 0,
        params.tax_rate_percent || 15,
        params.dodo_payment_id,
        params.dodo_invoice_id || null,
        params.dodo_checkout_id || null,
        params.status || "completed",
        params.payment_method || null,
        params.receipt_url || null
      ).run();
      return db.prepare("SELECT * FROM payments WHERE id = ?").bind(id).first();
    }
    // ── Checkout ──
    case "createCheckout": {
      if (!env2.DODO_API_KEY || !env2.DODO_PRODUCT_ID_RECOGNITION_PLUS) {
        throw new Error("Checkout not configured");
      }
      const profile3 = await getProfileByAuth0Id(db, auth.sub);
      if (!profile3) throw new Error("Profile not found");
      const dodoRes = await fetch("https://live.dodopayments.com/v1/checkouts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env2.DODO_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product_cart: [{ product_id: env2.DODO_PRODUCT_ID_RECOGNITION_PLUS, quantity: 1 }],
          customer: {
            email: profile3["email"],
            name: profile3["display_name"] || void 0
          },
          metadata: {
            user_id: profile3["id"],
            tier: "recognition_plus",
            source: "pilotrecognition_web"
          },
          return_url: "https://pilotrecognition.com/checkout/success",
          cancel_url: "https://pilotrecognition.com/checkout/cancel"
        })
      });
      if (!dodoRes.ok) {
        const errText = await dodoRes.text();
        console.error("[Checkout] Dodo error:", dodoRes.status, errText);
        throw new Error("Payment provider error");
      }
      const dodoData = await dodoRes.json();
      return { checkout_url: dodoData.checkout_url, session_id: dodoData.session_id };
    }
    // ── DIDs ──
    case "createDid": {
      const missing = validateRequiredFields(params, ["profile_id", "auth0_id", "did"]);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO pilot_dids (id, profile_id, auth0_id, did, did_method, public_key_jwk)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        params.profile_id,
        params.auth0_id,
        params.did,
        params.did_method || "did:key",
        JSON.stringify(params.public_key_jwk || {})
      ).run();
      return db.prepare("SELECT * FROM pilot_dids WHERE id = ?").bind(id).first();
    }
    case "getDid": {
      const auth0Id = params.auth0_id;
      if (!auth0Id) throw new Error("Missing auth0_id");
      const row = await db.prepare("SELECT * FROM pilot_dids WHERE auth0_id = ?").bind(auth0Id).first();
      if (!row) throw new Error("Not found");
      return row;
    }
    // ── Credentials ──
    case "createCredential": {
      const missing = validateRequiredFields(params, ["user_id", "credential_type", "issuer"]);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO pilot_credentials (id, user_id, credential_type, issuer, credential_data, walt_id, expires_at, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        params.user_id,
        params.credential_type,
        params.issuer,
        JSON.stringify(params.credential_data || {}),
        params.walt_id || null,
        params.expires_at || null,
        params.status || "active"
      ).run();
      return db.prepare("SELECT * FROM pilot_credentials WHERE id = ?").bind(id).first();
    }
    case "getCredentials": {
      const userId = params.user_id;
      if (!userId) throw new Error("Missing user_id");
      const { results } = await db.prepare("SELECT * FROM pilot_credentials WHERE user_id = ? ORDER BY issued_at DESC").bind(userId).all();
      return results || [];
    }
    // ── Enterprise ──
    case "createEnterprise": {
      const missing = validateRequiredFields(params, ["company_name"]);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO enterprise_profiles (id, company_name, industry, contact_email, contact_phone, website, country, employee_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        params.company_name,
        params.industry || null,
        params.contact_email || null,
        params.contact_phone || null,
        params.website || null,
        params.country || null,
        params.employee_count || null
      ).run();
      return db.prepare("SELECT * FROM enterprise_profiles WHERE id = ?").bind(id).first();
    }
    case "getEnterprises": {
      const { results } = await db.prepare("SELECT * FROM enterprise_profiles ORDER BY created_at DESC LIMIT 200").all();
      return results || [];
    }
    case "getEnterprise": {
      const id = params.id;
      if (!id) throw new Error("Missing id");
      const row = await db.prepare("SELECT * FROM enterprise_profiles WHERE id = ?").bind(id).first();
      if (!row) throw new Error("Not found");
      return row;
    }
    // ── Admin ──
    case "getAllPilots": {
      const me = await getProfileByAuth0Id(db, auth.sub);
      if (!me || me["role"] !== "super_admin") throw new Error("Forbidden");
      const { results } = await db.prepare("SELECT * FROM profiles ORDER BY created_at DESC LIMIT 500").all();
      return results || [];
    }
    case "updateUserTier": {
      const me = await getProfileByAuth0Id(db, auth.sub);
      if (!me || me["role"] !== "super_admin") throw new Error("Forbidden");
      const userId = params.user_id;
      const tier = params.tier;
      if (!userId || !tier) throw new Error("Missing user_id or tier");
      await db.prepare(`
        UPDATE profiles SET subscription_tier = ?, subscription_status = 'active', updated_at = datetime('now') WHERE id = ?
      `).bind(tier, userId).run();
      return getProfileById(db, userId);
    }
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}
__name(handleAction, "handleAction");
async function handleDodoWebhook(request, env2) {
  const origin = request.headers.get("Origin") || void 0;
  const payload = await request.text();
  if (env2.DODO_WEBHOOK_SECRET) {
    const sig = request.headers.get("x-webhook-signature") || "";
    const expected = await hmacSha256(payload, env2.DODO_WEBHOOK_SECRET);
    if (sig !== expected) {
      return jsonResponse({ error: "Invalid signature" }, 401, origin);
    }
  }
  const body = JSON.parse(payload);
  if (body.event_type === "payment.succeeded" || body.status === "completed") {
    const metadata = body.metadata || {};
    const userId = body.customer_id || metadata.user_id;
    const tier = metadata.tier || "pro";
    const amount = typeof body.amount === "number" ? body.amount : 0;
    const currency = body.currency || "USD";
    const paymentId = body.payment_id || body.id || "unknown";
    if (userId && typeof userId === "string") {
      try {
        await env2.DB.prepare(`
          INSERT INTO payments (id, user_id, amount_cents, currency, tier_purchased,
            tax_amount, tax_rate_percent, dodo_payment_id, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(),
          userId,
          Math.round(amount * 100),
          currency,
          tier,
          Math.round(amount * 100 * 0.15),
          15,
          paymentId,
          "completed"
        ).run();
        await env2.DB.prepare(`
          UPDATE profiles SET subscription_tier = ?, subscription_status = 'active', updated_at = datetime('now')
          WHERE id = ?
        `).bind(tier, userId).run();
      } catch (dbErr) {
        console.error("[DodoWebhook] DB error:", dbErr);
      }
    } else {
      console.warn("[DodoWebhook] Missing userId in payload:", body);
    }
  }
  return jsonResponse({ received: true }, 200, origin);
}
__name(handleDodoWebhook, "handleDodoWebhook");
async function handleVeremarkWebhook(request, env2) {
  const origin = request.headers.get("Origin") || void 0;
  const payload = await request.text();
  if (env2.VEREMARK_WEBHOOK_SECRET) {
    const sig = request.headers.get("x-signature") || "";
    const expected = await hmacSha256(payload, env2.VEREMARK_WEBHOOK_SECRET);
    if (sig !== expected) {
      return jsonResponse({ error: "Invalid signature" }, 401, origin);
    }
  }
  const body = JSON.parse(payload);
  if (body.check_id && body.candidate_id) {
    const profile3 = await env2.DB.prepare("SELECT id FROM profiles WHERE auth0_id = ?").bind(body.candidate_id).first();
    if (profile3) {
      const profileId = profile3["id"];
      const credentialType = body.check_type || "license";
      const newStatus = body.status === "completed" ? "active" : body.status === "expired" ? "expired" : body.status === "revoked" ? "revoked" : "active";
      await env2.DB.prepare(`
        INSERT INTO pilot_credentials (id, user_id, credential_type, issuer, credential_data, status, issued_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          status = excluded.status,
          credential_data = excluded.credential_data,
          issued_at = excluded.issued_at
      `).bind(
        body.check_id || crypto.randomUUID(),
        profileId,
        credentialType,
        "veremark",
        JSON.stringify({ check_id: body.check_id, candidate_id: body.candidate_id, status: body.status, completed_at: body.completed_at }),
        newStatus
      ).run();
    }
  }
  if (body.status === "expired" || body.status === "revoked" || body.status === "failed") {
    const profile3 = await env2.DB.prepare("SELECT id FROM profiles WHERE auth0_id = ?").bind(body.candidate_id).first();
    if (profile3) {
      const profileId = profile3["id"];
      try {
        await env2.DB.prepare(`
          UPDATE pilot_credentials
          SET status = 'revoked', revoked_at = datetime('now')
          WHERE user_id = ? AND credential_type = ?
        `).bind(profileId, body.check_type || "license").run();
      } catch (revErr) {
        console.error("[VeremarkWebhook] Revocation cascade error:", revErr);
      }
    }
  }
  return jsonResponse({ received: true }, 200, origin);
}
__name(handleVeremarkWebhook, "handleVeremarkWebhook");
async function hmacSha256(message, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
__name(hmacSha256, "hmacSha256");
var worker_default = {
  async fetch(request, env2) {
    try {
      return await handleRequest(request, env2);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Worker error:", msg);
      return jsonResponse({ error: "Internal error", message: msg }, 500);
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
