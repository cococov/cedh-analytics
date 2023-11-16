CREATE TABLE cards (
  card_name                       varchar(128) UNIQUE,
  card_faces                      jsonb,
  color_identity                  varchar(6),
  colors                          varchar(6),
  cmc                             int,
  prices                          jsonb,
  reserved                        bool,
  multiple_printings              bool,
  last_print                      varchar(128),
  multiverse_ids                  jsonb,
  type                            varchar(128),
  type_line                       varchar(128),
  power                           int,
  toughness                       int,
  PRIMARY KEY (card_name)
);

CREATE TABLE metagame_cards (
  occurrences                     int,
  card_name                       varchar(128) UNIQUE,
  decklists                       jsonb,
  is_commander                    bool,
  is_in_99                        bool,
  percentage_of_use               decimal(5,2),
  percentage_of_use_by_identity   decimal(5,2),
  avg_win_rate                    decimal(6,4),
  avg_draw_rate                   decimal(6,4),
  PRIMARY KEY (card_name),
  CONSTRAINT fk_card FOREIGN KEY(card_name) REFERENCES cards(card_name)
);

CREATE TABLE db_cards (
  occurrences                     int,
  card_name                       varchar(128) UNIQUE,
  decklists                       jsonb,
  is_commander                    bool,
  is_in_99                        bool,
  percentage_of_use               decimal(5,2),
  percentage_of_use_by_identity   decimal(5,2),
  PRIMARY KEY (card_name),
  CONSTRAINT fk_card FOREIGN KEY(card_name) REFERENCES cards(card_name)
);

CREATE TABLE tags_by_card (
  card_name                       varchar(128) UNIQUE,
  tags                            varchar(640),
  PRIMARY KEY (card_name)
);


CREATE TABLE commander_cards (
  commander                       varchar(128),
  occurrences                     int,
  card_name                       varchar(128),
  decklists                       jsonb,
  is_commander                    bool,
  is_in_99                        bool,
  percentage_of_use               decimal(5,2),
  percentage_of_use_by_identity   decimal(5,2),
  avg_win_rate                    decimal(6,4),
  avg_draw_rate                   decimal(6,4),
  PRIMARY KEY (card_name, commander),
  UNIQUE (card_name, commander),
  CONSTRAINT fk_card FOREIGN KEY(card_name) REFERENCES cards(card_name)
);

CREATE TABLE tournament_cards (
  tournament                      varchar(128),
  occurrences                     int,
  card_name                       varchar(128),
  decklists                       jsonb,
  is_commander                    bool,
  is_in_99                        bool,
  percentage_of_use               decimal(5,2),
  percentage_of_use_by_identity   decimal(5,2),
  avg_win_rate                    decimal(6,4),
  avg_draw_rate                   decimal(6,4),
  PRIMARY KEY (card_name, tournament),
  UNIQUE (card_name, tournament),
  CONSTRAINT fk_card FOREIGN KEY(card_name) REFERENCES cards(card_name)
);