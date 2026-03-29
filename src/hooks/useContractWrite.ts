"use client";

import { useCallback } from "react";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { MODULE_ADDRESS, MODULE_NAME, APPCHAIN_ID, GAS_METADATA } from "@/lib/constants";
import {
  bcsStringBytes,
  bcsAddressBytes,
  bcsU64Bytes,
  bcsVectorStringBytes,
} from "@/lib/bcs";
import { MsgExecute } from "@initia/initia.proto/initia/move/v1/tx";

/**
 * Hook that provides write functions for ProfileRegistry Move module.
 * Uses InterwovenKit's requestTxBlock with Cosmos MsgExecute.
 */
export function useContractWrite() {
  const { initiaAddress, requestTxBlock, submitTxBlock, estimateGas, autoSign } =
    useInterwovenKit();

  const isAutoSignEnabled = autoSign?.isEnabledByChain?.[APPCHAIN_ID] ?? false;

  const sendMsgExecute = useCallback(
    async (functionName: string, typeArgs: string[] = [], args: Uint8Array[] = []) => {
      if (!initiaAddress) throw new Error("Wallet not connected");

      const messages = [
        {
          typeUrl: "/initia.move.v1.MsgExecute",
          value: MsgExecute.fromPartial({
            sender: initiaAddress,
            moduleAddress: MODULE_ADDRESS,
            moduleName: MODULE_NAME,
            functionName,
            typeArgs,
            args,
          }),
        },
      ];

      if (isAutoSignEnabled) {
        const gas = await estimateGas({ chainId: APPCHAIN_ID, messages });
        const gasWithBuffer = Math.ceil(gas * 1.4);
        return submitTxBlock({
          chainId: APPCHAIN_ID,
          messages,
          fee: {
            amount: [{ denom: "GAS", amount: "0" }],
            gas: String(gasWithBuffer),
          },
        });
      }

      return requestTxBlock({ chainId: APPCHAIN_ID, messages });
    },
    [initiaAddress, requestTxBlock, submitTxBlock, estimateGas, isAutoSignEnabled]
  );

  const createProfile = useCallback(
    async (bio: string, avatarUrl: string, links: string[], linkLabels: string[]) => {
      return sendMsgExecute("create_profile", [], [
        bcsStringBytes(bio),
        bcsStringBytes(avatarUrl),
        bcsVectorStringBytes(links),
        bcsVectorStringBytes(linkLabels),
      ]);
    },
    [sendMsgExecute]
  );

  const updateBio = useCallback(
    async (newBio: string) => {
      return sendMsgExecute("update_bio", [], [bcsStringBytes(newBio)]);
    },
    [sendMsgExecute]
  );

  const updateAvatar = useCallback(
    async (newAvatarUrl: string) => {
      return sendMsgExecute("update_avatar", [], [bcsStringBytes(newAvatarUrl)]);
    },
    [sendMsgExecute]
  );

  const updateLinks = useCallback(
    async (links: string[], linkLabels: string[]) => {
      return sendMsgExecute("update_links", [], [
        bcsVectorStringBytes(links),
        bcsVectorStringBytes(linkLabels),
      ]);
    },
    [sendMsgExecute]
  );

  const tipProfile = useCallback(
    async (profileOwner: string, amount: string) => {
      const amountNum = Math.floor(Number(amount));
      return sendMsgExecute("tip_profile", [], [
        bcsAddressBytes(profileOwner),
        bcsAddressBytes(GAS_METADATA),
        bcsU64Bytes(amountNum),
      ]);
    },
    [sendMsgExecute]
  );

  const followProfile = useCallback(
    async (profileOwner: string) => {
      return sendMsgExecute("follow_profile", [], [bcsAddressBytes(profileOwner)]);
    },
    [sendMsgExecute]
  );

  const unfollowProfile = useCallback(
    async (profileOwner: string) => {
      return sendMsgExecute("unfollow_profile", [], [bcsAddressBytes(profileOwner)]);
    },
    [sendMsgExecute]
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
