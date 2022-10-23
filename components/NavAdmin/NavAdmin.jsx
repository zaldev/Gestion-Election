import { BsFillPersonLinesFill,  } from 'react-icons/bs';
import {VscDashboard} from 'react-icons/vsc'
import {GiVote} from 'react-icons/gi'
import {GoHome} from 'react-icons/go'
import { FaMapMarked } from 'react-icons/fa';
import { useRouter } from 'next/router'

const NavAdmin = () => {
 
  return (
    <div className="h-[100vh] w-16 flex flex-col
                  bg-secondary shadow-lg fixed top-0 left-0 z-40">
                    
        <SideBarIcon icon={<VscDashboard size="28" />} rt="/admin" text='Tableau de bord'/>
        <Divider />
        <SideBarIcon icon={<FaMapMarked size="20" />} rt="/admin/circonscriptions" text='Circonscriptions'/>
        <SideBarIcon icon={<BsFillPersonLinesFill size="28"/>} rt="/admin/utilisateurs" text='Utilisateurs'/>
        <SideBarIcon icon={<GiVote size="28"/>} rt="/admin/elections" text='Elections'/>
        <Divider />
        <SideBarIcon icon={<GoHome size="20" />} rt="/" text='Accueil'/>
        {/* <Divider />
        <SideBarIcon icon={<BsGearFill size="22" />} /> */}
    </div>
  );
};

const SideBarIcon = ({ icon, rt,text = '' }) =>{
  const router =useRouter()
  const pat = router.pathname
  const is_it=pat===rt

  const handleClick= (rt) =>{
    router.push(rt)
  }
  return (
  <div className={is_it ? "selected sidebar-icon group ":"sidebar-icon group "} onClick={(e)=>handleClick(rt)}>
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100 "
    >
      {text}
    </span>
  </div>
);}


const Divider = () => <hr className="sidebar-hr" />;

export default NavAdmin;