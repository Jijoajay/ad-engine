import Content from '@/components/content/content'
import MainLayout from '@/layout/MainLayout'
import React from 'react'

const page = () => {
  return (
    <MainLayout>
        <section className='min-h-screen px-[5%] pt-[100px]'>
            <Content />
        </section>
    </MainLayout>
  )
}

export default page