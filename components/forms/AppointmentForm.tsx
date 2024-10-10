
"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState,Dispatch,SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SelectItem } from "../ui/select";
import { Doctors } from "@/constants";
import {
   createAppointment,
    updateAppointment
   } from "@/lib/actions/appointment.actions";
   import { getAppointmentSchema } from "@/lib/validation";
import "react-datepicker/dist/react-datepicker.css";
import CustomForm, { FormFieldTypes } from "../ui/CustomForm";
import SubmitButton from "../ui/SubmitButton";
import {Form} from "@/components/ui/form";

  import { Appointment } from "@/types/appwrite.types";
 


export const AppointmentForm =({
    userId,
    patientId,
    type ="create",
    appointment,
    setOpen,
}:{
    userId:string;
    patientId:string;
    type:"create"|"cancel"|"schedule";
    appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
})=> {
    const router =useRouter();
    const [isLoading,setIsLoading]=useState(false);
    const AppointmentFormValidation = getAppointmentSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
        primaryPhysician: appointment ? appointment?.primaryPhysician : "",
        schedule: appointment
          ? new Date(appointment?.schedule!)
          : new Date(Date.now()),
        reason: appointment ? appointment.reason : "",
        note: appointment?.note || "",
        cancellationReason: appointment?.cancellationReason || "",
        
    },
  })

  // 2. Define a submit handler.
  const onSubmit=async (values: z.infer<typeof AppointmentFormValidation>)=> {
    setIsLoading(true);
    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

  
    try {
        if (type === "create" && patientId) {
            const appointment = {
              userId,
              patient: patientId,
              primaryPhysician: values.primaryPhysician,
              schedule: new Date(values.schedule),
              reason: values.reason!,
              status: status as Status,
              note: values.note,
            };
    
            const newAppointment = await createAppointment(appointment);
    
            if (newAppointment) {
              form.reset();
              router.push(
                `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
              );
            }
          } else {
            const appointmentToUpdate = {
              userId,
              appointmentId: appointment?.$id!,
              appointment: {
                primaryPhysician: values.primaryPhysician,
                schedule: new Date(values.schedule),
                status: status as Status,
                cancellationReason: values.cancellationReason,
              
              },
              type,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            
            }
            const updatedAppointment = await updateAppointment(appointmentToUpdate);

            if (updatedAppointment) {
              setOpen && setOpen(false);
              form.reset();
            }
          }
          
       
    } catch (error) {
       console.log(error) 
    }
    setIsLoading(false);
  }
  let buttonLable;
  switch (type) {
    case 'cancel':
        buttonLable='Cancel Appointment'
        
        break;
    case 'schedule':
       buttonLable='Schedule Appointment'
            
        break;

    default:
       buttonLable='Submit Appointment'
        break;
  }
  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      {
        type ==="create"&&(
            <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds</p>

        </section>
        )
      }
      
{
    type !== "cancel" &&(
        <>
       <CustomForm
            fieldType={FormFieldTypes.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Docter"
            placeholder="Select a doctor"
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
          <CustomForm
          fieldType={FormFieldTypes.DATE_PICKER}
          control={form.control}
          name="schedule"
          label="Expected appointment date"
          showTimeSelect
          dateFormat="MM/dd/yyyy -h-mm-aa"
          >
          </CustomForm>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomForm
            fieldType={FormFieldTypes.TEXTAREA}
            control={form.control}
            name="reason"
            label="Reason for appointment"
            placeholder="Enter reason for appointment"
            >

            </CustomForm>
            <CustomForm
            fieldType={FormFieldTypes.TEXTAREA}
            control={form.control}
            name="notes"
            label="Notes"
            placeholder="Enter notes"
            >

            </CustomForm>

          </div>

        </>
    )}

   {type === "cancel" && (
   
      <CustomForm
      fieldType={FormFieldTypes.TEXTAREA}
      control={form.control}
      name="cancellationReason"
      label="Reason for cancellation"
      placeholder="Enter reason for cancellation"
      >

      </CustomForm>
)}

      
        <SubmitButton isLoading={isLoading} className={`${type ==="cancel" ? 'shad-danger-btn':'shad-primary-btn'} w-full`}>{buttonLable}</SubmitButton> 
      </form>
    </Form>
  )
}


