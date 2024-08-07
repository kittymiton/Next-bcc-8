"use client";

import { createTheme } from "@mui/material/styles";

// TODO そもそも.Mui-selectedが適用されてない
export const theme = createTheme({
  palette: {
    action: {
      selected: "rgba(25, 118, 210, 0.08)", // デフォルトの薄い水色
    },
  },
});
