import { API_URL } from './api';

export async function getAllTeams() {
  try{
    const res = await fetch(`${API_URL}/team/getAllTeams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
    });
    if (!res.ok) {
      throw new Error('Failed to fetch teams');
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
}


export async function getTeamById(teamId) {
  try{
    const res = await fetch(`${API_URL}/team/view/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
    });
    if (!res.ok) {
      throw new Error('Failed to fetch team');
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
}


export async function createTeam(teamData) {
  try {
    const res = await fetch(`${API_URL}/team/createTeam`, {
      method: 'POST',
      body: teamData, 
      credentials: 'include',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      if (errorData && errorData.detail) {
        if (errorData.detail.includes("maksimalan broj timova")) {
          throw new Error("Dostigli ste maksimalan broj timova koji možete kreirati.");
        }
        throw new Error(errorData.detail);
      }
      throw new Error('Failed to create team');
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
}


export async function getMyTeam() {
  try {
    const res = await fetch(`${API_URL}/team/getMyTeams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch teams');
    }

    const data = await res.json();

    if (!data.teams || !Array.isArray(data.teams)) {
      return { teams: [], user_id: null }; 
    }

    return data;
  } catch (error) {
    throw error;
  }
}


export async function getTeamMembers(teamId) {
  try{
    const res = await fetch(`${API_URL}/team/${teamId}/getTeamMembers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
    });
    if (!res.ok) {
      throw new Error('Failed to fetch team members');
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteTeam(teamId) {
return fetch(`${API_URL}/team/deleteMyTeam/${teamId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Failed to delete team');
    }
    return res.json();
  })
  .catch(error => {
    throw error;
  });
}

export async function getMyTeamsModerator(league_sport) {
  try {
    const res = await fetch(`${API_URL}/team/getMyTeamsModeratorFiltered?league_sport=${encodeURIComponent(league_sport)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch moderator teams');
    }

    return await res.json();
  } catch (error) {
    console.error("Greška u getMyTeamsModerator:", error);
    throw error;
  }
}


export async function getRequestsForTeam() {
  const res = await fetch(`${API_URL}/request/getRequestsForTeam`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) throw new Error("Failed to fetch team requests");
  return res.json();
}


export async function createRequestForTeam(team_id) {
  const res = await fetch(`${API_URL}/request/createRequestForTeam`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ team_id }),
  });

  if (!res.ok) throw new Error("Failed to send join request");
  return res.json();
}

export async function getCalendarForTeam(teamId) {
  const res = await fetch(`${API_URL}/team/calendar/team/${teamId}`);
  if (!res.ok) throw new Error("Failed to fetch calendar");
  return res.json();
}
