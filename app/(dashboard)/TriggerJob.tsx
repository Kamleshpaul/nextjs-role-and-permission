'use client'

import { Button } from '@/components/ui/button'
import { processOrder, processUserNotification } from '@/server/actions/triggerJobs.action'
import React from 'react'

export default function TriggerJob() {
  return (
    <div className='flex flex-col gap-5 border-2 border-dashed p-3 border-black'>
      <Button variant={'destructive'} onClick={() => processOrder().then(res => null)}>Process Order</Button>
      <Button variant={'destructive'} onClick={() => processUserNotification().then(res => null)}>Notify User</Button>
    </div>
  )
}
