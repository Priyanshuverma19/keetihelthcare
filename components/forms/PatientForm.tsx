
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form} from "@/components/ui/form"
import CustomForm, { FormFieldTypes } from "../ui/CustomForm"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"



export const PatientForm =()=> {
    const router =useRouter();
    const [isLoading,setIsLoading]=useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email:"",
      phone:"",
    },
  })

  // 2. Define a submit handler.
  const onSubmit=async (values: z.infer<typeof UserFormValidation>)=> {
    setIsLoading(true);
    
    try {
        const user={
        name: values.name,
        email: values.email,
        phone: values.phone,

        }
        console.log('before creatinf' ,user)
        const newUser = await createUser(user);
        console.log('new user',newUser)

        if (newUser) {
          router.push(`/patients/${newUser.$id}/register`);
        }
    } catch (error) {
       console.log(error) 
    }
    setIsLoading(false);
  }
  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi there 👋 </h1>
            <p className="text-dark-700">SChedule your first appointment.</p>

        </section>
      <CustomForm
      fieldType={FormFieldTypes.INPUT}
      control={form.control}
      name="name"
      label="full Name"
      placeholder="keerti verma"
      iconSrc="assets/icons/user.svg"
      iconAlt="user"
      />
       <CustomForm
      fieldType={FormFieldTypes.INPUT}
      control={form.control}
      name="email"
      label="Email"
      placeholder="keerti@gmail.com"
      iconSrc="assets/icons/email.svg"
      iconAlt="email"
      />

       <CustomForm
      fieldType={FormFieldTypes.PHONE_INPUT}
      control={form.control}
      name="phone"
      label="Phone number"
      placeholder="(888) 999-1111"
      />
      
        <SubmitButton isLoading={isLoading}>Get Start</SubmitButton> 
      </form>
    </Form>
  )
}


