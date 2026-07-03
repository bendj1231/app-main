'use client';
import { useCallback } from 'react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

type Operation = 'select' | 'insert' | 'update' | 'delete' | 'count';

class QueryBuilder {
  private table: string;
  private operation: Operation = 'select';
  private where: Record<string, unknown> = {};
  private orderBy?: string;
  private limitVal = 200;
  private countExact = false;
  private dbNameVal = 'DB';
  private updateData?: Record<string, unknown>;
  private deleteId?: string;
  private callApi: (action: string, params: Record<string, unknown>) => Promise<unknown>;

  constructor(table: string, callApi: (action: string, params: Record<string, unknown>) => Promise<unknown>) {
    this.table = table;
    this.callApi = callApi;
  }

  select(columns?: string, opts?: { count?: 'exact'; head?: boolean }) {
    this.operation = 'select';
    if (opts?.count) this.countExact = true;
    return this;
  }

  eq(field: string, value: unknown) {
    this.where[field] = value;
    return this;
  }

  is(field: string, value: unknown) {
    this.where[field] = value;
    return this;
  }

  neq(field: string, _value: unknown) {
    // Stub: Worker only supports exact equality; this filter is ignored
    return this;
  }

  in(field: string, _values: unknown[]) {
    // Stub: Worker only supports exact equality; first value is used if any
    return this;
  }

  not(field: string, _operator: string, _value: unknown) {
    // Minimal stub for .not('profile_image_url', 'is', null)
    return this;
  }

  gte(field: string, value: unknown) {
    this.where[field] = value; // Approximation; Worker uses exact equality only
    return this;
  }

  lte(field: string, value: unknown) {
    this.where[field] = value; // Approximation
    return this;
  }

  ilike(field: string, _pattern: string) {
    this.where[field] = _pattern.replace(/%/g, ''); // Approximation; strip wildcards
    return this;
  }

  or(_filter: string) {
    return this;
  }

  order(field: string, opts?: { ascending: boolean }) {
    this.orderBy = `${field} ${opts?.ascending === false ? 'DESC' : 'ASC'}`;
    return this;
  }

  single() {
    this.limitVal = 1;
    return this;
  }

  maybeSingle() {
    this.limitVal = 1;
    return this;
  }

  limit(n: number) {
    this.limitVal = n;
    return this;
  }

  update(data: Record<string, unknown>) {
    this.operation = 'update';
    this.updateData = data;
    return this;
  }

  insert(data: Record<string, unknown> | Record<string, unknown>[]) {
    this.operation = 'insert';
    this.updateData = Array.isArray(data) ? data[0] : data;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  dbName(name: string) {
    this.dbNameVal = name;
    return this;
  }

  async then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    try {
      const value = await this.execute();
      return onfulfilled ? onfulfilled(value) : value as TResult1;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }

  private async execute(): Promise<any> {
    if (this.operation === 'select') {
      const data = await this.callApi('queryTable', {
        table: this.table,
        operation: 'select',
        where: this.where,
        orderBy: this.orderBy,
        limit: this.limitVal,
        dbName: this.dbNameVal,
      }) as any[];
      let resultData: any = data;
      let count = data.length;
      if (this.limitVal === 1 && !this.countExact) {
        resultData = data[0] || null;
      }
      if (this.countExact) {
        const countRes = await this.callApi('queryTable', {
          table: this.table,
          operation: 'count',
          where: this.where,
          dbName: this.dbNameVal,
        }) as { count: number };
        count = countRes.count;
      }
      return { data: resultData, count, error: null };
    }

    if (this.operation === 'count') {
      const result = await this.callApi('queryTable', {
        table: this.table,
        operation: 'count',
        where: this.where,
        dbName: this.dbNameVal,
      }) as { count: number };
      return { data: [], count: result.count, error: null };
    }

    if (this.operation === 'insert') {
      const result = await this.callApi('queryTable', {
        table: this.table,
        operation: 'insert',
        data: this.updateData,
        dbName: this.dbNameVal,
      }) as { id: string };
      return { data: result, error: null };
    }

    if (this.operation === 'update') {
      const id = this.where.id as string;
      if (!id) throw new Error('update requires id in where');
      // Strip id from where for update data
      const { id: _id, ...restWhere } = this.where;
      const result = await this.callApi('queryTable', {
        table: this.table,
        operation: 'update',
        id,
        data: this.updateData,
        dbName: this.dbNameVal,
      }) as { updated: boolean };
      return { data: result, error: null };
    }

    if (this.operation === 'delete') {
      const id = this.where.id as string;
      if (!id) throw new Error('delete requires id in where');
      const result = await this.callApi('queryTable', {
        table: this.table,
        operation: 'delete',
        id,
        dbName: this.dbNameVal,
      }) as { deleted: boolean };
      return { data: result, error: null };
    }

    throw new Error(`Unknown operation: ${this.operation}`);
  }
}

export function useDb() {
  const { callApi } = useWorkerAuth();

  const from = useCallback((table: string) => {
    return new QueryBuilder(table, callApi);
  }, [callApi]);

  return { from };
}
