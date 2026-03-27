"use client";

import { useCallback } from "react";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { encodeFunctionData, parseEther, type Address } from "viem";
import { PROFILE_REGISTRY_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS, APPCHAIN_ID } from "@/lib/constants";

/**
 * Hook that provides write functions for ProfileRegistry contract.
 * Uses InterwovenKit's requestTxBlock with Cosmos MsgCall
 * instead of wagmi/viem writeContract.
 */
export function useContractWrite() {
  const { initiaAddress, requestTxBlock } = useInterwovenKit();

  const sendMsgCall = useCallback(
    async (input: string, value: string = "0") => {
      if (!initiaAddress) throw new Error("Wallet not connected");

      return requestTxBlock({
        chainId: APPCHAIN_ID,
        messages: [
          {
            typeUrl: "/minievm.evm.v1.MsgCall",
            value: {
              sender: initiaAddress,
              contractAddr: CONTRACT_ADDRESS,
              input,
              value,
              accessList: [],
              authList: [],
            },
          },
        ],
      });
    },
    [initiaAddress, requestTxBlock]
  );

  const createProfile = useCallback(
    async (bio: string, avatarUrl: string, links: string[], linkLabels: string[]) => {
      const input = encodeFunctionData({
        abi: PROFILE_REGISTRY_ABI,
        functionName: "createProfile",
        args: [bio, avatarUrl, links, linkLabels],
      });
      return sendMsgCall(input);
    },
    [sendMsgCall]
  );

  const updateBio = useCallback(
    async (newBio: string) => {
      const input = encodeFunctionData({
        abi: PROFILE_REGISTRY_ABI,
        functionName: "updateBio",
        args: [newBio],
      });
      return sendMsgCall(input);
    },
    [sendMsgCall]
  );

  const updateAvatar = useCallback(
    async (newAvatarUrl: string) => {
      const input = encodeFunctionData({
        abi: PROFILE_REGISTRY_ABI,
        functionName: "updateAvatar",
        args: [newAvatarUrl],
      });
      return sendMsgCall(input);
    },
    [sendMsgCall]
  );

  const updateLinks = useCallback(
    async (links: string[], linkLabels: string[]) => {
      const input = encodeFunctionData({
        abi: PROFILE_REGISTRY_ABI,
        functionName: "updateLinks",
        args: [links, linkLabels],
      });
      return sendMsgCall(input);
    },
    [sendMsgCall]
  );

  const tipProfile = useCallback(
    async (profileOwner: Address, amount: string) => {
      const input = encodeFunctionData({
        abi: PROFILE_REGISTRY_ABI,
        functionName: "tipProfile",
        args: [profileOwner],
      });
      return sendMsgCall(input, parseEther(amount).toString());
    },
    [sendMsgCall]
  );

  const followProfile = useCallback(
    async (profileOwner: Address) => {
      const input = encodeFunctionData({
        abi: PROFILE_REGISTRY_ABI,
        functionName: "followProfile",
        args: [profileOwner],
      });
      return sendMsgCall(input);
    },
    [sendMsgCall]
  );

  const unfollowProfile = useCallback(
    async (profileOwner: Address) => {
      const input = encodeFunctionData({
        abi: PROFILE_REGISTRY_ABI,
        functionName: "unfollowProfile",
        args: [profileOwner],
      });
      return sendMsgCall(input);
    },
    [sendMsgCall]
  );

  return {
    createProfile,
    updateBio,
    updateAvatar,
    updateLinks,
    tipProfile,
    followProfile,
    unfollowProfile,
    isConnected: !!initiaAddress,
  };
}
