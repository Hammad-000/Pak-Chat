import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.REACT_APP_SUPABASE_URL="https://mndetnpedlclbkqtgfto.supabase.co",
  import.meta.env.REACT_APP_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZGV0bnBlZGxjbGJrcXRnZnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTU0NzAsImV4cCI6MjA4MzA3MTQ3MH0.Qqh3k6nhWR15YZ8gsfVnL0brA5VSuFH1mDyBm-4J3Bo"

);



export default supabase;
