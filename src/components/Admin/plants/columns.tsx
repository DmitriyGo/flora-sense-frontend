import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Plant = {
  id: string;
  name: string;
  typeName: string;
  userId: string;
  plantingDate: string;
  currentStatus: string;
  soilType: string;
};

export const getPlantsColumns = (
  onDelete: (plantId: string) => void,
): ColumnDef<Plant>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <CopyToClipboard
        onCopy={() =>
          toast(`Plant id ${row.getValue('id')} copied to clipboard`)
        }
        text={row.getValue('id')}
      >
        <Button variant="outline" className="ml-2">
          Copy ID
        </Button>
      </CopyToClipboard>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'typeName',
    header: 'Type',
  },
  {
    accessorKey: 'userId',
    header: 'User',
    cell: ({ row }) => (
      <CopyToClipboard
        onCopy={() =>
          toast(`User id ${row.getValue('userId')} copied to clipboard`)
        }
        text={row.getValue('userId')}
      >
        <Button variant="outline" className="ml-2">
          Copy User ID
        </Button>
      </CopyToClipboard>
    ),
  },
  {
    accessorKey: 'plantingDate',
    header: 'Planting Date',
  },
  {
    accessorKey: 'currentStatus',
    header: 'Status',
  },
  {
    accessorKey: 'soilType',
    header: 'Soil Type',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const plant = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log('Edit', plant.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(plant.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
