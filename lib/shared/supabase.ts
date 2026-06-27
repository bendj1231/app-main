// STUB — Supabase client removed. Migrate to Worker API.
// This file exists to prevent build errors while other files are being migrated.
// TODO: Remove after all imports are replaced with Worker calls.

const noopChannel = {
  on: () => noopChannel,
  subscribe: () => ({ unsubscribe: () => {} }),
};

const noopAuth = {
  getSession: async () => ({ data: { session: null }, error: null }),
  getUser: async () => ({ data: { user: null }, error: null }),
  resend: async () => ({ data: {}, error: null }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  signInWithOAuth: async () => ({ data: {}, error: null }),
  signInWithPassword: async () => ({ data: {}, error: null }),
  signUp: async () => ({ data: {}, error: null }),
  signOut: async () => ({ error: null }),
};

// Chainable query builder that returns itself for all filter methods
// and resolves to empty data when awaited
function createQueryBuilder(table: string) {
  const builder: any = {
    _table: table,
    _method: 'select',
    _columns: '*',
    _filters: [] as any[],
    _order: null as any,
    _limit: null as number | null,
    _single: false,

    select(columns = '*') {
      builder._columns = columns;
      builder._method = 'select';
      return builder;
    },
    insert(values: any) {
      builder._method = 'insert';
      builder._values = values;
      return builder;
    },
    update(values: any) {
      builder._method = 'update';
      builder._values = values;
      return builder;
    },
    upsert(values: any) {
      builder._method = 'upsert';
      builder._values = values;
      return builder;
    },
    delete() {
      builder._method = 'delete';
      return builder;
    },
    eq(column: string, value: any) {
      builder._filters.push({ type: 'eq', column, value });
      return builder;
    },
    neq(column: string, value: any) {
      builder._filters.push({ type: 'neq', column, value });
      return builder;
    },
    gt(column: string, value: any) {
      builder._filters.push({ type: 'gt', column, value });
      return builder;
    },
    lt(column: string, value: any) {
      builder._filters.push({ type: 'lt', column, value });
      return builder;
    },
    gte(column: string, value: any) {
      builder._filters.push({ type: 'gte', column, value });
      return builder;
    },
    lte(column: string, value: any) {
      builder._filters.push({ type: 'lte', column, value });
      return builder;
    },
    in(column: string, values: any[]) {
      builder._filters.push({ type: 'in', column, values });
      return builder;
    },
    is(column: string, value: any) {
      builder._filters.push({ type: 'is', column, value });
      return builder;
    },
    like(column: string, pattern: string) {
      builder._filters.push({ type: 'like', column, pattern });
      return builder;
    },
    ilike(column: string, pattern: string) {
      builder._filters.push({ type: 'ilike', column, pattern });
      return builder;
    },
    contains(column: string, value: any) {
      builder._filters.push({ type: 'contains', column, value });
      return builder;
    },
    or(query: string) {
      builder._filters.push({ type: 'or', query });
      return builder;
    },
    and(query: string) {
      builder._filters.push({ type: 'and', query });
      return builder;
    },
    order(column: string, opts?: { ascending?: boolean }) {
      builder._order = { column, ascending: opts?.ascending ?? true };
      return builder;
    },
    limit(count: number) {
      builder._limit = count;
      return builder;
    },
    range(from: number, to: number) {
      builder._range = { from, to };
      return builder;
    },
    single() {
      builder._single = true;
      return builder.then((res: any) => res);
    },
    maybeSingle() {
      builder._single = true;
      return builder.then((res: any) => res);
    },
    csv() {
      return Promise.resolve({ data: '', error: null });
    },
    explain() {
      return builder;
    },
    // Makes the builder thenable — resolves when awaited
    then(onFulfilled?: any, onRejected?: any) {
      const result = {
        data: builder._single ? null : [],
        error: null,
        count: null,
        status: 200,
        statusText: 'OK',
      };
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    catch(onRejected: any) {
      return Promise.resolve({ data: builder._single ? null : [], error: null }).catch(onRejected);
    },
    finally(onFinally: any) {
      return Promise.resolve({ data: builder._single ? null : [], error: null }).finally(onFinally);
    },
  };

  return builder;
}

export const supabase = {
  auth: noopAuth,
  channel: () => noopChannel,
  removeChannel: () => {},
  removeAllChannels: () => {},
  from: (table: string) => createQueryBuilder(table),
  rpc: async () => ({ data: [], error: null }),
  storage: {
    from: () => ({
      upload: async () => ({ data: { path: '' }, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
      createSignedUrl: async () => ({ data: { signedUrl: '' }, error: null }),
      list: async () => ({ data: [], error: null }),
      remove: async () => ({ data: [], error: null }),
    }),
  },
  functions: {
    invoke: async () => ({ data: null, error: null }),
  },
} as any;
