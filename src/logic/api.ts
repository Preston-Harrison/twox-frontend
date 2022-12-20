import axios from 'axios';

const API = 'http://localhost:3001';

export async function fetchAggregators(): Promise<Record<string, string>> {
  const { data } = await axios.get(`${API}/aggregators`);
  return data;
}

export async function fetchPrices(): Promise<Record<string, string>> {
  const { data } = await axios.get(`${API}/prices`);
  return data;
}
