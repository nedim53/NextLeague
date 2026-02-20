"use client"

import { Users, Trophy, MapPin, Star, Target, Trash2, Loader2, Hash, Crown } from "lucide-react"
import { API_URL } from "../../lib/api";

export default function TeamCardGrid({ teams, currentUser, onViewMembers, onViewTeam, onDeleteTeam, deletingTeams }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teams.map((team, index) => (
        <div
          key={team.team_id}
          className="group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:shadow-3xl bg-gradient-to-br from-[#032f30] to-[#0a7075]/50 border border-[#0a7075] hover:border-[#0c969c] animate-in slide-in-from-bottom-5 duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c969c]/10 via-[#6ba3be]/5 to-[#274d60]/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

          {Number(team.moderator_user_id) === Number(currentUser) && (
            <div className="absolute top-4 right-4 z-20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg animate-pulse">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          <div className="relative p-8 z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-[#0c969c] group-hover:text-[#6ba3be] transition-colors duration-300" />
                  <h3 className="text-2xl font-bold text-[#0c969c] group-hover:text-[#6ba3be] transition-colors duration-300">
                    {team.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#0a7075] to-[#274d60] text-[#6ba3be] border border-[#0c969c]/30 shadow-lg">
                    <Trophy className="w-4 h-4" />
                    {team.team_sport}
                  </div>
                </div>

                <div className="flex items-center text-sm text-[#6ba3be] mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-[#0c969c] group-hover:text-[#6ba3be] transition-colors duration-300" />
                  {team.country}
                </div>
              </div>

              {team.team_logo && (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center ml-4 bg-gradient-to-br from-[#0a7075] to-[#274d60] border-2 border-[#0c969c]/30 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={`${API_URL}/${team.team_logo.replace(/^\/+/, "")}`}
                    alt={`${team.name} logo`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-[#031716] to-[#032f30] border border-[#0a7075] group-hover:border-[#0c969c]/50 transition-all duration-300">
              <div className="flex items-center text-sm font-mono text-[#6ba3be]">
                <Hash className="w-4 h-4 mr-2 text-[#0c969c]" />
                <span className="text-[#6ba3be]">ID:</span>
                <span className="text-[#0c969c] ml-2 font-bold">{team.team_id}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => onViewMembers(team)}
                className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#274d60] to-[#0a7075] text-[#6ba3be] hover:from-[#0a7075] hover:to-[#0c969c] border border-[#0a7075] hover:border-[#0c969c] group/btn"
              >
                <Users className="w-5 h-5 group-hover/btn:animate-pulse" />
                View Squad
              </button>

              <button
                onClick={() => onViewTeam(team.team_id)}
                className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#0c969c] to-[#6ba3be] text-[#031716] hover:from-[#6ba3be] hover:to-[#0c969c] group/btn relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <Target className="w-5 h-5 relative z-10 group-hover/btn:animate-pulse" />
                <span className="relative z-10">View Statistics</span>
              </button>

              {Number(team.moderator_user_id) === Number(currentUser) && (
                <button
                  onClick={() => onDeleteTeam(team.team_id)}
                  disabled={deletingTeams.has(team.team_id)}
                  className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 disabled:from-red-600/50 disabled:to-red-700/50 disabled:cursor-not-allowed disabled:scale-100 group/btn"
                >
                  {deletingTeams.has(team.team_id) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5 group-hover/btn:animate-pulse" />
                  )}
                  {deletingTeams.has(team.team_id) ? "Deleting..." : "Delete Team"}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
