import { redirect } from "next/navigation";

// Quiz termina → vai direto para o email
export default function ResultPage() {
  redirect("/pt-br/enter-email");
}
