"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RefreshSvg } from "@/components/svgs/refreshSvg";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

const RefreshButton = ({ title, setIsRefresh }: { title: string, setIsRefresh: (value: boolean) => void }) => {
  // const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);

    setIsRefresh(true)


    // startTransition(() => {
    //   router.refresh();
    //   // Reset loading after refresh
    //   setTimeout(() => setIsLoading(false), 300);
    // });
  };

  const showLoading = isPending || isLoading;

  return (
    <PrimaryButton
      title={title}
      iconRight={showLoading ? <RefreshSvg className="animate-spin" /> : <RefreshSvg />}
      className={`w-[116px] h-[60px] transition-all duration-200 ${
        showLoading ? "opacity-75 cursor-not-allowed" : ""
      }`}
      onClick={handleRefresh}
      disabled={showLoading}
      disabledIcon={false}
    />
  );
};

export default RefreshButton;
