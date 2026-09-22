const formatter = new Intl.DateTimeFormat('en-CA', { dateStyle: 'long' });

export function formatDate(iso: string): string {
  return formatter.format(new Date(iso));
}
