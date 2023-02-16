import React from 'react';
import Image from 'next/image';
import styles from '../../styles/Carousel.module.css';

type Props = {
  images: string[];
  className?: string;
};

const Carousel: React.FC<Props> = ({ images, className }) => {
  return (
    <span className={className}>
      {
        images.map((image: string, index: number) => (
          <Image
            key={index}
            className={styles.image}
            src={image}
            layout="responsive"
            width={100}
            height={100}
            quality={100}
            priority
          />
        ))
      }
    </span>
  );
};

export default Carousel;
