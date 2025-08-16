# 🟡 pkx

![pkx](/public/pkx.png)

## Building

Change the `postbuild` script copy command depending on the platform you're developing.

| OS      | Script                                                       |
| ------- | ------------------------------------------------------------ |
| Windows | `"postbuild": "powershell Copy-Item <source> <destination>"` |
| MacOS   | `"postbuild": "cp <source> <destination>"`                   |

## Sprites

All the sprites used are part of the [`PokeAPI/sprites`](https://github.com/PokeAPI/sprites).

| Style    | CDN                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------- |
| Default  | `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/1.png`                        |
| Official | `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/1.png` |
| Animated | `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/showdown/1.gif`         |
