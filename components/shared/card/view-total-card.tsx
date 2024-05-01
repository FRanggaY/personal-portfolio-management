'use client';

import { Card, CardContent, Typography } from "@mui/material";

const ViewTotalCard = ({ title, count }: { title: string, count: number }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>

        <Typography sx={{ marginTop: '10px' }} variant="h5" gutterBottom>
          {
            count}
        </Typography>

      </CardContent>
    </Card>
  )
}

export default ViewTotalCard
