import axios from 'axios';

const API_URL = 'https://rizzbackend.onrender.com/rizz';

export const fetchRizz = async (category: string): Promise<string> => {
  try {
    const response = await axios.post(
      API_URL,
      { category },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Assuming your backend returns { rizz: string }
    return response.data.rizz;
  } catch (error: any) {
    console.error('Error fetching rizz:', error.message || error);
    throw new Error('Failed to fetch rizz');
  }
};
