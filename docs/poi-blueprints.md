# Gym Tracker — Special Points of Interest: 8 Building Blueprints

Design blueprints for the eight classic FRLG buildings, adapted to the workout-powered
engine (v5.17). Nothing here is built yet — this is the plan we build from, one POI per
version. Two architectural archetypes keep the code small:

- **Service building** — a routed page like MART/CENTER (a hotspot on the town map, an
  official interior image, panels with actions). No new battle code.
- **Dungeon climb** — a floor-by-floor gauntlet that reuses the existing roadblock
  battle engine (`session.wild.tr`) plus a shared "gauntlet" page component: floor
  banner, progress track, FIGHT/CLAIM buttons. Build the component once (first dungeon),
  the other three dungeons are mostly data.

Shared plumbing for all eight:
- **Registry**: `var POIS=[{k,town,unlock(),n,icon,render()}]` → town map hotspots and
  routed pages come from one table, like FEATURES/TOWNS today.
- **State**: one namespace `game.poi = { safari:{...}, dept:{...}, ... }` + a presence
  migration in `migrateState()` + a sanitizer in `applyImport()`.
- **Art direction**: official FRLG interiors and props only (Spriters Resource FRLG
  rips), stored as `map/poi/*.png`, rendered `image-rendering:pixelated` at 100% width
  like the gym halls. White FRLG menu boxes, red-orange frames, Press Start 2P headers.
  Night theme untouched (skins are day-only, same rule as roads).
- **Deploy**: every new PNG goes into the sw.js precache list; bump CACHE.

---

## 1. SAFARI ZONE (Fuchsia) — service + catch minigame park
**Concept.** The catching playground. Pay ₽500 at the gate → your next workout becomes a
SAFARI SESSION: no attacking, only catching. You get 15 SAFARI BALLS (session-scoped,
free). Wilds spawn from an exclusive SAFARI table (Chansey, Tauros, Scyther, Pinsir,
Lickitung, Tangela, Rhyhorn, Dratini at better odds than Fuchsia's overworld).
**Mechanics.** Every set you log = one "step": the current wild may flee (30%), and a new
one appears every few steps. Instead of moves, two authentic actions mapped to lifting:
a HEAVY set (≥ your bodyweight-ish threshold) = ROCK (×1.5 catch, +flee chance), a
high-rep set (≥15 reps) = BAIT (−flee chance, ×0.75 catch). Ball throws reuse
`runThrow()` with a safari multiplier. Session ends at 0 balls or workout end.
**UI.** Gate interior page (NPC clerk, entry button) + in-battle SAFARI panel variant
(green frame, ball counter chip, ROCK/BAIT hint line).
**Data.** `poi.safari={active,ballsLeft,paidTs}`. **Unlock:** badge 5. **Effort:** M.

## 2. CELADON DEPT. STORE — service, 5 floors + roof
**Concept.** The Mart's big brother — a floor-select elevator UI, each floor a themed
shop. Introduces the TM system.
**Floors.** 2F: standard Mart stock. 3F: TM CORNER — buy a move once, teach it to one
mon (replaces one of its four known moves; move list = existing MOVE_TYPES table, priced
by power/type). 4F: EVOLUTION STONES — instant-evolve items for stone families (Eevee,
Pikachu, Vulpix, Growlithe, Oddish/Gloom, Poliwhirl, Shellder, Staryu, Clefairy,
Jigglypuff) as an alternative to level evos. 5F: vitamins (moves the six vitamins here
for flavor; Mart keeps selling them too). ROOF: vending machines — cheap drinks
(Fresh Water/Soda/Lemonade = 30/60/80 HP battle heals, undercutting potions; small daily
stock so potions stay relevant).
**UI.** Elevator floor strip (1F…ROOF tabs) over the official store interior per floor.
**Data.** TMs: `mon.tm=[moveName,...]` merged into `knownMoves()`; stones/drinks in bag.
**Unlock:** badge 4. **Effort:** L (the TM teach/replace modal is the meat).

## 3. GAME CORNER (Celadon) — service + daily slots
**Concept.** Rocket's casino — a real slot machine, coins as a second currency, prize
corner with exclusive rewards. A fun ₽ sink with a daily cap (no grinding, rest-day-safe).
**Mechanics.** Buy COINS (₽100 = 50c). 3 free spins per day + 1 per daily-quest streak
tier. Slot = three CSS reels (7 / pokéball / cherry / magikarp sprites), stepped
`steps()` spin animation, GBA jingles on win. Payouts 2×–100×. PRIZE CORNER: Abra,
Clefairy, Dratini, Scyther/Pinsir at coin prices (authentic FRLG prize list), plus
vitamins and RARE CANDY for coins.
**UI.** Official Game Corner interior; slot machine as a full-width panel; prize
counter page.
**Data.** `poi.corner={coins,date,spinsUsed}`. **Unlock:** badge 4. **Effort:** M.

## 4. TRAINER TOWER (Route 8) — dungeon climb, 8 floors
**Concept.** The pure combat gauntlet. Eight floors, one trainer per floor, levels ramp
from your badge count to badge+10. One floor attempt per workout (each floor is a
roadblock-style fight injected into your session). Clear 8F → big purse + a held item;
tower resets weekly for repeatable endgame content.
**Mechanics.** Reuses `mbFor`-style trainer generation with tower classes (Cooltrainer,
Ace duos). Fleeing/losing a floor keeps your progress; you just retry.
**UI.** Lobby page (receptionist, current floor, weekly timer), floor banner over the
battle panel (`TOWER 5F`), elevator fade between floors (reuse the ferry fade).
**Data.** `poi.tower={floor,weekKey,cleared}`. **Unlock:** badge 3. **Effort:** M
(first dungeon — builds the shared gauntlet component).

## 5. SILPH CO. (Saffron) — dungeon climb, 11 floors, story gauntlet
**Concept.** The big story dungeon: Team Rocket occupies all 11 floors. One floor per
training day. Grunt fights + free item pickups on every floor (potions, balls, a
vitamin), the CARD KEY on 5F unlocks floors 9–11 (visible-but-locked floors give it the
maze feel), Giovanni waits on 11F.
**Reward.** Authentic: the LAPRAS gift on 7F (only non-catchable line otherwise missing
from spawn tables' rare slots) and ONE Master Ball from the president's office —
a single guaranteed catch, once per save.
**UI.** Floor list page (11 rows, lock icons, item markers), official Silph floor art
as the banner per floor.
**Data.** `poi.silph={floor,cardKey,items{},master}`. **Unlock:** badge 6. **Effort:** L.

## 6. ROCKET HIDEOUT (Celadon) — dungeon climb, 4 basements
**Concept.** The prequel dungeon under the Game Corner. Four basement floors; each is a
puzzle-quest + a grunt fight. The spin-tile mazes become training puzzles: "log sets in
3 different muscle groups today" (B1), "finish a workout with 20+ sets" (B2), etc. —
auto-tracked like road quests, with the grunt unlocking after the puzzle.
**Reward.** B4 Giovanni cameo fight → the SILPH SCOPE key item, which the Pokémon Tower
requires (cross-building progression, exactly like the games).
**UI.** Dark hideout palette, arrow-tile banner art, quest rows in the road-quest style.
**Data.** `poi.hideout={floor,scope}`. **Unlock:** badge 4 (pairs with the road-4
Rocket theme). **Effort:** M.

## 7. POKÉMON TOWER (Lavender) — dungeon climb, 7 floors of ghosts
**Concept.** The ghost gauntlet. Lavender isn't one of the nine towns, so the Tower
hangs off the TRAVEL page as a special marker between Vermilion and Celadon. Seven
floors of wild-only fights from a GHOST table (Gastly, Haunter, Cubone); without the
SILPH SCOPE (Hideout reward) floor 3+ shows "the ghost is unidentifiable!" and blocks.
**Set pieces.** The MAROWAK GHOST mini-boss on 6F (not catchable — laid to rest, grants
a CUBONE instead). MR. FUJI on 7F gives the POKÉ FLUTE → wakes a one-time SNORLAX
roadblock encounter (level 30, catchable — the only wild Snorlax ever).
**UI.** Purple/fog palette (day theme), tower floor counter, official tower interior.
**Data.** `poi.tower2={floor,marowak,flute,snorlax}`. **Unlock:** Hideout cleared.
**Effort:** L.

## 8. CINNABAR LAB — service, science wing
**Concept.** The research services building on the volcano isle. Four counters:
1. **Fossil revival** — a second chance at Omanyte/Kabuto for saves that missed the
   collectors, plus the OLD AMBER: revive Aerodactyl by lifting 30,000 kg (raid-style,
   for players who missed the raid).
2. **Nicknames** — rename any mon (`mon.nick`, shown everywhere `DEX[sp].n` is now).
3. **Experiments** — one weekly science quest ("set a PR in any lift", "train 4 days")
   paying a vitamin or ₽ — the endgame's DAILY-style loop.
4. **Trade-in terminal** — swap duplicate caught species for RARE CANDY/₽ (a dupe sink
   that makes re-catching commons worthwhile).
**UI.** Official lab interior, four NPC hotspots, one panel per counter.
**Data.** `poi.lab={weekKey,expDone,amber}`. **Unlock:** badge 7. **Effort:** M.

---

## Suggested build order
1. **Trainer Tower** (builds the shared gauntlet component, self-contained)
2. **Game Corner** (small, high fun-per-line, tests the coin sub-currency)
3. **Rocket Hideout** → 4. **Pokémon Tower** (the Scope/Flute chain)
5. **Safari Zone** (extends the new catch minigame)
6. **Dept. Store** (TM system — biggest new system, do it when stable)
7. **Silph Co.** (longest content, reuses everything above)
8. **Cinnabar Lab** (endgame services, best saved for when dupes/fossils matter)

Each ships as its own version with the usual drill: sw CACHE bump, version string bump,
preview test on port 8377, deploy verify.
