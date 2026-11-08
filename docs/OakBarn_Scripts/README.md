# OakBarn Brewery BruControl Scripts
> **Read only when OakBarn Brewery says so, or after asking permission** (Rule 16.8). The one standing exception: these
> Scripts are the basis for the Skynet Process Templates that are not finished yet. They are kept exactly as BruControl saved
> them (BruControl Script language, not Skynet Process code), so they are not brought up to the Skynet Rules.

All 175 Scripts (BruControl Processes) of the OakBarn Brewery BruControl configuration
(`26-26-46 VGC UNI and MB Relay.brucfg`), in the order BruControl keeps them. The OakBarn Brewery Schema Template
(`templates/schema/Skynet_OakBarn.json`) is built from the same configuration. The main brew day chain is `scrBrew0_*` to
`scrBrew900`; `scr600_*` fills the fermentors; `sub_scrManifold_Choice` picks the manifold path.

The Scripts are split into 5 parts so each one opens in a browser.

| Part | Scripts | Numbers |
|---|---|---|
| [Part 1](OakBarn_Scripts_Part_1.md) | 30 | 1 to 30 |
| [Part 2](OakBarn_Scripts_Part_2.md) | 17 | 31 to 47 |
| [Part 3](OakBarn_Scripts_Part_3.md) | 28 | 48 to 75 |
| [Part 4](OakBarn_Scripts_Part_4.md) | 48 | 76 to 123 |
| [Part 5](OakBarn_Scripts_Part_5.md) | 52 | 124 to 175 |

## Every Script

| # | Script | Part | Lines |
|---|---|---|---|
| 1 | `scrStart0_0` | [Part 1](OakBarn_Scripts_Part_1.md) | 380 |
| 2 | `xscrStart0_0` | [Part 1](OakBarn_Scripts_Part_1.md) | 385 |
| 3 | `scrBrew0_1` | [Part 1](OakBarn_Scripts_Part_1.md) | 288 |
| 4 | `scrBrew0_1a_Normal_Brew` | [Part 1](OakBarn_Scripts_Part_1.md) | 246 |
| 5 | `scrBrew0_1b_Testing_Brew` | [Part 1](OakBarn_Scripts_Part_1.md) | 167 |
| 6 | `scrBrew0_2_Batch_Setup_Hops` | [Part 1](OakBarn_Scripts_Part_1.md) | 556 |
| 7 | `scrBrew0_2_1_CheckBoilGroup` | [Part 1](OakBarn_Scripts_Part_1.md) | 171 |
| 8 | `scrBrew0_2_2_All_Hop_Scripts_Calculation` | [Part 1](OakBarn_Scripts_Part_1.md) | 122 |
| 9 | `scrBrew0_3_Vessels` | [Part 1](OakBarn_Scripts_Part_1.md) | 1020 |
| 10 | `scrBrew0_3_Two_Vessels` | [Part 1](OakBarn_Scripts_Part_1.md) | 785 |
| 11 | `scrBrew0_4_Strike_Tree` | [Part 1](OakBarn_Scripts_Part_1.md) | 126 |
| 12 | `scrBrew0_5a_Fill_First` | [Part 1](OakBarn_Scripts_Part_1.md) | 0 |
| 13 | `scrBrew0_5B_Fill_Second` | [Part 1](OakBarn_Scripts_Part_1.md) | 1177 |
| 14 | `scrBrew0_6_Extra_HLT` | [Part 1](OakBarn_Scripts_Part_1.md) | 457 |
| 15 | `scrBrew0_7_SetFermentors` | [Part 1](OakBarn_Scripts_Part_1.md) | 80 |
| 16 | `scrBrew0_8_Setpoints` | [Part 1](OakBarn_Scripts_Part_1.md) | 687 |
| 17 | `scrBrew0_9_1_Start_Radiator` | [Part 1](OakBarn_Scripts_Part_1.md) | 361 |
| 18 | `scrBrew0_9_2_Start_BigMac` | [Part 1](OakBarn_Scripts_Part_1.md) | 333 |
| 19 | `scrBrew0_9_3_Start_BrewZilla` | [Part 1](OakBarn_Scripts_Part_1.md) | 0 |
| 20 | `scrBrew0_9_5_Propane_Burners` | [Part 1](OakBarn_Scripts_Part_1.md) | 179 |
| 21 | `scrBrew0_10_1_Start_Heaters` | [Part 1](OakBarn_Scripts_Part_1.md) | 585 |
| 22 | `scrBrew0_10_2_Heaters_Runnning` | [Part 1](OakBarn_Scripts_Part_1.md) | 255 |
| 23 | `scrBrew0_11_Obtain_Strike_Plus_One_Vessel` | [Part 1](OakBarn_Scripts_Part_1.md) | 568 |
| 24 | `scrBrew0_11_Obtain_Strike_Plus_Two_Vessels` | [Part 1](OakBarn_Scripts_Part_1.md) | 82 |
| 25 | `scrBrew0_12_Add_Grain` | [Part 1](OakBarn_Scripts_Part_1.md) | 311 |
| 26 | `scrBrew200_Mashing` | [Part 1](OakBarn_Scripts_Part_1.md) | 255 |
| 27 | `scrBrew200_1_Step_Mash` | [Part 1](OakBarn_Scripts_Part_1.md) | 1103 |
| 28 | `scrBrew200_2_Step_Mash` | [Part 1](OakBarn_Scripts_Part_1.md) | 589 |
| 29 | `scrBrew200_3_Step_Mash` | [Part 1](OakBarn_Scripts_Part_1.md) | 586 |
| 30 | `scrBrew300_1_First_WORT_Run` | [Part 1](OakBarn_Scripts_Part_1.md) | 368 |
| 31 | `scrBrew300_2_Sparging and 2nd_Run` | [Part 2](OakBarn_Scripts_Part_2.md) | 580 |
| 32 | `scrBrew300_3_Wait_Boil` | [Part 2](OakBarn_Scripts_Part_2.md) | 222 |
| 33 | `scrBrew400_1_Start_Boil_HotBreak` | [Part 2](OakBarn_Scripts_Part_2.md) | 671 |
| 34 | `scrBrew400_2_Boiling_Sanitize` | [Part 2](OakBarn_Scripts_Part_2.md) | 563 |
| 35 | `scrBrew400_3_Boiling_to_End` | [Part 2](OakBarn_Scripts_Part_2.md) | 440 |
| 36 | `scrBrew500_1_Whrilpooling` | [Part 2](OakBarn_Scripts_Part_2.md) | 883 |
| 37 | `scrBrew500_2_Whrilpooling` | [Part 2](OakBarn_Scripts_Part_2.md) | 443 |
| 38 | `scrBrew500_3_Trub_and_Fermentors` | [Part 2](OakBarn_Scripts_Part_2.md) | 447 |
| 39 | `scr600_1_ SET_WORT_SOURCE` | [Part 2](OakBarn_Scripts_Part_2.md) | 479 |
| 40 | `scr600_2_Choose_WORT_Source` | [Part 2](OakBarn_Scripts_Part_2.md) | 344 |
| 41 | `scr600_3_Choose_Fermentor` | [Part 2](OakBarn_Scripts_Part_2.md) | 805 |
| 42 | `scr600_4_FillFermentors` | [Part 2](OakBarn_Scripts_Part_2.md) | 2225 |
| 43 | `scr600_5_OG` | [Part 2](OakBarn_Scripts_Part_2.md) | 233 |
| 44 | `scrBrew700_1_Refill_BigMac_Cleaning` | [Part 2](OakBarn_Scripts_Part_2.md) | 383 |
| 45 | `scrBrew700_2` | [Part 2](OakBarn_Scripts_Part_2.md) | 827 |
| 46 | `scrBrew700_3` | [Part 2](OakBarn_Scripts_Part_2.md) | 836 |
| 47 | `scrBrew700_4` | [Part 2](OakBarn_Scripts_Part_2.md) | 1034 |
| 48 | `scrBrew800` | [Part 3](OakBarn_Scripts_Part_3.md) | 940 |
| 49 | `scrBrew900` | [Part 3](OakBarn_Scripts_Part_3.md) | 732 |
| 50 | `scrBrew900_2` | [Part 3](OakBarn_Scripts_Part_3.md) | 430 |
| 51 | `sub_scrBrewZilla_Ready` | [Part 3](OakBarn_Scripts_Part_3.md) | 179 |
| 52 | `sub_scrDigiBoil_Ready` | [Part 3](OakBarn_Scripts_Part_3.md) | 163 |
| 53 | `sub_scrBrew_Fill_HERMs` | [Part 3](OakBarn_Scripts_Part_3.md) | 112 |
| 54 | `sub_scrBrew_Fill_BigMac_HLT` | [Part 3](OakBarn_Scripts_Part_3.md) | 97 |
| 55 | `sub_scrTimeorVolume` | [Part 3](OakBarn_Scripts_Part_3.md) | 342 |
| 56 | `sub_scrCloseAllValves` | [Part 3](OakBarn_Scripts_Part_3.md) | 208 |
| 57 | `sub_scrDataExchangeFerment1` | [Part 3](OakBarn_Scripts_Part_3.md) | 21 |
| 58 | `sub_scrDataExchangeMash` | [Part 3](OakBarn_Scripts_Part_3.md) | 23 |
| 59 | `sub_scrRestore_B1` | [Part 3](OakBarn_Scripts_Part_3.md) | 134 |
| 60 | `sub_scrHeaters` | [Part 3](OakBarn_Scripts_Part_3.md) | 171 |
| 61 | `sub_scrOpenAllValves` | [Part 3](OakBarn_Scripts_Part_3.md) | 175 |
| 62 | `sub_scrChoose_Fermentor` | [Part 3](OakBarn_Scripts_Part_3.md) | 115 |
| 63 | `sub_scrFermentor_Set_Status_Select` | [Part 3](OakBarn_Scripts_Part_3.md) | 280 |
| 64 | `sub_scrManifold_Choice` | [Part 3](OakBarn_Scripts_Part_3.md) | 1725 |
| 65 | `sub_Stop_Testing` | [Part 3](OakBarn_Scripts_Part_3.md) | 19 |
| 66 | `sub_Start_Testing` | [Part 3](OakBarn_Scripts_Part_3.md) | 17 |
| 67 | `realsub_Stop_Testing` | [Part 3](OakBarn_Scripts_Part_3.md) | 18 |
| 68 | `sub_step_scrHops_15_Min` | [Part 3](OakBarn_Scripts_Part_3.md) | 607 |
| 69 | `sub_step_scrHops_Gap` | [Part 3](OakBarn_Scripts_Part_3.md) | 435 |
| 70 | `sub_step_scrHops_EOB` | [Part 3](OakBarn_Scripts_Part_3.md) | 126 |
| 71 | `sub_2_scrValveOperation` | [Part 3](OakBarn_Scripts_Part_3.md) | 1436 |
| 72 | `sub_2_scrPrimeandBasicManifold` | [Part 3](OakBarn_Scripts_Part_3.md) | 1508 |
| 73 | `sub_2_scrPrimeandBasicManifold_External` | [Part 3](OakBarn_Scripts_Part_3.md) | 144 |
| 74 | `sub_2_scrPrimeandBasicManifold_Brewzilla` | [Part 3](OakBarn_Scripts_Part_3.md) | 279 |
| 75 | `sub_2_scrFermentor_Set_Status` | [Part 3](OakBarn_Scripts_Part_3.md) | 1436 |
| 76 | `sub_3_scrCalculateSPG` | [Part 4](OakBarn_Scripts_Part_4.md) | 2018 |
| 77 | `sub_4_scrVolume_to_Time_TRANFER_SPG` | [Part 4](OakBarn_Scripts_Part_4.md) | 677 |
| 78 | `sub_4_scrSetSPG` | [Part 4](OakBarn_Scripts_Part_4.md) | 268 |
| 79 | `sub_5_scrTimetoSeconds` | [Part 4](OakBarn_Scripts_Part_4.md) | 353 |
| 80 | `looper_scrAutoSwitch` | [Part 4](OakBarn_Scripts_Part_4.md) | 517 |
| 81 | `looper_scrBackGrounds` | [Part 4](OakBarn_Scripts_Part_4.md) | 685 |
| 82 | `looper_scrAutoSwitch_Hops` | [Part 4](OakBarn_Scripts_Part_4.md) | 326 |
| 83 | `looper_scrBackground_Hops` | [Part 4](OakBarn_Scripts_Part_4.md) | 336 |
| 84 | `looper_scrDin` | [Part 4](OakBarn_Scripts_Part_4.md) | 47 |
| 85 | `looper_scrElementControl` | [Part 4](OakBarn_Scripts_Part_4.md) | 76 |
| 86 | `looper_Heat_scrRimsHeat_Control` | [Part 4](OakBarn_Scripts_Part_4.md) | 101 |
| 87 | `looper_Heat_scrRIMs_Heater` | [Part 4](OakBarn_Scripts_Part_4.md) | 70 |
| 88 | `looper_Heat_scrBigMac_Hys_Control` | [Part 4](OakBarn_Scripts_Part_4.md) | 91 |
| 89 | `looper_Heat_scrBigMacHeat` | [Part 4](OakBarn_Scripts_Part_4.md) | 67 |
| 90 | `looper_Heat_scrRadiatorHeat_Hys_Control` | [Part 4](OakBarn_Scripts_Part_4.md) | 98 |
| 91 | `looper_Heat_scrRadiator_Body_Heat` | [Part 4](OakBarn_Scripts_Part_4.md) | 68 |
| 92 | `looper_BURNER_scrBrewKettleBurner` | [Part 4](OakBarn_Scripts_Part_4.md) | 86 |
| 93 | `looper_BURNER_scrLittleMacBurner` | [Part 4](OakBarn_Scripts_Part_4.md) | 85 |
| 94 | `looper_scrDeltaStrike` | [Part 4](OakBarn_Scripts_Part_4.md) | 28 |
| 95 | `looper_scrBoilTimer_Reset` | [Part 4](OakBarn_Scripts_Part_4.md) | 27 |
| 96 | `looper_scrBlinkClick` | [Part 4](OakBarn_Scripts_Part_4.md) | 9 |
| 97 | `looper_scrBlinkHopOz` | [Part 4](OakBarn_Scripts_Part_4.md) | 9 |
| 98 | `looper_scrBlinkAAU` | [Part 4](OakBarn_Scripts_Part_4.md) | 8 |
| 99 | `looper_scrBlinkUseHop` | [Part 4](OakBarn_Scripts_Part_4.md) | 10 |
| 100 | `step_scrTest_Time _Reset` | [Part 4](OakBarn_Scripts_Part_4.md) | 445 |
| 101 | `step_scrHops_Timing` | [Part 4](OakBarn_Scripts_Part_4.md) | 2044 |
| 102 | `Test_Set_Status_Ferment` | [Part 4](OakBarn_Scripts_Part_4.md) | 19 |
| 103 | `Test_Set_Sample_TGS_Batch` | [Part 4](OakBarn_Scripts_Part_4.md) | 176 |
| 104 | `strt_1_Set_Elements_Enabled` | [Part 4](OakBarn_Scripts_Part_4.md) | 110 |
| 105 | `strt_2__Reset_General` | [Part 4](OakBarn_Scripts_Part_4.md) | 443 |
| 106 | `strt_3_Reset_Batch ` | [Part 4](OakBarn_Scripts_Part_4.md) | 137 |
| 107 | `strt_4_Reset_Hops` | [Part 4](OakBarn_Scripts_Part_4.md) | 63 |
| 108 | `strt_5_Reset_Reporting` | [Part 4](OakBarn_Scripts_Part_4.md) | 101 |
| 109 | `strt_6_End_All_Scripts` | [Part 4](OakBarn_Scripts_Part_4.md) | 181 |
| 110 | `Hops_1_Hop_Grouping` | [Part 4](OakBarn_Scripts_Part_4.md) | 802 |
| 111 | `xHops_1_Hop_Grouping` | [Part 4](OakBarn_Scripts_Part_4.md) | 798 |
| 112 | `Hops_2_Hop_Boil_set_Types_10_20_30` | [Part 4](OakBarn_Scripts_Part_4.md) | 174 |
| 113 | `Hops_2a_Hop_Order_Bitter` | [Part 4](OakBarn_Scripts_Part_4.md) | 226 |
| 114 | `Hops_2b_Hop_Order_Flavor` | [Part 4](OakBarn_Scripts_Part_4.md) | 224 |
| 115 | `Hops_2c_Hop_Order_Aroma` | [Part 4](OakBarn_Scripts_Part_4.md) | 225 |
| 116 | `Hops_3_Hop_Drop_Calculations` | [Part 4](OakBarn_Scripts_Part_4.md) | 164 |
| 117 | `Hops_4_Hop_AAU_Check_Zero` | [Part 4](OakBarn_Scripts_Part_4.md) | 252 |
| 118 | `Hops_5_Hop_Calc_OZ` | [Part 4](OakBarn_Scripts_Part_4.md) | 114 |
| 119 | `Hops_6_Hop_Calc_MAX` | [Part 4](OakBarn_Scripts_Part_4.md) | 820 |
| 120 | `Hops_7_Hop_Warning_Text` | [Part 4](OakBarn_Scripts_Part_4.md) | 176 |
| 121 | `Hops_8_Hop_Text_Mash` | [Part 4](OakBarn_Scripts_Part_4.md) | 178 |
| 122 | `Hops_9_Hop_Text_1st_Wort` | [Part 4](OakBarn_Scripts_Part_4.md) | 179 |
| 123 | `Hops_10_Hop_Text_SOB` | [Part 4](OakBarn_Scripts_Part_4.md) | 176 |
| 124 | `Hops_11_Hop_Text_Drop_1 ` | [Part 5](OakBarn_Scripts_Part_5.md) | 181 |
| 125 | `Hops_12_Hop_Text_Drop_2` | [Part 5](OakBarn_Scripts_Part_5.md) | 180 |
| 126 | `Hops_13_Hop_Text_Drop_3` | [Part 5](OakBarn_Scripts_Part_5.md) | 181 |
| 127 | `Hops_14_Hop_Text_Drop_4` | [Part 5](OakBarn_Scripts_Part_5.md) | 179 |
| 128 | `Hops_15_Hop_Text_Drop_5` | [Part 5](OakBarn_Scripts_Part_5.md) | 183 |
| 129 | `Hops_16_Hop_Text_Drop_6` | [Part 5](OakBarn_Scripts_Part_5.md) | 181 |
| 130 | `Hops_17_Hop_Text_Drop_7` | [Part 5](OakBarn_Scripts_Part_5.md) | 181 |
| 131 | `Hops_18_Hop_Text_Drop_8` | [Part 5](OakBarn_Scripts_Part_5.md) | 179 |
| 132 | `Hops_19_Hop_Text_Whirlpool` | [Part 5](OakBarn_Scripts_Part_5.md) | 350 |
| 133 | `Hops_20_Hop_Text_DryHop` | [Part 5](OakBarn_Scripts_Part_5.md) | 488 |
| 134 | `hops_scrSetHopGroupsReview` | [Part 5](OakBarn_Scripts_Part_5.md) | 42 |
| 135 | `hops_scrHopSwitches` | [Part 5](OakBarn_Scripts_Part_5.md) | 1141 |
| 136 | `hops_scrHopsConflicts` | [Part 5](OakBarn_Scripts_Part_5.md) | 869 |
| 137 | `batch_1_IBUs` | [Part 5](OakBarn_Scripts_Part_5.md) | 574 |
| 138 | `xbatch_1_IBUs` | [Part 5](OakBarn_Scripts_Part_5.md) | 602 |
| 139 | `batch_2_Calc_Volumes` | [Part 5](OakBarn_Scripts_Part_5.md) | 160 |
| 140 | `batch_scrManuaLCalc` | [Part 5](OakBarn_Scripts_Part_5.md) | 95 |
| 141 | `inscpt_scr_Inner_Blue` | [Part 5](OakBarn_Scripts_Part_5.md) | 34 |
| 142 | `inscpt_scrBasicStart` | [Part 5](OakBarn_Scripts_Part_5.md) | 20 |
| 143 | `inscpt_scrAdvancewithSwitch` | [Part 5](OakBarn_Scripts_Part_5.md) | 59 |
| 144 | `inscpt_scrMessage_with_Delay` | [Part 5](OakBarn_Scripts_Part_5.md) | 117 |
| 145 | `inscpt_scrSet_Brewery_Scripts` | [Part 5](OakBarn_Scripts_Part_5.md) | 23 |
| 146 | `inscpt_scrAlarm` | [Part 5](OakBarn_Scripts_Part_5.md) | 78 |
| 147 | `inscpt_scrClearBatchHops` | [Part 5](OakBarn_Scripts_Part_5.md) | 24 |
| 148 | `inscpt_scrSet_Middle_Backgrounds` | [Part 5](OakBarn_Scripts_Part_5.md) | 87 |
| 149 | `inscpt_scrFermentorStatus` | [Part 5](OakBarn_Scripts_Part_5.md) | 128 |
| 150 | `inscpt_scrHiddenTimer10SecondDelay` | [Part 5](OakBarn_Scripts_Part_5.md) | 9 |
| 151 | `inscpt_scrHiddenTimer5SecondDelay` | [Part 5](OakBarn_Scripts_Part_5.md) | 10 |
| 152 | `inscpt_scrRestoreTop_1` | [Part 5](OakBarn_Scripts_Part_5.md) | 46 |
| 153 | `inscpt_scrBrewChoiceOpen` | [Part 5](OakBarn_Scripts_Part_5.md) | 27 |
| 154 | `inscpt_scrClearB1_Brewery` | [Part 5](OakBarn_Scripts_Part_5.md) | 65 |
| 155 | `inscpt_scrShortDelay` | [Part 5](OakBarn_Scripts_Part_5.md) | 88 |
| 156 | `inscpt_scrStopScriptManifold` | [Part 5](OakBarn_Scripts_Part_5.md) | 14 |
| 157 | `inscpt_BigMacTimer` | [Part 5](OakBarn_Scripts_Part_5.md) | 14 |
| 158 | `inscpt_RadiatorTimer` | [Part 5](OakBarn_Scripts_Part_5.md) | 14 |
| 159 | `utility_FireHose_Manifold_Supply_Water` | [Part 5](OakBarn_Scripts_Part_5.md) | 593 |
| 160 | `utility_sub_RestoreAfterWater` | [Part 5](OakBarn_Scripts_Part_5.md) | 501 |
| 161 | `utility_sub_WaterSetHide` | [Part 5](OakBarn_Scripts_Part_5.md) | 17 |
| 162 | `utility_sub_Water_Visible` | [Part 5](OakBarn_Scripts_Part_5.md) | 18 |
| 163 | `utility_EmergencyOff` | [Part 5](OakBarn_Scripts_Part_5.md) | 48 |
| 164 | `scrWhitePump` | [Part 5](OakBarn_Scripts_Part_5.md) | 2 |
| 165 | `scrYellowPump` | [Part 5](OakBarn_Scripts_Part_5.md) | 2 |
| 166 | `scrShow_Workspace_Data` | [Part 5](OakBarn_Scripts_Part_5.md) | 8 |
| 167 | `scrShow_Time_Workspace` | [Part 5](OakBarn_Scripts_Part_5.md) | 2 |
| 168 | `scr_Show_workapace_Script_Switches` | [Part 5](OakBarn_Scripts_Part_5.md) | 7 |
| 169 | `scrFermentor_Default` | [Part 5](OakBarn_Scripts_Part_5.md) | 18 |
| 170 | `scrWater` | [Part 5](OakBarn_Scripts_Part_5.md) | 10 |
| 171 | `scrFementor_Days` | [Part 5](OakBarn_Scripts_Part_5.md) | 643 |
| 172 | `sub2_XMLImportBeer_Smith` | [Part 5](OakBarn_Scripts_Part_5.md) | 960 |
| 173 | `sub_2_scrValveOperation_Switch` | [Part 5](OakBarn_Scripts_Part_5.md) | 0 |
| 174 | `scrWater_Measure_T0_Vessel` | [Part 5](OakBarn_Scripts_Part_5.md) | 0 |
| 175 | `nlooper_scrBackground_Hops` | [Part 5](OakBarn_Scripts_Part_5.md) | 339 |
