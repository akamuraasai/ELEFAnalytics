const rarityKey = [
  '',
  'oneStar',
  'twoStars',
  'threeStars',
  'fourStars',
  'fiveStars',
  'sixStars',
];

const dataGenerator = async (date = '08-02-22') => {
  const dataResult = await fetch(`https://raw.githubusercontent.com/akamuraasai/ELEFAnalytics/master/data/data-${date}.json`);
  const minersResult = await fetch(`https://raw.githubusercontent.com/akamuraasai/ELEFAnalytics/master/data/minersByWallet-${date}.json`);
  const data = await dataResult.json();
  const minersByWallet = await minersResult.json();
  const numberOfPlayers = Object.keys(minersByWallet).length;
  const numberOfNFTs = data.length;

  // quem tem mais mineiros? e quantos tem?
  // ========================================================================================
  const sortedByWalletNFTQuantity = Object.keys(minersByWallet).map((key) => {
    const miners = minersByWallet[key];

    return { wallet: key, miners };
  }).sort((a, b) => b.miners.length - a.miners.length);
  // ========================================================================================

  // quem já farmou mais LF? e quanto foi?
  // ========================================================================================
  const sortedByMinedQuantity = Object.keys(minersByWallet).map((key) => {
    const miners = minersByWallet[key];
    const totalMined = miners.reduce((total, miner) => total + miner.totalMined, 0);

    return { wallet: key, miners, totalMined };
  }).sort((a, b) => b.totalMined - a.totalMined);
  // ========================================================================================

  // quem tem mais mineiros raros?
  // ========================================================================================
  const sortedByNFTRarityQuantity = Object.keys(minersByWallet).map((key) => {
    const miners = minersByWallet[key];
    const sixStar = miners.filter((miner) => miner.rarity === 6).length;
    const fiveStar = miners.filter((miner) => miner.rarity === 5).length;
    const fourStar = miners.filter((miner) => miner.rarity === 4).length;

    return { wallet: key, miners, sixStar, fiveStar, fourStar };
  }).sort((a, b) => b.fiveStar - a.fiveStar);
  // ========================================================================================

  // quantas contas tem pelo menos 10 mineiros?
  // ========================================================================================
  const numberOfFullLandWallets = Object.keys(minersByWallet).reduce((total, key) => {
    const miners = minersByWallet[key];

    return miners.length >= 10 ? total + 1 : total;
  }, 0);
  // ========================================================================================

  // quantos LF já foi minado no total?
  // ========================================================================================
  const totalMinedLF = data.reduce((total, miner) => {
    const totalMined = miner?.totalMined;

    return total + totalMined;
  }, 0);
  // ========================================================================================

  // quantos mineiros de cada raridade já saíram?
  // ========================================================================================
  const totalNFTByRarity = data.reduce((obj, miner) => {
    const rarity = miner?.rarity;
    const key = rarityKey[rarity];

    return {
      ...obj,
      [key]: obj[key] + 1,
    };
  }, { sixStars: 0, fiveStars: 0, fourStars: 0, threeStars: 0, twoStars: 0, oneStar: 0 });
  // ========================================================================================

  return {
    numberOfPlayers,
    numberOfNFTs,
    sortedByWalletNFTQuantity,
    sortedByMinedQuantity,
    sortedByNFTRarityQuantity,
    numberOfFullLandWallets,
    totalMinedLF,
    totalNFTByRarity,
  };
};

export default dataGenerator;
