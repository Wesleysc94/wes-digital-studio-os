import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTaskMutation } from "@/hooks/use-os-sync";
import { formatShortDate, getTaskPriorityClasses, getTaskStatusClasses } from "@/lib/os-helpers";
import { useOsStore } from "@/store/os-store";
import { TASK_PRIORITY_OPTIONS } from "@/types/os";

const taskSchema = z.object({
  title: z.string().min(3, "Titulo obrigatorio."),
  description: z.string().min(6, "Descreva a tarefa."),
  priority: z.enum(TASK_PRIORITY_OPTIONS),
  relatedClient: z.string().optional(),
  dueDate: z.string().min(1, "Defina a data."),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const defaultValues: TaskFormValues = {
  title: "",
  description: "",
  priority: "Media",
  relatedClient: "",
  dueDate: "2026-03-11",
};

export function TasksPage() {
  const tasks = useOsStore((state) => state.tasks);
  const createTaskMutation = useCreateTaskMutation();
  const toggleTaskStatus = useOsStore((state) => state.toggleTaskStatus);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const onSubmit = async (values: TaskFormValues) => {
    const result = await createTaskMutation.mutateAsync({
      ...values,
      status: "Aberta",
    });
    form.reset(defaultValues);
    toast.success(result.persisted ? "Tarefa salva na camada remota." : "Tarefa salva localmente. Configure Google para persistencia.");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
      <Card className="glass-card rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-xl">Nova tarefa</CardTitle>
          <CardDescription>Registre follow-ups, manutencoes e entregas para nao depender da memoria.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="title">Titulo</Label>
              <Input id="title" {...form.register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descricao</Label>
              <Textarea id="description" rows={5} {...form.register("description")} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Controller
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_PRIORITY_OPTIONS.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Prazo</Label>
                <Input id="dueDate" type="date" {...form.register("dueDate")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="relatedClient">Cliente relacionado</Label>
              <Input id="relatedClient" {...form.register("relatedClient")} />
            </div>
            <Button type="submit" className="w-full rounded-2xl" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending ? "Salvando..." : "Adicionar tarefa"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="glass-card rounded-[2rem]">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-medium text-foreground">{task.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{task.relatedClient || "Sem cliente vinculado"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getTaskPriorityClasses(task.priority)}>{task.priority}</Badge>
                  <Badge className={getTaskStatusClasses(task.status)}>{task.status}</Badge>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-foreground/85">{task.description}</p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Prazo: {formatShortDate(task.dueDate)}</p>
                <Button type="button" variant="outline" className="rounded-2xl" onClick={() => toggleTaskStatus(task.id)}>
                  {task.status === "Concluida" ? "Reabrir" : "Marcar como concluida"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
