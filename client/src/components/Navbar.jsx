import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {

  return (
    <nav className=" h-[80px] bg-gray-900 itsjustbtw text-white px-[20px]">
      
      <div className="">

          <h1>Programmer hub</h1>
      </div>

      <div className="flex w-[300px] bg-black h-[50px]">

      </div>

      <div>
          <Link to={'/profile'} className=" w-[100px] h-[30px] bg-[#FF6500] rounded-full itsjust gap-[20px]">Profile</Link>
      </div>

    </nav>
  );
};

export default Navbar;
