import { RegisterForm } from '@/components/forms/RegisterForm'
import { getPatient, getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import { redirect } from 'next/navigation'


import React from 'react'

const Register =async ({params:{userId}}:SearchParamProps) => {
  

  
  const user = await getUser(userId);
  console.log(userId)
  const patient = await getPatient(userId);

  if (patient) redirect(`/patients/${userId}/new-appointment`);

  return (
    <div className="flex h-screen max-h-screen">

      <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
          src="/assets/icons/logo-full.svg"
          height={1000}
          width={1000}
          alt="Patient"
          className="mb-12 h-10 w-fit"
          />
          <RegisterForm user={user}/>
         
          <p className="justify-items-end text-dark-600 xl:text-left">
          © 2024 HertPulse(Pk)
          </p>
    
        </div>
        

      </section>
      <Image
      src="/assets/images/register-img.png"
      height={1000}
      width={1000}
      alt="Patient"
      className="side-img max-w-[390px]"
      />
    </div>
  )
}

export default Register
