export interface FormData {
    type: string;
    name: string;
    value?: string;
    placeholder?: string;
    ref?: React.RefObject<HTMLInputElement | null>;
}