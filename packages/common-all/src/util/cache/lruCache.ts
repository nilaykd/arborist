import * as LRUModule from "lru-cache";
import { Cache } from "./cache";
import { DendronError } from "../../error";

// Compatible with lru-cache v6 (default export is constructor) and v10 (named export LRUCache)
const LRU: any = (LRUModule as any).default || (LRUModule as any).LRUCache || LRUModule;

export type LruCacheOpts = {
  /** Max number of items to keep in cache. */
  maxItems: number;
};

/**
 *  Least recently used cache implementation. Deletes the least-recently-used
 *  items, when cache max items is reached.
 *  (get methods count toward recently used order) */
export class LruCache<K, T> implements Cache<K, T> {
  private cache: any;

  constructor(opts: LruCacheOpts) {
    if (opts.maxItems <= 0) {
      throw new DendronError({
        message: `Max items cannot be less than or equal to 0`,
      });
    }

    this.cache = new LRU({
      max: opts.maxItems,
    });
  }

  get(key: K): T | undefined {
    return this.cache.get(key);
  }

  set(key: K, data: T): void {
    this.cache.set(key, data);
  }

  drop(key: K): void {
    // v6 uses .del(), v10 uses .delete()
    if (this.cache.delete) {
      this.cache.delete(key);
    } else {
      this.cache.del(key);
    }
  }
}
