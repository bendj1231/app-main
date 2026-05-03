/**
 * Bookmark Service
 * 
 * Handles all bookmark-related database operations using Supabase
 */

import { supabase } from '../lib/supabase';

export interface BookmarkItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'aircraft' | 'pathway' | 'program' | 'airline' | 'manufacturer';
  title: string;
  description?: string;
  image_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BookmarkCreateInput {
  item_id: string;
  item_type: 'aircraft' | 'pathway' | 'program' | 'airline' | 'manufacturer';
  title: string;
  description?: string;
  image_url?: string;
  metadata?: Record<string, any>;
}

class BookmarkService {
  /**
   * Get all bookmarks for the current user
   */
  async getUserBookmarks(userId?: string): Promise<BookmarkItem[]> {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', userId || (await this.getCurrentUserId()))
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user bookmarks:', error);
        throw new Error(`Failed to fetch bookmarks: ${error.message}`);
      }

      return data || [];
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
    userId?: string
  ): Promise<BookmarkItem[]> {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', userId || (await this.getCurrentUserId()))
        .eq('item_type', itemType)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Error fetching ${itemType} bookmarks:`, error);
        throw new Error(`Failed to fetch ${itemType} bookmarks: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }

  /**
   * Add a new bookmark
   */
  async addBookmark(bookmarkData: BookmarkCreateInput, userId?: string): Promise<BookmarkItem> {
    try {
      const currentUserId = userId || (await this.getCurrentUserId());
      
      // Check if bookmark already exists
      const existingBookmark = await this.getBookmarkByItemId(
        bookmarkData.item_id,
        bookmarkData.item_type,
        currentUserId
      );

      if (existingBookmark) {
        throw new Error('Bookmark already exists');
      }

      const { data, error } = await supabase
        .from('user_bookmarks')
        .insert({
          user_id: currentUserId,
          ...bookmarkData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding bookmark:', error);
        throw new Error(`Failed to add bookmark: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }

  /**
   * Remove a bookmark
   */
  async removeBookmark(itemId: string, itemType: string, userId?: string): Promise<void> {
    try {
      const currentUserId = userId || (await this.getCurrentUserId());

      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', currentUserId)
        .eq('item_id', itemId)
        .eq('item_type', itemType);

      if (error) {
        console.error('Error removing bookmark:', error);
        throw new Error(`Failed to remove bookmark: ${error.message}`);
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
    userId?: string
  ): Promise<{ action: 'added' | 'removed'; bookmark?: BookmarkItem }> {
    try {
      const currentUserId = userId || (await this.getCurrentUserId());
      
      // Check if bookmark exists
      const existingBookmark = await this.getBookmarkByItemId(itemId, itemType, currentUserId);

      if (existingBookmark) {
        // Remove bookmark
        await this.removeBookmark(itemId, itemType, currentUserId);
        return { action: 'removed' };
      } else {
        // Add bookmark
        const bookmark = await this.addBookmark({
          item_id: itemId,
          item_type: itemType,
          ...bookmarkData
        }, currentUserId);
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
    userId?: string
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
  async getBookmarkCounts(userId?: string): Promise<Record<string, number>> {
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
      const { data, error } = await supabase
        .from('user_bookmarks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookmarkId)
        .select()
        .single();

      if (error) {
        console.error('Error updating bookmark:', error);
        throw new Error(`Failed to update bookmark: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }

  // Private helper methods

  /**
   * Get current user ID from Supabase auth
   */
  private async getCurrentUserId(): Promise<string> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        throw new Error('User not authenticated');
      }
      
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      throw new Error('User not authenticated');
    }
  }

  /**
   * Get a specific bookmark by item ID and type
   */
  private async getBookmarkByItemId(
    itemId: string,
    itemType: string,
    userId?: string
  ): Promise<BookmarkItem | null> {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', userId || (await this.getCurrentUserId()))
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found", which is expected
        console.error('Error fetching bookmark by item ID:', error);
        throw new Error(`Failed to fetch bookmark: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Bookmark service error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const bookmarkService = new BookmarkService();
