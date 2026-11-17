# Sound copyright check (2026-11-17)

OakBarn Brewery asked: "Every thing with a possible copyright violation needs to be listed and changed to a non copyright
version. I know that many of the Audio files I used in BruControl are copyrighted and we will need to substitute a Skynet
written one." This page is that list for **sounds** (pictures are checked in their own list). The record of every file stays
[Media_Licenses.csv](Media_Licenses.csv) (Rule 9.12); this page is the plain-English summary.

## The short answer

- **Skynet itself is clean.** The Skynet project on GitHub, and every Setup ever built from it (plain Setup, Full Setup, Media
  Setup, panel zip and Media zip), has only ever held 5 sounds, and all 5 are OakBarn Brewery's own or computer-made. Checked:
  every file the project's history has ever added, and every file on every Release. No copyrighted sound was ever in the public
  project, so **nothing has to be removed and the project's history does not need rewriting.**
- **The copyrighted sounds are in OakBarn Brewery's BruControl media** (C:\BruControl\Media) and in the private project files
  (Sandbox_Audio). They never ship. They only matter when the OakBarn BruControl setup is moved to Skynet, so each one gets a
  Skynet replacement below.
- **New:** 8 Skynet sound effects made by the computer from plain math (no recording in them), to replace the risky sound
  effects. They are in `media/sounds/Skynet` and come with the next Media Setup and the Full Setup.

## Risk ratings

- **None:** Skynet's own (computer-made) or OakBarn Brewery's own.
- **Low:** OakBarn Brewery's own, but one thing on the license is still to be written down.
- **High:** made by someone else (record label, film studio, cartoon, Pixabay) or source unknown. Never ships.

## 1. Sounds that ship with Skynet

| Sound | What it is | Made by | Risk | Note |
|---|---|---|---|---|
| alarm_beep.wav | Two-tone alarm beep | Computer-made tones | None | |
| Alarm_Sound_Missing.mp3 | Voice: the Alarm sound is missing | OakBarn Brewery, text to speech | Low | Name the voice service in Media_Licenses.csv |
| Skynet_Manifold_Rhyme_Voice.mp3 | Voice: the "connected to the valve" rhyme | OakBarn Brewery, text to speech | Low | Name the voice service. The rhyme copies the pattern of the old song "Dem Bones" (1928, now public domain in the US) with new words, so no problem |
| Find_The_File_Connecting.mp3 | Song, 76 s | OakBarn Brewery on Treblo | Low | Treblo's terms could not be read online today; OakBarn Brewery says Treblo says free to use |
| Skynet_Outlet_to_Valve.mp3 | Song, 3 min 47 s | OakBarn Brewery on Treblo | Low | Its Media_Licenses.csv row wrongly said "voice clip"; fixed |
| Skynet_Tower_Chime.mp3 | **New.** Tower clock chime, 22 s | Computer-made (tune from 1793, public domain) | None | Replaces chime_big_ben.wav |
| Skynet_Drum_Roll_Rimshot.mp3 | **New.** Drum roll and cymbal, 5 s | Computer-made | None | Replaces drum_roll_rimshot.wav |
| Skynet_Fanfare.mp3 | **New.** Short brass fanfare, 3.5 s | Computer-made, Skynet's own notes | None | Replaces fanfare3.wav |
| Skynet_Trumpet_Call.mp3 | **New.** Bugle-style call, 3 s | Computer-made, Skynet's own notes | None | Replaces trumpet_x.wav |
| Skynet_Flowing_Water.mp3 | **New.** Running water, 8 s | Computer-made | None | Replaces the Pixabay flowing water |
| Skynet_Siren.mp3 | **New.** Siren and two horn blasts, 7 s | Computer-made | None | Replaces the Pixabay fire trucks |
| Skynet_Alien_Warning.mp3 | **New.** Space-alien warning tone, 4 s | Computer-made | None | Replaces warning_alien.wav |
| Skynet_News_Bulletin.mp3 | **New.** News-flash beeps, 2 s | Computer-made | None | The tone half of we_interrupt.wav |

The 8 new sounds are made by `tools/make-skynet-sounds.py`; running it again makes the very same files. Media stays add-only
(Rule 9.12): a better version later gets a new name.

## 2. OakBarn BruControl sounds that must never ship, and their Skynet replacement

### Sound effects (replacement made now)

| BruControl sound | Why it is a risk | Skynet replacement | Risk of the replacement |
|---|---|---|---|
| chime_big_ben.wav | Source unknown | Skynet_Tower_Chime.mp3 | None |
| drum_roll_rimshot.wav | Source unknown | Skynet_Drum_Roll_Rimshot.mp3 | None |
| fanfare3.wav | Source unknown | Skynet_Fanfare.mp3 | None |
| trumpet_x.wav | Source unknown | Skynet_Trumpet_Call.mp3 | None |
| gugunxyz-flowing-water-01-461099.wav | Pixabay (may not be handed out as a file) | Skynet_Flowing_Water.mp3 | None |
| two-fire-trucks-70776 (3).wav | Pixabay | Skynet_Siren.mp3 | None |
| warning_alien.wav | Source unknown | Skynet_Alien_Warning.mp3 | None |

### Film, TV and cartoon quotes (new words written; OakBarn Brewery makes the voice)

A quote from a film or cartoon belongs to the studio. Each replacement below has **new words**, so it can be made with
OakBarn Brewery's text to speech voice service, the same way as Alarm_Sound_Missing.mp3. Send the clip and Claude adds it to
`media/sounds/Skynet` with its Media_Licenses.csv row. Change the words as you like; they only must not copy the quote.

| BruControl sound | Why it is a risk | Skynet replacement (name) | Words to speak |
|---|---|---|---|
| autdestruct.wav | Film/TV quote | Skynet_Voice_Self_Destruct.mp3 | "Warning. This brewery will self destruct in ten seconds. Just kidding. Please check the brew." |
| boldly_go.wav | Film/TV quote | Skynet_Voice_Onward.mp3 | "Brewers, onward! A new batch is waiting." |
| sorry_dave.wav | Film quote | Skynet_Voice_Not_Safe.mp3 | "Skynet says no. That step is not safe right now. Please check the brewery." |
| heigh-ho ... off to work we go.wav | Film song | Skynet_Voice_Off_To_Brew.mp3 | "Time to brew! Off to the brew house we go." |
| porkypigthatAll.wav | Cartoon voice and catch phrase (copyright and trademark) | Skynet_Voice_Brew_Day_Done.mp3 | "And that is the end of brew day. Cheers!" |
| we_interrupt.wav | Source unknown | Skynet_News_Bulletin.mp3 (made), then Skynet_Voice_Interrupt.mp3 | "We interrupt this brew day for an important message from your brewery." |

### Songs (OakBarn Brewery's own Treblo songs)

These are commercial recordings. Their replacements are OakBarn Brewery's own songs made on Treblo, as already planned in
Media_Licenses.csv. Already assigned: Cotton Eyed Joe (both) -> Meet_Me_By_The_Brew_Kettle; Doin The Newfie Stomp ->
Raise_the_Song_by_the_Brew_Kettle; Ein Prosit -> Prost_auf_Freundschaft; Stimmung Is Die Erste Bürgerpflicht ->
Unser_Brautag_Marsch; Kaiser Wilhelm's Hitparade No. 1 -> Unser_Brautag_Marsch_2; Gassenhauer-Spätausgabe No. 1 ->
Brautag_im_Takt; Urgrossmutter's Hitparade No. 1 -> Beer Music #4.

**Still to be assigned (13):** The Swallow Tail Jig; Greencastle Hornpipe; Kaiser Wilhelm's Hitparade No. 3 and No. 4;
Fröhlichkeit In Allen Rillen; Urgrossmutter's Hitparade No. 2; Eins Zwei G'Suffa; Green, Green Grass of Home; Yodelling;
Gemütlichkeit in Allen Rillen; Gassenhauer-Spätausgabe No. 2; Stimmung Ist (Auch) Die Zweite Bürgerpflicht; Dizzy.

A tip: The Swallow Tail Jig, the Greencastle Hornpipe and Ein Prosit (1898) are old tunes in the public domain. Only the
recordings are copyrighted, so a Skynet computer-made version of those tunes would also be safe.

### Not needed (OakBarn Brewery marked "OK To Delete")

Taps.mp3, batmobile_x.wav, jet_flyby2.wav, just_what.wav, Put Another Nickel In Music Music Music, the second copy of Kaiser
Wilhelm's Hitparade No. 2. No replacement.

### Still to find out

- **enthusiasm.wav**: source unknown and it is not clear what it sounds like (a voice? a cheer?). OakBarn Brewery to say, then
  Claude makes or writes its replacement.

## 3. The BruControl Import

The Importer copies the brewer's own BruControl sounds onto that brewer's own Brain; it does not ship them to anyone else, so
it is not a copyright problem for Skynet. For the OakBarn setup (and any sample made from it), the swap list above is in the
Importer Sandbox (`Sandbox/Importer/Sound_Swaps.md`, Rule 11.3) so that the Importer can offer the Skynet sound in place of
each one when the Importer work starts again.

## 4. The private project files

Sandbox_Audio and Duplicates_OK_To_Delete in the private project files hold the copyrighted songs. They are private, never in
the public project, and stay that way.
