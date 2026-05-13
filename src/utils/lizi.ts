// 示例比特币私钥和对应地址
export const EXAMPLE_DATA = {
  privateKey: "aa2950e7b08e4ca4cbb5dd15aed08889dc109abc38f663a750e1cc070b2961b7",
  addresses: {
    taproot: "bc1pm5l4tsatgsatpqlxsga50t7qnenpqcf4en9aj7k3x8rq0dfa705szxagyq",
    segwitCompatible: "34CMFufqmwRwQjHc6vgKDxczue3GsXdWTV",
    legacy: "1LXgjMAQAKCqscukXaTXdrYxUf8KBVLjnD",
    segwitNative: "bc1q6cuq3fnyus97tjc54m0fejsh68gl05zjj4wp0a"
  }
};

// 地址类型说明
export const ADDRESS_TYPES = {
  legacy: "Legacy (1开头)",
  segwitCompatible: "SegWit Compatible (3开头)",
  segwitNative: "SegWit Native (bc1q开头)",
  taproot: "Taproot (bc1p开头)"
};