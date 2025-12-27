import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLink, useLocation, useNavigate } from "react-router";
const navlinks = [
  {
    name: "Entries",
    link: "/dashboard/entries",
  },
  {
    name: "Prompts",
    link: "/dashboard/prompts/",
  },
  {
    name: "Favorates",
    link: "/dashboard/favorates/",
  },
  {
    name: "Settings",
    link: "/dashboard/settings",
  },
];
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-full  bg-[#DEE7FD] rounded-r-2xl  h-full py-20 px-5">
      <div className="flex gap-2 items-center">
        <img src="/logo.png" className="size-[60px]" />{" "}
        <span className="font-semibold text-3xl bg-linear-to-b from-[#A875DF] to-[#8BAADE] bg-clip-text text-transparent">
          Clarity
        </span>
      </div>
      <NavLink
        to={"/dashboard"}
        className={buttonVariants({
          className: "mt-10 w-full",
        })}
      >
        New Entry
      </NavLink>

      <nav>
        <ul>
          {navlinks.map((item) => (
            <NavLink to={item.link}>
              <li
                className={cn(
                  "py-4 px-4 mt-3 rounded-md",
                  location.pathname == item.link && "bg-[#C8CDF3]"
                )}
              >
                {item.name}
              </li>
            </NavLink>
          ))}
        </ul>
      </nav>
      <Button
        onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
