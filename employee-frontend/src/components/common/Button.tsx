interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
}) => (
  <button
    onClick={onClick}
    className={`${className} w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-colors duration-300  `}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
