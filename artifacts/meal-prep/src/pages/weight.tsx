import { useState } from "react";
import {
  useListWeightEntries,
  getListWeightEntriesQueryKey,
  useCreateWeightEntry,
  useDeleteWeightEntry,
} from "@workspace/api-client-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Scale,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Unit = "lbs" | "kg";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatDateFull(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CustomTooltip = ({
  active,
  payload,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { date: string } }>;
  unit: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sidebar border border-sidebar-border rounded-xl px-4 py-3 shadow-lg">
        <p className="text-sidebar-foreground/50 text-[11px] font-medium uppercase tracking-wider mb-1">
          {payload[0].payload.date}
        </p>
        <p className="text-sidebar-foreground font-bold text-lg">
          {payload[0].value.toFixed(1)}
          <span className="text-sidebar-foreground/50 text-sm font-normal ml-1">{unit}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Weight() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [weightInput, setWeightInput] = useState("");
  const [unit, setUnit] = useState<Unit>("lbs");
  const [notes, setNotes] = useState("");

  const { data: entries, isLoading } = useListWeightEntries({
    query: { queryKey: getListWeightEntriesQueryKey() },
  });

  const createEntry = useCreateWeightEntry();
  const deleteEntry = useDeleteWeightEntry();

  const handleAdd = () => {
    const w = parseFloat(weightInput);
    if (!weightInput || isNaN(w) || w <= 0) {
      toast({ variant: "destructive", title: "Enter a valid weight" });
      return;
    }

    createEntry.mutate(
      { data: { weight: w, unit, notes: notes || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Weight logged!" });
          setWeightInput("");
          setNotes("");
          queryClient.invalidateQueries({ queryKey: getListWeightEntriesQueryKey() });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error logging weight" });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteEntry.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Entry removed" });
          queryClient.invalidateQueries({ queryKey: getListWeightEntriesQueryKey() });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error deleting entry" });
        },
      }
    );
  };

  // Normalize entries to selected unit for display
  const normalizedEntries = entries?.map((e) => {
    let w = e.weight;
    if (e.unit === "kg" && unit === "lbs") w = w * 2.20462;
    if (e.unit === "lbs" && unit === "kg") w = w / 2.20462;
    return { ...e, displayWeight: Math.round(w * 10) / 10 };
  });

  const chartData = normalizedEntries?.map((e) => ({
    date: formatDate(e.recordedAt as unknown as string),
    weight: e.displayWeight,
    fullDate: formatDateFull(e.recordedAt as unknown as string),
  }));

  // Stats
  const latest = normalizedEntries?.[normalizedEntries.length - 1];
  const first = normalizedEntries?.[0];
  const totalChange =
    latest && first ? latest.displayWeight - first.displayWeight : null;
  const recentChange =
    normalizedEntries && normalizedEntries.length >= 2
      ? normalizedEntries[normalizedEntries.length - 1].displayWeight -
        normalizedEntries[normalizedEntries.length - 2].displayWeight
      : null;

  const goalLine =
    normalizedEntries && normalizedEntries.length > 1
      ? undefined
      : undefined;

  const minWeight = chartData
    ? Math.floor(Math.min(...chartData.map((d) => d.weight)) - 2)
    : undefined;
  const maxWeight = chartData
    ? Math.ceil(Math.max(...chartData.map((d) => d.weight)) + 2)
    : undefined;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          Body Weight
        </p>
        <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-1.5">
          Weight Tracker
        </h1>
        <p className="text-muted-foreground">
          Log your weight to visualize your trend over time.
        </p>
      </section>

      {/* Stats row */}
      {!isLoading && normalizedEntries && normalizedEntries.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {/* Current */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Current
            </p>
            <p className="font-serif text-3xl font-bold text-foreground leading-none">
              {latest?.displayWeight.toFixed(1)}
            </p>
            <p className="text-muted-foreground text-xs mt-1">{unit}</p>
          </div>

          {/* Change from start */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Total Change
            </p>
            {totalChange !== null ? (
              <div className="flex items-baseline gap-1.5">
                <p
                  className={`font-serif text-3xl font-bold leading-none ${
                    totalChange < 0
                      ? "text-primary"
                      : totalChange > 0
                      ? "text-amber-500"
                      : "text-foreground"
                  }`}
                >
                  {totalChange > 0 ? "+" : ""}
                  {totalChange.toFixed(1)}
                </p>
                <p className="text-muted-foreground text-xs">{unit}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">—</p>
            )}
            <p className="text-muted-foreground text-xs mt-1">from start</p>
          </div>

          {/* Recent trend */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Last Change
            </p>
            {recentChange !== null ? (
              <div className="flex items-center gap-1.5">
                {recentChange < 0 ? (
                  <TrendingDown size={20} className="text-primary" />
                ) : recentChange > 0 ? (
                  <TrendingUp size={20} className="text-amber-500" />
                ) : (
                  <Minus size={20} className="text-muted-foreground" />
                )}
                <p
                  className={`font-serif text-2xl font-bold leading-none ${
                    recentChange < 0
                      ? "text-primary"
                      : recentChange > 0
                      ? "text-amber-500"
                      : "text-foreground"
                  }`}
                >
                  {recentChange > 0 ? "+" : ""}
                  {recentChange.toFixed(1)}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">—</p>
            )}
            <p className="text-muted-foreground text-xs mt-1">vs previous</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Weight Over Time</h2>
            <p className="text-muted-foreground text-xs mt-0.5">
              {entries?.length ?? 0} entries recorded
            </p>
          </div>
          {/* Unit toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            {(["lbs", "kg"] as Unit[]).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  unit === u
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="h-56 flex items-center justify-center">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        ) : !chartData || chartData.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-center px-8">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
              <Scale size={22} />
            </div>
            <p className="font-medium text-foreground mb-1">No data yet</p>
            <p className="text-muted-foreground text-sm">
              Log your first weight below to start tracking your trend.
            </p>
          </div>
        ) : chartData.length === 1 ? (
          <div className="h-56 flex flex-col items-center justify-center text-center px-8">
            <p className="font-semibold text-foreground text-2xl mb-1">
              {chartData[0].weight} {unit}
            </p>
            <p className="text-muted-foreground text-sm">
              Log a second entry to see your trend chart.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 24, left: -8, bottom: 8 }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(142, 60%, 38%)" />
                  <stop offset="100%" stopColor="hsl(142, 60%, 48%)" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(140, 12%, 90%)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(160, 12%, 45%)", fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                domain={[minWeight ?? "auto", maxWeight ?? "auto"]}
                tick={{ fontSize: 11, fill: "hsl(160, 12%, 45%)", fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                content={<CustomTooltip unit={unit} />}
                cursor={{
                  stroke: "hsl(142, 60%, 38%)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="url(#lineGradient)"
                strokeWidth={2.5}
                dot={{
                  fill: "hsl(142, 60%, 38%)",
                  strokeWidth: 2,
                  r: 4,
                  stroke: "white",
                }}
                activeDot={{
                  r: 6,
                  fill: "hsl(142, 60%, 38%)",
                  stroke: "white",
                  strokeWidth: 2.5,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Log weight */}
      <div className="rounded-2xl border border-border bg-card shadow-sm p-5">
        <h2 className="font-semibold text-foreground mb-4">Log Today's Weight</h2>
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Input
              type="number"
              step="0.1"
              min="1"
              max="999"
              placeholder={`Weight in ${unit}...`}
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="h-12 pr-16 text-base font-medium bg-muted/30"
            />
            <div className="absolute right-1 top-1 flex gap-1">
              {(["lbs", "kg"] as Unit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all h-10 ${
                    unit === u
                      ? "gradient-emerald text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
          <Input
            placeholder="Optional note (e.g. after workout)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-12 text-sm bg-muted/30 sm:w-64"
          />
          <Button
            onClick={handleAdd}
            disabled={createEntry.isPending || !weightInput}
            className="h-12 px-6 font-semibold gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus size={16} />
            {createEntry.isPending ? "Saving..." : "Log Weight"}
          </Button>
        </div>
      </div>

      {/* History */}
      {!isLoading && entries && entries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            History
          </h2>
          <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border overflow-hidden">
            {[...(normalizedEntries ?? [])].reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <Scale size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {entry.displayWeight.toFixed(1)}{" "}
                      <span className="text-muted-foreground font-normal text-xs">{unit}</span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatDateFull(entry.recordedAt as unknown as string)}
                      {entry.notes && (
                        <span className="text-muted-foreground/60 ml-2">· {entry.notes}</span>
                      )}
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove this entry?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This weight log will be permanently deleted from your history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(entry.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
