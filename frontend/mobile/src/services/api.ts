import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api', // point to your Django backend later
  timeout: 10000,
});

export const supabase = createClient('https://gkhyhlhiwhujqnpotqvo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdraHlobGhpd2h1anFucG90cXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTk2MDIsImV4cCI6MjA3MDI3NTYwMn0.Vgxohdq_Qj2OmOpb0dB-7xFelqIBHppb330POKBdjSc');

export async function ping() {
  const { data } = await api.get('/health/');
  return data;
}
