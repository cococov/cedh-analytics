"use server";
import { createKysely } from "@vercel/postgres-kysely";

export interface MetagameCardsTable {
  occurrences: number;
  card_name: string;
  decklists: any[];
  is_commander: boolean;
  is_in_99: boolean;
  percentage_of_use: number;
  percentage_of_use_by_identity: number;
  avg_win_rate: number;
  avg_draw_rate: number;
};

export interface DBCardsTable {
  occurrences: number;
  card_name: string;
  decklists: any[];
  is_commander: boolean;
  is_in_99: boolean;
  percentage_of_use: number;
  percentage_of_use_by_identity: number;
};

interface Database {
  metagame_cards: MetagameCardsTable;
  db_cards: DBCardsTable;
};

export default async function getDecklistsForCardByContext(
  selectedCard: string,
  table: 'metagame_cards' | 'db_cards',
) {
  const db = createKysely<Database>();

  let cardData = (await db
    .selectFrom(table)
    .where('card_name', '=', selectedCard)
    .select(['occurrences', 'decklists', 'percentage_of_use'])
    .execute())[0]

  return { occurrences: cardData.occurrences, percentage: cardData.percentage_of_use, decklists: cardData.decklists };
};
