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

  const isAdmin = user?.roles.includes(Role.ADMIN);

  return (
    <header className="w-full bg-green-600 text-white">
      <nav className="w-full grid grid-cols-5 grid-rows-1 items-center py-4 px-16">
        <div className="flex col-span-2 justify-start gap-6 [&>a:hover]:underline">
          <Link to="/">Home</Link>

          {user ? <Link to="/my-plants">My Plants</Link> : null}
          {isAdmin ? <Link to="/admin">Admin</Link> : null}
        </div>

        <h1 className="text-3xl text-center font-bold">FloraSense</h1>

        <div className="flex col-span-2 justify-end gap-4">
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
    </header>
  );
};
