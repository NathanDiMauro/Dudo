module.exports = {
  plugins: [],
  theme: {
    extend: {
          colors: {
            "dark-felt": "#012626",
            "felt": "#027368",
            "light-felt": "#0AA696",
            "cue": "#D9D5A3",
            "billiards-wood": "#846B51",
            "aqua": "#2A9D8F"
          }

    }
  },
  content: ["./index.html", './src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {},
  },
  darkMode: false, // or 'media' or 'class'
}
