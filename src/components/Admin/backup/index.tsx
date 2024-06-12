import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createBackup,
  downloadBackup,
  getAllBackups,
  restoreBackup,
} from '@/lib/backup';

export default function BackupActions() {
  const [downloadBackupName, setDownloadBackupName] = useState('');
  const [restoreBackupName, setSestoreBackupName] = useState('');
  const { data: backups } = useQuery({
    queryFn: getAllBackups,
    queryKey: ['backups'],
  });
  const queryClient = useQueryClient();

  const createBackupMutation = useMutation({
    mutationFn: createBackup,
    onSuccess: (data) => {
      toast.success(`Backup "${data.fileName}" created successfully`);
      queryClient.invalidateQueries({ queryKey: ['backups'] });
    },
    onError: (error: any) => {
      toast.error(`Error creating backup: ${error.message}`);
    },
  });

  const downloadBackupMutation = useMutation({
    mutationFn: downloadBackup,
    onSuccess: () => {
      toast.success(`Backup ${downloadBackupName} downloaded successfully`);
    },
    onError: (error: any) => {
      toast.error(`Error downloading backup: ${error.message}`);
    },
  });

  const restoreBackupMutation = useMutation({
    mutationFn: restoreBackup,
    onSuccess: () => {
      toast.success(`Backup ${downloadBackupName} restored successfully`);
      queryClient.invalidateQueries({ queryKey: ['backups'] });
    },
    onError: (error: any) => {
      toast.error(`Error restoring backup: ${error.message}`);
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Backup Actions</h1>
      <div className="flex flex-col space-y-4">
        <Button onClick={() => createBackupMutation.mutate()}>
          Create Backup
        </Button>
        <div className="flex space-x-2">
          <Input
            placeholder="Backup Name"
            value={downloadBackupName}
            onChange={(e) => setDownloadBackupName(e.target.value)}
          />
          <Button
            className="min-w-[200px]"
            onClick={() => downloadBackupMutation.mutate(downloadBackupName)}
          >
            Download Backup
          </Button>
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Backup Name"
            value={restoreBackupName}
            onChange={(e) => setSestoreBackupName(e.target.value)}
          />
          <Button
            className="min-w-[200px]"
            onClick={() => restoreBackupMutation.mutate(restoreBackupName)}
          >
            Restore Backup
          </Button>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Available Backups</h2>
          <ul>
            {backups?.map((backup: string) => <li key={backup}>{backup}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
