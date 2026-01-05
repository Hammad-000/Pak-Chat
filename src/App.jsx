import './index.css'
import supabase from './config/supabase';
import { useState, useEffect } from 'react';

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
      created_at: new Date().toISOString(), // Set current timestamp
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

    console.log(supabase);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper to extract the Gmail name (before the @ symbol)
  const getNameFromEmail = (email) => {
    return email.split('@')[0]; // Get the part before @ symbol
  };

  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-full max-w-md h-full md:h-[90%] bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gray-500 text-white text-sm font-bold">
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                {/* Avatar */}
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div> 
                )}
                <div>
                  <p>{getNameFromEmail(user.email)}</p> 
                  <small className="block text-gray-400">{user.email}</small> 
                </div>
              </div>
              <button onClick={logout} className="rounded-2xl bg-orange-400 p-2">
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="bg-white text-orange-600 px-3 py-1 rounded"
            >
              Login with Google
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100">
          {messages.map((msg) => (
            <div key={msg.id} className="flex justify-start">
              <div className="bg-white px-4 py-2 rounded-lg shadow text-sm max-w-[75%]">
                <p>{msg.title}</p>
                <div className="flex justify-between gap-2 flex-col">
                  <small className="text-gray-400">{msg.user_email.split('@')[0]}</small>
                  <small className="text-gray-400">{msg.created_at}</small>
                </div>
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
              className="rounded-2xl bg-orange-400 p-2 text-white"
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
