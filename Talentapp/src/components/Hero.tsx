import assets from "../assets/hooks.jpg"
import { AuthForm } from "./AuthForm"

const Hero = () => {
  return (
    <div className="container">
      <div className="flex md:flex-row flex-col pt-20 items-center justify-center gap-10">
        <img className="md:w-56 w-full md:h-80 h-[60vh] rounded-xl" src={assets} alt="" />
        <div className="space-y-3">
            <h2 className="text-center prata-regular md:text-3xl text-xl font-medium">Skill Link</h2>
            <div className="space-y-2">
              <p className="md:text-lg text-sm md:font-light">Talent Showcase App – Where talent shines, connections thrive, and opportunities come to life! ✨ Showcase your skills, inspire the world, and build your future—one brilliant ability at a time.</p>
              <p className="md:text-lg text-sm md:font-light">Where talent meets opportunity. Showcase your skills, connect with the right audience, and turn your abilities into success—effortlessly."</p>
            </div>
        </div>
        <AuthForm/>
      </div>
    </div>
  )
}

export default Hero
