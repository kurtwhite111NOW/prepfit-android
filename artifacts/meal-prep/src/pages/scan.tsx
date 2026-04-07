import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useAnalyzeMealPhoto, useCreateSavedMeal, getListSavedMealsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Upload, ScanLine, AlertCircle, Save, X, Flame, Search, ChevronRight } from "lucide-react";

export default function Scan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const analyzePhoto = useAnalyzeMealPhoto();
  const createSavedMeal = useCreateSavedMeal();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      
      // Send to API
      analyzePhoto.mutate({
        data: {
          imageBase64: base64String
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!analyzePhoto.data || !imagePreview) return;

    createSavedMeal.mutate({
      data: {
        name: analyzePhoto.data.name,
        description: analyzePhoto.data.description,
        estimatedCalories: analyzePhoto.data.estimatedCalories,
        ingredients: analyzePhoto.data.ingredients,
        imageData: imagePreview
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Meal Saved!",
          description: "Added to your personal meal history."
        });
        queryClient.invalidateQueries({ queryKey: getListSavedMealsQueryKey() });
        setLocation("/meals");
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error saving meal",
          description: "There was a problem saving your photo."
        });
      }
    });
  };

  const handleReset = () => {
    setImagePreview(null);
    analyzePhoto.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <section className="space-y-2 text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
          <ScanLine className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
          Scan Your Meal
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Snap a photo and let AI identify your meal, estimate calories, and list ingredients.
        </p>
      </section>

      {!imagePreview ? (
        <Card className="border-dashed border-2 border-border bg-background shadow-none overflow-hidden transition-colors hover:border-primary/50 hover:bg-secondary/20 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center relative">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <div className="flex gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-md hover-elevate">
                <Camera size={28} />
              </div>
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-foreground shadow-sm hover-elevate border border-border">
                <Upload size={28} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Tap to take a photo</h3>
            <p className="text-muted-foreground max-w-sm">
              Use your camera or upload an image from your gallery.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-[1fr_1fr] gap-6 animate-in slide-in-from-bottom-4">
          {/* Photo Preview */}
          <Card className="overflow-hidden border-border bg-card shadow-md flex flex-col">
            <div className="relative aspect-[3/4] md:aspect-auto md:flex-1 bg-black overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Meal preview" 
                className="w-full h-full object-cover"
              />
              
              {analyzePhoto.isPending && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-primary">
                      <Search className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="font-serif text-xl font-medium text-foreground">Analyzing Food...</p>
                  <p className="text-sm text-muted-foreground mt-2">Identifying ingredients and calories</p>
                </div>
              )}
            </div>
          </Card>

          {/* Analysis Results */}
          <Card className="border-border shadow-md flex flex-col h-full">
            {analyzePhoto.isPending ? (
              <div className="p-8 flex flex-col h-full justify-center space-y-6 opacity-50">
                <div className="space-y-3">
                  <div className="h-8 bg-secondary rounded-md w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-secondary rounded-md w-full animate-pulse"></div>
                  <div className="h-4 bg-secondary rounded-md w-5/6 animate-pulse"></div>
                </div>
                <div className="h-12 bg-secondary rounded-xl w-1/3 animate-pulse"></div>
                <div className="space-y-3 pt-6 border-t border-border">
                  <div className="h-4 bg-secondary rounded-md w-1/4 animate-pulse"></div>
                  <div className="h-20 bg-secondary rounded-xl w-full animate-pulse"></div>
                </div>
              </div>
            ) : analyzePhoto.data ? (
              <>
                <CardHeader className="pb-4 bg-secondary/30 border-b border-border">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-2xl font-serif text-foreground leading-tight">
                      {analyzePhoto.data.name}
                    </CardTitle>
                    <div className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shrink-0 shadow-sm">
                      <Flame className="w-4 h-4" />
                      {analyzePhoto.data.estimatedCalories} <span className="font-normal text-xs uppercase tracking-wide opacity-80">kcal</span>
                    </div>
                  </div>
                  <CardDescription className="text-base mt-2 text-foreground/80">
                    {analyzePhoto.data.description}
                  </CardDescription>
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border mt-3 w-fit">
                    <AlertCircle className="w-3 h-3" />
                    AI Confidence: {analyzePhoto.data.confidence}
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex-1">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      Identified Ingredients
                    </h4>
                    <div className="bg-background rounded-xl p-4 border border-border shadow-sm">
                      <p className="text-foreground leading-relaxed">
                        {analyzePhoto.data.ingredients}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-secondary/20 border-t border-border p-4 gap-3">
                  <Button variant="outline" className="flex-1 h-12 bg-background hover:bg-secondary" onClick={handleReset}>
                    <X className="w-4 h-4 mr-2" /> Discard
                  </Button>
                  <Button className="flex-[2] h-12 shadow-md hover-elevate gap-2" onClick={handleSave} disabled={createSavedMeal.isPending}>
                    <Save className="w-5 h-5" />
                    {createSavedMeal.isPending ? "Saving..." : "Save to Journal"}
                  </Button>
                </CardFooter>
              </>
            ) : analyzePhoto.isError ? (
              <CardContent className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't clearly identify the food in this image. Please try another photo with better lighting.
                </p>
                <Button variant="outline" onClick={handleReset}>Try Again</Button>
              </CardContent>
            ) : null}
          </Card>
        </div>
      )}
    </div>
  );
}
