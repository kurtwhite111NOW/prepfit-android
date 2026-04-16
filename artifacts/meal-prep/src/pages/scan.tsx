import { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  useAnalyzeMealPhoto,
  useCreateSavedMeal,
  getListSavedMealsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  ScanLine,
  Camera,
  Upload,
  Flame,
  AlertCircle,
  Save,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function Scan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const analyzePhoto = useAnalyzeMealPhoto();
  const createSavedMeal = useCreateSavedMeal();

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const MAX = 1280;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
            else { width = Math.round((width * MAX) / height); height = MAX; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas not available"));
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImage(file);
      setImagePreview(base64);
      analyzePhoto.mutate({ data: { imageBase64: base64 } });
    } catch {
      toast({ variant: "destructive", title: "Couldn't read photo", description: "Please try a different image." });
    }
  };

  const handleSave = () => {
    if (!analyzePhoto.data || !imagePreview) return;
    createSavedMeal.mutate(
      {
        data: {
          name: analyzePhoto.data.name,
          description: analyzePhoto.data.description,
          estimatedCalories: analyzePhoto.data.estimatedCalories,
          ingredients: analyzePhoto.data.ingredients,
          imageData: imagePreview,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Saved to journal!", description: "Meal added to your history." });
          queryClient.invalidateQueries({ queryKey: getListSavedMealsQueryKey() });
          setLocation("/meals");
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error saving meal" });
        },
      }
    );
  };

  const handleReset = () => {
    setImagePreview(null);
    analyzePhoto.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      {/* Header */}
      <section className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-emerald text-white mb-5 shadow-lg">
          <ScanLine size={24} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          AI Photo Analysis
        </p>
        <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-2">
          Scan Your Meal
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Snap or upload a photo — AI identifies your meal, estimates calories, and lists ingredients instantly.
        </p>
      </section>

      {!imagePreview ? (
        <div
          className="relative rounded-3xl border-2 border-dashed border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/40 hover:bg-primary/2 cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="flex gap-4 mb-7">
              <div className="w-16 h-16 rounded-2xl gradient-emerald flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Camera size={26} />
              </div>
              <div className="w-16 h-16 rounded-2xl border border-border bg-muted flex items-center justify-center text-muted-foreground shadow-sm group-hover:scale-105 transition-transform">
                <Upload size={22} />
              </div>
            </div>
            <h3 className="font-semibold text-foreground text-xl mb-2">
              Tap to photograph your meal
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Works best with a clear, well-lit photo. AI identifies food even in complex dishes.
            </p>
            <div className="flex items-center gap-4 mt-8 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Instant analysis
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Calorie estimate
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Ingredient list
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_1fr] gap-5 animate-in slide-in-from-bottom-4 duration-400">
          {/* Photo */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="aspect-square relative bg-black overflow-hidden">
              <img
                src={imagePreview}
                alt="Meal"
                className="w-full h-full object-cover"
              />
              {analyzePhoto.isPending && (
                <div className="absolute inset-0 bg-background/75 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl gradient-emerald flex items-center justify-center mb-3 shadow-lg">
                    <Sparkles size={22} className="text-white" />
                  </div>
                  <p className="font-semibold text-foreground text-sm">Analyzing photo...</p>
                  <div className="flex gap-1.5 mt-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary dot-blink"
                        style={{ animationDelay: `${i * 400}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-3.5 border-t border-border bg-muted/20">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground text-sm h-9"
                onClick={handleReset}
              >
                <X size={14} className="mr-2" />
                Use different photo
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
            {analyzePhoto.isPending ? (
              <div className="flex-1 p-6 space-y-4 opacity-40">
                <div className="h-7 bg-muted rounded-xl w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded-lg w-full animate-pulse" />
                <div className="h-4 bg-muted rounded-lg w-4/5 animate-pulse" />
                <div className="h-14 bg-muted rounded-xl w-2/5 animate-pulse mt-2" />
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-16 bg-muted rounded-xl animate-pulse" />
                </div>
              </div>
            ) : analyzePhoto.data ? (
              <>
                <div className="p-5 border-b border-border bg-muted/20 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-xl font-bold text-foreground leading-tight">
                      {analyzePhoto.data.name}
                    </h3>
                    <span className="calorie-pill px-3 py-1.5 rounded-xl text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0">
                      <Flame size={13} />
                      {analyzePhoto.data.estimatedCalories} cal
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {analyzePhoto.data.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck size={12} className="text-primary" />
                    <span>AI confidence: <strong className="text-foreground">{analyzePhoto.data.confidence}</strong></span>
                  </div>
                </div>

                <div className="flex-1 p-5">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2.5">
                    Identified Ingredients
                  </p>
                  <div className="bg-muted/40 border border-border rounded-xl p-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {analyzePhoto.data.ingredients}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-border flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 text-sm font-medium"
                    onClick={handleReset}
                  >
                    <X size={14} className="mr-2" />
                    Discard
                  </Button>
                  <Button
                    className="flex-[2] h-11 font-semibold gap-2 shadow-sm hover-elevate"
                    onClick={handleSave}
                    disabled={createSavedMeal.isPending}
                  >
                    <Save size={15} />
                    {createSavedMeal.isPending ? "Saving..." : "Save to Journal"}
                  </Button>
                </div>
              </>
            ) : analyzePhoto.isError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                  <AlertCircle size={22} />
                </div>
                <h4 className="font-semibold text-foreground mb-1.5">Analysis failed</h4>
                <p className="text-muted-foreground text-sm mb-5">
                  Couldn't identify food clearly. Try a well-lit photo without obstructions.
                </p>
                <Button variant="outline" onClick={handleReset}>
                  Try Again
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
