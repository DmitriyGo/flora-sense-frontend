import BackupActions from './backup';
import PlantList from './plants';
import UserList from './users';

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-xl">Admin Panel</h1>
      </header>
      <main className="p-4">
        <UserList />
        <PlantList />
        <BackupActions />
      </main>
    </div>
  );
}
