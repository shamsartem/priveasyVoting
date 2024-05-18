import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { PropsWithChildren } from "react";

export function PageWrapper(props: PropsWithChildren) {
  return (
    <div>
      <Box
        sx={(theme) => {
          return {
            width: "100%",
            backgroundImage:
              theme.palette.mode === "light"
                ? "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)"
                : "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
            backgroundRepeat: "no-repeat",
          };
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 14, sm: 20 },
            pb: { xs: 8, sm: 12 },
          }}
        >
          <Stack
            spacing={2}
            useFlexGap
            sx={{ width: { xs: "100%", sm: "70%" } }}
          >
            {props.children}
          </Stack>
        </Container>
      </Box>
    </div>
  );
}
