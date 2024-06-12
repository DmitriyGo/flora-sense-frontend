import { useQuery } from '@tanstack/react-query';

import axiosInstance from './axios';

export interface Plant {
  id: string;
  name: string;
  plantTypeId: string;
  userId: string;
  plantingDate: string;
  currentStatus: string;
  soilType: string;
  type: PlantType;
  data: PlantData[];
}

export interface PlantType {
  id: string;
  typeName: string;
  description: string;
  optimalHumidity: number;
  optimalTemperature: number;
  optimalLight: number;
}

export interface PlantData {
  id: string;
  humidity: number;
  temperature: number;
  light: number;
  nutrientLevel: number;
  plantId: string;
  timestamp: string;
}

export const getMyPlants = async () => {
  try {
    const response = await axiosInstance.get<Plant[]>('/plants/my');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getAllPlants = async () => {
  try {
    const response = await axiosInstance.get<Plant[]>('/plants');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchPlantData = async (plantId: string) => {
  const response = await axiosInstance.get(`/plant-data/${plantId}`);
  return response.data;
};

export const fetchPlantInfo = async (plantId: string) => {
  const response = await axiosInstance.get(`/plants/${plantId}`);
  return response.data;
};

export const deletePlant = async (plantId: string) => {
  const response = await axiosInstance.delete(`/plants/${plantId}`);
  return response.data;
};

export const fetchAverageParameters = async (plantId: string) => {
  const response = await axiosInstance.get(`/plant-data/average/${plantId}`);
  return response.data;
};

export const fetchParameterTrends = async (plantId: string) => {
  const response = await axiosInstance.get(`/plant-data/trends/${plantId}`);
  return response.data;
};

export const fetchParameterCorrelations = async (plantId: string) => {
  const response = await axiosInstance.get(
    `/plant-data/correlations/${plantId}`,
  );
  return response.data;
};

export const usePlantData = (id?: string) => {
  const fetchData = async () => {
    if (!id) return null;
    const [
      averageParameters,
      parameterTrends,
      parameterCorrelations,
      plantData,
      plantInfo,
    ] = await Promise.all([
      fetchAverageParameters(id),
      fetchParameterTrends(id),
      fetchParameterCorrelations(id),
      fetchPlantData(id),
      fetchPlantInfo(id),
    ]);
    return {
      averageParameters,
      parameterTrends,
      parameterCorrelations,
      plantData,
      plantInfo,
    };
  };

  return useQuery({ queryFn: fetchData, queryKey: ['plantData', id] });
};
