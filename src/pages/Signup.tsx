import { useState } from "react";
import { supabase } from "../supabaseClient";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e : any) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the confirmation link!");
      console.log("User saved:", data.user);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#e6e2c5] text-[#3d348b]">
      <div className="flex justify-center items-center h-screen">
        <div className="bg-[#e6d3b3] text-[#2b4593] font-bold border-[8px] border-[#2b4593] rounded-[8px] xl:w-[40%] w-[70%] xl:h-[60%] h-[40%]">
          <div className="flex justify-center md:text-[70px] text-[20px] pt-[7%]">
            <p className="tracking-[10px]">Sign-Up</p>
          </div>
          
          <form onSubmit={handleSignup} className="flex flex-col justify-center md:text-[20px] text-[15x]">
            <div className="flex flex-col pt-[7%] gap-[5%]">
              <div className="text-center"><p>Email</p></div>
              <div className="flex justify-center pt-[1%]">
                <input 
                  className="outline-none rounded-[5px] p-[5px] text-black" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col pt-[7%] gap-[5%]">
              <div className="text-center"><p>Password</p></div>
              <div className="flex justify-center pt-[1%]">
                <input 
                  className="outline-none rounded-[5px] p-[5px] text-black" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-row justify-center pt-[7%]">
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#2b4593] text-white font-bold rounded-[5px] px-[20px] py-[10px] mr-[20px] xl:w-[150px] hover:bg-[#3d348b] disabled:opacity-50"
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
              <button 
                type="button"
                className="bg-[#2b4593] text-white font-bold rounded-[5px] px-[20px] py-[10px] xl:w-[200px] hover:bg-[#3d348b]"
              >
                Forgot Password
              </button>
            </div>  
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;