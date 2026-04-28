/**
 * Retry Handler Utility
 * Provides retry logic for failed Supabase queries and API calls
 */

export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  onRetry: () => {},
};

/**
 * Retries a function with exponential backoff
 * 
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the function or throws the last error
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error;
  
  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === opts.maxRetries) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      const delay = opts.delayMs * Math.pow(opts.backoffMultiplier, attempt - 1);
      
      // Call onRetry callback
      opts.onRetry(attempt, lastError);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Retries a Supabase query with specific error handling
 * 
 * @param queryFn - The Supabase query function to retry
 * @param options - Retry configuration options
 * @returns The result of the query or throws the last error
 */
export async function retrySupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: RetryOptions = {}
): Promise<T> {
  const result = await withRetry(
    async () => {
      const { data, error } = await queryFn();
      if (error) {
        throw new Error(error.message || 'Supabase query failed');
      }
      if (!data) {
        throw new Error('No data returned from Supabase query');
      }
      return data;
    },
    options
  );
  
  return result;
}
