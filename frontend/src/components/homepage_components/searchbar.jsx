"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, User, Users, Trophy, Loader2, ArrowRight } from "lucide-react"
import { API_URL } from '../../lib/api'

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (query.trim() === "") {
      setFiltered([])
      setIsOpen(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()

        const combined = [
          ...data.players.map((p) => ({ ...p, type: "player" })),
          ...data.teams.map((t) => ({ ...t, type: "team" })),
          ...data.leagues.map((l) => ({ ...l, type: "league" })),
        ]

        setFiltered(combined)
        setIsOpen(combined.length > 0)
      } catch (error) {
        console.error("Search error:", error)
        setFiltered([])
        setIsOpen(false)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchResults, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const getIcon = (type) => {
    switch (type) {
      case "player":
        return <User className="text-[#6ba3be] w-5 h-5" />
      case "team":
        return <Users className="text-[#0c969c] w-5 h-5" />
      case "league":
        return <Trophy className="text-[#0a7075] w-5 h-5" />
      default:
        return null
    }
  }

  const getHref = (item) => {
    switch (item.type) {
      case "player":
        return `/profile/view/${item.id}`
      case "team":
        return `/team/view/${item.id}`
      case "league":
        return `/league/view/${item.id}`
      default:
        return "#"
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case "player":
        return "Player"
      case "team":
        return "Team"
      case "league":
        return "League"
      default:
        return type
    }
  }

  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case "player":
        return "bg-[#6ba3be]/20 text-[#6ba3be] border-[#6ba3be]/30"
      case "team":
        return "bg-[#0c969c]/20 text-[#0c969c] border-[#0c969c]/30"
      case "league":
        return "bg-[#0a7075]/20 text-[#0a7075] border-[#0a7075]/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleInputFocus = () => {
    if (filtered.length > 0) {
      setIsOpen(true)
    }
  }

  const handleInputBlur = () => {
    // Delay closing to allow clicks on results
    setTimeout(() => setIsOpen(false), 200)
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#031716] via-[#032f30] to-[#031716] z-40 py-6 px-4 shadow-2xl border-b border-[#0a7075]/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto relative">
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a7075]/20 to-[#6ba3be]/20 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Search for players, teams, or leagues..."
              className="w-full pl-12 pr-4 py-4 border-2 border-[#0a7075]/40 bg-[#032f30]/80 backdrop-blur-sm text-white rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-[#6ba3be]/50 focus:border-[#6ba3be]/60 placeholder:text-[#6ba3be]/60 transition-all duration-300 hover:border-[#0a7075]/60"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              {loading ? (
                <Loader2 className="text-[#6ba3be] w-5 h-5 animate-spin" />
              ) : (
                <Search className="text-[#6ba3be] w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {isOpen && (
          <div className="absolute w-full mt-4 rounded-2xl border-2 border-[#0a7075]/40 bg-[#032f30]/95 backdrop-blur-md shadow-2xl max-h-80 overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-300">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#0a7075]/30 bg-gradient-to-r from-[#0a7075]/20 to-transparent">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Search Results</h3>
                <span className="text-[#6ba3be] text-xs font-medium">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {filtered.map((item, index) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={getHref(item)}
                  className="block group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-4 px-6 py-4 hover:bg-[#0a7075]/20 text-white transition-all duration-200 border-b border-[#0a7075]/10 last:border-b-0 group-hover:translate-x-1">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 bg-[#032f30] rounded-full flex items-center justify-center border border-[#0a7075]/30 group-hover:border-[#6ba3be]/50 transition-colors duration-200">
                      {getIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-white text-base truncate group-hover:text-[#6ba3be] transition-colors duration-200">
                          {item.name} {item.surname}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeBadgeStyle(
                            item.type,
                          )}`}
                        >
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      {item.country && <p className="text-[#6ba3be]/80 text-sm truncate">{item.country}</p>}
                      {item.team_sport && <p className="text-[#6ba3be]/80 text-sm truncate">{item.team_sport}</p>}
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowRight className="w-4 h-4 text-[#6ba3be]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            {filtered.length === 0 && !loading && query.trim() !== "" && (
              <div className="px-6 py-8 text-center">
                <Search className="w-12 h-12 text-[#6ba3be]/30 mx-auto mb-3" />
                <p className="text-[#6ba3be]/60 text-sm">No results found for "{query}"</p>
                <p className="text-[#6ba3be]/40 text-xs mt-1">Try searching with different keywords</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 112, 117, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(10, 112, 117, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(10, 112, 117, 0.7);
        }
      `}</style>
    </div>
  )
}
