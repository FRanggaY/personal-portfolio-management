"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { getAccessToken, login } from "@/actions/auth/auth-action"
import { useParams, useRouter } from "next/navigation"
import { FormSchema } from "@/schemas/auth"


export function AuthLoginForm() {
  const params = useParams<{ locale: string; }>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(true)
  const [loading, setLoading] = useState(false)

  const urlDashboard = `/${params.locale}/panel/dashboard`;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username_or_email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
   
    const message = await login(data);
    if (message === 'SUCCESS') {
      toast({
        title: "Success:",
        description: 'login successfully',
      })
      router.push(urlDashboard);
    } else {
      toast({
        title: "Error:",
        variant: 'destructive',
        description: message,
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    const handleLogin = async () => {
      const accessToken = await getAccessToken();
      if (accessToken) {
        router.push(urlDashboard); // Redirect if logged in
      }
    };

    handleLogin();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username_or_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Password</FormLabel>
              <div className="flex w-full items-center space-x-2">
                <FormControl>
                  <Input {...field} type={ showPassword ? 'password': 'text' } />
                </FormControl>
                <Button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeIcon
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeOffIcon
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>Submit</Button>
      </form>
    </Form>
  )
}
