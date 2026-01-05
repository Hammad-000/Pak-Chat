
import './index.css'


import supabase from './config/supabase';
import { useState } from 'react';
import { useEffect } from 'react';

//  const supabase = createClient(import.meta.env.VITE_SUPABASE_URL="https://mndetnpedlclbkqtgfto.supabase.co", 
//   import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZGV0bnBlZGxjbGJrcXRnZnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTU0NzAsImV4cCI6MjA4MzA3MTQ3MH0.Qqh3k6nhWR15YZ8gsfVnL0brA5VSuFH1mDyBm-4J3Bo");



function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  
  // 🔐 Google Login
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };


  // 🚪 Logout
  const logout = async () => {
    await supabase.auth.signOut();
  };

  // 📩 Fetch messages
  const getFetch = async () => {
    const { data, error } = await supabase
      .from("inbox")
      .select("*")
      .order("id", { ascending: true });

      if (!error) setMessages(data);
    };

    // ➕ Insert message (logged-in user only)
    const insertData = async () => {
      if (!message.trim() || !user) return;
      
      const { error } = await supabase.from("inbox").insert({
        title: message,
        user_id: user.id,
    user_email: user.email,
  });
  
  if (!error) {
    setMessage("");
    getFetch();
  } else {
    console.error(error);
  }
};



// 🔄 Auth + initial fetch
useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data?.user ?? null);
  });
  
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });
  
  getFetch();
  
  console.log(supabase)
  return () => {
    subscription.unsubscribe();
  };
}, []);


return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-full max-w-md h-full md:h-[90%] bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gray-500 text-white text-sm font-bold">
          {user ? (
            <>
              <p>{user.email}</p>
              <button onClick={logout} className=" rounded-2xl bg-orange-400 p-2">
                Logout
              </button>
            </>
          ) : (
            <button
            onClick={loginWithGoogle}
            className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              Login with Google
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100">
          {messages.map((msg, ) => (
            <div key={msg.id} className="flex justify-start">
              <div className="bg-white px-4 py-2 rounded-lg shadow text-sm max-w-[75%]">
               <p>{msg.title}</p>
                <small className="text-gray-400">{msg.user_email}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        {user && (
          <div className="p-3 border-t flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="type a message..."
              className="flex-1 border rounded-full px-4 py-2 outline-none"
            />
            <button
              onClick={insertData}
              className=" rounded-2xl bg-orange-400 p-2 text-white"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;