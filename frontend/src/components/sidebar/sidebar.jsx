"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Trophy,
  Building2,
  Gem,
  User,
  BarChart,
  LogOut,
} from "lucide-react";
import { API_URL } from "@/lib/api";

const Sidebar = ()=> {

  const [isOpen, setIsOpen] = useState(false);


  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-[#071c1b] p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#071c1b] text-white px-6 py-8 border-r border-teal-800 transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo / Brand */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold tracking-wide text-white">NextLeague</h2>
          <span className="block mt-1 h-1 w-10 bg-teal-500 rounded"></span>
        </div>

        {/* Navigation */}
        <ul className="space-y-4 text-sm font-medium">
          <li>
            <Link
              href="/homepage"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#0e2e2d] transition"
            >
              <Home size={18} /> Homepage
            </Link>
          </li>
          <li>
            <Link
              href="/league"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#0e2e2d] transition"
            >
              <Trophy size={18} /> League
            </Link>
          </li>
          <li>
            <Link
              href="/team"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#0e2e2d] transition"
            >
              <Building2 size={18} /> Team 
            </Link>
          </li>
          <li>
            <Link
              href="/vip"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#0e2e2d] transition"
            >
              <Gem size={18} /> Premium
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#0e2e2d] transition"
            >
              <User size={18} /> Profile
            </Link>
            
          </li>
          <li>
            <Link
              href="/statistics"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#0e2e2d] transition"
            >
              <BarChart size={18} /> Statistics
            </Link>
            
          </li>
        </ul>

        {/* Logout Button */}
        <div className="mt-10 pt-6 border-t border-teal-800">
          <button
             onClick={async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // šalje cookie
      });

      localStorage.removeItem("user_data");
      location.assign('/');
    } catch (err) {
      console.error("Logout greška:", err);
    }
  }}
            className="flex items-center gap-3 text-red-400 hover:text-red-500 transition text-sm font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
