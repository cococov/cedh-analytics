/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
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
import { notFound } from 'next/navigation';
/* Vendor */
import { replace, split, pipe, any, pluck, flatten, has } from 'ramda';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
import MetagameCommanderPage from '@/components/metagameCommanderPage';
import type { PageData, ResponseData, StatsByCommander } from '@/components/metagameCommanderPage/types';
import fetchCards from '@/utils/fetch/cardData';
/* Static */
import STATS_BY_COMMANDER from '@/public/data/metagame/stats_by_commander.json';
import { server } from '@config';

type Params = { commanderName: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>,
}): Promise<Metadata> {
  const { commanderName } = await params;
  const decodedCommanderName = pipe(
    replace(/%2C/g, ','),
    replace(/%2F/g, '/'),
  )(decodeURI(String(commanderName)));

  const commanders = split(' / ', decodedCommanderName);
  const commanderNumber = commanders.length;
  const commandersData = await Promise.all(commanders.map(commander => fetchCards(String(commander))));
  const capitalizedCommanderNames = commanders.map(c => c.split(' ').map((w, i) => {
    if (i === 0) return w.charAt(0).toUpperCase() + w.slice(1);
    if (w === 'of' || w === 'the' || w === 'from') return w;
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ')).join(' / ');
  const description = `Metagame data for ${capitalizedCommanderNames} commander${commanderNumber > 1 ? 's' : ''}. | ${descriptionMetadata}`;

  return {
    title: `${capitalizedCommanderNames}`,
    description: description,
    openGraph: {
      ...openGraphMetadata,
      title: `${capitalizedCommanderNames} | cEDH Analytics`,
      description: description,
      images: [
        {
          url: commandersData[0].error ? '/' : commandersData[0].cardImage,
          width: 788,
          height: 788,
          alt: `${capitalizedCommanderNames} Image`,
        },
      ],
    },
    twitter: {
      ...twitterMetadata,
      title: `${capitalizedCommanderNames} | cEDH Analytics`,
      description: description,
      images: {
        url: commandersData[0].error ? '/' : commandersData[0].cardImage,
        alt: `${capitalizedCommanderNames} Image`,
      },
    },
  };
};

async function fetchData({ commanderName }: Params): Promise<ResponseData> {
  if (!commanderName) return { notFound: true };
  const decodedCommanderName = pipe(
    replace(/%2C/g, ','),
    replace(/%2F/g, '/'),
  )(String(commanderName));

  try {
    const commanders = split(' / ', decodedCommanderName);
    const commanderNumber = commanders.length;
    const commandersData = await Promise.all(commanders.map(commander => fetchCards(String(commander))));
    const capitalizedCommanderNames = commanders.map(c => c.split(' ').map((w, i) => {
      if (i === 0) return w.charAt(0).toUpperCase() + w.slice(1);
      if (w === 'of' || w === 'the' || w === 'from') return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' '));

    if (any(x => x.error, commandersData)) throw new Error('Fetch Error');
    if (!has('processed_decklists', (STATS_BY_COMMANDER as any)[decodedCommanderName])) throw new Error('Invalid commander stats');

    const commandersMetagameData = (STATS_BY_COMMANDER as StatsByCommander)[decodedCommanderName];

    return {
      commanderNumber,
      rawCommanderNames: decodedCommanderName,
      rawCommanderNamesBase64: btoa(decodedCommanderName),
      commandersIdentity: flatten(pluck('colorIdentity', commandersData)),
      commanderNames: capitalizedCommanderNames,
      cardImages: pluck('cardImage', commandersData),
      metagameData: {
        ...commandersMetagameData,
        avgCant: {
          creatures: commandersMetagameData.avgCantCreatures,
          artifacts: commandersMetagameData.avgCantArtifacts,
          lands: commandersMetagameData.avgCantLands,
          enchantments: commandersMetagameData.avgCantEnchantments,
          instants: commandersMetagameData.avgCantInstants,
          sorceries: commandersMetagameData.avgCantSorceries,
          battles: commandersMetagameData.avgCantBattles,
          planeswalkers: commandersMetagameData.avgCantPlaneswalkers,
        }
      },
      notFound: false,
    };
  } catch (err) {
    return { notFound: true };
  }
};

export default async function MetagameCommander({
  params
}: {
  params: Promise<{ commanderName: string }>
}) {
  const { commanderName } = await params;
  const response = await fetchData({ commanderName: decodeURI(String(commanderName)) });

  if (response.notFound) notFound();

  const data = response as PageData;

  return (
    <MetagameCommanderPage
      data={data}
      LastSetTop10UrlBase="/metagame-cards"
      cardsURL={`${server}/data/metagame/commanders_cards/${data.rawCommanderNamesBase64}.json`}
      tagsByCardURL={`${server}/data/cards/tags.json`}
    />
  );
};
