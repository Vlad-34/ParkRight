import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

/**
 * Image card component to display an image with a timestamp and a prediction
 * It uses the Material UI library to display the card
 * @param imageUrl { string } url of the image to be displayed
 * @param timestamp { string } timestamp of the image
 * @param prediction { string } prediction of the image
 * @returns an image card component
 */
export default function ImageCard({
  imageUrl,
  timestamp,
  prediction,
}: {
  imageUrl: string;
  timestamp: string;
  prediction: string;
}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 140 }} image={imageUrl} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {prediction}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}
