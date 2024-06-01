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

const getMyPlants = async () => {
  try {
    const response = await axiosInstance.get<Plant[]>('/plants/my');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const getAllPlants = async () => {
  try {
    const response = await axiosInstance.get<Plant[]>('/plants');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export { getMyPlants, getAllPlants };
