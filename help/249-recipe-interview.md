# Recipe Interview

The **Recipe Interview** makes the Recipe by asking you about it, one page at a time (Skynet Rule 17.22): every amount, every time
and every temperature, like the things a BeerSmith file carries. Open it with **🧭 INTERVIEW** on **☰ Menu > Recipe** (beside IMPORT
and NEW), or with **🧭 Recipe Interview** on the **No Recipe Found** pop-up of a Brew Day.

## The branches

The answers pick the questions that come next:

1. **Do you have a Recipe file (BeerXML or BeerSmith) to IMPORT?** Yes: the Recipe tab opens and asks for the file (IMPORT reads the
   whole Recipe). No: the interview goes on.
2. **Is this an Extract Kit?** Yes: the **Extract Kit** questions.
3. **Is this All Grain?** Yes: the **All Grain** questions. No: **What are you making?** (Kombucha, Ginger Beer, Cider, Mead, Hard
   Seltzer, Wine Kit, Other ...) and the **Other Brews** questions.

Every branch then asks **Ferment** (yeast, starter, aerate, pitch, primary, secondary, dry hops, cold crash), **Package** (bottles and
priming sugar, or a keg) and **Brew Day** (date and time, the Actual AAU of each hop, everything in hand).

Some questions only come when they fit: steeping grains only for a kit with steeping grains, hops not for a Can Kit, "Is the grain
milled?" only when your Brewer Type is All Grain (own Grain Mill), the nutrient schedule only for Mead.

## How it works

- Each page has its question, a short explanation, and its boxes. A choice of 6 or fewer is a box: one click picks it. More than 6 is a
  dropdown (Rule 2.6).
- A list (each extract, each grain, each hop ...) is a table: **➕ Add another** adds a row, **🗑** takes one out.
- Amounts are typed in your **Units** (gallons, pounds, ounces, °F, or liters, kilograms, grams, °C). Skynet keeps them in metric
  (Rule 2.59).
- **◀ Back** goes to the page before, **Skip** leaves a page empty, **Next ▶** goes on. The first questions, the ones that pick the
  branch, have no Skip.
- **Done** shows every page you answered, with **✎** to go back to it. **✔ Finish** makes the Recipe at its Level (a Can Kit is Level
  1, an Extract with Hops Level 2, with Steeping Grains Level 3, All Grain Level 4, Other Brews Level 1) and opens it on the Recipe
  tab. **Close** or **✕** changes nothing.

On the Recipe tab, **Calculate** and **Save** work as always. **Library ... > 💾 Save this Recipe** keeps it in the library to use
again (Rule 17.21). A Brew Day waiting on **No Recipe Found** goes on once the interview's Recipe is made.

## Answers with no Recipe box yet

Some answers have no box on the Recipe tab yet: when each extract goes in (for example 1 lb of DME 15 minutes before the end), the
steep water and temperature, the extract add temperature, the water boil for a No Boil kit, the chill temperature and method, the
fermenter pre-fill, the rehydrate water, aerate, primary and secondary temperatures and days, cold crash, priming sugar or keg, and
conditioning. Skynet keeps them with the Recipe (in metric), so nothing you typed is lost, and they are ready for the Brew Day steps
that will use them.

## Adding questions

The questions are a list in `public/recipeinterview.js`, numbered as in the plan: R1 to R3, E1 to E17, A1 to A17, O1 to O8, F1 to
F10 and B1 to B3. A new question gets the next free number of its branch, or a letter (E7a). Numbers are only names and never need
renumbering.
