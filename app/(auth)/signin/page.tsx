'use client'

import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import axios from "axios"
import UserContext from "@/context/UserContext"

const Page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")

  const {user, setUser} = useContext(UserContext)

  const { toast } = useToast();
  const router = useRouter();
  
  const onSubmit = async ()=>{
    try {
        setIsSubmitting(true)
        const data = {
            username: username.toLowerCase(),
            password
        }
        const res = await axios.post("/api/signin", data)
    
        // console.log(res)
        setUser(res.data.data)

        toast({
            title: "Success",
            description: "LoggedIn successfully",
            variant: "default"
        })

        localStorage.setItem("username", res.data.data)

        if(res.data){
            router.replace("/home")
        }
    
    } catch (error) {
      console.log(error)
        toast({
            title: "Login Failed",
            description: "Incorrect credentials",
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
          <p className="mb-4">Sign in to Play with media.</p>
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
                </> : ("Sign In")
            }
        </Button>

        <div className="text-center mt-4">
          <p>
            Dont have an account?
            <Link href="/signup" className="text-blue-600 hover:text-blue-800"> Create Now </Link>
          </p>
        </div>
      </div>
      
    </div>
  )
}

export default Page