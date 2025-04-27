import React from 'react'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import { ProfileEditor } from '../components/ProfileEditor'
import { SkillPostEditor } from '../components/SkillPostEditor'

const Home = () => {
  return (
    <div>
      <Hero/>
      <ProfileEditor/>
      <SkillPostEditor/>
      <Footer/>
    </div>
  )
}

export default Home
