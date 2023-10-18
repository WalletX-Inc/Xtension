type tokenCardParams = {
  tokenIcon:string;
  tokenName:string;
  tokenBalance:null | number;
  tokenSymbol:string;
}

const TokenCard = ({ tokenIcon, tokenName, tokenSymbol, tokenBalance }: tokenCardParams) => {
  return (
    <div className="flex border item-center py-2 px-3 gap-3 bg-gray-800 rounded-xl text-white border-gray-500 hover:bg-black mt-2">
      <img className="h-8" src={tokenIcon} alt="token icon" />
      <div className="flex justify-between w-full">
        <p className="font-semibold tracking-wide">{tokenName}</p>
        <p className="font-semibold tracking-wide">{tokenSymbol}</p>
        <p className="font-semibold">{tokenBalance}</p>
      </div>
    </div>
  );
};

export default TokenCard;
