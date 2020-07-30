export async function wait(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}
