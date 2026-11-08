# OakBarn Brewery BruControl Scripts, Part 2 of 5

> **Read only when OakBarn Brewery says so, or after asking permission** (Rule 16.8). The one standing exception: these
> Scripts are the basis for the Skynet Process Templates that are not finished yet. They are kept exactly as BruControl saved
> them (BruControl Script language, not Skynet Process code), so they are not brought up to the Skynet Rules.

Back to the [list of all Scripts](README.md).

## 31. scrBrew300_2_Sparging and 2nd_Run

Starts by itself: No · User can start or stop it: Yes · 580 lines

```text
//scrBrew300_2_Sparging and 2nd_Run
//08/03/2023 10:03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//seperated frm scrBreww300  03/21/2026 09:03
//Moddified
"gblVCurrentBigMac_Volume" value = 23.4
"gblVCurrentRadiator_Volume" value = 5
"gblVCurrentMLT_Volume" value = 13.1
"gblVCurrentBrewKettle_Volume" value = 8.7
"gblV_Group_FirstWort" value = 0
//"sw_Control_Burner_BK" state = false
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
if vB_Testing == true
"gblS_Script_Started" value = "Started: scrBrew300_2_Sparging and 2nd_Run" 
"gblS_Inter_Script" value = " -- "
"gblS_Script_Ended" value = "Ended: scrBrew300_1_First_WORT_Run"
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
"gblS_Inter_Script" visibility = visible
"gblV_Sub3_Status" value = 0
"gblV_Sub4_Status" value = 0
start "step_scrTest_Time _Reset"
start "looper_scrBoilTimer_Reset"
"gblV_Brew_Status" visibility = visible
"gblV_Sub3_Status" visibility = visible
"gblV_Sub4_Status" visibility = visible
"gblTValveDelay" value = 00:00:01
sleep 999
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
"gblS_Inter_Script" visibility = hidden
stop "step_scrTest_Time _Reset"
stop "looper_scrBoilTimer_Reset"
"gblV_Brew_Status" visibility = hidden
"gblV_Sub3_Status" visibility = hidden
"gblV_Sub4_Status" visibility = hidden
"gblTValveDelay" value = 00:00:07
endif
//...................................

start "strt_1_Set_Elements_Enabled"
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" value = "Sparging!  Will Auto Advance ."
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Will Auto Advance"
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
//........................
"sw_Advance_ BrewStatus" visibility = hidden
//........................
stop "tm_Action_TopRight_B1"
"tm_Action_TopRight_B1" type = countdown
"tm_Action_TopRight_B1" displayname = "Sparge Timer"
"tm_Action_TopRight_B1" value = 00:10:00
start "tm_Action_TopRight_B1"
"tm_Action_TopRight_B1" visibility = visible
"tmTopRight_B1" visibility = hidden
stop "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" type = countdown
"tm_Action_BottomRight_B1" displayname = "Sparge Timer"
start "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" value = "tm_Action_TopRight_B1" value
"tm_Action_BottomRight_B1" visibility = visible
"tmBottomRight_B1" visibility = hidden
if vB_Testing == true
"gblS_Script_Started" value = "Started: scrBrew300_2_Sparging and 2nd_Run" 
"gblS_Inter_Script" value = " -- "
"gblS_Script_Ended" value = "Ended: scrBrew300_1_First_WORT_Run"
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
"gblS_Inter_Script" visibility = visible
start "step_scrTest_Time _Reset"
start "looper_scrBoilTimer_Reset"
"gblV_Brew_Status" visibility = visible
"gblV_Sub3_Status" visibility = visible
"gblV_Sub4_Status" visibility = visible
"gblTValveDelay" value = 00:00:01
sleep 999
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
"gblS_Inter_Script" visibility = hidden
stop "step_scrTest_Time _Reset"
stop "looper_scrBoilTimer_Reset"
"gblV_Brew_Status" visibility = hidden
"gblV_Sub3_Status" visibility = hidden
"gblV_Sub4_Status" visibility = hidden
"gblTValveDelay" value = 00:00:07
endif
//...................................
start "inscpt_scrBasicStart"
sleep 100
start "inscpt_scrAlarm"
sleep 100
new value vV_Brew_Status_Check
vV_Brew_Status_Check precision = 1
new string vSMsg
new string vSMsg1
new string vS_TTL_Time
new value vVBrewStatus
new value vV1
new value vV2
new value vV3
new value vVReportValue
new value vVTimetoFill
new value vV_G_per_Sec
new value vV_Seconds
new value vV_SecondsR
new value vV_Minutes
new string vSMin
new string vSSec
new string vSTime
new time vTXfer
new string vS_TTL_Time
new value vVCalcTTLStrike
new value vVMeasuredStike
new value vVMeasuredStikeExtra
new value vVMeasuredFlush
new value vVMeasured1stRun
new value vVCalcGrainAdsorbtionRate
new value vVGrainAbsorbed_Volume
new value vVGrainWeight
new value vVPreBoilVolume
new value vVFLUSH2ndRunWortVolume
new value vVCalc1stRunVolume
new value vVSpargeVolume
new value vVTopOffVolume
new value vVCurrent_BrewKettle_Volume
new value vV_Pre_2nd_BrewKettle_Volume
new value vV_Post_2nd_BrewKettle_Volume
new value vVCurrent_BigMac_Volume
new value vV_Start_BigMac_Volume
new value vVCurrent_MLT_Volume
new string vSTimeType
new time vT_Value
new string vSTimeDisplay
new value vVFill_Volume
new bool vB_First_Hops
if "gblV_Group_FirstWort" value == 1
vB_First_Hops = true
endif
vV_Pre_2nd_BrewKettle_Volume precision = 1
vV_Post_2nd_BrewKettle_Volume precision = 1
vVTopOffVolume precision = 1
vVPreBoilVolume  precision = 1
vVMeasuredFlush precision = 1
vVCurrent_MLT_Volume precision = 1
vVFill_Volume precision = 1
vVCurrent_BrewKettle_Volume precision = 1
//............................................................................
//............................................................................
"sw_Control_Burner_BK" state = false
vVPreBoilVolume = "gblV_PreBoil_Volume_R1" value
vVGrainWeight = "gblVGrainWeight" value
vVMeasuredStike = "RP_v_Strike_Volume" value
//.............................................................
//.............................................................
stop "looper_scrAutoSwitch"
sleep 100
start "looper_scrAutoSwitch"
stop "looper_scrBackGrounds"
sleep 100
start "looper_scrBackGrounds"
//where to start
"gblV_Brew_Status" value =  328
goto "SectionBrew328"
//.............................
[SectionBrew328]
wait "gblV_Brew_Status" value == 328
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//............................................................
if vB_First_Hops == false
print 165
goto "NO_1st_Hop_1"
endif
if vB_First_Hops == true
print "@ 169 There are 1st WORT Hops"
show workspace  "Alarms"
vSMsg =  "Drop the 1st WORT Hops into the First Run: "
vSMsg1 = "gblS_FirstWort" value 
vSMsg = vSMsg  + vSMsg1
vSMsg1 =  " Hops.   1st WORT Hops to steep at the Mash Temperature.  Lighting of the Brew Kettle Burner will be delayed until the 1st WORT Hops steep is complete."
vSMsg = vSMsg  + vSMsg1
"gblS_HopMessage_ALARM"  value = vSMsg
"alm_Extra_Hops" fileindex = 2
"alm_Extra_Hops" active = true
"alm_Extra_Hops" sound = "Default" 
"gblS_HopMessage_ALARM" displayname = "Drop 1st WORT Hops"
"gblS_HopMessage_ALARM" visibility = visible
"gblS_HopMessage_ALARM" background = 1
"alm_Extra_Hops" displayname = "Drop 1st WORT Hops"
"alm_Extra_Hops"  visibility = visible
wait "alm_Extra_Hops" active == false
"alm_Extra_Hops"  visibility = hidden
"alm_Extra_Hops" sound = "Custom"
"alm_Extra_Hops" fileindex = 3
"alm_Extra_Hops" active = true
stop "tm_BottomRight_ALARM"
"tm_BottomRight_ALARM" type = countdown
"tm_BottomRight_ALARM" displayname = "Green,Green Grass of Home"
"tm_BottomRight_ALARM"  visibility = visible
"tm_BottomRight_ALARM" value = "tm_Action_TopRight_B1" value
start "tm_BottomRight_ALARM"
"tm_Action_BottomRight_B1" value = "tm_Action_TopRight_B1" value
vSMsg =  "Steeping 1st WORT Hops into the First Run: "
vSMsg1 =  "gblS_FirstWort" value 
vSMsg = vSMsg  + vSMsg1
vSMsg1 =  " Hops.  This will be displayed to allow the 1st WORT Hops to steep at the Mash Temperature.  Wait.  Will Auto Advance"
vSMsg = vSMsg  + vSMsg1
"gblS_HopMessage_ALARM"  value = vSMsg
"gblS_HopMessage_ALARM" displayname = "Dropped 1st Hops in 1st Run"
if vB_Testing == true
wait "tm_Action_TopRight_B1" value < 00:09:45
"gblT_SetTimer" value = 00:05:30
stop "tm_Hidden_1"
reset "tm_Hidden_1"
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"sw_Advance_Timer" state = true
"tm_BottomRight_ALARM" value = 00:05:20
"tm_Action_TopRight_B1" value = "tm_BottomRight_ALARM" value
"tm_Action_BottomRight_B1" value = "tm_Action_TopRight_B1" value
endif
wait "tm_Action_TopRight_B1" value <= 00:05:17
"alm_Extra_Hops" active = false
"tm_BottomRight_ALARM" displayname = "1st Hops Steep"
if vB_Testing == true
wait "tm_Action_TopRight_B1" value < 00:05:05
"gblT_SetTimer" value = 00:01:25
stop "tm_Hidden_1"
reset "tm_Hidden_1"
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"sw_Advance_Timer" state = true
"tm_BottomRight_ALARM" value = 00:01:25
"tm_Action_TopRight_B1" value = "tm_BottomRight_ALARM" value
"tm_Action_BottomRight_B1" value = "tm_Action_TopRight_B1" value
endif
goto "YES_1st_Hop_1"
endif
[NO_1st_Hop_1]
print "@ 237 NO_1st_Hop_1"
"gblS_Brewery_Bottom_3" background = 1
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" value = "Sparging! The Sparge is 10 minutes long.  The Sparge will be over when the timer reaches 00:00:00.  "
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait. Light Brew Kettle Burner Next."
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"tm_Action_TopRight_B1" visibility = visible
"sw_Advance_Overide" visibility = hidden
if vB_Testing == true
wait "tm_Action_TopRight_B1" value < 00:09:50
"tm_Action_TopRight_B1" value = 00:01:25
"tm_Action_BottomRight_B1" value = "tm_Action_TopRight_B1" value
endif
"gblV_Brew_Status" value =  332
goto "SectionBrew332"
[YES_1st_Hop_1]
print "@ 259 YES_1st_Hop_1"
if vB_Testing == true
wait "tm_Action_TopRight_B1" value < 00:09:50
"tm_Action_TopRight_B1" value = 00:01:30
"tm_Action_BottomRight_B1" value = "tm_Action_TopRight_B1" value
endif
wait "tm_Action_TopRight_B1"  value <= 00:01:15
show workspace "B1 Brewery"
stop "tm_BottomRight_ALARM"
"tm_BottomRight_ALARM" visibility = hidden
start "inscpt_scrAlarm"
"gblV_Brew_Status" value =  330
[SectionBrew329]
[SectionBrew330]
wait "gblV_Brew_Status" value == 330
show workspace  "B1 Brewery"
"gblS_Brewery_Bottom_3" background = 1
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" value = "Sparging!  Will Auto Advance ."
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Will Auto Advance"
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
wait "tm_Action_TopRight_B1" value <= 00:01:15
"gblV_Brew_Status" value =  332
[SectionBrew331]
[SectionBrew332]
wait "gblV_Brew_Status" value == 332
// Switch to advance
"gblS_Brewery_Top_3" value = "Light the Brew Kettle. Remember that you are the safety so you need to monitor the lighting.  Click Light Brew Kettle? when ready."
"gblS_Brewery_Bottom_3" value = "Click Light Brew Ketttle?"
"gblS_swAllSwitch_Label_Text" value = "Light Brew Kettle?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"sw_Advance_Overide" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible 
"gblV_Brew_Status" value =  335
[SectionBrew333]
[SectionBrew334]
[SectionBrew335]
[SectionBrew336]
wait "gblV_Brew_Status" value == 336
"sw_Advance_ BrewStatus" visibility = hidden
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//start Brew Kettle Burner
"sw_Control_Burner_BK" state = true
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:05
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "Brew Kettle Lit?"
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
wait "sw_Status_Burner_BK_Lit" state == true
"sw_Status_Burner_BK_Lit" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Monitor the Brew Kettle Burner flame"
"gblS_Brewery_Top_1" background = 1
"gblS_Brewery_Top_1" value =  "Sparging! The Sparge is 10 minutes long.  The Sparge will be over when the timer reaches 00:00:00.  Monitor the Brew Kettle Burner flame.  There is no need for a boil now.  "
"gblS_Brewery_Top_1" visibility = visible
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:07
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"gblS_Brewery_Top_1" visibility = hidden
"gblV_Brew_Status" value =  337
[SectionBrew337]
wait "gblV_Brew_Status" value == 337
"gblS_Brewery_Bottom_3" background = 1 
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" value = "Sparging! The Sparge is 10 minutes long.  The Sparge will be over when the timer reaches 00:00:00.  "
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
if vB_Testing == true
wait "tm_Action_TopRight_B1" value < 00:00:55
"tm_Action_TopRight_B1" value = 00:00:10
"tm_Action_BottomRight_B1" value = "tm_Action_TopRight_B1" value
endif
"gblV_Brew_Status" value =  338
[SectionBrew338]
"sw_Advance_ BrewStatus" visibility = hidden
wait "gblV_Brew_Status" value == 338
sleep 1000
wait "tm_Action_BottomRight_B1" value  <= 00:00:00
"sw_Status_Sparging" state = false
stop "tm_Action_BottomRight_B1"
"sw_Advance_Overide" visibility = hidden
"gblV_Brew_Status" value =  339
[SectionBrew339]
wait "gblV_Brew_Status" value == 339
show workspace  "Alarms"
"alm_StrikeSpargeMash_ALARM" displayname = "Sparge Complete"
"alm_StrikeSpargeMash_ALARM" fileindex = 2
"alm_StrikeSpargeMash_ALARM" visibility = visible
"alm_StrikeSpargeMash_ALARM" active = true
wait "alm_StrikeSpargeMash_ALARM" active == false
start "inscpt_scrAlarm"
"gblV_Brew_Status" value =  340
[SectionBrew340]
vVCurrent_MLT_Volume = "gblVCurrentMLT_Volume" value
vVFill_Volume = vVCurrent_MLT_Volume
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblV_Gals_to_Fill" value = vVFill_Volume
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
print 399
vSMsg = "Ready to set the Manifold to transfer the calculated 2nd Run WORT Volume of "
vSMsg1 = vVCurrent_MLT_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons to the Brew Kettle from the MLT.  This should empty all the Sparged WORT from the Mash Tun.  Click Set Manifold? when ready"
vSMsg = vSMsg + vSMsg1
"gblS_Top_Text" value = vSMsg 
"gblS_Brewery_Bottom_3" value = " Click Set Manifold?  BruControl will set the mainfold to transfer the 2nd Run."
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Set Fill Paramters
"gblV_Vessel_From" value = 3
"gblV_Vessel_To" value = 4 
"gblV_Vessel_Measure"  value = 4
"glbV_Vessel_Adjust" value = 3
"gblV_Pump" value = 3
"gblV_Isolation_Valve" value = 5
"gblV_Gals_to_Fill" value = vVFill_Volume
"sw_Flow_Flush_HERMs" state = false
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
start "inscpt_scrStopScriptManifold"
sleep 100
start "inscpt_scr_Inner_Blue"
goto "SectionBrew341"
[SectionBrew341]
"gblV_Brew_Status" value = 342
[SectionBrew342]
wait "gblV_Brew_Status" value == 342
print  432
"gblV_Water_Switch_Status_Water" value = 3042
"sw_Flow_Skip_TimeorVolume" state = true
sleep 100
//2nd Run
print "@ 438 start second run"
"gblV_Sub3_Status" value = 0
"gblV_Sub4_Status" value = 0
start "sub_scrManifold_Choice"
sleep 4000
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew300_2_Sparging and 2nd_Run @ 440  2nd Run  > start: sub_scrManifold_Choice"
sleep 101
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 449 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
print 458
 "gblV_Brew_Status" value = 348
goto "SectionBrew348"
[SectionBrew346]
[SectionBrew347]
[SectionBrew348]
print "@ 456 SectionBrew 348"
wait "gblV_Brew_Status" value == 348
vVCurrent_BrewKettle_Volume = "gblVCurrentBrewKettle_Volume" value
vV_Post_2nd_BrewKettle_Volume = "gblVCurrentBrewKettle_Volume" value
vV_Pre_2nd_BrewKettle_Volume = vV_Post_2nd_BrewKettle_Volume - vV_Pre_2nd_BrewKettle_Volume
"RP_v_2nd_Run_Volume" value = vV_Pre_2nd_BrewKettle_Volume
vVTopOffVolume = vVPreBoilVolume - vV_Post_2nd_BrewKettle_Volume
[ReCheck]
print "@ 465 Recheck "
vV1 = vVPreBoilVolume - .1
vV2 = vVPreBoilVolume + .1
print vV1
print vV2
print vVCurrent_BrewKettle_Volume
if vVCurrent_BrewKettle_Volume  >= vV1
if vVCurrent_BrewKettle_Volume  <= vV2
goto "PreBoilGood"
endif
endif
if vVCurrent_BrewKettle_Volume  <= vV1
goto "PreBoilLow"
endif
if vVCurrent_BrewKettle_Volume >= vV2
"RP_v_TopOff_Volume" value =  vVTopOffVolume
vVTopOffVolume = vVTopOffVolume * -1
goto "PreBoilHigh"
endif
[PreBoilHigh]
vsMsg = " The Brew Kettle is overfilled.  You need to boil off or remove "
vsMsg1 = vVTopOffVolume
vsMsg = vsMsg + vsMsg1
vsMsg1 = " gallons. Once you have removed or boiled off to the Pre Boil Volume, Click Pre Boil Volume Good? to Proceed. You are in control. "
vsMsg = vsMsg + vsMsg1
"gblS_Brewery_Top_3" value = vsMsg
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "Pre Boil Volume Good?"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value =  348
wait "gblV_Brew_Status" value ==  349
goto "PreBoilGood"
[PreBoilLow]
print "@ 501 PreBoilLow"
vVFill_Volume = vVTopOffVolume
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblV_Gals_to_Fill" value = vVFill_Volume
"gblV_Water_Switch_Status_Water" value = 1041
print 506
"sw_Flow_Skip_TimeorVolume" state = true
sleep 100
//Top Off Brew Kettle
vVCurrent_BrewKettle_Volume = "gblVCurrentBrewKettle_Volume" value
vVPreBoilVolume = "gblV_PreBoil_Volume_R1" value
vV1 = vVPreBoilVolume - .1
vV2 = vVPreBoilVolume + .1
	if vVCurrent_BrewKettle_Volume >= vV1
	if vVCurrent_BrewKettle_Volume <= vV2
	goto "PreBoilGood"
	endif
	endif
print "@ 511 start Top Off"
"gblV_Sub3_Status" value = 0
"gblV_Sub4_Status" value = 0
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew300_2_Sparging and 2nd_Run @ 513 Top Off Brew Kettle  > start: sub_scrManifold_Choice"
sleep 101
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 496 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
print 524
vV_Post_2nd_BrewKettle_Volume = "gblVCurrentBrewKettle_Volume" value
vV_Pre_2nd_BrewKettle_Volume = vV_Post_2nd_BrewKettle_Volume - vV_Pre_2nd_BrewKettle_Volume
vVTopOffVolume = vVPreBoilVolume - vV_Post_2nd_BrewKettle_Volume
 "gblV_Brew_Status" value = 348

goto "ReCheck"
//..................................................
[PreBoilGood]
print "@ 649 PreBoilGood"
"RP_v_PreBoil_Volume" value = "gblVCurrentBrewKettle_Volume" value
stop "tm_Action_TopRight_B1"
"tm_Action_TopRight_B1" type = countup
"tm_Action_TopRight_B1" displayname = "Time to Boil"
"tm_Action_TopRight_B1" value = 00:00:00
start "tm_Action_TopRight_B1"
stop "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" displayname = "Time to Boil"
"tm_Action_BottomRight_B1" type = countup
start "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" value = "tm_Action_TopRight_B1" value
[END_scrBrew300_2]
if vB_Testing == true
"gblS_Script_Ended" value = "Ended: scrBrew300_2_Sparging and 2nd_Run"
sleep 101
endif
clear
start "scrBrew300_3_Wait_Boil"
stop "scrBrew300_2_Sparging and 2nd_Run"
```

## 32. scrBrew300_3_Wait_Boil

Starts by itself: No · User can start or stop it: Yes · 222 lines

```text
//scrBrew300_3_Wait_Boil
//08/03/2023 10:03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//seperated frm scrBreww300  03/21/2026 09:03
//Modified
"sw_Running_Script_B" state  = true
"gblV_Sub3_Status" value = 0
"gblV_Sub4_Status" value = 0
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
"gblS_Script_Started" value = "Started: scrBrew300_3_Wait_Boil" 
//................................
if vB_Testing == true
	"gblS_Script_Started" value = "Started: scrBrew300_3_Wait_Boil" 
	"gblS_Inter_Script" value = " -- "
	"gblS_Script_Ended" value = "Ended: scrBrew300_2_Sparging and 2nd_Run"
	"gblS_Script_Started" visibility = visible
	"gblS_Script_Ended" visibility = visible
	"gblS_Inter_Script" visibility = visible
start "step_scrTest_Time _Reset"
	start "looper_scrBoilTimer_Reset"
	"gblV_Brew_Status" visibility = visible
	"gblV_Sub3_Status" visibility = visible
	"gblV_Sub4_Status" visibility = visible
	"gblTValveDelay" value = 00:00:01
	sleep 999
	else
	"gblS_Script_Started" visibility = hidden
	"gblS_Script_Ended" visibility = hidden
	"gblS_Inter_Script" visibility = hidden
	stop "step_scrTest_Time _Reset"
	stop "looper_scrBoilTimer_Reset"
	"gblV_Brew_Status" visibility = hidden
	"gblV_Sub3_Status" visibility = hidden
	"gblV_Sub4_Status" visibility = hidden
	"gblTValveDelay" value = 00:00:07
	endif
//...................................
new string vSMsg
new string vSMsg1
start "inscpt_scrAlarm"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
//.............................................................
//.............................................................
stop "looper_scrAutoSwitch"
sleep 100
start "looper_scrAutoSwitch"
stop "looper_scrBackGrounds"
sleep 100
start "looper_scrBackGrounds"
"gblV_Brew_Status" value = 367
goto "SectionBrew367"
[SectionBrew367]
wait "gblV_Brew_Status" value == 367
"VGC_19_do_BrewKettleTangental_On_B1"  state = false
"VGC_3_do_RedPumpValve_On_B1" state = false
"VGC_7_do_Left_MLT_Isolation_On_B1"  state = false
vSMsg = " Adjust the Flame on the Brew Kettle. Once the Boil starts (based on Boil Temperature),  the Boil Timer (and Hops) start automatically.  Click Flame Adjusted? "
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_swAllSwitch_Label_Text" value = "Flame Adjusted?"
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"tmBrewDay_B1" visibility = visible
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//BackGrounds
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
wait  "gblV_Brew_Status" value == 368
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "Monitor the Flame and wait for the Boil."
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = true
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
"gblV_Brew_Status" value = 384
goto "SectionBrew384"
//............................................................
[SectionBrew368]
[SectionBrew369]
[SectionBrew370]
[SectionBrew371]
[SectionBrew371]
[SectionBrew372]
[SectionBrew373]
[SectionBrew374]
[SectionBrew375]
[SectionBrew376]
[SectionBrew377]
[SectionBrew378]
[SectionBrew378]
[SectionBrew380]
[SectionBrew381]
[SectionBrew382]
[SectionBrew384]
[SectionBrew384]
wait "gblV_Brew_Status" value == 384
"gblS_Bottom_Text" value = "Wait. Will Auto Advance!"
if "sw_Flow_Sanitize_Radiator"  state ==  true 
"gblV_RadiatorSetPoint_P1_B1" value = 185
"gblS_Top_Text" value = "FYI: The Plate Chiller Sanitation will be from the Radiator.  The Temperature of the Radiator is increasing to 185 °F. You can add additional water to the Radiator with the FireHose if you want."
else
"gblV_RadiatorSetPoint_P1_B1" value = 140
"gblS_Top_Text" value = "FYI: The Plate Chiller Sanitation will be from the Big Mac.  The Temperature of the Radiator is set  to 140 °F for cleaning.  You can add additional water to the Radiator with the FireHose if you want."
endif
//...................................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = vSMsg
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = true
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = true
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
"tmTopRight_B1"  visibility = visible
"gblS_Brewery_Bottom_3" value = "Wait for Boil"
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
//..........................................................
"gblV_Brew_Status" value =  396
[SectionBrew385]
[SectionBrew386]
[SectionBrew387]
[SectionBrew388]
[SectionBrew389]
[SectionBrew390]
[SectionBrew391]
[SectionBrew392]
[SectionBrew393]
[SectionBrew394]
[SectionBrew395]
[SectionBrew396]
wait "gblV_Brew_Status" value == 396
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_1" value = "Take a WORT sample for Specific Gravity and set to cool.  Later. the reading will be added so we will know the PreBoil Specific Gravity."
"gblS_swAllSwitch_Label_Text" value = "Sample Taken?"
//BackGrounds
"gblS_Brewery_Top_1" background = 2
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible 
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
[SectionBrew397]
wait "gblV_Brew_Status" value == 397
"MB_28_do_ManualAlarm_B1" state = false
"gblV_Brew_Status" value = 400
[SectionBrew398]
[SectionBrew399]
[SectionBrew400]
wait "gblV_Brew_Status" value == 400
"tmTopRight_B1"  visibility = visible
[END_scrBrew300_3]
	if vB_Testing == true
		"gblS_Script_Ended" value = "Ended: scrBrew300_3_Wait_Boil"
		sleep 4001
	endif
clear
start "inscpt_scr_Inner_Blue"
start "scrBrew400_1_Start_Boil_HotBreak"
"sw_Running_Script_B" state = false
stop "scrBrew300_3_Wait_Boil"
```

## 33. scrBrew400_1_Start_Boil_HotBreak

Starts by itself: No · User can start or stop it: Yes · 671 lines

```text
//scrBrew400_1_Start_Boil_HotBreak Modified 260906 06_10
//08/03/2023 10:03
// Seperated from scrBrew400 04/08/26 16:01
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// all of alm_Hidden_Beer_Music_1 used in this script
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
//................................
//.........................
	if vB_Testing == true
		"gblS_Script_Started" value = "Started: scrBrew400_1_Start_Boil_HotBreak" 
		"gblS_Script_Started" visibility = visible
		"gblS_Script_Ended" visibility = visible
		"gblS_Inter_Script" visibility = visible
		start "step_scrTest_Time _Reset"
		start "looper_scrBoilTimer_Reset"
		"gblTValveDelay" value = 00:00:01
		sleep 999
	else
		"gblS_Script_Started" visibility = hidden
		"gblS_Script_Ended" visibility = hidden
		"gblS_Inter_Script" visibility = hidden
		stop "step_scrTest_Time _Reset"
		stop "looper_scrBoilTimer_Reset"
		"gblTValveDelay" value = 00:00:07
	endif
//.........................
//.........................
"gblV_Group_1_Conflict" value = 9
"gblV_Group_2_Conflict" value = 4
new time vT_Drop
new time VT_Ten 
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vSMsg4
new bool vB_Warning_Hop
new bool vB_Warning_Hop_1
new bool vB_Warning_Hop_2
new bool vB_Warning_Hop_3
new bool vB_Warning_Hop_4
new bool vB_Warning_Hop_5
new bool vB_Warning_Hop_6
new bool vB_Warning_Hop_7
new bool vB_Warning_Hop_8
new bool vB_Use_Hop_1
new bool vB_Use_Hop_2
new bool vB_Use_Hop_3
new bool vB_Use_Hop_4
new bool vB_Use_Hop_5
new bool vB_Use_Hop_6
new bool vB_Use_Hop_7
new bool vB_Use_Hop_8
new value vV_Boil_Minutes
new value vV_Drop_Minutes_Hop1
new value vV_Drop_Minutes_Hop2
new value vV_Drop_Minutes_Hop3
new value vV_Drop_Minutes_Hop4
new value vV_Drop_Minutes_Hop5
new value vV_Drop_Minutes_Hop6
new value vV_Drop_Minutes_Hop7
new value vV_Drop_Minutes_Hop8
vV_Boil_Minutes = "gblVBoilTime_Minutes" value 
new value vV_PreWarn_SOB
new value vV_Drop
vV_PreWarn_SOB = vV_Boil_Minutes - 10
print " vV_Boil_Minutes = "
print vV_Boil_Minutes
print "  vV_PreWarn_SOB = "
print vV_PreWarn_SOB
//....................................................
"RP_v_PreBoil_Volume" value = "gblVCurrentBrewKettle_Volume" value
"RP_t_TimetoBoil_Time" value = 00:00:00
//Where to Start
"gblV_Brew_Status" value = 400
goto "SectionBrew400"
//..................................................
[SectionBrew400]
stop "step_scrHops_Timing"
wait "gblV_Brew_Status" value == 400
start "inscpt_scrAlarm"
sleep 100
"gblV_RadiatorSetPoint_P1_B1" value = 140
"gblV_BigMacSetPointP1_B1" value = 185
"gblV_Brew_Status" value = 402
[SectionBrew401]
[SectionBrew402]
wait "gblV_Brew_Status" value == 402
//.........................
[Set_Hop_1]
	if "sw_Use_Hop1_Batch" state == false
	goto "Set_Hop_2"
	else
	vB_Use_Hop_1 = true
	endif
	if "gblV_Hop1_Group_R1" value < 0
	goto "Set_Hop_2"
	endif
vV_Drop = "gblV_TimeHop1_Min_R1" value
	if vV_Drop >= vV_PreWarn_SOB
		vV_Drop_Minutes_Hop1 = vV_Boil_Minutes - vV_Drop
		vB_Warning_Hop = true
		vB_Warning_Hop_1 = true
	endif
//.........................
[Set_Hop_2]
	if "sw_Use_Hop2_Batch" state == false
	goto "Set_Hop_3"
	else
	vB_Use_Hop_2 = true
	endif
	if "gblV_Hop2_Group_R1" value < 0
	goto "Set_Hop_3"
	endif
vV_Drop = "gblV_TimeHop2_Min_R1" value
	if vV_Drop >= vV_PreWarn_SOB
		vV_Drop_Minutes_Hop2 = vV_Boil_Minutes - vV_Drop
		vB_Warning_Hop = true
		vB_Warning_Hop_2 = true
	endif
//.........................
[Set_Hop_3]
	if "sw_Use_Hop3_Batch" state == false
	goto "Set_Hop_4"
	else
	vB_Use_Hop_3 = true
	endif
	if "gblV_Hop3_Group_R1" value < 0
	goto "Set_Hop_4"
	endif
vV_Drop = "gblV_TimeHop3_Min_R1" value
	if vV_Drop >= vV_PreWarn_SOB
		vV_Drop_Minutes_Hop3 = vV_Boil_Minutes - vV_Drop
		vB_Warning_Hop = true
		vB_Warning_Hop_3 = true
	endif
//.........................
[Set_Hop_4]
	if "sw_Use_Hop4_Batch" state == false
	goto "Set_Hop_5"
	else
	vB_Use_Hop_4 = true
	endif
	if "gblV_Hop4_Group_R1" value < 0
	goto "Set_Hop_5"
	endif
vV_Drop = "gblV_TimeHop4_Min_R1" value
	if vV_Drop >= vV_PreWarn_SOB
		vV_Drop_Minutes_Hop4 = vV_Boil_Minutes - vV_Drop
		vB_Warning_Hop = true
		vB_Warning_Hop_4 = true
	endif
//.........................
................
[Set_Hop_5]
	if "sw_Use_Hop5_Batch" state == false
	goto "Set_Hop_6"
	else
	vB_Use_Hop_5 = true
	endif
	if "gblV_Hop5_Group_R1" value < 0
	goto "Set_Hop_6"
	endif
vV_Drop = "gblV_TimeHop5_Min_R1" value
	if vV_Drop >= vV_PreWarn_SOB
		vV_Drop_Minutes_Hop5 = vV_Boil_Minutes - vV_Drop
		vB_Warning_Hop = true
		vB_Warning_Hop_5 = true
	endif
//.........................
//.........................
[Set_Hop_6]
	if "sw_Use_Hop6_Batch" state == false
	goto "Set_Hop_7"
	else
	vB_Use_Hop_6 = true
	endif
	if "gblV_Hop6_Group_R1" value < 0
	goto "Set_Hop_7"
	endif
vV_Drop = "gblV_TimeHop6_Min_R1" value
	if vV_Drop >= vV_PreWarn_SOB
		vV_Drop_Minutes_Hop6 = vV_Boil_Minutes - vV_Drop
		vB_Warning_Hop = true
		vB_Warning_Hop_6 = true
	endif
//.........................
//.........................
[Set_Hop_7]
	if "sw_Use_Hop7_Batch" state == false
	goto "Set_Hop_8"
	else
	vB_Use_Hop_7 = true
	endif
	if "gblV_Hop7_Group_R1" value < 0
	goto "Set_Hop_8"
	endif
vV_Drop = "gblV_TimeHop7_Min_R1" value
	if vV_Drop >= vV_PreWarn_SOB
		vV_Drop_Minutes_Hop7 = vV_Boil_Minutes - vV_Drop
		vB_Warning_Hop = true
		vB_Warning_Hop_7 = true
	endif
//.........................
[Set_Hop_8]
	if "sw_Use_Hop8_Batch" state == false
	goto "Set_Hop_End"
	else
	vB_Use_Hop_8 = true
	endif
	if "gblV_Hop8_Group_R1" value < 0
	goto "Set_Hop_End"
	endif
vV_Drop = "gblV_TimeHop8_Min_R1" value
	if vV_Drop >= vV_PreWarn_SOB
		vV_Drop_Minutes_Hop8 = vV_Boil_Minutes - vV_Drop
		vB_Warning_Hop = true
		vB_Warning_Hop_8 = true
	endif
[Set_Hop_End]
"gblV_Brew_Status" value = 404
[SectionBrew403]
[SectionBrew404]
wait "gblV_Brew_Status" value == 404
	if vB_Warning_Hop == false
		goto "Test_Force_Boil" 
	endif 
//.........................
	if  "gblV_Group_SoB_Hops"  value == 1
		"alm_Hops_1_ALARM" background = 1
		"alm_Hops_1_ALARM" fileindex = 1
		"alm_Hops_1_ALARM" displayname = "Bittering Hops"
		vSMsg1 =  "First Bitter Hops at Start of Boil : "
		vSMsg2 =  "gblS_HopGroup_0" value 
		vSMsg = vSMsg1  + vSMsg2
		"gblS_HopMessage_ALARM"  value = vSMsg
		"gblS_HopMessage_ALARM" displayname = "Start of Boil Hops Warning"
		"gblS_HopMessage_ALARM" background = 3
		"gblS_HopMessage_ALARM" visibility = visible
		show workspace  "Alarms"
		"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
		"alm_Hidden_Hop_15min_Warning_ALARM" active = true
		"tm_HopTimer_WO1" type = countdown
		"tm_HopTimer_WO1" value = 00:00:15
		start "tm_HopTimer_WO1"
		"tm_HopTimer_WO1" value <= 00:00:00
		stop "tm_HopTimer_WO1"
		"alm_Hidden_Hop_15min_Warning_ALARM" active = false
		"gblS_HopMessage_ALARM" visibility = hidden
		show workspace  "B1 Brewery"
	endif
"gblV_Brew_Status" value = 406
[SectionBrew405]
[SectionBrew406]
wait "gblV_Brew_Status" value == 406
	"gblS_HopMessage_ALARM" displayname = "Bitter Hop within 10 minutes of the Start of Boil. "
	if vB_Warning_Hop == true
		if vB_Warning_Hop_1 == true
			vSMsg4 =  "First Bitter Hops within " 
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = vV_Drop_Minutes_Hop1
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = " minutes of the Boil: "
			vSMsg1 = vSMsg1 + vSMsg4
		endif
//..................................
		if vB_Warning_Hop_2 == true
			vSMsg4 =  "Second Bitter Hops within " 
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = vV_Drop_Minutes_Hop2
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = " minutes of the Boil: "
			vSMsg1 = vSMsg1 + vSMsg4
		endif
//..................................
		if vB_Warning_Hop_3 == true
			vSMsg4 =  "Third Bitter Hops within " 
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = vV_Drop_Minutes_Hop3
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = " minutes of the Boil: "
			vSMsg1 = vSMsg1 + vSMsg4
		endif
//..................................
		if vB_Warning_Hop_4 == true
			vSMsg4 =  "Fourth Bitter Hops within " 
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = vV_Drop_Minutes_Hop4
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = " minutes of the Boil: "
			vSMsg1 = vSMsg1 + vSMsg4
		endif
//..................................
		if vB_Warning_Hop_5 == true
			vSMsg4 =  "Fifth Bitter Hops within " 
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = vV_Drop_Minutes_Hop5
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = " minutes of the Boil: "
			vSMsg1 = vSMsg1 + vSMsg4
			endif
//..................................
		if vB_Warning_Hop_6 == true
			vSMsg4 =  "Sixth Bitter Hops within " 
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = vV_Drop_Minutes_Hop6
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = " minutes of the Boil: "
			vSMsg1 = vSMsg1 + vSMsg4
		endif
//..................................
		if vB_Warning_Hop_7 == true
			vSMsg4 =  "Seventh Bitter Hops within " 
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = vV_Drop_Minutes_Hop7
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = " minutes of the Boil: "
			vSMsg1 = vSMsg1 + vSMsg4
		endif
//..................................
		if vB_Warning_Hop_8 == true
			vSMsg4 =  "Eighth Bitter Hops within " 
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = vV_Drop_Minutes_Hop8
			vSMsg1 = vSMsg1 + vSMsg4
			vSMsg4 = " minutes of the Boil: "
			vSMsg1 = vSMsg1 + vSMsg4
		endif
//..................................
[Message_PreWarn]	
"gblV_Brew_Status" value = 408
[SectionBrew407]
[SectionBrew408]
show workspace  "Alarms"
wait "gblV_Brew_Status" value == 408
vSMsg = vSMsg1
"gblS_HopMessage_ALARM"  value = vSMsg
"gblS_HopMessage_ALARM" visibility = visible
"gblS_HopMessage_ALARM" background = 3
show workspace  "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:15
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
show workspace  "B1 Brewery"
//............................................................
[Test_Force_Boil]
"gblV_Brew_Status" value = 410
[SectionBrew409]
[SectionBrew410]
wait "gblV_Brew_Status" value == 410
print "Waiting on Boil"
	if vB_Testing == true
		"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
		"gblS_Brewery_Top_3" value = "Ready to force the Boil.  Since this is testing and we need to force the Boil, simply click Force Boil? when ready."
		"gblS_Brewery_Bottom_3" value = " Click Force Boil?  BruControl will act as if the Boil has started."
		"gblS_swAllSwitch_Label_Text" value = "Force Boil?"
		//........................................
		//Inspector_Red
		"gblV_Set_BackGround_Middle_Time" value = 4
		start "inscpt_scrSet_Middle_Backgrounds"
		//........................................
		//BackGrounds
		"gblS_Brewery_Top_3" background = 1
		"gblS_Brewery_Bottom_3" background = 1
		"insp_Pix_ArrowAllSwitch_B1" background = 1
		"gblS_swAllSwitch_Label_Text" background = 1
		//Visibility
		"gblS_Brewery_Top_2" visibility = hidden
		"gblS_Brewery_Top_3" visibility = visible
		"gblS_Brewery_Bottom_1" visibility = hidden
		"gblS_Brewery_Bottom_4" visibility = hidden
		"gblS_Brewery_Bottom_3" visibility = visible
		"gblVReport_B1" visibility = hidden
		"gblSReportLabel_B1" visibility = hidden
		"gblS_swAllSwitch_Label_Text" visibility = visible
		"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
		"sw_Advance_ BrewStatus" visibility = visible 
		"gblV_Brew_Status" value = 409
		wait "gblV_Brew_Status" value == 410
		goto "StartofBoil"
	endif
"gblV_Brew_Status" value = 412	
[SectionBrew411]
[SectionBrew412]
wait "gblV_Brew_Status" value == 412
//........................................
vSMsg = "Wait for the Boil.  Monitor the Brew Kettle Flame.  The Boil will start based upon the temperture of the Brew Kettle.  The Boil can be forced or wait for the Boil."
"gblS_swAllSwitch_Label_Text" value =  "Force Boil?"
"gblS_Brewery_Top_1" value = vSMsg
"gblSReportLabel_B1" value = "Wait for the Boil or Click Force Boil?"
//...............................
//...............................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...............................
"gblS_Top_Text" value = "Wait for the Boil.  Monitor the Brew Kettle Flame.  The Boil will start based upon the temperture of the Brew Kettle.  "
"gblS_swAllSwitch_Label_Text" value =  "Force Boil?"
"gblS_Bottom_Text" value = "The Boil can be forced when near Boil Temereature (Around 210°F)."
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
[Loop_412]
	if "MB_55_10K_Brew_Kettle_B1" value >= 210
	"sw_Running_Advance_with_Switch" state = false
	endif
	if  "sw_Running_Advance_with_Switch" state == false
	goto "Exit_Loop_412"
	endif
goto "Loop_412"	
[Exit_Loop_412]
//...............................
//..............................
[StartofBoil]
"gblV_Brew_Status" value = 414	
[SectionBrew413]
[SectionBrew414]
wait "gblV_Brew_Status" value == 414
stop "tmBottomRight_B1"
"RP_t_TimetoBoil_Time" value =  "tmBottomRight_B1" value
[Boil_Timers_Started]
stop "tmTopRight_B1"
"tmTopRight_B1" type = countdown
"tmTopRight_B1" displayname = "Boil Timer"
"tmTopRight_B1" value = 01:30:00
"tmTopRight_B1" visibility = visible
start "tmTopRight_B1"
stop "tmBottomRight_B1"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" displayname = "Boil Timer"
"tmBottomRight_B1" value = "tmTopRight_B1" value
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
stop "tm_Mash Timer_Water"
"tm_Mash Timer_Water" type = countdown
"tm_Mash Timer_Water" displayname = "Boil Timer"
"tm_Mash Timer_Water" visibility = visible
start "tm_Mash Timer_Water"
"tm_Mash Timer_Water" value = "tmTopRight_B1" value
stop "tm_BottomRight_ALARM"
"tm_BottomRight_ALARM" type = countdown
"tm_BottomRight_ALARM" displayname = "Boil Timer"
"tm_BottomRight_ALARM" visibility = visible
start "tm_BottomRight_ALARM"
"tm_BottomRight_ALARM" value = "tmTopRight_B1" value
//start "step_scrHops_Timing"
"gblV_Brew_Status" value = 416	
[SectionBrew415]
[SectionBrew416]
wait "gblV_Brew_Status" value == 416
 if  "gblV_Group_SoB_Hops"  value == 1
	show workspace  "Alarms"
	vSMsg1 =  "Bitter Hops at Start of Boil : "
	vSMsg2 =  "gblS_HopGroup_0" value 
	vSMsg = vSMsg1  + vSMsg2
	"gblS_HopMessage_ALARM"  value = vSMsg
	"gblS_HopMessage_ALARM" displayname = "Drop Start of Boil Bitter Hops"
	"gblS_HopMessage_ALARM" visibility = visible
	"gblS_HopMessage_ALARM" background = 1
	"alm_Hops_1_ALARM" active = true
	"alm_Hops_1_ALARM"  visibility = visible
	"gblS_HopMessage_ALARM"  visibility = visible
	wait   "alm_Hops_1_ALARM"  active ==  false
	start "inscpt_scrAlarm"
endif
"gblV_Brew_Status" value = 418	
[SectionBrew417]
[SectionBrew418]
wait "gblV_Brew_Status" value == 418
"gblS_Brewery_Bottom_1" value = "Boiling"
"gblS_swAllSwitch_Label_Text" value = "Wait?"
//BackGrounds
"gblS_Brewery_Top_2" background = 3
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_1" background = 1
"gblS_Brewery_Bottom_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
"tmTopRight_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = visible
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:15
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"gblV_Brew_Status" value = 420	
[SectionBrew419]
[SectionBrew420]
wait "gblV_Brew_Status" value == 420
"gblT_SetTimer" value = 00.01:29:07
"gblS_Brewery_Bottom_3" value = "WORT is Boiling"
"tmBottomRight_B1" displayname = "Boil Timer"
// Sing Ein Prosit
"gblS_HopMessage_ALARM" visibility = hidden
show workspace "Alarms"
"alm_Hidden2_ALARM" Sound =  custom
"alm_Hidden2_ALARM" fileindex = 1
"alm_Hidden2_ALARM" active = true
"gblS_Pix_Pivo_ALARM" background = 1
"gblS_Pix_Pivo_ALARM" visibility = visible
"gblT_SetTimer" value = 00.01:29:07
	if vB_Testing == true
		wait "tmTopRight_B1" value < 01:29:45
		"gblT_SetTimer" value = 01:29:07
		stop "tm_Hidden_1"
		reset "tm_Hidden_1"
		start "tm_Hidden_1"
		wait "tm_Hidden_1" value <= 00:00:00
		stop "tm_Hidden_1"
	"sw_Advance_Timer" state = true
	endif
wait "tmTopRight_B1" value <= 01:29:05
"alm_Hidden2_ALARM" active = false
"gblS_Pix_Pivo_ALARM" background = 1
"gblS_Pix_Pivo_ALARM" visibility = hidden
"tmTopRight_B1" visibility = hidden
"tmBottomRight_B1" visibility = visible
show workspace "B1 Brewery"
"gblV_Brew_Status" value = 422	
[SectionBrew421]
[SectionBrew422]
wait "gblV_Brew_Status" value == 422
vT_Drop = "gblT_Hop1Drop_R1" value 
VT_Ten = "gblT_Hop2Drop_R1" value
if "gblV_Hop1_Group_R1" value > 0
	if vT_Drop  >=  01:25:00
		print "@ 563 Do Not Proceed until Alarm Made  Early Group 1 Drop "
		"tmBottomRight_B1" visibility = hidden
		"tmTopRight_B1" visibility = visible
		"gblS_Brewery_Top_3" visibility = hidden
		"gblS_Brewery_Top_2" visibility = hidden
		"gblS_Brewery_Bottom_3" background = 3
		"gblS_Brewery_Bottom_3" Value = "Hop Drop Soon"
		"gblS_Brewery_Bottom_3" visibility = visible
		wait "alm_Hops_1_ALARM" active == true
		wait "alm_Hops_1_ALARM" active == false
		"gblS_Brewery_Bottom_3" visibility = hidden
	endif
endif
"gblV_Brew_Status" value = 424	
[SectionBrew423]
[SectionBrew424]
wait "gblV_Brew_Status" value == 424
if "gblV_Hop2_Group_R1" value > 0
	if VT_Ten  >=  01:25:00
		print "@ 605 Do Not Proceed until Alarm Made  Early Group 2 Drop "
		"tmBottomRight_B1" visibility = hidden
		"tmTopRight_B1" visibility = visible
		"gblS_Brewery_Top_3" visibility = hidden
		"gblS_Brewery_Top_2" visibility = hidden
		"gblS_Brewery_Bottom_3" background = 3
		"gblS_Brewery_Bottom_3" Value = "Hop Drop Soon"
		"gblS_Brewery_Bottom_3" visibility = visible
		wait "alm_Hops_1_ALARM" active == true
		wait "alm_Hops_1_ALARM" active == false
		"gblS_Brewery_Bottom_3" visibility = hidden
	endif
endif
"gblV_Brew_Status" value = 426
[SectionBrew425]
[SectionBrew426]
wait "gblV_Brew_Status" value == 426
vT_Drop = "gblT_Hop3Drop_R1" value 
VT_Ten = "gblT_Hop4Drop_R1" value
if "gblV_Hop3_Group_R1" value > 0
	if vT_Drop  >=  01:25:00
		print "@ 588 Do Not Proceed until Alarm Made  Early Group 3 Drop "
		"tmBottomRight_B1" visibility = hidden
		"tmTopRight_B1" visibility = visible
		"gblS_Brewery_Top_3" visibility = hidden
		"gblS_Brewery_Top_2" visibility = hidden
		"gblS_Brewery_Bottom_3" background = 3
		"gblS_Brewery_Bottom_3" Value = "Hop Drop Soon"
		"gblS_Brewery_Bottom_3" visibility = visible
		wait "alm_Hops_1_ALARM" active == true
		wait "alm_Hops_1_ALARM" active == false
		"gblS_Brewery_Bottom_3" visibility = hidden
	endif
endif
"gblV_Brew_Status" value = 428	
[SectionBrew427]
[SectionBrew428]
wait "gblV_Brew_Status" value == 428
if "gblV_Hop4_Group_R1" value > 0
	if VT_Ten  >=  01:25:00
		print "@ 605 Do Not Proceed until Alarm Made  Early Group 4 Drop "
		"tmBottomRight_B1" visibility = hidden
		"tmTopRight_B1" visibility = visible
		"gblS_Brewery_Top_3" visibility = hidden
		"gblS_Brewery_Top_2" visibility = hidden
		"gblS_Brewery_Bottom_3" background = 3
		"gblS_Brewery_Bottom_3" Value = "Hop Drop Soon"
		"gblS_Brewery_Bottom_3" visibility = visible
		wait "alm_Hops_1_ALARM" active == true
		wait "alm_Hops_1_ALARM" active == false
		"gblS_Brewery_Bottom_3" visibility = hidden
	endif
endif
"gblV_Brew_Status" value = 430	
[SectionBrew429]
[SectionBrew430]
wait "gblV_Brew_Status" value == 430
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_3" value = "Boiling"
"gblS_Brewery_Top_3" value = "Adjust Brew Kettle Flame. Monitor Boil.  Wait for Hot Break.  Watch the Boil Kettle and monitor the Boil Over.   Will Auto Advance"
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_4" value = "Wait for Hot Break. Will Auto Advance"
"gblS_Brewery_Bottom_4" background = 1
"gblS_swAllSwitch_Label_Text" value = "Check to fill Big Mac after the Hot Break."
"sw_Advance_ BrewStatus" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" background = 3
"tmTopRight_B1" visibility = hidden
"tmBottomRight_B1" visibility = visible
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
stop "tm_Hidden_1"
"tm_Hidden_1" value = 00:00:10
"tm_Hidden_1" type = countdown
start "tm_Hidden_1"
wait  "tm_Hidden_1" value  <= 00:00:00:00
stop "tm_Hidden_1"
"gblV_Brew_Status" value = 432	
[SectionBrew431]
[SectionBrew432]
wait "gblV_Brew_Status" value == 432
[End_scr400_1]
print 669
	if vB_Testing == true
print 671
		"gblS_Script_Ended" value = "Ended: scrBrew400_1_Start_Boil_HotBreak"
print 673
		sleep 4001
print 674
	endif
print 
	clear
start "scrBrew400_2_Boiling_Sanitize"
stop "scrBrew400_1_Start_Boil_HotBreak"
```

## 34. scrBrew400_2_Boiling_Sanitize

Starts by itself: No · User can start or stop it: Yes · 563 lines

```text
//scrBrew400_2_Boiling_Sanitize
//08/03/2023 10:03
// Seperated from scrBrew400 04/08/26 16:01
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// all of alm_Hidden_Beer_Music_1 used in this script
[Set_Testing]
"sw_Running_Script_B" state  = true
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
//................................
//.........................
	if vB_Testing == true
		"gblS_Script_Started" value = "Started: scrBrew400_1_Start_Boil_HotBreak" 
 
		"gblS_Script_Started" visibility = visible
		"gblS_Script_Ended" visibility = visible
		"gblS_Inter_Script" visibility = visible
		start "step_scrTest_Time _Reset"
		start "looper_scrBoilTimer_Reset"
		"gblTValveDelay" value = 00:00:01
		sleep 999
	else
		"gblS_Script_Started" visibility = hidden
		"gblS_Script_Ended" visibility = hidden
		"gblS_Inter_Script" visibility = hidden
		stop "step_scrTest_Time _Reset"
		stop "looper_scrBoilTimer_Reset"
		"gblTValveDelay" value = 00:00:07
	endif
//.........................
//.........................
"gblV_Group_1_Conflict" value = 9
"gblV_Group_2_Conflict" value = 4
//.........................
//.........................
"gblV_Group_1_Conflict" value = 9
"gblV_Group_2_Conflict" value = 4
	if vB_Testing == true
		"gblVCurrentBigMac_Volume" value = 22.3
			if "tmTopRight_B1" value > 01:29:15
				"gblT_SetTimer" value = 01:29:15
				sleep 5000
				"sw_Advance_Timer" state = true
			endif
	endif
start "inscpt_scrBasicStart"
start "inscpt_scrAlarm"
"gblV_Group_1_Conflict" value = 9
"gblV_Group_2_Conflict" value = 4
new time vT_Drop
new time VT_Ten 
new string vSMsg
new string vSMsg1
new string vS_Msg_Calc
new string vS_Msg_Calc_1
new string vS_TTL_Time
new value vVBrewStatus
new value xP
new value vVCalc1
new value vVCalc2
new value vVFill_Volume
new value vVDesired_BigMac_Volume 
new value vV_Start_BigMac_Volume
new value vVFill_Volume_Min
new value vVCurrent_BigMac_Volume
new value vVCurrent_Radiator_Volume
new value vV_Start_Radiator_Volume
new value vV_Vessel_Start
new value vV_Vessel_End
new value vV_Vessel_Delta
new value vV_Gal_to_Fill
new time  vT_Total_Time
new value vVRate_Orginal
new value vVRate_Calc
new value vVRate_Delta
new value vV_Elasped
vVCurrent_BigMac_Volume = "gblVCurrentBigMac_Volume" value
vV_Start_BigMac_Volume = vVCurrent_BigMac_Volume
vVCurrent_Radiator_Volume = "gblVCurrentRadiator_Volume" value
vV_Start_Radiator_Volume = vVCurrent_Radiator_Volume
//....................................................
vVDesired_BigMac_Volume = "gblV_Refill_Big_Mac_Mash" value
vVFill_Volume = vVDesired_BigMac_Volume - vV_Start_BigMac_Volume
	if vVDesired_BigMac_Volume < vVDesired_BigMac_Volume
		vVFill_Volume_Min = vVDesired_BigMac_Volume	
	endif
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
//...................................................
//Where to Start
"gblV_Brew_Status" value =  434
goto "SectionBrew434"
//..................................................
[SectionBrew433]
[SectionBrew434]
"gblV_Brew_Status" value = 434
wait "gblV_Brew_Status" value == 434
"sw_Advance_Overide" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
vSMsg = "Confirm the Big Mac Volume. It is now recorded as "
vSMsg1 = vVCurrent_BigMac_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. This will be used to set the  Volume to refill the Big Mac. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg  
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
"gblS_swAllSwitch_Label_Text" value = "Big Mac Volume?"
"gblSReportLabel_B1" value = "Record Big Mac Volume"
vSMsg = "Big Mac Volume previously calculated at "
vSMsg1 = vVCurrent_BigMac_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. "
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1"  value = vSMsg
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 2 
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
wait  "gblVReport_B1" value > 0
"gblVCurrentBigMac_Volume" value = "gblVReport_B1" value
"gblS_Brewery_Top_2" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" value = 0
"gblV_Brew_Status" value = 436
[SectionBrew435]
[SectionBrew436]
wait "gblV_Brew_Status" value == 436
vV_Start_BigMac_Volume =  "gblVCurrentBigMac_Volume" value
vVFill_Volume = vVDesired_BigMac_Volume - vV_Start_BigMac_Volume
	if vVFill_Volume < 3
		goto "Big_Mac_OK"
	endif	
"gblV_Brew_Status" value = 438
[SectionBrew437]
[SectionBrew438]
wait "gblV_Brew_Status" value == 438
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
print 173
vSMsg = "Ready to set the Manifold to refill the Big Mac with  "
vSMsg1 = vVFill_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons from the Manifold Supply Valve.  The Big Mac will be used for Sanitation, Topping Off, Flushing and Cleaning.  Click Set Manifold? when ready"
vSMsg = vSMsg + vSMsg1
"gblS_Top_Text" value = vSMsg 
"gblS_Brewery_Bottom_3" value = " Click Set Manifold?  BruControl will set the mainfold to fill the Big Mac."
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Set Fill Paramters
"gblV_Vessel_From" value = 100
"gblV_Vessel_To" value = 1 
"gblV_Vessel_Measure"  value = 1
"gblV_Pump" value = 100
"gblV_Isolation_Valve" value = 1
"gblV_Gals_to_Fill" value = vVFill_Volume
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
start "inscpt_scrStopScriptManifold"
sleep 100
start "inscpt_scr_Inner_Blue"
goto "SectionBrew440"
[SectionBrew439]
[SectionBrew440]
"gblV_Brew_Status" value = 440
wait "gblV_Brew_Status" value == 440
"gblV_Water_Switch_Status_Water" value = 1
"sw_Flow_Skip_TimeorVolume" state = true
sleep 100
//RefillBigMac
print "@ 211 start refilling Big MAC"
"gblV_Sub3_Status" value = 0
"gblV_Sub4_Status" value = 0
start "sub_scrManifold_Choice"
sleep 4001
	if vB_Testing == true
	"gblS_Inter_Script" value =  "scrBrew400_2_Boiling_Sanitize @ 214  ReFill Big Mac  > start: sub_scrManifold_Choice"
	sleep 4001
	endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 222 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
print 224
"gblV_Brew_Status" value = 442
[SectionBrew441]
[SectionBrew442]
wait "gblV_Brew_Status" value == 442
	if vB_Testing == true
		"gblT_SetTimer" value = 01:20:00
		sleep 5000
			"sw_Advance_Timer" state = true
	endif
//...............................
//...............................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...............................
"gblS_Top_Text" value =  "Wait for Hot Break.  You can only advance the program by clicking Hot Break?  Watch the Boil Kettle and monitor the Boil Over!"
"gblS_Bottom_Text" value = "Click Hot Break? when it occurs.  Monitor the Boil and adjust Brew Kettle Flame."
"gblS_swAllSwitch_Label_Text" value = "Hot Break?"
//" set any switches sw_Flow_Flush_HERMs" state = true
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
//...............................
[Exit_HotBreak]
"gblV_Brew_Status" value = 444
[SectionBrew443]
[SectionBrew444]
wait "gblV_Brew_Status" value == 444
print "@ 259  Hot Break Done"
"RP_t_HotBreak_Time" value = "tmTopRight_B1" value
"gblV_Brew_Status" value = 446
[SectionBrew445]
[SectionBrew446]
wait "gblV_Brew_Status" value == 446
"gblS_Brewery_Bottom_3" value = "Boiling Mointor Brew Kettle Flame. Waiting for Time Remining to be just under One Hour."
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
"gblS_Brewery_Bottom_3" visibility = visible
"tmTopRight_B1" visibility = visible
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
//Switch
"gblS_swAllSwitch_Label_Text" value = "Wait?"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"tmBottomRight_B1" value = "tmTopRight_B1" value
"tm_BottomRight_ALARM"   value = "tmTopRight_B1" value
"tm_Mash Timer_Water"  value = "tmTopRight_B1" value
"alm_Hidden_Beer_Music_1" fileindex = 1
start "inscpt_scrAlarm"
	if vB_Testing == true
		wait "tmTopRight_B1" value < 01:19:00
		"gblT_SetTimer" value = 01:14:20
		sleep 5000
		"sw_Advance_Timer" state = true
	endif
wait "tmTopRight_B1" value <= 01:14:15
"alm_Hidden_Beer_Music_1" active = true
	if vB_Testing == true
		"gblT_SetTimer" value = 01:11:10
		sleep 5000
		"sw_Advance_Timer" state = true
	endif
wait "tmTopRight_B1" value <= 01:11:00
"alm_Hidden_Beer_Music_1" active = false
	if vB_Testing == true
		wait "tmTopRight_B1" value < 01:10:59
		"gblT_SetTimer" value = 01:10:05
		sleep 5000
		"sw_Advance_Timer" state = true
	endif
"gblV_Brew_Status" value = 448
[SectionBrew447]
[SectionBrew448]
wait "gblV_Brew_Status" value == 448
	if vB_Testing == true
		wait "tmTopRight_B1" value < 01:09:59
		"gblT_SetTimer" value = 01:00:05
		sleep 5000
		"sw_Advance_Timer" state = true
	endif
wait "tmTopRight_B1" value < 01:00:00
"gblS_Brewery_Bottom_3" value = "Boiling.  Mointor Brew Kettle Flame. Less than an Hour .  Start thinking Sanitation!"
	if vB_Testing == true
		wait "tmTopRight_B1" value < 00:59:50
		"gblT_SetTimer" value = 00:58:05
		sleep 5000
		"sw_Advance_Timer" state = true
	endif
wait "tmTopRight_B1" value <= 00:58:00
"gblS_Brewery_Top_2" value = "58 Minutes Remaining for the Boil"
"gblS_Brewery_Bottom_3" value = "Boil.   Monitor the Temperatures.  The Boil will end when the Boil Timer reaches 00:00:00"
"gblS_swAllSwitch_Label_Text" value = "58 Minutes Remaining"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//BackGrounds
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Boil Timer"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" value = "tmTopRight_B1" value
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
//
"alm_Hidden_Beer_Music_1" fileindex = 3
wait "tmTopRight_B1" value <= 00:57:45
"gblS_swAllSwitch_Label_Text" value = "Boiling"
"tmTopRight_B1" visibility = visible
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
start "inscpt_scrAlarm"
sleep 4001
"alm_Hidden_Beer_Music_1" active = true
	if vB_Testing == true
		wait "tmTopRight_B1" value < 00:57:40
		"gblT_SetTimer" value = 00:55:05
		sleep 5000
		"sw_Advance_Timer" state = true
	endif
wait "tmTopRight_B1" value <= 00:55:00
"alm_Hidden_Beer_Music_1" active = false
"gblS_swAllSwitch_Label_Text" background = 3
"gblV_Brew_Status" value = 450
[SectionBrew449]
[SectionBrew450]
wait "gblV_Brew_Status" value == 450
if "sw_Flow_Sanitize_Radiator" state == true
"gblS_Brewery_Top_2" value = "Set Hoses to sanitize with the Radiator. Sanitation Will Not start.  Make sure that you have water in the Radiator and that it is heating.  Click Hoses Set? when done."
else
"gblS_Brewery_Top_2" value = "Set Hoses to sanitize with the Big Mac.  Sanitation Will Not start.  Make sure that you have water in the Big Mac and that it is heating.  Click Hoses Set? when done."
endif
"gblS_Brewery_Bottom_4" value = "55 Minutes Remains in Boil"
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//BackGrounds
"gblS_Brewery_Top_2" background = 2
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
"gblV_Brew_Status" value = 451
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew451]
[SectionBrew452]
wait "gblV_Brew_Status" value == 452
"MB_28_do_ManualAlarm_B1" state = false
"gblV_Brew_Status" value = 454
[SectionBrew453]
[SectionBrew454]
wait "gblV_Brew_Status" value == 454
"gblS_Brewery_Bottom_3" value = "Boiling.  Waiting to 48 Minutes remaining when Sanitation will Start. Mointor Brew Kettle Flame."
"gblS_swAllSwitch_Label_Text" value = "Wait?"
//Visibility
"tmTopRight_B1" visibility = 	visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//BackGrounds
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
"tmTopRight_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
	if vB_Testing == true
		wait "tmTopRight_B1" value < 00:54:45
		"gblT_SetTimer" value = 00:48:05
		sleep 5000
		"sw_Advance_Timer" state = true
	endif
wait "tmTopRight_B1" value <= 00:48:00
"gblV_Brew_Status" value = 456
[SectionBrew455]
[SectionBrew456]
wait "gblV_Brew_Status" value == 456
print 480
"sw_Advance_ BrewStatus" visibility = hidden
start "inscpt_scrAlarm"
sleep 100
"alm_Alarm_SanitizeBoil_ALARM" loop = true
"alm_Alarm_SanitizeBoil_ALARM" fileindex = 1
"alm_Alarm_SanitizeBoil_ALARM" displayname = "Sanitize!"
"alm_Alarm_SanitizeBoil_ALARM" visibility = visible
show workspace "Alarms"
"alm_Alarm_SanitizeBoil_ALARM" active = true
wait  "alm_Alarm_SanitizeBoil_ALARM" active == false
"alm_Alarm_SanitizeBoil_ALARM" visibility = hidden
show workspace "B1 Brewery"
"gblS_Bottom_Text" value = " Monitor the Hoses and the Sanitation Temperature"
	if "sw_Flow_Sanitize_Radiator" state == true
		"gblS_swAllSwitch_Label_Text" value = "Green Pump?"
		start "sub_2_scrPrimeandBasicManifold"
		sleep 100
		"gblS_Top_Text" value  = "Manifold is set to Sanitize using the Back Manifold and the Radiator. The Fermentor Fill Valve is an Isolation Valve and will operate automaticly .Click Green Pump to start Sanition."
		wait "sw_Running_Prime_Basic" state == false
		"gblS_swAllSwitch_Label_Text" value = "Green Pump?"
		goto "SectionBrew458"
	else
		"gblV_Water_Switch_Status_Water" value = 5001
		start "sub_2_scrPrimeandBasicManifold"
		sleep 100
		"gblS_Top_Text" value  = "Manifold is set to Sanitize using the Back Manifold and the Big Mac. The Fermentor Fill Valve is an Isolation Valve and will operate automaticly Click White Pump to start Sanition."
		wait "sw_Running_Prime_Basic" state == false
		"gblS_swAllSwitch_Label_Text" value = "White Pump?"
		goto "SectionBrew458"
	endif
"gblV_Brew_Status" value = 456
[SectionBrew457]
[SectionBrew458]
"gblV_Brew_Status" value = 458
wait "gblV_Brew_Status" value == 458
//...............................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...............................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
//...............................
//...............................
	if "gblV_Water_Switch_Status_Water" value == 5001
		"MB_32_do_WhitePump_B1" state = true
		sleep 500
		"VGC_5_do_FermentFill_On_B1" state = true	
		sleep 2000	
		"gblS_Brewery_Bottom_3" value = "Boiling.  Waiting to just under 30 Minutes remaining. Sanitizing from the Big Mac. Mointor Brew Kettle Flame.  Insure the White Pump is on and there is flow!"		
		goto "SectionBrew460"
	endif
	if "gblV_Water_Switch_Status_Water" value == 5002
		"MB_34_do_GreenPump_B1" state = true
		sleep 500
		"VGC_5_do_FermentFill_On_B1" state = true
		sleep 2000	
		"gblS_Brewery_Bottom_3" value = "Boiling.  Waiting to just under 30 Minutes remaining. Sanitizing from the Radiator. Mointor Brew Kettle Flame.  Insure the Green Pump is on and there is flow!"	
		goto "SectionBrew460"		
	endif
[SectionBrew459]
[SectionBrew460]
"gblV_Brew_Status" value = 460
wait "gblV_Brew_Status" value == 460
"gblS_Brewery_Bottom_3" visibility = visible
sleep 10000
[End_scr400_2]
if vB_Testing == true
"gblS_Script_Ended" value = "Ended: scrBrew400_2_Boiling_Sanitize"
sleep 4001
endif
clear
start "scrBrew400_3_Boiling_to_End"
"sw_Running_Script_B" state = false
stop "scrBrew400_2_Boiling_Sanitize"
```

## 35. scrBrew400_3_Boiling_to_End

Starts by itself: No · User can start or stop it: Yes · 440 lines

```text
//scrBrew400_3_Boiling_to_End
//08/03/2023 10:03
// Seperated from scrBrew400 04/08/26 16:01
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// all of alm_Hidden_Beer_Music_1 used in this script
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: scrBrew400_3_Boiling_to_End" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
"gblV_Group_1_Conflict" value = 9
"gblV_Group_2_Conflict" value = 4
start "inscpt_scrAlarm"
new time vT_Drop
new time VT_Ten 
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vSMsg4
new string vSMsg5
new string vS_Msg_Calc
new string vS_Msg_Calc_1
new string vS_TTL_Time
new value vVBrewStatus
new value xP
new value vVCalc1
new value vVCalc2
new value vVFill_Volume
new value vVDesired_BigMac_Volume 
new value vV_Start_BigMac_Volume
new value vVFill_Volume_Min
new value vVCurrent_BigMac_Volume
new value vV_Vessel_Start
new value vV_Vessel_End
new value vV_Vessel_Delta
new value vV_Gal_to_Fill
new time  vT_Total_Time
new value vVRate_Orginal
new value vVRate_Calc
new value vVRate_Delta
new value vV_Elasped
new time vT_Timer
new time vT_Timer_Check 
//....................................................
vVDesired_BigMac_Volume = "gblV_Refill_Big_Mac_Mash" value
vVFill_Volume = vVDesired_BigMac_Volume - vV_Start_BigMac_Volume
if vVDesired_BigMac_Volume < 37
vVFill_Volume_Min = vVDesired_BigMac_Volume	
else
vVFill_Volume_Min = vVDesired_BigMac_Volume - 5
endif
//...................................................
//Where to Start
"gblV_Brew_Status" value =  472
print 53
goto "SectionBrew472"
//..................................................
[SectionBrew471]
[SectionBrew472]
wait "gblV_Brew_Status" value == 472
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait"
sleep 100
if vB_Testing == true
"gblT_SetTimer" value = 00:30:05
vT_Timer = "tmTopRight_B1" value
 vT_Timer_Check = vT_Timer - 00:00:05
wait "tmTopRight_B1" value <  vT_Timer_Check
"gblT_SetTimer" value = 00:30:05
stop "tm_Hidden_1"
reset "tm_Hidden_1"
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"sw_Advance_Timer" state = true
endif
"tmTopRight_B1" visibility = visible
wait "tmTopRight_B1" value < 00:30:00
"gblS_Brewery_Bottom_3" value = "Boiling.   Monitor the Temperatures. Less than 30 Minutes remaining. The Boil will end when the Boil Timer reaches 00:00:00"
"gblT_SetTimer" value = 00:28:05
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
if vB_Testing == true
vT_Timer = "tmTopRight_B1" value
 vT_Timer_Check = vT_Timer - 00:00:05
wait "tmTopRight_B1" value <  vT_Timer_Check
"gblT_SetTimer" value = 00:28:05
stop "tm_Hidden_1"
reset "tm_Hidden_1"
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"sw_Advance_Timer" state = true
endif
wait "tmTopRight_B1" value <= 00:29:00
"gblS_Brewery_Top_2" value = "29 Minutes Remaining for the Boil"
"gblS_Brewery_Bottom_3" value = "Boil.   Monitor the Temperatures.  The Boil will end when the Boil Timer reaches 00:00:00"
"gblS_swAllSwitch_Label_Text" value = "29 Minutes Remaining"
"tmBottomRight_B1" displayname = "Boil Timer"
//BackGrounds
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" value = "tmTopRight_B1" value
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
//
"alm_Hidden_Beer_Music_1" fileindex = 2
wait "tmTopRight_B1" value <= 00:28:45
"gblS_swAllSwitch_Label_Text" value = "Boiling"
"tmTopRight_B1" visibility = visible
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
start "inscpt_scrAlarm"
sleep 4001
"alm_Hidden_Beer_Music_1" active = true
"gblT_SetTimer" value = 00:25:35
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblS_swAllSwitch_Label_Text" background = 3
if vB_Testing == true
vT_Timer = "tmTopRight_B1" value
 vT_Timer_Check = vT_Timer - 00:00:15
wait "tmTopRight_B1" value <  vT_Timer_Check
"gblT_SetTimer" value = 00:25:35
stop "tm_Hidden_1"
reset "tm_Hidden_1"
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"sw_Advance_Timer" state = true
endif
wait "tmTopRight_B1" value <= 00:25:30
"alm_Hidden_Beer_Music_1" active = false
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_Brewery_Bottom_3" value = "Boiling.  Waiting to 17 Minutes remaining. Sanitizing. Get Yeast Nutrient and Whirlfloc ready.  Mointor Brew Kettle Flame."
"gblT_SetTimer" value = 00:17:20
if vB_Testing == true
vT_Timer = "tmTopRight_B1" value
 vT_Timer_Check = vT_Timer - 00:00:05
wait "tmTopRight_B1" value <  vT_Timer_Check
"gblT_SetTimer" value = 00:17:20
stop "tm_Hidden_1"
reset "tm_Hidden_1"
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"sw_Advance_Timer" state = true
endif
"gblV_Brew_Status" value = 474
[SectionBrew473]
[SectionBrew474]
wait "gblV_Brew_Status" value == 474
"gblS_Brewery_Top_2" value = "Record the PreBoil Gravity from the sample taken earlier."  
"gblS_Brewery_Top_2" background = 1 
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" value = "PreBoil Gravity"
"gblS_swAllSwitch_Label_Text" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblSReportLabel_B1" value = "Record"
"gblVReport_B1" precision = 3
"gblVReport_B1" value = 0
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
wait  "gblVReport_B1" value > 0
"RP_v_PreBoil_SG" value = "gblVReport_B1" value
"gblS_Brewery_Top_2" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" value = 0
"gblV_Brew_Status" value = 476
[SectionBrew475]
[SectionBrew476]
wait "gblV_Brew_Status" value == 476
wait "tmTopRight_B1" value < 00:17:15
"gblS_swAllSwitch_Label_Text" background = 3
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblS_Brewery_Bottom_3" value = "Boiling.  Less than 00:17:15 Minutes remaining. Sanitizing. Get Yeast Nutrient and Whirlfloc ready.  Mointor Brew Kettle Flame."
start "inscpt_scrAlarm"
sleep 4001
"alm_Hidden_Irish_Moss_Warning_ALARM" fileindex = 1
"alm_Hidden_Irish_Moss_Warning_ALARM" active = true
"gblT_SetTimer" value = 00:15:10
if vB_Testing == true
vT_Timer = "tmTopRight_B1" value
 vT_Timer_Check = vT_Timer - 00:00:05
wait "tmTopRight_B1" value <  vT_Timer_Check
"gblT_SetTimer" value = 00:15:10
stop "tm_Hidden_1"
reset "tm_Hidden_1"
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"sw_Advance_Timer" state = true
endif
wait "tmTopRight_B1" value < 00:15:02
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"gblS_Brewery_Bottom_3" value = "Boiling.   Sanitizing.  Yeast Nutrient and Whirlfloc should be dropped.  Mointor Brew Kettle Flame."
"gblV_Brew_Status" value =  480
[SectionBrew477]
[SectionBrew478]
[SectionBrew479]
[SectionBrew480]
wait "gblV_Brew_Status" value == 480
"gblS_Brewery_Bottom_3" value = "Boiling.  Wait.    Mointor Brew Kettle Flame.  "
"gblS_swAllSwitch_Label_Text" value = "Wait?"
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Bottom_3" visibility = visible
"alm_Hop_Delay_1" active = false
"gblS_HopMessage_15_ALARM"   visibility = hidden
show workspace "B1 Brewery"
//BackGrounds
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
"tmTopRight_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"gblT_SetTimer" value = 00:01:05
if vB_Testing == true
vT_Timer = "tmTopRight_B1" value
 vT_Timer_Check = vT_Timer - 00:00:05
wait "tmTopRight_B1" value <  vT_Timer_Check
"gblT_SetTimer" value = 00:01:05
stop "tm_Hidden_1"
reset "tm_Hidden_1"
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"sw_Advance_Timer" state = true
endif
"gblV_Brew_Status" value = 484
[SectionBrew481]
[SectionBrew482]
[SectionBrew483]
[SectionBrew484]
wait "gblV_Brew_Status" value == 484
wait "tmTopRight_B1" value <= 00:01:00
"gblS_Brewery_Bottom_3" value = "Boiling.  One Minute Remaining.  Mointor Brew Kettle Flame.  "
 "gblS_Brewery_Bottom_1" value = "Boiling.  One Minute Remaining.  Mointor Brew Kettle Flame.  "
"gblS_swAllSwitch_Label_Text" value = "Wait?"

"alm_Hidden1_ALARM"  fileindex = 3
"alm_Hidden1_ALARM" loop = false
start "inscpt_scrAlarm"
sleep 4001
"alm_Hidden1_ALARM"  active = true
"gblS_Brewery_Bottom_1" background = 1
"gblS_Brewery_Bottom_1" visibility = visible
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:05
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"alm_Hidden1_ALARM"  active = false

//BackGrounds
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
"tmTopRight_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"tm_Hidden_1" value = 00:00:05
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"gblV_Brew_Status" value =  488
[SectionBrew485]
[SectionBrew486]
[SectionBrew487]
[SectionBrew488]
wait "gblV_Brew_Status" value == 488
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value 
"gblS_Brewery_Bottom_3" value = "End of Boil in less than 50 seconds"
"gblS_Brewery_Bottom_1"  value =  "Less than ONE Minute Remaining"
"gblS_swAllSwitch_Label_Text" value = " > 50 Seconds"
//BackGrounds
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = Visible
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
//BackGrounds
"gblS_Brewery_Top_2" background = 3
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_1" background = 1
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
"tmTopRight_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = visible
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"gblT_SetTimer" value = 00:00:13
if vB_Testing == true
vT_Timer = "tmTopRight_B1" value
 vT_Timer_Check = vT_Timer - 00:00:05
wait "tmTopRight_B1" value <  vT_Timer_Check
"gblT_SetTimer" value = 00:00:13
stop "tm_Hidden_1"
reset "tm_Hidden_1"
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"sw_Advance_Timer" state = true
endif
wait "tmTopRight_B1" value <= 00:00:11
"gblS_Brewery_Bottom_3" visibility = hidden
[Loop10SecCountdown]
if "tmTopRight_B1" value <= 00:00:00
stop "tmTopRight_B1"
"tmTopRight_B1" visibility = hidden  
goto "endofBoil" 
endif
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "tmTopRight_B1" value
goto "Loop10SecCountdown"
[endofBoil]
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Boil is Done!"
"tmTopRight_B1" visibility = hidden
"sw_Control_Burner_BK" state = false
"gblV_Brew_Status" value =  489
sleep 200
[SectionBrew489]
wait "gblV_Brew_Status" value == 489
show workspace  "Alarms"
"gblS_HopMessage_ALARM"  value =  "Boil is Over, Remove the Hops!"
"gblS_HopMessage_ALARM" displayname =  "End of Boil"
"gblS_HopMessage_ALARM" background = 1
"alm_Hops_3_ALARM" displayname = "End of Boil"
"alm_Hops_3_ALARM" background = 1
"alm_Hops_3_ALARM" fileindex = 3
"alm_Hops_3_ALARM" visibility = visible
"alm_Hops_3_ALARM" active = true
"gblS_HopMessage_ALARM"  visibility = visible
wait   "alm_Hops_3_ALARM"  active ==  false
start "inscpt_scrAlarm"
"gblV_Brew_Status" value = 500
[SectionBrew490]
[SectionBrew491]
[SectionBrew492]
[SectionBrew493]
[SectionBrew494]
[SectionBrew495]
[SectionBrew496]
[SectionBrew497]
[SectionBrew498]
[SectionBrew499]
[SectionBrew500]
wait "gblV_Brew_Status" value == 500
[End_scrBrew400_3]
"gblS_Script_Ended" value = "Ended: scrBrew400_3_Boiling_to_End"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew500_1_Whrilpooling"
stop "scrBrew400_3_Boiling_to_End"
```

## 36. scrBrew500_1_Whrilpooling

Starts by itself: No · User can start or stop it: Yes · 883 lines

```text
//scrBrew500_1_Whrillpooling Modified260910 15_41
//08/03/2023 10:03
// Seperated from scrBrew500 on 03/25/2026 8:49
//Modified 03/25/2026 08:59
// MIT License Granted
//Copyright © OakBarn Brewery 2026
stop "sub_2_scrPrimeandBasicManifold"
// alm_Hidden_Beer_Music_2 file 2 used
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
print vB_Testing
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
start "inscpt_scr_Inner_Blue"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: scrBrew500_1_Whrillpooling" 
//................................
//.........................
	if vB_Testing == true
		"gblS_Script_Started" visibility = hidden
		"gblS_Script_Ended" visibility = hidden
		"gblS_Inter_Script" visibility = hidden
		start "step_scrTest_Time _Reset"
		start "looper_scrBoilTimer_Reset"
sleep 100
		"gblT_SetTimer" visibility = hidden
		"sw_Advance_Timer" visibility = hidden
		"sw_Reset_Timer_Zero" visibility = visible

		"gblV_Brew_Status" visibility = visible
		"gblV_Sub3_Status" visibility = hidden
		"gblV_Sub4_Status" visibility = hidden
		"gblTValveDelay" value = 00:00:01
		sleep 99
	else
		"gblS_Script_Started" visibility = hidden
		"gblS_Script_Ended" visibility = hidden
		"gblS_Inter_Script" visibility = hidden
		stop "step_scrTest_Time _Reset"
		stop "looper_scrBoilTimer_Reset"
		"gblT_SetTimer" visibility = hidden
		"sw_Advance_Timer" visibility = hidden
		"sw_Reset_Timer_Zero" visibility = hidden
		"gblV_Brew_Status" visibility = hidden
		"gblV_Sub3_Status" visibility = hidden
		"gblV_Sub4_Status" visibility = hidden
		"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
"gblV_Group_1_Conflict" value = 9
"gblV_Group_2_Conflict" value = 4
"RP_v_CoolingSource" value = 2
start "inscpt_scrBasicStart"
start "inscpt_scrAlarm"
sleep 100
new value vVBrewStatus
new string vSMsg_Start
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg_Wait_154
new string vS_500_Label_Wait_154
new string vS_500_Label_Wait_170
new string vSMsg_EOB 
new string vSMsg_CS
new string vSMsg_FW
new value vV_DoorHopStatus
new value vVCooling
new value vVScriptFlow
new time vT_WP
new string vS_Test
new value vVHopDropType
new value vV_Start_Volume
new value vV_End_Volume
new value vV_Calc_Volume
new value vV_BoilRate
new value vV_Calc_Rate
new value vV_Boil_Minute
new value vV_Calc_Rate_Delta
new time vT_Timer
new time vT_Timer_Check
new value vV_PreBoil_Volume
new value vV_Boil_Off_Calculated_Volume
new value vV_PostBoil_Measured_Volume
new value vV_PostBoil_Calculated_Volume
new value vV_Boil_Off_Volume
new value vV_Calc_Boil_Off_Rate
new bool vB_Hop_Rocket
new bool vB_Hop_EOB
new bool vB_Hop_Late_Both
new bool vB_Hop_Late_None
new bool vB_Hop_Sock
//...................................................
//...........................................
//Boil Off
vV_Boil_Minute = "gblVBoilTime_Minutes" value
vV_BoilRate = "gblVBoilOffperMin" value 
vV_PreBoil_Volume = "RP_v_PreBoil_Volume" value
vV_Boil_Off_Calculated_Volume = vV_Boil_Minute * vV_BoilRate
vV_PostBoil_Calculated_Volume = vV_PreBoil_Volume - vV_Boil_Off_Calculated_Volume
"gblVPrecision1" value = vV_PostBoil_Calculated_Volume
vV_PostBoil_Calculated_Volume = "gblVPrecision1" value 
//......................................................................................
"sw_Flow_EOB_Hop_Sock" state = false
vVHopDropType = 0
vVCooling = "RP_v_CoolingSource" value
print 114
print  vVCooling 
if vVCooling == 1 
print 117
print "1:Only Tap"
endif
if vVCooling == 2 
print 121
print "2:Tap Chilled by Ice Bath"
endif
if vVCooling == 3 
print "3:Only Ice Chilled Bath"
endif
if vVCooling == 4 
print "4:Tap Chilled by Glycol"
endif
if vVCooling == 5 
print "5: Ice Chilled Bath chilled by Glycol"
endif
"gblV_Brew_Status" value = 501
[SectionBrew501]
wait "gblV_Brew_Status" value == 501
[StartHere]
"gblS_Brewery_Bottom_3" value = wait
vS_500_Label_Wait_154 = "Wait WORT °F = 154 °F" 
vS_500_Label_Wait_170 = "Wait WORT °F = 170 °F"
"gblV_PitchSetpoint_B1" visibility = hidden
"gblVStartBrew" value = 1
	if "gblV_Group_EoB_Hops" value  > 0
		vB_Hop_EOB = true
	endif
	if "gblV_Group_Hop Rocket" value > 0
		vB_Hop_Rocket = true
endif
if vB_Hop_EOB == true
if vB_Hop_Rocket == true
vB_Hop_Late_Both = true
else 
vB_Hop_Late_None = true
endif
endif
if vB_Hop_Late_None == true
			goto "SectionBrew500"			
	endif
	if vB_Hop_Late_Both == true
	vVHopDropType = 3
		goto "SectionBrew500"			
	endif
	if vB_Hop_Rocket == true
		vVHopDropType = 2
		goto "SectionBrew500"
	endif
	if vB_Hop_EOB == true
		vVHopDropType = 1
goto "Set_Hop_Sock"
else
goto "SectionBrew500"
	endif
[Set_Hop_Sock]
		"gblSReportLabel_B1" value = "Are you using Hops Bags Socks the Aroma Hops or dropping them into the Hop Spider?\n\n1: Hop Socks\n2: Hop Spider"
		"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
		"gblVReport_B1" value = 0
		//........................................
//Inspector_Red
		"gblV_Set_BackGround_Middle_Time" value = 4
		start "inscpt_scrSet_Middle_Backgrounds"
		//.........................................
		//Background
"gblS_Brewery_Top_1" background = 2
		"gblVReport_B1" background = 1 
		"gblSReportLabel_B1" background = 1 
		"gblS_swAllSwitch_Label_Text" background = 2 
		//Visibility
		"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_1" visibility = Visible 
		"gblS_swAllSwitch_Label_Text" visibility = visible
		"sw_Advance_ BrewStatus" visibility = hidden 
wait "gblVReport_B1" value > 0
		[Loop_Aroma_EOB]
		sleep 100
			if "gblVReport_B1" value == 1
			vB_Hop_Sock = true
			"sw_Flow_EOB_Hop_Sock" state = true
				goto "SectionBrew500"
			endif
			if "gblVReport_B1" value == 2
				"gblV_Brew_Status" value =  504
				goto "SectionBrew504"
			endif
			if "gblVReport_B1" value > 2
			"gblVReport_B1" value = 0
			endif
	goto "Loop_Aroma_EOB"
//........................................
[SectionBrew500]
"gblV_Brew_Status" value =  500
wait "gblV_Brew_Status" value == 500
"gblS_Brewery_Top_3" value = "You need to remove the Boil Hops.  Click Boil Hops Removed? when done."
"gblS_swAllSwitch_Label_Text" value = "Boil Hops Removed?"
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
sleep 500
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
"MB_28_do_ManualAlarm_B1" state = true
"sw_Advance_ BrewStatus" visibility = visible 
"gblV_Brew_Status" value =  501
[SectionBrew501]
[SectionBrew502]
print "@250 SectionBrew502"
wait "gblV_Brew_Status" value == 502
"alm_Manual_Warning" active = false
"MB_28_do_ManualAlarm_B1" state = false
"MB_61_10kWortOut_B1" visibility = visible
	if vB_Hop_EOB == true
		goto "EndofBoil_Hops_True"
	endif
[No_EndofBoil_Hops]
	if  vVCooling == 1
print "@ 257 vVCooling == 1"
		"gblS_Top_Text" value = "The Temperature Probe above the MLT now reports the WORT OUT Of the Plate Chiller.  Note the change and watch this when the the Pitch Temperature is obtained. "
"gblS_Bottom_Text" value = "The Whirllpool will continue."
"gblS_swAllSwitch_Label_Text" value = "	Message Read?"
		goto "Start_Choice_Manifold"
	endif
//..............................
	if  vVCooling == 2
print "@ 270 vVCooling == 2"
		"gblS_Top_Text" value = "The Temperature Probe above the MLT now reports the WORT OUT Of the Plate Chiller.  Note the change and when Temperature reaches 170 °F, you can start the ICE Bath Pump. Make sure you have the ICE Bath Set Up"
		"gblS_Bottom_Text" value  = "ICE Bath Set Up:\n1. ICE Bath\n2 ICE Bath Pump\n3 Hose to Water IN Prechiller Plate Chiller.\n4 Return Back to ICE Bath.\nThe Whirllpool will continue."
"gblS_swAllSwitch_Label_Text" value = "ICE Bath Set Up?"
		goto "Start_Choice_Manifold"
	endif
//..............................
	if  vVCooling == 3
	print "@ 282 vVCooling == 3"
		"gblS_Top_Text" value = "The Temperature Probe above the MLT now reports the WORT OUT Of the Plate Chiller.  Note the change and when Temperature reaches 170 °F, you can start the ICE Bath Pump.Make sure you have the ICE Bath Set Up"
		"gblS_Bottom_Text" value  = "ICE Bath Set Up:\n11. ICE Bath\n2 ICE Bath Pump (Leave out of Bath)\n3 Hose to WORT Plate Chiller ready.\n3 Return Hose from WORT Plate Chiller ready.\nThe Whirllpool will continue."
"gblS_swAllSwitch_Label_Text" value = "CE Bath Set Up?"
		goto "Start_Choice_Manifold"
	endif
	if  vVCooling == 4
print "@ 287 vVCooling == 4"
		"gblS_Top_Text" value = "The Temperature Probe above the MLT now reports the WORT OUT Of the Plate Chiller.  Note the change and when Temperature reaches 170 °F, you can start the GlyCol Pump. Make sure you have the Glycol Set Up"
		"gblS_Bottom_Text" value  = "Glycol Set Up:\n11. Glycol\n2 Glycol Pump\n3 Glycol Hose to Water IN Prechiller Plate Chiller.\n4 Return Back to Glycol.\nThe Whirllpool will continue."
	"gblS_swAllSwitch_Label_Text" value = "Glycol Set Up?"
		goto "Start_Choice_Manifold"
	endif
print 301
	if  vVCooling == 5
	print "@ 303 vVCooling == 5"
		"gblS_Top_Text" value = "Fix Late The Temperature Probe above the MLT now reports the WORT OUT Of the Plate Chiller.  Note the change and when Temperature reaches 170 °F, you can start the GlyCol Pump. Make sure you have the Glycol Set Up"
		"gblS_Bottom_Text" value  = "Glycol Set Up:\n1. Glycol\n2 Glycol Pump\n3 Glycol Hose to Water IN Prechiller Plate Chiller.\n4 Return Back to Glycol.\nThe Whirllpool will continue."
"gblS_swAllSwitch_Label_Text" value = "Glycol Set Up?"
		goto "Start_Choice_Manifold"
	endif
[EndofBoil_Hops_True]
		if  vVCooling == 1
		print "@ 315 vVCooling == 1"
			"gblS_Top_Text" value = "The Temperature Probe above the MLT now reports the WORT OUT Of the Plate Chiller. Note the change and when Temperature reaches 170 °F, the End of Boil Aroma Hops will be dropped. "
			"gblS_Bottom_Text" value  = "An Alarm will sound when it is time to drop the End of Boil Aroma Hops"
"gblS_swAllSwitch_Label_Text" value = "Message Red?"
			goto "Start_Choice_Manifold"
		endif

		if  vVCooling == 2
		print "@ 326 vVCooling == 2"
			"gblS_Top_Text" value =  "The Temperature Probe above the MLT now reports the WORT OUT Of the Plate Chiller.  Note the change and when Temperature reaches 170 °F, the End of Boil Aroma Hops will be dropped. Make sure you have the ICE Bath Set Up."
			"gblS_Bottom_Text" value  = "1. ICE Bath\n2 ICE Bath Pump\n3 Hose to Water IN Prechiller Plate Chiller.\n4 Return Hose Back to ICE Bath.\nAn Alarm will sound when it is time to drop the End of Boil Aroma Hops"
"gblS_swAllSwitch_Label_Text" value = "ICE Bath Set Up?"
			goto "Start_Choice_Manifold"
		endif
		if  vVCooling == 3
		print "@ 337 vVCooling == 3"
			"gblS_Top_Text" value = "The Temperature Probe above the MLT now reports the WORT OUT Of the Plate Chiller.  Note the change and when Temperature reaches 170 °F, the End of Boil Aroma Hops will be dropped. Make sure you have the ICE Bath Set Up"
			"gblS_Bottom_Text" value  = "ICE Bath\n2 ICE Bath Pump (Leave out of Bath)\n3 Hose to WORT Plate Chiller ready.\n3 Return Hose from WORT Plate Chiller ready.\nAn Alarm will sound when it is time to drop the End of Boil Aroma Hops"
"gblS_swAllSwitch_Label_Text" value = "ICE Bath Set Up?"
			goto "Start_Choice_Manifold"
		endif
		if  vVCooling == 4
		print "@ 348 vVCooling == 4"
			"gblS_Top_Text" value = "The Temperature Probe above the MLT now reports the WORT OUT Of the Plate Chiller.  Note the change and when Temperature reaches 170 °F, you can start the GlyCol Pump. Make sure you have the Glycol Set Up"
"gblS_Bottom_Text" value  = "1. Glycol\n2 Glycol Pump\n3 Glycol Hose to Water IN Prechiller Plate Chiller.\n4 Return Back to Glycol.\nAn Alarm will sound when it is time to drop the End of Boil Aroma Hops"
"gblS_swAllSwitch_Label_Text" value = "Glycol Set Up?"
			goto "Start_Choice_Manifold"

		endif
		if  vVCooling == 5
		print "@ 360 vVCooling == 5"
			"gblS_Top_Text" value = "The Temperature Probe above the MLT now reports the WORT OUT Of the Plate Chiller.  Note the change and when Temperature reaches 170 °F, the End of Boil Aroma Hops will be dropped. Make sure you have the Glycol Set Up"
"gblS_Bottom_Text" value  = "1. Glycol\n2 Glycol Pump\n3 Glycol Hose to Water IN Prechiller Plate Chiller.\n4 Return Back to Glycol.\nAn Alarm will sound when it is time to drop the End of Boil Aroma Hops"
"gblS_swAllSwitch_Label_Text" value = "Glycol Set Up?"
			goto "Start_Choice_Manifold"
		endif
[Start_Choice_Manifold]
print "@ 371 Start_Choice_Manifold"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrAdvancewithSwitch"
sleep 2000
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" loop = true
"alm_Manual_Warning" active = true
sleep 100
"sw_Running_Advance_with_Switch" state = true
wait "sw_Running_Advance_with_Switch" state == false
"MB_28_do_ManualAlarm_B1" state = false
//...............................
"gblV_Brew_Status" value =  504
[SectionBrew504]
wait "gblV_Brew_Status" value == 504
	if vB_Hop_Rocket == true
		start "inscpt_scrClearB1_Brewery"
		sleep 100
wait "sw_Running_Clear_B1" state == false
		//...............................
		"gblS_Top_Text" value =  "Set Up The Hop Rocket.  Click Hop Rocket Online? when ready"
		"gblS_Bottom_Text" value = "The Hop Rocket should be loaded with the Leaf Hops and Hoses set."
		"gblS_swAllSwitch_Label_Text" value = "Hop Rocket Online?"
//........................
		start "inscpt_scrAdvancewithSwitch"
		"MB_28_do_ManualAlarm_B1" state = true
		"alm_Manual_Warning" fileindex = 3
		"alm_Manual_Warning" loop = true
"alm_Manual_Warning" active = true
//........................
		sleep 100
		wait "sw_Running_Advance_with_Switch" state == false
		"MB_28_do_ManualAlarm_B1" state = false
	endif
//...............................
//...............................
"sw_Advance_ BrewStatus" visibility = hidden 
"alm_Hidden_Irish_Moss_Warning_ALARM" fileindex = 2
"gblS_Brewery_Top_3" value = "  There will be a short delay of 1:15. This allows some WORT settling. "
"gblS_Brewery_Bottom_4" value = "   Wait! Will Auto Advance after a while!"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblS_Brewery_Bottom_4" visibility = visible
stop "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" type = countdown
"tm_Action_BottomRight_B1"  value = 00:01:15
"tm_Action_BottomRight_B1" displayname = "Short Delay"
start "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" visibility = visible
start "inscpt_scrAlarm"
sleep 100
"alm_Hidden_Irish_Moss_Warning_ALARM" active = true
wait "tm_Action_BottomRight_B1"  value <= 00:01:00
"gblS_Brewery_Top_3" value = "  Wait during  a short delay! Wort settling. "
"gblS_Brewery_Top_3" background = 3
"gblVStartBrew" value = 2
"tm_Action_BottomRight_B1" visibility = visible
	if vB_Testing == true
	"tm_Action_BottomRight_B1"  value = 00:00:03
	endif
wait "tm_Action_BottomRight_B1"  value <= 00:00:45
"gblVStartBrew" value = 3
"gblS_Brewery_Bottom_4" visibility = visible
wait "tm_Action_BottomRight_B1"  value <= 00:00:30
"gblVStartBrew" value = 4
"gblS_Brewery_Bottom_4" visibility = hidden
wait "tm_Action_BottomRight_B1"  value <= 00:00:15
"gblVStartBrew" value = 5
"gblS_Brewery_Bottom_4" visibility = visible
wait "tm_Action_BottomRight_B1"  value <= 00:00:00
stop "tm_Action_BottomRight_B1"
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"gblVStartBrew" value = 1
"tm_Action_BottomRight_B1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblV_Brew_Status" value =  506
[SectionBrew505]
[SectionBrew506]
wait "gblV_Brew_Status" value == 506
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Top_1" visibility = hidden
"gblVReport_B1" background = 1
vSMsg = "Calculated Post Boil Volume is "
vSMsg1 = vV_PostBoil_Calculated_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons."
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1" value = vSMsg
"gblS_Brewery_Top_2" value = "Measure the Post Boil Volume in the Brew Kettle.  Will Auto Advance on you enter the volume."
"gblS_swAllSwitch_Label_Text" value = "Record Brew Kettle Volume"
"gblSReportLabel_B1" value = "Record Post Boil Volume"
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//Backgroung
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 2
//Visibity
"gblS_Brewery_Bottom_1" visibility = hidden
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
 "tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"alm_Hop_Delay_1" fileindex = 2 
"alm_Hop_Delay_1" loop = true
"alm_Hop_Delay_1" active = true
"MB_28_do_ManualAlarm_B1" state = true
wait  "gblVReport_B1" value > 0
"MB_28_do_ManualAlarm_B1" state = false
"alm_Hop_Delay_1" active = false
"alm_Hop_Delay_1" fileindex = 1 
"alm_Hop_Delay_1" loop = false
"RP_v_PostBoil_Volume" value = "gblVReport_B1" value
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 0
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblV_Brew_Status" value =  508
[SectionBrew507]
[SectionBrew508]
wait "gblV_Brew_Status" value == 508
vV_PostBoil_Measured_Volume = "RP_v_PostBoil_Volume" value
"gblVCurrentBrewKettle_Volume" value = vV_PostBoil_Measured_Volume
vV_Boil_Off_Volume = vV_PreBoil_Volume - vV_PostBoil_Measured_Volume
print "@ 521 Boil Minutes = "
print vV_Boil_Minute
print "@ 523 Measured Post Boil Volume = "
print vV_PostBoil_Measured_Volume
vV_Calc_Boil_Off_Rate = vV_Boil_Off_Volume / vV_Boil_Minute
"gblVPrecision4" value = vV_Calc_Boil_Off_Rate
vV_Calc_Boil_Off_Rate = "gblVPrecision4" value 
print "@ 528 vvV_Calc_Boil_Off_Rate = "
print vV_Calc_Boil_Off_Rate
vV_Calc_Rate_Delta = vV_BoilRate - vV_Calc_Boil_Off_Rate
if vV_Calc_Rate_Delta < 0
vV_Calc_Rate_Delta = vV_Calc_Rate_Delta * -1
print "@ 534 vV_Calc_Rate_Delta = "
print vV_Calc_Rate_Delta
endif
print "@ 537 Calc Delta = "
print vV_Calc_Rate_Delta
"RP_v_BoilOff_Volume" value = vV_Boil_Off_Volume
vSMsg = "The measured Boil Off Volume was  "
vSMsg1 = vV_Boil_Off_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons  The Orginal Rate used to calculate the PreBoil Volume was "  
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_BoilRate
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons per Minute.  The Measured Rate is "  
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Calc_Boil_Off_Rate
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons per Minute. "  
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Boil_Off_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons were Boiled Off. "  
vSMsg = vSMsg + vSMsg1
if vV_Calc_Rate_Delta > .004
		goto "Update_Rate_Choice"
	endif
goto Rate_Msg
[Update_Rate_Choice]
vSMsg1 = "Do you want to Update the Boil Off Rate?"
vSMsg = vSMsg + vSMsg1
vSMsg1 =  "\n1 = Yes 2 = No"
vSMsg = vSMsg + vSMsg1
//........................................
"gblS_swAllSwitch_Label_Text" value =  "1 or 2"
"gblS_Brewery_Top_1" value = vSMsg
"gblSReportLabel_B1" value = "1: Update\n2: No Update"
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//........................................
//Inspector_Green
"gblV_Set_BackGround_Middle_Time" value = 2
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_1" background = 2
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 2 
//Visibility
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_1" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
wait "gblVReport_B1" value > 0
[LoopChoiceRate]
if "gblVReport_B1" value == 1
 "gblVBoilOffperMin" value  = vV_Calc_Boil_Off_Rate
vSMsg = "Boil Off Rate updated to "  
vSMsg1 = vV_Calc_Boil_Off_Rate
vSMsg = vSMsg + vSMsg1
vSMsg1 = " GPM.  The Rate can vary depending on how vigirous the boil.  This  rate will be used to calculate the estimated  Pre Boil Volume of the next Brew."  
vSMsg = vSMsg + vSMsg1
goto "Rate_Msg"
endif
if "gblVReport_B1" value == 2
 		vSMsg = "Boil Off Rate remains at  "  
vSMsg1 = vV_BoilRate
vSMsg = vSMsg + vSMsg1
vSMsg1 = " GPM.  The Rate can vary depending on how vigirous the boil.  This rate will be used to calculate the estimated  Pre Boil Volume of the next Brew."  
vSMsg = vSMsg + vSMsg1
goto "Rate_Msg"
endif
if "gblVReport_B1" value > 2
"gblVReport_B1" value = 0
endif
goto "LoopChoiceRate"
[Rate_Msg]
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = vSMsg
"gblV_Delay_Seconds" value = 7
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = true
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
"gblS_Brewery_Top_1" value = "Wait!  Will Auto Advance"
//.............................................................................
"gblV_Brew_Status" value =  510
[SectionBrew509]
[SectionBrew510]
wait "gblV_Brew_Status" value == 510
vSMsg = "That is a Delta of  "  
vSMsg1 = vV_Calc_Rate_Delta
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons per Minute.  For Planning, the Post Boil Volume was caculated to be ."  
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Boil_Off_Calculated_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons."  
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Bottom_3" value = vSMsg
vSMsg = "Measured Post Boil Volume is "
vSMsg1 = vV_PostBoil_Measured_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons."
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = vSMsg
"gblV_Delay_Seconds" value = 4
//only 1 true
"sw_Use_Top_1" state = true
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
"gblS_Brewery_Top_1" value = "Wait!  Will Auto Advance"
//............................................................
"gblV_Brew_Status" value =  512
[SectionBrew511]
[SectionBrew512]
print 662
wait "gblV_Brew_Status" value == 512
vSMsg = "Set Manifold to Whirllpool the Brew Kettle though the Plate Chiller and Fermentor hose.  You need to set the Fermenter Return hose to Whirlpool the WORT back to the Brew Kettle.  Click Set Manifold when ready."
"gblS_Bottom_Text" value = "Insure the Fermentor Room hose is looped back! Cooling Water setup should be checked. This will also set the Manifold to Whirlpool."
if vVCooling == 1
vSMsg = "Set Manifold to Whirllpool the Brew Kettle though the Plate Chiller and Fermentor hose.  You need to set the Fermenter Return hose to Whirlpool the WORT back to the Brew Kettle.  Only Cooling Tap Water will be used to Cool the WORT.  Click Hoses Set? when ready."
endif
if vVCooling == 2
vSMsg = "Set Manifold to Whirllpool the Brew Kettle though the Plate Chiller and Fermentor hose.  You need to set the Fermenter Return hose to Whirlpool the WORT back to the Brew Kettle.  First, Cooling Tap Water will be used to Cool the WORT, then an ICE Bath to chill Tap Water as the cooling source. Click Hoses Set? when ready."
"gblS_Bottom_Text" value = "Insure the Fermentor Room hose is looped back! Cooling Water setup should be checked. Have the ICE Bath Ready.  This will also set the Manifold to Whirlpool the Brew Kettle."
endif
if vVCooling == 3
vSMsg = "Set Manifold to Whirllpool the Brew Kettle though the Plate Chiller and Fermentor hose.  You need to set the Fermenter Return hose to Whirlpool the WORT back to the Brew Kettle. First, Cooling Tap Water will be used to Cool the WORT, then an ICE Bath to use as the cooling source.  Click Hoses Set? when ready."
"gblS_Bottom_Text" value = "Insure the Fermentor Room hose is looped back! Cooling Water setup should be checked. Have the ICE Bath Ready.  This will also set the Manifold to Whirlpool the Brew Kettle."
endif
if vVCooling == 4
vSMsg = "Set Manifold to Whirllpool the Brew Kettle though the Plate Chiller and Fermentor hose.  You need to set the Fermenter Return hose to Whirlpool the WORT back to the Brew Kettle. At First, Cooling Tap Water will be used to Cool the WORT, then use Glycol to chill Tap Water as the cooling source. Click Set Manifold when ready."
"gblS_Bottom_Text" value = "Insure the Fermentor Room hose is looped back! Cooling Water setup should be checked.  Have the Glycol Ready.  This will also set the Manifold to Whirlpool the Brew Kettle."
endif
if vVCooling == 5
vSMsg = "Set Manifold to Whirllpool the Brew Kettle though the Plate Chiller and Fermentor hose.  You need to set the Fermenter Return hose to Whirlpool the WORT back to the Brew Kettle.  At First, Cooling Tap Water will be used to Cool the WORT, then use Glycol to chill ICE Water  as the cooling source.   Click Hoses Set? when ready."
"gblS_Bottom_Text" value = "Insure the Fermentor Room hose is looped back! Cooling Water setup should be checked.   Have the Glycol && ICE Bath Ready.  This will also set the Manifold to Whirlpool the Brew Kettle."
endif
//...............................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...............................
"gblS_Top_Text" value =  vSMsg
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
start "inscpt_scrAdvancewithSwitch"
sleep 100
				"MB_28_do_ManualAlarm_B1" state = true
				"alm_Manual_Warning" fileindex = 3
				"alm_Manual_Warning" loop = true
				"alm_Manual_Warning" active = true
wait "sw_Running_Advance_with_Switch" state == false
"MB_28_do_ManualAlarm_B1" state = false
//...............................
//...............................
"gblV_Brew_Status" value =  514
[SectionBrew513]
[SectionBrew514]
print "@712 SectionBrew514"
wait "gblV_Brew_Status" value == 514
"gblV_Water_Switch_Status_Water" value = 5004
start "sub_2_scrPrimeandBasicManifold"
sleep 100
wait "sw_Running_Prime_Basic" state == false
"gblV_Brew_Status" value =  516
[SectionBrew515]
[SectionBrew516]
print "@721 Manifold Set  aand Red Pump On"
wait "gblV_Brew_Status" value == 516
"gblVEndlessLoop" value = 490
"MB_59_10K_MashReturn_B1" displayname = "WORT °F"
"gblS_Brewery_Top_2" value = "Check the Fermentor Room hose is still looped back and not leaking.  Check Fermentors are ready  Add Start San Now if not already done.!"
"gblS_Brewery_Top_2" visibility = visible
if vVCooling  > 1
print 729
"gblVEndlessLoop" value = 496
"gblS_Top_Text" value = "Whirlpooling WORT in the Brew Kettle.  At first, only tap water will be used to cool the WORT while it is Whirlpooling."
goto "Start_Whrirllpool_Timer"
endif
if vVCooling == 1
print 736
"gblVEndlessLoop" value = 501
"gblS_Top_Text" value = "Whirlpooling WORT in the Brew Kettle.  Cooling tap water is running.  Tap Water is the only Cooling Source."
goto "Start_Whrirllpool_Timer"
endif
// Start Whirlpool Timer
[Start_Whrirllpool_Timer]
print "@ 783 Start Whirlpool Timer, Turn on cooling water after delay"
stop "tm_Action_TopRight_B1"
"tm_Action_TopRight_B1" value = 00:00:00 
"tm_Action_TopRight_B1" type = countup
"tm_Action_TopRight_B1" displayname = "Whirlpool Timer"
start "tm_Action_TopRight_B1"
"tm_Action_TopRight_B1" visibility = visible
stop "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" type = countdown
"tm_Action_BottomRight_B1"  value = 00:03:00
"tm_Action_BottomRight_B1" displayname = "PreCool Delay"
"tm_Action_BottomRight_B1" visibility = hidden
"gblS_Brewery_Top_1" visibility = hidden
	if vB_Testing == true
	"VGC_43_do_CoolingWater_On_B1" state = false
	goto "Skip_Cooling_Water"
	endif
"VGC_43_do_CoolingWater_On_B1" state = true
	if vB_Hop_Rocket == true
		"VGC_43_do_CoolingWater_On_B1" state = false
	endif
[Skip_Cooling_Water]
"gblV_Brew_Status" value =  528
[SectionBrew527]
[SectionBrew528]
wait "gblV_Brew_Status" value == 528
start "inscpt_scrAlarm"
sleep 100
print 811
"alm_Hidden_Irish_Moss_Warning_ALARM" active = true
"gblS_Brewery_Bottom_3"  visibility = hidden
"gblS_Brewery_Bottom_4" background  = 2
"gblS_Brewery_Bottom_4" value = "Cooling Tap Water is running through the WORT Plate Chiller. Whirlpooling the Brew Kettle.  Insure the Probe from the MASH Return thermowell is moved to the WORT Output thermowell above the WORT Plate Chiller"
	if vB_Hop_Rocket == true
print 819
		"VGC_43_do_CoolingWater_On_B1" state = false
		"gblS_Brewery_Bottom_4" value = "Cooling Tap Water is off. Whirlpooling Hop Rocket to the Brew Kettle.  Insure the Probe from the MASH Return thermowell is moved to the WORT Output thermowell above the WORT Plate Chiller"
endif
"gblS_Brewery_Bottom_4" visibility = visible
sleep 2000
print 827
	if vB_Hop_Rocket == true
print 829
		sleep 2000
		goto "Hop_Rocket_Delay"
	endif
		if vB_Testing == true
			wait "tm_Action_TopRight_B1" value >= 00:00:15 
			"tm_Action_TopRight_B1" value = 00:01:40 
		endif
wait "tm_Action_TopRight_B1" value >= 00:01:45 
"tm_Action_BottomRight_B1" visibility = visible
print 839
		goto "3 Minute Delay"
[Hop_Rocket_Delay]
print "@ 842 Hop_Rocket_Delay"
	if vB_Hop_Rocket == false
print 844
		goto "3 Minute Delay"
	endif
print 846
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Bottom_4" value = "Insure the Probe from the MASH Return thermowell is moved to the WORT Output thermowell above the WORT Plate Chiller.  Hop Rocket in Line.  Whirlpooling though the Hop Rocket to the Brew Kettle.  There is a 10 minute Hop Rocket Delay to extract all the Aroma and Flavor from the Leaf Hops. "
"gblS_Brewery_Bottom_4" visibility = visible
//10_Min_Hop_Rocket_Delay
print "@ 857 10_Min_Hop_Rocket_Delay"
stop "tm_Delay_TopRight_B1"
"tm_Delay_TopRight_B1" type = countdown
"tm_Delay_TopRight_B1" value = 00:10:00
"tm_Delay_TopRight_B1" displayname = "Hop Rocket Steep Delay"
start "tm_Delay_TopRight_B1"
"tm_Delay_TopRight_B1" visibility = visible
"tmTopRight_B1" visibility = hidden
"tm_Action_TopRight_B1" visibility = hidden
print 865
	if vB_Testing == true
print 867
	wait "tm_Delay_TopRight_B1" value <= 00:09:50
	"tm_Delay_TopRight_B1" value = 00:00:10
	endif
print 871
wait "tm_Delay_TopRight_B1" value <= 00:00:00
stop "tm_Delay_TopRight_B1"
"tm_Delay_TopRight_B1" visibility = hidden
"tm_Action_TopRight_B1" visibility = visible
"MB_36_do_RedPump_B1" state = false
goto "Stop_Hop_Rocket"
[Stop_Hop_Rocket]
print "@ 880 Stop Hop Rocket"
print "@848 Reroute Hop Rocket"
		start "inscpt_scrClearB1_Brewery"
		sleep 100
		wait "sw_Running_Clear_B1" state == false
//...............................
		"gblS_Top_Text" value =  "Red Pump is Off.  The Hop Rocket Hose should be rerouted to take the Hop Rocket out.  When the WORT Plate Chiller hose is directed to the Fermentor Hose and bypasses the Hop Rocket, Click Hose Set?"
		"gblS_Bottom_Text" value = "Use Hot Gloves and be careful as there is HOT WORT!  You are the Safety and Control!   WARNING:  HOT WORT!!!!!!!"
		"gblS_swAllSwitch_Label_Text" value = "Hose Set?"
		start "inscpt_scrAdvancewithSwitch"
		sleep 100
"MB_28_do_ManualAlarm_B1" state = true
		"alm_Manual_Warning" fileindex = 3
		"alm_Manual_Warning" loop = true
"alm_Manual_Warning" active = true
		wait "sw_Running_Advance_with_Switch" state == false
		"MB_28_do_ManualAlarm_B1" state = false
[3 Minute Delay]
print "@ 885 3 Minute Delay"
//.............................................
"MB_36_do_RedPump_B1" state = true
"VGC_43_do_CoolingWater_On_B1" state = true
start "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" visibility = visible
"gblS_Brewery_Top_1" value = "Short 3 Minute Delay before using any additional cooling is set .  Wait. Will Auto Advance"
"gblS_Brewery_Top_1" visibility = visible
		if vB_Testing == true
			wait "tm_Action_TopRight_B1" value >= 00:01:48
			"tm_Action_TopRight_B1" value = 00:01:58 
		endif
start "tm_Action_BottomRight_B1"
start "inscpt_scrAlarm"
sleep 100
"alm_Sound_3_W1" fileindex = 1
"alm_Sound_3_W1" loop = false
"alm_Sound_3_W1" active = true
"gblVStartBrew" value = 6
"tm_Action_BottomRight_B1" visibility = visible
		if vB_Testing == true
			wait "tm_Action_BottomRight_B1" value <= 00:02:50 
			"tm_Action_BottomRight_B1" value = 00:00:48 
		endif
wait "tm_Action_BottomRight_B1"  value <= 00:00:45
"gblVStartBrew" value = 7
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Top_2" visibility =  hidden
"gblS_Brewery_Bottom_4" visibility = visible
		if vB_Testing == true
			wait "tm_Action_BottomRight_B1" value <= 00:00:40 
			"tm_Action_BottomRight_B1" value = 00:00:32 
		endif
wait "tm_Action_BottomRight_B1"  value <= 00:00:30
"gblVStartBrew" value = 8
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Bottom_4" visibility = hidden
		if vB_Testing == true
			wait "tm_Action_BottomRight_B1" value <= 00:00:25 
			"tm_Action_BottomRight_B1" value = 00:00:17 
		endif
wait "tm_Action_BottomRight_B1"  value <= 00:00:15
"gblVStartBrew" value = 9
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Top_2" visibility =  hidden
"gblS_Brewery_Bottom_4" visibility = visible
wait "tm_Action_BottomRight_B1"  value <= 00:00:00
stop "tm_Action_BottomRight_B1"
		if vB_Testing == true
 		"tm_Action_TopRight_B1" value = 00:04:55 
		endif
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"tm_Action_BottomRight_B1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"alm_Sound_3_W1" active = false
"tm_Action_BottomRight_B1" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
[Ender_scrBrew500_1]
if vB_Testing == true
"gblS_Script_Ended" value = "Ended: scrBrew500_1_Whrilpooling"
sleep 4001
endif
clear
start "scrBrew500_2_Whrilpooling"
stop "scrBrew500_1_Whrilpooling"
```

## 37. scrBrew500_2_Whrilpooling

Starts by itself: No · User can start or stop it: Yes · 443 lines

```text
//scrBrew500_2_Whrillpooling Modified 260912 11_21
//08/03/2023 10:03
// Seperated from scrBrew500 on 03/25/2026 8:49
//Modified 03/25/2026 08:59
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// alm_Hidden_Beer_Music_2 file 2 used
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
print vB_Testing
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
start "inscpt_scr_Inner_Blue"
"gblS_Script_Started" value = "Started: scrBrew500_2_Whrillpooling" 
//................................
//.........................
	if vB_Testing == true
		"gblS_Script_Started" visibility = hidden
		"gblS_Script_Ended" visibility = hidden
		"gblS_Inter_Script" visibility = hidden
		start "step_scrTest_Time _Reset"
		start "looper_scrBoilTimer_Reset"
sleep 100
		"gblT_SetTimer" visibility = hidden
		"sw_Advance_Timer" visibility = hidden
		"sw_Reset_Timer_Zero" visibility = visible

		"gblV_Brew_Status" visibility = visible
		"gblV_Sub3_Status" visibility = hidden
		"gblV_Sub4_Status" visibility = hidden
		"gblTValveDelay" value = 00:00:01
		sleep 99
	else
		"gblS_Script_Started" visibility = hidden
		"gblS_Script_Ended" visibility = hidden
		"gblS_Inter_Script" visibility = hidden
		stop "step_scrTest_Time _Reset"
		stop "looper_scrBoilTimer_Reset"
		"gblT_SetTimer" visibility = hidden
		"sw_Advance_Timer" visibility = hidden
		"sw_Reset_Timer_Zero" visibility = hidden
		"gblV_Brew_Status" visibility = hidden
		"gblV_Sub3_Status" visibility = hidden
		"gblV_Sub4_Status" visibility = hidden
		"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
"gblV_Group_1_Conflict" value = 9
"gblV_Group_2_Conflict" value = 4
"RP_v_CoolingSource" value = 2
start "inscpt_scrBasicStart"
start "inscpt_scrAlarm"
sleep 100
new value vVBrewStatus
new string vSMsg_Start
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg_Wait_154
new string vS_500_Label_Wait_154
new string vS_500_Label_Wait_170
new string vSMsg_EOB 
new string vSMsg_CS
new string vSMsg_FW
new value vV_DoorHopStatus
new value vVCooling
new value vVScriptFlow
new value vV_Pitch_Temperature
new time vT_WP
new string vS_Test
new value vVHopDropType
new value vV_Start_Volume
new value vV_End_Volume
new value vV_Calc_Volume
new value vV_BoilRate
new value vV_Calc_Rate
new value vV_Boil_Minute
new value vV_Calc_Rate_Delta
new time vT_Timer
new time vT_Timer_Check
new value vV_PreBoil_Volume
new value vV_Boil_Off_Calculated_Volume
new value vV_PostBoil_Measured_Volume
new value vV_PostBoil_Calculated_Volume
new value vV_Boil_Off_Volume
new value vV_Calc_Boil_Off_Rate
new bool vB_Hop_Rocket
new bool vB_Hop_EOB
new bool vB_Hop_Late_Both
new bool vB_Hop_Late_None
new bool vB_Hop_Sock
//...........................................
//...........................................
//Boil Off
vV_Boil_Minute = "gblVBoilTime_Minutes" value
vV_BoilRate = "gblVBoilOffperMin" value 
vV_PreBoil_Volume = "RP_v_PreBoil_Volume" value
vV_Boil_Off_Calculated_Volume = vV_Boil_Minute * vV_BoilRate
vV_PostBoil_Calculated_Volume = vV_PreBoil_Volume - vV_Boil_Off_Calculated_Volume
"gblVPrecision1" value = vV_PostBoil_Calculated_Volume
vV_PostBoil_Calculated_Volume = "gblVPrecision1" value 
//......................................................................................
vV_Pitch_Temperature = "gblVDesiredBatch1Setpoint_R1" value

	if "sw_Flow_EOB_Hop_Sock" state == true
		vB_Hop_Sock = true
	endif
vVHopDropType = 0
vVCooling = "RP_v_CoolingSource" value
print 100
print  vVCooling 
if vVCooling == 1 
print 103
print "1:Only Tap"
endif
if vVCooling == 2 
print 107
print "2:Tap Chilled by Ice Bath"
endif
if vVCooling == 3 
print "3:Only Ice Chilled Bath"
endif
if vVCooling == 4 
print "4:Tap Chilled by Glycol"
endif
if vVCooling == 5 
print "5: Ice Chilled Bath chilled by Glycol"
endif
"gblV_Brew_Status" value = 530
[SectionBrew530]
wait "gblV_Brew_Status" value == 530
[StartHere]
"gblS_Brewery_Bottom_3" value = wait
vS_500_Label_Wait_154 = "Wait WORT °F = 154 °F" 
vS_500_Label_Wait_170 = "Wait WORT °F = 170 °F"
"gblV_PitchSetpoint_B1" visibility = hidden
"gblVStartBrew" value = 1
	if "gblV_Group_EoB_Hops" value  > 0
		vB_Hop_EOB = true
	endif
[ChillingSource]
	if vB_Hop_EOB == false
		goto "Skip_End_of_Boil_Aroma_Hop_Drop"
	endif
vSMsg = "The WORT Temperature out of the WORT Plate Chiller is "
vSMsg1 = "MB_59_10K_MashReturn_B1" value
vSMsg = vSMsg + vSMsg1
vSMsg1 = " °F.  Waiting on WORT OUT to reach 170 °F or below to drop End of Boil Aroma Hops "
vSMsg = vSMsg + vSMsg1
vSMsg1 = "gblS_HopGroup_EOB" value
vSMsg = vSMsg + vSMsg1
vSMsg1 =  ".  Have the Hops Ready.. Wait Will Auto Advance. " 
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_1" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"gblS_Brewery_Top_1" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility 
"gblS_Brewery_Top_1" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
sleep 2000 
vSMsg = "Waiting on WORT OUT to reach 170 °F or below to drop End of Boil Aroma Hops "
vSMsg1 = "gblS_HopGroup_EOB" value
vSMsg = vSMsg + vSMsg1
vSMsg1 =  ".  Have the Hops Ready.. Wait Will Auto Advance. " 
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg 
	if vB_Testing == true
		"gblS_Brewery_Top_1" value = "Testing: Waiting for 170 Skipped"
		"gblS_Brewery_Top_1" visibility = visible
		sleep 2000
		"gblS_Brewery_Top_1" visibility = hidden
		goto "Test_Skip_Wait_170"
	endif
wait "MB_59_10K_MashReturn_B1" value <= 170
[Test_Skip_Wait_170]
"gblV_Brew_Status" value = 532
[SectionBrew532]
wait "gblV_Brew_Status" value == 532
[End_of_Boil_Aroma_Hop_Drop]
print "@ 171 End_of_Boil_Aroma_Hop_Drop"
			"VGC_43_do_CoolingWater_On_B1" state = false
			"MB_36_do_RedPump_B1" state = false
//...............................
				if vB_Hop_Sock == true
				"gblS_HopMessage_ALARM" value = "Red Pump is off. Drop the Aroma Hops Sock.  Be careful to tie it on so it cannot be sucked in the drain.  There will be a 5 minute delay for the Aroma Hops to steep around 170 °F or lower."
				else
				"gblS_HopMessage_ALARM" value = "Red Pump is off.  Drop the Aroma Hops in the Hop Spider.  There will be a 5 minute delay for the Aroma Hops to steep around 170 °F or lower."
				endif				
				"gblS_Bottom_Text" value = "The Aroma Hops will steep for 5 minutes around 170 °F or lower."
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hops_1_ALARM" fileindex = 3
"alm_Hops_1_ALARM" background  = 3
"alm_Hops_1_ALARM" displayname = "End of Boil Aroma Hops"
"alm_Hops_1_ALARM" visibility = visible
"alm_Hops_1_ALARM" active = true
wait "alm_Hops_1_ALARM" active == false
"alm_Hops_1_ALARM" visibility = hidden
"gblS_HopMessage_ALARM" visibility = hidden
show workspace "B1 Brewery"
[5_Minute_EOB_Aroma_Hops]
print "@ 205 5_Minute_EOB_Aroma_Hops"
"gblV_Brew_Status" value = 534
[SectionBrew534]
wait "gblV_Brew_Status" value == 534
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Bottom_3" value = "There is a five minute steep delay for the Aroma Hops.  Wait will Auto Advance"
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Bottom_3" visibility = visible
show workspace "B 1Brewery"
stop "tm_Delay_TopRight_B1"
"tm_Delay_TopRight_B1" type = countdown
"tm_Delay_TopRight_B1" value = 00:05:00
"tm_Delay_TopRight_B1" displayname = "End of Boil Aroma Hop Steep Delay"
start "tm_Delay_TopRight_B1"
"tm_Delay_TopRight_B1" visibility = visible
"tmTopRight_B1" visibility = hidden
"tm_Action_TopRight_B1" visibility = hidden
	if vB_Testing == true
		wait "tm_Delay_TopRight_B1" value <= 00:04:56
		"gblS_Brewery_Top_1" value = "Testing: Waiting for Timer Skipped"
		"gblS_Brewery_Top_1" visibility = visible
		sleep 2000
		"gblS_Brewery_Top_1" visibility = hidden
		"tm_Delay_TopRight_B1" value = 00:00:05
	endif
wait "tm_Delay_TopRight_B1" value <= 00:00:00
stop "tm_Delay_TopRight_B1"
"tm_Delay_TopRight_B1" visibility = hidden
print 254
"gblV_Brew_Status" value = 535
[SectionBrew535]
print 257
wait "gblV_Brew_Status" value == 535
	if vB_Hop_Sock == true
print 260
		"gblS_Top_Text" value = "You need to remove the Aroma Hop Sock.  Click Aroma Hop Sock Removed? when done."
		"gblS_swAllSwitch_Label_Text" value = "Aroma Hop Sock Removed?"
		"gblS_Bottom_Text" value = "Remove Aroma Hop Sock"
	else
print 265
		"gblS_Top_Text" value = "You need to remove the Hop Spider.  Click Hop Spider Removed? when done."
		"gblS_swAllSwitch_Label_Text" value = "Hop Spider Removed?"
"gblS_Bottom_Text" value = "Remove Hop Spider"
	endif
print 270
//...............................
				start "inscpt_scrClearB1_Brewery"
				sleep 100
				wait "sw_Running_Clear_B1" state == false
				start "inscpt_scrAdvancewithSwitch"
				sleep 100
				"MB_28_do_ManualAlarm_B1" state = true
				"alm_Manual_Warning" fileindex = 3
				"alm_Manual_Warning" loop = true
				"alm_Manual_Warning" active = true
				wait "sw_Running_Advance_with_Switch" state == false
				"MB_28_do_ManualAlarm_B1" state = false
//...............................
[Skip_End_of_Boil_Aroma_Hop_Drop]
print "@ 216 Skip End_of_Boil_Aroma_Hop_Drop"
"gblV_Brew_Status" value = 536
[SectionBrew536]
wait "gblV_Brew_Status" value == 536
print "Chilling Source ="
print vVCooling
	if vVCooling == 1
		vSMsg =  "TheCooling Tap Water is running. Tap Water is the Source of Cooling.  An Alarm will sound when the Pitch Temperature reaches "
		vSMsg1 = vV_Pitch_Temperature
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = " °F.  Click Tap Water?"
		vSMsg = vSMsg + vSMsg1
"gblS_Top_Text" value = vSMsg
		"gblS_Bottom_Text" value = "The Cooling Tap Water will shut off once the Pitch Temperature is reached.  It will be turned back on when transferrring the WORT to the Fermentor(s)."
				"gblS_swAllSwitch_Label_Text" value = "Tap Water?"
		goto "Cooling_Message"
	endif
	if vVCooling == 2
		print "@ 243 Chiiling Source = 2 Start the ICE Bath to cool Tap Water"
		"VGC_43_do_CoolingWater_On_B1" state = true
		//...............................
		vSMsg =  "The Manual ICE Bath Pump needs to be started.  This a strictly manual valve and you are the control. An Alarm will sound when the Pitch Temperature reaches "
		vSMsg1 = vV_Pitch_Temperature
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = " °F.  Once the ICE Bath is set and flowing through the Prechiller Plate Chiller, click ICE Bath? started."
		vSMsg = vSMsg + vSMsg1
"gblS_Top_Text" value = vSMsg
		"gblS_Bottom_Text" value = "The ICE Bath Pump should be in the ICE Bath and the Output hose connected to the Water In of the PreChiller Plate Chiller.  The Water Out of the  PreChiller Plate Chiller should be return the cold water back to the ICE Bath."
				"gblS_swAllSwitch_Label_Text" value = "ICE Bath Started?"
		goto "Cooling_Message"
	endif
//...............................	
//.......................................
	if vVCooling == 3
		"VGC_43_do_CoolingWater_On_B1" state = false
		"gblS_Top_Text" value = "The Cooling Tap Water is Off. The ICE Bath will be used instead of tap water. Set ICE Bath in place of tap water as the source for chilling water. The ICE Bath Pump Outlet Hose will be connected to the PreChiller Water IN.  Click ICE Bath Source? when ready."
	"gblS_Bottom_Text" value  = "1: Disconnect Tap Water (In && OUT)\n2: Connect ICE Bath Pump Outlet Hose\n3: Connect Return to ICE Bath\n4: Place Pump in Ice Bath\n5: Turn on ICE Bath Outlet Pump" 
	"gblS_swAllSwitch_Label_Text" value = "ICE Bath Source?"
goto "Cooling_Message"
//
	if vVCooling == 4
		"VGC_43_do_CoolingWater_On_B1" state = true
		"gblS_Top_Text" value = "The Cooling Tap Water is ON. The Glycol Bath will be used to chill the tap water. Set the Glycol Batch up. The Glycol Bath Outlet Hose will be connected to the PreChiller Plate ChillerWater IN.  Click Glycol Bath Set? when ready."
	"gblS_Bottom_Text" value  = "1: Connect Glycol OUT to Water In)\n2: Connect Water Out to Glycol Return\n3: Turn On Glycol Pump" 
	"gblS_swAllSwitch_Label_Text" value = "Glycol Bath Set"
goto "Cooling_Message"
	endif
//
	if vVCooling == 5
			"VGC_43_do_CoolingWater_On_B1" state = false
			"gblS_Top_Text" value = "The Cooling Tap Water is Off. The ICE Bath will be used instead of tap water. Set ICE Bath in place of tap water as the source for chilling water. The ICE Bath Pump Outlet Hose will be connected to the PreChiller Water IN.  Click ICE Bath Source? when ready."
		"gblS_Bottom_Text" value  = "1: Disconnect Tap Water (In && OUT)\n2: Connect ICE Bath Pump Outlet Hose\n3: Connect Return to ICE Bath\n4: Place Pump in Ice Bath\n5: Turn on ICE Bath Outlet Pump" 
	"	gblS_swAllSwitch_Label_Text" value = "ICE Bath Source?"
//...............................
				start "inscpt_scrClearB1_Brewery"
				sleep 100
				wait "sw_Running_Clear_B1" state == false
				start "inscpt_scrAdvancewithSwitch"
				sleep 100
				wait "sw_Running_Advance_with_Switch" state == false
//...............................
			"gblS_Top_Text" value = "The Cooling Tap Water is OFF. The Glycol Bath will be used to chill the ICE Water Bath. Set the Glycol Batch up. The Glycol Bath Outlet Hose will be connected to the PreChiller Plate Chiller Water IN.  Click Glycol Bath Set? when ready."
	"gblS_Bottom_Text" value  = "1: Connect Glycol OUT to Water In)\n2: Connect Water Out to Glycol Return\n3: Turn On Glycol Pump" 
		"gblS_swAllSwitch_Label_Text" value = "Glycol Bath Set"
		goto "Cooling_Message"
	endif
///...............................................................................
[Cooling_Message]
print "@324Cooling Message"
"gblV_Brew_Status" value = 538
[SectionBrew538]
wait "gblV_Brew_Status" value == 538

//...............................
				start "inscpt_scrClearB1_Brewery"
				sleep 100
				wait "sw_Running_Clear_B1" state == false
				start "inscpt_scrAdvancewithSwitch"
				sleep 100
				wait "sw_Running_Advance_with_Switch" state == false
//...............................
[Wait_Pitch]
print "@394 Wait Pitch"
"gblV_Brew_Status" value = 540
[SectionBrew540]
wait "gblV_Brew_Status" value == 540
vSMsg = " Waiting on WORT OUT to reach the Pitch Temperature of  "
vSMsg1 = vV_Pitch_Temperature
vSMsg = vSMsg + vSMsg1
	vSMsg1 = " °F.  An Alarm will sound. The Minimum Whirlpool Time is 10 Minutes.  Once the Minimum 10 minutes of Whirllpool time has passed, the Whrillpool will stop. Wait! Will Auto Advance"
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_1" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"gblS_Brewery_Top_1" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility 
"gblS_Brewery_Top_1" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
	if vB_Testing == true
		"gblS_Brewery_Top_1" value = "Testing: Waiting for Pitch Skipped"
		"gblS_Brewery_Top_1" visibility = visible
		sleep 2000
		"gblS_Brewery_Top_1" visibility = hidden
		goto "TEST_Skip_Pitch"
	endif
wait "MB_61_10kWortOut_B1" value <= vV_Pitch_Temperature
[TEST_Skip_Pitch]
show workspace "Alarms"
"alm_Alarm_SanitizeBoil_ALARM" fileindex = 2
"alm_Alarm_SanitizeBoil_ALARM" displayname  = "Pitch Temperature"
"alm_Alarm_SanitizeBoil_ALARM"  background = 3
"alm_Alarm_SanitizeBoil_ALARM" sound = none
"alm_Alarm_SanitizeBoil_ALARM" active = true
"alm_EndofBoil" active = true
"alm_Alarm_SanitizeBoil_ALARM" visibility = visible
"alm_EndofBoil" visibility = visible
wait "alm_Alarm_SanitizeBoil_ALARM" active == false
"alm_Alarm_SanitizeBoil_ALARM" visibility = hidden
"alm_EndofBoil" visibility = hidden
"alm_EndofBoil" active = false
show workspace "B1 Brewery"
[WhirlPool_Timer_End]
"gblV_Brew_Status" value = 542
[SectionBrew542]
wait "gblV_Brew_Status" value == 542
print "@444 wait WhirlPool_Timer_End"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"tm_Action_TopRight_B1" visibility = visible
"gblS_Brewery_Bottom_3" value = "Wait for Whrillpool Timer to reach a Minimum of Ten Minutes"
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Bottom_3" visibility = visible
sleep 1000
print 459
	if vB_Testing == true
print 461
		"gblS_Brewery_Top_1" value = "Testing: Whirlpool Timer set to 00:09:55"
		"gblS_Brewery_Top_1" visibility = visible
		sleep 2000
		"tm_Action_TopRight_B1" value = 00:09:55
		"gblS_Brewery_Top_1" visibility = hidden
	endif
print 469
wait "tm_Action_TopRight_B1" value >= 00:10:00
stop "tm_Action_TopRight_B1"
goto "Ender_scrBrew500_2"
[Ender_scrBrew500_2]
"gblV_Brew_Status" value = 544
[SectionBrew544]
wait "gblV_Brew_Status" value == 544
if vB_Testing == true
"gblS_Script_Ended" value = "Ended: scrBrew500_2_Whrilpooling"
sleep 4001
endif
clear
start "scrBrew500_3_Trub_and_Fermentors"
stop "scrBrew500_2_Whrilpooling"
```

## 38. scrBrew500_3_Trub_and_Fermentors

Starts by itself: No · User can start or stop it: Yes · 447 lines

```text
//scrBrew500_3_Trub_and_Fermentors
//08/03/2023 10:03
// seperate scrBrew%00 0n 03/25/2026
//Modified 03/25/2026 08:31
//© OakBarn Brewery
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: scrBrew500_2_Whrilpooling"
 //................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
"gblV_Group_1_Conflict" value = 9
"gblV_Group_2_Conflict" value = 4
start "inscpt_scrAlarm"
sleep 4001
new value vVBrewStatus
new string vSMsg_Start
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg_Wait_154
new string vS_500_Label_Wait_154
new string vSMsg_EOB 
new string vSMsg_CS
new string vSMsg_FW
new value vV_DoorHopStatus
new value vVCooling
new value vVScriptFlow
new time vT_WP
new string vS_Test
new value vVHopDropType
//...................................................
 vVBrewStatus = 584
"gblV_Brew_Status" value = 584
[SectionBrew584]
wait "gblV_Brew_Status" value == 584
print "@2161 SectionBrew584"
"MB_36_do_RedPump_B1" state = false
"VGC_43_do_CoolingWater_On_B1" state = false
stop "tmBottomRight_B1"
stop "tmTopRight_B1"
"RP_t_CoolingTime" value = "tmTopRight_B1" value
"gblS_Brewery_Top_3" value = "Time to Rest and let the Trub Settle.  You may also switch, replace or clean the Trub Filter if needed.  The Trub Timer will countdown to zero.  Will Auto Advance."
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblSReportLabel_B1" visibility = hidden
//BackGrounds
// Black Purple Red
//"gblS_Brewery_Top_2" background = 2
// Dark-Grey Green Blue
"gblS_Brewery_Top_3" background = 1
//Yellow Orange Lighter-Purple
//"gblS_Brewery_Bottom_1" background = 1
// ygreen black red-caution
//"gblS_Brewery_Bottom_4" background = 1
//// Dark-Grey Green Blue
"gblS_Brewery_Bottom_3" background = 3
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait: Auto Advance"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"alm_Hidden_Beer_Music_3" fileindex = 3
stop "tmBottomRight_B1"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1"  value = 00:10:00
"tmBottomRight_B1" displayname = "Trub Settling"
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
start "inscpt_scrAlarm"
sleep 4001
"alm_Hidden_Beer_Music_3" active = true
wait "tmBottomRight_B1"  value <= 00:09:00
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew585]
wait "gblV_Brew_Status" value == 585
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew586]
wait "gblV_Brew_Status" value == 586
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew587]
wait "gblV_Brew_Status" value == 587
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew588]
wait "gblV_Brew_Status" value == 588
new value vVNumFermetors
vVNumFermetors = "gblV_Num_Fermentors" value 
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vSMsg4
vSMsg1 = "You need to drain and insure that "
if  vVNumFermetors == 1
vSMsg2 = " the single Fermentor is ready.  Make sure you check the Manual Valves on the Fermentor is CLOSED when drained"
vSMsg3 = " Trub continues to Settle.  The Trub Timer will countdown to zero."
vSMsg4 = "Will Auto Advance"
endif 
if  vVNumFermetors == 2
vSMsg2 =  "both Fermentors are ready.  Make sure you check the Manual Valves on the Fermentors are CLOSED when drained"
vSMsg3 = " Trub continues to Settle.  The Trub Timer will countdown to zero."
vSMsg4 = "Will Auto Advance"
endif 
if  vVNumFermetors == 3
vSMsg2 =  "all 3  Fermentors are ready.  Make sure you check the Manual Valves on the Fermentors are CLOSED when drained"
vSMsg3 = " Trub continues to Settle.  The Trub Timer will countdown to zero."
vSMsg4 = "Will Auto Advance"
endif 

if  vVNumFermetors > 3
vSMsg2 = " the all Fermentor is ready.  Make sure you check the Manual Valves on the Fermentors are CLOSED when drained"
vSMsg3 = " Trub continues to Settle.  The Trub Timer will countdown to zero."
vSMsg4 = "Will Auto Advance"
endif
vSMsg = vSMsg1 + vSMsg2
"gblS_Brewery_Top_2" value = vSMsg
"gblS_Brewery_Top_3" value = vSMsg3 
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblSReportLabel_B1" visibility = hidden
//BackGrounds
// Black Purple Red
"gblS_Brewery_Top_2" background = 1
// Dark-Grey Green Blue
"gblS_Brewery_Top_3" background = 1
//Yellow Orange Lighter-Purple
//"gblS_Brewery_Bottom_1" background = 2
// ygreen black red-caution
"gblS_Brewery_Bottom_4" background = 2
//// Dark-Grey Green Blue
"gblS_Brewery_Bottom_3" background = 1
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = vSMsg4 
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
wait "tmBottomRight_B1"  value <= 00:08:45
"gblS_Brewery_Top_2" value = vSMsg3
"gblS_Brewery_Top_3" value = vSMsg 
wait "tmBottomRight_B1"  value <= 00:08:30
"gblS_Brewery_Top_2" value = vSMsg
"gblS_Brewery_Top_3" value = vSMsg3
wait "tmBottomRight_B1"  value <= 00:08:15
"gblS_Brewery_Top_2" value = vSMsg3
"gblS_Brewery_Top_3" value = vSMsg  
wait "tmBottomRight_B1"  value <= 00:08:00
"gblS_Brewery_Top_2" value = vSMsg
"gblS_Brewery_Top_3" value = vSMsg3
wait "tmBottomRight_B1"  value <= 00:07:30
vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew589]
wait "gblV_Brew_Status" value == 589
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew590]
wait "gblV_Brew_Status" value == 590
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew591]
wait "gblV_Brew_Status" value == 591
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew592]
wait "gblV_Brew_Status" value == 592
"gblS_Brewery_Top_3" value = "Trub continues to Settle.  The Trub Timer will countdown to zero. "
"gblS_swAllSwitch_Label_Text" value = "Will Auto Advance"

//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblSReportLabel_B1" visibility = hidden
"tmBottomRight_B1" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"gblVScriptFlow" value = 0
vVScriptFlow = "gblVScriptFlow" value
[LoopTrubSettle]
if "tmBottomRight_B1"  value <= 00:06:00
if  vVScriptFlow == 0 
"gblVScriptFlow" value = 99
vVScriptFlow = "gblVScriptFlow" value
"alm_Hidden_Beer_Music_2" fileindex = 2
start "inscpt_scrAlarm"
sleep 3000
"alm_Hidden_Beer_Music_2" active = true
"gblS_Brewery_Bottom_3" value = "Trub continues to Settle.  The Trub Timer will countdown to zero.  You may OverRide. "
"gblS_swAllSwitch_Label_Text" value = "OverRide?"
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmTopRight_B1" type = countdown
start "tmTopRight_B1"
"tmTopRight_B1" value = "tmBottomRight_B1" value
"tmTopRight_B1" visibility = visible
"tmBottomRight_B1" visibility = hidden
endif
endif
if "tmBottomRight_B1"  value <= 00:00:00
goto "LoopTrubSettleEnd"
endif
if "gblV_Brew_Status" value == 593
goto "LoopTrubSettleEnd"
endif
goto "LoopTrubSettle"
[LoopTrubSettleEnd]
stop "tmBottomRight_B1"
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Beer_Music_2" active = false
"tmBottomRight_B1" visibility = hidden
start "inscpt_scrAlarm"
sleep 4000
 vVBrewStatus = 593
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew593]
wait "gblV_Brew_Status" value == 593
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Top_1" visibility = hidden
"gblVReport_B1" background = 1
"gblS_Brewery_Top_2" value = "Measure the Final Volume in the Brew Kettle.  Will Auto Advance on you enter the volume."
"gblS_swAllSwitch_Label_Text" value = "Record Brew Kettle Volume"
"gblSReportLabel_B1" value = "Record Final Volume"
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//Backgroung
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 2
//Visibity
"gblS_Brewery_Bottom_1" visibility = hidden
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
 "tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"alm_Hop_Delay_1" fileindex = 2 
"alm_Hop_Delay_1" loop = true
"alm_Hop_Delay_1" active = true
"MB_28_do_ManualAlarm_B1" state = true
wait  "gblVReport_B1" value > 0
"MB_28_do_ManualAlarm_B1" state = false
"alm_Hop_Delay_1" active = false
"alm_Hop_Delay_1" fileindex = 1 
"alm_Hop_Delay_1" loop = false
"gblVCurrentBrewKettle_Volume" value = "gblVReport_B1" value
"RP_v_FinalVolume" value = "gblVReport_B1" value
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 0
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew594]
wait "gblV_Brew_Status" value == 594
new value vVNumFermetors
vVNumFermetors = "gblV_Num_Fermentors" value 
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vSMsg4
vSMsg1 = "You need to drain and insure that "
if  vVNumFermetors == 1
vSMsg2 = " the single Fermentor is ready.  Make sure you check the Manual Valves on the Fermentor is CLOSED when drained"
vSMsg3 = " Click Fermentor SET? to advance."
vSMsg4 = "Fermentor SET?"
endif 
if  vVNumFermetors == 2
vSMsg2 =  "both Fermentors are ready.  Make sure you check the Manual Valves on the Fermentors are CLOSED when drained."
vSMsg3 = " Click Both Fermentors SET? to advance."
vSMsg4 = " Both Fermentors SET?"
endif 
if  vVNumFermetors == 3
vSMsg2 =  "all three Fermentors are ready.  Make sure you check the Manual Valves on the Fermentors are CLOSED when drained."
vSMsg3 = " Click 3 Fermentors SET? to advance."
vSMsg4 = " 3 Fermentors SET?"
endif 
if  vVNumFermetors > 3
vSMsg2 = " the all Fermentor is ready.  Make sure you check the Manual Valves on the Fermentors are CLOSED when drained"
vSMsg3 = " Click All Fermentors SET? to advance."
vSMsg4 = "All Fermentors SET?"
endif
vSMsg = vSMsg1 + vSMsg2
"gblS_Brewery_Top_2" value = vSMsg
"gblS_Brewery_Bottom_3" value = vSMsg3 
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = Visible
"tmBrewDay_B1" visibility = visible
"gblSReportLabel_B1" visibility = hidden
//BackGrounds
// Black Purple Red
"gblS_Brewery_Top_2" background = 3
// Dark-Grey Green Blue
"gblS_Brewery_Top_3" background = 1
//Yellow Orange Lighter-Purple
//"gblS_Brewery_Bottom_1" background = 1
// ygreen black red-caution
//"gblS_Brewery_Bottom_4" background = 1
//// Dark-Grey Green Blue
"gblS_Brewery_Bottom_3" background = 1
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = vSMsg4 
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
[SectionBrew595]
wait "gblV_Brew_Status" value == 595
"MB_28_do_ManualAlarm_B1" state = false
 vVBrewStatus = 596
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew596]
wait "gblV_Brew_Status" value == 596
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew597]
wait "gblV_Brew_Status" value == 597
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew598]
wait "gblV_Brew_Status" value == 598
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew599]
wait "gblV_Brew_Status" value == 599
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_2" value = "Are you ready to transfer the WORT to the Fermentors?  Check the Fermentors that all the drain valves are closed.  Set the Hoses in the Fermentor Room to transfer the WORT to the Fermentor."
"gblS_Brewery_Bottom_3" value =   " Click Hoses and Fermentors Ready? to advance. Insure that the Drain Valves are closed on all Fermentors! "
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmBrewDay_B1" visibility = visible
"gblSReportLabel_B1" visibility = hidden
//BackGrounds
// Black Purple Red
//"gblS_Brewery_Top_2" background = 2
// Dark-Grey Green Blue
"gblS_Brewery_Top_3" background = 1
//Yellow Orange Lighter-Purple
//"gblS_Brewery_Bottom_1" background = 1
// ygreen black red-caution
//"gblS_Brewery_Bottom_4" background = 1
//// Dark-Grey Green Blue
"gblS_Brewery_Bottom_3" background = 1
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "Hoses and Fermentors Ready?"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
[SectionBrew600]
wait "gblV_Brew_Status" value == 600
"MB_28_do_ManualAlarm_B1" state = false
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
if vB_Testing == true
"gblS_Script_Ended" value = "Ended: scrBrew500_3_Trub_and_Fermentors"
sleep 4001
endif
clear
start "scr600_1_ SET_WORT_SOURCE"
stop "scrBrew500_3_Trub_and_Fermentors"
```

## 39. scr600_1_ SET_WORT_SOURCE

Starts by itself: No · User can start or stop it: Yes · 479 lines

```text
// scr600_1_ SET_WORT_SOURCE
//06/11/2026 10:34
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// MODIFIED 06/11/2026 10:34
//..................................
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: scr600_1_ SET_WORT_SOURCE"
 //................................
//.........................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
"gblS_Inter_Script" visibility = visible
"gblV_Brew_Status" visibility = visible
"gblV_Sub3_Status" visibility = visible
"gblV_Sub4_Status" visibility = visible
start "step_scrTest_Time _Reset"
start "looper_scrBoilTimer_Reset"
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
"gblS_Inter_Script" visibility = hidden
"gblV_Brew_Status" visibility = hidden
"gblV_Sub3_Status" visibility = hidden
"gblV_Sub4_Status" visibility = hidden

"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
"gblV_Group_1_Conflict" value = 9
"gblV_Group_1_Conflict" value = 9
"gblV_Group_2_Conflict" value = 4
goto  "Start_WORT"
[RESTART]
print  "@  49 RESTART"
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
goto  "Start_WORT"
[Start_WORT]
print  "@  14 Start_WORT"
show workspace "B1 Brewery"
//..................................
//..................................
new string vSMsg
new string vSMsg1
new value vV_Current_BK_Volume
new value vV_Current_LM_Volume
new value vV_Current_BrewZilla_Volume
new value vV_Total_Wort
new value vV_Additional_Wort
new value vV_Flow
//....................................................
"gblV_Brew_Status" value = 999
vV_Current_BK_Volume = "gblVCurrentBrewKettle_Volume"  value
vV_Current_LM_Volume = "gblVCurrentLittle_Volume" value
vV_Current_BrewZilla_Volume = "gblVCurrentBrewzilla_Volume" value
print  "@ 45 Brew Kettle"
//Brew Kettle
vV_Flow = 2
if vV_Current_BK_Volume <= 0
"gblS_Brewery_Top_3" value =  "The current Volume of the Brew Kettle is ZERO."
goto "Delay_1"
endif
vSMsg =  "The current Volume of the Brew Kettle is "
vSMsg1 = vV_Current_BK_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  Is this WORT TO transfer and FERMENT?"
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1" value = "Select 1 = Yes\n2 = N0."
"gblS_swAllSwitch_Label_Text" value = "Make your choice!"
"gblS_Brewery_Top_2" value = vsMsg
"gblSReportLabel_B1" value = "Choose one of the Above\n1 or 2 only!"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1 
// Visibility
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//..........................................................................................
[Loop_BK]
sleep 100
if "gblVReport_B1" value > 2
"gblVReport_B1" value =  0
"gblS_swAllSwitch_Label_Text" value =  "1 or 2 Only!"
"gblS_swAllSwitch_Label_Text" background = 1
sleep 4001
"gblS_swAllSwitch_Label_Text" background = 2
endif
if "gblVReport_B1" value == 1
"sw_Status_WORT_BK"  state = true
goto "Exit_Loop_BK"
endif
if "gblVReport_B1" value == 2
"sw_Status_WORT_BK"  state = false
goto "Exit_Loop_BK"
endif
goto "Loop_BK"
[Exit_Loop_BK]
[Flow_2]
print  "@ 103 Little Mac"
//Little Mac
vV_Flow = 3
if vV_Current_LM_Volume <= 0
"gblS_Brewery_Top_3"  value =  "The current Volume of the Little Mac is ZERO."
goto "Delay_1"
endif
vSMsg =  "The current Volume of the Little Mac is "
vSMsg1 = vV_Current_LM_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 =  " gallons.  Is this WORT TO transfer and FERMENT?"
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1" value = "Select 1 = Yes\n2 = N0."
"gblS_swAllSwitch_Label_Text" value = "Make your choice!"
"gblS_Brewery_Top_2" value = vsMsg
"gblSReportLabel_B1" value = "Choose one of the Above\n1 or 2 only!"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1 
// Visibility
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//..........................................................................................
[Loop_LM]
sleep 100
if "gblVReport_B1" value > 2
"gblVReport_B1" value =  0
"gblS_swAllSwitch_Label_Text" value =  "1 or 2 Only!"
"gblS_swAllSwitch_Label_Text" background = 1
sleep 4001
"gblS_swAllSwitch_Label_Text" background = 2
endif
if "gblVReport_B1" value == 1
"ssw_Status_WORT_Little_Mac" state = true
goto "Exit_Loop_LM"
endif
if "gblVReport_B1" value == 2
"ssw_Status_WORT_Little_Mac" state = false
goto "Exit_Loop_LM"
endif
goto "Loop_LM"
[Exit_Loop_LM]
[Flow_3]
vV_Flow = 4
print  "@ 162 Brewzilla"
//Brewzillia
if vV_Current_BrewZilla_Volume <= 0
"gblS_Brewery_Top_3"  value = "The current Volume of the Brewzilla is ZERO."
goto "Delay_1"
endif
vSMsg = "The current Volume of the Brewzilla Mac is "
vSMsg1 = vV_Current_BrewZilla_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  Is this WORT TO transfer and FERMENT?"
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1" value = "Select 1 = Yes\n2 = N0."
"gblS_swAllSwitch_Label_Text" value = "Make your choice!"
"gblS_Brewery_Top_2" value = vsMsg
"gblSReportLabel_B1" value = "Choose one of the Above\n1 or 2 only!"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1 
// Visibility
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//..........................................................................................
[Loop_BZ]
sleep 100
if "gblVReport_B1" value > 2
"gblVReport_B1" value =  0
"gblS_swAllSwitch_Label_Text" value =  "1 or 2 Only!"
"gblS_swAllSwitch_Label_Text" background = 1
sleep 4001
"gblS_swAllSwitch_Label_Text" background = 2
endif
if "gblVReport_B1" value == 1
"sw_Status_WORT_Brewzilla" state = true
goto "Exit_Loop_BZ"
endif
if "gblVReport_B1" value == 2
"sw_Status_WORT_Brewzilla" state = false
goto "Exit_Loop_BZ"
endif
goto "Loop_BZ"
[Exit_Loop_BZ]
goto "Skip_Delay"
[Delay_1]
 //............................................................
//Short Delay  00:00:07 
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = 00:00:07
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
//............................................................
if vV_Flow == 2
goto "Flow_2"
endif
if vV_Flow == 3
goto "Flow_3"
endif
if vV_Flow == 4
goto "Skip_Delay"
endif
[Skip_Delay]
"gblV_Total_WORT" value = 0
vV_Total_Wort = "gblV_Total_WORT" value
//........................................... 
// Brew Kettle Only
if "sw_Status_WORT_BK" state == true 
if "ssw_Status_WORT_Little_Mac" state == false
if "sw_Status_WORT_Brewzilla" state == false
vV_Total_Wort = vV_Current_BK_Volume
"gblV_Total_WORT" value = vV_Total_Wort
vSMsg = "Only the Brew Kettle has WORT to Ferment. The Total amount of WORT is "
vSMsg1 = vV_Total_Wort
vSMsg = vSMsg + vSMsg1
vSMsg1 = "  gallons.  This is the LAST CHANCE to fix any issues.  Is this Correct? "
vSMsg = vSMsg + vSMsg1
endif
endif
endif
//........................................... 
// Brew Kettle and Little MAC have WORT
if "sw_Status_WORT_BK" state == true 
if "ssw_Status_WORT_Little_Mac" state == true
if "sw_Status_WORT_Brewzilla" state == false
vV_Total_Wort = vV_Current_BK_Volume
vV_Additional_Wort = vV_Current_LM_Volume
vV_Total_Wort = vV_Total_Wort + vV_Additional_Wort
"gblV_Total_WORT" value = vV_Total_Wort
vSMsg = "The Brew Kettle and Little MAC BOTH have WORT to Ferment. The Total amount of WORT is "
vSMsg1 = vV_Total_Wort
vSMsg = vSMsg + vSMsg1
vSMsg1 = "  gallons.  This is the LAST CHANCE to fix any issues.  Is this Correct? "
vSMsg = vSMsg + vSMsg1
endif
endif
endif
//........................................... 
// Brew Kettle and Little MAC and BrewZilla have WORT
if "sw_Status_WORT_BK" state == true 
if "ssw_Status_WORT_Little_Mac" state == true
if "sw_Status_WORT_Brewzilla" state == true
vV_Total_Wort = vV_Current_BK_Volume
vV_Additional_Wort = vV_Current_LM_Volume
vV_Total_Wort = vV_Total_Wort + vV_Additional_Wort
vV_Additional_Wort = vV_Current_BrewZilla_Volume
vV_Total_Wort = vV_Total_Wort + vV_Additional_Wort
"gblV_Total_WORT" value = vV_Total_Wort
vSMsg = "The Brew Kettle,Little MAC and BrewZilla ALL have WORT to Ferment. The Total amount of WORT is "
vSMsg1 = vV_Total_Wort
vSMsg = vSMsg + vSMsg1
vSMsg1 =  "  gallons.  This is the LAST CHANCE to fix any issues.  Is this Correct? "
vSMsg = vSMsg + vSMsg1
endif
endif
endif
//........................................... 
// Brew Kettle  and BrewZilla have WORT
if "sw_Status_WORT_BK" state == true 
if "ssw_Status_WORT_Little_Mac" state == false
if "sw_Status_WORT_Brewzilla" state == true
vV_Total_Wort = vV_Current_BK_Volume
vV_Additional_Wort = vV_Current_BrewZilla_Volume
vV_Total_Wort = vV_Total_Wort + vV_Additional_Wort
"gblV_Total_WORT" value = vV_Total_Wort
vSMsg = "The Brew Kettle and BrewZilla BOTH have WORT to Ferment. The Total amount of WORT is "
vSMsg1 = vV_Total_Wort
vSMsg = vSMsg + vSMsg1
vSMsg1 = ."  gallons.  This is the LAST CHANCE to fix any issues.  Is this Correct? "
vSMsg = vSMsg + vSMsg1
endif
endif
endif
//........................................... 
// BrewZilla Only
if "sw_Status_WORT_BK" state == false 
if "ssw_Status_WORT_Little_Mac" state == false
if "sw_Status_WORT_Brewzilla" state == true
vV_Total_Wort = vV_Current_BrewZilla_Volume
"gblV_Total_WORT" value = vV_Total_Wort
vSMsg = "Only the Brewzilla has WORT to Ferment. The Total amount of WORT is "
vSMsg1 = vV_Total_Wort
vSMsg = vSMsg + vSMsg1
vSMsg1 = ."  gallons.  This is the LAST CHANCE to fix any issues.  Is this Correct? "
vSMsg = vSMsg + vSMsg1
endif
endif
endif
//........................................... 
// Little Mac Only
if "sw_Status_WORT_BK" state == false 
if "ssw_Status_WORT_Little_Mac" state == true
if "sw_Status_WORT_Brewzilla" state == false
vV_Total_Wort = vV_Current_LM_Volume
"gblV_Total_WORT" value = vV_Total_Wort
vSMsg = "Only the Brewzilla has WORT to Ferment. The Total amount of WORT is "
vSMsg1 = vV_Total_Wort
vSMsg = vSMsg + vSMsg1
vSMsg1 = ."  gallons.  This is the LAST CHANCE to fix any issues.  Is this Correct? "
vSMsg = vSMsg + vSMsg1
endif
endif
endif
//........................................... 
// Little MAC and BrewZilla have WORT
if "sw_Status_WORT_BK" state == false 
if "ssw_Status_WORT_Little_Mac" state == true
if "sw_Status_WORT_Brewzilla" state == true
vV_Total_Wort = vV_Current_LM_Volume
vV_Additional_Wort = vV_Current_BrewZilla_Volume
vV_Total_Wort = vV_Total_Wort + vV_Additional_Wort
"gblV_Total_WORT" value = vV_Total_Wort
vSMsg = "The Little MAC and BrewZilla BOTH have WORT to Ferment. The Total amount of WORT is "
vSMsg1 = vV_Total_Wort
vSMsg = vSMsg + vSMsg1
vSMsg1 = ."  gallons.  This is the LAST CHANCE to fix any issues.  Is this Correct? "
vSMsg = vSMsg + vSMsg1
endif
endif
endif
"gblS_BrewName_B1" value = "Select 1 = Confirm\n2 = Start Over."
"gblS_swAllSwitch_Label_Text" value = "Make your choice!"
"gblS_Brewery_Top_2" value = vsMsg
"gblSReportLabel_B1" value = "Choose one of the Above\n1 or 2 only!"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1 
// Visibility
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//..........................................................................................
[Loop_StartOver]
sleep 100
if "gblVReport_B1" value > 2
"gblVReport_B1" value =  0
"gblS_swAllSwitch_Label_Text" value =  "1 or 2 Only!"
"gblS_swAllSwitch_Label_Text" background = 1
sleep 4001
"gblS_swAllSwitch_Label_Text" background = 2
endif
if "gblVReport_B1" value == 1
print "@ 416 Confirmed"
goto "Ender_Wort_Source"
endif
if "gblVReport_B1" value == 2
"gblVReport_B1" value = 0
goto "Exit_Loop_StartOver"
endif
goto "Loop_StartOver"
[Exit_Loop_StartOver]
"gblVReport_B1" value = 0
"gblS_Brewery_Top_3" value = "Manually Correct any volumes as needed. If any vessel had WORT but was entered wrong as No, it can be corrected if you Start Over as well.  Click ALL Set? to Start Over"
"gblS_swAllSwitch_Label_Text" value = "All Set?"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.............................................
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibilty
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden 
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 999
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
wait "gblV_Brew_Status" value == 1000
print "@ 452  RESTART Over"
goto "RESTART"
[Ender_Wort_Source]
"gblVReport_B1" value = 0
"gblS_Script_Ended" value = "Ended: scr600_1_ SET_WORT_SOURCE"
if vB_Testing == true
sleep 4001
endif
clear
start "scr600_2_Choose_WORT_Source"
stop "scr600_1_ SET_WORT_SOURCE"
```

## 40. scr600_2_Choose_WORT_Source

Starts by itself: No · User can start or stop it: Yes · 344 lines

```text
// scr600_2_Choose_WORT_Source
//04/26/2026 08:15
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// MODIFIED 04/26/2026 08:15
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: scr600_2_Choose_WORT_Source"
 //................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
"gblV_Group_1_Conflict" value = 9
"gblV_Group_2_Conflict" value = 4
stop "scr600_3_Choose_Fermentor"
stop "scr600_4_FillFermentors"
new value vV_WORT_Source
new value vV_WORT_Volume
new string vS_WORT_Source
new string vSMsg
new string vSMsg1
new string vS_BrewKettle
new string vS_LittleMac
new string vS_Brewzilla
new value vV_Total_WORT_Remaining
show workspace "B1 Brewery"
"tmBottomRight_B1" visibility = hidden
vS_BrewKettle = "Brew Kettle"
vS_LittleMac = "Little Mac"
vS_Brewzilla = "Brewzilla"
if "sw_Status_WORT_BK" state == false
vS_BrewKettle = "Brew Kettle has no WORT"
endif
if "sw_Status_WORT_Done_BK" state == true
vS_BrewKettle = "Brew Kettle Already Transferred"
endif
if "ssw_Status_WORT_Little_Mac" state == false
vS_LittleMac = "Little Mac has no WORT"
endif
if "sw_Status_WORT_Done_LittleMac" state == true
vS_LittleMac = "LittleMac Already Transferred"
endif
if "sw_Status_WORT_Brewzilla" state == false
vS_Brewzilla = "Brewzilla has no WORT"
endif
if "sw_Status_WORT_Done_Brewzilla" state == true
vS_Brewzilla = "Brewzilla Already Transferred"
endif
print "scrWortSourceStarted.................................."
[ReStart]
"VGC_43_do_CoolingWater_On_B1" state = false
"gblV_Brew_Status" value = 600
[SectionBrew600]
wait "gblV_Brew_Status" value == 600
show workspace "B1 Brewery"
"gblV_Vessel_From" value = 0
"gblS_BrewName_B1" value = "Choose the Wort Source"
//.....................................................
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"insp_Float"  visibility = hidden
//.................................................
"gblS_swAllSwitch_Label_Text" value =  "WORT Source"
vsMsg =  "You need to choose the Vessel you are transferring the WORT from to the Fermentor.  You have:\n1 = "
vSMsg1 = vS_BrewKettle
vsMsg = vsMsg  + vsMsg1
vSMsg1 = "\n2 = "
vsMsg = vsMsg  + vsMsg1
vSMsg1 = vS_LittleMac
vsMsg = vsMsg  + vsMsg1
vSMsg1 = "\n3 = "
vsMsg = vsMsg  + vsMsg1
vSMsg1 = vS_Brewzilla
vsMsg = vsMsg  + vsMsg1
vSMsg1 = "\n7 = Exit" 
vsMsg = vsMsg  + vsMsg1
"gblS_Brewery_Top_2" value = vsMsg
"gblSReportLabel_B1" value = "Choose one of the Above\n1, 2 or 3? 7 to Exit "
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1 
// Visibility
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//..........................................................................................
[Loop_Wort_Source]
if "gblVReport_B1" value > 3
if "gblVReport_B1" value != 7
"gblS_swAllSwitch_Label_Text" value =  "1 to 3 ONLY"
"gblS_swAllSwitch_Label_Text" background = 1
"gblVReport_B1" value = -99
sleep 4001
"gblS_swAllSwitch_Label_Text" value =  "WORT Source"
"gblS_swAllSwitch_Label_Text" background = 2
endif
endif
if "gblVReport_B1" value == 1
"gblV_Vessel_From" value =  4
goto "Exit_Loop_Wort_Source"
endif
if "gblVReport_B1" value == 2
"gblV_Vessel_From" value =  5
goto "Exit_Loop_Wort_Source"
endif
if "gblVReport_B1" value == 3
"gblV_Vessel_From" value =  7
goto "Exit_Loop_Wort_Source"
endif
if "gblVReport_B1" value == 7
"gblV_Vessel_From" value =  0
stop "scr600_3_Choose_Fermentor"
goto "Exit_End"
endif
goto "Loop_Wort_Source"
[Exit_Loop_Wort_Source]
"gblV_Brew_Status" value = 604
[SectionBrew601]
[SectionBrew602]
[SectionBrew603]
[SectionBrew604]
wait "gblV_Brew_Status" value == 604
"gblVReport_B1" value = 0
vV_WORT_Source = "gblV_Vessel_From" value
print "@102 Wort Source = "
print vV_WORT_Source
if vV_WORT_Source == 4
print "@ 1144  Source = 4"
vV_WORT_Volume = "gblVCurrentBrewKettle_Volume" value
vS_WORT_Source = "The Brew Kettle WORT Volume should be "
vSMsg1 = vV_WORT_Volume
vS_WORT_Source = vS_WORT_Source + vSMsg1 
vSMsg1 = " gallons. Enter the Volume of the "
vS_WORT_Source = vS_WORT_Source + vSMsg1
vSMsg1 = "Brew Kettle.  Enter ZERO if none."
vS_WORT_Source = vS_WORT_Source + vSMsg1
vSMsg = "Confirm Brew Kettle WORT = "
vSMsg1 = vV_WORT_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallon(s)"
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1" value = vSMsg 
goto "MeasureWORT_Vessel"
endif
if vV_WORT_Source == 5
print "@ 117  Source = 5"
vV_WORT_Volume = "gblVCurrentLittle_Volume" value
vS_WORT_Source = "Little Mac"
vS_WORT_Source = "The Little MAC WORT Volume should be "
vSMsg1 = vV_WORT_Volume
vS_WORT_Source = vS_WORT_Source + vSMsg1 
vSMsg1 = " gallons. Enter the Volume of the "
vS_WORT_Source = vS_WORT_Source + vSMsg1
vSMsg1 = "Little Mac. Enter ZERO if none."
vS_WORT_Source = vS_WORT_Source + vSMsg1
"gblS_BrewName_B1" value = "Confirm Little Mac Volume"
goto "MeasureWORT_Vessel"
endif
if vV_WORT_Source == 7
print "@ 130 Source = 7"
vV_WORT_Volume = "gblVCurrentBrewzilla_Volume" value
vS_WORT_Source = "Brewzilla"
vS_WORT_Source = "The Brewzilla WORT Volume may be "
vSMsg1 = vV_WORT_Volume
vS_WORT_Source = vS_WORT_Source + vSMsg1 
vSMsg1 = " gallons. Enter the Volume of the "
vS_WORT_Source = vS_WORT_Source + vSMsg1
vSMsg1 = "Brewzilla as it might be a third or second Batch and has not been tracked.  Enter ZERO if none."
vS_WORT_Source = vS_WORT_Source + vSMsg1
"gblS_BrewName_B1" value = "Enter Brewzilla Volume"
goto "MeasureWORT_Vessel"
endif
[MeasureWORT_Vessel]
"gblV_Brew_Status" value = 608
[SectionBrew605]
[SectionBrew606]
[SectionBrew607]
[SectionBrew608]
wait "gblV_Brew_Status" value == 608
print "@ 192 MeasureWORT_Vessel "
"sw_Advance_Overide" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 2
"gblS_swAllSwitch_Label_Text" value = "Measure the WORT"
//............................................................
"gblSReportLabel_B1" value = "Confirm Volume"
"gblVReport_B1" precision = 1
"gblVReport_B1" value = -99
"gblS_Brewery_Top_2" value = vS_WORT_Source
//................................................................................
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//Background
"gblS_swAllSwitch_Label_Text" background = 2
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblS_Brewery_Top_2" background = 1
//Visibilty
"gblVReport_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblSReportLabel_B1" visibility = visible
wait "gblVReport_B1" value > -99
if vV_WORT_Source == 4
"gblVCurrentBrewKettle_Volume" value = "gblVReport_B1" value
vV_WORT_Volume = "gblVReport_B1" value
print "@ 223 Brew Kettle WORT = "
print vV_WORT_Volume
	if vV_WORT_Volume == 0
	vSMsg = "The Brew Kettle has no WORT.  Choose a different Vessel or Exit"
	goto "StartRedo"
	endif
print 229
goto "SkipRedo"
endif
if vV_WORT_Source == 5
"gblVCurrentLittle_Volume" value = "gblVReport_B1" value
vV_WORT_Volume = "gblVReport_B1" value
if vV_WORT_Volume == 0
vSMsg = "The Little Mac has no WORT. Choose a different Vessel or Exit"
goto "StartRedo"
endif
goto "SkipRedo"
endif
if vV_WORT_Source == 7
"gblVCurrentBrewzilla_Volume" value = "gblVReport_B1" value
vV_WORT_Volume = "gblVReport_B1" value
if vV_WORT_Volume == 0
vSMsg = "The Brew Zilla has no WORT.  Choose a different Vessel or Exit"
goto "StartRedo"
endif
goto "SkipRedo"
endif
if vV_WORT_Volume > 0 
goto "SkipRedo"
endif
[StartRedo]
"gblV_Brew_Status" value = 612
[SectionBrew609]
[SectionBrew610]
[SectionBrew611]
[SectionBrew612]
wait "gblV_Brew_Status" value == 612
"gblS_Brewery_Top_2" value = vSMsg
//................................................................................
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//Background
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_Brewery_Top_2" background = 3
//Visibilty
"gblVReport_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = Visible 
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblSReportLabel_B1" visibility = visible
//............................................................
//Short Delay  5 seconds displayed 
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = 00:00:05
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"insp_1_LeftMiddle_B1" visibility = hidden
//............................................................
goto "ReStart"
[SkipRedo]
print 
"gblV_Brew_Status" value = 616
[SectionBrew613]
[SectionBrew614]
[SectionBrew615]
[SectionBrew616]
wait "gblV_Brew_Status" value == 616
print 307
start "scr600_3_Choose_Fermentor"
print 309
clear
"gblV_Brew_Status" value = 617
stop "scr600_2_Choose_WORT_Source"
[Exit_End]
clear
start "scr600_3_Choose_Fermentor"
"gblS_Script_Ended" value = "Ended: scr600_2_Choose_WORT_Source"
stop "scr600_2_Choose_WORT_Source"
```

## 41. scr600_3_Choose_Fermentor

Starts by itself: No · User can start or stop it: No · 805 lines

```text
// scr600_3_Choose_Fermentor
//04/26/2026 20:15
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// MODIFIED 06/11/2026 08:54
//..................................
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: scr600_3_Choose_Fermentor"
 //................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
goto "Start_Choice"
[Set_Ready]
// No Fermentors Ready
"gblS_Brewery_Top_1" value = "In order for a Fermentor to accept WORT, it MUST be ready.  You have no Fermentors that are in a Ready Status.  You need to prepare and get at least one Fermentor to Ready Status.  The Fermentor Status Process will open after a Short delay."
"gblS_Brewery_Top_1" visibility = visible
 "gblS_Brewery_Top_2" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//............................................................
//............................................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
print 54
"gblS_Brewery_Top_1" visibility = hidden
start "sub_2_scrFermentor_Set_Status"
sleep 100
wait "sw_Running_FermentorStatus" state == false
clear
sleep 100
start "scr600_2_Choose_WORT_Source"
[Start_Choice]
//..................................
show workspace "B1 Brewery"
//............................................................................
new value vV_Count_Not_Ready
new value vVBrewStatus
new string vSMsg
new string vSMsg1
new string vS_TTL_Time
new value vVRate_Orginal
new value vVRate_Calc
new bool vB_Rate_Good
new value vVRate_Delta
new value vV_Elasped_Seconds
new value vV_Measured_Volume
new value vVCheck 
new value vVCheck_High
new value vVCheck_Low
new string vSCheck
new value vV_Fementor_Filling
new value vV_Fementor_Volume
new value vV_Total_WORT_Remaining
//........................................................................
vB_Rate_Good = false
new value vV_Vessel_WORT_From
new string vS_Vessel_WORT_From
new value vV_Vessel_WORT_From_Volume_Start
new value vV_Vessel_WORT_From_Volume_End
new value vV_Vessel_WORT_From_Volume_Delta
new value vV_Desired_WORT_Transfer_Volume
new value vV_Desired_Extra_Volume
new value vV_Fermentor_Max_Volume
new value vV_Adjusted_Volume
new value vV_Gal_XFER
new value vV_Fermentor_Max_Volume_WORT
new string vS_Msg_Already_Filled
vS_Msg_Already_Filled = "Vessels Chosen: None"
new value vV_Count_Filled
new string vS_Ferment_1
new string vS_Ferment_2
new string vS_Ferment_3
new string vS_Ferment_4
new string vS_Ferment_5
new string vS_Ferment_6
new string vS_Ferment_Filled
new value vV_Source_Cooling
new value vV_Ferment_1_Max_Volume
new value vV_Ferment_2_Max_Volume
new value vV_Ferment_3_Max_Volume
new value vV_Ferment_4_Max_Volume
new value vV_Ferment_5_Max_Volume
new value vV_Ferment_6_Max_Volume
vV_Source_Cooling = "RP_v_CoolingSource" value 
vS_Ferment_1 = "gblS_Fermentor_Name_1" value
vS_Ferment_2 = "gblS_Fermentor_Name_2" value
vS_Ferment_3 = "gblS_Fermentor_Name_3" value
vS_Ferment_4 = "gblS_Fermentor_Name_4" value
vS_Ferment_5 = "gblS_Fermentor_Name_5" value
vS_Ferment_6 = "gblS_Fermentor_Name_6" value
vV_Count_Not_Ready = 0
if "gblV_FermentStatus_1" value != 5 
vS_Ferment_1 = "Fermentor #1 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
if "gblV_FermentStatus_2" value != 5 
vS_Ferment_2 = "Fermentor #2 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
if "gblV_FermentStatus_3" value != 5 
vS_Ferment_3 = "Fermentor #3 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
if "gblV_FermentStatus_4" value != 5 
vS_Ferment_4 = "Fermentor #4 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
if "gblV_FermentStatus_5" value != 5 
vS_Ferment_5 = "Fermentor #5 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
if "gblV_FermentStatus_6" value != 5 
vS_Ferment_6 = "Fermentor #6 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
print 149
print vV_Count_Not_Ready
if vV_Count_Not_Ready == 6
goto "Set_Ready"
endif
vV_Ferment_1_Max_Volume = "gblVFerment_Volume_1" value
vV_Ferment_2_Max_Volume = "gblVFerment_Volume_2" value
vV_Ferment_3_Max_Volume = "gblVFerment_Volume_3" value
vV_Ferment_4_Max_Volume = "gblVFerment_Volume_4" value
vV_Ferment_5_Max_Volume = "gblVFerment_Volume_5" value
vV_Ferment_6_Max_Volume = "gblVFerment_Volume_6" value
if vV_Ferment_1_Max_Volume > 11
vV_Ferment_1_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if vV_Ferment_2_Max_Volume > 11
vV_Ferment_2_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if vV_Ferment_3_Max_Volume > 11
vV_Ferment_3_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if vV_Ferment_4_Max_Volume > 11
vV_Ferment_4_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if vV_Ferment_5_Max_Volume > 11
vV_Ferment_5_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if vV_Ferment_6_Max_Volume > 11
vV_Ferment_6_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if "gblV_Fermentor" value == 1
if "RP_v_1_Fermentor_Volume" value  >= vV_Ferment_1_Max_Volume 
vSMsg = vS_Ferment_1
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_1 = vSMsg
endif
endif
if "gblV_Fermentor" value == 2
if "RP_v_2_Fermentor_Volume" value  >= vV_Ferment_2_Max_Volume 
vSMsg = vS_Ferment_2
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_2 = vSMsg
endif
endif
if "gblV_Fermentor" value == 3
if "RP_v_3_Fermentor_Volume" value  >= vV_Ferment_3_Max_Volume 
vSMsg = vS_Ferment_3
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_3 = vSMsg
endif
endif
if "gblV_Fermentor" value == 4
if "RP_v_4_Fermentor_Volume" value  >= vV_Ferment_4_Max_Volume 
vSMsg = vS_Ferment_4
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_4 = vSMsg
endif
endif
if "gblV_Fermentor" value == 5
if "RP_v_5_Fermentor_Volume" value  >= vV_Ferment_5_Max_Volume 
vSMsg = vS_Ferment_5
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_5 = vSMsg
endif
endif
if "gblV_Fermentor" value == 6
if "RP_v_6_Fermentor_Volume" value  >= vV_Ferment_6_Max_Volume 
vSMsg = vS_Ferment_6
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_6 = vSMsg
endif
endif
delete vV_Ferment_1_Max_Volume
delete vV_Ferment_2_Max_Volume
delete vV_Ferment_3_Max_Volume
delete vV_Ferment_4_Max_Volume
delete vV_Ferment_5_Max_Volume
delete vV_Ferment_6_Max_Volume
new value vV_Fermentor_Current_Volume
new value vV_Fermentor_Remaining_Volume
goto "SectionBrew617"
[Restart]
print "@ 64 Restarted"
[SectionBrew617]
wait "gblV_Brew_Status" value == 617
show workspace "B1 Brewery"
vV_Vessel_WORT_From = "gblV_Vessel_From" value
if vV_Vessel_WORT_From == 4
vS_Vessel_WORT_From = "Brew Kettle"
endif
if vV_Vessel_WORT_From == 5
vS_Vessel_WORT_From = "Little Mac"
endif
if vV_Vessel_WORT_From == 7
vS_Vessel_WORT_From = "Brewzilla"
endif
print "@ 180 vV_Vessel_WORT_From = "
print vV_Vessel_WORT_From
[Skip_Restart]
[SectionBrew618]
[SectionBrew619]
"gblV_Brew_Status" value = 620
[SectionBrew620]
wait "gblV_Brew_Status" value == 620
//..................................
 vSMsg = "1: " 
 vSMsg1 = vS_Ferment_1
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "2: " 
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = vS_Ferment_2
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "3: " 
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = vS_Ferment_3
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "4: " 
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = vS_Ferment_4
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "5: " 
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = vS_Ferment_5
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "6: "
 vSMsg = vSMsg + vSMsg1 
 vSMsg1 = vS_Ferment_6
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
"gblSReportLabel_B1" value = "7: Finished Filling Fermentors\nEXIT!"
"gblS_BrewName_B1" value = "Choose One of the Above to fill\n OR EXIT!"
//.....................................................
[SectionBrew621]
[SectionBrew622]
[SectionBrew623]
"gblV_Brew_Status" value = 624
[SectionBrew64]
wait "gblV_Brew_Status" value == 624
print 240
//Hide all on Left
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"insp_Float"  visibility = hidden
//.................................................
"gblV_Brew_Status" value = 625
[SectionBrew625]
print 257
wait "gblV_Brew_Status" value == 625
"gblS_Brewery_Top_2" value = vSMsg
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//background
//Inspector Black
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 1
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 2
"gblSReportLabel_B1" background = 2
"gblVReport_B1" background = 1
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_BrewName_B1" visibility = Visible 
//..........................................................................................
wait "gblVReport_B1" value  > 0
vV_Fementor_Filling = "gblVReport_B1" value
"gblV_Fermentor" value = vV_Fementor_Filling
if vV_Fementor_Filling == 1
print "@ 285 fILLING # 1"
vS_Ferment_Filled = vS_Ferment_1
"gblS_Vessel_To" value = vS_Ferment_1
"gblS_Vessel_Adjust" value = vS_Ferment_1
"glbV_Vessel_Adjust" value = 6
vV_Fermentor_Max_Volume = "gblVFerment_Volume_1" value
vV_Fermentor_Current_Volume = "RP_v_1_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 2
vS_Ferment_Filled = vS_Ferment_2
"gblS_Vessel_To" value = vS_Ferment_2
"gblS_Vessel_Adjust" value = vS_Ferment_2
"glbV_Vessel_Adjust" value = 6

vV_Fermentor_Max_Volume = "gblVFerment_Volume_2" value
vV_Fermentor_Current_Volume = "RP_v_2_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 3
vS_Ferment_Filled = vS_Ferment_3
"gblS_Vessel_To" value = vS_Ferment_3
"gblS_Vessel_Adjust" value = vS_Ferment_3
"glbV_Vessel_Adjust" value = 6
vV_Fermentor_Max_Volume = "gblVFerment_Volume_3" value
vV_Fermentor_Current_Volume = "RP_v_3_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 4
vS_Ferment_Filled = vS_Ferment_4
"gblS_Vessel_To" value = vS_Ferment_4
"gblS_Vessel_Adjust" value = vS_Ferment_4
"glbV_Vessel_Adjust" value = 6
vV_Fermentor_Max_Volume = "gblVFerment_Volume_4" value
vV_Fermentor_Current_Volume = "RP_v_4_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 5
vS_Ferment_Filled = vS_Ferment_5
"gblS_Vessel_To" value = vS_Ferment_5
"gblS_Vessel_Adjust" value = vS_Ferment_5
"glbV_Vessel_Adjust" value = 6
vV_Fermentor_Max_Volume = "gblVFerment_Volume_5" value
vV_Fermentor_Current_Volume = "RP_v_5_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 6
vS_Ferment_Filled = vS_Ferment_6
"gblS_Vessel_To" value = vS_Ferment_6
"gblS_Vessel_Adjust" value = vS_Ferment_6
"glbV_Vessel_Adjust" value = 6
vV_Fermentor_Max_Volume = "gblVFerment_Volume_6" value
vV_Fermentor_Current_Volume = "RP_v_6_Fermentor_Volume" value
endif
//Adjust Max Volume for larger Fermentors
print 310
if vV_Fermentor_Max_Volume > 11
vV_Fermentor_Max_Volume_WORT = vV_Fermentor_Max_Volume - 2
else
vV_Fermentor_Max_Volume_WORT = vV_Fermentor_Max_Volume 
endif
vV_Fermentor_Remaining_Volume = vV_Fermentor_Max_Volume_WORT - vV_Fermentor_Current_Volume
print "@386 vS_Ferment_Filled = "
print vS_Ferment_Filled
[Fermentor_Chosen]
[SectionBrew626]
[SectionBrew627]
"gblV_Brew_Status" value = 628
[SectionBrew628]
wait "gblV_Brew_Status" value == 628
[GetStartVolumeWort]
if vV_Vessel_WORT_From == 4
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentBrewKettle_Volume" value
print "@ 326  BK STart WORT ="
print vV_Vessel_WORT_From_Volume_Start 
if vV_Vessel_WORT_From_Volume_Start == 0
"sw_Use_WORT_BK" state = true
endif
endif
if vV_Vessel_WORT_From == 5
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentLittle_Volume" value
print "@ 334 LM STart WORT ="
print vV_Vessel_WORT_From_Volume_Start 
if vV_Vessel_WORT_From_Volume_Start == 0
endif
endif
if vV_Vessel_WORT_From == 7
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentBrewzilla_Volume" value
print "@ 342 BrewZilla STart WORT ="
print vV_Vessel_WORT_From_Volume_Start 
if vV_Vessel_WORT_From_Volume_Start == 0
"sw_Use_WORT_Brewzilla" state = true
endif
endif
print "@ 342 Choosen WORT Source = "
print vS_Vessel_WORT_From
print "Start Volume = "
print vV_Vessel_WORT_From_Volume_Start
[End_Choose_Fermentor]
[SectionBrew629]
[SectionBrew630]
"gblV_Brew_Status" value = 630
[SectionBrew630]
wait "gblV_Brew_Status" value == 630
print "@ 358 STart WORT ="
print vV_Vessel_WORT_From_Volume_Start 
if vV_Vessel_WORT_From_Volume_Start > 0
goto "DesiredTransferVolume"
endif
if vV_Vessel_WORT_From_Volume_Start == 0
print "WORT is Zero"
vSMsg = "The "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is empty.  You need to choose another Wort Source or Exit.  Will Auto Advance".
vSMsg = vSMsg + vSMsg1
// B1 Brewery Left Hide ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3"  value = vSMsg
// B1 Brewery Left background......................
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
// Visibility ......................
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
//.................................................
//............................................................
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
//"gblV_Set_BackGround_Middle_Time" value = 1
//"gblS_swAllSwitch_Label_Text" value = "Something"
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
start "scr600_2_Choose_WORT_Source"
endif
[DesiredTransferVolume]
print "@ 419 DesiredTransferVolume Section"
[SectionBrew631]
if vV_Fermentor_Remaining_Volume >=  4
goto "Exit_Loop_StartOver_Low_Volume"
endif
if vV_Fermentor_Remaining_Volume < 4
"sw_Advance_Overide" visibility = hidden
vSMsg = "The remaining volume of the "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = "  is only "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Fermentor_Remaining_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  Do you still want to transfer to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = "?"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_BrewName_B1" value = "Select 1 = Confirm\n2 = Start Over."
"gblS_swAllSwitch_Label_Text" value = "Make your choice!"
"gblS_Brewery_Top_2" value = vsMsg
"gblSReportLabel_B1" value = "Choose one of the Above\n1 or 2 only!"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1 
// Visibility
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
endif
//..........................................................................................
[Loop_StartOver_Low_Volume]
sleep 100
if "gblVReport_B1" value > 2
"gblVReport_B1" value =  0
"gblS_swAllSwitch_Label_Text" value =  "1 or 2 Only!"
"gblS_swAllSwitch_Label_Text" background = 1
sleep 4001
"gblS_swAllSwitch_Label_Text" background = 2
endif
if "gblVReport_B1" value == 1
goto "Exit_Loop_StartOver_Low_Volume"
endif
if "gblVReport_B1" value == 2
//"sw_Running_Fermentor" state = false
start "scr600_2_Choose_WORT_Source"
clear
stop "scr600_3_Choose_Fermentor"
endif
[Exit_Loop_StartOver_Low_Volume]
"gblV_Brew_Status" value = 632
[SectionBrew632]
wait "gblV_Brew_Status" value == 632
print "@ 410 Set Volume to Transfer"
"sw_Advance_Overide" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 2
"gblS_swAllSwitch_Label_Text" value = "WORT to Transfer"
//............................................................
"gblSReportLabel_B1" value = "Volume to Transfer?"
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
print "@ 513 remaining Fermentor Volume = "
print vV_Fermentor_Remaining_Volume
print "Fermentor_Max_Volume = "
print vV_Fermentor_Max_Volume
print "vV_Fermentor_Max_Volume_WORT = "
print vV_Fermentor_Max_Volume_WORT
[REDO_Wort]
vSMsg = "The Volume of the Wort in the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Vessel_WORT_From_Volume_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. The remaining capacity of the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Fermentor_Remaining_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  How much WORT do you want to transfer from the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = "? "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//................................................................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_swAllSwitch_Label_Text" background = 2
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblS_Brewery_Top_2" background = 1
//Visibilty
"gblVReport_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblSReportLabel_B1" visibility = visible
print "@ 561 Waiting for Volume"
wait "gblVReport_B1" value > 0
vV_Desired_WORT_Transfer_Volume = "gblVReport_B1" value
print "@ 565 Desired Volume = "
print vV_Desired_WORT_Transfer_Volume
if vV_Desired_WORT_Transfer_Volume <= vV_Vessel_WORT_From_Volume_Start
"gblV_Brew_Status" value = 633
goto "SectionBrew633"
endif
if vV_Desired_WORT_Transfer_Volume > vV_Vessel_WORT_From_Volume_Start
"gblS_Brewery_Top_1" background = 2
vSMsg = "The Volume of the Wort in the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Vessel_WORT_From_Volume_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  The maximum you can transfer is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Vessel_WORT_From_Volume_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  Chhose that amount or less! "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" visibility = visible
//............................................................
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
//"gblV_Set_BackGround_Middle_Time" value = 1
//"gblS_swAllSwitch_Label_Text" value = "Something"
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblVReport_B1" value = 0
"gblS_Brewery_Top_1" visibility = hidden
//Inspector Black
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 1
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 1
vSMsg = "The Maximum Available WORT = "
vSMsg1 = vV_Vessel_WORT_From_Volume_Start
vSMsg = vSMsg + vSMsg1
"gblS_swAllSwitch_Label_Text" value = vSMsg
"gblS_swAllSwitch_Label_Text" visibility = visible
goto "REDO_Wort"
endif 
//.....................................................
[SectionBrew633]
wait "gblV_Brew_Status" value == 633
print "@ 581 vV_Fermentor_Remaining_Volume ="
print vV_Fermentor_Remaining_Volume
print " vV_Fermentor_Max_Volume = "
print vV_Fermentor_Max_Volume
print "vV_Vessel_WORT_From_Volume_Start ="
print vV_Vessel_WORT_From_Volume_Start
print " vV_Desired_WORT_Transfer_Volume ="
print vV_Desired_WORT_Transfer_Volume
// Correct Transfer for Capacity left in Fermentor
if vV_Desired_WORT_Transfer_Volume > vV_Fermentor_Remaining_Volume
vV_Desired_WORT_Transfer_Volume = vV_Fermentor_Remaining_Volume
"gblV_Gals_to_Fill" value = vV_Desired_WORT_Transfer_Volume
goto "Start_Adjust_By_Volume_Fermentor"
endif 
goto "Skip_Start_Adjust_By_Volume_Fermentor"
[Start_Adjust_By_Volume_Fermentor]
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
vSMsg = " The Desired WORT Tranfer Volume exceeded the remaining capacity of the  "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is only "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Fermentor_Remaining_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. The amount to transfer has been adjusted to "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Desired_WORT_Transfer_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons  You will be given a chance to Start Over."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//background
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//............................................................
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
//"gblV_Set_BackGround_Middle_Time" value = 1
//"gblS_swAllSwitch_Label_Text" value = "Something"
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
vV_Gal_XFER = "gblV_Gals_to_Fill" value 
vSMsg = "The transfer volume was adjusted to the remaning WORT capacity of the "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". Ready to transfer "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons from the WORT Source "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Fermentor."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_BrewName_B1" value = "Select 1 = Confirm\n2 = Start Over."
"gblS_swAllSwitch_Label_Text" value = "Make your choice!"
"gblS_Brewery_Top_2" value = vsMsg
"gblSReportLabel_B1" value = "Choose one of the Above\n1 or 2 only!"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1 
// Visibility
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//..........................................................................................
[Loop_StartOver]
if "gblVReport_B1" value > 2
"gblVReport_B1" value =  0
"gblS_swAllSwitch_Label_Text" value =  "1 or 2 Only!"
"gblS_swAllSwitch_Label_Text" background = 1
sleep 4001
"gblS_swAllSwitch_Label_Text" background = 2
endif
if "gblVReport_B1" value == 1
goto "Exit_Loop_StartOver"
endif
if "gblVReport_B1" value == 2
//"sw_Running_Fermentor" state = false
start "scr600_2_Choose_WORT_Source"
clear
stop "scr600_3_Choose_Fermentor"
goto "Exit_Loop_Wort_Source"
endif
goto "Loop_StartOver"
[Exit_Loop_StartOver]
//............................................................
[Skip_Start_Adjust_By_Volume_Fermentor]
print "end of scr600_3_Choose_Fermentor"
[Ender_scr600_3_Choose_Fermentor]
clear
"gblS_Script_Ended" value = "Ended: scr600_3_Choose_Fermentor"
start "scr600_4_FillFermentors"
stop "scr600_3_Choose_Fermentor"
```

## 42. scr600_4_FillFermentors

Starts by itself: No · User can start or stop it: Yes · 2225 lines

```text
// scr600_4_FillFermentors
//04/26/2026 20:15
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// MODIFIED 04/26/2026 20:15
//..................................
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started:  scr600_4_FillFermentors"
 //................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
goto "Start_Choice"
[Set_Ready]
print "@ 8 Set Ready"
// No Fermentors Ready
"sw_Running_FermentorStatus" state = true
"gblS_Brewery_Top_1" value = "In order for a Fermentor to accept WORT, it MUST be ready.  You have no Fermentors that are in a Ready Status.  You need to prepare and get at least one Fermentor to Ready Status.  The Fermentor Status Process will open after a Short delay."
"gblS_Brewery_Top_1" visibility = visible
 "gblS_Brewery_Top_2" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//............................................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
start "sub_scrFermentor_Set_Status"
if vB_Testing == true
"gblS_Inter_Script" value = "@ 50 sub_scrFermentor_Set_Status"
sleep 4001
endif
sleep 100
wait "sw_Running_FermentorStatus" state == false
clear
sleep 100
start "scr600_2_Choose_WORT_Source"
[Start_Choice]
//..................................
show workspace "B1 Brewery"
//............................................................................
//............................................................................
new value vV_Count_Not_Ready
new value vVBrewStatus
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vS_TTL_Time
new value vVRate_Orginal
new value vVRate_Calc
new bool vB_Rate_Good
new value vVRate_Delta
new value vV_Elasped_Seconds
new value vV_Measured_Volume
new value vVCheck 
new value vVCheck_High
new value vVCheck_Low
new string vSCheck
new value vV_Fementor_Filling
new value vV_Fementor_Volume
//........................................................................
vB_Rate_Good = false
new value vV_Vessel_WORT_From
new string vS_Vessel_WORT_From
new value vV_Vessel_WORT_From_Volume_Start
new value vV_Vessel_WORT_From_Volume_End
new value vV_Vessel_WORT_From_Volume_Delta
new value vV_Desired_WORT_Transfer_Volume
new value vV_Desired_Extra_Volume
new value vV_Fermentor_Max_Volume
new value vV_Adjusted_Volume
new value vV_Gal_XFER
new value vV_Fermentor_Max_Volume_WORT
new string vS_Msg_Already_Filled
vS_Msg_Already_Filled = "Vessels Chosen: None"
new value vV_Count_Filled
new string vS_Ferment_1
new string vS_Ferment_2
new string vS_Ferment_3
new string vS_Ferment_4
new string vS_Ferment_5
new string vS_Ferment_6
new string vS_Ferment_Filled
new value vV_Source_Cooling
vV_Source_Cooling = "RP_v_CoolingSource" value 
vS_Ferment_1 = "gblS_Fermentor_Name_1" value
vS_Ferment_2 = "gblS_Fermentor_Name_2" value
vS_Ferment_3 = "gblS_Fermentor_Name_3" value
vS_Ferment_4 = "gblS_Fermentor_Name_4" value
vS_Ferment_5 = "gblS_Fermentor_Name_5" value
vS_Ferment_6 = "gblS_Fermentor_Name_6" value
vV_Count_Not_Ready = 0
if "gblV_FermentStatus_1" value != 5 
vS_Ferment_1 = "Fermentor #1 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
if "gblV_FermentStatus_2" value != 5 
vS_Ferment_2 = "Fermentor #2 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
if "gblV_FermentStatus_3" value != 5 
vS_Ferment_3 = "Fermentor #3 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
if "gblV_FermentStatus_4" value != 5 
vS_Ferment_4 = "Fermentor #4 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
if "gblV_FermentStatus_5" value != 5 
vS_Ferment_5 = "Fermentor #5 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
if "gblV_FermentStatus_6" value != 5 
vS_Ferment_6 = "Fermentor #6 is Not Ready"
vV_Count_Not_Ready = vV_Count_Not_Ready + 1
endif
print 149
print vV_Count_Not_Ready
if vV_Count_Not_Ready == 6
goto "Set_Ready"
endif
print 153
new value vV_Ferment_1_Max_Volume
new value vV_Ferment_2_Max_Volume
new value vV_Ferment_3_Max_Volume
new value vV_Ferment_4_Max_Volume
new value vV_Ferment_5_Max_Volume
new value vV_Ferment_6_Max_Volume
vV_Ferment_1_Max_Volume = "gblVFerment_Volume_1" value
vV_Ferment_2_Max_Volume = "gblVFerment_Volume_2" value
vV_Ferment_3_Max_Volume = "gblVFerment_Volume_3" value
vV_Ferment_4_Max_Volume = "gblVFerment_Volume_4" value
vV_Ferment_5_Max_Volume = "gblVFerment_Volume_5" value
vV_Ferment_6_Max_Volume = "gblVFerment_Volume_6" value
if vV_Ferment_1_Max_Volume > 11
vV_Ferment_1_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if vV_Ferment_2_Max_Volume > 11
vV_Ferment_2_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if vV_Ferment_3_Max_Volume > 11
vV_Ferment_3_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if vV_Ferment_4_Max_Volume > 11
vV_Ferment_4_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if vV_Ferment_5_Max_Volume > 11
vV_Ferment_5_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if vV_Ferment_6_Max_Volume > 11
vV_Ferment_6_Max_Volume = vV_Ferment_1_Max_Volume - 2
endif
if "gblV_Fermentor" value == 1
if "RP_v_1_Fermentor_Volume" value  >= vV_Ferment_1_Max_Volume 
vSMsg = vS_Ferment_1
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_1 = vSMsg
endif
endif
if "gblV_Fermentor" value == 2
if "RP_v_2_Fermentor_Volume" value  >= vV_Ferment_2_Max_Volume 
vSMsg = vS_Ferment_2
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_2 = vSMsg
endif
endif
if "gblV_Fermentor" value == 3
if "RP_v_3_Fermentor_Volume" value  >= vV_Ferment_3_Max_Volume 
vSMsg = vS_Ferment_3
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_3 = vSMsg
endif
endif
if "gblV_Fermentor" value == 4
if "RP_v_4_Fermentor_Volume" value  >= vV_Ferment_4_Max_Volume 
vSMsg = vS_Ferment_4
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_4 = vSMsg
endif
endif
if "gblV_Fermentor" value == 5
if "RP_v_5_Fermentor_Volume" value  >= vV_Ferment_5_Max_Volume 
vSMsg = vS_Ferment_5
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_5 = vSMsg
endif
endif
if "gblV_Fermentor" value == 6
if "RP_v_6_Fermentor_Volume" value  >= vV_Ferment_6_Max_Volume 
vSMsg = vS_Ferment_6
vSMsg1 = " is FILLED!"
vSMsg = vSMsg + vSMsg1
vS_Ferment_6 = vSMsg
endif
endif
delete vV_Ferment_1_Max_Volume
delete vV_Ferment_2_Max_Volume
delete vV_Ferment_3_Max_Volume
delete vV_Ferment_4_Max_Volume
delete vV_Ferment_5_Max_Volume
delete vV_Ferment_6_Max_Volume
new value vV_Fermentor_Current_Volume
new value vV_Fermentor_Remaining_Volume
// Where to start
"gblV_Brew_Status" value = 617
goto "SectionBrew617"
[Restart]
print "@ 243 Restarted"
[SectionBrew617]
wait "gblV_Brew_Status" value == 617
show workspace "B1 Brewery"
vV_Vessel_WORT_From = "gblV_Vessel_From" value
if vV_Vessel_WORT_From == 4
vS_Vessel_WORT_From = "Brew Kettle"
endif
if vV_Vessel_WORT_From == 5
vS_Vessel_WORT_From = "Little Mac"
endif
if vV_Vessel_WORT_From == 7
vS_Vessel_WORT_From = "Brewzilla"
endif
print "@ 83 vV_Vessel_WORT_From = "
print vV_Vessel_WORT_From
[Skip_Restart]
[SectionBrew618]
[SectionBrew619]
"gblV_Brew_Status" value = 620
[SectionBrew620]
wait "gblV_Brew_Status" value == 620
print 268
 vSMsg = "1: " 
 vSMsg1 = vS_Ferment_1
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "2: " 
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = vS_Ferment_2
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "3: " 
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = vS_Ferment_3
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "4: " 
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = vS_Ferment_4
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "5: " 
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = vS_Ferment_5
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "6: "
 vSMsg = vSMsg + vSMsg1 
 vSMsg1 = vS_Ferment_6
 vSMsg = vSMsg + vSMsg1
 vSMsg1 = "\n"
 vSMsg = vSMsg + vSMsg1
"gblSReportLabel_B1" value = "7: Finished Filling Fermentors\nEXIT!"
"gblS_BrewName_B1" value = "Choose One of the Above to fill\n OR EXIT!"
//.....................................................
[SectionBrew621]
[SectionBrew622]
[SectionBrew623]
"gblV_Brew_Status" value = 624
[SectionBrew64]
wait "gblV_Brew_Status" value == 624
print 240
//Hide all on Left
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"insp_Float"  visibility = hidden
//.................................................
"gblV_Brew_Status" value = 625
[SectionBrew625]
print 257
wait "gblV_Brew_Status" value == 625
"gblS_Brewery_Top_2" value = vSMsg
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//background
//Inspector Black
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 1
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 2
"gblSReportLabel_B1" background = 2
"gblVReport_B1" background = 1
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_BrewName_B1" visibility = Visible 
//..........................................................................................
wait "gblVReport_B1" value  > 0
print 282
vV_Fementor_Filling = "gblVReport_B1" value
"gblV_Fermentor" value = vV_Fementor_Filling
if vV_Fementor_Filling == 1
print "@ 285 fILLING # 1"
vS_Ferment_Filled = vS_Ferment_1
vV_Fermentor_Max_Volume = "gblVFerment_Volume_1" value
vV_Fermentor_Current_Volume = "RP_v_1_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 2
vS_Ferment_Filled = vS_Ferment_2
vV_Fermentor_Max_Volume = "gblVFerment_Volume_2" value
vV_Fermentor_Current_Volume = "RP_v_2_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 3
vS_Ferment_Filled = vS_Ferment_3
vV_Fermentor_Max_Volume = "gblVFerment_Volume_3" value
vV_Fermentor_Current_Volume = "RP_v_3_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 4
vS_Ferment_Filled = vS_Ferment_4
vV_Fermentor_Max_Volume = "gblVFerment_Volume_4" value
vV_Fermentor_Current_Volume = "RP_v_4_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 5
vS_Ferment_Filled = vS_Ferment_5
vV_Fermentor_Max_Volume = "gblVFerment_Volume_5" value
vV_Fermentor_Current_Volume = "RP_v_5_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 6
vS_Ferment_Filled = vS_Ferment_6
vV_Fermentor_Max_Volume = "gblVFerment_Volume_6" value
vV_Fermentor_Current_Volume = "RP_v_6_Fermentor_Volume" value
endif
//Adjust Max Volume for larger Fermentors
print 310
if vV_Fermentor_Max_Volume > 11
vV_Fermentor_Max_Volume_WORT = vV_Fermentor_Max_Volume - 2
else
vV_Fermentor_Max_Volume_WORT = vV_Fermentor_Max_Volume 
endif
vV_Fermentor_Remaining_Volume = vV_Fermentor_Max_Volume_WORT - vV_Fermentor_Current_Volume
print "@386 vS_Ferment_Filled = "
print vS_Ferment_Filled
[Fermentor_Chosen]
[SectionBrew626]
[SectionBrew627]
"gblV_Brew_Status" value = 628
[SectionBrew628]
wait "gblV_Brew_Status" value == 628
[GetStartVolumeWort]
if vV_Vessel_WORT_From == 4
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentBrewKettle_Volume" value
if vV_Vessel_WORT_From_Volume_Start == 0
"sw_Use_WORT_BK" state = true
endif
endif
if vV_Vessel_WORT_From == 5
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentLittle_Volume" value
if vV_Vessel_WORT_From_Volume_Start == 0
endif
endif
if vV_Vessel_WORT_From == 7
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentBrewzilla_Volume" value
if vV_Vessel_WORT_From_Volume_Start == 0
"sw_Use_WORT_Brewzilla" state = true
endif
endif
print "@ 443 Choosen WORT Source = "
print vS_Vessel_WORT_From
print "Start Volume = "
print vV_Vessel_WORT_From_Volume_Start
[End_Choose_Fermentor]
[SectionBrew629]
[SectionBrew630]
"gblV_Brew_Status" value = 630
[SectionBrew630]
wait "gblV_Brew_Status" value == 630
if vV_Vessel_WORT_From_Volume_Start == 0
vSMsg = "The "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is empty.  You need to choose another Wort Source or Exit.  Will Auto Advance".
vSMsg = vSMsg + vSMsg1
// B1 Brewery Left Hide ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3"  value = vSMsg
// B1 Brewery Left background......................
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
// Visibility ......................
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
//.................................................
//............................................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//.........................................
start "scr600_2_Choose_WORT_Source"
endif
[DesiredTransferVolume]
[SectionBrew631]
if vV_Fermentor_Remaining_Volume < 4
"sw_Advance_Overide" visibility = hidden
vSMsg = "The remaining volume of the "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = "  is only "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Fermentor_Remaining_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  Do you still want to transfer to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = "?"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_BrewName_B1" value = "Select 1 = Confirm\n2 = Start Over."
"gblS_swAllSwitch_Label_Text" value = "Make your choice!"
"gblS_Brewery_Top_2" value = vsMsg
"gblSReportLabel_B1" value = "Choose one of the Above\n1 or 2 only!"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1 
// Visibility
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//..........................................................................................
[Loop_StartOver_Low_Volume]
sleep 100
if "gblVReport_B1" value > 2
"gblVReport_B1" value =  0
"gblS_swAllSwitch_Label_Text" value =  "1 or 2 Only!"
"gblS_swAllSwitch_Label_Text" background = 1
sleep 4001
"gblS_swAllSwitch_Label_Text" background = 2
endif
if "gblVReport_B1" value == 1
goto "Exit_Loop_StartOver_Low_Volume"
endif
if "gblVReport_B1" value == 2
start "scr600_2_Choose_WORT_Source"
clear
stop "scr600_3_Choose_Fermentor"
endif
goto "Loop_StartOver_Low_Volume"
[Exit_Loop_StartOver_Low_Volume]
"gblV_Brew_Status" value = 632
[SectionBrew632]
wait "gblV_Brew_Status" value == 632
print "@ 410 Set Volume to Transfer"
"sw_Advance_Overide" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 2
"gblS_swAllSwitch_Label_Text" value = "WORT to Transfer"
//............................................................
"gblSReportLabel_B1" value = "Volume to Transfer?"
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
print "@ 513 remaining Fermentor Volume = "
print vV_Fermentor_Remaining_Volume
print "Fermentor_Max_Volume = "
print vV_Fermentor_Max_Volume
print "vV_Fermentor_Max_Volume_WORT = "
print vV_Fermentor_Max_Volume_WORT
[REDO_Wort]
vSMsg = "The Volume of the Wort in the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Vessel_WORT_From_Volume_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. The remaining capacity of the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Fermentor_Remaining_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  How much WORT do you want to transfer from the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = "? "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//................................................................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_swAllSwitch_Label_Text" background = 2
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblS_Brewery_Top_2" background = 1
//Visibilty
"gblVReport_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblSReportLabel_B1" visibility = visible
print "@ 561 Waiting for Volume"
wait "gblVReport_B1" value > 0
vV_Desired_WORT_Transfer_Volume = "gblVReport_B1" value
print "@ 565 Desired Volume = "
print vV_Desired_WORT_Transfer_Volume
if vV_Desired_WORT_Transfer_Volume <= vV_Vessel_WORT_From_Volume_Start
"gblV_Brew_Status" value = 633
goto "SectionBrew633"
endif
if vV_Desired_WORT_Transfer_Volume > vV_Vessel_WORT_From_Volume_Start
"gblS_Brewery_Top_1" background = 2
vSMsg = "The Volume of the Wort in the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Vessel_WORT_From_Volume_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  The maximum you can transfer is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Vessel_WORT_From_Volume_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  Chose that amount or less! "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" visibility = visible
//............................................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblVReport_B1" value = 0
"gblS_Brewery_Top_1" visibility = hidden
//Inspector Black
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 1
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 1
vSMsg = "The Maximum Available WORT = "
vSMsg1 = vV_Vessel_WORT_From_Volume_Start
vSMsg = vSMsg + vSMsg1
"gblS_swAllSwitch_Label_Text" value = vSMsg
"gblS_swAllSwitch_Label_Text" visibility = visible
goto "REDO_Wort"
endif 
//.....................................................
[SectionBrew633]
wait "gblV_Brew_Status" value == 633
print "@ 581 vV_Fermentor_Remaining_Volume ="
print vV_Fermentor_Remaining_Volume
print " vV_Fermentor_Max_Volume = "
print vV_Fermentor_Max_Volume
print "vV_Vessel_WORT_From_Volume_Start ="
print vV_Vessel_WORT_From_Volume_Start
print " vV_Desired_WORT_Transfer_Volume ="
print vV_Desired_WORT_Transfer_Volume
// Correct Transfer for Capacity left in Fermentor
if vV_Desired_WORT_Transfer_Volume > vV_Fermentor_Remaining_Volume
vV_Desired_WORT_Transfer_Volume = vV_Fermentor_Remaining_Volume
"gblV_Gals_to_Fill" value = vV_Desired_WORT_Transfer_Volume
goto "Start_Adjust_By_Volume_Fermentor"
endif 
goto "Skip_Start_Adjust_By_Volume_Fermentor"
[Start_Adjust_By_Volume_Fermentor]
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
vSMsg = " The Desired WORT Tranfer Volume exceeded the remaining capacity of the  "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is only "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Fermentor_Remaining_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. The amount to transfer has been adjusted to "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Desired_WORT_Transfer_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons  You will be given a chance to Start Over."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//background
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//............................................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
vV_Gal_XFER = "gblV_Gals_to_Fill" value 
vSMsg = "The transfer volume was adjusted to the remaning WORT capacity of the "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". Ready to transfer "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons from the WORT Source "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Fermentor."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_BrewName_B1" value = "Select 1 = Confirm\n2 = Start Over."
"gblS_swAllSwitch_Label_Text" value = "Make your choice!"
"gblS_Brewery_Top_2" value = vsMsg
"gblSReportLabel_B1" value = "Choose one of the Above\n1 or 2 only!"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1 
// Visibility
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//..........................................................................................
[Loop_StartOver]
if "gblVReport_B1" value > 2
"gblVReport_B1" value =  0
"gblS_swAllSwitch_Label_Text" value =  "1 or 2 Only!"
"gblS_swAllSwitch_Label_Text" background = 1
sleep 4001
"gblS_swAllSwitch_Label_Text" background = 2
endif
if "gblVReport_B1" value == 1
goto "Exit_Loop_StartOver"
endif
if "gblVReport_B1" value == 2
//"sw_Running_Fermentor" state = false
start "scr600_2_Choose_WORT_Source"
clear
stop "scr600_3_Choose_Fermentor"
goto "Exit_Loop_Wort_Source"
endif
goto "Loop_StartOver"
[Exit_Loop_StartOver]

//............................................................
[Skip_Start_Adjust_By_Volume_Fermentor]
"gblV_Brew_Status" value = 634
[SectionBrew634]
wait "gblV_Brew_Status" value == 634
"gblV_Brew_Status" value = 636
[SectionBrew635]
[SectionBrew636]
wait "gblV_Brew_Status" value == 636
print "@ 598 Cooling Water"
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"insp_Float"  visibility = hidden
//.................................................
"gblS_swAllSwitch_Label_Text" value =  "Make Your Choice"
"gblS_Brewery_Top_2" value = "When transferring do you want the cooling water on.\n1 = ON\n2 = OFF"
"gblSReportLabel_B1" value = "1 = Cooling Water ON\n2 = Cooling Water OFF"
"gblS_BrewName_B1" value = "If cooling, set up the Cooling as required. Refresh ICE Bath as needed."
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//..........................................................................................
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 2 
// Visibility
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
goto "WaitGreaterZero"
[1or2Only]
"gblS_Brewery_Bottom_1" background = 1
"gblS_Brewery_Bottom_1" value = "1 or 2 Only:\n1 = Cooling Water On\n2 = Cooling Water Off "
"gblS_Brewery_Bottom_1" visibility = visible
sleep 5000
"gblS_Brewery_Bottom_1" visibility = hidden
"gblVReport_B1" value = 0
"sw_Use_Cooling_Water" state = false
//..............................................................................
[WaitGreaterZero]
wait "gblVReport_B1" value > 0
[Loop_Cooling]
sleep 100
if  "gblVReport_B1" value == 1
//Cooling Water On
"sw_Use_Cooling_Water" state = true
"gblS_BrewName_B1" value = "Set up the Cooling as required. Refresh ICE Bath as needed."
sleep 5000
	if vV_Vessel_WORT_From == 4
// Brew Kettle
	"gblV_Water_Switch_Status_Water" value = 902
	"MB_36_do_RedPump_B1" state = false
	goto "SetCooling"
	endif
	if vV_Vessel_WORT_From == 5
//Little Mac
	"gblV_Water_Switch_Status_Water" value = 904
	"MB_36_do_RedPump_B1" state = false
	"MB_35_do_YellowPump_B1" state = false
	goto "SetCooling"
	endif
	if vV_Vessel_WORT_From == 7
// Brewzilla
	"gblV_Water_Switch_Status_Water" value = 907
	"MB_36_do_RedPump_B1" state = false
	"MB_35_do_YellowPump_B1" state = false
	goto "SetCooling"
	endif
endif
if  "gblVReport_B1" value == 2
"sw_Use_Cooling_Water" state = false
//Cooling Water OFF
	if vV_Vessel_WORT_From == 4
// Brew Kettle
	"MB_36_do_RedPump_B1" state = false
	"gblV_Water_Switch_Status_Water" value = 903
	goto "SetValves"
	endif
	if vV_Vessel_WORT_From == 5
//Little Mac
	"MB_36_do_RedPump_B1" state = false
	"MB_35_do_YellowPump_B1" state = false
	"gblV_Water_Switch_Status_Water" value = 905
	goto "SetValves"
	endif
	if vV_Vessel_WORT_From == 7
//Brewzilla
	"gblV_Water_Switch_Status_Water" value = 908
	"MB_36_do_RedPump_B1" state = false
	"MB_35_do_YellowPump_B1" state = false
	goto "SetValves"
	endif
endif
if  "gblVReport_B1" value > 2
goto "1or2Only"
endif
goto "Loop_Cooling"
[SetCooling]
[SectionBrew637]
"gblV_Brew_Status" value = 638
[SectionBrew638]
wait "gblV_Brew_Status" value == 638
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//................................................. 
if vV_Source_Cooling == 1
vSMsg1 = "only tap water" 
goto "EndCooling"
endif
if vV_Source_Cooling == 2
vSMsg1 = "an ICE batch that will be recycyled to chill tap water.  Check that your ICE bath has enough ICE and replenish if necessary" 
goto "EndCooling"
endif
if vV_Source_Cooling == 3
vSMsg1 = "only an ICE batch that will be recycyled.  Check that your ICE bath has enough ICE and replenish if necessary" 
goto "EndCooling"
endif
if vV_Source_Cooling == 4
vSMsg1 = "Glycol recycyled to chill tap water" 
goto "EndCooling"
endif
if vV_Source_Cooling == 5
vSMsg1 = "Glycol recycyled to chill the ICE batch that will be recycyled.  Check that your ICE bath has enough ICE and replenish if necessary"
goto "EndCooling"
endif
[EndCooling]
vSMsg = "The Cooling Source for the WORT Plate Chiller is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".  Set the Chilling Up as required."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//background
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//............................................................
//............................................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
//............................................................
[SetValves]
if vB_Testing == true
"VGC_43_do_CoolingWater_On_B1" state = false
//goto "TestSkipCoolWater"
endif
if "sw_Use_Cooling_Water" state == false
"VGC_43_do_CoolingWater_On_B1" state = false
else
"VGC_43_do_CoolingWater_On_B1" state = true
endif
[TestSkipCoolWater]
"gblV_Brew_Status" value = 639
[SectionBrew639]
wait "gblV_Brew_Status" value == 639
//.................................................
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
"gblVScriptFlow" value = 100
vSMsg = " Ready to transfer from the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".  Click Set Manifold?"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.............................................
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
[SectionBrew640]
wait "gblV_Brew_Status" value == 640
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation" 
wait "gblV_Valve_Status" value == 0
[SectionBrew641]
if vV_Vessel_WORT_From == 7
"MB_28_do_ManualAlarm_B1" state = true
vSMsg = "Set the Hoses from the Brewzilla to the Manifold.  Click Hoses Set? when done."
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.............................................
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblV_Brew_Status" value = 641
wait "gblV_Brew_Status" value == 642
"MB_28_do_ManualAlarm_B1" state = false
goto "SectionBrew642"
endif
"gblV_Brew_Status" value = 642
[SectionBrew642]
wait "gblV_Brew_Status" value == 642
// Hide All Left ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_3" value = "Wait.  Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
[SectionBrew643]
"gblV_Brew_Status" value = 644
[SectionBrew644]
wait "gblV_Brew_Status" value == 644
"gblV_Gals_to_Fill" value = vV_Gal_XFER
vSMsg = "The WORT will be transferred from the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vV_Gal_XFER = vV_Desired_WORT_Transfer_Volume
vSMsg1 = ". The Gallons to to transfer is "
vSMsg = vSMsg + vSMsg1
print "@ 553 vV_Desired_WORT_Transfer_Volume = "
print vV_Desired_WORT_Transfer_Volume
vV_Gal_XFER = vV_Desired_WORT_Transfer_Volume
print vV_Gal_XFER
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallon(s).  Click Transfer WORT? to Advance."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblV_Gals_to_Fill" value = vV_Gal_XFER
vSMsg = "After the transfer time expires, you will be measuring the  "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " since you cannot measure the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".  Click Transfer WORT? to Advance."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Bottom_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Transfer WORT?"
//Background
"gblS_Brewery_Top_3"  background = 1
"gblS_Brewery_Bottom_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
//Visibility
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew645]
"gblV_Brew_Status" value = 646
[SectionBrew646]
wait "gblV_Brew_Status" value == 646
"sw_Advance_ BrewStatus" visibility = hidden
[Transfer_Wort]
[SectionBrew647]
"gblV_Brew_Status" value = 648
[SectionBrew648]
wait "gblV_Brew_Status" value == 648
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
vSMsg = "The WORT will be transferred from the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". The total Gallons to to transfer is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
 vSMsg1 = " gallons. Transfer Time will be calculated. The Rate is a round figure as the flow depends on lots of factors.  Wait!  Will Auto Advance."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance."
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
//.....................................................
//............................................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblV_Brew_Status" value = 649
[SectionBrew649]
wait "gblV_Brew_Status" value == 649
print 1101
// B1 Brewery Left visibility ......................
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
if vV_Vessel_WORT_From == 4
print 1117
vSMsg = "Turn on the Red Pump,  Click Red Pump? to start the transfer."
"gblS_swAllSwitch_Label_Text" value = "Red Pump?"
endif
if vV_Vessel_WORT_From == 5
vSMsg = "Turn on the Yellow Pump,  Click Yellow Pump? to start the transfer."
"gblS_swAllSwitch_Label_Text" value = "Yellow Pump?"
endif
if vV_Vessel_WORT_From == 7
vSMsg = "Manually turn on the Brewzilla Pump with the switch on the Brewzillia."
"gblS_swAllSwitch_Label_Text" value = "Brewzilla Pump On?"
endif
"gblVScriptFlow" value = 100
"gblS_Brewery_Top_3" value = vSMsg
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.............................................
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 649
[SectionBrew650]
wait "gblV_Brew_Status" value == 650
start "scrWater_Measure_T0_Vessel"
if vB_Testing == true
"gblS_Inter_Script" value = " @ 1211  scrWater_Measure_T0_Vessel"
sleep 4001
endif
//.....................................................
[SectionBrew651]
"gblV_Brew_Status" value = 652
[SectionBrew652]
wait "gblV_Brew_Status" value == 652
"tmBottomRight_B1" type = countup
"tmBottomRight_B1" value = 00:00:00
"tmBottomRight_B1" displayname = "Transfer WORT"
"tmBottomRight_B1"  visibility = visible
wait "gblV_Water_Flow_Wo1" value == 96
sleep 100
print "@186 Water Timers Started"
start "tmBottomRight_B1"
vS_TTL_Time = "gblT_SetTimer_Water" value 
vSMsg = "The WORT will be transferred from the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". The total Gallons to to transfer is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. The Calculated Transfer Time is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_TTL_Time
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".  Wait! Will Auto Advance.  You may OverRide."
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "OverRide"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_3" visibility = visible
"sw_Advance_ BrewStatus"  visibility = hidden
"sw_Advance_Overide" visibility = visible
sleep 5000
//Test...............................
if vB_Testing == true
sleep 5000
"tm_Water_Up" value = "gblT_SetTimer_Water" value
"tmBottomRight_B1" value = "gblT_SetTimer_Water" value
"tmRadiator_B1" value = "gblT_SetTimer_Water" value
"tmRadiator_B1" value = "gblT_SetTimer_Water" value
"tm_Water" value = 00:00:00
endif
//Test.............................
wait "gblV_Water_Flow_Wo1" value == 97
stop "tmBottomRight_B1"
if vV_Vessel_WORT_From == 4
"MB_36_do_RedPump_B1" state = false
endif
if vV_Vessel_WORT_From > 4
"MB_36_do_RedPump_B1" state = false
"MB_35_do_YellowPump_B1" state = false
endif
[SectionBrew653]
"gblV_Brew_Status" value = 654
[SectionBrew654]
wait "gblV_Brew_Status" value == 654
"sw_Advance_Overide" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 2
vSMsg = "Measure the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
"gblS_swAllSwitch_Label_Text" value = vSMsg
//............................................................
vSMsg = "The WORT was transferred from the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". The total Gallons that were desired to transfer is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. Since there are so many factors affecting the flow rate, it is likely that no all the desired WORT was transferred."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
//................................................................................
vSMsg = "Record "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Volume"
vSMsg = vSMsg + vSMsg1
"gblSReportLabel_B1" value = vSMsg
"gblVReport_B1" precision = 1
"gblVReport_B1" value = -99
vVCheck = vV_Vessel_WORT_From_Volume_Start - vV_Desired_WORT_Transfer_Volume 
vSMsg = vS_Vessel_WORT_From
vSMsg1 = " Estimated Volume = "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vVCheck
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1" value = vSMsg
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblS_Brewery_Top_2" background = 1
//Visibilty
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblSReportLabel_B1" visibility = visible
wait "gblVReport_B1" value > -99
"gblVEndVolume_Water" value = "gblVReport_B1" value
if vV_Vessel_WORT_From == 4
"gblVCurrentBrewKettle_Volume" value = "gblVReport_B1" value
"gblV_Total_WORT" = gblV_Total_WORT - "gblVReport_B1" value
endif 
if vV_Vessel_WORT_From == 5
"gblVCurrentLittle_Volume" value = "gblVReport_B1" value
"gblV_Total_WORT" = gblV_Total_WORT - "gblVReport_B1" value
endif 
if vV_Vessel_WORT_From == 7
"gblVCurrentBrewzilla_Volume" value = "gblVReport_B1" value
"gblV_Total_WORT" = gblV_Total_WORT - "gblVReport_B1" value
endif 
vV_Measured_Volume = "gblVReport_B1" value 
vV_Vessel_WORT_From_Volume_End = "gblVReport_B1" value
"gblV_Water_Flow_Wo1" value = 98
[SectionBrew655]
"gblV_Brew_Status" value = 656
[SectionBrew656]
wait "gblV_Brew_Status" value == 656
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblV_Brew_Status" value = 22
[SectionBrew22]
wait "gblV_Water_Flow_Wo1" value == 99
"gblV_Brew_Status" value = 22
"gblVReport_B1" visibility = hidden
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
[Display calculated Rate]
print "@ 879 Calculate the Rate"
"gblV_Brew_Status" value = 3000
[SectionBrew3000]
wait "gblV_Brew_Status" value == 3000
// Volume in the from is always less
vV_Vessel_WORT_From_Volume_Delta = vV_Vessel_WORT_From_Volume_Start  - vV_Vessel_WORT_From_Volume_End  
print "@ 1150 set Volume in Reporting"
if vV_Fementor_Filling == 1
"RP_v_1_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_1_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 2
"RP_v_2_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_2_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 3
"RP_v_3_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_3_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 4
"RP_v_4_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_4_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 5
"RP_v_5_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_5_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 6
"RP_v_6_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_6_Fermentor_Volume" value
endif
//.....................................................................................
vSMsg = "The "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " estimated Volume is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Fementor_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  Will Auto Advance"
vSMsg = vSMsg + vSMsg1
// B1 Brewery Left Hide ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3"  value = vSMsg
// B1 Brewery Left background......................
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
// Visibility ......................
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
//.................................................
//............................................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
//............................................................
vV_Elasped_Seconds = "gblVElaspedSeconds" value
vVRate_Orginal = "gblV_Rate" value
vVRate_Calc = vV_Elasped_Seconds / vV_Vessel_WORT_From_Volume_Delta 
if vVRate_Calc < 0
vVRate_Calc = vVRate_Calc * -1
endif
"gblVPrecision5" value = vVRate_Delta
vVRate_Delta = "gblVPrecision5" value
"gblVPrecision5" value = vVRate_Calc
vVRate_Calc = "gblVPrecision5" value
print " @ 896 Orginal Rate = "
print vVRate_Orginal
print "Calculated Rate = "
print vVRate_Calc
vVRate_Delta = vVRate_Orginal - vVRate_Calc
print "Delta Rate = "
print vVRate_Delta
if vVRate_Delta < 0
vVRate_Delta = vVRate_Delta * -1
endif
print "@ 906 vVRate_Delta = "
print vVRate_Delta
if vVRate_Delta <= .049999999
vSMsg =  "The Calculated Seconds per Gallon Rate to transfer the WORT from the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vVRate_Calc
vSMsg = vSMsg + vSMsg1
vSMsg1 = " SPG.  The Original Rate used to calculate was "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vVRate_Orginal
vSMsg = vSMsg + vSMsg1
vSMsg1 = " SPG and there NO significant difference."
vSMsg = vSMsg + vSMsg1
vB_Rate_Good = true
"tmBottomRight_B1" value = 00:00:04
goto "Rate_Good_4000"
endif
[SectionBrew3001]
"gblV_Brew_Status" value = 3002
[SectionBrew3002]
wait "gblV_Brew_Status" value == 3002
vSMsg = "Based on the elasped time and measured volume the calculated fill rate is "
vSMsg1 = vVRate_Calc
vSMsg = vSMsg + vSMsg1
vSMsg1 = " seconds per gallon.  The original rate use to calculate the time was "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vVRate_Orginal
vSMsg = vSMsg + vSMsg1
vSMsg1 = " seconds per gallon.  The difference is  "
vSMsg = vSMsg + vSMsg1
vSMsg1 =   vVRate_Delta 
vSMsg = vSMsg + vSMsg1
vSMsg1 = " seconds per gallon."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
//................................................................................
"tmBottomRight_B1" value = 00:00:07
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_Brewery_Bottom_3" value = "Note the difference and it may be significant.  You can reset the Rate and any additional WORT transfer from the same vessel will use the new Rate.  You are in control. This will Auto Advance after a short delay"
"gblS_Brewery_Bottom_3" visibility = visible
[Rate_Good_4000]
"gblV_Brew_Status" value = 4000
[SectionBrew4000]
wait "gblV_Brew_Status" value == 4000
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//...................................
"gblS_Brewery_Top_2" value = vSMsg
//............................................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
//"gblV_Set_BackGround_Middle_Time" value = 1
//"gblS_swAllSwitch_Label_Text" value = "Something"
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
//............................................................
print vB_Rate_Good
if vB_Rate_Good == true
goto "Go_to_Check_Fill"
endif
[SectionBrew4001]
"gblV_Brew_Status" value = 4002
[SectionBrew4002]
//..............................................................
vSMsg = "Do you want to change the Seconds per Gallon to the calculated rate of "  
vSMsg1 = vVRate_Calc
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Seconds per Gallon.  Click 1 to update or 2 to leave the rate as "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vVRate_Orginal
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Seconds per Gallon? "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
"gblS_swAllSwitch_Label_Text" value = "Update Rate?"
"gblSReportLabel_B1" value = "1 = Update\n2= Do Not Update"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
wait  "gblVReport_B1" value > 0
[reCheck_4000]
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
if "gblVReport_B1" value == 1
//Update the SPG.
if vV_Vessel_WORT_From == 4
"gblV_SPG_BK_to_Fermentor" value = vVRate_Calc
endif
if vV_Vessel_WORT_From == 5
"gblV_SPG_BK_to_Fermentor" value = vVRate_Calc
endif
if vV_Vessel_WORT_From == 7
"gblV_SPG_Purple_to_Fermentor" value = vVRate_Calc
endif
vSMsg = " The SPG has been updated to "
vSMsg1 = vVRate_Calc
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Seconds per Gallon. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
goto "Short_Delay_Update_SPG"
endif
//............................................................
[SectionBrew4003]
"gblV_Brew_Status" value = 4004
[SectionBrew4004]
wait "gblV_Brew_Status" value == 4004
if "gblVReport_B1" value == 2
vSMsg = " The SPG remains at "
vSMsg1 = vVRate_Orginal
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Seconds per Gallon. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
goto "Short_Delay_Update_SPG"
endif
//............................................................
if "gblVReport_B1" value > 2
"gblS_swAllSwitch_Label_Text" background = 1
endif
//............................................................
[Short_Delay_Update_SPG]
[SectionBrew4003]
"gblV_Brew_Status" value = 4004
[SectionBrew4004]
wait "gblV_Brew_Status" value == 4004
"gblS_Brewery_Top_3" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
//............................................................
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//............................................................
[Go_to_Check_Fill]
"gblV_Brew_Status" value =  7000
goto "SectionBrew7000"
[LOW]
print "@ 1408 Volume Low"
[SectionBrew5000]
wait "gblV_Brew_Status" value == 5000
// WORT Transfer LOW
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
vV_Gal_XFER = vV_Desired_WORT_Transfer_Volume -  vV_Vessel_WORT_From_Volume_Delta
"gblVPrecision1" value = vV_Gal_XFER
vV_Gal_XFER = "gblVPrecision1" value
print "@ 1102 vV_Gal_XFER = "
print vV_Gal_XFER
"gblV_Gals_to_Fill"  value = vV_Gal_XFER
"gblV_Water_Switch_Status_Water"  value = 1999
vSMsg = "The WORT volume in the "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is estimated to be "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Fementor_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  This was less than the desired amount by "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  You need to add the additional  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallon(s) to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".  Click Add Additional? to advance." 
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_Brewery_Bottom_3" background = 1
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//...................................
"gblS_swAllSwitch_Label_Text" value = "Add Additional?"
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 5001
[SectionBrew5002]
wait "gblV_Brew_Status" value == 5002
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
start "scrWater_Measure_T0_Vessel"
//.....................................................
"tmBottomRight_B1" type = countup
"tmBottomRight_B1" value = 00:00:00
"tmBottomRight_B1" displayname = "Wort Transfer"
"tmBottomRight_B1"  visibility = visible
wait "gblV_Water_Flow_Wo1" value == 96
print "@ 507 Water Timers Started"
start "tmBottomRight_B1"
vS_TTL_Time = "gblT_SetTimer_Water" value 
[SectionBrew5003]
"gblV_Brew_Status" value = 5004
[SectionBrew5004]
wait "gblV_Brew_Status" value == 5004
vSMsg = "The Additional WORT will be transferred from the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". The total Gallons to to transfer is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. The Calculated Additional Transfer Time is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_TTL_Time
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".  Wait! Will Auto Advance.  You may OverRide."
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "OverRide"
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
if vB_Testing == true
sleep 5000
"tm_Water_Up" value = "gblT_SetTimer_Water" value
"tmBottomRight_B1" value = "gblT_SetTimer_Water" value
"tmRadiator_B1" value = "gblT_SetTimer_Water" value
"tmRadiator_B1" value = "gblT_SetTimer_Water" value
"tm_Water" value = 00:00:00
endif
wait "gblV_Water_Flow_Wo1" value == 97
stop "tmRadiator_B1"
stop "tmBottomRight_B1"
[SectionBrew5005]
"gblV_Brew_Status" value = 5006
[SectionBrew5006]
wait "gblV_Brew_Status" value == 5006
print "@ 1715 Measure Volume after transferring Low"
"sw_Advance_Overide" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 2
//............................................................
vSMsg = "Measure the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
"gblS_swAllSwitch_Label_Text" value = vSMsg
//............................................................
vSMsg = "The Additional WORT was transferred from the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". The total Additional gallon(s) that were attemped to transfer is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. Since there are so many factors affecting the flow rate, it may be not all the desired WORT was transferred."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
//................................................................................
vSMsg = "Record "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Volume"
vSMsg = vSMsg + vSMsg1
"gblSReportLabel_B1" value = vSMsg
vVCheck = vV_Vessel_WORT_From_Volume_Start - vV_Desired_WORT_Transfer_Volume 
vSMsg = vS_Vessel_WORT_From
vSMsg1 = " Estimated Volume = "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vVCheck
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1" value = vSMsg
"gblVReport_B1" precision = 1
"gblVReport_B1" value = -99
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//Backgrounds
"gblSReportLabel_B1" background = 2
"gblVReport_B1" background = 2
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
// Visbilty
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
//............................................................
wait "gblVReport_B1" value > -99
"gblVEndVolume_Water" value = "gblVReport_B1" value
vV_Measured_Volume = "gblVReport_B1" value
vV_Vessel_WORT_From_Volume_End = "gblVReport_B1" value
if vV_Vessel_WORT_From == 4
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentBrewKettle_Volume" value
"gblVCurrentBrewKettle_Volume" value = "gblVReport_B1" value
"gblV_Total_WORT" = gblV_Total_WORT - "gblVReport_B1" value
endif 
if vV_Vessel_WORT_From == 5
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentLittle_Volume" value
"gblVCurrentLittle_Volume" value = "gblVReport_B1" value
"gblV_Total_WORT" = gblV_Total_WORT - "gblVReport_B1" value
endif 
if vV_Vessel_WORT_From == 7
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentBrewzilla_Volume" value
"gblVCurrentBrewzilla_Volume" value = "gblVReport_B1" value
"gblV_Total_WORT" = gblV_Total_WORT - "gblVReport_B1" value

endif 
print "@ 1792 vV_Vessel_WORT_From_Volume_Start"
print vV_Vessel_WORT_From_Volume_Start
print "End Volume = "
print vV_Vessel_WORT_From_Volume_End 
print "Delta = "
vV_Vessel_WORT_From_Volume_Delta = vV_Vessel_WORT_From_Volume_Start  - vV_Vessel_WORT_From_Volume_End  
print vV_Vessel_WORT_From_Volume_Delta
print "@ 1654 set Volume in Reporting after Additional"
if vV_Fementor_Filling == 1
vV_Fermentor_Current_Volume = "RP_v_1_Fermentor_Volume" value
print "Fermentor 1 Current"
print vV_Fermentor_Current_Volume
"RP_v_1_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_1_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 2
vV_Fermentor_Current_Volume = "RP_v_2_Fermentor_Volume" value
"RP_v_2_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_2_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 3
vV_Fermentor_Current_Volume = "RP_v_3_Fermentor_Volume" value
"RP_v_3_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_3_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 4
vV_Fermentor_Current_Volume = "RP_v_4_Fermentor_Volume" value
"RP_v_4_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_4_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 5
vV_Fermentor_Current_Volume = "RP_v_5_Fermentor_Volume" value
"RP_v_5_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
vV_Fementor_Volume = "RP_v_5_Fermentor_Volume" value
endif
if vV_Fementor_Filling == 6
vV_Fermentor_Current_Volume = "RP_v_6_Fermentor_Volume" value
"RP_v_6_Fermentor_Volume" value = vV_Fermentor_Current_Volume  + vV_Vessel_WORT_From_Volume_Delta
"RP_s_6_Fermentor" value = "gblS_Fermentor_Name_6" value
vV_Fementor_Volume = "RP_v_6_Fermentor_Volume" value
endif
//.....................................................................................
"gblV_Water_Flow_Wo1" value = 98
vSMsg = "The "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " estimated Volume is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Fementor_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  Will Auto Advance"
vSMsg = vSMsg + vSMsg1
// B1 Brewery Left Hide ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3"  value = vSMsg
// B1 Brewery Left background......................
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
// Visibility ......................
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
//............................................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
//............................................................
//goto Check Fill.............................................
"gblV_Brew_Status" value = 7000
goto "SectionBrew7000"
[HIGH]
[SectionBrew6000]
wait "gblV_Brew_Status" value == 6000
print "@ 1299 WORT is High"
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
vV_Gal_XFER = vV_Desired_WORT_Transfer_Volume -  vV_Vessel_WORT_From_Volume_Delta
"gblVPrecision1" value = vV_Gal_XFER
vV_Gal_XFER = "gblVPrecision1" value
print 1253
if vV_Gal_XFER == 0 
"gblV_Brew_Status" value = 6002
goto "Wort_Good"
endif
vSMsg = "The Wort volume in the "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_XFER
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallon(s) high.  You need to insure the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " has headspace.  If not, remove some WORT and manually adjust the Volume under Reporting. "
vSMsg = vSMsg + vSMsg1
//...................................
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text"  background = 1
//...................................
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Click to Advance "
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 6001
[Wort_Good]
[SectionBrew6002]
wait "gblV_Brew_Status" value == 6002
if "gblV_Total_WORT" <= 0
"gblS_Brewery_Top_1" value = "All of the WORT has been transferred.  Wait!  Will Auto Advance"
"gblS_Brewery_Top_1" visibility = visible
 "gblS_Brewery_Top_2" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//............................................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
goto "End_Script_Fill_Fermentors"
endif
goto "Redo_the_Process"
[SectionBrew6003]
"gblV_Brew_Status" value = 6004
[SectionBrew6004]
wait "gblV_Brew_Status" value == 6004
print "@ 1348 Volume Good"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
if vV_Fementor_Filling == 1
vV_Fementor_Volume = "RP_v_1_Fermentor_Volume" value
vV_Fementor_Volume = vV_Fementor_Volume + vV_Gal_XFER
"RP_v_1_Fermentor_Volume" value = vV_Fementor_Volume 
endif
if vV_Fementor_Filling == 2
vV_Fementor_Volume = "RP_v_2_Fermentor_Volume" value
vV_Fementor_Volume = vV_Fementor_Volume + vV_Gal_XFER
"RP_v_2_Fermentor_Volume" value = vV_Fementor_Volume 
endif
if vV_Fementor_Filling == 3
vV_Fementor_Volume = "RP_v_3_Fermentor_Volume" value
vV_Fementor_Volume = vV_Fementor_Volume + vV_Gal_XFER
"RP_v_3_Fermentor_Volume" value = vV_Fementor_Volume 
endif
if vV_Fementor_Filling == 4
vV_Fementor_Volume = "RP_v_4_Fermentor_Volume" value
vV_Fementor_Volume = vV_Fementor_Volume + vV_Gal_XFER
"RP_v_4_Fermentor_Volume" value = vV_Fementor_Volume 
endif
if vV_Fementor_Filling == 5
vV_Fementor_Volume = "RP_v_5_Fermentor_Volume" value
vV_Fementor_Volume = vV_Fementor_Volume + vV_Gal_XFER
"RP_v_5_Fermentor_Volume" value = vV_Fementor_Volume 
endif
if vV_Fementor_Filling == 6
vV_Fementor_Volume = "RP_v_6_Fermentor_Volume" value
vV_Fementor_Volume = vV_Fementor_Volume + vV_Gal_XFER
"RP_v_6_Fermentor_Volume" value = vV_Fementor_Volume 
endif
vSMsg = "The Wort volume in the "
vSMsg1 = vS_Ferment_Filled
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Fementor_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons which is good."
vSMsg = vSMsg + vSMsg1
//...................................
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text"  background = 3
//...................................
"gblS_Brewery_Top_3" value = vSMsg
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
//............................................................
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//............................................................
//............................................................
goto "Redo_the_Process"
[Redo_the_Process]
print "@ 1378 Redo the Process"
if vV_Vessel_WORT_From == 4
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentBrewKettle_Volume" value 
endif 
if vV_Vessel_WORT_From == 5
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentLittle_Volume" value 
endif 
if vV_Vessel_WORT_From == 7
vV_Vessel_WORT_From_Volume_Start = "gblVCurrentBrewzilla_Volume" value
endif
//
print "@ 1436 Volume Left to transfer"
print vV_Vessel_WORT_From_Volume_Start
if vV_Vessel_WORT_From_Volume_Start >  0
"gblV_Brew_Status" value = 617
start "scr600_3_Choose_Fermentor"
endif
if vV_Vessel_WORT_From_Volume_Start == 0
goto "ChooseorQuit"
endif
[ChooseorQuit]
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"insp_Float"  visibility = hidden
//.................................................
"gblS_swAllSwitch_Label_Text" value =  "Make Your Choice"
vSMsg = "All the WORT has been transferred from the "
vSMsg1 = vS_Vessel_WORT_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".  Do you want to transfer from a different Wort Source.  Choose\n1 = New Source\n2=Quit"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
"gblSReportLabel_B1" value = "Choose"
//background
"insp_1_LeftMiddle_B1"  background = 2
"gblS_swAllSwitch_Label_Text" background = 2
"gblSReportLabel_B1" background = 2
"gblVReport_B1" background = 2
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
if  vV_Vessel_WORT_From == 4 
"sw_Status_WORT_Done_BK" state = true
endif
if  vV_Vessel_WORT_From == 5 
"sw_Status_WORT_Done_LittleMac" state = true
endif
if  vV_Vessel_WORT_From == 7 
"sw_Status_WORT_Done_Brewzilla" state = true
endif
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_1_LeftMiddle_B1" visibility = visible
//..........................................................................................
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 2 
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
wait "gblVReport_B1" value > 0
[Loop_Choice_New_Source]
sleep 100
if "gblVReport_B1" value == 1
print "@ 1437 New Source"
goto "Restart_Source"
endif
if "gblVReport_B1" value == 2
print "@ 1521 Quit"
goto "End_Script_Fill_Fermentors"
endif
if "gblVReport_B1" value > 0
"gblVReport_B1" value =  0
endif
goto "Loop_Choice_New_Source"
[SectionBrew7000]
//Check Fill...........................................................
print "@ 1413 Section Brew 7000 Check Fill"
wait "gblV_Brew_Status" value == 7000
start "inscpt_scrBasicStart"
print "@ 1533 Measured Volume = "
print vV_Measured_Volume
vVCheck = vV_Vessel_WORT_From_Volume_Start -  vV_Gal_XFER
// Update Fermentor Volume
//vV_Vessel_WORT_From_Volume_Delta
//................................................
[Check Volume]
[SectionBrew7001]
"gblV_Brew_Status" value = 7002
[SectionBrew7002]
wait "gblV_Brew_Status" value == 7002
print " @ 1542 Check Volume = "
print vVCheck
//................................................
//Allow .1 variation either side of desired.
print "@ 1546 Volume Low ="
vVCheck_Low = vVCheck + .1
print vVCheck_Low
print "@ 1549 Volume High ="
vVCheck_High = vVCheck - .1
print vVCheck_High
//...............................................
[Select_Checked]
if vV_Measured_Volume > vVCheck_Low
vSCheck = "LOW"
	"gblV_Brew_Status" value = 5000
	goto "LOW"
endif 
if vV_Measured_Volume < vVCheck_High
vSCheck = "High"
	"gblV_Brew_Status" value = 6000
	goto "HIGH"
endif 
//................................................
if vV_Measured_Volume <= vVCheck_High
if vV_Measured_Volume >= vVCheck_Low
vSCheck = "Good"
goto "Redo_the_Process"
endif
[SectionBrew695]
"gblV_Brew_Status" value = 696
[SectionBrew696]
wait "gblV_Brew_Status" value == 696
[SectionBrew697]
[Restart_Source]
start "scr600_2_Choose_WORT_Source"
clear
stop "scr600_3_Choose_Fermentor"
[SectionBrew698]
"gblV_Brew_Status" value = 699
[SectionBrew699]
wait "gblV_Brew_Status" value == 699
[End_Script_Fill_Fermentors]
"gblV_Node_Red_Imported" value = 0
clear
"gblS_Script_Ended" value = "Ended: scr600_4_FillFermentors"
start "scr600_5_OG"
stop "scr600_4_FillFermentors"
```

## 43. scr600_5_OG

Starts by itself: No · User can start or stop it: Yes · 233 lines

```text

// scr600_5_OG
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Created: 05/03/2026 19:49
// MODIFIED 05/03/2026 19:49
//..................................
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started:   scr600_5_OG"
 //................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
new string vSMsg
new string vSMsg1
new string vS_Fermentor
new bool vB_Fementor_1_done
new bool vB_Fementor_2_done
new bool vB_Fementor_3_done
new bool vB_Fementor_4_done
new bool vB_Fementor_5_done
new bool vB_Fementor_6_done
new value vV_Count
//.....................................................
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"insp_Float"  visibility = hidden
//.................................................

"gblS_BrewName_B1" value = "Use Hydrometer for O.G."
"gblSReportLabel_B1" value = "O.G."
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 5
"gblVReport_B1" value = 0
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 2 
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible

[StartOver]
if vV_Count == 6
goto "End_scr600_2_OG"
endif
vV_Count = 0
if vB_Fementor_1_done == true
vV_Count = 1
goto "Skip1"
endif
if "RP_v_1_Fermentor_Volume" value > 0
vS_Fermentor = "gblS_Fermentor_Name_1" value
"gblS_swAllSwitch_Label_Text" value =  "Enter the Original Gravity"
vSMsg = "Take a sample from "
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = " and get the Specific Gravity of the sample.  Enter the O.G. of the WORT in the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". Taste the sample after measuring the S.G. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
wait "gblVReport_B1" value > 0
"RP_v_1_Fermentor_OG" value = "gblVReport_B1" value
vB_Fementor_1_done = true
else
vB_Fementor_1_done = true
endif
[Skip1]
if vB_Fementor_2_done == true
vV_Count = 2
goto "Skip2"
endif
if "RP_v_2_Fermentor_Volume" value > 0
vS_Fermentor = "RP_s_2_Fermentor" value
"gblS_swAllSwitch_Label_Text" value =  "Enter the Original Gravity"
vSMsg = "Take a sample from "
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = " and get the Specific Gravity of the sample.  Enter the O.G. of the WORT in the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". Taste the sample after measuring the S.G. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
wait "gblVReport_B1" value > 0
"RP_v_2_Fermentor_OG" value = "gblVReport_B1" value
vB_Fementor_2_done = true
else
vB_Fementor_2_done = true
endif
[Skip2]
if vB_Fementor_3_done == true
vV_Count = 3
goto "Skip3"
endif
if "RP_v_3_Fermentor_Volume" value > 0
vS_Fermentor = "RP_s_3_Fermentor" value
"gblS_swAllSwitch_Label_Text" value =  "Enter the Original Gravity"
vSMsg = "Take a sample from "
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = " and get the Specific Gravity of the sample.  Enter the O.G. of the WORT in the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". Taste the sample after measuring the S.G. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
wait "gblVReport_B1" value > 0
"RP_v_3_Fermentor_OG" value = "gblVReport_B1" value
vB_Fementor_3_done = true
else
vB_Fementor_3_done = true
endif
[Skip3]
if vB_Fementor_4_done == true
vV_Count = 4
goto "Skip4"
endif
if "RP_v_4_Fermentor_Volume" value > 0
vS_Fermentor = "RP_s_4_Fermentor" value
"gblS_swAllSwitch_Label_Text" value =  "Enter the Original Gravity"
vSMsg = "Take a sample from "
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = " and get the Specific Gravity of the sample.  Enter the O.G. of the WORT in the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". Taste the sample after measuring the S.G. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
wait "gblVReport_B1" value > 0
"RP_v_4_Fermentor_OG" value = "gblVReport_B1" value
vB_Fementor_4_done = true
else
vB_Fementor_4_done = true
endif
[Skip4]
if vB_Fementor_5_done == true
vV_Count = 5
goto "Skip5"
endif
if "RP_v_5_Fermentor_Volume" value > 0
vS_Fermentor = "RP_s_5_Fermentor" value
"gblS_swAllSwitch_Label_Text" value =  "Enter the Original Gravity"
vSMsg = "Take a sample from "
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = " and get the Specific Gravity of the sample.  Enter the O.G. of the WORT in the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". Taste the sample after measuring the S.G. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
wait "gblVReport_B1" value > 0
"RP_v_5_Fermentor_OG" value = "gblVReport_B1" value
vB_Fementor_5_done = true
else
vB_Fementor_5_done = true
endif
[Skip5]
if vB_Fementor_6_done == true
vV_Count = 6
goto "Skip6"
endif
if "RP_v_6_Fermentor_Volume" value > 0
vS_Fermentor = "RP_s_6_Fermentor" value
"gblS_swAllSwitch_Label_Text" value =  "Enter the Original Gravity"
vSMsg = "Take a sample from "
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = " and get the Specific Gravity of the sample.  Enter the O.G. of the WORT in the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Fermentor
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". Taste the sample after measuring the S.G. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
wait "gblVReport_B1" value > 0
"RP_v_6_Fermentor_OG" value = "gblVReport_B1" value
vB_Fementor_6_done = true
else
vB_Fementor_6_done = true
endif
[Skip6]
goto "StartOver"
[End_scr600_5_OG]
clear
"sw_Flow_Jumpto800" state = false
"gblS_Script_Ended" value = "Ended: scr600_5_OG"
start "scrBrew700_1_Refill_BigMac_Cleaning"
stop "scr600_5_OG"
```

## 44. scrBrew700_1_Refill_BigMac_Cleaning

Starts by itself: No · User can start or stop it: Yes · 383 lines

```text
//scrBrew700_1_Refill_BigMac_Cleaning
//Created 08/03/2023 10:03
// scrBrew700_1
// MIT License Granted
//Copyright © OakBarn Brewery 2026
y
// broken in 2 from scrBrew700 03/31/2026 07:16
//  Modd\ified 03/31/2026 07:16
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: scrBrew700_1_Refill_BigMac_Cleaning"
 //................................
//.........................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
"gblS_Inter_Script" visibility = visible
start "step_scrTest_Time _Reset"
start "looper_scrBoilTimer_Reset"
"gblTValveDelay" value = 00:00:01
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
"gblS_Inter_Script" visibility = hidden
stop "step_scrTest_Time _Reset"
stop "looper_scrBoilTimer_Reset"
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
new string vSMsg
new string vSMsg1
new string vS_Msg_Calc
new string vS_Msg_Calc_1
new value  vVCalc1 
new value  vVCalc2
new string vS_TTL_Time
new value vV_Vessel_Start
new value vV_Vessel_End
new value vV_Vessel_Delta
new value vV_Gal_to_Fill
new time  vT_Total_Time
new value vVBrewStatus
new value vVRate_Orginal
new value vVRate_Calc
new value vVRate_Delta
new value vV_Elasped
//............................................................................
start "inscpt_scrAlarm"
sleep 4001
"gblSReportLabel_B1" value = "  "
"gblS_Brewery_Bottom_4" value = "  "
"sw_Control_BigMac_Element" state = false
"MB_61_10kWortOut_B1" visibility = hidden
"tmRadiator_B1" visibility = hidden
"tmBigMac_B1" visibility = hidden
// B1 Brewery Left visibility ......................
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
if "sw_Flow_Jumpto800" state == true
"gblV_Brew_Status" value =  704
goto "SectionBrew704"
endif
"gblV_Brew_Status" value =  700
goto "SectionBrew700"
//................................................
[SectionBrew700]
wait "gblV_Brew_Status" value == 700
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value 
"gblS_Brewery_Top_3" value =  "Move the Probe back from the Plate Chiller WORT Outlet to the MASH Return.    This also does some cleanup items after the Brew is finished."
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
"gblS_swAllSwitch_Label_Text" value = "Probe Moved?"
"gblV_BigMacSetPointP1_B1" value = 140
"gblV_Brew_Status" value = 703
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblV_PitchSetpoint_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew701]
[SectionBrew702]
[SectionBrew703]
[SectionBrew704]
wait "gblV_Brew_Status" value == 704
print "@ 103 Check Big Mac Volume"
"MB_59_10K_MashReturn_B1" displayname = "MASH Return °F"
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
vSMsg = " The Big Mac needs to be topped off.  This is a timed Fill that will calculated."  
vSMsg1 = "  Click Set Manifold? when ready. This will set the manifold to refill the Big Mac with tap water. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Bottom_3"  value = "The Big Mac needs to be almost full as there is a lot of heated water needed to clean."
"gblS_Brewery_Top_3" value = vSMsg 
"sw_Control_BigMac_Element" state = false
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew705]
wait "gblV_Brew_Status" value == 705
"sw_Advance_ BrewStatus" visibility = hidden
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//................................................
"gblV_Water_Switch_Status_Water" value = 301
"gblV_Vessel_From" value = 100
"gblV_Pump" value = 100
"gblV_Vessel_To" value = 1
"gblV_Vessel_Measure" value = 1
"gblV_Pump" value = 100
"gblV_Isolation_Valve" value = 99
"gblV_Rate" value = "gblV_SPG_ManifoldFill_BigMac" value
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblV_Brew_Status" value = 706
[SectionBrew706]
wait "gblV_Brew_Status" value == 706
vV_Vessel_Start = "gblVCurrentBigMac_Volume" value
"gblVStartVolume_Water" value = vV_Vessel_Start
vV_Gal_to_Fill =  45 - vV_Vessel_Start
"gblV_Gals_to_Fill" value = vV_Gal_to_Fill
vSMsg = "The Manifold is set to refill the Big Mac to 45 gallons for cleaning water.  The amount that is needed to refill is "  
vSMsg1 = vV_Gal_to_Fill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  The Time to Fill will be calculated"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
//............................................................
//Short Delay  07 seconds displayed 
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = "gblT_Short_Delay" value
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"insp_1_LeftMiddle_B1" visibility = hidden
//............................................................
"gblV_Brew_Status" value = 708
[SectionBrew707]
[SectionBrew708]
wait "gblV_Brew_Status" value == 708
"gblS_Brewery_Top_3" value = "Click Refill? to refill the Big Mac.  It is a timed fill but you should monitor the refilling.  You are the Control and Safety."
"gblS_swAllSwitch_Label_Text" value = "Refill? "
// Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility 
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"sw_Advance_Overide" visibility = hidden
"gblV_Brew_Status" value = 708
[SectionBrew709]
wait "gblV_Brew_Status" value == 709
"gblS_Water_Text" value = " tap water filled the "
"gblV_Brew_Status" value = 718
start "sub_3_scrCalculateSPG"
goto "SectionBrew718"
[SectionBrew718]
print "@ 210 WAITING ON 718 "
wait "gblV_Brew_Status" value == 718
vV_Vessel_Start = "gblVCurrentRadiator_Volume" value 
if vV_Vessel_Start >= 12
"gblV_Brew_Status" value = 732
goto "SectionBrew732"
endif
"gblVStartVolume_Water" value = vV_Vessel_Start
vSMsg = " The Radiator needs to be topped off.  This is a timed Fill that will calculated."  
vSMsg1 = " .  Click Set Manifold? when ready. This will set the manifold to refill the Radiator. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Bottom_3"  value = "The Radiator needs to be almost full as there is a lot of heated water needed to clean."
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew719]
wait "gblV_Brew_Status" value == 719
//................................................
"gblV_Water_Switch_Status_Water" value = 302
"gblV_Vessel_From" value = 100
"gblV_Pump" value = 100
"gblV_Vessel_To" value = 2
"gblV_Vessel_Measure" value = 2
"gblV_Pump" value = 100
"gblV_Isolation_Valve" value = 2
"gblV_Rate" value = "gblV_SPG_ManifoldFill_Radiator" value
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"sw_Control_BigMac_Element" state = true
"gblV_Brew_Status" value = 720
[SectionBrew720]
wait "gblV_Brew_Status" value == 720
vV_Vessel_Start = "gblVCurrentRadiator_Volume" value
vV_Gal_to_Fill =  13.5 - vV_Vessel_Start
"gblV_Gals_to_Fill" value = vV_Gal_to_Fill
vSMsg = "The Manifold is set to Top Off the Radiator.  The amount that is needed to Top Off is "  
vSMsg1 = vV_Gal_to_Fill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  The Time to Fill will be calculated"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
//............................................................
//Short Delay  07 seconds displayed 
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = "gblT_Short_Delay" value
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"insp_1_LeftMiddle_B1" visibility = hidden
//............................................................
"gblV_Brew_Status" value = 722
[SectionBrew721]
[SectionBrew722]
wait "gblV_Brew_Status" value == 722
"gblS_Brewery_Top_3" value = "Click Top Off? to Top Off the Radiator.  It is a timed fill but you should monitor the refilling.  You are the Control and Safety."
"gblS_swAllSwitch_Label_Text" value = "Top Off? "
// Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility 
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"sw_Advance_Overide" visibility = hidden
"gblV_Brew_Status" value = 724
[SectionBrew723]
[SectionBrew724]
wait "gblV_Brew_Status" value == 724
"gblS_Water_Text" value = " tap water filled the "
"gblVStartBrew" value = 732
start "sub_3_scrCalculateSPG"
goto "SectionBrew732"
goto "SectionBrew732"
[SectionBrew731]
[SectionBrew732]
wait "gblV_Brew_Status" value == 732
"gblS_Brewery_Top_3" value = "The Big Mac Heaters will turn on automatically." 
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
// Background
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
// Visibility 
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
//............................................................
//Short Delay  3 seconds displayed 
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = "gblT_Short_Delay" value
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" value = 00:00:03
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"insp_1_LeftMiddle_B1" visibility = hidden
//............................................................
//................................................
"gblV_Water_Switch_Status_Water" value = 307
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"MB_32_do_WhitePump_B1" state = true
"sw_Control_BigMac_Element" state = true
[End_700_1]
clear
"gblS_Script_Ended" value = "Ended: scrBrew700_1_Refill_BigMac_Cleaning"
start "scrBrew700_2"
stop "scrBrew700_1_Refill_BigMac_Cleaning"
```

## 45. scrBrew700_2

Starts by itself: No · User can start or stop it: Yes · 827 lines

```text
//Created 08/03/2023 10:03
// scrBrew700_2
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// broken in 2 from scrBrew700 03/31/2026 14:32
//  Modd\ified 03/31/2026 14:33
//testing
//"gblVCurrentBigMac_Volume" value = 34
//"gblVCurrentRadiator_Volume" value = 5.2
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: scrBrew700_2"
 //................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
new string vSMsg
new string vSMsg1
new string vS_Msg_Calc
new string vS_Msg_Calc_1
new value  vVCalc1 
new value  vVCalc2
new string vS_TTL_Time
new value vV_Vessel_Start
new value vV_Vessel_End
new value vV_Vessel_Delta
new value vV_Gal_to_Fill
new time  vT_Total_Time
new value vVBrewStatus
new value vVChoice
new value vVChoice_Alternate
//............................................................................
start "inscpt_scrAlarm"
sleep 4001
"gblSReportLabel_B1" value = "  "
"gblS_Brewery_Bottom_4" value = "  "
"sw_Control_BigMac_Element" state = false
"MB_61_10kWortOut_B1" visibility = hidden
"tmRadiator_B1" visibility = hidden
"tmBigMac_B1" visibility = hidden
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
//............................................................................
vVBrewStatus = 734
"gblV_Brew_Status" value = vVBrewStatus
goto "SectionBrew734"
//................................................
[SectionBrew734]
if "sw_Status_Manifold_Rad_Heat" state == true
"gblV_Brew_Status" value = 738
goto "SectionBrew738"
endif
vV_Vessel_Start = "gblVCurrentRadiator_Volume" value
wait "gblV_Brew_Status" value == 734
print "@ 69 Set Manifold for RIMs/Radiator Heat"
"gblS_Brewery_Top_3" value = " The Radiator Heat needs to be turned on.  We need to set the Manifold for the RIMs/Radiator Body Heaters"  
"gblS_Brewery_Bottom_3"  value = "The Big Mac heater will be set after the RIMs/Radiator heat is on."
"sw_Control_BigMac_Element" state = false
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"sw_Control_BigMac_Element" state = true
"gblV_Brew_Status" value = 735
[SectionBrew735]
[SectionBrew736]
wait "gblV_Brew_Status" value == 736
//................................................
"gblV_Water_Switch_Status_Water" value = 1001
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"sw_Control_BigMac_Element" state = true
"gblV_Brew_Status" value = 738
[SectionBrew737]
[SectionBrew738]
wait "gblV_Brew_Status" value == 738
if "sw_Control_Radiator_Element" state == true
"MB_19_do_RIMS_Radiator_Control_B1" state = true
"gblV_Brew_Status" value = 742
goto "SectionBrew742"
endif
if "MB_19_do_RIMS_Radiator_Control_B1" state == true
"sw_Control_Radiator_Element" state = true
"gblV_Brew_Status" value = 742
goto "SectionBrew742"
endif
vSMsg = "Time to turn on both the RIMs Heater and the Radiator Body Heater.  The Manifold is set  The Volume of the Raditor is "
vSMsg1 = vV_Vessel_Start
vSMsg = vSMsg  + vSMsg1 
vSMsg1 = " gallons.  This will be used in cleaning both as a source and Heating thru the HERMs Coil of the PBW soulution.  Click Radiator Heaters? "
if "sw_Flow_Jumpto800" state == true
vSMsg1 = " gallons.  This will be used in rinsing the Brew kettle and the Mash Tun.  Click Radiator Heaters? "
endif
vSMsg = vSMsg  + vSMsg1 
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Radiator Heaters?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
// Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility 
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"sw_Advance_Overide" visibility = hidden
"gblV_Brew_Status" value = 739
[SectionBrew739]
[SectionBrew740]
wait "gblV_Brew_Status" value == 740
"gblS_swAllSwitch_Label_Text" value = "Wait. Will Auto Advance"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"MB_34_do_GreenPump_B1" state = true
sleep 100
"sw_Control_Radiator_Element" state = true
sleep 5000
"MB_19_do_RIMS_Radiator_Control_B1" state = true
sleep 5000
"gblV_Brew_Status" value = 742
[SectionBrew741]
[SectionBrew742]
wait "gblV_Brew_Status" value == 742
"MB_32_do_WhitePump_B1" state = true
if "sw_Flow_Jumpto800" state == true
"sw_Flow_Jumpto800" state = false
start "scrBrew800"
clear
stop "scrBrew700_2"
endif
"gblS_Brewery_Top_3" value =  "Tap Water need to be added to rinse and preClean the Brew Kettle. Set the Plate Chiller, Trub Filter and Hoses to recycle into the Brew Kettle." 
"gblS_swAllSwitch_Label_Text" value = "Plate Chiller and Hoses Set?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
"gblV_Brew_Status" value = 742
[SectionBrew743]
wait "gblV_Brew_Status" value == 743
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
"gblV_Brew_Status" value = 744
[SectionBrew744]
wait "gblV_Brew_Status" value == 744
"MB_28_do_ManualAlarm_B1" state = false
"gblS_Brewery_Top_3" value =  "Hoses, Plate Chiller and Trub filter should be set to flush with tap water to rinse and preClean the Brew Kettle. Set the Manifold to Flush with Tap water." 
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 745
[SectionBrew745]
[SectionBrew746]
wait "gblV_Brew_Status" value == 746
"gblV_Water_Switch_Status_Water" value = 408
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblV_Brew_Status" value = 758
[SectionBrew757]
[SectionBrew758]
wait "gblV_Brew_Status" value == 758
"sw_Control_BigMac_Element" state = true
"VGC_49_do_WhitePumpValve_On_B1" state = false
"gblS_Brewery_Top_3" value =  "Manifold is set.  Click Add Rinse Water? to add tap water to rinse the Brew Kettle.  This will Flush the Hoses and Plate Chiller.    It will Back Flush the Red Pump.  This will run for 2 minutes. "
"gblS_swAllSwitch_Label_Text" value = "Add Rinse Water?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 759
[SectionBrew759]
[SectionBrew760]
wait "gblV_Brew_Status" value == 760
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
//.............................................................
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblS_Brewery_Top_3" value = "Using Manifold Supply Valve to add Rinse Water to the Brew Kettle via the Plate Chiller and hoses.   At 00:01:45 Red Pump Back Fush will start.  The Back Flush lasts until 00:01:30."
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" value = "You may scub the Brew Kettle while the water is flowing." 
"gblS_Brewery_Bottom_3" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" value = 00:02:00
"tmBottomRight_B1" displayname = "Adding Rinse Water"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
"VGC_36_do_ManifoldFill_On_B1" state = true
"VGC_5_do_FermentFill_On_B1" state = true
start "tmBottomRight_B1"
"gblV_Brew_Status" value = 761
//Test...............................
if vB_Testing == true
stop "tm_Hidden_1"
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:05
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"tmBottomRight_B1" value = 00:01:47
endif
//Test.............................
[Loop744x1]
sleep 100
if "tmBottomRight_B1" value  <= 00:01:45
goto "Loop744Endx1"
endif
goto "Loop744x1"
[Loop744Endx1]
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_Brewery_Top_3" background = 2
"gblS_Brewery_Top_3" value = "Back Flushing the Red Pump and Tangental inlet."
"VGC_19_do_BrewKettleTangental_On_B1" state = true
"VGC_3_do_RedPumpValve_On_B1" state = true
"VGC_41_do_BrewKettleIsolation_On_B1" state = false
//Test...............................
if vB_Testing == true
stop "tm_Hidden_1"
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:05
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"tmBottomRight_B1" value = 00:01:32
endif
//Test.............................
wait "tmBottomRight_B1" value  <= 00:01:30
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value = "Back Flushing Complete.  Additional Rinse Water is being added via the Plate Chiller.  This also flushes the Plate Chiller and Hoses.  Scrub the Brew Kettle. You may OverRide the timer."
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"VGC_3_do_RedPumpValve_On_B1" state = false
"gblS_swAllSwitch_Label_Text" value = "OverRide"
"sw_Advance_ BrewStatus" background = 3
"sw_Advance_ BrewStatus" visibility = visible
//Test...............................
if vB_Testing == true
stop "tm_Hidden_1"
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:05
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"tmBottomRight_B1" value = 00:00:02
endif
//Test.............................
//Test.............................
[Loop744]
sleep 100
if "tmBottomRight_B1" value  <= 00:00:00
goto "Loop744End"
endif
if "gblV_Brew_Status" value == 762
goto "Loop744End"
endif
goto "Loop744"
[Loop744End]
"gblV_Brew_Status" value =  762
"VGC_36_do_ManifoldFill_On_B1" state = false
stop "tmBottomRight_B1"
"gblV_Brew_Status" value = 761
[SectionBrew761]
wait "gblV_Brew_Status" value == 761
"sw_Advance_ BrewStatus" background = 1
"gblS_Brewery_Top_3" value =  "The Brew Kettle needs to be totally pre cleaned and waste removed. Scrub and rinse using the FireHose. Also pre clean the Trub filter and replace.  After dumping and the Brew Kettle is fairly clean, the Brew Kettle must be ready for PBW. Click Brew Kettle Precleaned? when it and the Trub Filter is precleaned."
"gblS_swAllSwitch_Label_Text" value = "Brew Kettle Precleaned?"
"gblS_Brewery_Bottom_3" value = "The Brew Kettle should be totally rinsed out and ready for cleaning water.  You can leave it completely drained or leave about 5 gallons of CLEAN Water with no residue left."
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 999
wait "gblV_Brew_Status" value == 1000
"gblS_swAllSwitch_Label_Text" background = 2
"gblS_swAllSwitch_Label_Text" value = "Measure the Brew Kettle"
"gblS_Brewery_Top_2" value = "The Brew Ketttle can be empty (precleaned) or have around 5 gallons of CLEAN Water left.  If water is left, the Brew Kettle must have been precleaned and all residue dumped.  Measure the Volume of the Brew Kettle."
"gblS_BrewName_B1" value = "Brew Kettle Volume = "
//Inspectors
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//Background
"gblSReportLabel_B1" background = 2
"gblVReport_B1" background = 2
"gblS_Brewery_Top_2" background = 1
//Visibilty
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 1
"gblVReport_B1" value = -99
"gblSReportLabel_B1" visibility = hidden
wait "gblVReport_B1" value > -99
"gblVCurrentBrewKettle_Volume" value = "gblVReport_B1" value
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblV_Brew_Status" value = 762
[SectionBrew762]
wait "gblV_Brew_Status" value == 762
vV_Vessel_Start = "gblVCurrentBigMac_Volume" value
wait "gblV_Brew_Status" value == 762
print "@ 64 Set Manifold for Big Mac Heat"
if "sw_Status_Manifold_BigMac_Heat" state == true
"gblS_Brewery_Top_3" value = " The Big Mac Heat needs to be turned on.  The Manifold is set for the Big Mac Body Heaters.  Wait.  Will Auto Advance."
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//............................................................
//Short Delay  5 seconds displayed 
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = 00:00:05
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"insp_1_LeftMiddle_B1" visibility = hidden
//............................................................
"gblV_Brew_Status" value = 766
goto "SectionBrew766"
endif
"gblS_Brewery_Top_3" value = " The Big Mac Heat needs to be turned on.  We need to set the Manifold for the Big Mac Body Heaters"  
"gblS_Brewery_Bottom_3"  value = "The Big Mac heater will be set after the RIMs/Radiator heat is on."
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 763
[SectionBrew763]
[SectionBrew764]
wait "gblV_Brew_Status" value == 764
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//................................................
"gblV_Water_Switch_Status_Water" value = 307
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblV_Brew_Status" value = 766
[SectionBrew765]
[SectionBrew766]
wait "gblV_Brew_Status" value == 766
if "sw_Control_BigMac_Element" state == true
"MB_32_do_WhitePump_B1"  state = true
"gblV_Brew_Status" value = 770
goto "SectionBrew770"
endif
vSMsg = "Time to turn on the Big Mac Heaters.  The Manifold is set.  The Big Mac Volume is "
vSMsg1 = vV_Vessel_Start
vSMsg = vSMsg  + vSMsg1 
vSMsg1 = " gallons.  The majority if not all will be later transferred to the MLT for the PBW Soultion.  Click Big Mac Heaters? "
vSMsg = vSMsg  + vSMsg1 
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Big Mac Heaters?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
// Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility 
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"sw_Advance_Overide" visibility = hidden
"gblV_Brew_Status" value = 767
[SectionBrew757]
[SectionBrew758]
wait "gblV_Brew_Status" value == 768
"gblS_Brewery_Top_3" value = "Wait!  Will Auto Advance"
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"MB_32_do_WhitePump_B1"  state = true
sleep 500
"sw_Control_BigMac_Element" state = true
sleep 5000
"gblV_Brew_Status" value = 770
[SectionBrew769]
[SectionBrew770]
wait "gblV_Brew_Status" value == 770
"gblV_RadiatorSetPoint_P1_B1" value = 135
"gblV_BigMacSetPointP1_B1" value = 135
"gblV_MLTSetpoint_P1_B1" value = 135
"gblS_Brewery_Top_3" value = "All of the Radiator Heaters are on.  Both Big Mac Body Heaters are on.  The Best Temperature for the PBW solution is above 125 °F.  The Setpoint for both the Big Mac and the Raditor is set at 135 °F.  This is so as to allow for some cooling while transferring.  Wait!  Will Auto Advance." 
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
//............................................................
//Short Delay  7 seconds displayed 
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = 00:00:07
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"insp_1_LeftMiddle_B1" visibility = hidden
//............................................................
"gblV_Brew_Status" value = 772
[SectionBrew772]
wait "gblV_Brew_Status" value == 772
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
"gblS_Brewery_Top_2" value =  "Ready to start Cleanup.  Make a Choice as to the Status of your Cleaning.\n1: PBW Recyling in MASH Tun and HERMS.\n2: Need to Empty MASH Tun of Grain.\n3: MASH Tun rinsed, ready for  Cleaning Water."  
"gblS_Brewery_Bottom_4" value = "What is the Status of the MASH Tun.  Is it already being cleaned?  Make a choice for the Status."
"gblS_swAllSwitch_Label_Text" value = "Make a Choice"
"gblVReport_B1" value = 0
"gblVReport_B1"  precision = 0
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
 "gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblSReportLabel_B1" value = "MASH Tun Status?"
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
 "gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Status_MLT_PBW" state = false
"sw_Status_MLT_Ready" state = false
[Loop_Choice_MLT]
sleep 100
if  "gblVReport_B1" value == 1
//PBW Cycling
vVChoice = 1
"sw_Status_MLT_PBW" state = true
"gblV_Brew_Status" value = 773
goto "SectionBrew773"
endif
if  "gblVReport_B1" value == 2
//Clean Mash Tun
vVChoice = 2
"gblV_Brew_Status" value =  776
goto "SectionBrew776"
endif
if  "gblVReport_B1" value == 3
//Mash Tun is Cleaned
vVChoice = 3
"sw_Status_MLT_Ready" state = true
endif
if  "gblVReport_B1" value > 3
"gblS_swAllSwitch_Label_Text" value = "1,2, or 3 ONLY!"
endif
goto "Loop_Choice_MLT"
[SectionBrew773]
wait "gblV_Brew_Status" value == 773
print "@ 616 Section 773"
if sw_Status_Manifold_BigMac_Heat state == false
goto "Reset_Manifold"
endif
if "MB_32_do_WhitePump_B1" state == false
"MB_32_do_WhitePump_B1" state = true
endif
if "sw_Control_BigMac_Element" state == false
"sw_Control_BigMac_Element" state = true
endif
[Reset_Manifold]
print "@ 627 Restet Manifold for Big Mac Heat and turn on white Pump"
vV_Vessel_Start = "gblVCurrentBigMac_Volume" value
if "sw_Status_Manifold_BigMac_Heat"  state == true 
"gblV_Brew_Status" value = 1001
goto "SectionBrew1001"
endif
"gblS_Brewery_Top_3" value = " The Big Mac Heat needs to be turned on.  We need to set the Manifold for the Big Mac Body Heaters"  
"gblS_Brewery_Bottom_3"  value = "This insures that the Manifold is set to recycle the Big Mac for heating."

"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 999
[SectionBrew1000]
wait "gblV_Brew_Status" value == 1000
//................................................
"gblV_Water_Switch_Status_Water" value = 301
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblV_Brew_Status" value = 1001
[SectionBrew1001]
wait "gblV_Brew_Status" value ==  1001
if "sw_Control_BigMac_Element" state == true
"MB_32_do_WhitePump_B1"  state = true
"gblV_Brew_Status" value = 776
goto "SectionBrew776"
endif
print "@ 665 Big Mac Heaters on"
vSMsg = "Time to turn on the Big Mac Heaters.  The Manifold is set.  The Big Mac Volume is "
vSMsg1 = vV_Vessel_Start
vSMsg = vSMsg  + vSMsg1 
vSMsg1 = " gallons.  The majority if not all will be later transferred to the MLT for the PBW Soultion.  Click Big Mac Heaters? "
vSMsg = vSMsg  + vSMsg1 
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Big Mac Heaters?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
// Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility 
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"sw_Advance_Overide" visibility = hidden
"gblV_Brew_Status" value = 1002
[SectionBrew1002]
wait "gblV_Brew_Status" value == 1002
"gblS_Brewery_Top_3" value = "Wait!  Will Auto Advance"
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"MB_32_do_WhitePump_B1"  state = true
"sw_Control_BigMac_Element" state = true
"gblV_Brew_Status" value = 776
[SectionBrew774]
[SectionBrew775]
[SectionBrew776]
wait "gblV_Brew_Status" value == 776
if "sw_Status_MLT_PBW" state == true
goto "EndandAlternate"
endif
if "sw_Status_MLT_Ready" state == true
goto "EndandAlternate"
endif
"gblS_Brewery_Top_3" value =  "The Mash Tun needs to be emptied of Grain. Empty the grain and rinse using the FireHose.  When have rinsed the the MLT and it is ready for PBW, Click MASH Tun Rinsed?"
"gblS_swAllSwitch_Label_Text" value = "MASH Tun Rinsed?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 776
[SectionBrew777]
wait "gblV_Brew_Status" value == 777
"sw_Status_MLT_Ready" state = true
[EndandAlternate]
clear

"gblS_Script_Ended" value = "Ended: scrBrew700_2"
start "scrBrew700_3"
stop "scrBrew700_2"
```

## 46. scrBrew700_3

Starts by itself: No · User can start or stop it: Yes · 836 lines

```text
// scrBrew700_3
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Created 08/03/2023 10:03
// broken in 2 from scrBrew70   04/02/2026 15:33
//  Modd\ified 04/02/2026 15:33
//testing
//"gblVCurrentBigMac_Volume" value = 34
//"gblVCurrentRadiator_Volume" value = 5.2
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: scrBrew700_3"
 //................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
new string vSMsg
new string vSMsg1
new string vS_Msg_Calc
new string vS_Msg_Calc_1
new value  vVCalc1 
new value  vVCalc2
new string vS_TTL_Time
new value vV_Vessel_Start
new value vV_Vessel_End
new value vV_Vessel_Delta
new value vV_Gal_to_Fill
new time  vT_Total_Time
new value vVBrewStatus
new value vVChoice
new value vVChoice_Alternate
new value vV_PBW_Cups
new value vV_PBW_TBS 
new value vV_BrewKettle_Current_Volume
//............................................................................
start "inscpt_scrAlarm"
sleep 4001
"gblSReportLabel_B1" value = "  "
"gblS_Brewery_Bottom_4" value = "  "
"sw_Control_BigMac_Element" state = false
"MB_61_10kWortOut_B1" visibility = hidden
"tmRadiator_B1" visibility = hidden
"tmBigMac_B1" visibility = hidden
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
if "sw_Status_MLT_PBW" state == true
"gblV_Brew_Status" value = 1710
goto "SectionBrew1710"
endif
//.................................................
vVBrewStatus = 1698
"gblV_Brew_Status" value = vVBrewStatus
goto "SectionBrew1698"
//................................................
[SectionBrew1695]
[SectionBrew1696]
[SectionBrew1697]
[SectionBrew1698]
wait "gblV_Brew_Status" value == 1698
"gblS_Brewery_Top_2" value =  "The Mash Tun is clean and ready for heated cleaning water and PBW .  You can wait for the Radiator or the Big Mac to reach cleaning temperature or if you have an Alternate Source;  You may choose\n1: Wait for the Temperature\n2: Alternate Source . "
"gblS_swAllSwitch_Label_Text" value = "Wait or Alternate?"
"gblSReportLabel_B1" value = "1:Wait 2: Alternate Source"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"insp_1_LeftMiddle_B1" background = 3
"gblSReportLabel_B1" background = 1 
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 1
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3                                
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" value = 0
"gblVReport_B1"  precision = 0
[Loop1698]
sleep 100
if "gblVReport_B1" value == 1
vVChoice_Alternate =  "gblVReport_B1" value
"gblV_Brew_Status" value = 778
goto "Ender_700_3"
endif
if "gblVReport_B1" value == 2
vVChoice_Alternate =  "gblVReport_B1" value
"gblV_Brew_Status" value = 1700
goto "SectionBrew1700"
endif
if "gblVReport_B1" value  > 2
"insp_Pix_ArrowAllSwitch_B1" background = 1
endif
goto "Loop1698"
[SectionBrew1699]
[SectionBrew1700]
wait "gblV_Brew_Status" value == 1700
print "@ 130 Alternate source Text"
"gblS_Brewery_Top_3" value = " You need to add about 5 gallons from your alternate source (such as the Digiboil, the Brewzilla or other Vessel where you heated the extra water.  Since there are so many choices and volumes available, you will need to manually add to the MASH Tun first, and if enough, drain and add to the Brew Kettle. Click MASH Tun Filled?"  
"gblS_Brewery_Bottom_3"  value = "Remember there is a Pump on the Oxygenater stand. You need to manually move the cleaning water."
"gblS_swAllSwitch_Label_Text" value = "MASH Tun Filled?"
//Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 1701
[SectionBrew1701]
[SectionBrew1702]
wait "gblV_Brew_Status" value == 1702
print "@156 SectionBrew1702"
"gblS_Brewery_Top_2" value =  "Where was the Alternate Source Cleaning Water moved to:\n1: Only the Mash Tun\n2:  Check Brew Kettle.  "
"gblS_swAllSwitch_Label_Text" value = "Make a Choice"
"gblSReportLabel_B1" value = "1: Mash Tun Only 2: Check Brew Kettle"
//BackGrounds
"gblSReportLabel_B1" background = 1
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 1
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3                                
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" value = 2
"gblVReport_B1"  precision = 0
vVCalc1 = 0
[Loop1702]
sleep 100
if "gblVReport_B1" value == 1
vVChoice_Alternate = "gblVReport_B1" value
"gblV_Brew_Status" value = 1704
goto "SectionBrew1704"
endif
if "gblVReport_B1" value == 2
vVChoice_Alternate = "gblVReport_B1" value
"gblV_Brew_Status" value = 1704
goto "SectionBrew1704"
endif
if "gblVReport_B1" value > 2
"gblSReportLabel_B1" value = "ONLY 1 or 2 !"
"gblVReport_B1" value = 0
endif
goto "Loop1702"
//...........................................................
[SectionBrew1703]
[SectionBrew1704]
wait "gblV_Brew_Status" value == 1704
print "@ 260 Check Mash Tun Volume"
"gblS_swAllSwitch_Label_Text" value = "Stick to measure"
"gblSReportLabel_B1" value = "Record Mash Tun Volume"
//............................................................
"gblS_Brewery_Top_2" value = "Stick to Measure the Mash Tun Volume Volume.  You will be adding 2 tablespoons per 5 gallons of PBW to start cleaning later.  Record Mash Tun Volume Volume."
//background
"insp_1_LeftMiddle_B1"  background = 2
"gblS_swAllSwitch_Label_Text" background = 2
"gblSReportLabel_B1" background = 2
"gblVReport_B1" background = 2
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"insp_1_LeftMiddle_B1" visibility = visible
//................................................................................
wait "gblVReport_B1" value > 0
"gblVEndVolume_Water" value = "gblVReport_B1" value
vV_Vessel_End = "gblVReport_B1" value
"gblVCurrentMLT_Volume" value = "gblVReport_B1" value
"gblVReport_B1" value = 0
"gblV_Brew_Status" value = 1705
[SectionBrew1705]
vV_Vessel_End = "gblVCurrentBrewKettle_Volume" value
wait "gblV_Brew_Status" value == 1705
vV_PBW_TBS = vV_Vessel_End  * 2
vV_PBW_Cups = vV_PBW_TBS  / 12
"gblVPrecision1" value = vV_PBW_TBS 
vV_PBW_TBS = "gblVPrecision1" value
"gblVPrecision2" value = vV_PBW_Cups
vV_PBW_Cups = "gblVPrecision2" value
vSMsg = vV_PBW_TBS
vSMsg1 = " Tablespoons of PBW needed to be added to the MASH Tun and strirred in.   That would be "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_PBW_Cups
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Cups if easier.   Click PBW Added? when done."
 vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = " PBW Added?"
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew1706]
wait "gblV_Brew_Status" value == 1706
print "@ 270 Set Manifold for HERMs"
"gblS_Brewery_Top_3" value = " The PBW Soultion needs to be run through the HERMs Coil .  Set the Manifold for HERMs.  Click Set Manifold?"  
"gblS_Brewery_Bottom_3"  value = "Cleaning the HERMs Coil needs to be Done for a minimum of one hour."
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
//Background
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
//................................................
"gblV_Water_Switch_Status_Water" value = 298
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblV_Brew_Status" value = 1708
[SectionBrew1707]
[SectionBrew1708]
wait "gblV_Brew_Status" value == 1708
print "@ 309 Manifold Set for HERMs"
"gblS_Brewery_Top_3" value = " The Manifold is set for HERMs.  This will run the PBW Solution thru the HERMs Coil.   Click Blue Pump?"  
"gblS_Brewery_Bottom_3"  value = "Note the Temperature of the RIMs Heater Output.  It lower than 125 °F , it will affect the PBW Solution Temperature."
"gblS_swAllSwitch_Label_Text" value = "Blue Pump?"
//Background
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 1709
[SectionBrew1709]
[SectionBrew1710]
wait "gblV_Brew_Status" value == 1710
print "@ 330 Manifold Set for HERMs"
"gblS_Brewery_Top_3" value = " The Manifold is set for HERMs.  Blue Pump is running.  Timer started for cleaning the HERMs Coil."
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Will Auto Advance"
stop "tm_Clean_MLT" 
"tm_Clean_MLT" type = countup
"tm_Clean_MLT" value = 00:00:00
"MB_33_do_BluePump_B1" state = true
start "tm_Clean_MLT"
//Background
"gblS_Brewery_Top_3" background = 2
"gblS_Brewery_Bottom_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
if "MB_58_10KRadiator_B1" value < 100
"gblS_Brewery_Bottom_3"  value = "The temperature of the RIMs Heater Output is lower than 100 °F , there will be a short Delay of 1 minute and the Blue Pump will turn off to soak the HERMs Coil."
//............................................................
//Short Delay  60 seconds displayed 
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait! One Minute Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = 00:01:00
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
//testing..................................................
if vB_Testing == true
"tmBottomRight_B1" value = 00:00:05
endif
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"insp_1_LeftMiddle_B1" visibility = hidden
//............................................................
"MB_33_do_BluePump_B1" state = false
"gblS_Brewery_Top_3" value = " Blue Pump is Off.  Monitor the RIMs Heater Output and turn the Blue Pump on when ready.  You are in Control."
"gblS_Brewery_Bottom_3" visibility = hidden
endif
"gblS_Brewery_Top_3" background = 3
//............................................................
//Short Delay  7 seconds displayed 
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = 00:00:05
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"insp_1_LeftMiddle_B1" visibility = hidden
//............................................................
"gblV_Brew_Status" value = 1714
[SectionBrew1711]
[SectionBrew1712]
[SectionBrew1713]
[SectionBrew1714]
wait "gblV_Brew_Status" value == 1714
vV_BrewKettle_Current_Volume = "gblVCurrentBrewKettle_Volume" value
vV_Vessel_Delta = 5 - vV_BrewKettle_Current_Volume
if vV_BrewKettle_Current_Volume >= 5
goto "PreClean_Burner"
endif
vsMsg = "The Brew Kettle Volume is "
vsMsg1 = vV_BrewKettle_Current_Volume
vsMsg = vsMsg + vsMsg1
vsMsg1 = " gallons. Add "
vsMsg = vsMsg + vsMsg1
vsMsg1 = vV_Vessel_Delta
vsMsg = vsMsg + vsMsg1
vsMsg1 = " gallons. You can wait for the Radiator or the Big Mac to reach cleaning temperature or\n1: Wait for the Temperature\n2: Alternate Source \n3: Add from FireHose and heat with Burner."
vsMsg = vsMsg + vsMsg1
"gblS_Brewery_Top_2" value = vSMsg
//BackGrounds
"gblSReportLabel_B1" background = 1
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 1
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3                                
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" value = 0
"gblVReport_B1"  precision = 0
[Loop1714]
sleep 100
if "gblVReport_B1" value == 1
vVChoice_Alternate = "gblVReport_B1" value 
"gblV_Brew_Status" value = 778
goto "Ender_700_3"
endif
if "gblVReport_B1" value == 2
vVChoice_Alternate = "gblVReport_B1" value 
"gblV_Brew_Status" value = 1716
goto "SectionBrew1716"
endif
if "gblVReport_B1" value == 3
vVChoice_Alternate = "gblVReport_B1" value 
"gblV_Brew_Status" value = 1718
goto "SectionBrew1718"
endif
if "gblVReport_B1" value  > 3
"insp_Pix_ArrowAllSwitch_B1" background = 1
endif
goto "Loop1714"
[PreClean_Burner]
"gblV_Brew_Status" value = 1715
[SectionBrew1715]
wait "gblV_Brew_Status" value == 1715
"gblS_Brewery_Top_3" value = "The Brew Kettle Burner needs to be turned on to heat the Cleaning water.  The best temperatue for PBW is from 125 °F to 180 °F.  Monitor the Temperature and control the burner.  You are the Safety and Control.  Click Brew Kettle Burner?"  
"gblS_swAllSwitch_Label_Text" value = "Brew Kettle Burner?"
//Background
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 999
wait "gblV_Brew_Status" value == 1000
"sw_Control_Burner_BK" state = true
sleep 200
"gblV_Brew_Status" value = 1726
goto "SectionBrew1726"
[SectionBrew1716]
wait "gblV_Brew_Status" value == 1716
if vV_BrewKettle_Current_Volume == 0
"gblV_Brew_Status" value =  1718
goto "SectionBrew1718"
endif
print "@ 688 Alternate source Text"
"gblS_Brewery_Top_3" value = "All of the water needs to be drained from the Brew Kettle.Click Brew Kettle Empty? when done."  
"gblS_swAllSwitch_Label_Text" value = "Brew Kettle Empty?"
//Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
print 477
"gblV_Brew_Status" value =  1717
[SectionBrew1717]
[SectionBrew1718]
wait "gblV_Brew_Status" value == 1718
if  vVChoice_Alternate == 3 
"gblV_Brew_Status" value = 1720
goto "SectionBrew1720"
endif
print "@ 489Alternate source Text"
"gblS_Brewery_Top_3" value = " You need to manually add about 5 gallons from your alternate source (such as the Digiboil, the Brewzilla or other Vessel where you heated the extra water.  Since there are so many choices and volumes available to manually move the cleaning water. Click Brew Kettle Filled?"  
"gblS_swAllSwitch_Label_Text" value = "Brew Kettle Filled?"
"gblS_Brewery_Bottom_3"  value = "Remember there is a Pump on the Oxygenater stand. You need to manually move the cleaning water."
//Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 1718
[SectionBrew1719]
wait "gblV_Brew_Status" value == 1719
if  vVChoice_Alternate == 2
"gblV_Brew_Status" value = 1722
goto "SectionBrew1722"
endif
"gblV_Brew_Status" value = 1720
[SectionBrew1720]
wait "gblV_Brew_Status" value == 1720
print "@ 688 Fire Hose"
vsMsg = "The Brew Kettle Volume is "
vsMsg1 = vV_BrewKettle_Current_Volume
vsMsg = vsMsg + vsMsg1
vsMsg = " gallons. Add "
vsMsg = vsMsg + vsMsg1
vsMsg1 = vV_Vessel_Delta
vsMsg = vsMsg + vsMsg1
vsMsg = " gallons using the FireHose. The actual volume is not specific but around five is good. Click Brew Kettle Filled?"
vsMsg = vsMsg + vsMsg1
"gblS_Brewery_Top_3" value = vsMsg 
"gblS_swAllSwitch_Label_Text" value = "Brew Kettle Filled?"
"gblS_Brewery_Bottom_3"  value = "Remember you can used the Fire Hose Timed Buttons on the Water Pane."
//Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 1721
[SectionBrew1721]
[SectionBrew1722]
wait "gblV_Brew_Status" value == 1722
print "@ Consider Brew Kettle Burner"
"gblS_Brewery_Top_3" value = "You should consider heating the cleaning water in the Brew Kettle with the Brew Kettle Burner to 160 °F. PBW is best between 130 °F and 180 °F for 30 minutes.   You will need to manually operate it.  Monitor the Temperature and adjust as required,  You are the Safety and Control .  Click Considered? when ready."  
"gblS_swAllSwitch_Label_Text" value = "Considered?"
//Background
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 1723
[SectionBrew1723]
[SectionBrew1724]
wait "gblV_Brew_Status" value == 1724
print "@ 260 Check Brew Kettle Volume"
"gblS_swAllSwitch_Label_Text" value = "Stick to measure"
"gblSReportLabel_B1" value = "Record Brew Kettle Volume"
//............................................................
"gblS_Brewery_Top_2" value = "Stick to Measure the Brew Kettle Volume Volume.  You will be adding 2 Tablespoons per gallon of PBW to start cleaning later.  Record Brew Kettle Volume."
//background
"insp_1_LeftMiddle_B1"  background = 2
"gblS_swAllSwitch_Label_Text" background = 2
"gblSReportLabel_B1" background = 2
"gblVReport_B1" background = 2
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"insp_1_LeftMiddle_B1" visibility = visible
//................................................................................
wait "gblVReport_B1" value > 0
"gblVEndVolume_Water" value = "gblVReport_B1" value
vV_Vessel_End = "gblVReport_B1" value
"gblVCurrentBrewKettle_Volume" value = "gblVReport_B1" value
"gblVReport_B1" value = 0
"gblV_Brew_Status" value = 1726
[SectionBrew1725]
[SectionBrew1726]
wait "gblV_Brew_Status" value == 1726
vV_Vessel_End = "gblVCurrentBrewKettle_Volume" value
vV_PBW_TBS = vV_Vessel_End  * 2
vV_PBW_Cups = vV_PBW_TBS  / 12
"gblVPrecision1" value = vV_PBW_TBS 
vV_PBW_TBS = "gblVPrecision1" value
"gblVPrecision2" value = vV_PBW_Cups
vV_PBW_Cups = "gblVPrecision2" value
vSMsg = vV_PBW_TBS
vSMsg1 = " Tablespoons of PBW needed to be added to the MASH Tun and strirred in.   That would be "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_PBW_Cups
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Cups if easier.   Click PBW Added? when done."
 vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = " PBW Added?"
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 1727
[SectionBrew1727]
[SectionBrew1728]
wait "gblV_Brew_Status" value == 1728
"gblS_Brewery_Top_3" value = "Set the Plate Chiller, Trub Filter and Hoses to recycle into the Brew Kettle." 
"gblS_swAllSwitch_Label_Text" value = "Plate Chiller and Hoses Set?"
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
"gblV_Brew_Status" value = 1729
[SectionBrew1729]
[SectionBrew1730]
wait "gblV_Brew_Status" value == 1730
"MB_28_do_ManualAlarm_B1" state = false
"gblS_Brewery_Top_3" value = "Hoses, Plate Chiller and Trub filter and Manifold should be set to move the PBW soultion thru and back to the Brew Kettle. Set the Manifold to clean with PBW Solution." 
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 1731
[SectionBrew1731]
[SectionBrew1732]
wait "gblV_Brew_Status" value == 1732
"gblV_Water_Switch_Status_Water" value = 902
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
print 682
"gblV_Brew_Status" value = 1734
[SectionBrew1733]
[SectionBrew1734]
wait "gblV_Brew_Status" value == 1734

print "@ 686 Manifold Set Clean Plate Chiller"
"gblS_Brewery_Top_3" value = " The Manifold is set to recycle PBW from the Brew Kettle back to the Brew Kettle via the Plate Chiller and Fermentor hoses. This should be done for a minimum of one hour.   Click Red Pump?"  
"gblS_swAllSwitch_Label_Text" value = "Red Pump?"
//.........................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 1735
[SectionBrew1735]
[SectionBrew1736]
wait "gblV_Brew_Status" value == 1736
"sw_Status_BrewKettle_PBW" state = false
stop "tm_Clean_BK" 
"tm_Clean_BK" type = countup
"tm_Clean_BK" value = 00:00:00
start "tm_Clean_BK"
"MB_36_do_RedPump_B1" state = true
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"sw_Status_BrewKettle_PBW" state = true
"gblS_Brewery_Top_3" value = " The PBW is recyling from the Brew Kettle back to the Brew Kettle via the Plate Chiller and Fermentor hoses. This should be done for a minimum of one hour.   Wait.  Will Auto Advance"  
"gblS_swAllSwitch_Label_Text" value = "Wait. Will Auto Advance"
//Background
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 1736
[SectionBrew1735]
[SectionBrew1736]
wait "gblV_Brew_Status" value == 1736
"gblS_Brewery_Top_3" value = " Wait.  There is a short delay"
"gblS_swAllSwitch_Label_Text" value = "Wait. Will Auto Advance"
//Short Delay  10 seconds displayed 
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = 00:00:10
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"insp_1_LeftMiddle_B1" visibility = hidden
//...........................................................
[Ender_700_3]
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_3" value = "Wait"
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//BackGounds
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibilty
"gblS_Brewery_Top_2" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
print "Ender_700_3"
clear
"gblS_Script_Ended" value = "Ended: scrBrew700_3"
start "scrBrew700_4"
stop "scrBrew700_3"
```

## 47. scrBrew700_4

Starts by itself: No · User can start or stop it: Yes · 1034 lines

```text
// scrBrew700_4
//Created 08/03/2023 10:03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// broken in 2 from scrBrew700 03/31/2026 14:32
//  Modd\ified 03/31/2026 14:33
//testing
//"gblVCurrentBigMac_Volume" value = 34
//"gblVCurrentRadiator_Volume" value = 5.2
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: scrBrew700_4"
 //................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
new string vSMsg
new string vSMsg1
new string vS_Msg_Calc
new string vS_Msg_Calc_1
new value  vVCalc1
new value  vVCalc2
new string vS_TTL_Time
new value vV_Vessel_Start
new value vV_Vessel_End
new value vV_Vessel_Delta
new value vV_Gal_to_Fill
new value vV_Elasped_Seconds
new value vV_SPG_Rate
new value vV_Orginal_Rate
new value vV_DeltaRate
new value vV_PBW_TBS
new value vV_PBW_Cup
new time  vT_Total_Time
//new value vVBrewStatus
new value vVChoice
new value vVChoice_Alternate
new string vS_Vessel_From
new string vS_Pump
new string vS_Vessel_To
new string vS_Vessel_Measure
new value vV_Vessel_From
new value vV_Vessel_To
new value vV_Vessel_Measure
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
//.................................................
start "inscpt_scrAlarm"
sleep 4001
"gblSReportLabel_B1" value = "  "
"gblS_Brewery_Bottom_4" value = "  "
"sw_Control_BigMac_Element" state = false
"MB_61_10kWortOut_B1" visibility = hidden
"tmRadiator_B1" visibility = hidden
"tmBigMac_B1" visibility = hidden
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
if "sw_Status_BrewKettle_PBW" state == true
"gblV_Brew_Status" value = 2722
goto "SectionBrew2722"
else 
"gblV_Brew_Status" value = 2700
goto "SectionBrew2700"
endif
[SectionBrew2700]
wait "gblV_Brew_Status" value == 2700
print 95
"gblS_Brewery_Top_2" value = "The Brew Kettle is rinsed and ready for cleaning water and PBW  .  Wait for the Radiator or the Big Mac to reach cleaning temperature of 135 or Force the transfer.  You may enter\n1: Force Transfer from the Radiator\n2: Force Transfer from the Big Mac\n3: Wait for the Temperature "
"gblS_swAllSwitch_Label_Text" value = "Wait or Force?"
"gblSReportLabel_B1" value = "1: Force Radiator\n2: Force Big Mac"
"gblS_BrewName_B1" value = "3: Wait for the Temperature"
//BackGrounds
"gblSReportLabel_B1" background = 1
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 1
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3                                
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" value = 0
"gblVReport_B1"  precision = 0
"gblV_Gals_to_Fill" value = 5
vVCalc1 = 0
print 131
goto "LoopChoice_BK_Source"
print 133
[LoopChoice_BK_Source]
print 135
sleep 100
if "MB_58_10KRadiator_B1" value >= "gblV_RadiatorSetPoint_P1_B1" value
vVCalc1 = 1
print 138
print 136
goto "Choice_Set"
endif
if "MB_57_10kBigMac_B1" value >= "gblV_BigMacSetPointP1_B1" value
vVCalc1 = 2
print 145
goto "Choice_Set"
endif
if "gblVReport_B1" value == 1
vVChoice = 1
print 150
goto "Choice_Set"
endif
goto "SectionBrew2702"
if "gblVReport_B1" value == 2
print 149
vVChoice = 2
print 157
goto "Choice_Set"
endif
[Choice_Set]
print "@169 Choice Set"
if vVChoice == 1
goto "RadtoBk"
endif
if vVCalc1 == 1
goto "RadtoBk"
endif
if vVChoice == 2
goto "BMtoBk"
endif
if vVCalc1 == 2
goto "BMtoBk"
endif
if "gblVReport_B1" value == 3
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value =   "The Brew Kettle is rinsed and ready for cleaning water and PBW  .  Waiting for the Radiator or the Big Mac to reach cleaning temperature of 135 or you can still Force the transfer.  You may enter\n1: Force Transfer from the Radiator\n2: Force Transfer from the Big Mac\n3: Wait for the Temperature "
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblVReport_B1" value = 0
endif
if "gblVReport_B1" value > 3
"gblVReport_B1" value = 0
endif
print 185
goto "LoopChoice_BK_Source"
[RadtoBk]
//Radiator to Brew Kettle
print "@186 Radiator to BrewKettle "
"gblV_Rate" value = "gblv_SPG_Rad_to_BK_LM" value
"gblV_Vessel_From" value = 2
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 4
"glbV_Vessel_Adjust" value = 2
"gblV_Pump" value = 2
vS_Pump = "Green Pump"
"gblV_Isolation_Valve" value = 1
"gblV_Gals_to_Fill" value = 5
"gblV_Brew_Status" value = 2702
[BMtoBk]
//Big Mac to Brew Kettle
print "@199 Big Mac to BrewKettle "

"gblV_Rate" value = "gblV_SPG_BigMac_to_BK" value
"gblV_Vessel_From" value = 1
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 4
"gblV_Pump" value = 1
vS_Pump = "White Pump"
"gblV_Isolation_Valve" value = 1
"gblV_Gals_to_Fill" value = 5"gblV_Brew_Status" value = 2702
goto "Loop2700"
[SectionBrew2701]
[SectionBrew2702]
wait "gblV_Brew_Status" value == 2702
if vVCalc1 == 1
vVChoice = 1
print "@ 205 Rad at Temp"
"gblS_Brewery_Top_3" value = "Radiator is at Temperture.  Set Manifold to transfer from the Radiator to the Brew Kettle. We will only be adding 5 gallons.  Set Manifold?"
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
endif
if vVCalc1 == 2
vVChoice = 2
print "@ 212 Big Mac at Temp"
"gblS_Brewery_Top_3" value = "Big Mac is at Temperture.  Set Manifold to transfer from the Big Mac to the Brew Kettle. We will only be adding 5 gallons.  Set Manifold?"
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
endif
if "gblVReport_B1" value == 1
vVChoice = 1
print "@ 219 Force Radiator"
"gblS_Brewery_Top_3" value = "Selection 1: Force Transfer from Radiator.  Set Manifold to transfer from the Radiator to the Brew Kettle. We will only be adding 5 gallons.  Alternately, if you have any other source of cleaning water (DigiBoil) at temperature, you should consider it.  Set Manifold?"
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
endif
if "gblVReport_B1" value == 2
print "@ 227 Force Big Mac"
vVChoice = 2
"gblS_Brewery_Top_3" value = "Selection 2: Force Transfer from Big Mac.  Set Manifold to transfer from the Big Mac to the Brew Kettle. We will only be adding 5 gallons.  Alternately, if you have any other source of cleaning water (DigiBoil) at temperature, you should consider it.  Set Manifold?"
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
endif
//.........................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 2703
[SectionBrew2703]
[SectionBrew2702]
wait "gblV_Brew_Status" value == 2704
"sw_Advance_ BrewStatus" visibility = hidden
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait. Will Auto Advance"
"gblS_Brewery_Top_3" value = "Wait. Will Auto Advance"
//................................................
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"VGC_19_do_BrewKettleTangental_On_B1" state = true
"gblV_Brew_Status" value = 2706
[SectionBrew2705]
[SectionBrew2706]
wait "gblV_Brew_Status" value == 2706
vV_Gal_to_Fill = "gblV_Gals_to_Fill" value
//............................................................
"gblV_Brew_Status" value = 1000
[SectionBrew1000]
vSMsg = "Ready to transfer from the "
vSMsg1 = vS_vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the Brew Kettle.  The amount to transfer is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_to_Fill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.   Turn on "	
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Pump
vSMsg = vSMsg + vSMsg1
vSMsg1 = "?"	
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
vSMsg = vS_Pump
vSMsg1 = "?"	
vSMsg = vSMsg + vSMsg1
"gblS_swAllSwitch_Label_Text" value = vSMsg
//.........................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
wait "gblV_Brew_Status" value == 1001
"sw_Advance_ BrewStatus" visibility = hidden
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait. Will Auto Advance"
"gblS_Brewery_Top_3" value = "Wait. Will Auto Advance"
//................................................
print 345
"gblV_Brew_Status" value = 2710
"gblS_Water_Text" value = " transferred Hot Cleaning Water to the "
"gblVStartBrew" value = 2710
start "sub_3_scrCalculateSPG"
goto "SectionBrew2709"
// maybe get rid of down to 2709!


start "scrWater_Measure_T0_Vessel"
//.....................................................
"tmBottomRight_B1" type = countup
"tmBottomRight_B1" value = 00:00:00
"tmBottomRight_B1" displayname = "Cleaning to BK"
"tmBottomRight_B1"  visibility = visible
wait "gblV_Water_Flow_Wo1" value == 96
print "@ 279  Bottom and Water Timers Started"
start "tmBottomRight_B1"
vS_TTL_Time = "gblT_SetTimer_Water" value 
vSMsg = "The "
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is filling for "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_TTL_Time
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". This is planned to be "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_to_Fill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Gallons in the Brew Kettle to start Cleaning the Plate Chiller, Fermentor hoses and the Brew Kettle valves and the Red Pump from the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". Wait! Will Auto Advance.  You may OverRide."
"gblS_Brewery_Top_3" value = vSMsg
"gblS_Brewery_Bottom_3" value = "If the Temperature of the Cleaning water is less than 125 °F, consider lighting the Brew Kettle Burner.  If you do, Monitor the temperature and adjust the Burner!"
"gblS_swAllSwitch_Label_Text" value = "OverRide"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"sw_Advance_ BrewStatus"  visibility = hidden
"sw_Advance_Overide" visibility = visible
"gblV_Brew_Status" value = 2707
//Test...............................
if vB_Testing == true
stop "tm_Hidden_1"
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:10
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"tm_Water_Up" value = "gblT_SetTimer_Water" value
"tmBottomRight_B1" value = "gblT_SetTimer_Water" value
"tmRadiator_B1" value = "gblT_SetTimer_Water" value
"tmRadiator_B1" value = "gblT_SetTimer_Water" value
"tm_Water" value = 00:00:00
"gblV_Water_Flow_Wo1" value = 97
stop "tmBottomRight_B1"
endif
[Loop_2706]
sleep 100
if "gblV_Brew_Status" value ==  2708
"tm_Water" value = 00:00:00
"gblV_Water_Flow_Wo1" value = 97
stop "tmBottomRight_B1"
endif
if "gblV_Water_Flow_Wo1" value == 97
stop "tmBottomRight_B1"
goto "Exit_Fill_2706"
endif
goto "Loop_2706"
[Exit_Fill_2706]
stop "tmBottomRight_B1"
"gblV_Brew_Status" value = 2707
[SectionBrew2707]
wait "gblV_Brew_Status" value == 2710
start "sub_3_scrCalculateSPG"
[SectionBrew2708]
[SectionBrew2709]
print 433
[SectionBrew2710]
wait "gblV_Brew_Status" value == 2710
"MB_28_do_ManualAlarm_B1" state = true
"gblS_Brewery_Top_3" value = "Set the hoses on the fermentor Loop to recycle to the Brew Kettle.  Once all the hoses are set to recyle from the Brew Kettle back to the Brew Kettle via the Plate Chiller, Click Hoses Set?"
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 2711
[SectionBrew2711]
[SectionBrew2712]
wait "gblV_Brew_Status" value == 2712
"MB_28_do_ManualAlarm_B1" state = false
"gblS_Brewery_Top_3" value = "Set Manifold to recycle PBW from the Brew Kettle via the Plate Chiller back to the Brew Kettle.   Click Set Manifold?"
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 2713
[SectionBrew2713]

[SectionBrew2714]
wait "gblV_Brew_Status" value == 2714
"sw_Advance_Overide" visibility = hidden
//................................................
"gblV_Water_Switch_Status_Water" value = 903
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblV_Brew_Status" value = 2716
[SectionBrew2715]
[SectionBrew2716]
wait "gblV_Brew_Status" value == 2716
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"gblS_Brewery_Top_3" value = "Manifold is set. Ready to recycle cleaning water    Click Red Pump?"
"gblS_swAllSwitch_Label_Text" value = "Red Pump?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 2719
[SectionBrew2717]
[SectionBrew2718]
[SectionBrew2719]
[SectionBrew2720]
wait "gblV_Brew_Status" value == 2720
"MB_36_do_RedPump_B1" state = true
"VGC_5_do_FermentFill_On_B1" state = true
"gblS_Brewery_Top_3" value = "Add 2 Tablespoons of PBW and stir in.  Allow the PBW to cycle for a minimum of one hour.  We will later add more PBW from the Big Mac. Click PBW Added? "
"gblS_swAllSwitch_Label_Text" value = "PBW Added?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 2722
[SectionBrew2721]
[SectionBrew2722]
wait "gblV_Brew_Status" value == 2722
if "sw_Status_MLT_PBW" state == true
"gblV_Brew_Status" value = 2734
goto "SectionBrew2734"
endif
"gblS_Brewery_Top_3" value = "Wait for the Big Mac to reach temperature.  You may manually add additional water if you want as you will be transferring it all the the MASH Tun when it reaches Temperature.  Wait.  Will Auto Advance once at Temperature.  You cannot OverRide."
"gblS_swAllSwitch_Label_Text" value = "Wait for Temperature!"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
stop "tm_Hidden_1"
if vB_Testing == true
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:10
"gblS_swAllSwitch_Label_Text" value = "Wait: Testing. Will Advance!"
start "tm_Hidden_1"
endif
[Loop_Wait_Temp]
sleep 100
if vB_Testing == true
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"tm_Water" value = 00:00:00
"gblV_Brew_Status" value = 2724
goto "Exit_Loop_Wait"
endif
//Test.............................
if  "MB_57_10kBigMac_B1" value >= "gblV_BigMacSetPointP1_B1" value
"gblV_Brew_Status" value = 2724
goto "Exit_Loop_Wait"
endif
goto "Loop_Wait_Temp"
[SectionBrew2723]
[Exit_Loop_Wait]
[SectionBrew2724]

wait "gblV_Brew_Status" value == 2724
vV_Vessel_Start = "gblVCurrentMLT_Volume" value
vV_Vessel_Delta = vV_Vessel_End - vV_Vessel_Start 
"gblV_Gals_to_Fill" value = vV_Vessel_Delta
"gblS_Brewery_Top_3" value = "Set Manifold to fill the MLT from the Big Mac.  The maximum volume you are able to transfer is around 40 gallons due to the dead space of the Big Mac.  Click Set Manifold?"  
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 2725
[SectionBrew2725]
[SectionBrew2726]
wait "gblV_Brew_Status" value == 2726
"gblS_Brewery_Top_3" value = "Wait"
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//BackGounds
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibilty
"gblS_Brewery_Top_2" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
//................................................
"gblV_Water_Switch_Status_Water" value = 404
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblV_Brew_Status" value = 2728
[SectionBrew277]
[SectionBrew2728]
wait "gblV_Brew_Status" value == 2728
sleep 4001
"gblS_Brewery_Top_3" value = "Manifold is set. Ready to transfer cleaning water    Click White Pump?"
"gblS_swAllSwitch_Label_Text" value = "White Pump?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 2729
[SectionBrew2729]
[SectionBrew2730]
wait "gblV_Brew_Status" value == 2730
//............................................................
start "scrWater_Measure_T0_Vessel"
//.....................................................
"tmBottomRight_B1" type = countup
"tmBottomRight_B1" value = 00:00:00
"tmBottomRight_B1" displayname = "Cleaning to MLT"
"tmBottomRight_B1"  visibility = visible
wait "gblV_Water_Flow_Wo1" value == 96
print "@ 641  Bottom and Water Timers Started"
start "tmBottomRight_B1"
vS_TTL_Time = "gblT_SetTimer_Water" value 
vSMsg = "The MASH Tun is filling for "
vSMsg1 = vS_TTL_Time
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". This is about 40 Gallons to start Cleaning the MASH Tun, the HERMs Coil, The Blue Pump and Valves. Red Pump.  Wait! Will Auto Advance.  You may OverRide."
"gblS_Brewery_Top_3" value = vSMsg
"gblS_Brewery_Bottom_3" value = "If the Temperature of the Cleaning water is less than 125 °F, Consider upping the Radiator Set Point.  If you do, Monitor the temperature and adjust the Set Point!"
"gblS_swAllSwitch_Label_Text" value = "OverRide"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"sw_Advance_ BrewStatus"  visibility = hidden
"sw_Advance_Overide" visibility = visible
"gblV_Brew_Status" value = 707
[Loop_706]
sleep 100
//Test...............................
if vB_Testing == true
stop "tm_Hidden_1"
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:10
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"tm_Water_Up" value = "gblT_SetTimer_Water" value
"tmBottomRight_B1" value = "gblT_SetTimer_Water" value
"tmRadiator_B1" value = "gblT_SetTimer_Water" value
"tmRadiator_B1" value = "gblT_SetTimer_Water" value
"gblV_Water_Flow_Wo1" value = 97
"tm_Water" value = 00:00:00
endif
if "gblV_Brew_Status" value == 708
"gblV_Water_Flow_Wo1" value = 97
"tm_Water" value = 00:00:00
endif
if "gblV_Water_Flow_Wo1" value == 97
goto "Exit_Fill_706"
endif
goto "Loop_706"
[Exit_Fill_706]
stop "tmBottomRight_B1"
"gblV_Brew_Status" value = 2732
[SectionBrew2731]
[SectionBrew2732]
wait "gblV_Brew_Status" value == 2732
if "sw_Status_MLT_PBW" state == true
"gblV_Brew_Status" value = 2734
goto "SectionBrew2734"
endif
"gblS_swAllSwitch_Label_Text" background = 2
"gblS_swAllSwitch_Label_Text" value = "Measure the Mash Tun"
"gblS_Brewery_Top_2" value = "The Mash Tun should have been precleaned.  If not, do it before preceding.  Use the Fire Hose to pre clean if it has not been done."
//Inspectors
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//Background
"gblSReportLabel_B1" background = 2
"gblVReport_B1" background = 2
"gblS_Brewery_Top_2" background = 1
//Visibilty
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 1
"gblVReport_B1" value = -99
"gblSReportLabel_B1" visibility = visible
wait "gblVReport_B1" value > -99
"gblVCurrentMLT_Volume" value = "gblVReport_B1" value
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden 
vV_Vessel_End = "gblVCurrentMLT_Volume" value
vV_PBW_TBS = vV_Vessel_End  * 2
vV_PBW_Cups = vV_PBW_TBS  / 12
"gblVPrecision1" value = vV_PBW_TBS 
vV_PBW_TBS = "gblVPrecision1" value
"gblVPrecision2" value = vV_PBW_Cups
vV_PBW_Cups = "gblVPrecision2" value
vSMsg = vV_PBW_TBS
vSMsg1 = " Tablespoons of PBW needed to be added to the MASH Tun and strirred in.   That would be "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_PBW_Cups
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Cups if easier.   Click PBW Added? when done."
 vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = " PBW Added?"
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 2733
[SectionBrew2733]
[SectionBrew2734]
wait "gblV_Brew_Status" value == 2734
"gblS_Brewery_Top_3" value = "Set Manifold to recycle the cleaning water thru the HERMs Coil.  This should be done for a minimum of one hour.  Click Set Manifold?"  
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 2735
[SectionBrew2735]
[SectionBrew2736]
wait "gblV_Brew_Status" value == 2736
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_3" value = "Wait"
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//BackGounds
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibilty
"gblS_Brewery_Top_2" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
//................................................
"gblV_Water_Switch_Status_Water" value = 299
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblV_Brew_Status" value = 2738
[SectionBrew2737]
[SectionBrew2738]
wait "gblV_Brew_Status" value == 2738
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_3" value = "Wait"
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//BackGounds
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibilty
"gblS_Brewery_Top_2" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
"gblS_Brewery_Top_3" value = "Manifold is set. Ready to clean the Mash Tun and the HERMs Coil.    Click Blue Pump?"
"gblS_swAllSwitch_Label_Text" value = "Blue Pump?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 2739
[SectionBrew2739]
[SectionBrew2740]
wait "gblV_Brew_Status" value == 2740
"sw_Advance_ BrewStatus" visibility = hidden
"MB_33_do_BluePump_B1" state = true
stop "tmTopRight_B1"
"tmTopRight_B1" type = countdown
"tmTopRight_B1" value = 01:00:00
"tmTopRight_B1" displayname = "Recycle MASH HERMs PBW"
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 01:00:00
"tm_HopTimer_WO1" displayname = "Recycle MASH HERMs PBW"
start "tmTopRight_B1" 
start "tm_HopTimer_WO1"
"tmTopRight_B1" visibility = visible
"gblS_Brewery_Bottom_3" value = "Recyle HERMs Clean for at least an Hour!"
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
[SectionBrew2741]
[SectionBrew2742]
[Ender_700_4]
clear
"sw_Flow_Jumpto800" state = true
"gblS_Script_Ended" value = "Ended: scrBrew700_4"
start "scrBrew800"
stop "scrBrew700_4"
```

