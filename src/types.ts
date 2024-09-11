export interface Client {
    id: string;
    name: string;
    date_of_birth: Date | null;  
    main_language: string;
    secondary_language: string;
    funding_source_id: number;
}

export interface ClientListProps {
    onSelectClient: (id: string) => void; // Callback to set the selected client ID
}

export interface UpdateClientFormProps {
    clientId: string; // The ID of the client to update
    onSuccess: () => void; // Callback to refresh the client list or perform other actions
}

export interface DeleteClientButtonProps {
    clientId: string; // The ID of the client to delete
    onSuccess: () => void; // Callback to refresh the client list or perform other actions
}

export interface InputFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    required?: boolean;
    type?: string;
}

export interface SelectInputFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (value: string) => void;
    options: { value: string; label: string }[]; // Updated options type
    required?: boolean;
}

export interface DropdownInputFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (value: number) => void; // onChange should now pass a number
    options: { value: number; label: string }[]; // Updated options to have number values
    required?: boolean;
}

export interface RadioButtonInputFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (value: number) => void;
    options: { value: number; label: string }[];
    required?: boolean;
}



