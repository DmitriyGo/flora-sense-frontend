import { CircleUser, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import ukraineSvg from './ui/svg/ukraine.svg';
import usaSvg from './ui/svg/usa.svg';

import { logout } from '@/lib/auth';
import { Role, useAuthStore } from '@/store/auth';

export const Navbar = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleChangeLanguage = (lang: string) => {
    console.log('lang ==>', lang);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex w-full border-b">
      <nav className="w-full grid grid-cols-5 items-center py-4 px-16">
        <div />

        <div className="col-span-3 flex justify-center gap-12 [&>a:hover]:underline">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/my-plants">My Plants</Link>
          <Link to="/sign-in">Sign In</Link>
          <Link to="/sign-up">Sign Up</Link>
          <Link to="/profile">Profile</Link>
          {user?.roles.includes(Role.ADMIN) ? (
            <Link to="/admin">Admin</Link>
          ) : null}
        </div>

        <div className="flex justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="fou">
              <Globe />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="right-10">
              <DropdownMenuItem>
                <button
                  className="w-full flex gap-1"
                  onClick={() => handleChangeLanguage('uk')}
                >
                  <img className="h-4 w-6" src={ukraineSvg} alt="uk" />
                  <p>UK</p>
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className="w-full flex gap-1"
                  onClick={() => handleChangeLanguage('en')}
                >
                  <img className="h-4 w-6" src={usaSvg} alt="uk" />
                  <p>EN</p>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="fou">
              <CircleUser />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="right-10">
              {user ? (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate('/sign-in')}>
                    SignIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/sign-up')}>
                    SignUp
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </div>
  );
};
