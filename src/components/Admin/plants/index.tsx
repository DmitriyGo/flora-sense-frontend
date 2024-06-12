import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getPlantsColumns, Plant } from './columns';
import { DataTable } from './data-table';

import { deletePlant, getAllPlants } from '@/lib/plants';

export default function PlantList() {
  const {
    data: plants,
    error,
    isLoading,
  } = useQuery({ queryFn: getAllPlants, queryKey: ['all-plants'] });
  const queryClient = useQueryClient();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading plants</div>;

  const handleDeletePlant = async (plantId: string) => {
    try {
      await deletePlant(plantId);
      queryClient.invalidateQueries({ queryKey: ['all-plants'] });
      toast(`Plant ${plantId} deleted successfully`);
    } catch (error) {
      toast(`Error deleting plant ${plantId}`);
    }
  };
  const columns = getPlantsColumns(handleDeletePlant);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Plants</h1>
      <div className="overflow-x-auto">
        <DataTable
          data={
            plants?.map((plant) => ({
              ...plant,
              typeName: plant.type.typeName,
            })) as Plant[]
          }
          columns={columns}
        />
      </div>
    </div>
  );
}
