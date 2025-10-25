import Link from 'next/link'
import { JSX } from 'react'

type singleNavLinkProps = {
    currentPath : string,
    href : string,
    Icon : ()=> JSX.Element,
    text : string
}

function SingleNavLink({currentPath, href, Icon, text} : singleNavLinkProps) {
    const isActive = currentPath === href;
  return (
    <Link className={`dashboard-link ${isActive ? 'active' : 'inactive'}`} href={href}> 
              <Icon />
              {text} 
    </Link>
  )
}

export default SingleNavLink