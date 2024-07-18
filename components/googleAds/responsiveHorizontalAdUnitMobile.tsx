/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2024-present CoCoCov
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

"use client";

import React, { useEffect } from 'react';
import { concat } from 'ramda';

const isDevEnv = process.env.NODE_ENV !== 'production';

const initAd = () => {
  try {
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  } catch (error: any) {
    console.log(error.message);
  }
};

export default function ResponsiveHorizontalAdUnitMobile({
  slot
}: {
  slot: number
}) {

  useEffect(() => {
    initAd();
  });

  return (
    <span
      className={concat(
        'block md:hidden min-w-32 min-h-1 self-center',
        isDevEnv ? ' bg-orange-300' : ''
      )}
    >
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1605287259025910"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </span>
  );
}
