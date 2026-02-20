"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Container,
  Stack,
  Chip,
  Paper,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import {
  SportsSoccer,
  Groups,
  EmojiEvents,
  Person,
  Assessment,
  Star,
  Shield,
  Timeline,
  Visibility,
} from "@mui/icons-material"

import { API_URL as API } from '../../../lib/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const PRIMARY_BG = "#031716"
const SECONDARY_BG = "#032f30"
const ACCENT = "#0a7075"
const LIGHT = "#6ba3be"
const TEXT = "#ffffff"
const ACCENT_HOVER = "#0c969c"

export default function TeamStatsPage() {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [statistic, setStatistic] = useState(null)
  const [leagueData, setLeagueData] = useState(null)
  const [playerInfo, setPlayerInfo] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamRes = await fetch(`${API}/team/view/${id}`, { credentials: "include" })
        if (!teamRes.ok) throw new Error("Failed to fetch team data")
        const [teamInfo, , leagueInfo] = await teamRes.json()
        setTeam(teamInfo)
        setLeagueData(leagueInfo)

        // Fetch statistics
        const statsRes = await fetch(`${API}/statistics/team/${id}`, { credentials: "include" })
        if (statsRes.ok) {
          const statData = await statsRes.json()
          setStatistic(statData)
        } else {
          console.warn("No statistics found")
          setStatistic(null)
        }

        // Fetch players
        const playerRes = await fetch(`${API}/statistics/players-info/${id}`, { credentials: "include" })
        const playersData = await playerRes.json()
        setPlayerInfo(Array.isArray(playersData.players) ? playersData.players : [])
        console.log("Player Info:", playersData)
      } catch (err) {
        console.error(err)
        setError("Error loading team data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: PRIMARY_BG,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2, sm: 4 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: { xs: 200, sm: 300 },
            height: { xs: 200, sm: 300 },
            background: `radial-gradient(circle, ${ACCENT}20, transparent)`,
            borderRadius: "50%",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            left: "10%",
            width: { xs: 150, sm: 250 },
            height: { xs: 150, sm: 250 },
            background: `radial-gradient(circle, ${LIGHT}15, transparent)`,
            borderRadius: "50%",
            animation: "pulse 3s ease-in-out infinite 1s",
          }}
        />

        <Stack alignItems="center" spacing={4}>
          <Box sx={{ position: "relative" }}>
            <CircularProgress
              size={isMobile ? 60 : 80}
              thickness={3}
              sx={{
                color: ACCENT,
                filter: "drop-shadow(0 0 10px rgba(10, 112, 117, 0.5))",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Assessment sx={{ color: LIGHT, fontSize: { xs: 24, sm: 32 } }} />
            </Box>
          </Box>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              color: LIGHT,
              textAlign: "center",
              fontWeight: 500,
              background: `linear-gradient(135deg, ${TEXT}, ${LIGHT})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Loading team statistics...
          </Typography>
        </Stack>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: PRIMARY_BG,
          minHeight: "100vh",
          p: { xs: 2, sm: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert
          severity="error"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            backgroundColor: `${SECONDARY_BG}dd`,
            color: TEXT,
            border: `1px solid ${ACCENT}`,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            "& .MuiAlert-icon": {
              color: "#ff6b6b",
            },
          }}
        >
          {error}
        </Alert>
      </Box>
    )
  }

  const stat = statistic || {
    number_of_matches_played: 0,
    number_of_wins: 0,
    number_of_draws: 0,
    number_of_losses: 0,
    win_points: 0,
  }

  const matches = stat.number_of_matches_played || 1
  const winRate = ((stat.number_of_wins / matches) * 100).toFixed(1)
  const drawRate = ((stat.number_of_draws / matches) * 100).toFixed(1)
  const lossRate = ((stat.number_of_losses / matches) * 100).toFixed(1)
  const avgPoints = (stat.win_points / matches).toFixed(2)
  const efficiency = (((stat.number_of_wins * 3 + stat.number_of_draws) / (matches * 3)) * 100).toFixed(1)
  const unbeaten = (((stat.number_of_wins + stat.number_of_draws) / matches) * 100).toFixed(1)

  const barData = {
    labels: ["Matches", "Wins", "Draws", "Losses", "Points"],
    datasets: [
      {
        label: "Performance",
        data: [
          stat.number_of_matches_played,
          stat.number_of_wins,
          stat.number_of_draws,
          stat.number_of_losses,
          stat.win_points,
        ],
        backgroundColor: [`${ACCENT}dd`, `${ACCENT_HOVER}dd`, `${LIGHT}dd`, "#82c6cadd", "#b6dce0dd"],
        borderColor: [ACCENT, ACCENT_HOVER, LIGHT, "#82c6ca", "#b6dce0"],
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: `${SECONDARY_BG}f0`,
        titleColor: TEXT,
        bodyColor: TEXT,
        borderColor: ACCENT,
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: false,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: LIGHT,
          font: { size: 12, weight: "500" },
          padding: 8,
        },
        grid: {
          color: `${ACCENT}30`,
          drawBorder: false,
          lineWidth: 1,
        },
      },
      x: {
        ticks: {
          color: LIGHT,
          font: { size: 12, weight: "500" },
          padding: 8,
        },
        grid: { display: false },
      },
    },
  }

  const StatCard = ({ icon, label, value, color = ACCENT, gradient }) => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        background: gradient || `linear-gradient(135deg, ${SECONDARY_BG}f0 0%, ${SECONDARY_BG}dd 100%)`,
        border: `2px solid ${color}30`,
        borderRadius: { xs: 3, sm: 4 },
        textAlign: "center",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: { xs: 100, sm: 120 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${color}, ${LIGHT})`,
        },
        "&:hover": {
          transform: isMobile ? "translateY(-4px) scale(1.02)" : "translateY(-8px) scale(1.05)",
          boxShadow: `0 20px 40px ${color}25`,
          border: `2px solid ${color}80`,
          "& .stat-icon": {
            transform: "scale(1.2) rotate(5deg)",
          },
          "& .stat-value": {
            color: color,
          },
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" mb={1.5}>
        <Typography
          className="stat-icon"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            transition: "transform 0.3s ease",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        >
          {icon}
        </Typography>
        <Typography
          className="stat-value"
          variant={isMobile ? "h5" : "h4"}
          sx={{
            color: TEXT,
            fontWeight: "bold",
            ml: 1.5,
            fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.2rem" },
            transition: "color 0.3s ease",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {value}
        </Typography>
      </Box>
      <Typography
        variant={isMobile ? "caption" : "body2"}
        sx={{
          color: LIGHT,
          fontSize: { xs: "0.8rem", sm: "0.9rem" },
          fontWeight: 500,
          opacity: 0.9,
        }}
      >
        {label}
      </Typography>
    </Paper>
  )

  return (
    <Box
      sx={{
        backgroundColor: PRIMARY_BG,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 20%, ${ACCENT}15 0%, transparent 50%), 
                      radial-gradient(circle at 80% 80%, ${LIGHT}10 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header Section */}
        <Fade in timeout={600}>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${SECONDARY_BG}f0 0%, rgba(39, 77, 96, 0.9) 100%)`,
              borderRadius: { xs: 3, sm: 4, md: 5 },
              p: { xs: 3, sm: 4, md: 5 },
              mb: { xs: 3, sm: 4, md: 5 },
              border: `2px solid ${ACCENT}40`,
              position: "relative",
              overflow: "hidden",
              backdropFilter: "blur(20px)",
              boxShadow: `0 20px 40px ${ACCENT}20`,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, ${ACCENT}, ${LIGHT}, ${ACCENT_HOVER})`,
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: "50%",
                right: "-50px",
                width: "100px",
                height: "100px",
                background: `radial-gradient(circle, ${LIGHT}20, transparent)`,
                borderRadius: "50%",
                transform: "translateY(-50%)",
              },
            }}
          >
            <Grid container alignItems="center" spacing={{ xs: 3, sm: 4 }} direction={{ xs: "column", sm: "row" }}>
              <Grid item xs={12} sm="auto" sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={team.team_logo}
                    alt={team.name}
                    sx={{
                      width: { xs: 80, sm: 90, md: 100 },
                      height: { xs: 80, sm: 90, md: 100 },
                      border: `4px solid ${ACCENT}`,
                      boxShadow: `0 8px 24px ${ACCENT}40`,
                      mx: { xs: "auto", sm: 0 },
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -5,
                      right: -5,
                      width: 24,
                      height: 24,
                      backgroundColor: ACCENT,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px solid ${PRIMARY_BG}`,
                    }}
                  >
                    <Star sx={{ fontSize: 14, color: TEXT }} />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm>
                <Typography
                  variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    background: `linear-gradient(135deg, ${TEXT}, ${LIGHT}, ${TEXT})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textAlign: { xs: "center", sm: "left" },
                    textShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  {team.name}
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  flexWrap="wrap"
                  alignItems={{ xs: "center", sm: "flex-start" }}
                  sx={{ gap: { xs: 1.5, sm: 2 } }}
                >
                  <Chip
                    icon={<SportsSoccer />}
                    label={team.team_sport}
                    sx={{
                      background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER})`,
                      color: TEXT,
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      fontWeight: 600,
                      px: 1,
                      boxShadow: `0 4px 12px ${ACCENT}40`,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 16px ${ACCENT}60`,
                      },
                    }}
                  />
                  <Chip
                    label={team.country}
                    sx={{
                      background: `linear-gradient(135deg, ${LIGHT}, ${ACCENT})`,
                      color: PRIMARY_BG,
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      fontWeight: 600,
                      px: 1,
                      boxShadow: `0 4px 12px ${LIGHT}40`,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 16px ${LIGHT}60`,
                      },
                    }}
                  />
                  <Chip
                    label={leagueData?.access}
                    sx={{
                      backgroundColor: `${SECONDARY_BG}dd`,
                      color: TEXT,
                      border: `2px solid ${ACCENT}`,
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      fontWeight: 600,
                      px: 1,
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        backgroundColor: `${ACCENT}30`,
                      },
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        <Grid container spacing={{ xs: 1, sm: 2, md: 2 }}>
          {/* Performance Stats Cards */}
          <Grid item xs={12}>
            <Grow in timeout={800}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: { xs: 3, sm: 4 },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER})`,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 4px 12px ${ACCENT}40`,
                    }}
                  >
                    <Assessment sx={{ color: TEXT, fontSize: { xs: "1.5rem", sm: "2rem" } }} />
                  </Box>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    sx={{
                      color: TEXT,
                      fontWeight: "bold",
                      fontSize: { xs: "1.3rem", sm: "1.6rem", md: "2rem" },
                      background: `linear-gradient(135deg, ${TEXT}, ${LIGHT})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Performance Overview
                  </Typography>
                </Box>
                <Grid container spacing={{ xs: 2, sm: 3, md: 2 }}>
                  <Grid item xs={6} sm={4} lg={2}>
                    <StatCard
                      icon="🏆"
                      label="Win Rate"
                      value={`${winRate}%`}
                      color="#4ade80"
                      gradient="linear-gradient(135deg, #065f4620, #4ade8020)"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} lg={2}>
                    <StatCard
                      icon="🤝"
                      label="Draw Rate"
                      value={`${drawRate}%`}
                      color="#fbbf24"
                      gradient="linear-gradient(135deg, #92400e20, #fbbf2420)"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} lg={2}>
                    <StatCard
                      icon="💔"
                      label="Loss Rate"
                      value={`${lossRate}%`}
                      color="#f87171"
                      gradient="linear-gradient(135deg, #7f1d1d20, #f8717120)"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} lg={2}>
                    <StatCard
                      icon="⭐"
                      label="Avg Points"
                      value={avgPoints}
                      color={ACCENT}
                      gradient={`linear-gradient(135deg, ${ACCENT}20, ${LIGHT}20)`}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} lg={2}>
                    <StatCard
                      icon="📈"
                      label="Efficiency"
                      value={`${efficiency}%`}
                      color="#8b5cf6"
                      gradient="linear-gradient(135deg, #581c8720, #8b5cf620)"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} lg={2}>
                    <StatCard
                      icon="🛡️"
                      label="Unbeaten"
                      value={`${unbeaten}%`}
                      color="#06b6d4"
                      gradient="linear-gradient(135deg, #0e7c8620, #06b6d420)"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grow>
          </Grid>

          {/* Team Members */}
          <Grid item xs={12} lg={6}>
            <Fade in timeout={1000}>
              <Card
                elevation={0}
                sx={{
                  background: `linear-gradient(135deg, ${SECONDARY_BG}f0 0%, ${SECONDARY_BG}dd 100%)`,
                  color: TEXT,
                  borderRadius: { xs: 3, sm: 4, md: 5 },
                  border: `2px solid ${ACCENT}40`,
                  height: "100%",
                  minHeight: { xs: 350, sm: 450 },
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 20px 40px ${ACCENT}15`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 25px 50px ${ACCENT}25`,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: { xs: 3, sm: 4 },
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER})`,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 4px 12px ${ACCENT}40`,
                      }}
                    >
                      <Groups sx={{ color: TEXT, fontSize: { xs: "1.3rem", sm: "1.6rem" } }} />
                    </Box>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{
                        color: TEXT,
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", sm: "1.3rem" },
                      }}
                    >
                      Team Members ({playerInfo.length})
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: { xs: 3, sm: 4 }, borderColor: `${ACCENT}60`, opacity: 0.7 }} />
                  {playerInfo.length === 0 ? (
                    <Box textAlign="center" py={{ xs: 4, sm: 6 }}>
                      <Person sx={{ fontSize: { xs: 50, sm: 70 }, color: LIGHT, opacity: 0.5, mb: 3 }} />
                      <Typography
                        sx={{
                          color: LIGHT,
                          fontSize: { xs: "1rem", sm: "1.1rem" },
                          fontWeight: 500,
                        }}
                      >
                        No team members found.
                      </Typography>
                    </Box>
                  ) : (
                    <List dense sx={{ maxHeight: { xs: 280, sm: 350, md: 400 }, overflow: "auto" }}>
                      {playerInfo.map((player, index) => (
                        <Fade in timeout={1200 + index * 100} key={player.id}>
                          <ListItem
                            component="a"
                            href={`/profile/view/${player.id}`}
                            sx={{
                              cursor: "pointer",
                              borderRadius: { xs: 2, sm: 3 },
                              mb: 1.5,
                              p: { xs: 2, sm: 2.5 },
                              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              border: `1px solid transparent`,
                              background: `${SECONDARY_BG}40`,
                              backdropFilter: "blur(10px)",
                              "&:hover": {
                                background: `linear-gradient(135deg, ${ACCENT_HOVER}30, ${ACCENT}20)`,
                                transform: isMobile ? "translateX(8px)" : "translateX(12px)",
                                border: `1px solid ${ACCENT}80`,
                                boxShadow: `0 8px 24px ${ACCENT}30`,
                              },
                            }}
                          >
                            <Avatar
                              sx={{
                                background: `linear-gradient(135deg, ${ACCENT}, ${LIGHT})`,
                                mr: { xs: 2, sm: 2.5 },
                                width: { xs: 45, sm: 52 },
                                height: { xs: 45, sm: 52 },
                                fontWeight: "bold",
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                                boxShadow: `0 4px 12px ${ACCENT}40`,
                                border: `2px solid ${TEXT}20`,
                              }}
                            >
                              {player.name.charAt(0)}
                              {player.surname.charAt(0)}
                            </Avatar>
                            <ListItemText
                              primary={`${player.name} ${player.surname}`}
                              secondary={player.email}
                              primaryTypographyProps={{
                                fontWeight: "bold",
                                color: TEXT,
                                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                              }}
                              secondaryTypographyProps={{
                                color: LIGHT,
                                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                sx: {
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  opacity: 0.8,
                                },
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                color: LIGHT,
                                opacity: 0.6,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  opacity: 1,
                                  color: ACCENT,
                                  transform: "scale(1.2)",
                                },
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </ListItem>
                        </Fade>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Performance Chart */}
          <Grid item xs={12} lg={12}>
            <Fade in timeout={1200}>
              <Card
                elevation={0}
                sx={{
                  background: `linear-gradient(135deg, ${SECONDARY_BG}f0 0%, ${SECONDARY_BG}dd 100%)`,
                  color: TEXT,
                  borderRadius: { xs: 3, sm: 4, md: 5 },
                  border: `2px solid ${ACCENT}40`,
                  height: "100%",
                  minHeight: { xs: 350, sm: 450 },
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 20px 40px ${ACCENT}15`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 25px 50px ${ACCENT}25`,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: { xs: 3, sm: 4 },
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER})`,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 4px 12px ${ACCENT}40`,
                      }}
                    >
                      <Timeline sx={{ color: TEXT, fontSize: { xs: "1.3rem", sm: "1.6rem" } }} />
                    </Box>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{
                        color: TEXT,
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", sm: "1.3rem" },
                      }}
                    >
                      Performance Chart
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: { xs: 3, sm: 4 }, borderColor: `${ACCENT}60`, opacity: 0.7 }} />
                  <Box
                    sx={{
                      height: { xs: 220, sm: 280, md: 320 },
                      background: `${PRIMARY_BG}30`,
                      borderRadius: 3,
                      p: 2,
                      border: `1px solid ${ACCENT}20`,
                    }}
                  >
                    <Bar data={barData} options={barOptions} />
                  </Box>
                  <Box mt={{ xs: 2, sm: 3 }}>
                    <Typography
                      variant={isMobile ? "caption" : "body2"}
                      sx={{
                        color: LIGHT,
                        textAlign: "center",
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        fontWeight: 500,
                        opacity: 0.9,
                      }}
                    >
                      Total Matches: {stat.number_of_matches_played} • Total Points: {stat.win_points}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* League Information */}
          <Grid item xs={12} lg={4}>
            <Fade in timeout={1400}>
              <Card
                elevation={0}
                sx={{
                  background: `linear-gradient(135deg, ${SECONDARY_BG}f0 0%, ${SECONDARY_BG}dd 100%)`,
                  color: TEXT,
                  borderRadius: { xs: 3, sm: 4, md: 5 },
                  border: `2px solid ${ACCENT}40`,
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 20px 40px ${ACCENT}15`,
                  transition: "all 0.3s ease",
                  height: "100%",
                  minHeight: { xs: 350, sm: 450 },
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 25px 50px ${ACCENT}25`,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: { xs: 3, sm: 4 },
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER})`,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 4px 12px ${ACCENT}40`,
                      }}
                    >
                      <EmojiEvents sx={{ color: TEXT, fontSize: { xs: "1.3rem", sm: "1.6rem" } }} />
                    </Box>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{
                        color: TEXT,
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", sm: "1.3rem" },
                      }}
                    >
                      League Information
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: { xs: 3, sm: 4 }, borderColor: `${ACCENT}60`, opacity: 0.7 }} />
                  <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box
                        textAlign="center"
                        sx={{
                          py: { xs: 2, sm: 3 },
                          px: { xs: 1, sm: 2 },
                          background: `${ACCENT}10`,
                          borderRadius: 3,
                          border: `1px solid ${ACCENT}30`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: `${ACCENT}20`,
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Shield sx={{ color: ACCENT, fontSize: { xs: "2rem", sm: "2.5rem" }, mb: 1 }} />
                        <Typography
                          variant={isMobile ? "subtitle1" : "h6"}
                          sx={{
                            color: ACCENT,
                            mb: 1,
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                            fontWeight: 600,
                          }}
                        >
                          Access Level
                        </Typography>
                        <Typography
                          variant={isMobile ? "h5" : "h4"}
                          sx={{
                            color: TEXT,
                            fontWeight: "bold",
                            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.3rem" },
                          }}
                        >
                          {leagueData?.access}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box
                        textAlign="center"
                        sx={{
                          py: { xs: 2, sm: 3 },
                          px: { xs: 1, sm: 2 },
                          background: `${LIGHT}10`,
                          borderRadius: 3,
                          border: `1px solid ${LIGHT}30`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: `${LIGHT}20`,
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Groups sx={{ color: LIGHT, fontSize: { xs: "2rem", sm: "2.5rem" }, mb: 1 }} />
                        <Typography
                          variant={isMobile ? "subtitle1" : "h6"}
                          sx={{
                            color: LIGHT,
                            mb: 1,
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                            fontWeight: 600,
                          }}
                        >
                          Required Players
                        </Typography>
                        <Typography
                          variant={isMobile ? "h5" : "h4"}
                          sx={{
                            color: TEXT,
                            fontWeight: "bold",
                            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.3rem" },
                          }}
                        >
                          {leagueData?.number_of_players_in_team}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                      <Box
                        textAlign="center"
                        sx={{
                          py: { xs: 2, sm: 3 },
                          px: { xs: 1, sm: 2 },
                          background: `${ACCENT_HOVER}10`,
                          borderRadius: 3,
                          border: `1px solid ${ACCENT_HOVER}30`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: `${ACCENT_HOVER}20`,
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Assessment sx={{ color: ACCENT_HOVER, fontSize: { xs: "2rem", sm: "2.5rem" }, mb: 1 }} />
                        <Typography
                          variant={isMobile ? "subtitle1" : "h6"}
                          sx={{
                            color: ACCENT_HOVER,
                            mb: 1,
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                            fontWeight: 600,
                          }}
                        >
                          League ID
                        </Typography>
                        <Typography
                          variant={isMobile ? "h5" : "h4"}
                          sx={{
                            color: TEXT,
                            fontWeight: "bold",
                            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.3rem" },
                          }}
                        >
                          {leagueData?.league_id}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </Box>
  )
}
