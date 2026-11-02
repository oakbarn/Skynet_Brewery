# Existing Alarms

Every Alarm made before the new Alarm Widget standard (PR #154, 2026-11-02) in the Schemas that ship with Skynet. These are
the old style (no subclass). Fritz will make Basic Alarm Widget formats, and each one here is changed to the new Basic format
**one at a time** (Skynet Rule 7.14). The OakBarn Schema is not looked at.

Written 2026-11-02 from the Schemas on GitHub (the default branch after PR #154).

## Sample Schemas

| Name | Schema | Tab |
|---|---|---|
| alm_Hops | Two vessels, one pump | Brewhouse |
| alm_Step | Two vessels, one pump | Brewhouse |
| alm_Warning | Two vessels, one pump | Brewhouse |
| alm_Hops | Three vessels, one pump | Brewhouse |
| alm_Step | Three vessels, one pump | Brewhouse |
| alm_Warning | Three vessels, one pump | Brewhouse |
| alm_Hops | BrewZilla brew day (no board) | Brew Day |
| alm_Step | BrewZilla brew day (no board) | Brew Day |
| alm_Warning | BrewZilla brew day (no board) | Brew Day |

## Also found (not a Skynet Schema)

| Name | Schema | Tab |
|---|---|---|
| alm_Done | sample_brucontrol.brucfg (the BruControl file used to test importing) | B1 Brewery |

Not listed: the OakBarn Schema (config/brewery.json, the panel's default Schema: alm_Hops on the Brewery Tab), as Fritz asked.
