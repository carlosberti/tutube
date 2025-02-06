// eslint-disable-next-line import/no-anonymous-default-export
export default {
  "src/**/*.{js,jsx,ts,tsx}": ["bun prettier --write", "bun eslint --fix"],
  "src/**/*.{json,css,md}": ["bun prettier --write"]
}
