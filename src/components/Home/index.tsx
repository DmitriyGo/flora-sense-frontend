import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGetStarted = () => {
    if (user) {
      navigate('/my-plants');
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <div className="min-h-[calc(100vh_-_68px)] flex flex-col items-center justify-center bg-gray-100">
      <main className="w-full bg-cover bg-[url(bg.webp)] flex-1 flex flex-col items-center justify-center px-16 py-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome to FloraSense</h2>
        <p className="text-center text-gray-700 mb-8">
          Monitor and manage the microclimate of your home plants easily and
          efficiently.
        </p>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
          <button className="bg-white text-green-500 border border-green-500 px-6 py-2 rounded hover:bg-gray-200">
            Learn More
          </button>
        </div>
      </main>
      <footer className="w-full border-t py-4">
        <p className="px-16 text-sm">
          &copy; 2024 FloraSense. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
