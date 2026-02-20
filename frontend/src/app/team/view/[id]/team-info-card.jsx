"use client"
import { API_URL } from '../../../lib/api';

export default function TeamInfoCard({ team }) {
  return (
    <div
      className="rounded-2xl border-2 overflow-hidden shadow-2xl hover:shadow-xl transition-all duration-500"
      style={{ backgroundColor: "#032f30", borderColor: "#0a7075" }}
    >
      {/* Team Header */}
      <div className="p-8 text-center" style={{ background: "linear-gradient(to bottom, rgba(10, 112, 117, 0.2), transparent)" }}>
        <div className="flex flex-col items-center gap-6">
          {/* Team Logo */}
          {team.team_logo ? (
            <div className="relative group">
              <div
                className="w-24 h-24 rounded-2xl p-1 shadow-lg"
                style={{ background: "linear-gradient(135deg, #0c969c, #6ba3be)" }}
              >
                <div
                  className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: "#031716" }}
                >
import { API_URL } from '../../../lib/api';

                  <img
                    src={`${API_URL}/${team.team_logo.replace(/^\/+/, "")}`}
                    alt={`${team.name} logo`}
                    className="w-16 h-16 object-cover rounded-full border-2 group-hover:scale-110 transition-transform duration-300"
                    style={{ borderColor: "#0c969c" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #0c969c, #6ba3be)" }}
            >
              <span className="text-3xl">⚽</span>
            </div>
          )}

          {/* Team Name */}
          <div className="text-center">
            <h1
              className="text-3xl font-bold mb-3"
              style={{ color: "#0c969c" }}
            >
              {team.name}
            </h1>
            <div
              className="inline-block px-6 py-2 rounded-full text-lg font-medium shadow-md"
              style={{ 
                background: "linear-gradient(135deg, #0a7075, #274d60)", 
                color: "#6ba3be" 
              }}
            >
              {team.team_sport}
            </div>
          </div>
        </div>
      </div>

      {/* Team Details */}
      <div className="p-6 border-t" style={{ borderColor: "#0a7075" }}>
        <h2
          className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2"
          style={{ color: "#0c969c" }}
        >
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
            style={{ backgroundColor: "#0c969c" }}
          >
            ℹ
          </span>
          Team Information
        </h2>

        <div className="space-y-4">
          {/* Team ID */}
          <div
            className="group p-4 rounded-xl border hover:border-opacity-50 transition-all duration-300 hover:shadow-lg"
            style={{ 
              background: "linear-gradient(135deg, #031716, #032f30)", 
              borderColor: "#0a7075" 
            }}
          >
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300"
                style={{ background: "linear-gradient(135deg, #0a7075, #274d60)" }}
              >
                <span className="text-lg">🆔</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: "#0c969c" }}>
                  Team ID
                </h3>
                <p
                  className="font-mono text-sm px-2 py-1 rounded"
                  style={{ color: "#6ba3be", backgroundColor: "rgba(10, 112, 117, 0.2)" }}
                >
                  #{team.team_id}
                </p>
              </div>
            </div>
          </div>

          {/* Country */}
          <div
            className="group p-4 rounded-xl border hover:border-opacity-50 transition-all duration-300 hover:shadow-lg"
            style={{ 
              background: "linear-gradient(135deg, #031716, #032f30)", 
              borderColor: "#0a7075" 
            }}
          >
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300"
                style={{ background: "linear-gradient(135deg, #0a7075, #274d60)" }}
              >
                <span className="text-lg">🌍</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: "#0c969c" }}>
                  Country
                </h3>
                <p className="capitalize" style={{ color: "#6ba3be" }}>
                  {team.country}
                </p>
              </div>
            </div>
          </div>

          {/* Team Identification */}
          {team.team_identification && (
            <div
              className="group p-4 rounded-xl border hover:border-opacity-50 transition-all duration-300 hover:shadow-lg"
              style={{ 
                background: "linear-gradient(135deg, #031716, #032f30)", 
                borderColor: "#0a7075" 
              }}
            >
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: "linear-gradient(135deg, #0a7075, #274d60)" }}
                >
                  <span className="text-lg">🏷️</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: "#0c969c" }}>
                    Identification
                  </h3>
                  <p
                    className="font-mono text-sm px-2 py-1 rounded"
                    style={{ color: "#6ba3be", backgroundColor: "rgba(10, 112, 117, 0.2)" }}
                  >
                    {team.team_identification}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
