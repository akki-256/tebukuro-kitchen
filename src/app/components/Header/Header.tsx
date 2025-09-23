import { Slide, useScrollTrigger } from "@mui/material";
import SwitchMode from "./SwitchMode";
import SearchBar from "./SearchBar";

const Header = () => {
  const target = useScrollTrigger();

  return (
    <Slide in={!target} appear={false}>
      <div className="w-full border-b-2 border-black bg-white px-3 pt-2">
        <SearchBar />
        <SwitchMode />
      </div>
    </Slide>
  );
};

export default Header;
