import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getUsersColumns, User } from './columns';
import { DataTable } from './data-table';

import { deleteUser, getAllUsers } from '@/lib/users';

export default function UserList() {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery({ queryFn: getAllUsers, queryKey: ['all-users'] });
  const queryClient = useQueryClient();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      toast(`User ${userId} deleted successfully`);
    } catch (error) {
      toast(`Error deleting user ${userId}`);
    }
  };
  const columns = getUsersColumns(handleDeleteUser);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="overflow-x-auto">
        <DataTable data={users as User[]} columns={columns} />
      </div>
    </div>
  );
}
