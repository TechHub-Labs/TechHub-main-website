interface WebsiteBackgroundProps {
  isDark?: boolean;
  bgColor: string;
}

export function WebsiteBackground({ isDark = false, bgColor }: WebsiteBackgroundProps) {
  // The exact SVG patterns provided from your CSS
  const lightPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='16'%3E%3Crect x='0' y='0' width='3' height='3' rx='0.6' fill='rgb(220%2C218%2C235)'/%3E%3Crect x='8' y='8' width='3' height='3' rx='0.6' fill='rgb(220%2C218%2C235)'/%3E%3C/svg%3E")`;
  
  const darkPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='16'%3E%3Crect x='0' y='0' width='3' height='3' rx='0.6' fill='rgba(255%2C255%2C255%2C0.04)'/%3E%3Crect x='8' y='8' width='3' height='3' rx='0.6' fill='rgba(255%2C255%2C255%2C0.04)'/%3E%3C/svg%3E")`;

  const bgImage = isDark ? darkPattern : lightPattern;

  return (
    <style>{`
      body {
        background-color: ${bgColor} !important;
        background-image: ${bgImage} !important;
        background-repeat: repeat !important;
        background-size: 17px 16px !important;
        background-attachment: fixed !important;
        transition: background-color 0.3s ease;
      }
    `}</style>
  );
}