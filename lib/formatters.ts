export function formatEventDescription(duration: number) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  const hourString = hours > 1 ? 'hrs' : 'hr';
  const minuteString = minutes > 1 ? 'mins' : 'min';

  if (hours === 0) return `${minutes} ${minuteString}`;
  if (minutes === 0) return `${hours} ${hourString}`;
  return `${hours} ${hourString} ${minutes} ${minuteString}`;
}
