import { useState, useEffect, useRef, useMemo } from "react";
import { Fade } from "react-reveal";
import { toast } from "react-toastify";
import BeatLoader from "react-spinners/BeatLoader";
import WalletConnectionModal from "./components/walletmodal";
import { useEthers } from "@usedapp/core";
import { intervalToDuration } from "date-fns";
import {
  useMint,
  useTotalSupply,
  useMintCount,
  usePrice,
} from "./hooks/useFunctions";
import useEstimateGas from "./hooks/useEstimateGas";
import { mainnetContract } from "./global/constants";
import "./App.css";

import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

function App() {
  let whitelistAddress = [
    "0xbD3CCC7fce553EA4574403A37Ccf94582CA3b0E1",
    "0x84dC3058bFF56c0a4F117E3fb4d7A4CFBC499471 ",
    "0x49BF39b88dF78c099624A25Da9130FDf1Dd81A1C",
    "0x87bb4ddBE31Aaf1C6706e3d7974a22D1fc9A3e71",
    "0xE8A3399A9C8527c6e2514A9176BB8Db9250545B8",
    "0xEaC458B2F78b8cb37c9471A9A0723b4Aa6b4c62D",
  ];

  const leafNodesWhitelist = whitelistAddress.map(keccak256);
  const merkleTreeWhiteList = new MerkleTree(leafNodesWhitelist, keccak256, {
    sortPairs: true,
  });

  function getWhitelistHexProofFromAddrs(addressToCheck) {
    const addressHash = keccak256(addressToCheck);
    const hexProof = merkleTreeWhiteList.getHexProof(addressHash);

    return hexProof;
  }

  const [wallet, setWallet] = useState(false);
  const { account } = useEthers();
  const proof = useMemo(
    () => getWhitelistHexProofFromAddrs(account),
    [account]
  );
  const mintCount = useMintCount(account);
  const [count, setCount] = useState(0);
  const totalSupply = useTotalSupply();
  const price = usePrice(account, count, proof);
  const { mintState, mint } = useMint();
  const { mintGas } = useEstimateGas();
  const intervalRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const convertToDuration = (startDate, endDate) => {
    const formatNumber = (number) =>
      !number || number < 10 ? `0${number}` : number;
    const { days, hours, minutes, seconds } = intervalToDuration({
      start: new Date(startDate * 1000),
      end: new Date(endDate * 1000),
    });

    return {
      days: formatNumber(days),
      hours: formatNumber(hours),
      minutes: formatNumber(minutes),
      seconds: formatNumber(seconds),
    };
  };

  const toastMsg = (state) => {
    if (state.status === "PendingSignature")
      toast.info("Waiting for signature", {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      });

    if (state.status === "Exception")
      toast.warning("User denied signature", {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      });

    if (state.status === "Mining")
      toast.info("Pending transaction", {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      });

    if (state.status === "Success")
      toast.success("Successfully confirmed", {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      });
  };

  useEffect(() => {
    if (mintCount && mintCount < 5)
      setCount(Math.min(Math.max(count, 1), 5 - mintCount));
    else setCount(0);
  }, [count, mintCount]);

  useEffect(() => {
    toastMsg(mintState);
  }, [mintState]);

  useEffect(() => {
    if (!intervalRef.current) {
      intervalRef.current = window.setInterval(
        () => setCurrentTime(Math.floor(new Date().getTime() / 1000)),
        1000
      );
    }
    return () => {
      clearInterval(Number(intervalRef.current));
    };
  }, []);

  useEffect(() => {
    const { days, hours, minutes, seconds } = convertToDuration(
      currentTime,
      1656745922
    );
    setDay(days);
    setHour(hours);
    setMinute(minutes);
    setSecond(seconds);
  }, [currentTime]);

  const doMint = async () => {
    try {
      const estimatedGas = await mintGas(count, proof, { value: price[0] });
      mint(count, proof, {
        gasLimit: estimatedGas,
        value: price[0],
      });
    } catch (error) {
      console.log(error);
      if (error.error)
        toast.error(
          error.error.message.split("execution reverted: ").join(""),
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
          }
        );
      else
        toast.error(error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
        });
    }
  };

  return (
    <div className="App">
      <WalletConnectionModal open={wallet} onClose={() => setWallet(false)} />
      <div className="App-header">
        <Fade top>
          <div className="header">
            <p className="title">KEK KEK KEKW</p>
            <div className="contacts">
              <a href="https://twitter.com/KEKKEKKEKW">
                <img src="img/twitter.png" alt="twitter" />
              </a>
              <a href="https://opensea.io/KEKKEKKEKW">
                <img src="img/opensea.png" alt="opensea" />
              </a>
            </div>
          </div>
        </Fade>
        <div className="flex main-content col-12">
          <Fade left>
            <div className="phone col-6">
              <div className="phone-main">
                <div className="phone-content">
                  <p className="p-title">
                    Kekw means
                    <br /> fun, laughter
                    <br /> and joy!
                  </p>
                  <span className="verdana">
                    This project is purely for art and vibes. <br />
                    No BS. No overpromises. <br />
                    <br />
                    6666 Kekw nfts including a few 1/1s !! <br />
                  </span>

                  <span className="second-text verdana">
                    666 free mint: max 5 per wallet
                    <br />
                    Rest 6000 at .0069eth : max 10 per wallet
                    <br />
                    <br />
                    Kek Kek Kekw!!!
                  </span>
                </div>
                <div className="minting-soon">
                  <p>Minting soon</p>
                  {/* <div className="view-contract">
                    View verified Contract on Etherscan -->
                  </div> */}
                  <span className="verdana">
                    No roadmap, no utilities, no liabilities. We're here for
                    pure art & fun.
                    <br />
                    Verified contract:{" "}
                    <a
                      href="https://etherscan.io/address/0x2aDfE20e8ffDc84C362668331dd6D6dfa0295D65"
                      target={"_blank"}
                    >
                      0x2aDfE20e8ffDc84C362668331dd6D6dfa0295D65
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </Fade>
          <Fade right>
            <div className="img-content col-6">
              <div>
                <img src="img/mom.gif" alt="mom" id="mom" />
              </div>
              {true ? (
                <div>
                  <div className="mint-amount">
                    {Number(totalSupply) === 5000 ? (
                      <p className="sold-out">SOLD OUT</p>
                    ) : (
                      <p className="mint-supply">
                        {Number(totalSupply) || (
                          <BeatLoader color="#000" loading={true} size={8} />
                        )}
                        /5000
                      </p>
                    )}
                    <div className="mint-select flex">
                      <button onClick={() => setCount(Math.max(count - 1, 1))}>
                        -
                      </button>
                      <p>{count}</p>
                      <button
                        onClick={() =>
                          setCount(Math.min(count + 1, 5 - mintCount || 5))
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="mint">
                      {Number(totalSupply) === 5000 ? (
                        <a className="opensea" href="https://opensea.io">
                          VIEW ON OPENSEA
                        </a>
                      ) : account ? (
                        <a className="mint-btn" onClick={doMint}>
                          Mint
                        </a>
                      ) : (
                        <a
                          className="mint-btn"
                          onClick={() => {
                            setWallet(true);
                          }}
                        >
                          CONNECT
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <br />
                  <span className="waiting">
                    Mint Live in <span>{hour}:</span>
                    <span>{minute}:</span>
                    <span>{second}</span>
                  </span>
                </>
              )}
              <div className="phone-main mobile-view">
                <div className="phone-content">
                  <p className="p-title">
                    Kekw means
                    <br /> fun, laughter
                    <br /> and joy!
                  </p>
                  <span className="verdana">
                    This project is purely for art and vibes. <br />
                    No BS. No overpromises. <br />
                    <br />
                    6666 Kekw nfts including a few 1/1s !! <br />
                  </span>

                  <span className="second-text verdana">
                    666 free mint: max 5 per wallet
                    <br />
                    Rest 6000 at .0069eth : max 10 per wallet
                    <br />
                    <br />
                    Kek Kek Kekw!!!
                  </span>
                </div>
                <div className="minting-soon">
                  <p>Minting soon</p>
                  {/* <div className="view-contract">
                    View verified Contract on Etherscan -->
                  </div> */}
                  <span className="verdana">
                    No roadmap, no utilities, no liabilities. We're here for
                    pure art & fun.
                    <br />
                    Verified contract:{" "}
                    <a
                      href="https://etherscan.io/address/0x2aDfE20e8ffDc84C362668331dd6D6dfa0295D65"
                      target={"_blank"}
                    >
                      0x2aDfE20e8ffDc84C362668331dd6D6dfa0295D65
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}

export default App;
