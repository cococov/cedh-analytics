/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2024-present CoCoCov-Aufban
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  Original Repo: https://github.com/cococov/cedh-analytics
 *  https://www.cedh-analytics.com/
 */

import type { Metadata } from 'next';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
/* Static */
import styles from '@/styles/Privacy.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy | ${descriptionMetadata}`,
  robots: { index: false, follow: false },
  openGraph: {
    ...openGraphMetadata,
    title: 'Privacy Policy | cEDH Analytics',
    images: [
      {
        url: '/images/carrot_compost_playmat.jpeg',
        width: 788,
        height: 443,
        alt: 'Carrot Compost Playmat',
      },
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: `Privacy Policy | ${twitterMetadata.title}`,
    description: `Privacy Policy | ${twitterMetadata.description}`,
    images: {
      url: '/images/carrot_compost_playmat.jpeg',
      alt: 'Carrot Compost Playmat',
    },
  },
};

export default async function Privacy() {
  return (
    <main className={styles.privacy}>
      <h1>Privacy Policy</h1>
      <span><b>Last Updated:</b> Jul 10, 2024</span>
      <h2>Introduction</h2>
      <p>
        Welcome to cEDH Analytics (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href='https://www.cedh-analytics.com'>https://www.cedh-analytics.com</a> (the &quot;Site&quot;). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
      </p>
      <h2>Information We Collect</h2>
      <p>
        Since our website does not require registration, login, or form submission, we do not collect personal data such as your name, email address, or contact information directly from you. However, we may collect certain information automatically:
      </p>
      <ul>
        <li>
          <span><b>Cookies and Tracking Technologies:</b> We use cookies and similar tracking technologies to track the activity on our Site and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.</span>
        </li>
        <li>
          <span><b>Usage Data:</b> We may collect information on how the Site is accessed and used. This Usage Data may include information such as your computer&apos;s Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.</span>
        </li>
      </ul>
      <h2>Use of Your Information</h2>
      <p>
        We use the information we collect in the following ways:
      </p>
      <ul className={styles.decoratedLu}>
        <li>To provide, operate, and maintain our Site.</li>
        <li>To improve, personalize, and expand our Site.</li>
        <li>To understand and analyze how you use our Site.</li>
        <li>To develop new services, features, and functionality.</li>
      </ul>
      <h2>Disclosure of Your Information</h2>
      <p>
        We will never sell, rent, or lease your information to 3rd parties.
      </p>
      <h2>Security</h2>
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
      </p>
    </main>
  );
};
