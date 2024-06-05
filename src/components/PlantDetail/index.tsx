import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';

import { usePlantData } from '@/lib/plants';
import { useAuthStore } from '@/store/auth';

const PlantDetails: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { id } = useParams<{ id: string }>();

  const { data } = usePlantData(id);

  useEffect(() => {
    if (!user?.accessToken) navigate('/');
  }, [navigate, user]);

  const handleEdit = () => {
    navigate(`/my-plants/${id}/edit`);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-500">Loading...</div>
      </div>
    );
  }

  const {
    averageParameters,
    parameterTrends,
    parameterCorrelations,
    plantData,
    plantInfo,
  } = data;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-16">
      <div className="grid grid-cols-3 items-center mb-8 gap-">
        <div />
        <h1 className="text-4xl font-extrabold text-center">
          {plantInfo.name}
        </h1>
        <Button className="ml-auto" onClick={handleEdit}>
          Edit
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6 flex justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Plant name: {plantInfo.name}
          </h2>
          <p className="text-gray-700 mb-2">
            <strong>Status:</strong> {plantInfo.currentStatus}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Soil Type:</strong> {plantInfo.soilType}
          </p>
        </div>
        {plantInfo?.type && (
          <div>
            <p className="text-gray-700 mb-2">
              <strong>Plant Type:</strong> {plantInfo?.type?.typeName}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Description:</strong> {plantInfo?.type?.description}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Optimal Humidity:</strong>
              {plantInfo?.type?.optimalHumidity}%
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Optimal Temperature:</strong>
              {plantInfo?.type?.optimalTemperature}°C
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Optimal Light:</strong> {plantInfo?.type?.optimalLight}{' '}
              lux
            </p>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <h2 className="text-2xl font-bold text-white bg-blue-500 py-4 px-6">
          Average Parameters
        </h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-start">Parameter</th>
              <th className="py-2 px-4 text-start">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4">Humidity</td>
              <td className="py-2 px-4">{averageParameters.avgHumidity}%</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 px-4">Temperature</td>
              <td className="py-2 px-4">
                {averageParameters.avgTemperature}°C
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">Light</td>
              <td className="py-2 px-4">{averageParameters.avgLight} lux</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 px-4">Nutrient Level</td>
              <td className="py-2 px-4">
                {averageParameters.avgNutrientLevel}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <h2 className="text-2xl font-bold text-white bg-green-500 py-4 px-6">
          Parameter Trends
        </h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-start">Date</th>
              <th className="py-2 px-4 text-start">Humidity</th>
              <th className="py-2 px-4 text-start">Temperature</th>
              <th className="py-2 px-4 text-start">Light</th>
              <th className="py-2 px-4 text-start">Nutrient Level</th>
            </tr>
          </thead>
          <tbody>
            {parameterTrends?.map((trend: any, index: number) => (
              <tr
                key={trend.timestamp}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="py-2 px-4">{trend.timestamp}</td>
                <td className="py-2 px-4">{trend.avgHumidity}%</td>
                <td className="py-2 px-4">{trend.avgTemperature}°C</td>
                <td className="py-2 px-4">{trend.avgLight} lux</td>
                <td className="py-2 px-4">{trend.avgNutrientLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <h2 className="text-2xl font-bold text-white bg-red-500 py-4 px-6">
          Parameter Correlations
        </h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-start">Correlation</th>
              <th className="py-2 px-4 text-start">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4">Humidity-Temperature</td>
              <td className="py-2 px-4">
                {parameterCorrelations.humidityTemperature}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 px-4">Humidity-Light</td>
              <td className="py-2 px-4">
                {parameterCorrelations.humidityLight}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">Temperature-Light</td>
              <td className="py-2 px-4">
                {parameterCorrelations.temperatureLight}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 px-4">Humidity-Nutrient Level</td>
              <td className="py-2 px-4">
                {parameterCorrelations.humidityNutrientLevel}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">Temperature-Nutrient Level</td>
              <td className="py-2 px-4">
                {parameterCorrelations.temperatureNutrientLevel}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 px-4">Light-Nutrient Level</td>
              <td className="py-2 px-4">
                {parameterCorrelations.lightNutrientLevel}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <h2 className="text-2xl font-bold text-white bg-purple-500 py-4 px-6">
          Plant Data
        </h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-start">Timestamp</th>
              <th className="py-2 px-4 text-start">Humidity</th>
              <th className="py-2 px-4 text-start">Temperature</th>
              <th className="py-2 px-4 text-start">Light</th>
              <th className="py-2 px-4 text-start">Nutrient Level</th>
            </tr>
          </thead>
          <tbody>
            {plantData?.length > 0 ? (
              plantData?.map((data: any, index: number) => (
                <tr
                  key={data.timestamp}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="py-2 px-4">
                    {new Date(data.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{data.humidity}%</td>
                  <td className="py-2 px-4">{data.temperature}°C</td>
                  <td className="py-2 px-4">{data.light} lux</td>
                  <td className="py-2 px-4">{data.nutrientLevel}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4">No data provided</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantDetails;
