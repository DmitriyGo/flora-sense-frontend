import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
import { PasswordInput } from '../ui/password-input';

import { getRoles, login } from '@/lib/auth';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

const SignIn = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit({ email, password }: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await login(email, password);
      await getRoles();
      toast.success('Successfully signed in', {});
      navigate('/');
    } catch {
      console.log('catch');
      toast.error('Wrong email or password', {});
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center max-w-[40%] mx-auto mt-32 gap-8">
      <h2 className="text-5xl font-semibold">SignIn</h2>
      <div className="border p-4 rounded-xl w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      placeholder="user@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className="text-base"
                      placeholder="password"
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

export default SignIn;
