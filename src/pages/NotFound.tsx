import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="glass-card w-full max-w-xl rounded-[2rem]">
        <CardContent className="space-y-6 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-accent">404</p>
          <h1 className="text-4xl font-semibold text-foreground">Rota nao encontrada</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Esta area ainda nao existe no Wes Digital Studio OS ou o endereco foi digitado incorretamente.
          </p>
          <Button asChild className="rounded-2xl">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
