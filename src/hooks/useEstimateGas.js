import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
import { useEthers } from "@usedapp/core";
import abi from "../global/abi.json";
import { mainnetContract } from "../global/constants";

export default function useEstimateGas() {
  const contractAbi = new Interface(abi);
  const { library } = useEthers();

  const mintGas = async (...args) => {
    const contract = new Contract(
      mainnetContract,
      contractAbi,
      library?.getSigner()
    );
    const estimatedGas = await contract.estimateGas.mint(...args);

    return estimatedGas;
  };

  return { mintGas };
}
