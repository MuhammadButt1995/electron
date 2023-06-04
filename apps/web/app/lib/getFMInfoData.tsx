export default async function getFMInfoData(section: string) {
  const res = await fetch(
    `http://127.0.0.1:8000/tools/FMInfo/execute?section=${section}`
  );

  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}
