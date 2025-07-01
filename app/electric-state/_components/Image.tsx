'use client'

import React, { useState } from 'react'

export interface FadeInImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  useSkeleton?: boolean
  imgRef?: React.Ref<HTMLImageElement>
}

export default function FadeInImage({ style, imgRef, ...rest }: FadeInImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <img
      {...rest}
      ref={imgRef}
      style={{ ...style, opacity: imageLoaded ? 1 : 0, transition: "opacity 2s cubic-bezier(0.4, 0, 0.2, 1)" }}
      onLoad={() => setImageLoaded(true)} />
  )
}
