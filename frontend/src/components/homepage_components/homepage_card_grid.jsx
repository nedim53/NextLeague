import React, { useEffect, useState } from 'react';

import { TrophyIcon } from '@heroicons/react/24/outline';
import { UsersIcon } from '@heroicons/react/24/outline';
import Card from './homepage_card';
import Link from 'next/link';
import { API_URL } from "@/lib/api";

const CardsGrid = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
  fetch(`${API_URL}/user-counts`, {
  method: "GET",
  credentials: "include",
})
  .then((res) => {
    console.log('Status:', res.status);  // Provjeri status kod odgovora
    if (!res.ok) {
      throw new Error("Niste prijavljeni");
    }
    return res.json();
  })
  .then((data) => {
    console.log("Broj liga i timova:", data);
    setCards(data);
  })
  .catch((err) => {
    console.error("Greška u fetchu:", err);
  });

}, []);

return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
     <Link href="/league" className="block"><Card
      icon={TrophyIcon}
      title="Number of leagues"
      number={cards.leagues || "No leagues found"}  
    /></Link>
   <Link href="/team" className="block"> <Card
      icon={UsersIcon}
      title="Number of teams"
      number={cards.teams || "No teams found"} 
    /></Link> 
  </div>
);
};

export default CardsGrid;
