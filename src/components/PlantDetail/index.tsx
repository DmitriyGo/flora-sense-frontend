import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/store/auth';

const fetchAverageParameters = async (plantId: string) => {
  const response = await axiosInstance.get(`/plant-data/average/${plantId}`);
  return response.data;
};

const fetchParameterTrends = async (plantId: string) => {
  const response = await axiosInstance.get(`/plant-data/trends/${plantId}`);
  return response.data;
};

const fetchParameterCorrelations = async (plantId: string) => {
  const response = await axiosInstance.get(
    `/plant-data/correlations/${plantId}`,
  );
  return response.data;
};

const fetchPlantData = async (plantId: string) => {
  const response = await axiosInstance.get(`/plant-data/${plantId}`);
  return response.data;
};

const PlantDetails: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { id } = useParams<{ id: string }>();

  const { data: averageParameters } = useQuery({
    queryKey: ['averageParameters', id],
    queryFn: () => (id ? fetchAverageParameters(id) : null),
  });

  const { data: parameterTrends } = useQuery({
    queryKey: ['parameterTrends', id],
    queryFn: () => (id ? fetchParameterTrends(id) : null),
  });

  const { data: parameterCorrelations } = useQuery({
    queryKey: ['parameterCorrelations', id],
    queryFn: () => (id ? fetchParameterCorrelations(id) : null),
  });

  const { data: plantData } = useQuery({
    queryKey: ['plantData', id],
    queryFn: () => (id ? fetchPlantData(id) : null),
  });

  useEffect(() => {
    if (!user?.accessToken) navigate('/');
  }, [navigate, user]);

  if (
    !averageParameters ||
    !parameterTrends ||
    !parameterCorrelations ||
    !plantData
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-16">
      <h1 className="text-4xl font-extrabold text-center mb-8">
        Plant Details
      </h1>

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
              <td className="py-2 px-4">{averageParameters.avgHumidity}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 px-4">Temperature</td>
              <td className="py-2 px-4">{averageParameters.avgTemperature}</td>
            </tr>
            <tr>
              <td className="py-2 px-4">Light</td>
              <td className="py-2 px-4">{averageParameters.avgLight}</td>
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
                <td className="py-2 px-4">{trend.avgHumidity}</td>
                <td className="py-2 px-4">{trend.avgTemperature}</td>
                <td className="py-2 px-4">{trend.avgLight}</td>
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
            {plantData?.data?.length > 0 ? (
              plantData?.data?.map((data: any, index: number) => (
                <tr
                  key={data.timestamp}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="py-2 px-4">
                    {new Date(data.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{data.humidity}</td>
                  <td className="py-2 px-4">{data.temperature}</td>
                  <td className="py-2 px-4">{data.light}</td>
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
