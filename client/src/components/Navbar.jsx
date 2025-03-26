import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useProfiledata } from "../hooks/useProfiledata";


const Navbar = () => {

  const {data, loading} = useProfiledata()



  return (
    <nav className=" h-[80px] bg-gray-900 itsjustbtw text-white px-[20px]">
      
      <div className="">

          <h1>Programmer hub</h1>
      </div>

      <div className="flex w-[300px] bg-black h-[50px]">

      </div>

      <div>
         {
         
         (!loading  ) &&
         
         (data?.udata?.username ? <Link to={`/profile?user=${data.udata.username}`} className=" min-w-[130px] h-[30px] bg-[#FF6500] rounded-full itsjust gap-[20px]">{data.udata.username}</Link> :  <Link to={`/login`} className=" min-w-[130px] h-[30px] bg-[#FF6500] rounded-full itsjust gap-[20px]">Login</Link>)
         
         
         }
      </div>

    </nav>
  );
};

export default Navbar;
