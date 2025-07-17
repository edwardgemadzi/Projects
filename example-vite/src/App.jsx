import React from 'react'
import './App.css'
import NavBar from './NavBar'
import Health from './PatientHealth'
import ImgCarousel from './Carousel'
import ProfileCard from './ProfileCard'

function App() {

  return (
    <>
      <NavBar />
      <ProfileCard />
      <Health />
      <ImgCarousel />
    </>
  )
}

export default App
