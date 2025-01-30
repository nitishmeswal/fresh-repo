import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 300000; // 5 minutes in milliseconds
const MAX_REQUESTS = 100; // Maximum requests per 5 minutes
const RETRY_AFTER = 5000; // Wait 5 seconds between retries

interface RateLimitState {
  requests: number;
  windowStart: number;
}

const rateLimitState: RateLimitState = {
  requests: 0,
  windowStart: Date.now()
};

// Reset rate limit window if needed
const checkRateLimit = () => {
  const now = Date.now();
  if (now - rateLimitState.windowStart >= RATE_LIMIT_WINDOW) {
    rateLimitState.requests = 0;
    rateLimitState.windowStart = now;
  }
};

// Wrapper function to add rate limiting
const withRateLimit = async <T>(fn: () => Promise<T>): Promise<T> => {
  checkRateLimit();
  
  if (rateLimitState.requests >= MAX_REQUESTS) {
    console.log('Rate limit reached, waiting before retry...');
    await new Promise(resolve => setTimeout(resolve, RETRY_AFTER));
    return withRateLimit(fn);
  }
  
  try {
    rateLimitState.requests++;
    return await fn();
  } catch (error: any) {
    if (error?.status === 429) {
      console.log('Rate limit error from Supabase, retrying...');
      await new Promise(resolve => setTimeout(resolve, RETRY_AFTER));
      return withRateLimit(fn);
    }
    throw error;
  }
};

// Client-side Supabase client (for components and hooks)
export const createBrowserClient = () => {
  const client = createClientComponentClient();
  
  // Wrap auth methods with rate limiting
  const originalAuth = client.auth;
  client.auth = new Proxy(originalAuth, {
    get(target, prop) {
      const original = target[prop as keyof typeof target];
      if (typeof original === 'function') {
        return async (...args: any[]) => {
          return withRateLimit(() => original.apply(target, args));
        };
      }
      return original;
    }
  });
  
  return client;
};

// Direct Supabase client (for API routes)
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Wrap the direct client with rate limiting
export const supabase = new Proxy(supabaseClient, {
  get(target, prop) {
    const original = target[prop as keyof typeof target];
    if (prop === 'auth' && typeof original === 'object') {
      return new Proxy(original, {
        get(authTarget, authProp) {
          const authMethod = authTarget[authProp as keyof typeof authTarget];
          if (typeof authMethod === 'function') {
            return async (...args: any[]) => {
              return withRateLimit(() => authMethod.apply(authTarget, args));
            };
          }
          return authMethod;
        }
      });
    }
    return original;
  }
});
