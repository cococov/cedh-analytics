import type { Metadata } from 'next';
import Link from 'next/link';
import Image from "next/image";
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../shared-metadata';
/* Static */
import styles from '../../styles/Glossary.module.css';
import FranticSearch from '../../public/images/frantic_search.jpg';

export const metadata: Metadata = {
  title: 'cEDH Glossary',
  description: `List of the most used concepts in cEDH and their meaning. | ${descriptionMetadata}`,
  openGraph: {
    ...openGraphMetadata,
    title: 'cEDH Glossary | cEDH Analytics',
    images: [
      {
        url: '/images/frantic_search.jpg',
        width: 788,
        height: 788,
        alt: 'Frantic Search',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `About | ${twitterMetadata.title}`,
    description: `List of the most used concepts in cEDH and their meaning. | ${twitterMetadata.description}`,
    images: {
      url: '/images/frantic_search.jpg',
      alt: 'Frantic Search',
    },
  },
};

export default async function Cards() {
  return (
    <h1 style={{height: '100dvh'}}>Not Implemented</h1>
  );
};
