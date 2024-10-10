
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {Form, FormControl} from "@/components/ui/form"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { SelectItem } from "../ui/select"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { registerPatient } from "@/lib/actions/patient.actions"
import { PatientFormValidation } from "@/lib/validation"
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";

import CustomForm, { FormFieldTypes } from "../ui/CustomForm"
import SubmitButton from "../ui/SubmitButton"

import { FileUploader } from "../FileUploader"




export const RegisterForm =({user}:{user:User})=> {
    const router =useRouter();
    const [isLoading,setIsLoading]=useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
        ...PatientFormDefaultValues,
      name: "",
      email:"",
      phone:"",
    },
  })

  // 2. Define a submit handler.
  const onSubmit=async (values: z.infer<typeof PatientFormValidation>)=> {
    setIsLoading(true);
   

    let formData;
        // Store file info in form data as
       
        if (
          values.identificationDocument &&
          values.identificationDocument?.length > 0
        ) {
          const blobFile = new Blob([values.identificationDocument[0]], {
            type: values.identificationDocument[0].type,
          });
    
          formData = new FormData();
          formData.append("blobFile", blobFile);
          formData.append("fileName", values.identificationDocument[0].name);
        }
    
    try {
     
        const patient = {
            userId: user.$id,
            name: values.name,
            email: values.email,
            phone: values.phone,
            birthDate: new Date(values.birthDate),
            gender: values.gender,
            address: values.address,
            occupation: values.occupation,
            emergencyContactName: values.emergencyContactName,
            emergencyContactNumber: values.emergencyContactNumber,
            primaryPhysician: values.primaryPhysician,
            allergies: values.allergies,
            currentMedication: values.currentMedication,
            identificationType: values.identificationType,
            identificationNumber: values.identificationNumber,
            identificationDocument: values.identificationDocument
              ? formData
              : undefined,
            privacyConsent: values.privacyConsent,
          };
    
          const newPatient = await registerPatient(patient);
    
          if (newPatient) {
            router.push(`/patients/${user.$id}/new-appointment`);
          }

     
    } catch (error) {
       console.log(error) 
    }
    setIsLoading(false);
  }
  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className=" space-y-4">
            <h1 className="header">Welcome👋 </h1>
            <p className="text-dark-700">Let us know more about yourself.</p>

        </section>
        <section className=" space-y-6">
            <div className="mb-9 space-y-1">
            <h2 className="sub-heder">Personal Information</h2>

            </div>

      <CustomForm
      fieldType={FormFieldTypes.INPUT}
      control={form.control}
      name="name"
      label="Full Name"
      placeholder="keerti verma"
      iconSrc="/assets/icons/user.svg"
      iconAlt="user"
      />
      <div className="flex flex-col gap-6 xl:flex-row">
      <CustomForm
      fieldType={FormFieldTypes.INPUT}
      control={form.control}
      name="email"
      label="Email"
      placeholder="keerti@gmail.com"
      iconSrc="/assets/icons/email.svg"
      iconAlt="email"
      />

       <CustomForm
      fieldType={FormFieldTypes.PHONE_INPUT}
      control={form.control}
      name="phone"
      label="Phone number"
      placeholder="(888) 999-1111"
      />
      


      </div>
      <div className="flex flex-col gap-6 xl:flex-row">
      <CustomForm
      fieldType={FormFieldTypes.DATE_PICKER}
      control={form.control}
      name="birthdate"
      label="Date of Birth"
      placeholder="priyanshu@gmail.com"
      iconSrc="/assets/icons/email.svg"
      iconAlt="email"
      />

       <CustomForm
      fieldType={FormFieldTypes.SKELETON}
      control={form.control}
      name="gender"
      label="Gender"
     renderSkeleton={(field)=>
        <FormControl>
            <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                onValueChange={field.onChange}
                defaultValue={field.value}
              
                >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}


            </RadioGroup>

        </FormControl>
     }
      />

      </div>
         {/* Address & Occupation */}
         <div className="flex flex-col gap-6 xl:flex-row">
            <CustomForm
              fieldType={FormFieldTypes.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14 street,Gola -262802"
            />

            <CustomForm
              fieldType={FormFieldTypes.INPUT}
              control={form.control}
              name="occupation"
              label="Occupation"
              placeholder="Medical"
            />
          </div>

             {/* Emergency Contact Name & Emergency Contact Number */}
             <div className="flex flex-col gap-6 xl:flex-row">
            <CustomForm
              fieldType={FormFieldTypes.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Guardian's name"
            />

            <CustomForm
              fieldType={FormFieldTypes.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency contact number"
              placeholder="(555) 123-4567"
            />
          </div>

          </section>


          <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>

          {/* PRIMARY CARE PHYSICIAN */}
          <CustomForm
            fieldType={FormFieldTypes.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomForm>

         

          {/* ALLERGY & CURRENT MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomForm
              fieldType={FormFieldTypes.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen"
            />

            <CustomForm
              fieldType={FormFieldTypes.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Current medications"
              placeholder="dolo 200mg, citizin 50mcg"
            />
          </div>

         
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>

          <CustomForm
            fieldType={FormFieldTypes.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type"
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomForm>

          <CustomForm
            fieldType={FormFieldTypes.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />

          <CustomForm
            fieldType={FormFieldTypes.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomForm
            fieldType={FormFieldTypes.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomForm
            fieldType={FormFieldTypes.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomForm
            fieldType={FormFieldTypes.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>

       

       
      
        <SubmitButton isLoading={isLoading}>Get Start</SubmitButton> 
      </form>
    </Form>
  )
}


