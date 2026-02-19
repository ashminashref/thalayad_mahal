import React from 'react'
import ThemeToggle from '../../UI/ThemeToggle'
import Floatingnav from '../../Common/User/FloatingNav'
import Usercard from '../../Components/User/Home/Usercard'
import './Home.css'
import BentoGrid from '../../Components/User/Home/BentoGrid'
function Home() {
  return (
    <div>
        <div className="topbar fixed-top  p-3  d-flex align-items-center justify-content-between gap-5">
<div className="left d-flex flex-column align-items-start justify-content-center">
    {/* <h6 className='body-txt'>Good Morning</h6> */}
    <h4 className=' m-0 p-0'>tM</h4>
    {/* <p className='m-0 p-0'>Thalayad</p> */}
</div>


        </div>
        <div className='pt-5'>
 <Usercard/>
        <BentoGrid/>
       
        <Floatingnav/>
        </div>
       
    </div>
  )
}

export default Home