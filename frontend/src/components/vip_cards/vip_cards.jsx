"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Check, Star, Crown, Zap, Users, Shield, MessageCircle, Award } from "lucide-react"
import { API_URL as API } from "@/lib/api";

const createCheckoutSession = async (priceId) => {
  const res = await fetch(`${API}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  })

  if (!res.ok) {
    throw new Error("Failed to create checkout session")
  }

  return await res.json()
}

export default function VipCard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/user-info`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("you are not logged in")
        }
        return res.json()
      })
      .then((data) => {
        console.log("User data:", data)
        setUser(data)
      })
      .catch((err) => {
        console.error("Greška:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleCheckout = async (priceId) => {
    try {
      const stripe = await loadStripe(
        "pk_test_51RPq3WQbnCtu5rm4a0BrGVUFhZv9oNvRF11H1UeMDTAH2fSeswyGYpJJegQDn6eKyE4b8WCSB8bLsDfCSa2JfZYv00FdTXrG3q",
      )
      const data = await createCheckoutSession(priceId)

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (result.error) {
        console.error(result.error.message)
      }
    } catch (err) {
      console.error("Checkout error:", err)
    }
  }

  const plans = [
    {
      title: "Basic",
      subtitle: "Perfect for getting started",
      price: "Free",
      originalPrice: null,
      features: [
        { text: "Create 1 league", icon: <Users className="w-4 h-4" /> },
        { text: "Up to 2 teams", icon: <Shield className="w-4 h-4" /> },
        { text: "Basic support", icon: <MessageCircle className="w-4 h-4" /> },
        { text: "League and group chat", icon: <MessageCircle className="w-4 h-4" /> },
      ],
      bg: "from-[#032f30] to-[#274d60]",
      border: "border-[#0a7075]",
      icon: <Users className="w-8 h-8" />,
      popular: false,
    },
    {
      title: "Premium",
      subtitle: "Most popular choice",
      price: "$5",
      period: "/mo",
      originalPrice: "$8",
      features: [
        { text: "Create up to 5 leagues", icon: <Users className="w-4 h-4" /> },
        { text: "Up to 5 teams", icon: <Shield className="w-4 h-4" /> },
        { text: "Priority support", icon: <Zap className="w-4 h-4" /> },
        { text: "League and group chat", icon: <MessageCircle className="w-4 h-4" /> },
        { text: "Advanced analytics", icon: <Star className="w-4 h-4" /> },
      ],
      bg: "from-[#0a7075] to-[#0c969c]",
      border: "border-[#6ba3be]",
      icon: <Star className="w-8 h-8" />,
      priceId: "price_1RPq6YQbnCtu5rm4fQEj3Unx",
      popular: true,
    },
    {
      title: "Premium Plus",
      subtitle: "For serious competitors",
      price: "$10",
      period: "/mo",
      originalPrice: "$15",
      features: [
        { text: "Create up to 10 leagues", icon: <Users className="w-4 h-4" /> },
        { text: "Up to 10 teams", icon: <Shield className="w-4 h-4" /> },
        { text: "All Premium features", icon: <Star className="w-4 h-4" /> },
        { text: "VIP badge", icon: <Crown className="w-4 h-4" /> },
        { text: "Chat with everyone", icon: <MessageCircle className="w-4 h-4" /> },
        { text: "Custom branding", icon: <Award className="w-4 h-4" /> },
      ],
      bg: "from-[#0c969c] to-[#6ba3be]",
      border: "border-[#6ba3be]",
      icon: <Crown className="w-8 h-8" />,
      priceId: "price_1RPqGOQbnCtu5rm4KrVrLTjM",
      popular: false,
    },
  ]

  const isCurrentPlan = (index) => {
    if (!user) return false
    if (user.user_type_id === 2 && index === 1) return true
    if (user.user_type_id === 3 && index === 2) return true
    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#031716] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a7075]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#031716] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0a7075] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#6ba3be] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0a7075] to-[#6ba3be] rounded-full mb-6">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-[#6ba3be] bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-[#6ba3be] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Unlock the full potential of your league management experience with our premium features.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative group ${
                  plan.popular ? "lg:scale-105 lg:-mt-4" : ""
                } transition-all duration-500 hover:scale-105`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-[#0a7075] to-[#6ba3be] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`relative rounded-2xl p-8 text-white bg-gradient-to-br ${plan.bg} shadow-2xl border-2 ${plan.border} transition-all duration-500 group-hover:shadow-3xl group-hover:border-[#6ba3be] overflow-hidden h-full flex flex-col`}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 group-hover:bg-white/20 transition-colors duration-300">
                        {plan.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                      <p className="text-white/70 text-sm">{plan.subtitle}</p>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {plan.originalPrice && (
                          <span className="text-white/50 line-through text-lg">{plan.originalPrice}</span>
                        )}
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.period && <span className="text-white/70 text-lg">{plan.period}</span>}
                      </div>
                      {plan.originalPrice && (
                        <div className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Save{" "}
                          {Math.round(
                            ((Number.parseInt(plan.originalPrice.slice(1)) - Number.parseInt(plan.price.slice(1))) /
                              Number.parseInt(plan.originalPrice.slice(1))) *
                              100,
                          )}
                          %
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex-1 mb-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 group/item">
                            <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center group-hover/item:bg-white/20 transition-colors duration-200">
                              <Check className="w-3 h-3 text-[#6ba3be]" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#6ba3be]">{feature.icon}</span>
                              <span className="text-white/90">{feature.text}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => plan.priceId && !isCurrentPlan(index) && handleCheckout(plan.priceId)}
                      disabled={isCurrentPlan(index)}
                      className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform ${
                        isCurrentPlan(index)
                          ? "bg-gray-500/50 text-white/50 cursor-not-allowed"
                          : plan.popular
                            ? "bg-white text-[#031716] hover:bg-white/90 hover:scale-105 shadow-lg hover:shadow-xl"
                            : "bg-white/10 text-white hover:bg-white hover:text-[#031716] hover:scale-105 border border-white/20 hover:border-white"
                      }`}
                    >
                      {isCurrentPlan(index) ? (
                        <span className="flex items-center justify-center gap-2">
                          <Crown className="w-4 h-4" />
                          Your Current Plan
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4" />
                          Choose {plan.title}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom section */}
          <div className="text-center mt-16">
            <p className="text-[#6ba3be] text-sm mb-4">All plans include our core features and 24/7 customer support</p>
            <div className="flex items-center justify-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
