import { DropDown } from ".";

interface Props {
  children: string | undefined;
  className?: string;
  label?: string;
}
export function HelpDropDown({ children, className, label = "?" }: Props) {
  if (children == null || !children.length) return null;

  return (
    <DropDown className={className} label={label} right small>
      {children}
    </DropDown>
  );
}
