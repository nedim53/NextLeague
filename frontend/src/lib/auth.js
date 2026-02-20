import { API_URL } from './api';

//promijeniti ime u auth.js i u ovom folderu lib imat cemo sve odvojene rute kao league.js, team.js

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ako koristiš cookies za autentifikaciju
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    return await response.json(); // podatke koje backend vrati, npr. user info ili token
  } catch (error) {
    throw error;
  }
}

export async function registerUser(formData) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ako backend postavlja cookie
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    return await response.json(); // npr. poruka o uspjehu
  } catch (error) {
    throw error;
  }
}
