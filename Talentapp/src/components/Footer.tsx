


const Footer = () => {
  return (
    <footer className='mt-44 pt-10  pb-10'>
      <div className='flex md:flex-row flex-col md:items-center md:space-y-0 space-y-16 justify-between container text-white'>
        <div>
          <p  className='text-sm text-center md:text-start font-light'>"Skills are your superpower—they help you adapt, <br/>stand out, and seize new opportunities. Every talent<br/> you master and every ability you showcase on SkillLink<br/> opens doors. Confidence grows with each skill shared, <br/>progress accelerates with every connection made, and <br/>your potential becomes limitless. No matter your goals, <br/>SkillLink ensures your abilities are seen, valued, and rewarded. 🚀"</p>
        </div>
        <div>
          <p className='md:text-xl text-center md:text-start  text-lg md:pb-5 pb-2'>Products</p>
          <div className='text-sm text-center md:text-start  font-light'>
            <p>Writing & Note-Taking</p>
            <p>Reading & Reference</p>
            <p>Digital Learning Tools</p>
            <p>Math & Science Supplies</p>
            <p>Creativity & Projects</p>
            <p>Organization & Study Aids</p>
            <p>Comfort & Focus</p>
          </div>
        </div>
        <div>
          <p className='md:text-xl text-center md:text-start  text-lg md:pb-5 pb-2'>Useful Links</p>
          <div className='text-sm text-center md:text-start  font-light'>
            <p className='cursor-pointer' href="#">Blogs</p>
            <p className='cursor-pointer' href="#">Pricing</p>
            <p className='cursor-pointer' href="#">Certifications</p>
            <p className='cursor-pointer' href="#">Reviews</p>
            <p className='cursor-pointer' href="#">Success Stories</p>
          </div>
        </div>
        <div>
          <p className='md:text-xl text-center md:text-start  text-lg md:pb-5 pb-2'>Address</p>
          <p className='text-sm text-center md:text-start  font-light'>145, Mark way <br/>Sabo Yaba <br/> Lagos State, Nigeria.</p>
        </div>
      </div>
      <p className='text-center text-secondary pt-10'>All Rights Reserved by © Skill Link 2025</p>
    </footer>
  )
}

export default Footer
