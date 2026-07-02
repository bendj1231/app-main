/**
 * Bookmark Service
 *
 * Handles all bookmark-related database operations via Cloudflare Worker API
 */

export interface BookmarkItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'aircraft' | 'pathway' | 'program' | 'airline' | 'manufacturer';
  title: string;
  description?: string;
  image_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface BookmarkCreateInput {
  item_id: string;
  item_type: 'aircraft' | 'pathway' | 'program' | 'airline' | 'manufacturer';
  title: string;
  description?: string;
  image_url?: string;
  metadata?: Record<string, unknown>;
}

// Helper type for callApi
 type CallApiFn = <T>(action: string, params?: Record<string, unknown>) => Promise<T>;

class BookmarkService {
  private callApi: CallApiFn;

  constructor(callApi: CallApiFn) {
    this.callApi = callApi;
  }

  /**
   * Get all bookmarks for the current user
   */
  async getUserBookmarks(userId: string): Promise<BookmarkItem[]> {
    try {
      const rows = await this.callApi<Record<string, unknown>[]>('queryTable', {
        table: 'user_bookmarks',
        operation: 'select',
        where: { user_id: userId },
        limit: 500,
      });
      const sorted = (rows || []).sort((a: any, b: any) => {
        const ca = a.created_at || '';
        const cb = b.created_at || '';
        return cb.localeCompare(ca);
      });
      return sorted as unknown as BookmarkItem[];
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }

  /**
   * Get bookmarks by type for the current user
   */
  async getBookmarksByType(
    itemType: 'aircraft' | 'pathway' | 'program' | 'airline' | 'manufacturer',
    userId: string
  ): Promise<BookmarkItem[]> {
    try {
      const rows = await this.callApi<Record<string, unknown>[]>('queryTable', {
        table: 'user_bookmarks',
        operation: 'select',
        where: { user_id: userId, item_type: itemType },
        limit: 500,
      });
      const sorted = (rows || []).sort((a: any, b: any) => {
        const ca = a.created_at || '';
        const cb = b.created_at || '';
        return cb.localeCompare(ca);
      });
      return sorted as unknown as BookmarkItem[];
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }

  /**
   * Add a new bookmark
   */
  async addBookmark(bookmarkData: BookmarkCreateInput, userId: string): Promise<BookmarkItem> {
    try {
      // Check if bookmark already exists
      const existingBookmark = await this.getBookmarkByItemId(
        bookmarkData.item_id,
        bookmarkData.item_type,
        userId
      );

      if (existingBookmark) {
        throw new Error('Bookmark already exists');
      }

      const inserted = await this.callApi('queryTable', {
        table: 'user_bookmarks',
        operation: 'insert',
        data: {
          user_id: userId,
          ...bookmarkData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      return (inserted as any) as BookmarkItem;
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }

  /**
   * Remove a bookmark
   */
  async removeBookmark(itemId: string, itemType: string, userId: string): Promise<void> {
    try {
      const rows = await this.callApi<Record<string, unknown>[]>('queryTable', {
        table: 'user_bookmarks',
        operation: 'select',
        where: { user_id: userId, item_id: itemId, item_type: itemType },
        limit: 1,
      });
      const target = rows?.[0];
      if (target?.id) {
        await this.callApi('queryTable', {
          table: 'user_bookmarks',
          operation: 'delete',
          id: target.id as string,
        });
      }
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }

  /**
   * Toggle a bookmark (add if doesn't exist, remove if it does)
   */
  async toggleBookmark(
    itemId: string,
    itemType: 'aircraft' | 'pathway' | 'program' | 'airline' | 'manufacturer',
    bookmarkData: Omit<BookmarkCreateInput, 'item_id' | 'item_type'>,
    userId: string
  ): Promise<{ action: 'added' | 'removed'; bookmark?: BookmarkItem }> {
    try {
      const existingBookmark = await this.getBookmarkByItemId(itemId, itemType, userId);

      if (existingBookmark) {
        await this.removeBookmark(itemId, itemType, userId);
        return { action: 'removed' };
      } else {
        const bookmark = await this.addBookmark({
          item_id: itemId,
          item_type: itemType,
          ...bookmarkData
        }, userId);
        return { action: 'added', bookmark };
      }
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }

  /**
   * Check if a specific item is bookmarked
   */
  async isBookmarked(
    itemId: string,
    itemType: string,
    userId: string
  ): Promise<boolean> {
    try {
      const bookmark = await this.getBookmarkByItemId(itemId, itemType, userId);
      return !!bookmark;
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  }

  /**
   * Get bookmark counts by type for the current user
   */
  async getBookmarkCounts(userId: string): Promise<Record<string, number>> {
    try {
      const bookmarks = await this.getUserBookmarks(userId);
      const counts: Record<string, number> = {
        all: bookmarks.length,
        aircraft: 0,
        pathway: 0,
        program: 0,
        airline: 0,
        manufacturer: 0
      };

      bookmarks.forEach(bookmark => {
        if (bookmark.item_type in counts) {
          counts[bookmark.item_type]++;
        }
      });

      return counts;
    } catch (error) {
      console.error('Error getting bookmark counts:', error);
      return {
        all: 0,
        aircraft: 0,
        pathway: 0,
        program: 0,
        airline: 0,
        manufacturer: 0
      };
    }
  }

  /**
   * Update bookmark metadata
   */
  async updateBookmark(
    bookmarkId: string,
    updates: Partial<Pick<BookmarkItem, 'title' | 'description' | 'image_url' | 'metadata'>>
  ): Promise<BookmarkItem> {
    try {
      await this.callApi('queryTable', {
        table: 'user_bookmarks',
        operation: 'update',
        id: bookmarkId,
        data: {
          ...updates,
          updated_at: new Date().toISOString(),
        },
      });
      const rows = await this.callApi<Record<string, unknown>[]>('queryTable', {
        table: 'user_bookmarks',
        operation: 'select',
        where: { id: bookmarkId },
        limit: 1,
      });
      return (rows?.[0] as unknown as BookmarkItem) || (updates as unknown as BookmarkItem);
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }

  /**
   * Get a specific bookmark by item ID and type
   */
  private async getBookmarkByItemId(
    itemId: string,
    itemType: string,
    userId: string
  ): Promise<BookmarkItem | null> {
    try {
      const rows = await this.callApi<Record<string, unknown>[]>('queryTable', {
        table: 'user_bookmarks',
        operation: 'select',
        where: { user_id: userId, item_id: itemId, item_type: itemType },
        limit: 1,
      });
      return (rows?.[0] as unknown as BookmarkItem) || null;
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }
}

// Export factory so components pass their callApi from useWorkerAuth
export { BookmarkService };
