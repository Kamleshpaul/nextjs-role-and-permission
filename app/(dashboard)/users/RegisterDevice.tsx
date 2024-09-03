'use client';
import { Button } from '@/components/ui/button';
import { getRegistrationOptions, registerDevice } from '@/server/actions/webauth.action';
import { startRegistration } from '@simplewebauthn/browser';
import { useState } from 'react';
import { toast } from 'react-toastify';


export default function RegisterDevice() {

  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterCurrentDevice = async () => {
    setIsLoading(true)
    try {

      const options = await getRegistrationOptions();
      if (!options) {
        return toast.error('Something went wrong.');
      }

      const registration = await startRegistration(options)
      const registerDeviceResponse = await registerDevice(registration, options.challenge)

      if (!registerDeviceResponse.status) {
        toast.error(registerDeviceResponse.message)
        return;
      }
      toast.success(registerDeviceResponse.message);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)

    }

  };


  return (
    <Button
      disabled={isLoading}
      onClick={handleRegisterCurrentDevice}>
      {isLoading ? 'Registering' : 'Register Current Device'}
    </Button>
  )

}