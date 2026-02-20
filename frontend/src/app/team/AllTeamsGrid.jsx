"use client"

import { Eye, MapPin, Trophy, Award, Hash, Loader2, UserPlus } from "lucide-react"
import { API_URL } from "../../lib/api";

export default function AllTeamsGrid({
  allTeams,
  myTeams,
  currentUser,
  searchQuery,
  filteredTeams,
  onJoinRequest,
  processingRequests,
  onViewTeam,
}) {
  const teamsToShow = searchQuery ? filteredTeams : allTeams

  if (teamsToShow.length === 0) {
    return (
      <div className="text-center py-20 rounded-3xl bg-gradient-to-br from-[#032f30] to-[#0a7075]/30 border border-[#0a7075]">
        <div className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#0a7075] to-[#274d60] shadow-2xl">
          <Trophy className="w-16 h-16 text-[#6ba3be] animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-[#0c969c]">No Teams Found</h3>
        <p className="text-lg text-[#6ba3be]">
          {searchQuery ? "Try adjusting your search criteria" : "Be the first to create a team!"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {teamsToShow.map((team, index) => (
        <div
          key={team.team_id}
          className="group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:shadow-3xl bg-gradient-to-br from-[#032f30] to-[#0a7075]/30 border border-[#0a7075] hover:border-[#6ba3be] animate-in slide-in-from-bottom-5 duration-500"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#6ba3be]/5 via-[#0c969c]/5 to-[#274d60]/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

          <div className="relative p-8 z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-[#6ba3be] group-hover:text-[#0c969c] transition-colors duration-300" />
                  <h3 className="text-2xl font-bold text-[#0c969c] group-hover:text-[#6ba3be] transition-colors duration-300">
                    {team.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#0a7075] to-[#274d60] text-[#6ba3be] border border-[#6ba3be]/30 shadow-lg">
                    <Trophy className="w-4 h-4" />
                    {team.team_sport}
                  </div>
                </div>

                <div className="flex items-center text-sm text-[#6ba3be] mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-[#6ba3be] group-hover:text-[#0c969c] transition-colors duration-300" />
                  {team.country}
                </div>
              </div>

              {team.team_logo && (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center ml-4 bg-gradient-to-br from-[#0a7075] to-[#274d60] border-2 border-[#6ba3be]/30 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={`${API_URL}/${team.team_logo.replace(/^\/+/, "")}`}
                    alt={`${team.name} logo`}
                    className="w-[60px] h-[60px] object-cover rounded-full border-2 border-white"
                  />
                </div>
              )}
            </div>

            <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-[#031716] to-[#032f30] border border-[#0a7075] group-hover:border-[#6ba3be]/50 transition-all duration-300">
              <div className="flex items-center text-sm font-mono text-[#6ba3be]">
                <Hash className="w-4 h-4 mr-2 text-[#6ba3be]" />
                <span className="text-[#6ba3be]">ID:</span>
                <span className="text-[#0c969c] ml-2 font-bold">{team.team_id}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => onViewTeam(team.team_id)}
                className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#274d60] to-[#0a7075] text-[#6ba3be] hover:from-[#0a7075] hover:to-[#6ba3be] border border-[#0a7075] hover:border-[#6ba3be] group/btn"
              >
                <Eye className="w-5 h-5 group-hover/btn:animate-pulse" />
                Explore Team
              </button>

              {team.moderator_user_id !== currentUser && !myTeams.some((t) => t.team_id === team.team_id) && (
                <button
                  onClick={() => onJoinRequest(team.team_id)}
                  disabled={processingRequests.has(team.team_id)}
                  className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#0c969c] to-[#6ba3be] text-[#031716] hover:from-[#6ba3be] hover:to-[#0c969c] disabled:from-[#0c969c]/50 disabled:to-[#6ba3be]/50 disabled:cursor-not-allowed disabled:scale-100 group/btn relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  {processingRequests.has(team.team_id) ? (
                    <Loader2 className="w-5 h-5 relative z-10 animate-spin" />
                  ) : (
                    <UserPlus className="w-5 h-5 relative z-10 group-hover/btn:animate-pulse" />
                  )}
                  <span className="relative z-10">
                    {processingRequests.has(team.team_id) ? "Sending..." : "Join Team"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
