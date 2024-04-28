"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CreateSkillAuthLoginFormSchema } from "@/schemas/skill"
import { toast } from "@/components/ui/use-toast"
import { addSkill } from "@/actions/skill/skill-action"


export function CreateSkillForm() {
  const params = useParams<{ locale: string; }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  const form = useForm<z.infer<typeof CreateSkillAuthLoginFormSchema>>({
    resolver: zodResolver(CreateSkillAuthLoginFormSchema),
    defaultValues: {
      code: "",
      name: "",
      website_url: "",
      category: "",
      logo: "",
      image: "",
    },
  })

  async function onSubmit(data: z.infer<typeof CreateSkillAuthLoginFormSchema>) {
    setLoading(true);

    const formData = new FormData();
    formData.append('code', `${data.code}`);
    formData.append('name', `${data.name}`);
    formData.append('website_url', `${data.website_url}`);
    formData.append('category', `${data.category}`);
    if(selectedImage){
      formData.append('image', selectedImage);
    }
    if(selectedLogo){
      formData.append('logo', selectedLogo);
    }

    const message = await addSkill(formData);
    if (message === 'SUCCESS') {
      toast({
        title: "Success:",
        description: 'create skill successfully',
      })
      location.reload();
    } else {
      toast({
        title: "Error:",
        variant: 'destructive',
        description: message,
      })
    }

    setLoading(false)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }else{
      setSelectedImage(null);
      setImageUrl('');
    }
  };
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }else{
      setSelectedLogo(null);
      setLogoUrl('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-80 lg:h-[800px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Skill</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={handleImageChange} />
                  </FormControl>
                    {imageUrl && (
                      <img src={imageUrl} alt="Selected" style={{ maxWidth: '100%', marginTop: '1rem' }} />
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={handleLogoChange} />
                  </FormControl>
                    {logoUrl && (
                      <img src={logoUrl} alt="Selected" style={{ maxWidth: '100%', marginTop: '1rem' }} />
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
