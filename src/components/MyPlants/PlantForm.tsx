import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '../ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import axiosInstance from '@/lib/axios';
import { fetchPlantInfo } from '@/lib/plants';

const fetchPlantTypes = async () => {
  const response = await axiosInstance.get('/plant-types');
  return response.data;
};

// eslint-disable-next-line react-refresh/only-export-components
export const createPlant = async (plantData: any) => {
  const response = await axiosInstance.post('/plants', plantData);
  return response.data;
};

// eslint-disable-next-line react-refresh/only-export-components
export const updatePlant = async (id: string, plantData: any) => {
  const response = await axiosInstance.patch(`/plants/${id}`, plantData);
  return response.data;
};

export interface Plant {
  name: string;
  plantTypeId: string;
  plantingDate: string;
  currentStatus: string;
  soilType: string;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  plantTypeId: z.string().uuid(),
  soilType: z.string().min(1, 'Soil type is required'),
  currentStatus: z.string().min(1, 'Status is required'),
});

const PlantForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);

  const { data: plantTypes } = useQuery({
    queryKey: ['plantTypes'],
    queryFn: fetchPlantTypes,
  });

  const { data: plantInfo } = useQuery({
    queryKey: ['plantInfo', id],
    queryFn: () => (id ? fetchPlantInfo(id) : null),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      plantTypeId: '',
      currentStatus: '',
      soilType: '',
    },
  });

  useEffect(() => {
    if (plantInfo) {
      form.reset({
        name: plantInfo.name || '',
        plantTypeId: plantInfo.plantTypeId || '',
        currentStatus: plantInfo.currentStatus || '',
        soilType: plantInfo.soilType || '',
      });
    }
  }, [plantInfo, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      if (id && isEdit) {
        await updatePlant(id, data);
        toast.success('Successfully updated plant', {});
      } else {
        await createPlant(data);
        toast.success('Successfully added plant', {});
      }
      navigate('/my-plants');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save plant data', {});
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center max-w-[40%] mx-auto mt-32 gap-8">
      <h2 className="text-5xl font-semibold">
        {isEdit ? 'Edit Plant' : 'Add Plant'}
      </h2>
      <div className="border p-4 rounded-xl w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      placeholder="Plant name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plantTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Plant Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select plant type" />
                      </SelectTrigger>
                      <SelectContent>
                        {plantTypes?.map((type: any) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={type.id}
                            value={type.id}
                          >
                            {type.typeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Soil Type</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      placeholder="Soil type"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Status</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      placeholder="Current status"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PlantForm;
