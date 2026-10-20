# Mash and Boil Profiles

Mash Profiles and Boil Profiles are kept on their own, so any Recipe can use any of them. A Recipe picks one of each from a dropdown (coming next), and the **Default** Menu tab says which ones a new Recipe starts with. They are saved on the Brain in `config/profiles/mash` and `config/profiles/boil`.

## Mash Profile

Press **☰ Menu** and pick **Mash Profile**.

- **Add new ...** in the **Open** dropdown makes one. Start from one step at 152 °F (67 °C) for 60 minutes, or a copy of another.
- Up to **4 steps**, each with a **Name**, **Temperature** and **Time** in minutes. Leave a step empty if you don't need it.
- **Mash out temperature** (empty means no mash out).
- **Sparge**: **Fly sparge**, **Batch sparge** (with a **rest time** in minutes), or **No sparge** (full volume).
- **Sparge water temperature**.

Press **Save**. **Delete** removes it.

## Boil Profile

Press **☰ Menu** and pick **Boil Profile**.

- **Total boil time** in minutes.
- **Boil off**: how much boils away each hour, in gallons or liters. This used to be in the Equipment Profile.

Press **Save**. The **Check the volumes** box on the Equipment Profile tab can use any Boil Profile.

Temperatures and volumes follow the profile's **Units**: US (°F, gallons) or Metric (°C, liters).
