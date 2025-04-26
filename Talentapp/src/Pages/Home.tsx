import React from 'react'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import { ProfileEditor } from './Profile'

const Home = () => {
  return (
    <div>
      <Hero/>
      <ProfileEditor/>
      <Footer/>
    </div>
  )
}

export default Home
