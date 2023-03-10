import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL!;

export type AggregatorData = {
  pair: string;
  icon: string;
};

export async function fetchAggregatorData(): Promise<
  Record<
    string,
    {
      pair: string;
      icon: string;
    }
  >
> {
  const { data } = await axios.get(`${API}/aggregators`);
  return data;
}

export async function fetchPrices(): Promise<Record<string, string>> {
  const { data } = await axios.get(`${API}/prices`);
  return data;
}

export type SignedPrices = {
  timestamp: string;
} & Record<
  string,
  {
    signature: string;
    price: string;
  }
>;

export async function fetchSignedPrices(): Promise<SignedPrices> {
  const { data } = await axios.get(`${API}/signed_prices`);
  return data;
}
