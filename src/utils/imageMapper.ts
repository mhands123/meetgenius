// Utility to map profile names to their corresponding image paths
export function getProfileImage(name: string): string {
  const nameToImageMap: Record<string, string> = {
    'Bernard Uko': '/images/bernard-uko.jpeg',
    'Itti Jindani': '/images/itti-jindani.jpeg',
    'Glenn Gray': '/images/glenn-gray.jpeg',
    'Mark Zukor': '/images/mark-zukor.jpeg',
    'Aditya Prabhu': '/images/aditya-prabhu.jpeg',
    'Natalia Dueholm': '/images/natalia-dueholm.jpeg',
    'Himanshu Laiker, MBA': '/images/himanshu-laiker.jpeg',
    'Andre Smith': '/images/andre-smith.jpeg',
    'Mark Hurlburt': '/images/mark-hurlburt.jpeg',
    'Kenneth Krutsch': '/images/kenneth-krutsch.jpeg',
    'Steve Stark': '/images/steve-stark.jpeg',
    'Colin Hirdman': '/images/colin-hirdman.jpeg',
    'Christi Kmecik': '/images/christi-kmecik.jpeg',
    'Hayley Brooks': '/images/hayley-brooks.jpeg',
    'Arthur A Kennedy': '/images/arthur-a-kennedy.jpeg',
    'Michael J.': '/images/michael-j.jpeg',
    'Summer Song': '/images/summer-song.jpeg',
    'Jennifer Liu': '/images/jennifer-liu.jpeg',
    'Peter Somerville': '/images/peter-somerville.jpeg',
    'Nate Donovan': '/images/nate-donovan.jpeg',
    'Kate Kuehl': '/images/kate-kuehl.jpeg',
    'Ben Theis': '/images/ben-theis.jpeg',
    'Taylor Birkeland': '/images/taylor-birkeland.jpeg',
  };

  return nameToImageMap[name] || '/images/default-avatar.svg';
}

// Generate initials for fallback display
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}
