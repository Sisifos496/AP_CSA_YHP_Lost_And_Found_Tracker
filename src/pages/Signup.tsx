function Signup() {

  return (
    <div className="bg-[#e6e2c5] text-[#3d348b]">
      <div className="flex justify-center items-center h-screen">
        <div className="bg-[#e6d3b3] text-[#2b4593] font-bold border-[8px] border-[#2b4593] rounded-[8px] xl:w-[40%] w-[70%] xl:h-[60%] h-[40%]">
          <div className="flex justify-center md:text-[70px] text-[20px] pt-[7%]">
            <p className="tracking-[10px]">Sign-Up</p>
          </div>
          <div className="flex flex-col justify-center md:text-[20px] text-[15x]">
            <div className="flex flex-col pt-[7%] gap-[5%]">
              <div className="text-center"><p>Email</p></div>
              <div className="flex justify-center pt-[1%]"><input className="outline-none rounded-[5px] p-[5px]" type="email" /></div>
            </div>
            <div className="flex flex-col pt-[7%] gap-[5%]">
              <div className="text-center"><p>Password</p></div>
              <div className="flex justify-center pt-[1%]"><input className="outline-none rounded-[5px] p-[5px]" type="password" /></div>
            </div>
          </div>
          <div>
            <div className="flex flex-row justify-center pt-[7%]">
              <div>
                <button className="bg-[#2b4593] text-white font-bold rounded-[5px] px-[20px] py-[10px] mr-[20px] xl:w-[150px] hover:bg-[#3d348b]">Sign Up</button>
              </div>
              <div>
                <button className="bg-[#2b4593] text-white font-bold rounded-[5px] px-[20px] py-[10px] xl:w-[200px] hover:bg-[#3d348b]">Forgot Password</button>
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
