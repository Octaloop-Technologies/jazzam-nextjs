"use client";

import { useState } from "react";
import { ToggleOption, ToggleSelector } from "@/components/ui/toggle";
import { EmailIcon, WhatsAppIcon } from "@/components/ui/toggle";

const ChannelToggle = () => {
  const [selectedChannel, setSelectedChannel] = useState<string>("email");

  const channelOptions: ToggleOption[] = [
    {
      id: "email",
      label: "Email",
      icon: <EmailIcon />,
      value: "email",
    },
    // {
    //   id: "whatsapp",
    //   label: "WhatsApp",
    //   icon: <WhatsAppIcon />,
    //   value: "whatsapp",
    // },
  ];

  const handleChannelChange = (value: string) => {
    setSelectedChannel(value);
    console.log("Selected channel:", value);
  };

  return (
    <ToggleSelector
      options={channelOptions}
      selectedValue={""}
      onSelectionChange={handleChannelChange}
    />
  );
};

export default ChannelToggle;
