"""
cEDH Analytics - A website that analyzes and cross-references several
EDH (Magic: The Gathering format) community's resources to give insights
on the competitive metagame.
Copyright (C) 2025-present CoCoCov

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Original Repo: https://github.com/cococov/cedh-analytics
https://www.cedh-analytics.com/
"""

import typing
from typing import Optional, List, Dict, Any, Literal, Union

class ImageUris(typing.TypedDict, total=False):
    small: str
    normal: str
    large: str
    png: str
    art_crop: str
    border_crop: str

class CardFace(typing.TypedDict, total=False):
    artist: str
    cmc: float
    color_indicator: List[str]
    colors: List[str]
    flavor_text: str
    illustration_id: str
    image_uris: ImageUris
    loyalty: str
    mana_cost: str
    name: str
    oracle_id: str
    oracle_text: str
    power: str
    printed_name: str
    printed_text: str
    printed_type_line: str
    toughness: str
    type_line: str
    watermark: str

class RelatedCard(typing.TypedDict, total=False):
    id: str
    object: str
    component: str
    name: str
    type_line: str
    uri: str

class Legalities(typing.TypedDict, total=False):
    standard: str
    future: str
    historic: str
    gladiator: str
    pioneer: str
    explorer: str
    modern: str
    legacy: str
    pauper: str
    vintage: str
    penny: str
    commander: str
    oathbreaker: str
    brawl: str
    historicbrawl: str
    alchemy: str
    paupercommander: str
    duel: str
    oldschool: str
    premodern: str
    predh: str

class Prices(typing.TypedDict, total=False):
    usd: Optional[str]
    usd_foil: Optional[str]
    usd_etched: Optional[str]
    eur: Optional[str]
    eur_foil: Optional[str]
    tix: Optional[str]

class PurchaseUris(typing.TypedDict, total=False):
    tcgplayer: str
    cardmarket: str
    cardhoarder: str

class RelatedUris(typing.TypedDict, total=False):
    gatherer: str
    tcgplayer_infinite_articles: str
    tcgplayer_infinite_decks: str
    edhrec: str

class Card(typing.TypedDict, total=False):
    # Core Card Fields
    id: str
    oracle_id: str
    multiverse_ids: List[int]
    mtgo_id: int
    mtgo_foil_id: int
    tcgplayer_id: int
    cardmarket_id: int
    name: str
    lang: str
    released_at: str
    uri: str
    scryfall_uri: str
    layout: str
    highres_image: bool
    image_status: str
    image_uris: ImageUris

    # Gameplay Fields
    mana_cost: str
    cmc: float
    type_line: str
    oracle_text: str
    power: str
    toughness: str
    colors: List[str]
    color_identity: List[str]
    keywords: List[str]
    all_parts: List[RelatedCard]
    card_faces: List[CardFace]
    legalities: Legalities

    # Print Fields
    reserved: bool
    foil: bool
    nonfoil: bool
    finishes: List[str]
    oversized: bool
    promo: bool
    reprint: bool
    variation: bool
    set_id: str
    set: str
    set_name: str
    set_type: str
    set_uri: str
    set_search_uri: str
    scryfall_set_uri: str
    rulings_uri: str
    prints_search_uri: str
    collector_number: str
    digital: bool
    rarity: str
    flavor_text: str
    card_back_id: str
    artist: str
    artist_ids: List[str]
    illustration_id: str
    border_color: str
    frame: str
    frame_effects: List[str]
    security_stamp: str
    full_art: bool
    textless: bool
    booster: bool
    story_spotlight: bool

    # Retail Fields
    edhrec_rank: int
    penny_rank: int
    prices: Prices
    related_uris: RelatedUris
    purchase_uris: PurchaseUris


class SearchResponse(typing.TypedDict, total=False):
    data: List[Card]
    has_more: bool
    next_page: str
    object: str
    total_cards: int
