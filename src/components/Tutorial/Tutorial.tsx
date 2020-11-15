import React from 'react'
import SimpleImageSlider from 'react-simple-image-slider'

import { Props } from './types'

import './Tutorial.css'

export default function CustomTransaction({ onClose }: Props) {
  const images = [
    { url: 'resources/images/metamask_1.png' },
    { url: 'resources/images/metamask_2.png' },
    { url: 'resources/images/metamask_3.png' },
    { url: 'resources/images/metamask_4.png' },
    { url: 'resources/images/metamask_5.png' },
  ]

  return (
    <div className="tutorial">
      <button onClick={onClose}>Close</button>
      <SimpleImageSlider
        width={360}
        height={600}
        images={images}
        showBullets={true}
        showNavs={true}
      />
    </div>
  )
}
