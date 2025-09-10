const Logo = ({ className, titleClassName }: { className?: string; titleClassName?: string }) => {
  return (
    <div className="flex-center gap-1.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`size-[40px] ${className}`}
        viewBox="0 0 40 40"
        fill="none"
      >
        <g clipPath="url(#clip0_172_10341)">
          <rect width="40" height="40" rx="20" fill="#15803C" />
          <g filter="url(#filter0_d_172_10341)">
            <path
              d="M17.6719 9.3371L18.1403 14.3846L20.8982 13.0317V25.2081L16.8914 27.3937V23.1787H12V36.5L27.871 28.1222L27.1425 4.60181L17.6719 9.3371Z"
              fill="url(#paint0_linear_172_10341)"
            />
            <path
              d="M24.8009 3.82127L19.3891 6.47511L19.5452 3.50905L22.4072 2L24.8009 3.82127Z"
              fill="url(#paint1_linear_172_10341)"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_172_10341"
            x="7.47541"
            y="2"
            width="24.9203"
            height="43.5492"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4.52459" />
            <feGaussianBlur stdDeviation="2.2623" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_172_10341" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_172_10341"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_172_10341"
            x1="15.1766"
            y1="2.1165"
            x2="13.887"
            y2="34.5228"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#B0B0B0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_172_10341"
            x1="15.1766"
            y1="2.1165"
            x2="13.887"
            y2="34.5228"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#B0B0B0" />
          </linearGradient>
          <clipPath id="clip0_172_10341">
            <rect width="40" height="40" rx="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <h1 className={`text-[24px] font-[600] ${titleClassName}`}>Jazzam</h1>
    </div>
  );
};

export default Logo;
