import React from 'react'

interface coloryTextProps {
  title: string
}

export const ColorlyText = ({ title }: coloryTextProps) => {
  return (
    <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#8236D4_40%,#2E65E5_100%)]">
      {title}
    </span>


  )
}
