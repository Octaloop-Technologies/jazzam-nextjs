const CloseSvg = ({ className = "size-[12px]" }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" className={className}>
      <path
        d="M0.998535 11L11.0014 1M0.998535 1L11.0014 11"
        stroke="#15803C"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CloseSvg;
