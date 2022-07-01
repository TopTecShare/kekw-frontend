import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
import abi from "../global/abi.json";
import { mainnetContract } from "../global/constants";
import { useCall, useContractFunction } from "@usedapp/core";

const contractAbi = new Interface(abi);
const contract = new Contract(mainnetContract, contractAbi);

export function useMint() {
  const { send, state } = useContractFunction(contract, "mint");
  return {
    mintState: state,
    mint: send,
  };
}

export function useTotalSupply() {
  const { value } =
    useCall({
      contract: contract,
      method: "totalSupply",
      args: [],
    }) ?? {};
  return value;
}

export function useMintCount(address) {
  const { value } =
    useCall({
      contract: contract,
      method: "mintCount",
      args: [address],
    }) ?? {};
  return value;
}

export function usePrice(sender, amount, proof = []) {
  const { value } =
    useCall({
      contract: contract,
      method: "price",
      args: [sender, amount, proof],
    }) ?? {};
  return value;
}
