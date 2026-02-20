import { API_URL } from './api';

export async function getMyLeagues() {
  try {
    const response = await fetch(`${API_URL}/league/getMyLeagues`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch leagues');
    }
    let data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAllLeagues(limit = 10, offset = 0){

 try {
    const response = await fetch(`${API_URL}/league/getAllLeagues?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch leagues');
    }

    return await response.json(); 
  } catch (error) {
    throw error;
  }
}

export async function createMyLeague(leagueData) {
  try {
    const response = await fetch(`${API_URL}/league/createMyLeague`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(leagueData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create league');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}


export async function getLeaguesStatistic(league_id){

  try {
    const response = await fetch(`${API_URL}/league/getLeaguesStatistic/${league_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch leagues');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }

}

export async function deleteMyLeague(league_id) {
  try {
    const response = await fetch(`${API_URL}/league/deleteMyLeague/${league_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete league');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getLeagueById(league_id){
  try {
    const response = await fetch(`${API_URL}/league/getLeagueById/${league_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to load league by id');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }

}

export async function sendRequestForLeague(team_id, league_id) {
  console.log("OVOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
  console.log("OVOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")

  console.log(team_id);
  console.log(league_id);
}

export async function addTeamInLeague(data) {
  
  const res = await fetch(`${API_URL}/league/addTeamInLeague`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to add team in league");
  }

  return await res.json();
}


export async function getUserId() {
  try {
    const res = await fetch(`${API_URL}/league/getUserId`, {
      credentials: 'include', // bitno za cookie
    });
    if (!res.ok) throw new Error("Failed to fetch user ID");
    const data = await res.json();
    return data.user_id;
  } catch (err) {
    console.error("getUserId error:", err);
    return null;
  }
}

export async function startLeague(leagueId) {
  try {
    const res = await fetch(`${API_URL}/league/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ league_id: leagueId }),
    });

    if (!res.ok) {
      throw new Error("Failed to start league");
    }

    const data = await res.json();
    console.log("League started:", data);
  } catch (error) {
    console.error("Error starting league:", error);
    throw error;
  }
};

export async function getCalendarForLeague(leagueId) {
  try {
    const res = await fetch(`${API_URL}/league/getCalendarForLeague/${leagueId}`, {
      method: 'GET',
      credentials: 'include', // da pošalje cookies (token)
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch calendar for league: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching league calendar:", error);
    throw error;
  }
}

export async function InsertStatisticAfterMatch(data) {
  try {
    console.log("PODACI KOJI SE ŠALJU:", data);

    const res = await fetch(`${API_URL}/league/insertStatisticsAfterMatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // šalje cookie (token)
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Greška prilikom slanja statistike");
    }

    const responseData = await res.json();
    console.log("Odgovor servera:", responseData);
    return responseData;
  } catch (err) {
    console.error("Greška:", err.message);
    throw err;
  }
}
