"""
cEDH Analytics - A website that analyzes and cross-references several
EDH (Magic: The Gathering format) community's resources to give insights
on the competitive metagame.
Copyright (C) 2023-present CoCoCov

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

class CardTuple(typing.TypedDict):
  card_name: str
  card_faces: str
  color_identity: str
  colors: str
  cmc: int
  prices: str
  reserved: bool
  multiple_printings: bool
  last_print: str
  multiverse_ids: str
  type: str
  type_line: str
  power: typing.Optional[int]
  toughness: typing.Optional[int]

class MetagameCardTuple(CardTuple):
  occurrences: int
  card_name: str
  decklists: str
  is_commander: bool
  is_in_99: bool
  is_legal: bool
  percentage_of_use: float
  percentage_of_use_by_identity: float
  avg_win_rate: float
  avg_draw_rate: float

class DbCardTuple(CardTuple):
  occurrences: int
  card_name: str
  decklists: str
  is_commander: bool
  is_in_99: bool
  is_legal: bool
  percentage_of_use: float
  percentage_of_use_by_identity: float

class TagsByCardTuple(typing.TypedDict):
  card_name: str
  tags: str
