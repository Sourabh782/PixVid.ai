'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import axios, { AxiosError } from "axios"

const Page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async ()=>{
    try {
        setIsSubmitting(true)
        const data = {
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password
        }
        const res = await axios.post("/api/signup", data)

        toast({
            title: "Account created",
            description: "Sign in to use PixVid.ai",
            variant: "default"
        })

        if(res.data){
            router.replace("/signin")
        }
    
    } catch (error: any) {
        console.log(error.response.data)
        const errMsg = error.response.data.message
        toast({
            title: "Login Failed",
            description: `${error.response.data.message}`,
            variant: "destructive"
        })
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join PixVid.ai</h1>
          <p className="mb-4">Sign up to enter PixVid.ai</p>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email :</Label>
            <Input type="email" id="email" placeholder="@email" onChange={(e)=>setEmail(e.target.value)} />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username :</Label>
            <Input type="text" id="username" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password :</Label>
            <Input type="password" id="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
        </div>

        <Button disabled={isSubmitting} onClick={onSubmit}>
            {
                isSubmitting ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </> : ("Sign Up")
            }
        </Button>

        <div className="text-center mt-4">
          <p>
            Already have account?
            <Link href="/signin" className="text-blue-600 hover:text-blue-800"> Sign In </Link>
          </p>
        </div>
      </div>
      
    </div>
  )
}

export default Page