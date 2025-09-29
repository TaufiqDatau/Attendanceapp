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
    // The classes you pass in the `className` prop will override the defaults here
    className={`${className} w-full text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light  transition-colors duration-300`}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
