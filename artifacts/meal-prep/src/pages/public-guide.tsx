import { PublicLayout } from "@/components/public-layout";
import { usePageTitle } from "@/hooks/use-page-title";
import { CheckCircle2, ExternalLink } from "lucide-react";

export default function PublicGuide() {
  usePageTitle("Meal prep apps for the gym: how they work, what they cost, and which to use", "A meal prep app builds a week of meals around your calorie and macro targets, then generates the grocery list and cook plan.");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://prepfit.fit/meal-prep-app-guide#article",
        "headline": "Meal prep apps for the gym: how they work, what they cost, and which to use",
        "description": "A meal prep app builds a week of meals around your calorie and macro targets, then generates the grocery list and cook plan. Planning versus tracking, protein targets, food safety limits, costs and a five-app comparison.",
        "url": "https://prepfit.fit/meal-prep-app-guide",
        "mainEntityOfPage": { "@type": "WebPage", "@id": "https://prepfit.fit/meal-prep-app-guide" },
        "inLanguage": "en-US",
        "datePublished": "2026-09-15T00:00:00Z",
        "dateModified": "2026-09-15T00:00:00Z",
        "author": {
          "@type": "Organization",
          "name": "PrepFit",
          "url": "https://prepfit.fit/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "PrepFit",
          "url": "https://prepfit.fit/"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://prepfit.fit/meal-prep-app-guide#faq",
        "url": "https://prepfit.fit/meal-prep-app-guide",
        "inLanguage": "en-US",
        "isPartOf": { "@id": "https://prepfit.fit/meal-prep-app-guide#article" },
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the 3-3-3 rule for meal prep?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It is a popular shorthand for prepping three proteins, three starches and three vegetables, then mixing them into different combinations across the week. It is a structural trick for avoiding boredom, not a nutrition standard, and no official body publishes it. It works well alongside a macro target rather than instead of one."
            }
          },
          {
            "@type": "Question",
            "name": "How long does meal prepped food last in the fridge?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "USDA Food Safety and Inspection Service guidance is 3 to 4 days for cooked leftovers stored at 40F or below, and 3 to 4 months in the freezer. Refrigerate within two hours of cooking, or within one hour if the room is above 90F. Reheat to an internal temperature of 165F."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need a meal prep app if I already use MyFitnessPal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Possibly, because they do different jobs. MyFitnessPal logs what you ate after the fact; a meal prep app decides what you will cook before you shop. If your logs are accurate but your food choices are chaotic, adding a planner is the change that helps."
            }
          },
          {
            "@type": "Question",
            "name": "Can an app calculate my macros for me?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, and most do, using your height, weight, age, activity level and goal. Treat the output as a starting estimate. The International Society of Sports Nutrition protein range of 1.4 to 2.0 g per kg of body weight per day is the evidence-based anchor for the protein figure; adjust calories from your weight trend over three to four weeks rather than from a single week."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a free meal prep app?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Mealime and Eat This Much both have free tiers, and several apps offer trials. Free tiers usually restrict the feature that matters most to lifters, which is planning to an exact macro target rather than a generic diet type, so test that specific capability during the trial."
            }
          },
          {
            "@type": "Question",
            "name": "Does a meal prep app work without the App Store?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A web-based app does. PrepFit runs in a browser, so you can build a plan on a desktop and open the same plan on a phone with no install and no store account. Native apps require a download and store billing."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate is scanning food with a phone camera?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Barcode scanning reads a published label and is accurate. Photo estimation of a plated meal is approximate because portion size is inferred from an image. Use scanning for food you did not cook and could not weigh, and weigh the food you prep yourself."
            }
          }
        ]
      }
    ]
  };

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="container mx-auto px-6 py-16 max-w-3xl animate-in fade-in duration-500">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.15] text-foreground">
            Meal prep apps for the gym: how they work, what they cost, and which to use
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium pb-8 border-b border-border/50">
            <span className="font-bold text-foreground">Published by PrepFit</span>
            <span>•</span>
            <div>Updated September 15, 2026</div>
          </div>
        </header>

        <article className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:font-semibold">
          
          <p className="lead text-xl font-medium text-muted-foreground">
            A meal prep app builds a week of meals around your calorie and macro targets, then generates the grocery list and cook plan to execute it. For gym-goers the useful split is planning versus tracking: planners tell you what to cook, trackers verify what you ate. Pick a planner if your problem is deciding; pick a tracker if your problem is honesty.
          </p>

          <div className="bg-card border border-border/50 rounded-2xl p-8 my-10 shadow-sm">
            <h2 className="text-xl font-bold mt-0 mb-4 flex items-center gap-2 text-foreground">
              <CheckCircle2 className="text-primary" size={20} />
              Key takeaways
            </h2>
            <ul className="space-y-3 m-0 p-0 list-none text-base font-medium text-muted-foreground">
              <li className="flex gap-3"><span className="text-primary mt-0.5">•</span> <span>Planning apps and tracking apps solve different problems. Most people who quit meal prep quit because they picked the wrong one.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-0.5">•</span> <span>The International Society of Sports Nutrition's position stand puts daily protein at 1.4–2.0 g per kg of body weight for exercising individuals, with strength and power athletes at the top of that range.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-0.5">•</span> <span>USDA Food Safety and Inspection Service guidance is 3 to 4 days in the refrigerator for cooked leftovers, which caps a single cook session at roughly four days of meals unless you freeze.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-0.5">•</span> <span>Prices in the US range from genuinely free tiers to about $72 a year; MacroFactor lists its Nutrition + Workouts bundle at $89.99 a year on its own site.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-0.5">•</span> <span>Scanning a photo of a meal is fast but approximate. Use it for restaurant food and unlabelled meals, not for the meals you prep yourself and can weigh.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-0.5">•</span> <span>A web app avoids the App Store entirely, which matters if you want to start on a laptop and continue on a phone without installing anything.</span></li>
            </ul>
          </div>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">What is a meal prep app?</h2>
          <p className="text-muted-foreground">
            A meal prep app turns a calorie and macro target into a concrete week of food: recipes chosen to hit the numbers, portion sizes scaled to your body weight, a grocery list grouped by aisle, and a cook order for prep day. The distinguishing feature against a recipe app is that the plan is generated from the target rather than assembled and then measured.
          </p>
          <p className="text-muted-foreground">
            PrepFit sits in this category. It generates a plan from your goal, scans meals to estimate their calories and macros, keeps a grocery list, and tracks water and weight against the plan — in a browser, with a three-day free trial and no App Store install.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">How does a meal plan generator build a plan around your macros?</h2>
          <p className="text-muted-foreground">
            It solves a constraint problem: pick a combination of recipes and portion sizes whose totals land inside your calorie and macro band, subject to your dislikes, allergies, and how many meals you want to cook.
          </p>
          <p className="text-muted-foreground">
            In practice the sequence is: estimate maintenance calories from your stats and activity, apply a surplus or deficit for the goal, split the calorie figure into protein, carbohydrate and fat targets, then fill those targets from a recipe database with scalable portions. Protein is usually pinned first because it is the constraint with a floor, and carbohydrate and fat absorb the remainder. The quality difference between apps is almost entirely in the recipe database and how finely portions can be scaled — an app that only offers fixed servings will miss your targets by more than one that scales grams.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">How much protein should you actually eat?</h2>
          <p className="text-muted-foreground">
            The ISSN position stand on protein and exercise (Jäger et al., 2017, Journal of the International Society of Sports Nutrition) states that 1.4–2.0 g of protein per kg of body weight per day is sufficient for most exercising individuals to build and maintain muscle.
          </p>
          <p className="text-muted-foreground">
            Within that range, the ISSN places endurance athletes at the lower end, intermittent-sport athletes in the middle, and strength and power athletes at the upper end. It also notes that resistance-trained people in a calorie deficit may need 2.3–3.1 g/kg/day to protect lean mass, and recommends roughly 0.25 g/kg per serving or an absolute dose of 20–40 g, distributed every 3–4 hours.
          </p>
          <p className="text-muted-foreground">
            For an 80 kg lifter, that is 112–160 g a day, in four meals of roughly 25–40 g each. Any app worth paying for should let you set the per-day figure directly rather than inferring it from a diet label.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">How do you meal prep a week for the gym?</h2>
          <p className="text-muted-foreground">
            Cook two sessions rather than one, three to four days apart, and build every meal from a protein, a starch, a vegetable, and a sauce that changes.
          </p>
          <p className="text-muted-foreground">
            The two-session structure exists because of food safety, not preference. Cook on Sunday and Wednesday, portion into containers immediately, and refrigerate within two hours. Cook proteins to safe internal temperatures — 165°F for poultry, 160°F for ground meat, 145°F for whole cuts with a three-minute rest — and reheat everything to 165°F. Batch the starch and vegetable components separately from the protein so you can recombine them into different meals; this is what stops week three from tasting like week one.
          </p>
          <p className="text-muted-foreground">
            Use the app for the parts that are arithmetic: portion weights, the grocery list, and the running total against your macro target. Use your own judgement for what you actually want to eat, because adherence beats optimisation.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">How do you set macros for a bulk or a cut?</h2>
          <p className="text-muted-foreground">
            Set protein first from the ISSN range, set fat at a floor that keeps you functional, and let carbohydrate take the rest of the calorie budget in whichever direction the goal moves.
          </p>
          <p className="text-muted-foreground">
            For a lean gaining phase, a modest surplus over maintenance is standard practice; for a cut, a modest deficit with protein held at the top of the ISSN range or above. The specific surplus or deficit size is contested and depends on training age and how much fat gain you will tolerate, so treat any single number an app gives you as a starting point and adjust from the scale trend over three to four weeks, not from one weigh-in.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">How accurate is scanning a meal for calories?</h2>
          <p className="text-muted-foreground">
            Photo and barcode scanning is accurate for packaged food and useful but approximate for cooked meals. The barcode path reads a published nutrition label; the photo path estimates portion size from an image, which is the error-prone step.
          </p>
          <p className="text-muted-foreground">
            Use scanning where weighing is impossible — restaurant meals, food someone else cooked, a snack at work. For the meals you prep yourself, weighing the protein and starch on a scale during prep day is both faster and more accurate, and it is a one-time cost per batch rather than per meal. Treat scan output as a good estimate, not a measurement.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">Meal prep app vs macro tracker: which do you need?</h2>
          <p className="text-muted-foreground">
            A planner answers "what should I cook this week"; a tracker answers "what did I actually eat". If your food is boring and repetitive but you still are not progressing, you need a tracker. If you know the numbers but keep ordering takeaway at 7pm, you need a planner.
          </p>
          <p className="text-muted-foreground">
            Most people eventually want both, and the simplest route is a planner that also logs intake against the generated plan, rather than two separate apps. Planning before you shop gives every meal a purpose, while tracking shows how closely the week matched the plan.
          </p>

          <h2 className="text-2xl mt-12 mb-6 text-foreground">Comparison: five meal prep and macro apps</h2>
          
          <div className="overflow-x-auto my-8 pb-4">
            <table className="w-full text-sm text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-muted border-y border-border">
                  <th className="p-4 font-bold text-foreground">App</th>
                  <th className="p-4 font-bold text-foreground">Primary job</th>
                  <th className="p-4 font-bold text-foreground">Builds plan to macro target</th>
                  <th className="p-4 font-bold text-foreground">Logs intake</th>
                  <th className="p-4 font-bold text-foreground">Platform</th>
                  <th className="p-4 font-bold text-foreground">US price (verify before buying)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-bold text-foreground">PrepFit</td>
                  <td className="p-4 text-muted-foreground">Plan + track for gym-goers</td>
                  <td className="p-4 text-muted-foreground">Yes</td>
                  <td className="p-4 text-muted-foreground">Yes, incl. meal scan</td>
                  <td className="p-4 text-muted-foreground">Web, no install</td>
                  <td className="p-4 text-muted-foreground">3-day free trial; current pricing on site</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-bold text-foreground">MealPrepPro</td>
                  <td className="p-4 text-muted-foreground">Meal prep planning</td>
                  <td className="p-4 text-muted-foreground">Yes, to calories and macros</td>
                  <td className="p-4 text-muted-foreground">Limited</td>
                  <td className="p-4 text-muted-foreground">iOS, Android</td>
                  <td className="p-4 text-muted-foreground">7-day free trial; approx. $5/month</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-bold text-foreground">MacroFactor</td>
                  <td className="p-4 text-muted-foreground">Adaptive macro tracking</td>
                  <td className="p-4 text-muted-foreground">No, sets targets not menus</td>
                  <td className="p-4 text-muted-foreground">Yes</td>
                  <td className="p-4 text-muted-foreground">iOS, Android</td>
                  <td className="p-4 text-muted-foreground">Bundle $89.99/yr (per their site); standalone $71.99/yr</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-bold text-foreground">Eat This Much</td>
                  <td className="p-4 text-muted-foreground">Automated plan generation</td>
                  <td className="p-4 text-muted-foreground">Yes</td>
                  <td className="p-4 text-muted-foreground">Partial</td>
                  <td className="p-4 text-muted-foreground">Web, iOS, Android</td>
                  <td className="p-4 text-muted-foreground">Free tier plus paid</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-bold text-foreground">Mealime</td>
                  <td className="p-4 text-muted-foreground">Fast weeknight cooking</td>
                  <td className="p-4 text-muted-foreground">No</td>
                  <td className="p-4 text-muted-foreground">No</td>
                  <td className="p-4 text-muted-foreground">iOS, Android</td>
                  <td className="p-4 text-muted-foreground">Free tier plus paid</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2 mb-10">
            Pricing moves and varies by region and store. The MacroFactor bundle figure is from macrofactor.com; the MealPrepPro figure is from mealpreppro.com's own FAQ. Treat every other price as directional and confirm at the source.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">What do meal prep apps cost, and is there a free one?</h2>
          <p className="text-muted-foreground">
            Free tiers exist and are real — Mealime and Eat This Much both offer one — but they generally cap the feature that gym-goers need most, which is planning to a specific macro target rather than a diet label.
          </p>
          <p className="text-muted-foreground">
            Paid tiers cluster between roughly $5 and $12 a month, with annual plans cutting the effective monthly rate by half or more. MacroFactor is the notable outlier with no free tier at all. If you are deciding, the honest test is whether you will still be logging in week six; a free trial long enough to cover one full prep cycle tells you more than a feature list.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">Why do people quit meal prep, and what actually goes wrong?</h2>
          <p className="text-muted-foreground">
            The three recurring failures are food that goes bad, food that gets boring, and a plan that assumes more cooking time than you have.
          </p>
          <p className="text-muted-foreground">
            Food safety sets the hard limit: USDA FSIS puts cooked leftovers at 3 to 4 days refrigerated, or 3 to 4 months frozen, with the refrigerator at 40°F or below. A seven-day single cook is not a plan, it is a risk. Boredom is solved structurally by varying sauce and seasoning rather than the whole meal. And time is solved by being honest in setup — if you will realistically cook twice a week for 45 minutes, tell the app that, because a plan built for three-hour Sundays gets abandoned in week two.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">What is the best meal prep app right now?</h2>
          <p className="text-muted-foreground">
            There is no single best one, and the honest answer is a rule rather than a name: choose a planner if your bottleneck is deciding what to eat, a tracker if your bottleneck is knowing what you ate, and a combined app if you want one subscription.
          </p>
          <p className="text-muted-foreground">
            Generic reviews often name MealPrepPro for fitness goals, Mealime for speed, Paprika for recipe organisation, Plan to Eat for family calendars and Eat This Much for automated diets. The real answer depends on your goal and budget. Match the app to the bottleneck.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">What is the best meal prep app for bodybuilding?</h2>
          <p className="text-muted-foreground">
            For bodybuilding specifically, the requirement narrows: the app must let you set a protein figure in grams, scale portions by weight rather than servings, and hold that target across a bulk and a cut without you rebuilding the plan.
          </p>
          <p className="text-muted-foreground">
            On search engines, the apps that surface are often MealPrepPro, Gaintrain, Strongr Fastr and Fitia. PrepFit's angle here is that it is built around the gym use case by default and runs in a browser, so a plan built on a laptop opens on the gym floor without an install.
          </p>

          <h2 className="text-2xl mt-12 mb-4 text-foreground">What changed in meal prep apps recently?</h2>
          <p className="text-muted-foreground">
            Two things: photo-based meal scanning moved from novelty to baseline, and pricing consolidated around annual subscriptions rather than one-off purchases.
          </p>
          <p className="text-muted-foreground">
            The competitive effect is that recipe volume no longer differentiates anyone. What separates apps now is how precisely a plan can be pinned to a macro target and how little friction there is in logging against it. This is worth restating, because most older roundups were written against the previous generation of features.
          </p>

          <hr className="my-12 border-border/50" />

          <h2 className="text-3xl mb-8 text-foreground">FAQ</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-foreground">What is the 3-3-3 rule for meal prep?</h3>
              <p className="text-muted-foreground mt-2">It is a popular shorthand for prepping three proteins, three starches and three vegetables, then mixing them into different combinations across the week. It is a structural trick for avoiding boredom, not a nutrition standard, and no official body publishes it. It works well alongside a macro target rather than instead of one.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground">How long does meal prepped food last in the fridge?</h3>
              <p className="text-muted-foreground mt-2">USDA Food Safety and Inspection Service guidance is 3 to 4 days for cooked leftovers stored at 40°F or below, and 3 to 4 months in the freezer. Refrigerate within two hours of cooking, or within one hour if the room is above 90°F. Reheat to an internal temperature of 165°F.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground">Do I need a meal prep app if I already use MyFitnessPal?</h3>
              <p className="text-muted-foreground mt-2">Possibly, because they do different jobs. MyFitnessPal logs what you ate after the fact; a meal prep app decides what you will cook before you shop. If your logs are accurate but your food choices are chaotic, adding a planner is the change that helps.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground">Can an app calculate my macros for me?</h3>
              <p className="text-muted-foreground mt-2">Yes, and most do, using your height, weight, age, activity level and goal. Treat the output as a starting estimate. The International Society of Sports Nutrition protein range of 1.4 to 2.0 g per kg of body weight per day is the evidence-based anchor for the protein figure; adjust calories from your weight trend over three to four weeks rather than from a single week.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground">Is there a free meal prep app?</h3>
              <p className="text-muted-foreground mt-2">Yes. Mealime and Eat This Much both have free tiers, and several apps offer trials. Free tiers usually restrict the feature that matters most to lifters, which is planning to an exact macro target rather than a generic diet type, so test that specific capability during the trial.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground">Does a meal prep app work without the App Store?</h3>
              <p className="text-muted-foreground mt-2">A web-based app does. PrepFit runs in a browser, so you can build a plan on a desktop and open the same plan on a phone with no install and no store account. Native apps require a download and store billing.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground">How accurate is scanning food with a phone camera?</h3>
              <p className="text-muted-foreground mt-2">Barcode scanning reads a published label and is accurate. Photo estimation of a plated meal is approximate because portion size is inferred from an image. Use scanning for food you did not cook and could not weigh, and weigh the food you prep yourself.</p>
            </div>
          </div>

          <div className="mt-16 p-6 bg-muted/30 rounded-2xl border border-border/50 text-sm text-muted-foreground">
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider">Sources & Citations</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-primary transition-colors">
                  <ExternalLink size={14} className="shrink-0 mt-0.5" />
                  <span>Jäger R. et al., International Society of Sports Nutrition Position Stand: protein and exercise, Journal of the ISSN, 2017</span>
                </a>
              </li>
              <li>
                <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-primary transition-colors">
                  <ExternalLink size={14} className="shrink-0 mt-0.5" />
                  <span>USDA Food Safety and Inspection Service, Leftovers and Food Safety</span>
                </a>
              </li>
              <li>
                <a href="https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-primary transition-colors">
                  <ExternalLink size={14} className="shrink-0 mt-0.5" />
                  <span>FoodSafety.gov, Cold Food Storage Charts</span>
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2">
                  <ExternalLink size={14} className="shrink-0 mt-0.5" />
                  <span>Official product pricing pages reviewed September 2026. Prices and plan details can change.</span>
                </span>
              </li>
            </ul>
          </div>

        </article>
      </div>
    </PublicLayout>
  );
}
