# OakBarn Brewery BruControl Scripts, Part 1 of 5

> **Read only when OakBarn Brewery says so, or after asking permission** (Rule 16.8). The one standing exception: these
> Scripts are the basis for the Skynet Process Templates that are not finished yet. They are kept exactly as BruControl saved
> them (BruControl Script language, not Skynet Process code), so they are not brought up to the Skynet Rules.

Back to the [list of all Scripts](README.md).

## 1. scrStart0_0

Starts by itself: No · User can start or stop it: Yes · 380 lines

```text
//scrStart0_0  
// Vesion: 261002_09:35
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//03/08/2026 20:52
// Start Brew Day
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
"insp_MIT" visibility = visible
//........................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
"insp_MIT" visibility = hidden
//........................................
//Big Mac Element
print "@ 19 kill Big Mac"
"sw_Control_BigMac_Element" state = false
"MB_17_do_BigMac2Contactor_Wo1" state = false
"MB_05_PWM_BigMacElement2_WO1" enabled = false
//Radiator Body Element
"sw_Control_Radiator_Element" state = false
"MB_08_PWM_Radiator_WO1" enabled = false
//..............
"MB_08_Hys_RadiatorElement_Wo1" enabled = false
//RIMs Element
"sw_Control_RIMs_Element" state = false
"MB_14_do_RIMs_Contactor_Heat" state = false
"MB_09_PWM_RIMs_Heat" enabled = false
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
//.................................
"gblS_BrewName_B1" value = "Start a new Brew Day"
"gblS_Script_Started" value = "Started: scrStart0_0"
"gblS_Script_Ended" value = "Ended: scrStart0_0"
"gblS_Inter_Script" value = " -- "
//.................................................
start "sub_Stop_Testing"
"sw_Advance_ BrewStatus" state = false
"gblT_SetTimer" visibility = hidden
"sw_Advance_Timer" visibility = hidden
"sw_Reset_Timer_Zero" visibility = hidden
"gblV_Brew_Status" visibility = hidden
//.................................................
"tmTopRight_B1" type = countup
"gblS_BrewName_B1" value = "Start a new Brew Day"
"gblS_Inter_Script" value = "@ 51 in scrStart0_0 > start A:strt_1_Set_Elements_Enabled"
start "strt_1_Set_Elements_Enabled"
"gblS_Bottom_Text" value = "Enabling Elements for a new Brew Day"
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = true
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
sleep 100
wait "sw_Running_Script_A" state  == false
//....................................................
"gblS_Inter_Script" value = "@ 74  in scrStart0_0 > start B:strt_2__Reset_General"
"gblTValveDelay" value = 00:00:07
start "strt_2__Reset_General"
"gblS_Top_Text" value = "Starting General Reset for a new Brew Day"
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
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
sleep 100
wait "sw_Running_Script_B" state == false
"tmTopRight_B1" value = 00:00:00
"tmTopRight_B1" displayname = "Pre Brew Setup"
start "tmTopRight_B1"
// Reset the Batch and Hops to a new Brew
start "looper_scrBackground_Hops"
"gblS_Inter_Script" value = "@ 100  in scrStart0_0 > start C:strt_3_Reset_Batch "
start "strt_3_Reset_Batch "
"gblS_Top_Text" value = "Starting Batch Data Reset for a new Brew Day"
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
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
sleep 100
wait "sw_Running_Script_C" state  == false
//......................................................
"gblS_Inter_Script" value = "@ 122 in scrStart0_0  > start  D:strt_4_Reset_Hops"
start "strt_4_Reset_Hops"
"gblS_Bottom_Text" value = "Reseting Hop Data for a new Brew Day"
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = true
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
sleep 100
wait "sw_Running_Script_D" state  == false
//........................................
"gblS_Inter_Script" value = "@ 144 in scrStart0_0 >  start  E:strt_5_Reset_Reporting"
start "strt_5_Reset_Reporting"
"gblS_Top_Text" value = "Starting Reporting Data Reset for a new Brew Day"
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
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
sleep 100
wait "sw_Running_Script_E" state  == false
//..........................................
"gblS_Inter_Script" value = "@ 166 in scrStart0_0 >  start  F:strt_scrEndAllscripts"
start "strt_scrEndAllscripts"
"gblS_Bottom_Text" value = "Insuring all Action Scripts are stopped."
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = true
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
sleep 100
wait "sw_Running_Script_F" state  == false
//..............................................
show workspace "B1 Brewery"
"gblS_BeerName_R1" value = "New Brew"
goto "SectionBrew1000"
[SectionBrew1000]
"gblV_Brew_Status" value = 1000
print "@ 189 SectionBrew1000"
wait "gblV_Brew_Status" value == 1000
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_swAllSwitch_Label_Text" value = "1 = Normal : 2 = Testing"
"gblSReportLabel_B1" value = "Select: 1 = Normal Brew Day\n2 = Testing"
//............................................................
"gblS_Brewery_Top_2" value = "Select 1 for a Regular Brew Day or 2 if you are Testing the Script.  The Testing provides a sample Beer Profile that tests all the scripts except those dealing with BeerSmith XML importing."
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
"gblS_BrewName_B1" value = "Testing or Normal?"
//.........................................
//Inspector_Black
"gblV_Set_BackGround_Middle_Time" value = 1
start "inscpt_scrSet_Middle_Backgrounds"
//background
//.........................................
"gblS_swAllSwitch_Label_Text" background = 2
"gblSReportLabel_B1" background = 2
"gblVReport_B1" background = 2
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
//..........................................................................................
[Wrong_Loop_Test_Select]
wait "gblVReport_B1" value > 0
[Loop_Test_Select]
	if "gblVReport_B1" value == 1
		"sw_Status_Testing" state = false
		goto "Set_Testing"
endif
		if "gblVReport_B1" value == 2
		"sw_Status_Testing" state = true
		goto "Set_Testing"
		endif
	if "gblVReport_B1" value > 2
	"gblVReport_B1" value = 0
	"gblS_swAllSwitch_Label_Text" background = 1
	sleep 800
	"gblS_swAllSwitch_Label_Text" background = 2
	"gblS_swAllSwitch_Label_Text" background = 1
	sleep 800
	"gblS_swAllSwitch_Label_Text" background = 2
	goto "Wrong_Loop_Test_Select"
	endif
goto "Loop_Test_Select"
[Set_Testing]
print "@245 Set Testing"
start "inscpt_scr_Inner_Blue"
vB_Testing = "sw_Status_Testing" state
print "@ 248 vB_Testing ="
print vB_Testing
//.........................
if vB_Testing == true
	start "sub_Start_Testing"
	sleep 100
	"gblTValveDelay" value = 00:00:01
	"gblS_BrewName_B1" value = "Test Brew Day:  Valve Delay set to 00:00:01"
	start "inscpt_scrAlarm"
	wait "sw_Running_Alarm_Clear" state == false
	goto "Test_Mode"
else
	start "sub_Stop_Testing"
	sleep 100
	"gblTValveDelay" value = 00:00:07
	"gblS_BrewName_B1" value = "Regular Normal Brew Day:  Valve Delay set to 00:00:07"
	goto "Normal"
	endif
//.........................
//.........................
//..........................................
//..........................................
[Normal]
"gblV_Brew_Status" value = 1001
start "inscpt_scrBasicStart"
[SectionBrew1001]
wait "gblV_Brew_Status" value == 1001
print "@ 278 Normal Brew Day"
"sw_Status_Testing" state = false
"gblS_Top_Text" value =  " Click Start Brew switch to start the Brew.  This is normally done the night before to fill two vessels with tap or distilled water depending on the Brew Profile.  This will start the PreBrew process and allow you to fill the Vessels and Import a BeerSmith XML File or Manually add Brew Profile."
"gblS_BrewName_B1" value = "Set Up New Brew Day"
"gblS_Bottom_Text" value = "Either a BeerSmith XML File can be imported or a Manual Recipe can be entered."
"gblS_Water_Text" value  =  "Start Brew"
//...........................................
//...........................................
start "inscpt_scrAdvancewithSwitch"
sleep 100
wait "sw_Running_Advance_with_Switch" state ==  false
goto "End_scrStart"
//........................................
[Test_Mode]
start "inscpt_scrBasicStart"
print "@ 297 Test_Mode"
"gblV_Brew_Status" value = 1002
[SectionBrew1002]
wait "gblV_Brew_Status" value == 1002
"gblS_Brewery_Top_1" value = "Normally a Beer Profile would be Imported with a BeerSmith XML file or a Beer Profile would be entered manually. In this Test Example, this is an Ale and had no distilled water.  The Node Red Import BeerSmith XML file or a Beer Profile is skipped with a TEST receipe in it's place. "
//...........................
"gblS_Brewery_Bottom_3"  value = "Hops, Drop Times, Grain Weight, Volumes and Strike and Mash Temperatures are set to match an existing real Beer Profile (with a few added Hops to test the Scripts.  Fill Times would be correct but are accelerated for Testing as if the elasped time had occured."
"gblS_BrewName_B1" value = "Test Mode"
"gblS_swAllSwitch_Label_Text" value = "Wait Will Auto Advance"
//Background
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Top_1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
//............................................................
// 30 Second Delay
"gblV_Delay_Seconds" value = 30
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//.................................
"gblV_Brew_Status" value = 1003
[SectionBrew1003]
wait "gblV_Brew_Status" value == 1003
//............................................................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Top_Text" value = "Testing: Click Start Brew switch to start the Brew.  This is normally done the night before to fill two vessels with tap or distilled water depending on the Brew Profile."
//...........................
"gblS_Bottom_Text" value = "Testing: Sometimes a Choice that would not be in a Real Brew Day will pop up to allow you to contine.  A good example is that  when the Boil Process starts, you can force the Water to Boil in the Brew Kettle.  Normally this is done by Temperature during a normal Brew Day."
"gblS_Water_Text" value  =  "Start Brew"
"gblS_BrewName_B1" value = "Test Mode"
//...........................................
//...........................................
start "inscpt_scrAdvancewithSwitch"
sleep 100
wait "sw_Running_Advance_with_Switch" state ==  false
"gblV_Brew_Status" value = 1004
[SectionBrew1004]
print "@357 SectionBrew1004"
wait "gblV_Brew_Status" value == 1004
"gblS_Brewery_Top_1" value = "Reseting the Beer Profile for testing.  This a 22 gallon batch of my favorite beer with some Hop additions that are not real but help test the scripts."
//............................................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
wait "sw_Running_Short_Delay_Time" state == false
//........................................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" background = 3
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_2" value =  "Test Mode:  Times are accelerated!  Be careful.  If gblV_Node_Red_ImportedInterfaces are connected, things work!"
//........................................
sleep 100
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_2" visibility = hidden
goto "End_scrStart"
[End_scrStart]
print "@ 389 End"
"gblS_Brewery_Top_3" value = "Wait!  The Brew will start shortly"
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
sleep 2000
"gblS_Script_Ended" value = "Ended: scrStart0_0"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_1"
stop "scrStart0_0"
```

## 2. xscrStart0_0

Starts by itself: No · User can start or stop it: No · 385 lines

```text
//scrStart0_0  
// Vesion: 261002_09:35
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//03/08/2026 20:52
// Start Brew Day
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
"insp_MIT" visibility = visible
//........................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
"insp_MIT" visibility = hidden
//........................................
//Big Mac Element
print "@ 19 kill Big Mac"
"sw_Control_BigMac_Element" state = false
"MB_17_do_BigMac2Contactor_Wo1" state = false
"MB_05_PWM_BigMacElement2_WO1" enabled = false
//Radiator Body Element
"sw_Control_Radiator_Element" state = false
"MB_08_PWM_Radiator_WO1" enabled = false
//..............
"MB_08_Hys_RadiatorElement_Wo1" enabled = false
//RIMs Element
"sw_Control_RIMs_Element" state = false
"MB_14_do_RIMs_Contactor_Heat" state = false
"MB_09_PWM_RIMs_Heat" enabled = false
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
//.................................
"gblS_BrewName_B1" value = "Start a new Brew Day"
"gblS_Script_Started" value = "Started: scrStart0_0"
"gblS_Script_Ended" value = "Started: scrStart0_0"
"gblS_Inter_Script" value = " -- "
//.................................................
start "sub_Stop_Testing"
"sw_Advance_ BrewStatus" state = false
"gblT_SetTimer" visibility = hidden
"sw_Advance_Timer" visibility = hidden
"sw_Reset_Timer_Zero" visibility = hidden
"gblV_Brew_Status" visibility = hidden
//.................................................
"tmTopRight_B1" type = countup
"gblS_BrewName_B1" value = "Start a new Brew Day"
"gblS_Inter_Script" value = "@ 51 in scrStart0_0 > start A:strt_1_Set_Elements_Enabled"
start "strt_1_Set_Elements_Enabled"
"gblS_Bottom_Text" value = "Enabling Elements for a new Brew Day"
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = true
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
sleep 100
wait "sw_Running_Script_A" state  == false
//....................................................
"gblS_Inter_Script" value = "@ 74  in scrStart0_0 > start B:strt_2__Reset_General"
"gblTValveDelay" value = 00:00:07
start "strt_2__Reset_General"
"gblS_Top_Text" value = "Starting General Reset for a new Brew Day"
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
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
sleep 100
wait "sw_Running_Script_B" state == false
"tmTopRight_B1" value = 00:00:00
"tmTopRight_B1" displayname = "Pre Brew Setup"
start "tmTopRight_B1"
// Reset the Batch and Hops to a new Brew
start "looper_scrBackground_Hops"
"gblS_Inter_Script" value = "@ 100  in scrStart0_0 > start C:strt_3_Reset_Batch "
start "strt_3_Reset_Batch "
"gblS_Top_Text" value = "Starting Batch Data Reset for a new Brew Day"
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
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
sleep 100
wait "sw_Running_Script_C" state  == false
//......................................................
"gblS_Inter_Script" value = "@ 122 in scrStart0_0  > start  D:strt_4_Reset_Hops"
start "strt_4_Reset_Hops"
"gblS_Bottom_Text" value = "Reseting Hop Data for a new Brew Day"
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = true
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
sleep 100
wait "sw_Running_Script_D" state  == false
//........................................
"gblS_Inter_Script" value = "@ 144 in scrStart0_0 >  start  E:strt_5_Reset_Reporting"
start "strt_5_Reset_Reporting"
"gblS_Top_Text" value = "Starting Reporting Data Reset for a new Brew Day"
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
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
sleep 100
wait "sw_Running_Script_E" state  == false
//..........................................
"gblS_Inter_Script" value = "@ 166 in scrStart0_0 >  start  F:strt_scrEndAllscripts"
start "strt_scrEndAllscripts"
"gblS_Bottom_Text" value = "Insuring all Action Scripts are stopped."
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = true
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
sleep 100
wait "sw_Running_Script_F" state  == false
//..............................................
show workspace "B1 Brewery""gblS_BeerName_R1" value = "New Brew"
goto "SectionBrew1000"
[SectionBrew1000]
"gblV_Brew_Status" value = 1000
print "@ 189 SectionBrew1000"
wait "gblV_Brew_Status" value == 1000
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_swAllSwitch_Label_Text" value = "1 = Normal : 2 = Testing"
"gblSReportLabel_B1" value = "Select: 1 = Normal Brew Day\n2 = Testing"
//............................................................
"gblS_Brewery_Top_2" value = "Select 1 for a Regular Brew Day or 2 if you are Testing the Script.  The Testing provides a sample Beer Profile that tests all the scripts except those dealing with BeerSmith XML importing."
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
"gblS_BrewName_B1" value = "Testing or Normal?"
//.........................................
//Inspector_Black
"gblV_Set_BackGround_Middle_Time" value = 1
start "inscpt_scrSet_Middle_Backgrounds"
//background
//.........................................
"gblS_swAllSwitch_Label_Text" background = 2
"gblSReportLabel_B1" background = 2
"gblVReport_B1" background = 2
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
//..........................................................................................
[Wrong_Loop_Test_Select]
wait "gblVReport_B1" value > 0
[Loop_Test_Select]
	if "gblVReport_B1" value == 1
		"sw_Status_Testing" state = false
		goto "Set_Testing"
endif
		if "gblVReport_B1" value == 2
		"sw_Status_Testing" state = true
		goto "Set_Testing"
		endif
	if "gblVReport_B1" value > 2
	"gblVReport_B1" value = 0
	"gblS_swAllSwitch_Label_Text" background = 1
	sleep 800
	"gblS_swAllSwitch_Label_Text" background = 2
	"gblS_swAllSwitch_Label_Text" background = 1
	sleep 800
	"gblS_swAllSwitch_Label_Text" background = 2
	goto "Wrong_Loop_Test_Select"
	endif
goto "Loop_Test_Select"
[Set_Testing]
print "@245 Set Testing"
start "inscpt_scr_Inner_Blue"
vB_Testing = "sw_Status_Testing" state
print "@ 248 vB_Testing ="
print vB_Testing
//.........................
if vB_Testing == true
	start "sub_Start_Testing"
	sleep 100
	"gblTValveDelay" value = 00:00:01
	"gblS_BrewName_B1" value = "Test Brew Day:  Valve Delay set to 00:00:01"
	start "inscpt_scrAlarm"
	wait "sw_Running_Alarm_Clear" state == false
	goto "Test_Mode"
else
	start "sub_Stop_Testing"
	sleep 100
	"gblTValveDelay" value = 00:00:07
	"gblS_BrewName_B1" value = "Regular Normal Brew Day:  Valve Delay set to 00:00:07"
	goto "Normal"
	endif
//.........................
//.........................
"gblV_Brew_Status" value = 1001
[SectionBrew1001]
wait "gblV_Brew_Status" value == 1001
//..........................................
//..........................................
[Normal]
"gblV_Brew_Status" value = 1001
start "inscpt_scrBasicStart"
[SectionBrew1001]
wait "gblV_Brew_Status" value == 1001
print "@ 278 Normal Brew Day"
"sw_Status_Testing" state = false
"gblS_Top_Text" value =  " Click Start Brew switch to start the Brew.  This is normally done the night before to fill two vessels with tap or distilled water depending on the Brew Profile.  This will start the PreBrew process and allow you to fill the Vessels and Import a BeerSmith XML File or Manually add Brew Profile."
"gblS_BrewName_B1" value = "Set Up New Brew Day"
"gblS_Bottom_Text" value = "Either a BeerSmith XML File can be imported or a Manual Recipe can be entered."
"gblS_Water_Text" value  =  "Start Brew"
//...........................................
//...........................................
start "inscpt_scrAdvancewithSwitch"
sleep 100
wait "sw_Running_Advance_with_Switch" state ==  false
goto "End_scrStart"
//........................................
[Test_Mode]
start "inscpt_scrBasicStart"
print "@ 297 Test_Mode"
"gblV_Brew_Status" value = 1002
[SectionBrew1002]
wait "gblV_Brew_Status" value == 1002
"gblS_Brewery_Top_1" value = "Normally a Beer Profile would be Imported with a BeerSmith XML file or a Beer Profile would be entered manually. In this Test Example, this is an Ale and had no distilled water.  The Node Red Import BeerSmith XML file or a Beer Profile is skipped with a TEST receipe in it's place. "
//...........................
"gblS_Brewery_Bottom_3"  value = "Hops, Drop Times, Grain Weight, Volumes and Strike and Mash Temperatures are set to match an existing real Beer Profile (with a few added Hops to test the Scripts.  Fill Times would be correct but are accelerated for Testing as if the elasped time had occured."
"gblS_BrewName_B1" value = "Test Mode"
"gblS_swAllSwitch_Label_Text" value = "Wait Will Auto Advance"
//Background
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Top_1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
//............................................................
// 30 Second Delay
"gblV_Delay_Seconds" value = 30
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//.................................
"gblV_Brew_Status" value = 1003
[SectionBrew1003]
wait "gblV_Brew_Status" value == 1003
[SectionBrew1003]
wait "gblV_Brew_Status" value == 1003
//............................................................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Top_Text" value = "Testing: Click Start Brew switch to start the Brew.  This is normally done the night before to fill two vessels with tap or distilled water depending on the Brew Profile."
//...........................
"gblS_Bottom_Text" value = "Testing: Sometimes a Choice that would not be in a Real Brew Day will pop up to allow you to contine.  A good example is that  when the Boil Process starts, you can force the Water to Boil in the Brew Kettle.  Normally this is done by Temperature during a normal Brew Day."
"gblS_Water_Text" value  =  "Start Brew"
"gblS_BrewName_B1" value = "Test Mode"
//...........................................
//...........................................
start "inscpt_scrAdvancewithSwitch"
sleep 100
wait "sw_Running_Advance_with_Switch" state ==  false
"gblV_Brew_Status" value = 1004
[SectionBrew1004]
print "@357 SectionBrew1004"
wait "gblV_Brew_Status" value == 1004
"gblS_Brewery_Top_1" value = "Reseting the Beer Profile for testing.  This a 22 gallon batch of my favorite beer with some Hop additions that are not real but help test the scripts."
//............................................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
wait "sw_Running_Script_C" state == false
wait "sw_Running_Short_Delay_Time" state == false
//........................................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" background = 3
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_2" value =  "Test Mode:  Times are accelerated!  Be careful.  If gblV_Node_Red_ImportedInterfaces are connected, things work!"
//........................................
sleep 100
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_2" visibility = hidden
goto "End_scrStart"
[End_scrStart]
print "@ 389 End"
"gblS_Brewery_Top_3" value = "Wait!  The Brew will start shortly"
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
sleep 2000
"gblS_Script_Ended" value = "Ended: scrStart0_0"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_1"
stop "scrStart0_0"
```

## 3. scrBrew0_1

Starts by itself: No · User can start or stop it: Yes · 288 lines

```text
//scrBrew0_1  
//Version: 261002_10:29
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
//Modified  02/17/2026 08:50
//"tm_Water" value = 00:00:00
//Starts Brew on Pre Brew Day
//................................
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
stop "looper_scrBackground_Hops"
//.........................
"gblS_Script_Started" value = "Started:  scrBrew0_1" 
if vB_Testing == true
"gblS_Inter_Script" value = " -- "
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
new value vV_Strike_SetPoint_Plus
new value vV_Strike_Calculated_Volume
new value vV_Lager_or_Ale
new value vV_Strike_Status
new value vV_Number_Strike_Vessel
new value vV_First_Strike_Vessel
new string vS_First_Strike_Vessel
new value vV_2nd_Strike_Vessel
new string vS_2nd_Strike_Vessel
new bool vB_Mixed_Strike
new string vS_Strike_Water
vV_Strike_Calculated_Volume = "gblVStrikeVolume" value 
vV_Strike_SetPoint_Plus = "gblV_Desired_Strike" value + "gblV_StrikeOffset" value 
"gblV_RadiatorSetPoint_P1_B1" value = vV_Strike_SetPoint_Plus
"gblV_BigMacSetPointP1_B1" value = vV_Strike_SetPoint_Plus
"gblV_Number_Strike_Vessels" visibility = hidden
"gblV_Strike_Vessel_1" visibility = hidden
"gblV_Strike_Vessel_2" visibility = hidden
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblV_Saved_Brew_Status" value = 0
"sw_Status_DeadSpace_Radiator" state = false
if "gblVCurrentRadiator_Volume" value > 0
"sw_Status_DeadSpace_Radiator" state = true
endif
"gblVScriptFlow" value = 0
"sw_Advance_HopsCalc" visibility = hidden
"sw_Flow_ByBass_Hop_Calc" visibility = hidden
//..........................................................................................
"inspHopOz" visibility = hidden
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"sw_Advance_ BrewStatus" background = 1
//..........................................................................................
//........................................................................
"gblS_Hop_Screen_Txt" visibility = hidden
"insp_BatchHide" visibility = hidden
"gblS_Brewery_Top_3" value = "Wait! Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
//..............................
//BackGround
"sw_Advance_ BrewStatus" background = 1
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_Brewery_Top_3" background = 3
//Visibility 
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Bottom_3" visibility = hidden
"gblV_Water_Flow_Wo1" value = 0
//............................................................................
 //....................................................
// B1 Brewery Left visibility ......................
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
 "gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
//Set where to start
"gblV_Brew_Status" value = 0
//"gblVScriptFlow" value =  23
 goto  "SectionBrew0"
//....................................................
[SectionBrew0]
show workspace "B1 Brewery"
"gblS_Brewery_Top_3" value = " "
wait "gblV_Brew_Status" value == 0
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"sw_Advance_ BrewStatus" visibility = hidden
"tmBrewDay_B1" displayname = "Pre Brew"
"tmBrewDay_B1" type = countup
"tmBrewDay_B1" value = 00:00:00
"tmBrewDay_B1" visibility = visible
start "tmBrewDay_B1"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_2" value = "You have a choice to make depending on several factors for the Chilling Source after the Boil.  How cold is the tap water?   What temperature are you going to pitch the WORT?  Do you have the Glycol to use for coolling Tap Water?  Do you have ICE for chilled water to cool the WORT?  "
"gblS_Brewery_Bottom_4"  value = "You need to make a choice.  Use Just Tap Water?  ICED Water Chilled Tap Water?   Only ICED Water?   Glycol Chilled Tap Water? Glycol chilled ICED Water? Tap Water and Ice Chilled Tap are the most common."
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//background
"gblVReport_B1" background = 1
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"insp_1_LeftMiddle_B1" background = 1
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"MB_58_10KRadiator_B1" visibility = visible
"gblV_RadiatorSetPoint_P1_B1" visibility = visible
"MB_57_10kBigMac_B1" visibility = visible
"gblV_BigMacSetPointP1_B1" visibility = visible
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Think!"
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
//....................................................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Bottom_4" visibility = hidden
//....................................................................
"gblS_Brewery_Top_2" value = "You need to make a choice for the Chilling Source.  Door # 1: Use Just Tap Water, Door # 2 ICED Water Chilled Tap Water, Door # 3 Only ICED Water, Door # 4 Glycol Chilled Tap Water, Door # 5 Glycol chilled ICED Water. Enter 1,2 ,3, 4 or 5."
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"gblS_Brewery_Top_2" background = 1 
goto "LoopSkippedWP1"
[Skipperwp1]
"gblS_Brewery_Top_2" background = 3
"gblS_Brewery_Top_2" value = "Only 1 to 5 Allowed!  Door # 1: Use Just Tap Water, Door # 2 ICED Water Chilled Tap Water, Door # 3 Only ICED Water, Door # 4 Glycol Chilled Tap Water, Door # 5 Glycol chilled ICED Water. Enter 1,2 ,3, 4 or 5."
[LoopSkippedWP1]
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
//Switch
"gblS_swAllSwitch_Label_Text" value = "Make your Choice"
"gblS_swAllSwitch_Label_Text" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblSReportLabel_B1" value = "Door # ?"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
wait  "gblVReport_B1" value > 0
if "gblVReport_B1" value == 1
"gblS_Brewery_Bottom_3" value = "Only tap water will be used as the chilling source. Click Message Read? to advance."
"gblS_Brewery_Top_2" value =  "Click Message Read? to advance."
goto "EndChoice"
endif
if "gblVReport_B1" value == 2
"gblS_Brewery_Bottom_3" value = "An ICE batch will be recycyled to chill tap water that will be used as the chilling source.  Prepare the Ice Bath to be ready at the end of Boil.  Click Message Read? to advance."
"gblS_Brewery_Top_2" value =  "Click Message Read? to advance."
goto "EndChoice"
endif
if "gblVReport_B1" value == 3
"gblS_Brewery_Bottom_3" value = "An ICE batch will be recycyled and will be used as the chilling source.  Prepare the Ice Bath to be ready at the end of Boil and set as the Chilling Source. Click Message Read? to advance."
"gblS_Brewery_Top_2" value =  "Click Message Read? to advance."
goto "EndChoice"
endif
if "gblVReport_B1" value == 4
"gblS_Brewery_Bottom_3" value = "Glycol recycyled to chill tap water that will be used as the chilling source.  Make sure the Glycol is set up. Click Message Read? to advance."
"gblS_Brewery_Top_2" value =  "Click Message Read? to advance."
goto "EndChoice"
endif
if "gblVReport_B1" value == 5
"gblS_Brewery_Bottom_3" value = "Glycol recycyled to chill the ICE batch will be recycyled and will be used as the chilling source.  Prepare the Ice Bath to be ready at the end of Boil and set as the Chilling Source.  Check Glycol is prepared. Click Message Read? to advance."
"gblS_Brewery_Top_2" value =  "Click Message Read? to advance."
goto "EndChoice"
endif
if "gblVReport_B1" value >  5
goto "Skipperwp1"
endif
if "gblVReport_B1" value <  0
goto "Skipperwp1"
endif
goto "LoopSkippedWP1"
[EndChoice]
"gblS_swAllSwitch_Label_Text" value = "Message Read?" 
"RP_v_CoolingSource" value = "gblVReport_B1" value
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Backgrounds
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"sw_Advance_ BrewStatus" background = 1
"gblS_Brewery_Bottom_3" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
wait  "gblV_Brew_Status" value == 1
"gblV_Brew_Status" value =  4
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait" 
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
[SectionBrew1]
[SectionBrew2]
[SectionBrew3]
[SectionBrew4]
wait "gblV_Brew_Status" value == 4
"gblS_Brewery_Top_3" value = "Wait!  Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance" 
//Inspector Blue
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//Backgrounds
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
sleep 2000
if vB_Testing == false
"gblS_Inter_Script" value = "@ 291 in scrBrew0_1 > start: scrBrew0_1a_Normal_Brew"
start "scrBrew0_1a_Normal_Brew"
goto "Ender_scrBrew0_1"
endif
if vB_Testing == true
"gblS_Inter_Script" value = "@ 296 in scrBrew0_1 > start: scrBrew0_1b_Testing_Brew"
start "scrBrew0_1b_Testing_Brew"
goto "Ender_scrBrew0_1"
endif
[Ender_scrBrew0_1]
"gblS_Script_Ended" value = "Ended: scrBrew0_1" 
if vB_Testing == true
sleep 4001
endif
clear
stop "scrBrew0_1"
```

## 4. scrBrew0_1a_Normal_Brew

Starts by itself: No · User can start or stop it: Yes · 246 lines

```text
//scrBrew0_1a_Normal_Brew 
//Version: 261002_10:43
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Called from @ 291 in scrBrew0_1
// scrBrew0 divided up again on 260916
//Modified  02/17/2026 08:50
//Starts Brew on Normal Brew Day
//................................
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
stop "looper_scrBackground_Hops"
//.........................
"gblS_Script_Started" value = "Started:  scrBrew0_1a_Normal_Brew"
if vB_Testing == true
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
new value vV_Strike_SetPoint_Plus
new value vV_Strike_Calculated_Volume
new value vV_Lager_or_Ale
new value vV_Strike_Status
new value vV_Number_Strike_Vessel
new value vV_First_Strike_Vessel
new string vS_First_Strike_Vessel
new value vV_2nd_Strike_Vessel
new string vS_2nd_Strike_Vessel
new bool vB_Mixed_Strike
new string vS_Strike_Water
vV_Strike_Calculated_Volume = "gblVStrikeVolume" value 
vV_Strike_SetPoint_Plus = "gblV_Desired_Strike" value + "gblV_StrikeOffset" value 
"gblV_RadiatorSetPoint_P1_B1" value = vV_Strike_SetPoint_Plus
"gblV_BigMacSetPointP1_B1" value = vV_Strike_SetPoint_Plus
"gblV_Number_Strike_Vessels" visibility = hidden
"gblV_Strike_Vessel_1" visibility = hidden
"gblV_Strike_Vessel_2" visibility = hidden
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblV_Saved_Brew_Status" value = 0
"sw_Status_DeadSpace_Radiator" state = false
if "gblVCurrentRadiator_Volume" value > 0
"sw_Status_DeadSpace_Radiator" state = true
endif
"gblVScriptFlow" value = 0
"sw_Advance_HopsCalc" visibility = hidden
"sw_Flow_ByBass_Hop_Calc" visibility = hidden
//..........................................................................................
"inspHopOz" visibility = hidden
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"sw_Advance_ BrewStatus" background = 1
//..........................................................................................
//........................................................................
"gblS_Hop_Screen_Txt" visibility = hidden
"insp_BatchHide" visibility = hidden
"gblS_Brewery_Top_3" value = "Wait! Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
//..............................
//BackGround
"sw_Advance_ BrewStatus" background = 1
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_Brewery_Top_3" background = 3
//Visibility 
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Bottom_3" visibility = hidden
"gblV_Water_Flow_Wo1" value = 0
//............................................................................
 //....................................................
// B1 Brewery Left visibility ......................
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
 "gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
//Set where to start
"gblV_Brew_Status" value = 0
//"gblVScriptFlow" value =  23
 goto  "SectionBrew0"
//....................................................
[SectionBrew0]
[Import_Choice]
print "@109 Import Choice XML of Manual"
//-----------------------------------------------------------------
"gblS_Hop_Screen_Txt" visibility = hidden
"insp_BatchHide" visibility = hidden
"gblS_Brewery_Top_3" value = "Do you have a Plan.  Do you have your ingredients?  Choose 1 to import an BeerSmith3 XML file (Node Red must be up and running) or 2  to create your recipe in BruControl. Choose 1 or 2."
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Top_3" visibility = visible 
"gblS_Brewery_Bottom_4" visibility = hidden
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Backgrounds
"sw_Advance_ BrewStatus" background = 1
"gblSReportLabel_B1"  background = 1
"gblVReport_B1" precision = 0
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "1= Import XML  2= Manual"
"gblS_swAllSwitch_Label_Text" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblSReportLabel_B1" value = "1= XML 2= Manual"
"gblVReport_B1" value = 0
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
//........................................
//Inspector_Black
"gblV_Set_BackGround_Middle_Time" value = 1
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
[LoopChoiceRecipe]
if  "gblVReport_B1" value ==  1
print "@144 Import XML Choice = 1"
"gblS_Brewery_Top_3" value = "Waiting to import a BeerSmith3 XML file (Node Red must be up and running).  Run the Flow in Node Red!"
"gblVReport_B1" value = 0
"gblS_Brewery_Top_2" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait for Node Red"
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
goto "WaitXMLImport"
endif
if  "gblVReport_B1" value ==  2
"gblVReport_B1" value = 0
goto "ManualRecipe"
endif
if  "gblVReport_B1" value >  2
"gblS_Brewery_Top_2"  background = 3
"gblS_Brewery_Top_2"  value = "Your choice is either 1= Importing a BeerSmith3 XML File or 2 = to manually enter your recipe. Only 1 or 2 allowed!"
"gblS_Brewery_Top_2"  visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"gblVReport_B1" value = 0
endif
if  "gblVReport_B1" value <  0
"gblS_Brewery_Top_2"  background = 3
"gblS_Brewery_Top_2"  value = "Your choice is either 1= Importing a BeerSmith3 XML File or 2 = to manually enter your recipe. Only 1 or 2 allowed!"
"gblS_Brewery_Top_2"  visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"gblVReport_B1" value = 0
endif
goto "LoopChoiceRecipe"
[WaitXMLImport]
print " @183 XML Import"
wait "gblV_Node_Red_Imported" value == 1
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait" 
"sw_Advance_ BrewStatus" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" background = 3
print "@ 195 start import xml "
"gblS_Inter_Script" value = "@ 195 inscrBrew0_1a_Normal_Brew  > start C:sub_scrXMLImportHop1"
sleep 2001
start "sub_scrXMLImportHop1"
sleep 100
"gblS_Brewery_Top_3" value = "Wait!  Importing XML File.  This may take up to a minute."
wait "sw_Running_Hop_Group1" state == true
show workspace "Batch1 Hops"
goto "SectionBrew5"
[ManualRecipe]
"gblV_Brew_Status" value = 5
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" value = "Manually Set Hops.  Check Groups timing.  All Values are to to be set by you. Once done, return to the Main Brewery Page."
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
show workspace "Batch1 Hops"
goto "SectionBrew5"
[SectionBrew5]
wait "gblV_Brew_Status" value == 5
print "@ 217 SectionBrew5"
"gblVReport_B1"  visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" precision = 1
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblV_Brew_Status" value = 6
show workspace "B1 Brewery"
[SectionBrew6]
wait "gblV_Brew_Status" value == 6
goto "Ender_scrBrew0_1a_Normal_Brew"
//.........................................................................
[Ender_scrBrew0_1a_Normal_Brew]
"gblS_Inter_Script" value = "@ 233 scrBrew0_1a_Normal_Brew > started:looper_scrBackground_Hops"
start "looper_scrBackground_Hops"
if vB_Testing == true
sleep 2001
endif
start "looper_scrAutoSwitch_Hops"
sleep 100
"gblS_Script_Ended" value = "Ended: scrBrew0_1a_Normal_Brew" 
if vB_Testing == true
sleep 2001
endif
clear
start "scrBrew0_2_Batch_Setup_Hops"
stop "scrBrew0_1a_Normal_Brew"
```

## 5. scrBrew0_1b_Testing_Brew

Starts by itself: No · User can start or stop it: Yes · 167 lines

```text
//scrBrew0_1b_Testing_Brew  
//Version: 261002_10:49
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// called from @ 296 in scrBrew0_1
// scrBrew0 divided up again on 260916
//Modified  02/17/2026 08:50
//Starts Brew on Testing Brew Day
//................................
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
stop "looper_scrBackground_Hops"
//.........................
"gblS_Script_Started" value = "Started:  scrBrew0_1b_Testing_Brew" 
if vB_Testing == true
"gblS_Inter_Script" value = " -- "
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
new value vV_Strike_SetPoint_Plus
new value vV_Strike_Calculated_Volume
new value vV_Lager_or_Ale
new value vV_Strike_Status
new value vV_Number_Strike_Vessel
new value vV_First_Strike_Vessel
new string vS_First_Strike_Vessel
new value vV_2nd_Strike_Vessel
new string vS_2nd_Strike_Vessel
new bool vB_Mixed_Strike
new string vS_Strike_Water
vV_Strike_Calculated_Volume = "gblVStrikeVolume" value 
vV_Strike_SetPoint_Plus = "gblV_Desired_Strike" value + "gblV_StrikeOffset" value 
"gblV_RadiatorSetPoint_P1_B1" value = vV_Strike_SetPoint_Plus
"gblV_BigMacSetPointP1_B1" value = vV_Strike_SetPoint_Plus
"gblV_Number_Strike_Vessels" visibility = hidden
"gblV_Strike_Vessel_1" visibility = hidden
"gblV_Strike_Vessel_2" visibility = hidden
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblV_Saved_Brew_Status" value = 0
"sw_Status_DeadSpace_Radiator" state = false
if "gblVCurrentRadiator_Volume" value > 0
"sw_Status_DeadSpace_Radiator" state = true
endif
"gblVScriptFlow" value = 0
"sw_Advance_HopsCalc" visibility = hidden
"sw_Flow_ByBass_Hop_Calc" visibility = hidden
//..........................................................................................
"inspHopOz" visibility = hidden
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"sw_Advance_ BrewStatus" background = 1
//..........................................................................................
//........................................................................
"gblS_Hop_Screen_Txt" visibility = hidden
"insp_BatchHide" visibility = hidden
"gblS_Brewery_Top_3" value = "Wait! Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
//..............................
//BackGround
"sw_Advance_ BrewStatus" background = 1
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_Brewery_Top_3" background = 3
//Visibility 
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Bottom_3" visibility = hidden
"gblV_Water_Flow_Wo1" value = 0
//............................................................................
 //....................................................
// B1 Brewery Left visibility ......................
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
 "gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
//Set where to start
"gblV_Brew_Status" value = 0
//"gblVScriptFlow" value =  23
 goto  "SectionBrew0"
//....................................................
[SectionBrew0]
print "@110 Testing will set Hops Up"
"gblV_Brew_Status" value = 6
"gblS_Brewery_Top_3" value = "The Node Red Beer Smith XML or the manual entry of a Beer Profile is skipped since the program is in Test Mode.  A Beer Profile has been entered for you.  This will Auto Advance after 5 seconds."
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//BackGrounds
"gblS_Brewery_Top_2" background = 3
"gblS_Brewery_Top_3" background = 3
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
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
//....................................................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Bottom_4" visibility = hidden
//....................................................................
"gblVScriptFlow" value = 23
"gblV_Brew_Status" value = 5
goto  "SectionBrew5"
[SectionBrew5]
"gblS_Inter_Script" value = "@ 156 in scrBrew0_1b_Testing_Brew > Start: Test_Set_Sample_TGS_Batch"
start "Test_Set_Sample_TGS_Batch"
sleep 100
wait "sw_Running_Test_Batch" state ==  false
sleep 100
[Ender_01b]
start "looper_scrBackground_Hops"
"gblS_Inter_Script" value = "@ 166 scrBrew0_1b_Testing_Brew > started:looper_scrBackground_Hops"
sleep 2001
start "looper_scrAutoSwitch_Hops"
sleep 100
[Ender_Testing_Brew]
"gblS_Script_Ended" value = "Ended: scrBrew0_1b_Testing_Brew" 
sleep 4001
clear
start "scrBrew0_2_Batch_Setup_Hops"
stop "scrBrew0_1b_Testing_Brew"
```

## 6. scrBrew0_2_Batch_Setup_Hops

Starts by itself: No · User can start or stop it: Yes · 556 lines

```text
//scrBrew0_2_Batch_Setup_Hops 
//Version: 261002_10:56
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Started from scrBrew0_1a_Normal_Brew or scrBrew0_1b_Testing_Brew
// scrBrew0 divided up
//Starts Brew on Pre Brew Day
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
start "looper_scrBackground_Hops"
//.................................
"gblS_Script_Started" value = "Started:  scrBrew0_2_Batch_Setup_Hops"
if vB_Testing == true
 	"gblS_Inter_Script" value = " -- "
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.................................
//.................................
"gblV_Number_Strike_Vessels"  value = 0
"gblV_Saved_Brew_Status" value = 0
"gblVScriptFlow" value = 0
show workspace "B1 Brewery"
// Where to Start
"gblV_Brew_Status" value = 6
goto "SectionBrew6"
//....................................................
[SectionBrew6]
wait "gblV_Brew_Status" value == 6
print 38
//.....................................................
//.................................................
"gblS_swAllSwitch_Label_Text" value =  "Enter Pounds"
"gblS_Brewery_Top_2" value = "XML does not import the Grain Weight.  Enter the total Grain Pound (One Decimal Place)."
"gblSReportLabel_B1" value = "Total Grain Weight"
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
//.........................................
wait "gblVReport_B1" value > 0
print 67
"gblVGrainWeight" value = "gblVReport_B1" value
new string vSMsg
new string vSMsg1
new value vV_Lager_or_Ale
new value vV_Count_Hops
vV_Count_Hops = 0
new value vV_Start_Ale_Lager
new value vV_Set_Grain_Weight
vV_Set_Grain_Weight = "gblVReport_B1" value
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
vSMsg = "The Grain Weight has been set to "
vSMsg1 = vV_Set_Grain_Weight
vSMsg = vSMsg  + vSMsg1
vSMsg1 = " pounds.  All calculations will use that weight.  Wait!  Will Auto Advance."
vSMsg = vSMsg  + vSMsg1
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" visibility = visible
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
//....................................... 
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 200
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
"gblV_Brew_Status" value = 7
[SectionBrew7]
wait "gblV_Brew_Status" value == 7
print 98
vV_Lager_or_Ale = "gblVLagerAle" value
vV_Start_Ale_Lager = vV_Lager_or_Ale
if vV_Lager_or_Ale == 1
vSMsg = "The Brew is set as an Ale Style. Confirm ths:\n1 = Ale\n2 = Lager"
endif
if vV_Lager_or_Ale == 2
vSMsg = "The Brew is set as a Lager Style. Confirm ths:\n1 = Ale\n2 = Lager"
endif
//.................................................
"gblS_swAllSwitch_Label_Text" value =  "1 = Ale\n2 = Lager"
"gblS_Brewery_Top_2" value = vSMsg
"gblSReportLabel_B1" value = "Ale or Lager"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_2" background = 1 
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
//.........................................
[Restart_LoopAleorLager]
wait "gblVReport_B1" value > 0
print 134
[LoopAleorLager]
sleep 100
if "gblVReport_B1" value == 1
vSMsg1 = " an Ale Style.  Wait!  Will Auto Advance."
goto "Exit_LoopAleorLager"
endif
if "gblVReport_B1" value == 2
vSMsg1 = "a Lager Style.  Wait!  Will Auto Advance."
goto "Exit_LoopAleorLager"
endif
if "gblVReport_B1" value > 2
"gblSReportLabel_B1" background = 1
"gblSReportLabel_B1" value = "1 or 2 Only!"
sleep 4001
"gblSReportLabel_B1" background = 3
"gblSReportLabel_B1" value = "Ale or Lager"
goto "Restart_LoopAleorLager"
endif
if "gblVReport_B1" value < 0
"gblSReportLabel_B1" background = 1
"gblSReportLabel_B1" value = "1 or 2 Only!"
sleep 4001
"gblSReportLabel_B1" background = 3
"gblSReportLabel_B1" value = "Ale or Lager"
goto "Restart_LoopAleorLager"
endif
goto "LoopAleorLager"
[Exit_LoopAleorLager]
"gblVLagerAle" value = "gblVReport_B1" value
"gblVReport_B1" value = 0
vV_Lager_or_Ale = "gblVLagerAle" value
if vV_Start_Ale_Lager == vV_Lager_or_Ale
vSMsg = "Confirmed the Brew to be "
vSMsg = vSMsg + vSMsg1
else
vSMsg = "Brew has been changed to "
vSMsg = vSMsg + vSMsg1
endif
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden 
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
//........................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
"gblV_Brew_Status" value = 8
[SectionBrew8]
wait "gblV_Brew_Status" value == 8
print 182
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
"gblS_Brewery_Top_1" value = "You need to do a general review of the HOPs and Brew Data to make sure that all the Hops have been added.\nIf some are missing and you do NOT add them, you will not get any warnings about the Hop Drop.\n Wait!  Will Auto Advance.  "
"gblS_Brewery_Bottom_3" value = "Later you will need to set the Actual AAU of the Hops used due to the AAU may vary from what is in the recipe.\nThis will adjust the ounces during the calculations.\nThere are several other aids that will follow to help set up your Brew Day."
//.............................................
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Bottom_3" background = 3
//...............................
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
//....................................... 
// 15 Second Delay
"gblV_Delay_Seconds" value = 15
start "inscpt_scrShortDelay"
sleep 200
wait "sw_Running_Short_Delay_Time" state == false
//........................................
//........................................
"gblS_Brewery_Top_1" value = "Batch 1 Hops Workspace has the focus."
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"insp_Pix_ArrowAllSwitch_B1" background = 3
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
"gblV_Brew_Status" value = 10
[SectionBrew9]
[SectionBrew10]
wait "gblV_Brew_Status" value == 10
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
//.................................................................
show workspace "Batch1 Hops"
"gblVScriptFlow" value = 1
//............................................
if "gblV_Hop1_Recipe_AAU_R1" value > 0
"sw_Use_Hop1_Batch" state = true
vV_Count_Hops = vV_Count_Hops + 1
endif
if "gblV_Hop2_Recipe_AAU_R1" value > 0
"sw_Use_Hop2_Batch" state = true
vV_Count_Hops = vV_Count_Hops + 1
endif
if "gblV_Hop3_Recipe_AAU_R1" value > 0
"sw_Use_Hop3_Batch" state = true
vV_Count_Hops = vV_Count_Hops + 1
endif
if "gblV_Hop4_Recipe_AAU_R1" value > 0
"sw_Use_Hop4_Batch" state = true
vV_Count_Hops = vV_Count_Hops + 1
endif
if "gblV_Hop5_Recipe_AAU_R1" value > 0
"sw_Use_Hop5_Batch" state = true
vV_Count_Hops = vV_Count_Hops + 1
endif
if "gblV_Hop6_Recipe_AAU_R1" value > 0
"sw_Use_Hop6_Batch" state = true
vV_Count_Hops = vV_Count_Hops + 1
endif
if "gblV_Hop7_Recipe_AAU_R1" value > 0
"sw_Use_Hop7_Batch" state = true
vV_Count_Hops = vV_Count_Hops + 1
endif
if "gblV_Hop8_Recipe_AAU_R1" value > 0
"sw_Use_Hop8_Batch" state = true
vV_Count_Hops = vV_Count_Hops + 1
endif
vSMsg = "There are "
vSMsg1 = vV_Count_Hops
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Hops that are Set to be used.  A Confirmation Pane will appear shortly for you to review the Use of a Hop.  Hops can be added by simply starting to type in the name of a Hop in any of the avaible blank slots."
vSMsg = vSMsg + vSMsg1
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = vSMsg 
"tm_Delay_W1" displayname = "Short Delay"
"tm_Delay_W1" value = 00:00:10
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
"gblS_Hop_Screen_Txt" visibility = visible
"insp_BatchHide" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
//..............................................
"gblVScriptFlow" value = 2
print 274
"gblS_Hop_Screen_Txt" background = 1
"gblS_Hop_Screen_Txt" value = "For Any Hop to be used:\n1. The Hop must have a name.\n        2. The Used Hop #? must be clicked ON.\nZero Minutes are allowed for End of Boil Hops.\n\nYou can add a Hop by starting to type in the name.\nThere is other data but any gray fields are calculated.  Light Blue Fields are normally imported.  Red Fields are User Input.  Pink is User Defaults.\nFor Any Hop with the USE Hop # switch ON, the HOPs Actual AAU MUST be greater than ZERO.  The Actual AAU needs to be set to the Actual AAU of the Hop. \n\nWait!  There is a 1 minute delay.  Will Auto Advance when Timer equals Zero.  You can end the Timer by Clicking Advance Timer (upper right).  "
"tm_Delay_W1" displayname = "1 Minute Delay"
"sw_Advance_HopsCalc" displayname = "Set AAU Actual"
"sw_Advance_HopsCalc" state = false
"inspAAUActualText" background = 1
"tm_Delay_W1" value = 00:01:00
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
"gblS_Hop_Screen_Txt" visibility = visible
"sw_Advance_Hop_Delay" visibility = visible 
"insp_BatchHide" visibility = visible
start "looper_scrBlinkClick"
[Loop_Delay]
if "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
goto "Exit_Delay"
endif
print 300
if "sw_Advance_Hop_Delay" state == true
"sw_Advance_Hop_Delay" state = false
"tm_Delay_W1" value = 00:00:02
endif
goto "Loop_Delay"
[Exit_Delay]
"gblVScriptFlow" value = 3
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" visibility = hidden
"sw_Advance_Hop_Delay" visibility = hidden
stop "looper_scrBlinkClick"
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
"insp_BatchHide" visibility = hidden
//......Text PNG...................................
"insp_UseHopBig" background = 1
"insp_BlanK_AAU" background = 1
//.............................................
"insp_UseHopBig" visibility = visible
"insp_BlanK_AAU" visibility = visible
start "looper_scrBlinkUseHop"
"tm_Delay_W1" displayname = "15 Second Delay"
"tm_Delay_W1" value = 00:00:15
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
 wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"insp_UseHopBig" visibility = hidden
"insp_BlanK_AAU" visibility = hidden
stop "looper_scrBlinkUseHop"
"gblVScriptFlow" value = 4
start "looper_scrBlinkClick"
"sw_Advance_HopsCalc" visibility = visible
wait "sw_Advance_HopsCalc" state == true
"sw_Advance_HopsCalc" state = false
"sw_Advance_HopsCalc" visibility = hidden
stop "looper_scrBlinkClick"
"gblVScriptFlow" value = 5
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
start "looper_scrBlinkUseHop"
"insp_UseHop" visibility =  hidden
"insp_UseHopBig" visibility = hidden
"insp_BlanK_AAU" visibility = hidden
// Do something here when switch made
"gblV_Brew_Status" value = 12
[SectionBrew11]
[SectionBrew12]
wait "gblV_Brew_Status" value == 12
print "@356 SectionBrew12"
[Redo_AAU]
print "@293 Redo_AAU"
show workspace "Batch1 Hops"
"gblVScriptFlow" value = 6
start "inscpt_scrClearBatchHops"
wait "sw_Running_ClearBatchHops" state == false
sleep 100
"gblS_Hop_Screen_Txt" background = 1
"gblS_Hop_Screen_Txt" value = "For Any Hop with the USE Hop # switch ON, the HOPs Actual AAU MUST be greater than ZERO to advance.\n  Generally, the AAU used in the recipe will not match that of a purchased Hop.  It could be the same but it needs confirmation.\nUpdating the Actual AAU will later calculate the ounces needed to obtain the same IBU.\n\nWait!  There is a 1 minute delay.  Will Auto Advance when Timer equals Zero.  You can end the Timer by Clicking Advance Timer (upper right).  "
"tm_Delay_W1" displayname = "1 Minute Delay"
"tm_Delay_W1" value = 00:01:00
start "tm_Delay_W1"
print 373
"tm_Delay_W1" visibility = visible
"gblS_Hop_Screen_Txt" visibility = visible
print 376
"sw_Advance_Hop_Delay" visibility = visible 
"insp_BatchHide" visibility = visible
wait "tm_Delay_W1" value <= 00:00:55
"gblVScriptFlow" value = 7
start "looper_scrBlinkClick"
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblVScriptFlow" value = 8
stop "looper_scrBlinkClick"
goto "Exit_Delay_AAU"
[Exit_Delay_AAU]
print "@ 387 Exit_Delay"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" visibility = hidden
"insp_BatchHide" visibility = hidden
"sw_Advance_Hop_Delay" visibility = hidden
"insp_BlanK_AAU" visibility = hidden
"inspAAUActualText" visibility = hidden
stop "looper_scrBlinkClick"
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
"insp_BatchHide" visibility = hidden
// Set Up Batch Screen
//......Text PNG...................................
"inspAAUActualText" background = 1
"inspAAUActualText" visibility = visible
//...Arrows...................................
print "@402 start looper_scrBlinkAAU"
start "looper_scrBlinkAAU"
print 400
"gblVScriptFlow" value = 9
"tm_Delay_W1" displayname = "Set AAU"
"tm_Delay_W1" value = 00:00:30
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
if vB_Testing == true
sleep 4001
"inspAAUActualText" background = 3
"inspAAUActualText" visibility = visible
"gblV_Hop1_Actual_AAU_R1" value = 14.5
"gblV_Hop2_Actual_AAU_R1" value = 3.4
"gblV_Hop3_Actual_AAU_R1" value = 2.1
"gblV_Hop4_Actual_AAU_R1" value = 11
"gblV_Hop5_Actual_AAU_R1" value = 2.3
sleep 4001
"inspAAUActualText" background = 1
endif
[Loop_Setting_AAU]
if "gblV_Hop1_Actual_AAU_R1" value > 0
goto "Proceed_AAU"
endif
if  "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
goto "Proceed_AAU"
endif
goto "Loop_Setting_AAU"
[Proceed_AAU]
start "looper_scrBlinkClick"
"sw_Advance_HopsCalc" displayname = "Check AAU?"
"sw_Advance_HopsCalc" state = false
"sw_Advance_HopsCalc" visibility = visible
wait "sw_Advance_HopsCalc" state == true
"sw_Advance_HopsCalc" state = false
"gblVScriptFlow" value = 10
"sw_Advance_HopsCalc" visibility = hidden
stop "looper_scrBlinkClick"
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
stop "looper_scrBlinkAAU"
"inspAAUActual" visibility = hidden
// Do something here when switch made
"gblV_Brew_Status" value = 14 
[SectionBrew13]
[SectionBrew14]
wait "gblV_Brew_Status" value == 14 
"gblVScriptFlow" value = 11
sleep 100
"gblS_Inter_Script" value = "@ 458 in scrBrew0_2_Batch_Setup_Hops > start A: Hops_4_Hop_AAU_Check_Zero"
start "Hops_4_Hop_AAU_Check_Zero"
if vB_Testing == true
sleep 4001
endif
wait "gblVScriptFlow" value == 12
[Loop_redo]
sleep 100
if "gblV_Brew_Status" value == 12
print  "@449 Brew_Status still 12"
"gblV_Brew_Status" value = 9999
goto "Redo_AAU"
endif
if "gblV_Brew_Status" value == 16
print "@428 Brew_Status = 16"
goto "SectionBrew16"
endif
goto "Loop_redo"
[SectionBrew15]
[SectionBrew16]
wait "gblV_Brew_Status" value == 16 
print "@282 SectionBrew16"
show workspace "Batch1 Hops"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "The HOPs should have all been set correctly.  BruControl will now configure the Hop Schedule and some other Calculations. Review the Hops again then Click Calculate Brew. \n\nWait!  There is a 1 minute delay.  Will Auto Advance when Timer equals Zero.  You can end the Timer by Clicking Advance Timer (upper right). "
"tm_Delay_W1" displayname = "1 Minute Delay"
"sw_Advance_HopsCalc" displayname = "Calculate Brew"
"sw_Advance_HopsCalc" state = false
"tm_Delay_W1" value = 00:01:00
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
"gblS_Hop_Screen_Txt" visibility = visible
"sw_Advance_Hop_Delay" visibility = visible 
"insp_BatchHide" visibility = visible
wait "tm_Delay_W1" value <= 00:00:55
"gblVScriptFlow" value = 13
start "looper_scrBlinkClick"
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblVScriptFlow" value = 14
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" visibility = hidden
"sw_Advance_Hop_Delay" visibility = hidden
stop "looper_scrBlinkClick"
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
"insp_BatchHide" visibility = hidden
//......Text PNG...................................
"insp_BlanK_AAU" background = 2
"insp_BlanK_AAU" visibility = visible
"tm_Delay_W1" displayname = "Short Delay"
"tm_Delay_W1" value = 00:00:05
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
"sw_Advance_Hop_Delay" visibility = visible 
print 500
"insp_BatchHide" visibility = visible
"gblVScriptFlow" value = 14
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblVScriptFlow" value = 15
"insp_BlanK_AAU" visibility = hidden
sleep 4001
start "inscpt_scrClearBatchHops"
sleep 100
start "looper_scrBlinkClick"
"sw_Advance_HopsCalc" visibility = visible
wait "sw_Advance_HopsCalc" state == true
"gblVScriptFlow" value = 16
"sw_Advance_HopsCalc" state = false
"sw_Advance_HopsCalc" visibility = hidden
stop "looper_scrBlinkClick"
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
"gblV_Brew_Status" value = 18
[SectionBrew17]
[SectionBrew18]
wait "gblV_Brew_Status" value == 18
show workspace "Batch1 Hops"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Wait, Will Auto Advance"
"gblS_Hop_Screen_Txt" visibility = visible
sleep 200
"insp_BatchHide" visibility = visible
"gblVScriptFlow" value = 17
"tm_Delay_W1" displayname = "Short Delay"
"tm_Delay_W1" value = 00:00:05
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
"gblS_Hop_Screen_Txt" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblVScriptFlow" value = 18
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" visibility = hidden
[End_scrBrew0_2]
"gblS_Script_Ended" value = "Ended: scrBrew0_2_Batch_Setup_Hops" 
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_2_1_CheckBoilGroup"
stop  "scrBrew0_2_Batch_Setup_Hops"
```

## 7. scrBrew0_2_1_CheckBoilGroup

Starts by itself: No · User can start or stop it: Yes · 171 lines

```text
//scrBrew0_2_1_CheckBoilGroup
//Version: 261002_11:15
//02/28/2026 13:42
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Checks if Hops Durning Boil are set in Groups
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
stop "looper_scrBackground_Hops"
//.........................
"gblS_Script_Started" value = "Started:  scrBrew0_2_1_CheckBoilGroup" 
if vB_Testing == true
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
"gblVScriptFlow" value = 19
"sw_Advance_HopsCalc" visibility = hidden 
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
new value vV_Check
vV_Check = 0
"tm_Delay_W1" type = countdown
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" displayname = "Checking Hops Durning Boil Grouping"
"gblS_Hop_Screen_Txt"  value = "Wait!  Hops dropped during the Boil must be Groups from 1 to 8.  This checks if the are ordered from 1 to 8.  If you only have two drop times, you will only have group 1 and 2.  Generally, the XML Import does a good job of ordering.  You will need to check if you imported or manually set if doing it manually.  This must be done before advancing.  Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
[ReCheck]
// Hop 1
if "gblV_Hop1_Group_R1"  value >  0
if "gblV_Hop1_Group_R1"  value >  8
"gblS_Hop_Screen_Txt" displayname = "Grouping Error"
"gblS_Hop_Screen_Txt" value = "Hop #1 must be grouped from 1 to 8.  Set the Hop Grouping Manually.   Click the Click Me to Calculate Hops switch once error is corrected!  This message will be displayed for 30 seconds.  You may use to Advance Timer switch (Upper Right) to advance early."
vV_Check = 1
goto "errorMsg"
endif
endif
// Hop2
if "gblV_Hop2_Group_R1"  value >  0
if "gblV_Hop2_Group_R1"  value >  8
"gblS_Hop_Screen_Txt" displayname = "Grouping Error"
"gblS_Hop_Screen_Txt" value = "Hop #2 must be grouped from 1 to 8.  Set the Hop Grouping Manually.  Click the Click Me to Calculate Hops switch once error is corrected!  This message will be displayed for 30 seconds.  You may use to Advance Timer switch (Upper Right) to advance early."
vV_Check = 1
goto "errorMsg"
endif
endif
// Hop3
if "gblV_Hop3_Group_R1"  value >  0
if "gblV_Hop3_Group_R1"  value >  8
"gblS_Hop_Screen_Txt" displayname = "Grouping Error"
"gblS_Hop_Screen_Txt" value = "Hop #3 must be grouped from 1 to 8.  Set the Hop Grouping Manually.  Click the Click Me to Calculate Hops switch once error is corrected!  This message will be displayed for 30 seconds.  You may use to Advance Timer switch (Upper Right) to advance early."
vV_Check = 1
goto "errorMsg"
endif
endif
// Hop4
if "gblV_Hop4_Group_R1"  value >  0
if "gblV_Hop4_Group_R1"  value >  8
"gblS_Hop_Screen_Txt" displayname = "Grouping Error"
"gblS_Hop_Screen_Txt" value = "Hop #4 must be grouped from 1 to 8.  Set the Hop Grouping Manually.  Click the Click Me to Calculate Hops switch once error is corrected!  This message will be displayed for 30 seconds.  You may use to Advance Timer switch (Upper Right) to advance early."
vV_Check = 1
goto "errorMsg"
endif
endif
// Hop5
if "gblV_Hop5_Group_R1"  value >  0
if "gblV_Hop5_Group_R1"  value >  8
"gblS_Hop_Screen_Txt" displayname = "Grouping Error"
"gblS_Hop_Screen_Txt" value = "Hop #5 must be grouped from 1 to 8.  Set the Hop Grouping Manually.  Click the Click Me to Calculate Hops switch once error is corrected!  This message will be displayed for 30 seconds.  You may use to Advance Timer switch (Upper Right) to advance early."
vV_Check = 1
goto "errorMsg"
endif
endif
// Hop6
if "gblV_Hop6_Group_R1"  value >  0
if "gblV_Hop6_Group_R1"  value >  8
"gblS_Hop_Screen_Txt" displayname = "Grouping Error"
"gblS_Hop_Screen_Txt" value = "Hop #6 must be grouped from 1 to 8.  Set the Hop Grouping Manually.  Click the Click Me to Calculate Hops switch once error is corrected!  This message will be displayed for 30 seconds.  You may use to Advance Timer switch (Upper Right) to advance early."
vV_Check = 1
goto "errorMsg"
endif
endif
// Hop7
if "gblV_Hop7_Group_R1"  value >  0
if "gblV_Hop7_Group_R1"  value >  8
"gblS_Hop_Screen_Txt" displayname = "Grouping Error"
"gblS_Hop_Screen_Txt" value = "Hop #7 must be grouped from 1 to 8.  Set the Hop Grouping Manually.  Click the Click Me to Calculate Hops switch once error is corrected!  This message will be displayed for 30 seconds.  You may use to Advance Timer switch (Upper Right) to advance early."
vV_Check = 1
goto "errorMsg"
endif
endif
// Hop8
if "gblV_Hop8_Group_R1"  value >  0
if "gblV_Hop8_Group_R1"  value >  8
"gblS_Hop_Screen_Txt" displayname = "Grouping Error"
"gblS_Hop_Screen_Txt" value = "Hop #8 must be grouped from 1 to 8.  Set the Hop Grouping Manually.  Click the Click Me to Calculate Hops switch once error is corrected!  This message will be displayed for 30 seconds.  You may use to Advance Timer switch (Upper Right) to advance early."
vV_Check = 1
goto "errorMsg"
endif
endif
[enderGroupCheck]
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt" visibility = hidden
"gblS_Hop_Screen_Txt" background = 1
if  vV_Check ==  0
goto "Ender_scrBrew0_2_1"
endif
sleep 100
 [Ender_scrBrew0_2_1]
"gblS_Script_Ended" value = "Ended: scrBrew0_2_1_CheckBoilGroup"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_2_2_All_Hop_Scripts_Calculation"
"gblVScriptFlow" value = 2
stop "scrBrew0_2_1_CheckBoilGroup"
[errorMsg]
stop "tm_Delay_W1"
"sw_Advance_Hop_Delay" visibility = visible
"tm_Delay_W1" type = countdown
"gblS_Hop_Screen_Txt" background = 2
 "tm_Delay_W1" value = 00:00:15
start "tm_Delay_W1"
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" visibility = visible
[LoopErrorTimer]
if "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1" 
"gblS_Hop_Screen_Txt" visibility = hidden
"tm_Delay_W1" visibility = hidden
"sw_Advance_Hop_Delay" visibility = hidden
goto "exitLoop"
endif
if "sw_Advance_Hop_Delay" state == true
"sw_Advance_Hop_Delay" state = false
"tm_Delay_W1" value = 00:00:02
endif
goto "LoopErrorTimer"
[exitLoop]
"sw_Advance_HopsCalc" visibility = visible 
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden 
sleep 1500
"insp_Pix_ArrowHopSwitch_R1" visibility = visible
sleep 1500
"sw_Advance_HopsCalc" background = 3
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
sleep 1500
"insp_Pix_ArrowHopSwitch_R1" visibility = visible
wait "sw_Advance_HopsCalc" state == true
"sw_Advance_HopsCalc" state = false
"sw_Advance_HopsCalc" visibility = hidden
vV_Check = 0
goto "ReCheck"
```

## 8. scrBrew0_2_2_All_Hop_Scripts_Calculation

Starts by itself: No · User can start or stop it: Yes · 122 lines

```text
//scrBrew0_2_2_All_Hop_Scripts_Calculation
// Version:  261001_12:15
//  08/26/2023 15:52
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Runs all Hop Script Calculations
//Set Hop # OZ to drop and drop time
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//.................................
"gblS_Script_Started" value = "Started:  scrBrew0_2_2_All_Hop_Scripts_Calculation" 
"insp_BatchHide" displayname = "Will Caluclate Hops next.  Wait.  Will Auto Advance"
if vB_Testing == true
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
show workspace "Batch1 Hops"
"gblVScriptFlow" value = 3
"sw_Advance_HopsCalc" visibility = hidden
"sw_Running_Hop_Calc" state = true
"gblS_Hop_Screen_Txt" visibility = visible
"insp_BatchHide" visibility = visible
new value vVStrikeType
vVStrikeType = "gblVLagerAle" value
"gblS_Hop_Screen_Txt" displayname = "Wait for Calculations!"
"tm_Delay_W1" visibility = hidden
"tm_Delay_W1" type = countdown
"tm_Delay_W1" displayname = "Delay"
// Calculate Times and Oz
wait "gblVScriptFlow" value == 3
"gblS_Hop_Screen_Txt" value = "Wait!  Will Auto Advance.  Calculating Hop Hops Oz based on actual AAU."
"gblS_Inter_Script" value = "@ 42 in scrBrew0_2_2_All_Hop_Scripts_Calculation start > B: Hops_5_Hop_Calc_OZ"
start "Hops_5_Hop_Calc_OZ"
sleep 100
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
wait "gblVScriptFlow" value == 4
//Calclate IBU
"gblS_Hop_Screen_Txt" value = "Wait!  Will Auto Advance.  Calculating IBUs."
"insp_BatchHide" displayname = "Calculating Hop IBU based Hops Oz & actual AAU.  Wait.  Will Auto Advance"
"gblS_Inter_Script" value = "@ 57 in scrBrew0_2_2_All_Hop_Scripts_Calculation start > C: batch_1_IBUs"
start "batch_1_IBUs"
sleep 100
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
wait "sw_Running_Script_C" state == false
// Volumes
wait "gblVScriptFlow" value == 5
"gblS_Hop_Screen_Txt" value = "Wait!  Will Auto Advance.  Calculating Water Source and Timing."
"insp_BatchHide" displayname = "Calculating Calculating Water Volume and Timing.  Wait.  Will Auto Advance"
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"insp_BatchHide" displayname = "Calculating Volumes based on Grain Weight and WORT Thickness.  Wait.  Will Auto Advance"
"gblS_Inter_Script" value = "@ 78 in scrBrew0_2_2_All_Hop_Scripts_Calculation start > : batch_2_Calc_Volumes"
start "batch_2_Calc_Volumes"
sleep 100
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
// Max Group
wait "gblVScriptFlow" value == 6
"gblS_Hop_Screen_Txt" value = "Wait!  Will Auto Advance.  Calculating Maximum Hop Group (1-8)."
"insp_BatchHide" displayname = "Calculating Starting to Calculate Hop Groupings  Wait.  Will Auto Advance"
"gblS_Inter_Script" value = "@ 94 in scrBrew0_2_2_All_Hop_Scripts_Calculation start > : Hops_6_Hop_Calc_MAX"
start "Hops_6_Hop_Calc_MAX"
sleep 100
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
// Grouping
wait "gblVScriptFlow" value == 7
"gblS_Hop_Screen_Txt" value = "Wait!  Will Auto Advance.  Calculating Hop Messages for Hop Drops."
"insp_BatchHide" displayname = "Writing Hop Drops & Warnings Texts.  Wait.  Will Auto Advance"
"gblS_Inter_Script" value = "@ 96 in scrBrew0_2_2_All_Hop_Scripts_Calculation start : Hops_7_Hop_Warning_Text"
start "Hops_7_Hop_Warning_Text"
sleep 100
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
wait "sw_Running_Hop_7" state == false
// Timing Conflicts
wait "gblVScriptFlow" value == 21
"gblS_Hop_Screen_Txt" value = "Wait!  Will Auto Advance.  Checking for Timing of Hops for Conflicts."
"insp_BatchHide" displayname = "Calculating Adjusting Hop Warnings for any conflicts.  Wait.  Will Auto Advance"
"gblS_Inter_Script" value = "@ 109 in scrBrew0_2_2_All_Hop_Scripts_Calculation start > : hops_scrHopsConflicts"
start "hops_scrHopsConflicts"
sleep 100
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
[End_scrBrew0_2_2]
wait "gblVScriptFlow" value == 22
"insp_BatchHide" visibility = hidden
"gblS_Script_Ended" value = "Ended: scrBrew0_2_2_All_Hop_Scripts_Calculation" 
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_3_Vessels"
stop "scrBrew0_2_2_All_Hop_Scripts_Calculation"
```

## 9. scrBrew0_3_Vessels

Starts by itself: No · User can start or stop it: No · 1020 lines

```text
//scrBrew0_3_Vessels
//Version: 261001_12:30
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
//Modified  06/22/2026 17:14
//Continues to Set Brew Day with General Strike Status.
//................................
// Set Testing
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
stop "looper_scrBackground_Hops"
//.........................
if vB_Testing == true
"gblS_Script_Started" value = "Started: scrBrew0_3_Vessels"
"gblS_Inter_Script" value = " -- "
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
new string vS_Msg
new string vS_Msg1
new string vS_Msg_Vessel
new string vS_Msg_Max
new string vS_Msg_Not_Allowed
new value vV_Strike_SetPoint_Plus
new value vV_Strike_Calculated_Volume
new value vV_Lager_or_Ale
new value vV_Strike_Status
new value vV_Strike_Vessel_1
new value vV_Number_Strike_Vessel
new string vS_Strike_Water
new string vS_Label_1
new string vS_Label_2
new value vV_Strike_Volume_Max
new value vV_Radiator_Dead_Space
new value vV_Strike_Volume_Max_2
//.......................................
vV_Lager_or_Ale = "gblVLagerAle" value
stop "scrBrew0_5a_Fill_First"
stop "scrBrew0_5B_Fill_Second"
"gblV_Saved_Brew_Status" value = 0
"gblVScriptFlow" value = 0
//...............................................................................
"gblVElaspedSeconds" value = 0
"gblV_Fermentor" value = 0
"gblV_Water_Status_saved" value = 0
"gblV_Valve_Status" value = 999
"sw_Flow_Set_Manual" state = false
"gblV_Vessel_From" value = 0
"gblV_Vessel_To" value = 0
"gblV_Vessel_Measure" value = 0
"glbV_Vessel_Adjust" value = 0
"gblV_Pump" value = 0
"gblV_Isolation_Valve" value = 0
"gblV_Rate" value = 0
"gblV_SPG_Calculated" value = 0
"gblV_SPG_Delta_Rate" value = 0
"gblS_Vessel_From" value = ""
"gblS_Vessel_To" value = ""
"gblS_Pump" value = ""
"gblV_Volume_Max" value = 0
"gblS_Vessel_Measure" value = ""
"gblS_Vessel_Adjust" value = ""
"glbS_Isolation_Valve" value = ""
"gblS_Strike_Vessel_1" value = ""
"gblS_Strike_Vessel_2" value = ""
"gblV_Strike_Vessel_Max_Volume_1" value = 0
"gblV_Strike_Vessel_Max_Volume_2" value = 0
"sw_Flow_2_Vessels_Strike" state = false
"glbS_Isolation_Valve" value = ""
"gblV_Number_Strike_Vessels" value = 1
"gblV_Strike_Vessel_1" value = 0
"gblV_Strike_Vessel_2" value = 0
"gblV_Number_Strike_Vessels" visibility = visible
"gblV_Strike_Vessel_1" visibility = visible
"gblV_Strike_Vessel_2" value = 0
"gblV_Distilled_to_Add" value = 0
"gblVHalfStrike" value = 0
"gblV_Strike_Status_Batch" value = 0
"gblVCurrentBigMac_Volume" value = 0
"gblVCurrentRadiator_Volume" value = 0
"gblVCurrentMLT_Volume" value = 0
"gblVCurrentBrewKettle_Volume" value = 0
"gblVCurrentLittle_Volume" value = 0
"gblVCurrentBrewzilla_Volume" value = 0
"gblVCurrentDigiboil_Volume" value = 0
"gblVCurrent20GMLT_Volume" value = 0
"gblV_Start_To" value = 0
"gblV_Start_From" value = 0
"gblV_Start_Adjust" value = 0
"gblV_Desired_Measured_Volume_End" value = 0
"gblV_Minimum_Volume_End" value = 0
"gblV__Volume_Added" value = 0
"sw_Status_DeadSpace_Radiator" state = false
"sw_Flow_Radiator_Delayed" state = false
"sw_Flow_BigMac_Delayed" state = false
"sw_Flow_Brewzilla_Delayed" state = false
"sw_Flow_DigiBoil_Delayed" state = false
"sw_Status_Brewzilla _Heater_On" state = false
"sw_Status_DigiBoil _Heater_On" state = false
"sw_Status_BigMac_HLT" state = false
"sw_Status_Radiator_HERMs_Bath" state = false
"sw_Status_Brewzilla_HLT" state = false
"sw_Status_Digiboil_HLT" state = false
vV_Strike_Calculated_Volume = "gblVStrikeVolume" value
vV_Strike_SetPoint_Plus = "gblV_Desired_Strike" value + "gblV_StrikeOffset" value
"gblV_Number_Strike_Vessels" visibility = visible
"gblV_Strike_Vessel_1" visibility = visible
//..............................
if vV_Lager_or_Ale == 2
new string vS_Msg_HalfStrike
new value vV_Half_Strike
new value vV_Half_Strike_All_Dead
new value vV_Half_Strike_Half_Dead
vV_Half_Strike = vV_Strike_Calculated_Volume / 2
"gblVHalfStrike" value = vV_Half_Strike
vV_Radiator_Dead_Space = "glbV_Rad_Dead_Space" value
vV_Half_Strike_All_Dead = vV_Half_Strike + vV_Radiator_Dead_Space
vV_Half_Strike_Half_Dead = vV_Radiator_Dead_Space / 2
vV_Half_Strike_Half_Dead = vV_Half_Strike + vV_Half_Strike_Half_Dead
vS_Msg = "Half Strike volume of "
vS_Msg1 = vV_Half_Strike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons"
vS_Msg = vS_Msg + vS_Msg1
vS_Msg_HalfStrike = vS_Msg
endif
//..........................................
show workspace "B1 Brewery"
// Where to Start
"gblV_Brew_Status" value = 18
goto "SectionBrew18"
//....................................................
[SectionBrew18]
wait "gblV_Brew_Status" value == 18
//.................//........................................
if vV_Strike_Calculated_Volume <= 13.5
vV_Strike_Volume_Max = 13.5
endif
if vV_Strike_Calculated_Volume > 13.5
if vV_Strike_Calculated_Volume <= 15
vV_Strike_Volume_Max = 15
endif
endif
if vV_Strike_Calculated_Volume > 15
vV_Strike_Volume_Max = 43
vS_Msg = "The Strike Volume is "
vS_Msg1 = vV_Strike_Calculated_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  Choices are limited to the following for ONE Strike Vessel:"
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = "\n2= Big Mac\n5 = Little Mac\n6= Brew Kettle.\nChoose 1 or 2 vessels next accordingly."
if vV_Lager_or_Ale == 2
vS_Msg1 = "\n5 = Little Mac\n6= Brew Kettle.\nChose 1 or 2 vessels next accordingly."
endif
vS_Msg = vS_Msg + vS_Msg1
"gblS_Brewery_Top_2" value = vS_Msg
//.......................................
endif
print 172
print vV_Lager_or_Ale
if vV_Lager_or_Ale == 1
vS_Msg1 = "Ale Strike (Tap) Water"
"gblS_BrewName_B1" value = vS_Msg1
endif
if vV_Lager_or_Ale == 2
vS_Msg1 = "Lager Strike (Mixed Distilled and Tap) Water"
"gblV_Distilled_to_Add" value = vV_Half_Strike
"gblV_Minimum_Volume_End" value = vV_Half_Strike
"gblS_BrewName_B1" value = vS_Msg1
endif
vS_Msg = "All of the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " will fit in a single vessel.   The Strike could be seperated into Two Vessels if desired. Generally there is ZERO reason to use two vessels.  Confirm a single vessel for the Strike.  Confirm this:\n1 = One Vessel\n2 = Two Vessels"
vS_Msg = vS_Msg + vS_Msg1
//.................................................
"gblS_swAllSwitch_Label_Text" value =  "1 = One Vessel\n2 = Two Vessels"
"gblS_Brewery_Top_2" value = vS_Msg
"gblSReportLabel_B1" value = "Strike: One or Two Vessels"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
//.........................................
[Restart_LoopOneorTwo Vessels]
print "@ 145 Restart_LoopOneorTwo Vessels"
wait "gblVReport_B1" value > 0
[LoopOneorTwo Vessels]
sleep 100
if "gblVReport_B1" value == 1
vS_Msg1 = " for One Vessel.  Wait!  Will Auto Advance."
"sw_Flow_2_Vessels_Strike" state = false
goto "Exit_1_Vessel"
endif
//...........................
if "gblVReport_B1" value == 2
print " @156  2 Vessels"
vS_Msg1 = " for Two Vessels.  Wait!  Will Auto Advance."
"sw_Flow_2_Vessels_Strike" state = true
"gblV_Strike_Vessel_2" visibility = visible
goto "Exit_2_Vessel"
endif
//...........................
if "gblVReport_B1" value > 2
"gblSReportLabel_B1" background = 1
"gblSReportLabel_B1" value = "1 or 2 Only!"
sleep 4001
"gblSReportLabel_B1" background = 3
"gblSReportLabel_B1" value = "One or Two Vessels"
goto "Restart_LoopOneorTwo Vessels"
endif
//...........................
goto "LoopOneorTwo Vessels"
[Exit_1_Vessel]
print "@ 141 Exit_1_Vessel"
if vV_Strike_Calculated_Volume > 15
goto "Exit_1_Vessel_15"
endif
if vV_Strike_Volume_Max <= 13.5
goto "Exit_1_Vessel_13"
endif
[Exit_1_Vessel_13]
print "@ 141 Exit_1_Vessel_13"
if vV_Lager_or_Ale == 1
	vV_Strike_Status = 1.1
else
	vV_Strike_Status = 1.2
endif
goto "Exit_LoopOneorTwo Vessels"
[Exit_1_Vessel_15]
print "@ 158 Exit_1_Vessel_15"
if vV_Lager_or_Ale == 1
	vV_Strike_Status = 1.5
else
	vV_Strike_Status = 1.6
endif
goto "Exit_LoopOneorTwo Vessels"
[Exit_2_Vessel]
vV_Strike_Status = 2
goto "Exit_LoopOneorTwo Vessels"
[Exit_LoopOneorTwo Vessels]
print "@ 169 Exit_LoopOneorTwo Vessels"
"gblV_Number_Strike_Vessels" value = "gblVReport_B1" value
"gblVReport_B1" value = 0
vS_Msg = "The number of Strike Vessels  is set"
vS_Msg = vS_Msg + vS_Msg1
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = vS_Msg
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
"gblV_Strike_Status_Batch" value = vV_Strike_Status
//........................................
if "sw_Flow_2_Vessels_Strike" state == true
start "scrBrew0_3_Two_Vessels"
sleep 100
"gblS_Script_Ended" value = "Ended: scrBrew0_3_Vessels"
if vB_Testing == true
sleep 4001
endif
clear
stop "scrBrew0_3_Vessels"
endif
//........................................
//........................................
if "sw_Flow_2_Vessels_Strike" state == false
goto "Set_1_Any_Vessel"
endif
if vV_Strike_Status == 2
goto "Exit_Two_Vessels_Status"
endif
if vV_Strike_Status == 1.1
goto "Set_1_Any_Vessel"
endif
if vV_Strike_Status == 1.5
goto "Set_1_No_Radiator"
endif
//....................................
[Exit_Two_Vessels_Status]
print " @ 321 Exit_Two_Vessels_Status"
"gblV_Brew_Status" value = 20
[SectionBrew19]
[SectionBrew20]
wait "gblV_Brew_Status" value == 20
if vV_Lager_or_Ale == 1
  goto "Exit_First_of_2_Vessels_Status_Ale"
else
  goto "Exit_First_of_2_Vessels_Status_Lager"
endif
//.....................................
[Exit_First_of_2_Vessels_Status_Ale]
print "@212 First Vessel Ale"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
vV_Strike_Status = 2.1
"gblS_BrewName_B1" value = "First Vessel:Strike All Tap Water"
vS_Msg = "Two different Strike vessels will be only Tap water. The combined Strike Volume of both the vessels must be a minimum of "
vS_Msg1 = vV_Strike_Calculated_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  It may (and normally can) exceed the Strike Volume.  You can set the Strike and Fill Volumes for each vessel later.  "
vS_Msg = vS_Msg + vS_Msg1
goto "Delay_1st_Vessel"
[Exit_First_of_2_Vessels_Status_Lager]
print "@226 First Vessel Lager"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
vV_Strike_Status = 2.2
"gblS_BrewName_B1" value = "First Vessel Strike Tap Water"
vS_Msg = "Two different Strike Vessels will be used.  The first vessel will contain a minimum of Half the Strike Tap Water volume of "
vS_Msg1 = vV_Half_Strike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  The second vessel will heat the Strike Distilled Water Volume of "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vV_Half_Strike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  The Strike Tap Water will be transferred to the MASH Tun FIRST."
if vV_Half_Strike <= 8
vS_Msg1 = " The best choice for the 1St Vessel is the Brewzilla to hold the Tap Water and the Digiboil for the Distilled.  Both can exceed the half Strike Volume of "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vV_Half_Strike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons."
vS_Msg = vS_Msg + vS_Msg1
endif
goto "Delay_1st_Vessel"
[Delay_1st_Vessel]
print "@242 Delay_1st_Vessel"
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = vS_Msg
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................
// 15 Second Delay
"gblV_Delay_Seconds" value = 15
print 300
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
"gblV_Brew_Status" value = 22
[SectionBrew21]
[SectionBrew22]
print "@260 SectionBrew22 Choose 1st Vessel"
wait "gblV_Brew_Status" value == 22
//.................................................
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
if vV_Lager_or_Ale == 1
vS_Msg = "First Strike Vessel.  Brewzilla or Digiboil are the easiest to use.  (Both Vessels Tap Water)"
endif
if vV_Lager_or_Ale == 2
	if vV_Half_Strike <= 8
	vS_Msg = " Choose First Strike Vessel. Generally the Brewzilla and the Digiboil are the 	easiest to use. (First Vessel Tap Water: Second will Vessel be Distilled)"
	endif
	if vV_Half_Strike > 8
	vS_Msg = " Choose First Strike Vessel. Generally the Big Mac for the first Vessel and the Brewzilla second are the easiest to use. (First Vessel Tap Water: Second will Vessel be Distilled)"
	endif
endif
[Skip_Lager_2_Vessels]
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac\n3 = Brewzilla\n4 = Digiboil\n5 = Little Mac\n6 = BrewKettle"
vS_Msg = vS_Msg + vS_Msg1
"gblS_swAllSwitch_Label_Text" value =  "First Stike Vessel"
"gblS_Brewery_Top_2" value = vS_Msg
"gblSReportLabel_B1" value = "Choose one of the above\nRemember the Maximum Volume"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_2" background = 1
"gblVReport_B1" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
//.........................................
[Restart_Loop_1st]
//..................................................
[Loop_1st]
sleep 100
if "gblVReport_B1" value == 1
vS_Msg_Vessel = "Radiator"
"gblS_Strike_Vessel_1" value = "Radiator"

vS_Msg_Max = "13.5"
goto "Delay_First_Vessel"
endif
//............................
if "gblVReport_B1" value == 2
vS_Msg_Vessel = "Big Mac"
vS_Msg_Max = "48"
goto "Delay_First_Vessel"
endif
//............................
if "gblVReport_B1" value == 3
vS_Msg_Vessel = "Brewzilla"
vS_Msg_Max = "14"
goto "Delay_First_Vessel"
endif
//............................
if "gblVReport_B1" value == 4
vS_Msg_Vessel = "Digiboil"
vS_Msg_Max = "8"
goto "Delay_First_Vessel"
endif
//............................
if "gblVReport_B1" value == 5
vS_Msg_Vessel = "Little Mac"
vS_Msg_Max = "43"
goto "Delay_First_Vessel"
endif
//............................
//............................
if "gblVReport_B1" value == 6
vS_Msg_Vessel = "Brew Kettle"
vS_Msg_Max = "43"
goto "Delay_First_Vessel"
endif
//............................
if "gblVReport_B1" value > 6
"gblVReport_B1" value = 0
"gblSReportLabel_B1" background = 1
"gblSReportLabel_B1" value = "Not Avialable"
sleep 1000
"gblSReportLabel_B1" background = 2
sleep 1000
"gblSReportLabel_B1" background = 1
sleep 1000
"gblSReportLabel_B1" background = 3
"gblSReportLabel_B1" value = "Choose one of the above\nRemember the Maximum Volume"
goto "Loop_1st"
endif
//...........................
goto "Loop_1st"
[Delay_First_Vessel]
"gblV_Strike_Vessel_1" value = "gblVReport_B1" value
vV_Strike_Vessel_1 = "gblV_Strike_Vessel_1" value
"gblVReport_B1" value = 0
//.......................
if vV_Lager_or_Ale == 1
vS_Msg = "The First Vessel is "
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = ". The Volume of the Strike Water in the  "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = " and the total fill Volume will be set later.  "
vS_Msg = vS_Msg + vS_Msg1
else
vS_Msg = "A minimum of Half of the Strike Volume of "
vS_Msg = vS_Msg + vS_Msg_HalfStrike
vS_Msg1 = " of Tap Water will be in the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = ".  The maximum volume of the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = " is "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Max
vS_Msg1 = " gallons. The Fill Volume, set later, can exceed the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_HalfStrike
vS_Msg1 =  " as only that Half Strike Volume will be transferred later."
vS_Msg = vS_Msg + vS_Msg1
endif
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = vS_Msg
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................
// 15 Second Delay
"gblV_Delay_Seconds" value = 15
print 445
start "inscpt_scrShortDelay"
sleep 200
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
goto "Set_2nd_Vessel"
[Set_2nd_Vessel]
print " @464 Second Vessel"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
if vV_Lager_or_Ale == 1
  goto "Exit_Second_of_2_Vessels_Status_Ale"
else
  goto "Exit_Second_of_2_Vessels_Status_Lager"
endif
//.....................................
[Exit_Second_of_2_Vessels_Status_Ale]
print "@412 Second Vessel Ale"
"gblS_BrewName_B1" value = "Second Vessel:Strike All Tap Water"
vS_Msg = "The Second Strike vessels will be only Tap water. The combined Strike Volume of both the vessels must be a minimum of "
vS_Msg1 = vV_Strike_Calculated_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  It may (and normally can) exceed the Strike Volume.  You can set the Strike and Fill Volumes for each vessel later.  "
vS_Msg = vS_Msg + vS_Msg1
goto "Delay_2nd_Vessel"
[Exit_Second_of_2_Vessels_Status_Lager]
print "@425 Second Vessel Lager"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
"gblS_BrewName_B1" value = "Second Vessel Strike Distilled"
vS_Msg = "Two different Strike Vessels will be used.  The second vessel will contain a minimum of Half the Strike Distilled volume of "
vS_Msg1 = vV_Half_Strike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  The second vessel will heat the Strike Distilled Water Volume of "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vV_Half_Strike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  The Strike Distilled will be transferred to the MASH Tun Second."
vS_Msg = vS_Msg + vS_Msg1
goto "Delay_2nd_Vessel"
[Delay_2nd_Vessel]
print "@440 Delay_2nd_Vessel"
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = vS_Msg
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................
// 15 Second Delay
print 512
"gblV_Delay_Seconds" value = 15
start "inscpt_scrShortDelay"
sleep 200
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
"gblV_Brew_Status" value = 22
"gblV_Brew_Status" value = 24
[SectionBrew23]
[SectionBrew24]
wait "gblV_Brew_Status" value == 24
//.................................................
start "inscpt_scrClearBatchHops"
wait "sw_Running_ClearBatchHops" state == false
if vV_Lager_or_Ale == 1
vS_Msg = " Choose Second Strike Vessel.  Remember that "
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = " has already been chosen as Strike Vessel 1."
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac\n3 = Brewzilla\n4 = Digiboil\n5 = Little Mac\n6 = BrewKettle"
vS_Msg = vS_Msg + vS_Msg1
else
vS_Msg = " Choose Second Strike Vessel (Distilled Water).  Remember that "
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = " has already been chosen as Strike Vessel 1."
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac(Do Not Choose)\n3 = Brewzilla\n4 = Digiboil\n5 = Little Mac\n6 = BrewKettle"
vS_Msg = vS_Msg + vS_Msg1
endif
"gblS_swAllSwitch_Label_Text" value =  "Second Strike Vessel"
"gblS_Brewery_Top_2" value = vS_Msg
"gblSReportLabel_B1" value = "Choose one of the above\nRemember the Maximum Volume"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_2" background = 1
"gblVReport_B1" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
//.........................................
[Restart_Loop_Choose_Vessel_2]
//..................................................
[Loop_Choose_Vessel_2]
sleep 100
if "gblVReport_B1" value == 1
"gblS_Strike_Vessel_2" value = "Radiator"
"gblV_Strike_Vessel_Max_Volume_2" value = 13.5
if vV_Strike_Vessel_1 == 1
vS_Msg_Not_Allowed = "Radiator is Strike Vessel 1"
goto "Vessel_2_Not_Allowed"
endif
goto "Delay_2nd_Vessel_Chosen"
endif
//............................
if "gblVReport_B1" value == 2
"gblS_Strike_Vessel_2" value = "Big Mac"
"gblV_Strike_Vessel_Max_Volume_2" value = 49
	if vV_Lager_or_Ale == 2
	vS_Msg_Not_Allowed = "Big Mac is not Avaiable"
	goto "Vessel_2_Not_Allowed"
	endif
//.................
	if vV_Strike_Vessel_1 == 2
	vS_Msg_Not_Allowed = "Big Mac is Strike Vessel 1"
	goto "Vessel_2_Not_Allowed"
	endif
goto "Delay_2nd_Vessel_Chosen"
endif
//............................
if "gblVReport_B1" value == 3
"gblS_Strike_Vessel_2" value = "Brewzilla"
"gblV_Strike_Vessel_Max_Volume_2" value = 15
if vV_Strike_Vessel_1 == 3
vS_Msg_Not_Allowed = "Brewzilla is Strike Vessel 1"
goto "Vessel_2_Not_Allowed"
endif
goto "Delay_2nd_Vessel_Chosen"
endif
//............................
if "gblVReport_B1" value == 4
"gblS_Strike_Vessel_2" value = "Digiboil"
"gblV_Strike_Vessel_Max_Volume_2" value = 8
if vV_Strike_Vessel_1 == 4
vS_Msg_Not_Allowed = "Digiboil is Strike Vessel 1"
goto "Vessel_2_Not_Allowed"
endif
goto "Delay_2nd_Vessel_Chosen"
endif
//............................
if "gblVReport_B1" value == 5
"gblS_Strike_Vessel_2" value = "Little Mac"
"gblV_Strike_Vessel_Max_Volume_2" value = 43
if vV_Strike_Vessel_1 == 5
vS_Msg_Not_Allowed = "Little Mac is Strike Vessel 1"
goto "Vessel_2_Not_Allowed"
endif
goto "Delay_2nd_Vessel_Chosen"
endif
//............................
//............................
if "gblVReport_B1" value == 6
"gblS_Strike_Vessel_2" value = "Brew Kettle"
"gblV_Strike_Vessel_Max_Volume_2" value = 43
if vV_Strike_Vessel_1 == 6
vS_Msg_Not_Allowed = "Brew Kettle is Strike Vessel 1"
goto "Vessel_2_Not_Allowed"
endif
goto "Delay_2nd_Vessel_Chosen"
endif
//............................
if "gblVReport_B1" value > 6
vS_Msg_Not_Allowed = "Not Available.  Choose from Above!"
goto "Vessel_2_Not_Allowed"
endif
//...........................
goto "Loop_Choose_Vessel_2"
[Vessel_2_Not_Allowed]
"gblSReportLabel_B1" background = 1
"gblSReportLabel_B1" value = vS_Msg_Not_Allowed
sleep 1000
"gblSReportLabel_B1" background = 2
sleep 1000
"gblSReportLabel_B1" background = 1
sleep 1000
"gblSReportLabel_B1" background = 3
"gblSReportLabel_B1" value = "Choose one of the above\nRemember the Maximum Volume"
"gblVReport_B1" value = 0
goto "Loop_Choose_Vessel_2"
[Delay_2nd_Vessel_Chosen]
"gblV_Strike_Vessel_2" value = "gblVReport_B1" value
"gblVReport_B1" value = 0
vS_Msg = "A minimum of Half of the Strike Volume of "
vS_Msg = vS_Msg + vS_Msg_HalfStrike
vS_Msg1 = " of Tap Water will be in the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = ".  The maximum volume of the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = " is "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Max
vS_Msg1 = " gallons. The Fill Volume, set later, can exceed the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_HalfStrike
vS_Msg1 =  " as only that Half Strike Volume will be transferred later."
vS_Msg = vS_Msg + vS_Msg1
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = vS_Msg
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................
// 15 Second Delay
print "10 Second Delay"
"gblV_Delay_Seconds" value = 15
start "inscpt_scrShortDelay"
sleep 200
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
goto "Ender_Vessels"
[Set_1_Any_Vessel]
"gblV_Brew_Status" value = 26
[SectionBrew25]
[SectionBrew26]
wait "gblV_Brew_Status" value == 26
vS_Msg = "The Total Strike Volume is "
vS_Msg1 = vV_Strike_Calculated_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  "
vS_Msg = vS_Msg + vS_Msg1
if vV_Lager_or_Ale == 1
  goto "1_Vessel_Ale"
else
  goto "1_Vessel_Lager"
endif
[1_Vessel_Ale]
if vV_Strike_Volume_Max <= 13.5
vS_Msg1 = "All of the Strike will be in a Single Vessel.  Choose any Vessel that can hold all of the Strike.  The Brewzilla is the best choice. The Fill Volume may (and normally will) exceed the Strike Volume as only the Strike Volume will be transferred."
vS_Msg = vS_Msg + vS_Msg1
goto "Delay_1_Vessel_Only_1"
endif
[Set_1_No_Radiator]
if vV_Strike_Volume_Max > 13.5
if vV_Strike_Volume_Max <= 15
vS_Msg1 = "All of the Strike will be in a single vessel except the Radiator  Any Vessel other than the Radiator can hold all of the Strike. The Brewzilla is the best choice. The Fill Volume may (and normally will) exceed the Strike Volume as only the Strike Volume will be transferred."
vS_Msg = vS_Msg + vS_Msg1
goto "Delay_1_Vessel_Only_1"
endif
endif
if vV_Strike_Volume_Max > 15
vS_Msg1 = "All of the Strike will be in a single vessel but the choices are limited.  Normally the Big Mac is the best vessel for an Ale due to the Volume of Strike, but the Little Mac or Brew Kettle can also be used.  The Fill Volume may (and normally will) exceed the Strike Volume as only the Strike Volume will be transferred."
vS_Msg = vS_Msg + vS_Msg1
goto "Delay_1_Vessel_Only_1"
endif
[1_Vessel_Lager]
if vV_Strike_Volume_Max <= 13.5
vS_Msg1 = vS_Msg_HalfStrike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " of Tap Water. An equal volume of Distilled Water will be added.The Brewzilla is the best choice.  If there is capacity, the Fill Volume can exceed the Strike Volume, but the 1:1 ratio of Tap and Distilled should be maintained."
vS_Msg = vS_Msg + vS_Msg1
goto "Delay_1_Vessel_Only_1"
endif
if vV_Strike_Volume_Max > 13.5
if vV_Strike_Volume_Max <= 15
vS_Msg1 = vS_Msg_HalfStrike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " of Tap Water. An equal volume of Distilled Water will be added. The Brewzilla is the best choice. The Little Mac or Brew Kettle could also be used. If there is capacity, the Fill Volume can exceed the Strike Volume, but the 1:1 ratio of Tap and Distilled should be maintained."
vS_Msg = vS_Msg + vS_Msg1
goto "Delay_1_Vessel_Only_1"
endif
endif
if vV_Strike_Volume_Max > 15
vS_Msg1 = vS_Msg_HalfStrike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " of Tap Water. An equal volume of Distilled Water will be added. Water will be added. The Fill Volume can exceed the Strike Volume, but the 1:1 ratio of Tap and Distilled should be maintained. The Vessel is limited to"
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 =  "\n5 = Little Mac  6 = Brew Kettle"
vS_Msg = vS_Msg + vS_Msg1
goto "Delay_1_Vessel_Only_1"
endif
[Delay_1_Vessel_Only_1]
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = vS_Msg
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................
// 15 Second Delay
print "10 Second Delay"
"gblV_Delay_Seconds" value = 15
start "inscpt_scrShortDelay"
sleep 200
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
"gblV_Brew_Status" value = 28
[SectionBrew27]
[SectionBrew28]
wait "gblV_Brew_Status" value == 28
vS_Msg = " Choose the Strike Vessel "
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac\n3 = Brewzilla\n4 = Digiboil \n5 = Little Mac\n6 = BrewKettle"
if vV_Strike_Calculated_Volume > 8
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac\n3 = Brewzilla\n4 = Not A Choice \n5 = Little Mac\n6 = BrewKettle"
endif
if vV_Strike_Calculated_Volume > 13.5
vS_Msg1 = "\n1 = Not a Choice\n2 = Big Mac\n3 = Brewzilla\n4 = Not A Choice \n5 = Little Mac\n6 = BrewKettle"
endif
if vV_Strike_Calculated_Volume > 15
vS_Msg1 = "\n1 = Not a Choice\n2 = Not A Choice \n3 = Not a Choice\n4 = Not A Choice \n5 = Little Mac\n6 = BrewKettle"
endif
vS_Msg = vS_Msg + vS_Msg1
"gblS_swAllSwitch_Label_Text" value =  "Strike Vessel"
"gblS_Brewery_Top_2" value = vS_Msg
"gblSReportLabel_B1" value = "Choose one of the above\nRemember the Maximum Volume"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_2" background = 1
"gblVReport_B1" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblV_Brew_Status" value = 30
[SectionBrew29]
[SectionBrew30]
wait "gblV_Brew_Status" value == 30
//.........................................
[Restart_Loop_1_Vessel_Only]
//..................................................
[Loop_Choose_1_Vessel_Only]
sleep 100
if "gblVReport_B1" value == 1
"gblS_Strike_Vessel_1" value = "Radiator"
"gblV_Strike_Vessel_Max_Volume_1" value = 13.5
"sw_Status_BigMac_HLT" state = true
if vV_Strike_Volume_Max > 13.5
vS_Msg_Not_Allowed = "Radiator will not hold all of the Strike"
"sw_Status_BigMac_HLT" state = false
goto "Vessel_1_Only_Not_Allowed"
endif
goto "Exit_Loop_Choose_1_Vessel_Only"
endif
//............................
if "gblVReport_B1" value == 2
"gblS_Strike_Vessel_1" value = "Big Mac"
"gblV_Strike_Vessel_Max_Volume_1" value = 49
"sw_Status_Radiator_HERMs_Bath" state = true
goto "Exit_Loop_Choose_1_Vessel_Only"
endif
//............................
if "gblVReport_B1" value == 3
"gblS_Strike_Vessel_1" value = "Brewzilla"
"gblV_Strike_Vessel_Max_Volume_1" value = 15
"sw_Status_BigMac_HLT" state = true
"sw_Status_Radiator_HERMs_Bath" state = true
if vV_Strike_Volume_Max > 15
vS_Msg_Not_Allowed = "Brewzilla will not hold all of the Strike"
"sw_Status_BigMac_HLT" state = false
"sw_Status_Radiator_HERMs_Bath" state = false
goto "Vessel_1_Only_Not_Allowed"
endif
goto "Exit_Loop_Choose_1_Vessel_Only"
endif
//............................
if "gblVReport_B1" value == 4
"gblS_Strike_Vessel_1" value = "Digiboil"
"gblV_Strike_Vessel_Max_Volume_1" value = 8
"sw_Status_BigMac_HLT" state = true
"sw_Status_Radiator_HERMs_Bath" state = true
if vV_Strike_Volume_Max > 8
vS_Msg_Not_Allowed = "Digiboil will not hold all of the Strike"
"sw_Status_BigMac_HLT" state = false
"sw_Status_Radiator_HERMs_Bath" state = false
goto "Vessel_1_Only_Not_Allowed"
endif
goto "Exit_Loop_Choose_1_Vessel_Only"
endif
//............................
if "gblVReport_B1" value == 5
"gblS_Strike_Vessel_1" value = "Little Mac"
"gblV_Strike_Vessel_Max_Volume_1" value = 43
"sw_Status_BigMac_HLT" state = true
"sw_Status_Radiator_HERMs_Bath" state = true
goto "Exit_Loop_Choose_1_Vessel_Only"
endif
//............................
if "gblVReport_B1" value == 6
"gblS_Strike_Vessel_1" value = "Brew Kettle"
"gblV_Strike_Vessel_Max_Volume_1" value = 43
"sw_Status_BigMac_HLT" state = true
"sw_Status_Radiator_HERMs_Bath" state = true
goto "Exit_Loop_Choose_1_Vessel_Only"
endif
//............................
if "gblVReport_B1" value > 6
vS_Msg_Not_Allowed = "Not Available.  Choose from Above!"
goto "Vessel_1_Only_Not_Allowed"
endif
//...........................
goto "Loop_Choose_1_Vessel_Only"
[Vessel_1_Only_Not_Allowed]
"gblSReportLabel_B1" background = 1
"gblSReportLabel_B1" value = vS_Msg_Not_Allowed
sleep 1000
"gblSReportLabel_B1" background = 2
sleep 1000
"gblSReportLabel_B1" background = 1
sleep 1000
"gblSReportLabel_B1" background = 3
"gblSReportLabel_B1" value = "Choose one of the above\nRemember the Maximum Volume"
"gblVReport_B1" value = 0
goto "Loop_Choose_1_Vessel_Only"
[Exit_Loop_Choose_1_Vessel_Only]
"gblV_Strike_Vessel_1" value = "gblVReport_B1" value
vS_Msg_Vessel = "gblS_Strike_Vessel_1" value
vS_Msg_Max = "gblV_Strike_Vessel_Max_Volume_1" value
"gblVReport_B1" value = 0
"gblV_Strike_Vessel_1" visibility = visible
"gblV_Brew_Status" value = 32
[SectionBrew31]
[SectionBrew32]
wait "gblV_Brew_Status" value == 32
if vV_Lager_or_Ale == 1
vS_Msg = "The Strike Volume is "
vS_Msg1 = vV_Strike_Calculated_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  All of the Strike is Tap Water.  The single Strike Vessel is the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vS_Msg_Vessel
vS_Msg = vS_Msg + vS_Msg1
endif
if vV_Lager_or_Ale == 2
vS_Msg = "The Strike Volume is "
vS_Msg1 = vV_Strike_Calculated_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  Half of the Strike is "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vS_Msg_HalfStrike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  Half of the Strike is Tap Water. The same amount is Distilled Water.  The single Strike Vessel is the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vS_Msg_Vessel
vS_Msg = vS_Msg + vS_Msg1
endif
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = vS_Msg
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
start "inscpt_scrShortDelay"
sleep 200
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
goto "Ender_Vessels"
[Ender_Vessels]
"gblS_Script_Ended" value = "Ended: scrBrew0_3_Vessels"
if vB_Testing == true
 sleep 4001
endif
clear
start "scrBrew0_4_Strike_Tree"
stop "scrBrew0_3_Vessels"
```

## 10. scrBrew0_3_Two_Vessels

Starts by itself: No · User can start or stop it: No · 785 lines

```text
//scrBrew0_3_Two_Vessels
//Version: 261001_12:43
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
//Modified  06/22/2026 17:14
//Continues to Set Brew Day with General Strike Status.
//................................
// Set Testing
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
stop "looper_scrBackground_Hops"
//.................................
 if vB_Testing == true
"gblS_Script_Started" value = "Started: scrBrew0_3_Two_Vessels"
"gblS_Inter_Script" value = " -- "
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
new string vS_Msg
new string vS_Msg1
new string vS_Msg_Vessel
new string vS_Msg_Max
new string vS_Msg_Not_Allowed
new string vS_Msg_Save
new string vS_Msg_Strike_1
new string vS_Msg_Strike_2
new string vS_Second_Fill_Vessel_List
new string vS_Label_1
new string vS_Label_2
new string vS_1st_Strike_Vessel_Fill
new string vS_Strike_Water
new value vV_Strike_SetPoint_Plus
new value vV_Strike_Calculated_Volume
new string vS_Msg_HalfStrike
new value vV_Half_Strike
new value vV_Half_Strike_All_Dead
new value vV_Half_Strike_Half_Dead
new value vV_Lager_or_Ale
new value vV_Strike_Status
new value vV_Strike_Vessel_1
new value vV_Strike_Vessel_2
new value vV_Number_Strike_Vessel
new value vV_2nd_Strike_Vessel_Fill
new value vV_Strike_Volume_Max
new value vV_Radiator_Dead_Space
new value vV_Strike_Volume_Max_2
new value vV_Volume_Strike_1
new value vV_Default_Big_Mac
new value vV_Default_Big_Mac_Half
new value vV_1st_Strike_Vessel_Fill
new value vV_Gallons_to_Fill_Distilled
new bool vB_Ale_1_Vessel
new bool vB_Mixed_Strike
new bool vB_Lager_2_Vessels
new bool vB_Ale_2_Vessels
new bool vB_Distilled_Half_Strike
new bool vB_Half_Strike
//.......................................
vV_Lager_or_Ale = "gblVLagerAle" value
stop "scrBrew0_5a_Fill_First"
"gblV_Saved_Brew_Status" value = 0
"gblVScriptFlow" value = 0
//...............................................................................
"gblVElaspedSeconds" value = 0
"gblV_Fermentor" value = 0
"gblV_Water_Status_saved" value = 0
"gblV_Valve_Status" value = 999
"sw_Flow_Set_Manual" state = false
"gblV_Vessel_From" value = 0
"gblV_Vessel_To" value = 0
"gblV_Vessel_Measure" value = 0
"glbV_Vessel_Adjust" value = 0
"gblV_Pump" value = 0
"gblV_Isolation_Valve" value = 0
"gblV_Rate" value = 0
"gblV_SPG_Calculated" value = 0
"gblV_SPG_Delta_Rate" value = 0
"gblS_Vessel_From" value = ""
"gblS_Vessel_To" value = ""
"gblS_Pump" value = ""
"gblV_Volume_Max" value = 0
"gblS_Vessel_Measure" value = ""
"gblS_Vessel_Adjust" value = ""
"glbS_Isolation_Valve" value = ""
"gblS_Strike_Vessel_1" value = ""
"gblS_Strike_Vessel_2" value = ""
"gblV_Start_To" value = 0
"gblV_Start_From" value = 0
"gblV_Start_Adjust" value = 0
"gblV_Desired_Measured_Volume_End" value = 0
"gblV_Minimum_Volume_End" value = 0
"gblV__Volume_Added" value = 0
"sw_Status_DeadSpace_Radiator" state = false
"sw_Flow_Radiator_Delayed" state = false
"sw_Flow_BigMac_Delayed" state = false
"sw_Flow_Brewzilla_Delayed" state = false
"sw_Flow_DigiBoil_Delayed" state = false
"sw_Status_Brewzilla _Heater_On" state = false
"sw_Status_DigiBoil _Heater_On" state = false
"sw_Status_BigMac_HLT" state = false
vV_Strike_Calculated_Volume = "gblVStrikeVolume" value
vV_Strike_SetPoint_Plus = "gblV_Desired_Strike" value + "gblV_StrikeOffset" value
"gblV_Number_Strike_Vessels" visibility = visible
"gblV_Strike_Vessel_1" visibility = visible
//..............................
vV_Half_Strike = vV_Strike_Calculated_Volume / 2
//"gblVHalfStrike" value = vV_Half_Strike
vV_Radiator_Dead_Space = "glbV_Rad_Dead_Space" value
vV_Half_Strike_All_Dead = vV_Half_Strike + vV_Radiator_Dead_Space
vV_Half_Strike_Half_Dead = vV_Radiator_Dead_Space / 2
vV_Half_Strike_Half_Dead = vV_Half_Strike + vV_Half_Strike_Half_Dead
vS_Msg = "Half Strike volume of "
vS_Msg1 = vV_Half_Strike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.  "
//................................
//................................
vV_Lager_or_Ale = "gblVLagerAle" value
vV_Number_Strike_Vessel = "gblV_Number_Strike_Vessels" value
vV_Strike_Calculated_Volume = "gblVStrikeVolume" value
vV_Half_Strike = vV_Strike_Calculated_Volume / 2
vB_Half_Strike = true
"gblV_Minimum_Volume_End" value = vV_Half_Strike
if vV_Number_Strike_Vessel == 1
	if vV_Lager_or_Ale == 1
	vB_Ale_1_Vessel = true
goto "Ender_2_Vessels"
endif
	if vV_Lager_or_Ale == 2
	vB_Mixed_Strike = true
	vV_1st_Strike_Vessel_Fill = "gblV_Strike_Vessel_1" value
	vS_1st_Strike_Vessel_Fill =  "gblS_Strike_Vessel_1" value
	vV_2nd_Strike_Vessel_Fill = "gblV_Strike_Vessel_1" value
	vS_2nd_Strike_Vessel_Fill =  "gblS_Strike_Vessel_1" value
	goto "Set_Half_Strike"
	endif
endif
if vV_Number_Strike_Vessel == 2
	vV_1st_Strike_Vessel_Fill = "gblV_Strike_Vessel_1" value
	vS_1st_Strike_Vessel_Fill =  "gblS_Strike_Vessel_1" value
	if vV_Lager_or_Ale == 1
	vB_Ale_2_Vessels = true
vV_Default_Big_Mac = 40
	goto "Second_Fill"
	endif
	if vV_Lager_or_Ale == 2
	vB_Lager_2_Vessels = true
	vV_1st_Strike_Vessel_Fill = "gblV_Strike_Vessel_1" value
	vS_1st_Strike_Vessel_Fill =  "gblS_Strike_Vessel_1" value
		goto "Set_Half_Strike"
	endif
endif
[Set_Distilled_Half_Strike]
		vB_Distilled_Half_Strike = true
		"gblV_Distilled_to_Add" value  = vV_Half_Strike
		vV_Gallons_to_Fill_Distilled = "gblV_Distilled_to_Add" value
		vV_Default_Big_Mac = vV_Half_Strike + 11
		vV_Default_Big_Mac_Half = vV_Half_Strike + 5.5
//.....................................
if vV_1st_Strike_Vessel_Fill == 1
vS_Second_Fill_Vessel_List ="\n1 = Not a Choice\n2 = Big Mac\n3 = Brewzilla\n4 = Digiboil\n5 = Little Mac\n6 = Brew Kettle"
	if 	vB_Mixed_Strike == true
		vS_Msg_Strike_1 = "The Strike Vessel is the Radiator.  The Strike is Tap Water && Distilled/RO Water 1:1 Ratio.   The Tap Water Volume of the Radiator is "
		vS_Msg1 = "gblVCurrentRadiator_Volume" value
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
		vS_Msg1 = " gallons.  You will need to add Distilled Water/RO to the Radiator in the Amount of "
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
		vS_Msg1 = vV_Half_Strike_Half_Dead
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
		vS_Msg1 = "  gallons.  Remember to keep the 1:1 Ratio! Fill in the Final Volume of the Radiator Mixed Strike."
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
	goto "Fill Distilled"
	endif
	if vB_Ale_2_Vessels == true
		vS_Msg_Strike_1 = "All of the Strike is Tap Water.  The First Strike Vessel is the Radiator .  The Volume of the Radiator is "
		vS_Msg1 = "gblVCurrentRadiator_Volume" value
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
		vS_Msg1 = " gallons.  You will need to Choose the Second Strike Vessel to be filled with Tap Water."
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
	goto "Choose_Second_Vessel"
	endif
	if vB_Lager_2_Vessels == true
		vS_Msg_Strike_1 = "The Strike is Tap Water && Distilled/RO Water 1:1 Ratio.  The First Strike Vessel is the Radiator .  The Volume of the Radiator is "
		vS_Msg1 = "gblVCurrentRadiator_Volume" value
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
		vS_Msg1 = " gallons. Only Half of the Stike will be transferred later from the Radiator. You will need to Choose the Second Strike Vessel to be filled with the second half  Distilled/RO Water."
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
	goto "Choose_Second_Vessel"
	endif
endif
if vV_1st_Strike_Vessel_Fill == 2
vS_Second_Fill_Vessel_List ="\n1 = Radiator\n2 = Not a Choice\n3 = Brewzilla\n4 = Digiboil\n5 = Little Mac\n6 = Brew Kettle"
	if 	vB_Mixed_Strike == true
		vS_Msg_Strike_1 = "The Strike Vessel is the Big Mac.  The Strike is Tap Water && Distilled/RO Water 1:1 Ratio.   The Tap Water Volume of the Big Mac is "
		vS_Msg1 = "gblVCurrentBigMac_Volume" value
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
		vS_Msg1 = " gallons.  You will need to add Distilled Water/RO to the Big Mac in the Amount of "
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
		vS_Msg1 = vV_Half_Strike_Half_Dead
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
		vS_Msg1 = "  gallons.  Remember to keep the 1:1 Ratio! Fill in the Final Volume of the Big Mac Mixed Strike."
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
	goto "Fill Distilled"
	endif
	if vB_Ale_2_Vessels == true
		vS_Msg_Strike_1 = "All of the Strike is Tap Water.  The First Strike Vessel is the Big Mac .  The Volume of the Big Mac is "
		vS_Msg1 = "gblVCurrentBigMac_Volume" value
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
		vS_Msg1 = " gallons.  You will need to Choose the Second Strike Vessel to be filled with Tap Water."
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
	goto "Choose_Second_Vessel"
	endif
	if vB_Lager_2_Vessels == true
		vS_Msg_Strike_1 = "The Strike is Tap Water && Distilled/RO Water 1:1 Ratio.  The First Strike Vessel is the Big Mac .  The Volume of the Big Mac is "
		vS_Msg1 = "gblVCurrentBigMac_Volume" value
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
		vS_Msg1 = " gallons. Only Half of the Stike will be transferred later from the Big Mac. You will need to Choose the Second Strike Vessel to be filled with the second half  Distilled/RO Water."
		vS_Msg_Strike_1 = vS_Msg_Strike_1 + vS_Msg1
	goto "Choose_Second_Vessel"
	endif
endif
if vV_1st_Strike_Vessel_Fill == 3
vS_Second_Fill_Vessel_List ="\n1 = Radiator\n2 = Big Mac \n3 = Not a Choice\n4 = Digiboil\n5 = Little Mac\n6 = Brew Kettle"
endif
if vV_1st_Strike_Vessel_Fill == 4
vS_Second_Fill_Vessel_List ="\n1 = Radiator\n2 = Big Mac \n3 = Brewzilla\n4 = Not a Choice\n5 = Little Mac\n6 = Brew Kettle"
endif
if vV_1st_Strike_Vessel_Fill == 5
vS_Second_Fill_Vessel_List ="\n1 = Radiator\n2 = Big Mac \n3 = Brewzilla\n4 = DigiBoil\n5 = Not a Choice\n6 = Brew Kettle"
endif
if vV_1st_Strike_Vessel_Fill == 6
vS_Second_Fill_Vessel_List ="\n1 = Radiator\n2 = Big Mac \n3 = Brewzilla\n4 = DigiBoil\n5 = Little Mac\n6 = Not a Choice"
endif
[Choose_Second_Fill]
if vV_Lager_or_Ale == 2
vS_Msg1 = " gallons.  One  Half will be Distilled Water  which will be in the first Strike Vessel Chosen.  The DigiBoil is normally a great choice for the first Strike Vessel.   The Brewzilla is a great choice for the Second Strike Vessel which will be filled with the Half of Tap Water."
endif
vS_Msg = vS_Msg + vS_Msg1
vS_Msg_HalfStrike = vS_Msg
//..........................................
show workspace "B1 Brewery"
// Where to Start
"gblV_Brew_Status" value = 18
goto "SectionBrew18"
//....................................................
[SectionBrew18]
wait "gblV_Brew_Status" value == 18
//.................//........................................
if vV_Half_Strike <= 8
vV_Strike_Volume_Max = 8
endif
if vV_Half_Strike <= 13.5
vV_Strike_Volume_Max = 13.5
endif
if vV_Half_Strike > 13.5
if vV_Half_Strike <= 15
vV_Strike_Volume_Max = 15
endif
endif
[First_Strike_Vessel]
if vV_Strike_Volume_Max == 8
vV_Strike_Status = 1.8
if vV_Lager_or_Ale == 2
vV_Strike_Status = 2.8
goto "Set_1_Any_Vessel"
endif
goto "Set_1_Any_Vessel"
endif
if vV_Lager_or_Ale == 1
vS_Msg1 = "Ale Half Strike (Tap) Water"
"gblS_BrewName_B1" value = vS_Msg1
"gblV_Minimum_Volume_End" value = vV_Half_Strike
"gblS_BrewName_B1" value = vS_Msg1
vV_Strike_Status = 1.2
goto "Set_1_Any_Vessel"
endif
if vV_Lager_or_Ale == 2
vS_Msg1 = "Lager Half Strike(Distilled)  Water"
"gblV_Distilled_to_Add" value = vV_Half_Strike
"gblV_Minimum_Volume_End" value = vV_Half_Strike
"gblS_BrewName_B1" value = vS_Msg1
vV_Strike_Status = 2.2
goto "Set_1_Any_Vessel"
endif
[Set_1_Any_Vessel]
if vV_Lager_or_Ale == 1
"gblS_BrewName_B1" value = "First Vessel: Half Strike Tap Water"
vS_Msg = "Two different Strike vessels will be only Tap water. The combined Strike Volume of both the vessels must be a minimum of "
endif
if vV_Lager_or_Ale == 2
"gblS_BrewName_B1" value = "First Vessel: Half Strike (Distilled  Water)"
vS_Msg = "Two different Strike vessels:  First Strike  Will be Distilled Water and the Second Strike Vessel will be Tap water. The combined Strike Volume of both the vessels must be a minimum of "
endif
vS_Msg1 = vV_Strike_Calculated_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.   Generally the Brewzilla and the Digiboil are the easiest to use. The volume in each vessel may exceed "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vV_Half_Strike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons."
vS_Msg = vS_Msg + vS_Msg1
//......................................
"gblS_Top_Text" value = vS_Msg
vS_Msg = "That Half Strike Volume  of "
vS_Msg1 = vV_Half_Strike
vS_Msg = vS_Msg + vS_Msg1
if vV_Lager_or_Ale == 1
vS_Msg1 = " gallons is the Minimum in Each Strike Vessel.  The Volume can exceed that Half Strike as only the Half Strike Volume will be transferred. "
endif
if vV_Lager_or_Ale == 2
vS_Msg1 = " gallons is the Minimum in Each Strike Vessel.  The Volume of the First Strike Vessel will be Distilled Water so it is normally filled only with the Half Strike. The SEcond Stike Vessel can and will normally exceed that Half Strike as only the Half Strike Volume will be transferred. "
endif
vS_Msg = vS_Msg + vS_Msg1
"gblS_Bottom_Text" value = vS_Msg
// 15 Second Delay
"gblV_Delay_Seconds" value = 15
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = true
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = true
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//......................................
if vV_Lager_or_Ale == 1
vS_Msg = " Choose First Strike Vessel. First Vessel Tap Water: Second will Vessel be Tap Water Chose: "
endif
if vV_Lager_or_Ale == 1
vS_Msg = " Choose First Strike Vessel. First Vessel Distilled Water: Second will Vessel be Tap Water Chose: "
endif
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac\n3 = Brewzilla\n4 = Digiboil\n5 = Little Mac\n6 = BrewKettle"
if vV_Strike_Status == 1.8
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac\n3 = Brewzilla\n4 = Not a Choice\n5 = Little Mac\n6 = BrewKettle"
endif
vS_Msg = vS_Msg + vS_Msg1
goto "Choose_First_Vessel"
//......................................
[Choose_First_Vessel]
"gblS_swAllSwitch_Label_Text" value =  "First Stike Vessel"
"gblS_Brewery_Top_2" value = vS_Msg
vS_Msg_Save = vS_Msg
"gblSReportLabel_B1" value = "Choose one of the above\nRemember the Maximum Volume"
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_2" background = 1
"gblVReport_B1" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
//.........................................
[Restart_Loop_1st]
goto "Loop_1st"
//..................................................
[Wrong_Choice_First]
"gblS_Brewery_Top_2" background = 2
"gblS_Brewery_Top_2" value = vS_Msg_Not_Allowed
"gblSReportLabel_B1" background = 1
"gblVReport_B1" value = 0
"gblSReportLabel_B1" value = "Not Avialable"
sleep 1000
"gblSReportLabel_B1" background = 2
sleep 1000
"gblSReportLabel_B1" background = 1
sleep 1000
"gblSReportLabel_B1" background = 3
"gblSReportLabel_B1" value = "Choose one of the above\nRemember the Maximum Volume"
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_2" value = vS_Msg_Save
[Loop_1st]
sleep 100
if "gblVReport_B1" value == 1
vS_Msg_Vessel = "Radiator"
"gblS_Strike_Vessel_1" value = "Radiator"
vS_Msg_Max = "13.5"
goto "Delay_First_Vessel"
endif
//............................
if "gblVReport_B1" value == 2
vS_Msg_Vessel = "Big Mac"
"gblS_Strike_Vessel_1" value = "Big Mac"
vS_Msg_Max = "49"
goto "Delay_First_Vessel"
endif
//............................
if "gblVReport_B1" value == 3
vS_Msg_Vessel = "Brewzilla"
"gblS_Strike_Vessel_1" value =  "Brewzilla"
vS_Msg_Max = "15"
goto "Delay_First_Vessel"
endif
//............................
if "gblVReport_B1" value == 4
	if vV_Strike_Status == 1.8
		vS_Msg_Not_Allowed = "The DigiBoil is not an available choice due to Volume.  Choose a different Vessel"
		goto "Wrong_Choice_First"
	endif
	if vV_Strike_Status == 2.8
		vS_Msg_Not_Allowed = "The DigiBoil is not an available choice due to Volume.  Choose a different Vessel"
		goto "Wrong_Choice_First"
	endif
	vS_Msg_Vessel = "Digiboil"
	"gblS_Strike_Vessel_1" value =  "Digiboil"
	vS_Msg_Max = "8"
	goto "Delay_First_Vessel"
endif
//............................
if "gblVReport_B1" value == 5
vS_Msg_Vessel = "Little Mac"
"gblS_Strike_Vessel_1" value = "Little Mac"
vS_Msg_Max = "43"
goto "Delay_First_Vessel"
endif
//............................
//............................
if "gblVReport_B1" value == 6
vS_Msg_Vessel = "Brew Kettle"
"gblS_Strike_Vessel_1" value = "Brew Kettle"
vS_Msg_Max = "43"
goto "Delay_First_Vessel"
endif
//............................
if "gblVReport_B1" value > 6
"gblVReport_B1" value = 0
vS_Msg_Not_Allowed = "The Choice is from 1 to 6 Only."
goto "Wrong_Choice_First"
endif
//...........................
goto "Loop_1st"
[Delay_First_Vessel]
"gblV_Strike_Vessel_2" value = "gblVReport_B1" value
vV_Strike_Vessel_2 = "gblV_Strike_Vessel_2" value
"gblV_Strike_Vessel_Max_Volume_1" value = vS_Msg_Max
"gblVReport_B1" value = 0
//.......................
vS_Msg = "The First Vessel is the "
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = ". The Half Strike Volume of the Strike Water in the  "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = " and the total fill Volume will be set later.  "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = "A minimum of Half of the Strike Volume of "
vS_Msg = vS_Msg + vS_Msg_HalfStrike
vS_Msg1 = " of Tap Water will be in the "
	if vV_Lager_or_Ale == 2
	vS_Msg1 = " of Distilled Water will be in the "
	endif
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = ".  The maximum volume of the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = " is "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Max
vS_Msg1 = " gallons. The Fill Volume, set later, can exceed the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_HalfStrike
vS_Msg1 =  " as only that Half Strike Volume will be transferred later."
vS_Msg = vS_Msg + vS_Msg1
//......................................
"gblS_Top_Text" value = vS_Msg
// 10 Second Delay
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
//......................................
//........................................
"gblS_Brewery_Top_1" visibility = hidden
goto "Set_2nd_Vessel"
[Set_2nd_Vessel]
print " @409 Second Vessel"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//..........................
[Second_Strike_Vessel]
"gblS_BrewName_B1" value = "Second Vessel: Half Strike Tap Water"
vS_Msg = "Two different Strike vessels will be only Tap water. The combined Strike Volume of both the vessels must be a minimum of "
if vV_Lager_or_Ale == 2
vS_Msg = "The First Strike Vessels will be only Distilled water.  The Second Strike Vessel will be Tap Water. The combined Strike Volume of both the vessels must be a minimum of "
vS_Msg1 = vV_Strike_Calculated_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons. "
vS_Msg = vS_Msg + vS_Msg1
if vV_Strike_Vessel_1 != 3
vS_Msg1 = " gallons. The Brewzilla is a good choice for the Second Strike Vessel. "
	else
   vS_Msg1 = " gallons. Choose one of the available vessels for the Second Strike Vessel.  Choose: "
	if vV_Strike_Vessel_1 != 2
	vS_Msg1 = " gallons. The Big Mac is a good choice for the Second Strike Vessel. "
	endif
endif
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 =  "The volume in each vessel may exceed "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vV_Half_Strike
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons.   That Half Strike Volume in the two seperate vessels can and will likely exceed that volume as only the Strike Volume will be transferred. "
vS_Msg = vS_Msg + vS_Msg1
endif
//......................................
"gblS_Top_Text" value = vS_Msg
// 10 Second Delay
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
//......................................
vS_Msg = " Choose Second Strike Vessel. "
if vV_Strike_Vessel_1 != 3
vS_Msg1 = "The Brewzilla is a good choice for the Second Strike Vessel.  Choose: "
 
	else
   vS_Msg1 = "Choose one of the available vessels for the Second Strike Vessel.  Choose: "
	if vV_Strike_Vessel_1 != 2
	vS_Msg1 = "The Big Mac is a good choice for the Second Strike Vessel.  Choose: "
	endif
endif
vS_Msg = vS_Msg + vS_Msg1
if vV_Strike_Vessel_1 == 1
vS_Msg1 = "\n1 = Not a Choice\n2 = Big Mac\n3 = Brewzilla\n4 = Digiboil\n5 = Little Mac\n6 = BrewKettle"
endif
if vV_Strike_Vessel_1 == 2
vS_Msg1 = "\n1 = Radiator\n2 = Not a Choice\n3 = Brewzilla\n4 = Digiboil\n5 = Little Mac\n6 = BrewKettle"
endif
if vV_Strike_Vessel_1 == 3
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac\n3 = Not a Choice\n4 = DigiBoil\n5 = Little Mac\n6 = BrewKettle"
endif
if vV_Strike_Vessel_1 == 4
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac\n3 = Brewzilla\n4 = Not a Choice\n5 = Little Mac\n6 = BrewKettle"
endif
if vV_Strike_Vessel_1 == 5
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac\n3 = Brewzilla\n4 = DigiBoil\n5 = Not a Choice\n6 = BrewKettle"
endif
if vV_Strike_Vessel_1 == 6
vS_Msg1 = "\n1 = Radiator\n2 = Big Mac\n3 = Brewzilla\n4 = DigiBoil\n5 = Little Mac\n6 = Not a Choice"
endif
vS_Msg = vS_Msg + vS_Msg1
goto "Choose_Second_Vessel"
//......................................
[Choose_Second_Vessel]
"gblS_swAllSwitch_Label_Text" value =  "Second Stike Vessel"
"gblS_Brewery_Top_2" value = vS_Msg
vS_Msg_Save = vS_Msg
"gblSReportLabel_B1" value = "Choose one of the above\nRemember the Maximum Volume"
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_2" background = 1
"gblVReport_B1" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
//.........................................
[Restart_Loop_2nd]
goto "Loop_2nd"
//..................................................
[Wrong_Choice_Second]
"gblS_Brewery_Top_2" background = 2
"gblS_Brewery_Top_2" value = vS_Msg_Not_Allowed
"gblSReportLabel_B1" background = 1
"gblVReport_B1" value = 0
"gblSReportLabel_B1" value = "Not Avialable"
sleep 1000
"gblSReportLabel_B1" background = 2
sleep 1000
"gblSReportLabel_B1" background = 1
sleep 1000
"gblSReportLabel_B1" background = 3
"gblSReportLabel_B1" value = "Choose one of the above\nRemember the Maximum Volume"
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_2" value = vS_Msg_Save
[Loop_2nd]
sleep 100
if "gblVReport_B1" value == 1
		if vV_Strike_Vessel_1 == 1
			vS_Msg_Not_Allowed = "1 is not a choice.  The Radiator is the First Strike Vessel and cannot be the Second 	Strike Vessel.  Made a different Choice!."
			goto "Wrong_Choice_Second"
		endif
	vS_Msg_Vessel = "Radiator"
	"gblS_Strike_Vessel_1" value = "Radiator"
	vS_Msg_Max = "13.5"
goto "Delay_Second_Vessel"
endif
//............................
if "gblVReport_B1" value == 2
		if vV_Strike_Vessel_1 == 2
			vS_Msg_Not_Allowed = "2 is not a choice.  The Big Mac is the First Strike Vessel and cannot be the Second Strike Vessel.  Made a different Choice!."
goto "Wrong_Choice_Second"
		endif
	vS_Msg_Vessel = "Big Mac"
	"gblS_Strike_Vessel_1" value = "Big Mac"
	vS_Msg_Max = "49"
	goto "Delay_Second_Vessel"
endif
//............................
if "gblVReport_B1" value == 3
	if vV_Strike_Vessel_1 == 3
		vS_Msg_Not_Allowed = "3 is not a choice.  The Brewzilla is the First Strike Vessel and cannot be the Second Strike Vessel.  Made a different Choice!."
		goto "Wrong_Choice_Second"
	endif
	vS_Msg_Vessel = "Brewzilla"
	"gblS_Strike_Vessel_1" value =  "Brewzilla"
	vS_Msg_Max = "15"
	goto "Delay_Second_Vessel"
endif
//............................
if "gblVReport_B1" value == 4
		if vV_Strike_Vessel_1 == 4
			vS_Msg_Not_Allowed = "4 is not a choice.  The DigiBoil is the First Strike Vessel and cannot be the Second Strike Vessel.  Made a different Choice!."
			goto "Wrong_Choice_Second"
		endif
		if vV_Strike_Status == 2.8
			vS_Msg_Not_Allowed = "4 is not a choice.  The DigiBoil is not an available choice due to Volume.  Choose a different Vessel"
			goto "Wrong_Choice_Second"
		endif
	vS_Msg_Vessel = "Digiboil"
	"gblS_Strike_Vessel_1" value =  "Digiboil"
	vS_Msg_Max = "8"
	goto "Delay_Second_Vessel"
endif
//............................
if "gblVReport_B1" value == 5
		if vV_Strike_Vessel_1 == 5
			vS_Msg_Not_Allowed = "5 is not a choice.  The Little Mac is the First Strike Vessel and cannot be the Second Strike Vessel.  Made a different Choice!."
			goto "Wrong_Choice_Second"
		endif
	vS_Msg_Vessel = "Little Mac"
	"gblS_Strike_Vessel_1" value = "Little Mac"
	vS_Msg_Max = "43"
	goto "Delay_Second_Vessel"
endif
//............................
//............................
if "gblVReport_B1" value == 6
		if vV_Strike_Vessel_1 == 6
			vS_Msg_Not_Allowed = "6 is not a choice. The Big Mac is the First Strike Vessel and cannot be the Second Strike Vessel.  Made a different Choice!."
			goto "Wrong_Choice_Second"
		endif
 
vS_Msg_Vessel = "Brew Kettle"
"gblS_Strike_Vessel_1" value = "Brew Kettle"
vS_Msg_Max = "43"
goto "Delay_Second_Vessel"
endif
//............................
if "gblVReport_B1" value > 6
"gblVReport_B1" value = 0
vS_Msg_Not_Allowed = "The Choice is from 1 to 6 Only."
goto "Wrong_Choice_Second"
endif
//...........................
goto "Loop_2nd"
[Delay_Second_Vessel]
"gblV_Strike_Vessel_2" value = "gblVReport_B1" value
vV_Strike_Vessel_2 = "gblV_Strike_Vessel_2" value
"gblV_Strike_Vessel_Max_Volume_2" value = vS_Msg_Max
"gblVReport_B1" value = 0
//.......................
vS_Msg = "The Second Vessel is the "
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = ". The Half Strike Volume of the Strike Water in the  "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = " and the total fill Volume will be set later.  "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = "A minimum of Half of the Strike Volume of "
vS_Msg = vS_Msg + vS_Msg_HalfStrike
vS_Msg1 = " of Tap Water will be in the "
	if vV_Lager_or_Ale == 2
	vS_Msg1 = " of Distilled Water will be in the "
	endif
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = ".  The maximum volume of the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Vessel
vS_Msg1 = " is "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_Max
vS_Msg1 = " gallons. The Fill Volume, set later, can exceed the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_HalfStrike
vS_Msg1 =  " as only that Half Strike Volume will be transferred later."
vS_Msg = vS_Msg + vS_Msg1
//......................................
"gblS_Top_Text" value = vS_Msg
// 10 Second Delay
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
//......................................
//........................................
"gblS_Brewery_Top_1" visibility = hidden
goto "Ender_2_Vessels"
[Ender_2_Vessels]
"gblS_Script_Ended" value = "Ended: scrBrew0_3_Two_Vessels"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_4_Strike_Tree"
stop "scrBrew0_3_Two_Vessels"
```

## 11. scrBrew0_4_Strike_Tree

Starts by itself: No · User can start or stop it: Yes · 126 lines

```text
//scrBrew0_4_Strike_Tree
//Version: 261001_13:02
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
//Modified  06/22/2026 17:15
//Continues to Set Brew Day with General Strike Status.
//................................
// Set Testing
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
//.................................
 if vB_Testing == true
"gblS_Script_Started" value = "Started: scrBrew0_4_Strike_Tree" 
"gblS_Inter_Script" value = " -- "
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
new value vV_Lager_or_Ale
new value vV_Number_Strike_Vessels
//..............................
vV_Lager_or_Ale = "gblVLagerAle" value
vV_Number_Strike_Vessels = "gblV_Number_Strike_Vessels" value
//..............................
start "looper_Heat_scrBigMacHeat"
goto "Start_Choice"
[Wrong_Choice]
"gblS_Brewery_Top_2" value = "Choice not allowed.  Choose 1 or 2 Only"
"gblS_Brewery_Top_2" background = 2
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
goto "Start_Choice"
[Start_Choice]
"gblS_Brewery_Top_2" value = "Later the Radiator will need to be filled with HERMs Bath  Water.  Confirm that the Radiator Dead Space fill in the Radiator. \n 1 = Deadspace is Empty\n\n2 = Dead Space is Filled\n\nEnter 1 or 2"
if "gblV_Strike_Vessel_1" value == 1
"gblS_Brewery_Top_2" value = "Strike Water will fill the Radiator.  Confirm that the Radiator Dead Space fill in the Radiator. \n\n 1 = Deadspace is Empty\n\n2 = Dead Space is Filled\n\nEnter 1 or 2"
endif
if "gblV_Strike_Vessel_2" value == 1
"gblS_Brewery_Top_2" value = "Strike Water will fill the Radiator (Second Strike Vessel).  Confirm that the Radiator Dead Space fill in the Radiator. \n\n 1 = Deadspace is Empty\n\n2 = Dead Space is Filled\n\nEnter 1 or 2"
endif
"gblSReportLabel_B1" value = "Radiator Dead Space Filled?"
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 0
"gblS_swAllSwitch_Label_Text" value = "Confirm"
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//BackGround
"gblS_Brewery_Top_2" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1 
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_BrewName_B1" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = visible
wait  "gblVReport_B1" value > 0
[Loop_Choice]
sleep 100
if "gblVReport_B1" value == 1
"sw_Status_DeadSpace_Radiator" state = false
"gblS_Brewery_Top_1" value = "The Radiator Dead Space is not filled.  Later, 2.3 gallons will be added to fill the Dead Space."
goto "Exit_Loop_Choice"
endif
if "gblVReport_B1" value == 2
"sw_Status_DeadSpace_Radiator" state = true
"gblS_Brewery_Top_1" value = "The Radiator Dead Space is filled. "
goto "Exit_Loop_Choice"
endif
if "gblVReport_B1" value >= 3
goto "Wrong_Choice"
endif
goto "Loop_Choice"
[Exit_Loop_Choice]
"gblVReport_B1" value = 0
"gblS_swAllSwitch_Label_Text" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" visibility = visible
//........................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
[Ender_0_4_Strike_Tree]
"gblS_Script_Ended" value = "Ended: scrBrew0_4_Strike_Tree"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_5a_Fill_First"
stop "scrBrew0_4_Strike_Tree"
```

## 12. scrBrew0_5a_Fill_First

Starts by itself: No · User can start or stop it: Yes · 0 lines

```text

```

## 13. scrBrew0_5B_Fill_Second

Starts by itself: No · User can start or stop it: Yes · 1177 lines

```text
//scrBrew0_5B_Fill_Second
//Version: 261002_22:42
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
//Modified  06/22/2026 17:15
//Continues to Set Brew Day with General Strike Status.
//............................................................................
//................................
// Set Testing
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
stop "looper_scrBackground_Hops"
//.................................
//.................................
"gblS_Script_Started" value = "Started: scrBrew0_5B_Fill_Second"
"gblS_Inter_Script" value = " -- "
 if vB_Testing == true
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
new string vS_Msg
new string vS_Msg1
new string vS_Msg_Start
new string vS_Msg_Start_1
new string vS_Msg_Start_Bottom_1
new string vS_Msg_Start_2
new string vS_Msg_Start_3
new string vS_Msg_End
new string vS_Msg_Measure
new string vS_Msg2
new string vS_Msg3
new string vS_Msg_Vessel
new string vS_Msg_Max
new string vS_Msg_Not_Allowed
new string vS_Strike_Water
new string vS_Label_1
new string vS_Label_2
new string vS_1st_Strike_Vessel_Fill
new string vS_2nd_Strike_Vessel_Fill
new string vS_Msg_HalfStrike
//................................
new value vV_Strike_SetPoint_Plus
new value vV_Strike_Calculated_Volume
new value vV_Strike_Status
new value vV_Max_Vol_1
new value vV_Max_Vol_2
new value vV_Strike_Volume_Max
new value vV_Strike_Status
new value vV_Gallons_to_Fill
new value vV_Gallons_to_Fill_Distilled
new value vV_Default_Big_Mac
new value vV_Max_Rad_W_Dead
new value vV_Desired_Volume
new value vV_Desired_Volume_Measured
new value vV_Minimum_Volume
new value vVRadiatorFill
new value vVRad_Dead_Space
new value vV_1st_Strike_Vessel_Fill
new value vV_2nd_Strike_Vessel_Fill
new value vV_Half_Strike
new value vV_Default_Big_Mac
new value vV_Default_Big_Mac_Half_Dead 
new value vV_Default_Big_Mac_Half
new value vV_Half_Strike_Big_Mac
new value vV_Half_Strike_Big_Mac_Mixed
new value vV_Min_Volume_Big_Mac
new value vVRad_Half_Dead_Space
new value vV_Number_Strike_Vessel
new value vV_1st_Strike_Volume
new value vV_2nd_Strike_Volume
new value vV_Lager_or_Ale
//................................
new bool vB_Ale_1_Vessel
new bool vB_Mixed_Strike
new bool vB_Lager_2_Vessels
new bool vB_Ale_2_Vessels
new bool vB_Half_Strike
new bool vB_Distilled_Half_Strike
//................................
//................................
vV_Lager_or_Ale = "gblVLagerAle" value
vV_Number_Strike_Vessel = "gblV_Number_Strike_Vessels" value
vV_Strike_Calculated_Volume = "gblVStrikeVolume" value 
vV_Half_Strike = vV_Strike_Calculated_Volume / 2
vVRad_Dead_Space = "glbV_Rad_Dead_Space" value
vVRad_Half_Dead_Space = vVRad_Dead_Space / 2 
if vV_Number_Strike_Vessel == 1
	if vV_Lager_or_Ale == 1
	vB_Ale_1_Vessel = true
	"gblV_Brew_Status" value = 100
	goto "SectionBrew100"
endif
	if vV_Lager_or_Ale == 2
	vB_Mixed_Strike = true
	vV_1st_Strike_Vessel_Fill = "gblV_Strike_Vessel_1" value
	vS_1st_Strike_Vessel_Fill =  "gblS_Strike_Vessel_1" value
	vV_2nd_Strike_Vessel_Fill = "gblV_Strike_Vessel_1" value
	vS_2nd_Strike_Vessel_Fill =  "gblS_Strike_Vessel_1" value
	goto "Set_Distilled_Half_Strike"
	endif
endif
if vV_Number_Strike_Vessel == 2
	vV_1st_Strike_Vessel_Fill = "gblV_Strike_Vessel_1" value
	vS_1st_Strike_Vessel_Fill =  "gblS_Strike_Vessel_1" value
	if vV_Lager_or_Ale == 1
	vB_Ale_2_Vessels = true
	goto "Set_Half_Strike"
	endif
	if vV_Lager_or_Ale == 2
	vB_Lager_2_Vessels = true
	vV_1st_Strike_Vessel_Fill = "gblV_Strike_Vessel_1" value
	vS_1st_Strike_Vessel_Fill =  "gblS_Strike_Vessel_1" value
		goto "Set_Distilled_Half_Strike"

	endif
endif
[Set_Distilled_Half_Strike]
		vB_Distilled_Half_Strike = true
		"gblV_Distilled_to_Add" value  = vV_Half_Strike
		vV_Gallons_to_Fill_Distilled = "gblV_Distilled_to_Add" value
		vV_Default_Big_Mac = vV_Half_Strike + 11
		vV_Default_Big_Mac_Half_Dead = vV_Half_Strike + 5.5
		goto "Second_Fill"
[Set_Half_Strike]
vV_Default_Big_Mac = 40
"gblV_Minimum_Volume_End" value = vV_Half_Strike
vV_Default_Big_Mac_Half  = vV_Half_Strike + 11
//.....................................
[Second_Fill]
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
else
"gblS_Script_Started" visibility =  hidden
"gblS_Script_Ended" visibility = hidden
endif
//............................................
"gblV_Number_Strike_Vessels" visibility = visible
"gblV_Strike_Vessel_1" visibility = visible
vV_Strike_Status = "gblV_Strike_Status_Batch" value
"gblV_Saved_Brew_Status" value = 0
"gblVScriptFlow" value = 0
"sw_Running_Choice_Number" state = false
start "inscpt_scrBrewChoiceOpen"
sleep 100
wait "sw_Running_Choice_BrewChoiceOpen" state == false
"gblVReport_B1" precision = 1
//...............................................................................
show workspace "B1 Brewery"
//.....................................
//.....................................
if vV_2nd_Strike_Vessel_Fill == 1
print "@ 167 Radiator is Second Fill"
vS_1st_Strike_Vessel_Fill = "Radiator"
"gblV_Water_Switch_Status_Water" value = 2
vV_Max_Vol_2 = 13.5
	if "sw_Status_DeadSpace_Radiator" state == false
	vV_Max_Vol_2 = vV_Max_Vol_2 + vVRad_Dead_Space
	vV_Max_Rad_W_Dead = vV_Max_Vol_2 
	endif
	if vB_Mixed_Strike == true
		"gblV_Minimum_Volume_End" value = vV_Strike_Calculated_Volume
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_1st_Strike_Volume = "gblVCurrentRadiator_Volume" value
		vV_1st_Strike_Volume = vV_1st_Strike_Volume + vVRad_Dead_Space
		vV_2nd_Strike_Volume = vV_1st_Strike_Volume 
		vV_Desired_Volume = vV_2nd_Strike_Volume
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The Gallons to Fill Volume will include the Half the Dead Space ("		vS_Msg1 =  vVRad_Half_Dead_Space
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons) of the Radiator. The minimum Gallons to Fill Volume should be "
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons) of the Radiator. The desired Gallons to Fill Volume should be "
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water is all that should be added.  This volume will keep the ratio of Tap Water to Distilled/RO at 1:1.  Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the Radiator with the exact Distilled/RO Water Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the Radiator.  It must be at least the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less.  If additional water needs to be added, maintain the 1:1 Ratio."
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
	endif
	if vB_Ale_2_Vessels == true
		"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume = vV_Max_Vol_2
		goto "End_Set_Strike_2"
	endif
	if vB_Lager_2_Vessels == true
		vVRadiatorFill = vV_Half_Strike + vVRad_Dead_Space
		"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume = vVRadiatorFill
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The Gallons to Fill Volume will include the Dead Space ("			
		vS_Msg1 = vVRad_Dead_Space
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons) of the Radiator. The minimum Gallons to Fill Volume should be "
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons) of the Radiator. The desired Gallons to Fill Volume should be "
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water is the minimum should be added.  You can add MORE but Not Less.  Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the Radiator with the exact Distilled/RO Water Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the Radiator.  It must be at least the half the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less.  If additional water needs to be added, add only Distilled/RO Water."
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
	endif
endif
if vV_2nd_Strike_Vessel_Fill == 2
print "@ 202 Big Mac is Second Fill"
vV_Max_Vol_2 = 49
"gblV_Water_Switch_Status_Water" value = 1
vS_1st_Strike_Vessel_Fill = "Big Mac"
		if vB_Mixed_Strike == true
		"gblV_Minimum_Volume_End" value = vV_Strike_Calculated_Volume
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_1st_Strike_Volume = "gblVCurrentBigMac_Volume" value
		vV_1st_Strike_Volume = vV_1st_Strike_Volume + 11
		vV_2nd_Strike_Volume = vV_1st_Strike_Volume 
		vV_Desired_Volume = vV_2nd_Strike_Volume
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The Gallons to Fill Volume will include the Half the Dead Space ("			
		vS_Msg1 =  5.5
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons) of the Big Mac. The minimum Gallons to Fill Volume should be "
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons) of the Big Mac. The desired Gallons to Fill Volume should be "
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water is all that should be added.  This volume will keep the ratio of Tap Water to Distilled/RO at 1:1.  Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the Big Mac with the exact Distilled/RO Water Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the Big Mac.  It must be at least the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less.  If additional water needs to be added, maintain the 1:1 Ratio."
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
		endif
		if vB_Ale_2_Vessels == true	"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume  = vV_Default_Big_Mac
		goto "End_Set_Strike_2"
		endif
		if vB_Lager_2_Vessels == true
		"gblV_Minimum_Volume_End" value = vV_Half_Strike + 11
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume  = vV_Half_Strike + 11
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The Gallons to Fill Volume will include the Dead Space ("					vS_Msg1 = 11
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons) of the Big Mac. The minimum Gallons to Fill Volume should be "
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons) of the Big Mac. The desired Gallons to Fill Volume should be "
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water is the minimum should be added.  You can add MORE but Not Less.  Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the Big Mac with the exact Distilled/RO Water Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the Big Mac.  It must be at least the half the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less.  If additional water needs to be added, add only Distilled/RO Water."
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
		endif
endif
if vV_2nd_Strike_Vessel_Fill == 3
print "@ 234 Brewzilla is Second Fill"
"gblV_Water_Switch_Status_Water" value = 7
vS_1st_Strike_Vessel_Fill = "Brewzilla"
vV_Max_Vol_2 = 15
		if vB_Mixed_Strike == true
		"gblV_Minimum_Volume_End" value = vV_Strike_Calculated_Volume
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_1st_Strike_Volume = "gblVCurrentBrewzilla_Volume" value
		vV_2nd_Strike_Volume = vV_1st_Strike_Volume
		vV_Desired_Volume = vV_2nd_Strike_Volume
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The desired Gallons to Fill Volume should be to Fill Volume should exactly be " 	
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water. The minimum Gallons to after the Fill Volume is added should be a minimum of  "	
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water is all that should be added.  This volume will keep the ratio of Tap Water to Distilled/RO at 1:1.  Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the Brewzilla with the exact Distilled/RO Water Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the Brewzilla.  It must be at least the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less.  If additional water needs to be added, maintain the 1:1 Ratio."
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
print 376
		goto "Fill_Distilled"
		endif
		if vB_Ale_2_Vessels == true
		"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume = vV_Max_Vol_2
		goto "End_Set_Strike_2"
		endif
		if vB_Lager_2_Vessels == true
		"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume = vV_Minimum_Volume
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The desired Gallons to Fill Volume should be to Fill Volume should be a minimum of  " 	
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water. The minimum Gallons to after the Fill Volume is added should be a minimum of  "	
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water  should be added. Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the Brewzilla with the Distilled/RO Water minimum Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the Brewzilla.  It must be at least the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less. Only the Strike Volume will be transferred later. "
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
		endif
endif
if vV_2nd_Strike_Vessel_Fill == 4
print "@ 265 DigiBoil is Second Fill"
"gblV_Water_Switch_Status_Water" value = 8
vS_1st_Strike_Vessel_Fill = "Digiboil"
vV_Max_Vol_2 = 8
		if vB_Mixed_Strike == true
		vV_Desired_Volume = vV_Half_Strike 
		"gblV_Minimum_Volume_End" value = vV_Strike_Calculated_Volume
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_1st_Strike_Volume = "gblVCurrentDigiboil_Volume" value
		vV_2nd_Strike_Volume = vV_1st_Strike_Volume 
		vV_Desired_Volume = vV_2nd_Strike_Volume
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The desired Gallons to Fill Volume should be to Fill Volume should exactly be " 	
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water. The minimum Gallons to after the Fill Volume is added should be a minimum of  "	
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water is all that should be added.  This volume will keep the ratio of Tap Water to Distilled/RO at 1:1.  Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the DigiBoil with the exact Distilled/RO Water Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the DigiBoil.  It must be at least the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less.  If additional water needs to be added, maintain the 1:1 Ratio."
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
		endif
		if vB_Ale_2_Vessels == true
		"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume = vV_Max_Vol_2
		goto "End_Set_Strike_2"
		endif
		if vB_Lager_2_Vessels == true
		"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume = vV_Minimum_Volume
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The desired Gallons to Fill Volume should be to Fill Volume should be a minimum of  " 	
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water. The minimum Gallons to after the Fill Volume is added should be a minimum of  "	
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water should be added. Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the DigiBoil with the Distilled/RO Water minimum Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the DigiBoil.  It must be at least the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less. Only the Strike Volume will be transferred later. "
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
		endif
endif
if vV_2nd_Strike_Vessel_Fill == 5
print "@ 295 Little Mac is Second Fill"
"gblV_Water_Switch_Status_Water" value = 5
vS_1st_Strike_Vessel_Fill = "Little Mac"
vV_Max_Vol_2 = 43
		if vB_Mixed_Strike == true
		"gblV_Minimum_Volume_End" value = vV_Strike_Calculated_Volume
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_1st_Strike_Volume = "gblVCurrentLittle_Volume" value
		vV_2nd_Strike_Volume =	vV_1st_Strike_Volume 
		vV_Desired_Volume = vV_2nd_Strike_Volume
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The desired Gallons to Fill Volume should be to Fill Volume should exactly be " 	
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water. The minimum Gallons to after the Fill Volume is added should be a minimum of  "	
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water is all that should be added.  This volume will keep the ratio of Tap Water to Distilled/RO at 1:1.  Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the Little Mac with the exact Distilled/RO Water Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the Little Mac.  It must be at least the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less.  If additional water needs to be added, maintain the 1:1 Ratio."
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
		endif
		if vB_Ale_2_Vessels == true
		"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume = vV_Max_Vol_2
		goto "End_Set_Strike_2"
		endif
				if vB_Lager_2_Vessels == true
		"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume = vV_Minimum_Volume
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The desired Gallons to Fill Volume should be to Fill Volume should be a minimum of  " 	
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water. The minimum Gallons to after the Fill Volume is added should be a minimum of  "	
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water  should be added. Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the Little Mac with the Distilled/RO Water minimum Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the Little Mac.  It must be at least the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less. Only the Strike Volume will be transferred later. "
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
		endif
endif
if vV_2nd_Strike_Vessel_Fill == 6
print "@ 326 Brew Kettle is Second Fill"
"gblV_Water_Switch_Status_Water" value = 4
vS_1st_Strike_Vessel_Fill = "Brew Kettle"
vV_Max_Vol_2 = 43
		if vB_Mixed_Strike == true
		"gblV_Minimum_Volume_End" value = vV_Strike_Calculated_Volume
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_1st_Strike_Volume = "gblVCurrentBrewKettle_Volume" value
		vV_2nd_Strike_Volume =	vV_1st_Strike_Volume 
		vV_Desired_Volume = vV_2nd_Strike_Volume
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The desired Gallons to Fill Volume should be to Fill Volume should exactly be " 	
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water. The minimum Gallons to after the Fill Volume is added should be a minimum of  "	
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water is all that should be added.  This volume will keep the ratio of Tap Water to Distilled/RO at 1:1.  Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the Brew Kettle with the exact Distilled/RO Water Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the Brew Kettle.  It must be at least the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less.  If additional water needs to be added, maintain the 1:1 Ratio."
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
		endif
		if vB_Ale_2_Vessels == true
		"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume = vV_Max_Vol_2
		goto "End_Set_Strike_2"
		endif
		if vB_Lager_2_Vessels == true
		"gblV_Minimum_Volume_End" value = vV_Half_Strike
		vV_Minimum_Volume = "gblV_Minimum_Volume_End" value
		vV_Desired_Volume = vV_Minimum_Volume
		"gblS_swAllSwitch_Label_Text" value =  "Strike Tap && Distilled/RO 1:1 Ratio"	
		vS_Msg_Start_1 = "The desired Gallons to Fill Volume should be to Fill Volume should be a minimum of  " 	
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water. The minimum Gallons to after the Fill Volume is added should be a minimum of  "	
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg1 = " gallons of Distilled/RO Water."
		vS_Msg_Start_1 = vS_Msg_Start_1 + vS_Msg1
		vS_Msg_Start_Bottom_1 = "This Volume of Distilled/RO Water  should be added. Only the Strike Volume will be transferred later."
		vS_Msg_Start_2  =  "Manually fill the Bre Kettle with the Distilled/RO Water minimum Volume of "
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg1 = " gallons.  Click Distilled ADDED? when Done."
		vS_Msg_Start_2 = vS_Msg_Start_2 + vS_Msg1
		vS_Msg_Start_3 = "Measure the Volume of the Bre Kettle.  It must be at least the Strike Volume of "
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		vS_Msg1 = " gallons. It can be MORE but NOT Less. Only the Strike Volume will be transferred later. "
		vS_Msg_Start_3 = vS_Msg_Start_3 + vS_Msg1
		goto "Fill_Distilled"
		endif
endif
//.....................................
//.....................................
[End_Set_Strike_2]
print "@ 350 End_Set_Strike_2"
// Where to Start
"gblV_Brew_Status" value = 32
goto "SectionBrew32"
//...................................................
[SectionBrew31]
[SectionBrew32]
wait "gblV_Brew_Status" value == 32
print "@151 Strike Status = "
print vV_Strike_Status
print "Ale or Lager"
print vV_Lager_or_Ale
print "Number of Strike Vessels = "
print vV_Number_Strike_Vessel
print "1st Strike Vessel = "
print vS_1st_Strike_Vessel_Fill
print "2nd Strike Vessel = "
print vS_2nd_Strike_Vessel_Fill
"gblV_Brew_Status" value = 34
[SectionBrew33]
[SectionBrew34]
if vV_1st_Strike_Vessel_Fill == 1
vV_1st_Strike_Volume = "gblVCurrentRadiator_Volume" value
endif
if vV_1st_Strike_Vessel_Fill == 2
vV_1st_Strike_Volume = "gblVCurrentBigMac_Volume" value
endif
if vV_1st_Strike_Vessel_Fill == 3
vV_1st_Strike_Volume = "gblVCurrentBrewzilla_Volume" value
endif
if vV_1st_Strike_Vessel_Fill == 4
vV_1st_Strike_Volume = "gblVCurrentDigiboil_Volume" value
endif
if vV_1st_Strike_Vessel_Fill == 5
vV_1st_Strike_Volume = "gblVCurrentLittle_Volume" value
endif
if vV_1st_Strike_Vessel_Fill == 6
vV_1st_Strike_Volume = "gblVCurrentBrewzilla_Volume" value
endif
vV_2nd_Strike_Volume =  vV_Strike_Calculated_Volume - vV_1st_Strike_Volume
if vV_2nd_Strike_Volume < 0
vS_Msg = "The First Strike Vessel holds  "
vS_Msg1 = vV_1st_Strike_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons of Strike Tap Water.  The required Tap Water Strike is "
vS_Msg1 = vV_Strike_Calculated_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons of Strike Tap Water.  The required Tap Water Strike is available in the " 
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vS_1st_Strike_Vessel_Fill
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = ". There is no need for a Second Strike Vessel.\n 1 = Only One Strike Vessel\n2 = Two Strike Vessels" 
vS_Msg = vS_Msg + vS_Msg1
//.....................................................
"gblS_swAllSwitch_Label_Text" value =  "1 or 2 Only"
"gblS_Brewery_Top_1" value = vS_Msg
"gblSReportLabel_B1" value = "\n 1 = Only One Strike Vessel\n2 = Two Strike Vessels"
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
//..........................................................................................
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
[Loop_Enough_Strike]
if "gblVReport_B1" value == 1
"gblVReport_B1" value = 0
goto "Revert_One_Vessel"
endif
if "gblVReport_B1" value == 2
"gblVReport_B1" value = 0
goto "Revert_One_Vessel"
endif
if "gblVReport_B1" value > 2
"gblVReport_B1" value = 0
goto "Wrong_Enough_Strike"
endif
[Wrong_Enough_Strike]
"gblS_Brewery_Top_1" background = 1
"gblS_Brewery_Top_1" value = "You can ONLY choose 1 or 2!"
sleep 4001
"gblS_Brewery_Top_1" background = 2
"gblS_Brewery_Top_1" value = vS_Msg
[Revert_One_Vessel]
"gblV_Number_Strike_Vessels" value = 1
"gblV_Strike_Vessel_2" value = 1
vS_Msg = "All of the Strike (All Tap Water) will come from the "
vS_Msg1 = ".  The number of Bessels has been changed to one and there is not selection for a Second Vessel anymore.  Wait!  Will Auto Advance."
vS_Msg = vS_Msg + vS_Msg1
"gblS_Top_Text" value = vS_Msg
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
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
goto "Ender_scrBrew0_5B_Fill_Second"
[Stay_Two_Vessels]
wait "gblV_Brew_Status" value == 34
if vB_Ale_2_Vessels == true
vS_Msg = "All of the Strike Water is Tap Water.  Two Strike Vessels have been chosen. The FIRST Strike Vessel is the "
endif
vS_Msg1 = vS_1st_Strike_Vessel_Fill
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 =  ".  The desired strike Volume is "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vV_Strike_Calculated_Volume
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 =  " gallons.  The maximum Volume of the  "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vS_1st_Strike_Vessel_Fill
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 =  " is "  
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vV_Max_Vol_2
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 =  " gallons." 
if vV_2nd_Strike_Vessel_Fill == 1
vS_Msg1 =  " gallons (Includes 2.3 Gallons of Dead Space)"
endif
vS_Msg = vS_Msg + vS_Msg1
if vB_Ale_2_Vessels == true
"gblS_swAllSwitch_Label_Text" value =  "Strike is All Tap"
endif
"gblS_Brewery_Top_1" value = vS_Msg
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" visibility = visible
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
start "inscpt_scrShortDelay"
sleep 200
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
"gblV_Brew_Status" value = 36
[SectionBrew35]
[SectionBrew36]
wait "gblV_Brew_Status" value == 36
if vV_2nd_Strike_Vessel_Fill == 1
vS_Msg_End = "  The Radiator Deadspace is not measured. "
		if vB_Ale_2_Vessels == true
		vS_Msg_Start = "The Gallons to Fill Volume will include the Dead Space ("
		vS_Msg1 = vVRad_Dead_Space
		vS_Msg_Start = vS_Msg_Start + vS_Msg1
		vS_Msg1 = " gallons) of the Radiator. The minimum Gallons to Fill Volume should be "
		vS_Msg_Start = vS_Msg_Start + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start = vS_Msg_Start + vS_Msg1
		vS_Msg1 = " gallons) of the Radiator. The desired Gallons to Fill Volume should be "
		vS_Msg_Start = vS_Msg_Start + vS_Msg1
		vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start = vS_Msg_Start + vS_Msg1
		vS_Msg1 = " gallons."
		vS_Msg_Start = vS_Msg_Start + vS_Msg1
		goto "End_Vessel_Tree"
		endif
endif
//......................................................................................
//....................................................................................
if vV_2nd_Strike_Vessel_Fill == 2
vS_Msg_End = "    ONLY the Strike Volume will be transferred later."
vV_Max_Vol_2 = 49
		if vB_Ale_2_Vessels == true
		vS_Msg_Start = "All of the Strike is Tap Water.  Half of the Strike will come from the Big Mac.  The Gallons to Fill Volume will include additional Strike, Sparge and Hot Water as the Big Mac is the HLT.  The suggested fill volume to fill = "					vS_Msg1 = vV_Desired_Volume
		vS_Msg_Start = vS_Msg_Start + vS_Msg1
		vS_Msg1 = " gallons) in the Big Mac. The minimum Gallons to Fill Volume should be "
		vS_Msg_Start = vS_Msg_Start + vS_Msg1
		vS_Msg1 = vV_Minimum_Volume
		vS_Msg_Start = vS_Msg_Start + vS_Msg1
		vS_Msg1 = " gallons) in the Big Mac. "
		vS_Msg_Start = vS_Msg_Start + vS_Msg1
		goto "End_Vessel_Tree"
		endif
endif
//.......................................................
if vV_2nd_Strike_Vessel_Fill == 3
print 423
vS_Msg_End = "  ONLY the Strike Volume will be transferred later."
vV_Max_Vol_2 = 15
vV_Gallons_to_Fill = 14.5
	if vB_Ale_2_Vessels == true
	vS_Msg_Start = "Half of the Tap Water Strike will come from the Brewzilla. The suggested Tap Water fill volume = 14.5 "
	endif
goto "End_Vessel_Tree"
endif
//.......................................................
if vV_2nd_Strike_Vessel_Fill == 4
vS_Msg_End = "    ONLY the Strike Volume will be transferred later."
if vB_Ale_2_Vessels == true
vS_Msg_Start = "All of the Strike is Tap Water.  Half of the Strike will come from the Digiboil. The suggested fill volume = 8 "
endif
vV_Max_Vol_2 = 8
goto "End_Vessel_Tree"
endif
//.......................................................
if vV_2nd_Strike_Vessel_Fill == 5
vS_Msg_End = "  It can be MORE but not LESS!"
if vB_Ale_2_Vessels == true
vS_Msg_Start = "All of the Strike is Tap Water.  Half of the Strike will come from the Little Mac. The minimum volume to fill is the Half Strike Volume of "
vS_Msg1 = vV_Half_Strike
vS_Msg_Start = vS_Msg_Start + vS_Msg1
endif
goto "End_Vessel_Tree"
endif
if vV_2nd_Strike_Vessel_Fill == 6
vS_Msg_End = "  It can be MORE but not LESS!"
vV_Max_Vol_2 = 43
	if vB_Ale_2_Vessels == true
	vS_Msg_Start = "All of the Strike is Tap Water.  Half of the Strike will come from the Brew Kettle . The minimum volume to fill is the Half Strike Volume of "
	vS_Msg1 = vV_Half_Strike
	vS_Msg_Start = vS_Msg_Start + vS_Msg1
	endif
goto "End_Vessel_Tree"
endif
//.........................................
//.........................................
[End_Vessel_Tree]
print "@ 554 End_Vessel_Tree"
print vS_Msg_Start
vS_Msg = vS_Msg_Start
vS_Msg1 = " gallons. Ready to fill the "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vS_1st_Strike_Vessel_Fill
vS_Msg = vS_Msg + vS_Msg1
//............................
vS_Msg_Start = vS_Msg
vS_Msg1 = ". The "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vS_1st_Strike_Vessel_Fill
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " fill measurement is a minimum of "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vV_Gallons_to_Fill
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons."
vS_Msg = vS_Msg + vS_Msg1
"gblS_Brewery_Top_3" value = vS_Msg
vS_Msg1 = " How many gallons do you want to add?"
vS_Msg = vS_Msg + vS_Msg1
"gblS_Brewery_Top_2" value = vS_Msg
//....................................
vS_Msg = "After filling the"
vS_Msg1 = vS_1st_Strike_Vessel_Fill
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = ", the Measured Volume (Strike Volume) should be at least "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vV_Gallons_to_Fill
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons. "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg = vS_Msg + vS_Msg_End
"gblS_Brewery_Bottom_3" value = vS_Msg
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
// 15 Second Delay
"gblV_Delay_Seconds" value = 15
start "inscpt_scrShortDelay"
sleep 200
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblV_Brew_Status" value = 36
[SectionBrew35]
[SectionBrew36]
wait "gblV_Brew_Status" value == 36
vS_Msg = "Maximum Volume = "
if vV_2nd_Strike_Vessel_Fill == 1
vS_Msg1 = vV_Max_Rad_W_Dead
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 =  " (includes Dead Space)"
goto "Skip_Max"
endif
vS_Msg1 = vV_Max_Vol_2
[Skip_Max]
vS_Msg = vS_Msg + vS_Msg1
"gblSReportLabel_B1" value = vS_Msg
//........................................
//Inspector_Red
"sw_Running_Choice_Number" state = true
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrBrewChoiceOpen"
sleep 100
wait "sw_Running_Choice_BrewChoiceOpen" state == false
// Visibility
"gblS_swAllSwitch_Label_Text" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblV_Brew_Status" value = 38
[SectionBrew37]
[SectionBrew38]
wait "gblV_Brew_Status" value == 38
[Redo_Loop_Fill_Strike_Volume]
wait "gblVReport_B1" value > 0
[Loop_Fill_Strike_Volume]
if "gblVReport_B1" value >  vV_Max_Vol_2
	"gblS_swAllSwitch_Label_Text" background = 2
	"gblS_swAllSwitch_Label_Text" value = "Exceeded Maximum Volume"
	"gblS_swAllSwitch_Label_Text" visibility = visible
	sleep 4001
	"gblS_swAllSwitch_Label_Text" background = 1
	sleep 1000
	vS_Msg = "Max: "
	vS_Msg1 = vV_Max_Vol_2
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = " gallons"
	vS_Msg = vS_Msg + vS_Msg1
	"gblS_swAllSwitch_Label_Text" value = vS_Msg
	"gblVReport_B1" value = 0
	goto "Redo_Loop_Fill_Strike_Volume"
endif
if vV_2nd_Strike_Vessel_Fill == 1
	if "gblVReport_B1" value <  vVRadiatorFill
	"gblS_swAllSwitch_Label_Text" background = 2
	"gblS_swAllSwitch_Label_Text" value = "Need Minimum Volume"
	"gblS_swAllSwitch_Label_Text" visibility = visible
	sleep 4001
	"gblS_swAllSwitch_Label_Text" background = 1
	sleep 1000
	vS_Msg = "MIN: "
	vS_Msg1 = vVRadiatorFill
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = " gallons"
	vS_Msg = vS_Msg + vS_Msg1
	"gblS_swAllSwitch_Label_Text" value = vS_Msg
	"gblVReport_B1" value = 0
	goto "Redo_Loop_Fill_Strike_Volume"
endif
if vV_2nd_Strike_Vessel_Fill != 1
	if "gblVReport_B1" value <  vV_Strike_Calculated_Volume
	"gblS_swAllSwitch_Label_Text" background = 2
	"gblS_swAllSwitch_Label_Text" value = "Need Minimum Volume"
	"gblS_swAllSwitch_Label_Text" visibility = visible
	sleep 4001
	"gblS_swAllSwitch_Label_Text" background = 1
	sleep 1000
	vS_Msg = "MIN: "
	vS_Msg1 = vV_Strike_Calculated_Volume
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = " gallons"
	vS_Msg = vS_Msg + vS_Msg1
	"gblS_swAllSwitch_Label_Text" value = vS_Msg
	"gblVReport_B1" value = 0
	goto "Redo_Loop_Fill_Strike_Volume"
endif
goto "End_Loop_Fill_Strike_Volume"
[End_Loop_Fill_Strike_Volume]
//............................................
"gblV_Gals_to_Fill" value = "gblVReport_B1" value
vV_Gallons_to_Fill = "gblV_Gals_to_Fill" value
"gblVReport_B1" value = 0
"sw_Running_Choice_Number" state = false
start "inscpt_scrBrewChoiceOpen"
sleep 100
wait "sw_Running_Choice_BrewChoiceOpen" state == false
"gblV_Brew_Status" value = 40
goto "SectionBrew40"
[SectionBrew39]
[SectionBrew40]
wait "gblV_Brew_Status" value == 40
"sw_Status_From_Switch_Water_Pane" state = true
if vV_2nd_Strike_Vessel_Fill == 1
vS_Msg = "The entered Gallons to Add: "
vS_Msg1 = vV_Gallons_to_Fill
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = " gallons that includes the Radiator Dead Space of "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vVRad_Dead_Space
vS_Msg = vS_Msg + vS_Msg1
endif
//......................................
if vV_2nd_Strike_Vessel_Fill > 1
vS_Msg = "The entered Gallons to Add: "
vS_Msg1 = vV_Gallons_to_Fill
vS_Msg = vS_Msg + vS_Msg1
endif
//......................................
vS_Msg1 = " gallons.  Click Start Transfer? to fill the " 
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vS_1st_Strike_Vessel_Fill
vS_Msg = vS_Msg + vS_Msg1
"gblS_Brewery_Top_3" value = vS_Msg
vS_Msg = "The Manifold Supply Valve will open and fill the "
vS_Msg1 = vS_1st_Strike_Vessel_Fill
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = ".  "
vS_Msg = vS_Msg + vS_Msg1
if vV_2nd_Strike_Vessel_Fill > 5
vS_Msg1 = "Manual Valves and Setting Hoses are part of the fill. "
else
vS_Msg1 = "Any Isolation Valves will operate Automatically. "
endif
vS_Msg = vS_Msg + vS_Msg1
"gblS_Brewery_Bottom_3" value = vS_Msg 
//..........................................................
"gblS_swAllSwitch_Label_Text" value = "Start Transfer?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Top_3" background = 1
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
"gblV_Brew_Status" value = 41
[SectionBrew41]
[SectionBrew42]
//Set Manifold
wait "gblV_Brew_Status" value == 42
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew0_5B_Fill_Second @ 1140  > start: sub_scrManifold_Choice"
sleep 4001
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 1144 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
"gblV_Brew_Status" value = 100
goto "Ender_scrBrew0_5B_Fill_Second"
[SectionBrew43]
[SectionBrew44]
[SectionBrew45]
[SectionBrew46]
//.......................
//.......................
[Fill_Distilled]
print "@ 1135 Fill_Distilled"
[SectionBrew47]
[SectionBrew48]
"gblS_Top_Text" value = vS_Msg_Start_1
"gblS_Bottom_Text" value = vS_Msg_Start_Bottom_1
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = true
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = true
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
"gblV_Brew_Status" value = 50
[SectionBrew49]
[SectionBrew50]
wait "gblV_Brew_Status" value == 50
//........................
"gblS_Top_Text" value = vS_Msg_Start_2
"gblS_Bottom_Text" value = "Click Distilled ADDED? once the Minimum Volume is reached.  Remember to maintain the 1:1 Ratio if addition water is needed."
"gblS_BrewName_B1" value = "Add Distilled/RO Water Manually"
"gblS_swAllSwitch_Label_Text" value = "Click Distilled ADDED?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 52
[SectionBrew51]
[SectionBrew52]
wait "gblV_Brew_Status" value == 52
//........................................
vS_Msg = "Enter the Final Volume in gallons of the "
vS_Msg = vS_Msg + vS_2nd_Strike_Vessel_Fill
vS_Msg1 = "."
vS_Msg = vS_Msg + vS_Msg1
//.....................................................
"gblS_swAllSwitch_Label_Text" value =  "Enter Gallons"
"gblS_Brewery_Top_1" value = vS_Msg
vS_Msg = "Volume of the "
vS_Msg = vS_Msg + vS_2nd_Strike_Vessel_Fill
"gblSReportLabel_B1" value = vS_Msg
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
"gblS_BrewName_B1"  value = "gblS_BeerName_R1" value
//..........................................................................................
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
"gblS_Brewery_Bottom_1" visibility = hidden 
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_1" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
wait "gblVReport_B1" value > 0
if vV_2nd_Strike_Vessel_Fill == 1
"gblVCurrentRadiator_Volume" value = "gblVReport_B1" value
endif
if vV_2nd_Strike_Vessel_Fill == 2
"gblVCurrentBigMac_Volume" value = "gblVReport_B1" value
endif
if vV_2nd_Strike_Vessel_Fill == 3
"gblVCurrentBrewzilla_Volume" value = "gblVReport_B1" value
endif
if vV_2nd_Strike_Vessel_Fill == 4
"gblVCurrentDigiboil_Volume" value = "gblVReport_B1" value
endif
if vV_2nd_Strike_Vessel_Fill == 5
"gblVCurrentLittle_Volume" value = "gblVReport_B1" value
endif
if vV_2nd_Strike_Vessel_Fill == 6
"gblVCurrentBrewKettle_Volume" value = "gblVReport_B1" value
endif
"gblVReport_B1" value = 0
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Top_1" visibility = hidden 
"gblS_swAllSwitch_Label_Text" visibility = hidden
goto "Ender_scrBrew0_5B_Fill_Second"
[SectionBrew99]
[SectionBrew100]
wait "gblV_Brew_Status" value == 100
"gblS_Script_Ended" value = "Ended: scrBrew0_5B_Fill_Second" 
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_6_Extra_HLT"
stop "scrBrew0_5B_Fill_Second"
```

## 14. scrBrew0_6_Extra_HLT

Starts by itself: No · User can start or stop it: Yes · 457 lines

```text
//scrBrew0_6_Extra_HLT
//05/14/2026 18:44
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Extra Heated Water
// Set Testing
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//.................................
//.................................
 if vB_Testing == true
"gblS_Script_Started" value = "Started: scrBrew0_6_Extra_HLT"
"gblS_Inter_Script" value = " -- "
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
new string vS_Msg
new value vV_Strike_Vessel_1
new value vV_Strike_Vessel_2
new bool vB_Brewzilla_Strike
new bool vB_Digiboil_Strike
new bool vB_No_Extra
new bool vB_Both_Extra
new bool vB_Brewzilla_Extra
new bool vB_Digiboil_Extra
new bool vB_Chose_Both
show workspace "B1 Brewery"
"sw_Status_Brewzilla_HLT" state = false
"sw_Status_Digiboil_HLT" state = false
vV_Strike_Vessel_1 = "gblV_Strike_Vessel_1" value
vV_Strike_Vessel_2 = "gblV_Strike_Vessel_2" value
//.................................................
	if vV_Strike_Vessel_1 == 3
	vB_Brewzilla_Strike = true
	endif
	if vV_Strike_Vessel_2 == 3
	vB_Brewzilla_Strike = true
	endif
//.................................................
//.................................................
	if vV_Strike_Vessel_1 == 4
	vB_Digiboil_Strike = true
	endif
	if vV_Strike_Vessel_2 == 4
	vB_Digiboil_Strike = true
	endif
//.................................................
	if vB_Brewzilla_Strike == true
		if vB_Digiboil_Strike == true
		vB_No_Extra = true
		endif
	endif
//.................................................
	if vB_Brewzilla_Strike == false
			if vB_Digiboil_Strike == false
		vB_Both_Extra = true
		endif
	endif
//.................................................
//.................................................
	if vB_Brewzilla_Strike == false
		if vB_Digiboil_Strike == true
		vB_Brewzilla_Extra = true
				endif
	endif
//.................................................
	if vB_Brewzilla_Strike == true
		if vB_Digiboil_Strike == false
		vB_Digiboil_Extra = true
		endif
	endif
//.................................................
//.................................................
"gblV_Brew_Status" value = 70
goto "SectionBrew70"
//.........................
[SectionBrew70]
wait "gblV_Brew_Status" value == 70
	if vB_No_Extra == true
	vS_Msg =  "There is no Electrically heated extra HLT.  If there is a need for additional Hot Water, manually using the Little Mac or Brew Kettle (or both) with the propane burners can be considered.  The filling and heating would need to be done manually.  Wait!  Will Auto Advance"
	goto "End_Alternate_Msg"
	endif
//.................................................
	if vB_Both_Extra == true
	vS_Msg = "Do you have alternate Hot Water  available for a Primary and a Secondary Brew Session.\n1 = No Alternate Source.\n 2 = Brewzilla Only\n3 = DigiBoil Only\n4 = Brewzilla && DigiBoil Available "
	"gblS_BrewName_B1" value = "1 = None 2 = Brewzilla 3 = Digiboil\n4= Both Brewzilla && DigiBoil Avalable"
	endif
//.................................................
	if vB_Brewzilla_Extra == true
	vS_Msg = "Do you have alternate Hot Water  available for a Primary and a Secondary Brew Session.\n1 = No Alternate Source.\n 2 = Brewzilla Only \nOnly 1 or 2! "
	"gblS_BrewName_B1" value = "1 = None 2 = Brewzilla Only\nOnly 1 or 2!"
	endif
//.................................................
	if vB_Digiboil_Extra == true
	vS_Msg = "Do you have alternate Hot Water  available for a Primary and a Secondary Brew Session.\n1 = No Alternate Source.\n2 = DigiBoil Only\nOnly 1 or 2!  "
	"gblS_BrewName_B1" value = "1 = None 2 = DigiBoil Only\nOnly 1 or 2!"
	endif
//.................................................
"gblS_Brewery_Top_2" value = vS_Msg
"gblS_swAllSwitch_Label_Text" value = "Alternate Hot Water?"
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 0
//..................................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = hidden
"gblS_BrewName_B1" visibility = visible
//.................................................
	if vB_Both_Extra == true
	goto "Loop_All"
	endif
//.................................................
//.................................................
	if vB_Brewzilla_Extra == true
	goto "Loop_Brewzilla"
	endif
//.................................................
	if vB_Digiboil_Extra == true
	goto "Loop_DigiBoil"
	endif
//.................................................
[Loop_All]
if "gblVReport_B1" value > 4
"gblVReport_B1" value = 0
"gblS_Brewery_Bottom_1" value = "Only 1 to 4 Allowed! "
"gblS_Brewery_Bottom_1"  visibility = visible
sleep 3000
"gblS_Brewery_Bottom_1" visibility = hidden
goto "Loop_All"
endif
if "gblVReport_B1" value == 1
vS_Msg =  "No Electrically heated extra HLT chossen.  If there is a need for additional Hot Water, manually using the Little Mac or Brew Kettle (or both) with the propane burners can be considered.  The filling and heating would need to be done manually.  Wait!  Will Auto Advance"
"gblVReport_B1" value = 0
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
goto "End_Alternate_Msg"
endif
if "gblVReport_B1" value == 2
"gblVReport_B1" value = 0
vB_Chose_Both = false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblV_Brew_Status" value = 72
goto "Brewzilla"
endif
if "gblVReport_B1" value == 3
"gblVReport_B1" value = 0
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblV_Brew_Status" value = 82
goto "Digiboil"
endif
if "gblVReport_B1" value == 4
"gblVReport_B1" value = 0
vB_Chose_Both = true
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblV_Brew_Status" value = 72
goto "Brewzilla"
endif
goto "Loop_All"
//.................................................
[Loop_Brewzilla]
if "gblVReport_B1" value > 2
"gblVReport_B1" value = 0
"gblS_Brewery_Bottom_1" value = "Only 1 to 2 Allowed! "
"gblS_Brewery_Bottom_1"  visibility = visible
sleep 3000
"gblS_Brewery_Bottom_1" visibility = hidden
goto "Loop_Brewzilla"
endif
if "gblVReport_B1" value == 1
vS_Msg =  "No Electrically heated extra HLT chossen.  If there is a need for additional Hot Water, manually using the Little Mac or Brew Kettle (or both) with the propane burners can be considered.  The filling and heating would need to be done manually.  Wait!  Will Auto Advance"
"gblVReport_B1" value = 0
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
goto "End_Alternate_Msg"
endif
if "gblVReport_B1" value == 2
"gblVReport_B1" value = 0
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblV_Brew_Status" value = 72
goto "Brewzilla"
endif
goto "Loop_Brewzilla"
//.................................................
[Loop_DigiBoil]
if "gblVReport_B1" value > 2
"gblVReport_B1" value = 0
"gblS_Brewery_Bottom_1" value = "Only 1 to 2 Allowed! "
"gblS_Brewery_Bottom_1"  visibility = visible
sleep 3000
"gblS_Brewery_Bottom_1" visibility = hidden
goto "Loop_DigiBoil"
endif
if "gblVReport_B1" value == 1
vS_Msg =  "No Electrically heated extra HLT chosen.  If there is a need for additional Hot Water, manually using the Little Mac or Brew Kettle (or both) with the propane burners can be considered.  The filling and heating would need to be done manually.  Wait!  Will Auto Advance"
"gblVReport_B1" value = 0
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
goto "End_Alternate_Msg"
endif
if "gblVReport_B1" value == 2
"gblVReport_B1" value = 0
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblV_Brew_Status" value = 82
goto "Digiboil"
endif
goto "Loop_DigiBoil"
//..................................................
[Brewzilla]
[SectionBrew71]
[SectionBrew72]
wait "gblV_Brew_Status" value == 72
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
//......................................
//Alarm.................................
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" loop = true
"alm_Manual_Warning" active = true
//Alarm.................................
//........................
"gblS_Top_Text" value = "Set Hoses and Valves to fill the Brewzilla from the Manifold.\n1:  Attach the hose from the Manual Manifold Valve (Right End)\n2: Open the Manual valve.\n3:   Attach to the Manual Inlet Valve of the Brewzilla. "
"gblS_Bottom_Text" value = "4: Open the Manual Inlet Valve.\n5: Click Hoses and Valve Set? when done."
"gblS_BrewName_B1" value = "Set Up Hoses and Valves for External Transfer"
"gblS_swAllSwitch_Label_Text" value = "Click Hoses and Valve Set?"
start "inscpt_scrAdvancewithSwitch"
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
//........................
"gblV_Brew_Status" value = 74
[SectionBrew73]
[SectionBrew74]
wait "gblV_Brew_Status" value == 74
"MB_28_do_ManualAlarm_B1" state = false
"gblS_Top_Text" value = "Set the Manifold to fill the Brewzilla from the MSV(Tap).  The gallons to be added are 12 gallons. Click Start Transfer? when ready."
//........................
 "gblS_Bottom_Text" value = "This will be a timed Fill and you are the Control and Safety."
"gblS_BrewName_B1" value = "Manifold Set Automatically"
"gblS_swAllSwitch_Label_Text" value = "Start Transfer?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 76
[SectionBrew75]
[SectionBrew76]
print 298
wait "gblV_Brew_Status" value == 76
"gblV_Water_Switch_Status_Water" value = 7
"sw_Status_Script_From_Script" state = true
"gblV_Gals_to_Fill" value = 12
"sw_Running_Calculate_SPG" state = true
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew0_6_Extra_HLT @ 299  > start: sub_scrManifold_Choice"
sleep 3000
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 307 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
"gblV_Brew_Status" value = 78
[SectionBrew77]
[SectionBrew78]
wait "gblV_Brew_Status" value == 78
start "sub_scrBrewZilla_Ready"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew0_6_Extra_HLT @ 313  > start: sub_scrBrewZilla_Ready"
sleep 3000
endif
print "@ 319 wait sw_Running_Script_C state is false"
wait "sw_Running_Script_C" state == false
"gblS_Top_Text" value =  "Confirm the Brewzilla is ready for heating before proceeding.  Click Brewzilla Ready? when ready"
"gblS_swAllSwitch_Label_Text" value = "Brewzilla Ready?"
//........................
 "gblS_Bottom_Text" value = "Make sure the Brewzilla is ready for heating before proceeding."
"gblS_BrewName_B1" value = "Brewzilla Ready"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"sw_Status_Brewzilla_HLT" state = true
"gblV_Brew_Status" value = 80
[SectionBrew79]
[SectionBrew80]
wait "gblV_Brew_Status" value == 80
//................................................................................
	if vB_Brewzilla_Extra == true
	vS_Msg = "The Brewzilla as an Extra HLT should be filled and ready for Heating.  Wait.  Will Auto Advance."
	goto "End_Alternate_Msg"
	endif
//................................................................................
	if vB_Both_Extra == true
		if vB_Chose_Both == true
		"gblV_Brew_Status" value = 82
		goto "Digiboil"
		endif
	vS_Msg = "The Brewzilla (the only one chosen) as an Extra HLT should be filled and ready for Heating.  Wait.  Will Auto Advance."
	goto "End_Alternate_Msg"
	endif
[Digiboil]
[SectionBrew81]
[SectionBrew82]
wait "gblV_Brew_Status" value == 82
"gblS_Top_Text" value = "Set Hoses and Valves to fill the Digiboil from the Manifold.\n1:  Attach the hose from the Manual Manifold Valve (Right End)\n2: Open the Manual valve.  Attach to the Manual Inlet Valve of the DigiBoil.\n3: Open the Manual Inlet Valve.  "
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
//................................................................................
//Alarm.................................
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" loop = true
"alm_Manual_Warning" active = true
//Alarm.................................
//........................
"gblS_Bottom_Text" value = "4: Click Hoses and Valve Set? when done."
"gblS_BrewName_B1" value = "Set Up Hoses and Valves for External Transfer"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 84
[SectionBrew83]
[SectionBrew84]
wait "gblV_Brew_Status" value == 84
"MB_28_do_ManualAlarm_B1" state = false
"gblS_Top_Text" value =  "Set the Manifold to fill the DigiBoil from the MSV(Tap).  The gallons to be added are 7 gallons. Click Start Transfer? when ready."
"gblS_swAllSwitch_Label_Text" value = "Start Transfer?"
//........................
"gblS_Bottom_Text" value = "This will be a timed Fill and you are the Control and Safety."
"gblS_BrewName_B1" value = "Manifold will Operate Automatically"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 86
[SectionBrew85]
[SectionBrew86]
wait "gblV_Brew_Status" value == 86
"gblV_Water_Switch_Status_Water" value = 8
"sw_Status_Script_From_Script" state = true
"gblV_Gals_to_Fill" value = 7
"sw_Running_Calculate_SPG" state = true
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew0_6_Extra_HLT @ 393  > start: sub_scrManifold_Choice"
sleep 3000
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 401 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
"gblV_Brew_Status" value = 88
[SectionBrew87]
[SectionBrew88]
wait "gblV_Brew_Status" value == 88
start "sub_scrDigiBoil_Ready"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew0_6_Extra_HLT @ 407  > start: sub_scrDigiBoil_Ready"
sleep 3000
endif
print "@ 413 wait sw_Running_Script_C state is false"
wait "sw_Running_Script_C" state == false
//........................
"gblS_Top_Text" value =  "Confirm the DigiBoil is ready for heating before proceeding.  Click Brewzilla Ready? when ready"
"gblS_swAllSwitch_Label_Text" value = "DigiBoil Ready?"
//........................
 "gblS_Bottom_Text" value = "Make sure the DigiBoil is ready for heating before proceeding."
"gblS_BrewName_B1" value = "DigiBoil Ready"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"sw_Status_Digiboil_HLT" state = true
"gblV_Brew_Status" value = 89
[SectionBrew89]
wait "gblV_Brew_Status" value == 89
//................................................................................
	if vB_Both_Extra == true
		if vB_Chose_Both == true
		vS_Msg = "Both the Brewzilla and Digiboil as Extra HLTs should be filled and ready for Heating.  Wait.  Will Auto Advance."
		else
		vS_Msg = "The Digiboil (the only one chosen) as an Extra HLT should be filled and ready for Heating.  Wait.  Will Auto Advance."
		endif
	goto "End_Alternate_Msg"
	endif
//................................................................................
	if vB_Digiboil_Extra == true
	vS_Msg = "The Digiboil as an Extra HLT should be filled and ready for Heating.  Wait.  Will Auto Advance."
	goto "End_Alternate_Msg"
	endif
//................................................................................
[End_Alternate_Msg]
print "@398 End_Alternate_Msg"
"gblVReport_B1"  visibility = hidden
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = vS_Msg
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
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
[End_Alternate]
[SectionBrew90]
"gblV_Brew_Status" value = 90
"gblS_Script_Ended" value = "Ended: scrBrew0_6_Extra_HLT"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_7_SetFermentors"
stop "scrBrew0_6_Extra_HLT"
```

## 15. scrBrew0_7_SetFermentors

Starts by itself: No · User can start or stop it: Yes · 80 lines

```text
//scrBrew0_7_SetFermentors
//Version: 261002_23:12
//260726 21:21
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Set Testing
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//...................................
//.................................
//.................................
 if vB_Testing == true
"gblS_Script_Started" value = "Started: scrBrew0_7_SetFermentors"
"gblS_Inter_Script" value = " -- "
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
show workspace "B1 Brewery"
"gblV_Brew_Status" value = 86
[SectionBrew86]
print "@ 36 Review Fermentor Status Brew Status 86"
wait "gblV_Brew_Status" value == 86
"gblS_Brewery_Top_3" value = "The Fermentors need to be reviewed for their status.  At a minimum, any Fermentors that are to be used for this brew have to be cleaned and at a minimum status of 5 (Sanitized).    Click Review Fermentor Status?"
"gblS_Brewery_Bottom_3" value = "If any Fermentors to be used are Clean, simply add some Sanitizing Solution. Any that are Dirty need to be Cleaned first.  In order for a transfer to take place later, the Fermentor must be status 5 (Ready).  The Status can be changed again just after the Whirlpool at the end of the Boil. "
"gblS_swAllSwitch_Label_Text"  value = "Review Fermentor Status?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 89
//............................................................
[SectionBrew90]
wait "gblV_Brew_Status" value == 90
"sw_Advance_ BrewStatus" visibility = hidden
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
start "inscpt_scrFermentorStatus"
sleep 100
print 74
wait "sw_Running_FermentorStatus" state == false
print 76
"gblV_Brew_Status" value = 90
[End_scrBrew0_4]
"gblS_Script_Ended" value = "Ended: scrBrew0_7_SetFermentors"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_8_Setpoints"
stop "scrBrew0_7_SetFermentors""
```

## 16. scrBrew0_8_Setpoints

Starts by itself: No · User can start or stop it: Yes · 687 lines

```text
//scrBrew0_8_Setpoints 
//Version: 21002_23:08
//260728 09_53
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Update SetPoints
// Set Testing
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
//.................................
//.................................
 if vB_Testing == true
"gblS_Script_Started" value = "Started: scrBrew0_8_Setpoints"
"gblS_Inter_Script" value = " -- "
start "sub_Start_Testing"
sleep 100
"gblTValveDelay" value = 00:00:01
sleep 99
else
start "sub_Stop_Testing"
sleep 100
"gblTValveDelay" value = 00:00:07
endif
//.........................
//.........................
new string vS_Msg
new string vS_Msg1
new String vS_Msg_HERMs
new String vS_Msg_HLT
new String vS_Msg_Insure
new value vV_Strike_Temperture
new value vV_Strike_SetPoint_Plus
new value vV_HLT_Setpoint
new value vV_OffSet_Strike
new value vV_Strike_Vessel_1
new value vV_Strike_Vessel_2
new string vS_Strike_Vessel_1
new string vS_Strike_Vessel_2
new bool vB_2_Strike_Vessels
new value vV_MASH_Temperture
new value vV_OffSet_HERMs
new value vV_Start_Herms_SetPoint
new bool vB_Radiator_HERMs
new bool vB_Big_Mac_HLT
new bool vB_Insure_SetPoint_Strike
new bool vB_Insure_SetPoint_HLT
//......................................
vV_HLT_Setpoint = 185
//......................................
vV_Strike_Vessel_1 = "gblV_Strike_Vessel_1" value
vV_Strike_Vessel_2 = "gblV_Strike_Vessel_2" value
vS_Strike_Vessel_1 = "gblS_Strike_Vessel_1" value
vS_Strike_Vessel_2 = "gblS_Strike_Vessel_2" value
vB_2_Strike_Vessels = "sw_Flow_2_Vessels_Strike" state
vV_Strike_Temperture = "gblV_Desired_Strike" value
vV_OffSet_Strike = "gblV_StrikeOffset" value
vV_Strike_SetPoint_Plus = vV_Strike_Temperture + vV_OffSet_Strike
vV_MASH_Temperture = "gblV_Mash_1_Temp" value
vV_OffSet_HERMs = "gblV_HERMs_Offset_R1" value
vV_Start_Herms_SetPoint = vV_MASH_Temperture + vV_OffSet_HERMs
//......................................
//......................................
	if vV_Strike_Vessel_1 != 1
		if vV_Strike_Vessel_2 != 1
		vB_Radiator_HERMs = true
		print "@ 59  Radiator = HERMS"
		"gblV_RadiatorSetPoint_P1_B1" value = vV_Strike_Temperture
		vS_Msg = "  The Radiator is the HERMS Bath.  The Radiator SetPoint has been set to "
		vS_Msg1 = vV_Strike_Temperture
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = "°F.  This is so that when the Strike is first transferred, the HERMS Bath Will NOT Cool the strike."
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg_HERMs = vS_Msg
		endif
	endif
//......................................
//......................................
	if vV_Strike_Vessel_1 != 2
		if vV_Strike_Vessel_2 != 2
		print "@ 74  Big Mac = HLT"
		vB_Big_Mac_HLT = true
		"gblV_BigMacSetPointP1_B1" value = vV_HLT_Setpoint
		endif
	endif
//......................................
//......................................
	if vV_Strike_Vessel_1 == 1
		print "@ 82 Strike Vessel 1 = Radiator"
		vB_Radiator_HERMs = false
		"gblV_RadiatorSetPoint_P1_B1" value = vV_Strike_SetPoint_Plus
			if vB_2_Strike_Vessels == false
			vS_Msg = "  The Radiator is the sole Strike Vessel.  The Radiator SetPoint has been set to "
			else
			vS_Msg = "  The Radiator is the First Strike Vessel.  The Radiator SetPoint has been set to "
			endif
		vS_Msg1 = vV_Strike_SetPoint_Plus
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = "°F.  This is the Strike Temperature plus an Offset of " 
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = vV_OffSet_Strike
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = "°F.  This is to heat the MLT and allow the Strike to cool to the Strike Temperature of "
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = vV_Strike_Temperture
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = "°F before adding the Grain." 
		vS_Msg = vS_Msg + vS_Msg1
		vS_Strike_Vessel_1 = vS_Msg
		goto "End_Strike_Vessel_1"
	endif
//......................................
	if vV_Strike_Vessel_1 == 2
		print "@ 110 Strike Vessel 1 = Big Mac"
		vB_Big_Mac_HLT = false
		"gblV_BigMacSetPointP1_B1" value = vV_Strike_SetPoint_Plus
			if vB_2_Strike_Vessels == false
			vS_Msg = "The Big Mac is the sole Strike Vessel. The Big Mac SetPoint has been set to "
			else
			vS_Msg = "The Big Mac is the First Strike Vessel. The Big Mac SetPoint has been set to "
			endif
		vS_Msg1 = vV_Strike_SetPoint_Plus
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = "°F.  This is the Strike Temperature plus an Offset of " 
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = vV_OffSet_Strike
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = "°F.  This is to heat the MLT and allow the Strike to cool to the Strike 			Temperature of "
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = vV_Strike_Temperture
		vS_Msg = vS_Msg + vS_Msg1
		vS_Msg1 = "°F before adding the Grain." 
		vS_Msg = vS_Msg + vS_Msg1
		vS_Strike_Vessel_1 = vS_Msg
		goto "End_Strike_Vessel_1"
	endif
//......................................
if vV_Strike_Vessel_1 == 3
	print "@ 138 Strike Vessel 1 = Brewzilla"
	"sw_Status_Brewzilla_HLT" state = false
	vB_Insure_SetPoint_Strike = true
		if vB_2_Strike_Vessels == false
			vS_Msg = "The Brewzilla is the sole Strike Vessel. You need to insure that the Brewzilla Setpoint is set to "
		else
			vS_Msg = "The Brewzilla is the First Strike Vessel. You need to insure that the Brewzilla Setpoint is set to "
		endif
	vS_Msg1 = vV_Strike_SetPoint_Plus
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is the Strike Temperature plus an Offset of " 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_OffSet_Strike
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is to heat the MLT and allow the Strike to cool to the Strike Temperature of "
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F before adding the Grain." 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Strike_Vessel_1 = vS_Msg
	vS_Msg = "Confirm that the Brewzilla Setpoint is set to "
	vS_Msg1 = vV_Strike_SetPoint_Plus
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  The Brewzilla does not have to be started, but should be ready."
	vS_Msg_Insure = vS_Msg
	goto "End_Strike_Vessel_1"
endif	
//......................................
if vV_Strike_Vessel_1 == 4
	"sw_Status_Digiboil_HLT" state = false
	print "@172 Strike Vessel 1 = DigiBoil"
	vB_Insure_SetPoint_Strike = true
		if vB_2_Strike_Vessels == false
			vS_Msg = "The Digiboil is the sole Strike Vessel. You need to insure that the DigiBoil Setpoint is set to "
		else
			vS_Msg = "The Digiboil is the First Strike Vessel. You need to insure that the DigiBoil Setpoint is set to "
		endif
	vS_Msg1 = vV_Strike_SetPoint_Plus
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is the Strike Temperature plus an Offset of " 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_OffSet_Strike
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is to heat the MLT and allow the Strike to cool to the Strike Temperature of "
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F before adding the Grain." 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Strike_Vessel_1 = vS_Msg
	vS_Msg = "Confirm that the DigiBoil Setpoint is set to "
	vS_Msg1 = vV_Strike_SetPoint_Plus
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  The DigiBoil does not have to be started, but should be ready."
	vS_Msg_Insure = vS_Msg
	goto "End_Strike_Vessel_1"
endif	
//......................................
if vV_Strike_Vessel_1 == 5
print "@ 204 Strike Vessel 1 = LittleMac"
	"gblV_SetpointLittleMac_P1_B1" value =  vV_Strike_SetPoint_Plus	
		if vB_2_Strike_Vessels == false
			vS_Msg = "The Little Mac is the sole Strike Vessel. The Little Mac Setpoint is set to "
		else
			vS_Msg = "The Little Mac is the First Strike Vessel. The Little Mac Setpoint is set to "
		endif
	vS_Msg1 = vV_Strike_SetPoint_Plus
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is the Strike Temperature plus an Offset of " 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_OffSet_Strike
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is to heat the MLT and allow the Strike to cool to the Strike Temperature of "
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  You will have to manually heat the Strike and monitor before adding the Grain." 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Strike_Vessel_1 = vS_Msg
	goto "End_Strike_Vessel_1"
endif
//......................................
if vV_Strike_Vessel_1 == 6
print "@ 232 Strike Vessel 1 = Brew Kettle"
	"gblV_SetpointBK_B1" value =  vV_Strike_SetPoint_Plus
		if vB_2_Strike_Vessels == false
			vS_Msg = "The Brew Kettle is the sole Strike Vessel. The Brew Kettle  Setpoint is set to "
		else
		vS_Msg = "The Brew Kettle is the First Strike Vessel. The Brew Kettle  Setpoint is set to "
		endif
	vS_Msg1 = vV_Strike_SetPoint_Plus
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is the Strike Temperature plus an Offset of " 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_OffSet_Strike
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is to heat the MLT and allow the Strike to cool to the Strike Temperature of "
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  You will have to manually heat the Strike and monitor before adding the Grain." 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Strike_Vessel_1 = vS_Msg
	goto "End_Strike_Vessel_1"
endif
//......................................
//......................................
[End_Strike_Vessel_1]
print "@ 261 End_Strike_Vessel_1"
"gblS_Top_Text" value = vS_Strike_Vessel_1
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
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
//......................................
//......................................
if vB_Insure_SetPoint_Strike == true
	"gblS_Bottom_Text" value = vS_Msg_Insure
	"gblS_swAllSwitch_Label_Text" value = "Confirm Setpoint"
	start "inscpt_scrAdvancewithSwitch"
	sleep 100
	wait "sw_Running_Advance_with_Switch" state == false
endif
vB_Insure_SetPoint_Strike = false
//...................................................
//...................................................
if vB_2_Strike_Vessels == false
	print "@ 292  skip 2 Vessel Strike"
	goto "Skip_2_Vessels"
endif
//...................................................
//...................................................	
if vV_Strike_Vessel_2 == 1
	print "@ 298  Strike 2 = Radiator"
	"gblV_RadiatorSetPoint_P1_B1" value = vV_Strike_Temperture
	vS_Msg = "  The Radiator is the Second Strike Vessel.  The Radiator SetPoint has been set to "
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is the Strike Temperature" 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This be added to the MLT and allow the Strike to cool to the Strike Temperature of "
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F before adding the Grain." 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Strike_Vessel_2 = vS_Msg
	goto "End_Strike_Vessel_2"
endif
//......................................
if vV_Strike_Vessel_2 == 2
	print "@ 318  Strike 2 = Big Mac"
	vB_Big_Mac_HLT = false
	"gblV_BigMacSetPointP1_B1" value = vV_Strike_Temperture
	vS_Msg = "  The Big Mac is the Second Strike Vessel.  The Big Mac SetPoint has been set to "
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is the Strike Temperature" 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This be added to the MLT and allow the Strike to cool to the Strike Temperature of "
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F before adding the Grain." 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Strike_Vessel_2 = vS_Msg
	goto "End_Strike_Vessel_2"
endif
//......................................
if vV_Strike_Vessel_2 == 3
	"sw_Status_Brewzilla_HLT" state = false
	print "@ 340 Strike 2 = Brewzilla"
	vB_Insure_SetPoint_Strike = true
	vS_Msg = "The Brewzilla is the Second Strike Vessel. You need to insure that the Brewzilla Setpoint is set to "
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is the Strike Temperature" 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This be added to the MLT and allow the Strike to cool to the Strike Temperature of "
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F before adding the Grain."  
	vS_Msg = vS_Msg + vS_Msg1
	vS_Strike_Vessel_2 = vS_Msg
	vS_Msg = "Confirm that the Brewzilla Setpoint is set to "
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  The Brewzilla does not have to be started, but should be ready."
	vS_Msg_Insure = vS_Msg
	goto "End_Strike_Vessel_2"
endif	
//......................................
if vV_Strike_Vessel_2 == 4
	"sw_Status_Digiboil_HLT" state = false
	print "@ 366  Strike 2 = DigiBoil"
	vB_Insure_SetPoint_Strike = true
	vS_Msg = "The Digiboil is the Second Strike Vessel. You need to insure that the DigiBoil Setpoint is set to "
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is the Strike Temperature" 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This be added to the MLT and allow the Strike to cool to the Strike Temperature of "
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F before adding the Grain."   
	vS_Msg = vS_Msg + vS_Msg1
	vS_Strike_Vessel_2 = vS_Msg
	vS_Msg = "Confirm that the DigiBoil Setpoint is set to "
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  The DigiBoil does not have to be started, but should be ready."
	vS_Msg_Insure = vS_Msg
	goto "End_Strike_Vessel_2"
endif	
//......................................
if vV_Strike_Vessel_2 == 5
	print "@ 391  Strike 2 = Little Mac"
	"gblV_SetpointLittleMac_P1_B1" value =  vV_Strike_Temperture	
	vS_Msg = "The Little Mac is the Second Strike Vessel. The Little Mac Setpoint is set to "
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is the Strike Temperature" 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This be added to the MLT and allow the Strike to cool to the Strike Temperature of "
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  You will have to manually heat the Strike and monitor before adding the Grain."   
	vS_Msg = vS_Msg + vS_Msg1
	vS_Strike_Vessel_2 = vS_Msg
	goto "End_Strike_Vessel_2"
endif
//......................................
if vV_Strike_Vessel_2 == 6
	print "@ 411  Strike 2 = Brew Kettle"
	"gblV_SetpointBK_B1" value =  vV_Strike_Temperture
	vS_Msg = "The Brew Kettle is the Second Strike Vessel. The Brew Kettle  Setpoint is set to "
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This is the Strike Temperature" 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  This be added to the MLT and allow the Strike to cool to the Strike Temperature of "
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = vV_Strike_Temperture
	vS_Msg = vS_Msg + vS_Msg1
	vS_Msg1 = "°F.  You will have to manually heat the Strike and monitor before adding the Grain." 
	vS_Msg = vS_Msg + vS_Msg1
	vS_Strike_Vessel_2 = vS_Msg
	goto "End_Strike_Vessel_2"
endif
//......................................
//......................................
[End_Strike_Vessel_2]
"gblS_Top_Text" value = vS_Strike_Vessel_2
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
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
//......................................
//......................................
if vB_Insure_SetPoint_Strike == true
	"gblS_Bottom_Text" value = vS_Msg_Insure
	"gblS_swAllSwitch_Label_Text" value = "Confirm Setpoint"
	start "inscpt_scrAdvancewithSwitch"
sleep 100
	wait "sw_Running_Advance_with_Switch" state == false
endif
//......................................
//......................................
[Skip_2_Vessels]
print "@  461 Big Mac_HLT = true"
if vB_Big_Mac_HLT == true
		if "sw_Status_Brewzilla_HLT" state == false
			if "sw_Status_Digiboil_HLT" state == false
				vB_Insure_SetPoint_HLT = false
				vS_Msg = "The Big Mac is the only  Electric HLT.  The Big Mac Setpoint has been set to "
				vS_Msg1 = vV_HLT_Setpoint
				vS_Msg = vS_Msg + vS_Msg1
				vS_Msg1 = "°F. The Big Mac Water will be used for flushing, Sparge Water, Topping Up, && Cleaning Water."
				vS_Msg = vS_Msg + vS_Msg1
				vS_Msg_HLT =  vS_Msg
				goto "End_Big_Mac_HLT"
			endif
		endif
//...................................................
	if "sw_Status_Brewzilla_HLT" state == false
		if "sw_Status_Digiboil_HLT" state == true
			print "@ 480  HLT  = Big Mac && DigiBoil"
			vB_Insure_SetPoint_HLT = true
			vS_Msg = "The Big Mac and the DigiBoil are Electric HLTs.  The Big Mac Setpoint has been set to "
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F. You should insure that the DigiBoil Setpoint is set to "
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F as well. The Big Mac and DigiBoil Water will be used for flushing, Sparge Water, Topping Up, && Cleaning Water."  
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_HLT =  vS_Msg
						vS_Msg = "Confirm that the DigiBoil Setpoint is set to "
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F. The DigiBoil does not have to be started yet, but it should be ready"
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_Insure = vS_Msg
			goto "End_Big_Mac_HLT"
		endif
	endif
//...................................................
	if "sw_Status_Brewzilla_HLT" state == true
		if "sw_Status_Digiboil_HLT" state  == false
			print "@ 508  HLT  = Big Mac && Brewzilla"
			vB_Insure_SetPoint_HLT = true
			vS_Msg = "The Big Mac and the Brewzilla are Electric HLTs.  The Big Mac Setpoint has been set to "
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F. You should insure that the Brewzilla Setpoint is set to "
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F as well. The Big Mac and Brewzilla Water will be used for flushing, Sparge Water, Topping Up, && Cleaning Water."  
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_HLT =  vS_Msg
			"gblS_swAllSwitch_Label_Text" value = "Confirm Setpoint"
			vS_Msg = "Confirm that the Brewzilla Setpoint is set to "
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F. The Brewzilla does not have to be started yet, but it should be ready"
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_Insure = vS_Msg
			goto "End_Big_Mac_HLT"
			
		endif
	endif
//...................................................
	if "sw_Status_Brewzilla_HLT" state == true
		if "sw_Status_Digiboil_HLT" state  == true
			print "@ 537  HLT  = Big Mac, Brewzilla && DigiBoil"
			vB_Insure_SetPoint_HLT = true
			vS_Msg = "The Big Mac , the Brewzilla and the Digiboil are all Electric HLTs.  The Big Mac Setpoint has been set to "
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F. You should insure that the Brewzilla Setpoint and DigiBoil Setpoints are set to "
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F as well. The Big Mac, Brewzilla, and Digiboil Water will be used for flushing, Sparge Water, Topping Up, && Cleaning Water."  
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_HLT =  vS_Msg
			"gblS_swAllSwitch_Label_Text" value = "Confirm Setpoint"
 
			vS_Msg = "Confirm that the Brewzilla and DigiBoil Setpoints are set to "
			 vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F. The Brewzilla and the DigiBoil do NOT have to be started yet, but they should be ready"
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_Insure = vS_Msg
		goto "End_Big_Mac_HLT"
		endif
	endif
endif
//...................................................
//...................................................
if vB_Big_Mac_HLT == false
	if "sw_Status_Brewzilla_HLT" state  == false
		if "sw_Status_Digiboil_HLT" state  == true
			print "@ 569  HLT  = DigiBoil"
			vB_Insure_SetPoint_HLT = true
			vS_Msg = "The DigiBoil is the sole Electric HLT.  You should insure that the Digiboil Setpoint is set to"
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F.  The Digiboil Water will be used for flushing, Sparge Water, Topping Up, && Cleaning Water.  There is extra HLT Water in the Big Mac."
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_HLT =  vS_Msg
			"gblS_swAllSwitch_Label_Text" value = "Confirm Setpoint"
			vS_Msg = "Confirm that the DigiBoil Setpoint is set to "
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F. The DigiBoil does not have to be started yet, but it should be ready"
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_Insure = vS_Msg
			goto "End_Big_Mac_HLT"
		endif
	endif
//...................................................
	if "sw_Status_Brewzilla_HLT" state == true
	vB_Insure_SetPoint_HLT = true
		if "sw_Status_Digiboil_HLT" state  == false
			print "@ 594  HLT  = Brewzilla"
			vS_Msg = "The Brewzilla is the sole Electric HLT.  You should insure that the Brewzilla Temperture is set to"
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F.  The Brewzilla Water will be used for flushing, Sparge Water, Topping Up, && Cleaning Water.  There is extra HLT Water in the Big Mac."
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_HLT =  vS_Msg
			"gblS_swAllSwitch_Label_Text" value = "Confirm Setpoint"
 
			vS_Msg = "Confirm that the Brewzilla Setpoint is set to "
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F. The Brewzilla does not have to be started yet, but it should be ready"
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_Insure = vS_Msg
			goto "End_Big_Mac_HLT"
		endif
	endif
//...................................................
	if "sw_Status_Brewzilla_HLT" state == true
		if "sw_Status_Digiboil_HLT" state  == true
			print "@ 617  HLT  = DigiBoil && Brewzilla"
			vB_Insure_SetPoint_HLT = true
			vS_Msg = "The Brewzilla and the Digiboil are Electric HLTs.  You should insure that the Brewzilla Temperture and the Digiboil Temperature is set to"
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F.  The Brewzilla Water and the DigiBoil will be used for flushing, Sparge Water, Topping Up, && Cleaning Water.  There is extra HLT Water in the Big Mac."
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_HLT =  vS_Msg
			"gblS_swAllSwitch_Label_Text" value = "Confirm Setpoint"
			vS_Msg = "Confirm that the Brewzilla and DigiBoil Setpoints are set to "
			vS_Msg1 = vV_HLT_Setpoint
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg1 = "°F. The Brewzilla or the DigiBoil do NOT have to be started yet, but they should be ready"
			vS_Msg = vS_Msg + vS_Msg1
			vS_Msg_Insure = vS_Msg
		goto "End_Big_Mac_HLT"
		endif
	endif
endif
//...................................................
//...................................................
[End_Big_Mac_HLT]
print "@ 664  Message HLT"
"gblS_swAllSwitch_Label_Text" value = "Confirm Setpoint"
"gblS_Top_Text" value = vS_Msg_HLT
// 3 Second Delay
"gblV_Delay_Seconds" value = 3
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
//......................................
//......................................
if vB_Insure_SetPoint_HLT == true
"gblS_Bottom_Text" value = vS_Msg_Insure
"gblS_swAllSwitch_Label_Text" value = "Confirm Setpoint"
start "inscpt_scrAdvancewithSwitch"
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
endif
//...................................................
//...................................................
if vB_Radiator_HERMs == true
	print "@ 671 HERMs Message"
	"gblS_Top_Text" value = vS_Msg_HERMs
	// 10 Second Delay
	"gblV_Delay_Seconds" value = 10
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
//......................................
//......................................
endif
print "@ 691 Final Message"
	if vB_Radiator_HERMs == true
		"gblS_Top_Text" value = "All of the Strike Setpoints are set.  Any HLT Sepoints are set.  The Radiator has been set for HERMs.  You can now turn on or delay the start of any Heaters.  Wait!  Will Auto Advance."
	else
	"gblS_Top_Text" value = "All of the Strike Setpoints are set.  Any HLT Sepoints are set. The Radiator will be setup for the HERMs Bath after the Radiator Stike is transferred.   You can now turn on or delay the start of any Heaters.    Wait!  Will Auto Advance."
	endif	
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
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
//......................................
//......................................//......................................
[End_scrBrew0_8_Setpoints]
"gblS_Script_Ended" value = "Ended: scrBrew0_8_Setpoints"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_9_1_Start_Radiator"
stop "scrBrew0_8_Setpoints"
```

## 17. scrBrew0_9_1_Start_Radiator

Starts by itself: No · User can start or stop it: Yes · 361 lines

```text
//scrBrew0_9_1_Start_Radiator  
//Version: 21002_23:15
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
// Sets Preheat, Radiator, Big Mac, Strike Vessels
//...................................................
// Set Testing
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
"gblS_Script_Started" value = "Started: scrBrew0_9_1_Start_Radiator" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
//................................
new string vS_Msg
new string vS_Msg1
new string vS_Wrong_Choice_1
new string vS_Strike_Msg_1
new string vS_Strike_Label_1
new string vS_Strike_Report_Label_1
new value vV_Vessel
new value vV_Delay_Hours
new value vV_Volume
new value vV_Radiator_Volume
new value vV_Delay_Hours
new value vV_Strike_Vessel_1
new bool vB_2_Strike_Vessels
new bool vB_Radiator_Strike
new bool vB_Radiator_Start
new bool vB_Radiator_Done
new bool vB_Radiator_HERMS_Bath
new bool vB_Radiator_Delayed
new bool vB_Brewzilla_Strike
new time vT_Delay
new datetime vDT
new datetime vDT_Start
//...................................................
//...................................................
"sw_Flow_Radiator_Delayed" state = false
//...................................................
	if "gblV_Number_Strike_Vessels" value == 2
		vB_2_Strike_Vessels = true
	else
		vB_2_Strike_Vessels = false
	endif	
vV_Radiator_Volume = "gblVCurrentRadiator_Volume" value
if "gblV_Strike_Vessel_1" value == 1
vB_Radiator_Strike =  true
endif
if "gblV_Strike_Vessel_2" value == 1
vB_Radiator_Strike =  true
endif
//............................................................
if vB_Radiator_Strike == false
if vV_Radiator_Volume > 0
vB_Radiator_HERMS_Bath = true
else
	vB_Radiator_Done = true
print "@ 158 Radiator Not Used"
endif
endif
 if "gblV_Strike_Vessel_1" value == 3
vB_Brewzilla_Strike  = true
endif
if "gblV_Strike_Vessel_2" value == 1
vB_Radiator_Strike =  true
endif
 if "gblV_Strike_Vessel_2" value == 3
vB_Brewzilla_Strike  = true
endif
//............................................................
vDT = now 
//............................................................
vS_Msg = "Insure that the Knife Wall Safety switches for the Radiator and Big Mac are on.  No heat will be possible with them off.  Click Knife Wall Safety Switches On?"
if  vB_Brewzilla_Strike  ==  true
vS_Msg  = "Insure that the Knife Wall Safety switches for the Brewzilla, Radiator and Big Mac are on.  No heat will be possible with them off.  Click Knife Wall Safety Switches On?"
"gblS_swAllSwitch_Label_Text" value = "Knife Wall Safety Switches On?"
"gblS_Top_Text" value = vS_Msg
//........................
"gblS_Bottom_Text" value = "Must be On Starting NOW or delayed."
"gblS_BrewName_B1" value = "Knife Wall Safety Switches"
"gblS_swAllSwitch_Label_Text" value = "Knife Wall Safety Switches On?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblS_Brewery_Bottom_1" visibility =  hidden
"gblS_BrewName_B1" value = "Start Now or Delay"
[Start_A_New]
print "@214 Start_A_New"
if vB_Radiator_Done == true
print " @ 117 Radiator Finished"
goto  "Ender_Set_Radiator_Start"
endif
//............................................................
vS_Msg = vS_Msg + vS_Msg1
[Set_Delay_Radiator]
print " @ 123 Set_Delay_Radiator"
//if vB_Radiator_Done == true
//goto  "Ender_Set_Radiator_Start"
//endif
//............................................................
if vB_Radiator_Strike == true
if vB_2_Strike_Vessels == false
vS_Msg = "The Sole Strike Vessel is the Radiator"
else
if vV_Strike_Vessel_1 == 1
vS_Msg = "The First  Strike Vessel is the Radiator"
else
vS_Msg = "The Second Strike Vessel is the Radiator"
endif
endif
goto "Radiator_Delay"
endif
//............................................................
if vB_Radiator_HERMS_Bath == true
vS_Msg = "The Radiator is the HERMs Bath and is needed at the start of the Mash"
goto "Radiator_Delay"
endif
//......................................................
[Radiator_Delay]
print "@ 254 Radiator_Delay"
vS_Strike_Label_1 =  "Enter Delay Hour(s)"
vS_Wrong_Choice_1 =  "Only Zero to 16 are allowed.  Select a lower number!"	
vS_Strike_Report_Label_1 =  "Zero to Sixteen Hours Delay"
	vS_Msg1 = ".   A Start Delay (in hours) may be selected.  Zero starts immediately, 1 delays for 0ne Hour, 2 delays for two Hours and so on.  You may delay up the 16 hours.  This for the Radiator Body Element only.  Enter the delay in Hours.\nZero to 16 are allowed"
vS_Msg = vS_Msg + vS_Msg1
 vV_Vessel = 2
goto "Delay_or_Start"
//......................................................
[Delay_or_Start]
print " @ 167 Strike Start"
vS_Strike_Msg_1 = vS_Msg
goto "Start_Hours_ 1"
	
//........................................
//Inspector_Black
"gblV_Set_BackGround_Middle_Time" value = 1
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//........................................
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
goto "Start_Hours_ 1"
[Start_Hours_ 1]
//........................................
vS_Msg = ". "
vS_Msg1 = ".\nThe current time is "
vS_Msg = vS_Msg + vS_Msg1
vS_Msg1 = vDT
vS_Msg = vS_Msg + vS_Msg1
"gblSReportLabel_B1" value = vS_Msg
//...................................................
"gblS_swAllSwitch_Label_Text" value = vS_Strike_Label_1
"gblS_Brewery_Top_1" value = vS_Strike_Msg_1
"gblSReportLabel_B1" value =    vS_Strike_Report_Label_1 
"gblVReport_B1" value = -1
"gblVReport_B1" precision = 0
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background 
"gblS_Brewery_Top_1" background = 2
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_1" visibility = visible 
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_1" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" value =  -1
goto "Start_Loop_Delay"
[Too_Many_1]
"gblVReport_B1" value =  -1
"gblVReport_B1" visibility = hidden
vS_Msg = "gblS_Brewery_Top_1" value
 "gblS_Brewery_Top_1" value = vS_Wrong_Choice_1 
"gblS_Brewery_Top_1" background  = 1
sleep 4001
"gblS_Brewery_Top_1" background  = 3
sleep 4001
"gblS_Brewery_Top_1" background  = 2
 "gblS_Brewery_Top_1" value = vS_Msg
"gblVReport_B1" visibility = visible
goto "Start_Loop_Delay"
[Start_Loop_Delay]
wait "gblVReport_B1" value > -1
[Loop_Delay]
sleep 100
if  "gblVReport_B1" value <= 16
vV_Delay_Hours = "gblVReport_B1" value	
"gblVReport_B1" value = 0
goto "Exit_Strike"
endif
if "gblVReport_B1" value > 16
"gblVReport_B1" value = -1
goto "Too_Many_1"
endif
[Exit_Strike]
//vDT_Start
if vV_Delay_Hours == 0
vT_Delay  = 00:10:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 1
vT_Delay  = 01:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 2
vT_Delay  = 02:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 3
vT_Delay  = 03:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 4
vT_Delay  = 04:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 5
vT_Delay  = 05:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 6
vT_Delay  = 06:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours  == 7
vT_Delay  = 07:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 8
vT_Delay  = 08:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 9
vT_Delay  = 09:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 10
vT_Delay  = 10:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 11
vT_Delay  = 11:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 12
vT_Delay  = 12:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 13
vT_Delay  = 13:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 14
vT_Delay  = 14:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 15
vT_Delay  = 15:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 16
vT_Delay  = 16:00:00
goto "Delay_Time_Set"
endif
[Delay_Time_Set]
 vDT_Start = vDT + vT_Delay
//..................................................................
if vB_Radiator_Done == true
print 547
goto "Start_A_New"
endif
if  vV_Vessel  == 2
if vV_Delay_Hours == 0
		"gblDT_Radiator_Start" value = vDT_Start
vB_Radiator_Delayed = false
"sw_Flow_Radiator_Delayed" state = false
goto "Start_Radiator"
else
"gblDT_Radiator_Start" value = vDT_Start
vB_Radiator_Delayed = true
"sw_Flow_Radiator_Delayed" state = true
goto "Start_Radiator"
	endif
endif
[Start_Radiator]
if vB_Radiator_Delayed == false
"gblS_swAllSwitch_Label_Text" value =  "Radiator  No Delay ?"
vS_Msg = "The Radiator Heater will start shortly Automatically.  The Manifold will be checked before it is started.  The Big Mac Delay will be checked next.  "
else
"gblS_swAllSwitch_Label_Text" value =  "Raditor Delay Set?"
vS_Msg = "The Radiator Heater  will start Automatically at "
vS_Msg1 = vDT_Start
vS_Msg = vS_Msg + vS_Msg1
 vS_Msg1 = ".  The Manifold will be checked before it is started.  The Big Mac Delay will be checked next.  "
vS_Msg = vS_Msg + vS_Msg1
goto "Delay_Message"
endif
//.................................
goto "Delay_Message"
[Delay_Message]
print "@ 720 Delay_Message"
"gblS_Brewery_Top_2" value = vS_Msg
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblSReportLabel_B1" visibility  = hidden
"gblVReport_B1" visibility  = hidden
"gblS_Brewery_Top_1" visibility  = hidden
"gblS_Brewery_Top_2" visibility  = visible
"gblS_Brewery_Top_3" visibility  = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 705
wait  "gblV_Brew_Status" value == 706
//......................................................................
[Ender_Set_Radiator_Start]
sleep 100
"gblS_Script_Ended" value = "Ended: scrBrew0_9_1_Start_Radiator"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_9_2_Start_BigMac"
stop "scrBrew0_9_1_Start_Radiator"
```

## 18. scrBrew0_9_2_Start_BigMac

Starts by itself: No · User can start or stop it: Yes · 333 lines

```text
//scrBrew0_9_2_Start_BigMac Modified 260826 08_44
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
// Sets Delay Big Mac
//...................................................
// Set Testing
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
"gblS_Script_Started" value = "Started: scrBrew0_9_2_Start_BigMac" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
//................................
new string vSMsg
new string vSMsg1
new string vS_Wrong_Choice_1
new string vS_Strike_Msg_1
new string vS_Strike_Label_1
new string vS_Strike_Report_Label_1
new value vV_Vessel
new value vV_Delay_Hours
new value vV_Volume
new value vV_Strike_Vessel_1
new bool vB_2_Strike_Vessels
new bool vB_BigMac_Strike
new bool vB_BigMac_HLT
new bool vB_BigMac_Done
new bool vB_BigMac_Delayed 
new time vT_Delay
new datetime vDT
new datetime vDT_Start
//...................................................
//...................................................
"sw_Flow_BigMac_Delayed" state = false
//...................................................
	if "gblV_Number_Strike_Vessels" value == 2
		vB_2_Strike_Vessels = true
	else
		vB_2_Strike_Vessels = false
	endif	
vV_Volume = "gblVCurrentBigMac_Volume" value
if "gblV_Strike_Vessel_1" value == 2
vB_BigMac_Strike =  true
endif
if "gblV_Strike_Vessel_2" value == 2
vB_BigMac_Strike =  true
endif
//............................................................
if vB_BigMac_Strike == false
if vV_Volume > 0
vB_BigMac_HLT = true
else
	vB_BigMac_Done = true
print "@ 158 Big Mac Not Used"
endif
endif
//............................................................
vDT = now 
//............................................................
[Start_A_New]
print "@214 Start_A_New"
if vB_BigMac_Done == true
print " @ 111 BigMac Finished"
goto  "Ender_Set_BigMac_Start"
endif
//............................................................
vSMsg = vSMsg + vSMsg1
[Set_Delay_Big Mac]
print " @ 123 Set_Delay_Big Mac"
//if vB_BigMac_Done == true
//goto  "Ender_Set_BigMac_Start"
//endif
//............................................................
if vB_BigMac_Strike == true
if vB_2_Strike_Vessels == false
vSMsg = "The Sole Strike Vessel is the Big Mac"
else
if vV_Strike_Vessel_1 == 1
vSMsg = "The First  Strike Vessel is the Big Mac"
else
vSMsg = "The Second Strike Vessel is the Big Mac"
endif
endif
goto "Big Mac_Delay"
endif
//............................................................
if vB_BigMac_HLT == true
vSMsg = "The Big Mac is an HLT and is needed throughout the Brew Day"
goto "BigMac_Delay"
endif
//......................................................
[BigMac_Delay]
print "@ 254 BigMac_Delay"
vS_Strike_Label_1 =  "Enter Delay Hour(s)"
vS_Wrong_Choice_1 =  "Only Zero to 16 are allowed.  Select a lower number!"	
vS_Strike_Report_Label_1 =  "Zero to Sixteen Hours Delay"
	vSMsg1 = ".   A Start Delay (in hours) may be selected.  Zero starts immediately, 1 delays for 0ne Hour, 2 delays for two Hours and so on.  You may delay up the 16 hours.  This for the Big Mac Element only.  Enter the delay in Hours.\nZero to 16 are allowed"
vSMsg = vSMsg + vSMsg1
 vV_Vessel = 2
goto "Delay_or_Start"
//......................................................
[Delay_or_Start]
print " @ 167 Strike Start"
vS_Strike_Msg_1 = vSMsg
goto "Start_Hours_ 1"
	
//........................................
//Inspector_Black
"gblV_Set_BackGround_Middle_Time" value = 1
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//........................................
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
goto "Start_Hours_ 1"
[Start_Hours_ 1]
//........................................
vSMsg = ". "
vSMsg1 = ".\nThe current time is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vDT
vSMsg = vSMsg + vSMsg1
"gblSReportLabel_B1" value = vSMsg
//...................................................
"gblS_swAllSwitch_Label_Text" value = vS_Strike_Label_1
"gblS_Brewery_Top_1" value = vS_Strike_Msg_1
"gblSReportLabel_B1" value =    vS_Strike_Report_Label_1 
"gblVReport_B1" value = -1
"gblVReport_B1" precision = 0
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background 
"gblS_Brewery_Top_1" background = 2
"gblVReport_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_1" visibility = visible 
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_1" visibility = Visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" value =  -1
goto "Start_Loop_Delay"
[Too_Many_1]
"gblVReport_B1" value =  -1
"gblVReport_B1" visibility = hidden
vSMsg = "gblS_Brewery_Top_1" value
 "gblS_Brewery_Top_1" value = vS_Wrong_Choice_1 
"gblS_Brewery_Top_1" background  = 1
sleep 4001
"gblS_Brewery_Top_1" background  = 3
sleep 4001
"gblS_Brewery_Top_1" background  = 2
 "gblS_Brewery_Top_1" value = vSMsg
"gblVReport_B1" visibility = visible
goto "Start_Loop_Delay"
[Start_Loop_Delay]
wait "gblVReport_B1" value > -1
[Loop_Delay]
sleep 100
if  "gblVReport_B1" value <= 16
vV_Delay_Hours = "gblVReport_B1" value	
"gblVReport_B1" value = 0
goto "Exit_Strike"
endif
if "gblVReport_B1" value > 16
"gblVReport_B1" value = -1
goto "Too_Many_1"
endif
[Exit_Strike]
//vDT_Start
if vV_Delay_Hours == 0
vT_Delay  = 00:10:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 1
vT_Delay  = 01:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 2
vT_Delay  = 02:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 3
vT_Delay  = 03:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 4
vT_Delay  = 04:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 5
vT_Delay  = 05:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 6
vT_Delay  = 06:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours  == 7
vT_Delay  = 07:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 8
vT_Delay  = 08:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 9
vT_Delay  = 09:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 10
vT_Delay  = 10:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 11
vT_Delay  = 11:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 12
vT_Delay  = 12:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 13
vT_Delay  = 13:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 14
vT_Delay  = 14:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 15
vT_Delay  = 15:00:00
goto "Delay_Time_Set"
endif
if vV_Delay_Hours == 16
vT_Delay  = 16:00:00
goto "Delay_Time_Set"
endif
[Delay_Time_Set]
 vDT_Start = vDT + vT_Delay
//..................................................................
if vB_BigMac_Done == true
print 547
goto "Start_A_New"
endif
if  vV_Vessel  == 2
if vV_Delay_Hours == 0
		"gblDT_BigMac_Start" value = vDT_Start
vB_BigMac_Delayed = false
"sw_Flow_BigMac_Delayed" state = false
goto "Start_BigMac"
else
"gblDT_BigMac_Start" value = vDT_Start
vB_BigMac_Delayed = true
"sw_Flow_BigMac_Delayed" state = true
goto "Start_BigMac"
	endif
endif
[Start_BigMac]
if vB_BigMac_Delayed == false
"gblS_swAllSwitch_Label_Text" value =  "Big Mac No Delay ?"
vSMsg = "The Big Mac Heater will start shortly Automatically.  The Manifold will be checked before it is started.  The Big Mac Delay will be checked next.  "
else
"gblS_swAllSwitch_Label_Text" value =  "Big Mac Delay Set?"
vSMsg = "The Big Mac Heater  will start Automatically at "
vSMsg1 = vDT_Start
vSMsg = vSMsg + vSMsg1
 vSMsg1 = ".  The Manifold will be checked before it is started.  The Big Mac Delay will be checked next.  "
vSMsg = vSMsg + vSMsg1
goto "Delay_Message"
endif
//.................................
goto "Delay_Message"
[Delay_Message]
print "@ 720 Delay_Message"
"gblS_Brewery_Top_2" value = vSMsg
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblSReportLabel_B1" visibility  = hidden
"gblVReport_B1" visibility  = hidden
"gblS_Brewery_Top_1" visibility  = hidden
"gblS_Brewery_Top_2" visibility  = visible
"gblS_Brewery_Top_3" visibility  = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 705
wait  "gblV_Brew_Status" value == 706
//......................................................................
[Ender_Set_BigMac_Start]
sleep 100
"gblS_Script_Ended" value = "Ended: scrBrew0_9_2_Start_BigMac"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_9_3_Start_BrewZilla"
stop "scrBrew0_9_2_Start_BigMac"
```

## 19. scrBrew0_9_3_Start_BrewZilla

Starts by itself: No · User can start or stop it: Yes · 0 lines

```text

```

## 20. scrBrew0_9_5_Propane_Burners

Starts by itself: No · User can start or stop it: Yes · 179 lines

```text
//scrBrew0_9_5_Propane_Burners  Modified 260917 08_19
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
//...................................................
"sw_Running_Script_B" state  = true
// Set Testing
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
"gblS_Script_Started" value = "Started: scrBrew0_9_5_Propane_Burners" 
//................................
//.........................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
"gblS_Inter_Script" visibility = visible
start "step_scrTest_Time _Reset"
start "looper_scrBoilTimer_Reset"
"gblTValveDelay" value = 00:00:01
sleep 99
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
new string vSMsg
new string vSMsg1
new bool vB_Propane_Strike
new bool vB_BrewKettle_Strike
new bool vB_littleMac_Strike
new bool vB_Both_Strike
new bool vB_Niether_Strike
new bool vB_Propane_Done
new bool vB_2_Strike_Vessels
new bool vB_2nd_Batch
//...................................................
//...................................................
 vB_2nd_Batch =  vB_2nd_Batch
	if "gblV_Number_Strike_Vessels" value == 2
		vB_2_Strike_Vessels = true
	else
		vB_2_Strike_Vessels = false
	endif
//...................................................
	if vB_2_Strike_Vessels == true
		if "gblV_Strike_Vessel_1" value < 5
		if "gblV_Strike_Vessel_2" value < 5
			vSMsg = "The Brew Kettle burner will be used to Boil the Wort.  The Little Mac Burner may be tested 
			as a backup."
			if  vB_2nd_Batch == true
				vSMsg = "The Brew Kettle burner will be used to Boil the Wort.  The Little Mac Burner will be used for the Second Batch."
			endif
			vB_Niether_Strike = true
			goto "Start_A_New"
		endif
		endif
	endif
		if vB_2_Strike_Vessels == false
		if "gblV_Strike_Vessel_1" value < 5
				vSMsg = "Both the Little Mac and the Brew Kettle burners need to be tested."
				vB_Niether_Strike = true
			goto "Start_A_New"
		endif
	endif
//...................................................
//...................................................
	if vB_2_Strike_Vessels == true
//...................................................
			if "gblV_Strike_Vessel_1" value == 5
			if "gblV_Strike_Vessel_2" value == 6
				vSMsg = "The Little Mac is the First Strike Vessel and the Brew Kettle is the Second Strike Vessel.  Both the Little Mac and the Brew Kettle burners need to be tested."
				vB_Both_Strike = true
				goto "Start_A_New"
			endif
			endif
	
			if "gblV_Strike_Vessel_1" value == 6
			if "gblV_Strike_Vessel_2" value == 5
				vSMsg = "The Brew Kettle is the First Strike Vessel and the Little Mac is the Second Strike Vessel.  Both the Little Mac and the Brew Kettle burners need to be tested."
				vB_Both_Strike = true
				goto "Start_A_New"
			endif
			endif
//...................................................
//...................................................			
			if "gblV_Strike_Vessel_1" value == 5
				vSMsg = "The Little Mac is the First Strike Vessel.  Both the Little Mac and the Brew Kettle burners need to be tested."
				vB_littleMac_Strike  = true
				goto "Second_Strike"
			endif
			if "gblV_Strike_Vessel_1" value == 6
				vSMsg = "The Brew Kettle is the First Strike Vessel.  Both the Little Mac and the Brew Kettle burners need to be tested."
				vB_BrewKettle_Strike  = true
				goto "Second_Strike"
			endif
//...................................................
//...................................................				
		//Second_Strike
			if "gblV_Strike_Vessel_2" value == 5
				vSMsg = "The Little Mac is the Second Strike Vessel.  Both the Little Mac and the Brew Kettle burners need to be tested."
				vB_littleMac_Strike  = true
				goto "Start_A_New"
			endif
			if "gblV_Strike_Vessel_2" value == 6
				vSMsg = "The Brew Kettle is the Second Strike Vessel.  Both the Little Mac and the Brew Kettle burners need to be tested."
				vB_BrewKettle_Strike  = true
				goto "Start_A_New"
			endif
	endif	
//...................................................
//...................................................		
	if vB_2_Strike_Vessels == false
		if "gblV_Strike_Vessel_1" value == 5
			vSMsg = "The Little Mac is the Sole Strike Vessel.  Both the Little Mac and the Brew Kettle burners need to be tested."
			vB_littleMac_Strike  = true
			goto "Start_A_New"
		endif
		if "gblV_Strike_Vessel_1" value == 6
			vSMsg = "The Brew Kettle is the Sole Strike Vessel.  Both the Little Mac and the Brew Kettle burners need to be tested."
			vB_BrewKettle_Strike  = true
			goto "Start_A_New"
		endif
	endif	

//............................................................
//............................................................
[Start_A_New]
print "@ 142 Start_A_New"
	if vB_Propane_Done == true
print " @ 144 ALL Finished"
		goto  "Ender_Set_Propane"
	endif
	vSMsg1 = ".\n  Because this involves the Propane Burners, the Both burners will be made ready but not started."
		vSMsg = vSMsg + vSMsg1
//..................................................
//.................................................
"gblS_Brewery_Top_1"  value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
//........................................
"gblV_Delay_Seconds"  value = 5
start "inscpt_scrMessage_with_Delay"
//............................................................
//............................................................
goto "Start_Propane_1"
[Start_Propane_1]
print "@ 185 Start_Propane_1"
"gblS_swAllSwitch_Label_Text" value =  "Burners Ready? "
vSMsg = "Set up the Both Propane Burners to be ready for the Brew Day.  This includes:\n1:  Connecting the Propane Bottles .\n2=Test the Burners.\n3: Check for Leaks\n4: Insure Propane Valves are Off\nClick Burners Ready? when they are."
"gblS_Top_Text" value =  vSMsg
"gblS_Bottom_Text" value = "Both Propane Burners need to be set up and tested.  You may not use the Little Mac Burner, but it should be made ready regardless"
start "inscpt_scrAdvancewithSwitch"
sleep 100
vB_Propane_Done = true
goto "Ender_Set_Propane"
//......................................................................
//......................................................................
[Ender_Set_Propane]
sleep 100
if vB_Testing == true
"gblS_Script_Ended" value = "Ended: scrBrew0_9_5_Propane_Burners"
sleep 1001
endif
clear
start "scrBrew0_10_1_Start_Heaters"
"sw_Running_Script_B" state = false
stop "scrBrew0_9_5_Propane_Burners"
```

## 21. scrBrew0_10_1_Start_Heaters

Starts by itself: No · User can start or stop it: Yes · 585 lines

```text
//scrBrew0_10_1_Start_Heaters Modified 260827 10_24
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
// Sets Preheat, Radiator, Big Mac, Strike Vessels
//...................................................
// Set Testing
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
"gblS_Script_Started" value = "Started: scrBrew0_10_1_Start_Heaters" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
start "step_scrTest_Time _Reset"
start "looper_scrBoilTimer_Reset"
"gblTValveDelay" value = 00:00:01
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
stop "step_scrTest_Time _Reset"
stop "looper_scrBoilTimer_Reset"
"gblTValveDelay" value = 00:00:07
endif
//................................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
show workspace "B1 Brewery"
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new value vV_Radiator_Volume
new value vV_BigMac_Volume
new value vV_Brewzilla_Volume
new value vV_Digiboil_Volume
new value vV_BrewKettle_Volume
new value vV_LittleMac_Volume
new value vV_Flow
new bool vB_Radiator_Using
new bool vB_BigMac_Using
new bool vB_Brewzilla_Using
new bool vB_DigiBoil_Using
new bool vB_BrewKettle_Using
new bool vB_Little_Using
new bool vB_Radiator_Delayed
new bool vB_BigMac_Delayed
new bool vB_Brewzilla_Delayed
new bool vB_DigiBoil_Delayed
new bool vB_Radiator_Started
new bool vB_BigMac_Started
new bool vB_Brewzilla_Started
new bool vB_Digiboil_Started
new bool vB_Radiator_First
new datetime vDT
new datetime vDT_Radiator_Start
new datetime vDT_BigMac_Start
//...........................................
//...........................................
vV_Radiator_Volume = "gblVCurrentRadiator_Volume" value
vV_BigMac_Volume = "gblVCurrentBigMac_Volume" value
vV_Brewzilla_Volume = "gblVCurrentBrewzilla_Volume" value
vV_Digiboil_Volume = "gblVCurrentDigiboil_Volume" value
vV_BrewKettle_Volume = "gblVCurrentBrewKettle_Volume" value
vV_LittleMac_Volume = "gblVCurrentLittle_Volume" value
vDT_Radiator_Start = "gblDT_Radiator_Start" value
vDT_BigMac_Start = "gblDT_BigMac_Start" value
vB_Brewzilla_Started = "sw_Status_Brewzilla _Heater_On" state
vB_Digiboil_Started =  "sw_Status_DigiBoil _Heater_On" state
//...........................................
"MB_14_do_RIMs_Contactor_Heat" state = false
"MB_09_PWM_RIMs_Heat" enabled = false
if vV_Radiator_Volume > 0 
vB_Radiator_Using = true
start "looper_Heat_scrRadiator_Body_Heat"
// print "@ 81 Radiator  Used"
	if "sw_Flow_Radiator_Delayed" state == true
// print "@ 83 Radiator Delayed"
		vB_Radiator_Delayed = true
		vDT_Radiator_Start = "gblDT_Radiator_Start" value
		goto "BigMac_Used"
	else
		vB_Radiator_Delayed = false
		goto "BigMac_Used"
	endif
endif
//...........................................
[BigMac_Used]	
if vV_BigMac_Volume > 0 
	vB_BigMac_Using = true
	start "looper_Heat_scrBigMacHeat"
// print "@ 96 Big Mac  Used"
	if "sw_Flow_BigMac_Delayed" state == true
// print "@ 98 Big Mac  Delayed"
		vB_BigMac_Delayed = true
		vDT_BigMac_Start = "gblDT_BigMac_Start" value
		goto "Brewzilla_Used"
	else
	vB_BigMac_Delayed = false
	goto "Brewzilla_Used"
	endif
endif
//...........................................
[Brewzilla_Used]
if vV_Brewzilla_Volume > 0 
	vB_Brewzilla_Using = true
// print "@ 111 Brewzilla  Used"
		if "sw_Status_Brewzilla _Heater_On" state == true
// print "@ 113 Brewzilla Running"
					vB_Brewzilla_Started = true
					vB_Brewzilla_Delayed = false
					goto "DigiBoil_Used"
		endif	
		if "sw_Flow_Brewzilla_Delayed" state == true
// print "@ 119 Brewzilla Delayed"
			vB_Brewzilla_Delayed = true
			goto "DigiBoil_Used"
		else
			vB_Brewzilla_Delayed = false
			goto "DigiBoil_Used"
		endif
endif
//...........................................
[DigiBoil_Used]
if vV_DigiBoil_Volume > 0 
	vB_DigiBoil_Using = true
// print "@ 131 DigBoil Used"
		if "sw_Status_DigiBoil _Heater_On" state == true
					vB_DigiBoil_Started = true
// print "@ 134 DigBoil Running"
					goto "DigiBoil_Used_End"
		endif	
		if "sw_Flow_DigiBoil_Delayed" state == true
// print "@ 138 DigBoil Delayed"
//...............................................
//...............................................
[DigiBoil_Used_End]
if vB_Radiator_Using == false
goto "Set_BigMac"
endif
[Set_Radiator] 
"gblV_Water_Switch_Status_Water" value = 202
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew0_10_1_Start_Heaters @ 151 set Radiator > start: sub_scrManifold_Choice"
sleep 4001
endif
print "@ 158 wait sw_Running_Prime_Basic state is false"
wait "sw_Running_Prime_Basic" state == false
print "@ 160 wait sw_Running_Manifold_Choice state is false"
wait "sw_Running_Manifold_Choice" state == false
//...........................................
if vB_Radiator_Delayed == true
vSMsg = "The Manifold is ready to recycle the Radiator and for heating the Radiator Body Element.  The Green Pump has been turned on.  You may elect to turn it Off (in BruControl and NOT the Green Wall Switch).  Click Radiator Set? to advance  "
vSMsg2 = "The Radiator is set to start at "
vSMsg2 = vSMsg2 + vSMsg3
vSMsg3 = vDT_Radiator_Start
vSMsg2 = vSMsg2 + vSMsg3
vSMsg3 = ".  The Radiator Body Heater and Green Pump will turn on at that time.  Click Radiator Set? to advance."
vSMsg2 = vSMsg2 + vSMsg3
"gblS_swAllSwitch_Label_Text" value  = "Radiator Set?"
endif
if vB_Radiator_Delayed == false
// print "@ 163 Start Radiator 1"
vSMsg  = "The Manifold is recycling The Radiator and ready for for heating the Radiator Body Element.  The Green Pump has been turned on.  Click Turn Radiator Body Heat On? to advance."
vSMsg2 = "This will turn on the Radiator Body Heater.   This heater is always below the ZERO volume (in the Deadspace). Click Turn Radiator Body Heat On? to advance."
"gblS_swAllSwitch_Label_Text" value  = "Turn Radiator Body Heat On ?"
endif
//......................................
"gblS_Brewery_Top_2" value  = vSMsg
"gblS_Brewery_Bottom_4" value = vSMsg2
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Bottom_4"  background = 2
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_Brewery_Bottom_4"  visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 707
wait "gblV_Brew_Status" value == 708
"gblS_Brewery_Bottom_4"  visibility  = hidden
if vB_Radiator_Delayed == true
goto "Set_BigMac"
endif
if vB_Radiator_Delayed == false
goto "Start_Radiator"
endif
//......................................
[Start_Radiator]
start "looper_scrElementControl" 
"sw_Control_Radiator_Element" state = true
sleep 200
"gblS_Brewery_Top_2" value  = "Verify that the Radiator Body Heater is on.  Click Radiator Body Heat On? once the verification is done."
"gblS_swAllSwitch_Label_Text" value  = "Radiator Body Heat On?"
vV_Flow = 121
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 709
wait "gblV_Brew_Status" value == 710
//......................................
[Set_BigMac] 
// print "@ 225 Set Big Mac"
"sw_Flow_Big_Mac_Do_Not_Turn_Heat_On" state = true
"gblV_Water_Switch_Status_Water" value = 101
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew0_10_1_Start_Heaters @ 242 set Big Mac > start: sub_scrManifold_Choice"
sleep 4001
endif
print "@ 249 wait sw_Running_Prime_Basic state is false"
wait "sw_Running_Prime_Basic" state == false
print "@ 251 wait sw_Running_Manifold_Choice state is false"
wait "sw_Running_Manifold_Choice" state == false
//...........................................
if vB_BigMac_Delayed == true
vSMsg = "The Manifold is set recycle The Big Mac for heating the Big Mac Body Element. The White Pump has been turned on.  You may elect to turn it Off (in BruControl and NOT the White Wall Switch).   Click Big Mac Set? to advance."
"gblS_Top_Text" value = vSMsg
vSMsg = "The Big Mac is set to start at "
vSMsg1 = vDT_BigMac_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".  The Big Mac Body Heater and White Pump will turn on at that time. "
vSMsg = vSMsg + vSMsg1
"gblS_Bottom_Text" value = vSMsg
"gblS_swAllSwitch_Label_Text" value  = "Big Mac Set?"
endif
//........................................
if vB_BigMac_Delayed == false
vSMsg  = "The Manifold is set recycle The Big Mac for heating the Big Mac Body Element. The White Pump has been turned on.  Click Big Mac Body Heat? to advance."
"gblS_Top_Text" value = vSMsg
vSMsg = "Click Big Mac Body Heat? to start the Big Mac Heater."
"gblS_Bottom_Text" value = vSMsg
"gblS_swAllSwitch_Label_Text" value  = "Big Mac Body Heat?"
endif
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 709
wait "gblV_Brew_Status" value == 709
if vB_BigMac_Delayed == true
goto "Delayed_Start"
endif
if vB_BigMac_Delayed == false
goto "Start_Big Mac"
endif
[Delayed_Start]
// print "@ 267 Delayed_Start"
// Waiting on Radiador and or Big Mac to start
if vB_Radiator_Delayed == true
if vB_BigMac_Delayed == true
if vDT_Radiator_Start < vDT_BigMac_Start
vB_Radiator_First = true
vSMsg = " Both the Radiator and the Big Mac are delayed.  The Radiator will start at "
vSMsg1 = vDT_Radiator_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". The Big Mac will start at "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vDT_BigMac_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". "
vSMsg = vSMsg + vSMsg1
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Advance On Time"
goto "Both_Delayed"
endif
if vB_Radiator_First == false
vSMsg = " Both the Big Mac and the Radiator are delayed.  The Big Mac will start at "
vSMsg1 =  vDT_BigMac_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". The Radiator will start at "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vDT_Radiator_Start
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". "
vSMsg = vSMsg + vSMsg1
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Advance On Time"
goto "Both_Delayed"
endif
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"gblS_Brewery_Top_1" Background = 3
"gblS_Brewery_Top_1" visibility = visible
[ Only Radiator Delayed]
if vB_Radiator_Delayed == true
if vB_BigMac_Delayed == false
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
vSMsg = "The Radiator has a delayed Start.  It will start at  "
vSMsg1 = vDT_Radiator_Start
vSMsg  = vSMsg  + vSMsg1
vSMsg1 = ". Wait!  Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Advance On Time"
vSMsg  = vSMsg  + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_1"   visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
goto "Radiator_Delayed"
endif
endif
[ Only Big Mac Delayed]
if vB_Radiator_Delayed == false
if vB_BigMac_Delayed == true
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
vSMsg = "The Big Mac has a delayed Start.  It will start at  "
vSMsg1 = vDT_BigMac_Start
vSMsg  = vSMsg  + vSMsg1
vSMsg1 = ". Wait!  Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Advance On Time"
vSMsg  = vSMsg  + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_1"   visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
goto "BigMac_Delayed"
endif
endif
[Both_Delayed]
 if vB_Radiator_First == true
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
vSMsg = "The Radiator has the earliest delayed Start.  It will start at  "
vSMsg1 = vDT_Radiator_Start
vSMsg  = vSMsg  + vSMsg1
vSMsg1 = ". The Big Mac will then start at "
vSMsg  = vSMsg  + vSMsg1
vSMsg1 = vDT_BigMac_Start
vSMsg  = vSMsg  + vSMsg1
vSMsg1 = ". Wait!  Will Auto Advance"
vSMsg  = vSMsg  + vSMsg1
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
vSMsg  = vSMsg  + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_1"   visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
	goto "Radiator_First"
endif
 if vB_Radiator_First == false
	start "inscpt_scrClearB1_Brewery"
	sleep 100
	wait "sw_Running_Clear_B1" state == false
	vSMsg = "The Big Mac has the first delayed Start.  It will start at  "
	vSMsg1 = vDT_BigMac_Start
	vSMsg  = vSMsg  + vSMsg1
	vSMsg1 = ". The Radiator will then start at "
	vSMsg  = vSMsg  + vSMsg1
	vSMsg1 = vDT_Radiator_Start
	vSMsg  = vSMsg  + vSMsg1
	vSMsg1 = ". Wait!  Will Auto Advance"
	vSMsg  = vSMsg  + vSMsg1
	"gblS_Brewery_Top_1" value = vSMsg
	"gblS_Brewery_Top_1" background = 3
	"gblS_swAllSwitch_Label_Text" background = 3
	"insp_Pix_ArrowAllSwitch_B1" background = 3
	"gblS_Brewery_Top_1"   visibility = visible
	"gblS_swAllSwitch_Label_Text" visibility = visible
	"insp_Pix_ArrowAllSwitch_B1" visibility = visible
	//........................................
	//Inspector_Blue
	"gblV_Set_BackGround_Middle_Time" value = 3
	start "inscpt_scrSet_Middle_Backgrounds"
	//........................................
	goto "BigMac_First"
endif
[Radiator_First]
// print "@ 414 Radiator_First"
vDT = now
	if vDT_Radiator_Start <= vDT
	start "looper_scrElementControl"
	"MB_34_do_GreenPump_B1" state = true
	sleep 100
	"sw_Control_Radiator_Element" state = true
	sleep 4001
	start "inscpt_scrClearB1_Brewery"
	sleep 100
	wait "sw_Running_Clear_B1" state == false
	vSMsg = "The Big Mac has a delayed Start.  It will start at  "
	vSMsg1 = vDT_BigMac_Start
	vSMsg  = vSMsg  + vSMsg1
	vSMsg1 = ". Wait!  Will Auto Advance"
	"gblS_swAllSwitch_Label_Text" value = "Wait! Will Advance On Time"
	vSMsg  = vSMsg  + vSMsg1
	"gblS_Brewery_Top_1" value = vSMsg
	"gblS_Brewery_Top_1" background = 3
	"gblS_swAllSwitch_Label_Text" background = 3
	"insp_Pix_ArrowAllSwitch_B1" background = 3
	"gblS_Brewery_Top_1"   visibility = visible
	"gblS_swAllSwitch_Label_Text" visibility = visible
	"insp_Pix_ArrowAllSwitch_B1" visibility = visible
	//........................................
	//Inspector_Blue
	"gblV_Set_BackGround_Middle_Time" value = 3
	start "inscpt_scrSet_Middle_Backgrounds"
	//........................................
	goto "BigMac_Second"
	endif
goto "Radiator_First"
[BigMac_First]
// print "@ 447 BigMac_First"
vDT = now
	if vDT_BigMac_Start <= vDT
	start "looper_scrElementControl"
	"MB_32_do_WhitePump_B1" state = true
	sleep 100
	"sw_Control_BigMac_Element" state = true
	sleep 4001
	start "inscpt_scrClearB1_Brewery"
	sleep 100
	wait "sw_Running_Clear_B1" state == false
	vSMsg = "The Radiator has a delayed Start.  It will start at  "
	vSMsg1 = vDT_Radiator_Start
	vSMsg  = vSMsg  + vSMsg1
	vSMsg1 = ". Wait!  Will Auto Advance"
	"gblS_swAllSwitch_Label_Text" value = "Wait! Will Advance On Time"

	vSMsg  = vSMsg  + vSMsg1
	"gblS_Brewery_Top_1" value = vSMsg
	"gblS_Brewery_Top_1" background = 3
	"gblS_swAllSwitch_Label_Text" background = 3
	"insp_Pix_ArrowAllSwitch_B1" background = 3
	"gblS_Brewery_Top_1"   visibility = visible
	"gblS_swAllSwitch_Label_Text" visibility = visible
	"insp_Pix_ArrowAllSwitch_B1" visibility = visible
	//........................................
	//Inspector_Blue
	"gblV_Set_BackGround_Middle_Time" value = 3
	start "inscpt_scrSet_Middle_Backgrounds"
	//........................................
	goto "Radiator_Second"
	endif
goto "BigMac_First"
[Radiator_Second]
// print "@ 480  Radiator_Second"
vDT = now
	if vDT_Radiator_Start <= vDT
	start "looper_scrElementControl"
	"MB_34_do_GreenPump_B1" state = true
	sleep 100
	"sw_Control_Radiator_Element" state = true
	sleep 4001
	goto "Ender_Start_Heaters"
	endif
goto "Radiator_Second"
[BigMac_Second]
// print "@492  Big Mac_Second"
vDT = now
	if vDT_BigMac_Start <= vDT
	start "looper_scrElementControl"
	"MB_32_do_WhitePump_B1" state = true
	sleep 100
	"sw_Control_BigMac_Element" state = true
	sleep 4001
	goto "Ender_Start_Heaters"
	endif
goto "BigMac_Second"
[Radiator_Delayed]
// print "@ 504  Radiator_Delayed"
sleep 100
vDT = now
	if vDT_Radiator_Start <= vDT
	start "looper_scrElementControl"
	"MB_34_do_GreenPump_B1" state = true
	sleep 100
	"sw_Control_Radiator_Element" state = true
	sleep 4001
	goto "Ender_Start_Heaters"
	endif
goto "Radiator_Delayed"
[BigMac_Delayed]
// print "@ 517  Big Mac_Delayed"
sleep 100
vDT = now
if vDT_BigMac_Start <= vDT
start "looper_scrElementControl"
"MB_32_do_WhitePump_B1" state = true
sleep 100
"sw_Control_BigMac_Element" state = true
sleep 4001
goto "Ender_Start_Heaters"
endif
goto "BigMac_Delayed"
[Start_Big Mac]
start "looper_scrElementControl" 
"sw_Control_BigMac_Element" state = true
sleep 200
"gblS_Brewery_Top_2" value  = "Verify that the Big Mac Body Heater is on.  Click Big Mac Body Heat On? once the verification is done."
"gblS_swAllSwitch_Label_Text" value  = "Big Mac Body Heat On?"
vV_Flow = 111
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 709
wait "gblV_Brew_Status" value == 710
vB_Radiator_Started = "sw_Control_Radiator_Element" state
if vB_Radiator_Started == true
goto "Ender_Start_Heaters"
endif
if vB_Radiator_Delayed == true
goto "Delayed_Start"
endif
goto "Ender_Start_Heaters"
[Ender_Start_Heaters]
//........................................
"gblS_Script_Ended" value = "Ended:scrBrew0_10_1_Start_Heaters"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_10_2_Heaters_Runnning"
stop "scrBrew0_10_1_Start_Heaters"
```

## 22. scrBrew0_10_2_Heaters_Runnning

Starts by itself: No · User can start or stop it: Yes · 255 lines

```text
//scrBrew0_10_2_Heaters_Runnning Modified 260827 10_30
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
// Sets Preheat, Radiator, Big Mac, Strike Vessels
//...................................................
// Set Testing
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
"gblS_Script_Started" value = "Started: scrBrew0_10_2_Heaters_Runnning" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
//................................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
show workspace "B1 Brewery"
new value vV_Radiator_Volume
new value vV_BigMac_Volume
new value vV_Brewzilla_Volume
new value vV_Digiboil_Volume
new value vV_BrewKettle_Volume
new value vV_LittleMac_Volume
new value vV_Flow
new bool vB_Radiator_Using
new bool vB_BigMac_Using
new bool vB_Brewzilla_Using
new bool vB_DigiBoil_Using
new bool vB_BrewKettle_Using
new bool vB_LittleMac_Using
//...........................................
//...........................................
vV_Radiator_Volume = "gblVCurrentRadiator_Volume" value
vV_BigMac_Volume = "gblVCurrentBigMac_Volume" value
vV_Brewzilla_Volume = "gblVCurrentBrewzilla_Volume" value
vV_Digiboil_Volume = "gblVCurrentDigiboil_Volume" value
vV_BrewKettle_Volume = "gblVCurrentBrewKettle_Volume" value
vV_LittleMac_Volume = "gblVCurrentLittle_Volume" value
//...........................................
if vV_Radiator_Volume > 0 
vB_Radiator_Using = true
endif
//...........................................
[BigMac_Used]	
if vV_BigMac_Volume > 0 
	vB_BigMac_Using = true
endif
//...........................................
[Brewzilla_Used]
if vV_Brewzilla_Volume > 0 
	vB_Brewzilla_Using = true
endif
//...........................................
//...........................................
[BrewKettle_Used]
if vV_BrewKettle_Volume > 0 
	vB_BrewKettle_Using = true
endif
//...........................................
[LittleMac_Used]
if vV_LittleMac_Volume > 0 
	vB_LittleMac_Using = true
endif
//...........................................
"gblS_Brewery_Top_2" value  = "Any Delayed Starts should have occured.  You need to Verify that Heaters and Pumps are On.  This is normally done after all of the Delayed starts have happened."
"gblS_swAllSwitch_Label_Text" value  = "Verify?"
vV_Flow = 111
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 707
wait "gblV_Brew_Status" value == 708
[Verify_Big Mac]
if vB_BigMac_Using == true
"gblS_Brewery_Top_2" value  = "Verify that the Big Mac Body Heater is on. The White Pump should also be On. Click Big Mac Body Heat On? once the verification is done."
"gblS_swAllSwitch_Label_Text" value  = "Big Mac Body Heat On?"
vV_Flow = 111
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 709
wait "gblV_Brew_Status" value == 710
endif
[Verify_Radiator]
if vB_Radiator_Using == true
"gblS_Brewery_Top_2" value  = "Verify that the Radiator Body Heater is on. The Green Pump should also be On. Click Radiator Body Heat On? once the verification is done."
"gblS_swAllSwitch_Label_Text" value  = "Radiator Body Heat On?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 711
wait "gblV_Brew_Status" value == 712
endif
if vB_Radiator_Using == true
"gblS_Brewery_Top_2" value  = "You may want to manually start the RIMs Element."
"gblS_swAllSwitch_Label_Text" value  = "RIMs Tickler?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 710
wait "gblV_Brew_Status" value == 711
endif
[Verify_Brewzilla]
if vB_Brewzilla_Using == true
"gblS_Brewery_Top_2" value  = "Verify that the Brewzilla is on. The Brewzilla Pump may need to be turned On . Click Brewzilla Heat On? once the verification is done."
"gblS_swAllSwitch_Label_Text" value  = "Brewzilla On?"
vV_Flow = 100
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 713
wait "gblV_Brew_Status" value == 714
endif
if vV_Flow == 100
"gblS_Brewery_Top_2" value  = "Verify that the Brewzilla Pump is on. The external Hoses need to be set up and the Brewzilla Recycing to itself. Click Brewzilla Pump On? once the verification is done."
"gblS_swAllSwitch_Label_Text" value  = "Brewzilla Pump On?"
vV_Flow = 100
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 715
wait "gblV_Brew_Status" value == 716
endif
[Start_Brew_Kettle_Burner]
if vB_BrewKettle_Using == true
"gblS_Brewery_Top_2" value  = "Manually start the Brew Kettle Burner. Click Brew Kettle Burner? once the burner is lit.  Remember YOU are the Safety and Control."
"gblS_swAllSwitch_Label_Text" value  = "Brew Kettle Burner?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 717
wait "gblV_Brew_Status" value == 718
endif
[Start_LittleMac_Burner]
if vB_LittleMac_Using == true
"gblS_Brewery_Top_2" value  = "Manually start the Little Mac Burner. Click Little Mac Burner? once the burner is lit.  Remember YOU are the Safety and Control."
"gblS_swAllSwitch_Label_Text" value  = "Little Mac Burner?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 717
wait "gblV_Brew_Status" value == 718
endif
[Ender_Start_Heaters]
"gblS_Script_Ended" value = "Ended:scrBrew0_10_2_Heaters_Runnning"
"sw_Running_Script_B" state = false
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_11_Obtain_Strike_Plus_One_Vessel"
stop "scrBrew0_10_2_Heaters_Runnning"
```

## 23. scrBrew0_11_Obtain_Strike_Plus_One_Vessel

Starts by itself: No · User can start or stop it: No · 568 lines

```text
//scrBrew0_11_Obtain_Strike_Plus_One_Vessel
//08/22/2026 17:10
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// All The Grain
"sw_Running_Script_B" state = true
// Set Testing
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Script_Started" value = "Started: scrBrew0_11_Obtain_Strike_Plus_One_Vessel" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
//...................................
//...........................................................................
"gblV_Brew_Status" value = 129
//start "inscpt_scrStopScriptManifold"
"gblS_Top_Text" value = "Get The Grain ready.  It should be milled and ready to add to the Strike Water.  Click Grain Ready? when the grain is set and ready."
"gblS_Bottom_Text" value = "The Strike Vessel(s) will need to reach the Strike Plus before adding the grain, but it should be ready to add."
"gblS_BrewName_B1" value = "Grain Milled and Ready to ADD?"
"gblS_swAllSwitch_Label_Text" value = "Grain Ready?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
new value vV_Number_Strike_Vessels
vV_Number_Strike_Vessels  = "gblV_Number_Strike_Vessels" value
if vV_Number_Strike_Vessels == 2
"gblV_Brew_Status" value = 144
goto "SectionBrew144"
endif
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vSMsg_Start
new string vS_Strike_Vessel_1
new string vS_Strike_Vessel_2
new value vV_Strike_Vessel_1
new value vV_Strike_Vessel_2
new value vV_Strike_Temp
new value vV_Mash_Temp
new value vV_Strike_Temp_Plus
new value vV_Strike_Offset
new value vV_Strike_Guage
new value vV_Strike_Source_Volume 
new value vV_Strike_Volume
new value vV_Strike_Volume_Extra
new value  vV_Desired_Volume
new bool vB_No_Auto_Temp
new bool vB_Digiboil_Strike
show workspace "B1 Brewery"
vV_Strike_Temp = "gblV_Desired_Strike" value
"gblVPrecision1" value  = vV_Strike_Temp
 vV_Strike_Temp = "gblVPrecision1" value
vV_Strike_Offset = "gblV_StrikeOffset" value
vV_Strike_Temp_Plus = vV_Strike_Temp + vV_Strike_Offset
"gblVPrecision1" value  = vV_Strike_Temp_Plus
vV_Strike_Temp_Plus = "gblVPrecision1" value
vV_Strike_Volume = "gblVStrikeVolume" value 
"gblVPrecision1" value  = vV_Strike_Temp_Plus
vV_Strike_Temp_Plus = "gblVPrecision1" value
//.................................
[One_Vessel]
"gblV_Brew_Status" value = 130
[SectionBrew129]
[SectionBrew130]
wait "gblV_Brew_Status" value == 130
vV_Strike_Vessel_1 = "gblV_Strike_Vessel_1" value
vS_Strike_Vessel_1 = "gblS_Strike_Vessel_1" value
vSMsg = " The Sole Strike Vessel is the "
vSMsg1 =  vS_Strike_Vessel_1
vSMsg = vSMsg + vSMsg1
vSMsg1 =  ".  Wait until the "
vSMsg = vSMsg + vSMsg1
vSMsg1 =  vS_Strike_Vessel_1
vSMsg = vSMsg + vSMsg1
vSMsg1 =  " reaches the Offset Temperature of  "
vSMsg = vSMsg + vSMsg1
vSMsg1 =  vV_Strike_Temp_Plus
vSMsg = vSMsg + vSMsg1
vSMsg1 =  " °F.  This will allow the Strike, once transferred, to cool to the Strike Temperature of "
vSMsg = vSMsg + vSMsg1
vSMsg1 =  vV_Strike_Temp
vSMsg = vSMsg + vSMsg1
vSMsg1 =  " °F."
vSMsg = vSMsg + vSMsg1
"gblS_Top_Text" value = vSMsg
vSMsg = " Insure the Strike Vessel ( "
vSMsg1 =  vS_Strike_Vessel_1
vSMsg = vSMsg + vSMsg1
vSMsg1 =  ")  is recycling and that the heat is on. "
vSMsg = vSMsg + vSMsg1
"gblS_Bottom_Text" value = vSMsg
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = true
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = false
//1 or None  true
"sw_Use_Bottom_1" state = true
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
"gblV_Brew_Status" value = 132
[SectionBrew131]
[SectionBrew132]
wait "gblV_Brew_Status" value == 132
//........................................
if vV_Strike_Vessel_1 == 3
vB_No_Auto_Temp = true
vSMsg2 = " You need to manually check the Temperature of the Brewzilla and Force the Strike when at Temperature plus Offset of "
vSMsg2 = vSMsg2 + vSMsg1
vSMsg1 =  vV_Strike_Temp_Plus
vSMsg2 = vSMsg2 + vSMsg1
vSMsg1 =  " °F."
vSMsg2 = vSMsg2 + vSMsg1
vSMsg3 = "Click Force Strike Plus? when the Brewzilla is at Temperature."
endif
if vV_Strike_Vessel_1 == 4
vB_No_Auto_Temp = true
vSMsg2 = " You need to manually check the Temperature of the DigiBoil and Force the Strike when at Temperature plus Offset of "
vSMsg2 = vSMsg2 + vSMsg1
vSMsg1 =  vV_Strike_Temp_Plus
vSMsg2 = vSMsg2 + vSMsg1
vSMsg1 =  " °F."
vSMsg2 = vSMsg2 + vSMsg1
vSMsg3 = "Click Force Strike Plus? when the DigiBoil is at Temperature."
endif
if vB_No_Auto_Temp == false
vSMsg2 = " An Alarm will sound when the Temperature of the "
vSMsg1 =  vS_Strike_Vessel_1
vSMsg2 = vSMsg2 + vSMsg1
vSMsg1 =  " reaches the Strike Temperature plus Offset of "
vSMsg2 = vSMsg2 + vSMsg1
vSMsg1 =  vV_Strike_Temp_Plus
vSMsg2 = vSMsg2 + vSMsg1
vSMsg1 =  " °F. "
vSMsg2 = vSMsg2 + vSMsg1
vSMsg3 = "You can click Force Strike Plus? to start the transfer.  Be aware you may be under the Mash Temperature when adding the grain!  It is MUCH easier to cool the Strike rather than heat the Mash."
endif
vSMsg = "Moinitor the Strike Vessel ("
vSMsg1 = vS_Strike_Vessel_1
vSMsg = vSMsg + vSMsg1
vSMsg1 = ") Temperature\n"
vSMsg = vSMsg + vSMsg1
vSMsg = vSMsg + vSMsg2
//.....................................................
"gblS_Brewery_Top_1" value = vSMsg
vSMsg = "Waiting for  "
vSMsg1 =  vV_Strike_Temp_Plus
vSMsg = vSMsg + vSMsg1
vSMsg1 =  " °F."
vSMsg = vSMsg + vSMsg1
"gblS_swAllSwitch_Label_Text" value = vSMsg
"gblS_Brewery_Bottom_3" value = vSMsg3
"gblS_BrewName_B1" value = "Force Strike Plus?"
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3 
"gblS_Brewery_Bottom_3" background = 3 
//Visibility
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_1" visibility = visible 
"gblS_Brewery_Bottom_3" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible 
"gblV_Brew_Status" value = 135
[Loop_Wait_Strike_Plus]
sleep 100
if vV_Strike_Vessel_1  == 1
	if "MB_58_10KRadiator_B1" value >= vV_Strike_Temp_Plus
	"gblV_Brew_Status" value = 136
	goto "Strike_Plus"
	endif
endif	
if vV_Strike_Vessel_1  == 2
	if "MB_57_10kBigMac_B1" value >= vV_Strike_Temp_Plus
	"gblV_Brew_Status" value = 136
	goto "Strike_Plus"
	endif
endif
if vV_Strike_Vessel_1  == 3
	vSMsg3 = "gblS_Brewery_Bottom_3" value
	"gblS_Brewery_Bottom_3" value = "Check Brewzilla Temperature!"
	"gblS_Brewery_Bottom_3" background = 1
	sleep 5000
	"gblS_Brewery_Bottom_3" background = 3
	"gblS_Brewery_Bottom_3" value = vSMsg3
	sleep 5000
endif	
if vV_Strike_Vessel_1  == 4
	vSMsg3 = "gblS_Brewery_Bottom_3" value
	"gblS_Brewery_Bottom_3" value = "Check DigiBoil Temperature!"
	"gblS_Brewery_Bottom_3" background = 1
	sleep 5000
	"gblS_Brewery_Bottom_3" background = 3
	"gblS_Brewery_Bottom_3" value = vSMsg3
	sleep 5000
endif
if vV_Strike_Vessel_1  == 5
	if "MB_56_10k_Little_Mac_B1" value >= vV_Strike_Temp_Plus
	"gblV_Brew_Status" value = 136
	goto "Strike_Plus"
	endif
endif
if vV_Strike_Vessel_1  == 6
	if "MB_55_10K_Brew_Kettle_B1" value >= vV_Strike_Temp_Plus
	"gblV_Brew_Status" value = 136
	goto "Strike_Plus"
	endif
endif
if "gblV_Brew_Status" value == 136
goto "Strike_Plus"
endif	
goto "Loop_Wait_Strike_Plus"
[SectionBrew133]
[SectionBrew134]
[SectionBrew135]
[SectionBrew136]
[Strike_Plus]
wait "gblV_Brew_Status" value == 136
print "@ 249 Brew Staus 136"
if vV_Strike_Vessel_1 == 1
print "@ 249 Radiator Sole Strike"
"gblV_Water_Switch_Status_Water" value = 203
vV_Strike_Source_Volume = "gblVCurrentRadiator_Volume" value
vV_Strike_Volume_Extra = vV_Strike_Source_Volume - vV_Strike_Volume
	if vV_Strike_Volume_Extra < 0
	vSMsg2 = "  The Volume of the Radiator is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons LOW.  This needs to be FIXED and HEATED prior to proceeding.  Fix it before continuing! If you add too Much, ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
	if vV_Strike_Volume_Extra == 0
	vSMsg2 = "  The Volume of the Radiator is exactly the Strike Volume. All of the Radiator will be transferred." 
	endif
	if vV_Strike_Volume_Extra > 0
	vSMsg2 = "  The Volume of the Radiator is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons extra.  ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
		vSMsg_Start = "The Volume of the Radiator is 				
		vSMsg1 = vV_Strike_Source_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons. The Strike Volume is  "
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = vV_Strike_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons.
		vSMsg_Start = vSMsg_Start + vSMsg2
		vSMsg1 = vV_Desired_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg1
print 281
	goto "End_Vessel_Tree"
endif
//....................................................
if vV_Strike_Vessel_1 == 2
"gblV_Water_Switch_Status_Water" value = 203
vV_Strike_Source_Volume = "gblVCurrentBigMac_Volume" value
vV_Strike_Volume_Extra = vV_Strike_Source_Volume - vV_Strike_Volume
	if vV_Strike_Volume_Extra < 0
	vSMsg2 = "  The Volume of the Big Mac is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons LOW.  This needs to be FIXED and HEATED prior to proceeding.  Fix it before continuing! If you add too Much, ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
	if vV_Strike_Volume_Extra == 0
	vSMsg2 = "  The Volume of the Big Mac is exactly the Strike Volume. All of the Big Mac will be transferred." 
	endif
	if vV_Strike_Volume_Extra > 0
	vSMsg2 = "  The Volume of the Big Mac is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons extra.  ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
		vSMsg_Start = "The Volume of the Big Mac is "				
		vSMsg1 = vV_Strike_Source_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons. The Strike Volume is  "
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = vV_Strike_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg2
		vSMsg1 = vV_Desired_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg1
		goto "End_Vessel_Tree"
endif
//........................................................................................
if vV_Strike_Vessel_1 == 3
print "@331 Brewzilla is Strike "
"gblV_Water_Switch_Status_Water" value = 703
vV_Strike_Source_Volume = "gblVCurrentBrewzilla_Volume" value
vV_Strike_Volume_Extra = vV_Strike_Source_Volume - vV_Strike_Volume
	if vV_Strike_Volume_Extra < 0
	vSMsg2 = "  The Volume of the Brewzilla is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons LOW.  This needs to be FIXED and HEATED prior to proceeding.  Fix it before continuing! If you add too Much, ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
	if vV_Strike_Volume_Extra == 0
	vSMsg2 = "  The Volume of the Brewzilla is exactly the Strike Volume. All of the Brewzilla will be transferred." 
	endif
	if vV_Strike_Volume_Extra > 0
	vSMsg2 = "  The Volume of the Brewzilla is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons extra.  ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
		vSMsg_Start = "The Volume of the Brewzilla is "				
		vSMsg1 = vV_Strike_Source_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons. The Strike Volume is  "
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = vV_Strike_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg2
		vSMsg1 = vV_Desired_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg1
		goto "End_Vessel_Tree"
endif
//.......................................................
if vV_Strike_Vessel_1 == 4
"gblV_Water_Switch_Status_Water" value = 803
vV_Strike_Source_Volume = "gblVCurrentDigiboil_Volume" value
vV_Strike_Volume_Extra = vV_Strike_Source_Volume - vV_Strike_Volume
	if vV_Strike_Volume_Extra < 0
	vSMsg2 = "  The Volume of the DigiBoil is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons LOW.  This needs to be FIXED and HEATED prior to proceeding.  Fix it before continuing! If you add too Much, ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
	if vV_Strike_Volume_Extra == 0
	vSMsg2 = "  The Volume of the DigiBoil is exactly the Strike Volume. All of the DigiBoil will be transferred." 
	endif
	if vV_Strike_Volume_Extra > 0
	vSMsg2 = "  The Volume of the DigiBoil is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons extra.  ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
		vSMsg_Start = "The Volume of the DigiBoil is "				
		vSMsg1 = vV_Strike_Source_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons. The Strike Volume is  "
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = vV_Strike_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg2
		vSMsg1 = vV_Desired_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg1
		goto "End_Vessel_Tree"
endif
//.......................................................
if vV_Strike_Vessel_1 == 5
"gblV_Water_Switch_Status_Water" value = 503
vV_Strike_Source_Volume = "gblVCurrentLittle_Volume" value
vV_Strike_Volume_Extra = vV_Strike_Source_Volume - vV_Strike_Volume
	if vV_Strike_Volume_Extra < 0
	vSMsg2 = "  The Volume of the Little Mac is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons LOW.  This needs to be FIXED and HEATED prior to proceeding.  Fix it before continuing! If you add too Much, ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
	if vV_Strike_Volume_Extra == 0
	vSMsg2 = "  The Volume of the Little Mac is exactly the Strike Volume. All of the Little Mac will be transferred." 
	endif
	if vV_Strike_Volume_Extra > 0
	vSMsg2 = "  The Volume of the Little Mac is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons extra.  ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
		vSMsg_Start = "The Volume of the Little Mac is "			
		vSMsg1 = vV_Strike_Source_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons. The Strike Volume is  "
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = vV_Strike_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg2
		vSMsg1 = vV_Desired_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg1
		goto "End_Vessel_Tree"
endif
//.......................................................
if vV_Strike_Vessel_1 == 6
"gblV_Water_Switch_Status_Water" value = 403
vV_Strike_Source_Volume = "gblVCurrentBrewKettle_Volume" value
vV_Strike_Volume_Extra = vV_Strike_Source_Volume - vV_Strike_Volume
	if vV_Strike_Volume_Extra < 0
	vSMsg2 = "  The Volume of the Brew Kettle is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons LOW.  This needs to be FIXED and HEATED prior to proceeding.  Fix it before continuing! If you add too Much, ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
	if vV_Strike_Volume_Extra == 0
	vSMsg2 = "  The Volume of the Brew Kettle is exactly the Strike Volume. All of the Brew Kettle will be transferred." 
	endif
	if vV_Strike_Volume_Extra > 0
	vSMsg2 = "  The Volume of the Brew Kettle is " 
	vSMsg1 = vV_Strike_Volume_Extra
	vSMsg2 = vSMsg2 + vSMsg1
	vSMsg1 = " gallons extra.  ONLY the Strike Volume will be transferred. "
	vSMsg2 = vSMsg2 + vSMsg1
	endif
		vSMsg_Start = "The Volume of the Brew Kettle is "				
		vSMsg1 = vV_Strike_Source_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons. The Strike Volume is  "
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = vV_Strike_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg2
		vSMsg1 = vV_Desired_Volume
		vSMsg_Start = vSMsg_Start + vSMsg1
		vSMsg1 = " gallons."
		vSMsg_Start = vSMsg_Start + vSMsg1
		goto "End_Vessel_Tree"
endif
//.........................................
//.........................................
[End_Vessel_Tree]
"gblV_Brew_Status" value = 138
[SectionBrew137]
[SectionBrew138]
wait "gblV_Brew_Status" value == 138
//............................................................................................................
"gblV_Gals_to_Fill" value = vV_Strike_Volume
vSMsg = "The Strike Gallons to Add: "
vSMsg1 = vV_Strike_Volume
vSMsg = vSMsg + vSMsg1
//......................................
vSMsg1 = " gallons.  Click Start Transfer Process? to set the Manifold and start to fill the MASH Tun with the Strike Water." 
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
//......................................
if vS_Strike_Vessel_1 == 1
vSMsg = "Any Isloation Valves and the Green Pump will open automatically to fill the MASH Tun from the Radiator."
endif
//......................................
if vS_Strike_Vessel_1 == 2
vSMsg = "Any Isloation Valves and the White Pump will open automatically to fill the MASH Tun from the Big Mac."
endif
//......................................
if vS_Strike_Vessel_1 == 3
vSMsg = "Turn off the Brewzilla Pump and Brewzilla Heaters switches. Set the hose to the Manual Valve on the South End of the Manifold and Open the valve.  You will need to manually turn on the Brewzilla Pump later."
endif
//......................................
if vS_Strike_Vessel_1 == 4
vSMsg = "Turn off the Purple Pump and DigiBoil Heater switch. Set the hose to the Manual Valve on the South End of the Manifold and Open the valve.  You will need to manually turn on the Purple Pump Pump later."
endif
//......................................
if vS_Strike_Vessel_1 == 5
vSMsg = "Any Isloation Valves and the Yellow Pump will open automatically to fill the MASH Tun from the Little Mac."
endif
//......................................
if vS_Strike_Vessel_1 == 6
vSMsg = "Any Isloation Valves and the Red Pump will open automatically to fill the MASH Tun from the Brew Kettle."
endif
//......................................
//......................................
"gblS_Brewery_Bottom_3" value = vSMsg 
//..........................................................
"gblS_swAllSwitch_Label_Text" value = "Start Transfer Process?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
// Visibility
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 139
[SectionBrew139]
[SectionBrew140]
wait "gblV_Brew_Status" value == 140
//Set Manifold
print "@ 566 start sub_scrManifold_Choice"
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew0_11_Obtain_Strike_Plus_One_Vessel @ 566  > start: sub_scrManifold_Choice"
sleep 4001
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 575 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
"gblV_Brew_Status" value = 142
[SectionBrew141]
[SectionBrew142]
wait "gblV_Brew_Status" value == 142
goto "End_scrBrew0_11_One_Vessel"
[SectionBrew143]
[SectionBrew144]
wait "gblV_Brew_Status" value == 144
[End_scrBrew0_11_One_Vessel]
if vB_Testing == true
"gblS_Script_Ended" value = "Ended: scrBrew0_11_Obtain_Strike_Plus_One_Vessel"
sleep 4001
endif
clear
start "scrBrew0_11_Obtain_Strike_Plus_Two_Vessels"
"sw_Running_Script_B" state = false
stop "scrBrew0_11_Obtain_Strike_Plus_One_Vessel"
```

## 24. scrBrew0_11_Obtain_Strike_Plus_Two_Vessels

Starts by itself: No · User can start or stop it: No · 82 lines

```text
//scrBrew0_11_Obtain_Strike_Plus_Two_Vessel
//08/22/2026 17:10
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// All The Grain
// Set Testing
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Script_Started" value = "Started: scrBrew0_11_Obtain_Strike_Plus_Two_Vessell" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
//...................................
//...........................................................................
new value vV_Number_Strike_Vessels
vV_Number_Strike_Vessels  = "gblV_Number_Strike_Vessels" value
if vV_Number_Strike_Vessels == 1
goto "End_scrBrew0_11_Two_Vessesl"
endif
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vS_Strike_Vessel_1
new string vS_Strike_Vessel_2
new value vV_Strike_Vessel_1
new value vV_Strike_Vessel_2
new value vV_Strike_Temp
new value vV_Mash_Temp
new value vV_Strike_Temp_Plus
new value vV_Strike_Offset
new value vV_Strike_Guage
new value vV_Strike_Source_Volume 
new value vV_Strike_Volume
new value vV_Strike_Volume_Half
new value vV_Strike_Volume_Extra
new bool vB_No_Auto_Temp
new bool vB_Digiboil_Strike
show workspace "B1 Brewery"
vV_Strike_Temp = "gblV_Desired_Strike" value
"gblVPrecision1" value  = vV_Strike_Temp
 vV_Strike_Temp = "gblVPrecision1" value
vV_Strike_Offset = "gblV_StrikeOffset" value
vV_Strike_Temp_Plus = vV_Strike_Temp + vV_Strike_Offset
"gblVPrecision1" value  = vV_Strike_Temp_Plus
vV_Strike_Temp_Plus = "gblVPrecision1" value
vV_Strike_Volume = "gblVStrikeVolume" value 
"gblVPrecision1" value  = vV_Strike_Temp_Plus
vV_Strike_Temp_Plus = "gblVPrecision1" value
vV_Strike_Volume_Half = vV_Strike_Volume / 2
vV_Strike_Volume_Half = vV_Strike_Volume_Half + .05
"gblVPrecision1" value =  vV_Strike_Volume_Half
vV_Strike_Volume_Half = "gblVPrecision1" value
//.................................
[First_Vessel]
"gblV_Brew_Status" value = 130
[SectionBrew129]
[SectionBrew130]
[SectionBrew197]
[SectionBrew198]
wait "gblV_Brew_Status" value == 198
[End_scrBrew0_11_Two_Vessesl]
"gblS_Script_Ended" value = "Ended: scrBrew0_11_Obtain_Strike_Plus_Two_Vessels"
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew0_12_Add_Grain"
stop "scrBrew0_11_Obtain_Strike_Plus_One_Vessel"
```

## 25. scrBrew0_12_Add_Grain

Starts by itself: No · User can start or stop it: Yes · 311 lines

```text
//scrBrew0_12_Add_Grain
//08/22/2026 17:10
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// All The Grain
"sw_Running_Script_B" state = true
// Set Testing
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Script_Started" value = "Started: scrBrew0_12_Add_Grain" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
//...................................
//...........................................................................
new value vV_Number_Strike_Vessels
vV_Number_Strike_Vessels  = "gblV_Number_Strike_Vessels" value
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vS_Strike_Vessel_1
new string vS_Strike_Vessel_2
new value vV_Strike_Vessel_1
new value vV_Strike_Vessel_2
new value vV_Strike_Temp
 vV_Strike_Temp precision = 1
new value vV_Mash_Temp
vV_Mash_Temp  precision = 1
new value vV_Strike_Temp_Plus
vV_Strike_Temp_Plus precision = 1
new value vV_Strike_Offset
new value vV_Strike_Guage
new value vV_Strike_Source_Volume 
vV_Strike_Source_Volume precision = 1
new value vV_Strike_Volume
vV_Strike_Volume precision = 1
new value vV_Strike_Volume_Extra
vV_Strike_Volume_Extra precision = 1
new bool vB_No_Auto_Temp
new bool vB_Digiboil_Strike
show workspace "B1 Brewery"
vV_Strike_Temp = "gblV_Desired_Strike" value
"gblVPrecision1" value  = vV_Strike_Temp
 vV_Strike_Temp = "gblVPrecision1" value
vV_Strike_Offset = "gblV_StrikeOffset" value
vV_Strike_Temp_Plus = vV_Strike_Temp + vV_Strike_Offset
"gblVPrecision1" value  = vV_Strike_Temp_Plus
vV_Strike_Temp_Plus = "gblVPrecision1" value
vV_Strike_Volume = "gblVStrikeVolume" value 
"gblVPrecision1" value  = vV_Strike_Temp_Plus
vV_Strike_Temp_Plus = "gblVPrecision1" value
"gblV_Brew_Status" value = 150
[SectionBrew149]
[SectionBrew150]
wait "gblV_Brew_Status" value == 150
"gblV_Brew_Status" value = 151
"gblV_Water_Switch_Status_Water" value = 303
vSMsg = "All of the Strike should be in the MASH Tun and above the Strike Temperature of "
vSMsg1 = vV_Strike_Temp
vSMsg = vSMsg + vSMsg1
vSMsg1 = "°F. The first thing to do is set up the HERMs cycle.   Click Set HERMs? to set the manifold to recycle the Strike (later WORT) through the Chillzaiia HERMS coil."
vSMsg = vSMsg + vSMsg1
//........................
"gblS_Top_Text" value = vSMsg 
"gblS_Bottom_Text" value = "The Strike can recycle through the HERMs Coil while it is cooling.  Very SMALL Amounts (1/2 cup at a Time Maximum) may be added to cool the Strike.  It is MUCH easier to cool the Strike and almost impossible to easily heat the strike once in the Mash Tun."
"gblS_BrewName_B1" value = "Start HERMs"
"gblS_swAllSwitch_Label_Text" value = "Set HERMs?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 152
start "sub_2_scrPrimeandBasicManifold"
sleep 100
wait "sw_Running_Prime_Basic" state == false
"gblS_Script_Started" value = "Continue: scrBrew0_12_Add_Grain" 
[SectionBrew151]
[SectionBrew152]
wait "gblV_Brew_Status" value == 152
"gblV_Water_Switch_Status_Water" value = 202
"gblV_Brew_Status" value = 153
vSMsg = "The HERMs Bath Needs to Be Started again. Click Set HERMs Bath? to set the manifold to recycle the HERMs through the Chillzaiia HERMS coil "
//........................
"gblS_Top_Text" value = vSMsg 
"gblS_Bottom_Text" value = "The Strike can recycle through the HERMs Coil while it is cooling.  Very SMALL Amounts (1/2 cup at a Time Maximum) may be added to cool the Strike.  It is MUCH easier to cool the Strike and almost impossible to easily heat the strike once in the Mash Tun."
"gblS_BrewName_B1" value = "Start HERMs"
"gblS_swAllSwitch_Label_Text" value = "Set HERMs Bath?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
start "sub_2_scrPrimeandBasicManifold"
sleep 100
wait "sw_Running_Prime_Basic" state == false
"gblV_Brew_Status" value = 154
[SectionBrew153]
[SectionBrew154]
wait "gblV_Brew_Status" value == 154
"gblS_Script_Started" value = "Continue: scrBrew0_12_Add_Grain"
vSMsg = "Turn on the Radiator Body Element and the Radiator RIMs Element.  Click Radiator Heaters? when ready."
//........................
"gblS_Top_Text" value = vSMsg 
"gblS_Bottom_Text" value = "The Strike can recycle through the HERMs Coil while it is cooling.  Very SMALL Amounts (1/2 cup at a Time Maximum) may be added to cool the Strike.  It is MUCH easier to cool the Strike and almost impossible to easily heat the strike once in the Mash Tun."
"gblS_BrewName_B1" value = "Start HERMs"
"gblS_swAllSwitch_Label_Text" value = "Radiator Heaters?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 156
[SectionBrew155]
[SectionBrew156]
wait "gblV_Brew_Status" value == 156
"MB_34_do_GreenPump_B1" state = true
"sw_Control_Radiator_Element" state = true
sleep 4001
"sw_Control_RIMs_Element" state = true
sleep 4001
"gblV_Brew_Status" value = 158
[SectionBrew157]
[SectionBrew158]
wait "gblV_Brew_Status" value == 158
vSMsg = "Moinitor the MASH Tun Temperature.\n"  
vSMsg = "Waiting for  "
vSMsg1 =  vV_Strike_Temp
vSMsg = vSMsg + vSMsg1
vSMsg1 =  " °F."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = vSMsg
"gblS_Brewery_Bottom_3" value = vSMsg3
"gblS_BrewName_B1" value = "Force Strike?"
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3 
"gblS_Brewery_Bottom_3" background = 3 
//Visibility
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_1" visibility = visible 
"gblS_Brewery_Bottom_3" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible 
"gblV_Brew_Status" value = 159
[Loop_Wait_Strike]
sleep 100
	if "MB_58_10KRadiator_B1" value <= vV_Strike_Temp
	"gblV_Brew_Status" value = 160
	goto "Add Grain"
	endif
	if "gblV_Brew_Status" value == 160
	goto "Add Grain"
	endif
goto "Loop_Wait_Strike"
[SectionBrew159]
[SectionBrew160]
[Add Grain]
wait "gblV_Brew_Status" value == 160
"MB_33_do_BluePump_B1" state = false
//........................
"gblS_Top_Text" value = "The Grain needs to be added slowly.  Add, Stir, Add, Stir... until all the Grain is added. Click Grain Added? when done."
"gblS_Bottom_Text" value = "Stir in the Grain with the Mash Paddle.  Avoid Grain Balls by going slow."
"gblS_BrewName_B1" value = "Stir in all the Grain."
"gblS_swAllSwitch_Label_Text" value = "Grain Added?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 162
[SectionBrew161]
[SectionBrew162]
wait "gblV_Brew_Status" value == 162
//........................
"gblS_Top_Text" value = "Set the Blue Pump Assembly for Vorluft.  Click Vorluft Set? when ready."
"gblS_Bottom_Text" value = "Set the Manifold to Set the Grain Bed."
"gblS_BrewName_B1" value = "Set to Vorluft."
"gblS_swAllSwitch_Label_Text" value = "Vorluft Set?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 164
[SectionBrew163]
[SectionBrew164]
wait "gblV_Brew_Status" value == 164
"MB_33_do_BluePump_B1" state = true
"gblS_Top_Text" value =  "Vorlufting for 45 seconds.  Wait. Will Auto Advance."
// 45 Second Delay
"gblV_Delay_Seconds" value = 45
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
"MB_33_do_BluePump_B1" state = false
"gblV_Brew_Status" value = 166
[SectionBrew165]
[SectionBrew166]
wait "gblV_Brew_Status" value == 166
//........................
"gblS_Top_Text" value = "Set the Blue Pump Assembly for Mashing HERMs.  Click Blue Pump? when ready."
"gblS_Bottom_Text" value = "Set the Manifold to Recyle the WORT through the Chillzilla."
"gblS_BrewName_B1" value = "Set for Mashing HERMs"
"gblS_swAllSwitch_Label_Text" value = "Blue Pump?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 168
[SectionBrew167]
[SectionBrew168]
wait "gblV_Brew_Status" value == 168
"MB_33_do_BluePump_B1" state = true
goto "SectionBrew198"
[SectionBrew169]
[SectionBrew170]
wait "gblV_Brew_Status" value == 170
"gblV_Brew_Status" value = 172
[SectionBrew171]
[SectionBrew172]
wait "gblV_Brew_Status" value == 172
"gblV_Brew_Status" value = 177
[SectionBrew177]
[SectionBrew177]
wait "gblV_Brew_Status" value == 177
"gblV_Brew_Status" value = 177
[SectionBrew177]
[SectionBrew177]
wait "gblV_Brew_Status" value == 177
"gblV_Brew_Status" value = 179
[SectionBrew177]
[SectionBrew179]
wait "gblV_Brew_Status" value == 179
"gblV_Brew_Status" value = 180
[SectionBrew179]
[SectionBrew180]
wait "gblV_Brew_Status" value == 180
wait "gblV_Brew_Status" value == 180
"gblV_Brew_Status" value = 182
[SectionBrew181]
[SectionBrew182]
wait "gblV_Brew_Status" value == 182
"gblV_Brew_Status" value = 188
[SectionBrew188]
[SectionBrew188]
wait "gblV_Brew_Status" value == 188
"gblV_Brew_Status" value = 188
[SectionBrew188]
[SectionBrew188]
wait "gblV_Brew_Status" value == 188
"gblV_Brew_Status" value = 189
[SectionBrew188]
[SectionBrew189]
wait "gblV_Brew_Status" value == 189
"gblV_Brew_Status" value = 190
[SectionBrew189]
[SectionBrew190]
wait "gblV_Brew_Status" value == 190
"gblV_Brew_Status" value = 192
[SectionBrew191]
[SectionBrew192]
wait "gblV_Brew_Status" value == 192
"gblV_Brew_Status" value = 194
[SectionBrew193]
[SectionBrew194]
wait "gblV_Brew_Status" value == 194
"gblV_Brew_Status" value = 196
[SectionBrew195]
[SectionBrew196]
wait "gblV_Brew_Status" value == 196
"gblV_Brew_Status" value = 198
[SectionBrew197]
[SectionBrew198]
"gblV_Brew_Status" value = 198
[SectionBrew197]
[SectionBrew198]
wait "gblV_Brew_Status" value == 198
[End_scrBrew0_11_Two_Vessesl]
"gblS_Script_Ended" value = "Ended:  scrBrew0_12_Add_Grain"
"sw_Running_Script_B" state = false
if vB_Testing == true
sleep 4001
endif
clear
start "scrBrew200_Mashing"
stop "scrBrew0_12_Add_Grain"
```

## 26. scrBrew200_Mashing

Starts by itself: No · User can start or stop it: Yes · 255 lines

```text
//scrBrew200_Mashing
//08/17/2023 08:43
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Set Testing
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
"gblS_Script_Started" value = "Started: scrBrew200_Mashing" 
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
"sw_Status_Strike" state = false
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait!"
"gblS_swAllSwitch_Label_Text" visibility = visible
stop "looper_scrDeltaStrike"
"gblV_DeltaP1_B1" visibility = hidden
"tmRadiator_B1"  visibility = hidden
"tmBigMac_B1" visibility = hidden
"tmBottomRight_B1" visibility = hidden
start "inscpt_scrBasicStart"
new value vVStrike
new value vVStrikeHalf
new string vSMsg
new string vSMsg1
new value vVMash_Step_Number
new value vV_Desired_MASH_Temperature
new value vV_HERMs_Offset
new value vV_Intial_HERMs_SetPoint

new value vV_Manifold_Status
new value vVBrewStatus
vVMash_Step_Number precision = 0
new time vTMash_1_Drop
new time vTMash_2_Drop
new time vTMash_3_Drop
new time vTMash_1
new time vTMash_2
new time vTMash_3
new time vTMash_TTL
vTMash_TTL = "gblT_TTL_Mash_Time_R1"  value
vTMash_1 = "gblT_1_Mash_Time_R1"  value
vTMash_2 = "gblT_2_Mash_Time_R1"  value
vTMash_3 = "gblT_3_Mash_Time_R1"  value
vTMash_1_Drop = vTMash_TTL -  vTMash_1
vTMash_2_Drop = vTMash_1_Drop -  vTMash_2
vTMash_3_Drop = vTMash_2_Drop  -   vTMash_3
if  vTMash_2 == 00:00:00
if  vTMash_3 ==  00:00:00
vVMash_Step_Number = 1
endif
endif
if  vTMash_2 > 00:00:00
if  vTMash_3 == 00:00:00
vVMash_Step_Number = 2
endif
endif
if  vTMash_2  >  00:00:00
if  vTMash_3  >  00:00:00
vVMash_Step_Number = 3
endif
endif
print  vVMash_Step_Number
"sw_Advance_Overide" visibility = hidden
"gblVEndlessLoop" value = 0
vV_Desired_MASH_Temperature = "gblV_Mash_1_Temp" value
vV_Intial_HERMs_SetPoint = vV_Desired_MASH_Temperature + 2
vVBrewStatus = 200
"gblV_Brew_Status" value = vVBrewStatus
goto "SectionBrew200"
[SectionBrew200]
wait "gblV_Brew_Status" value == 200
"gblV_RadiatorSetPoint_P1_B1" value  = vV_Intial_HERMs_SetPoint
if vB_Testing == true
"gblS_Brewery_Top_2" value = "Test mode is set to 1 which means we are Testing.  Since the MASH is a Timed Script, The MASH Timer will be reset to go through the MASH Profile at an accelerated Rate. Click Message Read? when ready"
"gblS_swAllSwitch_Label_Text" value = "Message Read?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//BackGrounds
"gblS_Brewery_Top_2" background = 2
"gblS_Brewery_Bottom_3" background = 1
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible 
"gblV_Brew_Status" value = 201
else
"gblV_Brew_Status" value = 202
endif
[SectionBrew201]
[SectionBrew202]
wait "gblV_Brew_Status" value == 202
//Start the Mash Data Exchange update Mash Temp for csv.
start "sub_scrDataExchangeMash"
vSMsg1 = "You need to start the Mash Temperature Node Red Flow if you want to record the Mash Temperature every Minute.  Click Flows and CSV Set? to advance after you have started the flow. "
"gblS_Brewery_Top_3" value = vSMsg1 
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" value = "You should also check that the csv file has been renamed.  These are you only warnings." 
"gblS_swAllSwitch_Label_Text" value = "Flows and CSV Set?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//BackGrounds
"gblS_Brewery_Top_2" background = 2
"gblS_Brewery_Bottom_3" background = 1
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
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible 
"gblV_Brew_Status" value = 203
[SectionBrew203]
[SectionBrew204]
wait "gblV_Brew_Status" value == 204
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Top_3" value = "Wait!  Will Auto Advance."
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance."
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//BackGrounds
"gblS_Brewery_Bottom_3" background = 3
//Switch
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
if vVMash_Step_Number == 1
clear
start "scrBrew200_1_Step_Mash"
goto "enderscrBrew"
endif
if vVMash_Step_Number == 2
clear
start "scrBrew200_2_Step_Mash"
goto "enderscrBrew"
endif
if vVMash_Step_Number == 3
clear
start "scrBrew200_3_Step_Mash"
goto "enderscrBrew"
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew205]
[SectionBrew206]
[SectionBrew207]
[SectionBrew208]

[SectionBrew239]
[SectionBrew240]
[SectionBrew241]
[SectionBrew242]
[SectionBrew243]
[SectionBrew268]
[SectionBrew269]
[SectionBrew270]
[SectionBrew271]
[SectionBrew272]
[SectionBrew273]
[SectionBrew274]
[SectionBrew275]
[SectionBrew276]
[SectionBrew277]
[SectionBrew278]
[SectionBrew279]
[SectionBrew281]
[SectionBrew282]
[SectionBrew283]
[SectionBrew284]
[SectionBrew285]
[SectionBrew286]
[SectionBrew287]
[SectionBrew288]
[SectionBrew289]
[SectionBrew290]
[SectionBrew291]
[SectionBrew292]
[SectionBrew293]
[SectionBrew294]
[SectionBrew295]
[SectionBrew296]
[SectionBrew297]
[SectionBrew298]
[SectionBrew299]
[SectionBrew300]
[enderscrBrew]
// cleared above
"gblS_Script_Ended" value = "Ended: scrBrew200_Mashing"
if vB_Testing == true
sleep 4001
endif
clear
stop "scrBrew200_Mashing"
```

## 27. scrBrew200_1_Step_Mash

Starts by itself: No · User can start or stop it: No · 1103 lines

```text
//scrBrew200_1_Step_Mash
//08/14/2023 20:03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Modified 04/26/2024 18:02
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
"gblS_Script_Started" value = "Started: scrBrew200_1_Step_Mash" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
new value vVStrike
new value vVStrikeHalf
new string vSMsg
new string vSMsg1
new string vS_Msg_Calc 
new string vS_Msg_Calc_1 
new value vVCalc1
new value vVCalc2
new time vTMash_1
new time vTMash_2
new time vTMash_3
new string vS_TTL_Time
new time vTMash_TTL
new value vVMash_Step_Number
new value vV_GallonstoXFER
new value vVCurrent_BigMac_Volume
new value vVDesired_BigMac_Volume
new value vV_Start_BigMac_Volume
new value vVFill_Volume
new value vVFill_Volume_Min
vVMash_Step_Number precision = 0
new time vTMash_1_Drop
new time vTMash_2_Drop
new time vTMash_3_Drop
new value vVMashTemp
new value vVMashTempPlus
new value vV_Vessel_Start
new value vV_Vessel_End
new value vV_Vessel_Delta
new value vV_Gal_to_Fill
new time  vT_Total_Time
new value vVRate_Orginal
new value vVRate_Calc
new value vVRate_Delta
new value vV_Elasped
vVMashTemp =  "gblV_Mash_1_Temp" value
vVMashTempPlus = vVMashTemp + 2
vTMash_TTL = "gblT_TTL_Mash_Time_R1" value
vTMash_1 = "gblT_1_Mash_Time_R1" value
vTMash_2 = "gblT_2_Mash_Time_R1" value
vTMash_3 = "gblT_3_Mash_Time_R1" value
vTMash_1_Drop = vTMash_TTL -  vTMash_1
vTMash_2_Drop = vTMash_1_Drop -  vTMash_2
vTMash_3_Drop = vTMash_2_Drop  -   vTMash_3
if  vTMash_2 == 00:00:00
if  vTMash_3 ==  00:00:00
vVMash_Step_Number = 1
endif
endif
if  vTMash_2 > 00:00:00
if  vTMash_3 == 00:00:00
vVMash_Step_Number = 2
endif
endif
if  vTMash_2  >  00:00:00
if  vTMash_3  >  00:00:00
vVMash_Step_Number = 3
endif
endif
print  vVMash_Step_Number
new value vV_Manifold_Status
new value vVBrewStatus
// Set Testing
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
vV_Start_BigMac_Volume =  "gblVCurrentBigMac_Volume" value
vVDesired_BigMac_Volume = "gblV_Refill_Big_Mac_Mash" value
vVFill_Volume = vVDesired_BigMac_Volume - vVCurrent_BigMac_Volume
start "inscpt_scrAlarm"
sleep 4001
"tmTopRight_B1" displayname = "Mash Tmer"
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
vVBrewStatus = 200
"gblV_Brew_Status" value = vVBrewStatus
goto "SectionBrew200"
[SectionBrew200]
show workspace "B1 Brewery"
wait "gblV_Brew_Status" value == 200
vSMsg = "Starting Mash Timer and HERMs.  The Mash is "
vSMsg1 = vTMASH_1
vSMsg = vSMsg + vSMsg1
vSMsg1 = " long.  Will Auto Advance"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_Brewery_Bottom_3" value = "Starting Mashing" 
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Auto Advance"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
sleep 3000
"gblV_Brew_Status" value =  204
[SectionBrew201]
[SectionBrew202]
[SectionBrew203]
[SectionBrew204]
wait "gblV_Brew_Status" value == 204
"gblS_Brewery_Top_2" visibility = hidden
"MB_33_do_BluePump_B1" state = true
vSMsg = " This is a Single Step mash.  This Mash will be  "
vSMsg1 = vTMASH_1
vSMsg = vSMsg + vSMsg1
vSMsg1 = " long. The Desired Mash Temperature is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vVMashTemp
vSMsg = vSMsg + vSMsg1

vSMsg1 = "°F.  Moinitor the Temperatures.  Adjust the Radiator Temperature by adding small amount of cool water to get to the target "
vSMsg = vSMsg + vSMsg1
vSMsg1 = "gblV_RadiatorSetPoint_P1_B1" value 
vSMsg = vSMsg + vSMsg1
vSMsg1 = " °F!"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Bottom_3" value = vSMsg 
stop "tmTopRight_B1"
stop "tm_Action_BottomRight_B1"
stop "tm_Mash Timer_Water"
"tmTopRight_B1" type = countdown
"tm_Action_BottomRight_B1" type = countdown
"tmTopRight_B1" displayname = "Mash Timer"
"tm_Action_BottomRight_B1" displayname = "Mash Timer"
"tmTopRight_B1" value = "gblT_TTL_Mash_Time_R1" value
"tmTopRight_B1" visibility = visible
start "tmTopRight_B1" 
start "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" value = "tmTopRight_B1" value
"tm_Action_BottomRight_B1" visibility = visible
"tm_Mash Timer_Water" type = countdown
"tm_Mash Timer_Water" displayname = "Mash Timer"
"tm_Mash Timer_Water" visibility = visible
"tm_Mash Timer_Water" value = "tmTopRight_B1" value
start "tm_Mash Timer_Water"
"tm_Mash Timer_Water" visibility = visible
"RP_v_StartMashTemp_Temp" value = "MB_60_10K_MLT_Out_B1" value
//
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmTopRight_B1" visibility = visible
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
sleep 5000
"gblT_SetTimer" Value = 01:28:05
if vB_Testing == true
"sw_Advance_Timer" state = true
endif
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
wait "tmTopRight_B1" value  <= 01:28:00
"gblV_Brew_Status" value =  206
[SectionBrew205]
[SectionBrew206]
wait "gblV_Brew_Status" value == 206
if  "gblV_Group_Hops_Mash"  value == 1
show workspace  "Alarms"
vSMsg =  "Place Top of Mash Hops on the surface of the Grain Bed: "
vSMsg1 =  "gblS_Hops_Mash" value 
vSMsg = vSMsg + vSMsg1
"gblS_HopMessage_ALARM"  value = vSMsg
"gblS_HopMessage_ALARM" displayname = "Place Top of Mash Hops"
"gblS_HopMessage_ALARM" visibility = visible
"gblS_HopMessage_ALARM" background = 1
"alm_Extra_Hops" displayname = "Place Top of Mash Hops"
"alm_Extra_Hops" fileindex = 1
"alm_Extra_Hops" active = true
"alm_Extra_Hops"  visibility = visible
"gblS_HopMessage_ALARM"  visibility = visible
wait   "alm_Extra_Hops"  active ==  false
start "inscpt_scrAlarm"
"gblV_Brew_Status" value =  207
else
"gblV_Brew_Status" value =  207
endif
[SectionBrew207]
wait "gblV_Brew_Status" value == 207
"gblV_Brew_Status" value =  208
[SectionBrew208]
if vV_Start_BigMac_Volume >= 35
"gblS_Top_Text" value = "Check that the Big Mac Heater is on.  It will be used for Sparging Later.  Wait! Will Auto Advance."
"gblS_Top_Text"  background = 1
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
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
"gblS_Top_Text"  background = 3
"gblV_Brew_Status" value = 224
goto "SectionBrew224"
endif
wait "gblV_Brew_Status" value == 208
if vV_Start_BigMac_Volume < 35
vVFill_Volume_Min = vVDesired_BigMac_Volume
vVFill_Volume = vVDesired_BigMac_Volume - vV_Start_BigMac_Volume
"gblV_Gals_to_Fill" value = vVFill_Volume	
endif
vSMsg = " The Big Mac needs to be filled with "
vSMsg1 = vVFill_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons of Tap Water.  Click Set Manifold? when ready. This will set the manifold to refill the Big Mac." 
vSMsg = vSMsg + vSMsg1
//........................
"gblS_Top_Text" value = vSMsg
"gblS_Bottom_Text" value = "Mashing!  Monitor the Temperatures"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
[SectionBrew209]
wait "gblV_Brew_Status" value == 209
vVBrewStatus = 209
"gblV_Water_Switch_Status_Water" value = 1
"gblV_Valve_Status" value = 1000
start "sub_scrManifold_Choice"
sleep 100
wait "sw_Running_Manifold_Choice" state == false
sleep 100
wait "sw_Running_Calculate_SPG" state == true
sleep 100
wait "sw_Running_Calculate_SPG" state == false
sleep 100
"gblS_Script_Started" value = "Running: @ 281 scrBrew200_1_Step_Mash" 
"gblV_Brew_Status" value = 218
goto "SectionBrew218"

[Skip_Valve_269]
"gblS_Brewery_Top_3"  background = 3
"gblS_Brewery_Top_3" value = "Wait! Will Auto Advance"
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait!"
"insp_Pix_ArrowAllSwitch_B1" background = 3
vVFill_Volume = vVDesired_BigMac_Volume - vV_Start_BigMac_Volume
"gblV_Gals_to_Fill" value = vVFill_Volume
vSMsg = "Manifold is set.  The Big Mac will be filled with "
vSMsg1 = vVFill_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  This water will be used for additional MASH Water, Topping Off Water, and Cleaning.  It will be refilled thru out the Brew Day.  Click Fill Big Mac? to advance."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
if vVFill_Volume_Min == vVFill_Volume
vSMsg = "After filling the Big Mac, the Measured Volume should be "
vSMsg1 = vVFill_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  Desired Volume is "
vSMsg = vSMsg + vSMsg1
else
vSMsg = "After filling the Big Mac, the Measured Volume should be at least "
vSMsg1 = vVFill_Volume_Min
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  Desired Volume is "
vSMsg = vSMsg + vSMsg1
endif
vSMsg1 = vVDesired_BigMac_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = "  gallons.  It can be more, but not over flowing!"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Bottom_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Fill Big Mac?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_Brewery_Top_3"  background = 1
"gblS_Brewery_Bottom_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 209
[SectionBrew210]
wait "gblV_Brew_Status" value == 210
vVBrewStatus = 210
print "@ 322 Filling Big Mac?"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
vSMsg = "The Big Mac holds all the reserved hot water. Fill Time will be calculated. Measure the Big Mac by the Volume Marks on the inside of the vessel."
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance."
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//Short Delay
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Short Delay"
"tmBottomRight_B1" value = 00:00:04
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
// Set Fill Paramters
"gblVStartBrew" value = 218
"gblV_Rate" value = "gblV_SPG_ManifoldFill_BigMac" value
"gblV_SPG_Calculated" value = 0
"gblV_SPG_Delta_Rate" value = 0
"gblV_Vessel_From" value = 100
"gblV_Vessel_To" value = 1 
"gblV_Vessel_Measure"  value = 1
"glbV_Vessel_Adjust" value = 0
"gblV_Pump" value = 100
"gblV_Isolation_Valve" value = 0
start "sub_3_scrCalculateSPG"
goto "SectionBrew216"
[SectionBrew215]
[SectionBrew216]
wait "sw_Running_Calculate_SPG" state == false
"gblV_Brew_Status" value = 218
[SectionBrew217]
[SectionBrew218]
wait "gblV_Brew_Status" value == 218
"tmBottomRight_B1" displayname = "Mash Timer"
"tmBottomRight_B1" value = "tmTopRight_B1" value
start "tmBottomRight_B1"
[Start_Big_Mac]
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value 

// Big Mac Heater Check Elements
"gblS_Brewery_Top_2" value = "Check that the Big Mac Element is covered.  Click Start Heater? to turn on the electric heater and the White Pump.  Be sure that the wall manual safety switches are on."
"gblS_Brewery_Bottom_1" value = "Check Elements of the Big Mac."
"gblS_swAllSwitch_Label_Text" value = "Start Heaters?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_2" background = 3
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_1" background = 2
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_2" visibility = Visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = Visible
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_BigMacSetPointP1_B1" value = 170
 [SectionBrew219]
wait "gblV_Brew_Status" value == 219
 vVBrewStatus = 219
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew220]
wait "gblV_Brew_Status" value == 220
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew221]
wait "gblV_Brew_Status" value == 221
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew222]
"sw_Advance_ BrewStatus" visibility = hidden 
wait "gblV_Brew_Status" value == 222
"gblS_Brewery_Top_2" visibility = hidden
"MB_32_do_WhitePump_B1" state = true
sleep 100
"sw_Control_BigMac_Element" state = true
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew223]
wait "gblV_Brew_Status" value == 223
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew224]
wait "gblV_Brew_Status" value == 224
 vVBrewStatus = 224
print "@464 SectionBrew224"
"gblS_Brewery_Bottom_3" value = "Mashing.   Monitor the Temperatures.  The Mash will end when the Mash Timer reaches 00:00:00"
"gblS_swAllSwitch_Label_Text" value = "Mashing?"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
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
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
//
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:10
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew225]
wait "gblV_Brew_Status" value == 225
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew226]
wait "gblV_Brew_Status" value == 226
"gblS_Brewery_Top_3" value =  " Wait  "
"gblS_Brewery_Bottom_3" value = "Mashing.   Monitor the Temperatures.  The Mash will end when the Mash Timer reaches 00:00:00"
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew227]
wait "gblV_Brew_Status" value == 227
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew228]
"gblS_Brewery_Top_3"  visibility = hidden
"tmBigMac_B1" visibility = hidden
"tmTopRight_B1" visibility = visible
"gblS_Brewery_Bottom_3" value = "Mashing.   Monitor the Temperatures.  The Mash will end when the Mash Timer reaches 00:00:00"
wait "gblV_Brew_Status" value == 228
"gblT_SetTimer" Value = 01:00:10
if vB_Testing == true
"sw_Advance_Timer" state = true
endif
wait "tmTopRight_B1" value  <= 01:00:01
"gblS_Brewery_Top_2" value = "One Hour Remaining for the Mash"
"gblS_Brewery_Bottom_3" value = "Mashing.   Monitor the Temperatures.  The Mash will end when the Mash Timer reaches 00:00:00"
//Visibility
"tmTopRight_B1" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Mash Timer"
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
//BackGrounds
// Black Purple Red
"gblS_Brewery_Top_2" background = 1
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
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "1 Hour Remaining"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
//
start "inscpt_scrAlarm"
sleep 4001
"alm_Beep" active = true
"tm_HiddenDefault_AlarmWS" value = 00:00:00
start "tm_HiddenDefault_AlarmWS"
wait "tm_HiddenDefault_AlarmWS" value >= 00:00:03
"alm_Beep" active = false
wait "tmTopRight_B1" value  <= 00:59:45
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Mashing"
"tmTopRight_B1" visibility = visible
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"alm_Hidden4_ALARM" fileindex = 1
start "inscpt_scrAlarm"
sleep 4001
"alm_Hidden4_ALARM" active = true
"gblT_SetTimer" Value = 00:57:05
if vB_Testing == true
"sw_Advance_Timer" state = true
endif

wait "tmTopRight_B1" value  <= 00:56:55
"alm_Hidden4_ALARM" active = false
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew229]
wait "gblV_Brew_Status" value == 229
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew230]
wait "gblV_Brew_Status" value == 230
"gblT_SetTimer" Value = 00:45:05
if vB_Testing == true
"sw_Advance_Timer" state = true
endif
wait "tmTopRight_B1" value  <= 00:45:00
"RP_v_MidMash_Temp" value = "MB_60_10K_MLT_Out_B1" value
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew231]
wait "gblV_Brew_Status" value == 231
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew232]
wait "gblV_Brew_Status" value == 232
"gblT_SetTimer" Value = 00:30:10
if vB_Testing == true
"sw_Advance_Timer" state = true
endif
wait "tmTopRight_B1" value  <= 00:30:01
"gblS_Brewery_Top_2" value = "30 Remaining for the Mash"
"gblS_Brewery_Bottom_3" value = "Mashing.   Monitor the Temperatures.  The Mash will end when the Mash Timer reaches 00:00:00"
//Visibility
"tmTopRight_B1" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Mash Timer"
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
//BackGrounds
// Black Purple Red
"gblS_Brewery_Top_2" background = 1
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
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "30 Minutes Remaining"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
//
start "inscpt_scrAlarm"
sleep 4001
"alm_Beep" active = true
"tm_HiddenDefault_AlarmWS" value = 00:00:00
start "tm_HiddenDefault_AlarmWS"
wait "tm_HiddenDefault_AlarmWS" value >= 00:00:03
"alm_Beep" active = false
wait "tmTopRight_B1" value  <= 00:29:45
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Mashing"
"tmTopRight_B1" visibility = visible
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew233]
wait "gblV_Brew_Status" value == 233
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew234]
wait "gblV_Brew_Status" value == 234
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew235]
wait "gblV_Brew_Status" value == 235
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew236]
wait "gblV_Brew_Status" value == 236
"gblT_SetTimer" Value = 00:15:10
if vB_Testing == true
"sw_Advance_Timer" state = true
endif

wait "tmTopRight_B1" value  <= 00:15:01
"gblS_Brewery_Top_2" value = "15 Remaining for the Mash"
"gblS_Brewery_Bottom_3" value = "Mashing.   Monitor the Temperatures.  The Mash will end when the Mash Timer reaches 00:00:00"
//Visibility
"tmTopRight_B1" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Mash Timer"
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
//BackGrounds
// Black Purple Red
"gblS_Brewery_Top_2" background = 1
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
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "15 Minutes Remaining"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
//
start "inscpt_scrAlarm"
sleep 4001
"alm_Beep" active = true
"tm_HiddenDefault_AlarmWS" value = 00:00:00
start "tm_HiddenDefault_AlarmWS"
wait "tm_HiddenDefault_AlarmWS" value >= 00:00:03
"alm_Beep" active = false
wait "tmTopRight_B1" value  <= 00:14:45
"alm_Hidden4_ALARM" active = false
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Mashing"
"tmTopRight_B1" visibility = visible
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew237]
wait "gblV_Brew_Status" value == 237
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew238]
wait "gblV_Brew_Status" value == 238
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew239]
wait "gblV_Brew_Status" value == 239
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew240]
wait "gblV_Brew_Status" value == 240
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew241]
wait "gblV_Brew_Status" value == 241
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew242]
"gblT_SetTimer" Value = 00:05:10
if vB_Testing == true
"sw_Advance_Timer" state = true
endif
wait "gblV_Brew_Status" value == 242
wait "tmTopRight_B1" value  <= 00:05:00
"gblS_Brewery_Bottom_3" background = 2
"gblS_Brewery_Bottom_3" value = "Mashing.   Monitor the Temperatures.  The Mash will end in 5 minutes when the Mash Timer reaches 00:00:00"
wait "tmTopRight_B1" value  <= 00:04:45
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Bottom_3" value = "Mashing.   Monitor the Temperatures.  The Mash will end when the Mash Timer reaches 00:00:00"
"gblT_SetTimer" Value = 00:01:08
if vB_Testing == true
"sw_Advance_Timer" state = true
endif
wait "tmTopRight_B1" value  <= 00:01:01
"gblS_Brewery_Top_2" value = "1 Minute Remaining for the Mash"
"gblS_Brewery_Bottom_1" value = "60 Seconds Left!"
"gblS_Brewery_Bottom_3" value = "Mashing.   Monitor the Temperatures.  The Mash will end when the Mash Timer reaches 00:00:00"
//Visibility
"tmTopRight_B1" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Mash Timer"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" value = "tmTopRight_B1" value
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = visible
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
//BackGrounds
// Black Purple Red
"gblS_Brewery_Top_2" background = 1
// Dark-Grey Green Blue
"gblS_Brewery_Top_3" background = 1
//Yellow Orange Lighter-Purple
"gblS_Brewery_Bottom_1" background = 1
// ygreen black red-caution
//"gblS_Brewery_Bottom_4" background = 1
//// Dark-Grey Green Blue
"gblS_Brewery_Bottom_3" background = 3
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "60 Seconds Remaining"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
//
"alm_Hidden2_ALARM" fileindex = 3
start "inscpt_scrAlarm"
sleep 4001
"alm_Hidden2_ALARM" active = true
wait "tmTopRight_B1" value  <= 00:00:50
"alm_Hidden2_ALARM" active = false
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Mashing"
"tmTopRight_B1" visibility = visible
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"RP_v_EndMash_Temp" value = "MB_60_10K_MLT_Out_B1" value
if vB_Testing == true
wait "tmTopRight_B1" value > 00:00:49
"gblT_SetTimer" value = 00:00:05
stop "tm_Hidden_1"
reset "tm_Hidden_1"
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"sw_Advance_Timer" state = true
endif
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew243]
wait "gblV_Brew_Status" value == 243
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew244]
wait "gblV_Brew_Status" value == 244
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew245]
wait "gblV_Brew_Status" value == 245
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew246]
wait "gblV_Brew_Status" value == 246
// Mash End
wait "tmTopRight_B1" value  <= 00:00:00
"MB_33_do_BluePump_B1" state = false
stop "tmTopRight_B1"
stop "tmBottomRight_B1"
stop "tm_Mash Timer_Water"
"tm_Mash Timer_Water" visibility = hidden
"alm_StrikeSpargeMash_ALARM" displayname = "End of MASH"
"alm_StrikeSpargeMash_ALARM" fileindex = 2
"alm_StrikeSpargeMash_ALARM" sound = Custom
show workspace "Alarms"
"alm_StrikeSpargeMash_ALARM" visibility = visible
"alm_StrikeSpargeMash_ALARM" active = true
wait "alm_StrikeSpargeMash_ALARM" active == false
"alm_StrikeSpargeMash_ALARM" visibility = hidden
"gblV_RadiatorSetPoint_P1_B1" value = 170
show workspace "B1 Brewery"
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew247]
wait "gblV_Brew_Status" value == 247
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew248]
wait "gblV_Brew_Status" value == 248
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew249]
wait "gblV_Brew_Status" value == 249
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew250]
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew251]
wait "gblV_Brew_Status" value == 251
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew252]
wait "gblV_Brew_Status" value == 252
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew253]
wait "gblV_Brew_Status" value == 253
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew254]
wait "gblV_Brew_Status" value == 254
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew255]
wait "gblV_Brew_Status" value == 255
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew256]
wait "gblV_Brew_Status" value == 256
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew257]
wait "gblV_Brew_Status" value == 257
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew58]
wait "gblV_Brew_Status" value == 258
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew259]
wait "gblV_Brew_Status" value == 259
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew260]
wait "gblV_Brew_Status" value == 260
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew261]
wait "gblV_Brew_Status" value == 261
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew262]
wait "gblV_Brew_Status" value == 262
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew263]
wait "gblV_Brew_Status" value == 263
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew264]
wait "gblV_Brew_Status" value == 264
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew265]
wait "gblV_Brew_Status" value == 265
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew266]
wait "gblV_Brew_Status" value == 266
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew267]
wait "gblV_Brew_Status" value == 267
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew268]
wait "gblV_Brew_Status" value == 268
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew269]
wait "gblV_Brew_Status" value == 269
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew270]
wait "gblV_Brew_Status" value == 270
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew271]
wait "gblV_Brew_Status" value == 271
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew272]
wait "gblV_Brew_Status" value == 272
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew273]
wait "gblV_Brew_Status" value == 273
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew274]
wait "gblV_Brew_Status" value == 274
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew275]
wait "gblV_Brew_Status" value == 275
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew276]
wait "gblV_Brew_Status" value == 276
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew277]
wait "gblV_Brew_Status" value == 277
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew278]
wait "gblV_Brew_Status" value == 278
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew279]
wait "gblV_Brew_Status" value == 279
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew280]
wait "gblV_Brew_Status" value == 280
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew281]
wait "gblV_Brew_Status" value == 281
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew282]
wait "gblV_Brew_Status" value == 282
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew283]
wait "gblV_Brew_Status" value == 283
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew284]
wait "gblV_Brew_Status" value == 284
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew285]
wait "gblV_Brew_Status" value == 285
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew286]
wait "gblV_Brew_Status" value == 286
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew287]
wait "gblV_Brew_Status" value == 287
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew288]
wait "gblV_Brew_Status" value == 288
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew289]
wait "gblV_Brew_Status" value == 289
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew290]
wait "gblV_Brew_Status" value == 290
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew291]
wait "gblV_Brew_Status" value == 291
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew292]
wait "gblV_Brew_Status" value == 292
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew293]
wait "gblV_Brew_Status" value == 293
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew294]
wait "gblV_Brew_Status" value == 294
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew295]
wait "gblV_Brew_Status" value == 295
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew296]
wait "gblV_Brew_Status" value == 296
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew297]
wait "gblV_Brew_Status" value == 297
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew298]
wait "gblV_Brew_Status" value == 298
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew299]
wait "gblV_Brew_Status" value == 299
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew300]
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value = "Wait! Will Auto Advance"
"gblS_Brewery_Top_3" visibility = visible
wait "gblV_Brew_Status" value == 300
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
if vB_Testing == true
"gblS_Script_Ended" value = "Ended: scrBrew200_1_Step_Mash"
sleep 4001
endif
clear
start "scrBrew300_1_First_WORT_Run"
"sw_Running_Script_B" state = false
stop "scrBrew200_1_Step_Mash"
```

## 28. scrBrew200_2_Step_Mash

Starts by itself: No · User can start or stop it: Yes · 589 lines

```text
//scrBrew200_2_Step_Mash
//08/14/2023 20:03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//
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
"gblS_Script_Started" value = "Started: scrBrew200_2_Step_Mash" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
new value vVStrike
new value vVStrikeHalf
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vSMsg4 
new time vTMash_1
new time vTMash_2
new time vTMash_3
new time vTMash_TTL
new value vVMash_Step_Number
vVMash_Step_Number precision = 0
new time vTMash_1_Drop
new time vTMash_2_Drop
new time vTMash_3_Drop
vTMash_TTL = "gblT_TTL_Mash_Time_R1"  value
vTMash_1 = "gblT_1_Mash_Time_R1"  value
vTMash_2 = "gblT_2_Mash_Time_R1"  value
vTMash_3 = "gblT_3_Mash_Time_R1"  value
vTMash_1_Drop = vTMash_TTL -  vTMash_1
vTMash_2_Drop = vTMash_1_Drop -  vTMash_2
vTMash_3_Drop = vTMash_2_Drop  -   vTMash_3
if  vTMash_2 == 00:00:00
if  vTMash_3 ==  00:00:00
vVMash_Step_Number = 1
endif
endif
if  vTMash_2 > 00:00:00
if  vTMash_3 == 00:00:00
vVMash_Step_Number = 2
endif
endif
if  vTMash_2  >  00:00:00
if  vTMash_3  >  00:00:00
vVMash_Step_Number = 3
endif
endif
print  vVMash_Step_Number
new value vV_Manifold_Status
new value vVBrewStatus
 vVBrewStatus = 22222
"gblV_Brew_Status" value = vVBrewStatus
goto "SectionBrew200"
//<><><><><><><><><><><><><><><><><><><><><><><><><
[SectionBrew200]
wait "gblV_Brew_Status" value == 200
if vVMash_Step_Number == 1
vSMsg1 = "Ready to start Mash Timer.  This is a Single Step mash.  This Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Click Start Mash Timer? to advance."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_Brewery_Bottom_3" value = "Ready to start Mashing" 
goto "Choice200"
endif
if vVMash_Step_Number == 2
vSMsg1 = "Ready to start Mash Timer.  This is a Two Step mash.  Step 1 Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Click Start Mash Timer? to advance."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_Brewery_Bottom_3" value = "Ready to start Mashing" 
goto "Choice200"
endif
if vVMash_Step_Number == 3
vSMsg1 = "Ready to start Mash Timer.  This is a Three Step mash.  Step 1 Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Click Start Mash Timer? to advance."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_Brewery_Bottom_3" value = "Ready to start Mashing" 
goto "Choice200"
endif
[Choice200]
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "Start Mash Timer?"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew201]
wait "gblV_Brew_Status" value == 201
 vVBrewStatus = 201
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew202]
wait "gblV_Brew_Status" value == 202
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew203]
wait "gblV_Brew_Status" value == 203
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew204]
wait "gblV_Brew_Status" value == 204
if vVMash_Step_Number == 1
print 1
vSMsg1 = " This is a Single Step mash.  This Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Moinitor the Temperatures."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Bottom_3" value = vSMsg 
endif
if vVMash_Step_Number == 2
print 2
vSMsg1 = "  This is a Two Step mash.  Step 1 Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Moinitor the Temperatures."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Bottom_3" value = vSMsg 
endif
if vVMash_Step_Number == 3
print 3
vSMsg1 = "Ready to start Mash Timer.  This is a Three Step mash.  Step 1 Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Moinitor the Temperatures."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Bottom_3"  value = vSMsg 
endif
stop "tmTopRight_B1"
"tmTopRight_B1" type = countdown
"tmTopRight_B1" displayname = "Mash Timer"
"tmTopRight_B1" value = "gblT_TTL_Mash_Time_R1" value
"tmTopRight_B1" visibility = visible
start "tmTopRight_B1"
stop "tmTopRight_B1"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" displayname = "Mash Timer"
"tmBottomRight_B1" visibility = hidden
"tmBottomRight_B1" value = "tmTopRight_B1" value
start "tmBottomRight_B1"
stop "tm_Mash Timer_Water"
"tm_Mash Timer_Water" type = countdown
"tm_Mash Timer_Water" displayname = "Mash Timer"
"tm_Mash Timer_Water" visibility = visible
"tm_Mash Timer_Water" value = "tmTopRight_B1" value
start "tm_Mash Timer_Water"
//
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmTopRight_B1" visibility = visible
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew205]
wait "gblV_Brew_Status" value == 205
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew206]
wait "gblV_Brew_Status" value == 206
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew207]
wait "gblV_Brew_Status" value == 207
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew208]
wait "gblV_Brew_Status" value == 208
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew209]
wait "gblV_Brew_Status" value == 209
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew210]
wait "gblV_Brew_Status" value == 210
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew211]
wait "gblV_Brew_Status" value == 211
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew212]
wait "gblV_Brew_Status" value == 212
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew213]
wait "gblV_Brew_Status" value == 213
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew214]
wait "gblV_Brew_Status" value == 214
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew215]
wait "gblV_Brew_Status" value == 215
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew216]
wait "gblV_Brew_Status" value == 216
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew217]
wait "gblV_Brew_Status" value == 217
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew218]
wait "gblV_Brew_Status" value == 218
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew219]
wait "gblV_Brew_Status" value == 219
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew220]
wait "gblV_Brew_Status" value == 220
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew221]
wait "gblV_Brew_Status" value == 221
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew222]
wait "gblV_Brew_Status" value == 222
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew223]
wait "gblV_Brew_Status" value == 223
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew224]
wait "gblV_Brew_Status" value == 224
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew225]
wait "gblV_Brew_Status" value == 225
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew226]
wait "gblV_Brew_Status" value == 226
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew227]
wait "gblV_Brew_Status" value == 227
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew228]
wait "gblV_Brew_Status" value == 228
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew229]
wait "gblV_Brew_Status" value == 229
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew230]
wait "gblV_Brew_Status" value == 230
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew231]
wait "gblV_Brew_Status" value == 231
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew232]
wait "gblV_Brew_Status" value == 232
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew233]
wait "gblV_Brew_Status" value == 233
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew234]
wait "gblV_Brew_Status" value == 234
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew235]
wait "gblV_Brew_Status" value == 235
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew236]
wait "gblV_Brew_Status" value == 236
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew237]
wait "gblV_Brew_Status" value == 237
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew238]
wait "gblV_Brew_Status" value == 238
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew239]
wait "gblV_Brew_Status" value == 239
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew240]
wait "gblV_Brew_Status" value == 240
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew241]
wait "gblV_Brew_Status" value == 241
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew242]
wait "gblV_Brew_Status" value == 242
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew243]
wait "gblV_Brew_Status" value == 243
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew244]
wait "gblV_Brew_Status" value == 244
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew245]
wait "gblV_Brew_Status" value == 245
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew246]
wait "gblV_Brew_Status" value == 246
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew247]
wait "gblV_Brew_Status" value == 247
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew248]
wait "gblV_Brew_Status" value == 248
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew249]
wait "gblV_Brew_Status" value == 249
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew250]
wait "gblV_Brew_Status" value == 250
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew251]
wait "gblV_Brew_Status" value == 251
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew252]
wait "gblV_Brew_Status" value == 252
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew253]
wait "gblV_Brew_Status" value == 253
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew254]
wait "gblV_Brew_Status" value == 254
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew255]
wait "gblV_Brew_Status" value == 255
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew256]
wait "gblV_Brew_Status" value == 256
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew257]
wait "gblV_Brew_Status" value == 257
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew58]
wait "gblV_Brew_Status" value == 258
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew259]
wait "gblV_Brew_Status" value == 259
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew260]
wait "gblV_Brew_Status" value == 260
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew261]
wait "gblV_Brew_Status" value == 261
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew262]
wait "gblV_Brew_Status" value == 262
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew263]
wait "gblV_Brew_Status" value == 263
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew264]
wait "gblV_Brew_Status" value == 264
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew265]
wait "gblV_Brew_Status" value == 265
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew266]
wait "gblV_Brew_Status" value == 266
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew267]
wait "gblV_Brew_Status" value == 267
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew268]
wait "gblV_Brew_Status" value == 268
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew269]
wait "gblV_Brew_Status" value == 269
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew270]
wait "gblV_Brew_Status" value == 270
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew271]
wait "gblV_Brew_Status" value == 271
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew272]
wait "gblV_Brew_Status" value == 272
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew273]
wait "gblV_Brew_Status" value == 273
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew274]
wait "gblV_Brew_Status" value == 274
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew275]
wait "gblV_Brew_Status" value == 275
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew276]
wait "gblV_Brew_Status" value == 276
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew277]
wait "gblV_Brew_Status" value == 277
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew278]
wait "gblV_Brew_Status" value == 278
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew279]
wait "gblV_Brew_Status" value == 279
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew280]
wait "gblV_Brew_Status" value == 280
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew281]
wait "gblV_Brew_Status" value == 281
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew282]
wait "gblV_Brew_Status" value == 282
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew283]
wait "gblV_Brew_Status" value == 283
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew284]
wait "gblV_Brew_Status" value == 284
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew285]
wait "gblV_Brew_Status" value == 285
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew286]
wait "gblV_Brew_Status" value == 286
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew287]
wait "gblV_Brew_Status" value == 287
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew288]
wait "gblV_Brew_Status" value == 288
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew289]
wait "gblV_Brew_Status" value == 289
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew290]
wait "gblV_Brew_Status" value == 290
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew291]
wait "gblV_Brew_Status" value == 291
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew292]
wait "gblV_Brew_Status" value == 292
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew293]
wait "gblV_Brew_Status" value == 293
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew294]
wait "gblV_Brew_Status" value == 294
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew295]
wait "gblV_Brew_Status" value == 295
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew296]
wait "gblV_Brew_Status" value == 296
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew297]
wait "gblV_Brew_Status" value == 297
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew298]
wait "gblV_Brew_Status" value == 298
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew299]
wait "gblV_Brew_Status" value == 299
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew300]
wait "gblV_Brew_Status" value == 300
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
clear
start "scrBrew300_1_First_WORT_Run"
stop "scrBrew200_2_Step_Mash"
```

## 29. scrBrew200_3_Step_Mash

Starts by itself: No · User can start or stop it: Yes · 586 lines

```text
//scrBrew200_3_Step_Mash//08/14/2023 20:03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
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
"gblS_Script_Started" value = "Started: scrBrew200_3_Step_Mash" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
new value vVStrike
new value vVStrikeHalf
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vSMsg4 
new time vTMash_1
new time vTMash_2
new time vTMash_3
new time vTMash_TTL
new value vVMash_Step_Number
vVMash_Step_Number precision = 0
new time vTMash_1_Drop
new time vTMash_2_Drop
new time vTMash_3_Drop
vTMash_TTL = "gblT_TTL_Mash_Time_R1"  value
vTMash_1 = "gblT_1_Mash_Time_R1"  value
vTMash_2 = "gblT_2_Mash_Time_R1"  value
vTMash_3 = "gblT_3_Mash_Time_R1"  value
vTMash_1_Drop = vTMash_TTL -  vTMash_1
vTMash_2_Drop = vTMash_1_Drop -  vTMash_2
vTMash_3_Drop = vTMash_2_Drop  -   vTMash_3
if  vTMash_2 == 00:00:00
if  vTMash_3 ==  00:00:00
vVMash_Step_Number = 1
endif
endif
if  vTMash_2 > 00:00:00
if  vTMash_3 == 00:00:00
vVMash_Step_Number = 2
endif
endif
if  vTMash_2  >  00:00:00
if  vTMash_3  >  00:00:00
vVMash_Step_Number = 3
endif
endif
print  vVMash_Step_Number
new value vV_Manifold_Status
new value vVBrewStatus
vVBrewStatus = 999
"gblV_Brew_Status" value = vVBrewStatus
goto "SectionBrew200"
//<><><><><><><><><><><><><><><><><><><><><><><><><
[SectionBrew200]
wait "gblV_Brew_Status" value == 200
if vVMash_Step_Number == 1
vSMsg1 = "Ready to start Mash Timer.  This is a Single Step mash.  This Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Click Start Mash Timer? to advance."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_Brewery_Bottom_3" value = "Ready to start Mashing" 
goto "Choice200"
endif
if vVMash_Step_Number == 2
vSMsg1 = "Ready to start Mash Timer.  This is a Two Step mash.  Step 1 Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Click Start Mash Timer? to advance."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_Brewery_Bottom_3" value = "Ready to start Mashing" 
goto "Choice200"
endif
if vVMash_Step_Number == 3
vSMsg1 = "Ready to start Mash Timer.  This is a Three Step mash.  Step 1 Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Click Start Mash Timer? to advance."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_Brewery_Bottom_3" value = "Ready to start Mashing" 
goto "Choice200"
endif
[Choice200]
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_3" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "Start Mash Timer?"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew201]
wait "gblV_Brew_Status" value == 201
 vVBrewStatus = 201
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew202]
wait "gblV_Brew_Status" value == 202
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew203]
wait "gblV_Brew_Status" value == 203
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew204]
wait "gblV_Brew_Status" value == 204
if vVMash_Step_Number == 1
print 1
vSMsg1 = " This is a Single Step mash.  This Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Moinitor the Temperatures."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Bottom_3" value = vSMsg 
endif
if vVMash_Step_Number == 2
print 2
vSMsg1 = "  This is a Two Step mash.  Step 1 Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Moinitor the Temperatures."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Bottom_3" value = vSMsg 
endif
if vVMash_Step_Number == 3
print 3
vSMsg1 = "Ready to start Mash Timer.  This is a Three Step mash.  Step 1 Mash will be  "
vSMsg2 = vTMASH_1
vSMsg = vSMsg1 + vSMsg2
vSMsg3 = " long.  Moinitor the Temperatures."
vSMsg = vSMsg + vSMsg3
"gblS_Brewery_Bottom_3"  value = vSMsg 
endif
stop "tmTopRight_B1"
"tmTopRight_B1" type = countdown
"tmTopRight_B1" displayname = "Mash Timer"
"tmTopRight_B1" value = "gblT_TTL_Mash_Time_R1" value
"tmTopRight_B1" visibility = visible
start "tmTopRight_B1"
stop "tmTopRight_B1"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" displayname = "Mash Timer"
"tmBottomRight_B1" visibility = hidden
"tmBottomRight_B1" value = "tmTopRight_B1" value
start "tmBottomRight_B1"
stop "tm_Mash Timer_Water"
"tm_Mash Timer_Water" type = countdown
"tm_Mash Timer_Water" displayname = "Mash Timer"
"tm_Mash Timer_Water" visibility = visible
"tm_Mash Timer_Water" value = "tmTopRight_B1" value
start "tm_Mash Timer_Water"
//
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
"tmTopRight_B1" visibility = visible
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew205]
wait "gblV_Brew_Status" value == 205
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew206]
wait "gblV_Brew_Status" value == 206
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew207]
wait "gblV_Brew_Status" value == 207
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew208]
wait "gblV_Brew_Status" value == 208
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew209]
wait "gblV_Brew_Status" value == 209
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew210]
wait "gblV_Brew_Status" value == 210
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew211]
wait "gblV_Brew_Status" value == 211
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew212]
wait "gblV_Brew_Status" value == 212
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew213]
wait "gblV_Brew_Status" value == 213
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew214]
wait "gblV_Brew_Status" value == 214
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew215]
wait "gblV_Brew_Status" value == 215
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew216]
wait "gblV_Brew_Status" value == 216
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew217]
wait "gblV_Brew_Status" value == 217
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew218]
wait "gblV_Brew_Status" value == 218
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew219]
wait "gblV_Brew_Status" value == 219
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew220]
wait "gblV_Brew_Status" value == 220
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew221]
wait "gblV_Brew_Status" value == 221
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew222]
wait "gblV_Brew_Status" value == 222
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew223]
wait "gblV_Brew_Status" value == 223
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew224]
wait "gblV_Brew_Status" value == 224
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew225]
wait "gblV_Brew_Status" value == 225
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew226]
wait "gblV_Brew_Status" value == 226
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew227]
wait "gblV_Brew_Status" value == 227
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew228]
wait "gblV_Brew_Status" value == 228
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew229]
wait "gblV_Brew_Status" value == 229
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew230]
wait "gblV_Brew_Status" value == 230
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew231]
wait "gblV_Brew_Status" value == 231
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew232]
wait "gblV_Brew_Status" value == 232
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew233]
wait "gblV_Brew_Status" value == 233
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew234]
wait "gblV_Brew_Status" value == 234
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew235]
wait "gblV_Brew_Status" value == 235
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew236]
wait "gblV_Brew_Status" value == 236
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew237]
wait "gblV_Brew_Status" value == 237
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew238]
wait "gblV_Brew_Status" value == 238
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew239]
wait "gblV_Brew_Status" value == 239
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew240]
wait "gblV_Brew_Status" value == 240
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew241]
wait "gblV_Brew_Status" value == 241
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew242]
wait "gblV_Brew_Status" value == 242
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew243]
wait "gblV_Brew_Status" value == 243
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew244]
wait "gblV_Brew_Status" value == 244
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew245]
wait "gblV_Brew_Status" value == 245
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew246]
wait "gblV_Brew_Status" value == 246
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew247]
wait "gblV_Brew_Status" value == 247
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew248]
wait "gblV_Brew_Status" value == 248
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew249]
wait "gblV_Brew_Status" value == 249
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew250]
wait "gblV_Brew_Status" value == 250
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew251]
wait "gblV_Brew_Status" value == 251
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew252]
wait "gblV_Brew_Status" value == 252
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew253]
wait "gblV_Brew_Status" value == 253
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew254]
wait "gblV_Brew_Status" value == 254
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew255]
wait "gblV_Brew_Status" value == 255
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew256]
wait "gblV_Brew_Status" value == 256
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew257]
wait "gblV_Brew_Status" value == 257
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew58]
wait "gblV_Brew_Status" value == 258
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew259]
wait "gblV_Brew_Status" value == 259
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew260]
wait "gblV_Brew_Status" value == 260
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew261]
wait "gblV_Brew_Status" value == 261
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew262]
wait "gblV_Brew_Status" value == 262
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew263]
wait "gblV_Brew_Status" value == 263
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew264]
wait "gblV_Brew_Status" value == 264
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew265]
wait "gblV_Brew_Status" value == 265
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew266]
wait "gblV_Brew_Status" value == 266
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew267]
wait "gblV_Brew_Status" value == 267
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew268]
wait "gblV_Brew_Status" value == 268
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew269]
wait "gblV_Brew_Status" value == 269
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew270]
wait "gblV_Brew_Status" value == 270
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew271]
wait "gblV_Brew_Status" value == 271
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew272]
wait "gblV_Brew_Status" value == 272
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew273]
wait "gblV_Brew_Status" value == 273
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew274]
wait "gblV_Brew_Status" value == 274
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew275]
wait "gblV_Brew_Status" value == 275
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew276]
wait "gblV_Brew_Status" value == 276
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew277]
wait "gblV_Brew_Status" value == 277
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew278]
wait "gblV_Brew_Status" value == 278
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew279]
wait "gblV_Brew_Status" value == 279
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew280]
wait "gblV_Brew_Status" value == 280
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew281]
wait "gblV_Brew_Status" value == 281
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew282]
wait "gblV_Brew_Status" value == 282
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew283]
wait "gblV_Brew_Status" value == 283
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew284]
wait "gblV_Brew_Status" value == 284
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew285]
wait "gblV_Brew_Status" value == 285
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew286]
wait "gblV_Brew_Status" value == 286
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew287]
wait "gblV_Brew_Status" value == 287
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew288]
wait "gblV_Brew_Status" value == 288
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew289]
wait "gblV_Brew_Status" value == 289
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew290]
wait "gblV_Brew_Status" value == 290
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew291]
wait "gblV_Brew_Status" value == 291
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew292]
wait "gblV_Brew_Status" value == 292
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew293]
wait "gblV_Brew_Status" value == 293
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew294]
wait "gblV_Brew_Status" value == 294
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew295]
wait "gblV_Brew_Status" value == 295
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew296]
wait "gblV_Brew_Status" value == 296
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew297]
wait "gblV_Brew_Status" value == 297
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew298]
wait "gblV_Brew_Status" value == 298
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew299]
wait "gblV_Brew_Status" value == 299
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew300]
wait "gblV_Brew_Status" value == 300
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblV_Brew_Status" value = vVBrewStatus
clear
start "scrBrew300_1_First_WORT_Run"
stop "scrBrew200_3_Step_Mash"
```

## 30. scrBrew300_1_First_WORT_Run

Starts by itself: No · User can start or stop it: Yes · 368 lines

```text
//scrBrew300_1_First_WORT_Run Modified 260831 06_46
//08/03/2023 10:03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Seperated from scr300 03/21/2026 08:59
"gblVCurrentBigMac_Volume" value = 35
"gblVCurrentMLT_Volume" value = 12
"gblVCurrentBrewKettle_Volume" value = 0
// Set Testing
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
//.........................
//.........................
if vB_Testing == true
"gblS_Script_Started" value = "Started: scrBrew300_1_First_WORT_Run" 
"gblS_Inter_Script" value = " -- "
"gblS_Script_Ended" value = "scrBrew200_1_Step_Mash"
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
start "inscpt_scr_Inner_Blue"
start "inscpt_scrStopScriptManifold"
start "inscpt_scrAlarm"
sleep 100
stop "sub_scrDataExchangeMash"
new string vSMsg
new string vSMsg1
new string vS_TTL_Time
new value vV1
new value vV2
new value vV3
//new value vVTimetoFill
new value vV_G_per_Sec
new value vV_Seconds
new value vV_SecondsR
new value vV_Minutes
new string vSMin
new string vSSec
new string vSTime
new time vTXfer
new string vS_TTL_Time
new value vVPreBoilVol
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
new value vVCurrent_BigMac_Volume
new value vVCurrent_BrewKettle_Volume
new value vV_Start_BigMac_Volume
new value vVCurrent_MLT_Volume
new value vVFill_Volume
//............................................................................
stop "looper_scrAutoSwitch"
sleep 100
start "looper_scrAutoSwitch"
stop "looper_scrBackGrounds"
sleep 100
start "looper_scrBackGrounds"
// Clear Reporting
"RP_v_Calc_Grain_Absorbed_Volume" value = 0
"RP_v_Flush_MASH_Volume" value = 0
"RP_v_First_Run_Calc_Volume" value = 0
"RP_v_First_Run_Volume" value = 0
"RP_v_GrainAbsorbtionRate" value = 0
"RP_v_Sparge_Temp" value = 0
"RP_v_Actual_Grain_Absorbed_Volume" value = 0
"RP_v_2nd_Run_Volume" value = 0
"RP_v_TopOff_Volume" value = 0
"RP_v_PreBoil_Volume" value = 0
//............................................................................
vVPreBoilVol = "gblV_PreBoil_Volume_R1" value
vVGrainWeight = "gblVGrainWeight" value
"RP_v_First_Run_Calc_Volume" value = 0
vVMeasuredStike = "RP_v_Strike_Volume" value
// ...................................................
// ...................................................
//Reset Report values to Zero
"RP_v_Sparge_Volume" value = 0
"RP_v_Sparge_Temp" value = 0
"RP_v_First_Run_Volume" value = 0
"RP_v_2nd_Run_Volume" value = 0
"RP_v_TopOff_Volume" value = 0
"RP_v_PreBoil_Volume" value = 0
"RP_t_TimetoBoil_Time" value = 00:00:00
// ...................................................
// ...................................................
//Real Start
//set the Volume to Flush after the 2nd Run
print 119
"gblV_Brew_Status" value =  300
goto "SectionBrew300"
// ...................................................
[SectionBrew300]
start "inscpt_scrAlarm"
sleep 4001
wait "gblV_Brew_Status" value == 300
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
print 130
"gblS_Top_Text" value =  "Ready to set the Manifold to flush the WORT from the HERMs Coil using the Big Mac.  Click Set Manifold? when ready."
"gblS_Bottom_Text" value = " Click Set Manifold?  BruControl will set the mainfold to flush the  HERMs Coil from the Big Mac."
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
"sw_Flow_Flush_HERMs" state = true
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
start "inscpt_scrStopScriptManifold"
sleep 100
start "inscpt_scr_Inner_Blue"
goto "SectionBrew301"
[SectionBrew301]
"gblV_Brew_Status" value = 302
[SectionBrew302]
wait "gblV_Brew_Status" value == 302
print 150
"gblV_Water_Switch_Status_Water" value = 1031
"gblV_Gals_to_Fill" value = "gblVFushVolume" value
print 153
"sw_Flow_Skip_TimeorVolume" state = true
sleep 100
//Flush HERMS
print 157
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew300_1_First_WORT_Run @ 155 Flush HERMs  > start: sub_scrManifold_Choice"
sleep 4001
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 167 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
print 160
//wait "gblV_Brew_Status" value == 78
"gblV_Brew_Status" value = 302
[SectionBrew301]
[SectionBrew302]
//............................................................
"gblVStartBrew" value = 302
vV_Start_BigMac_Volume = "gblVCurrentBigMac_Volume" value
//Record Flush Volume based on Big Mac that was measured
vVCurrent_BigMac_Volume = "gblVCurrentBigMac_Volume" value
"RP_v_Flush_MASH_Volume" value = vV_Start_BigMac_Volume  -  vVCurrent_BigMac_Volume
//Calculate First Run Volume
vVCalcGrainAdsorbtionRate = "gblV_Grain_AdsopbtionConstant" value
vV1 = vVGrainWeight
vV2 = vVCalcGrainAdsorbtionRate
print "@ 167 Update MLT Volume based on Grain Adsorbtion & Flush Volume."
print "@ Grain Adsorbtion = "
vVGrainAbsorbed_Volume = vV1 * vV2
print "vVGrainAbsorbed_Volume = "
print vVGrainAbsorbed_Volume
"RP_v_Calc_Grain_Absorbed_Volume" value = vVGrainAbsorbed_Volume
print "@173 Set the MLT Volume to the Current and Grain Adsorbtion"
vVCurrent_MLT_Volume = "gblVCurrentMLT_Volume" value
print "@ MLT Volume Pre adsorbtion Correction but with Flush added. = "
print "vVCurrent_MLT_Volume = "
print vVCurrent_MLT_Volume
vVCurrent_MLT_Volume = vVCurrent_MLT_Volume - vVGrainAbsorbed_Volume
"gblVCurrentMLT_Volume" value = vVCurrent_MLT_Volume
print "Corrected Grain Adsobtion vVCurrent_MLT_Volume = "
print vVCurrent_MLT_Volume
"RP_v_First_Run_Calc_Volume" value = vVCurrent_MLT_Volume
[SectionBrew311]
[SectionBrew312]
print 188
"gblV_Brew_Status" value = 312
wait "gblV_Brew_Status" value == 312
"gblV_Brew_Status" value =  314
[SectionBrew314]
wait "gblV_Brew_Status" value == 314
"gblV_Valve_Status" value = 1000
sleep 100
"gblS_swAllSwitch_Label_Text" background = 3
"gblV_Brew_Status" value =  316
 [SectionBrew316]
wait "gblV_Brew_Status" value == 316
print 206
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_swAllSwitch_Label_Text"  visibility = hidden
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
if "gblV_Group_FirstWort" value != 1
"gblV_Brew_Status" value =  317
goto "SectionBrew317"
endif
if "gblV_Group_FirstWort" value == 1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"alm_Hops_1_ALARM" background = 1
"alm_Hops_1_ALARM" fileindex = 1
"alm_Hops_1_ALARM" displayname = "1st WORT Hops"
vSMsg =  "1st WORT Hops in  First Run : "
vSMsg1 =  "gblS_FirstWort" value 
vSMsg = vSMsg  + vSMsg1
"gblS_HopMessage_ALARM"  value = vSMsg
"gblS_HopMessage_ALARM" displayname = "1st WORT Hops Warning"
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" visibility = visible
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
show workspace "B1 Brewery"
"gblS_Brewery_Top_3" value = "1st Hops Ready?.  You will place the 1st Hops Later in the Brew Kettle.  Click 1st Ready? if you are."
"gblS_swAllSwitch_Label_Text" value = "1st Hops Ready?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visibl
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 316
endif
[SectionBrew317]
wait "gblV_Brew_Status" value == 317
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Top_Text" value =  "Ready to set the Manifold to transfer the First Run WORT from the Mash Tun to the Brew Kettle?  Click Set Manifold? when ready."
"gblS_Bottom_Text" value = " Click Set Manifold?  BruControl will set the mainfold to transfer the First Run from the Mash Tun to the Brew Kettle."
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
goto "SectionBrew319"
[SectionBrew319]
"gblV_Brew_Status" value = 320
[SectionBrew320]
wait "gblV_Brew_Status" value == 320
print 261
"gblV_Water_Switch_Status_Water" value = 304
"gblV_Gals_to_Fill" value = vVCurrent_MLT_Volume
print 141
"sw_Flow_Skip_TimeorVolume" state = true
start "inscpt_scrStopScriptManifold"
sleep 100
start "inscpt_scr_Inner_Blue"
//Transfer 1st Run
"gblSReportLabel_B1" value = "@ 268 scr300_1(1st Run) start"
sleep 100
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew300_1_First_WORT_Run @ 276 1st Run  > start: sub_scrManifold_Choice"
sleep 3000
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 285 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
"gblV_Brew_Status" value = 322
[SectionBrew322]
wait "gblV_Brew_Status" value == 322
"RP_v_First_Run_Volume" value = "gblVCurrentBrewKettle_Volume" value
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scr_Inner_Blue"
print 296
"gblV_Water_Switch_Status_Water" value = 1032
vVCurrent_BrewKettle_Volume = "gblVCurrentBrewKettle_Volume" value
vVSpargeVolume = vVPreBoilVol - vVCurrent_BrewKettle_Volume 	
vVSpargeVolume = vVSpargeVolume - 2
// 2 gallons to flush lines
"gblV_Gals_to_Fill" value = vVSpargeVolume
print 303
"sw_Flow_Skip_TimeorVolume" state = true
start "inscpt_scrStopScriptManifold"
sleep 100
//Add Sparge
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
vSMsg = "Ready to set the Manifold to add "
vSMsg1 = vVSpargeVolume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons of Sparge Water via the HERMs Coil from the Big Mac.  Click Set Manifold? when ready." 
vSMsg = vSMsg + vSMsg1
"gblS_Top_Text" value =  vSMsg
"gblS_Bottom_Text" value = " Click Set Manifold? The mainfold will be set ready to add Sparge Water via the HERMs Coil from the Big Mac using the White Pump.  This is a Batch Sparge.  Tis will leave about 2 gallons of flush water later."
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
goto "SectionBrew323"
[SectionBrew323]
"gblV_Brew_Status" value = 324
[SectionBrew324]
wait "gblV_Brew_Status" value == 324
start "inscpt_scr_Inner_Blue"
"RP_v_Sparge_Volume" value = "gblVCurrentMLT_Volume" value
print 307
"sw_Flow_Skip_TimeorVolume" state = true
start "inscpt_scrStopScriptManifold"
sleep 100
start "inscpt_scr_Inner_Blue"
//Transfer Sparge
"gblSReportLabel_B1" value = "@ 312 scr300_1(Sparge) start"
sleep 100
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "scrBrew300_1_First_WORT_Run @ 321 Add Sparge  > start: sub_scrManifold_Choice"
sleep 3000
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 327 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
"gblV_Brew_Status" value = 322
[SectionBrew322]
[END_scrBrew300_1]
if vB_Testing == true
"gblS_Script_Ended" value = "Ended: scrBrew300_1_First_WORT_Run"
sleep 4001
endif
clear
start "scrBrew300_2_Sparging and 2nd_Run"
"sw_Running_Script_B" state  = false
stop "scrBrew300_1_First_WORT_Run"
```

