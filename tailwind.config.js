/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    container:{
      center:true
    },
    

    fontFamily: {
      FONT_VIGA: ["IBM Plex Sans", "system-ui", "sans-serif"],
      FONT_ROBOTO: ["IBM Plex Sans", "system-ui", "sans-serif"],
      FONT_SALSA: ["Big Shoulders Display", "Arial Narrow", "sans-serif"],
      ANTON: ["Big Shoulders Display", "Arial Narrow", "sans-serif"],
    },
    extend: {
      borderRadius: { lg: "6px", xl: "8px", "2xl": "8px", "3xl": "8px" },
      colors: {
        PRIMARY_BLACK:"#1b1a18",
        SECONDARY_BLACK: "#121110",
        BLACK:"#0d0c0b",
        PRIMARY_WHITE: "#ece7dc",
        SECONDARY_WHITE:"#f7f6f2",
        PRIMARY_BLUE:"#27a3bb",
        SECONDARY_BLUE:"#3fc5dc",
        DARK_BLUE:"#242220",
        LIGHT_BLUE:"#e7e4dc",
        PRIMARY_ORANGE:"#f2b01e",
        SECONDARY_ORANGE: "#f7cc6a",
        PRIMARY_RED:"#d9503a",
        SECONDARY_RED: "#f27d68",
        PRIMARY_GRAY:"#8a8478",
        SECONDARY_GRAY: "#a29c90",
        SECONDARY_GREEN: "#7ccf9e",
        LIGHT_GRAY:"#34312c",
        DARK_GRAY:"#4a463f",
        SECONDARY_TOW_GRAY:"#fbfbfd",
        DARK_SLATE:"#0f172a"
      },
    },

  },
  plugins: [],
}