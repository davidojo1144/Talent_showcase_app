import assets from "../assets/hooks.jpg"
import { AuthForm } from "./AuthForm"

const Hero = () => {
  return (
    <div className="container">
      <div className="flex md:flex-row flex-col pt-10 items-center justify-center gap-10">
        <img className="w-56 rounded-xl" src={assets} alt="" />
        <div>
            <h2></h2>
            <p></p>
        </div>
        <AuthForm/>
      </div>
    </div>
  )
}

export default Hero
