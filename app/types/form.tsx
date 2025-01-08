export interface FormData {
    type: string;
    name: string;
    value?: string;
    placeholder?: string;
    required: boolean;
    ref?: React.RefObject<HTMLInputElement | null>;
}