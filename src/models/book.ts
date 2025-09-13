export interface JPPage {
    html: string;
    label?: string | number;
    notes?: Array<{ id: string; text: string }>;
}

export interface JPChapter {
    id: string;
    title: string;
    pages: JPPage[];
}

export interface JPBookData {
    title: string;
    author?: string;
    chapters: JPChapter[];
}