export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { seedAdminUser } = await import("@/lib/admin-auth");
    await seedAdminUser();
  }
}
