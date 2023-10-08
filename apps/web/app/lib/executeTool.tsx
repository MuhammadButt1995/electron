export default async function executeTool(tool_name) {
  const res = await fetch(`http://127.0.0.1:8567/tools/execute/${tool_name}`);

  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}
