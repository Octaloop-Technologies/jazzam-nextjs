"use client";

import { MouseEvent } from "react";
import styles from "./RippleTabs.module.css";

interface PoliticalBiasSelectorProps {
  activeBias: string;
  onBiasChange: (bias: string) => void;
  options: string[];
}

const PoliticalBiasSelector = ({
  options,
  activeBias,
  onBiasChange,
}: PoliticalBiasSelectorProps) => {
  const handleBiasClick = (e: MouseEvent<HTMLButtonElement>, bias: string) => {
    onBiasChange(bias);
    const button = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    ripple.classList.add(styles.ripple);

    // Check if there are any existing ripples and remove them
    const existingRipple = button.querySelector(`.${styles.ripple}`);
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  };

  return (
    <div className={styles.container}>
      {options.map((bias) => (
        <button
          key={bias}
          className={`${styles.button} ${activeBias === bias ? styles.active : ""}`}
          onClick={(e) => handleBiasClick(e, bias)}
        >
          {bias.charAt(0) + bias.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
};

export default PoliticalBiasSelector;
