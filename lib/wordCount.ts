export function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}
