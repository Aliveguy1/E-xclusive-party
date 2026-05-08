import { Party } from '../types';

export function generateGoogleCalendarLink(party: Party): string {
  const [year, month, day] = party.date.split('-').map(Number);
  const [hour, minute] = party.time.split(':').map(Number);
  
  // Create Date objects (mocking a bit since the user provided string dates)
  const startDate = new Date(year || 2024, (month || 1) - 1, day || 1, hour || 22, minute || 0);
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later

  const format = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: party.name,
    dates: `${format(startDate)}/${format(endDate)}`,
    details: party.description,
    location: party.location,
    sf: "true",
    output: "xml"
  });

  return `${baseUrl}&${params.toString()}`;
}
