"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FootballFieldVisualization from "./FootballFieldVisualization"
import TeamCreateForm from "./TeamCreateForm"
import Search from "./Search"
import RequestTeamModal from "./RequestTeamModal"
import TeamCardGrid from "./TeamCardGrid"
import AllTeamsGrid from "./AllTeamsGrid"
import { createRequestForTeam } from "../../lib/team"
import {
  Users,
  Trophy,
  Settings,
  Plus,
  ChevronDown,
  ChevronRight,
  Zap,
  Crown,
  Activity,
  Target,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

import { getMyTeam, getTeamMembers, getAllTeams, deleteTeam } from "../../lib/team"

export default function TeamPage() {
  const [showMyTeams, setShowMyTeams] = useState(true)
  const router = useRouter()
  const [myTeams, setMyTeams] = useState([])
  const [allTeams, setAllTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [showMembers, setShowMembers] = useState(false)
  const [showAllTeams, setShowAllTeams] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showRequestsModal, setShowRequestsModal] = useState(false)
  const [processingRequests, setProcessingRequests] = useState(new Set())
  const [deletingTeams, setDeletingTeams] = useState(new Set())
  const [notification, setNotification] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTeams, setFilteredTeams] = useState([])

  // Auto-hide notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true)
        const response = await getMyTeam()
        setMyTeams(response.teams)
        setCurrentUser(response.user_id)
        setError(null)
      } catch (error) {
        console.error("Error fetching teams:", error)
        setError("Failed to load teams. Please try again later.")
        setNotification({
          type: "error",
          message: "Failed to load your teams. Please refresh the page.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    async function fetching() {
      try {
        const response = await getAllTeams()
        setAllTeams(response)
        setError(null)
      } catch (error) {
        console.error("Error fetching all teams:", error)
        setError("Failed to load all teams.")
        setNotification({
          type: "error",
          message: "Failed to load all teams. Some features may be limited.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetching()
  }, [])

  const handleViewMembers = async (team) => {
    try {
      setSelectedTeam(team)
      setShowMembers(true)
      const members = await getTeamMembers(team.team_id)
      setTeamMembers(members)
    } catch (error) {
      console.error("Error fetching team members:", error)
      setTeamMembers([])
      setNotification({
        type: "error",
        message: "Failed to load team members. Please try again.",
      })
    }
  }

  const handleViewTeam = (teamId) => {
    router.push(`/team/view/${teamId}`)
  }

  const handleDeleteTeam = async (teamId) => {
    if (deletingTeams.has(teamId)) return

    if (!confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      return
    }

    setDeletingTeams((prev) => new Set(prev).add(teamId))
    setNotification(null)

    try {
      await deleteTeam(teamId)
      const updatedTeams = myTeams.filter((team) => team.team_id !== teamId)
      setMyTeams(updatedTeams)
      setNotification({
        type: "success",
        message: "Team deleted successfully!",
      })
    } catch (error) {
      console.error("Failed to delete team:", error)
      setError("Failed to delete team.")
      setNotification({
        type: "error",
        message: "Failed to delete team. Please try again.",
      })
    } finally {
      setDeletingTeams((prev) => {
        const newSet = new Set(prev)
        newSet.delete(teamId)
        return newSet
      })
    }
  }

  const closeMembers = () => {
    setShowMembers(false)
    setSelectedTeam(null)
  }

  const handleCreateTeam = () => {
    setShowCreateForm(true)
  }

  const handleCloseCreateForm = () => {
    setShowCreateForm(false)
  }

  const handleSearch = ({ name, sport, country }) => {
    setSearchQuery(name)

    const filtered = allTeams.filter((team) => {
      const matchName = team.name.toLowerCase().includes(name.toLowerCase())
      const matchSport = sport ? team.team_sport === sport : true
      const matchCountry = country ? team.country === country : true
      return matchName && matchSport && matchCountry
    })

    setFilteredTeams(filtered)
  }

  const handleTeamCreated = async () => {
    try {
      const response = await getMyTeam()
      setMyTeams(response.teams)
      setShowCreateForm(false)
      setNotification({
        type: "success",
        message: "Team created successfully!",
      })
    } catch (error) {
      console.error("Error refreshing teams:", error)
      setNotification({
        type: "error",
        message: "Team created but failed to refresh. Please reload the page.",
      })
    }
  }

  const handleJoinTeamRequest = async (teamId) => {
    if (processingRequests.has(teamId)) return

    setProcessingRequests((prev) => new Set(prev).add(teamId))
    setNotification(null)

    try {
      await createRequestForTeam(teamId)
      setNotification({
        type: "success",
        message: "Join request sent successfully!",
      })
    } catch (err) {
      console.error("Failed to send request:", err)
      setNotification({
        type: "error",
        message: "Failed to send join request. Please try again.",
      })
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(teamId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#031716] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#0c969c]/10 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-[#6ba3be]/10 animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 rounded-full bg-[#274d60]/10 animate-pulse delay-700"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-transparent mx-auto mb-6 border-[#0c969c]"></div>
            <div className="absolute inset-0 rounded-full border-4 border-[#0c969c]/20 animate-ping"></div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-[#0c969c] animate-bounce" />
            <p className="text-xl font-medium text-[#6ba3be]">Loading teams...</p>
            <Trophy className="w-6 h-6 text-[#6ba3be] animate-bounce delay-200" />
          </div>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-[#0c969c] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#6ba3be] rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-[#274d60] rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 bg-[#031716] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#0c969c]/5 to-[#6ba3be]/5 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-[#274d60]/5 to-[#0a7075]/5 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-[#0c969c]/3 to-[#6ba3be]/3 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Trophy className="w-64 h-64 text-[#0c969c]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0c969c] to-[#6ba3be] flex items-center justify-center shadow-2xl shadow-[#0c969c]/25 animate-pulse">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#0c969c] via-[#6ba3be] to-[#0c969c] bg-clip-text text-transparent animate-pulse">
                Team Dashboard
              </h1>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6ba3be] to-[#274d60] flex items-center justify-center shadow-2xl shadow-[#6ba3be]/25 animate-pulse delay-300">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-xl text-[#6ba3be] flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin" />
              Manage and explore teams like a champion
              <Sparkles className="w-5 h-5 animate-spin delay-500" />
            </p>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-8 p-6 rounded-2xl border backdrop-blur-sm animate-in slide-in-from-top-5 duration-500 ${
              notification.type === "success"
                ? "bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-500/30 text-green-300"
                : "bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notification.type === "success" ? "bg-green-500/20" : "bg-red-500/20"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <p className="font-medium text-lg">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-red-900/20 to-red-800/20 text-red-300 border border-red-500/30 backdrop-blur-sm animate-in slide-in-from-top-5 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-red-400" />
              </div>
              <p className="font-medium text-lg">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group bg-gradient-to-br from-[#032f30] to-[#0a7075]/50 border border-[#0a7075] rounded-2xl p-6 hover:border-[#0c969c] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#0c969c]/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0c969c] to-[#6ba3be] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#0c969c] group-hover:text-[#6ba3be] transition-colors duration-300">
                  {myTeams.length}
                </p>
                <p className="text-[#6ba3be] font-medium">My Teams</p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-[#032f30] to-[#274d60]/50 border border-[#0a7075] rounded-2xl p-6 hover:border-[#6ba3be] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#6ba3be]/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6ba3be] to-[#274d60] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#6ba3be] group-hover:text-[#0c969c] transition-colors duration-300">
                  {allTeams.length}
                </p>
                <p className="text-[#6ba3be] font-medium">All Teams</p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-[#032f30] to-[#0c969c]/20 border border-[#0a7075] rounded-2xl p-6 hover:border-[#0c969c] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#0c969c]/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0c969c] to-[#0a7075] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#0c969c] group-hover:text-[#6ba3be] transition-colors duration-300">
                  {myTeams.filter((team) => team.moderator_user_id === currentUser).length}
                </p>
                <p className="text-[#6ba3be] font-medium">Managed</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Teams Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div
              className="flex items-center flex-1 cursor-pointer group select-none"
              onClick={() => setShowMyTeams(!showMyTeams)}
            >
              <div className="h-1 flex-1 rounded-full mr-6 bg-gradient-to-r from-transparent via-[#0c969c] to-[#0a7075] group-hover:via-[#6ba3be] transition-all duration-500"></div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0c969c] to-[#6ba3be] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold whitespace-nowrap text-[#0c969c] group-hover:text-[#6ba3be] transition-colors duration-300">
                  My Teams
                </h2>
                <div className="ml-2 text-[#0c969c] transform transition-all duration-500 group-hover:text-[#6ba3be] group-hover:scale-125">
                  {showMyTeams ? <ChevronDown className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
                </div>
              </div>

              <div className="h-1 flex-1 rounded-full ml-6 bg-gradient-to-r from-[#0a7075] via-[#0c969c] to-transparent group-hover:via-[#6ba3be] transition-all duration-500"></div>
            </div>

            <div className="flex items-center gap-4 ml-6">
              <button
                onClick={() => setShowRequestsModal(true)}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#274d60]/25 flex items-center gap-2 bg-gradient-to-r from-[#274d60] to-[#0a7075] text-[#6ba3be] border border-[#0a7075] hover:border-[#0c969c] hover:from-[#0a7075] hover:to-[#0c969c]"
              >
                <Settings className="w-4 h-4" />
                Join Requests
              </button>

              <button
                onClick={handleCreateTeam}
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#0c969c]/30 flex items-center gap-2 bg-gradient-to-r from-[#0c969c] to-[#6ba3be] text-[#031716] hover:from-[#6ba3be] hover:to-[#0c969c] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Create Team</span>
              </button>
            </div>
          </div>

          {showMyTeams && (
            <div className="animate-in slide-in-from-top-5 duration-500">
              {myTeams.length === 0 ? (
                <div className="text-center py-20 rounded-3xl bg-gradient-to-br from-[#032f30] to-[#0a7075]/30 border border-[#0a7075] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0c969c]/5 to-[#6ba3be]/5"></div>
                  <div className="relative z-10">
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#0a7075] to-[#274d60] shadow-2xl">
                      <Trophy className="w-16 h-16 text-[#6ba3be] animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-[#0c969c]">Ready to Build Your Empire?</h3>
                    <p className="text-lg text-[#6ba3be] mb-6">
                      Create your first team and start your journey to greatness
                    </p>
                    <button
                      onClick={handleCreateTeam}
                      className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-[#0c969c] to-[#6ba3be] text-[#031716] flex items-center gap-3 mx-auto"
                    >
                      <Zap className="w-6 h-6" />
                      Create Your First Team
                    </button>
                  </div>
                </div>
              ) : (
                <TeamCardGrid
                  teams={myTeams}
                  currentUser={currentUser}
                  onViewMembers={handleViewMembers}
                  onViewTeam={handleViewTeam}
                  onDeleteTeam={handleDeleteTeam}
                  deletingTeams={deletingTeams}
                />
              )}
            </div>
          )}
        </div>

        {/* Search & All Teams */}
        <Search onSearch={handleSearch} />

        <div className="flex items-center justify-between mb-8">
          <div
            className="flex items-center gap-4 cursor-pointer select-none group"
            onClick={() => setShowAllTeams(!showAllTeams)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6ba3be] to-[#274d60] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#0c969c] group-hover:text-[#6ba3be] transition-colors duration-300">
              Discover Teams
            </h2>
            <div className="text-[#0c969c] transform transition-all duration-500 group-hover:text-[#6ba3be] group-hover:scale-125">
              {showAllTeams ? <ChevronDown className="w-7 h-7" /> : <ChevronRight className="w-7 h-7" />}
            </div>
          </div>
        </div>

        {showAllTeams && (
          <div className="animate-in slide-in-from-top-5 duration-500">
            <AllTeamsGrid
              allTeams={allTeams}
              myTeams={myTeams}
              currentUser={currentUser}
              searchQuery={searchQuery}
              filteredTeams={filteredTeams}
              onJoinRequest={handleJoinTeamRequest}
              processingRequests={processingRequests}
              onViewTeam={handleViewTeam}
            />
          </div>
        )}

        {/* Modals */}
        {showRequestsModal && <RequestTeamModal onClose={() => setShowRequestsModal(false)} />}
        {showCreateForm && <TeamCreateForm onClose={handleCloseCreateForm} onTeamCreated={handleTeamCreated} />}

        {/* Team Members Modal - ORIGINAL STYLE WITHOUT PLAYER CARDS */}
        {showMembers && selectedTeam && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md">
            <div className="rounded-2xl shadow-xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto bg-gradient-to-br from-[#031716] to-[#032f30] border border-[#0c969c]">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c969c] to-[#6ba3be] flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#0c969c]">{selectedTeam.name}</h3>
                      <p className="text-sm text-[#6ba3be]">Team Squad</p>
                    </div>
                  </div>
                  <button
                    onClick={closeMembers}
                    className="text-xl font-bold p-2 rounded-xl w-10 h-10 flex items-center justify-center bg-[#032f30] text-[#6ba3be] hover:bg-[#0a7075] hover:scale-110 transition-all duration-300"
                  >
                    ×
                  </button>
                </div>

                {teamMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-[#0a7075] to-[#274d60]">
                      <Users className="w-8 h-8 text-[#6ba3be]" />
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-[#0c969c]">No Members</h4>
                    <p className="text-sm text-[#6ba3be]">This team is ready for players!</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <h4 className="text-lg font-bold mb-3 text-[#0c969c] flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Squad ({teamMembers.length} players)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                        {teamMembers.map((member, index) => (
                          <div
                            key={member.id}
                            className="flex items-center p-3 rounded-xl bg-[#032f30] border border-[#0a7075] hover:border-[#0c969c]/50 transition-all duration-300"
                          >
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-[#0a7075] border border-[#0c969c]/30">
                              <span className="text-sm font-bold text-[#6ba3be]">
                                {member.name ? member.name.charAt(0).toUpperCase() : index + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-[#0c969c] truncate">
                                {member.name || `Player ${index + 1}`}
                              </p>
                              <p className="text-xs text-[#6ba3be] truncate">{member.position || "Position TBD"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-lg font-bold mb-3 text-[#0c969c] flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Formation
                      </h4>
                      <div className="rounded-xl overflow-hidden bg-[#032f30] border border-[#0a7075] w-full aspect-video">
                        <FootballFieldVisualization members={teamMembers} />
                      </div>
                    </div>
                  </>
                )}

                <div className="text-center pt-4 border-t border-[#0a7075]">
                  <button
                    onClick={closeMembers}
                    className="px-6 py-2 rounded-xl font-semibold bg-[#0c969c] text-[#031716] hover:bg-[#6ba3be] transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
