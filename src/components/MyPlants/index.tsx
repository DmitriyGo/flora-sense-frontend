import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingSpinner } from '../loader';
import { Button } from '../ui/button';

import { getMyPlants } from '@/lib/plants';
import { useAuthStore } from '@/store/auth';

const MyPlants = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['my-plants'],
    queryFn: getMyPlants,
  });
  const { user } = useAuthStore();

  console.log('user ==>', user);

  const handleDetailsClick = (id: string) => {
    navigate(`/my-plants/${id}`);
  };

  const handleAddPlantClick = () => {
    navigate('/my-plants/new');
  };

  useEffect(() => {
    if (!user?.accessToken) navigate('/');
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-16">
      <h1 className="text-3xl font-bold text-center mb-8">My Plants</h1>
      {isLoading ? (
        <div className="w-full flex justify-center h-full">
          <LoadingSpinner className="w-8 h-8" />
        </div>
      ) : null}
      {data?.length && data.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.map(
            ({ id, name, currentStatus, soilType, data: plantData }) => (
              <div
                key={id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col"
              >
                <h4 className="text-xl font-semibold mb-2">{name}</h4>
                <p className="text-gray-700 mb-1">Status: {currentStatus}</p>
                <p className="text-gray-700 mb-4">Soil Type: {soilType}</p>
                {plantData.length > 0 ? (
                  <div className="overflow-hidden mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col max-h-[296px] overflow-y-auto divide-y">
                      {plantData.map(
                        (
                          {
                            humidity,
                            light,
                            nutrientLevel,
                            temperature,
                            timestamp,
                          },
                          i,
                        ) => (
                          <div
                            key={timestamp + i}
                            className="py-2 first:pt-0 last:pb-0"
                          >
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Humidity:</span>{' '}
                              {humidity}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Light:</span>{' '}
                              {light}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">
                                Nutrient Level:
                              </span>{' '}
                              {nutrientLevel}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Temperature:</span>{' '}
                              {temperature}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Timestamp:</span>{' '}
                              {new Date(timestamp).toLocaleString()}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ) : null}
                <Button
                  onClick={() => handleDetailsClick(id)}
                  className="mt-auto"
                >
                  Details
                </Button>
              </div>
            ),
          )}
        </div>
      ) : null}
      <div className="mt-8">
        <Button onClick={handleAddPlantClick}>Add Plant</Button>
      </div>
    </div>
  );
};

export default MyPlants;
