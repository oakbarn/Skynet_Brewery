# OakBarn Brewery BruControl Scripts, Part 4 of 5

> **Read only when OakBarn Brewery says so, or after asking permission** (Rule 16.8). The one standing exception: these
> Scripts are the basis for the Skynet Process Templates that are not finished yet. They are kept exactly as BruControl saved
> them (BruControl Script language, not Skynet Process code), so they are not brought up to the Skynet Rules.

Back to the [list of all Scripts](README.md).

## 76. sub_3_scrCalculateSPG

Starts by itself: No · User can start or stop it: Yes · 2018 lines

```text
// sub_3_scrCalculateSPG MODIFIED 260905 16-42
//05/05/2026 08:15
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//..................................
// Set Testing
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
"sw_Running_Calculate_SPG" state = true
//start "inscpt_scrClearB1_Brewery"
//sleep 100
//wait "sw_Running_Clear_B1" state == false
//..................................
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
"gblS_Inter_Script" visibility = visible
start "step_scrTest_Time _Reset"
start "looper_scrBoilTimer_Reset"
"gblTValveDelay" value = 00:00:01
sleep 101
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
new string vSMsg
new string vSMsg1
new value vV_Volume_Start_From
new value vV_Volume_Start_To
new value vV_Volume_Start_To_End_Volume
new value vV_Volume_End
new value vV_Volume_Measure
new value vV_Volume_Delta
new value vV_Radiator_DeadSpace
new bool vB_RadiatorDeadSpace_Filled
new value vV_Volume_Check_Delta
new value vV_Volume_to_Transfer
new value vV_Gal_to_Fill
new value vV_Elasped_Seconds
new value vV_SPG_Calculated_Rate
new value vV_SPG_Orginal_Rate
new value vV_SPG_Delta_Rate
new time  vT_Caluculated_Time
new string vS_TTL_Time
new value vV_Vessel_From
new value vV_Vessel_To
new value vV_Fermentor_To
new value vV_Vessel_Measure
new value vV_Vessel_Adjust
new value vV_Vessel_Adjust_Start_Volume
new value vV_Vessel_Adjust_End_Volume
new string vS_Vessel_To
new string vS_Vessel_Measure
new string vS_Vessel_From
new string vS_Vessel_Adjust
new string vS_Isolation_Valves
new value vV_Max
new value vV_Low
new value vV_High
new value vV_Current
new value vV_Current_Start
new value vV_New_Desired_Fill_Vessel_Volume_End
new value vV_Desired_Fill_Vessel_Volume_End
new value vV_Current_Delta
new bool vB_Strike
new value vV_Strike_Volume
new value vV_Strike_Volume_Half
new string vS_Measure_Text
//............................................................................
//set some values
//............................................................................
vB_Strike = "sw_Status_Strike" state
vB_RadiatorDeadSpace_Filled = "sw_Status_DeadSpace_Radiator" state
vV_Strike_Volume = "gblVStrikeVolume" value
"sw_Flow_BigMacForecastLow" state = false
vV_SPG_Calculated_Rate precision = 5
vV_SPG_Orginal_Rate precision = 5
vV_SPG_Delta_Rate precision = 5
vV_Vessel_From = "gblV_Vessel_From" value
vV_Vessel_To = "gblV_Vessel_To" value
vV_Vessel_Measure = "gblV_Vessel_Measure" value
vS_Vessel_Measure = "gblS_Vessel_Measure" value
vV_Vessel_Adjust = "glbV_Vessel_Adjust" value
vS_Vessel_From = "gblS_Vessel_From" value
vS_Vessel_To = "gblS_Vessel_To" value
vS_Vessel_Adjust = "gblS_Vessel_Adjust" value
vV_Volume_Start_From = "gblV_Start_From" value
vV_Volume_Start_To =  "gblV_Start_To" value
vV_Vessel_Adjust_Start_Volume =  "gblV_Start_Adjust" value
"gblV_Water_Status_saved" value = "gblV_Water_Switch_Status_Water" value 
if "gblVCurrentRadiator_Volume" value > 0
"sw_Status_DeadSpace_Radiator" state = true
endif
vV_Radiator_DeadSpace = "glbV_Rad_Dead_Space" value
vB_RadiatorDeadSpace_Filled = "sw_Status_DeadSpace_Radiator" state
// B1 Brewery Left visibility ......................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
	if vV_Vessel_To == vV_Vessel_Measure
	"gblVEndVolume_Water" value = 0
	else
	"gblVEndVolume_Water" value = 99
	endif
//................................................
print "@  111 "
//.................................................	
"gblV_Sub3_Status" value = 100
[SectionBrewSub3_100]
wait "gblV_Sub3_Status" value == 100
//.................................................
start "sub_4_scrSetSPG"
print "@117 start sub_4_scrSetSPG"
"gblS_Inter_Script" value =  "@ 1117 in sub_3_scrCalculateSPG> start: sub_4_scrSetSPG"
sleep 100
	if vB_Testing == true
		sleep 4001
	endif
wait "sw_Running_Script_C" state  == false
//.................................................
"gblV_Sub3_Status" value = 102
[SectionBrewSub3_102]
wait "gblV_Sub3_Status" value == 102
	if vV_Vessel_Measure == 1
		vS_Measure_Text = "Measure the Big Mac using the Volume Marks inside the Big Mac."
	endif
	if vV_Vessel_Measure == 2
		vS_Measure_Text = "Stick the Radiator using the Radiator Measure Stick (on the West Wall)."
	endif
	if vV_Vessel_Measure == 3
		vS_Measure_Text = "Stick the Mash Tun using the MASH Paddle (on the West Wall)."
	endif
	if vV_Vessel_Measure == 4
	vS_Vessel_Measure = "Brew Kettle"
	vS_Measure_Text = "Stick or Measure the Brew Kettle using the  Measure Stick (on the North Wall)."
	endif
	if vV_Vessel_Measure == 5
		vS_Measure_Text = "Stick or Measure the Little using the  Measure Stick (on the North Wall)."
	endif
	if vV_Vessel_Measure == 7
		vS_Measure_Text = "Measure the Brewzilla using the Volume Marks inside the Brewzilla."
	endif
	if vV_Vessel_Measure == 8
		vS_Measure_Text = "Measure the DigiBoil using the Volume Marks inside the Digiboil."
	endif
	if vV_Vessel_Measure == 9
		vS_Measure_Text = "Stick the 20 Gal Mash Tun using the 20 Gal Mash Tun Measure Stick (on the East Wall)."
	endif
"gblV_Sub3_Status" value = 104
[SectionBrewSub3_104]
wait "gblV_Sub3_Status" value == 104
vV_Gal_to_Fill = "gblV_Gals_to_Fill" value
vV_Volume_to_Transfer = "gblV_Gals_to_Fill" value
vV_Elasped_Seconds = "gblVElaspedSeconds" value
vS_TTL_Time = "gblT_SetTimer_Water" value
vV_SPG_Orginal_Rate = "gblV_Rate" value
vV_Fermentor_To = "gblV_Fermentor" value
	if vV_Vessel_Measure == vV_Vessel_To
		vV_Desired_Fill_Vessel_Volume_End = vV_Volume_Start_To + vV_Gal_to_Fill
	endif
	if vV_Vessel_Measure == vV_Vessel_From
		vV_Desired_Fill_Vessel_Volume_End = vV_Volume_Start_From - vV_Gal_to_Fill
	endif
print "@ 168 vV_Desired_Fill_Vessel_Volume_End = "
print vV_Desired_Fill_Vessel_Volume_End
print "vV_Gal_to_Fill = "
print vV_Gal_to_Fill
print "vV_Volume_to_Transfer = "
print vV_Volume_to_Transfer
print "vV_SPG_Orginal_Rate = "
print vV_SPG_Orginal_Rate
//.....................................................
	if vV_Vessel_From == 1
		if vV_Desired_Fill_Vessel_Volume_End < 15
			"sw_Control_BigMac_Element" state = false
			sleep 100
		endif
goto "Real_Begin"
[Redo_Add_Additional]
"gblV_Sub3_Status" value = 106
[SectionBrewSub3_106]
wait "gblV_Sub3_Status" value == 106
print "@ 187 Redo_Add_Additional"
	if vV_Vessel_To == vV_Vessel_Measure
		"gblVEndVolume_Water" value = 0
	else
		"gblVEndVolume_Water" value = 99
	endif
"tm_Water_Up"  value = 00:00:00
"gblVReport_B1" value = -99
"gblV_Water_Switch_Status_Water" value = "gblV_Water_Status_saved" value 
"gblV_Gals_to_Fill" value = vV_Gal_to_Fill
vV_Gal_to_Fill = "gblV_Gals_to_Fill" value
vV_Volume_to_Transfer = vV_Gal_to_Fill
//.................................................
"gblV_Sub3_Status" value = 108
[SectionBrewSub3_108]
wait "gblV_Sub3_Status" value == 108
start "inscpt_scr_Inner_Blue"
start "sub_4_scrSetSPG"
print "@ 210 start sub_4_scrSetSPG"
"gblS_Inter_Script" value =  "@ 210 in sub_3_scrCalculateSPG > start: sub_4_scrSetSPG"
sleep 100
	if vB_Testing == true
		sleep 4001
	endif
wait "sw_Running_Script_C" state  == false
"gblV_Sub3_Status" value = 110
[SectionBrewSub3_110]
wait "gblV_Sub3_Status" value == 110
vV_Volume_Start_From = "gblV_Start_From" value
vV_Volume_Start_To =  "gblV_Start_To" value
vV_Vessel_Adjust_Start_Volume =  "gblV_Start_Adjust" value
//................................................
print "@ 218 vV_Volume_Start_To = "
print vV_Volume_Start_To
//...........................................
goto "Start_Water"
[Real_Begin]
print "@ 223 Real Begin"
"gblV_Sub3_Status" value = 112
[SectionBrewSub3_112]
wait "gblV_Sub3_Status" value == 112
//.....................................................
vV_Gal_to_Fill = "gblV_Gals_to_Fill" value
vV_Volume_to_Transfer = vV_Gal_to_Fill
vV_Elasped_Seconds = "gblVElaspedSeconds" value
vT_Caluculated_Time = "gblT_SetTimer_Water" value
vS_TTL_Time = "gblT_SetTimer_Water" value
vV_Fermentor_To = "gblV_Fermentor" value
"gblV_Sub3_Status" value = 114
[SectionBrewSub3_114]
wait "gblV_Sub3_Status" value == 114
print "@ 237 in Real Begin vV_Gal_to_Fill = "
print vV_Gal_to_Fill
print "vV_Volume_to_Transfer = "
print vV_Volume_to_Transfer
print " vV_SPG_Orginal_Rate = "
print vV_SPG_Orginal_Rate
print " vV_Desired_Fill_Vessel_Volume_End = "
print vV_Desired_Fill_Vessel_Volume_End
[Start_Water]
"gblV_Sub3_Status" value = 116
[SectionBrewSub3_116]
wait "gblV_Sub3_Status" value == 116
"sw_Advance_ BrewStatus"  visibility = hidden
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_3" value = "Wait.  Transfer Script Running.  Will Auto Advance"
"gblS_Brewery_Bottom_3" value = "Wait.  Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblV_Sub3_Status" value = 118
[SectionBrewSub3_118]
wait "gblV_Sub3_Status" value == 118
start "inscpt_scr_Inner_Blue"
start "sub_4_scrVolume_to_Time_TRANFER_SPG"
sleep 100
	if vB_Testing == true
		"gblS_Inter_Script" value =  "@ 269 in sub_3_scrCalculateSPG > start: sub_4_scrVolume_to_Time_TRANFER_SPG"
		sleep 101
	endif
"gblV_Sub3_Status" value = 120
[SectionBrewSub3_120]
wait "gblV_Sub3_Status" value == 120
print "@ 285 Wait on sub_4_scrVolume_to_Time_TRANFER_SPG Brew Status = 4006 then set timers"
wait "gblV_Sub4_Status" value == 4008
// Timers Set
"tm_Display_BottomRight_B1" visibility = hidden
"tmBottomRight_B1" visibility = hidden
vT_Caluculated_Time = "gblT_SetTimer_Water" value
stop "tm_Water"
stop "tm_Water_Up"
stop "tm_Action_BottomRight_B1"
stop "tmBigMac_B1"
stop "tmRadiator_B1"
	if vV_Vessel_To == 1
	start "inscpt_BigMacTimer"
	sleep 100
	goto "End_Timers_Set"
	endif
	if vV_Vessel_To == 2
		start "inscpt_RadiatorTimer"
		goto "End_Timers_Set"
	endif
"tm_Action_BottomRight_B1" type = countdown
"tm_Action_BottomRight_B1" value = vT_Caluculated_Time
"tm_Action_BottomRight_B1"  visibility = visible
	if vV_Vessel_To == 3
		"tm_Action_BottomRight_B1" displayname = "Mash Tun Fill"
		goto "End_Timers_Set"
	endif
	if vV_Vessel_To == 4
		"tm_Action_BottomRight_B1" displayname = "Brew Kettle Fill"
		
	goto "End_Timers_Set"
	endif
	if vV_Vessel_To == 5
		"tm_Action_BottomRight_B1" displayname = "Little Mac Fill"
	goto "End_Timers_Set"
	endif
	if vV_Vessel_To == 7
		"tm_Action_BottomRight_B1" displayname = "Brewzilla Fill"
		goto "End_Timers_Set"
	endif
	if vV_Vessel_To == 8
		"tm_Action_BottomRight_B1" displayname = "DigiBoil Fill"
		goto "End_Timers_Set"
	endif
	if vV_Vessel_To == 9
		"tm_Action_BottomRight_B1" displayname = "20g MLT Fill"
		goto "End_Timers_Set"
	endif
[End_Timers_Set]
//.............................................
"gblV_Sub3_Status" value = 122
[SectionBrewSub3_122]
wait "gblV_Sub3_Status" value == 122
//......................................
//......................................
//Return to scrVolume_to_Time_TRANFER to start Pumps and open Isolation Valves
//......................................
//......................................
//Start Pumps, Open Isolation Valves 
[SectionBrewSub3_124]
vV_Gal_to_Fill = "gblV_Gals_to_Fill" value
vV_Volume_to_Transfer = "gblV_Gals_to_Fill" value
vV_Elasped_Seconds = "gblVElaspedSeconds" value
vT_Caluculated_Time = "gblT_SetTimer_Water" value
vS_TTL_Time = vT_Caluculated_Time
vV_Fermentor_To = "gblV_Fermentor" value
print "@ 344 Waiting on sub_4_scrVolume_to_Time_TRANFER_SPG gblV_Sub4_Status = 4014 and start Timers"
wait "gblV_Sub4_Status" value == 4014
"gblV_Sub3_Status" value = 124
wait "gblV_Sub3_Status" value == 124
start "tm_Water"
start "tm_Water_Up"
start "tm_Action_BottomRight_B1"
	if vV_Vessel_To == 1
		start "tmBigMac_B1"
	endif
	if vV_Vessel_To == 2
		start "tmRadiator_B1"
	endif
vSMsg =  " The "
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is filling for "
vSMsg = vSMsg + vSMsg1
//......................................................
vSMsg1 = vS_TTL_Time
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".  Monitor the Fill!  You are the Safety and Control. Wait! Will Auto Advance.  You may OverRide."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
print " 377  vV_Volume_Start_To = "
print vV_Volume_Start_To
vV_Volume_Start_To_End_Volume = vV_Volume_Start_To + vV_Gal_to_Fill
vSMsg = "The "
vSMsg1 = vS_Vessel_To
	if "sw_Flow_Flush_HERMs" state == true
		vSMsg1 = "HERMs Coil"
	endif
vSMsg = vSMsg + vSMsg1
vSMsg1 = " will be Topped Off with "
		if "sw_Flow_Flush_HERMs" state == true
			vSMsg1 = " will be Flushed with "
		endif
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_to_Fill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  The "
	if "sw_Flow_Flush_HERMs" state == true
		vSMsg1 = " gallons from the Big Mac."
	endif
vSMsg = vSMsg + vSMsg1
	if "sw_Flow_Flush_HERMs" state == true
		goto "Skip_Flush_1"
	endif
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " when Topped Off should be "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Start_To_End_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = "  gallons.\nIt can be Higher or Lower and small amounts are not signicant.  Monitor the Fill!\n"
vSMsg = vSMsg + vSMsg1
vS_Isolation_Valves = "glbS_Isolation_Valve" value
vSMsg1 = vS_Isolation_Valves
vSMsg = vSMsg + vSMsg1
vSMsg1 = "\nOverRide if getting to HIGH!"
vSMsg = vSMsg + vSMsg1
[Skip_Flush_1]
print "@ 416 Skip_Flush_1"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Bottom_3" value = vSMsg
vSMsg = "The "
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " desired Gallons = "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Start_To_End_Volume
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1"  value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "OverRide?"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//........................................
// Background
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Bottom_3" background = 3
"sw_Advance_Overide" background = 3
// Visibility
"tm_Action_BottomRight_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"sw_Advance_ BrewStatus"  visibility = hidden
"sw_Advance_Overide" visibility = visible
"gblV_Brew_Status" value = 8999
"gblS_BrewName_B1" visibility = hidden
//.............................................
	if "sw_Status_Sparging" state == false
goto "Loop_Time_Up"
	endif
print "@ 443 Sparge Temp Recorded at 25 seconds of flow"
	if "tm_Water_Up" value  > 00:00:25
		"RP_v_Sparge_Temp" value = "MB_59_10K_MashReturn_B1" value
	endif
print "@458 Loop_Time_Up next"
[Loop_Time_Up]
	if "tm_Action_BottomRight_B1" value <= 00:00:00
	goto Exit_Loop_Time_Up
	endif
	if vB_Testing == true
		if "tm_Water_Up" value  > 00:00:10
				"tm_Water" value = 00:00:02
				"tm_Action_BottomRight_B1" value = 00:00:02
				wait "tm_Action_BottomRight_B1" value <= 00:00:00
				"tm_Water_Up" value = vT_Caluculated_Time
				"tmRadiator_B1" value = vT_Caluculated_Time
				"tmBigMac_B1" value = vT_Caluculated_Time
				goto Exit_Loop_Time_Up
		endif
	endif
goto "Loop_Time_Up"
[Exit_Loop_Time_Up]
print " @476 Exit_Loop_Time_Up"
stop "tm_Water_Up"
stop "tm_Water"
stop "tm_Action_BottomRight_B1"
stop "tmRadiator_B1"
stop "tmBigMac_B1"
"gblV_Sub3_Status" value = 126
[SectionBrewSub3_126]
wait "gblV_Sub3_Status" value == 126
"tm_Action_BottomRight_B1" displayname = "Fill Time ="
"tm_Action_BottomRight_B1" value = "tm_Water_Up" value
sleep 2000
//.............................................
//.............................................
// Shut Off Pumps and Isolation Valves in scrVolume_to_Time_TRANFER and Calculate seconds
//.............................................
//.............................................
print "@ 493 Come back here after changeing time to seconds"
wait "gblV_Sub4_Status" value == 4024
"gblV_Sub3_Status" value = 128
[SectionBrewSub3_128]
wait "gblV_Sub3_Status" value == 128
[Measure_Volume]
print "@499 Measure_Volume"
"sw_Advance_Overide" visibility = hidden
"gblS_Brewery_Top_3" value = "Wait!  Will Auto Advance."
"gblS_swAllSwitch_Label_Text" value = "Wait!"
"gblS_Brewery_Bottom_3" value = "Wait.   Wait!  Will Auto Advance."
//......................................................
//.....................................................
print "@ 506 in Measure Volume (:  vV_Gal_to_Fill = "
print vV_Gal_to_Fill
print "vV_Volume_to_Transfer = "
print vV_Volume_to_Transfer
print " vV_SPG_Orginal_Rate = "
print vV_SPG_Orginal_Rate
print " vV_Desired_Fill_Vessel_Volume_End = "
print vV_Desired_Fill_Vessel_Volume_End
//.....................................................
"gblS_swAllSwitch_Label_Text" background = 2
vSMsg = "Measure the "
vSMsg1 = vS_Vessel_Measure
vSMsg = vSMsg + vSMsg1
"gblS_swAllSwitch_Label_Text" value = vSMsg
//............................................................
vSMsg = "gblS_Water_Text" value
vSMsg1 = ".\nThe total gallons that were desired to transfer was "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_to_Transfer
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.\nThe starting volume of the "
vSMsg = vSMsg + vSMsg1
if vV_Vessel_From == vV_Vessel_Measure
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " was " 
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Start_From
vSMsg = vSMsg + vSMsg1
//.....................................
if vV_Vessel_To == vV_Vessel_Measure
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " was " 
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Start_To
vSMsg = vSMsg + vSMsg1
endif 
vSMsg1 = " gallons. "
	if vV_Vessel_To != 2
		goto "Skip_Rad_Dead"
	endif
		if vV_Volume_Start_To  < 0
			vV_Volume_Start_To = vV_Volume_Start_To * -1
		endif	
		if vV_Volume_Start_To == vV_Radiator_DeadSpace 
		vV_Volume_Start_To = vV_Volume_Start_To * -1
		vSMsg1 = " gallons. This is the Dead Space of the Radiator that was filled. "
		endif
	endif
[Skip_Rad_Dead]
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" value = vSMsg
"tm_Action_BottomRight_B1" visibility = hidden
"tmRadiator_B1" visibility = hidden
"tmBigMac_B1" visibility = hidden
//................................................................................
print "@ 563 Measure "
"gblV_Sub3_Status" value = 130
[SectionBrewSub3_130]
wait "gblV_Sub3_Status" value == 130
wait "gblV_Sub4_Status" value == 4999
"gblSReportLabel_B1" value = vS_Measure_Text
"gblVReport_B1" precision = 1
"gblVReport_B1" value = -99
vSMsg = vS_Vessel_Measure
vSMsg1 = " Estimated Volume = "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Desired_Fill_Vessel_Volume_End
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1" value = vSMsg
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
"gblS_Brewery_Top_2" visibility = visible 
"gblS_swAllSwitch_Label_Text" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible
wait "gblVReport_B1" value > -99
"gblVEndVolume_Water" value = "gblVReport_B1" value
vV_Volume_End = "gblVReport_B1" value
vV_Volume_Measure = "gblVReport_B1" value
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_3" value = "Wait"
"gblS_swAllSwitch_Label_Text" value = "Wait.  Will Auto Advance"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//BackGrounds
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibilty
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
//...................................................
//...................................................
"gblV_Sub3_Status" value = 132
[SectionBrewSub3_132]
wait "gblV_Sub3_Status" value == 132
	if vV_Vessel_Measure == vV_Vessel_To
		if vV_Vessel_Measure == 1
		"gblVCurrentBigMac_Volume" value = vV_Volume_End
		goto "End_To"
		endif
		if vV_Vessel_Measure == 2
			"gblVCurrentRadiator_Volume" value = vV_Volume_End
			goto "End_To"
		endif
		if vV_Vessel_Measure == 3
			"gblVCurrentMLT_Volume" value = vV_Volume_End
			goto "End_To"
		endif
		if vV_Vessel_Measure == 4
			"gblVCurrentBrewKettle_Volume" value = vV_Volume_End
			goto "End_To"
		endif
		if vV_Vessel_Measure == 5
			"gblVCurrentLittle_Volume" value = vV_Volume_End
			goto "End_To"
		endif
		if vV_Vessel_Measure == 7
			"gblVCurrentBrewzilla_Volume" value = vV_Volume_End
			goto "End_To"
		endif
		if vV_Vessel_Measure == 8
			"gblVCurrentDigiboil_Volume" value = vV_Volume_End
			goto "End_To"
		endif
	endif
[End_To]
"gblV_Sub3_Status" value = 134
[SectionBrewSub3_134]
wait "gblV_Sub3_Status" value == 134
//.......................................................
	if vV_Vessel_Measure == vV_Vessel_From
		if vV_Vessel_From == 1
			"gblVCurrentBigMac_Volume" value = vV_Volume_End
			goto "End_From"
		endif
		if vV_Vessel_To == 2
			"gblVCurrentRadiator_Volume" value = vV_Volume_End
			goto "End_From"
		endif
		if vV_Vessel_To == 3
			"gblVCurrentMLT_Volume" value = vV_Volume_End
			goto "End_From"
		endif
		if vV_Vessel_To == 4
			"gblVCurrentBrewKettle_Volume" value = vV_Volume_End
			goto "End_From"
		endif
		if vV_Vessel_To == 5
			"gblVCurrentLittle_Volume" value = vV_Volume_End
			goto "End_From"
		endif
		if vV_Vessel_To == 7
			"gblVCurrentBrewzilla_Volume" value = vV_Volume_End
			goto "End_From"
		endif
		if vV_Vessel_To == 8
			"gblVCurrentDigiboil_Volume" value = vV_Volume_End
			goto "End_From"
		endif
		if vV_Vessel_To == 9
			"gblVCurrent20GMLT_Volume" value = vV_Volume_End
			goto "End_From"
		endif
endif
[End_From]
"gblV_Sub3_Status" value = 134
[SectionBrewSub3_134]
wait "gblV_Sub3_Status" value == 134
print " Set  Volume ..............................................."
print "@ 692 Set Volume vV_Volume_Start_From = "
vV_Elasped_Seconds = "gblVElaspedSeconds" value
if vV_Vessel_Measure == vV_Vessel_From
print " vV_Vessel_Measure == vV_Vessel_From"
print "(From Start Volume) vV_Volume_Start_From = "
print vV_Volume_Start_From
vV_Volume_Delta = vV_Volume_Start_From - vV_Volume_End 
endif
	if vV_Vessel_Measure == vV_Vessel_To
		print "vV_Vessel_Measure == vV_Vessel_To"
		print "(Volume to Vessel) vV_Volume_Start_To = "
		print vV_Volume_Start_To
		vV_Volume_Delta =    vV_Volume_End - vV_Volume_Start_To
	endif
print "(Measured Volume) vV_Volume_End = "
print vV_Volume_End
print "vV_Volume_Delta = "
print vV_Volume_Delta
print "vB_RadiatorDeadSpace_Filled = "
print vB_RadiatorDeadSpace_Filled
	if vV_Vessel_Adjust == 0 
		goto "End_Adjust"
		else
		goto "Adjust Vessel"
	endif
//...................................................
[Adjust Vessel]
"gblV_Sub3_Status" value = 136
[SectionBrewSub3_136]
wait "gblV_Sub3_Status" value == 136
print "@ 748 vV_Vessel_Adjust_Start_Volume = "
print vV_Vessel_Adjust_Start_Volume
print "vV_Volume_Delta = "
print vV_Volume_Delta
"gblV_Sub3_Status" value = 138
[SectionBrewSub3_138]
wait "gblV_Sub3_Status" value == 138
	if vV_Vessel_Adjust == vV_Vessel_To
		vV_Vessel_Adjust_End_Volume = vV_Vessel_Adjust_Start_Volume + vV_Volume_Delta
	endif
	if vV_Vessel_Adjust == vV_Vessel_From
		vV_Vessel_Adjust_End_Volume = vV_Vessel_Adjust_Start_Volume - vV_Volume_Delta
	endif
"gblVPrecision1" value = vV_Vessel_Adjust_End_Volume
vV_Vessel_Adjust_End_Volume = "gblVPrecision1" value
print "vV_Vessel_Adjust_End_Volume = "
print vV_Vessel_Adjust_End_Volume
"gblV_Sub3_Status" value = 140
[SectionBrewSub3_140]
wait "gblV_Sub3_Status" value == 140
	if vV_Vessel_Adjust == 1
		"gblVCurrentBigMac_Volume" value = vV_Vessel_Adjust_End_Volume
	goto "Display_Volume"
	endif
//...................................................
	if vV_Vessel_Adjust == 2
		"gblVCurrentRadiator_Volume" value = vV_Vessel_Adjust_End_Volume
		goto "Display_Volume"
	endif
//...................................................
	if vV_Vessel_Adjust == 3
		"gblVCurrentMLT_Volume" value = vV_Vessel_Adjust_End_Volume
		goto "Display_Volume"
	endif
//...................................................
	if vV_Vessel_Adjust == 4
		"gblVCurrentBrewKettle_Volume" value = vV_Vessel_Adjust_End_Volume
	goto "Display_Volume"
	endif
//...................................................
	if vV_Vessel_Adjust == 5
		"gblVCurrentLittle_Volume" value = vV_Vessel_Adjust_End_Volume
	goto "Display_Volume"
	endif
//...................................................
	if vV_Vessel_Adjust == 7
		"gblVCurrentBrewzilla_Volume" value = vV_Vessel_Adjust_End_Volume
	goto "Display_Volume"
	endif
	if vV_Vessel_Adjust == 8
		"gblVCurrentDigiboil_Volume" value = vV_Vessel_Adjust_End_Volume
	goto "Display_Volume"
	endif
	if vV_Vessel_Adjust == 9
		"gblVCurrent20GMLT_Volume" value = vV_Vessel_Adjust_End_Volume
	goto "Display_Volume"
	endif
[Display_Volume]
"gblV_Sub3_Status" value = 142
[SectionBrewSub3_142]
wait "gblV_Sub3_Status" value == 142
vSMsg = "The  "
vSMsg1 = vS_Vessel_Adjust
vSMsg = vSMsg + vSMsg1
vSMsg1 = " current Volume has been updated to "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Vessel_Adjust_End_Volume
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. Wait.  Will Auto Advance"
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_3" value = vSMsg
//Backgrounds
"gblS_Brewery_Top_3"  background = 3
"insp_Pix_ArrowAllSwitch_B1"  background = 3
"gblS_swAllSwitch_Label_Text"  background = 3
//Visibility
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
//............................................................
//Short Delay 
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
//........................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
[End_Adjust]
"gblV_Sub3_Status" value = 144
[SectionBrewSub3_144]
wait "gblV_Sub3_Status" value == 144
vV_SPG_Orginal_Rate = "gblV_Rate" value
print "@ 833 start Rate Calculation vV_Elasped_Seconds = "
print vV_Elasped_Seconds
print "vV_Volume_to_Transfer = "
print vV_Volume_to_Transfer 
print "vV_Volume_Delta = "
print vV_Volume_Delta
vV_SPG_Calculated_Rate = vV_Elasped_Seconds / vV_Volume_Delta 
print vV_SPG_Calculated_Rate
"gblV_SPG_Calculated" value = vV_SPG_Calculated_Rate
vV_SPG_Calculated_Rate = "gblV_SPG_Calculated" value
vV_SPG_Delta_Rate = vV_SPG_Orginal_Rate - vV_SPG_Calculated_Rate
	if vV_SPG_Delta_Rate < 0
		vV_SPG_Delta_Rate = vV_SPG_Delta_Rate * -1
	endif
"gblV_SPG_Delta_Rate" value = vV_SPG_Delta_Rate
vV_SPG_Delta_Rate = "gblV_SPG_Delta_Rate" value
print "vV_SPG_Delta_Rate = "
print vV_SPG_Delta_Rate
print "vV_SPG_Orginal_Rate = "
print vV_SPG_Orginal_Rate
//.......................................................
vSMsg = "The Total Volume transferred to the "
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " from the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " was "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_to_Transfer
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  The Orginal SPG Rate used was "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_SPG_Orginal_Rate
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".   The calculated SPG Rate was "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_SPG_Calculated_Rate
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".\nThe Difference between the SPG Rates is "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_SPG_Delta_Rate
vSMsg = vSMsg + vSMsg1
vSMsg1 = " SPG."
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = vSMsg
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = true
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
//........................................
//............................................................
goto "Rate_Calculated_Update_Choice"
[Rate_Calculated_Update_Choice]
"gblV_Sub3_Status" value = 146
[SectionBrewSub3_146]
wait "gblV_Sub3_Status" value == 146
"gblV_Brew_Status" value = 8906
print "@  878  Update SPG Choice  "
if vV_Volume_Delta <= 6
    if vV_SPG_Delta_Rate <=  2
	goto "Rate_Good"
	endif
endif
if vV_SPG_Delta_Rate <=  .04999999
goto "Rate_Good"
endif
if vV_SPG_Delta_Rate > .04999999
vSMsg = "The Difference between the SPG Rates is "
vSMsg1 = vV_SPG_Delta_Rate
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Seconds per Gallon.\n1 = Update the SPG Rate\n2 = Keep Orginal SPG Rate"
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" value = vSMsg 
"gblSReportLabel_B1" value = "Make a Choice"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//.........................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Backgrounds
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text"  background = 2
//Visibility
"gblS_Brewery_Top_2" visibility = Visible
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
[Loop_Choice]
sleep 100
	if "gblVReport_B1" value == 1
		goto "UpdateSPG"
	endif
	if "gblVReport_B1" value == 2
		goto "KeepSPG"
	endif
	if "gblVReport_B1" value > 2
		"gblVReport_B1" value = 0
	endif
goto "Loop_Choice"
[UpdateSPG]
"gblV_Sub3_Status" value = 146
[SectionBrewSub3_146]
wait "gblV_Sub3_Status" value == 146
"gblV_Brew_Status" value = 8907
print "@ 960 Update SPG"
	if vV_Vessel_From == 1
		goto "From_Big_Mac"
	endif
	if vV_Vessel_From == 2
		goto "From_Radiator"
	endif
	if vV_Vessel_From == 3
		goto "From_MLT"
	endif
	if vV_Vessel_From == 4
		goto "From_BrewKettle_or_Little Mac"
	endif
	if vV_Vessel_From == 5
		goto "From_BrewKettle_or_Little Mac"
	endif
	if vV_Vessel_From == 7
		goto "From_BrewZilla"
	endif
	if vV_Vessel_From == 9
		goto "From_PurplePump"
	endif
	if vV_Vessel_From == 100
		goto "From_Manifold_Supply_Valve"
	endif
// Set Spg.................................................
"gblV_Brew_Status" value = 8908
[From_Big_Mac]
"gblV_Sub3_Status" value = 148
[SectionBrewSub3_148]
wait "gblV_Sub3_Status" value == 148
print "@ 991 from Big Mac set SPG to XX"
	if vV_Vessel_To == 2
	"gblV_SPG_BigMac_to_Radiator" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 3
	"gblV_SPG_BigMac_to_MLT" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 4
		"gblV_SPG_BigMac_to_BK (Front)" value = vV_SPG_Calculated_Rate
	endif
	if "sw_Flow_Front_Way" state == true
	goto "BigMacToFrontway"
	else
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 5
	if "sw_Flow_Front_Way" state == true
	"gblV_SPG_BigMac_to_BK (Front)" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	"gblV_SPG_BigMac_to_BK" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 6
	"gblV_SPG_BigMac_to_Fermentor" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	goto "End_UpdateSPG"
	if vV_Vessel_To == 7
	"gblV_SPG_BigMac_to_Radiator" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
//..............................................................
[BigMacToFrontway]
	"gblV_SPG_BigMac_to_BK" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
[From_Radiator]
"gblV_Sub3_Status" value = 150
[SectionBrewSub3_150]
wait "gblV_Sub3_Status" value == 150
print "@  1033 From Radiator set SPG to XX          "
	if vV_Vessel_To == 1
	"gblv_SPG_Rad_to_BigMac" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 3
	"gblV_SPG_Rad_to_MLT" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 4
	"gblv_SPG_Rad_to_BK_LM" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 5
	"gblV_SPG_BigMac_to_BK" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
//..............................................................
[From_MLT]
print "@  1043 From_MLT  set SPG to XX        "
	if vV_Vessel_To == 1
	"gblV_SPG_MLT_to_BigMac" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 2
	"gblV_SPG_MLT_to_Radiator" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 4
	"gblV_SPG_MLT_to_BK" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 5
	"gblV_SPG_MLT_to_BK" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 6
	"gblV_SPG_BigMac_to_Fermentor" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 7
	"gblV_SPG_BigMac_to_Radiator" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
//.....................................................................
[From_BrewKettle_or_Little Mac]
"gblV_Sub3_Status" value = 150
[SectionBrewSub3_150]
wait "gblV_Sub3_Status" value == 150
print "@  1034 From_BrewKettle_or_Little Mac  set SPG to XX      "
	if vV_Vessel_To == 1
	"gblV_SPG_BK_LM_to_BigMac" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 2
	"gblV_SPG_BK_LM_to_Radiator" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 3
	"gblV_SPG_BK_LM_to_MLT" = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
print 1088
	if vV_Vessel_To == 4
	"gblV_SPG_BK_X_LM" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 5
	"gblV_SPG_BK_X_LM" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 6
	"gblV_SPG_BK_to_Fermentor" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 7
	"gblV_SPG_BigMac_to_Radiator" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
//...................................................................
[From_BrewZilla]
"gblV_Sub3_Status" value = 152
[SectionBrewSub3_152]
wait "gblV_Sub3_Status" value == 152
	goto "End_UpdateSPG"
[From_PurplePump]
"gblV_Sub3_Status" value = 154
[SectionBrewSub3_154]
	goto "End_UpdateSPG"
wait "gblV_Sub3_Status" value == 154
[From_Manifold_Supply_Valve]
"gblV_Sub3_Status" value = 156
[SectionBrewSub3_156]
wait "gblV_Sub3_Status" value == 156
print "@  1065 From_Manifold_Supply_Valve  set SPG to XX           "
	if vV_Vessel_To == 1
	"gblV_SPG_ManifoldFill_BigMac" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 2
	"gblV_SPG_ManifoldFill_Radiator" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 3
	"gblV_SPG_Manifold_Fill_MLT" = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 4
	"gblV_SPG_Manifold_Fill_BK" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 5
	"gblV_SPG_Manifold_Fill_BK" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	if vV_Vessel_To == 6
	"gblV_SPG_ManifoldFill_Fermentor" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
	goto "End_UpdateSPG"
	if vV_Vessel_To == 7
	"gblV_SPG_BigMac_to_Radiator" value = vV_SPG_Calculated_Rate
	goto "End_UpdateSPG"
	endif
//............................................................
[End_UpdateSPG]
"gblV_Sub3_Status" value = 158
[SectionBrewSub3_158]
wait "gblV_Sub3_Status" value == 158
"gblV_Brew_Status" value = 8909
print "@  1135 End_UpdateSPG: SPG was Updated  8909     "
vSMsg = "The SPG Rate for the transfer from the "
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " has been updated to "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_SPG_Calculated_Rate
vSMsg = vSMsg + vSMsg1
vSMsg1 = " SPG Rate."
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_3" value = vSMsg 
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
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
 //............................................................
//Short Delay  
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
//........................................
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
goto "Check_Volume"
[KeepSPG]
"gblV_Sub3_Status" value = 160
[SectionBrewSub3_160]
wait "gblV_Sub3_Status" value == 160
print "@  1217 Keep SPG    160     "
vSMsg = "The SPG Rate for the transfer from the "
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " remains at "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_SPG_Orginal_Rate
vSMsg = vSMsg + vSMsg1
vSMsg1 = " SPG Rate."
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = vSMsg
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = true
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
goto "Check_Volume"
//..............................................................
[Rate_Good]
"gblV_Sub3_Status" value = 162
[SectionBrewSub3_162]
wait "gblV_Sub3_Status" value == 162
print "@ 1259 Rate Good 162"
vSMsg = "The SPG Rate for the transfer from the "
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is good."
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = vSMsg
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = true
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
goto "Check_Volume"
[Check_Volume]
"gblV_Sub3_Status" value = 164
[SectionBrewSub3_164]
wait "gblV_Sub3_Status" value == 164
print "@ 1288 (164) Check_Volume: vV_Volume_End = "
vV_Volume_Check_Delta = vV_Volume_End - vV_Desired_Fill_Vessel_Volume_End
	if vV_Volume_Check_Delta < 0
		vV_Volume_Check_Delta = vV_Volume_Check_Delta * -1
	endif
"gblVPrecision1" value = vV_Volume_Check_Delta
vV_Volume_Check_Delta = "gblVPrecision1" value 
print vV_Volume_End
print "vV_Desired_Fill_Vessel_Volume_End = "
print vV_Desired_Fill_Vessel_Volume_End
print "vV_Volume_Check_Delta = "
print vV_Volume_Check_Delta
//.................................................
start "inscpt_scr_Inner_Blue"
start "sub_4_scrSetSPG"
sleep 100
	if vB_Testing == true
		"gblS_Inter_Script" value =  "@ 1311 in sub_3_scrCalculateSPG > start: sub_4_scrSetSPG"
	sleep 101
	endif
wait "sw_Running_Script_C" state  == false
"gblV_Sub3_Status" value = 166
[SectionBrewSub3_166]
wait "gblV_Sub3_Status" value == 166
vV_Volume_Start_From = "gblV_Start_From" value
vV_Volume_Start_To =  "gblV_Start_To" value
vV_Vessel_Adjust_Start_Volume =  "gblV_Start_Adjust" value
//.................................................
//vV_New_Desired_Fill_Vessel_Volume_End = vV_Volume_End - vV_Volume_Check_Delta
"gblV_Sub3_Status" value = 168
[SectionBrewSub3_168]
wait "gblV_Sub3_Status" value == 168
	if vV_Vessel_Measure == vV_Vessel_To
		vV_Low = vV_Desired_Fill_Vessel_Volume_End - .2
		vV_High = vV_Desired_Fill_Vessel_Volume_End + .2
	endif
	if vV_Vessel_Measure == vV_Vessel_From
		vV_Low = vV_Desired_Fill_Vessel_Volume_End + .2
		vV_High = vV_Desired_Fill_Vessel_Volume_End - .2
	endif
print "@ 1331 vV_Desired_Fill_Vessel_Volume_End = "
print vV_Desired_Fill_Vessel_Volume_End 
print "vV_Low = "
print vV_Low
print "vV_High = "
print vV_High
"gblV_Sub3_Status" value = 170
[SectionBrewSub3_170]
wait "gblV_Sub3_Status" value == 170
	if vV_Vessel_Measure == vV_Vessel_To
		if vV_Volume_End > vV_High
		goto "HIGH"
		endif
		if vV_Volume_End < vV_Low
		goto "LOW"
		endif
		if  vV_Volume_End <= vV_High 
		if vV_Volume_End >= vV_Low 
		goto "VOLUME_GOOD"
		endif
		endif
	endif
"gblV_Sub3_Status" value = 172
[SectionBrewSub3_172]
wait "gblV_Sub3_Status" value == 172
if vV_Vessel_Measure == vV_Vessel_From
	if vV_Volume_End < vV_High
		goto "HIGH"
	endif
	if vV_Volume_End > vV_Low
		goto "LOW"
	endif
	if  vV_Volume_End >= vV_High 
	if vV_Volume_End <= vV_Low 
		goto "VOLUME_GOOD"
	endif
	endif
endif
[HIGH]
"gblV_Sub3_Status" value = 174
[SectionBrewSub3_174]
wait "gblV_Sub3_Status" value == 174
print "@ 1379 Volume High"
vSMsg = "The  "
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is overfilled by "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Check_Delta
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallon(s). You need to make a choice:  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = "\n1 = Accept the Higher Volume\n2 = Remove the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Check_Delta
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallon(s)."
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" value = vSMsg 
"gblSReportLabel_B1" value = "Make a Choice"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//.........................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Backgrounds
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text"  background = 2
//Visibility
"gblS_Brewery_Top_2" visibility = Visible
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
[Loop_Choice_High]
sleep 100
	if "gblVReport_B1" value == 1
		goto "High_OK"
	endif
	if "gblVReport_B1" value == 2
		goto "Remove_Extra"
	endif
	if "gblVReport_B1" value > 2
	"gblSReportLabel_B1" value = "1 or 2 Only"
		"gblVReport_B1" value = 0
	endif
goto "Loop_Choice_High"
[High_OK]
"gblV_Sub3_Status" value = 176
[SectionBrewSub3_176]
wait "gblV_Sub3_Status" value == 176
print "@ 1439 Hi Ok"
vSMsg = "The Volume in the  "
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is acceptable at "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_End 
if vV_Vessel_Adjust > 0
vSMsg1 = vV_Vessel_Adjust_End_Volume
endif
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.\nWait.  Will Auto Advance"
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = vSMsg
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = true
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
goto "End_sub_3_scrCalculateSPG"
//..............................................................
[Remove_Extra]
print " @1478 Remove Extra 178"
"gblV_Sub3_Status" value = 178
[SectionBrewSub3_178]
wait "gblV_Sub3_Status" value == 178
vSMsg = vV_Volume_Check_Delta
vSMsg1 = " gallon(s) need to be manually drained from the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". Be precise as you only get this one chance.  Independently measure the discard.    Click Extra Removed? when done."
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_swAllSwitch_Label_Text" value = "Extra Removed?"
//.........................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGounds
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibilty
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 999
wait "gblV_Brew_Status" value == 1000
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
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
print 1400
"gblS_Brewery_Top_2" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
 //............................................................
//Short Delay  7 seconds displayed 
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = visible
//........................................
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
//..............................................................
[Measure_High_Removed]
"gblV_Sub3_Status" value = 180
[SectionBrewSub3_180]
wait "gblV_Sub3_Status" value == 180
print "@ 1566 Measure_High_Removed             "
//.....................................................
"sw_Advance_Overide" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 2
vSMsg = "Measure the "
vSMsg1 = vS_Vessel_Measure
vSMsg = vSMsg + vSMsg1
"gblS_swAllSwitch_Label_Text" value = vSMsg
//............................................................
vSMsg = "Measure The "
vSMsg1 = vS_Vessel_to
vSMsg = vSMsg + vSMsg1
vSMsg1 = " once. Record the Volume. it should be "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Check_Delta
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons less than before."
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" value = vSMsg
vSMsg = vSMsg + vSMsg1
//................................................................................
vSMsg = "Stick or Measure  "
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Volume"
vSMsg = vSMsg + vSMsg1
"gblSReportLabel_B1" value = vSMsg
"gblVReport_B1" precision = 1
"gblVReport_B1" value = -99
vSMsg = vS_Vessel_To
vSMsg1 = " Estimated Volume = "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Start_To_End_Volume
vSMsg = vSMsg + vSMsg1
"gblS_BrewName_B1" value = vSMsg
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
"gblS_swAllSwitch_Label_Text" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblSReportLabel_B1" visibility = visible
wait "gblVReport_B1" value > -99
"gblVEndVolume_Water" value = "gblVReport_B1" value
vV_Volume_End = "gblVReport_B1" value
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
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
print 1648
"sw_Advance_Overide" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
//...................................................
"gblV_Sub3_Status" value = 182
[SectionBrewSub3_182]
wait "gblV_Sub3_Status" value == 182
	if vV_Vessel_To == 1
	"gblVCurrentBigMac_Volume" value = vV_Volume_End
	endif
	if vV_Vessel_To == 2
	"gblVCurrentRadiator_Volume" value = vV_Volume_End
	endif
	if vV_Vessel_To == 3
	"gblVCurrentMLT_Volume" value = vV_Volume_End
	endif
	if vV_Vessel_To == 4
	"gblVCurrentBrewKettle_Volume" value = vV_Volume_End
	endif
	if vV_Vessel_To == 5
	"gblVCurrentLittle_Volume" value = vV_Volume_End
	endif
	if vV_Vessel_To == 7
	"gblVCurrentBrewzilla_Volume" value = vV_Volume_End
	endif
goto "End_sub_3_scrCalculateSPG"
//.......................................................
goto "End_Check_Volume"
[LOW]
"gblV_Sub3_Status" value = 184
[SectionBrewSub3_184]
wait "gblV_Sub3_Status" value == 184
print "@ 1678 Volume LOW"
//Stike Volume Low All Strike Radiator
	if "gblV_Node_Red_Imported" value == 879
	if "gblVStartBrew" value == 18
		vSMsg = "The Volume of the Strike in the "
		vSMsg1 = vS_Vessel_Measure
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = " is only "
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = vV_Volume_End
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = " gallons. The amount needed is for the STRIKE is a minimum "
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = vV_Strike_Volume
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = " gallons.  You need to add  "
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = vV_Volume_Check_Delta
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = " gallons.  Wait.  Will Auto Advance."
		vSMsg = vSMsg + vSMsg1
		start "inscpt_scrClearB1_Brewery"
		sleep 100
		wait "sw_Running_Clear_B1" state == false
		"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
		"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
		"gblS_Top_Text" value = vSMsg
		// 5 Second Delay
		"gblV_Delay_Seconds" value = 5
		//Restore
		"sw_Restore_B1" state = false
		//only 1 true
		"sw_Use_Top_1" state = false
		"sw_Use_Top_2" state = false
		"sw_Use_Top_3" state = true
		//1 or None  true
		"sw_Use_Bottom_1" state = false
		"sw_Use_Bottom_3" state = false
		"sw_Use_Bottom_4" state = false
		start "inscpt_scrMessage_with_Delay"
		sleep 100
		wait "sw_Running_Short_Delay_Time" state == false
		wait "sw_Running_Message_with_Delay" state == false
		//........................................
		goto "Add_Extra"
	endif
	endif
//HERMs Bath Low
	if "gblV_Node_Red_Imported" value == 889
	if "gblVStartBrew" value == 148
		vSMsg = "The Volume of the HERMs in the "
		vSMsg1 = vS_Vessel_Measure
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = " is only "
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = vV_Volume_End
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = " gallons. The amount needed is for the HERMs Bath is a minimum "
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = 4.9
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = " gallons.  You need to add  "
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = vV_Volume_Check_Delta
		vSMsg1 = " gallons.  Wait.  Will Auto Advance."
		vSMsg = vSMsg + vSMsg1
		start "inscpt_scrClearB1_Brewery"
		sleep 100
		wait "sw_Running_Clear_B1" state == false
		"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
		"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
		"gblS_Top_Text" value = vSMsg
		// 5 Second Delay
		"gblV_Delay_Seconds" value = 5
		//Restore
		"sw_Restore_B1" state = false
		//only 1 true
		"sw_Use_Top_1" state = false
		"sw_Use_Top_2" state = false
		"sw_Use_Top_3" state = true
		//1 or None  true
		"sw_Use_Bottom_1" state = false
		"sw_Use_Bottom_3" state = false
		"sw_Use_Bottom_4" state = false
		start "inscpt_scrMessage_with_Delay"
		sleep 100
		wait "sw_Running_Short_Delay_Time" state == false
		wait "sw_Running_Message_with_Delay" state == false
		//........................................
		goto "Add_Extra"
	endif
	endif		
//.....................................
vSMsg = "The  "
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is underfilled by "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Check_Delta
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallon(s). You need to make a choice:  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = "\n1 = Accept the Lower Volume\n2 = Add an Additional "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Check_Delta
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallon(s)."
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" value = vSMsg 
"gblSReportLabel_B1" value = "Make a Choice"
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//.........................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Backgrounds
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblS_swAllSwitch_Label_Text"  background = 2
//Visibility
"gblS_Brewery_Top_2" visibility = Visible
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
[Loop_Choice_Low]
sleep 100
if "gblVReport_B1" value == 1
goto "Low_OK"
endif
if "gblVReport_B1" value == 2
goto "Add_Extra"
endif
if "gblVReport_B1" value > 2
"gblSReportLabel_B1" value = "1 or 2 Only"
"gblVReport_B1" value = 0
endif
goto "Loop_Choice_Low"
[Low_OK]
"gblV_Sub3_Status" value = 186
[SectionBrewSub3_186]
wait "gblV_Sub3_Status" value == 186
vSMsg = "The Volume in the  "
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is acceptable at "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_End
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.\nWait.  Will Auto Advance"
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = vSMsg
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = true
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
goto "End_sub_3_scrCalculateSPG"
//..............................................................
[Add_Extra]
"gblV_Sub3_Status" value = 188
[SectionBrewSub3_188]
wait "gblV_Sub3_Status" value == 188
vSMsg = vV_Volume_Check_Delta
vSMsg1 = " gallon(s) need to be added to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".   Click Add Additional?"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg 
"gblS_swAllSwitch_Label_Text" value = "Add Additional?"
//.........................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//BackGounds
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibilty
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 999
wait "gblV_Brew_Status" value == 1000
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
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
//............................................................
vV_Gal_to_Fill = vV_Volume_Check_Delta
goto "Redo_Add_Additional"
[VOLUME_GOOD]
"gblV_Sub3_Status" value = 190
[SectionBrewSub3_190]
wait "gblV_Sub3_Status" value == 190
print "@ 1932 Volume Good"
vSMsg = "The Volume in the  "
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = " is good at "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Volume_Measure
if vV_Vessel_To == vV_Vessel_Adjust
vSMsg1 = vV_Vessel_Adjust_End_Volume
endif
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.\nWait.  Will Auto Advance"
vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = vSMsg
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
//Restore
"sw_Restore_B1" state = false
//only 1 true
"sw_Use_Top_1" state = false
"sw_Use_Top_2" state = false
"sw_Use_Top_3" state = true
//1 or None  true
"sw_Use_Bottom_1" state = false
"sw_Use_Bottom_3" state = false
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
goto "End_sub_3_scrCalculateSPG"
//.............................................................
[End_Check_Volume]
[End_sub_3_scrCalculateSPG]
"gblV_Sub3_Status" value = 199
[SectionBrewSub3_199]
wait "gblV_Sub3_Status" value == 199
"sw_Flow_Flush_HERMs" state = false
print "@  1985 End_sub_3_scrCalculateSPG"  
if "gblVCurrentRadiator_Volume" value > 0
"sw_Status_DeadSpace_Radiator" state = true
endif
"gblVElaspedSeconds" value = 0
"gblV_Fermentor" value = 0
"gblV_Water_Status_saved" value = 0
"gblV_Valve_Status" value = 999
"sw_Flow_Set_Manual" state = false
"sw_Flow_Skip_Volumes" state = false
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
"gblVStartBrew" value = 0
sleep 100
	if vB_Testing == true
		"gblS_Inter_Script" value =  "ended: sub_3_scrCalculateSPG"
		sleep 101
	endif
clear
"sw_Running_Calculate_SPG" state = false
stop "sub_3_scrCalculateSPG"
```

## 77. sub_4_scrVolume_to_Time_TRANFER_SPG

Starts by itself: No · User can start or stop it: Yes · 677 lines

```text
//sub_4_scrVolume_to_Time_TRANFER_SPG Moddified 260905 16-45
//02/11/2026 13:07
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// All about the Water from scrBrew0
// Renamed  Moddified 260704 07-31
"sw_Running_Script_D" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
"gblS_Inter_Script" visibility = visible
start "step_scrTest_Time _Reset"
start "looper_scrBoilTimer_Reset"
"gblTValveDelay" value = 00:00:01
"gblS_Inter_Script" value = "started: sub_4_scrVolume_to_Time_TRANFER_SPG" 
sleep 100
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
new value vVSwitchNumber
vVSwitchNumber = "gblV_Water_Switch_Status_Water" value
print "Start of water Valve switch code = "
print vVSwitchNumber
print "................................................................."
if vVSwitchNumber == -9999
	goto "End_Water"
endif
new string vSBeerNameSave
vSBeerNameSave = "gblS_BrewName_B1" value
"gblS_BrewName_B1" value = "Water Script Running"
//...................................
//...................................
"insp_WaterCoverRight" visibility = visible
"sw_Status_Manifold_FillFermentor" visibility = hidden
"sw_Set_BigMac_Fermentor" visibility = hidden
"tmRadiator_B1" visibility = hidden
"tmBigMac_B1" visibility = hidden
//...................................
new value vVEndlessLoop
new string vSMsg
new string vSMsg1
new value vVVesselFrom
new value vVVesselFill
new value vVVesselMeasure
new string vSVesselFrom
new string vSVesselFill
new String vSVesselMeasure
new value vV_Isolation_Valve
new value vVStartVol
new value vVEndVol
new value vVAddedVol
new value vVVesselMax_To
new value vV_Current_Volume_Vessel_To
new value vV_Current_Volume_Vessel_From
new value vVMaxtoAdd
new value vV_Radiator_DeadSpace
new value vVPump
new value vVIsolationValve
new string vS_Isolation_Valve
new string vSMsg_Isolation
new bool vB_Invert_Measure
new string vS_Time_Display
new time vT_Set
new value vV_BrewStatus_Save
//.......................................
//new rate calculation
new value vV_G_per_Sec_W
new value vV_Seconds_W
new value vV_SecondsR_W
new value vV_Minutes_W
new value vVTimetoFill_W
new string vSMin_W
new string vSSec_W
new string vSTime_W
new string vS_TTL_Time_W
new value vV_EndVolume
new value vV_DeltaVolumev
new value vV_Gallon_to_Add
new value vVNewRate
new value vV_Fermentor_Filling
vVAddedVol precision = 5
vVNewRate precision = 5
"gblV_Sub4_Status" value = 4000
[SectionBrewSub4_4000]
wait "gblV_Sub4_Status" value == 4000
//................................
// Set Fermentor Filling
vV_Fermentor_Filling = "gblV_Fermentor" value
if "gblVCurrentRadiator_Volume" value > 0
"sw_Status_DeadSpace_Radiator" state = true
endif
//......................................................................
// Set DeadSpace Toggle & Deadspace
vV_Radiator_DeadSpace =  "glbV_Rad_Dead_Space" value
//..............................................................
vV_Gallon_to_Add = "gblV_Gals_to_Fill" value 
print " @93 vV_Gallon_to_Add Orginal Gallons to fill = "
print vV_Gallon_to_Add
//......................................................................
//Start of Process
//......................................................................
//Set Water Valve Status
	vVVesselFrom = "gblV_Vessel_From" value
	vVPump = "gblV_Pump" value
	vVVesselFill = "gblV_Vessel_To" value
	vVVesselMeasure = "gblV_Vessel_Measure" value
	vVIsolationValve = "gblV_Isolation_Valve" value
	vVVesselMax_To = "gblV_Strike_Vessel_Max_Volume_1" value
	vSVesselFill = "gblS_Vessel_To" value
	vSVesselFrom = "gblS_Vessel_From" value
	vV_Current_Volume_Vessel_To = "gblV_Start_To" value
	vV_Current_Volume_Vessel_From = "gblV_Start_From" value
	vVVesselMax_To = "gblV_Volume_Max" value
	vVStartVol = "gblVStartVolume_Water" value
	vVEndVol = "gblVEndVolume_Water" value
	if vVVesselFrom == vVVesselMeasure
	vB_Invert_Measure = true
	endif
//......................................................................
//Rates set in sub_4_scrSetSPG
//..........................................................................................
"gblV_Sub4_Status" value = 4002
[SectionBrewSub4_4002]
wait "gblV_Sub4_Status" value == 4002
[Fill Time]
print "@ 135 Section Fill Time  Vessel From = "
print vSVesselFrom
print "Vessel Fill = "
print vSVesselFill
print "Vessel Measure = "
print  vSVesselMeasure
print "Current Volume of Fill Vessel ="
print vV_Current_Volume_Vessel_To
print "Current Volume of From Vessel ="
print vV_Current_Volume_Vessel_From
print "Current Max to Fill of FillVessel ="
print vVVesselMax_To
print "Current Max = "
print vVMaxtoAdd
print "Start Volume = "
print vVStartVol
print "End  Volume = "
print vVEndVol
print "Pump Value = "
print vVPump
print "Isolation Valve Value = "
print vVIsolationValve
vSMsg = "From "
vSMsg1 = vSVesselFrom
vSMsg = vSMsg + vSMsg1
vSMsg1 = " Fill "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vSVesselFill
vSMsg = vSMsg + vSMsg1
vS_Time_Display = vSMsg
print "Timer Display ="
print vS_Time_Display
print "vV_Gallon_to_Add = "
print vV_Gallon_to_Add
vV_G_per_Sec_W =  "gblV_Rate" value
print "SPG Rate = "
print vV_G_per_Sec_W 
//......................................................
"gblV_Sub4_Status" value = 4004
[SectionBrewSub4_4004]
wait "gblV_Sub4_Status" value == 4004
print " @ 176 Waiting on sub_3_scrCalculateSPG  for gblV_Sub3_Status = 120"
wait "gblV_Sub3_Status" value == 120
//Calculate Seconds SPG
vV_Seconds_W = vV_G_per_Sec_W * vV_Gallon_to_Add
print "Seconds to Fill = "
print vV_Seconds_W
// Change to Seconds Time
vV_Minutes_W = vV_Seconds_W / 60
vV_Minutes_W = vV_Minutes_W - .5
"gblV_Precision_0" value = vV_Minutes_W
vV_Minutes_W = "gblV_Precision_0" value
vSMin_W = vV_Minutes_W
if vV_Minutes_W < 10
vSMin_W = "0" + vSMin_W
endif
vVTimetoFill_W = vV_Minutes_W * 60
vV_SecondsR_W = vV_Seconds_W - vVTimetoFill_W
"gblV_Precision_0" value = vV_SecondsR_W
vV_SecondsR_W =  "gblV_Precision_0" value
vSSec_W = vV_SecondsR_W
if vV_SecondsR_W < 10
vSSec_W = "0" + vSSec_W 
endif
vS_TTL_Time_W = "00:" + vSMin_W
vS_TTL_Time_W = vS_TTL_Time_W + ":"
vS_TTL_Time_W = vS_TTL_Time_W + vSSec_W
"gblT_SetTimer_Water" value = vS_TTL_Time_W
print "@175 Transfer time = "
print vS_TTL_Time_W
"gblV_Sub4_Status" value = 4006
[SectionBrewSub4_4006]
wait "gblV_Sub4_Status" value == 4006
//......................................
//......................................
//Return from sub_3_scrCalculateSPG to start Pumps
//......................................
//......................................
"gblV_Sub4_Status" value = 4008
[SectionBrewSub4_4008]
wait "gblV_Sub4_Status" value == 4008
print " @ 216 Waiting on sub_3_scrCalculateSPG  for gblV_Sub3_Status = 122"
wait "gblV_Sub3_Status" value == 122
sleep 100
[Pump_On]
print "@ 220 Turn On Pumps"
[Manifold_Valve_Open]
	if vVPump == 100
		print "@ 223 Manifold Supply Open"
		"VGC_36_do_ManifoldFill_On_B1" state = true
	goto "SectionBrewSub4_4010"
	endif
	if vVPump == 1
	print "@229 White Pump On"
	"MB_32_do_WhitePump_B1" state = true
	goto "SectionBrewSub4_4010"
	endif
	if vVPump == 2
		print "@ 234 Green Pump On"
		"MB_34_do_GreenPump_B1" state = true
		goto "SectionBrewSub4_4010"
	endif
	if vVPump == 3
		print "@ 239 Blue Pump On"
		"MB_33_do_BluePump_B1" state = true
		goto "SectionBrewSub4_4010"
	endif
	if vVPump == 4
		print "@244 Red Pump On"
		"MB_36_do_RedPump_B1" state = true
		goto "SectionBrewSub4_4010"
	endif
	if vVPump == 5
		print "@249 Yellow Pump On"
		"MB_35_do_YellowPump_B1" state = true
		goto "SectionBrewSub4_4010"
	endif
	if vVPump == 7
		//...............................
		//...............................
		start "inscpt_scrClearB1_Brewery"
		sleep 100
		wait "sw_Running_Clear_B1" state == false
		//...............................
		vSMsg = "The BrewZilla Pump Needs to be turned on.  "
		vSMsg1 = "Isolatation Valve(s) will operate Automaticly."
			if vVVesselFill == 8
				vSMsg1 = "The Manual Inlet Valve on the DigiBoil will be turned on next."
			endif
			if vVVesselFill == 9
				vSMsg1 = "The Manual Inlet Valve on the 20g MLT will be turned on next."
			endif
		vSMsg = vSMsg + vSMsg1
		"gblS_Top_Text" value =  vSMsg
		vSMsg = "There will be no transfer until other valves are opened. "
		"gblS_Bottom_Text" value = vSMsg
		"gblS_swAllSwitch_Label_Text" value = "Brewzilla Pump On?"
		//" set any switches sw_Flow_Flush_HERMs" state = true
		//........................
		start "inscpt_scrAdvancewithSwitch"
		//........................
		sleep 100
		// Manual Alarm
		"MB_28_do_ManualAlarm_B1" state = true
		"alm_Manual_Warning" fileindex = 3
		"alm_Manual_Warning" active = true
		wait "sw_Running_Advance_with_Switch" state == false
		//...............................
		//...............................
		"alm_Manual_Warning" active = true
		goto "SectionBrewSub4_4010"
	endif
//......................................................
	if vVPump == 9
		//...............................
		//...............................
		start "inscpt_scrClearB1_Brewery"
		sleep 100
		wait "sw_Running_Clear_B1" state == false
		//...............................
		vSMsg = "The Manual Purple Pump Needs to be turned on.  "
		vSMsg1 = "Isolatation Valve(s) will operate Automaticly."
			if vVVesselFill == 7
				vSMsg1 = "The Manual Inlet Valve on the Brewzilla will be turned on next."
			endif
			if vVVesselFill == 8
				vSMsg1 = "The Manual Inlet Valve on the DigiBoil will be turned on next."
			endif
			if vVVesselFill == 9
				vSMsg1 = "The Manual Inlet Valve on the 20g MLT will be turned on next."
			endif
		vSMsg = vSMsg + vSMsg1
		"gblS_Top_Text" value =  vSMsg
		vSMsg = "There will be no transfer until other valves are opened. "
		"gblS_Bottom_Text" value = vSMsg
		"gblS_swAllSwitch_Label_Text" value = "Purple Pump On?"
		//" set any switches sw_Flow_Flush_HERMs" state = true
		//........................
		start "inscpt_scrAdvancewithSwitch"
		//........................
		sleep 100
		// Manual Alarm
		"MB_28_do_ManualAlarm_B1" state = true
		"alm_Manual_Warning" fileindex = 3
		"alm_Manual_Warning" active = true
		wait "sw_Running_Advance_with_Switch" state == false
		//...............................
		//...............................
		"alm_Manual_Warning" active = true
		goto "SectionBrewSub4_4010"
	endif
//............................................
//............................................
[SectionBrewSub4_4010]
"gblV_Sub4_Status" value = 4010
wait "gblV_Sub4_Status" value == 4010
vV_Isolation_Valve = "gblV_Isolation_Valve" value
print "@ 331 SectionBrewSub4_4010 Isolation Valve Open Valve = " 
print vV_Isolation_Valve
	if vV_Isolation_Valve == 0
		vS_Isolation_Valve = "There is no Isolation Valve"
		print " @ 336 GOTO Skip_Isolation_Open"
		goto "Skip_Isolation_Open"
		else
		goto "Isolation_Valve_Open"
	endif
[Isolation_Valve_Open]
print "@339  Isolation_Valve_Open"
	if vV_Isolation_Valve == 1
		vS_Isolation_Valve = "Isolation Valves : White Pump Supply && Big Mac Tangental Valves Opened."
		"VGC_49_do_WhitePumpValve_On_B1" state = true
		"VGC_47_do_BigMacTangental_On_B1"  state = true
	endif
	if vV_Isolation_Valve == 2
		vS_Isolation_Valve = "Isolation Valve : Radiator Valve Opened."
		"VGC_32_do_RadiatorSupply_On_B1" state = true
	endif
	if vV_Isolation_Valve == 3
		vS_Isolation_Valve = "Isolation Valve : HERMs WORT (Sparge) Valve Opened."
		"VGC_13_do_HermsWort_On_B1" state = true
	endif
	if vV_Isolation_Valve == 4
		vS_Isolation_Valve = "Isolation Valves : Red Pump Supply && Brew Kettle Tangental Valves Opened."
		"VGC_3_do_RedPumpValve_On_B1" state = true
		"VGC_19_do_BrewKettleTangental_On_B1" state = true
	endif
	if vV_Isolation_Valve == 5
		vS_Isolation_Valve = "Isolation Valves : Yellow Pump Supply && Little Mac Tangental Valves Opened."
		"VGC_15_do_YellowPumpValve_On_B1" state = true
		"VGC_25_do_LittleMacTangental_ON_B1" state = true
	endif
	if vV_Isolation_Valve == 6
		vS_Isolation_Valve = "Isolation Valve : Ferment Fill Valve Opened."
		"VGC_5_do_FermentFill_On_B1" state = true
	endif
	if vV_Isolation_Valve == 7
		vS_Isolation_Valve = "Isolation Valve : Big Mac Isolation Valve Opened."
		"VGC_34_do_BigMac_Isolation_On_B1" state = true
	endif
	if vV_Isolation_Valve == 8
		vS_Isolation_Valve = "Isolation Valve : Left MLT Isolation Valve Opened."
		"VGC_7_do_Left_MLT_Isolation_On_B1" state = true
	endif
	if vV_Isolation_Valve == 9
		vS_Isolation_Valve = "Isolation Valve : Brew Kettle Isolation Valve Opened."
		"VGC_41_do_BrewKettleIsolation_On_B1" state = true
	endif
	if vV_Isolation_Valve == 10
		vS_Isolation_Valve = "Isolation Valve : Little Mac Isolation Valve Opened."
		"VGC_17_do_LittleMacIsolation_On_B1" state = true
	endif
	if vV_Isolation_Valve == 11
		vS_Isolation_Valve = "Isolation Valve : Back Left Manifold Valve Opened."
		"VGC_23_do_BackManifold_Left_On_B1" state = true
	endif
	if vV_Isolation_Valve == 12
		vS_Isolation_Valve = "Isolation Valve : Right MLT Isolation Valve Opened."
		"VGC_26_do_Right_MLT_Isolation_On_B1" state = true
	endif
	if vV_Isolation_Valve == 13
		vS_Isolation_Valve = "Isolation Valve : White Pump Supply Valve Opened."
		"VGC_49_do_WhitePumpValve_On_B1" state = true
	endif
	if vV_Isolation_Valve == 14
		vS_Isolation_Valve = "Isolation Valves : Blue Pump Supply && HERMs WORT Valves Opened."
		"VGC_8_do_BluePumpValve_On_B1" state = true
		"VGC_13_do_HermsWort_On_B1" state = true
	endif
//........................................................
//......................................................
[Skip_Isolation_Open]
"gblV_Sub4_Status" value = 4012
[SectionBrewSub4_4012]
wait "gblV_Sub4_Status" value == 4012
"glbS_Isolation_Valve" value = vS_Isolation_Valve
[Start_Water_Timers]
"gblV_Sub4_Status" value = 4014
[SectionBrewSub4_4014]
wait "gblV_Sub4_Status" value == 4014
print "@ 414 Brew Status = 4014 contine in sub_3_scrCalculateSPG  "
//............................................
//............................................
// Start Times in sub_3_scrCalculateSPG and wait to timers done gblV_Sub3_Status 126
//............................................
//............................................
wait "gblV_Sub3_Status" value == 126
"gblV_Sub4_Status" value = 4016
[SectionBrewSub4_4016]
wait "gblV_Sub4_Status" value == 4016
[Manifold_Valve_close]
	if vVVesselFrom == 100
		"VGC_36_do_ManifoldFill_On_B1" state = false
		vSMsg = "Manifold Supply Valve {MSV (Tap)} is closed.  "
		goto "SectionBrewSub4_4018"
	endif
[Pump_Off]
print "@ 430 Turn Off Pumps "
	if vVPump == 1
		"MB_32_do_WhitePump_B1" state = false
		vSMsg = "White Pump is off.  "
		goto "SectionBrewSub4_4018"
	endif
	if vVPump == 2
		"MB_34_do_GreenPump_B1" state = false
		vSMsg = "Green Pump is off.  "
		goto "SectionBrewSub4_4018"
	endif
	if vVPump == 3
		"MB_33_do_BluePump_B1" state = false
		vSMsg = "Blue Pump is off.  "
		goto "SectionBrewSub4_4018"
	endif
	if vVPump == 4
		"MB_36_do_RedPump_B1" state = false
		vSMsg = "Red Pump is off.  "
		goto "SectionBrewSub4_4018"
	endif
	if vVPump == 5
		"MB_35_do_YellowPump_B1" state = false
		vSMsg = "Yellow Pump is off.  "
		goto "SectionBrewSub4_4018"
	endif
	if vVPump == 7
		//...............................
		//...............................
		start "inscpt_scrClearB1_Brewery"
		sleep 100
		wait "sw_Running_Clear_B1" state == false
		//...............................
		vSMsg = "The BrewZilla Pump Needs to be turned OFF.  "
		"gblS_swAllSwitch_Label_Text" value = "Brewzilla Pump On?"
		vSMsg1 = "Isolatation Valve(s) will operate Automaticly."
			if vVVesselFill == 8
				vSMsg1 = "The Manual Inlet Valve on the DigiBoil needs to be OFF as well."
				"gblS_swAllSwitch_Label_Text" value = "Brewzilla Pump && DigiBoil Inlet Valve Off?"
			endif
			if vVVesselFill == 9
				vSMsg1 = "The Manual Inlet Valve on the 20g MLT needs to be OFF as well.."
				"gblS_swAllSwitch_Label_Text" value = "Brewzilla Pump && 20g MLT Inlet Valve Off?"
			endif
		vSMsg = vSMsg + vSMsg1
		"gblS_Top_Text" value =  vSMsg
		vSMsg = "Turn OFF Brewzilla Pump FIRST.  Close Blue Ball Valve on Brewzilla! "
		"gblS_Bottom_Text" value = vSMsg
			//........................
		start "inscpt_scrAdvancewithSwitch"
		//........................
		sleep 100
		// Manual Alarm
		"MB_28_do_ManualAlarm_B1" state = true
		"alm_Manual_Warning" fileindex = 3
		"alm_Manual_Warning" active = true
		wait "sw_Running_Advance_with_Switch" state == false
		//...............................
		//...............................
		"alm_Manual_Warning" active = true
		goto "SectionBrewSub4_4018"
	endif
//......................................................
	if vVPump == 9
		//...............................
		//...............................
		start "inscpt_scrClearB1_Brewery"
		sleep 100
		wait "sw_Running_Clear_B1" state == false
		//...............................
		vSMsg = "The Manual Purple Pump Needs to be turned OFF.  "
		vSMsg1 = "Isolatation Valve(s) will operate Automaticly."
		"gblS_swAllSwitch_Label_Text" value = "Purple Pump OFF?"
			if vVVesselFill == 7
				vSMsg1 = "The Manual Inlet Valve on the Brewzilla needs to be OFF as well."
				"gblS_swAllSwitch_Label_Text" value = "Purple Pump && Brewzilla Inlet Valve OFF?"
			endif
			if vVVesselFill == 8
				vSMsg1 = "The Manual Inlet Valve on the DigiBoil needs to be OFF as well."
				"gblS_swAllSwitch_Label_Text" value = "Purple Pump && DigiBoil Inlet Valve OFF?"
			endif
			if vVVesselFill == 9
				vSMsg1 = "The Manual Inlet Valve on the 20g MLT needs to be OFF as well."
				"gblS_swAllSwitch_Label_Text" value = "Purple Pump && 20g MLT Inlet Valve OFF?"
			endif
		vSMsg = vSMsg + vSMsg1
		"gblS_Top_Text" value =  vSMsg
		vSMsg = "Turn OFF Purple Pump First then the Manual Inlet Valve of the . "
		vSMsg1 = "gblS_Vessel_From" value
		vSMsg = vSMsg + vSMsg1
		vSMsg1 = " OFF Next!"
		vSMsg = vSMsg + vSMsg1
		"gblS_Bottom_Text" value = vSMsg
		//........................
		start "inscpt_scrAdvancewithSwitch"
		//........................
		sleep 100
		// Manual Alarm
		"MB_28_do_ManualAlarm_B1" state = true
		"alm_Manual_Warning" fileindex = 3
		"alm_Manual_Warning" active = true
		wait "sw_Running_Advance_with_Switch" state == false
		//...............................
		//...............................
		"alm_Manual_Warning" active = true
		goto "SectionBrewSub4_4018"
	endif	
[SectionBrewSub4_4018]
"gblV_Sub4_Status" value = 4018
wait "gblV_Sub4_Status" value == 4018	
vV_Isolation_Valve = "gblV_Isolation_Valve" value
	if vV_Isolation_Valve == 0
		vS_Isolation_Valve = "Isolation Valve: None."
		goto "Skip_Isolation_Close"
	else
		goto "Isolation_Valve_Close"
	endif
[Isolation_Valve_Close]
print "@ 549 Close Isolation Valves"
	if vV_Isolation_Valve == 1
		vS_Isolation_Valve = "Isolation Valves: White Pump Valve && Big Mac Tangental Closed."
		"VGC_49_do_WhitePumpValve_On_B1" state = false
		"VGC_47_do_BigMacTangental_On_B1"  state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 2
		vS_Isolation_Valve = "Isolation Valve: Radiator Supply Valve Closed."
		"VGC_32_do_RadiatorSupply_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 3
		"VGC_13_do_HermsWort_On_B1" state = false
		vS_Isolation_Valve = "Isolation Valve: HERMs WORT Valve Closed."
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 4
		vS_Isolation_Valve = "Isolation Valves: Red Pump Valve && Brew Kettle Tangental Closed."
		"VGC_3_do_RedPumpValve_On_B1" state = false
		"VGC_19_do_BrewKettleTangental_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 5
		vS_Isolation_Valve = "Isolation Valves: Yellow Pump Valve && Little Mac Tangental Closed."
		"VGC_15_do_YellowPumpValve_On_B1" state = false
		"VGC_25_do_LittleMacTangental_ON_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 6
		vS_Isolation_Valve = "Isolation Valve: Fermentor Fill Valve Closed."
		"VGC_5_do_FermentFill_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 7
		vS_Isolation_Valve = "Isolation Valve: Big Mac Isolation Valve Closed."
		"VGC_34_do_BigMac_Isolation_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 8
		vS_Isolation_Valve = "Isolation Valve : Left MLT Isolation Valve Closed."
		"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 9
		vS_Isolation_Valve = "Isolation Valve : Brew Kettle Isolation Valve Closed."
		"VGC_41_do_BrewKettleIsolation_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 10
		vS_Isolation_Valve = "Isolation Valve : Little Mac Isolation Valve Closed."
		"VGC_17_do_LittleMacIsolation_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 11
		vS_Isolation_Valve = "Isolation Valve : Back Left Manifold Valve Closed."
		"VGC_23_do_BackManifold_Left_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 12
		vS_Isolation_Valve = "Isolation Valve : Right MLT Isolation Valve Closed."
		"VGC_26_do_Right_MLT_Isolation_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 13
		vS_Isolation_Valve = "Isolation Valve : White Pump Valve Closed."
		"VGC_49_do_WhitePumpValve_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
	if vV_Isolation_Valve == 14
		vS_Isolation_Valve = "Isolation Valves : Blue Pump Supply && HERMs WORT (Sparge) Valve Valves Closed."
		"VGC_8_do_BluePumpValve_On_B1" state = false
		"VGC_13_do_HermsWort_On_B1" state = false
		goto "SectionBrewSub4_4020"
	endif
//........................................................
[SectionBrewSub4_4020]
"gblV_Sub4_Status" value = 4020
wait "gblV_Sub4_Status" value == 4020
[Isolation_Valve_Closed]
"glbS_Isolation_Valve" value = "Isolation Valves Closed."
[Skip_Isolation_Close]
"gblV_Sub4_Status" value = 4022
[SectionBrewSub4_4022]
wait "gblV_Sub4_Status" value == 4022
//..........................................................................................
print "@ 635 Convert the elasped time (tm_Water_Up) to seconds"
"gblV_Precision_0" value = 0
start "sub_5_scrTimetoSeconds"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value = "@ 637 in sub_4_scrVolume_to_Time_TRANFER_SPG > start: sub_5_scrTimetoSeconds" 
sleep 101
endif
wait "sw_Running_Script_C" state == false
wait "gblV_Precision_0" value > 0
vV_Seconds_W = "gblV_Precision_0" value
"gblV_Precision_0" value = 0
print "@ 647 Elsaped Seconds = "
print vV_Seconds_W
"gblVElaspedSeconds" value = vV_Seconds_W
//..........................................................................................
//............................................
//............................................
// After Calculating eleasped time Return to  sub_3_scrCalculateSPG
//............................................
//............................................
"gblV_Sub4_Status" value = 4024
[SectionBrewSub4_4024]
wait "gblV_Sub4_Status" value == 4024
goto "End_Water"
[End_Water]
[Calculate Rate]
print  " @ 431 vV_Seconds_W = "
print  vV_Seconds_W
	if vB_Testing == true
		"gblS_Inter_Script" value = "ended: sub_4_scrVolume_to_Time_TRANFER_SPG" 
		sleep 101
	endif
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblV_Sub4_Status" value = 4999
[SectionBrewSub4_4999]
wait "gblV_Sub4_Status" value == 4999
clear
"sw_Running_Script_D" state = false
stop "sub_4_scrVolume_to_Time_TRANFER_SPG"
```

## 78. sub_4_scrSetSPG

Starts by itself: No · User can start or stop it: No · 268 lines

```text
// sub_4_scrSetSPG
//05/18/2026 05:48
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// MODIFIED 05/18/2026 05:48
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vV_Vessel_From
new value vV_Vessel_To
new value vV_Vessel_Adjust
new value vV_Vessel_Measure 
new value vV_Radiator_DeadSpace
//............................................................................
vV_Vessel_From = "gblV_Vessel_From" value
vV_Vessel_To = "gblV_Vessel_To" value
vV_Vessel_Adjust = "glbV_Vessel_Adjust" value
vV_Vessel_Measure = "gblV_Vessel_Measure" value
vV_Radiator_DeadSpace = "glbV_Rad_Dead_Space" value
//............................................................................
"gblV_Rate" value = 0
//set SPG
//............................................................................
if vV_Vessel_From == 100
	if vV_Vessel_To == 1
	"gblV_Rate" value = "gblV_SPG_ManifoldFill_BigMac" value
	endif
	if vV_Vessel_To == 2
	"gblV_Rate" value = "gblV_SPG_ManifoldFill_Radiator" value
	endif
	if vV_Vessel_To == 3
	"gblV_Rate" value = "gblV_SPG_Manifold_Fill_MLT" value
	endif
	if vV_Vessel_To == 4
	"gblV_Rate" value = "gblV_SPG_Manifold_Fill_BK" value 
	endif
	if vV_Vessel_To == 5
	"gblV_Rate" value = "gblV_SPG_Manifold_Fill_BK" value 
	endif
	if vV_Vessel_To == 6
	"gblV_Rate" value = "gblV_SPG_ManifoldFill_Fermentor" value
	endif
	if vV_Vessel_To == 7
	"gblV_Rate" value = "gblV_SPG_Manifold_Brewzilla" value
	endif
	if vV_Vessel_To == 8
	"gblV_Rate" value = "gblV_SPG_Manifold_Brewzilla" value
	endif
	if vV_Vessel_To == 9
	"gblV_Rate" value = "gblV_SPG_Manifold_Brewzilla" value
	endif
endif
//............................................................................
if vV_Vessel_From == 1
"gblV_Start_From" value = "gblVCurrentBigMac_Volume" value
	if vV_Vessel_To == 2
	"gblV_Rate" value = "gblV_SPG_BigMac_to_Radiator" value
	endif
	if vV_Vessel_To == 3
		if "sw_Flow_Sparge_Flush" state == true
		"gblV_Rate" value = "gblV_SPG_BigMac_to_FlushHERMS" value
		else
		"gblV_Rate" value = "gblV_SPG_BigMac_to_MLT" value
		endif	
	endif
	if vV_Vessel_To == 4
		if "sw_Flow_Front_Way" state == true
		"gblV_Rate" value = "gblV_SPG_BigMac_to_BK (Front)" value
		else
		"gblV_Rate" value = "gblV_SPG_BigMac_to_BK" value 
		endif
	endif
	if vV_Vessel_To == 5
		if "sw_Flow_Front_Way" state == true
		"gblV_Rate" value = "gblV_SPG_BigMac_to_BK (Front)" value
		else
		"gblV_Rate" value = "gblV_SPG_BigMac_to_BK" value 
		endif
	endif
	if vV_Vessel_To == 6
	"gblV_Rate" value = "gblV_SPG_BigMac_to_Fermentor" value
	endif
endif
//............................................................................
if vV_Vessel_From == 2
"gblV_Start_From" value = "gblVCurrentRadiator_Volume" value
	if vV_Vessel_To == 1
	"gblV_Rate" value = "gblv_SPG_Rad_to_BigMac" value
	endif
	if vV_Vessel_To == 3
	"gblV_Rate" value = "gblV_SPG_Rad_to_MLT" value
		endif
	if vV_Vessel_To == 4
	"gblV_Rate" value = "gblv_SPG_Rad_to_BK_LM" value 
	endif
	if vV_Vessel_To == 5
	"gblV_Rate" value = "gblv_SPG_Rad_to_BK_LM" value 
	endif
endif
//............................................................................
if vV_Vessel_From == 3
"gblV_Start_From" value = "gblVCurrentMLT_Volume" value
	if vV_Vessel_To == 1
	"gblV_Rate" value = "gblV_SPG_MLT_to_BigMac" value
	endif
	if vV_Vessel_To == 2
	"gblV_Rate" value = "gblV_SPG_MLT_to_Radiator" value
	endif
	if vV_Vessel_To == 4
	"gblV_Rate" value = "gblv_SPG_Rad_to_BK_LM" value 
	endif
	if vV_Vessel_To == 5
	"gblV_Rate" value = "gblv_SPG_Rad_to_BK_LM" value 
	endif
endif
//............................................................................
if vV_Vessel_From == 4
"gblV_Start_From" value = "gblVCurrentBrewKettle_Volume" value
	if vV_Vessel_To == 1
	"gblV_Rate" value = "gblV_SPG_BK_LM_to_BigMac" value
	endif
	if vV_Vessel_To == 2
	"gblV_Rate" value = "gblV_SPG_BK_LM_to_Radiator" value
	endif
	if vV_Vessel_To == 3
	"gblV_Rate" value = "gblV_SPG_BK_LM_to_MLT" value
	endif
	if vV_Vessel_To == 5
	"gblV_Rate" value = "gblV_SPG_BK_X_LM" value 
	endif
	if vV_Vessel_To == 6
	"gblV_Rate" value = "gblV_SPG_BK_to_Fermentor" value
	endif
endif
//............................................................................
if vV_Vessel_From == 5
"gblV_Start_From" value = "gblVCurrentLittle_Volume" value
	if vV_Vessel_To == 1
	"gblV_Rate" value = "gblV_SPG_BK_LM_to_BigMac" value
	endif
	if vV_Vessel_To == 2
	"gblV_Rate" value = "gblV_SPG_BK_LM_to_Radiator" value
	endif
	if vV_Vessel_To == 3
	"gblV_Rate" value = "gblV_SPG_BK_LM_to_MLT" value
	endif
	if vV_Vessel_To == 4
	"gblV_Rate" value = "gblV_SPG_BK_X_LM" value 
	endif
	if vV_Vessel_To == 6
	"gblV_Rate" value = "gblV_SPG_BK_to_Fermentor" value
	endif
	if vV_Vessel_To == 7
	"gblV_Rate" value = "gblV_SPG_BK_to_Fermentor" value
	endif
endif
if vV_Vessel_From == 7
"gblV_Start_From" value = "gblVCurrentBrewzilla_Volume" value
	if vV_Vessel_To == 1
	"gblV_Rate" value = "gblV_SPG_Brewzilla_to_MLT" value
	endif
	if vV_Vessel_To == 3
	"gblV_Rate" value = "gblV_SPG_Brewzilla_to_MLT" value
	endif
	if vV_Vessel_To == 4
	"gblV_Rate" value = "gblV_SPG_Brewzilla_to_MLT" value
	endif
	if vV_Vessel_To == 5
	"gblV_Rate" value = "gblV_SPG_Brewzilla_to_MLT" value
	endif
	if vV_Vessel_To == 6
	"gblV_Rate" value = "gblV_SPG_Brewzilla_via_Plate_Chiller_to_Fermentor" value
	endif
endif
if vV_Vessel_From == 8
"gblV_Start_From" value = "gblVCurrentBrewzilla_Volume" value
	if vV_Vessel_To == 3
	"gblV_Rate" value = "gblV_SPG_Brewzilla_to_MLT" value
	endif
	if vV_Vessel_To == 6
	"gblV_Rate" value = "gblV_SPG_Brewzilla_via_Plate_Chiller_to_Fermentor" value
	endif
endif

//............................................................................
//............................................................................
	if vV_Vessel_To == 1
	"gblV_Start_To" value = "gblVCurrentBigMac_Volume" value
	endif
	if vV_Vessel_To == 2
	"gblV_Start_To" value = "gblVCurrentRadiator_Volume" value
		if "gblVCurrentRadiator_Volume" value > 0
		"sw_Status_DeadSpace_Radiator" state = true
		endif
		if "sw_Status_DeadSpace_Radiator" state == false
		"gblV_Start_To" value = "gblV_Start_To" value - vV_Radiator_DeadSpace
		endif
	endif
	if vV_Vessel_To == 3
		"gblV_Start_To" value = "gblVCurrentMLT_Volume" value
	endif
	if vV_Vessel_To == 4
	"gblV_Start_To" value = "gblVCurrentBrewKettle_Volume" value
print 160
new value x
x = "gblV_Start_To" value
print x
	endif
	if vV_Vessel_To == 5
		"gblV_Start_To" value = "gblVCurrentLittle_Volume" value
	endif
	if vV_Vessel_To == 7
	"gblV_Start_To" value = "gblVCurrentBrewzilla_Volume" value
	endif
//............................................................................
	if vV_Vessel_Adjust == 1
		"gblV_Start_Adjust" value = "gblVCurrentBigMac_Volume" value
	endif
	if vV_Vessel_Adjust == 2
	"gblV_Start_Adjust" value = "gblVCurrentRadiator_Volume" value
	endif
	if vV_Vessel_Adjust == 3
	"gblV_Start_Adjust" value = "gblVCurrentMLT_Volume" value
	endif
	if vV_Vessel_Adjust == 4
	"gblV_Start_Adjust" value = "gblVCurrentBrewKettle_Volume" value
	endif
	if vV_Vessel_Adjust == 5
	"gblV_Start_Adjust" value = "gblVCurrentLittle_Volume" value
	endif
	if vV_Vessel_Adjust == 7
	"gblV_Start_Adjust" value = "gblVCurrentBrewzilla_Volume" value
	endif
//............................................................................
//............................................................................
	if vV_Vessel_Measure == 1
	"gblVStartVolume_Water" value = "gblVCurrentBigMac_Volume" value
	endif
	if vV_Vessel_Measure == 2
	"gblVStartVolume_Water" value = "gblVCurrentRadiator_Volume" value
		if "sw_Status_DeadSpace_Radiator" state == false
		"gblVStartVolume_Water" value = "gblVStartVolume_Water" value - vV_Radiator_DeadSpace
		endif
	endif
	if vV_Vessel_Measure == 3
	"gblVStartVolume_Water" value = "gblVCurrentMLT_Volume" value
	endif
	if vV_Vessel_Measure == 4
	"gblVStartVolume_Water" value = "gblVCurrentBrewKettle_Volume" value
	endif
	if vV_Vessel_Measure == 5
	"gblVStartVolume_Water" value = "gblVCurrentLittle_Volume" value
	endif
	if vV_Vessel_Measure == 7
	"gblVStartVolume_Water" value = "gblVCurrentBrewzilla_Volume" value
	endif
//............................................................................
//............................................................................
 [End_Set_SPG]
if vB_Testing == true
"gblS_Inter_Script" value = "ended: sub_4_scrSetSPG"
sleep 4001
endif
clear
"sw_Running_Script_C" state  = false
stop "sub_4_scrSetSPG"
```

## 79. sub_5_scrTimetoSeconds

Starts by itself: No · User can start or stop it: No · 353 lines

```text
//sub_5_scrTimetoSeconds
//11/23/2025 11:46
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//  Changes a Timer Value to Seconds
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vVMin
vVMin precision = 0
new value vVMintoSeconds
vVMintoSeconds precision = 0
new time vTMin
new time vT_Remain
new value vVSec_Remain
vVSec_Remain precision = 0
new value vV_TTL_Seconds
vV_TTL_Seconds precision = 0
new time vT_Time_ELP
vT_Time_ELP = "tm_Water_Up" value
print vT_Time_ELP
[Minutes]
if vT_Time_ELP  <= 00:00:59
vVMin = 0
endif
if vT_Time_ELP  >= 00:01:00
vTMin = 00:01:00
vVMin = 1
endif
if vT_Time_ELP  >= 00:02:00
vVMin = 2
vTMin = 00:02:00
endif
if vT_Time_ELP  >= 00:03:00
vVMin = 3
vTMin = 00:03:00
endif
if vT_Time_ELP  >= 00:04:00
vVMin = 4
vTMin = 00:04:00
endif
if vT_Time_ELP  >= 00:05:00
vVMin = 5
vTMin = 00:05:00
endif
if vT_Time_ELP  >= 00:06:00
vVMin = 6
vTMin = 00:06:00
endif
if vT_Time_ELP  >= 00:07:00
vVMin = 7
vTMin = 00:07:00
endif
if vT_Time_ELP  >= 00:08:00
vVMin = 8
vTMin = 00:08:00
endif
if vT_Time_ELP  >= 00:09:00
vVMin = 9
vTMin = 00:09:00
endif
if vT_Time_ELP  >= 00:10:00
vVMin = 10
vTMin = 00:10:00
endif
if vT_Time_ELP  >= 00:11:00
vVMin = 11
vTMin = 00:11:00
endif
if vT_Time_ELP  >= 00:12:00
vVMin = 12
vTMin = 00:12:00
endif
if vT_Time_ELP  >= 00:13:00
vVMin = 13
vTMin = 00:13:00
endif
if vT_Time_ELP  >= 00:14:00
vVMin = 14
vTMin = 00:14:00
endif
if vT_Time_ELP  >= 00:15:00
vVMin = 15
vTMin = 00:15:00
endif
if vT_Time_ELP  >= 00:16:00
vVMin = 16
vTMin = 00:16:00
endif
if vT_Time_ELP  >= 00:17:00
vVMin = 17
vTMin = 00:17:00
endif
if vT_Time_ELP  >= 00:18:00
vVMin = 18
vTMin = 00:18:00
endif
if vT_Time_ELP  >= 00:19:00
vVMin = 19
vTMin = 00:19:00
endif
if vT_Time_ELP  >= 00:20:00
vVMin = 20
vTMin = 00:20:00
endif
if vT_Time_ELP  >= 00:21:00
vVMin = 21
vTMin = 00:21:00
endif
if vT_Time_ELP  >= 00:22:00
vVMin = 22
vTMin = 00:22:00
endif
if vT_Time_ELP  >= 00:23:00
vVMin = 23
vTMin = 00:23:00
endif
if vT_Time_ELP  >= 00:24:00
vVMin = 24
vTMin = 00:24:00
endif
if vT_Time_ELP  >= 00:25:00
vVMin = 25
vTMin = 00:25:00
endif
if vT_Time_ELP  >= 00:26:00
vVMin = 26
vTMin = 00:26:00
endif
if vT_Time_ELP  >= 00:27:00
vVMin = 27
vTMin = 00:17:00
endif
if vT_Time_ELP  >= 00:28:00
vVMin = 28
vTMin = 00:28:00
endif
if vT_Time_ELP  >= 00:29:00
vVMin = 29
vTMin = 00:29:00
endif
if vT_Time_ELP  >= 00:30:00
vVMin = 30
vTMin = 00:30:00
endif
print " Minutes ="
print vVMin
[Remained]
vT_Remain = vT_Time_ELP - vTMin
print "vT_Time_ELP = "
print vT_Time_ELP
print " vT_Remain = "
print vT_Remain
if vT_Remain >= 00:00:00
vVSec_Remain = 0
endif
if vT_Remain >= 00:00:01
vVSec_Remain = 1
endif
if vT_Remain >= 00:00:02
vVSec_Remain = 2
endif
if vT_Remain >= 00:00:03
vVSec_Remain = 3
endif
if vT_Remain >= 00:00:04
vVSec_Remain = 4
endif
if vT_Remain >= 00:00:05
vVSec_Remain = 5
endif
if vT_Remain >= 00:00:06
vVSec_Remain = 6
endif
if vT_Remain >= 00:00:07
vVSec_Remain = 7
endif
if vT_Remain >= 00:00:08
vVSec_Remain = 8
endif
if vT_Remain >= 00:00:09
vVSec_Remain = 9
endif
if vT_Remain >= 00:00:10
vVSec_Remain = 10
endif
if vT_Remain >= 00:00:11
vVSec_Remain = 11
endif
if vT_Remain >= 00:00:12
vVSec_Remain = 12
endif
if vT_Remain >= 00:00:13
vVSec_Remain = 13
endif
if vT_Remain >= 00:00:14
vVSec_Remain = 14
endif
if vT_Remain >= 00:00:15
vVSec_Remain = 15
endif
if vT_Remain >= 00:00:16
vVSec_Remain = 16
endif
if vT_Remain >= 00:00:17
vVSec_Remain = 17
endif
if vT_Remain >= 00:00:18
vVSec_Remain = 18
endif
if vT_Remain >= 00:00:19
vVSec_Remain = 19
endif
if vT_Remain >= 00:00:20
vVSec_Remain = 20
endif
if vT_Remain >= 00:00:21
vVSec_Remain = 21
endif
if vT_Remain >= 00:00:22
vVSec_Remain = 22
endif
if vT_Remain >= 00:00:23
vVSec_Remain = 23
endif
if vT_Remain >= 00:00:24
vVSec_Remain = 24
endif
if vT_Remain >= 00:00:25
vVSec_Remain = 25
endif
if vT_Remain >= 00:00:26
vVSec_Remain = 26
endif
if vT_Remain >= 00:00:28
vVSec_Remain = 28
endif
if vT_Remain >= 00:00:29
vVSec_Remain = 29
endif
if vT_Remain >= 00:00:30
vVSec_Remain = 30
endif
if vT_Remain >= 00:00:31
vVSec_Remain = 31
endif
if vT_Remain >= 00:00:32
vVSec_Remain = 32
endif
if vT_Remain >= 00:00:33
vVSec_Remain = 33
endif
if vT_Remain >= 00:00:34
vVSec_Remain = 34
endif
if vT_Remain >= 00:00:35
vVSec_Remain = 35
endif
if vT_Remain >= 00:00:36
vVSec_Remain = 36
endif
if vT_Remain >= 00:00:37
vVSec_Remain = 37
endif
if vT_Remain >= 00:00:38
vVSec_Remain = 38
endif
if vT_Remain >= 00:00:39
vVSec_Remain = 39
endif
if vT_Remain >= 00:00:40
vVSec_Remain = 40
endif
if vT_Remain >= 00:00:41
vVSec_Remain = 41
endif
if vT_Remain >= 00:00:42
vVSec_Remain = 42
endif
if vT_Remain >= 00:00:43
vVSec_Remain = 43
endif
if vT_Remain >= 00:00:44
vVSec_Remain = 44
endif
if vT_Remain >= 00:00:45
vVSec_Remain = 45
endif
if vT_Remain >= 00:00:46
vVSec_Remain = 46
endif
if vT_Remain >= 00:00:47
vVSec_Remain = 47
endif
if vT_Remain >= 00:00:48
vVSec_Remain = 48
endif
if vT_Remain >= 00:00:49
vVSec_Remain = 49
endif
if vT_Remain >= 00:00:50
vVSec_Remain = 50
endif
if vT_Remain >= 00:00:51
vVSec_Remain = 51
endif
if vT_Remain >= 00:00:52
vVSec_Remain = 52
endif
if vT_Remain >= 00:00:53
vVSec_Remain = 53
endif
if vT_Remain >= 00:00:54
vVSec_Remain = 54
endif
if vT_Remain >= 00:00:55
vVSec_Remain = 55
endif
if vT_Remain >= 00:00:56
vVSec_Remain = 56
endif
if vT_Remain >= 00:00:57
vVSec_Remain = 57
endif
if vT_Remain >= 00:00:58
vVSec_Remain = 58
endif
if vT_Remain >= 00:00:59
vVSec_Remain = 59
endif
// Add all seconds
vVMintoSeconds = vVMin * 60
//See the results
print "Time = "
print vT_Time_ELP
print "Minutes ="
print vVMin
print "Seconds of Timer ="
print vVSec_Remain
vVMintoSeconds = vVMin * 60
vV_TTL_Seconds = vVMintoSeconds + vVSec_Remain
print "Total Seconds = "
print vV_TTL_Seconds
"gblV_Precision_0" value = vV_TTL_Seconds
// do some math with seconds
if vB_Testing == true
"gblS_Inter_Script" value = "ended: sub_5_scrTimetoSeconds"
sleep 4001
endif
clear
"sw_Running_Script_C" state = false
stop "sub_5_scrTimetoSeconds"
```

## 80. looper_scrAutoSwitch

Starts by itself: No · User can start or stop it: Yes · 517 lines

```text
//looper_scrAutoSwitch
//08/09/2023 08:52
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Takes care of flow and buttons and switches
new value vVBrew
//modified 06/27/2026 17:50
[LoopAuto]
sleep 100
if "sw_Test_Switch" state == true
"sw_Test_Switch" state = false
start "TEST_a_Script"
endif
//Shut Off Radiator Body's  Volume is < 2 gallons
if "sw_Control_Radiator_Element" state == true
	if "gblVCurrentRadiator_Volume" value < 2
	"sw_Control_Radiator_Element" state = false
	"gblS_Brewery_Bottom_1" background = 2
	"gblS_Brewery_Bottom_1" value = "Radiator Body Heater is off due to the Radiator Volume being less than 1 gallons.   Will automaticlly close this message."
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 5000
	"gblS_Brewery_Bottom_1" visibility = hidden
	endif
endif
//.........................................................
//Shut Off Radiator Body's  Volume is < 1.5 gallons
if "MB_19_do_RIMS_Radiator_Control_B1" state == true
	if "gblVCurrentRadiator_Volume" value < 1.5
	"MB_19_do_RIMS_Radiator_Control_B1" state = false
	"gblS_Brewery_Bottom_1" background = 1
	"gblS_Brewery_Bottom_1" value = "RIMs Heater is off due to the Radiator Volume being less than 1.5 gallons.   Will automaticlly close this message."
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 5000
	"gblS_Brewery_Bottom_1" visibility = hidden
	endif
endif
//.........................................................

//Shut Off Big Mac is Volume is < 15 gallons
if "sw_Control_BigMac_Element" state == true
	if "gblVCurrentBigMac_Volume" value < 15
	"sw_Control_BigMac_Element" state = false
	"gblS_Brewery_Bottom_1" background = 1
	"gblS_Brewery_Bottom_1" value = "The Big Mac Heater is off due to the Big Mac Volume being less than 15 gallons.   Will automaticlly close this message."
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 5000
	"gblS_Brewery_Bottom_1" visibility = hidden
	endif
endif
//.........................................................
//Shut Off Big Mac is Volume is Forecast < 15 gallons
if "sw_Control_BigMac_Element" state == true
	if "sw_Flow_BigMacForecastLow" state == true
	"sw_Control_BigMac_Element" state = false
	"gblS_Brewery_Bottom_1" background = 1
	"gblS_Brewery_Bottom_1" value = "The Big Mac Heater is off off due to the Big Mac Volume being forecast as less than 15 gallons.   Will automaticlly close this message."
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 5000
	"gblS_Brewery_Bottom_1" visibility = hidden
	"sw_Flow_BigMacForecastLow" state = false
	endif
endif
if "sw_Flow_General_Reset" state == true
"sw_Flow_General_Reset" state = false
start "strt_2__Reset_General"
endif
if "sw_Advance_Overide" state == true
"sw_Advance_Overide" state = false
"tm_Water" value = 00:00:00
stop "tm_Water_Up"
stop "tm_Water"
stop "tmRadiator_B1"
stop "tmBigMac_B1"
stop "tm_Action_BottomRight_B1"
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_2"  value = "You have OverRode the transfer.  All Transfer has stopped!"
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
endif
if "sw_Set_Measure" state == true
"sw_Set_Measure" state = false
"gblV_Water_Switch_Status_Water" value = 1999
start "scrWater"
endif
//Stop floats
if "sw_Flow_Water_Float" state == true
"sw_Flow_Water_Float" state = false
"MB_40_di_Brewery_Float_Water" value =  On
"MB_41_di_Manifold_Float_Water" value =  On
sleep 500 
"MB_40_di_Brewery_Float_Water" value =  off
"MB_41_di_Manifold_Float_Water" value =  off
endif
// DINS
if "sw_DINs_Green" state == true 
"sw_DINs_Green" state = false
"MB_47_di_Green_DINS" value = On
endif
if "sw_DINs_Red" state == true 
"sw_DINs_Red" state = false
"MB_42_di_Red_DINS" value = On
endif
if "sw_DINs_Yellow" state == true 
"sw_DINs_Yellow" state = false
"MB_44_di_Yellow_DINS" value = On
endif
if "sw_DINs_Blue" state == true 
"sw_DINs_Blue" state = false
"MB_46_di_Blue_Dins" value = On
endif
if "sw_DINs_EmergencyOff" state == true 
"MB_43_di_EmergencyOff_DINS" value = On
"sw_DINs_EmergencyOff" state = false
endif
// HouseKeeping
if "sw_Advance_Hop_Delay" state == true
"sw_Advance_Hop_Delay" state = false
"tm_Delay_W1" value =  00:00:00:01
endif
if "check_sx_Exit_Loop" state == true
start "strt_6_End_All_Scripts"
"check_sx_Exit_Loop" state = false
endif
// switch + 1
//print "All Switch"
if "sw_Advance_ BrewStatus" state == true
vVBrew =  "gblV_Brew_Status" value
vVBrew  += 1
"gblV_Brew_Status" value = vVBrew
"sw_Advance_ BrewStatus" state = false
endif
if "gblV_Brew_Status" value > 1000
if "gblV_Brew_Status" value < 584
if "MB_59_10K_MashReturn_B1" value  <= 154
"gblVStartBrew" value = 101
print "154 reached!"
endif 
endif
endif 
if  "sw_Set_Stop_Water" state == true
"sw_Set_Stop_Water"  state =  false
"gblV_Water_Switch_Status_Water" value = 999
stop "scrWater"
start "scrWater"
endif
// Prime Pumps
if "sw_Set_PrimeAllPumps" state == true
"gblV_Water_Switch_Status_Water" value = 900
"gblV_Valve_Status" value = -1
"sw_Set_PrimeAllPumps" state = false
start "scrWater"
endif
//Floats
//...........................
// Firehose FLOAT
if "sw_Flow_FireHoseFloat" state == true
"gblV_Water_Switch_Status_Water" value = 1005
"gblV_Valve_Status" value = -1
"sw_Flow_FireHoseFloat" state = false
start "scrWater"
endif
// Manifold Use Float
if "sw_Flow_Manifold_Float" state == true
"gblV_Water_Switch_Status_Water" value = 2005
"gblV_Valve_Status" value = -1
"sw_Flow_Manifold_Float" state = false
start "scrWater"
endif
//Firehose
//...........................
if "sw_Set_FireHoseOff" state == true
"sw_Set_FireHoseOff" state = false
"VGC_30_do_FireHose_On_B1" state = false
"insp_FireHosePix" visibility = hidden
endif
// FireHose 1 minute
if "sw_Set_FireHose_1_Min" state == true
"gblV_Water_Switch_Status_Water" value = 1001
"gblV_Valve_Status" value = -1
"sw_Set_FireHose_1_Min" state = false
start "utility_FireHose_Manifold_Supply_Water"
endif
// FireHose 2 Minutes
//print "firehose 2"
if "sw_Set_FireHose_2_Min" state == true
"gblV_Water_Switch_Status_Water" value = 1002
"gblV_Valve_Status" value = -1
"sw_Set_FireHose_2_Min" state = false
start "utility_FireHose_Manifold_Supply_Water"
endif
//FireHose 20 seconds
//print "Firehose 20"
if "sw_Set_FireHose_20_Sec" state == true
"gblV_Water_Switch_Status_Water" value = 1003
"gblV_Valve_Status" value = -1
"sw_Set_FireHose_20_Sec" state = false
start "utility_FireHose_Manifold_Supply_Water"
endif
// Firehose Custom Time
//print "firehose Custom"
if "sw_Set_FireHose_Time" state == true
"gblV_Water_Switch_Status_Water" value = 1004
"gblV_Valve_Status" value = -1
"sw_Set_FireHose_Time" state = false
start "utility_FireHose_Manifold_Supply_Water"
endif
//Manifold
//...........................
// Manifold 1 minute
if "sw_Set_MSV_1_Min" state == true
"gblV_Water_Switch_Status_Water" value = 2001
"gblV_Valve_Status" value = -1
"sw_Set_MSV_1_Min" state = false
start "utility_FireHose_Manifold_Supply_Water"
endif
// Manifold 2 minutes
if "sw_Set_MSV_2_Min" state == true
"gblV_Water_Switch_Status_Water" value = 2002
"gblV_Valve_Status" value = -1
"sw_Set_MSV_2_Min" state = false
start "utility_FireHose_Manifold_Supply_Water"
endif
// Manifold 3 minutes
if "sw_Set_MSV_3_Min" state == true
"gblV_Water_Switch_Status_Water" value = 2003
"gblV_Valve_Status" value = -1
"sw_Set_MSV_3_Min" state = false
start "utility_FireHose_Manifold_Supply_Water"
endif
// Manifold Custmom Time
if "sw_Set_MSV_Time" state == true
"gblV_Water_Switch_Status_Water" value = 2004
"gblV_Valve_Status" value = -1
"sw_Set_MSV_Time" state = false
start "utility_FireHose_Manifold_Supply_Water"
endif
//Endless Overide
if "sw_Advance_Endless" state == true
"gblVEndlessLoop" value = "gblVEndlessLoop" value + 1
"sw_Advance_Endless" state = false
endif
// HERMs
if "sw_Manifold_MLT_HERMs" state == true
"gblV_Water_Switch_Status_Water" value = 299
"sw_Manifold_MLT_HERMs" state = false
start "scrWater"
endif
//....................................
//....................................
//....................................
//Timed Manifold from Switches with Gallons Set by You

//....................................
//Transfer from the Big Mac
//....................................
// XFER Big Mac to Radiator
if "sw_Manifold_BigMac_Radiator" state == true
"gblV_Water_Switch_Status_Water" value = 102
"sw_Manifold_BigMac_Radiator" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Big Mac to MLT
if "sw_Manifold_BigMac_MLT" state == true
"gblV_Water_Switch_Status_Water" value = 103
"sw_Manifold_BigMac_MLT" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Big Mac to Brew Kettle
if "sw_Manifold_BigMac_BK" state == true
"gblV_Water_Switch_Status_Water" value = 104
"sw_Manifold_BigMac_BK" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Big Mac to Little Mac
if "sw_Manifold_BigMac_LittleMac" state == true
"gblV_Water_Switch_Status_Water" value = 105
"sw_Manifold_BigMac_LittleMac" state = false
start "sub_2_scrValveOperation_Switch"
endif
//....................................
//Transfer from the Radiator
//....................................
// Xfer Radiator to Big Mac
if "sw_Manifold_Radiator_BigMac" state == true
"gblV_Water_Switch_Status_Water" value = 201
"sw_Manifold_Radiator_BigMac" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Radiator to MLT
if "sw_Manifold_Radiator_MLT" state == true
"gblV_Water_Switch_Status_Water" value = 203
"sw_Manifold_Radiator_MLT" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Radiator to Brew Kettle
if "sw_Manifold_Radiator_BK" state == true
"gblV_Water_Switch_Status_Water" value = 204
"sw_Manifold_Radiator_BK" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Radiator to Little Mac
if "sw_Manifold_Radiator_LittleMac" state == true
"gblV_Water_Switch_Status_Water" value = 205
"sw_Manifold_Radiator_LittleMac" state = false
start "sub_2_scrValveOperation_Switch"
endif
//....................................
//Transfer from the MLT
//....................................
// Xfer MLT to Big Mac
if "sw_Manifold_MLT_BigMac" state == true
"gblV_Water_Switch_Status_Water" value = 301
"sw_Manifold_MLT_BigMac" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer MLT to Radiator
if "sw_Manifold_MLT_Radiator" state == true
"gblV_Water_Switch_Status_Water" value = 302
"sw_Manifold_MLT_Radiator" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer MLT to Brew Kettle
if "sw_Manifold_MLT_BK" state == true
"gblV_Water_Switch_Status_Water" value = 304
"sw_Manifold_MLT_BK" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer MLT to Little Mac
if "sw_Manifold_MLT_LittleMac" state == true
"gblV_Water_Switch_Status_Water" value = 305
"sw_Manifold_MLT_LittleMac" state = false
start "sub_2_scrValveOperation_Switch"
endif
//....................................
//Transfer from the Brew Kettle
//....................................
// Xfer Brew Kettle to Big Mac
if "sw_Manifold_BK_BigMac" state == true
"gblV_Water_Switch_Status_Water" value = 401
"sw_Manifold_BK_BigMac" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Brew Kettle to Radiator
if "sw_Manifold_BK_Radiator" state == true
"gblV_Water_Switch_Status_Water" value = 402
"sw_Manifold_BK_Radiator" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Brew Kettle to MLT
if "sw_Manifold_BK_MLT" state == true
"gblV_Water_Switch_Status_Water" value = 403
"sw_Manifold_BK_MLT" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Brew Kettle to Little Mac
if "sw_Manifold_BK_Little_Mac" state == true
"gblV_Water_Switch_Status_Water" value = 405
"sw_Manifold_BK_Little_Mac" state = false
start "sub_2_scrValveOperation_Switch"
endif
//....................................
//Transfer from the Little Mac
//....................................
// Xfer Little Mac to Big Mac
if "sw_Manifold_LittleMac_Big_Mac" state == true
"gblV_Water_Switch_Status_Water" value = 501
"sw_Manifold_LittleMac_Big_Mac" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Little Mac to Radiator
if "sw_Manifold_LittleMac_Radiator" state == true
"gblV_Water_Switch_Status_Water" value = 502
"sw_Manifold_LittleMac_Radiator" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Little Mac to MLT
if "sw_Manifold_LittleMac_MLT" state == true
"gblV_Water_Switch_Status_Water" value = 503
"sw_Manifold_LittleMac_MLT" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Little Mac to Brew Kettle
if "sw_Manifold_LittleMac_BK" state == true
"gblV_Water_Switch_Status_Water" value = 504
"sw_Manifold_LittleMac_BK" state = false
start "sub_2_scrValveOperation_Switch"
endif
//....................................
// Fill Big Mac Gallons from Manifold
if "sw_Manifold_MSV_BigMac" state == true
"gblV_Water_Switch_Status_Water" value = 2001
"sw_Manifold_MSV_BigMac" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Fill Radiator Gallons from Manifold
if "sw_Manifold_MSV_Radiator" state == true
"gblV_Water_Switch_Status_Water" value = 2002
"sw_Manifold_MSV_Radiator" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Fill MLT from Manifold
if "sw_Manifold_MSV_MLT" state == true
"gblV_Water_Switch_Status_Water" value = 2003
"sw_Manifold_MSV_MLT" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Fill Brew Kettle from Manifold
if "sw_Manifold_MSV_BK" state == true
"gblV_Water_Switch_Status_Water" value = 2004
"sw_Manifold_MSV_BK" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Fill Little Mac from Manifold
if "sw_Manifold_MSV_LittleMac" state == true
"gblV_Water_Switch_Status_Water" value = 2005
"sw_Manifold_MSV_LittleMac" state = false
start "sub_2_scrValveOperation_Switch"
endif
//ManifoldFillFermentor
// Fill Fermentor Gallons from Manifold
if "sw_Manifold_MSV_Fermentor" state == true
"gblV_Water_Switch_Status_Water" value = 2006
"sw_Manifold_MSV_Fermentor" state = false
start "sub_2_scrValveOperation_Switch"
endif
//....................................
//....................................




// Flush HERMS from Big Mac
if "sw_Manifold_FlushHERMS_BigMac" state == true
"gblV_Water_Switch_Status_Water" value = 2
"sw_Manifold_FlushHERMS_BigMac" state = false
start "sub_2_scrValveOperation_Switch"
endif
// Xfer Sparge Big Mac to MLT
if "sw_Manifold_SpargeMLT_BigMac" state == true
"gblV_Water_Switch_Status_Water" value = 402
"sw_Manifold_SpargeMLT_BigMac" state = false
start "scrWater"
endif
// Xfer Strike Big Mac to MLT
if "sw_Status_StrikeBigMac_to_MLT" state == true
"gblV_Water_Switch_Status_Water" value = 404
"sw_Status_StrikeBigMac_to_MLT" state = false
start "scrWater"
endif
//....................................
//....................................
// HERMs
if "sw_Manifold_MLT_HERMs" state == true
"gblV_Water_Switch_Status_Water" value = 901
"sw_Manifold_MLT_HERMs" state = false
start "scrWater"
endif
if "sw_Manifold_BK_Fermentor" state == true
"gblV_Water_Switch_Status_Water" value = 902
"sw_Manifold_BK_Fermentor" state = false
start "scrWater"
endif
if "sw_Manifold_LittleMac_Fermentor" state == true
"gblV_Water_Switch_Status_Water" value = 904
"sw_Manifold_LittleMac_Fermentor" state = false
start "scrWater"
endif
if "sw_Manifold_LittleMac_Whirlpool_Cool" state == true
"gblV_Water_Switch_Status_Water" value = 905
"sw_Manifold_LittleMac_Whirlpool_Cool" state = false
start "scrWater"
endif

if "sw_Control_Burner_BK" state == false
"sw_Status_Burner_BK" state = false
"MB_24_do_BrewKettleBurner_B1" state = false
"MB_23_do_BrewKettleIgnitor_Wo1" state = false

endif
if "sw_Control_Burner_BK" state == true
if "sw_Status_Burner_BK" state == false
start "looper_BURNER_scrBrewKettleBurner"
endif
endif
if "sw_Restore_Redo_Hops" state == true
"sw_Restore_Redo_Hops" state = false
"gblVScriptFlow" value = 1000
start "Hops_1_Hop_Grouping"
endif
if "gblV_Num_Fermentors" value > 6
"gblV_Num_Fermentors" value = 0
"insp_Ferment2" displayname = "1 to 6 ONLY!  Re Enter a Valid Number!"
"insp_Ferment2" background = 2
sleep 5000
"insp_Ferment2" background = 1
"insp_Ferment2" displayname = "Fermentors can be filled in any order.  You may change the number of Fermentors!"
endif
if "sw_Flow_Ferment" state == true
if "gblV_Brew_Status" value ==  467
"gblV_Brew_Status" value =  468
endif
"sw_Flow_Ferment" state = false
show workspace "B1 Brewery"
endif
if "sw_Set_Change_Fermentor_Status" state == true
"sw_Flow_Return_Fermentaion" state = true
start "sub_scrFermentor_Set_Status"
"sw_Set_Change_Fermentor_Status" state = false
endif
clear
goto "LoopAuto"
```

## 81. looper_scrBackGrounds

Starts by itself: No · User can start or stop it: Yes · 685 lines

```text
//looper_scrBackGrounds
//07/26/2023 11:56
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// set backgrounds as needed
//Modified 06/26/2026 15:01
clear
new value  vVLabelBG
new string vSLabelV
new string vS_BeerName
new value vVBrewBack
new value vV_TempDelta
new value vV_TempMashReturn
new value vVDesiredMash
new value vV_BigMac_Temp
new value vV_Radiator_Temp
vV_BigMac_Temp precision = 1
vV_Radiator_Temp precision = 1
//Puts " " in value of inspections
new string vSBlank
vSBlank = " "
//...............................
[LoopBackground]
sleep 100
 //RIMs Temp
//if "MB_07_PID_Quadzilla_WO1" enabled == true
//"MB_58_10KRadiator_B1" visibility = visible
//else
//"MB_58_10KRadiator_B1" visibility = visible
//endif
//Temperatures on Heater Page
"vV_BigMac_Temp" = "MB_57_10kBigMac_B1" value
"vV_Radiator_Temp" = "MB_58_10KRadiator_B1" value
 // Cooling Water Temperature
if vVBrewBack > 499
if  vVBrewBack < 700
"MB_54_10K_Cool_B1" visibility = visible
"OneW_201_CooledWater_B1" visibility = visible
endif
endif
if vVBrewBack < 500
"MB_54_10K_Cool_B1" visibility = hidden
"OneW_201_CooledWater_B1" visibility = hidden
endif
if vVBrewBack > 699
"MB_54_10K_Cool_B1" visibility = hidden
"OneW_201_CooledWater_B1" visibility = hidden
endif
// Set Mash Delta
if vVBrewBack < 200
"MB_59_10K_MashReturn_B1" background = 4
"MB_60_10K_MLT_Out_B1" background = 4
"gblV_DeltaP1_B1" visibility = hidden
goto "SkipDelta"
endif
if vVBrewBack >= 300
"MB_59_10K_MashReturn_B1" background = 4
"MB_60_10K_MLT_Out_B1" background = 4
"gblV_DeltaP1_B1" visibility = hidden
goto "SkipDelta"
endif
if vVBrewBack > 199
if vVBrewBack < 300
"gblV_DeltaP1_B1" visibility = visible
vV_TempMashReturn = 154
//vV_TempMashReturn = "MB_59_10K_MashReturn_B1" value
vVDesiredMash = "gblV_Mash_1_Temp" value
"gblV_MLTSetpoint_P1_B1" value = vVDesiredMash
vV_TempDelta = vV_TempMashReturn - vVDesiredMash
"gblV_DeltaP1_B1" value = vV_TempDelta
	if vV_TempDelta  > 1
		"MB_59_10K_MashReturn_B1" background = 1
		"gblV_DeltaP1_B1"  background = 1
		goto "SkipDelta"
	endif
	if vV_TempDelta  < -1
		"MB_59_10K_MashReturn_B1" background = 3
		"gblV_DeltaP1_B1"  background = 3
		goto "SkipDelta"
	endif
	if vV_TempDelta  <= 1
	if vV_TempDelta  >= -1
		"MB_59_10K_MashReturn_B1" background = 2
		"gblV_DeltaP1_B1"  background = 2
		goto "SkipDelta"
	endif
	endif
endif
endif
[SkipDelta]
// PUMPS
// Yellow Pump
if "MB_35_do_YellowPump_B1" state == true
"insp_Pix_Yellow_Pump_B1" background = 2
"insp_YellowPump" visibility = visible
else
"insp_Pix_Yellow_Pump_B1" background = 1
"insp_YellowPump" visibility = hidden
endif
// Red Pump
if "MB_36_do_RedPump_B1" state == true
"insp_Pix_Red_Pump_B1" background = 2
"insp_RedPump" visibility = visible
else
"insp_Pix_Red_Pump_B1" background = 1
"insp_RedPump" visibility = hidden

endif
// Blue Pump
if "MB_33_do_BluePump_B1" state == true
"insp_Pix_Blue_Pump_B1" background = 2
"insp_BluePump" visibility = visible
else
"insp_Pix_Blue_Pump_B1" background = 1
"insp_BluePump" visibility = hidden
endif
//Green Pump
if "MB_34_do_GreenPump_B1" state == true
"insp_Pix_Green_Pump_B1" background = 2
"insp_GreenPump" visibility = visible
else
"insp_Pix_Green_Pump_B1" background = 1
"insp_GreenPump" visibility = hidden
endif
//White Pump
if "MB_32_do_WhitePump_B1" state == true
"insp_Pix_White_Pump_B1" background = 2
"insp_WhitePump" visibility = visible
else
"insp_Pix_White_Pump_B1" background = 1
"insp_WhitePump" visibility = hidden
endif
// Manual Alarm
if "MB_28_do_ManualAlarm_B1" state == true
"MB_28_do_ManualAlarm_B1" visibility = visible
else
"MB_28_do_ManualAlarm_B1" visibility = hidden
"alm_Manual_Warning" active = false
"alm_Hop_Delay_1" active = false
"alm_Hop_Delay_1" loop = false
"alm_Hop_Delay_1" background = 1 
"alm_Sound_2_W1" active = false
"alm_Manual_Warning" active = false
endif
// Heating elements
//Big Mac
if "sw_Status_BigMac_Heat_On" state == true
"sw_Status_BigMac_Heat_On" background = 2
else
"sw_Status_BigMac_Heat_On" background = 1
endif
if "sw_Control_BigMac_Element" state == true
"sw_Control_BigMac_Element" background = 2
else
"sw_Control_BigMac_Element" background = 1
endif
//Big MAC Element 
if "MB_17_do_BigMac2Contactor_Wo1" state == true
"MB_17_do_BigMac2Contactor_Wo1"  background = 2
else
"MB_17_do_BigMac2Contactor_Wo1"  background = 1
endif

if  "MB_05_PWM_BigMacElement2_WO1" enabled ==  true
//"MB_02_Hys_BigMacElement2_WO1"
"MB_05_PWM_BigMacElement2_WO1"  background = 2
"insp__BigMAC_Element_2_Pix_B1" background = 2
else
"MB_05_PWM_BigMacElement2_WO1"  background = 1
"insp__BigMAC_Element_2_Pix_B1" background = 1
endif
//RIMs
if "MB_19_do_RIMS_Radiator_Control_B1" state == true
"MB_19_do_RIMS_Radiator_Control_B1" background = 2
else
"MB_19_do_RIMS_Radiator_Control_B1" background = 1
endif
if "oldMB_15_do_QuadzillaContactor_Wo1" state == true
"oldMB_15_do_QuadzillaContactor_Wo1"  background = 2
else
"oldMB_15_do_QuadzillaContactor_Wo1"  background = 1
endif
//"MB_07_PID_Quadzilla_WO1"
if  "oldMB_07_PWM_Quadzilla_WO1" enabled ==  true
"oldMB_07_PWM_Quadzilla_WO1"  background = 2
"insp_RIMs_Pix_B1" background = 1
"insp_RIMs_Pix_B1" visibility = visible
else
"oldMB_07_PWM_Quadzilla_WO1"  background = 1
"insp_RIMs_Pix_B1" visibility = hidden
endif
//Radiator
if "MB_08_PWM_Radiator_WO1" enabled ==  true
//"MB_08_Hys_RadiatorElement_Wo1" 
"insp_Rad_Element_Pix_B1" background = 1
"insp_Rad_Element_Pix_B1" visibility = visible
"MB_08_PWM_Radiator_WO1"  background = 2
"insp_Rad_Blank" background = 2
else
"insp_Rad_Element_Pix_B1" visibility = hidden
"MB_08_PWM_Radiator_WO1"  background = 1
"insp_Rad_Blank" background = 1
endif
if "sw_Status_Radiator_Control" state == true
"sw_Status_Radiator_Control" background = 2
else
"sw_Status_Radiator_Control" background = 1
endif
if "sw_Control_Radiator_Element" state == true 
"sw_Control_Radiator_Element" background = 2
else
"sw_Control_Radiator_Element" background = 1
endif
//RIMs
if "sw_Control_RIMs_Element" state == true
"sw_Control_RIMs_Element" background = 2
else
"sw_Control_RIMs_Element" background = 1
endif

if "MB_14_do_RIMs_Contactor_Heat" state == true
"MB_14_do_RIMs_Contactor_Heat" background = 2
else
"MB_14_do_RIMs_Contactor_Heat" background = 1
endif
if "MB_09_PWM_RIMs_Heat" enabled == true
"MB_09_PWM_RIMs_Heat" background = 2
else
"MB_09_PWM_RIMs_Heat" background = 1
endif
if "sw_Control_RIMs_Element_Running" state == true
"sw_Control_RIMs_Element_Running" background = 2
else
"sw_Control_RIMs_Element_Running" background = 1
endif
// Floats
// FireHose Float
if "MB_40_di_Brewery_Float_Water" value == true
"MB_40_di_Brewery_Float_Water" background = 2
else 
"MB_40_di_Brewery_Float_Water" background = 1
endif
// Brew Kettle Burner
if "MB_24_do_BrewKettleBurner_B1" state == false
"MB_23_do_BrewKettleIgnitor_Wo1" state = false
"MB_24_do_BrewKettleBurner_B1" background = 1
goto "SkipBK"
endif
if "MB_24_do_BrewKettleBurner_B1" state == true
if "MB_23_do_BrewKettleIgnitor_Wo1" state == true
"MB_24_do_BrewKettleBurner_B1" background = 2
wait "MB_23_do_BrewKettleIgnitor_Wo1" state == false
endif
endif
if "MB_24_do_BrewKettleBurner_B1" state == true
"MB_24_do_BrewKettleBurner_B1" background = 3
endif
[SkipBK]
// Little Mac Burner
if "MB_25_do_LittleMacBurner_B1" state == false
"MB_22_do_LittleMacIgnitor_Wo1" state = false
"MB_25_do_LittleMacBurner_B1" background = 1
goto "SkipLM"
endif
if "MB_25_do_LittleMacBurner_B1" state == true
if "MB_22_do_LittleMacIgnitor_Wo1" state == true
"MB_25_do_LittleMacBurner_B1" background = 2
wait "MB_22_do_LittleMacIgnitor_Wo1" state == false
endif
endif
if "MB_25_do_LittleMacBurner_B1" state == true
"MB_25_do_LittleMacBurner_B1" background = 3
endif
[SkipLM]
//Valves
//RedPumpValve
if  "VGC_3_do_RedPumpValve_On_B1" state == true
"VGC_2_do_RedPumpValve_Off_V1"   state = false
"VGC_2_do_RedPumpValve_Off_V1"   background = 2
"VGC_3_do_RedPumpValve_On_B1"  background = 2
else
"VGC_2_do_RedPumpValve_Off_V1"   state = true
"VGC_2_do_RedPumpValve_Off_V1"   background = 1
"VGC_3_do_RedPumpValve_On_B1"  background = 1
endif
// FermentFill
if  "VGC_5_do_FermentFill_On_B1" state == true
"VGC_4_do_FermentFill_Off_V1"   state = false
"VGC_4_do_FermentFill_Off_V1"   background = 2
"VGC_5_do_FermentFill_On_B1"  background = 2
else
"VGC_4_do_FermentFill_Off_V1"   state = true
"VGC_4_do_FermentFill_Off_V1"   background = 1
"VGC_5_do_FermentFill_On_B1"  background = 1
endif
// Left_MLT_Isolation
if  "VGC_7_do_Left_MLT_Isolation_On_B1" state == true
"sw_Status_Manifold_HERMs" state = false
if "sw_Status_HERMs" state == true
vS_BeerName = "gblS_BrewName_B1" value
"gblS_BrewName_B1" value = "HERMs Manifold Stopped"
sleep 1000
"sw_Status_HERMs" state = false
"gblS_BrewName_B1" value = vS_BeerName
endif
"VGC_9_do_Left_MLT_Isolation_Off_V1"   state = false
"VGC_9_do_Left_MLT_Isolation_Off_V1"   background = 2
"VGC_7_do_Left_MLT_Isolation_On_B1"  background = 2
else
"VGC_9_do_Left_MLT_Isolation_Off_V1"   state = true
"VGC_9_do_Left_MLT_Isolation_Off_V1"   background = 1
"VGC_7_do_Left_MLT_Isolation_On_B1"  background = 1
endif
// Blue Pump Supply
if  "VGC_8_do_BluePumpValve_On_B1" state == true
"VGC_11_do_BluePumpValve_Off_V1"   state = false
"VGC_11_do_BluePumpValve_Off_V1"   background = 2
"VGC_8_do_BluePumpValve_On_B1"  background = 2
else
"VGC_11_do_BluePumpValve_Off_V1"   state = true
"sw_Status_Manifold_HERMs" state = false
if "sw_Status_HERMs" state == true
vS_BeerName = "gblS_BrewName_B1" value
"gblS_BrewName_B1" value = "HERMs Manifold Stopped"
sleep 1000
"sw_Status_HERMs" state = false
"gblS_BrewName_B1" value = vS_BeerName
endif
"VGC_11_do_BluePumpValve_Off_V1"   background = 1
"VGC_8_do_BluePumpValve_On_B1"  background = 1
endif
// HermsWort
if  "VGC_13_do_HermsWort_On_B1" state == true
"VGC_12_do_HermsWort_Off_V1"   state = false
"VGC_12_do_HermsWort_Off_V1"   background = 2
"VGC_13_do_HermsWort_On_B1"  background = 2
else
"VGC_12_do_HermsWort_Off_V1"   state = true
"sw_Status_Manifold_HERMs" state = false
if "sw_Status_HERMs" state == true
vS_BeerName = "gblS_BrewName_B1" value
"gblS_BrewName_B1" value = "HERMs Manifold Stopped"
sleep 1000
"sw_Status_HERMs" state = false
"gblS_BrewName_B1" value = vS_BeerName
endif
"VGC_12_do_HermsWort_Off_V1"   background = 1
"VGC_13_do_HermsWort_On_B1"  background = 1
endif
// YellowPumpValve
if  "VGC_15_do_YellowPumpValve_On_B1" state == true
"VGC_14_do_YellowPumpValve_Off_V1"   state = false
"VGC_14_do_YellowPumpValve_Off_V1"   background = 2
"VGC_15_do_YellowPumpValve_On_B1"  background = 2
else
"VGC_14_do_YellowPumpValve_Off_V1"   state = true
"VGC_14_do_YellowPumpValve_Off_V1"   background = 1
"VGC_15_do_YellowPumpValve_On_B1"  background = 1
endif
// LittleMacIsolation
if  "VGC_17_do_LittleMacIsolation_On_B1" state == true
"VGC_16_do_LittleMacIsolation_Off_V1"   state = false
"VGC_16_do_LittleMacIsolation_Off_V1"   background = 2
"VGC_17_do_LittleMacIsolation_On_B1" background = 2
else
"VGC_16_do_LittleMacIsolation_Off_V1"   state = true
"VGC_16_do_LittleMacIsolation_Off_V1"   background = 1
"VGC_17_do_LittleMacIsolation_On_B1" background = 1
endif
// BrewKettleTangental
if  "VGC_19_do_BrewKettleTangental_On_B1" state == true
"VGC_18_do_BrewKettleTangental_Off_V1"   state = false
"VGC_18_do_BrewKettleTangental_Off_V1"   background = 2
"VGC_19_do_BrewKettleTangental_On_B1"  background = 2
else
"VGC_18_do_BrewKettleTangental_Off_V1"   state = true
"VGC_18_do_BrewKettleTangental_Off_V1"   background = 1
"VGC_19_do_BrewKettleTangental_On_B1"  background = 1
endif
// Back Manifold 
if  "VGC_23_do_BackManifold_Left_On_B1" state == true
"sw_Status_Manifold_BigMac_Heat" state = false
"VGC_22_do_BackManifold_Left_Off_V1"   state = false
"VGC_22_do_BackManifold_Left_Off_V1"   background = 2
"VGC_23_do_BackManifold_Left_On_B1" background = 2
else
"VGC_22_do_BackManifold_Left_Off_V1"   state = true
"VGC_22_do_BackManifold_Left_Off_V1"   background = 1
"VGC_23_do_BackManifold_Left_On_B1" background = 1
endif
// LittleMacTangental
if  "VGC_25_do_LittleMacTangental_ON_B1" state == true
"VGC_24_do_LittleMacTangental_Off_V1"   state = false
"VGC_24_do_LittleMacTangental_Off_V1"   background = 2
"VGC_25_do_LittleMacTangental_ON_B1"  background = 2
else
"VGC_24_do_LittleMacTangental_Off_V1"   state = true
"VGC_24_do_LittleMacTangental_Off_V1"   background = 1
"VGC_25_do_LittleMacTangental_ON_B1"  background = 1
endif
// Right_MLT_Isolation
if  "VGC_26_do_Right_MLT_Isolation_On_B1" state == true
"sw_Status_Manifold_HERMs" state = false
if "sw_Status_HERMs" state == true
vS_BeerName = "gblS_BrewName_B1" value
"gblS_BrewName_B1" value = "HERMs Manifold Stopped"
sleep 1000
"sw_Status_HERMs" state = false
"gblS_BrewName_B1" value = vS_BeerName
endif
"VGC_27_do_Right_MLT_Isolation_Off_V1"   state = false
"VGC_27_do_Right_MLT_Isolation_Off_V1"   background = 2
"VGC_26_do_Right_MLT_Isolation_On_B1"  background = 2
else
"VGC_27_do_Right_MLT_Isolation_Off_V1"   state = true
"VGC_27_do_Right_MLT_Isolation_Off_V1"   background = 1
"VGC_26_do_Right_MLT_Isolation_On_B1"  background = 1
endif
// CrossManifold
if  "VGC_28_do_CrossManifold_On_B1" state == true
"VGC_29_do_CrossManifold_Off_V1"   state = false
"VGC_29_do_CrossManifold_Off_V1"   background = 2
"VGC_28_do_CrossManifold_On_B1"  background = 2
else
"VGC_29_do_CrossManifold_Off_V1"   state = true
"VGC_29_do_CrossManifold_Off_V1"   background = 1
"VGC_28_do_CrossManifold_On_B1"  background = 1
endif
//FireHose
if  "VGC_30_do_FireHose_On_B1" state == true
"VGC_31_do_FireHose_Off_V1"   state = false
"VGC_31_do_FireHose_Off_V1"   background = 2
"VGC_30_do_FireHose_On_B1"  background = 2
"insp_FireHosePix" background = 1
"insp_Firehouse_Water" background = 1
"insp_Firehouse_Water" visibility = visible
"sw_Set_BigMac_Fermentor" visibility = hidden
"sw_Manifold_MSV_Fermentor" visibility = hidden
"insp_FireHosePix" visibility = visible
"sw_Set_FireHoseOff" visibility = visible
else
"VGC_31_do_FireHose_Off_V1"   state = true
"VGC_31_do_FireHose_Off_V1"   background = 1
"VGC_30_do_FireHose_On_B1"  background = 1
"insp_Firehouse_Water" visibility = hidden
"sw_Set_FireHoseOff" visibility = hidden
if  "VGC_36_do_ManifoldFill_On_B1" state == true
"sw_Set_BigMac_Fermentor" visibility = hidden
"sw_Manifold_MSV_Fermentor" visibility = hidden
else
"sw_Set_BigMac_Fermentor" visibility = visible
"sw_Manifold_MSV_Fermentor" visibility = visible
endif
endif
//RadiatorSupply
if  "VGC_32_do_RadiatorSupply_On_B1" state == true
"sw_Status_Manifold_HERMs" state = false
if "sw_Status_HERMs" state == true
vS_BeerName = "gblS_BrewName_B1" value
"gblS_BrewName_B1" value = "HERMs Manifold Stopped"
sleep 1000
"sw_Status_HERMs" state = false
"gblS_BrewName_B1" value = vS_BeerName
endif
"VGC_33_do_RadiatorSupply_Off_V1"   state = false
"VGC_33_do_RadiatorSupply_Off_V1"   background = 2
"VGC_32_do_RadiatorSupply_On_B1"  background = 2
else
"VGC_33_do_RadiatorSupply_Off_V1"   state = true
"VGC_33_do_RadiatorSupply_Off_V1"   background = 1
"VGC_32_do_RadiatorSupply_On_B1"  background = 1
endif
// BigMac_Isolation
if  "VGC_34_do_BigMac_Isolation_On_B1" state == true
"sw_Status_Manifold_BigMac_Heat" state = false
"VGC_35_do_BigMac_Isolation_Off_V1"   state = false
"VGC_35_do_BigMac_Isolation_Off_V1"   background = 2
"VGC_34_do_BigMac_Isolation_On_B1"  background = 2
else
"VGC_35_do_BigMac_Isolation_Off_V1"   state = true
"VGC_35_do_BigMac_Isolation_Off_V1"   background = 1
"VGC_34_do_BigMac_Isolation_On_B1"  background = 1
endif
// ManifoldFill
if  "VGC_36_do_ManifoldFill_On_B1" state == true
"VGC_37_do_ManifoldFill_Off_V1"   state = false
"VGC_37_do_ManifoldFill_Off_V1"   background = 2
"VGC_36_do_ManifoldFill_On_B1"  background = 2
"insp_Manifold_Water" visibility = visible
"sw_Set_BigMac_Fermentor" visibility = hidden
"sw_Manifold_MSV_Fermentor" visibility = hidden
else
"VGC_37_do_ManifoldFill_Off_V1"   state = true
"VGC_37_do_ManifoldFill_Off_V1"   background = 1
"VGC_36_do_ManifoldFill_On_B1"  background = 1
"insp_Manifold_Water" visibility = hidden
if  "VGC_30_do_FireHose_On_B1" state == true
"sw_Set_BigMac_Fermentor" visibility = hidden
"sw_Manifold_MSV_Fermentor" visibility = hidden
else
"sw_Set_BigMac_Fermentor" visibility = visible
"sw_Manifold_MSV_Fermentor" visibility = visible
endif
endif

//goto "Skip_BD"
//Back Drain
if  "VGC_39_Back_Drain_On_B1" state == true
"VGC_38_Back_Drain_Off_V1"   state = false
"VGC_39_Back_Drain_On_B1"   background = 1
"VGC_38_Back_Drain_Off_V1"  background = 1
else
"VGC_38_Back_Drain_Off_V1"   state = true
"VGC_39_Back_Drain_On_B1"   background = 2
"VGC_38_Back_Drain_Off_V1"  background = 2
endif
[Skip_BD]
//BrewKettleIsolation
if  "VGC_41_do_BrewKettleIsolation_On_B1" state == true
"VGC_40_do_BrewKettleIsolation_Off_V1"   state = false
"VGC_40_do_BrewKettleIsolation_Off_V1"   background = 2
"VGC_41_do_BrewKettleIsolation_On_B1"  background = 2
else
"VGC_40_do_BrewKettleIsolation_Off_V1"   state = true
"VGC_40_do_BrewKettleIsolation_Off_V1"   background = 1
"VGC_41_do_BrewKettleIsolation_On_B1"  background = 1
endif
//Cooling Water
if  "VGC_43_do_CoolingWater_On_B1" state == true
"VGC_42_do_CoolingWater_OFF_V1"   state = false
"VGC_42_do_CoolingWater_OFF_V1"   background = 2
"VGC_43_do_CoolingWater_On_B1"  background = 2
else
"VGC_42_do_CoolingWater_OFF_V1"   state = true
"VGC_42_do_CoolingWater_OFF_V1"   background = 1
"VGC_43_do_CoolingWater_On_B1"  background = 1
endif
//RadiatorTangental
if  "VGC_45_do_RadiatorTangental_On_B1" state == true
"VGC_44_do_RadiatorTangental_Off_V1"   state = false
"VGC_44_do_RadiatorTangental_Off_V1"   background = 2
"VGC_45_do_RadiatorTangental_On_B1"  background = 2
else
"VGC_44_do_RadiatorTangental_Off_V1"   state = true
"sw_Status_Manifold_HERMs" state = false
if "sw_Status_HERMs" state == true
vS_BeerName = "gblS_BrewName_B1" value
"gblS_BrewName_B1" value = "HERMs Manifold Stopped"
sleep 1000
"sw_Status_HERMs" state = false
"gblS_BrewName_B1" value = vS_BeerName
endif
"VGC_44_do_RadiatorTangental_Off_V1"   background = 1
"VGC_45_do_RadiatorTangental_On_B1"  background = 1
endif
//BigMacTangental
if  "VGC_47_do_BigMacTangental_On_B1" state == true
"VGC_46_do_BigMacTangental_Off_V1"   state = false
"VGC_46_do_BigMacTangental_Off_V1"   background = 2
"VGC_47_do_BigMacTangental_On_B1"  background = 2
else
"VGC_46_do_BigMacTangental_Off_V1"   state = true
"sw_Status_Manifold_BigMac_Heat" state = false
"VGC_46_do_BigMacTangental_Off_V1"   background = 1
"VGC_47_do_BigMacTangental_On_B1"  background = 1
endif
//WhitePumpValve
if  "VGC_49_do_WhitePumpValve_On_B1" state == true
"VGC_48_do_WhitePumpValve_Off_V1"   state = false
"VGC_48_do_WhitePumpValve_Off_V1"   background = 2
"VGC_49_do_WhitePumpValve_On_B1"  background = 2
else
"VGC_48_do_WhitePumpValve_Off_V1"   state = true
"sw_Status_Manifold_BigMac_Heat" state = false
"VGC_48_do_WhitePumpValve_Off_V1"   background = 1
"VGC_49_do_WhitePumpValve_On_B1"  background = 1
endif
// Alarms
if "alm_Hops_1_ALARM" active == true
"MB_28_do_ManualAlarm_B1" state = true
endif
//..............................................................................
// Valve Switches Start 
//..............................................................................
//Radiator Heat Manifold
if "VGC_45_do_RadiatorTangental_On_B1" state == true
if "VGC_32_do_RadiatorSupply_On_B1" state == false
"sw_Status_Manifold_Rad_Heat" state = true
endif
endif
if "VGC_45_do_RadiatorTangental_On_B1" state == false
"sw_Status_Manifold_Rad_Heat" state = false
endif
if "VGC_32_do_RadiatorSupply_On_B1" state == true
"sw_Status_Manifold_Rad_Heat" state = false
endif
if "sw_Status_Manifold_Rad_Heat" state == true
"sw_Status_Manifold_Rad_Heat" background = 1
else
"sw_Status_Manifold_Rad_Heat" background = 2
endif
//..............................................................................
// Big Mac Manifold Heat ?
if "VGC_47_do_BigMacTangental_On_B1" state == true
if "VGC_49_do_WhitePumpValve_On_B1" state == true
if "VGC_34_do_BigMac_Isolation_On_B1" state == false
if "VGC_23_do_BackManifold_Left_On_B1" state == false
if "VGC_28_do_CrossManifold_On_B1" state == false
"sw_Status_Manifold_BigMac_Heat" state = true
endif
endif
endif
endif
endif
if "sw_Status_Manifold_BigMac_Heat" state == true
"sw_Status_Manifold_BigMac_Heat" background = 1
else
"sw_Status_Manifold_BigMac_Heat" background = 2
endif
if "VGC_47_do_BigMacTangental_On_B1" state == false
"sw_Status_Manifold_BigMac_Heat" state = false
endif
if "VGC_49_do_WhitePumpValve_On_B1" state == false
"sw_Status_Manifold_BigMac_Heat" state = false
endif
if "VGC_34_do_BigMac_Isolation_On_B1" state == true
"sw_Status_Manifold_BigMac_Heat" state = false
endif
if "VGC_23_do_BackManifold_Left_On_B1" state == true
"sw_Status_Manifold_BigMac_Heat" state = false
endif
if "VGC_28_do_CrossManifold_On_B1" state == true
"sw_Status_Manifold_BigMac_Heat" state = false
endif
//............................................................

//Recycle MLT Manifold
if "VGC_7_do_Left_MLT_Isolation_On_B1" state == false
if "VGC_13_do_HermsWort_On_B1" state == true
if "VGC_8_do_BluePumpValve_On_B1" state == true
if "VGC_7_do_Left_MLT_Isolation_On_B1" state == false
"sw_Status_Manifold_Recyle_MLT" state = true
endif
endif
endif
endif
if "VGC_7_do_Left_MLT_Isolation_On_B1" state == true
"sw_Status_Manifold_Recyle_MLT" state = false
endif
if "VGC_13_do_HermsWort_On_B1" state == false
"sw_Status_Manifold_Recyle_MLT" state = false
endif
if "VGC_8_do_BluePumpValve_On_B1" state == false
"sw_Status_Manifold_Recyle_MLT" state = false
endif
if "VGC_7_do_Left_MLT_Isolation_On_B1" state == true
"sw_Status_Manifold_Recyle_MLT" state = false
endif
//..............................................................................
// Manifold set for HERMS
if "sw_Status_Manifold_Recyle_MLT" state == true
if "sw_Status_Manifold_Rad_Heat" state == true
"sw_Status_Manifold_HERMs" state = true
endif
endif
if "sw_Status_Manifold_Recyle_MLT" state == false
"sw_Status_Manifold_HERMs" state = false
endif
if "sw_Status_Manifold_Rad_Heat" state == false
"sw_Status_Manifold_HERMs" state = false
endif
//..............................................................................
// Valve Switches END 
//...........................
if "gblV_Number_Strike_Vessels" value == 1
"gblV_Strike_Vessel_2" visibility = hidden
"gblV_2nd_Strike_Volume" visibility = hidden
endif
//........................................................................
if "gblV_Number_Strike_Vessels" value == 2
"gblV_Strike_Vessel_2" visibility = visible
"gblV_2nd_Strike_Volume" visibility = visible
endif
//....................
goto "LoopBackground"
```

## 82. looper_scrAutoSwitch_Hops

Starts by itself: No · User can start or stop it: Yes · 326 lines

```text
//looper_scrAutoSwitch_Hops
//08/09/2023 08:52
//Broken out from scrAutoSwitch 06/27/2026 17:55
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Takes care of Hops flow and buttons and switches
//modified 06/27/2026 18:05
[LoopAuto_Hop]
// Hop Switches
if "sw_Use_Hop1_Batch" state == true
if "gblV_Hop1_Group_R1" value == 0
"sw_Use_Hop1_Batch" state = false
"gblS_Hop_Screen_Txt" value = "Set Hop #1 with a switch!"
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:02
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt" visibility = hidden
show workspace "Set Hops Manually"
endif
endif
if "sw_Use_Hop2_Batch" state == true
if "gblV_Hop2_Group_R1" value == 0
"gblS_Hop_Screen_Txt" value = "Set Hop #2 with a switch!"
"sw_Use_Hop2_Batch" state = false
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:02
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt" visibility = hidden
show workspace "Set Hops Manually"
endif
endif
if "sw_Use_Hop3_Batch" state == true
if "gblV_Hop3_Group_R1" value == 0
"gblS_Hop_Screen_Txt" value = "Set Hop #3 with a switch!"
"sw_Use_Hop3_Batch" state = false
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:02
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt" visibility = hidden
show workspace "Set Hops Manually"
endif
endif
if "sw_Use_Hop4_Batch" state == true
if "gblV_Hop4_Group_R1" value == 0
"gblS_Hop_Screen_Txt" value = "Set Hop #4 with a switch!"
"sw_Use_Hop4_Batch" state = false
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:02
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt" visibility = hidden
show workspace "Set Hops Manually"
endif
endif
if "sw_Use_Hop5_Batch" state == true
if "gblV_Hop5_Group_R1" value == 0
"gblS_Hop_Screen_Txt" value = "Set Hop #5 with a switch!"
"sw_Use_Hop5_Batch" state = false
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:02
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt" visibility = hidden
show workspace "Set Hops Manually"
endif
endif
if "sw_Use_Hop6_Batch" state == true
if "gblV_Hop6_Group_R1" value == 0
"gblS_Hop_Screen_Txt" value = "Set Hop #6 with a switch!"
"sw_Use_Hop6_Batch" state = false
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:02
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt" visibility = hidden
show workspace "Set Hops Manually"
endif
endif
if "sw_Use_Hop7_Batch" state == true
if "gblV_Hop7_Group_R1" value == 0
"gblS_Hop_Screen_Txt" value = "Set Hop #7 with a switch!"
"sw_Use_Hop7_Batch" state = false
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:02
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt" visibility = hidden
show workspace "Set Hops Manually"
endif
endif
if "sw_Use_Hop8_Batch" state == true
if "gblV_Hop8_Group_R1" value == 0
"gblS_Hop_Screen_Txt" value = "Set Hop #8 with a switch!"
"sw_Use_Hop8_Batch" state = false
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:02
start "tm_Delay_W1"
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt" visibility = hidden
show workspace "Set Hops Manually"
endif
endif
if "sw_Flow_1st_Wort_Hop1" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_1st_Wort_Hop1" state = false
endif
if "sw_Flow_1st_Wort_Hop2" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_1st_Wort_Hop2" state = false
endif
if "sw_Flow_1st_Wort_Hop3" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_1st_Wort_Hop3" state = false
endif
if "sw_Flow_1st_Wort_Hop4" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_1st_Wort_Hop4" state = false
endif
if "sw_Flow_1st_Wort_Hop5" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_1st_Wort_Hop5" state = false
endif
if "sw_Flow_1st_Wort_Hop6" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_1st_Wort_Hop6" state = false
endif
if "sw_Flow_1st_Wort_Hop7" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_1st_Wort_Hop7" state = false
endif
if "sw_Flow_1st_Wort_Hop8" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_1st_Wort_Hop8" state = false
endif
if "sw_Flow_SOB_Hop1" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_SOB_Hop1" state = false
endif
if "sw_Flow_SOB_Hop2" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_SOB_Hop2" state = false
endif
if "sw_Flow_SOB_Hop3" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_SOB_Hop3" state = false
endif
if "sw_Flow_SOB_Hop4" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_SOB_Hop4" state = false
endif
if "sw_Flow_SOB_Hop5" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_SOB_Hop5" state = false
endif
if "sw_Flow_SOB_Hop6" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_SOB_Hop6" state = false
endif
if "sw_Flow_SOB_Hop7" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_SOB_Hop7" state = false
endif
if "sw_Flow_SOB_Hop8" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_SOB_Hop8" state = false
endif
if "sw_Flow_Boil_Hop1" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Boil_Hop1" state = false
endif
if "sw_Flow_Boil_Hop2" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Boil_Hop2" state = false
endif
if "sw_Flow_Boil_Hop3" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Boil_Hop3" state = false
endif
if "sw_Flow_Boil_Hop4" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Boil_Hop4" state = false
endif
if "sw_Flow_Boil_Hop5" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Boil_Hop5" state = false
endif
if "sw_Flow_Boil_Hop6" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Boil_Hop6" state = false
endif
if "sw_Flow_Boil_Hop7" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Boil_Hop7" state = false
endif
if "sw_Flow_Boil_Hop8" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Boil_Hop8" state = false
endif
if "sw_Flow_Whrilpool_Hop1" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Whrilpool_Hop1" state = false
endif
if "sw_Flow_Whrilpool_Hop2" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Whrilpool_Hop2" state = false
endif
if "sw_Flow_Whrilpool_Hop3" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Whrilpool_Hop3" state = false
endif
if "sw_Flow_Whrilpool_Hop4" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Whrilpool_Hop4" state = false
endif
if "sw_Flow_Whrilpool_Hop5" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Whrilpool_Hop5" state = false
endif
if "sw_Flow_Whrilpool_Hop6" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Whrilpool_Hop6" state = false
endif
if "sw_Flow_Whrilpool_Hop7" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Whrilpool_Hop7" state = false
endif
if "sw_Flow_Whrilpool_Hop8" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Whrilpool_Hop8" state = false
endif
if "sw_Flow_Dry_Hop1" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Dry_Hop1" state = false
endif
if "sw_Flow_Dry_Hop2" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Dry_Hop2" state = false
endif
if "sw_Flow_Dry_Hop3" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Dry_Hop3" state = false
endif
if "sw_Flow_Dry_Hop4" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Dry_Hop4" state = false
endif
if "sw_Flow_Dry_Hop5" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Dry_Hop5" state = false
endif
if "sw_Flow_Dry_Hop6" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Dry_Hop6" state = false
endif
if "sw_Flow_Dry_Hop7" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Dry_Hop7" state = false
endif
if "sw_Flow_Dry_Hop8" state == true
start "hops_scrHopSwitches"
sleep 200
"sw_Flow_Dry_Hop8" state = false
endif
//Hops Calc
if "sw_Advance_HopsCalc" state == true
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Wait, Will Auto Advance"
"gblS_Hop_Screen_Txt" visibility = visible
sleep 200
"sw_Advance_HopsCalc" state = false
"insp_BatchHide" visibility = visible
start "Hops_4_Hop_AAU_Check_Zero"
endif
[SkipHopCalc]
goto "LoopAuto_Hop"
```

## 83. looper_scrBackground_Hops

Starts by itself: No · User can start or stop it: Yes · 336 lines

```text
//scrHopsBackground  MODIFIED  26_07_20  14-18
//26_07_20  14-18
// MIT License Granted
//Copyright © OakBarn Brewery 2026
[Loop_Hops_Set]
if "sw_Use_Hop1_Batch" state == true
	if "gblV_Hop1_Oz_R1" value > 0
	"gblV_Hop1_Oz_R1" visibility = visible
	"gblV_Hop1_Recipe_AAU_R1" visibility = visible
	"gblV_Hop1_Actual_AAU_R1" visibility = visible
	"gblV_Oz_Calculated_Hop1_R1"  visibility = visible
	"gblV_TimeHop1_Min_R1" visibility = visible
	"gblT_Hop1Drop_R1" visibility = visible
	"gblV_Hop1_Calc_IBU_R1" visibility = visible
	"gblV_Hop1_Group_R1" visibility = visible
		if "gblV_Hop1_Group_R1" value == -999
			"sw_Use_Rocket_Hop1_Batch" visibility = visible
else
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
endif
		if  "gblV_TimeHop1_Min_R1" value == 90
			"gblS_Hop1_R1" background = 1
		endif
		if "gblV_TimeHop1_Min_R1"  value == 0
			"gblS_Hop1_R1" background = 3
		endif
		if "gblV_TimeHop1_Min_R1" value   < 90
			if "gblV_TimeHop1_Min_R1" value  > 0
				"gblS_Hop1_R1" background = 2
			endif
		endif	
	endif
endif
//....................................................
if "sw_Use_Hop2_Batch" state == true
	if "gblV_Hop2_Oz_R1" value > 0
	"gblV_Hop2_Oz_R1" visibility = visible
	"gblV_Hop2_Recipe_AAU_R1" visibility = visible
	"gblV_Hop2_Actual_AAU_R1" visibility = visible
	"gblV_Oz_Calculated_Hop2_R1"  visibility = visible
	"gblV_TimeHop2_Min_R1" visibility = visible
	"gblT_Hop2Drop_R1" visibility = visible
	"gblV_Hop2_Calc_IBU_R1" visibility = visible
	"gblV_Hop2_Group_R1" visibility = visible
		if "gblV_Hop2_Group_R1" value == -999
			"sw_Use_Rocket_Hop2_Batch" visibility = visible
else
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
endif
		if  "gblV_TimeHop2_Min_R1" value == 90
			"gblS_Hop2_R1" background = 1
		endif
		if "gblV_TimeHop2_Min_R1"  value == 0
			"gblS_Hop2_R1" background = 3
		endif
		if "gblV_TimeHop2_Min_R1" value   < 90
			if "gblV_TimeHop2_Min_R1" value  > 0
				"gblS_Hop2_R1" background = 2
			endif
		endif	
	endif
endif
//....................................................
if "sw_Use_Hop3_Batch" state == true
	if "gblV_Hop3_Oz_R1" value > 0
	"gblV_Hop3_Oz_R1" visibility = visible
	"gblV_Hop3_Recipe_AAU_R1" visibility = visible
	"gblV_Hop3_Actual_AAU_R1" visibility = visible
	"gblV_Oz_Calculated_Hop3_R1"  visibility = visible
	"gblV_TimeHop3_Min_R1" visibility = visible
	"gblT_Hop3Drop_R1" visibility = visible
	"gblV_Hop3_Calc_IBU_R1" visibility = visible
	"gblV_Hop3_Group_R1" visibility = visible
		if "gblV_Hop3_Group_R1" value == -999
			"sw_Use_Rocket_Hop3_Batch" visibility = visible
else
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
endif
		if  "gblV_TimeHop3_Min_R1" value == 90
			"gblS_Hop3_R1" background = 1
		endif
		if "gblV_TimeHop3_Min_R1"  value == 0
			"gblS_Hop3_R1" background = 3
		endif
		if "gblV_TimeHop3_Min_R1" value   < 90
			if "gblV_TimeHop3_Min_R1" value  > 0
				"gblS_Hop3_R1" background = 2
			endif
		endif	
	endif
endif
//....................................................
if "sw_Use_Hop4_Batch" state == true
	if "gblV_Hop4_Oz_R1" value > 0
	"gblV_Hop4_Oz_R1" visibility = visible
	"gblV_Hop4_Recipe_AAU_R1" visibility = visible
	"gblV_Hop4_Actual_AAU_R1" visibility = visible
	"gblV_Oz_Calculated_Hop4_R1"  visibility = visible
	"gblV_TimeHop4_Min_R1" visibility = visible
	"gblT_Hop4Drop_R1" visibility = visible
	"gblV_Hop4_Calc_IBU_R1" visibility = visible
	"gblV_Hop4_Group_R1" visibility = visible
		if "gblV_Hop4_Group_R1" value == -999
			"sw_Use_Rocket_Hop4_Batch" visibility = visible
			else
			"sw_Use_Rocket_Hop4_Batch" visibility = hidden
		endif
		if  "gblV_TimeHop4_Min_R1" value == 90
			"gblS_Hop4_R1" background = 1
		endif
		if "gblV_TimeHop4_Min_R1"  value == 0
			"gblS_Hop4_R1" background = 3
		endif
		if "gblV_TimeHop4_Min_R1" value   < 90
			if "gblV_TimeHop4_Min_R1" value  > 0
				"gblS_Hop4_R1" background = 2
			endif
		endif	
	endif
endif
//....................................................
if "sw_Use_Hop5_Batch" state == true
if "gblV_Hop5_Oz_R1" value > 0
	"gblV_Hop5_Oz_R1" visibility = visible
	"gblV_Hop5_Recipe_AAU_R1" visibility = visible
	"gblV_Hop5_Actual_AAU_R1" visibility = visible
	"gblV_Oz_Calculated_Hop5_R1"  visibility = visible
	"gblV_TimeHop5_Min_R1" visibility = visible
	"gblT_Hop5Drop_R1" visibility = visible
	"gblV_Hop5_Calc_IBU_R1" visibility = visible
	"gblV_Hop5_Group_R1" visibility = visible
		if "gblV_Hop5_Group_R1" value == -999
			"sw_Use_Rocket_Hop5_Batch" visibility = visible
else
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
endif
		if  "gblV_TimeHop5_Min_R1" value == 90
			"gblS_Hop5_R1" background = 1
		endif
		if "gblV_TimeHop5_Min_R1"  value == 0
			"gblS_Hop5_R1" background = 3
		endif
		if "gblV_TimeHop5_Min_R1" value   < 90
			if "gblV_TimeHop5_Min_R1" value  > 0
				"gblS_Hop5_R1" background = 2
			endif
		endif	
	endif
endif
//....................................................
if "sw_Use_Hop6_Batch" state == true
	if "gblV_Hop6_Oz_R1" value > 0
	"gblV_Hop6_Oz_R1" visibility = visible
	"gblV_Hop6_Recipe_AAU_R1" visibility = visible
	"gblV_Hop6_Actual_AAU_R1" visibility = visible
	"gblV_Oz_Calculated_Hop6_R1"  visibility = visible
	"gblV_TimeHop6_Min_R1" visibility = visible
	"gblT_Hop6Drop_R1" visibility = visible
	"gblV_Hop6_Calc_IBU_R1" visibility = visible
	"gblV_Hop6_Group_R1" visibility = visible
		if "gblV_Hop6_Group_R1" value == -999
			"sw_Use_Rocket_Hop6_Batch" visibility = visible
			else
			"sw_Use_Rocket_Hop6_Batch" visibility = hidden
		endif
		if  "gblV_TimeHop6_Min_R1" value == 90
			"gblS_Hop6_R1" background = 1
		endif
		if "gblV_TimeHop6_Min_R1"  value == 0
			"gblS_Hop6_R1" background = 3
		endif
		if "gblV_TimeHop6_Min_R1" value   < 90
			if "gblV_TimeHop6_Min_R1" value  > 0
				"gblS_Hop6_R1" background = 2
			endif
		endif	
	endif
endif
//....................................................
if "sw_Use_Hop7_Batch" state == true
	if "gblV_Hop7_Oz_R1" value > 0
	"gblV_Hop7_Oz_R1" visibility = visible
	"gblV_Hop7_Recipe_AAU_R1" visibility = visible
	"gblV_Hop7_Actual_AAU_R1" visibility = visible
	"gblV_Oz_Calculated_Hop7_R1"  visibility = visible
	"gblV_TimeHop7_Min_R1" visibility = visible
	"gblT_Hop7Drop_R1" visibility = visible
	"gblV_Hop7_Calc_IBU_R1" visibility = visible
	"gblV_Hop7_Group_R1" visibility = visible
		if "gblV_Hop7_Group_R1" value == -999
			"sw_Use_Rocket_Hop7_Batch" visibility = visible
			else
			"sw_Use_Rocket_Hop7_Batch" visibility = hidden
		endif
		if  "gblV_TimeHop7_Min_R1" value == 90
			"gblS_Hop7_R1" background = 1
		endif
		if "gblV_TimeHop7_Min_R1"  value == 0
			"gblS_Hop7_R1" background = 3
		endif
		if "gblV_TimeHop7_Min_R1" value   < 90
			if "gblV_TimeHop7_Min_R1" value  > 0
				"gblS_Hop7_R1" background = 2
			endif
		endif	
	endif
endif
//....................................................
if "sw_Use_Hop8_Batch" state == true
	if "gblV_Hop8_Oz_R1" value > 0
	"gblV_Hop8_Oz_R1" visibility = visible
	"gblV_Hop8_Recipe_AAU_R1" visibility = visible
	"gblV_Hop8_Actual_AAU_R1" visibility = visible
	"gblV_Oz_Calculated_Hop8_R1"  visibility = visible
	"gblV_TimeHop8_Min_R1" visibility = visible
	"gblT_Hop8Drop_R1" visibility = visible
	"gblV_Hop8_Calc_IBU_R1" visibility = visible
	"gblV_Hop8_Group_R1" visibility = visible
		if "gblV_Hop8_Group_R1" value == -999
		"sw_Use_Rocket_Hop8_Batch" visibility = visible
		else
		"sw_Use_Rocket_Hop8_Batch" visibility = hidden
		endif
		if  "gblV_TimeHop8_Min_R1" value == 90
			"gblS_Hop8_R1" background = 1
		endif
		if "gblV_TimeHop8_Min_R1"  value == 0
			"gblS_Hop8_R1" background = 3
		endif
		if "gblV_TimeHop8_Min_R1" value   < 90
			if "gblV_TimeHop8_Min_R1" value  > 0
				"gblS_Hop8_R1" background = 2
			endif
		endif	
	endif
endif
//..................................................................
//..................................................................
if "sw_Use_Hop1_Batch" state == false
"gblS_Hop1_R1" background = 99	
"gblV_Hop1_Oz_R1" visibility = hidden
"gblV_Hop1_Recipe_AAU_R1" visibility = hidden
"gblV_Hop1_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop1_R1"  visibility = hidden
"gblV_TimeHop1_Min_R1" visibility = hidden
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = hidden
"gblV_Hop1_Group_R1" visibility = hidden
endif
//.....................................
if "sw_Use_Hop2_Batch" state == false
"gblS_Hop2_R1" background = 99	
"gblV_Hop2_Oz_R1" visibility = hidden
"gblV_Hop2_Recipe_AAU_R1" visibility = hidden
"gblV_Hop2_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop2_R1"  visibility = hidden
"gblV_TimeHop2_Min_R1" visibility = hidden
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = hidden
"gblV_Hop2_Group_R1" visibility = hidden
endif
//.....................................
if "sw_Use_Hop3_Batch" state == false
"gblS_Hop3_R1" background = 99	
"gblV_Hop3_Oz_R1" visibility = hidden
"gblV_Hop3_Recipe_AAU_R1" visibility = hidden
"gblV_Hop3_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop3_R1"  visibility = hidden
"gblV_TimeHop3_Min_R1" visibility = hidden
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = hidden
"gblV_Hop3_Group_R1" visibility = hidden
endif
//.....................................
if "sw_Use_Hop4_Batch" state == false
"gblS_Hop4_R1" background = 99	
"gblV_Hop4_Oz_R1" visibility = hidden
"gblV_Hop4_Recipe_AAU_R1" visibility = hidden
"gblV_Hop4_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop4_R1"  visibility = hidden
"gblV_TimeHop4_Min_R1" visibility = hidden
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = hidden
"gblV_Hop4_Group_R1" visibility = hidden
endif
//.....................................
if "sw_Use_Hop5_Batch" state == false
"gblS_Hop5_R1" background = 99	
"gblV_Hop5_Oz_R1" visibility = hidden
"gblV_Hop5_Recipe_AAU_R1" visibility = hidden
"gblV_Hop5_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop5_R1"  visibility = hidden
"gblV_TimeHop5_Min_R1" visibility = hidden
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = hidden
"gblV_Hop5_Group_R1" visibility = hidden
endif
//.....................................
if "sw_Use_Hop6_Batch" state == false
"gblS_Hop6_R1" background = 99	
"gblV_Hop6_Oz_R1" visibility = hidden
"gblV_Hop6_Recipe_AAU_R1" visibility = hidden
"gblV_Hop6_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop6_R1"  visibility = hidden
"gblV_TimeHop6_Min_R1" visibility = hidden
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = hidden
"gblV_Hop6_Group_R1" visibility = hidden
endif
//.....................................
if "sw_Use_Hop7_Batch" state == false
"gblS_Hop7_R1" background = 99	
"gblV_Hop7_Oz_R1" visibility = hidden
"gblV_Hop7_Recipe_AAU_R1" visibility = hidden
"gblV_Hop7_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop7_R1"  visibility = hidden
"gblV_TimeHop7_Min_R1" visibility = hidden
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = hidden
"gblV_Hop7_Group_R1" visibility = hidden
endif
//.....................................
if "sw_Use_Hop8_Batch" state == false
"gblS_Hop8_R1" background = 99	
"gblV_Hop8_Oz_R1" visibility = hidden
"gblV_Hop8_Recipe_AAU_R1" visibility = hidden
"gblV_Hop8_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop8_R1"  visibility = hidden
"gblV_TimeHop8_Min_R1" visibility = hidden
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = hidden
"gblV_Hop8_Group_R1" visibility = hidden
endif
//.....................................
//.....................................
goto "Loop_Hops_Set"
```

## 84. looper_scrDin

Starts by itself: No · User can start or stop it: Yes · 47 lines

```text
//looper_scrDin
//07/19/2022 
// MIT License Granted
//Copyright © OakBarn Brewery 2026
new value vVBrewStatus
new value vV_TempMLT_R
new value vV_TempMLT_O
new value vVSP
new value vVDeltaR
new value vVDeltaO
[DinLooper]
sleep 100
//Green DIN
if "MB_47_di_Green_DINS" value ==  On
print "green on"
"alm_DINS" fileindex = 3
"alm_DINS" active = true
sleep 5000
"alm_DINS" active = false
endif
//Red DIN
// Turn of Alarms
if "MB_42_di_Red_DINS" value ==  On
print "red on"
start "inscpt_scrAlarm"
"alm_DINS" fileindex = 2
"alm_DINS" active = true
sleep 5000
"alm_DINS" active = false
endif
//MB_44_di_Yellow_DINS
if "MB_44_di_Yellow_DINS" value ==  On
print "yellow on"
"gblV_Water_Switch_Status_Water" value = 5
"MB_44_di_Yellow_DINS"  value = Off
sleep 4001
endif
//Blue Din
if "MB_46_di_Blue_Dins" value ==  On
print "blue on"
"sw_Advance_ BrewStatus" state = true
"alm_DINS" fileindex = 1
"alm_DINS" active = true
sleep 5000
"alm_DINS" active = false
endif
goto "DinLooper"
```

## 85. looper_scrElementControl

Starts by itself: No · User can start or stop it: Yes · 76 lines

```text
//looper_scrDin
//09/24/2026 
// MIT License Granted
//Copyright © OakBarn Brewery 2026
[LoopElements]
sleep 100
// On the Fly Targets from SetPoint
"MB_08_Hys_RadiatorElement_Wo1" target = "gblV_RadiatorSetPoint_P1_B1" value
"MB_07_PID_Quadzilla_WO1"  target = "gblV_RadiatorSetPoint_P1_B1" value
[Brew_Kettle_Burner]
print 12
if  "sw_Control_Burner_BK" state == true
	if "sw_Status_Burner_BK" state == false
		start "looper_BURNER_scrBrewKettleBurner"
		goto "Little_Mac_Burner"
	endif
endif
if  "sw_Control_Burner_BK" state == false
	if "sw_Status_Burner_BK" state == true
		"MB_24_do_BrewKettleBurner_B1" state = false
	"MB_23_do_BrewKettleIgnitor_Wo1" state = false
	"sw_Status_Burner_BK" state = false
		stop "looper_BURNER_scrBrewKettleBurner"
		goto "Little_Mac_Burner"
	endif
endif
[Little_Mac_Burner]
//Little Mac Burner
if  "sw_Control_Burner_LittleMac" state == true
	if "sw_Status_Burner_LittleMac" state == false
		start "looper_BURNER_scrLittleMacBurner"
		goto "Big_Mac_Element"
	endif
endif
//LittleMac
if  "sw_Control_Burner_LittleMac" state == false
	if "sw_Status_Burner_LittleMac" state == true
		"MB_25_do_LittleMacBurner_B1" state = false
		"MB_22_do_LittleMacIgnitor_Wo1" state = false
		"sw_Status_Burner_LittleMac" state = false
		stop "looper_BURNER_scrLittleMacBurner"
		goto "Big_Mac_Element"
	endif
endif
[Radiator_Body]
if  "sw_Control_Radiator_Element" state == true
	if "sw_Status_Radiator_Control" state == false
print "@ 63  Starting Radiator Body Heat"
		start "looper_Heat_scrRadiator_Body_Heat"
	endif
endif
if  "sw_Control_Radiator_Element" state == false
	if "sw_Status_Radiator_Control" state == true
print "@ 69  Stop Radiator Body Heat"

	"MB_08_PWM_Radiator_WO1" enabled = false
	stop "looper_Heat_scrRadiator_Body_Heat"
	"sw_Status_Radiator_Control" state = false
	endif
endif
[RIMs_Element]
if  "sw_Control_RIMs_Element" state == true
	if "sw_Control_RIMs_Element_Running" state == false
		start "looper_Heat_scrRimsHeat_Control"
	endif
endif
if  "sw_Control_RIMs_Element" state == false
	if "sw_Control_RIMs_Element_Running" state == true
	"MB_14_do_RIMs_Contactor_Heat" state = false
	"MB_09_PWM_RIMs_Heat" enabled = false
	stop "looper_Heat_scrRimsHeat_Control"
	"sw_Control_RIMs_Element_Running" state = false
	endif
endif
goto "LoopElements"
stop   "looper_scrElementControl"
```

## 86. looper_Heat_scrRimsHeat_Control

Starts by itself: No · User can start or stop it: Yes · 101 lines

```text
//looper_Heat_scrRimsHeat_Control
//09/24/2025 08:24
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Manual Hysterisis of RIMs
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vSMsg4
new value vV_RIMs_Temp
new value vV_RIMs_SetPoint
new value vV_RIMs_Offset
new value vV_RIMs_OffsetHigh
new value vV_RIMs_OffsetLow
new value vV_RIMs_OffsetSlowdown
new value vCount1
new value vV_RIMs_SetPointOld
vCount1 = 0
"sw_Control_RIMs_Element_Running" state = true
"MB_14_do_RIMs_Contactor_Heat"  state = true
"MB_09_PWM_RIMs_Heat" enabled = true
[Loop_RIMs__Hys1]
sleep 100
if "sw_Control_RIMs_Element" state == false
goto "EndRIMs"
endif
vV_RIMs_Offset = 2
vV_RIMs_SetPoint = "gblV_RadiatorSetPoint_P1_B1" value
vV_RIMs_SetPointOld = vV_RIMs_SetPoint 
vV_RIMs_OffsetSlowdown = vV_RIMs_SetPoint - vV_RIMs_Offset
//// print  vV_RIMs_OffsetSlowdown
//....................................................
//vV_RIMs_Temp = "MB_58_10KRadiator_B1" value
//....................................................
vV_RIMs_Temp = 120
//....................................................
vSMsg1 =  "RIMs Temperature = " 
vSMsg2 = vV_RIMs_Temp
vSMsg = vSMsg1 + vSMsg2
//// print vSMsg
if vV_RIMs_Temp < vV_RIMs_OffsetSlowdown
//// print "Under"
"MB_09_PWM_RIMs_Heat" value = 255
endif 
if vV_RIMs_Temp > vV_RIMs_OffsetSlowdown
//// print "Over"
goto "Loop_RIMs__Hys3"
endif
goto "Loop_RIMs__Hys1"

[Loop_RIMs__Hys3]
sleep 100
if "sw_Control_RIMs_Element" state == false
goto "EndRIMs"
endif
sleep 100
vCount1 += 1
vSMsg1 =  "count = " 
vSMsg2 = vCount1
vSMsg = vSMsg1 + vSMsg2
//// print vSMsg
if vCount1 >= 10 
goto "Loop_RIMs__Hys2"
endif
goto "Loop_RIMs__Hys1"
[Loop_RIMs__Hys2]
sleep 100
if "sw_Control_RIMs_Element" state == false
goto "EndRIMs"
endif
vV_RIMs_Offset = 1
vV_RIMs_Temp = "MB_58_10KRadiator_B1" value
vV_RIMs_SetPoint = "gblV_RadiatorSetPoint_P1_B1" value
vV_RIMs_OffsetHigh = vV_RIMs_SetPoint + vV_RIMs_Offset
vV_RIMs_OffsetLow = vV_RIMs_SetPoint - vV_RIMs_Offset
//// print "temp = " 
//// print  vV_RIMs_Temp
//// print "Setpoint ="
//// print vV_RIMs_SetPoint
if vV_RIMs_Temp < vV_RIMs_OffsetHigh
if vV_RIMs_Temp > vV_RIMs_OffsetLow
//// print "in the Groove"
"MB_09_PWM_RIMs_Heat" value = 10
endif
endif
if vV_RIMs_Temp >= vV_RIMs_OffsetHigh
//// print "High"
"MB_09_PWM_RIMs_Heat" value = 0
endif 
if vV_RIMs_Temp <= vV_RIMs_OffsetLow
//// print "Low"
"MB_09_PWM_RIMs_Heat" value = 150
endif
if vV_RIMs_SetPointOld  != vV_RIMs_SetPoint 
goto "Loop_RIMs__Hys1"
endif 
goto "Loop_RIMs__Hys2"
[EndRIMs]
"sw_Control_RIMs_Element_Running" state = false
stop "looper_Heat_scrRimsHeat_Control"
```

## 87. looper_Heat_scrRIMs_Heater

Starts by itself: No · User can start or stop it: Yes · 70 lines

```text
//looper_Heat_scrRIMs_Heater
//03/05/2026 1051
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Modified
[HERMs_Bath_Loop]
sleep 100
//RIMS Heat On
if "sw_Control_RIMs_Element" state == true
//start Manifold set IF NECESSARY
	if "sw_Status_Manifold_Rad_Heat" state == false
print "@ 11 Manifold Setting"
	"gblS_Brewery_Bottom_1"	value = "The Manifold will be Set for HERMs Bath Heat! "
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 3000
	"gblS_Brewery_Bottom_1" visibility = hidden
		"gblV_Water_Switch_Status_Water" value = 202
		start "sub_2_scrPrimeandBasicManifold" 
	sleep 100
	wait "sw_Running_Prime_Basic" state == false
	"sw_Control_RIMs_Element" state = true
	goto "HERMs_Bath_Loop"
	endif
endif
if "sw_Control_RIMs_Element" state == true
//start Green Pump IF NECESSARY
	if "MB_34_do_GreenPump_B1" state == false
print "Turning on Green Pump"
	"gblS_Brewery_Bottom_1"	value = "The Green Pump is Off.  It will be turned On!"
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 3000
	"MB_34_do_GreenPump_B1" state = true
	"sw_Control_RIMs_Element" state = true
	goto "HERMs_Bath_Loop"
	endif
endif
if "sw_Control_RIMs_Element" state == true
	if "sw_Control_RIMs_Element_Running" state == true
	goto "Skip_HERMs_Bath_Heat_On"
	endif
endif
if "sw_Control_RIMs_Element" state == true
print "Starting HERMs Bath"
	"MB_14_do_RIMs_Contactor_Heat" state = true
	"gblS_Brewery_Bottom_1"	value = "HERMs Bath Contractor On"
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 4001
	"gblS_Brewery_Bottom_1" visibility = hidden
	start "looper_Heat_scrRimsHeat_Control"
	"gblS_Brewery_Bottom_1"	value = "HERMs Bath Heater On"
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 3000
	"gblS_Brewery_Bottom_1" visibility = hidden
	goto "HERMs_Bath_Loop"
endif
//HERMs Bath Heat Off
if "sw_Control_RIMs_Element" state == false
	"MB_14_do_RIMs_Contactor_Heat" state = false
	"MB_09_PWM_RIMs_Heat" enabled = false
	stop "looper_Heat_scrRimsHeat_Control"
endif
//.................................................................
goto "HERMs_Bath_Loop"
[Skip_HERMs_Bath_Heat_On]
goto "HERMs_Bath_Loop"
[Skip_HERMs_Bath_Heat_OFF]
goto "HERMs_Bath_Loop"
[ender]
stop "looper_Heat_scrRIMs_Heater"
```

## 88. looper_Heat_scrBigMac_Hys_Control

Starts by itself: No · User can start or stop it: Yes · 91 lines

```text
//looper_Heat_scrBigMac_Hys_Control
//09/12/2025 11:27
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Manual Hysterisis of Big MAC
"sw_Running_BigMac_PWM" state = true
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg3
new string vSMsg4
new value vVBigMac_Temp
new value vVBigMacSetPoint
new value vVBigMacOffset
new value vVBigMacOffsetHigh
new value vVBigMacOffsetLow
new value vVBigMacOffsetSlowdown
new value vCount1
new value vVBigMacSetPointOld
// Element
"MB_17_do_BigMac2Contactor_Wo1" enabled = true
"MB_17_do_BigMac2Contactor_Wo1" state = true
vCount1 = 0
"MB_05_PWM_BigMacElement2_WO1" enabled = true
[LoopBigMac_Hys1]
sleep 100
vVBigMacOffset = 2
vVBigMacSetPoint = "gblV_BigMacSetPointP1_B1" value
vVBigMacSetPointOld = vVBigMacSetPoint 
vVBigMacOffsetSlowdown = vVBigMacSetPoint - vVBigMacOffset
// print  vVBigMacOffsetSlowdown
vVBigMac_Temp = "MB_57_10kBigMac_B1" value
vSMsg1 =  "BigMac Temperature = " 
vSMsg2 = vVBigMac_Temp
vSMsg = vSMsg1 + vSMsg2
// print vSMsg
if vVBigMac_Temp < vVBigMacOffsetSlowdown
// print "Under"
"MB_09_PWM_RIMs_Heat" value = 255
"MB_05_PWM_BigMacElement2_WO1" value = 255
endif 
if vVBigMac_Temp > vVBigMacOffsetSlowdown
// print "Over"
goto "LoopBigMac_Hys3"
endif
goto "LoopBigMac_Hys1"
[LoopBigMac_Hys3]
sleep 100
vCount1 += 1
vSMsg1 =  "count = " 
vSMsg2 = vCount1
vSMsg = vSMsg1 + vSMsg2
//// print vSMsg
if vCount1 >= 10 
goto "LoopBigMac_Hys2"
endif
goto "LoopBigMac_Hys1"
[LoopBigMac_Hys2]
sleep 100
vVBigMacOffset = 1
vVBigMac_Temp = "MB_57_10kBigMac_B1" value
vVBigMacSetPoint = "gblV_BigMacSetPointP1_B1" value
vVBigMacOffsetHigh = vVBigMacSetPoint + vVBigMacOffset
vVBigMacOffsetLow = vVBigMacSetPoint - vVBigMacOffset
// print "temp = " 
// print  vVBigMac_Temp
// print "Setpoint ="
// print vVBigMacSetPoint
if vVBigMac_Temp < vVBigMacOffsetHigh
if vVBigMac_Temp > vVBigMacOffsetLow
// print "in the Groove"
"MB_09_PWM_RIMs_Heat" value = 10
"MB_05_PWM_BigMacElement2_WO1" value = 10
endif
endif
if vVBigMac_Temp >= vVBigMacOffsetHigh
// print "High"
"MB_09_PWM_RIMs_Heat" value = 0
"MB_05_PWM_BigMacElement2_WO1" value = 0
endif 
if vVBigMac_Temp <= vVBigMacOffsetLow
// print "Low"
"MB_09_PWM_RIMs_Heat" value = 150
"MB_05_PWM_BigMacElement2_WO1" value = 150
endif
if vVBigMacSetPointOld  != vVBigMacSetPoint 
goto "LoopBigMac_Hys1"
endif 
goto "LoopBigMac_Hys2"
[EndBigMac]
stop "looper_Heat_scrBigMac_Hys_Control"
```

## 89. looper_Heat_scrBigMacHeat

Starts by itself: No · User can start or stop it: No · 67 lines

```text
//looper_Heat_scrBigMacHeat Moddified 260729 12:27
//03/05/2026 11:02
// MIT License Granted
//Copyright © OakBarn Brewery 2026
[BigMac_Heat_Loop]
sleep 100
if  "sw_Control_BigMac_Element" state == true
	if "sw_Status_BigMac_Heat_On" state == true
//Big Mac already On
	goto "Skip_BigMacHeat_On"
	endif
endif
if  "sw_Control_BigMac_Element" state == false
	if "sw_Status_BigMac_Heat_On" state == false
//Big Mac already Off
	goto "BigMac_Heat_Loop"
	endif
endif
//...................................................................
//Turn Big  MacOff
if  "sw_Control_BigMac_Element" state == false
"MB_17_do_BigMac2Contactor_Wo1" state = false
	"MB_05_PWM_BigMacElement2_WO1" enabled = false
		"sw_Status_BigMac_Heat_On" state = false
stop "looper_Heat_scrBigMac_Hys_Control"
endif
//.................................................................
//Turn Big Mac On
if "sw_Control_BigMac_Element" state == true
//...........................................................................
"MB_17_do_BigMac2Contactor_Wo1" state = true
sleep 200
"MB_05_PWM_BigMacElement2_WO1" enabled = true
start "looper_Heat_scrBigMac_Hys_Control"
		"gblS_Brewery_Bottom_1" value = "Big Mac Heater On"
		"gblS_Brewery_Bottom_1" visibility = visible
		sleep 3000
		"gblS_Brewery_Bottom_1" visibility = hidden
"sw_Status_BigMac_Heat_On" state = true
endif
//...........................................................................
[Skip_BigMacHeat_On]
//Check White Pump On 
if "sw_Status_WhitePump" state == true
		if "MB_32_do_WhitePump_B1" state == false
			"gblS_Brewery_Bottom_1" value = "Big Mac Heater is ON.  You should consider turning on the White Pump."
"sw_Status_WhitePump" state = false
		goto "Bottom_Msg"
		endif
endif
//Check Manifold Set			
if "sw_Status_Manifold_BigMac_Heat" state == true			
		if "sw_Status_Manifold_BigMac_Heat" state == false
			"gblS_Brewery_Bottom_1" value = "Big Mac Heater is ON.  You should consider resetting the Manifold."
"sw_Status_Manifold_BigMac_Heat" state ==	false
			goto "Bottom_Msg"	
endif
endif
goto "Skip_Bottom_Msg"
[Bottom_Msg]
		"gblS_Brewery_Bottom_1" visibility = visible
		sleep 3000
		"gblS_Brewery_Bottom_1" visibility = hidden
[Skip_Bottom_Msg]
//.............................................................
goto "BigMac_Heat_Loop"
stop "looper_Heat_scrBigMacHeat"
```

## 90. looper_Heat_scrRadiatorHeat_Hys_Control

Starts by itself: No · User can start or stop it: Yes · 98 lines

```text
//looper_Heat_scrRadiatorHeat_Hys_Control
//09/24/2025 08:24
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Manual Hysterisis of Radiator
new string vSMsgRadiatorHeat
new string vSMsgRadiatorHeat1
new string vSMsgRadiatorHeat2
new string vSMsgRadiatorHeat3
new string vSMsgRadiatorHeat4
new value vV_Radiator__Temp
new value vV_Radiator_SetPoint
new value vV_Radiator_Offset
new value vV_Radiator_OffsetHigh
new value vV_Radiator_OffsetLow
new value vV_Radiator_OffsetSlowdown
new value vCount1
new value vV_Radiator_SetPointOld
vCount1 = 0
"sw_Status_Radiator_Control" state = true
"MB_08_PWM_Radiator_WO1" enabled = true
[Loop_Radiator__Hys1]
sleep 100
if "sw_Control_Radiator_Element" state == false
goto "EndRadiator"
endif
vV_Radiator_Offset = 2
vV_Radiator_SetPoint = "gblV_RadiatorSetPoint_P1_B1" value
vV_Radiator_SetPointOld = vV_Radiator_SetPoint 
vV_Radiator_OffsetSlowdown = vV_Radiator_SetPoint - vV_Radiator_Offset
// print  vV_Radiator_OffsetSlowdown
//....................................................
vV_Radiator__Temp = "MB_58_10KRadiator_B1" value
vSMsgRadiatorHeat1 =  "Radiator Temperature = " 
vSMsgRadiatorHeat2 = vV_Radiator__Temp
if vV_Radiator__Temp < vV_Radiator_OffsetSlowdown
// print "Under"
"MB_08_PWM_Radiator_WO1" value = 255
endif 
if vV_Radiator__Temp > vV_Radiator_OffsetSlowdown
// print "Over"
goto "Loop_Radiator__Hys3"
endif
goto "Loop_Radiator__Hys1"
//...............................................
[Loop_Radiator__Hys2]
sleep 100
if "sw_Control_Radiator_Element" state == false
goto "EndRadiator"
endif
vV_Radiator_Offset = 1
vV_Radiator__Temp = "MB_58_10KRadiator_B1" value
vV_Radiator_SetPoint = "gblV_RadiatorSetPoint_P1_B1" value
vV_Radiator_OffsetHigh = vV_Radiator_SetPoint + vV_Radiator_Offset
vV_Radiator_OffsetLow = vV_Radiator_SetPoint - vV_Radiator_Offset
// print "temp = " 
// print  vV_Radiator__Temp
// print "Setpoint ="
// print vV_Radiator_SetPoint
if vV_Radiator__Temp < vV_Radiator_OffsetHigh
if vV_Radiator__Temp > vV_Radiator_OffsetLow
// print "in the Groove"
"MB_08_PWM_Radiator_WO1" value = 7
endif
endif
if vV_Radiator__Temp >= vV_Radiator_OffsetHigh
// print "High"
"MB_08_PWM_Radiator_WO1" value = 0
endif 
if vV_Radiator__Temp <= vV_Radiator_OffsetLow
// print "Low"
"MB_08_PWM_Radiator_WO1" value = 150
endif
if vV_Radiator_SetPointOld  != vV_Radiator_SetPoint 
goto "Loop_Radiator__Hys1"
endif 
goto "Loop_Radiator__Hys2"
//...............................................
[Loop_Radiator__Hys3]
sleep 100
if "sw_Control_Radiator_Element" state == false
goto "EndRadiator"
endif
sleep 100
vCount1 += 1
vSMsgRadiatorHeat1 =  "count = " 
vSMsgRadiatorHeat2 = vCount1
vSMsgRadiatorHeat = vSMsgRadiatorHeat1 + vSMsgRadiatorHeat2
// print vSMsgRadiatorHeat
if vCount1 >= 10 
vCount1 = 0
goto "Loop_Radiator__Hys2"
endif
goto "Loop_Radiator__Hys1"
[EndRadiator]
"sw_Status_Radiator_Control" state = false
stop "looper_Heat_scrRadiatorHeat_Hys_Control"
```

## 91. looper_Heat_scrRadiator_Body_Heat

Starts by itself: No · User can start or stop it: Yes · 68 lines

```text
//looper_Heat_scrRadiator_Body_Heat
//03/05/2026 11:02
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Modified 05/24/2026 10:49
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
new bool vb_sw_Control_Radiator_Element
new bool vB_sw_Status_Radiator_Control
[RadiatorBody_Heat_Loop]
sleep 100
vb_sw_Control_Radiator_Element = "sw_Control_Radiator_Element" state
// print "Radiator Body Switch = "
// print vb_sw_Control_Radiator_Element
vB_sw_Status_Radiator_Control = "sw_Status_Radiator_Control" state
// print "Radiator Body Heat HYS Running = "
// print vB_sw_Status_Radiator_Control
//............................................................
//............................................................
//RadiatorBody Off
if "sw_Control_Radiator_Element" state == false
		if "sw_Status_Radiator_Control" state == false
		"MB_08_PWM_Radiator_WO1" enabled = false
		goto "Skip_RadiatorBodyHeat_OFF"
		endif
		"MB_08_PWM_Radiator_WO1" enabled = false
endif
//.................................................................
//RadiatorBody On
//...........................................................................
if "sw_Control_Radiator_Element" state == true
		if "sw_Status_Radiator_Control" state == true
	goto "Skip_RadiatorBodyHeat_On"
	endif
start "looper_Heat_scrRadiatorHeat_Hys_Control" 
"MB_08_PWM_Radiator_WO1" enabled = true
			if "MB_34_do_GreenPump_B1" state == true
			if "sw_Status_Radiator_Control" state == true
			"gblS_Brewery_Bottom_1" value = "Radiator Body Heater On"
			endif
			endif
			if "MB_34_do_GreenPump_B1" state == false
			if "sw_Status_Manifold_Rad_Heat" state == false
			"gblS_Brewery_Bottom_1" value = "Radiator Body Heater On.  You should consider resetting the Manifold and turning on the Green Pump."
			endif
			endif
			if "MB_34_do_GreenPump_B1" state == true
			if "sw_Status_Manifold_Rad_Heat" state == false
			"gblS_Brewery_Bottom_1" value = "Radiator Body Heater On.  You should consider resetting the Manifold."
			endif
			endif
			if "MB_34_do_GreenPump_B1" state == false
			if "sw_Status_Manifold_Rad_Heat" state == true
			"gblS_Brewery_Bottom_1" value = "Radiator Body Heater On.  You should consider turning on the Green Pump."
			endif
			endif
		"gblS_Brewery_Bottom_1" visibility = visible
		sleep 3000
		"gblS_Brewery_Bottom_1" visibility = hidden
endif

//.............................................................
goto "RadiatorBody_Heat_Loop"
[Skip_RadiatorBodyHeat_On]
goto "RadiatorBody_Heat_Loop"
[Skip_RadiatorBodyHeat_OFF]
goto "RadiatorBody_Heat_Loop"
stop "looper_Heat_scrRadiator_Body_Heat"
```

## 92. looper_BURNER_scrBrewKettleBurner

Starts by itself: No · User can start or stop it: Yes · 86 lines

```text
//looper_BURNER_scrBrewKettleBurner
//08/06/2022
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Turn On MB_24_do_BrewKettleBurner_B1
// Brew Kettle Gauges
"MB_55_10K_Brew_Kettle_B1" visibility = visible
"gblPVBK" visibility = visible
"gblV_SetpointBK_B1" visibility = visible
"gblSVBK" visibility = visible
if "sw_Control_Burner_BK" state == false
goto "TurnBurnerOff"
endif
//><<><>><><><><><><><><><><><><><><><><
//Messages
"gblS_Save_BrewMsg1_Wo1" value = "gblS_Brewery_Top_3" value 
"gblV_Save_BrewMsg_Background_Wo1" background = "gblS_Brewery_Top_3" background
 "gblS_Save_BrewMsg_Visibility_Wo1" visibility = "gblS_Brewery_Top_3" visibility
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" value = "Watch Brew Kettle Burner light!"
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Will Auto Advance"
"gblS_Brewery_Bottom_1" value = "You will need to Insure that the Brew Kettle Burner is lit.  You are the SAFETY. "
"gblS_Brewery_Bottom_1" background = 2
"gblS_Brewery_Bottom_1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"sw_Advance_ BrewStatus" visibility = hidden
// Turn Burner on
if "sw_Control_Burner_BK" state == true
"sw_Status_Burner_BK" state = true
"MB_24_do_BrewKettleBurner_B1" enabled = true
"MB_24_do_BrewKettleBurner_B1" state = true
"MB_23_do_BrewKettleIgnitor_Wo1" state = true
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" value = 00:00:07
"tmBottomRight_B1" displayname = "Ignition On"
start "tmBottomRight_B1"
"tmBottomRight_B1"  visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"MB_23_do_BrewKettleIgnitor_Wo1" state = false
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" value = " INSURE BREW KETTLE IS LIT!  "
"gblS_Brewery_Bottom_4" background = 3
"gblS_Brewery_Bottom_4" visibility = visible
"alm_Hidden1_ALARM" sound = Custom
"alm_Hidden1_ALARM" fileindex = 1
"alm_Hidden1_ALARM" Loop = true
"alm_Hidden1_ALARM" active = true
"sw_Flow_Burner_BK_Lit"  state = false
"sw_Flow_Burner_BK_Lit" visibility = visible
endif
[Loop_BK_sw]
if  "sw_Flow_Burner_BK_Lit"  state == true
goto "enderLoopBK_sw"
endif
"sw_Flow_Burner_BK_Lit" background = 1
sleep 1000
if  "sw_Flow_Burner_BK_Lit"  state == true
goto "enderLoopBK_sw"
endif
"sw_Flow_Burner_BK_Lit" background = 2
sleep 1000
goto "Loop_BK_sw"
[enderLoopBK_sw]
"sw_Flow_Burner_BK_Lit" visibility = hidden
"alm_Hidden1_ALARM" active = false
"sw_Flow_Burner_BK_Lit"  state = false
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" value = "gblS_Save_BrewMsg1_Wo1" value
"gblS_Brewery_Top_3" background = "gblV_Save_BrewMsg_Background_Wo1" background
"gblS_Brewery_Top_3" visibility = "gblS_Save_BrewMsg_Visibility_Wo1" visibility
// Turn Burner off
[TurnBurnerOff]
wait "sw_Control_Burner_BK" state == false
"sw_Status_Burner_BK" state = false
"MB_24_do_BrewKettleBurner_B1" state = false
"MB_23_do_BrewKettleIgnitor_Wo1" state = false
stop "looper_BURNER_scrBrewKettleBurner"
```

## 93. looper_BURNER_scrLittleMacBurner

Starts by itself: No · User can start or stop it: No · 85 lines

```text
//looper_BURNER_scrLittleMacBurner
//06/05/2024
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Turn On MB_25_do_LittleMacBurner_B1
// Little Mac Gauges
"MB_56_10k_Little_Mac_B1" visibility = visible
"gblPVLM " visibility = visible
"gblV_SetpointLittleMac_P1_B1" visibility = visible
"gblSVLM" visibility = visible
if "sw_Control_Burner_LittleMac" state == false
goto "TurnLMBurnerOff"
endif
"sw_Flow_Burner_BK_Lit"  displayname = "Little Mac Burner Lit?"
//><<><>><><><><><><><><><><><><><><><><
//Messages
"gblS_Save_BrewMsg1_Wo1" value = "gblS_Brewery_Top_3" value 
"gblV_Save_BrewMsg_Background_Wo1" background = "gblS_Brewery_Top_3" background
 "gblS_Save_BrewMsg_Visibility_Wo1" visibility = "gblS_Brewery_Top_3" visibility
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" value = "Watch Little Mac Burner light!"
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Will Auto Advance"
"gblS_Brewery_Bottom_1" value = "You will need to Insure that the Little Mac Burner is lit.  You are the SAFETY. "
"gblS_Brewery_Bottom_1" background = 2
"gblS_Brewery_Bottom_1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"sw_Advance_ BrewStatus" visibility = hidden
// Turn Burner on
if "sw_Control_Burner_LittleMac" state == true
"MB_25_do_LittleMacBurner_B1" enabled = true
"MB_25_do_LittleMacBurner_B1" state = true
"MB_22_do_LittleMacIgnitor_Wo1" state = true
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" value = 00:00:07
"tmBottomRight_B1" displayname = "Ignition On"
start "tmBottomRight_B1"
"tmBottomRight_B1"  visibility = visible
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"MB_22_do_LittleMacIgnitor_Wo1" state = false
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" value = " INSURE Little Mac Burner IS LIT!  "
"gblS_Brewery_Bottom_4" background = 3
"gblS_Brewery_Bottom_4" visibility = visible
"alm_Hidden1_ALARM" sound = Custom
"alm_Hidden1_ALARM" fileindex = 1
"alm_Hidden1_ALARM" Loop = true
"alm_Hidden1_ALARM" active = true
"sw_Flow_Burner_BK_Lit"  state = false
"sw_Flow_Burner_BK_Lit" visibility = visible
endif
[Loop_LM_sw]
if  "sw_Flow_Burner_BK_Lit"  state == true
goto "enderLoopLM_sw"
endif
"sw_Flow_Burner_BK_Lit" background = 1
sleep 1000
if  "sw_Flow_Burner_BK_Lit"  state == true
goto "enderLoopLM_sw"
endif
"sw_Flow_Burner_BK_Lit" background = 2
sleep 1000
goto "Loop_LM_sw"
[enderLoopLM_sw]
"sw_Flow_Burner_BK_Lit" visibility = hidden
"alm_Hidden1_ALARM" active = false
"sw_Flow_Burner_BK_Lit"  state = false
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Top_3" value = "gblS_Save_BrewMsg1_Wo1" value
"gblS_Brewery_Top_3" background = "gblV_Save_BrewMsg_Background_Wo1" background
"gblS_Brewery_Top_3" visibility = "gblS_Save_BrewMsg_Visibility_Wo1" visibility
// Turn Burner off
[TurnLMBurnerOff]
wait "sw_Status_Burner_LittleMac" state == false
"MB_25_do_LittleMacBurner_B1" state = false
"MB_22_do_LittleMacIgnitor_Wo1" state = false
stop "looper_BURNER_scrLittleMacBurner"
```

## 94. looper_scrDeltaStrike

Starts by itself: No · User can start or stop it: Yes · 28 lines

```text
//looper_scrDeltaStrike
//12/14/2024 09:07
// MIT License Granted
//Copyright © OakBarn Brewery 2026
new value vVDesiredStrike
new value vVCTempMLTOut
new value vVDelta
"gblV_DeltaP1_B1" visibility = visible
[loopStrikeDelta]
sleep 100
vVCTempMLTOut = "MB_60_10K_MLT_Out_B1" value 
vVDesiredStrike = "gblV_Desired_Strike" value
vVDelta =    vVCTempMLTOut - vVDesiredStrike
"gblV_DeltaP1_B1" value = vVDelta 
if   vVDelta   > 1 
"gblV_DeltaP1_B1" background = 1
goto "loopStrikeDelta"
endif
if   vVDelta   <  -1  
"gblV_DeltaP1_B1" background = 3
goto "loopStrikeDelta"
endif
"gblV_DeltaP1_B1" background = 2
goto "loopStrikeDelta"
clear
stop "looper_scrDeltaStrike"
```

## 95. looper_scrBoilTimer_Reset

Starts by itself: No · User can start or stop it: Yes · 27 lines

```text
//looper_scrBoilTimer_Reset
//11/22/2020
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// allow me to set the main timer to a value I want
// hidden durning real brew sessions as it is used in testing
"gblT_SetTimer" visibility = visible
"sw_Advance_Timer" visibility = visible
"sw_Reset_Timer_Zero" visibility = visible
"gblV_Brew_Status" visibility = visible
new time xtime
[loop]
if "sw_Reset_Timer_Zero" state == true
"sw_Reset_Timer_Zero" state = false
"tm_Display_BottomRight_B1" value = 00:00:02
"tm_Action_BottomRight_B1" value = 00:00:02
endif
if  "sw_Advance_Timer"  state == true
"sw_Advance_Timer"  state = false
xtime = "gblT_SetTimer" value
"tmTopRight_B1" value = xtime
"tm_BottomRight_ALARM" value = "tmTopRight_B1" value
"tm_Mash Timer_Water" value = "tmTopRight_B1" value
"tmBottomRight_B1" value = "tmTopRight_B1" value
sleep 500
endif
goto "loop"
```

## 96. looper_scrBlinkClick

Starts by itself: No · User can start or stop it: Yes · 9 lines

```text
// MIT License Granted
//Copyright © OakBarn Brewery 2026
[Loop_Click]
"insp_Pix_ArrowHopSwitch_R1" visibility = visible
sleep 1000
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
sleep 1000
goto "Loop_Click"
```

## 97. looper_scrBlinkHopOz

Starts by itself: No · User can start or stop it: Yes · 9 lines

```text
// MIT License Granted
//Copyright © OakBarn Brewery 2026
[Loop_HopOz]
"inspHopOz" visibility = visible
sleep 4001
"inspHopOz" visibility = hidden
sleep 500
goto "Loop_HopOz"
```

## 98. looper_scrBlinkAAU

Starts by itself: No · User can start or stop it: Yes · 8 lines

```text
// MIT License Granted
//Copyright © OakBarn Brewery 2026
[Loop_AAU]
"inspAAUActual" visibility = visible
sleep 1000
"inspAAUActual" visibility = hidden
sleep 1000
goto "Loop_AAU"
```

## 99. looper_scrBlinkUseHop

Starts by itself: No · User can start or stop it: Yes · 10 lines

```text
// MIT License Granted
//Copyright © OakBarn Brewery 2026
"insp_UseHopBig" visibility = visible
[Loop_UseHop]
"insp_UseHop" visibility = visible
sleep 1500
"insp_UseHop" visibility =  hidden
sleep 4001
goto "Loop_UseHop"
```

## 100. step_scrTest_Time _Reset

Starts by itself: No · User can start or stop it: Yes · 445 lines

```text
//step_scrTest_Time _Reset
//07/18/2026 15:30
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Modified  07/18/2026 15:30
////Reset Timers to quickly advance manually
//............................................................................
//Test_Time _Reset
new value vVTimeSet
new time vT_Timer
vVTimeSet = 1
[LoopTestingTimer]
sleep 100
//..............................................
if vVTimeSet == 1
if   "gblV_Brew_Status" value ==  54
wait "tmRadiator_B1" value >=  00:00:10
"tmRadiator_B1" value = 00:02:58
vVTimeSet = 2
endif
endif
//..............................................
if vVTimeSet == 2
if   "gblV_Brew_Status" value ==  72
wait "tmBottomRight_B1" value >=  00:00:10
"tmBottomRight_B1" value = 00:08:57
vVTimeSet = 3
endif
endif
//..............................................
if vVTimeSet == 3
if   "gblV_Brew_Status" value ==  90
sleep 4001
"tmRadiator_B1" value = 00:00:07
"tmBigMac_B1" value = 00:00:15
vVTimeSet = 4
endif
endif
//..............................................
if vVTimeSet == 4
if   "gblV_Brew_Status" value ==  112
wait "tmBottomRight_B1" value >=  00:00:10
"gblT_SetTimer" value = 00:14:45
"sw_Advance_Timer"  state = true
vVTimeSet = 5
endif
endif
//..............................................
if vVTimeSet == 5
if   "gblV_Brew_Status" value ==  156
wait "tmBottomRight_B1" value >=  00:00:10
"gblT_SetTimer" value = 00:02:05
"sw_Advance_Timer"  state = true
vVTimeSet = 6
endif
endif
//..............................................
if vVTimeSet == 6
if   "gblV_Brew_Status" value ==  188
sleep 4001
"gblT_SetTimer" value = 00:00:05
"sw_Advance_Timer"  state = true
vVTimeSet = 7
endif
endif
//..............................................
if vVTimeSet == 7
if   "gblV_Brew_Status" value ==  204
wait "tmTopRight_B1" value <=  01:29:30
"gblT_SetTimer" value = 01:28:10
"sw_Advance_Timer"  state = true
vVTimeSet = 8
endif
endif
//..............................................
if vVTimeSet == 8
if   "gblV_Brew_Status" value ==  212
wait "tmBottomRight_B1" value >=  00:00:10
"gblT_SetTimer" value = 00:02:06
"sw_Advance_Timer"  state = true
vVTimeSet = 9
endif
endif
//..............................................
if vVTimeSet == 9
if   "gblV_Brew_Status" value ==  228
wait  "tmTopRight_B1" value <= 01:26:30
"gblT_SetTimer" value = 01:00:10
"sw_Advance_Timer"  state = true
vVTimeSet = 10
endif
endif
//..............................................
if vVTimeSet == 10
if   "gblV_Brew_Status" value ==  228
wait  "tmTopRight_B1" value <= 00:59:00
"gblT_SetTimer" value = 000:30:10
"sw_Advance_Timer"  state = true
vVTimeSet = 11
endif
endif
//..............................................
if vVTimeSet == 11
if   "gblV_Brew_Status" value ==  232
sleep 5000
"gblT_SetTimer" value = 00:29:35
"sw_Advance_Timer"  state = true
vVTimeSet = 12
endif
endif
//..............................................
if vVTimeSet == 12
if   "gblV_Brew_Status" value ==  236
wait  "tmTopRight_B1" value <= 00:29:20
"gblT_SetTimer" value = 00:15:05
"sw_Advance_Timer"  state = true
vVTimeSet = 13
endif
endif
//..............................................
if vVTimeSet == 13
if   "gblV_Brew_Status" value ==  242
wait  "tmTopRight_B1" value <= 00:14:30
"gblT_SetTimer" value = 00:05:10
"sw_Advance_Timer"  state = true
wait "tmTopRight_B1" value  <= 00:04:30
"gblT_SetTimer" value = 00:01:10
"sw_Advance_Timer"  state = true
wait "tmTopRight_B1" value  <= 00:00:45
"tmTopRight_B1" value = 00:00:10
vVTimeSet = 14
endif
endif
// scrBrew300
if vVTimeSet == 14
if "gblV_Brew_Status" value ==  310
sleep 3000
"tmBottomRight_B1" value = 00:00:05
vVTimeSet = 15
endif
endif
//..............................................
if vVTimeSet == 15
if "gblV_Brew_Status" value ==  324
wait "tmBottomRight_B1" value >=  00:00:10
"tmBottomRight_B1" value = 00:05:05
vVTimeSet = 16
endif
endif
//..............................................
if vVTimeSet == 16
if "gblV_Brew_Status" value ==  344
wait "tmBottomRight_B1" value >=  00:00:10
"tmBottomRight_B1" value = 00:13:58
vVTimeSet = 17
endif
endif
//..............................................
if vVTimeSet == 17
if "gblV_Brew_Status" value ==  348
sleep 500
"tmBottomRight_B1" value = 00:00:05
vVTimeSet = 18
endif
endif
//..............................................
if vVTimeSet == 18
if "gblV_Brew_Status" value ==  360
wait "tmBottomRight_B1" value >=  00:00:10
"tmBottomRight_B1" value = 00:05:01
vVTimeSet = 19
endif
endif
//..............................................
if vVTimeSet == 19
if "gblV_Brew_Status" value ==  380
wait "tmBottomRight_B1" value >=  00:00:10
"tmBottomRight_B1" value = 00:04:58
vVTimeSet = 20
endif
endif
//..............................................
// scrBrew400
if vVTimeSet == 20
if "gblV_Brew_Status" value ==  404
sleep 3000
//set to boil
"gblV_Brew_Status" value =  405
vVTimeSet = 21
endif
endif
//..............................................
if vVTimeSet == 21
if   "gblV_Brew_Status" value ==  416
wait "tmTopRight_B1" value <= 01:29:45
"gblT_SetTimer" value = 01:28:05
"sw_Advance_Timer"  state = true
vVTimeSet = 22
endif
endif
//..............................................
if vVTimeSet == 22
if   "gblV_Brew_Status" value ==  432
wait "tmBottomRight_B1" value >=  00:00:10
"tmBigMac_B1" value = 00:01:55
"tmBottomRight_B1" value = 00:01:55
print 1
vVTimeSet = 23
print 2
endif
endif
//..............................................
if vVTimeSet == 23
wait "VGC_36_do_ManifoldFill_On_B1" state == false
sleep 5000
"gblT_SetTimer" value = 01:20:05
"sw_Advance_Timer"  state = true
vVTimeSet = 24
endif
//..............................................
if vVTimeSet == 24
if   "gblV_Brew_Status" value ==  444
wait ""tmTopRight_B1"" value >=  01:19:45
"gblT_SetTimer" value = 01:16:10
"sw_Advance_Timer"  state = true
endif
if   "gblV_Brew_Status" value ==  448
wait "tmTopRight_B1" value <=  01:13:45
"gblT_SetTimer" value = 01:10:10
"sw_Advance_Timer"  state = true
vVTimeSet = 25
endif
endif

if vVTimeSet == 25
if   "gblV_Brew_Status" value ==  452
wait "tmTopRight_B1" value <= 01:09:30
"gblT_SetTimer" value = 01:00:10
"sw_Advance_Timer"  state = true
vVTimeSet = 26
endif
endif
//..............................................
if vVTimeSet == 26
if   "gblV_Brew_Status" value ==  452
wait "tmTopRight_B1" value <= 00:59:50
"gblT_SetTimer" value = 00:58:05
"sw_Advance_Timer"  state = true
vVTimeSet = 27
endif
endif
if vVTimeSet == 27
if   "gblV_Brew_Status" value ==  452
wait "tmTopRight_B1" value <= 00:57:50
"gblT_SetTimer" value = 00:55:05
"sw_Advance_Timer"  state = true

vVTimeSet = 28
endif
endif
//..............................................
if vVTimeSet == 28
if   "gblV_Brew_Status" value ==  464
wait "tmTopRight_B1" value <= 00:55:00
"gblT_SetTimer" value = 00:48:05
"sw_Advance_Timer"  state = true
vVTimeSet = 29
endif
endif
//..............................................
if vVTimeSet == 29
if   "gblV_Brew_Status" value ==  472
wait "tmTopRight_B1" value <= 00:47:15
"gblT_SetTimer" value = 00:25:05
"sw_Advance_Timer"  state = true
vVTimeSet = 30
endif
endif
//..............................................
if vVTimeSet == 30
if   "gblV_Brew_Status" value ==  476
wait "tmTopRight_B1" value <= 00:24:50
"gblT_SetTimer" value = 00:20:05
"sw_Advance_Timer"  state = true
vVTimeSet = 31
endif
endif
//..............................................
if vVTimeSet == 31
if   "gblV_Brew_Status" value ==  476
wait "tmTopRight_B1" value <= 00:19:45
"gblT_SetTimer" value = 00:17:15
"sw_Advance_Timer"  state = true
vVTimeSet = 32
endif
endif
//..............................................
if vVTimeSet == 32
if   "gblV_Brew_Status" value ==  476
wait "tmTopRight_B1" value <= 00:17:00
"gblT_SetTimer" value = 00:15:05
"sw_Advance_Timer"  state = true
vVTimeSet = 33
endif
endif
//..............................................
if vVTimeSet == 33
if   "gblV_Brew_Status" value ==  484
wait "tmTopRight_B1" value <= 00:14:45
"gblT_SetTimer" value = 00:01:10
"sw_Advance_Timer"  state = true
vVTimeSet = 34
endif
endif
//..............................................
if vVTimeSet == 34
if   "gblV_Brew_Status" value ==  488
wait "tmTopRight_B1" value <= 00:00:45
"gblT_SetTimer" value = 00:00:08
"sw_Advance_Timer"  state = true
vVTimeSet = 35
endif
endif
//..............................................
if vVTimeSet == 35
if   "gblV_Brew_Status" value ==  500
wait "gblVStartBrew" value == 2
wait "tmBottomRight_B1"  value <= 00:01:10
"gblT_SetTimer" value = 00:00:46
"sw_Advance_Timer"  state = true
wait "gblVStartBrew" value == 3
wait "tmBottomRight_B1"  value <= 00:00:40
"gblT_SetTimer" value = 00:00:31
"sw_Advance_Timer"  state = true
wait "gblVStartBrew" value == 4
wait "tmBottomRight_B1"  value <= 00:00:25
"gblT_SetTimer" value = 00:00:05
"sw_Advance_Timer"  state = true
vVTimeSet = 36
endif
endif
//..............................................
if vVTimeSet == 36
if   "gblV_Brew_Status" value ==  516
wait "gblVStartBrew" value == 6
wait "tmBottomRight_B1"  value <= 00:02:50
"gblT_SetTimer" value = 00:00:46
"sw_Advance_Timer"  state = true
wait "gblVStartBrew" value == 7
wait "tmBottomRight_B1"  value <= 00:00:40
"gblT_SetTimer" value = 00:00:31
"sw_Advance_Timer"  state = true
wait "gblVStartBrew" value == 8
wait "tmBottomRight_B1"  value <= 00:00:25
"gblT_SetTimer" value = 00:00:16
"sw_Advance_Timer"  state = true
wait "gblVStartBrew" value == 9
wait "tmBottomRight_B1"  value <= 00:00:10
"gblT_SetTimer" value = 00:00:02
"sw_Advance_Timer"  state = true
vVTimeSet = 37
endif
endif
//..............................................
if vVTimeSet == 37
if   "gblV_Brew_Status" value ==  524
wait "tmTopRight_B1"  value >= 00:0:18
"gblT_SetTimer" value = 00:11:01
"sw_Advance_Timer"  state = true
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:10
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
"gblV_Brew_Status" value =  525
vVTimeSet = 38
endif
endif
//..............................................
if vVTimeSet == 38
if   "gblV_Brew_Status" value ==  584
wait "tmBottomRight_B1" value  <= 00:09:50
"gblT_SetTimer" value = 00:09:35
"sw_Advance_Timer"  state = true
vVTimeSet = 39
endif
endif

//..............................................
if vVTimeSet == 39
if   "gblV_Brew_Status" value ==  588
wait "tmBottomRight_B1" value  <= 00:09:15
"gblT_SetTimer" value = 00:06:30
"sw_Advance_Timer"  state = true
vVTimeSet = 40
endif
endif
//..............................................
if vVTimeSet == 40
if   "gblV_Brew_Status" value ==  592
wait "tmBottomRight_B1" value  <= 00:06:40
"gblT_SetTimer" value = 00:06:10
"sw_Advance_Timer"  state = true
 vVTimeSet = 41
endif
endif
//..............................................
if vVTimeSet == 41
if  "gblV_Brew_Status" value ==  592
wait "tmBottomRight_B1" value  <= 00:05:15
"gblT_SetTimer" value = 00:00:10
"sw_Advance_Timer"  state = true
 vVTimeSet = 42
endif
endif
//..............................................
if vVTimeSet == 42
if  "gblV_Brew_Status" value ==  608
wait "tmBottomRight_B1" value  >= 00:00:15
"gblT_SetTimer" value = 00:08:15
"sw_Advance_Timer"  state = true
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:10
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
 vVTimeSet = 43
endif
endif
//..............................................
if vVTimeSet == 43
if  "gblV_Brew_Status" value ==  640
wait "tmBottomRight_B1" value  >= 00:00:15
"gblT_SetTimer" value = 00:01:18
"sw_Advance_Timer"  state = true
 vVTimeSet = 44
endif
endif
if vVTimeSet == 44
goto "EnderTesting"
endif
//..............................................
goto "LoopTestingTimer"
[EnderTesting]
stop "step_scrTest_Time _Reset"
```

## 101. step_scrHops_Timing

Starts by itself: No · User can start or stop it: Yes · 2044 lines

```text
//step_scrHops_Timing
//09/26/2023 14:20
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Modified 10/15/2023 09:58
// Hop Conflicts
//   1 = Start of Boil
//   1 Alarms and 10 Min Warnings are in scrBrew400
//   2 = next Ten Min Warning and Hop Drop are equal !o Min Warning follows Hop Alarm
//   3 = No Longer Used
//   4 =  Drop at 15 sets warning Alarms in sub_step_scrHops_15_Min
//   5 =  Not used
//   6 = Drop Less than 15  found in scrHopsGap
//   7 = Drop at 10 miniutes found in scrHopsGap
//   8 = next Ten Min > Drop
//   9 = No Conflict  next Ten Min < Drop
//   777 = Ten Minute at 15 (Hop Drop at 5 Min) in sub_step_scrHops_15_Min
//   -88 = Ready for Drop  after Ten Min Warning
//   -44 = Change from 4 to  Ready for Drop  after Ten Min Warning
//   -7777 = Ten Min at 15 with WhrilFloc and YN Alarm  with previous 4 above
// Hops Durning Boil, Flame Out, and Hop Rocket/
// Alarms start 240
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new time vT_Group_1_Drop
new time vT_Group_2_Drop
new time vT_Group_3_Drop
new time vT_Group_4_Drop
new time vT_Group_5_Drop
new time vT_Group_6_Drop
new time vT_Group_7_Drop
new time vT_Group_8_Drop
new time vT_Group_1_Ten
new time vT_Group_2_Ten
new time vT_Group_3_Ten
new time vT_Group_4_Ten
new time vT_Group_5_Ten
new time vT_Group_6_Ten
new time vT_Group_7_Ten
new time vT_Group_8_ten
new value vVGroup_1_Status
new value vVGroup_2_Status
new value vVGroup_3_Status
new value vVGroup_4_Status
new value vVGroup_5_Status
new value vVGroup_6_Status
new value vVGroup_7_Status
new value vVGroup_8_Status
new value vVGroup_EoB_Status
new value vVGroup_Rocket_Status
new string vSDisplay_Drop
new string vSDisplay_Ten
new string vSText_Ten_1
new string vSText_Drop_1
new string vSText_Ten_2
new string vSText_Drop_2
new string vSText_Ten_3
new string vSText_Drop_3
new string vSText_Hop_1
new string vSText_Hop_2
new string vSText_Hop_3
new string vSText_Hop_4
new string vSText_Hop_5
new string vSText_Hop_6
new string vSText_Hop_7
new string vSText_Hop_8
new string vSText
new string vSText_1
new string vSText_2
new string vSText_3
new value vV_Count_Groups
new bool vB_Music_1
new bool vB_Music_2
new bool vB_Music_3
new bool vB_Music_Irish
vSText_Hop_1 = "gblS_HopGroup_1" value
vSText_Hop_2 = "gblS_HopGroup_2" value
vSText_Hop_3 = "gblS_HopGroup_3" value
vSText_Hop_4 = "gblS_HopGroup_4" value
vSText_Hop_5 = "gblS_HopGroup_5" value
vSText_Hop_6 = "gblS_HopGroup_6" value
vSText_Hop_7 = "gblS_HopGroup_7" value
vSText_Hop_8 = "gblS_HopGroup_8" value
vVGroup_EoB_Status = "gblV_Group_EoB_Hops" value 
vVGroup_Rocket_Status = "gblV_Group_Hop Rocket" value
vVGroup_1_Status = "gblV_Group_1_Conflict" value
vVGroup_2_Status = "gblV_Group_2_Conflict" value
vVGroup_3_Status = "gblV_Group_3_Conflict" value
vVGroup_4_Status = "gblV_Group_4_Conflict" value
vVGroup_5_Status = "gblV_Group_5_Conflict" value
vVGroup_6_Status = "gblV_Group_6_Conflict" value
vVGroup_7_Status = "gblV_Group_7_Conflict" value
vVGroup_8_Status = "gblV_Group_8_Conflict" value
new value vV_Hop_17_Min
vV_Hop_17_Min = 0
vSText_Ten_2 = " ready to drop shortly.  Will Auto Advance."
vSText_Drop_2 = ".   Drop the Hops Now! Click the Alarm Off to Advance."
vV_Count_Groups = 0
"gblV_Group_SoB_Hops" value = vV_Count_Groups
if vVGroup_1_Status == -9999
vV_Count_Groups = "gblV_Group_SoB_Hops" value 
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
endif
if vVGroup_2_Status == -9999
vV_Count_Groups = "gblV_Group_SoB_Hops" value 
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
endif
if vVGroup_3_Status == -9999
vV_Count_Groups = "gblV_Group_SoB_Hops" value 
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
endif
if vVGroup_4_Status == -9999
vV_Count_Groups = "gblV_Group_SoB_Hops" value 
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
endif
if vVGroup_5_Status == -9999
vV_Count_Groups = "gblV_Group_SoB_Hops" value 
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
endif
if vVGroup_6_Status == -9999
vV_Count_Groups = "gblV_Group_SoB_Hops" value 
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
endif
if vVGroup_7_Status == -9999
vV_Count_Groups = "gblV_Group_SoB_Hops" value 
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
endif
if vVGroup_8_Status == -9999
vV_Count_Groups = "gblV_Group_SoB_Hops" value 
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
endif
//Group 1
vT_Group_1_Ten = "gblT_Group_1_10m_Time_Wo1" value
vT_Group_1_Drop = vT_Group_1_Ten - 00:10:00
if vVGroup_1_Status == 1
vVGroup_1_Status = -88
"gblV_Group_1_Conflict" value = vVGroup_1_Status
endif
// Group 2
if "gblV_Group_2_Conflict"  value >= 0
vT_Group_2_Ten = "gblT_Group_2_10m_Time_Wo1" value
vT_Group_2_Drop = vT_Group_2_Ten - 00:10:00
if vVGroup_2_Status == 1
vVGroup_2_Status = -88
"gblV_Group_2_Conflict" value = vVGroup_2_Status
endif
endif
// Group 3
if "gblV_Group_3_Conflict"  value >= 0
vT_Group_3_Ten = "gblT_Group_3_10m_Time_Wo1" value
vT_Group_3_Drop = vT_Group_3_Ten - 00:10:00
if vVGroup_3_Status == 1
vVGroup_3_Status = -88
"gblV_Group_3_Conflict" value = vVGroup_3_Status
endif
endif
//Group 4
if "gblV_Group_4_Conflict"  value >= 0
vT_Group_4_Ten = "gblT_Group_4_10m_Time_Wo1" value
vT_Group_4_Drop = vT_Group_4_Ten - 00:10:00
if vVGroup_4_Status == 1
vVGroup_4_Status = -88
"gblV_Group_4_Conflict" value = vVGroup_4_Status
endif
endif
// Group 5
if "gblV_Group_5_Conflict"  value >= 0
vT_Group_5_Ten = "gblT_Group_5_10m_Time_Wo1" value
vT_Group_5_Drop = vT_Group_5_Ten - 00:10:00
if vVGroup_5_Status == 1
vVGroup_5_Status = -88
"gblV_Group_5_Conflict" value = vVGroup_5_Status
endif
endif
//Group 6
if "gblV_Group_6_Conflict"  value >= 0
vT_Group_6_Ten = "gblT_Group_6_10m_Time_Wo1" value
vT_Group_6_Drop = vT_Group_6_Ten - 00:10:00
if vVGroup_6_Status == 1
vVGroup_6_Status = -88
"gblV_Group_6_Conflict" value = vVGroup_6_Status
endif
endif
// Group 7
if "gblV_Group_7_Conflict"  value >= 0
vT_Group_7_Ten = "gblT_Group_7_10m_Time_Wo1" value
vT_Group_7_Drop = vT_Group_7_Ten - 00:10:00
if vVGroup_7_Status == 1
vVGroup_7_Status = -88
"gblV_Group_7_Conflict" value = vVGroup_7_Status
endif
endif
// Group 8
if "gblV_Group_8_Conflict"  value >= 0
vT_Group_8_Ten = "gblT_Group_8_10m_Time_Wo1" value
vT_Group_8_Drop = vT_Group_8_Ten - 00:10:00
if vVGroup_8_Status == 1
vVGroup_8_Status = -88
"gblV_Group_8_Conflict" value = vVGroup_8_Status
endif
endif
wait "gblV_Brew_Status" value > 416

[LoopHops]
sleep 100
if "tmTopRight_B1" value < 00:15:20
goto "15_Hops_Script"
endif
if vV_Count_Groups == 8
//goto "15_Hops_Script"
endif
if "tmTopRight_B1" value < 00:16:00
// print "16 Goto 15"
goto "15_Hops_Script"
endif
if "tmTopRight_B1" value > 00:40:00
vSDisplay_Drop = "Drop Bitter Hops Now!"
vSDisplay_Ten = "10 Minute Bitter Hop Warning"
vSText_Drop_1 = "Bitter Hop Drop: "
vSText_Ten_1 = "Bitter Hop Ten Minutes Warning:  Get "
vSText_Drop_2 = ".   Drop the Bitter Hops Now! Click the Bittering Hop Alarm Off to Advance."
"alm_Hops_1_ALARM" background = 1
"alm_Hops_1_ALARM" fileindex = 1
"alm_Hops_1_ALARM" displayname = "Bittering Hops"
endif
if "tmTopRight_B1" value <= 00:40:00
if "tmTopRight_B1" value > 00:25:00
vSDisplay_Drop = "Drop Bitter Hops Now!"
vSDisplay_Ten = "10 Minute Flavor Hop Warning"
vSText_Drop_1 = "Bitter Hop Drop: "
vSText_Ten_1 = "Flavor Hop Ten Minutes Warning:  Get "
vSText_Drop_2 = ".   Drop the Bitter Hops Now! Click the Bittering Hop Alarm Off to Advance."
"alm_Hops_1_ALARM" background = 1
"alm_Hops_1_ALARM" fileindex = 1
"alm_Hops_1_ALARM" displayname = "Bittering Hops"
endif
endif
if "tmTopRight_B1" value <= 00:30:00
if "tmTopRight_B1" value > 00:25:00
vSDisplay_Drop = "Drop Flavor Hops Now!"
vSDisplay_Ten = "10 Minute Flavor Hop Warning"
vSText_Drop_1 = "Flavor Hop Drop: "
vSText_Ten_1 = "Flavor Hop Ten Minutes Warning:  Get "
vSText_Drop_2 = ".   Drop the Flavor Hops Now! Click the Flavor Hop Alarm Off to Advance."
"alm_Hops_1_ALARM" background = 2
"alm_Hops_1_ALARM" fileindex = 2
"alm_Hops_1_ALARM" displayname = "Flavor Hops"
endif
endif
if "tmTopRight_B1" value <= 00:25:00
if "tmTopRight_B1" value > 00:15:00
vSDisplay_Drop = "Drop Flavor Hops Now!"
vSDisplay_Ten = "10 Minute Aroma Hop Warning"
vSText_Drop_1 = "Flavor Hop Drop: "
vSText_Ten_1 = "Aroma Hop Ten Minutes Warning:  Get "
vSText_Drop_2 = ".   Drop the Flavor Hops Now! Click the Flavor Hop Alarm Off to Advance."
"alm_Hops_1_ALARM" background = 2
"alm_Hops_1_ALARM" fileindex = 2
"alm_Hops_1_ALARM" displayname = "Flavor Hops"
endif
endif
//Hop Alarms
[Hops_Group_1]
// print "Hop Alarms at 270 Count and Group 1 drop  and 10 min"
if vVGroup_1_Status  < -555
 print "Go to Hop 2 at 272"
goto "Hops_Group_2"
endif
if vVGroup_1_Status == -88
if vT_Group_1_Drop == vT_Group_2_Ten
vVGroup_1_Status = 2
"gblV_Group_1_Conflict" value = vVGroup_1_Status
else
goto "HopGroup1Drop"
endif
endif
if vVGroup_1_Status  > 7
// print ">7"
if  "tmTopRight_B1" value <= vT_Group_1_Ten
vSText = vSText_Ten_1 + vSText_Hop_1
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
vVGroup_1_Status = -88
"gblV_Group_1_Conflict" value = vVGroup_1_Status
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
show workspace  "B1 Brewery"
goto "Hops_Group_2"
endif
[HopGroup1Drop]
print vVGroup_1_Status
if vVGroup_1_Status == -88
print "Hop 1 = -88"
if  "tmTopRight_B1" value <= vT_Group_1_Drop
print "Hop1 Drop"
vSText = vSText_Drop_1 + vSText_Hop_1
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_1_Status = -9999
"gblV_Group_1_Conflict" value = vVGroup_1_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif
goto "Hops_Group_2"
endif
if vVGroup_1_Status == 2
if  "tmTopRight_B1" value <= vT_Group_1_Drop
vSText = vSText_Drop_1 + vSText_Hop_1
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_1_Status = -9999
"gblV_Group_1_Conflict" value = vVGroup_1_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
sleep 1000
vSText = vSText_Ten_1 + vSText_Hop_2
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_2_Status = -88
"gblV_Group_2_Conflict" value = vVGroup_2_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_2"
endif
if vVGroup_1_Status > 4
print "Hop 1 > 4"
if  "tmTopRight_B1" value <= vT_Group_1_Ten
vSText = vSText_Ten_1 + vSText_Hop_1
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_1_Status = -88
"gblV_Group_1_Conflict" value = vVGroup_1_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_2"
endif
if vVGroup_1_Status == 4
if  "tmTopRight_B1" value <= vT_Group_1_Ten
vSText = vSText_Ten_1 + vSText_Hop_1
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
vVGroup_1_Status = -44
"gblV_Group_1_Conflict" value = vVGroup_1_Status
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
show workspace  "B1 Brewery"
endif
goto "Hops_Group_2"
endif
[Hops_Group_2]
if vV_Count_Groups == 8 
// print "Count = 8"
goto "15_Hops_Script"
endif
if vVGroup_2_Status  < -555
// print "Go to Group_3"
goto "Hops_Group_3"
endif
if vVGroup_2_Status == -88
if vT_Group_2_Drop == vT_Group_3_Ten
vVGroup_2_Status = 2
"gblV_Group_2_Conflict" value = vVGroup_2_Status
endif
endif
// print "Group_2 Hop Alarms at 391 Count, Drop,  and 10 min"
// print "Count"
// print vV_Count_Groups
// print "Group_2 Status"
// print vVGroup_2_Status
// print "Group_2 Ten Minute"
// print vT_Group_2_Ten
if vVGroup_2_Status  > 7
// print ">7"
if  "tmTopRight_B1" value <= vT_Group_2_Ten
vSText = vSText_Ten_1 + vSText_Hop_2
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_2_Status = -88
"gblV_Group_2_Conflict" value = vVGroup_2_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_3"
endif
if vVGroup_2_Status == -88
// print "Hop 2 = -88"
if  "tmTopRight_B1" value <= vT_Group_2_Drop
vSText = vSText_Drop_1 + vSText_Hop_2
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_2_Status = -9999
"gblV_Group_2_Conflict" value = vVGroup_2_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif
goto "Hops_Group_3"
endif
if vVGroup_2_Status == 2
if  "tmTopRight_B1" value <= vT_Group_2_Drop
vSText = vSText_Drop_1 + vSText_Hop_2
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_2_Status = -9999
"gblV_Group_2_Conflict" value = vVGroup_2_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
sleep 1000
vSText = vSText_Ten_1 + vSText_Hop_3
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_3_Status = -88
"gblV_Group_3_Conflict" value = vVGroup_3_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_3"
endif
if vVGroup_2_Status > 4
// print "Hop 1 = 4"
if  "tmTopRight_B1" value <= vT_Group_2_Ten
vSText = vSText_Ten_1 + vSText_Hop_2
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_2_Status = -888
"gblV_Group_2_Conflict" value = vVGroup_2_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_3"
endif
if vVGroup_2_Status == 4
if  "tmTopRight_B1" value <= vT_Group_2_Ten
vSText = vSText_Ten_1 + vSText_Hop_2
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
vVGroup_2_Status = -44
"gblV_Group_2_Conflict" value = vVGroup_2_Status
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
show workspace  "B1 Brewery"
endif
goto "Hops_Group_3"
endif
[Hops_Group_3]
if vV_Count_Groups == 8 
// print "Count = 8"
goto "15_Hops_Script"
endif
if vVGroup_3_Status  < -555
// print "Go to Group_4"
goto "Hops_Group_4"
endif
if vVGroup_3_Status == -88
if vT_Group_3_Drop == vT_Group_4_Ten
vVGroup_3_Status = 2
"gblV_Group_3_Conflict" value = vVGroup_3_Status
endif
endif
// print "Group_3 Hop Alarms at 537 Count, Drop,  and 10 min"
// print "Count"
// print vV_Count_Groups
// print "Group_3 Status"
// print vVGroup_3_Status
// print "Group_3 Ten Minute"
// print vT_Group_3_Ten
if vVGroup_3_Status  > 7
// print ">7"
if  "tmTopRight_B1" value <= vT_Group_3_Ten
vSText = vSText_Ten_1 + vSText_Hop_3
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_3_Status = -88
"gblV_Group_3_Conflict" value = vVGroup_3_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_4"
endif
if vVGroup_3_Status == -88
// print "Hop 1 = -88"
if  "tmTopRight_B1" value <= vT_Group_3_Drop
vSText = vSText_Drop_1 + vSText_Hop_3
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_3_Status = -9999
"gblV_Group_3_Conflict" value = vVGroup_3_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif
goto "Hops_Group_4"
endif
if vVGroup_3_Status == 2
if  "tmTopRight_B1" value <= vT_Group_3_Drop
vSText = vSText_Drop_1 + vSText_Hop_3
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_3_Status = -9999
"gblV_Group_3_Conflict" value = vVGroup_3_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
sleep 1000
vSText = vSText_Ten_1 + vSText_Hop_4
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_4_Status = -88
"gblV_Group_4_Conflict" value = vVGroup_4_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_4"
endif
if vVGroup_3_Status > 4
// print "Hop 1 = 4"
if  "tmTopRight_B1" value <= vT_Group_3_Ten
vSText = vSText_Ten_1 + vSText_Hop_3
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_3_Status = -888
"gblV_Group_3_Conflict" value = vVGroup_3_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_4"
endif
if vVGroup_3_Status == 4
if  "tmTopRight_B1" value <= vT_Group_3_Ten
vSText = vSText_Ten_1 + vSText_Hop_3
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
vVGroup_3_Status = -44
"gblV_Group_3_Conflict" value = vVGroup_3_Status
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
show workspace  "B1 Brewery"
endif
goto "Hops_Group_4"
endif
[Hops_Group_4]
if vV_Count_Groups == 8 
// print "Count = 8"
goto "15_Hops_Script"
endif
if vVGroup_4_Status  < -555
// print "Go to Group_5"
goto "Hops_Group_5"
endif
if vVGroup_4_Status == -88
if vT_Group_4_Drop == vT_Group_5_Ten
vVGroup_4_Status = 2
"gblV_Group_4_Conflict" value = vVGroup_4_Status
endif
endif
// print "Group_4 Hop Alarms at 391 Count, Drop,  and 10 min"
// print "Count"
// print vV_Count_Groups
// print "Group_4 Status"
// print vVGroup_4_Status
// print "Group_4 Ten Minute"
// print vT_Group_4_Ten
if vVGroup_4_Status  > 7
// print ">7"
if  "tmTopRight_B1" value <= vT_Group_4_Ten
vSText = vSText_Ten_1 + vSText_Hop_4
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_4_Status = -88
"gblV_Group_4_Conflict" value = vVGroup_4_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_5"
endif
if vVGroup_4_Status == -88
// print "Hop 1 = -88"
if  "tmTopRight_B1" value <= vT_Group_4_Drop
vSText = vSText_Drop_1 + vSText_Hop_4
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_4_Status = -9999
"gblV_Group_4_Conflict" value = vVGroup_4_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif
goto "Hops_Group_5"
endif
if vVGroup_4_Status == 2
if  "tmTopRight_B1" value <= vT_Group_4_Drop
vSText = vSText_Drop_1 + vSText_Hop_4
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_4_Status = -9999
"gblV_Group_4_Conflict" value = vVGroup_4_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
sleep 1000
vSText = vSText_Ten_1 + vSText_Hop_5
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_5_Status = -88
"gblV_Group_5_Conflict" value = vVGroup_5_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_5"
endif
if vVGroup_4_Status > 4
// print "Hop 1 = 4"
if  "tmTopRight_B1" value <= vT_Group_4_Ten
vSText = vSText_Ten_1 + vSText_Hop_4
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_4_Status = -888
"gblV_Group_4_Conflict" value = vVGroup_4_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_5"
endif
if vVGroup_4_Status == 4
if  "tmTopRight_B1" value <= vT_Group_4_Ten
vSText = vSText_Ten_1 + vSText_Hop_4
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
vVGroup_4_Status = -44
"gblV_Group_4_Conflict" value = vVGroup_4_Status
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
show workspace  "B1 Brewery"
endif
goto "Hops_Group_5"
endif
[Hops_Group_5]
if vV_Count_Groups == 8 
// print "Count = 8"
goto "15_Hops_Script"
endif
if vVGroup_5_Status  < -555
// print "Go to Group_6"
goto "Hops_Group_6"
endif
if vVGroup_5_Status == -88
if vT_Group_5_Drop == vT_Group_6_Ten
vVGroup_5_Status = 2
"gblV_Group_5_Conflict" value = vVGroup_5_Status
endif
endif

// print "Group_5 Hop Alarms at 869 Count, Drop,  and 10 min"
// print "Count"
// print vV_Count_Groups
// print "Group_5 Status"
// print vVGroup_5_Status
// print "Group_5 Ten Minute"
// print vT_Group_5_Ten
if vVGroup_5_Status  > 7
// print ">7"
if  "tmTopRight_B1" value <= vT_Group_5_Ten
vSText = vSText_Ten_1 + vSText_Hop_5
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_5_Status = -88 
"gblV_Group_5_Conflict" value = vVGroup_5_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_6"
endif
if vVGroup_5_Status == -88
// print "Hop 1 = -88"
if  "tmTopRight_B1" value <= vT_Group_5_Drop
vSText = vSText_Drop_1 + vSText_Hop_5
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_5_Status = -9999
"gblV_Group_5_Conflict" value = vVGroup_5_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif
goto "Hops_Group_6"
endif
if vVGroup_5_Status == 2
if  "tmTopRight_B1" value <= vT_Group_5_Drop
vSText = vSText_Drop_1 + vSText_Hop_5
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_5_Status = -9999
"gblV_Group_5_Conflict" value = vVGroup_5_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
sleep 1000
vSText = vSText_Ten_1 + vSText_Hop_6
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_6_Status = -88
"gblV_Group_6_Conflict" value = vVGroup_6_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_6"
endif
if vVGroup_5_Status > 4
// print "Hop 1 = 4"
if  "tmTopRight_B1" value <= vT_Group_5_Ten
vSText = vSText_Ten_1 + vSText_Hop_5
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_5_Status = -888
"gblV_Group_5_Conflict" value = vVGroup_5_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_6"
endif
if vVGroup_5_Status == 4
if  "tmTopRight_B1" value <= vT_Group_5_Ten
vSText = vSText_Ten_1 + vSText_Hop_5
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
vVGroup_5_Status = -44
"gblV_Group_5_Conflict" value = vVGroup_5_Status
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
show workspace  "B1 Brewery"
endif
goto "Hops_Group_6"
endif
[Hops_Group_6]
if vV_Count_Groups == 8 
// print "Count = 8"
goto "15_Hops_Script"
endif
if vVGroup_6_Status  < -555
// print "Go to Group_7"
goto "Hops_Group_7"
endif
if vVGroup_6_Status == -88
if vT_Group_6_Drop == vT_Group_7_Ten
vVGroup_6_Status = 2
"gblV_Group_6_Conflict" value = vVGroup_6_Status
endif
endif
// print "Group_6 Hop Alarms at 1023 Count, Drop,  and 10 min"
// print "Count"
// print vV_Count_Groups
// print "Group_6 Status"
// print vVGroup_6_Status
// print "Group_6 Ten Minute"
// print vT_Group_6_Ten
if vVGroup_6_Status  > 7
// print ">7"
if  "tmTopRight_B1" value <= vT_Group_6_Ten
vSText = vSText_Ten_1 + vSText_Hop_6
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_6_Status = -88 
"gblV_Group_6_Conflict" value = vVGroup_6_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_7"
endif
if vVGroup_6_Status == -88
// print "Hop 1 = -88"
if  "tmTopRight_B1" value <= vT_Group_6_Drop
vSText = vSText_Drop_1 + vSText_Hop_6
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_6_Status = -9999
"gblV_Group_6_Conflict" value = vVGroup_6_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif
goto "Hops_Group_7"
endif
if vVGroup_6_Status == 2
if  "tmTopRight_B1" value <= vT_Group_6_Drop
vSText = vSText_Drop_1 + vSText_Hop_6
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_6_Status = -9999
"gblV_Group_6_Conflict" value = vVGroup_6_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
sleep 1000
vSText = vSText_Ten_1 + vSText_Hop_6
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_7_Status = -88
"gblV_Group_7_Conflict" value = vVGroup_7_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_7"
endif
if vVGroup_6_Status > 4
// print "Hop 1 = 4"
if  "tmTopRight_B1" value <= vT_Group_6_Ten
vSText = vSText_Ten_1 + vSText_Hop_6
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_6_Status = -888
"gblV_Group_6_Conflict" value = vVGroup_6_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_7"
endif
if vVGroup_6_Status == 4
if  "tmTopRight_B1" value <= vT_Group_6_Ten
vSText = vSText_Ten_1 + vSText_Hop_6
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
vVGroup_6_Status = -44
"gblV_Group_6_Conflict" value = vVGroup_6_Status
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
show workspace  "B1 Brewery"
endif
goto "Hops_Group_7"
endif
[Hops_Group_7]
if vV_Count_Groups == 8 
// print "Count = 8"
goto "15_Hops_Script"
endif
if vVGroup_7_Status  < -555
// print "Go to Group_8"
goto "Hops_Group_8"
endif
if vVGroup_7_Status == -88
if vT_Group_7_Drop == vT_Group_8_Ten
vVGroup_7_Status = 2
"gblV_Group_7_Conflict" value = vVGroup_7_Status
endif
endif

// print "Group_7 Hop Alarms at 1177 Count, Drop,  and 10 min"
// print "Count"
// print vV_Count_Groups
// print "Group_7 Status"
// print vVGroup_7_Status
// print "Group_7 Ten Minute"
// print vT_Group_7_Ten
if vVGroup_7_Status  > 7
// print ">7"
if  "tmTopRight_B1" value <= vT_Group_7_Ten
vSText = vSText_Ten_1 + vSText_Hop_7
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_7_Status = -88 
"gblV_Group_7_Conflict" value = vVGroup_7_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_8"
endif
if vVGroup_7_Status == -88
// print "Hop 1 = -88"
if  "tmTopRight_B1" value <= vT_Group_7_Drop
vSText = vSText_Drop_1 + vSText_Hop_7
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_7_Status = -9999
"gblV_Group_7_Conflict" value = vVGroup_7_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif
goto "Hops_Group_8"
endif
if vVGroup_7_Status == 2
if  "tmTopRight_B1" value <= vT_Group_7_Drop
vSText = vSText_Drop_1 + vSText_Hop_7
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_7_Status = -9999
"gblV_Group_7_Conflict" value = vVGroup_7_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
sleep 1000
vSText = vSText_Ten_1 + vSText_Hop_7
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_8_Status = -88
"gblV_Group_8_Conflict" value = vVGroup_8_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_8"
endif
if vVGroup_7_Status > 4
// print "Hop 1 = 4"
if  "tmTopRight_B1" value <= vT_Group_7_Ten
vSText = vSText_Ten_1 + vSText_Hop_7
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_7_Status = -888
"gblV_Group_7_Conflict" value = vVGroup_7_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_8"
endif
if vVGroup_7_Status == 4
if  "tmTopRight_B1" value <= vT_Group_7_Ten
vSText = vSText_Ten_1 + vSText_Hop_7
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
vVGroup_7_Status = -44
"gblV_Group_7_Conflict" value = vVGroup_7_Status
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
show workspace  "B1 Brewery"
endif
goto "Hops_Group_8"
endif
[Hops_Group_8]
if vV_Count_Groups == 8 
// print "Count = 8"
goto "15_Hops_Script"
endif
if vVGroup_8_Status  < -555
// print "Go to Group_Check_Time"
goto "Hops_Group_Check_Time"
endif
// print "Group_8 Hop Alarms at 391 Count, Drop,  and 10 min"
// print "Count"
// print vV_Count_Groups
// print "Group_8 Status"
// print vVGroup_8_Status
// print "Group_8 Ten Minute"
// print vT_Group_8_Ten
if vVGroup_8_Status  > 7
// print ">7"
if  "tmTopRight_B1" value <= vT_Group_8_Ten
vSText = vSText_Ten_1 + vSText_Hop_8
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_8_Status = -88 
"gblV_Group_8_Conflict" value = vVGroup_8_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_Check_Time"
endif
if vVGroup_8_Status == -88
// print "Hop 1 = -88"
if  "tmTopRight_B1" value <= vT_Group_8_Drop
vSText = vSText_Drop_1 + vSText_Hop_8
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_8_Status = -9999
"gblV_Group_8_Conflict" value = vVGroup_8_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif
goto "Hops_Group_Check_Time"
endif
if vVGroup_8_Status == 2
if  "tmTopRight_B1" value <= vT_Group_8_Drop
vSText = vSText_Drop_1 + vSText_Hop_8
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_8_Status = -9999
"gblV_Group_8_Conflict" value = vVGroup_8_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif
goto "Hops_Group_Check_Time"
endif
if vVGroup_8_Status > 4
// print "Hop 1 = 4"
if  "tmTopRight_B1" value <= vT_Group_8_Ten
vSText = vSText_Ten_1 + vSText_Hop_8
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
vB_Music_1 = "alm_Hidden_Beer_Music_1" active
vB_Music_2 = "alm_Hidden_Beer_Music_2" active
vB_Music_3 = "alm_Hidden_Beer_Music_3" active
vB_Music_Irish = "alm_Hidden_Irish_Moss_Warning_ALARM" active
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
wait "alm_Hops_1_ALARM" active == false
"alm_Hidden_Beer_Music_1" active = vB_Music_1
"alm_Hidden_Beer_Music_2" active = vB_Music_2
"alm_Hidden_Beer_Music_3" active = vB_Music_3
"alm_Hidden_Irish_Moss_Warning_ALARM" active = vB_Music_Irish
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_8_Status = -888
"gblV_Group_8_Conflict" value = vVGroup_8_Status
show workspace  "B1 Brewery"
endif
goto "Hops_Group_Check_Time"
endif
if vVGroup_8_Status == 4
if  "tmTopRight_B1" value <= vT_Group_8_Ten
vSText = vSText_Ten_1 + vSText_Hop_8
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
show workspace "Alarms"
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
vVGroup_8_Status = -44
"gblV_Group_8_Conflict" value = vVGroup_8_Status
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
show workspace  "B1 Brewery"
endif
goto "Hops_Group_Check_Time"
endif
[Hops_Group_Check_Time]
// print "Time Check"
if "tmTopRight_B1" value < 00:15:20
goto "15_Hops_Script"
endif
goto "LoopHops"
[15_Hops_Script]
// print "15 Min"
"gblV_Group_1_Conflict" value = vVGroup_1_Status
"gblV_Group_2_Conflict" value = vVGroup_2_Status
"gblV_Group_3_Conflict" value = vVGroup_3_Status
"gblV_Group_4_Conflict" value = vVGroup_4_Status
"gblV_Group_5_Conflict" value = vVGroup_5_Status
"gblV_Group_6_Conflict" value = vVGroup_6_Status
"gblV_Group_7_Conflict" value = vVGroup_7_Status
"gblV_Group_8_Conflict" value = vVGroup_8_Status
"gblV_Group_EoB_Hops" value = vVGroup_EoB_Status
"gblV_Group_Hop Rocket" value = vVGroup_Rocket_Status 
start "sub_step_scrHops_15_Min"
[EnderHops]
"sw_Running_Script_C" state = false
if vB_Testing == true
"gblS_Inter_Script" value = "ended: scrHops"
sleep 4001
endif
clear
stop "step_scrHops_Timing"
```

## 102. Test_Set_Status_Ferment

Starts by itself: No · User can start or stop it: Yes · 19 lines

```text
//scrFermentTest
//04/06/2026 19:03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Modified
//Sets up Test Fermentors
"gblV_FermentStatus_1" value = 5
"RP_v_1_Fermentor_Volume" value = 0
"gblV_FermentStatus_2" value = 1
"RP_v_2_Fermentor_Volume" value = 15.3
"gblV_FermentStatus_3" value = 2
"RP_v_3_Fermentor_Volume" value = 0
"gblV_FermentStatus_4" value = 5
"RP_v_4_Fermentor_Volume" value = 0
"gblV_FermentStatus_5" value = 4
"RP_v_5_Fermentor_Volume" value = 0
"gblV_FermentStatus_6" value = 6
"RP_v_6_Fermentor_Volume" value = 0
stop   "scrFermentTest"
```

## 103. Test_Set_Sample_TGS_Batch

Starts by itself: No · User can start or stop it: Yes · 176 lines

```text
//Test_Set_Sample_TGS_Batch
//Version 261001_14:00
// MIT License Granted
//Copyright © OakBarn Brewery 2026
 //03/10/2026 10:33
// Modified
// Reset the Hops and Batch for testing without importing the XML
[Set_Testing]
"sw_Running_Test_Batch" state = true
"sw_Test_TGS_Loaded" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"sw_Running_Test_Batch" state = true
"gblS_BeerName_R1" value = "Raymond's Best Bitter (TGS) 22 Gallons"
"gblVBrewLenght_R1" value = 22
"gblV_Distilled_to_Add" value = 0
"gblV_PreBoil_Volume_R1" value = 23.8
"gblVStrikeVolume" value = 13.1
"gblVWortTickness_R1" value = 1.25
"gblV_Grist_Ratio" value = .383
"gblV_SpargeVolume" value = 11.5
"gblVGrainWeight" value = 38.4
"gblV_BoilGravity_R1" value = 1.046
"gblVLagerAle" value = 1
"gblV_Number_Mash_Steps" value = 1
"delete_gblVLagerAle_BM" state = false
"sw_Flow_Sanitize_Radiator" state = false
"gblV_IBU_B1_R1" value = 29.7
"gblV_HBU_R1" value = 27.1
"sw_Status_2ndBatchYN" state = false
"gblV_Grain_Temp" value = 72
"gblV_Desired_Strike" value = 164.8
"gblV_StrikeOffset" value = 10
"sw_Use_Hop1_Batch" state = true
"sw_Use_Hop2_Batch" state = true
"sw_Use_Hop3_Batch" state = true
"sw_Use_Hop4_Batch" state = true
"sw_Use_Hop5_Batch" state = true
"sw_Use_Hop6_Batch" state = true
"sw_Use_Hop7_Batch" state = true
"sw_Use_Hop8_Batch" state = true
"gblS_Hop1_R1" value = "Warrior"
"gblS_Hop1_R1" displayname = "Hop #1 - Boiling"
"gblS_Hop1_R1" background = 2
"gblV_Hop1_Group_R1" value = 1
"gblS_Hop2_R1" value = "Hallertauer Mittelfrueh"
"gblS_Hop2_R1" displayname = "Hop #2 - Boiling"
"gblS_Hop2_R1" background = 2
"gblV_Hop2_Group_R1" value = 2
"gblS_Hop3_R1" value = "Styrian Goldings"
"gblS_Hop3_R1" displayname = "Hop #3 - Boiling"
"gblS_Hop3_R1" background = 2
"gblV_Hop3_Group_R1" value = 2
"gblS_Hop4_R1" value = "Target"
"gblS_Hop4_R1" displayname = "Hop #4 - 1st WORT"
"gblS_Hop5_R1" value = "Wiliamette "
"gblS_Hop5_R1" displayname = "Hop #5 at 154 °F Whirlpool"
"gblS_Hop6_R1" value = "John Jacob"
"gblS_Hop6_R1" displayname = "Hop #6 - Top of Mash"
"gblS_Hop7_R1" value = "Jingle Heimer"
"gblS_Hop7_R1" displayname = "Hop #7 - Start of Boil"
"gblS_Hop8_R1" value = "Smith"
"gblS_Hop8_R1" displayname = "Hop #8 - Dry Hop"
"gblV_Hop1_Oz_R1" value = 1.9
"gblV_Hop2_Oz_R1" value = 1.7
"gblV_Hop3_Oz_R1" value = 1.08
"gblV_Hop4_Oz_R1"  value = 2
"gblV_Hop5_Oz_R1"  value = 1.5
"gblV_Hop6_Oz_R1" value = 2
"gblV_Hop7_Oz_R1" value = 2.4
"gblV_Hop8_Oz_R1" value = 3
"gblV_Hop1_Recipe_AAU_R1" value = 15
"gblV_Hop2_Recipe_AAU_R1" value = 4
"gblV_Hop3_Recipe_AAU_R1" value = 1.9
"gblV_Hop4_Recipe_AAU_R1" value = 11
"gblV_Hop5_Recipe_AAU_R1" value = 2.3
"gblV_Hop6_Recipe_AAU_R1" value = 1.9
"gblV_Hop7_Recipe_AAU_R1" value = 5.5
"gblV_Hop8_Recipe_AAU_R1" value = 3.4
"gblV_Hop1_Actual_AAU_R1" value = 0
"gblV_Hop2_Actual_AAU_R1" value = 0
"gblV_Hop3_Actual_AAU_R1" value = 0
"gblV_Hop4_Actual_AAU_R1" value = 0
"gblV_Hop5_Actual_AAU_R1" value = 0
"gblV_Hop6_Actual_AAU_R1" value = 0
"gblV_Hop7_Actual_AAU_R1" value = 0
"gblV_Hop8_Actual_AAU_R1" value = 0
"gblV_Oz_Calculated_Hop1_R1" value = 0 
"gblV_Oz_Calculated_Hop2_R1" value = 0 
"gblV_Oz_Calculated_Hop3_R1" value = 0 
"gblV_Oz_Calculated_Hop4_R1" value = 0
"gblV_Oz_Calculated_Hop5_R1" value = 0
"gblV_Oz_Calculated_Hop6_R1" value = 0
"gblV_Oz_Calculated_Hop7_R1" value = 0
"gblV_Oz_Calculated_Hop8_R1" value = 0
"gblV_TimeHop1_Min_R1" value = 60
"gblV_TimeHop2_Min_R1" value = 15
"gblV_TimeHop3_Min_R1" value = 15
"gblV_TimeHop4_Min_R1" value = 90
"gblV_TimeHop5_Min_R1" value = 0
"gblV_TimeHop6_Min_R1" value = 0
"gblV_TimeHop7_Min_R1" value = 90
"gblV_TimeHop8_Min_R1" value = 0
"gblV_Hop1_Calc_IBU_R1" value = 0
"gblV_Hop2_Calc_IBU_R1" value = 0
"gblV_Hop3_Calc_IBU_R1" value = 0
"gblV_Hop4_Calc_IBU_R1" value = 0
"gblV_Hop5_Calc_IBU_R1" value = 0
"gblV_Hop6_Calc_IBU_R1" value = 0
"gblV_Hop7_Calc_IBU_R1" value = 0
"gblV_Hop8_Calc_IBU_R1" value = 0
"gblV_Hop4_Group_R1" value = -444
"gblV_Hop5_Group_R1" value = -999
"gblV_Hop6_Group_R1" value = -333
"gblV_Hop7_Group_R1" value = -888
"gblV_Hop8_Group_R1" value = -111
"gblT_Hop4Drop_R1" value = 00:01:30
"gblT_Hop5Drop_R1" value = 00:00:00
"sw_Use_Rocket_Hop5_Batch" state = true
"gblS_Hop4_R1" background = 1
"gblS_Hop5_R1" background = 3
"gblS_Hop6_R1" background = 3
"gblS_Hop7_R1" background = 2
"gblS_Hop8_R1" background = 1
//Visibility
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1"  visibility = visible
"gblV_Hop5_Recipe_AAU_R1"  visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = visible
"gblT_Hop4Drop_R1" visibility = visible
"gblT_Hop5Drop_R1" visibility = visible
"gblT_Hop6Drop_R1" visibility = visible
"gblT_Hop7Drop_R1" visibility = visible
"gblT_Hop8Drop_R1" visibility = visible
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = visible
"gblV_Hop4_Group_R1" visibility = visible
"gblV_Hop5_Group_R1" visibility = visible
"gblV_Hop6_Group_R1" visibility = visible
"gblV_Hop7_Group_R1" visibility = visible
"gblV_Hop8_Group_R1" visibility = visible
"gblS_Inter_Script" value = "@ 170 in Test_Set_Sample_TGS_Batch > start  Hops_1_Hop_Grouping"
start "Hops_1_Hop_Grouping"
"gblS_Inter_Script" value = "ended: Test_Set_Sample_TGS_Batch"
if vB_Testing == true
sleep 4001
endif
clear
"sw_Running_Test_Batch" state = false
stop "Test_Set_Sample_TGS_Batch"
```

## 104. strt_1_Set_Elements_Enabled

Starts by itself: No · User can start or stop it: Yes · 110 lines

```text
//strt_1_Set_Elements_Enabled
//07/26/2023 11:56
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// called @ 51 in scrStart0_0
[Set_Testing]
"sw_Running_Script_A" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new string vS_TopLeftValue
"MB_62_Analog_Big_Mac_Volume_Sensor_B1"  enabled = true
//Pseudo Controls
// Replaced by switches
//Burners
"MB_24_do_BrewKettleBurner_B1"  enabled = true
"MB_25_do_LittleMacBurner_B1"  enabled = true
//Pumps
"MB_32_do_WhitePump_B1" enabled = true
"MB_33_do_BluePump_B1"  enabled = true
"MB_34_do_GreenPump_B1"  enabled = true
"MB_35_do_YellowPump_B1"   enabled = true
"MB_36_do_RedPump_B1"  enabled = true
// Floats
"MB_40_di_Brewery_Float_Water" enabled = true
"MB_41_di_Manifold_Float_Water" enabled = true
//Contactors
"MB_14_do_RIMs_Contactor_Heat" enabled = true
"oldMB_15_do_QuadzillaContactor_Wo1" enabled = true
"MB_17_do_BigMac2Contactor_Wo1" enabled = true
// Pid and Hysterisis Off
"MB_08_Hys_RadiatorElement_Wo1" enabled = false
"MB_07_PID_Quadzilla_WO1" enabled = false
//"MB_02_Hys_BigMacElement2_WO1" enabled = false
//Ignitors
"MB_22_do_LittleMacIgnitor_Wo1" enabled = true
"MB_23_do_BrewKettleIgnitor_Wo1" enabled = true
// 12 v Widgets
"MB_28_do_ManualAlarm_B1" enabled = true
"MB_26_do_HotBreakFan_B1" enabled = true
// Temperature Guages
"MB_54_10K_Cool_B1" enabled = true
"MB_55_10K_Brew_Kettle_B1"  enabled = true
"MB_56_10k_Little_Mac_B1"  enabled = true
"MB_57_10kBigMac_B1" enabled = true
"MB_58_10KRadiator_B1" enabled = true
"MB_59_10K_MashReturn_B1" enabled = true 
"MB_60_10K_MLT_Out_B1" enabled = true 
"MB_61_10kWortOut_B1" enabled = true 
"OneW_201_CooledWater_B1" enabled = true 
"OneW_200_RadiatorBody_B1" enabled = true 
// Dins
"MB_47_di_Green_DINS"  enabled = true 
"MB_42_di_Red_DINS" enabled = true 
"MB_44_di_Yellow_DINS" enabled = true 
"MB_46_di_Blue_Dins" enabled = true 
"MB_43_di_EmergencyOff_DINS" enabled = true 
//Valves
"VGC_2_do_RedPumpValve_Off_V1" enabled = true
"VGC_3_do_RedPumpValve_On_B1"  enabled = true
"VGC_4_do_FermentFill_Off_V1"  enabled = true
"VGC_5_do_FermentFill_On_B1"   enabled = true
"VGC_7_do_Left_MLT_Isolation_On_B1" enabled = true
"VGC_8_do_BluePumpValve_On_B1"  enabled = true
"VGC_9_do_Left_MLT_Isolation_Off_V1"   enabled = true
"VGC_11_do_BluePumpValve_Off_V1"   enabled = true
"VGC_12_do_HermsWort_Off_V1"   enabled = true
"VGC_13_do_HermsWort_On_B1"   enabled = true
"VGC_14_do_YellowPumpValve_Off_V1"   enabled = true
"VGC_15_do_YellowPumpValve_On_B1"   enabled = true
"VGC_16_do_LittleMacIsolation_Off_V1"   enabled = true
"VGC_17_do_LittleMacIsolation_On_B1"   enabled = true
"VGC_18_do_BrewKettleTangental_Off_V1"   enabled = true
"VGC_19_do_BrewKettleTangental_On_B1"   enabled = true
"VGC_22_do_BackManifold_Left_Off_V1"   enabled = true
"VGC_23_do_BackManifold_Left_On_B1"   enabled = true
"VGC_24_do_LittleMacTangental_Off_V1" enabled = true
"VGC_25_do_LittleMacTangental_ON_B1" enabled = true
"VGC_26_do_Right_MLT_Isolation_On_B1" enabled = true
"VGC_27_do_Right_MLT_Isolation_Off_V1" enabled = true
"VGC_28_do_CrossManifold_On_B1" enabled = true
"VGC_29_do_CrossManifold_Off_V1"  enabled = true
"VGC_30_do_FireHose_On_B1" enabled = true
"VGC_31_do_FireHose_Off_V1" enabled = true
"VGC_32_do_RadiatorSupply_On_B1" enabled = true
"VGC_33_do_RadiatorSupply_Off_V1" enabled = true
"VGC_34_do_BigMac_Isolation_On_B1" enabled = true
"VGC_35_do_BigMac_Isolation_Off_V1" enabled = true
"VGC_36_do_ManifoldFill_On_B1"  enabled = true
"VGC_37_do_ManifoldFill_Off_V1"  enabled = true
"VGC_38_Back_Drain_Off_V1" enabled = true
"VGC_39_Back_Drain_On_B1" enabled = true
"VGC_40_do_BrewKettleIsolation_Off_V1" enabled = true
"VGC_41_do_BrewKettleIsolation_On_B1" enabled = true
"VGC_42_do_CoolingWater_OFF_V1" enabled = true
"VGC_43_do_CoolingWater_On_B1" enabled = true
"VGC_44_do_RadiatorTangental_Off_V1" enabled = true
"VGC_45_do_RadiatorTangental_On_B1" enabled = true
"VGC_46_do_BigMacTangental_Off_V1" enabled = true
"VGC_47_do_BigMacTangental_On_B1" enabled = true
"MB_32_do_WhitePump_B1" state = false
"VGC_48_do_WhitePumpValve_Off_V1" enabled = true
"VGC_49_do_WhitePumpValve_On_B1" enabled = true
"gblS_Inter_Script" value = "ended: D:strt_1_Set_Elements_Enabled"
if vB_Testing == true
sleep 4001
endif
clear
"sw_Running_Script_A" state  = false
stop "strt_1_Set_Elements_Enabled"
```

## 105. strt_2__Reset_General

Starts by itself: No · User can start or stop it: Yes · 443 lines

```text
//strt_2__Reset_General modified 26_07_20 09-17
//06/05/2024 11:27
//©  2026 OakBarn Brewery 
//  MIT License Granted
//Resets the scripts to start 
// called @ 74  in scrStart0_0
// Set Testing
"gblVScriptFlow" value = -98
[Set_Testing]
"sw_Running_Script_B" state = true
"sw_Test_TGS_Loaded" state = false
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblV_Node_Red_Imported"  value = 0
"gblS_BeerName_R1" value = "New Brew"
if vB_Testing == 1
"gblS_BeerName_R1" value = "Test Mode"
endif
//............................................................................
"gblS_Top_Text" value = "Kills Heaters and Pumps and a lot of other resets for a new Brew"
"gblS_Bottom_Text" value = "Will Auto Advance"
// 10 Second Delay
"gblV_Delay_Seconds" value = 5
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
// Switches
// Rims
"sw_Control_RIMs_Element" state = false
"MB_14_do_RIMs_Contactor_Heat" state = false
"MB_09_PWM_RIMs_Heat" enabled = false
"sw_Status_RIMS_Heat" state = false
"sw_Control_RIMs_Element_Running" state = false
//Big Mac
"sw_Control_BigMac_Element" state = false
"MB_17_do_BigMac2Contactor_Wo1" state = false
"MB_05_PWM_BigMacElement2_WO1" enabled = false
"sw_Status_BigMac_Heat_On" state = false
"swRestore_BigMac_Heat_Valves" state = false
//Radiator Body Element
"MB_08_PWM_Radiator_WO1" enabled = false
"sw_Control_Radiator_Element" state = false
// VCurrent Volumes and Others
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
//......
//......
"gblV_Fermentor" value = 0
"gblV_Rate" value = 0
"gblV_SPG_Delta_Rate" value = 0
"gblV_Vessel_From" value = 0
"gblV_Vessel_To" value = 0
"gblV_Vessel_Measure" value = 0
"glbV_Vessel_Adjust" value = 0
"gblV_Isolation_Valve" value = 0
//.................................................
//.................................................
"gblT_SetTimer" visibility = hidden
"sw_Advance_Timer" visibility = hidden
"sw_Reset_Timer_Zero" visibility = hidden
"gblV_Brew_Status" visibility = hidden
show workspace "B1 Brewery"
"gblVScriptFlow" value = 0
// ......................................
//.......................................
"insp_FireHosePix" visibility = hidden
"insp_WaterCoverRight" visibility = hidden
"sw_Advance__EndVolume" visibility = hidden
"insp_StartGallonLabel" visibility = hidden
"insp_BatchHide" visibility = hidden
"tmFireHoseDelay" visibility = hidden
"gblVEndlessLoop" value = 0
"MB_59_10K_MashReturn_B1" displayname = "Mash Return °F"
"tm_Delay_W1" displayname = "Short Delay"
"sw_Flow_ByBass_Hop_Calc" visibility = hidden
"sw_Flow_Burner_BK_Lit" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_BrewName_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"gblS_swAllSwitch_Label_Text"  visibility = hidden
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblV_PitchSetpoint_B1"  visibility = hidden
"gblV_DeltaP1_B1"   visibility = hidden
"gblVEndVolume_Water" visibility = hidden
"gblVStartVolume_Water" visibility = hidden
"insp_WaterCoverRight" visibility = hidden
"gblS_HopMessage_15_ALARM" visibility = hidden
//Mash Tun Display Names
"MB_59_10K_MashReturn_B1" displayname = "Mash Return °F"
"MB_60_10K_MLT_Out_B1" displayname = "Mash Tun Out  °F"
// Stop All Timersstop 
stop "tmTopRight_B1" 
stop "tmBrewDay_B1"
stop "tmBottomRight_B1"
stop "tmBigMac_B1"
stop "tmRadiator_B1"
stop "tm_Delay_W1"
stop "tm_HopTimer_WO1"
stop "tm_Hidden_1"
stop "tm_HopTimer_WO1"
stop "tm_Mash Timer_Water"
stop "tm_BottomRight_ALARM"
stop "tm_Action_TopRight_B1"
stop "tm_Delay_TopRight_B1" 
stop "tm_Action_BottomRight_B1" 
stop "tm_Display_BottomRight_B1" 
stop "tm_Hidden_1"
// Timer Visibility
"tmTopRight_B1" visibility = visible
"tm_Action_TopRight_B1"  visibility = hidden
"tm_Delay_TopRight_B1"  visibility = hidden
"tm_Action_BottomRight_B1" visibility = hidden
"tm_Display_BottomRight_B1"  visibility = hidden
"tmBrewDay_B1" visibility = hidden
"tmBottomRight_B1" visibility = hidden
"tmBigMac_B1" visibility = hidden
"tmRadiator_B1" visibility = hidden
"tm_Mash Timer_Water" visibility = hidden
"tm_BottomRight_ALARM" visibility = hidden
"tm_Delay_W1" visibility = visible
"tm_HopTimer_WO1" visibility = visible
"tm_Hidden_1" visibility = visible
"tm_HopTimer_WO1" visibility = visible
// Timer Values
"tmTopRight_B1" value = 00:00:00
"tmBrewDay_B1" value = 00:00:00
"tmBottomRight_B1" value = 00:00:00
"tmBigMac_B1" value = 00:00:00
"tmRadiator_B1" value = 00:00:00
"tm_Delay_W1" value = 00:00:00
"tm_HopTimer_WO1" value = 00:00:00
"tm_Hidden_1" value = 00:00:00
"tm_HopTimer_WO1" value = 00:00:00
"tm_Mash Timer_Water" value = 00:00:00
"tm_BottomRight_ALARM" value = 00:00:00
"tm_Action_TopRight_B1" value = 00:00:00
"tm_Delay_TopRight_B1" value = 00:00:00
"tm_Action_BottomRight_B1" value = 00:00:00
"tm_Display_BottomRight_B1" value = 00:00:00
"tm_Hidden_1"value = 00:00:00
//...................................................
"VGC_43_do_CoolingWater_On_B1" state = false
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_30_do_FireHose_On_B1" state = false
"MB_26_do_HotBreakFan_B1" state = false
"MB_28_do_ManualAlarm_B1" state = false
// Little Mac Burner
"sw_Control_Burner_LittleMac" state = false
"MB_22_do_LittleMacIgnitor_Wo1" state = false
"MB_25_do_LittleMacBurner_B1" state = false
//Brew Kettle Burner
"sw_Control_Burner_BK" state = false
"MB_24_do_BrewKettleBurner_B1"  state = false
"MB_23_do_BrewKettleIgnitor_Wo1" state = false
"sw_Status_Burner_BK" state = false
// pumps 
"MB_35_do_YellowPump_B1" state = false
"MB_36_do_RedPump_B1" state = false
"MB_33_do_BluePump_B1" state = false
"MB_34_do_GreenPump_B1" state = false
"MB_32_do_WhitePump_B1" state = false
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Top_3" value = "Resetting"
"gblS_Brewery_Bottom_3" value = "Resetting"
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Bottom_3" visibility = visible 
// Scripts 
//Water
"inspect_TEXT_1_Water" background = 1
"sw_Set_FireHose_1_Min" state = false
"sw_Set_FireHose_2_Min"  state = false
"sw_Set_FireHose_20_Sec" state = false
"sw_Set_FireHose_Time" state = false
"sw_Set_MSV_1_Min" state = false
"sw_Set_MSV_2_Min" state = false
"sw_Set_MSV_3_Min" state = false
"sw_Set_MSV_Time" state = false
"sw_Flow_FireHoseFloat" state = false
"sw_Flow_Manifold_Float" state = false
"insp_FireHosePix" visibility = hidden
"insp_Water_Gusher" visibility = hidden
"insp_Firehouse_Water" visibility = hidden
"insp_Manifold_Water" visibility = hidden
//......................................
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
// Alarms
"alm_BigMacFloat_Water" visibility = hidden
"alm_BigMacFloat_Water" active = false
"alm_Hidden1_ALARM"  visibility = hidden
"alm_StrikeSpargeMash_ALARM" visibility = hidden
//Timers
"tmBrewDay_B1" displayname = "Pre Brew"
"tmBrewDay_B1" value = 00:00:00
//Reset Reporting SG
"gblVReport_B1" precision = 1
"tmBottomRight_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait"
// Floats
"MB_40_di_Brewery_Float_Water" visibility = hidden
"MB_41_di_Manifold_Float_Water" visibility = hidden
// Start SetPoints
new value setSP
setSP = "gblV_Boil_Temp_R1" value
"gblV_SetpointBK_B1" value = setSP
setSP = "gblV_Preheat_ Temperature_R1" value
"gblV_BigMacSetPointP1_B1" value = setSP
delete setSP
"gblVStartBrew" value =  2
"gblV_StrikeSource_Wo1" value = 0
// Choice sub_scrCloseAllValves
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
[Skip2ChoiceCloseAllValves]
"gblS_Brewery_Top_2" value = "You can either go through Door #1 or Door #2.  Door #1 Closes all Valves, Door #2 just starts to the Brew Process with the valves in the position they are.  Make a choice!"

"gblS_swAllSwitch_Label_Text" value = "Make A Choice"
"gblSReportLabel_B1" value = "Close All Valves?"
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 0
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Backgrounds
"gblS_BrewName_B1" background = 1
"gblVReport_B1" background = 1
"gblSReportLabel_B1" background = 1
"gblS_Brewery_Top_2" background = 1 
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_BrewName_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 0
[Start_Choice_Again]
wait "gblVReport_B1" value > 0
[innerLoopChoiceCloseAllValves]
if "gblVReport_B1" value == 1
"gblV_Valve_Status" value = 1000
"gblS_Inter_Script" value = "@ 317 in strt_2__Reset_General > start D:sub_scrCloseAllValves"
start "sub_scrCloseAllValves"
sleep 100
wait "sw_Running_Script_D" state  == false
goto "EnderChoiceCloseValves"
endif
if "gblVReport_B1" value == 2
"gblV_Valve_Status" value = 0
goto "EnderChoiceCloseValves"
endif
if "gblVReport_B1" value  > 2
"gblS_Brewery_Top_2" background = 3 
"gblS_swAllSwitch_Label_Text" value = "Make A CORRECT Choice"
"gblS_swAllSwitch_Label_Text" background = 1
"gblVReport_B1" background = 3
"gblSReportLabel_B1" background = 3
sleep 5000
"gblVReport_B1" value = 0
"gblS_swAllSwitch_Label_Text" value = "Make A Choice"
goto "Start_Choice_Again"
endif
goto "innerLoopChoiceCloseAllValves"
wait  "gblVReport_B1" value > 0
[EnderChoiceCloseValves]
"sw_Advance_ BrewStatus" visibility = hidden
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 1
"gblS_swAllSwitch_Label_Text" background = 3
"gblVReport_B1" background = 1
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Choice Made"
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_BrewName_B1" background = 1
"gblS_Hop_Screen_Txt" visibility = hidden
goto "Start_Here"
[Start_Here]
start "inscpt_scr_Inner_Blue"
sleep 100

stop "tmTopRight_B1"
"tmTopRight_B1" type = countup
"tmTopRight_B1" displayname = "PreBrew"
"tmTopRight_B1" value = 00:00:00
start "tmTopRight_B1"
"tmTopRight_B1" visibility = visible
"gblS_Brewery_Top_1" visibility  = hidden
// Valves 
//Display Texts
"gblS_BrewName_B1" visibility = visible
goto "skipped2b"
[skipped2b]
"gblS_Water_Text_1_Water" visibility = hidden
//setpoints
"gblV_MLTSetpoint_P1_B1" visibility = hidden
//"Mash 2" visibility = hidden
"gblV_MLTSetpoint_P1_B1"  visibility = hidden
"MB_57_10kBigMac_B1" visibility = hidden
"gblV_DeltaP1_B1" visibility = hidden
"gblV_PitchSetpoint_B1"  visibility = hidden
//water
"sw_Set_FireHose_1_Min" visibility = visible
"sw_Set_FireHose_2_Min" visibility = visible
"sw_Set_FireHose_20_Sec" visibility = visible
"sw_Set_FireHose_Time" visibility = visible
"sw_Set_MSV_1_Min" visibility = visible
"sw_Set_MSV_2_Min" visibility = visible
"sw_Set_MSV_3_Min" visibility = visible
"sw_Set_MSV_Time"  visibility = visible
"sw_Flow_FireHoseFloat" visibility = visible
"sw_Flow_Manifold_Float"  visibility = visible
"tm_Water"  visibility = hidden
"insp_Water_Gusher"  visibility = hidden
"insp_FireHosePix" visibility = hidden
"MB_41_di_Manifold_Float_Water" visibility = hidden
"MB_40_di_Brewery_Float_Water"  visibility = hidden
"insp_Firehouse_Water" visibility = hidden
"insp_Manifold_Water" visibility = hidden
"gblT_SetTimer_Water" visibility = hidden
//Insp
"inspAAUActual"  visibility = hidden
"inspHopOz"  visibility = hidden
//Temp Visibility
// Wort
"MB_61_10kWortOut_B1" visibility = hidden
// Big Mac
 "MB_57_10kBigMac_B1" visibility = visible
"gblV_BigMacSetPointP1_B1" visibility = visible
// Radiator
"MB_58_10KRadiator_B1"  visibility = visible
"gblV_RadiatorSetPoint_P1_B1"  visibility = visible
// MLT
"MB_59_10K_MashReturn_B1" visibility = visible
"gblV_MLTSetpoint_P1_B1" visibility = visible
"gblV_DeltaP1_B1" visibility = hidden
//Cooling Water and Pitch
"gblV_PitchSetpoint_B1" visibility = hidden
// Wort 
"MB_61_10kWortOut_B1" visibility = hidden
"gblV_PitchSetpoint_B1" value = "gblVDesiredBatch1Setpoint_R1" value
//Brew Kettle
"MB_55_10K_Brew_Kettle_B1" visibility = visible
"gblV_SetpointBK_B1" visibility = visible
//Little Mac
"MB_56_10k_Little_Mac_B1" visibility = visible
"gblV_SetpointLittleMac_P1_B1" visibility = visible
// Alarm Light
"MB_28_do_ManualAlarm_B1" state = false
"MB_28_do_ManualAlarm_B1" background = 1
"MB_28_do_ManualAlarm_B1" visibility = hidden
//2nd Batch
"sw_Status_2ndBatchYN" state = false
"sw_Status_2ndBatchYN" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblVStartBrew" Value = 1
"gblVHop_1" value = 1
//Starts the scrBrew on a Brew Day.
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblT_SetTimer" visibility = hiddenlocked
"sw_Advance_Timer" visibility = hiddenlocked
"sw_Reset_Timer_Zero" visibility = hiddenlocked
"gblV_Brew_Status" visibility = hiddenlocked
// Fermentaion
[enderReset]
sleep 4001
"gblS_Brewery_Top_2" visibility = hidden
"gblVScriptFlow" value = -99
"gblS_Inter_Script" value = "ended B: strt_2__Reset_General"
if vB_Testing == true
sleep 4001
endif
clear
"sw_Running_Script_B" state = false
stop "strt_2__Reset_General"
```

## 106. strt_3_Reset_Batch 

Starts by itself: No · User can start or stop it: Yes · 137 lines

```text
//strt_3_Reset_Batch 
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// //Modified  06/22/2026 17:15
// called @ 100 in scrStart0_0
//............................................................................
"sw_Running_Script_C" state  = true
"gblVBrewLenght_R1" value = 0
"gblV_Distilled_to_Add" value  = 0
"gblVGrainWeight" value = 0
"gblV_BoilGravity_R1" value = 0
"gblV_Desired_Strike" value = 0
"gblVStrikeVolume" value = 0
"gblVHalfStrike" value = 0
"gblV_PreBoil_Volume_R1" value = 0
"sw_Status_2ndBatchYN" state = false
[Hop1]
"gblS_Hop1_R1" value = ""
"sw_Use_Hop1_Batch" state = false
"gblV_Hop1_Oz_R1" value = 0
"gblV_Hop1_Recipe_AAU_R1" value = 0
"gblV_Hop1_Actual_AAU_R1" value  = 0
"gblV_Oz_Calculated_Hop1_R1" value = 0
"gblV_TimeHop1_Min_R1" value = 0
"gblT_Hop1Drop_R1" value = 10:00:00
"gblV_Hop1_Calc_IBU_R1" value = 0
"sw_Use_Rocket_Hop1_Batch" state = false
"gblV_Hop1_Group_R1" value = 0
[Hop2]
"gblS_Hop2_R1" value = ""
"sw_Use_Hop2_Batch" state = false
"gblV_Hop2_Oz_R1" value = 0
"gblV_Hop2_Recipe_AAU_R1" value = 0
"gblV_Hop2_Actual_AAU_R1" value  = 0
"gblV_Oz_Calculated_Hop2_R1" value = 0
"gblV_TimeHop2_Min_R1" value = 0
"gblT_Hop2Drop_R1" value = 10:00:00
"gblV_Hop2_Calc_IBU_R1" value = 0
"sw_Use_Rocket_Hop2_Batch" state = false
"gblV_Hop2_Group_R1" value = 0
[Hop3]
"gblS_Hop3_R1" value = ""
"sw_Use_Hop3_Batch" state = false
"gblV_Hop3_Oz_R1" value = 0
"gblV_Hop3_Recipe_AAU_R1" value = 0
"gblV_Hop3_Actual_AAU_R1" value  = 0
"gblV_Oz_Calculated_Hop3_R1" value = 0
"gblV_TimeHop3_Min_R1" value = 0
"gblT_Hop3Drop_R1" value = 10:00:00
"gblV_Hop3_Calc_IBU_R1" value = 0
"sw_Use_Rocket_Hop3_Batch" state = false
"gblV_Hop3_Group_R1" value = 0
[Hop4]
"gblS_Hop4_R1" value = ""
"sw_Use_Hop4_Batch" state = false
"gblV_Hop4_Oz_R1" value = 0
"gblV_Hop4_Recipe_AAU_R1" value = 0
"gblV_Hop4_Actual_AAU_R1" value  = 0
"gblV_Oz_Calculated_Hop4_R1" value = 0
"gblV_TimeHop4_Min_R1" value = 0
"gblT_Hop4Drop_R1" value = 10:00:00
"gblV_Hop4_Calc_IBU_R1" value = 0
"sw_Use_Rocket_Hop4_Batch" state = false
"gblV_Hop4_Group_R1" value = 0
[Hop5]
"gblS_Hop5_R1" value = ""
"sw_Use_Hop5_Batch" state = false
"gblV_Hop5_Oz_R1" value = 0
"gblV_Hop5_Recipe_AAU_R1" value = 0
"gblV_Hop5_Actual_AAU_R1" value  = 0
"gblV_Oz_Calculated_Hop5_R1" value = 0
"gblV_TimeHop5_Min_R1" value = 0
"gblT_Hop5Drop_R1" value = 10:00:00
"gblV_Hop5_Calc_IBU_R1" value = 0
"sw_Use_Rocket_Hop5_Batch" state = false
"gblV_Hop5_Group_R1" value = 0
[Hop6]
"gblS_Hop6_R1" value = ""
"sw_Use_Hop6_Batch" state = false
"gblV_Hop6_Oz_R1" value = 0
"gblV_Hop6_Recipe_AAU_R1" value = 0
"gblV_Hop6_Actual_AAU_R1" value  = 0
"gblV_Oz_Calculated_Hop6_R1" value = 0
"gblV_TimeHop6_Min_R1" value = 0
"gblT_Hop6Drop_R1" value = 10:00:00
"gblV_Hop6_Calc_IBU_R1" value = 0
"sw_Use_Rocket_Hop6_Batch" state = false
"gblV_Hop6_Group_R1" value = 0
[Hop7]
"gblS_Hop7_R1" value = ""
"sw_Use_Hop7_Batch" state = false
"gblV_Hop7_Oz_R1" value = 0
"gblV_Hop7_Recipe_AAU_R1" value = 0
"gblV_Hop7_Actual_AAU_R1" value  = 0
"gblV_Oz_Calculated_Hop7_R1" value = 0
"gblV_TimeHop7_Min_R1" value = 0
"gblT_Hop7Drop_R1" value = 10:00:00
"gblV_Hop7_Calc_IBU_R1" value = 0
"sw_Use_Rocket_Hop7_Batch" state = false
"gblV_Hop7_Group_R1" value = 0
[Hop8]
"gblS_Hop8_R1" value = ""
"sw_Use_Hop8_Batch" state = false
"gblV_Hop8_Oz_R1" value = 0
"gblV_Hop8_Recipe_AAU_R1" value = 0
"gblV_Hop8_Actual_AAU_R1" value  = 0
"gblV_Oz_Calculated_Hop8_R1" value = 0
"gblV_TimeHop8_Min_R1" value = 0
"gblT_Hop8Drop_R1" value = 10:00:00
"gblV_Hop8_Calc_IBU_R1" value = 0
"sw_Use_Rocket_Hop8_Batch" state = false
"gblV_Hop8_Group_R1" value = 0
//........................................
//........................................
// VCurrent Volumes and others to Zero
"gblVCurrentRadiator_Volume" value = 0
"gblVCurrentBigMac_Volume" value = 0
"gblVCurrentMLT_Volume" value = 0
"gblVCurrentBrewKettle_Volume" value = 0
"gblVCurrentLittle_Volume"  value = 0
"gblVCurrentBrewzilla_Volume" value = 0
"gblVCurrentDigiboil_Volume" value = 0
//......
"gblV_Start_To" value = 0
"gblV_Start_From" value = 0
"gblV_Start_Adjust" value = 0
"gblV_Desired_Measured_Volume_End" value = 0
"gblV_Minimum_Volume_End" value = 0
//......
"gblV_Rate" value = 0
"gblV_SPG_Calculated" value = 0
"gblV_SPG_Delta_Rate" value = 0
"RP_dt_BrewDate" value =  Now 
//................................................
[End_strt_3_Reset_Batch ]
"sw_Running_Script_C" state  = false
stop "strt_3_Reset_Batch "
```

## 107. strt_4_Reset_Hops

Starts by itself: No · User can start or stop it: Yes · 63 lines

```text
//strt_4_Reset_Hops
//011/18/2024 11:58
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Modified 011/18/2024 11:58
// called @ 122 in scrStart0_0
// Hop Reset all on Working 1
[Set_Testing]
"sw_Running_Script_D" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblVScriptFlow" value = -98
"gblS_Hops_Mash" value = "x"
"gblV_Group_Hops_Mash" value = -9999
"gblS_FirstWort"  value = "x"
"gblV_Group_FirstWort" value = -9999
"gblS_HopGroup_0"  value = "x"
"gblV_Group_SoB_Hops" value = -9999
"gblT_Group_1_10m_Time_Wo1" value = 10:00:00:00
"gblS_HopGroup_1"  value = "x"
"gblV_Group_1_Conflict" value = -9999
"gblT_Group_2_10m_Time_Wo1" value = 10:00:00:00
"gblS_HopGroup_2"  value = "x"
"gblV_Group_2_Conflict" value = -9999
"gblT_Group_3_10m_Time_Wo1" value = 10:00:00:00
"gblS_HopGroup_3"  value = "x"
"gblV_Group_3_Conflict" value = -9999
"gblT_Group_4_10m_Time_Wo1" value = 10:00:00:00
"gblS_HopGroup_4"  value = "x"
"gblV_Group_4_Conflict" value = -9999
"gblT_Group_5_10m_Time_Wo1" value = 10:00:00:00
"gblS_HopGroup_5"  value = "x"
"gblV_Group_5_Conflict" value = -9999
"gblT_Group_6_10m_Time_Wo1" value = 10:00:00:00
"gblS_HopGroup_6"  value = "x"
"gblV_Group_6_Conflict" value = -9999
"gblT_Group_7_10m_Time_Wo1" value = 10:00:00:00
"gblS_HopGroup_7"  value = "x"
"gblV_Group_7_Conflict" value = -9999
"gblT_Group_8_10m_Time_Wo1" value = 10:00:00:00
"gblS_HopGroup_8"  value = "x"
"gblV_Group_8_Conflict" value = -9999
"gblS_HopGroup_EOB"  value = "x"
"gblV_Group_EoB_Hops" value = -9999
"gblS_HopGroup_Rocket"  value = "x"
"gblV_Group_Hop Rocket" value = -9999
"gblVScriptFlow" value = -99
"gblS_Inter_Script" value = "ended: strt_4_Reset_Hops"
if vB_Testing == true
sleep 4001
endif
clear
"sw_Running_Script_D" state = false
stop "strt_4_Reset_Hops"
```

## 108. strt_5_Reset_Reporting

Starts by itself: No · User can start or stop it: No · 101 lines

```text
//strt_5_Reset_Reporting
//08/09/2023 08:52
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Modified 12/01/2025 06:58
// called @ 144 in scrStart0_0
// Reset Reporting
//.............................................
[Set_Testing]
"sw_Running_Script_E" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
//PreStrike
"RP_dt_BrewDate" value =  01-02-0001 
"gblVCurrentBigMac_Volume" value = 0
"gblVCurrentRadiator_Volume" value = 0
"gblVCurrentMLT_Volume" value = 0
"gblVCurrentBrewKettle_Volume" value = 0
"gblVCurrentLittle_Volume" value = 0
"sw_Status_DeadSpace_Radiator" state = false
"sw_Status_Radiator_Control" state = false
"sw_Control_RIMs_Element_Running" state = false
"sw_Status_RIMS_Heat" state = false
"sw_Status_BigMac_Heat_On" state = false
"sw_Status_Burner_BK" state = false
"sw_Status_Burner_LittleMac" state = false
//.............................................
"RP_v_IntialRaditor_Volume" value = 0
"RP_v_Rad_PreHeat_Temp" value = 0
"RP_v_Big_Mac_Start_Volume" value = 0
"RP_v_BigMac_PreHeat_Temp" value = 0
"RP_v_Rad_SetPoint_PreHeat_Temp" value = 0
"RP_v_BigMac_SetPoint_PreHeat_Temp" value = 0
"RP_t_RaditorPreheat_Time" value =  00:00:00
"RP_t_BigMacPreheat_Time" value =  00:00:00
"RP_v_TapRaditor_Volume" value = 0
"RP_v_DistilledRaditor_Volume" value = 0
//.............................................
//Strike
//.............................................
"RP_v_Rad_PreStrike_Temp" value = 0
"RP_v_BigMac_PreStrike_Temp" value = 0
"RP_v_MLT_PreStrike_Temp" value = 0
"RP_v_Rad_Strike_Volume" value = 0
"RP_v_Strike_Volume" value = 0
"RP_t_TimetoStrike_Time" value = 00:00:00
"RP_v_Herms_Bath_Volume" value = 0
//.............................................
//MASH
//.............................................
"RP_v_Strike_at_Grain_Temp" value = 0
"RP_v_StartMashTemp_Temp" value = 0
"RP_v_MidMash_Temp" value = 0
"RP_v_EndMash_Temp" value = 0
//.............................................
//Sparge
//.............................................
"RP_v_GrainAbsorbtionRate" value = 0
"RP_v_Actual_Grain_Absorbed_Volume" value = 0
"RP_v_Flush_MASH_Volume" value = 0
"RP_v_Sparge_Volume" value = 0
"RP_v_Sparge_Temp" value = 0
//.............................................
//Pre Boil
//.............................................
"RP_v_First_Run_Volume" value = 0
"RP_v_2nd_Run_Volume" value = 0
"RP_v_TopOff_Volume" value = 0
"RP_v_PreBoil_Volume" value = 0
"RP_v_PreBoil_SG" value = 0
"RP_t_TimetoBoil_Time" value = 00:00:00

//.............................................
//Boil
//.............................................
"RP_v_BoilOff_Volume" value = 0
"RP_t_HotBreak_Time" value =  00:00:00
"RP_v_PostBoil_Volume"  value = 0
//.............................................
//Post Boil and Pitch
//.............................................
"RP_v_CoolingSource" value = 0
"RP_v_PostBoil_SG" value = 0
"RP_v_Cooling_Water_Temp" value = 0
"RP_v_FinalVolume" value = 0
"RP_t_CoolingTime" value =  00:00:00
"RP_v_Pitch_Temp" value = 0
"RP_v_Flush_System_WORT_Volume" value = 0
//.............................................
//Fermentor
//Brew Date
//.............................................
"RP_dt_BrewDate" value =  01-01-0001 
"gblS_Inter_Script" value = "ended E: strt_5_Reset_Reporting"
if vB_Testing == true
sleep 4001
endif
clear
"sw_Running_Script_E" state = false
stop  "strt_5_Reset_Reporting"
```

## 109. strt_6_End_All_Scripts

Starts by itself: No · User can start or stop it: Yes · 181 lines

```text
//strt_6_End_All_Scripts Modified 26_09_16 14-08
//06/15/2023 07:42
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// called @ 122 in scrStart0_0
// STOPS scripts
[Set_Testing]
"sw_Running_Script_D" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
stop "scrBrew0_1"
stop "scrBrew0_2_Batch_Setup_Hops"
stop "scrBrew0_2_1_CheckBoilGroup"
stop "scrBrew0_2_2_All_Hop_Scripts_Calculation"
stop "scrBrew0_3_Vessels"
stop "scrBrew0_3_Two_Vessels"
stop "scrBrew0_4_Strike_Tree"
stop "scrBrew0_5a_Fill_First"
stop "scrBrew0_5B_Fill_Second"
stop "sub_scrBrew_Fill_HERMs"
stop "sub_scrBrew_Fill_BigMac_HLT"
stop "scrBrew0_6_Extra_HLT"
stop "scrBrew0_7_SetFermentors"
stop "scrBrew0_8_Setpoints"
stop "scrBrew0_9_1_Start_Radiator"
stop "scrBrew0_9_2_Start_BigMac"
stop "scrBrew0_9_3_Start_BrewZilla"
stop "scrBrew0_10_1_Start_Heaters"
stop "scrBrew0_10_2_Heaters_Runnning"
stop "scrBrew200_Mashing"
stop "scrBrew200_1_Step_Mash"
stop "scrBrew200_2_Step_Mash"
stop "scrBrew200_3_Step_Mash"
stop "sub_scrDigiBoil_Ready"
stop "sub_scrBrewZilla_Ready"
stop "scrBrew300_1_First_WORT_Run"
stop "scrBrew300_2_Sparging and 2nd_Run"
stop "scrBrew300_3_Wait_Boil"
stop "scrBrew400_1_Start_Boil_HotBreak"
stop "scrBrew400_2_Boiling_Sanitize"
stop "scrBrew400_3_Boiling_to_End"
stop "scrBrew500_1_Whrilpooling"
stop "scrBrew500_2_Whrilpooling"
stop "scrBrew500_3_Trub_and_Fermentors"
stop "scr600_1_ SET_WORT_SOURCE"
stop "scr600_2_Choose_WORT_Source"
stop "scr600_3_Choose_Fermentor"
stop "scr600_4_FillFermentors"
stop "scr600_5_OG"
stop "scrBrew700_1_Refill_BigMac_Cleaning"
stop "scrBrew700_2"
stop "scrBrew700_3"
stop "scrBrew700_4"
stop "scrBrew800"
stop "scrBrew900"
stop "scrBrew900_2"
//sub
stop "sub_scrXMLImportHop1"
stop "Hops_1_Hop_Grouping"
stop "sub_scrBrewZilla_Ready"
stop "sub_scrDigiBoil_Ready"
stop "sub_scrBrew_Fill_HERMs"
stop "sub_scrBrew_Fill_BigMac_HLT"
stop "sub_scrTimeorVolume"
stop "sub_scrCloseAllValves"
stop "sub_scrDataExchangeFerment1"
stop "sub_scrDataExchangeMash"
stop "sub_scrRestore_B1"
stop "sub_scrHeaters"
stop "sub_scrOpenAllValves"
stop "sub_scrChoose_Fermentor"
stop "sub_scrFermentor_Set_Status_Select"
stop "sub_scrManifold_Choice"
stop "sub_Start_Testing"
stop "sub_Stop_Testing"
// Hops durning Brewing
stop "sub_step_scrHops_15_Min"
stop "sub_step_scrHops_Gap"
stop "sub_step_scrHops_EOB"
// Sub 2
stop "sub_2_scrValveOperation"
stop "sub_2_scrPrimeandBasicManifold"
stop "sub_2_scrPrimeandBasicManifold_External"
stop "sub_2_scrPrimeandBasicManifold_Brewzilla"
stop "sub_2_scrFermentor_Set_Status"
// Sub 3
stop "sub_3_scrCalculateSPG"
// Sub 4
stop "sub_4_scrVolume_to_Time_TRANFER_SPG"
stop "sub_4_scrSetSPG"
// Sub 5
stop "sub_5_scrTimetoSeconds"
//looper
stop "looper_scrAutoSwitch"
stop "looper_scrBackGrounds"
stop "looper_scrAutoSwitch_Hops"
stop "looper_scrBackground_Hops"
stop "looper_scrDin"
stop "looper_scrElementControl"
stop "looper_Heat_scrRimsHeat_Control"
stop "looper_Heat_scrRIMs_Heater"
stop "looper_Heat_scrBigMac_Hys_Control"
stop "looper_Heat_scrBigMacHeat"
stop "looper_Heat_scrRadiatorHeat_Hys_Control"
stop "looper_Heat_scrRadiator_Body_Heat"
stop "looper_BURNER_scrBrewKettleBurner"
stop "looper_BURNER_scrLittleMacBurner"
stop "looper_scrDeltaStrike"
stop "looper_scrBoilTimer_Reset"
stop "looper_scrBlinkClick"
stop "looper_scrBlinkHopOz"
stop "looper_scrBlinkAAU"
stop "looper_scrBlinkUseHop"
//step
stop "step_scrTest_Time _Reset"
stop "step_scrHops_Timing"
//test
stop "test_scrTestStart"
stop "Test_Set_Sample_TGS_Batch"
//strt START
stop "strt_2__Reset_General"
stop "strt_1_Set_Elements_Enabled"
stop "strt_3_Reset_Batch "
stop "strt_4_Reset_Hops"
stop "strt_5_Reset_Reporting"
//Hops
stop "hops_scrHopOrder5a"
stop "hops_scrHopOrder5b"
stop "hops_scrHopOrder5c"
stop "hops_scrHopOrder1to4"
stop "hops_scrSetNumberinBoil"
stop "Hops_3_Hop_Drop_Calculations"
stop "hops_scrSetHopGroupsReview"
stop "Hops_19_Hop_Text_Whirlpool"
stop "hops_scrHopSwitches"
stop "Hops_5_Hop_Calc_OZ"
stop "Hops_6_Hop_Calc_MAX"
stop "Hops_4_Hop_AAU_Check_Zero"
stop "hops_scrHopsConflicts"
// Set Hops and Calculations
stop "Hops_7_Hop_Warning_Text"
stop "Hops_8_Hop_Text_Mash"
stop "Hops_9_Hop_Text_1st_Wort"
stop "Hops_10_Hop_Text_SOB"
stop "Hops_11_Hop_Text_Drop_1 "
stop "Hops_12_Hop_Text_Drop_2 "
stop "Hops_13_Hop_Text_Drop_3"
stop "Hops_14_Hop_Text_Drop_4"
stop "Hops_15_Hop_Text_Drop_5"
stop "Hops_16_Hop_Text_Drop_6"
stop "Hops_17_Hop_Text_Drop_7"
stop "Hops_18_Hop_Text_Drop_8"
stop "Hops_20_Hop_Text_DryHop"
//Batch
stop "batch_2_Calc_Volumes"
stop "batch_scrManuaLCalc"
stop "batch_1_IBUs"
//In scripts
stop "inscpt_scrAdvancewithSwitch"
stop "inscpt_scrMessage_with_Delay"
//..................................
//..................................
//..................................
stop "utility_FireHose_Manifold_Supply_Water"
stop "utility_sub_RestoreAfterWater"
stop "utility_sub_WaterSetHide"
stop "utility_sub_Water_Visible"
stop "scrWater"
stop "scrWhitePump"
stop "scrYellowPump"
//..................................
//..................................
//..................................
[Ender]
"gblS_Inter_Script" value = "ended: D:strt_6_End_All_Scripts"
if vB_Testing == true
sleep 2001
endif
"sw_Running_Script_D" state = false
clear
stop  "strt_6_End_All_Scripts"
```

## 110. Hops_1_Hop_Grouping

Starts by itself: No · User can start or stop it: Yes · 802 lines

```text
//Hops_1_Hop_Grouping
//Version: 261002_08:16
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//heavy Modification
//01/21/2024 10:34
//created
//08/28/2023 11:37
//Sets Primary Grouping
// Lots of Help with Orginal Code from @RiverCityBrewing
//Code	Type
//.........................
//-111	Dry Hop
//-333	Top of Mash
//-444	1st Wort
//-888	Start of Boil
//-999	Whirlpool (shows the Hop Rocket switch)
//-999	Hop Rocket if "sw_Use_Rocket_HopN_Batch" state == true
//919	Boiling, Pre Sort
//10 / 20 / 30	Bitter / Flavor / Aroma (set in sub_scrHopGrouping_1 when the boil hops are out of sequence)
//1–8	Hop Groups During the Boil Order after sorting
//0	Hop Slot Not used
//..........................
//Order of Hop Drops
//1. Top of Mash
//2. 1st Wort
//3. Start of Boil
//4. Bitter Hops
//5. Flavor Hops
//6. Aroma Hops
//7. Whirlpool Hops
//7a. Hop Rocket
//8. Dry Hop (durning Fermentation)
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"sw_Running_Hop_Group1" state = true
new value vVHop1_Drop_Min
new value vVHop2_Drop_Min
new value vVHop3_Drop_Min
new value vVHop4_Drop_Min
new value vVHop5_Drop_Min
new value vVHop6_Drop_Min
new value vVHop7_Drop_Min
new value vVHop8_Drop_Min
new value vVBoilTime
new value vV_Group_Hop1
new value vV_Group_Hop2
new value vV_Group_Hop3
new value vV_Group_Hop4
new value vV_Group_Hop5
new value vV_Group_Hop6
new value vV_Group_Hop7
new value vV_Group_Hop8
new value vV_Count_Whirlpool
vVBoilTime = "gblVBoilTime_Minutes" value
vVHop1_Drop_Min = "gblV_TimeHop1_Min_R1" value
vVHop2_Drop_Min = "gblV_TimeHop2_Min_R1" value
vVHop3_Drop_Min = "gblV_TimeHop3_Min_R1" value
vVHop4_Drop_Min = "gblV_TimeHop4_Min_R1" value
vVHop5_Drop_Min = "gblV_TimeHop5_Min_R1" value
vVHop6_Drop_Min = "gblV_TimeHop6_Min_R1" value
vVHop7_Drop_Min = "gblV_TimeHop7_Min_R1" value
vVHop8_Drop_Min = "gblV_TimeHop8_Min_R1" value
vV_Group_Hop1 = "gblV_Hop1_Group_R1" value
vV_Group_Hop2 = "gblV_Hop2_Group_R1" value
vV_Group_Hop3 = "gblV_Hop3_Group_R1" value
vV_Group_Hop4 = "gblV_Hop4_Group_R1" value
vV_Group_Hop5 = "gblV_Hop5_Group_R1" value
vV_Group_Hop6 = "gblV_Hop6_Group_R1" value
vV_Group_Hop7 = "gblV_Hop7_Group_R1" value
vV_Group_Hop8 = "gblV_Hop8_Group_R1" value
"gblV_Group_Hops_Mash" value = -9999
"gblV_Group_FirstWort" value = -9999
"gblV_Group_SoB_Hops" value = -9999
"gblV_Group_1_Conflict" value = -9999
"gblV_Group_2_Conflict" value = -9999
"gblV_Group_3_Conflict" value = -9999
"gblV_Group_4_Conflict" value = -9999
"gblV_Group_5_Conflict" value = -9999
"gblV_Group_6_Conflict" value = -9999
"gblV_Group_7_Conflict" value = -9999
"gblV_Group_8_Conflict" value = -9999
"gblV_Group_EoB_Hops" value = -9999
"gblV_Group_Hop Rocket" value = -9999
"gblS_Hops_Mash" value = "None"
"gblS_FirstWort" value = "None"
"gblS_HopGroup_0" value = "None"
"gblS_HopGroup_1" value = "None"
"gblS_HopGroup_2" value = "None"
"gblS_HopGroup_3" value = "None"
"gblS_HopGroup_4" value = "None"
"gblS_HopGroup_5" value = "None"
"gblS_HopGroup_6" value = "None"
"gblS_HopGroup_7" value = "None"
"gblS_HopGroup_8" value = "None"
if vV_Group_Hop1 == -999
vV_Count_Whirlpool += 1
endif
if vV_Group_Hop2 == -999
vV_Count_Whirlpool += 1
endif
if vV_Group_Hop3 == -999
vV_Count_Whirlpool += 1
endif
if vV_Group_Hop4 == -999
vV_Count_Whirlpool += 1
endif
if vV_Group_Hop5 == -999
vV_Count_Whirlpool += 1
endif
if vV_Group_Hop6 == -999
vV_Count_Whirlpool += 1
endif
if vV_Group_Hop7 == -999
vV_Count_Whirlpool += 1
endif
if vV_Group_Hop8 == -999
vV_Count_Whirlpool += 1
endif
"tm_Delay_W1" type = countdown
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" displayname = "Ordering Hops"
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt"  value = "Wait! BruControl will order the Hops. You will need to set the AAU (Actual) to the Alpha Acid of the Hops used for this Brew.  This will allow BruControl to calculate the new Ounces (OZ) needed for this Brew.  You can see this on later screens.  This message is displayed for 1 minute.   You may also advance using the Advance Timer in the upper right."
"gblS_Hop_Screen_Txt" visibility = visible
sleep 1000
"tm_Delay_W1" value = 00:01:00
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
if vV_Group_Hop1 > 0
goto "Hop1Order"
endif
if vV_Group_Hop2 > 0
goto "Hop2Order"
endif
if vV_Group_Hop3 > 0
goto "Hop3Order"
endif
if vV_Group_Hop4 > 0
goto "Hop4Order"
endif
if vV_Group_Hop5 > 0
goto "Hop5Order"
endif
if vV_Group_Hop6 > 0
goto "Hop6Order"
endif
if vV_Group_Hop7 > 0
goto "Hop7Order"
endif
if vV_Group_Hop8 > 0
goto "Hop8Order"
endif
//No boil hops at all -- nothing to sequence, skip straight to cleanup
goto "LoopHopOrderEnd"
[Hop1Order]
print "@ 137 Hop1Order"
"gblV_Hop1_Group_R1" value = 1
	if vV_Group_Hop2 > 0
		if vVHop1_Drop_Min == vVHop2_Drop_Min
		"gblV_Hop2_Group_R1" value = 1
		endif
		//
		if vVHop1_Drop_Min > vVHop2_Drop_Min
		"gblV_Hop2_Group_R1" value = 2
		endif
		if vVHop1_Drop_Min < vVHop2_Drop_Min
		"gblV_Hop2_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
print 153
if vV_Group_Hop3 > 0
		if vVHop2_Drop_Min == vVHop3_Drop_Min
		"gblV_Hop3_Group_R1" value = "gblV_Hop2_Group_R1" value
		endif
		//
		if vVHop2_Drop_Min > vVHop3_Drop_Min
		"gblV_Hop3_Group_R1" value = "gblV_Hop2_Group_R1" value + 1
		endif
		if vVHop2_Drop_Min < vVHop3_Drop_Min
		"gblV_Hop3_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
print 168
	if vV_Group_Hop4 > 0
		if vVHop3_Drop_Min == vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value
		endif
		//
		if vVHop3_Drop_Min > vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value + 1
		endif
		if vVHop3_Drop_Min < vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop5 > 0
		if vVHop4_Drop_Min == vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value
		endif
		//
		if vVHop4_Drop_Min > vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value + 1
		endif
		if vVHop4_Drop_Min < vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
print 198
	if vV_Group_Hop6 > 0
		if vVHop5_Drop_Min == vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value
		endif
		//
		if vVHop5_Drop_Min > vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value + 1
		endif
		if vVHop5_Drop_Min < vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
print 213
	if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
print 228
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
print 244
goto "LoopHopOrderEnd"
[Hop2Order]
print "@ 239 Hop2Order"
"gblV_Hop2_Group_R1" value = 1
	//
	if vV_Group_Hop3 > 0
		if vVHop2_Drop_Min == vVHop3_Drop_Min
		"gblV_Hop3_Group_R1" value = "gblV_Hop2_Group_R1" value
		endif
		//
		if vVHop2_Drop_Min > vVHop3_Drop_Min
		"gblV_Hop3_Group_R1" value = "gblV_Hop2_Group_R1" value + 1
		endif
		if vVHop2_Drop_Min < vVHop3_Drop_Min
		"gblV_Hop3_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop4 > 0
		if vVHop3_Drop_Min == vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value
		endif
		//
		if vVHop3_Drop_Min > vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value + 1
		endif
		if vVHop3_Drop_Min < vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop5 > 0
		if vVHop4_Drop_Min == vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value
		endif
		//
		if vVHop4_Drop_Min > vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value  + 1
		endif
		if vVHop4_Drop_Min < vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop6 > 0
		if vVHop5_Drop_Min == vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value
		endif
		//
		if vVHop5_Drop_Min > vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value + 1
		endif
		if vVHop5_Drop_Min < vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop3Order]
print "@ 329 Hop3Order"
"gblV_Hop3_Group_R1" value = 1
	//
	if vV_Group_Hop4 > 0
		if vVHop3_Drop_Min == vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value
		endif
		//
		if vVHop3_Drop_Min > vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value + 1
		endif
		if vVHop3_Drop_Min < vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop5 > 0
		if vVHop4_Drop_Min == vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value
		endif
		//
		if vVHop4_Drop_Min > vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value  + 1
		endif
		if vVHop4_Drop_Min < vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop6 > 0
		if vVHop5_Drop_Min == vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value
		endif
		//
		if vVHop5_Drop_Min > vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value + 1
		endif
		if vVHop5_Drop_Min < vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop4Order]
print "@ 404 Hop4Order"
"gblV_Hop4_Group_R1" value = 1
	//
	if vV_Group_Hop5 > 0
		if vVHop4_Drop_Min == vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value
		endif
		//
		if vVHop4_Drop_Min > vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value  + 1
		endif
		if vVHop4_Drop_Min < vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop6 > 0
		if vVHop5_Drop_Min == vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value
		endif
		//
		if vVHop5_Drop_Min > vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value + 1
		endif
		if vVHop5_Drop_Min < vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop5Order]
print "@ 467 Hop5Order"

"gblV_Hop5_Group_R1" value = 1
	//
if vV_Group_Hop6 > 0
		if vVHop5_Drop_Min == vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value
		endif
		//
		if vVHop5_Drop_Min > vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value + 1
		endif
		if vVHop5_Drop_Min < vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop6Order]
print "@ 516 Hop6Order"
"gblV_Hop6_Group_R1" value = 1
	//
	if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop7Order]
print "@ 550 Hop7Order"
"gblV_Hop7_Group_R1" value = 1
	//
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop8Order]
print "@ 570 Hop8Order"
"gblV_Hop8_Group_R1" value = 1
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[919]
print "@ 575 Section 919"
"gblS_Hop_Screen_Txt" displayname = "Manually Order Hops"
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt"  value = "Wait!  Durning the Boil Hops are out of sequence.  Hops will now be put in General Groupings of Bitter, Flavor and Aroma.  This message is displayed for 1 minute.   You may also advance using the Advance Timer in the upper right."
if vV_Group_Hop1 > 0
"gblV_Hop1_Group_R1" visibility = hidden
  if vVHop1_Drop_Min  <=  15
   "gblV_Hop1_Group_R1" value = 30
   "gblV_Hop1_Group_R1" background = 3
   endif
  if vVHop1_Drop_Min  >=  16
  "gblV_Hop1_Group_R1" background = 2
  "gblV_Hop1_Group_R1" value = 20
   endif
   if vVHop1_Drop_Min  >=  31
  "gblV_Hop1_Group_R1" value = 10
  "gblV_Hop1_Group_R1" background = 1
  endif
 "gblV_Hop1_Group_R1" visibility = visible
endif
 if vV_Group_Hop2 > 0
"gblV_Hop2_Group_R1" visibility = hidden
  if vVHop2_Drop_Min  <=  15
   "gblV_Hop2_Group_R1" value = 30
   "gblV_Hop2_Group_R1" background = 3
   endif
  if vVHop2_Drop_Min  >=  16
  "gblV_Hop2_Group_R1" background = 2
  "gblV_Hop2_Group_R1" value = 20
   endif
   if vVHop2_Drop_Min  >=  31
  "gblV_Hop2_Group_R1" value = 10
  "gblV_Hop2_Group_R1" background = 1
  endif
 "gblV_Hop2_Group_R1" visibility = visible
endif
if vV_Group_Hop3 > 0
"gblV_Hop3_Group_R1" visibility = hidden
  if vVHop3_Drop_Min  <=  15
   "gblV_Hop3_Group_R1" value = 30
   "gblV_Hop3_Group_R1" background = 3
   endif
  if vVHop3_Drop_Min  >=  16
  "gblV_Hop3_Group_R1" background = 2
  "gblV_Hop3_Group_R1" value = 20
   endif
   if vVHop3_Drop_Min  >=  31
  "gblV_Hop3_Group_R1" value = 10
  "gblV_Hop3_Group_R1" background = 1
  endif
 "gblV_Hop3_Group_R1" visibility = visible
endif
 if vV_Group_Hop4 > 0
"gblV_Hop4_Group_R1" visibility = hidden
  if vVHop4_Drop_Min  <=  15
   "gblV_Hop4_Group_R1" value = 30
   "gblV_Hop4_Group_R1" background = 3
   endif
  if vVHop4_Drop_Min  >=  16
  "gblV_Hop4_Group_R1" background = 2
  "gblV_Hop4_Group_R1" value = 20
   endif
   if vVHop4_Drop_Min  >=  31
  "gblV_Hop4_Group_R1" value = 10
  "gblV_Hop4_Group_R1" background = 1
  endif
 "gblV_Hop4_Group_R1" visibility = visible
endif
if vV_Group_Hop5 > 0
"gblV_Hop5_Group_R1" visibility = hidden
  if vVHop5_Drop_Min  <=  15
   "gblV_Hop5_Group_R1" value = 30
   "gblV_Hop5_Group_R1" background = 3
   endif
  if vVHop5_Drop_Min  >=  16
  "gblV_Hop5_Group_R1" background = 2
  "gblV_Hop5_Group_R1" value = 20
   endif
   if vVHop5_Drop_Min  >=  31
  "gblV_Hop5_Group_R1" value = 10
  "gblV_Hop5_Group_R1" background = 1
  endif
 "gblV_Hop5_Group_R1" visibility = visible
endif
if vV_Group_Hop6 > 0
"gblV_Hop6_Group_R1" visibility = hidden
  if vVHop6_Drop_Min  <=  15
   "gblV_Hop6_Group_R1" value = 30
   "gblV_Hop6_Group_R1" background = 3
   endif
  if vVHop6_Drop_Min  >=  16
  "gblV_Hop6_Group_R1" background = 2
  "gblV_Hop6_Group_R1" value = 20
   endif
   if vVHop6_Drop_Min  >=  31
  "gblV_Hop6_Group_R1" value = 10
  "gblV_Hop6_Group_R1" background = 1
  endif
 "gblV_Hop6_Group_R1" visibility = visible
endif
if vV_Group_Hop7 > 0
"gblV_Hop7_Group_R1" visibility = hidden
  if vVHop7_Drop_Min  <=  15
   "gblV_Hop7_Group_R1" value = 30
   "gblV_Hop7_Group_R1" background = 3
   endif
  if vVHop7_Drop_Min  >=  16
  "gblV_Hop7_Group_R1" background = 2
  "gblV_Hop7_Group_R1" value = 20
   endif
   if vVHop7_Drop_Min  >=  31
  "gblV_Hop7_Group_R1" value = 10
  "gblV_Hop7_Group_R1" background = 1
  endif
 "gblV_Hop7_Group_R1" visibility = visible
endif
if vV_Group_Hop8 > 0
"gblV_Hop8_Group_R1" visibility = hidden
  if vVHop8_Drop_Min  <=  15
   "gblV_Hop8_Group_R1" value = 30
   "gblV_Hop8_Group_R1" background = 3
   endif
  if vVHop8_Drop_Min  >=  16
  "gblV_Hop8_Group_R1" background = 2
  "gblV_Hop8_Group_R1" value = 20
   endif
   if vVHop8_Drop_Min  >=  31
  "gblV_Hop8_Group_R1" value = 10
  "gblV_Hop8_Group_R1" background = 1
  endif
 "gblV_Hop8_Group_R1" visibility = visible
endif
clear
//.....................................
//.....................................
"gblS_Inter_Script" value = "@ 722 in Hops_1_Hop_Grouping > start E:Hops_2_Hop_Boil_set_Types_10_20_30"
start "Hops_2_Hop_Boil_set_Types_10_20_30"
sleep 100
// This will happen when Aroma Hop Order is done or No Boil Hops
// Bitter Hops, Flavor Hops, Aroma Hops set in scripts called in Hops_2_Hop_Boil_set_Types_10_20_30
wait "sw_Running_Script_E" state == false
goto "LoopHopOrderEnd"
[LoopHopOrderEnd]
sleep 100
wait "tm_Delay_W1" value <= 00:00:57
"sw_Advance_Hop_Delay" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt"  visibility = hidden
goto "HopOrderEnd1"
[HopOrderEnd1]
print "@ 737 HopOrderEnd1"
if vV_Count_Whirlpool   > 0
print "@ 739 Whrilpool Hops"
sleep 200
"gblS_Hop_Screen_Txt" displayname = "Whirlpool Hops"
"gblS_Hop_Screen_Txt" background = 2
"gblS_Hop_Screen_Txt"  value = "Wait! There are Whirlpool Hops.  You need to click the Hop Rocket Switch if any of those will be in the Hop Rocket.   This will later set up some texts and Alarms if you have any hops for the Hop Rocket.  This message is displayed for 1 minute.   You may also advance using the Advance Timer in the upper right."
"tm_Delay_W1" value =  00:01:00
start "tm_Delay_W1"
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" visibility = visible
"sw_Advance_Hop_Delay" visibility = visible
goto "LoopHopOrderEnd2"
endif
[LoopHopOrderEnd2]
	if "tm_Delay_W1" value <= 00:00:00
	stop "tm_Delay_W1"
	"tm_Delay_W1" visibility = hidden
	"gblS_Hop_Screen_Txt"  visibility = hidden
	"sw_Advance_Hop_Delay" visibility = hidden
	goto "HopOrderEnd2"
	endif
goto "LoopHopOrderEnd2"
[HopOrderEnd2]
"sw_Advance_Hop_Delay" visibility = hidden
"sw_Advance_HopsCalc" visibility = visible
"insp_Pix_ArrowHopSwitch_R1" visibility = visible
sleep 100
"gblS_Hop_Screen_Txt"  value = "Wait, Will Auto Advance"
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" visibility = visible
"gblS_Inter_Script" value = "@ 772 in Hops_1_Hop_Grouping > start Hops_3_Hop_Drop_Calculations"
start "Hops_3_Hop_Drop_Calculations"
sleep 100
wait "sw_Running_Script_F" state == false
if vB_Testing == true
sleep 2001
endif
// set to false in Hops_3_Hop_Drop_Calculations
wait "sw_Running_Hop_Group1" state == false
"gblS_Inter_Script" value = "ended: Hops_1_Hop_Grouping"
if vB_Testing == true
sleep 4001
endif
clear
stop  "Hops_1_Hop_Grouping"
```

## 111. xHops_1_Hop_Grouping

Starts by itself: No · User can start or stop it: Yes · 798 lines

```text
//Hops_1_Hop_Grouping
//Version: 261002_08:16
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//heavy Modification
//01/21/2024 10:34
//created
//08/28/2023 11:37
//© OakBarn Brewery
//Sets Primary Grouping
// Lots of Help with Orginal Code from @RiverCityBrewing
//Code	Type
//.........................
//-111	Dry Hop
//-333	Top of Mash
//-444	1st Wort
//-888	Start of Boil
//-999	Whirlpool (shows the Hop Rocket switch)
//-999	Hop Rocket if "sw_Use_Rocket_HopN_Batch" state == true
//919	Boiling, Pre Sort
//10 / 20 / 30	Bitter / Flavor / Aroma (set in sub_scrHopGrouping_1 when the boil hops are out of sequence)
//1–8	Hop Groups During the Boil Order after sorting
//0	Hop Slot Not used
//..........................
//Order of Hop Drops
//1. Top of Mash  	
//2. 1st Wort			
//3. Start of Boil	
//4. Bitter Hops
//5. Flavor Hops
//6. Aroma Hops
//7. Whirlpool Hops
//7a. Hop Rocket
//8. Dry Hop (durning Fermentation)
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"sw_Running_Hop_Group1" state = true
new value vVHop1_Drop_Min
new value vVHop2_Drop_Min
new value vVHop3_Drop_Min
new value vVHop4_Drop_Min
new value vVHop5_Drop_Min
new value vVHop6_Drop_Min
new value vVHop7_Drop_Min
new value vVHop8_Drop_Min
new value vVBoilTime
new value vV_Group_Hop1
new value vV_Group_Hop2
new value vV_Group_Hop3
new value vV_Group_Hop4
new value vV_Group_Hop5
new value vV_Group_Hop6
new value vV_Group_Hop7
new value vV_Group_Hop8
new value vV_Count_Whirlpool
vVBoilTime = "gblVBoilTime_Minutes" value
vVHop1_Drop_Min = "gblV_TimeHop1_Min_R1" value
vVHop2_Drop_Min = "gblV_TimeHop2_Min_R1" value
vVHop3_Drop_Min = "gblV_TimeHop3_Min_R1" value
vVHop4_Drop_Min = "gblV_TimeHop4_Min_R1" value
vVHop5_Drop_Min = "gblV_TimeHop5_Min_R1" value
vVHop6_Drop_Min = "gblV_TimeHop6_Min_R1" value
vVHop7_Drop_Min = "gblV_TimeHop7_Min_R1" value
vVHop8_Drop_Min = "gblV_TimeHop8_Min_R1" value
vV_Group_Hop1 = "gblV_Hop1_Group_R1" value
vV_Group_Hop2 = "gblV_Hop2_Group_R1" value
vV_Group_Hop3 = "gblV_Hop3_Group_R1" value
vV_Group_Hop4 = "gblV_Hop4_Group_R1" value
vV_Group_Hop5 = "gblV_Hop5_Group_R1" value
vV_Group_Hop6 = "gblV_Hop6_Group_R1" value
vV_Group_Hop7 = "gblV_Hop7_Group_R1" value
vV_Group_Hop8 = "gblV_Hop8_Group_R1" value
"gblV_Group_Hops_Mash" value = -9999
"gblV_Group_FirstWort" value = -9999
"gblV_Group_SoB_Hops" value = -9999
"gblV_Group_1_Conflict" value = -9999
"gblV_Group_2_Conflict" value = -9999
"gblV_Group_3_Conflict" value = -9999
"gblV_Group_4_Conflict" value = -9999
"gblV_Group_5_Conflict" value = -9999
"gblV_Group_6_Conflict" value = -9999
"gblV_Group_7_Conflict" value = -9999
"gblV_Group_8_Conflict" value = -9999
"gblV_Group_EoB_Hops" value = -9999
"gblV_Group_Hop Rocket" value = -9999
"gblS_Hops_Mash" value = "None"
"gblS_FirstWort" value = "None"
"gblS_HopGroup_0" value = "None"
"gblS_HopGroup_2" value = "None"
"gblS_HopGroup_3" value = "None"
"gblS_HopGroup_4" value = "None"
"gblS_HopGroup_5" value = "None"
"gblS_HopGroup_6" value = "None"
"gblS_HopGroup_7" value = "None"
"gblS_HopGroup_8" value = "None"
if vV_Group_Hop1 == -999
vV_Count_Whirlpool += 1 
endif
if vV_Group_Hop2 == -999
vV_Count_Whirlpool += 1 
endif
if vV_Group_Hop3 == -999
vV_Count_Whirlpool += 1 
endif
if vV_Group_Hop4 == -999
vV_Count_Whirlpool += 1 
endif
if vV_Group_Hop5 == -999
vV_Count_Whirlpool += 1 
endif
if vV_Group_Hop6 == -999
vV_Count_Whirlpool += 1 
endif
if vV_Group_Hop7 == -999
vV_Count_Whirlpool += 1 
endif
if vV_Group_Hop8 == -999
vV_Count_Whirlpool += 1 
endif	
"tm_Delay_W1" type = countdown
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" displayname = "Ordering Hops"
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt"  value = "Wait! BruControl will order the Hops. You will need to set the AAU (Actual) to the Alpha Acid of the Hops used for this Brew.  This will allow BruControl to calculate the new Ounces (OZ) needed for this Brew.  You can see this on later screens.  This message is displayed for 1 minute.   You may also advance using the Advance Timer in the upper right."
"gblS_Hop_Screen_Txt" visibility = visible
sleep 1000
"tm_Delay_W1" value = 00:01:00
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
if vV_Group_Hop1 > 0
goto "Hop1Order"
endif 
if vV_Group_Hop2 > 0
goto "Hop2Order"
endif
if vV_Group_Hop3 > 0
goto "Hop3Order"
endif
if vV_Group_Hop4 > 0
goto "Hop4Order"
endif
if vV_Group_Hop5 > 0
goto "Hop5Order"
endif
if vV_Group_Hop6 > 0
goto "Hop6Order"
endif
if vV_Group_Hop7 > 0
goto "Hop7Order"
endif
if vV_Group_Hop8 > 0
goto "Hop8Order"
endif
[Hop1Order]
print "@ 137 Hop1Order"
"gblV_Hop1_Group_R1" value = 1
	if vV_Group_Hop2 > 0
		if vVHop1_Drop_Min == vVHop2_Drop_Min
		"gblV_Hop2_Group_R1" value = 1
		endif
		//
		if vVHop1_Drop_Min > vVHop2_Drop_Min
		"gblV_Hop2_Group_R1" value = 2
		endif
		if vVHop1_Drop_Min < vVHop2_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
print 153
if vV_Group_Hop3 > 0
		if vVHop2_Drop_Min == vVHop3_Drop_Min
		"gblV_Hop3_Group_R1" value = "gblV_Hop2_Group_R1" value
		endif
		//
		if vVHop2_Drop_Min > vVHop3_Drop_Min
		"gblV_Hop3_Group_R1" value = "gblV_Hop2_Group_R1" value + 1
		endif
		if vVHop2_Drop_Min < vVHop3_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//
print 168	
	if vV_Group_Hop4 > 0
		if vVHop3_Drop_Min == vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value
		endif
		//
		if vVHop3_Drop_Min > vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value + 1
		endif
		if vVHop3_Drop_Min < vVHop4_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop5 > 0
		if vVHop4_Drop_Min == vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value
		endif
		//
		if vVHop4_Drop_Min > vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value + 1
		endif
		if vVHop4_Drop_Min < vVHop5_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
print 198
	if vV_Group_Hop6 > 0
		if vVHop5_Drop_Min == vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value
		endif
		//
		if vVHop5_Drop_Min > vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value + 1
		endif
		if vVHop5_Drop_Min < vVHop6_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
print 213
	if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
print 228
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
print 244
goto "LoopHopOrderEnd"
[Hop2Order]
print "@ 239 Hop2Order"
"gblV_Hop2_Group_R1" value = 1
	//	
	if vV_Group_Hop3 > 0
		if vVHop2_Drop_Min == vVHop3_Drop_Min
		"gblV_Hop3_Group_R1" value = "gblV_Hop2_Group_R1" value
		endif
		//
		if vVHop2_Drop_Min > vVHop3_Drop_Min
		"gblV_Hop3_Group_R1" value = "gblV_Hop2_Group_R1" value + 1
		endif
		if vVHop2_Drop_Min < vVHop3_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop4 > 0
		if vVHop3_Drop_Min == vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value
		endif
		//
		if vVHop3_Drop_Min > vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value + 1
		endif
		if vVHop3_Drop_Min < vVHop4_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop5 > 0
		if vVHop4_Drop_Min == vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value
		endif
		//
		if vVHop4_Drop_Min > vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value  + 1
		endif
		if vVHop4_Drop_Min < vVHop5_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop6 > 0
		if vVHop5_Drop_Min == vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value
		endif
		//
		if vVHop5_Drop_Min > vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value + 1
		endif
		if vVHop5_Drop_Min < vVHop6_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop3Order]
print "@ 329 Hop3Order"
"gblV_Hop3_Group_R1" value = 1
	//	
	if vV_Group_Hop4 > 0
		if vVHop3_Drop_Min == vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value
		endif
		//
		if vVHop3_Drop_Min > vVHop4_Drop_Min
		"gblV_Hop4_Group_R1" value = "gblV_Hop3_Group_R1" value + 1
		endif
		if vVHop3_Drop_Min < vVHop4_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop5 > 0
		if vVHop4_Drop_Min == vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value
		endif
		//
		if vVHop4_Drop_Min > vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value  + 1
		endif
		if vVHop4_Drop_Min < vVHop5_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop6 > 0
		if vVHop5_Drop_Min == vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value
		endif
		//
		if vVHop5_Drop_Min > vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value + 1
		endif
		if vVHop5_Drop_Min < vVHop6_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop4Order]
print "@ 404 Hop4Order"
"gblV_Hop4_Group_R1" value = 1
	//	
	if vV_Group_Hop5 > 0
		if vVHop4_Drop_Min == vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value
		endif
		//
		if vVHop4_Drop_Min > vVHop5_Drop_Min
		"gblV_Hop5_Group_R1" value = "gblV_Hop4_Group_R1" value  + 1
		endif
		if vVHop4_Drop_Min < vVHop5_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop6 > 0
		if vVHop5_Drop_Min == vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value
		endif
		//
		if vVHop5_Drop_Min > vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value + 1
		endif
		if vVHop5_Drop_Min < vVHop6_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop5Order]
print "@ 467 Hop5Order"

"gblV_Hop5_Group_R1" value = 1
	//	
if vV_Group_Hop6 > 0
		if vVHop5_Drop_Min == vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value
		endif
		//
		if vVHop5_Drop_Min > vVHop6_Drop_Min
		"gblV_Hop6_Group_R1" value = "gblV_Hop5_Group_R1" value + 1
		endif
		if vVHop5_Drop_Min < vVHop6_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop6Order]
print "@ 516 Hop6Order"
"gblV_Hop6_Group_R1" value = 1
	//	
	if vV_Group_Hop7 > 0
		if vVHop6_Drop_Min == vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value
		endif
		//
		if vVHop6_Drop_Min > vVHop7_Drop_Min
		"gblV_Hop7_Group_R1" value = "gblV_Hop6_Group_R1" value + 1
		endif
		if vVHop6_Drop_Min < vVHop7_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
	//	
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop7Order]
print "@ 550 Hop7Order"
"gblV_Hop7_Group_R1" value = 1
	//	
	if vV_Group_Hop8 > 0
		if vVHop7_Drop_Min == vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value
		endif
		//
		if vVHop7_Drop_Min > vVHop8_Drop_Min
		"gblV_Hop8_Group_R1" value = "gblV_Hop7_Group_R1" value + 1
		endif
		if vVHop7_Drop_Min < vVHop8_Drop_Min
		"gblV_Hop1_Group_R1" value = 919
		goto "919"
		endif
	endif
//
"gblVScriptFlow" value = 20
goto "LoopHopOrderEnd"
[Hop8Order]
print "@ 570 Hop8Order"
"gblV_Hop8_Group_R1" value = 1
//
[919]
print "@ 575 Section 919"
"gblS_Hop_Screen_Txt" displayname = "Manually Order Hops"
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt"  value = "Wait!  Durning the Boil Hops are out of sequence.  Hops will now be put in General Groupings of Bitter, Flavor and Aroma.  This message is displayed for 1 minute.   You may also advance using the Advance Timer in the upper right."
if vV_Group_Hop1 == 919
"gblV_Hop1_Group_R1" visibility = hidden
  if vVHop1_Drop_Min  <=  15
   "gblV_Hop1_Group_R1" value = 30
   "gblV_Hop1_Group_R1" background = 3
   endif
  if vVHop1_Drop_Min  >=  16
  "gblV_Hop1_Group_R1" background = 2
  "gblV_Hop1_Group_R1" value = 20   
   endif
   if vVHop1_Drop_Min  >=  31
  "gblV_Hop1_Group_R1" value = 10
  "gblV_Hop1_Group_R1" background = 1
  endif
 "gblV_Hop1_Group_R1" visibility = visible
endif  
 if vV_Group_Hop2 > 0
"gblV_Hop2_Group_R1" visibility = hidden
  if vVHop2_Drop_Min  <=  15
   "gblV_Hop2_Group_R1" value = 30
   "gblV_Hop2_Group_R1" background = 3
   endif
  if vVHop2_Drop_Min  >=  16
  "gblV_Hop2_Group_R1" background = 2
  "gblV_Hop2_Group_R1" value = 20   
   endif
   if vVHop2_Drop_Min  >=  31
  "gblV_Hop2_Group_R1" value = 10
  "gblV_Hop2_Group_R1" background = 1
  endif
 "gblV_Hop2_Group_R1" visibility = visible
endif
if vV_Group_Hop3 > 0
"gblV_Hop3_Group_R1" visibility = hidden
  if vVHop3_Drop_Min  <=  15
   "gblV_Hop3_Group_R1" value = 30
   "gblV_Hop3_Group_R1" background = 3
   endif
  if vVHop3_Drop_Min  >=  16
  "gblV_Hop3_Group_R1" background = 2
  "gblV_Hop3_Group_R1" value = 20   
   endif
   if vVHop3_Drop_Min  >=  31
  "gblV_Hop3_Group_R1" value = 10
  "gblV_Hop3_Group_R1" background = 1
  endif
 "gblV_Hop3_Group_R1" visibility = visible
endif 
 if vV_Group_Hop4 > 0
"gblV_Hop4_Group_R1" visibility = hidden
  if vVHop4_Drop_Min  <=  15
   "gblV_Hop4_Group_R1" value = 30
   "gblV_Hop4_Group_R1" background = 3
   endif
  if vVHop4_Drop_Min  >=  16
  "gblV_Hop4_Group_R1" background = 2
  "gblV_Hop4_Group_R1" value = 20   
   endif
   if vVHop4_Drop_Min  >=  31
  "gblV_Hop4_Group_R1" value = 10
  "gblV_Hop4_Group_R1" background = 1
  endif
 "gblV_Hop4_Group_R1" visibility = visible
endif
if vV_Group_Hop5 > 0
"gblV_Hop5_Group_R1" visibility = hidden
  if vVHop5_Drop_Min  <=  15
   "gblV_Hop5_Group_R1" value = 30
   "gblV_Hop5_Group_R1" background = 3
   endif
  if vVHop5_Drop_Min  >=  16
  "gblV_Hop5_Group_R1" background = 2
  "gblV_Hop5_Group_R1" value = 20   
   endif
   if vVHop5_Drop_Min  >=  31
  "gblV_Hop5_Group_R1" value = 10
  "gblV_Hop5_Group_R1" background = 1
  endif
 "gblV_Hop5_Group_R1" visibility = visible
endif
if vV_Group_Hop6 > 0
"gblV_Hop6_Group_R1" visibility = hidden
  if vVHop6_Drop_Min  <=  15
   "gblV_Hop6_Group_R1" value = 30
   "gblV_Hop6_Group_R1" background = 3
   endif
  if vVHop6_Drop_Min  >=  16
  "gblV_Hop6_Group_R1" background = 2
  "gblV_Hop6_Group_R1" value = 20   
   endif
   if vVHop6_Drop_Min  >=  31
  "gblV_Hop6_Group_R1" value = 10
  "gblV_Hop6_Group_R1" background = 1
  endif
 "gblV_Hop6_Group_R1" visibility = visible
endif
if vV_Group_Hop7 > 0
"gblV_Hop7_Group_R1" visibility = hidden
  if vVHop7_Drop_Min  <=  15
   "gblV_Hop7_Group_R1" value = 30
   "gblV_Hop7_Group_R1" background = 3
   endif
  if vVHop7_Drop_Min  >=  16
  "gblV_Hop7_Group_R1" background = 2
  "gblV_Hop7_Group_R1" value = 20   
   endif
   if vVHop7_Drop_Min  >=  31
  "gblV_Hop7_Group_R1" value = 10
  "gblV_Hop7_Group_R1" background = 1
  endif
 "gblV_Hop7_Group_R1" visibility = visible
endif
if vV_Group_Hop8 > 0
"gblV_Hop8_Group_R1" visibility = hidden
  if vVHop8_Drop_Min  <=  15
   "gblV_Hop8_Group_R1" value = 30
   "gblV_Hop8_Group_R1" background = 3
   endif
  if vVHop8_Drop_Min  >=  16
  "gblV_Hop8_Group_R1" background = 2
  "gblV_Hop8_Group_R1" value = 20   
   endif
   if vVHop8_Drop_Min  >=  31
  "gblV_Hop8_Group_R1" value = 10
  "gblV_Hop8_Group_R1" background = 1
  endif
 "gblV_Hop8_Group_R1" visibility = visible
endif
clear
//.....................................
//.....................................
"gblS_Inter_Script" value = "@ 722 in Hops_1_Hop_Grouping > start E:Hops_2_Hop_Boil_set_Types_10_20_30"
start "Hops_2_Hop_Boil_set_Types_10_20_30"
sleep 100
// This will happen when Aroma Hop Order is done or No Boil Hops
// Bitter Hops, Flavor Hops, Aroma Hops set in scripts called in Hops_2_Hop_Boil_set_Types_10_20_30
wait "sw_Running_Script_E" state == false
goto "LoopHopOrderEnd"
[LoopHopOrderEnd]
sleep 100
wait "tm_Delay_W1" value <= 00:00:57
"sw_Advance_Hop_Delay" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt"  visibility = hidden
goto "HopOrderEnd1"
[HopOrderEnd1]
print "@ 737 HopOrderEnd1"
if vV_Count_Whirlpool   > 0
print "@ 739 Whrilpool Hops"
sleep 200
"gblS_Hop_Screen_Txt" displayname = "Whirlpool Hops"
"gblS_Hop_Screen_Txt" background = 2
"gblS_Hop_Screen_Txt"  value = "Wait! There are Whirlpool Hops.  You need to click the Hop Rocket Switch if any of those will be in the Hop Rocket.   This will later set up some texts and Alarms if you have any hops for the Hop Rocket.  This message is displayed for 1 minute.   You may also advance using the Advance Timer in the upper right."
"tm_Delay_W1" value =  00:01:00
start "tm_Delay_W1"
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" visibility = visible
"sw_Advance_Hop_Delay" visibility = visible
goto "LoopHopOrderEnd2"
endif
[LoopHopOrderEnd2]
	if "tm_Delay_W1" value <= 00:00:00
	stop "tm_Delay_W1"
	"tm_Delay_W1" visibility = hidden
	"gblS_Hop_Screen_Txt"  visibility = hidden
	"sw_Advance_Hop_Delay" visibility = hidden
	goto "HopOrderEnd2"
	endif
goto "LoopHopOrderEnd2"
[HopOrderEnd2]
"sw_Advance_Hop_Delay" visibility = hidden
"sw_Advance_HopsCalc" visibility = visible
"insp_Pix_ArrowHopSwitch_R1" visibility = visible
sleep 100
"gblS_Hop_Screen_Txt"  value = "Wait, Will Auto Advance"
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" visibility = visible
"gblS_Inter_Script" value = "@ 772 in Hops_1_Hop_Grouping > start Hops_3_Hop_Drop_Calculations"
start "Hops_3_Hop_Drop_Calculations"
sleep 100
wait "sw_Running_Script_F" state == false
if vB_Testing == true
sleep 2001
endif
// set to false in Hops_3_Hop_Drop_Calculations
wait "sw_Running_Hop_Group1" state == false
"gblS_Inter_Script" value = "ended: Hops_1_Hop_Grouping"
if vB_Testing == true
sleep 2001
endif
clear
stop  "Hops_1_Hop_Grouping"
```

## 112. Hops_2_Hop_Boil_set_Types_10_20_30

Starts by itself: No · User can start or stop it: Yes · 174 lines

```text
//Hops_2_Hop_Boil_set_Types_10_20_30
//Version: 261002_08:58
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// called from @ 715 in Hops_1_HopGrouping 
//heavy Modification
//01/21/2024 10:34
//created
////8. Dry Hop (durning Fermentation)
//12/21/2023 15:01  
// Lots of Help with Orginal Code from @RiverCityBrewing
//Code	Type
//.........................
//-111	Dry Hop
//-333	Top of Mash
//-444	1st Wort
//-888	Start of Boil
//-999	Whirlpool (shows the Hop Rocket switch)
//-999	Hop Rocket if "sw_Use_Rocket_HopN_Batch" state == true
//919	Boiling, Pre Sort
//10 / 20 / 30	Bitter / Flavor / Aroma (set in sub_scrHopGrouping_1 when the boil hops are out of sequence)
//1–8	Hop Groups During the Boil Order after sorting
//0	Hop Slot Not used
//..........................
//Order of Hop Drops
//1. Top of Mash
//2. 1st Wort
//3. Start of Boil
//4. Bitter Hops
//5. Flavor Hops
//6. Aroma Hops
//7. Whirlpool Hops
//7a. Hop Rocket
// Sets 10 20 or 30 count
[Set_Testing]
"sw_Running_Script_E" state = true
	if "sw_Test_TGS_Loaded" state == true
// if Testing just skip all as the sample already has the types pre loaded.
		goto "No_Boil_Hops"
	endif
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
sleep 100
new value vVHopGx1
new value vVHopGx2
new value vVHopGx3
new value vVHopGx4
new value vVHopGx5
new value vVHopGx6
new value vVHopGx7
new value vVHopGx8
new value vVGroupCountB
new value vVGroupCountF
new value vVGroupCountA
new value vVGroupCountTTL
//................................
vVHopGx1 = "gblV_Hop1_Group_R1" value
vVHopGx2 = "gblV_Hop2_Group_R1" value
vVHopGx3 = "gblV_Hop3_Group_R1" value
vVHopGx4 = "gblV_Hop4_Group_R1" value
vVHopGx5 = "gblV_Hop5_Group_R1" value
vVHopGx6 = "gblV_Hop6_Group_R1" value
vVHopGx7 = "gblV_Hop7_Group_R1" value
vVHopGx8 = "gblV_Hop8_Group_R1" value
//Count each type. One block per hop covers all three codes.
	if vVHopGx1 == 10
		vVGroupCountB += 1
	endif
	if vVHopGx1 == 20
		vVGroupCountF += 1
	endif
	if vVHopGx1 == 30
		vVGroupCountA += 1
	endif
	if vVHopGx2 == 10
		vVGroupCountB += 1
	endif
	if vVHopGx2 == 20
		vVGroupCountF += 1
	endif
	if vVHopGx2 == 30
		vVGroupCountA += 1
	endif
	if vVHopGx3 == 10
		vVGroupCountB += 1
	endif
	if vVHopGx3 == 20
		vVGroupCountF += 1
	endif
	if vVHopGx3 == 30
		vVGroupCountA += 1
	endif
	if vVHopGx4 == 10
		vVGroupCountB += 1
	endif
	if vVHopGx4 == 20
		vVGroupCountF += 1
	endif
	if vVHopGx4 == 30
		vVGroupCountA += 1
	endif
	if vVHopGx5 == 10
		vVGroupCountB += 1
	endif
	if vVHopGx5 == 20
		vVGroupCountF += 1
	endif
	if vVHopGx5 == 30
		vVGroupCountA += 1
	endif
	if vVHopGx6 == 10
		vVGroupCountB += 1
	endif
	if vVHopGx6 == 20
		vVGroupCountF += 1
	endif
	if vVHopGx6 == 30
		vVGroupCountA += 1
	endif
	if vVHopGx7 == 10
		vVGroupCountB += 1
	endif
	if vVHopGx7 == 20
		vVGroupCountF += 1
	endif
	if vVHopGx7 == 30
		vVGroupCountA += 1
	endif
	if vVHopGx8 == 10
		vVGroupCountB += 1
	endif
	if vVHopGx8 == 20
		vVGroupCountF += 1
	endif
	if vVHopGx8 == 30
		vVGroupCountA += 1
	endif
"gblVHopCountBitter" value = vVGroupCountB
"gblVHopCountFlavor" value = vVGroupCountF
"gblVHopCountAroma" value = vVGroupCountA
vVGroupCountTTL = vVGroupCountB + vVGroupCountF + vVGroupCountA
"gblVScriptFlow" value = 0
//........................................
//No boil hops of any type: skip the chain, go straight to review
	if vVGroupCountTTL == 0
		"gblVHopType" value = 99
		goto "No_Boil_Hops"
	endif
//........................................
"gblS_Inter_Script" value = "@ 121 E:Hops_2_Hop_Boil_set_Types_10_20_30 > start Hops_2a_Hop_Order_Bitter"
	if vB_Testing == true
		sleep 4001
	endif
clear
start "Hops_2a_Hop_Order_Bitter"
"gblS_Inter_Script" value = "ended E:Hops_2_Hop_Boil_set_Types_10_20_30"
	if vB_Testing == true
		sleep 4001
	endif
clear
stop "Hops_2_Hop_Boil_set_Types_10_20_30"
//........................................
[No_Boil_Hops]
"gblS_Inter_Script" value = "ended :Hops_2_Hop_Boil_set_Types_10_20_30"
	if vB_Testing == true
		sleep 4001
	endif
clear
"sw_Running_Script_E" state = false
"gblS_Inter_Script" value = "@ 121 E:Hops_2_Hop_Boil_set_Types_10_20_30 > start hops_scrSetHopGroupsReview"
start "hops_scrSetHopGroupsReview"
stop "Hops_2_Hop_Boil_set_Types_10_20_30"
```

## 113. Hops_2a_Hop_Order_Bitter

Starts by itself: No · User can start or stop it: Yes · 226 lines

```text
//Hops_2a_Hop_Order_Bitter Modified 260929
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// called @ 121 in Hops_2_Hop_Boil_set_Types_10_20_30
//Groups bittering hops by boil time, longest first.
//Bitter is first in the chain: numbering starts at 1 and
//"gblVHop_Max" is reset to 0 here. Flavor and Aroma continue from it.
//Hops with the same time get the same order number.
//At the end "gblVHop_Max" = last group number used so far.
//
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vVGroupCode
new value vVHopMax
new value vVSlot
new value vVSlotStart
new value vVOrder1
new value vVOrder2
new value vVOrder3
new value vVOrder4
new value vVOrder5
new value vVOrder6
new value vVOrder7
new value vVOrder8
new value vVHopT1
new value vVHopT2
new value vVHopT3
new value vVHopT4
new value vVHopT5
new value vVHopT6
new value vVHopT7
new value vVHopT8
new bool vB_Hop1_Slotted
new bool vB_Hop2_Slotted
new bool vB_Hop3_Slotted
new bool vB_Hop4_Slotted
new bool vB_Hop5_Slotted
new bool vB_Hop6_Slotted
new bool vB_Hop7_Slotted
new bool vB_Hop8_Slotted
//..............................
//Group code for Bitter hops. Must be above 8.
vVGroupCode = 10
//..............................
//Bitter starts the chain: reset the global and start at 0
"gblVHop_Max" value = 0
vVSlotStart = 0
vVSlot = vVSlotStart
//..............................
//Load times. -99 = not this hop type (or already slotted)
vVHopT1 = -99
vVHopT2 = -99
vVHopT3 = -99
vVHopT4 = -99
vVHopT5 = -99
vVHopT6 = -99
vVHopT7 = -99
vVHopT8 = -99
//..........................
	if "gblV_Hop1_Group_R1" value == vVGroupCode
		vVHopT1 = "gblV_TimeHop1_Min_R1" value
	endif
	if "gblV_Hop2_Group_R1" value == vVGroupCode
		vVHopT2 = "gblV_TimeHop2_Min_R1" value
	endif
	if "gblV_Hop3_Group_R1" value == vVGroupCode
		vVHopT3 = "gblV_TimeHop3_Min_R1" value
	endif
	if "gblV_Hop4_Group_R1" value == vVGroupCode
		vVHopT4 = "gblV_TimeHop4_Min_R1" value
	endif
	if "gblV_Hop5_Group_R1" value == vVGroupCode
		vVHopT5 = "gblV_TimeHop5_Min_R1" value
	endif
	if "gblV_Hop6_Group_R1" value == vVGroupCode
		vVHopT6 = "gblV_TimeHop6_Min_R1" value
	endif
	if "gblV_Hop7_Group_R1" value == vVGroupCode
		vVHopT7 = "gblV_TimeHop7_Min_R1" value
	endif
	if "gblV_Hop8_Group_R1" value == vVGroupCode
		vVHopT8 = "gblV_TimeHop8_Min_R1" value
	endif
//..........................
//Each pass: find the longest remaining time, give every hop with
//that time the next slot number, then knock those hops out (-99).
[Next_Slot]
vVHopMax = vVHopT1
	if vVHopT2 > vVHopMax
		vVHopMax = vVHopT2
	endif
	if vVHopT3 > vVHopMax
		vVHopMax = vVHopT3
	endif
	if vVHopT4 > vVHopMax
		vVHopMax = vVHopT4
	endif
	if vVHopT5 > vVHopMax
		vVHopMax = vVHopT5
	endif
	if vVHopT6 > vVHopMax
		vVHopMax = vVHopT6
	endif
	if vVHopT7 > vVHopMax
		vVHopMax = vVHopT7
	endif
	if vVHopT8 > vVHopMax
		vVHopMax = vVHopT8
	endif
	if vVHopMax == -99
		goto "Slots_Done"
	endif
vVSlot = vVSlot + 1
//........................
	if vVHopT1 == vVHopMax
		vVOrder1 = vVSlot
		vB_Hop1_Slotted = true
		vVHopT1 = -99
	endif
	if vVHopT2 == vVHopMax
		vVOrder2 = vVSlot
		vB_Hop2_Slotted = true
		vVHopT2 = -99
	endif
	if vVHopT3 == vVHopMax
		vVOrder3 = vVSlot
		vB_Hop3_Slotted = true
		vVHopT3 = -99
	endif
	if vVHopT4 == vVHopMax
		vVOrder4 = vVSlot
		vB_Hop4_Slotted = true
		vVHopT4 = -99
	endif
	if vVHopT5 == vVHopMax
		vVOrder5 = vVSlot
		vB_Hop5_Slotted = true
		vVHopT5 = -99
	endif
	if vVHopT6 == vVHopMax
		vVOrder6 = vVSlot
		vB_Hop6_Slotted = true
		vVHopT6 = -99
	endif
	if vVHopT7 == vVHopMax
		vVOrder7 = vVSlot
		vB_Hop7_Slotted = true
		vVHopT7 = -99
	endif
	if vVHopT8 == vVHopMax
		vVOrder8 = vVSlot
		vB_Hop8_Slotted = true
		vVHopT8 = -99
	endif
goto "Next_Slot"
//........................................
[Slots_Done]
//No bittering hops: "gblVHop_Max" stays 0
	if vVSlot == vVSlotStart
		goto "No_Bitter_Hops"
	endif
"gblVHop_Max" value = vVSlot
	if vB_Hop1_Slotted == true
		"gblV_Hop1_Group_R1" value = vVOrder1
	endif
	if vB_Hop2_Slotted == true
		"gblV_Hop2_Group_R1" value = vVOrder2
	endif
	if vB_Hop3_Slotted == true
		"gblV_Hop3_Group_R1" value = vVOrder3
	endif
	if vB_Hop4_Slotted == true
		"gblV_Hop4_Group_R1" value = vVOrder4
	endif
	if vB_Hop5_Slotted == true
		"gblV_Hop5_Group_R1" value = vVOrder5
	endif
	if vB_Hop6_Slotted == true
		"gblV_Hop6_Group_R1" value = vVOrder6
	endif
	if vB_Hop7_Slotted == true
		"gblV_Hop7_Group_R1" value = vVOrder7
	endif
	if vB_Hop8_Slotted == true
		"gblV_Hop8_Group_R1" value = vVOrder8
	endif
goto "Ender_Slotting"
//........................................
//........................................
[No_Bitter_Hops]
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "There are no bittering Hops.  If this is true, just continue.  If you were expecting Bitter Hops, you need to check all the Hops and timing and maybe redo the recipe.  Wait!  Will Auto Advance."
"gblS_Bottom_Text" value = "No Bittering Hops!  Very odd unless this is a Farm House Ale. "
// 10 Second Delay
//CHECK: every other global is "gbl..." - is this really "gblV_Delay_Seconds"?
"gblV_Delay_Seconds" value = 10
//Restore
"sw_Delay_Save_B1" state = false
//only 1 true
"sw_Top_1" state = true
"sw_Top_2" state = false
"sw_Top_3" state = false
//1 or None  true
"sw_Bottom_1" state = true
"sw_Bottom_3" state = false
"sw_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Tim" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
"gblS_Brewery_Top_1" value = "Wait!  Will Auto Advance"
[Ender_Slotting]
"gblS_Inter_Script" value = "ended :Hops_2a_Hop_Order_Bitter"
	if vB_Testing == true
		sleep 4001
	endif
clear
start "Hops_2b_Hop_Order_Flavor"
stop "Hops_2a_Hop_Order_Bitter"
```

## 114. Hops_2b_Hop_Order_Flavor

Starts by itself: No · User can start or stop it: Yes · 224 lines

```text
//Hops_2b_Hop_Order_Flavor Modified 260929
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//started at end of Hops_2a_Hop_Order_Bitter
//Groups flavor hops by boil time, longest first.
//Numbering continues from the last Bitter group (gblVHop_Max),
//so if Bitter used groups 1-4, the first Flavor group is 5.
//Hops with the same time get the same order number.
//At the end gblVHop_Max = last group number used so far.
//
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vVGroupCode
new value vVHopMax
new value vVSlot
new value vVSlotStart
new value vVOrder1
new value vVOrder2
new value vVOrder3
new value vVOrder4
new value vVOrder5
new value vVOrder6
new value vVOrder7
new value vVOrder8
new value vVHopT1
new value vVHopT2
new value vVHopT3
new value vVHopT4
new value vVHopT5
new value vVHopT6
new value vVHopT7
new value vVHopT8
new bool vB_Hop1_Slotted
new bool vB_Hop2_Slotted
new bool vB_Hop3_Slotted
new bool vB_Hop4_Slotted
new bool vB_Hop5_Slotted
new bool vB_Hop6_Slotted
new bool vB_Hop7_Slotted
new bool vB_Hop8_Slotted
//..............................
//CHANGE: group code for this hop type (Flavor = 20). Must be above 8.
vVGroupCode = 20
//..............................
//Start numbering after the last group already used
vVSlotStart = "gblVHop_Max" value
vVSlot = vVSlotStart
//..............................
//Load times. -99 = not this hop type (or already slotted)
vVHopT1 = -99
vVHopT2 = -99
vVHopT3 = -99
vVHopT4 = -99
vVHopT5 = -99
vVHopT6 = -99
vVHopT7 = -99
vVHopT8 = -99
//..........................
	if "gblV_Hop1_Group_R1" value == vVGroupCode
		vVHopT1 = "gblV_TimeHop1_Min_R1" value
	endif
	if "gblV_Hop2_Group_R1" value == vVGroupCode
		vVHopT2 = "gblV_TimeHop2_Min_R1" value
	endif
	if "gblV_Hop3_Group_R1" value == vVGroupCode
		vVHopT3 = "gblV_TimeHop3_Min_R1" value
	endif
	if "gblV_Hop4_Group_R1" value == vVGroupCode
		vVHopT4 = "gblV_TimeHop4_Min_R1" value
	endif
	if "gblV_Hop5_Group_R1" value == vVGroupCode
		vVHopT5 = "gblV_TimeHop5_Min_R1" value
	endif
	if "gblV_Hop6_Group_R1" value == vVGroupCode
		vVHopT6 = "gblV_TimeHop6_Min_R1" value
	endif
	if "gblV_Hop7_Group_R1" value == vVGroupCode
		vVHopT7 = "gblV_TimeHop7_Min_R1" value
	endif
	if "gblV_Hop8_Group_R1" value == vVGroupCode
		vVHopT8 = "gblV_TimeHop8_Min_R1" value
	endif
//..........................
//Each pass: find the longest remaining time, give every hop with
//that time the next slot number, then knock those hops out (-99).
[Next_Slot]
vVHopMax = vVHopT1
	if vVHopT2 > vVHopMax
		vVHopMax = vVHopT2
	endif
	if vVHopT3 > vVHopMax
		vVHopMax = vVHopT3
	endif
	if vVHopT4 > vVHopMax
		vVHopMax = vVHopT4
	endif
	if vVHopT5 > vVHopMax
		vVHopMax = vVHopT5
	endif
	if vVHopT6 > vVHopMax
		vVHopMax = vVHopT6
	endif
	if vVHopT7 > vVHopMax
		vVHopMax = vVHopT7
	endif
	if vVHopT8 > vVHopMax
		vVHopMax = vVHopT8
	endif
	if vVHopMax == -99
		goto "Slots_Done"
	endif
vVSlot = vVSlot + 1
//........................
	if vVHopT1 == vVHopMax
		vVOrder1 = vVSlot
		vB_Hop1_Slotted = true
		vVHopT1 = -99
	endif
	if vVHopT2 == vVHopMax
		vVOrder2 = vVSlot
		vB_Hop2_Slotted = true
		vVHopT2 = -99
	endif
	if vVHopT3 == vVHopMax
		vVOrder3 = vVSlot
		vB_Hop3_Slotted = true
		vVHopT3 = -99
	endif
	if vVHopT4 == vVHopMax
		vVOrder4 = vVSlot
		vB_Hop4_Slotted = true
		vVHopT4 = -99
	endif
	if vVHopT5 == vVHopMax
		vVOrder5 = vVSlot
		vB_Hop5_Slotted = true
		vVHopT5 = -99
	endif
	if vVHopT6 == vVHopMax
		vVOrder6 = vVSlot
		vB_Hop6_Slotted = true
		vVHopT6 = -99
	endif
	if vVHopT7 == vVHopMax
		vVOrder7 = vVSlot
		vB_Hop7_Slotted = true
		vVHopT7 = -99
	endif
	if vVHopT8 == vVHopMax
		vVOrder8 = vVSlot
		vB_Hop8_Slotted = true
		vVHopT8 = -99
	endif
goto "Next_Slot"
//........................................
[Slots_Done]
//No hops of this type: leave "gblVHop_Max" as Bitter left it
	if vVSlot == vVSlotStart
		goto "No_Flavor_Hops"
	endif
"gblVHop_Max" value = vVSlot
	if vB_Hop1_Slotted == true
		"gblV_Hop1_Group_R1" value = vVOrder1
	endif
	if vB_Hop2_Slotted == true
		"gblV_Hop2_Group_R1" value = vVOrder2
	endif
	if vB_Hop3_Slotted == true
		"gblV_Hop3_Group_R1" value = vVOrder3
	endif
	if vB_Hop4_Slotted == true
		"gblV_Hop4_Group_R1" value = vVOrder4
	endif
	if vB_Hop5_Slotted == true
		"gblV_Hop5_Group_R1" value = vVOrder5
	endif
	if vB_Hop6_Slotted == true
		"gblV_Hop6_Group_R1" value = vVOrder6
	endif
	if vB_Hop7_Slotted == true
		"gblV_Hop7_Group_R1" value = vVOrder7
	endif
	if vB_Hop8_Slotted == true
		"gblV_Hop8_Group_R1" value = vVOrder8
	endif
goto "Ender_Slotting"
//........................................
//........................................
[No_Flavor_Hops]
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "There are no Flavor Hops. That is common in some recipes but a little odd for us.  If this is true, just continue.  Wait!  Will Auto Advance."
"gblS_Bottom_Text" value = "No Flavor Hops!  Somewhat odd unless this is a Farm House Ale or a Stout. "
// 10 Second Delay
//CHECK: every other global is "gbl..." - is this really "gblV_Delay_Seconds"?
"gblV_Delay_Seconds" value = 10
//Restore
"sw_Delay_Save_B1" state = false
//only 1 true
"sw_Top_1" state = true
"sw_Top_2" state = false
"sw_Top_3" state = false
//1 or None  true
"sw_Bottom_1" state = true
"sw_Bottom_3" state = false
"sw_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Tim" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
[Ender_Slotting]
"gblS_Inter_Script" value = "ended :Hops_2b_Hop_Order_Flavor"
	if vB_Testing == true
		sleep 4001
	endif
clear
start "Hops_2c_Hop_Order_Aroma"
stop "Hops_2b_Hop_Order_Flavor"
```

## 115. Hops_2c_Hop_Order_Aroma

Starts by itself: No · User can start or stop it: Yes · 225 lines

```text
//Hops_2c_Hop_Order_Aroma Modified 261001
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//started at end of Hops_2a_Hop_Order_Flavor
//Groups flavor hops by boil time, longest first.
//Numbering continues from the last Bitter group (gblVHop_Max),
//so if Bitter used groups 1-4, the first Flavor group is 5.
//Hops with the same time get the same order number.
//At the end gblVHop_Max = last group number used so far.
//
"sw_Running_Script_E" state = true
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vVGroupCode
new value vVHopMax
new value vVSlot
new value vVSlotStart
new value vVOrder1
new value vVOrder2
new value vVOrder3
new value vVOrder4
new value vVOrder5
new value vVOrder6
new value vVOrder7
new value vVOrder8
new value vVHopT1
new value vVHopT2
new value vVHopT3
new value vVHopT4
new value vVHopT5
new value vVHopT6
new value vVHopT7
new value vVHopT8
new bool vB_Hop1_Slotted
new bool vB_Hop2_Slotted
new bool vB_Hop3_Slotted
new bool vB_Hop4_Slotted
new bool vB_Hop5_Slotted
new bool vB_Hop6_Slotted
new bool vB_Hop7_Slotted
new bool vB_Hop8_Slotted
//..............................
//CHANGE: group code for this hop type (Bitter = 10). Must be above 8.
vVGroupCode = 30
//..............................
//Start numbering after the last group already used
vVSlotStart = "gblVHop_Max" value
vVSlot = vVSlotStart
//..............................
//Load times. -99 = not this hop type (or already slotted)
vVHopT1 = -99
vVHopT2 = -99
vVHopT3 = -99
vVHopT4 = -99
vVHopT5 = -99
vVHopT6 = -99
vVHopT7 = -99
vVHopT8 = -99
//..........................
	if "gblV_Hop1_Group_R1" value == vVGroupCode
		vVHopT1 = "gblV_TimeHop1_Min_R1" value
	endif
	if "gblV_Hop2_Group_R1" value == vVGroupCode
		vVHopT2 = "gblV_TimeHop2_Min_R1" value
	endif
	if "gblV_Hop3_Group_R1" value == vVGroupCode
		vVHopT3 = "gblV_TimeHop3_Min_R1" value
	endif
	if "gblV_Hop4_Group_R1" value == vVGroupCode
		vVHopT4 = "gblV_TimeHop4_Min_R1" value
	endif
	if "gblV_Hop5_Group_R1" value == vVGroupCode
		vVHopT5 = "gblV_TimeHop5_Min_R1" value
	endif
	if "gblV_Hop6_Group_R1" value == vVGroupCode
		vVHopT6 = "gblV_TimeHop6_Min_R1" value
	endif
	if "gblV_Hop7_Group_R1" value == vVGroupCode
		vVHopT7 = "gblV_TimeHop7_Min_R1" value
	endif
	if "gblV_Hop8_Group_R1" value == vVGroupCode
		vVHopT8 = "gblV_TimeHop8_Min_R1" value
	endif
//..........................
//Each pass: find the longest remaining time, give every hop with
//that time the next slot number, then knock those hops out (-99).
[Next_Slot]
vVHopMax = vVHopT1
	if vVHopT2 > vVHopMax
		vVHopMax = vVHopT2
	endif
	if vVHopT3 > vVHopMax
		vVHopMax = vVHopT3
	endif
	if vVHopT4 > vVHopMax
		vVHopMax = vVHopT4
	endif
	if vVHopT5 > vVHopMax
		vVHopMax = vVHopT5
	endif
	if vVHopT6 > vVHopMax
		vVHopMax = vVHopT6
	endif
	if vVHopT7 > vVHopMax
		vVHopMax = vVHopT7
	endif
	if vVHopT8 > vVHopMax
		vVHopMax = vVHopT8
	endif
	if vVHopMax == -99
		goto "Slots_Done"
	endif
vVSlot = vVSlot + 1
//........................
	if vVHopT1 == vVHopMax
		vVOrder1 = vVSlot
		vB_Hop1_Slotted = true
		vVHopT1 = -99
	endif
	if vVHopT2 == vVHopMax
		vVOrder2 = vVSlot
		vB_Hop2_Slotted = true
		vVHopT2 = -99
	endif
	if vVHopT3 == vVHopMax
		vVOrder3 = vVSlot
		vB_Hop3_Slotted = true
		vVHopT3 = -99
	endif
	if vVHopT4 == vVHopMax
		vVOrder4 = vVSlot
		vB_Hop4_Slotted = true
		vVHopT4 = -99
	endif
	if vVHopT5 == vVHopMax
		vVOrder5 = vVSlot
		vB_Hop5_Slotted = true
		vVHopT5 = -99
	endif
	if vVHopT6 == vVHopMax
		vVOrder6 = vVSlot
		vB_Hop6_Slotted = true
		vVHopT6 = -99
	endif
	if vVHopT7 == vVHopMax
		vVOrder7 = vVSlot
		vB_Hop7_Slotted = true
		vVHopT7 = -99
	endif
	if vVHopT8 == vVHopMax
		vVOrder8 = vVSlot
		vB_Hop8_Slotted = true
		vVHopT8 = -99
	endif
goto "Next_Slot"
//........................................
[Slots_Done]
//No hops of this type: leave "gblVHop_Max" as Flavor left it
	if vVSlot == vVSlotStart
		goto "No_Aroma_Hopss"
	endif
"gblVHop_Max" value = vVSlot
	if vB_Hop1_Slotted == true
		"gblV_Hop1_Group_R1" value = vVOrder1
	endif
	if vB_Hop2_Slotted == true
		"gblV_Hop2_Group_R1" value = vVOrder2
	endif
	if vB_Hop3_Slotted == true
		"gblV_Hop3_Group_R1" value = vVOrder3
	endif
	if vB_Hop4_Slotted == true
		"gblV_Hop4_Group_R1" value = vVOrder4
	endif
	if vB_Hop5_Slotted == true
		"gblV_Hop5_Group_R1" value = vVOrder5
	endif
	if vB_Hop6_Slotted == true
		"gblV_Hop6_Group_R1" value = vVOrder6
	endif
	if vB_Hop7_Slotted == true
		"gblV_Hop7_Group_R1" value = vVOrder7
	endif
	if vB_Hop8_Slotted == true
		"gblV_Hop8_Group_R1" value = vVOrder8
	endif
goto "Ender_Slotting"
//........................................
//........................................
[No_Aroma_Hops]
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "There are no Aroma Hops. That is common. If this is true, just continue.  Wait!  Will Auto Advance."
"gblS_Bottom_Text" value = "No Aroma Hops "
// 10 Second Delay
//CHECK: every other global is "gbl..." - is this really "gblV_Delay_Seconds"?
"gblV_Delay_Seconds" value = 10
//Restore
"sw_Delay_Save_B1" state = false
//only 1 true
"sw_Top_1" state = true
"sw_Top_2" state = false
"sw_Top_3" state = false
//1 or None  true
"sw_Bottom_1" state = true
"sw_Bottom_3" state = false
"sw_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Tim" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
[Ender_Slotting]
"gblS_Inter_Script" value = "ended E:Hops_2c_Hop_Order_Aroma"
	if vB_Testing == true
		sleep 4001
	endif
clear
"sw_Running_Script_E" state = true
stop "Hops_2c_Hop_Order_Aroma"
```

## 116. Hops_3_Hop_Drop_Calculations

Starts by itself: No · User can start or stop it: Yes · 164 lines

```text
//Hops_3_Hop_Drop_Calculations
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//03/11/2024 10:42
//Resets the The Drop Times
[Set_Testing]
"sw_Running_Script_F" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblVScriptFlow" value = 0
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
"sw_Advance_HopsCalc" visibility = hidden
"tm_Delay_W1" type = countdown
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" displayname = "Drop Time in Minutes"
"gblS_Hop_Screen_Txt"  value = "Wait!  Hop Drop Times and 10 Minute Warnings are being Calculated."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = 00:00:05
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
print "Hop Calc Started"
"gblT_Hop1_10m_Time_R1" value = 00:00:00
"gblT_Hop2_10m_Time_R1" value = 00:00:00
"gblT_Hop3_10m_Time_R1" value = 00:00:00
"gblT_Hop4_10m_Time_R1" value = 00:00:00
"gblT_Hop5_10m_Time_R1" value = 00:00:00
"gblT_Hop6_10m_Time_R1" value = 00:00:00
"gblT_Hop7_10m_Time_R1" value = 00:00:00
"gblT_Hop8_10m_Time_R1" value = 00:00:00
// Minutes to time
// with help from @RiverCityBrewing
new string vS_Hop_Drop
new value vV_Hop_Min
vV_Hop_Min precision = 0
new string vS_Convert
//Hop 1 Drop Time
if "sw_Use_Hop1_Batch" state == true
if "gblV_TimeHop1_Min_R1" value >= 60
vV_Hop_Min = "gblV_TimeHop1_Min_R1" value
vV_Hop_Min -= 60
vS_Convert = vV_Hop_Min
vS_Hop_Drop = "01:" + vS_Convert
"gblT_Hop1Drop_R1" value = vS_Hop_Drop
else
vS_Hop_Drop = "00:" + "gblV_TimeHop1_Min_R1"  value
"gblT_Hop1Drop_R1"  value = vS_Hop_Drop
endif 
"gblT_Hop1_10m_Time_R1" value = "gblT_Hop1Drop_R1" value + 00:10:00
endif
//Hop2 Drop Time
if "sw_Use_Hop2_Batch" state == true
if "gblV_TimeHop2_Min_R1" value >= 60
vV_Hop_Min = "gblV_TimeHop2_Min_R1" value
vV_Hop_Min -= 60
vS_Convert = vV_Hop_Min
vS_Hop_Drop = "01:" + vS_Convert
"gblT_Hop2Drop_R1" value = vS_Hop_Drop
else
vS_Hop_Drop = "00:" + "gblV_TimeHop2_Min_R1"  value
"gblT_Hop2Drop_R1"  value = vS_Hop_Drop
endif 
"gblT_Hop2_10m_Time_R1" value = "gblT_Hop2Drop_R1" value + 00:10:00
endif
// Hop3
//Hop3 Drop Time
if "sw_Use_Hop3_Batch" state == true
if "gblV_TimeHop3_Min_R1" value >= 60
vV_Hop_Min = "gblV_TimeHop3_Min_R1" value
vV_Hop_Min -= 60
vS_Convert = vV_Hop_Min
vS_Hop_Drop = "01:" + vS_Convert
"gblT_Hop3Drop_R1" value = vS_Hop_Drop
else
vS_Hop_Drop = "00:" + "gblV_TimeHop3_Min_R1"  value
"gblT_Hop3Drop_R1"  value = vS_Hop_Drop
endif 
"gblT_Hop3_10m_Time_R1" value = "gblT_Hop3Drop_R1" value + 00:10:00
endif
//Hop4 Drop Time
if "sw_Use_Hop4_Batch" state == true
if "gblV_TimeHop4_Min_R1" value >= 60
vV_Hop_Min = "gblV_TimeHop4_Min_R1" value
vV_Hop_Min -= 60
vS_Convert = vV_Hop_Min
vS_Hop_Drop = "01:" + vS_Convert
"gblT_Hop4Drop_R1" value = vS_Hop_Drop
else
vS_Hop_Drop = "00:" + "gblV_TimeHop4_Min_R1"  value
"gblT_Hop4Drop_R1"  value = vS_Hop_Drop
endif 
"gblT_Hop4_10m_Time_R1" value = "gblT_Hop4Drop_R1" value + 00:10:00
endif
//Hop5 Drop Time
if "sw_Use_Hop5_Batch" state == true
if "gblV_TimeHop5_Min_R1" value >= 60
vV_Hop_Min = "gblV_TimeHop5_Min_R1" value
vV_Hop_Min -= 60
vS_Convert = vV_Hop_Min
vS_Hop_Drop = "01:" + vS_Convert
"gblT_Hop5Drop_R1" value = vS_Hop_Drop
else
vS_Hop_Drop = "00:" + "gblV_TimeHop5_Min_R1"  value
"gblT_Hop5Drop_R1"  value = vS_Hop_Drop
endif 
"gblT_Hop5_10m_Time_R1" value = "gblT_Hop5Drop_R1" value + 00:10:00
endif
//Hop6 Drop Time
if "sw_Use_Hop6_Batch" state == true
  if "gblV_TimeHop6_Min_R1" value >= 60
vV_Hop_Min = "gblV_TimeHop6_Min_R1" value
vV_Hop_Min -= 60
vS_Convert = vV_Hop_Min
vS_Hop_Drop = "01:" + vS_Convert
"gblT_Hop6Drop_R1" value = vS_Hop_Drop
  else
vS_Hop_Drop = "00:" + "gblV_TimeHop6_Min_R1"  value
"gblT_Hop6Drop_R1"  value = vS_Hop_Drop
  endif 
"gblT_Hop6_10m_Time_R1" value = "gblT_Hop6Drop_R1" value + 00:10:00
endif
//Hop7 Drop Time
if "sw_Use_Hop7_Batch" state == true
  if "gblV_TimeHop7_Min_R1" value >= 60
vV_Hop_Min = "gblV_TimeHop7_Min_R1" value
vV_Hop_Min -= 60
vS_Convert = vV_Hop_Min
vS_Hop_Drop = "01:" + vS_Convert
"gblT_Hop7Drop_R1" value = vS_Hop_Drop
  else
vS_Hop_Drop = "00:" + "gblV_TimeHop7_Min_R1"  value
"gblT_Hop7Drop_R1"  value = vS_Hop_Drop
  endif 
"gblT_Hop7_10m_Time_R1" value = "gblT_Hop7Drop_R1" value + 00:10:00
endif
//Hop8 Drop Time
if "sw_Use_Hop8_Batch" state == true
  if "gblV_TimeHop8_Min_R1" value >= 60
vV_Hop_Min = "gblV_TimeHop8_Min_R1" value
vV_Hop_Min -= 60
vS_Convert = vV_Hop_Min
vS_Hop_Drop = "01:" + vS_Convert
"gblT_Hop8Drop_R1" value = vS_Hop_Drop
  else
vS_Hop_Drop = "00:" + "gblV_TimeHop8_Min_R1"  value
"gblT_Hop8Drop_R1"  value = vS_Hop_Drop
  endif 
"gblT_Hop8_10m_Time_R1" value = "gblT_Hop8Drop_R1" value + 00:10:00
endif
[ender]
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt"  value = "Wait, Will Auto Advance"
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" visibility = visible
"gblVScriptFlow" value = 1
"gblV_Brew_Status" value = 5
"gblS_Inter_Script" value = "ended F: Hops_3_Hop_Drop_Calculations"
if vB_Testing == true
sleep 4001
endif
clear
"sw_Running_Script_F" state  = false
"sw_Running_Hop_1" state  = false
stop "Hops_3_Hop_Drop_Calculations"
```

## 117. Hops_4_Hop_AAU_Check_Zero

Starts by itself: No · User can start or stop it: Yes · 252 lines

```text
//Hops_4_Hop_AAU_Check_Zero
//Version: 261002_14:22
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Called  @ 458 in scrBrew0_2_Batch_Setup_Hops
//02/28/2024 13:42
//Modofied 06/20/2026 14:04
//Checks if AAU Actual is zero
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblVScriptFlow" value = -99
show workspace "Batch1 Hops"
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
"sw_Advance_HopsCalc" visibility = hidden 
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
"sw_Advance_Hop_Delay" visibility = hidden
new value vV_Check
new string vS_AAU
new string vS_AAU1
new bool vB_InUse1
new bool vB_InUse2
new bool vB_InUse3
new bool vB_InUse4
new bool vB_InUse5
new bool vB_InUse6
new bool vB_InUse7
new bool vB_InUse8
new bool vB_StatusHop_1
new bool vB_StatusHop_2
new bool vB_StatusHop_3
new bool vB_StatusHop_4
new bool vB_StatusHop_5
new bool vB_StatusHop_6
new bool vB_StatusHop_7
new bool vB_StatusHop_8
new value vV_AAU_Actual_1
new value vV_AAU_Actual_2
new value vV_AAU_Actual_3
new value vV_AAU_Actual_4
new value vV_AAU_Actual_5
new value vV_AAU_Actual_6
new value vV_AAU_Actual_7
new value vV_AAU_Actual_8
vB_InUse1 = "sw_Use_Hop1_Batch" state
vB_InUse2 = "sw_Use_Hop2_Batch" state
vB_InUse3 = "sw_Use_Hop3_Batch" state
vB_InUse4 = "sw_Use_Hop4_Batch" state
vB_InUse5 = "sw_Use_Hop5_Batch" state
vB_InUse6 = "sw_Use_Hop6_Batch" state
vB_InUse7 = "sw_Use_Hop7_Batch" state
vB_InUse8 = "sw_Use_Hop8_Batch" state
if vB_InUse1 == false
vB_StatusHop_1 = true
else
vV_AAU_Actual_1 = "gblV_Hop1_Actual_AAU_R1" value
if  vV_AAU_Actual_1 > 0 
vB_StatusHop_1 = true
endif
endif
if vB_InUse2 == false
vB_StatusHop_2 = true
else
vB_StatusHop_2 = false
vV_AAU_Actual_2 = "gblV_Hop2_Actual_AAU_R1" value
if  vV_AAU_Actual_2 > 0 
vB_StatusHop_2 = true
endif
endif
if vB_InUse3 == false
vB_StatusHop_3 = true
else
vV_AAU_Actual_3 = "gblV_Hop3_Actual_AAU_R1" value
if  vV_AAU_Actual_3 > 0 
vB_StatusHop_3 = true
endif
endif
if vB_InUse4 == false
vB_StatusHop_4 = true
else
vV_AAU_Actual_4 = "gblV_Hop4_Actual_AAU_R1" value
if  vV_AAU_Actual_4 > 0 
vB_StatusHop_4 = true
endif
endif
if vB_InUse5 == false
vB_StatusHop_5 = true
else
vV_AAU_Actual_5 = "gblV_Hop5_Actual_AAU_R1" value
if  vV_AAU_Actual_5 > 0 
vB_StatusHop_5 = true
endif
endif
if vB_InUse6 == false
vB_StatusHop_6 = true
else
vV_AAU_Actual_6 = "gblV_Hop6_Actual_AAU_R1" value
if  vV_AAU_Actual_6 > 0 
vB_StatusHop_6 = true
endif
endif
if vB_InUse7 == false
vB_StatusHop_7 = true
else
vV_AAU_Actual_7 = "gblV_Hop7_Actual_AAU_R1" value
if  vV_AAU_Actual_7 > 0 
vB_StatusHop_7 = true
endif
endif
if vB_InUse8 == false
vB_StatusHop_8 = true
else
vV_AAU_Actual_8 = "gblV_Hop8_Actual_AAU_R1" value
if  vV_AAU_Actual_8 > 0 
vB_StatusHop_8 = true
endif
endif
//.........................................................
"insp_BatchHide" visibility = visible
"tm_Delay_W1" type = countdown
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" displayname = "Checking AAu Actual"
"gblS_Hop_Screen_Txt"  value = "Wait!  Checking that any HOPS used that the Actual AAU is not zero.  Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = 00:00:05
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
"gblV_Brew_Status" value = 99999
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
print "@30 start Checking AAU = 0"
[Hop_1]
if vB_StatusHop_1 == true
goto  "Hop_2"
else
vS_AAU = "AAU 1 (Actual) "
vV_Check = 1
goto "ErrorMsg"
endif
//.....................................
[Hop_2]
if vB_StatusHop_2 == true
goto  "Hop_3"
else
vS_AAU = "AAU 2 (Actual) "
vV_Check = 1
goto "ErrorMsg"
endif
//.....................................
[Hop_3]
if vB_StatusHop_3 == true
goto  "Hop_4"
else
vS_AAU = "AAU 3 (Actual) "
vV_Check = 1
goto "ErrorMsg"
endif
//....................................
[Hop_4]
if vB_StatusHop_4 == true
goto  "Hop_5"
else
vS_AAU = "AAU 4 (Actual) "
vV_Check = 1
goto "ErrorMsg"
endif
//....................................
[Hop_5]
if vB_StatusHop_5 == true
goto  "Hop_6"
else
vS_AAU = "AAU 5 (Actual) "
vV_Check = 1
goto "ErrorMsg"
endif
//....................................
[Hop_6]
if vB_StatusHop_6 == true
goto  "Hop_7"
else
vS_AAU = "AAU 6 (Actual) "
vV_Check = 1
goto "ErrorMsg"
endif
//....................................
[Hop_7]
if vB_StatusHop_7 == true
goto  "Hop_8"
else
vS_AAU = "AAU 7 (Actual) "
vV_Check = 1
goto "ErrorMsg"
endif
//....................................
[Hop_8]
if vB_StatusHop_8 == true
else
vS_AAU = "AAU 8 (Actual) "
vV_Check = 1
goto "ErrorMsg"
endif
//....................................
//....................................
goto "EnderAAUZero16"
[EnderAAUZero16]
"gblS_Hop_Screen_Txt" visibility = hidden
"gblS_Hop_Screen_Txt" background = 1
if  vV_Check ==  0
"gblV_Brew_Status" value = 16
goto "End_AAUZero"
endif
[ErrorMsg]
"insp_BatchHide" visibility = visible
"gblS_Hop_Screen_Txt" displayname = "AAU Error"
vS_AAU1 = "cannot be ZERO!  Add the value from the Hop Package and Re Click the Check AAU? switch!  This message will be displayed for 30 seconds.  You may use to Advance Timer switch (Upper Right) to advance early.  "
vS_AAU = vS_AAU + vS_AAU1
"gblS_Hop_Screen_Txt" value = vS_AAU
stop "tm_Delay_W1"
"sw_Advance_Hop_Delay" visibility = visible
start "looper_scrBlinkClick"
"tm_Delay_W1" type = countdown
"gblS_Hop_Screen_Txt" background = 2
"tm_Delay_W1" displayname = "30 Second Delay"
 "tm_Delay_W1" value = 00:00:30
start "tm_Delay_W1"
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" visibility = visible
wait  "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1" 
"gblS_Hop_Screen_Txt" visibility = hidden
"tm_Delay_W1" visibility = hidden
"sw_Advance_Hop_Delay" visibility = hidden
stop "looper_scrBlinkClick"
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
"gblV_Brew_Status" value = 12
goto "End_AAUZero"
[End_AAUZero]
start "inscpt_scrClearBatchHops"
sleep 100
wait "sw_Running_ClearBatchHops" state == false
[Ender_AAU_Check]
"gblS_Inter_Script" value = "ended: Hops_4_Hop_AAU_Check_Zero"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value = 12
stop "Hops_4_Hop_AAU_Check_Zero"
```

## 118. Hops_5_Hop_Calc_OZ

Starts by itself: No · User can start or stop it: Yes · 114 lines

```text
// Hops_5_Hop_Calc_OZ
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//called @ 43 in scrBrew0_2_2_All_Hop_Scripts_Calculation
// 09 / 05 / 2023 15:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vV_R_OZ_Hop1
new value vV_R_OZ_Hop2
new value vV_R_OZ_Hop3
new value vV_R_OZ_Hop4
new value vV_R_OZ_Hop5
new value vV_R_OZ_Hop6
new value vV_R_OZ_Hop7
new value vV_R_OZ_Hop8
new value vV_R_AAU_Hop1
new value vV_R_AAU_Hop2
new value vV_R_AAU_Hop3
new value vV_R_AAU_Hop4
new value vV_R_AAU_Hop5
new value vV_R_AAU_Hop6
new value vV_R_AAU_Hop7
new value vV_R_AAU_Hop8
new value vV_Act_AAU_Hop8
new value vV_R_HBU_Hop1
new value vV_R_HBU_Hop2
new value vV_R_HBU_Hop3
new value vV_R_HBU_Hop4
new value vV_R_HBU_Hop5
new value vV_R_HBU_Hop6
new value vV_R_HBU_Hop7
new value vV_R_HBU_Hop8
new value vV_Act_AAU_Hop1
new value vV_Act_AAU_Hop2
new value vV_Act_AAU_Hop3
new value vV_Act_AAU_Hop4
new value vV_Act_AAU_Hop5
new value vV_Act_AAU_Hop6
new value vV_Act_AAU_Hop7
// Hop1
if "gblV_Hop1_Group_R1" value != 0
vV_R_OZ_Hop1 = "gblV_Hop1_Oz_R1" value
vV_R_AAU_Hop1 = "gblV_Hop1_Recipe_AAU_R1" value
vV_Act_AAU_Hop1 = "gblV_Hop1_Actual_AAU_R1"  value
vV_R_HBU_Hop1 = vV_R_OZ_Hop1 * vV_R_AAU_Hop1
print  vV_R_HBU_Hop1
print vV_Act_AAU_Hop1 
"gblV_Oz_Calculated_Hop1_R1"  value = vV_R_HBU_Hop1  / vV_Act_AAU_Hop1
endif
//Hop2
if "gblV_Hop2_Group_R1" value != 0
vV_R_OZ_Hop2 = "gblV_Hop2_Oz_R1" value
vV_R_AAU_Hop2 = "gblV_Hop2_Recipe_AAU_R1" value
vV_Act_AAU_Hop2 = "gblV_Hop2_Actual_AAU_R1"  value
vV_R_HBU_Hop2 = vV_R_OZ_Hop2 * vV_R_AAU_Hop2
"gblV_Oz_Calculated_Hop2_R1"  value = vV_R_HBU_Hop2  / vV_Act_AAU_Hop2
endif
// Hop3
if "gblV_Hop3_Group_R1" value != 0
vV_R_OZ_Hop3 = "gblV_Hop3_Oz_R1" value
vV_R_AAU_Hop3 = "gblV_Hop3_Recipe_AAU_R1" value
vV_Act_AAU_Hop3 = "gblV_Hop3_Actual_AAU_R1"  value
vV_R_HBU_Hop3 = vV_R_OZ_Hop3 * vV_R_AAU_Hop3
"gblV_Oz_Calculated_Hop3_R1"  value = vV_R_HBU_Hop3  / vV_Act_AAU_Hop3
endif
// Hop4
if "gblV_Hop4_Group_R1" value != 0
vV_R_OZ_Hop4 = "gblV_Hop4_Oz_R1" value
vV_R_AAU_Hop4 = "gblV_Hop4_Recipe_AAU_R1" value
vV_Act_AAU_Hop4 = "gblV_Hop4_Actual_AAU_R1"  value
vV_R_HBU_Hop4 = vV_R_OZ_Hop4 * vV_R_AAU_Hop4
"gblV_Oz_Calculated_Hop4_R1"  value = vV_R_HBU_Hop4  / vV_Act_AAU_Hop4
endif
// Hop5
if "gblV_Hop5_Group_R1" value != 0
vV_R_OZ_Hop5 = "gblV_Hop5_Oz_R1" value
vV_R_AAU_Hop5 = "gblV_Hop5_Recipe_AAU_R1" value
vV_Act_AAU_Hop5 = "gblV_Hop5_Actual_AAU_R1"  value
vV_R_HBU_Hop5 = vV_R_OZ_Hop5 * vV_R_AAU_Hop5
"gblV_Oz_Calculated_Hop5_R1"  value = vV_R_HBU_Hop5  / vV_Act_AAU_Hop5
endif
// Hop6
if "gblV_Hop6_Group_R1" value != 0
vV_R_OZ_Hop6 = "gblV_Hop6_Oz_R1" value
vV_R_AAU_Hop6 = "gblV_Hop6_Recipe_AAU_R1" value
vV_Act_AAU_Hop6 = "gblV_Hop6_Actual_AAU_R1"  value
vV_R_HBU_Hop6 = vV_R_OZ_Hop6 * vV_R_AAU_Hop6
"gblV_Oz_Calculated_Hop6_R1"  value = vV_R_HBU_Hop6  / vV_Act_AAU_Hop6
endif
// Hop7
if "gblV_Hop7_Group_R1" value != 0
vV_R_OZ_Hop7 = "gblV_Hop7_Oz_R1" value
vV_R_AAU_Hop7 = "gblV_Hop7_Recipe_AAU_R1" value
vV_Act_AAU_Hop7 = "gblV_Hop7_Actual_AAU_R1"  value
vV_R_HBU_Hop7 = vV_R_OZ_Hop7 * vV_R_AAU_Hop7
"gblV_Oz_Calculated_Hop7_R1"  value = vV_R_HBU_Hop7  / vV_Act_AAU_Hop7
endif
// Hop8
if "gblV_Hop8_Group_R1" value != 0
vV_R_OZ_Hop8 = "gblV_Hop8_Oz_R1" value
vV_R_AAU_Hop8 = "gblV_Hop8_Recipe_AAU_R1" value
vV_Act_AAU_Hop8 = "gblV_Hop8_Actual_AAU_R1"  value
vV_R_HBU_Hop8 = vV_R_OZ_Hop8 * vV_R_AAU_Hop8
"gblV_Oz_Calculated_Hop8_R1"  value = vV_R_HBU_Hop8  / vV_Act_AAU_Hop8
endif
"gblS_Inter_Script" value = "ended: Hops_5_Hop_Calc_OZ"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value = 4
stop "Hops_5_Hop_Calc_OZ"
```

## 119. Hops_6_Hop_Calc_MAX

Starts by itself: No · User can start or stop it: No · 820 lines

```text
Hops 6 hop calc max · TXT
//Hops_6_Hop_Calc_MAX
//Version: 261001_14:49
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Called from @ 94 in scrBrew0_2_2_All_Hop_Scripts_Calculation
//  12/01/2024 07:14
//Modified  12/01/2024 07:14
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblVHop_Max" value = 0
"sw_Flow_Mash_Hops" state = false
"sw_Status_Hops_1st" state = false
"sw_Status_Hops_SOB" state = false
"sw_Status_Hops_EOB" state = false
"sw_Status_Hops_Dry" state = false
[HopCk1]
if "sw_Use_Hop1_Batch" state == true
else 
goto "HopCk2"
endif
	if "gblV_Hop1_Group_R1" value  > 0
	else
	goto "HopCk2"
	endif
		if "gblV_Hop1_Group_R1" value == 8
		"gblV_Precision_0" value = 8
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk2"	
		endif		
		if "gblV_Hop1_Group_R1" value == 7
		"gblV_Precision_0" value = 7
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk2"	
		endif	
		if "gblV_Hop1_Group_R1" value == 6
		"gblV_Precision_0" value = 6
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk2"	
		endif
		if "gblV_Hop1_Group_R1" value == 5
		"gblV_Precision_0" value = 5
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk2"	
		endif
		if "gblV_Hop1_Group_R1" value == 4
		"gblV_Precision_0" value = 4
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk2"	
		endif
		if "gblV_Hop1_Group_R1" value == 3
		"gblV_Precision_0" value = 3
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk2"	
		endif
		if "gblV_Hop1_Group_R1" value == 2
		"gblV_Precision_0" value = 2
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk2"	
		endif
		if "gblV_Hop1_Group_R1" value == 1
		"gblV_Precision_0" value = 1
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk2"	
		endif
[HopCk2]
if "sw_Use_Hop2_Batch" state == true
else 
goto "HopCk3"
endif
	if "gblV_Hop2_Group_R1" value  > 0
	else
	goto "HopCk3"
	endif
		if "gblV_Hop2_Group_R1" value == 8
		"gblV_Precision_0" value = 8
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk3"	
		endif		
		if "gblV_Hop2_Group_R1" value == 7
		"gblV_Precision_0" value = 7
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk3"	
		endif	
		if "gblV_Hop2_Group_R1" value == 6
		"gblV_Precision_0" value = 6
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk3"	
		endif
		if "gblV_Hop2_Group_R1" value == 5
		"gblV_Precision_0" value = 5
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk3"	
		endif
		if "gblV_Hop2_Group_R1" value == 4
		"gblV_Precision_0" value = 4
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk3"	
		endif
		if "gblV_Hop2_Group_R1" value == 3
		"gblV_Precision_0" value = 3
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk3"	
		endif
		if "gblV_Hop2_Group_R1" value == 2
		"gblV_Precision_0" value = 2
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk3"	
		endif
		if "gblV_Hop2_Group_R1" value == 1
		"gblV_Precision_0" value = 1
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk3"	
		endif
[HopCk3]
if "sw_Use_Hop3_Batch" state == true
else 
goto "HopCk4"
endif
	if "gblV_Hop3_Group_R1" value  > 0
	else
	goto "HopCk4"
	endif
		if "gblV_Hop3_Group_R1" value == 8
		"gblV_Precision_0" value = 8
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk4"	
		endif		
		if "gblV_Hop3_Group_R1" value == 7
		"gblV_Precision_0" value = 7
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk4"	
		endif	
		if "gblV_Hop3_Group_R1" value == 6
		"gblV_Precision_0" value = 6
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk4"	
		endif
		if "gblV_Hop3_Group_R1" value == 5
		"gblV_Precision_0" value = 5
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk4"	
		endif
		if "gblV_Hop3_Group_R1" value == 4
		"gblV_Precision_0" value = 4
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk4"	
		endif
		if "gblV_Hop3_Group_R1" value == 3
		"gblV_Precision_0" value = 3
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk4"	
		endif
		if "gblV_Hop3_Group_R1" value == 2
		"gblV_Precision_0" value = 2
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk4"	
		endif
		if "gblV_Hop3_Group_R1" value == 1
		"gblV_Precision_0" value = 1
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk4"	
		endif
[HopCk4]
if "sw_Use_Hop4_Batch" state == true
else 
goto "HopCk5"
endif
	if "gblV_Hop4_Group_R1" value  > 0
	else
	goto "HopCk5"
	endif
		if "gblV_Hop4_Group_R1" value == 8
		"gblV_Precision_0" value = 8
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk5"	
		endif		
		if "gblV_Hop4_Group_R1" value == 7
		"gblV_Precision_0" value = 7
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk5"	
		endif	
		if "gblV_Hop4_Group_R1" value == 6
		"gblV_Precision_0" value = 6
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk5"	
		endif
		if "gblV_Hop4_Group_R1" value == 5
		"gblV_Precision_0" value = 5
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk5"	
		endif
		if "gblV_Hop4_Group_R1" value == 4
		"gblV_Precision_0" value = 4
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk5"	
		endif
		if "gblV_Hop4_Group_R1" value == 3
		"gblV_Precision_0" value = 3
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk5"	
		endif
		if "gblV_Hop4_Group_R1" value == 2
		"gblV_Precision_0" value = 2
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk5"	
		endif
		if "gblV_Hop4_Group_R1" value == 1
		"gblV_Precision_0" value = 1
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk5"	
		endif
[HopCk5]
if "sw_Use_Hop5_Batch" state == true
else 
goto "HopCk6"
endif
	if "gblV_Hop5_Group_R1" value  > 0
	else
	goto "HopCk6"
	endif
		if "gblV_Hop5_Group_R1" value == 8
		"gblV_Precision_0" value = 8
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk6"	
		endif		
		if "gblV_Hop5_Group_R1" value == 7
		"gblV_Precision_0" value = 7
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk6"	
		endif	
		if "gblV_Hop5_Group_R1" value == 6
		"gblV_Precision_0" value = 6
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk6"	
		endif
		if "gblV_Hop5_Group_R1" value == 5
		"gblV_Precision_0" value = 5
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk6"	
		endif
		if "gblV_Hop5_Group_R1" value == 4
		"gblV_Precision_0" value = 4
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk6"	
		endif
		if "gblV_Hop5_Group_R1" value == 3
		"gblV_Precision_0" value = 3
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk6"	
		endif
		if "gblV_Hop5_Group_R1" value == 2
		"gblV_Precision_0" value = 2
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk6"	
		endif
		if "gblV_Hop5_Group_R1" value == 1
		"gblV_Precision_0" value = 1
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk6"	
		endif
[HopCk6]
if "sw_Use_Hop6_Batch" state == true
else 
goto "HopCk7"
endif
	if "gblV_Hop6_Group_R1" value  > 0
	else
	goto "HopCk7"
	endif
		if "gblV_Hop6_Group_R1" value == 8
		"gblV_Precision_0" value = 8
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk7"	
		endif		
		if "gblV_Hop6_Group_R1" value == 7
		"gblV_Precision_0" value = 7
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk7"	
		endif	
		if "gblV_Hop6_Group_R1" value == 6
		"gblV_Precision_0" value = 6
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk7"	
		endif
		if "gblV_Hop6_Group_R1" value == 5
		"gblV_Precision_0" value = 5
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk7"	
		endif
		if "gblV_Hop6_Group_R1" value == 4
		"gblV_Precision_0" value = 4
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk7"	
		endif
		if "gblV_Hop6_Group_R1" value == 3
		"gblV_Precision_0" value = 3
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk7"	
		endif
		if "gblV_Hop6_Group_R1" value == 2
		"gblV_Precision_0" value = 2
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk7"	
		endif
		if "gblV_Hop6_Group_R1" value == 1
		"gblV_Precision_0" value = 1
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk7"	
		endif
[HopCk7]
if "sw_Use_Hop7_Batch" state == true
else 
goto "HopCk8"
endif
	if "gblV_Hop7_Group_R1" value  > 0
	else
	goto "HopCk8"
	endif
		if "gblV_Hop7_Group_R1" value == 8
		"gblV_Precision_0" value = 8
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk8"	
		endif		
		if "gblV_Hop7_Group_R1" value == 7
		"gblV_Precision_0" value = 7
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk8"	
		endif	
		if "gblV_Hop7_Group_R1" value == 6
		"gblV_Precision_0" value = 6
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk8"	
		endif
		if "gblV_Hop7_Group_R1" value == 5
		"gblV_Precision_0" value = 5
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk8"	
		endif
		if "gblV_Hop7_Group_R1" value == 4
		"gblV_Precision_0" value = 4
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk8"	
		endif
		if "gblV_Hop7_Group_R1" value == 3
		"gblV_Precision_0" value = 3
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk8"	
		endif
		if "gblV_Hop7_Group_R1" value == 2
		"gblV_Precision_0" value = 2
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk8"	
		endif
		if "gblV_Hop7_Group_R1" value == 1
		"gblV_Precision_0" value = 1
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCk8"	
		endif
[HopCk8]
if "sw_Use_Hop8_Batch" state == true
else 
goto "HopCkMaxEnd"
endif
	if "gblV_Hop8_Group_R1" value  > 0
	else
	goto "HopCkMaxEnd"
	endif
		if "gblV_Hop8_Group_R1" value == 8
		"gblV_Precision_0" value = 8
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCkMaxEnd"	
		endif		
		if "gblV_Hop8_Group_R1" value == 7
		"gblV_Precision_0" value = 7
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCkMaxEnd"	
		endif	
		if "gblV_Hop8_Group_R1" value == 6
		"gblV_Precision_0" value = 6
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCkMaxEnd"	
		endif
		if "gblV_Hop8_Group_R1" value == 5
		"gblV_Precision_0" value = 5
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCkMaxEnd"	
		endif
		if "gblV_Hop8_Group_R1" value == 4
		"gblV_Precision_0" value = 4
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCkMaxEnd"	
		endif
		if "gblV_Hop8_Group_R1" value == 3
		"gblV_Precision_0" value = 3
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCkMaxEnd"	
		endif
		if "gblV_Hop8_Group_R1" value == 2
		"gblV_Precision_0" value = 2
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCkMaxEnd"	
		endif
		if "gblV_Hop8_Group_R1" value == 1
		"gblV_Precision_0" value = 1
			if "gblV_Precision_0" value > "gblVHop_Max" value
			"gblVHop_Max" value = "gblV_Precision_0" value
			endif
		goto "HopCkMaxEnd"	
		endif
[HopCkMaxEnd]
// Odd Hops
[Hop1_Odd]
if "sw_Use_Hop1_Batch" state == true
goto "Hop1_Odd_CK"
endif
goto "Hop2_Odd"
[Hop1_Odd_CK]
if "gblV_Hop1_Group_R1" value >= 0
goto "Hop2_Odd"
endif
	//  Hops on Mash
	if "gblV_Hop1_Group_R1" value == -333 
	"sw_Flow_Mash_Hops" state = true
	goto "Hop2_Odd"
	endif
	//  1st Wort Hops 
	if "gblV_Hop1_Group_R1" value == -444 
	"sw_Status_Hops_1st" state = true
	goto "Hop2_Odd"
	endif
	// Start Of Boil Hops
	if "gblV_Hop1_Group_R1" value == -888 
	"sw_Status_Hops_SOB" state = true
	goto "Hop2_Odd"
	endif
	// End Of Boil Hops
	if "gblV_Hop1_Group_R1" value == -999
		"sw_Status_Hops_EOB" state = true
		goto "Hop2_Odd"
	endif
	// Dry Hops
	if "gblV_Hop1_Group_R1" value == -111 
	"sw_Status_Hops_Dry"  state = true
	goto "Hop2_Odd"
	endif
[Hop2_Odd]
if "sw_Use_Hop2_Batch" state == true
goto "Hop2_Odd_CK"
endif
goto "Hop3_Odd"
[Hop2_Odd_CK]
if "gblV_Hop2_Group_R1" value >= 0
goto "Hop3_Odd"
endif
	//  Hops on Mash
	if "gblV_Hop2_Group_R1" value == -333 
	"sw_Flow_Mash_Hops" state = true
	goto "Hop3_Odd"
	endif
	//  1st Wort Hops 
	if "gblV_Hop2_Group_R1" value == -444 
	"sw_Status_Hops_1st" state = true
	goto "Hop3_Odd"
	endif
	// Start Of Boil Hops
	if "gblV_Hop2_Group_R1" value == -888 
	"sw_Status_Hops_SOB" state = true
	goto "Hop3_Odd"
	endif
	// End Of Boil Hops
	if "gblV_Hop2_Group_R1" value == -999
		"sw_Status_Hops_EOB" state = true
		goto "Hop3_Odd"
	endif
	// Dry Hops
	if "gblV_Hop2_Group_R1" value == -111 
	"sw_Status_Hops_Dry"  state = true
	goto "Hop3_Odd"
	endif
[Hop3_Odd]
if "sw_Use_Hop3_Batch" state == true
goto "Hop3_Odd_CK"
endif
goto "Hop4_Odd"
[Hop3_Odd_CK]
if "gblV_Hop3_Group_R1" value >= 0
goto "Hop4_Odd"
endif
	//  Hops on Mash
	if "gblV_Hop3_Group_R1" value == -333 
	"sw_Flow_Mash_Hops" state = true
	goto "Hop4_Odd"
	endif
	//  1st Wort Hops 
	if "gblV_Hop3_Group_R1" value == -444 
	"sw_Status_Hops_1st" state = true
	goto "Hop4_Odd"
	endif
	// Start Of Boil Hops
	if "gblV_Hop3_Group_R1" value == -888 
	"sw_Status_Hops_SOB" state = true
	goto "Hop4_Odd"
	endif
	// End Of Boil Hops
	if "gblV_Hop3_Group_R1" value == -999
		"sw_Status_Hops_EOB" state = true
		goto "Hop4_Odd"
	endif
	// Dry Hops
	if "gblV_Hop3_Group_R1" value == -111 
	"sw_Status_Hops_Dry"  state = true
	goto "Hop4_Odd"
	endif
[Hop4_Odd]
if "sw_Use_Hop4_Batch" state == true
goto "Hop4_Odd_CK"
endif
goto "Hop5_Odd"
[Hop4_Odd_CK]
if "gblV_Hop4_Group_R1" value >= 0
goto "Hop5_Odd"
endif
	//  Hops on Mash
	if "gblV_Hop4_Group_R1" value == -333 
	"sw_Flow_Mash_Hops" state = true
	goto "Hop5_Odd"
	endif
	//  1st Wort Hops 
	if "gblV_Hop4_Group_R1" value == -444 
	"sw_Status_Hops_1st" state = true
	goto "Hop5_Odd"
	endif
	// Start Of Boil Hops
	if "gblV_Hop4_Group_R1" value == -888 
	"sw_Status_Hops_SOB" state = true
	goto "Hop5_Odd"
	endif
	// End Of Boil Hops
	if "gblV_Hop4_Group_R1" value == -999
		"sw_Status_Hops_EOB" state = true
		goto "Hop5_Odd"
	endif
	// Dry Hops
	if "gblV_Hop4_Group_R1" value == -111 
	"sw_Status_Hops_Dry"  state = true
	goto "Hop5_Odd"
	endif
[Hop5_Odd]
if "sw_Use_Hop5_Batch" state == true
goto "Hop5_Odd_CK"
endif
goto "Hop6_Odd"
[Hop5_Odd_CK]
if "gblV_Hop5_Group_R1" value >= 0
goto "Hop6_Odd"
endif
	//  Hops on Mash
	if "gblV_Hop5_Group_R1" value == -333 
	"sw_Flow_Mash_Hops" state = true
	goto "Hop6_Odd"
	endif
	//  1st Wort Hops 
	if "gblV_Hop5_Group_R1" value == -444 
	"sw_Status_Hops_1st" state = true
	goto "Hop6_Odd"
	endif
	// Start Of Boil Hops
	if "gblV_Hop5_Group_R1" value == -888 
	"sw_Status_Hops_SOB" state = true
	goto "Hop6_Odd"
	endif
	// End Of Boil Hops
	if "gblV_Hop5_Group_R1" value == -999
		"sw_Status_Hops_EOB" state = true
		goto "Hop6_Odd"
	endif
	// Dry Hops
	if "gblV_Hop5_Group_R1" value == -111 
	"sw_Status_Hops_Dry"  state = true
	goto "Hop6_Odd"
	endif
[Hop6_Odd]
if "sw_Use_Hop6_Batch" state == true
goto "Hop6_Odd_CK"
endif
goto "Hop7_Odd"
[Hop6_Odd_CK]
if "gblV_Hop6_Group_R1" value >= 0
goto "Hop7_Odd"
endif
	//  Hops on Mash
	if "gblV_Hop6_Group_R1" value == -333 
	"sw_Flow_Mash_Hops" state = true
	goto "Hop7_Odd"
	endif
	//  1st Wort Hops 
	if "gblV_Hop6_Group_R1" value == -444 
	"sw_Status_Hops_1st" state = true
	goto "Hop7_Odd"
	endif
	// Start Of Boil Hops
	if "gblV_Hop6_Group_R1" value == -888 
	"sw_Status_Hops_SOB" state = true
	goto "Hop7_Odd"
	endif
	// End Of Boil Hops
	if "gblV_Hop6_Group_R1" value == -999
		"sw_Status_Hops_EOB" state = true
		goto "Hop7_Odd"
	endif
	// Dry Hops
	if "gblV_Hop6_Group_R1" value == -111 
	"sw_Status_Hops_Dry"  state = true
	goto "Hop7_Odd"
	endif
[Hop7_Odd]
if "sw_Use_Hop7_Batch" state == true
goto "Hop7_Odd_CK"
endif
goto "Hop8_Odd"
[Hop7_Odd_CK]
if "gblV_Hop7_Group_R1" value >= 0
goto "Hop8_Odd"
endif
	//  Hops on Mash
	if "gblV_Hop7_Group_R1" value == -333 
	"sw_Flow_Mash_Hops" state = true
	goto "Hop8_Odd"
	endif
	//  1st Wort Hops 
	if "gblV_Hop7_Group_R1" value == -444 
	"sw_Status_Hops_1st" state = true
	goto "Hop8_Odd"
	endif
	// Start Of Boil Hops
	if "gblV_Hop7_Group_R1" value == -888 
	"sw_Status_Hops_SOB" state = true
	goto "Hop8_Odd"
	endif
	// End Of Boil Hops
	if "gblV_Hop7_Group_R1" value == -999
		"sw_Status_Hops_EOB" state = true
		goto "Hop8_Odd"
	endif
	// Dry Hops
	if "gblV_Hop7_Group_R1" value == -111 
	"sw_Status_Hops_Dry"  state = true
	goto "Hop8_Odd"
	endif
[Hop8_Odd]
if "sw_Use_Hop8_Batch" state == true
goto "Hop8_Odd_CK"
endif
goto "HopOddEnd"
[Hop8_Odd_CK]
if "gblV_Hop8_Group_R1" value >= 0
goto "HopOddEnd"
endif
	//  Hops on Mash
	if "gblV_Hop8_Group_R1" value == -333 
	"sw_Flow_Mash_Hops" state = true
	goto "HopOddEnd"
	endif
	//  1st Wort Hops 
	if "gblV_Hop8_Group_R1" value == -444 
	"sw_Status_Hops_1st" state = true
	goto "HopOddEnd"
	endif
	// Start Of Boil Hops
	if "gblV_Hop8_Group_R1" value == -888 
	"sw_Status_Hops_SOB" state = true
	goto "HopOddEnd"
	endif
	// End Of Boil Hops
	if "gblV_Hop8_Group_R1" value == -999
		"sw_Status_Hops_EOB" state = true
		goto "HopOddEnd"
	endif
	// Dry Hops
	if "gblV_Hop8_Group_R1" value == -111 
	"sw_Status_Hops_Dry" state = true
	goto "HopOddEnd"
	endif
[HopOddEnd]
"gblS_Inter_Script" value = "ended: Hops_6_Hop_Calc_MAX"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value = 7
stop "Hops_6_Hop_Calc_MAX"
```

## 120. Hops_7_Hop_Warning_Text

Starts by itself: No · User can start or stop it: Yes · 176 lines

```text
//Hops_7_Hop_Warning_Text
//Version: 261002_15:00
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Called from @ @ 96 in scrBrew0_2_2_All_Hop_Scripts_Calculation
//09/05/2023 15:21
//modified 12/01/2024
[Set_Testing]
"sw_Running_Hop_7" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblVScriptFlow" value =  8
//Set Hops Texts
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
//BackGrounds
// Black Purple Red
//"gblS_Brewery_Top_2" background = 2
// Dark-Grey Green Blue
"gblS_Brewery_Top_3" background = 3
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
"gblS_swAllSwitch_Label_Text" value = "Wait: Setting Hop Texts"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden 
"gblS_HopGroup_0" value = "x"
"gblS_HopGroup_1" value = "x"
"gblS_HopGroup_2" value = "x"
"gblS_HopGroup_3" value = "x"
"gblS_HopGroup_4" value = "x"
"gblS_HopGroup_5" value = "x"
"gblS_HopGroup_6" value = "x"
"gblS_HopGroup_7" value = "x"
"gblS_HopGroup_8" value = "x"
"gblS_HopGroup_EOB" value = "x"
"gblS_HopGroup_Rocket" value = "x"
"gblS_Brewery_Top_3"  background = 3
"gblS_Brewery_Top_3" value = "Setting some Texts for Hops durning the Boil.  These Texts are grouped by the Hop Group Number you  entered earlier.  The same Hop Group Number Hops are togather."
"gblS_Brewery_Top_3" visibility = visible
stop "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" type = countdown
"tm_Action_BottomRight_B1" displayname = "Hop Texts"
start "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" visibility = visible
wait "tm_Action_BottomRight_B1" value <=  00:00:00
"tm_Action_BottomRight_B1" visibility = hidden
stop "tm_Action_BottomRight_B1"
"gblS_Brewery_Top_3"   visibility = hidden
//Hops in Mash
wait "gblVScriptFlow" value ==  8
"gblS_Inter_Script" value = "@ 71 in Hops_7_Hop_Warning_Text  > start :Hops_8_Hop_Text_Mash"
start "Hops_8_Hop_Text_Mash"
wait "gblVScriptFlow" value ==  9
"gblS_Inter_Script" value = "@ 74 in Hops_7_Hop_Warning_Text  > start :Hops_9_Hop_Text_1st_Wort"
start "Hops_9_Hop_Text_1st_Wort"
wait "gblVScriptFlow" value ==  10
"gblS_Inter_Script" value = "@ 77 in Hops_7_Hop_Warning_Text  > start :Hops_10_Hop_Text_SOB"
start "Hops_10_Hop_Text_SOB" 
wait "gblVScriptFlow" value ==  11
"gblS_Inter_Script" value = "@ 80 in Hops_7_Hop_Warning_Text  > start :Hops_11_Hop_Text_Drop_1"
start "Hops_11_Hop_Text_Drop_1" 
wait "gblVScriptFlow" value ==  12
"gblS_Inter_Script" value = "@ 83 in Hops_7_Hop_Warning_Text  > start :Hops_12_Hop_Text_Drop_2"
start "Hops_12_Hop_Text_Drop_2" 
wait "gblVScriptFlow" value ==  13
"gblS_Inter_Script" value = "@ 86 in Hops_7_Hop_Warning_Text  > start :Hops_13_Hop_Text_Drop_3"
start "Hops_13_Hop_Text_Drop_3" 
wait "gblVScriptFlow" value ==  14
"gblS_Inter_Script" value = "@ 87 in Hops_7_Hop_Warning_Text  > start :Hops_14_Hop_Text_Drop_4"
start "Hops_14_Hop_Text_Drop_4" 
wait "gblVScriptFlow" value ==  15
"gblS_Inter_Script" value = "@ 92 in Hops_7_Hop_Warning_Text  > start :Hops_15_Hop_Text_Drop_5"
start "Hops_15_Hop_Text_Drop_5"
wait "gblVScriptFlow" value ==  16
"gblS_Inter_Script" value = "@ 95 in Hops_7_Hop_Warning_Text  > start :Hops_16_Hop_Text_Drop_6"
start "Hops_16_Hop_Text_Drop_6" 
wait "gblVScriptFlow" value ==  17
"gblS_Inter_Script" value = "@ 98 in Hops_7_Hop_Warning_Text  > start :Hops_17_Hop_Text_Drop_7"
start "Hops_17_Hop_Text_Drop_7" 
wait "gblVScriptFlow" value ==  18
"gblS_Inter_Script" value = "@ 101 in Hops_7_Hop_Warning_Text  > start :Hops_18_Hop_Text_Drop_8"
start "Hops_18_Hop_Text_Drop_8" 
wait "gblVScriptFlow" value ==  19
"gblS_Inter_Script" value = "@ 104 in Hops_7_Hop_Warning_Text  > start :Hops_19_Hop_Text_Whirlpool"
start "Hops_19_Hop_Text_Whirlpool" 
wait "gblVScriptFlow" value ==  20
"gblS_Inter_Script" value = "@ 107 in Hops_7_Hop_Warning_Text  > start :Hops_20_Hop_Text_DryHop"
start "Hops_20_Hop_Text_DryHop" 
wait "tm_Action_BottomRight_B1" value <=  00:00:00
wait "gblVScriptFlow" value ==  21
"gblS_Brewery_Top_3"  background = 3
"gblS_Brewery_Top_3" value = "All  Texts for Hops durning the Brew are complete.  These Texts are grouped by the Hop Group Number you entered earlier.  The same Hop Group Number Hops that have the Same Group are togather.  You should have grouped the Hops by the same Hop Drop times in the same group."
"gblS_Brewery_Top_3" visibility = visible
stop "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" displayname = "Hop Texts"
"tm_Action_BottomRight_B1" type = countdown
"tm_Action_BottomRight_B1" value = 00:00:06
start "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" visibility = visible
wait "tm_Action_BottomRight_B1" value <=  00:00:00
"tm_Action_BottomRight_B1" visibility = hidden
"gblS_Brewery_Top_3"   visibility = hidden
new value vV_Before
new string vS_Hop_Msg_Mash
new string vS_Hop_Msg_1st
new string vS_Hop_Msg_SoB
new string vS_Hop_Msg_2
new string vS_Hop_Msg_3
if "gblV_Group_Hops_Mash" value == 1
vS_Hop_Msg_Mash = ": Top Of MASH Hops "
vS_Hop_Msg_2 = vS_Hop_Msg_Mash
vV_Before += 1
endif
if "gblV_Group_FirstWort" value == 1
vS_Hop_Msg_1st = ": 1st Wort Hops "
vS_Hop_Msg_2 = vS_Hop_Msg_2 + vS_Hop_Msg_1st
vV_Before += 1
endif
if "gblV_Group_SoB_Hops" value == 1
vS_Hop_Msg_SoB = ": Start of Boil Hops "
vS_Hop_Msg_2 = vS_Hop_Msg_2 + vS_Hop_Msg_SoB
vV_Before += 1
endif
stop "tm_Action_BottomRight_B1"
if vV_Before == 0
goto "enderHopsSoB"
endif
"tm_Action_BottomRight_B1" displayname = "Hop Texts"
"tm_Action_BottomRight_B1" type = countdown
"tm_Action_BottomRight_B1" value = 00:00:15
start "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" visibility = visible
new string vS_Hop_Msg_1
new string vS_Hop_Msg_TTL
vS_Hop_Msg_1 = "There are Hops at " 
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "  You will get a 10 minute or better warning durning the Brew."
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL  + vS_Hop_Msg_3
delete  vS_Hop_Msg_1
delete  vS_Hop_Msg_2
delete  vS_Hop_Msg_3
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = vS_Hop_Msg_TTL
"gblS_Brewery_Top_3"  visibility = visible
wait "tm_Action_BottomRight_B1" value <=  00:00:00
"tm_Action_BottomRight_B1" visibility = hidden
[enderHopsSoB]
"gblS_Brewery_Top_3" visibility = hidden
[Ender_warning_Text]
"gblVScriptFlow" value = 21
"gblS_Inter_Script" value = "ended: Hops_7_Hop_Warning_Text"
if vB_Testing == true
sleep 4001
endif
clear
"sw_Running_Hop_7" state = false
stop  "Hops_7_Hop_Warning_Text"
```

## 121. Hops_8_Hop_Text_Mash

Starts by itself: No · User can start or stop it: Yes · 178 lines

```text
//Hops_8_Hop_Text_Mash
//Version: 261002_15:30
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//02/27/2024 18:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_Hops_Mash" value = "x"
if "sw_Flow_Mash_Hops" state == false
goto "SkipMashHop"
endif
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "On Top Of MASH Hops Texts. There are Hops to be dropped at the On Top Of MASH.  This populates the text fields for later durning the Brew."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "On Top Of MASH"
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
new string vS_Hop1_Group0
new string vS_Hop_Msg_1
new string vS_Hop_Msg_2
new string vS_Hop_Msg_3
new string vS_Hop_Msg_4
new string vS_Hop_Msg_TTL
vS_Hop1_Group0 = "x"
//Hop1 Group On Top Of MASH
if "gblV_Hop1_Group_R1" value == -333
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif 
//Hop2 Group On Top Of MASH
if "gblV_Hop2_Group_R1" value == -333
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop2_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop2_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
//.............................................
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop3 Group On Top Of MASH
if "gblV_Hop3_Group_R1" value == -333
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop3_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop3_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop4 Group On Top Of MASH
if "gblV_Hop4_Group_R1" value == -333
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop4_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop4_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop5 Group On Top Of MASH
if "gblV_Hop5_Group_R1" value == -333
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop5_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop5_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop6 Group On Top Of MASH
if "gblV_Hop6_Group_R1" value == -333
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop6_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop6_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
endif
endif
//Hop7 Group On Top Of MASH
if "gblV_Hop7_Group_R1" value == -333
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop7_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop7_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop8 Group On Top Of MASH
if "gblV_Hop8_Group_R1" value == -333
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop8_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop8_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif 
[ExitHopGroup0]
"gblS_Hops_Mash" value = vS_Hop1_Group0 
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
"gblVScriptFlow" value =  1
if "gblS_Hops_Mash" value != "x"
"gblV_Group_Hops_Mash"  value = 1
else
"gblV_Group_Hops_Mash"  value = 0
"gblS_Hops_Mash" value = " "
endif
[SkipMashHop]
"gblS_Inter_Script" value = "ended: Hops_8_Hop_Text_Mash"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value = 9
stop "Hops_8_Hop_Text_Mash"
```

## 122. Hops_9_Hop_Text_1st_Wort

Starts by itself: No · User can start or stop it: Yes · 179 lines

```text
//Hops_9_Hop_Text_1st_Wort
//Version: 261002_16:08
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_FirstWort" value = "x"
if "sw_Status_Hops_1st" state == false
goto "Skip1Wort"
endif
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "First Wort Hops Texts.  There are Hops to be dropped at the First Run.  This populates the text fields for later durning the Brew."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "First Wort Hops"
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
new string vS_Hop1_Group0
new string vS_Hop_Msg_1
new string vS_Hop_Msg_2
new string vS_Hop_Msg_3
new string vS_Hop_Msg_4
new string vS_Hop_Msg_TTL
vS_Hop1_Group0 = "x"
//Hop1 Group First Wort Hops
if "gblV_Hop1_Group_R1" value == -444
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif
//Hop2 Group First Wort Hops
if "gblV_Hop2_Group_R1" value == -444
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop2_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop2_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
endif
endif
//Hop3 Group First Wort Hops
if "gblV_Hop3_Group_R1" value == -444
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop3_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop3_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop4 Group First Wort Hops
if "gblV_Hop4_Group_R1" value == -444
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop4_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop4_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop5 Group First Wort Hops
if "gblV_Hop5_Group_R1" value == -444
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop5_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop5_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop6 Group First Wort Hops
if "gblV_Hop6_Group_R1" value == -444
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop6_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop6_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop7 Group First Wort Hops
if "gblV_Hop7_Group_R1" value == -444
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop7_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop7_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop8 Group First Wort Hops
if "gblV_Hop8_Group_R1" value == -444
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop8_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop8_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
[ExitHopGroup0]
"gblS_FirstWort" value = vS_Hop1_Group0
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
"gblVScriptFlow" value =  1
if "gblS_FirstWort" value != "x"
"gblV_Group_FirstWort"  value = 1
else
"gblV_Group_FirstWort"  value = 0
"gblS_FirstWort" value = " "
endif
[Skip1Wort]
"gblVScriptFlow" value = 10
"sw_Running_Script_C" state  = false
"gblS_Inter_Script" value = "ended: Hops_9_Hop_Text_1st_Wort"
if vB_Testing == true
sleep 4001
endif
clear
stop "Hops_9_Hop_Text_1st_Wort"
```

## 123. Hops_10_Hop_Text_SOB

Starts by itself: No · User can start or stop it: Yes · 176 lines

```text
//Hops_10_Hop_Text_SOB
//Version: 261002_20:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_HopGroup_0" value = "x"
if "sw_Status_Hops_SOB" state == false
goto "SkipSOB"
endif
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Start of Boil Hops Texts.  There are Hops to be dropped at the Start of Boil.   This populates the text fields for later durning the Boil."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Start of Boil"
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
new string vS_Hop1_Group0
new string vS_Hop_Msg_1
new string vS_Hop_Msg_2
new string vS_Hop_Msg_3
new string vS_Hop_Msg_4
new string vS_Hop_Msg_TTL
vS_Hop1_Group0 = "x"
//Hop1 Group Start Of Boil
if "gblV_Hop1_Group_R1" value == -888
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif
//Hop2 Group Start Of Boil
if "gblV_Hop2_Group_R1" value == -888
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop2_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop2_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop3 Group Start Of Boil
if "gblV_Hop3_Group_R1" value == -888
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop3_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop3_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop4 Group Start Of Boil
if "gblV_Hop4_Group_R1" value == -888
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop4_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop4_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop5 Group Start Of Boil
if "gblV_Hop5_Group_R1" value == -888
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop5_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop5_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop6 Group Start Of Boil
if "gblV_Hop6_Group_R1" value == -888
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop6_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop6_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop7 Group Start Of Boil
if "gblV_Hop7_Group_R1" value == -888
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop7_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop7_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop8 Group Start Of Boil
if "gblV_Hop8_Group_R1" value == -888
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop8_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop8_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
[ExitHopGroupSOB]
"gblS_HopGroup_0" value = vS_Hop1_Group0
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
if "gblS_HopGroup_0" value != "x"
"gblV_Group_SoB_Hops"  value = 1
else
"gblV_Group_SoB_Hops"  value = 0
"gblS_HopGroup_0" value = " "
endif
[SkipSOB]
"gblS_Inter_Script" value = "ended: Hops_10_Hop_Text_SOB"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value = 11
stop "Hops_10_Hop_Text_SOB"
```

