'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { toast } from 'sonner'

function getInitialBookmarkState(displayId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem('bio_bookmarks');
    if (stored) {
      const bookmarks = JSON.parse(stored);
      return bookmarks.includes(displayId);
    }
  } catch {
    // ignore parse errors
  }
  return false;
}

export function BookmarkButton({ displayId }: { displayId: string }) {
  const [isBookmarked, setIsBookmarked] = useState(() => getInitialBookmarkState(displayId));

  const toggleBookmark = () => {
    try {
      const stored = localStorage.getItem('bio_bookmarks');
      let bookmarks = stored ? JSON.parse(stored) : [];
      if (bookmarks.includes(displayId)) {
        bookmarks = bookmarks.filter((id: string) => id !== displayId);
        setIsBookmarked(false);
        toast.success(`Removed ${displayId} from bookmarks`);
      } else {
        bookmarks.push(displayId);
        setIsBookmarked(true);
        toast.success(`Added ${displayId} to bookmarks`);
      }
      localStorage.setItem('bio_bookmarks', JSON.stringify(bookmarks));
    } catch {
      toast.error('Failed to update bookmarks');
    }
  }

  return (
    <button 
      onClick={toggleBookmark}
      className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group flex items-center justify-center h-[52px] w-[52px]"
      title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
    </button>
  );
}
