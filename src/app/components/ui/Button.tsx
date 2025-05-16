import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
};
const Button = ({ children, ...rest }: Props) => {
    return (
        <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm 
    font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
    focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
    [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:bg-accent 
    hover:text-accent-foreground h-10 px-4 py-2 border-green-500 text-green-700 dark:text-green-300"
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
