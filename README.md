![pkx](/public/pkx.png)

# 🟡 pkx

A mobile-first PWA Pokédex. Live at [pkx.surge.sh](https://pkx.surge.sh).

## Getting started

**Prerequisites:** Node.js 20+, Angular CLI 21+

```bash
npm install
npm start        # dev server on http://localhost:4200
```

## Build & deploy

```bash
npm run deploy   # build + deploy to pkx.surge.sh
```

The `postbuild` script copies `index.html` to `200.html` and `404.html` for Surge's SPA routing. Adjust the copy command for your OS:

| OS      | Script                                                       |
| ------- | ------------------------------------------------------------ |
| Windows | `"postbuild": "powershell Copy-Item <source> <destination>"` |
| macOS   | `"postbuild": "cp <source> <destination>"`                   |

## Sprites

All sprites are from [`PokeAPI/sprites`](https://github.com/PokeAPI/sprites), served via jsDelivr.

| Style    | CDN                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------- |
| Default  | `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/1.png`                        |
| Official | `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/1.png` |
| Animated | `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/showdown/1.gif`         |
