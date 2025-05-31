/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2025-present CoCoCov
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

import { Kysely } from 'kysely';

declare module '@/lib/db' {
  interface Database {
    cards: {
      card_name: string;
      card_type: string;
      cmc: number;
      color_identity: string;
      rarity: string;
      card_text: string;
      gatherer_id: number | null;
      average_price: number | null;
      is_reserved_list: boolean;
      card_image: string | null;
    };
    ban_list: {
      card_name: string;
      banned_date: Date;
    };
    metagame_cards: {
      card_name: string;
      count: number;
      percentage: number;
    };
    tournaments: {
      id: number;
      name: string;
      date: string;
      url: string;
      players: number;
    };
  }

  export function getTopCards(limit?: number, offset?: number): Promise<any[]>;
  export function getCardByName(cardName: string): Promise<any | null>;
  export function getCommandersByColor(colors: string[]): Promise<any[]>;
  export function getTournaments(): Promise<any[]>;
}
