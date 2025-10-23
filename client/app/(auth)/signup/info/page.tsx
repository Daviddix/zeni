import Image from 'next/image'
import userIcon from "@/public/images/user-icon.svg"
import "./info.css"

function Info() {
  return (
    <div className="user-info-screen">

      <form>

      <div>
        <p className='auth-label'>UPLOAD A PROFILE PICTURE</p>
        <div className="user-circle">
          <Image 
          src={userIcon}
          alt='user icon'
          />
        </div>

      </div>

      <div>
        <label 
        className="auth-label"
        htmlFor="fullname">
          FULLNAME
        </label>

        <input 
        className='auth-input'
        type="text" 
        id='fullname' />
      </div>

      <button className='primary-button'>Finish</button>
      <p></p>
      </form>
    </div>
  )
}

export default Info