const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        screens: {
            sm: "640px",
            md: "1024px",
            lg: "1280px",
            xl: "1280px",
        },
    },
    plugins: [],
});
