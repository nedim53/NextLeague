"use client"
import { useEffect, useState } from "react"
import { getRequestsForTeam } from "../../lib/team"
import { CheckCircle, XCircle, Users, Crown, Loader2, AlertCircle } from "lucide-react"
import { API_URL } from "@/lib/api"

export default function RequestTeamModal({ onClose }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingRequests, setProcessingRequests] = useState(new Set())
  const [notification, setNotification] = useState(null) // { type: 'success'|'error', message: string }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const res = await getRequestsForTeam()
        console.log("Fetched requests:", res)
        setRequests(Array.isArray(res) ? res : [])
      } catch (err) {
        console.error("Error loading team requests:", err)
        setRequests([])
        setNotification({
          type: "error",
          message: "Failed to load requests. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  // Auto-hide notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleAccept = async (id) => {
    if (processingRequests.has(id)) return

    setProcessingRequests((prev) => new Set(prev).add(id))
    setNotification(null)

    try {
      const res = await fetch(`${API_URL}/request/acceptRequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ request_id: id }),
      })

      if (!res.ok) {
        throw new Error("Failed to accept request")
      }

      setRequests((prev) => prev.filter((req) => req.id !== id))
      setNotification({
        type: "success",
        message: "Request accepted! Player added to your team.",
      })
    } catch (err) {
      console.error("Error accepting request:", err)
      setNotification({
        type: "error",
        message: "Failed to accept request. Please try again.",
      })
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleDecline = async (id) => {
    if (processingRequests.has(id)) return

    setProcessingRequests((prev) => new Set(prev).add(id))
    setNotification(null)

    try {
      const res = await fetch(`${API_URL}/request/declineRequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ request_id: id }),
      })

      if (!res.ok) {
        throw new Error("Failed to decline request")
      }

      setRequests((prev) => prev.filter((req) => req.id !== id))
      setNotification({
        type: "success",
        message: "Request declined successfully.",
      })

      console.log("❌ Request declined:", id)
    } catch (err) {
      console.error("Error declining request:", err)
      setNotification({
        type: "error",
        message: "Failed to decline request. Please try again.",
      })
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  return (
    <div className="fixed top-20 right-10 bg-gradient-to-br from-[#031716] to-[#032f30] text-white border border-[#0c969c] rounded-2xl shadow-2xl p-6 w-full max-w-md z-50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c969c] to-[#6ba3be] flex items-center justify-center shadow-lg">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0c969c]">Team Requests</h2>
            <p className="text-xs text-[#6ba3be]">Manage join requests</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#6ba3be] hover:text-red-400 text-xl font-bold p-2 rounded-xl hover:bg-[#032f30] transition-all duration-300 hover:scale-110"
        >
          ✕
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded-xl border animate-in slide-in-from-top-2 duration-300 ${
            notification.type === "success"
              ? "bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-500/30 text-green-300"
              : "bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-[#0c969c] animate-spin" />
            <p className="text-[#6ba3be] text-sm">Loading requests...</p>
          </div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-[#0a7075] to-[#274d60] shadow-lg">
            <Users className="w-8 h-8 text-[#6ba3be]" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-[#0c969c]">All Clear!</h3>
          <p className="text-[#6ba3be] text-sm">No pending join requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {requests.map((req) => (
            <div
              key={req.id}
              className="group p-4 bg-gradient-to-r from-[#072222] to-[#032f30] rounded-xl border border-[#0c969c]/30 hover:border-[#0c969c]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#0c969c]/10"
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0c969c] to-[#6ba3be] flex items-center justify-center text-xs font-bold text-white">
                    {req.sender_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0c969c]">
                      {req.sender_name} {req.sender_surname}
                    </p>
                    <p className="text-xs text-[#6ba3be]">wants to join</p>
                  </div>
                </div>
                <div className="pl-10">
                  <p className="text-sm text-[#6ba3be]">
                    Team: <span className="font-semibold text-[#0c969c]">{req.team_name}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(req.id)}
                  disabled={processingRequests.has(req.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-green-600/50 disabled:to-green-700/50 px-4 py-2.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:scale-100"
                >
                  {processingRequests.has(req.id) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm">Accept</span>
                </button>

                <button
                  onClick={() => handleDecline(req.id)}
                  disabled={processingRequests.has(req.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-red-600/50 disabled:to-red-700/50 px-4 py-2.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:scale-100"
                >
                  {processingRequests.has(req.id) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm">Decline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
