'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Rule } from '@prisma/client'
import { Trophy, Star, ArrowRight, ArrowDownAZ, ArrowUpZA, Filter, Bookmark } from 'lucide-react'
import { getRules } from '../actions'
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query'
import Link from 'next/link'
import { toast } from 'sonner'

interface RulesTableProps {
  initialData: {
    rules: Rule[];
    total: number;
    page: number;
    totalPages: number;
  }
}

export function RulesTable({ initialData }: RulesTableProps) {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minConfidence, setMinConfidence] = useState(0)
  
  const [sortBy, setSortBy] = useState('globalRank')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['rules', search, category, minConfidence, sortBy, sortOrder],
    queryFn: async ({ pageParam = 1 }) => {
      return getRules({ page: pageParam, search, category, minConfidence: minConfidence > 0 ? minConfidence : undefined, sortBy, sortOrder, limit: 100 })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
    initialData: (search === '' && category === '' && minConfidence === 0 && sortBy === 'globalRank' && sortOrder === 'asc') ? {
      pages: [initialData],
      pageParams: [1]
    } : undefined,
    placeholderData: keepPreviousData,
  })

  const flatData = useMemo(() => {
    return data?.pages.flatMap(page => page.rules) ?? []
  }, [data])

  const handleBookmark = (rule: Rule, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('bio_bookmarks');
      let bookmarks = stored ? JSON.parse(stored) : [];
      if (bookmarks.includes(rule.displayId)) {
        bookmarks = bookmarks.filter((id: string) => id !== rule.displayId);
        toast.success(`Removed ${rule.displayId} from bookmarks`);
      } else {
        bookmarks.push(rule.displayId);
        toast.success(`Added ${rule.displayId} to bookmarks`);
      }
      localStorage.setItem('bio_bookmarks', JSON.stringify(bookmarks));
    } catch (err) {
      toast.error('Failed to update bookmarks');
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowDownAZ className="w-3 h-3 ml-1 text-primary" /> : <ArrowUpZA className="w-3 h-3 ml-1 text-primary" />;
  }

  const columns = useMemo<ColumnDef<Rule>[]>(
    () => [
      {
        accessorKey: 'globalRank',
        header: () => (
          <div className="flex items-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('globalRank')}>
            Rank <SortIcon field="globalRank" />
          </div>
        ),
        size: 80,
        cell: info => (
          <div className="flex items-center gap-2 font-mono text-primary font-bold">
            <Trophy className="w-3 h-3" />
            #{info.getValue() as number}
          </div>
        ),
      },
      {
        accessorKey: 'rule',
        header: 'Rule',
        size: 400,
        cell: info => (
          <div className="font-medium text-white truncate pr-4" title={info.getValue() as string}>
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: () => (
          <div className="flex items-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('category')}>
            Category <SortIcon field="category" />
          </div>
        ),
        size: 150,
        cell: info => (
          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-muted-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'expectedImpact',
        header: () => (
          <div className="flex items-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('expectedImpact')}>
            Impact <SortIcon field="expectedImpact" />
          </div>
        ),
        size: 180,
        cell: info => (
          <span className="text-green-400 text-sm font-medium">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'confidenceScore',
        header: () => (
          <div className="flex items-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('confidenceScore')}>
            Confidence <SortIcon field="confidenceScore" />
          </div>
        ),
        size: 120,
        cell: info => (
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold">{info.getValue() as number}%</span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 90,
        cell: (info) => (
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => handleBookmark(info.row.original, e)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
            >
              <Bookmark className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <Link href={`/rules/${info.row.original.displayId}`}>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
              </button>
            </Link>
          </div>
        )
      }
    ],
    [sortBy, sortOrder]
  )

  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? flatData.length + 1 : flatData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 10,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse()

    if (!lastItem) {
      return
    }

    if (
      lastItem.index >= flatData.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    flatData.length,
    isFetchingNextPage,
    virtualItems,
  ])

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-3xl rounded-xl">
      <div className="p-4 border-b border-white/10 flex flex-col md:flex-row items-center gap-4">
        <input 
          type="text" 
          placeholder="Search rules, categories, tags..." 
          className="flex-1 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Pricing">Pricing</option>
            <option value="Psychology">Psychology</option>
            <option value="UX">UX</option>
            <option value="CRO">CRO</option>
            <option value="Copywriting">Copywriting</option>
          </select>
          
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              className="bg-transparent text-white focus:outline-none"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
            >
              <option value={0}>Any Confidence</option>
              <option value={85}>85%+ Confidence</option>
              <option value={90}>90%+ Confidence</option>
              <option value={95}>95%+ Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="flex items-center border-b border-white/10 bg-white/5 px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider sticky top-0 z-20">
        {table.getHeaderGroups().map(headerGroup => (
          <div key={headerGroup.id} className="flex w-full">
            {headerGroup.headers.map(header => (
              <div
                key={header.id}
                className="py-3 px-4 truncate flex items-center"
                style={{ width: header.column.getSize() }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Table Body (Virtualized) */}
      <div className="flex-1 overflow-auto" ref={parentRef}>
        <div 
          className="w-full relative" 
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {virtualItems.map((virtualRow) => {
            const isLoaderRow = virtualRow.index > flatData.length - 1
            const row = flatData[virtualRow.index]

            if (isLoaderRow) {
              return (
                <div
                  key={virtualRow.index}
                  className="absolute top-0 left-0 w-full flex items-center justify-center text-muted-foreground text-sm"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  Loading more rules...
                </div>
              )
            }

            const tableRow = table.getRowModel().rows[virtualRow.index]
            
            return (
              <div
                key={virtualRow.index}
                className="absolute top-0 left-0 w-full flex items-center border-b border-white/5 hover:bg-white/[0.04] transition-colors px-4"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {tableRow.getVisibleCells().map(cell => (
                  <div 
                    key={cell.id} 
                    className="px-4 py-2 truncate"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            )
          })}
          
          {!isFetchingNextPage && flatData.length === 0 && (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              No rules found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
