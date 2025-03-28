import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useProfiledata } from "../hooks/useProfiledata";
import UserSearchbar from "./UserSearchbar";

const Navbar = () => {

  const {data, loading} = useProfiledata()



  return (
    <nav className=" h-[80px] bg-gray-900 itsjustbtw text-white px-[20px]">
      
      <div className="">

          <h1>Programmer hub</h1>
      </div>

      <UserSearchbar/>
      

      <div>
         {
         
         (!loading  ) &&
         
         (data?.udata?.username ? <button className=" min-w-[130px] h-[30px] bg-[#FF6500] rounded-full itsjust gap-[20px]">{data.udata.username}</button> :  <Link to={`/login`} className=" min-w-[130px] h-[30px] bg-[#FF6500] rounded-full itsjust gap-[20px]">Login</Link>)
         
         
         }
      </div>

    </nav>
  );
};

export default Navbar;
