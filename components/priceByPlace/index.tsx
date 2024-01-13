"use client";

import { useContext } from 'react';
/* Vendor */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
/* Own */
import TournamentInfoContext from '@/contexts/tournamentInfoStore';

export default function PriceByPlace({
  image,
  place,
  name,
  info,
  isCard,
  small
}: {
  image: string,
  place: string,
  name: string,
  info: string,
  isCard?: boolean,
  small?: boolean,
}) {
  const { isSmallScreen } = useContext(TournamentInfoContext);

  return (
    <Card sx={{ maxWidth: 345, margin: '1rem', boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 15%), 0px 1px 1px 0px rgb(0 0 0 / 10.5%), 0px 1px 3px 0px rgb(0 0 0 / 9%)' }}>
      <CardActionArea href={isCard ? `/db-cards/${name}` : ''} disabled={!isCard}>
        <CardMedia
          component="img"
          image={image}
          alt={name}
          height={(small && !isSmallScreen) ? '172' : '380'}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {place}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {info}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
