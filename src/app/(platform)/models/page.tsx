import { redirect } from "next/navigation";
export default function ModelsPage() {
  redirect("/costs?tab=marketplace");
}
