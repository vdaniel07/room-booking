import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { useTheme } from "@mui/material/styles";
import {
  Stack,
  Card,
  Box,
  CardContent,
  Typography,
  alpha,
} from "@mui/material";

export default function Home({ navArrayLinks }) {
  const theme = useTheme();
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        minHeight="calc(100vh - 200px)"
      >
        {navArrayLinks.map((item) => (
          <Card
            sx={{
              minWidth: 300,
              textDecoration: "none",
              ":hover": {
                boxShadow: 10,
              },
              background: alpha(theme.palette.primary.main, 0.5),
            }}
            key={item.title}
            component={Link}
            to={item.path}
          >
            <CardContent sx={{ m: 5 }}>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Box sx={{ justifyContent: "center" }} color="text.secondary">
                  {item.icon("large")}
                </Box>
                <Typography variant="h4" color="text.secondary">
                  {item.title}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  );
}

Home.propTypes = {
  navArrayLinks: PropTypes.array.isRequired,
};
