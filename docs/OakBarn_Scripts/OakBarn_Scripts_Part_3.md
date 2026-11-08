# OakBarn Brewery BruControl Scripts, Part 3 of 5

> **Read only when OakBarn Brewery says so, or after asking permission** (Rule 16.8). The one standing exception: these
> Scripts are the basis for the Skynet Process Templates that are not finished yet. They are kept exactly as BruControl saved
> them (BruControl Script language, not Skynet Process code), so they are not brought up to the Skynet Rules.

Back to the [list of all Scripts](README.md).

## 48. scrBrew800

Starts by itself: No · User can start or stop it: Yes · 940 lines

```text
//scrBrew800
//08/03/2023 10:03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Modified 04/09/2024 10:50
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
"gblS_Script_Started" value = "Started: scrBrew800"
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
//.........................new string vS_Msg_Brew_8_0
new string vS_Msg_Brew_8_1
new string vS_Msg_Brew_8_2
new string vS_Msg_Brew_8_3
new string vS_Msg_Brew_8_4
new string vS_Msg_Brew_8_5
new string vS_Msg_Brew_8_0 
new value vVBrewStatus
new value vVChoice
new string vSMsg
new string vSMsg1
new time vS_TTL_Time
new value vV_Gal_to_Fill
vVChoice = "gblVScriptFlow" value
"gblVScriptFlow" value = 99
vVBrewStatus = 800
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew800]
wait "gblV_Brew_Status" value == 800
"MB_28_do_ManualAlarm_B1" state = false
"gblV_Gals_to_Fill" value = 25
"gblS_Brewery_Top_3" value = "Move 25 gallons of PBW solution from the Mash Tun to the Brew Kettle"
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
//.........................................
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value =  803
[SectionBrew801]
[SectionBrew802]
[SectionBrew803]
[SectionBrew804]
wait "gblV_Brew_Status" value == 804
"gblV_Water_Switch_Status_Water" value = 604
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblV_Brew_Status" value =  808
[SectionBrew805]
[SectionBrew806]
[SectionBrew807]
[SectionBrew808]
wait "gblV_Brew_Status" value == 808
"gblS_Brewery_Top_3" value = "Manifold set to transfer PBW solution to the Brew Kettle"
"gblS_swAllSwitch_Label_Text" value = "Transfer PBW?"
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"tmTopRight_B1"  visibility = hidden
[SectionBrew809]
wait "gblV_Brew_Status" value == 809
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
start "scrWater_Measure_T0_Vessel"
wait "gblV_Water_Flow_Wo1" value == 96
"gblV_Brew_Status" value =  812
[SectionBrew810]
[SectionBrew811]
[SectionBrew812]
vV_Gal_to_Fill = "gblV_Gals_to_Fill" value
vS_TTL_Time = "gblT_SetTimer_Water" value 
print 79
vSMsg = "The Brew Kettle is filling for " 
vSMsg1 = vS_TTL_Time
print 82
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".   Wait! Will Auto Advance.  You may OverRide."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
vSMsg = "The Brew Kettle will be Topped Off with "
vSMsg1 = vV_Gal_to_Fill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons of PBW Solution."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Overide?"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//........................................
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_Overide" visibility = visible
stop "tmBottomRight_B1"
"tmBottomRight_B1" value = vS_TTL_Time
"tmBottomRight_B1" displayname = "Transfer PBW"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" visibility = visible
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"MB_33_do_BluePump_B1" state = true
start "tmBottomRight_B1"
[Loop812]
sleep 100
if vB_Testing == true
//Hidden Time 05 seconds..............................
stop "tm_Hidden_1"
"tm_Hidden_1" type = countdown
"tm_Hidden_1" value = 00:00:10
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
//...................................
"tm_Water_Up" value = "gblT_SetTimer_Water" value
"tmBottomRight_B1" value = "gblT_SetTimer_Water" value
"tmRadiator_B1" value = "gblT_SetTimer_Water" value
"tmRadiator_B1" value = "gblT_SetTimer_Water" value
"tm_Water" value = 00:00:00
stop  "tmRadiator_B1"
stop "tmBottomRight_B1"
"gblS_Brewery_Top_3" value = "Wait!  Will Auto Advance."
"gblS_swAllSwitch_Label_Text" value = "Wait!"
"gblS_Brewery_Bottom_3" value = "Wait.  Things are going on in the background.  This may take as long as a minute."
"sw_Advance_Overide" visibility = hidden
goto "Exit_Loop_724"
endif
if  "gblV_Brew_Status" value == 813
"sw_Advance_Overide" visibility = hidden
"tm_Water" value = 00:00:00
goto "Exit_Loop_724"
endif
if  "gblV_Water_Flow_Wo1" value == 97
"sw_Advance_Overide" visibility = hidden
goto "Exit_Loop_724"
endif
goto Loop_724
[Exit_Loop_724]
"gblS_Brewery_Top_3" value = "Wait!  Will Auto Advance."
"sw_Advance_Overide" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait!"
"gblS_Brewery_Bottom_3" value = "Wait.  Things are going on in the background.  This may take as long as a minute."
stop  "tmRadiator_B1"
stop "tmBottomRight_B1"
"gblV_Brew_Status" value =  814
[SectionBrew813]
[SectionBrew814]
wait "gblV_Brew_Status" value == 814
"VGC_41_do_BrewKettleIsolation_On_B1" state = false
"MB_33_do_BluePump_B1" state = false
stop "tmBottomRight_B1"
"gblV_Brew_Status" value =  816
[SectionBrew815]
[SectionBrew816]
wait "gblV_Brew_Status" value == 816
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Top_3" value = "Check Hoses to Recycle from the Plate Chiller Brew Kettle.  This is likely already set but just insurance."
"gblS_swAllSwitch_Label_Text" value = "Hoses Checked?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"tmTopRight_B1"  visibility = hidden
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
"gblV_Brew_Status" value =  819
[SectionBrew817]
[SectionBrew818]
[SectionBrew819]
[SectionBrew820]
wait "gblV_Brew_Status" value == 820
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
"gblS_Brewery_Top_3" value = "Set Manifold to Recycle from the Plate Chiller Brew Kettle.  HERMs Recycle will continue."
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew821]
"gblV_Brew_Status" value =  821
[SectionBrew822]
wait "gblV_Brew_Status" value == 822
"gblV_Water_Switch_Status_Water" value = 902
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblV_Water_Switch_Status_Water" value = 298
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblS_BrewName_B1" value = "HERMs and Plate Chiller Cleaning"
"gblV_Brew_Status" value =  824
[SectionBrew823]
[SectionBrew824]
wait "gblV_Brew_Status" value == 824
"MB_28_do_ManualAlarm_B1" state = false
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//........................................
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" VALUE = "Wait"
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_4" value = "Both the HERMs Coil and the Plate Chiller should cycle for one hour minimum.  You cannot OverRide."
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = visible
"tmBottomRight_B1" value = "tm_HopTimer_WO1" value
"tmBottomRight_B1" type = countup
"tmBottomRight_B1" displayname = "Recycle MASH HERMs PBW"
"tmBottomRight_B1" visibility = visible
"tmTopRight_B1" value = 00:00:00
"tmTopRight_B1" type = countup
"tmTopRight_B1" displayname = "Recycle Plate Chiller"
"tmTopRight_B1" visibility = visible
start "tmTopRight_B1"
start "tmBottomRight_B1"
"MB_36_do_RedPump_B1" state = true
"MB_33_do_BluePump_B1" state = true
"gblS_Brewery_Bottom_3" value = "Both the HERMs Coil and the Plate Chiller are cleaning with PBW. Wait! Insure that all Valves are set and Red and Blue Pumps are ON. You cannot OverRide. Will Auto Advance."
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance."
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_Brewery_Bottom_4" visibility = hidden
if vB_Testing == true
wait "tmTopRight_B1" value >= 00:00:05
print 296
new time vT_Delta
print 298
vT_Delta = "tm_HopTimer_WO1" value - "tmTopRight_B1" value
print 300
"tmTopRight_B1" value = 00:02:58
print 302
"tm_HopTimer_WO1" value = "tm_HopTimer_WO1" value + vT_Delta 
print 304
endif
wait "tmTopRight_B1" value >= 00:03:00
"gblS_Brewery_Bottom_4" value = "Both the HERMs Coil and the Plate Chiller are cleaning with PBW for one Hour Minimum. Wait! You cannot OverRide.  Will Auto Advance."
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblT_SetTimer" value = 00:03:55
if vB_Testing == true
wait "tmTopRight_B1" value >= 00:03:05
"tmTopRight_B1" value = 00:03:58
endif
wait "tmTopRight_B1" value >= 00:04:00
"gblS_Brewery_Bottom_3" value = "Both the Plate Chiller and the HERMs Coil are cleaning with PBW for one Hour Minimum. Wait! You cannot OverRide.  Will Auto Advance."
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_Brewery_Bottom_4" visibility = hidden
vVBrewStatus = 825
[SectionBrew825]
[SectionBrew826]
wait "gblV_Brew_Status" value == 826
if vB_Testing == true
wait "tmTopRight_B1" value >= 00:04:05
"tmTopRight_B1" value = 00:59:55
endif
"gblT_SetTimer" value = 00:59:55
wait "tmTopRight_B1" value >= 01:00:00
"gblV_Brew_Status" value =  830
[SectionBrew827]
[SectionBrew828]
[SectionBrew829]
[SectionBrew830]
wait "gblV_Brew_Status" value == 830
"gblS_Brewery_Top_3" value = "Both the HERMs Coil and Plate Chiller have been Cleaning for at least and Hour.  The next step is to move the Brew Kettle to waste prior to moving the PBW from the MLT to the Brew Kettle.  Click Proceed? to Advance."
"gblS_swAllSwitch_Label_Text" value = "Proceed?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 2
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
[SectionBrew831]
wait "gblV_Brew_Status" value == 831
"MB_36_do_RedPump_B1" state = false
"gblV_Brew_Status" value =  834
[SectionBrew832]
[SectionBrew833]
[SectionBrew834]
wait "gblV_Brew_Status" value == 834
"MB_33_do_BluePump_B1" state = false
stop "tmTopRight_B1" 
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "Set Recycle Hose to waste THEN empty the Plate Chiller and Brew Kettle?"
"gblS_swAllSwitch_Label_Text" value = "Hose to Waste?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
"gblV_Brew_Status" value =  834
[SectionBrew835]
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
[SectionBrew836]
"gblV_Brew_Status" value =  837
[SectionBrew837]
wait "gblV_Brew_Status" value == 837
"gblS_Brewery_Top_3" value = "Recycle Hose should be to waste or aanother vessel to clean.  Turn on Red Pump to empty the Plate Chiller and Brew Kettle to waste?  You will need to watch for the flow to stop. Remember the Wall Red Pump Switch is your friend."
"gblS_swAllSwitch_Label_Text" value = "Red Pump?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value =  839
[SectionBrew838]
[SectionBrew839]
[SectionBrew840]
wait "gblV_Brew_Status" value == 840
"MB_36_do_RedPump_B1" state = true
"gblS_Brewery_Top_3" value = "Getting rid of Brew Kettle waste.  Watch for the waste flow to stop.  Click Waste Done? when the Brew Kettle is empty."
"gblS_swAllSwitch_Label_Text" value = "Waste Done?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value =  840
[SectionBrew841]
wait "gblV_Brew_Status" value == 841
"MB_36_do_RedPump_B1" state = false
"gblV_Brew_Status" value =  842
[SectionBrew842]
wait "gblV_Brew_Status" value == 842
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "Set Recycle Hose back to the Brew Kettle?  Make sure the wall Red Pump switch is on as well."
"gblS_swAllSwitch_Label_Text" value = "Hose to Brew Kettle?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
[SectionBrew843]
wait "gblV_Brew_Status" value == 843
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
"gblV_Brew_Status" value =  846
[SectionBrew844]
[SectionBrew845]
[SectionBrew846]
wait "gblV_Brew_Status" value == 846
"MB_33_do_BluePump_B1" state = false
stop "tmBottomRight_B1" visibility 
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_3" value = "Set Manifold to transfer PBW from MLT to Brew Kettle. You will empty the MLT to the Brew Kettle."
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
[SectionBrew847]
wait "gblV_Brew_Status" value == 847
 vVBrewStatus = 848
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew848]
wait "gblV_Brew_Status" value == 848
"gblV_Water_Switch_Status_Water" value = 3
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew849]
wait "gblV_Brew_Status" value == 849
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew850]
wait "gblV_Brew_Status" value == 850
"gblS_Brewery_Top_3" value = "Turn on the Blue Pump?  This will start the transfer of the PBW from the MLT to the Brew Kettle."
"gblS_swAllSwitch_Label_Text" value = "Blue Pump?"
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Top_3" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew851]
wait "gblV_Brew_Status" value == 851
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"MB_33_do_BluePump_B1" state = true
vVBrewStatus = 852
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew852]
wait "gblV_Brew_Status" value == 852
vS_Msg_Brew_8_0 = "The PBW is flowing from the MLT to the Brew Kettle.   When timer reaches  "
vS_Msg_Brew_8_1 = "some time"
vS_Msg_Brew_8_0 = vS_Msg_Brew_8_0  + vS_Msg_Brew_8_1
vS_Msg_Brew_8_2 = " an Alarm will sound.  The timer will continue to countup.  Watch to see when the PBW is all transferred from the MLT.  The Wall Blue Pump switch is your friend."
vS_Msg_Brew_8_0 = vS_Msg_Brew_8_0  + vS_Msg_Brew_8_2
"gblS_Brewery_Bottom_4" value = vS_Msg_Brew_8_0  
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"sw_Advance_ BrewStatus" visibility = Hidden
"gblS_swAllSwitch_Label_Text" value = "Wait for Alarm"
"gblS_swAllSwitch_Label_Text" background = 3
"tmTopRight_B1" displayname = "Transfer PBW"
"tmTopRight_B1" type = countup
"tmTopRight_B1" value = 00:00:00
"tmTopRight_B1" visibility = visible
start "tmTopRight_B1"
new time vTPBW 
print 1
vTPBW = 00:05:00
[innerloopxPBW1]
print "inner loop"
if "tmTopRight_B1" value >= vTPBW 
goto "AlarmPBW"
endif
goto "innerloopxPBW1"
[AlarmPBW]
print 2
"MB_28_do_ManualAlarm_B1" state = true
"alm_Hidden1_ALARM" loop = true
"alm_Hidden1_ALARM" fileindex = 1
"alm_Hidden1_ALARM" active = true
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "Cancel Alarm"
"gblS_Brewery_Bottom_4" value = "Watch for the PBW to all be transferred."
"gblS_Brewery_Bottom_3" value = "Watch for the PBW to all be transferred."
"gblS_Brewery_Bottom_3" background = 1
"sw_Advance_ BrewStatus" visibility = visible
[innerloopxPBW2]
if "gblV_Brew_Status" value == 853
goto "SectionBrew853"
endif
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_Brewery_Bottom_3" visibility = hidden
if "gblV_Brew_Status" value == 853
goto "SectionBrew853"
endif
sleep 2500
if "gblV_Brew_Status" value == 853
goto "SectionBrew853"
endif
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_Brewery_Bottom_4" visibility = hidden
if "gblV_Brew_Status" value == 853
goto "SectionBrew853"
endif
sleep 2500
goto "innerloopxPBW2"
[SectionBrew853]
wait "gblV_Brew_Status" value == 853
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
vVBrewStatus = 854
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew854]
wait "gblV_Brew_Status" value == 854
vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew855]
wait "gblV_Brew_Status" value == 855
vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew856]
wait "gblV_Brew_Status" value == 856
vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew857]
wait "gblV_Brew_Status" value == 857
vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew858]
wait "gblV_Brew_Status" value == 858
"MB_28_do_ManualAlarm_B1" state = false
"alm_Hidden1_ALARM" active = false
vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew859]
wait "gblV_Brew_Status" value == 859
vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew860]
wait "gblV_Brew_Status" value == 860
"gblS_Brewery_Top_3" background = 2
"gblS_Brewery_Top_3" value = "Click All Transferred? when all of the PBW has been moved from the MLT to the Brew Kettle.. "
"gblS_swAllSwitch_Label_Text" value = "All Transferred?"
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Top_3"  visibility = visible
[SectionBrew861]
wait "gblV_Brew_Status" value == 861
vVBrewStatus = 862
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew862]
wait "gblV_Brew_Status" value == 862
"gblS_Brewery_Top_3" background = 1
"MB_33_do_BluePump_B1" state = false
"gblS_Brewery_Top_3" value = "Set Manifold to clean the Brew Kettle.  It will cycle between the Plate Chiller and the Tangential Inlet.  It will start with the Tangential Inet. "
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Top_3"  visibility = visible
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew863]
wait "gblV_Brew_Status" value == 863
vVBrewStatus = 864
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew864]
wait "gblV_Brew_Status" value == 864
"gblV_Water_Switch_Status_Water" value = 3
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
"gblS_BrewName_B1" value = "Brew Kettle and Plate Chiller Cleaning"
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew865]
wait "gblV_Brew_Status" value == 865
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew866]
wait "gblV_Brew_Status" value == 866
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew867]
wait "gblV_Brew_Status" value == 867
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew868]
wait "gblV_Brew_Status" value == 868
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "Manifold to clean the Brew Kettle.  Turn on the Red Pump to cycle between the Plate Chiller and the Tangential Inlet.  It will start with the Tangential Inet. "
"gblS_Brewery_Top_3"  visibility = visible
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Red Pump?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew869]
wait "gblV_Brew_Status" value == 869
 vVBrewStatus = 869
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew870]
wait "gblV_Brew_Status" value == 870
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew871]
wait "gblV_Brew_Status" value == 871
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew872]
wait "gblV_Brew_Status" value == 872
"sw_Advance_ BrewStatus" visibility = hidden
"VGC_5_do_FermentFill_On_B1" state = false
"VGC_19_do_BrewKettleTangental_On_B1" state = true 
"MB_36_do_RedPump_B1" state = true
"gblS_Brewery_Top_3" value = "Cleaning Brew Kettle  Tangential Inlet.  The next step is to add Hot Quick Rinse water from the Big Mac to the MLT.  Set Manifold to transfer Rinse Water to the MLT from the Big Mac."
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
"VGC_5_do_FermentFill_On_B1" state = false
"tmBottomRight_B1" displayname = "Clean Brew Kettle"
"tmBottomRight_B1" type = countup
"tmBottomRight_B1" value = 00:00:00
"tmBottomRight_B1" visibility = visible
"tm_HopTimer_WO1" type = countup
"tm_HopTimer_WO1" value = 00:00:00
start "tm_HopTimer_WO1"
start "tmBottomRight_B1"
"VGC_41_do_BrewKettleIsolation_On_B1" state = false
"VGC_19_do_BrewKettleTangental_On_B1" state = true
"MB_36_do_RedPump_B1" state = true
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew873]
wait "gblV_Brew_Status" value == 873
"gblV_Water_Switch_Status_Water" value = 6
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
 vVBrewStatus = 873
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew8734]
wait "gblV_Brew_Status" value == 874
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew875]
wait "gblV_Brew_Status" value == 875
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew876]
wait "gblV_Brew_Status" value == 876
"tmBottomRight_B1" displayname = "Clean Brew Kettle"
start "tmBottomRight_B1"
"tmBottomRight_B1" value = "tm_HopTimer_WO1" value
"tmBottomRight_B1" visibility = visible
"gblS_Brewery_Top_3" background = 2
"gblS_Brewery_Top_3" value = "Turn on the White Pump to transfer Rinse Water to the MLT from the Big Mac."
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "White Pump?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew877]
wait "gblV_Brew_Status" value == 877
 vVBrewStatus = 878
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew878]
wait "gblV_Brew_Status" value == 878
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew879]
wait "gblV_Brew_Status" value == 879
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew880]
wait "gblV_Brew_Status" value == 880
"sw_Control_BigMac_Element" state = false
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "Big Mac Heaters off.  Transferring Quick Rinse Water to the MLT from the Big Mac.  This will last for 1 minute."
"tmBottomRight_B1" displayname = "Transfer Quick Rinse"
"tm_HopTimer_WO1" value = "tmBottomRight_B1" value
stop "tmBottomRight_B1"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" value = 00:01:00
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"VGC_34_do_BigMac_Isolation_On_B1" state = true
"MB_32_do_WhitePump_B1" state = true
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1" 
"MB_32_do_WhitePump_B1" state = false
"VGC_26_do_Right_MLT_Isolation_On_B1" state = false
"VGC_8_do_BluePumpValve_On_B1" state = true
"MB_33_do_BluePump_B1" state = true
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value = "Blue Pump is ON. Cyling Rinse Through the MLT and HERMs Coil for One Minute for Quick Rinse. Brew Kettle Cycling PBW."
"tmBottomRight_B1" value = 00:01:00
"tmBottomRight_B1" displayname = "Quick Rinse"
start "tmBottomRight_B1"
wait "tmBottomRight_B1" value <= 00:00:00
"MB_33_do_BluePump_B1" state = false
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew881]
wait "gblV_Brew_Status" value == 881
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew882]
wait "gblV_Brew_Status" value == 882
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew883]
wait "gblV_Brew_Status" value == 883
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew884]
wait "gblV_Brew_Status" value == 884
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "Set Hoses and Drain the Quick Rinse from the MLT and HERMS coil manually."
[SectionBrew885]
wait "gblV_Brew_Status" value == 885
 vVBrewStatus = 886
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew886]
wait "gblV_Brew_Status" value == 886
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew887]
wait "gblV_Brew_Status" value == 887
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew888]
wait "gblV_Brew_Status" value == 888
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew889]
wait "gblV_Brew_Status" value == 889
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew890]
wait "gblV_Brew_Status" value == 890
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Drain Complete?"
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "Reset the MLT Hoses to recycle Rinse through the MLT and HERMs coil.  The Quick Rinse water should have been drained."
[SectionBrew891]
wait "gblV_Brew_Status" value == 891
 vVBrewStatus = 892
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew892]
wait "gblV_Brew_Status" value == 892
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew893]
wait "gblV_Brew_Status" value == 893
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew894]
wait "gblV_Brew_Status" value == 894
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
"gblS_swAllSwitch_Label_Text" value = "White Pump?"
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "Turn on the White Pump to transfer the Rinse water from The Big Mac to the MLT via the HERMs coil."
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_4" value = "Hoses should be reset to Recycle through the MLT!"
"gblS_Brewery_Bottom_4" visibility = visible
[SectionBrew895]
wait "gblV_Brew_Status" value == 895
 vVBrewStatus = 896
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew896]
wait "gblV_Brew_Status" value == 896
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew897]
wait "gblV_Brew_Status" value == 897
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew898]
wait "gblV_Brew_Status" value == 898
"gblS_Brewery_Bottom_4" visibility = hidden
"tmBottomRight_B1" displayname = "Transfer Rinse"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" value = 00:08:00
"tm_Hidden_1" value = 00:00:00
"tm_Hidden_1" type = countup
start "tm_Hidden_1"
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"VGC_34_do_BigMac_Isolation_On_B1" state = true
"MB_32_do_WhitePump_B1" state = true
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value = "Transferring Rinse from the Big Mac to the MLT.   After 4:30 remaining, you may OverRide."
//....................................................
sleep 5000
"tmBottomRight_B1" value = 00:04:35
wait "tmBottomRight_B1" value <= 00:04:30
"tm_Hidden_1" value = "tmBottomRight_B1" value
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"VGC_5_do_FermentFill_On_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"gblS_Brewery_Bottom_4" value = "Brew Kettle Cycling through the Plate Chiller.  Transferring Rinse from Big Mac to MLT."
"gblS_Brewery_Top_3" value = "Transferring Rinse from the Big Mac to the MLT.   You may OverRide."
"gblS_Brewery_Bottom_4"  background = 2
"gblS_Brewery_Bottom_4"  visibility = visible
"gblS_swAllSwitch_Label_Text" value = "OverRide?"
"sw_Advance_ BrewStatus" visibility = visible
[InnerLoop898]
if "tmBottomRight_B1" value <= 00:00:00
 vVBrewStatus = 899
"gblV_Brew_Status" value = vVBrewStatus
goto "SectionBrew899"
endif 
if "gblV_Brew_Status" value ==  899
 vVBrewStatus = 899
goto "SectionBrew899"
endif 
goto "InnerLoop898"
//....................................................
[SectionBrew899]
wait "gblV_Brew_Status" value == 899
 vVBrewStatus = 900
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew900]
wait "gblV_Brew_Status" value == 900
new time vTx
vtx = "tm_HopTimer_WO1" value + "tm_Hidden_1" value
stop "tmBottomRight_B1" 
"MB_32_do_WhitePump_B1" state = false
"VGC_26_do_Right_MLT_Isolation_On_B1" state = false
"tmBottomRight_B1" value = vTx
"tmBottomRight_B1" displayname = "Clean Brew Kettle"
"tmBottomRight_B1" type = countup
start "tmBottomRight_B1"
"gblS_Brewery_Top_3" value = "Transfer Complete. Cycling.  Wait! Will Auto Advance."
"gblS_Brewery_Bottom_4" value = "Rinse Water transferred.  Blue Pump On.  Brew Kettle Cycling through the Plate Chiller.  MLT and HERMs Coil cycling Rinse Water. "
"VGC_8_do_BluePumpValve_On_B1" state = true
"MB_33_do_BluePump_B1" state = true
"tmBottomRight_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"sw_Advance_ BrewStatus" visibility = hidden
clear 
sleep 1000
"gblS_Script_Ended" value = "Ended: scrBrew800"
start "scrBrew900"
stop "scrBrew800"
```

## 49. scrBrew900

Starts by itself: No · User can start or stop it: Yes · 732 lines

```text
//scrBrew900
//04/16/2024 12:52
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
"gblS_Script_Started" value = "Started: scrBrew900"
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
//.........................new string vS_Msg_Brew_9_0
new string vS_Msg_Brew_9_1
new string vS_Msg_Brew_9_2
new string vS_Msg_Brew_9_3
new string vS_Msg_Brew_9_4
new string vS_Msg_Brew_9_5
new value vVBrewStatus

goto "RealStart"
new time vTx
vTx = 00:08:35
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Top_3"  background = 3
"tmBottomRight_B1" value = vTx
"tmBottomRight_B1" displayname = "Clean Brew Kettle"
"tmBottomRight_B1" type = countup
start "tmBottomRight_B1"
"gblS_Brewery_Top_3" value = "Transfer Complete. Cycling.  Wait! Will Auto Advance."
"gblS_Brewery_Bottom_4" value = "Rinse Water transferred.  Blue Pump On.  Brew Kettle Cycling through the Plate Chiller.  MLT and HERMs Coil cycling Rinse Water. "
"VGC_8_do_BluePumpValve_On_B1" state = true
"VGC_13_do_HermsWort_On_B1" state = true
"MB_33_do_BluePump_B1" state = true
"tmBottomRight_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"sw_Advance_ BrewStatus" visibility = hidden
clear 
sleep 1000
//..................................................
//..................................................
[RealStart]
vVBrewStatus = 901
"gblV_Brew_Status" value = vVBrewStatus
goto "SectionBrew901"
[SectionBrew901]
wait "gblV_Brew_Status" value == 901
if "sw_Status_2ndBatchYN" state == true
clear
start "scrBrew900_2"
stop "scrBrew900"
endif
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew902]
wait "gblV_Brew_Status" value == 902
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew903]
wait "gblV_Brew_Status" value == 903
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew904]
wait "gblV_Brew_Status" value == 904
"gblS_BrewName_B1" value = "Cleaning"
//....................................................
sleep 3000
"tmBottomRight_B1" value = 00:09:55
wait "tmBottomRight_B1" value >= 00:10:00
"gblS_Brewery_Top_3" value = "Cycling! Will continue to 12:00 when it will allow PBW through the Little Mac Isolation Valve and Manual Valve (Hose should be in the Brew Kettle!)."
"VGC_19_do_BrewKettleTangental_On_B1" state = true
"VGC_41_do_BrewKettleIsolation_On_B1" state = false
"gblS_Brewery_Bottom_4" value = "Brew Kettle Cycling through the Tangential Inlet.  MLT Cycling Rinse."
//....................................................
sleep 3000
"tmBottomRight_B1" value = 00:11:55
wait "tmBottomRight_B1" value >= 00:12:00
"gblS_Brewery_Top_3" value = "Cycling!  The Little Mac Isolation valve is open.  A Hose should be from the Manual Valve and the Brew Kettle.  Will continue to 16:00 when it will allow PBW through the Plate Chiller again."
"VGC_17_do_LittleMacIsolation_On_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"VGC_41_do_BrewKettleIsolation_On_B1" state = false
"gblS_Brewery_Bottom_4" value = "Brew Kettle Cycling through the Little Mac Isolation.  MLT Cycling Rinse."

 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew905]
wait "gblV_Brew_Status" value == 905
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew906]
wait "gblV_Brew_Status" value == 906
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew907]
wait "gblV_Brew_Status" value == 907
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew908]
wait "gblV_Brew_Status" value == 908
//....................................................
sleep 3000
"tmBottomRight_B1" value = 00:15:55
wait "tmBottomRight_B1" value >= 00:16:00
"VGC_17_do_LittleMacIsolation_On_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = true
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"gblS_Brewery_Bottom_4" value = "Brew Kettle Cycling through the Tangential Inlet, Plate Chiller and Little Mac Isolation.  MLT Cycling Rinse."
"gblS_Brewery_Top_3" value = "Cycling! Will continue to 18:00.  Wait!  Will Auto Advance."
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew909]
wait "gblV_Brew_Status" value == 909
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew910]
wait "gblV_Brew_Status" value == 910
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew911]
wait "gblV_Brew_Status" value == 911
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew912]
wait "gblV_Brew_Status" value == 912
//....................................................
sleep 3000
"tmBottomRight_B1" value = 00:17:55
wait "tmBottomRight_B1" value >= 00:18:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"MB_36_do_RedPump_B1" state = false
"VGC_17_do_LittleMacIsolation_On_B1" state = false
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
"gblS_Brewery_Bottom_4" value = "Red Pump is off.  Set manifold to drain the PBW.  You can decide where you are going to put the PBW.  Clean Kegs?  Clean Fermentors?  Waste?  It is your Choice."
"gblS_Brewery_Top_3" value = "Move the Hose from the Plate Chiller to the Brew Kettle where you want it.  Also move the Hose on the Manual valve of the Little Mac manifold to waste (Little Mac Isolation valve is closed).  Click Hoses Set? to Turn on the Red Pump."
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
"sw_Advance_ BrewStatus" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
[SectionBrew913]
wait "gblV_Brew_Status" value == 913
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
 vVBrewStatus = 914
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew914]
wait "gblV_Brew_Status" value == 914
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew915]
wait "gblV_Brew_Status" value == 915
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew916]
wait "gblV_Brew_Status" value == 916
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
"gblS_Brewery_Top_3" value = "Turn on the Red Pump.  If filling vessels, use the Red Pump Wall switch to control the Flow."
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Red Pump?"
"sw_Advance_ BrewStatus" visibility = visible
vVBrewStatus = 917
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew917]
wait "gblV_Brew_Status" value == 917
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew918]
wait "gblV_Brew_Status" value == 918
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew919]
wait "gblV_Brew_Status" value == 919
 vVBrewStatus = 920
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew920]
wait "gblV_Brew_Status" value == 920
"MB_36_do_RedPump_B1" state = true 
"gblS_Brewery_Top_3" value = "Draining the PBW from the Brew Kettle.  Use the Red Pump Wall switch if transferring to vessels.  Click PBW Drained? when done."
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "PBW Drained?"
"sw_Advance_ BrewStatus" visibility = visible
"gblS_Brewery_Bottom_4" visibility = hidden
[SectionBrew921]
wait "gblV_Brew_Status" value == 921
 vVBrewStatus = 922
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew922]
wait "gblV_Brew_Status" value == 922
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew923]
wait "gblV_Brew_Status" value == 923
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew924]
wait "gblV_Brew_Status" value == 924
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
"gblS_Brewery_Top_3" value = "Reset the Hose to the Brew Kettle.  We will shortly do a Quick Rinse of the Brew Kettle.  Make sure the Little Mac manifold Manual valve is to waste and open.  We will flush that first."
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Hoses Reset?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew925]
wait "gblV_Brew_Status" value == 925
vVBrewStatus = 926
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew926]
wait "gblV_Brew_Status" value == 926
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew927]
wait "gblV_Brew_Status" value == 927
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew928]
wait "gblV_Brew_Status" value == 928
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew929]
wait "gblV_Brew_Status" value == 929
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew930]
wait "gblV_Brew_Status" value == 930
"gblS_Brewery_Top_3" value = "Set Manifold to transfer a Quick Rinse from the MLT to the Brew Kettle."
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew931]
wait "gblV_Brew_Status" value == 931
 vVBrewStatus = 932
"MB_33_do_BluePump_B1" state = false
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew932]
wait "gblV_Brew_Status" value == 932
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew933]
wait "gblV_Brew_Status" value == 933
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew934]
wait "gblV_Brew_Status" value == 934
"gblV_Water_Switch_Status_Water" value = 3
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
"gblS_Brewery_Top_3" value = "Mainfold set to transfer Rinse Water to the Brew Kettle from the MLT.  Turn on the Blue Pump to start the transfer. The Little Mac Isolation Valve will be flushed then there will be a 1 Minute transfer."
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"sw_Advance_ BrewStatus" visibility = visible
"VGC_13_do_HermsWort_On_B1" state = true
"gblS_swAllSwitch_Label_Text" value = "Blue Pump?"
[SectionBrew935]
wait "gblV_Brew_Status" value == 935
 vVBrewStatus = 936
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew936]
wait "gblV_Brew_Status" value == 936
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew937]
wait "gblV_Brew_Status" value == 937
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew938]
wait "gblV_Brew_Status" value == 938
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"sw_Advance_ BrewStatus" visibility = hidden
"tmBottomRight_B1" displayname = "Flushing"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" value = 00:00:20
"tmBottomRight_B1" visibility = visible
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"VGC_17_do_LittleMacIsolation_On_B1" state = true
"VGC_5_do_FermentFill_On_B1" state = false
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"VGC_3_do_RedPumpValve_On_B1" state = false
"VGC_13_do_HermsWort_On_B1" state = false
"MB_33_do_BluePump_B1" state = true
start "tmBottomRight_B1"
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value = "Flushing Little Mac Manifold for 20 seconds.  Wait! Will Auto Advance."
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1" 
"tmBottomRight_B1" value = 00:01:00
"tmBottomRight_B1" displayname = "Transfer Rinse"
"VGC_5_do_FermentFill_On_B1" state = true
"VGC_3_do_RedPumpValve_On_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = true
"VGC_17_do_LittleMacIsolation_On_B1" state = false
"VGC_13_do_HermsWort_On_B1" state = false
start "tmBottomRight_B1"
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "Moving Quick Rinse from MLT to the Brew Kettle. 1 minute transfer.  Wait! Will Auto Advance."
"MB_33_do_BluePump_B1" state = true
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"VGC_5_do_FermentFill_On_B1" state = true
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"sw_Advance_ BrewStatus" visibility = hidden
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"VGC_13_do_HermsWort_On_B1" state = true
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
"tmBottomRight_B1" displayname = "Quick Rinse BK"
"tmBottomRight_B1" value = 00:01:00
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value = " Quick Rinse of Brew Kettle for 1 minute.  Wait! Will Auto Advance."
"MB_36_do_RedPump_B1" state = true
start "tmBottomRight_B1"
wait "tmBottomRight_B1" value <= 00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"MB_36_do_RedPump_B1" state = false
"gblS_BrewName_B1" value = "Cleaning"
vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew939]
wait "gblV_Brew_Status" value == 939
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew940]
wait "gblV_Brew_Status" value == 940
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "Set Hose to waste to drain the Quick Rinse water."
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
"sw_Advance_ BrewStatus" visibility = visible
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
[SectionBrew941]
wait "gblV_Brew_Status" value == 941
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
 vVBrewStatus = 942
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew942]
wait "gblV_Brew_Status" value == 942
"gblS_Brewery_Top_3" value = "Turn on the Red Pump to drain the Quick Rinse to waste.  You will need to monitor the flow and stop when the water is gone."
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Red Pump?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew943]
wait "gblV_Brew_Status" value == 943
 vVBrewStatus = 944
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew944]
wait "gblV_Brew_Status" value == 944
"MB_36_do_RedPump_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"VGC_17_do_LittleMacIsolation_On_B1" state = true
"gblS_Brewery_Top_3" value = "Turn Off the Red Pump once the Quick Rinse water has drainned from the Brew Kettle.  Click All Drained? when ready."
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "All Drained"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew945]
wait "gblV_Brew_Status" value == 945
 vVBrewStatus = 946
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew946]
wait "gblV_Brew_Status" value == 946
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew947]
wait "gblV_Brew_Status" value == 947
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew948]
wait "gblV_Brew_Status" value == 948
"MB_36_do_RedPump_B1" state = false
"VGC_17_do_LittleMacIsolation_On_B1" state = false
"gblS_Brewery_Top_3" value = "Reset the Hose back to the Brew Kettle. Little Mac Isolation Valve is closed.  Click Hose Set? when ready."
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Hose Set?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew949]
wait "gblV_Brew_Status" value == 949
 vVBrewStatus = 950
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew950]
wait "gblV_Brew_Status" value == 950
"gblS_Brewery_Top_3" value = "Turn on the Blue Pump to transfer the Rinse Water from the MLT to the Brew Kettle.  Click Blue Pump? when ready."
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Blue Pump?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew951]
wait "gblV_Brew_Status" value == 951
 vVBrewStatus = 952
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew952]
wait "gblV_Brew_Status" value == 952
"VGC_7_do_Left_MLT_Isolation_On_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = true
"VGC_13_do_HermsWort_On_B1" state = false
"MB_33_do_BluePump_B1" state = true
"tmBottomRight_B1" displayname = "Transfer Rinse"
"tmBottomRight_B1" type = countdown
"tmBottomRight_B1" value = 00:08:00
"tmBottomRight_B1" visibility = visible
"gblS_Brewery_Top_3" background = 2
"gblS_Brewery_Top_3" value = "Transferring the Rinse Water from the MLT to the Brew Kettle.  The transfer will last for 8 minutes.  After 4:00 minutes you will be able to OverRide."
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"sw_Advance_ BrewStatus" visibility = hidden
start "tmBottomRight_B1"
wait "tmBottomRight_B1" value <= 00:04:00
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value = "Transferring the Rinse Water from the MLT to the Brew Kettle.  The transfer will last for another 4 minutes.  You may to OverRide."
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "OverRide?"
"sw_Advance_ BrewStatus" visibility = visible
[InnerLoop952]
if "gblV_Brew_Status" value == 953 
vVBrewStatus = 953
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
goto "SectionBrew953"
endif
if "tmBottomRight_B1" value <= 00:00:00
vVBrewStatus = 953
"gblV_Brew_Status" value = vVBrewStatus
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
goto "SectionBrew953"
endif
goto "InnerLoop952"
[SectionBrew953]
wait "gblV_Brew_Status" value == 953
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew954]
wait "gblV_Brew_Status" value == 954
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew955]
wait "gblV_Brew_Status" value == 955
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew956]
wait "gblV_Brew_Status" value == 956
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
"MB_33_do_BluePump_B1" state = false
"MB_36_do_RedPump_B1"  state = true
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value = "Cycling Rinse Water in the Brew Kettle and Plate Chiller.  After 5 minutes, you will be able to set the Hoses to drain.  Wait! Will Auto Advance."
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"sw_Advance_ BrewStatus" visibility = hidden
stop "tmBottomRight_B1"
"tmBottomRight_B1" displayname = "Cycling Rinse"
"tmBottomRight_B1" type = countup
"tmBottomRight_B1" value = 00:00:00
"tmBottomRight_B1" visibility = visible
start "tmBottomRight_B1"
wait "tmBottomRight_B1" value >= 00:05:00
"gblS_Brewery_Top_3" background = 2
"gblS_Brewery_Top_3" value = "Cycling Rinse Water in the Brew Kettle and Plate Chiller.  Set the Hoses to Drain?.  "
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Hoses to Drain?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew957]
wait "gblV_Brew_Status" value == 957
 vVBrewStatus = 958
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew58]
wait "gblV_Brew_Status" value == 958
"gblS_Brewery_Top_3" background = 1
"MB_36_do_RedPump_B1" state = false
"gblS_Brewery_Top_3" value = "Red Pump is off.  Turn on the Red Pump when the hoses are set to drain. "
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Red Pump?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew959]
wait "gblV_Brew_Status" value == 959
 vVBrewStatus = 960
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew960]
wait "gblV_Brew_Status" value == 960
"VGC_17_do_LittleMacIsolation_On_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"MB_36_do_RedPump_B1" state = true
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_4" value = "Click Rinse Drained? to advance once all the Rinse Water has drained from the Brew Kettle."
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Rinse Drained?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew961]
wait "gblV_Brew_Status" value == 961
 vVBrewStatus = 962
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew962]
wait "gblV_Brew_Status" value == 962
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew963]
wait "gblV_Brew_Status" value == 963
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew964]
wait "gblV_Brew_Status" value == 964
"VGC_17_do_LittleMacIsolation_On_B1" state = false
"VGC_19_do_BrewKettleTangental_On_B1" state = true
"MB_36_do_RedPump_B1" state = false
"gblS_Brewery_Bottom_4" value = "Auto Cleaning is complete.  You can now manually clean any vessels that needs a little.  You can use the FireHose and tap water for additional flushing.  How much is up to you.  Click Manual CleanUp Finished? to advance."
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Manual CleanUp Finished?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew965]
wait "gblV_Brew_Status" value == 965
 vVBrewStatus = 966
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew966]
wait "gblV_Brew_Status" value == 966
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew967]
wait "gblV_Brew_Status" value == 967
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew968]
wait "gblV_Brew_Status" value == 968
"gblS_Brewery_Bottom_4"  background = 1
"gblS_Brewery_Bottom_4" value = "All Done.  One last chance for any additional manual cleaning.  Click Open All Valves? to advance.  This will open ALL of the valves and allow the manifold to air dry."
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_Brewery_Top_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" value = "Open All Valves?"
"sw_Advance_ BrewStatus" visibility = visible
[SectionBrew969]
wait "gblV_Brew_Status" value == 969
 vVBrewStatus = 970
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew970]
wait "gblV_Brew_Status" value == 970
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew971]
wait "gblV_Brew_Status" value == 971
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew972]
wait "gblV_Brew_Status" value == 972
"gblV_Valve_Status" value = 99
start "sub_scrOpenAllValves"
wait "gblV_Valve_Status" value == 0 
"gblS_Brewery_Bottom_4"  background = 2
"gblS_Brewery_Bottom_4" value = "All Valves are Open.  Have a Pivo!."
"gblS_swAllSwitch_Label_Text" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_BrewName_B1" value = "All Done"
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew973]
wait "gblV_Brew_Status" value == 973
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew974]
wait "gblV_Brew_Status" value == 974
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew975]
wait "gblV_Brew_Status" value == 975
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew976]
wait "gblV_Brew_Status" value == 976
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew977]
wait "gblV_Brew_Status" value == 977
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew978]
wait "gblV_Brew_Status" value == 978
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew979]
wait "gblV_Brew_Status" value == 979
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew980]
wait "gblV_Brew_Status" value == 980
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew981]
wait "gblV_Brew_Status" value == 981
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew982]
wait "gblV_Brew_Status" value == 982
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew983]
wait "gblV_Brew_Status" value == 983
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew984]
wait "gblV_Brew_Status" value == 984
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew985]
wait "gblV_Brew_Status" value == 985
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew986]
wait "gblV_Brew_Status" value == 986
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew987]
wait "gblV_Brew_Status" value == 987
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew988]
wait "gblV_Brew_Status" value == 988
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew989]
wait "gblV_Brew_Status" value == 989
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew990]
wait "gblV_Brew_Status" value == 990
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew991]
wait "gblV_Brew_Status" value == 991
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew992]
wait "gblV_Brew_Status" value == 992
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew993]
wait "gblV_Brew_Status" value == 993
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew994]
wait "gblV_Brew_Status" value == 994
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew995]
wait "gblV_Brew_Status" value == 995
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew996]
wait "gblV_Brew_Status" value == 996
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew997]
wait "gblV_Brew_Status" value == 997
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew998]
wait "gblV_Brew_Status" value == 998
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew999]
wait "gblV_Brew_Status" value == 999
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew1000]
wait "gblV_Brew_Status" value == 1000
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
clear
"gblS_Script_Ended" value = "Ended: scrBrew900"
start "scrBrew900_2"
stop "scrBrew900"
```

## 50. scrBrew900_2

Starts by itself: No · User can start or stop it: Yes · 430 lines

```text
//scrBrew900_2
//08/03/2023 10:03
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
"gblS_Script_Started" value = "Started: scrBrew900_2"
 //................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
sleep 4001
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
new value vVBrewStatus
vVBrewStatus = "gblV_Brew_Status" value
[SectionBrew901]
wait "gblV_Brew_Status" value == 901
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew902]
wait "gblV_Brew_Status" value == 902
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew903]
wait "gblV_Brew_Status" value == 903
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew904]
wait "gblV_Brew_Status" value == 904
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew905]
wait "gblV_Brew_Status" value == 905
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew906]
wait "gblV_Brew_Status" value == 906
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew907]
wait "gblV_Brew_Status" value == 907
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew908]
wait "gblV_Brew_Status" value == 908
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew909]
wait "gblV_Brew_Status" value == 909
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew910]
wait "gblV_Brew_Status" value == 910
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew911]
wait "gblV_Brew_Status" value == 911
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew912]
wait "gblV_Brew_Status" value == 912
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew913]
wait "gblV_Brew_Status" value == 913
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew914]
wait "gblV_Brew_Status" value == 914
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew915]
wait "gblV_Brew_Status" value == 915
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew916]
wait "gblV_Brew_Status" value == 916
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew917]
wait "gblV_Brew_Status" value == 917
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew918]
wait "gblV_Brew_Status" value == 918
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew919]
wait "gblV_Brew_Status" value == 919
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew920]
wait "gblV_Brew_Status" value == 920
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew921]
wait "gblV_Brew_Status" value == 921
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew922]
wait "gblV_Brew_Status" value == 922
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew923]
wait "gblV_Brew_Status" value == 923
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew924]
wait "gblV_Brew_Status" value == 924
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew925]
wait "gblV_Brew_Status" value == 925
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew926]
wait "gblV_Brew_Status" value == 926
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew927]
wait "gblV_Brew_Status" value == 927
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew928]
wait "gblV_Brew_Status" value == 928
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew929]
wait "gblV_Brew_Status" value == 929
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew930]
wait "gblV_Brew_Status" value == 930
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew931]
wait "gblV_Brew_Status" value == 931
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew932]
wait "gblV_Brew_Status" value == 932
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew933]
wait "gblV_Brew_Status" value == 933
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew934]
wait "gblV_Brew_Status" value == 934
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew935]
wait "gblV_Brew_Status" value == 935
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew936]
wait "gblV_Brew_Status" value == 936
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew937]
wait "gblV_Brew_Status" value == 937
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew938]
wait "gblV_Brew_Status" value == 938
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew939]
wait "gblV_Brew_Status" value == 939
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew940]
wait "gblV_Brew_Status" value == 940
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew941]
wait "gblV_Brew_Status" value == 941
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew942]
wait "gblV_Brew_Status" value == 942
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew943]
wait "gblV_Brew_Status" value == 943
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew944]
wait "gblV_Brew_Status" value == 944
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew945]
wait "gblV_Brew_Status" value == 945
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew946]
wait "gblV_Brew_Status" value == 946
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew947]
wait "gblV_Brew_Status" value == 947
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew948]
wait "gblV_Brew_Status" value == 948
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew949]
wait "gblV_Brew_Status" value == 949
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew950]
wait "gblV_Brew_Status" value == 950
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew951]
wait "gblV_Brew_Status" value == 951
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew952]
wait "gblV_Brew_Status" value == 952
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew953]
wait "gblV_Brew_Status" value == 953
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew954]
wait "gblV_Brew_Status" value == 954
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew955]
wait "gblV_Brew_Status" value == 955
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew956]
wait "gblV_Brew_Status" value == 956
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew957]
wait "gblV_Brew_Status" value == 957
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew58]
wait "gblV_Brew_Status" value == 958
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew959]
wait "gblV_Brew_Status" value == 959
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew960]
wait "gblV_Brew_Status" value == 960
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew961]
wait "gblV_Brew_Status" value == 961
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew962]
wait "gblV_Brew_Status" value == 962
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew963]
wait "gblV_Brew_Status" value == 963
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew964]
wait "gblV_Brew_Status" value == 964
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew965]
wait "gblV_Brew_Status" value == 965
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew966]
wait "gblV_Brew_Status" value == 966
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew967]
wait "gblV_Brew_Status" value == 967
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew968]
wait "gblV_Brew_Status" value == 968
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew969]
wait "gblV_Brew_Status" value == 969
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew970]
wait "gblV_Brew_Status" value == 970
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew971]
wait "gblV_Brew_Status" value == 971
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew972]
wait "gblV_Brew_Status" value == 972
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew973]
wait "gblV_Brew_Status" value == 973
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew974]
wait "gblV_Brew_Status" value == 974
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew975]
wait "gblV_Brew_Status" value == 975
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew976]
wait "gblV_Brew_Status" value == 976
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew977]
wait "gblV_Brew_Status" value == 977
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew978]
wait "gblV_Brew_Status" value == 978
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew979]
wait "gblV_Brew_Status" value == 979
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew980]
wait "gblV_Brew_Status" value == 980
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew981]
wait "gblV_Brew_Status" value == 981
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew982]
wait "gblV_Brew_Status" value == 982
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew983]
wait "gblV_Brew_Status" value == 983
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew984]
wait "gblV_Brew_Status" value == 984
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew985]
wait "gblV_Brew_Status" value == 985
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew986]
wait "gblV_Brew_Status" value == 986
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew987]
wait "gblV_Brew_Status" value == 987
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew988]
wait "gblV_Brew_Status" value == 988
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew989]
wait "gblV_Brew_Status" value == 989
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew990]
wait "gblV_Brew_Status" value == 990
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew991]
wait "gblV_Brew_Status" value == 991
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew992]
wait "gblV_Brew_Status" value == 992
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew993]
wait "gblV_Brew_Status" value == 993
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew994]
wait "gblV_Brew_Status" value == 994
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew995]
wait "gblV_Brew_Status" value == 995
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew996]
wait "gblV_Brew_Status" value == 996
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew997]
wait "gblV_Brew_Status" value == 997
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew998]
wait "gblV_Brew_Status" value == 998
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew999]
wait "gblV_Brew_Status" value == 999
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
[SectionBrew1000]
wait "gblV_Brew_Status" value == 1000
 vVBrewStatus  += 1
"gblV_Brew_Status" value = vVBrewStatus
clear
"gblS_Script_Ended" value = "Ended: scrBrew900_2"
stop "scrBrew900_2"
```

## 51. sub_scrBrewZilla_Ready

Starts by itself: No · User can start or stop it: Yes · 179 lines

```text
//scrBrewZilla  Modified 260805 18-43
//08/05/2026
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Brewzilla Get Ready or Start
"sw_Running_Script_C" state = true
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...................................................
new string vSMsg
new string vSMsg1
new string vS_Strike_Vessel_1
new string vS_Strike_Vessel_2
new value vV_Strike_Vessel_1
new value vV_Strike_Vessel_2
new value vV_Strike_Temperature
new value vV_Strike_Temperature_Offset
new value vV_Choice
new value vV_Strike_Temperature_With_Offset

new bool vB_Brewzilla_Strike_1
new bool vB_Brewzilla_Strike_2
new bool vB_2_Strike_Vessels
new bool vB_1or2
//.................................................................................
	if "gblV_Number_Strike_Vessels" value == 2
		vB_2_Strike_Vessels = true
	else
		vB_2_Strike_Vessels = false
	endif	
vV_Strike_Vessel_1  = "gblV_Strike_Vessel_1" value
vV_Strike_Vessel_2  = "gblV_Strike_Vessel_2" value
vS_Strike_Vessel_1 = "gblS_Strike_Vessel_1" value
vS_Strike_Vessel_2 = "gblS_Strike_Vessel_2" value
vV_Strike_Temperature = "gblV_Desired_Strike" value
vV_Strike_Temperature_Offset = "gblV_StrikeOffset" value
new bool vB_Brewzilla_Strike
 vV_Strike_Temperature_With_Offset = vV_Strike_Temperature + vV_Strike_Temperature_Offset 
if vV_Strike_Vessel_1 == 3
vB_Brewzilla_Strike = true
endif
if vV_Strike_Vessel_2 == 3
vB_Brewzilla_Strike = true
endif
"gblV_Brew_Status" value = 700
[SectionBrew700]
[Brewzilla_Delay]
[SectionBrew700]
wait "gblV_Brew_Status" value == 700
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
//.............................................................................
"gblS_Brewery_Top_2" value  = "Insure that the Wall Safety Switch for the Brewzilla is on and the Brewzilla Control Panel is lit.  Click Brewzilla Control Panel Live? to advance. "
"gblS_swAllSwitch_Label_Text" value  = "Brewzilla Control Panel Live?"
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
"gblS_Brewery_Top_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 701
print 84
[SectionBrew702]
wait "gblV_Brew_Status" value == 702
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
//.........................................
//........................................
vSMsg = "The Setpoint of the Brewzilla is manually set.  "
if vB_Brewzilla_Strike == true
vSMsg1 = "The SetPoint of the Brewzilla should be set to  "
vSMsg = vSMsg + vSMsg1
vSMsg1 =  vV_Strike_Temperature_With_Offset
vSMsg = vSMsg + vSMsg1
vSMsg1 = " °F.  Insure the the Temperature is set to °Farenheit , as well.  Do NOT start the Brewzilla yet. ▶"
vSMsg = vSMsg + vSMsg1
else
vSMsg1 = "The SetPoint of the Brewzilla should be set to  "
vSMsg = vSMsg + vSMsg1
vSMsg1 =  185
vSMsg = vSMsg + vSMsg1
vSMsg1 = " °F to be an HLT. The temperature is set to °F, as well.   Insure that the Recycle Tube is in place and that the Pump Recycles the Brewzilla.  Leave the Pump OFF after testing.   Do NOT start the Brewzilla yet. ▶"
vSMsg = vSMsg + vSMsg1
endif
//.....................................................
"gblS_Brewery_Top_2" value = vSMsg
"gblS_swAllSwitch_Label_Text" value =  "Brewzilla Ready?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_2" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_3" visibility  = hidden
"gblS_Brewery_Top_2" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 701
[SectionBrew702]
wait "gblV_Brew_Status" value == 702
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
[Brewzilla_Waiting]
[Ender_Brewzilla_Ready]
clear
"sw_Running_Script_C" state = false
stop "sub_scrBrewZilla_Ready"
```

## 52. sub_scrDigiBoil_Ready

Starts by itself: No · User can start or stop it: Yes · 163 lines

```text
//sub_scrDigiBoil_Ready  Modified 260807 15-43
//08/05/2026
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//DigiBoil Get Ready or Start
"sw_Running_Script_C" state = true
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...................................................
new string vSMsg
new string vSMsg1
new value vV_Strike_Vessel_1
new value vV_Strike_Vessel_2
new value vV_Strike_Temperature
new value vV_Strike_Temperature_Offset
new value vV_Choice
new value vV_Strike_Temperature_With_Offset
//.................................................................................

vV_Strike_Vessel_1  = "gblV_Strike_Vessel_1" value
vV_Strike_Vessel_2  = "gblV_Strike_Vessel_2" value
vV_Strike_Temperature = "gblV_Desired_Strike" value
vV_Strike_Temperature_Offset = "gblV_StrikeOffset" value
new bool vB_DigiBoil_Strike
vV_Strike_Temperature_With_Offset = vV_Strike_Temperature + vV_Strike_Temperature_Offset 
if vV_Strike_Vessel_1 == 3
vB_DigiBoil_Strike = true
endif
if vV_Strike_Vessel_2 == 3
vB_DigiBoil_Strike = true
endif
"gblV_Brew_Status" value = 700
[SectionBrew700]
[DigiBoil_Delay]
[SectionBrew700]
wait "gblV_Brew_Status" value == 700
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
//.............................................................................
"gblS_Brewery_Top_2" value  = "Plug in the DigiBoil  and the DigiBoil Control Panel is lit.  Click DigiBoil Control Panel Live? to advance. "
"gblS_swAllSwitch_Label_Text" value  = "DigiBoil Control Panel Live?"
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
"gblS_Brewery_Top_3" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 701
[SectionBrew702]
wait "gblV_Brew_Status" value == 702
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
//.........................................
//........................................
vSMsg = "Turn OFF the DigiBoil Heater Switch.  Set the Temperature to °Farenheit. Set up the Purple Pump and Recycle Hoses and Test.  Leave the Purple Pump OFF.   The Setpoint of the DigiBoil should manually be set to "
if vB_DigiBoil_Strike == true
vSMsg1 =  vV_Strike_Temperature_With_Offset
vSMsg = vSMsg + vSMsg1
vSMsg1 = " °F. "
vSMsg = vSMsg + vSMsg1
else
vSMsg1 =  185
vSMsg = vSMsg + vSMsg1
vSMsg1 = " °F to be an HLT."
vSMsg = vSMsg + vSMsg1
endif
//.....................................................
"gblS_Brewery_Top_2" value = vSMsg
"gblS_swAllSwitch_Label_Text" value =  "DigiBoil Ready?"
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
"gblV_Brew_Status" value = 701
[SectionBrew702]
wait "gblV_Brew_Status" value == 702
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
[DigiBoil_Waiting]
[Ender_DigiBoil_Ready]
clear
print 160
"sw_Running_Script_C" state = false
print 161
stop "sub_scrDigiBoil_Ready"
```

## 53. sub_scrBrew_Fill_HERMs

Starts by itself: No · User can start or stop it: Yes · 112 lines

```text
//sub_scrBrew_Fill_HERMs Modified 260812 14_05
//02/17/2026 08:50
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
//Modified  05/16/2026 08:26
//"tm_Water" value = 00:00:00
//All Strike in Big Mac 
// Fills Radiator with HERMs Bath
//................................
// Set Testing
[Set_Testing]
"sw_Running_Fill_HERMs" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: sub_scrBrew_Fill_HERMs" 
//................................
//................................
show workspace "B1 Brewery"
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value = "Wait! Will Auto Advance."
"sw_Advance_HopsCalc" visibility = hidden
"sw_Flow_ByBass_Hop_Calc" visibility = hidden
"gblVPrecision5" value = 0
new string vSMsg
new string vSMsg1
new value vVRad_Dead_Space
new value vVStrikeVolume
new value vVRadiatorFill
new value vV_Vessel_Start_Volume
//........................................................................
vVStrikeVolume = "gblVStrikeVolume" value
"gblVPrecision1" value = 0
//........................................................................
"gblV_Water_Switch_Status_Water" value = -9999
//.................................................
"gblS_Brewery_Top_1" value = "Wait.  Will Auto Advance"
"gblS_Brewery_Top_1" visibility = hidden
// Where to start
"gblV_Brew_Status" value = 135
goto "SectionBrew135"
//................................................
[SectionBrew135]
wait "gblV_Brew_Status" value == 135
if "sw_Status_DeadSpace_Radiator" state == true
vVRadiatorFill = 5 
else
vVRadiatorFill = 5 + 2.3
endif
print vVRadiatorFill
"gblV_Gals_to_Fill" value = vVRadiatorFill
vSMsg = "The Radiator is the HERMs Bath.  The Radiator HERMs Bath needs to be filled with about 5 gallons.   "
"gblS_Bottom_Text" value = "After filling the Radiator HERMs Bath, the Measured Volume (HERMs Bath) should be at least 5 gallons. It can be MORE or LESS but the Radiator Body Heater must be covered! "
if "sw_Status_DeadSpace_Radiator" state == false
vSMsg1 = "The Dead Space (2.3 gallons) will be added to the Volume to transfer. "
"gblS_Bottom_Text" value = "After filling the Radiator HERMs Bath, the Measured Volume (HERMs Bath) should be at least 5 gallons. The DeadSpace is NOT measured.  It can be MORE or LESS but the Radiator Body Heater must be covered! "
vSMsg = vSMsg + vSMsg1
endif
vSMsg1 = "The total Gallons to Fill Volume should be "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vVRadiatorFill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. Click Set Manifold?."
if "sw_Status_DeadSpace_Radiator" state == false
vSMsg1 = " gallons which includes the 2.3 gallons of DeadSpace. Click Set Manifold?"  
endif
vSMsg = vSMsg + vSMsg1
"gblS_Top_Text" value = vSMsg
"MB_19_do_RIMS_Radiator_Control_B1" state = false
"sw_Control_Radiator_Element" state = false
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
//........................
"gblS_BrewName_B1" value = "Radiator HERMs Bath"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 138
[SectionBrew138]
wait "gblV_Brew_Status" value == 138
"sw_Advance_ BrewStatus" visibility = hidden
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//................................................
if "sw_Use_HERMs_from_Big_Mac" state == true
"gblV_Water_Switch_Status_Water" value = 302
else
"gblV_Water_Switch_Status_Water" value = 2
endif
start "sub_scrManifold_Choice"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value =  "sub_scrBrew_Fill_HERMs @ 98  > start: sub_scrManifold_Choice"
sleep 4001
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 106 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Manifold_Choice" state == false
goto "Ender_sub_scrBrew_Fill_HERMs"
[Ender_sub_scrBrew_Fill_HERMs]
"gblV_Node_Red_Imported" value = 0
"RP_v_Herms_Bath_Volume" value = "gblVCurrentRadiator_Volume" value
wait "sw_Running_Calculate_SPG" state == false
"gblS_Script_Ended" value = "Ended: sub_scrBrew_Fill_HERMs"
clear
"sw_Running_Fill_HERMs" state = false
stop "sub_scrBrew_Fill_HERMs"
```

## 54. sub_scrBrew_Fill_BigMac_HLT

Starts by itself: No · User can start or stop it: Yes · 97 lines

```text
//sub_scrBrew_Fill_BigMac_HLT Modified 260812 14_05
//02/17/2026 08:50
//© OakBarn Brewery
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// scrBrew0 divided up
//Modified  05/16/2026 08:26
// Fills Big Mac as HLT with HERMs Bath
//................................
// Set Testing
[Set_Testing]
"sw_Running_Fill_BigMac_HLT" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"
"gblS_Script_Started" value = "Started: sub_scrBrew_Fill_BigMac_HLT" 
//................................
//................................
show workspace "B1 Brewery"
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" value = "Wait! Will Auto Advance."
"sw_Advance_HopsCalc" visibility = hidden
"sw_Flow_ByBass_Hop_Calc" visibility = hidden
"gblVPrecision5" value = 0
new string vSMsg
new string vSMsg1
new value vV_BigMac_Default_Volume
new value vV_BigMacFill
new value vV_BigMac_Current_Volume
vV_BigMac_Current_Volume = "gblVCurrentBigMac_Volume" value
vV_BigMac_Default_Volume = "gblV_Refill_Big_Mac_Mash" value
vV_BigMacFill = vV_BigMac_Default_Volume - vV_BigMac_Current_Volume
"gblV_Gals_to_Fill" value = vV_BigMacFill
vV_BigMacFill = "gblV_Gals_to_Fill" value
//........................................................................
//........................................................................
"gblV_Water_Switch_Status_Water" value = -9999
//.................................................
"gblS_Brewery_Top_1" value = "Wait.  Will Auto Advance"
"gblS_Brewery_Top_1" visibility = hidden
// Where to start
"gblV_Brew_Status" value = 135
goto "SectionBrew135"
//................................................
[SectionBrew135]
wait "gblV_Brew_Status" value == 135
vSMsg = "The Big Mac is an HLT. The Big Mac needs to be filled with about "
vSMsg1 = vV_BigMacFill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons of Tap Water from the MSV (Tap Water).  This water is used for Sparging, Flushing and Topping Off thoughout the Brew Day.  Click Set Manifold?"
vSMsg = vSMsg + vSMsg1
"gblS_Top_Text" value = vSMsg
"gblS_Bottom_Text" value = "After filling the Big Mac, the Measured Volume  should be at least 35 gallons. The deired Volume was "
vSMsg = "After filling the Big Mac, the Measured Volume  should be at least 35 gallons. The deired Volume was "
vSMsg1 = vV_BigMacFill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons' It can be MORE or LESS but not less than 35!"
vSMsg = vSMsg + vSMsg1
"gblS_Bottom_Text" value = vSMsg 
"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
//........................
"gblS_BrewName_B1" value = "Big Mac HLT"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"gblV_Brew_Status" value = 138
[SectionBrew138]
wait "gblV_Brew_Status" value == 138
"sw_Advance_ BrewStatus" visibility = hidden
"insp_1_LeftMiddle_B1"  background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//................................................
"gblV_Water_Switch_Status_Water" value = 1
start "sub_scrManifold_Choice"
sleep 100
"gblS_Inter_Script" value =  "sub_scrBrew_Fill_BigMac_HLT @ 79  > start: sub_scrManifold_Choice"
if vB_Testing == true
sleep 4001
endif
"sw_Running_Calculate_SPG" state = true
sleep 100
print "@ 88 wait sw_Running_Calculate_SPG state is false"
wait "sw_Running_Calculate_SPG" state == false
goto "Ender_sub_scrBrew_Fill_BigMac_HLT"
[Ender_sub_scrBrew_Fill_BigMac_HLT]
wait "sw_Running_Calculate_SPG" state == false
"gblS_Script_Ended" value = "Ended: sub_scrBrew_Fill_BigMac_HLT"
if vB_Testing == true
sleep 4001
endif
clear
"sw_Running_Fill_BigMac_HLT" state = false
stop "sub_scrBrew_Fill_BigMac_HLT"
```

## 55. sub_scrTimeorVolume

Starts by itself: No · User can start or stop it: No · 342 lines

```text
// sub_scrTimeorVolume
//07/09/2026 17:15
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// MODIFIED 07/09/2026 17:15
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
"gblS_Script_Started" value = "Started: sub_scrTimeorVolume" 
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
//................................
if "sw_Flow_Skip_TimeorVolume" state == true
goto "Start_sub_3_scrCalculateSPG"
endif
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vSMsg_Top
new string vSMsg_Bottom
new value vV_Fermentor
new string vS_Vessel_From
new string vS_Vessel_to
new string vS_Pump
new string vS_Isolation_Valve
new value  vV_SPG
new value vV_Volume_Avaiable
new value vV_Volume_Current
new value vV_Volume_Left
new value vV_Gal_to_Fill
new bool vB_Volume
new time VT_Time_Fill
new bool vB_sw_Status_Script_From_Script
vV_SPG precision = 5
vS_Vessel_To = "gblS_Vessel_To" value
vS_Vessel_From = "gblS_Vessel_From" value
vS_Pump = "gblS_Pump" value
vS_Isolation_Valve = "glbS_Isolation_Valve" value
vV_Gal_to_Fill = "gblV_Gals_to_Fill" value
//........................................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
vB_sw_Status_Script_From_Script = "sw_Status_Script_From_Script" state 
print "@ 34 vB_sw_Status_Script_From_Script = "
print vB_sw_Status_From_Switch_Water_Pane
if vB_sw_Status_Script_From_Script == true
goto "From_Script_Gallons_Set"
else
goto "Start_Choice"
endif
[Wrong_Choice]
"gblS_Brewery_Top_2" value = "Wrong Choice.  Enter 1 or 2!  Any other number will not work."
"gblVReport_B1" value = 0
"gblS_Brewery_Top_2" background = 2
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
//"gblV_Set_BackGround_Middle_Time" value = 1
//"gblS_swAllSwitch_Label_Text" value = "Something"
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
goto "Start_Choice"
[Start_Choice]
"gblS_Brewery_Top_2" value = "You need to make a choice.\n\n 1 = Fill by Time Only.\n2= Fill by Gallons (requires an SPG Factor)\n\nEnter 1 or 2"
"gblSReportLabel_B1" value = "Volume or Time"
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 0
"gblS_swAllSwitch_Label_Text" value = "Make your Choice"
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
"gblS_BrewName_B1" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = visible
wait  "gblVReport_B1" value > 0
[Loop_Choice]
sleep 100
if "gblVReport_B1" value == 1
vB_Volume = false
goto "Set_Time"
endif
if "gblVReport_B1" value == 2
vB_Volume = true
goto "Set_Volume"
endif
if "gblVReport_B1" value >= 3
goto "Wrong_Choice"
endif
goto "Loop_Choice"
[Exit_Loop_Choice]
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 1
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
[Set_Volume]
if "gblV_Vessel_From" value == 100
vSMsg = "Enter the Volume  to fill the "
else
vSMsg = "Enter the Volume you wish to transfer to the  "
endif
vSMsg1 = vS_Vessel_to
vSMsg = vSMsg + vSMsg1
vSMsg1 = " using the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " as the source.  A Time will be calculated based on the SPG (Seconds per Gallon) factor.  You are the Safety and Control! "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg
"gblSReportLabel_B1" value = "Enter Volume"
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 1
"gblS_swAllSwitch_Label_Text" value = ""
"gblS_BrewName_B1" value = "Gallons to Transfer?"
//........................................
//Inspector_Green
"gblV_Set_BackGround_Middle_Time" value = 2
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//BackGround
"gblS_Brewery_Top_2" background = 1 
"gblS_swAllSwitch_Label_Text" background = 2
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_BrewName_B1" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = visible
wait  "gblVReport_B1" value > 0
"gblV_Gals_to_Fill" value = "gblVReport_B1" value
vV_Gal_to_Fill = "gblV_Gals_to_Fill" value
"gblVReport_B1" value = 0
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
[From_Script_Gallons_Set]
print "@ 145 From_Script_Gallons_Set"
vB_Volume = true
vSMsg = ""
vSMsg = "The Gallons to transfer to the  "
vSMsg1 = vS_Vessel_to
vSMsg = vSMsg + vSMsg1
vSMsg1 = " using the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " as the source has been set to "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vV_Gal_to_Fill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons.  "
vSMsg = vSMsg + vSMsg1
vSMsg_Top = vSMsg
vSMsg = ""
//............................................   
vSMsg = "The "
vSMsg1 = vS_Isolation_Valve
vSMsg = vSMsg + vSMsg1
vSMsg1 = " will open and the "
vSMsg = vSMsg + vSMsg1
if "gblV_Vessel_From" value == 100
vSMsg1 = "Manifold Supply Valve will open. You are the Safety and Control. Watch the Volumes and Over Ride if necessary!"
else
vSMsg1 = vS_Pump
vSMsg2 = " will turn on.  You are the Safety and Control. Watch the Volumes and Over Ride if necessary!"
vSMsg1 = vSMsg1 + vSMsg2
endif
vSMsg = vSMsg + vSMsg1
vSMsg_Bottom = vSMsg
vSMsg = ""
//............................................ 
print 182
goto "End_Message"
[Set_Time]
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
if "gblV_Vessel_From" value == 100
vSMsg = "The Time needs to be set on the Next Pane.  This is simply a Timed Fill to the "
else
vSMsg = "The Time needs to be set on the Next Pane.  This is simply a Timed transfer to the " 
endif
vSMsg1 = vS_Vessel_to
vSMsg = vSMsg + vSMsg1
vSMsg1 = " using the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " as the source.  The "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Isolation_Valve
vSMsg = vSMsg + vSMsg1
vSMsg1 = " will open and the "
vSMsg = vSMsg + vSMsg1
if "gblV_Vessel_From" value == 100
vSMsg1 = "Manifold Supply Valve will open."
else
vSMsg1 = vS_Pump
vSMsg2 = " will turn on."
vSMsg1 = vSMsg1 + vSMsg2
endif
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_Brewery_Top_3" visibility = visible
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"alm_BigMacFloat_Water" active = false
stop "tm_Water" 
"tm_Water" value = 00:00:00
"gblT_SetTimer_Water" value = 00:00:00
"gblS_Water_Text_1_Water" value = "Set the desired Run Time in the Set Timer slot."
"insp_Water_Gusher" background = 2
"insp_FireHosePix" background = 3
"alm_BigMacFloat_Water" visibility = hidden
"insp_WaterCoverRight" visibility = hidden
"insp_Manifold_Water" visibility = hidden
"sw_Advance__EndVolume" visibility = hidden
"tm_Water" visibility = hidden
"inspect_TEXT_1_Water" visibility = hidden
"gblS_Water_Text_1_Water" visibility = visible
"tmFireHoseDelay" visibility = hidden
"gblVEndVolume_Water" visibility = hidden
"insp_StartGallonLabel" visibility = hidden
"insp_GalToAdd" visibility = hidden
"insp_SetVolume" visibility = hidden
"gblT_SetTimer_Water" visibility = visible
"insp_Water_Gusher" visibility = visible
"insp_FireHosePix" visibility = visible
show workspace "Water"
wait "gblT_SetTimer_Water" value > 00:00:01
VT_Time_Fill = "gblT_SetTimer_Water" value 
show workspace "B1 Brewery"

vSMsg = " "
if "gblV_Vessel_From" value == 100
vSMsg = "The Manifold Supply Valve will be on for "
else
vSMsg = "The " 
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Pump
vSMsg = vSMsg + vSMsg1
vSMsg1 =  "will be on for "
vSMsg = vSMsg + vSMsg1
endif
vSMsg1 = VT_Time_Fill
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to fill the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_to
vSMsg = vSMsg + vSMsg1
vSMsg1 = " from the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = "."
vSMsg = vSMsg + vSMsg1
vSMsg_Top = vSMsg
vSMsg = ""
//................................
vSMsg1 = "The  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Isolation_Valve
vSMsg = vSMsg + vSMsg1
vSMsg1 = " will open to start the fill.  You are the Safety and Control. Watch the Volumes and Over Ride if necessary!"
vSMsg = vSMsg + vSMsg1
vSMsg_Bottom = vSMsg
vSMsg = " "
goto "End_Message"
[End_Message]
print "@284 End_Message"
if vB_Volume == true
vSMsg1 = "  This a transfer by Volume.  Wait!  Will Auto Advance."
else
vSMsg1 = "  This transfer by time.   Wait!  Will Auto Advance."
endif
vSMsg_Bottom = vSMsg_Bottom + vSMsg1
 //............................................ 
"gblS_Brewery_Top_3" value = vSMsg_Top
"gblS_Brewery_Bottom_3" value = vSMsg_Bottom
//........................................
//BackGround
"gblS_Brewery_Top_3" background = 3 
"gblS_Brewery_Bottom_3" background = 3 
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_BrewName_B1" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblVReport_B1" visibility = hidden
//........................................
//........................................
print 311
// 7 Second Delay
"gblV_Delay_Seconds" value = 7
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
print 333
"gblS_Brewery_Top_3" visibility = hidden
print 332
"gblS_Brewery_Bottom_3" visibility = hidden
print 322
//........................................
[Start_sub_3_scrCalculateSPG]
start "sub_3_scrCalculateSPG"
print 325
goto "End_sub_scrTimeorVolume"
print 327
[End_sub_scrTimeorVolume]
"gblS_Script_Ended" value = "Ended: sub_scrTimeorVolume" 
clear
stop "sub_scrTimeorVolume"
```

## 56. sub_scrCloseAllValves

Starts by itself: No · User can start or stop it: Yes · 208 lines

```text
//sub_scrCloseAllValves
//04/01/2023:08:27
//Modified 08/30/2023 07:59
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Checked 9/15/2023
[Set_Testing]
"sw_Running_Script_D" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
start "inscpt_scrBasicStart"

new string vSTimerName
new string vSTimerTime
new string vSTimerName
new string vSTimerName2
new string vSTimerName3
new string vSTimerTime
new time vT_Valve_Delay
vSTimerTime = "gblTValveDelay" value 
vT_Valve_Delay = "gblTValveDelay" value 
vSTimerName = "Valve Delay: " + vSTimerTime
vSTimerName2 = "Reposition will take " + vSTimerTime
vSTimerName3 = "Short Delay of " + vSTimerTime
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"tm_Display_BottomRight_B1" type = countdown
// print 1
"tm_Display_BottomRight_B1" displayname = vSTimerName
//Big Mac Element
"sw_Control_BigMac_Element" state = false
"MB_17_do_BigMac2Contactor_Wo1" state = false
"MB_05_PWM_BigMacElement2_WO1" enabled = false
//Radiator Body Element
"sw_Control_Radiator_Element" state = false
"MB_08_PWM_Radiator_WO1" enabled = false
//..............
"MB_08_Hys_RadiatorElement_Wo1" enabled = false
"Radiator Duty Cyle" enabled = false
//RIMs Element
"sw_Control_RIMs_Element" state = false
"MB_14_do_RIMs_Contactor_Heat" state = false
"MB_09_PWM_RIMs_Heat" enabled = false
//Pump Control
"MB_35_do_YellowPump_B1" state = false
"MB_36_do_RedPump_B1" state = false
"MB_33_do_BluePump_B1" state = false
"MB_34_do_GreenPump_B1" state = false
"MB_32_do_WhitePump_B1" state = false
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"tmBrewDay_B1" visibility = visible
//Backgrounds
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait: Valves Repositioning"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
//Beer Name
"gblS_BrewName_B1" value = "Closing All Valves"
//Valve Staus
"gblV_Valve_Status" value = 1 
//Start Closing Valves
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "  "
"gblS_Brewery_Top_3" value = "First Set: All Valves will close in different sections.  Each set will take " + vSTimerTime
"gblS_Brewery_Top_3" visibility = visible
 //VA 1
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" visibility = visible
"VGC_49_do_WhitePumpValve_On_B1" state = false
//VB 1
"VGC_26_do_Right_MLT_Isolation_On_B1" state = false
//VC 1
"VGC_3_do_RedPumpValve_On_B1" state = false
// VD 1
"VGC_25_do_LittleMacTangental_ON_B1" state = false
// Time Delay
"tm_Display_BottomRight_B1" value = vT_Valve_Delay
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "2nd Set: All Valves will close in different sections.  This set will take " + vSTimerTime
"gblS_Brewery_Top_3" value = " " 
"gblS_Brewery_Bottom_3" visibility = visible
//VA 2
"VGC_47_do_BigMacTangental_On_B1" state = false
//VB 2
"VGC_28_do_CrossManifold_On_B1" state = false
//VC 2
"VGC_5_do_FermentFill_On_B1" state = false
// VD 2
"VGC_23_do_BackManifold_Left_On_B1" state = false
// Time Delay
"tm_Display_BottomRight_B1" value = vT_Valve_Delay
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "  "
"gblS_Brewery_Top_3" value = "3rd Set: All Valves will close in different sections.  This set will take " + vSTimerTime
"gblS_Brewery_Top_3" visibility = visible
//VA 3
"VGC_45_do_RadiatorTangental_On_B1" state = false

//VB 3
"VGC_30_do_FireHose_On_B1" state = false
//VC 3
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
// VD 3
"VGC_15_do_YellowPumpValve_On_B1" state = false
// Time Delay
"tm_Display_BottomRight_B1" value = vT_Valve_Delay
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "4th Set: All Valves will close in different sections.  This set will take " + vSTimerTime
"gblS_Brewery_Top_3" value = " " 
"gblS_Brewery_Bottom_3" visibility = visible
//VA 4
"VGC_43_do_CoolingWater_On_B1" state = false
//VB  4
"VGC_32_do_RadiatorSupply_On_B1" state = false
//VC 4
"VGC_8_do_BluePumpValve_On_B1" state = false
// VD 4
"VGC_17_do_LittleMacIsolation_On_B1" state = false
// Time Delay
"tm_Display_BottomRight_B1" value = vT_Valve_Delay
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "  "
"gblS_Brewery_Top_3" value = "Final Set: This is the Last Set..  This set will take " + vSTimerTime
"gblS_Brewery_Top_3" visibility = visible
//VA 5
"VGC_41_do_BrewKettleIsolation_On_B1" state = false
//VB 5
 "VGC_34_do_BigMac_Isolation_On_B1" state = false
//VC 5
"VGC_13_do_HermsWort_On_B1" state = false
// VD 5
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"VGC_39_Back_Drain_On_B1" state = false

// Time Delay
"tm_Display_BottomRight_B1" value = vT_Valve_Delay
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
//Set Final
//VB 6
[ender]
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "All Valves are Closed. there is a short delay of  3 Seconds" 
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" value = "All Valves are Closed."
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Cleaning Up"
"tm_Display_BottomRight_B1" value = 00:00:03
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = hidden
"gblS_Brewery_Top_3" value = " " 
"gblS_Brewery_Top_3" visibility = hidden
"gblVStartBrew" value = 1
//Beer Name
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
//Valve Status
"gblV_Valve_Status" value = 0 
if vB_Testing == true
"gblS_Inter_Script" value = "ended: sub_scrCloseAllValves"
sleep 2001
endif
clear
"sw_Running_Script_D" state  = false
stop "sub_scrCloseAllValves"
```

## 57. sub_scrDataExchangeFerment1

Starts by itself: No · User can start or stop it: Yes · 21 lines

```text
//sub_scrDataExchangeFerment1
//created
//04/19/2025 13:35
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Sets Data to Globals for Data Exchange
reset "tm_1_MinFermentCD"
[LoopDEFerment1]
"DX_gblV_Ferment_1_Temp_DE" value = "MB_60_10K_MLT_Out_B1" value
start "tm_1_MinFermentCD"
if  "tm_1_MinFermentCD" value <= 00:00:00 
reset "tm_1_MinFermentCD"
endif
goto "LoopDEFerment1"
[EndDataFerment]
stop "tm_1_MinFermentCD"
"gblV_Node_Red_Imported" value = 0
clear

stop "sub_scrDataExchangeFerment1"
```

## 58. sub_scrDataExchangeMash

Starts by itself: No · User can start or stop it: Yes · 23 lines

```text
//sub_scrDataExchangeMash
//created
//04/19/2025 11:35
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Sets Data to Globals for Data Exchange
reset "tm_1 MinuteCD"
[LoopDEMash]
if "gblV_Node_Red_Imported" value == 99
goto "EndDataMash"
endif
"DX_gblV_Mash_Temp_DE" value = "MB_60_10K_MLT_Out_B1" value
start "tm_1 MinuteCD"
if  "tm_1 MinuteCD" value <= 00:00:00 
reset "tm_1 MinuteCD"
endif
goto "LoopDEMash"
[EndDataMash]
stop "tm_1 MinuteCD"
"gblV_Node_Red_Imported" value = 0
clear

stop "sub_scrDataExchangeMash"
```

## 59. sub_scrRestore_B1

Starts by itself: No · User can start or stop it: Yes · 134 lines

```text
// sub_scrRestore_B1 Modified 260809 17:15
//07/10/2026 11:40
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Resets B1_Brewery to the way it was
//.......................................................
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................

"sw_Restore_B1" state = true
	new string vS_Save_Visibility_Top_1
	new string vS_Save_Visibility_Top_2
	new string vS_Save_Visibility_Top_3
	new string vS_Save_Visibility_Bottom_1
	new string vS_Save_Visibility_Bottom_3
	new string vS_Save_Visibility_Bottom_4
	new value  vV_Endless_Loop
	new value vV_Save_Inspector
	new value vV_Save_Arrow_Background
	new string  vS_Save_Arrow_Visibility
	new string vS_Save_Label_Text
	new value vV_Save_Label_Background
	new string  vS_Save_Label_Visibility
	new string vS_Save_Label
	new value vV_Save_Arrow_Background
	new value vV_Middle_Background
	new string vS_Save_Visibility_Label
	new string vS_Save_Visibility_All_Switch
	new string vS_Save_Visibility_Override_Switch
	new string vS_Save_Visibility_Endless_Switch
	new string vS_Beer_Name_Text
//.......................................................
	vS_Save_Visibility_Top_1 = "gblS_Brewery_Top_1" visibility
	vS_Save_Visibility_Top_2 = "gblS_Brewery_Top_2" visibility
	vS_Save_Visibility_Top_3 = "gblS_Brewery_Top_3" visibility
		if vS_Save_Visibility_Top_1 == "visible"
			new string vS_Save_Text_Top_1
			new value vV_Save_Background_Top_1
			vS_Save_Text_Top_1 = "gblS_Brewery_Top_1" value
			vV_Save_Background_Top_1 = "gblS_Brewery_Top_1" background
		endif
		if vS_Save_Visibility_Top_2 == "visible"
			new string vS_Save_Text_Top_2
			new value vV_Save_Background_Top_2
			vS_Save_Text_Top_2 = "gblS_Brewery_Top_2" value
			vV_Save_Background_Top_2 = "gblS_Brewery_Top_2" background
		endif
		if vS_Save_Visibility_Top_3 == "visible"
			new string vS_Save_Text_Top_3
			new value vV_Save_Background_Top_3
			vS_Save_Text_Top_3 = "gblS_Brewery_Top_3" value
			vV_Save_Background_Top_3 = "gblS_Brewery_Top_3" background
		endif
	vS_Save_Visibility_Bottom_1 = "gblS_Brewery_Bottom_1" visibility
	vS_Save_Visibility_Bottom_3 = "gblS_Brewery_Bottom_3" visibility
	vS_Save_Visibility_Bottom_4 = "gblS_Brewery_Bottom_4" visibility
		if vS_Save_Visibility_Bottom_1 == "visible"
		new string vS_Save_Text_Bottom_1
		new value vV_Save_Background_Bottom_1
			vS_Save_Text_Bottom_1 = "gblS_Brewery_Bottom_1" value
			vV_Save_Background_Bottom_1 = "gblS_Brewery_Bottom_1" background
		endif
		if vS_Save_Visibility_Bottom_3 == "visible"
		new string vS_Save_Text_Bottom_3
		new value vV_Save_Background_Bottom_3
			vS_Save_Text_Bottom_3 = "gblS_Brewery_Bottom_3" value
			vV_Save_Background_Bottom_3 = "gblS_Brewery_Bottom_3" background
		endif
		if vS_Save_Visibility_Bottom_4 == "visible"
		new string vS_Save_Text_Bottom_4
		new value vV_Save_Background_Bottom_4
			vS_Save_Text_Bottom_4 = "gblS_Brewery_Bottom_4" value
			vV_Save_Background_Bottom_4 = "gblS_Brewery_Bottom_4" background
		endif
	vV_Save_Inspector = "gblV_Set_BackGround_Middle_Time" value
	vV_Save_Arrow_Background = "insp_Pix_ArrowAllSwitch_B1" background
	vS_Save_Arrow_Visibility = "insp_Pix_ArrowAllSwitch_B1" visibility
	vS_Save_Label_Text = "gblS_swAllSwitch_Label_Text"  value
	vV_Save_Label_Background = "gblS_swAllSwitch_Label_Text"  background
	vS_Save_Label_Visibility = "gblS_swAllSwitch_Label_Text"  visibility
	vS_Save_Visibility_All_Switch = "sw_Advance_ BrewStatus" visibility
	vS_Save_Visibility_Override_Switch = "sw_Advance_Overide" visibility
	vS_Save_Visibility_Endless_Switch = "sw_Advance_Endless" visibility
//........................................................
"gblVEndlessLoop" value = 0
wait  "gblVEndlessLoop" value == 1.1
 "gblVEndlessLoop" value = vV_Endless_Loop
 		if vS_Save_Visibility_Top_1 == "visible"
			 "gblS_Brewery_Top_1" value = vS_Save_Text_Top_1 
			 "gblS_Brewery_Top_1" background = vV_Save_Background_Top_1
			 "gblS_Brewery_Top_1" visibility = vS_Save_Visibility_Top_1
		endif
  		if vS_Save_Visibility_Top_2 == "visible"
			 "gblS_Brewery_Top_2" value = vS_Save_Text_Top_2 
			 "gblS_Brewery_Top_2" background = vV_Save_Background_Top_2
			 "gblS_Brewery_Top_2" visibility = vS_Save_Visibility_Top_2
		endif
  		if vS_Save_Visibility_Top_3 == "visible"
			 "gblS_Brewery_Top_3" value = vS_Save_Text_Top_3 
			 "gblS_Brewery_Top_3" background = vV_Save_Background_Top_3
			 "gblS_Brewery_Top_3" visibility = vS_Save_Visibility_Top_3
		endif
 		if vS_Save_Visibility_Bottom_4 == "visible"
			"gblS_Brewery_Bottom_4" value = vS_Save_Text_Bottom_4 
			"gblS_Brewery_Bottom_4" background = vV_Save_Background_Bottom_4 
			"gblS_Brewery_Bottom_4" visibility = vS_Save_Visibility_Bottom_4 
		endif
  		if vS_Save_Visibility_Bottom_3 == "visible"
			"gblS_Brewery_Bottom_3" value = vS_Save_Text_Bottom_3 
			"gblS_Brewery_Bottom_3" background = vV_Save_Background_Bottom_3 
			"gblS_Brewery_Bottom_3" visibility = vS_Save_Visibility_Bottom_3 
		endif
  		if vS_Save_Visibility_Bottom_4 == "visible"
			"gblS_Brewery_Bottom_4" value = vS_Save_Text_Bottom_4 
			"gblS_Brewery_Bottom_4" background = vV_Save_Background_Bottom_4 
			"gblS_Brewery_Bottom_4" visibility = vS_Save_Visibility_Bottom_4 
		endif

"gblV_Set_BackGround_Middle_Time" value = vV_Save_Inspector 
"insp_Pix_ArrowAllSwitch_B1" background = vV_Save_Arrow_Background 
"insp_Pix_ArrowAllSwitch_B1" visibility = vS_Save_Arrow_Visibility 
"gblS_swAllSwitch_Label_Text"  value = vS_Save_Label_Text 
"gblS_swAllSwitch_Label_Text" background = vV_Save_Label_Background 
"gblS_swAllSwitch_Label_Text" visibility = vS_Save_Label_Visibility 
 "sw_Advance_ BrewStatus" visibility = vS_Save_Visibility_All_Switch
"sw_Advance_Overide" visibility = vS_Save_Visibility_Override_Switch 
"sw_Advance_Endless" visibility = vS_Save_Visibility_Endless_Switch 
"gblVEndlessLoop" value = 0
clear
"sw_Restore_B1" state = false
stop "sub_scrRestore_B1"
```

## 60. sub_scrHeaters

Starts by itself: No · User can start or stop it: Yes · 171 lines

```text
//sub_scrHeaters  2026_02_21 10_03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Modified
new value vV_gblS_Brewery_Top_2_Background 
new value vV_gblS_Brewery_Top_3_Background
new value vV_insp_Pix_ArrowAllSwitch_B1
new value vV_gblS_swAllSwitch_Label_Text_Background 
new value vV_gblS_swAllSwitch_Label_Text_Background
new string vS_gblS_Brewery_Top_2_visibility 
new string vS_gblS_Brewery_Top_2_Value 
new string vS_gblS_Brewery_Top_3_visibility 
new string vS_gblS_Brewery_Top_3_Value
new string vS_gblS_swAllSwitch_Label_Text_value 
new string vS_gblS_swAllSwitch_Label_Text_visibility 
[Heat_Loop]
sleep 100
"gblS_Brewery_Bottom_1" background = 2
//Radiator Heat
	if "sw_Control_Radiator_Element" state == true
print "Heater True skip"
		if "sw_Status_Radiator_Body_On" state == true
		goto "SkipRadiatorHeat_ON"
		endif
			if "sw_Status_Manifold_HERMs" state == false
				if "MB_34_do_GreenPump_B1" state == true
				"gblS_Brewery_Bottom_1"	value = "Radiator Body Heater ON! You may consider resetting the Manifold if necessary."
				endif
				if "MB_34_do_GreenPump_B1" state == false
				"gblS_Brewery_Bottom_1"	value = "Radiator Body Heater ON! You may consider turning on the Green Pump and resetting the Manifold if necessary."
				endif
			endif
		"MB_08_PWM_Radiator_WO1" enabled = True
		"sw_Status_Radiator_Body_On" state = true
		"gblS_Brewery_Bottom_1" visibility = visible
		sleep 3000
		"gblS_Brewery_Bottom_1" visibility = hidden
	endif
[SkipRadiatorHeat_ON]
if "sw_Control_Radiator_Element" state == false
	"MB_08_PWM_Radiator_WO1" enabled = false
	"gblS_Brewery_Bottom_1"	value = "Radiator Body Heater OFF!"
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 3000
	"gblS_Brewery_Bottom_1" visibility = hidden
endif
//Big Mac Heater
if "sw_Control_BigMac_Element" state == true
		if "sw_Status_BigMac_Heat_On" state == true
		if "sw_Status_Manifold_BigMac_Heat" == true
			goto "SkipBigMac_ON"
		endif
		endif
		if "sw_Status_Manifold_BigMac_Heat" == false
			if "MB_32_do_WhitePump_B1" state == true
			"gblS_Brewery_Bottom_1" value = "Big Mac Heater On!  You may consider resetting the Manifold if necessary. " 
			endif
			if "MB_32_do_WhitePump_B1" state == false
			"gblS_Brewery_Bottom_1" value = "Big Mac Heater On!  You may consider turning on the White Pump and resetting the Manifold if necessary. " 
			endif
		endif	
	"MB_14_do_RIMs_Contactor_Heat" enabled = true
	"MB_17_do_BigMac2Contactor_Wo1" enabled = true
	"MB_09_PWM_RIMs_Heat" enabled = true
	"MB_05_PWM_BigMacElement2_WO1" enabled = true
	"sw_Status_BigMac_Heat_On" state = true
	"MB_57_10kBigMac_B1" visibility = visible
	"gblV_BigMacSetPointP1_B1" visibility = visible
	"gblPVBigMac"  visibility = visible
	"gblSVBigMac" visibility = visible
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 3000
	"gblS_Brewery_Bottom_1" visibility = hidden
endif
[SkipBigMac_ON]
//...................................................................
if "sw_Control_BigMac_Element" state == false
	"MB_14_do_RIMs_Contactor_Heat" enabled = false
	"MB_17_do_BigMac2Contactor_Wo1" enabled = false
	"MB_09_PWM_RIMs_Heat" enabled = false
	"MB_05_PWM_BigMacElement2_WO1" enabled = false
	"sw_Status_BigMac_Heat_On" state = false
		if "MB_32_do_WhitePump_B1" state == true		 	
		"gblS_Brewery_Bottom_1"	value = "Big Mac Heaters OFF!  You may consider turning off the White Pump ."
		else 
		"gblS_Brewery_Bottom_1" value = "Big Mac Heaters OFF!"
		endif
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 3000
	"gblS_Brewery_Bottom_1" visibility = hidden
endif
//Quadzilla Heat
if "MB_19_do_RIMS_Radiator_Control_B1" state == true
	if "sw_Status_RIMs_Heat_On" state == false
		if "sw_Status_Manifold_HERMs" state == false
			if "sw_Restore_After_Heat" state == true
			new string vS_gblS_Brewery_Top_2_visibility
			new string vS_gblS_Brewery_Top_2_Value
			new value vV_gblS_Brewery_Top_2_Background
			new string vS_gblS_Brewery_Top_3_visibility
			new string vS_gblS_Brewery_Top_3_Value
			new value vV_insp_Pix_ArrowAllSwitch_B1_Background
			new value gblS_swAllSwitch_Label_Text_Background
			new value vS_gblS_swAllSwitch_Label_Text_value
			new string vS_gblS_swAllSwitch_Label_Text_visibility
			//...........................................................
	vS_gblS_Brewery_Top_2_visibility = "gblS_Brewery_Top_2" visibility
	vS_gblS_Brewery_Top_2_Value = "gblS_Brewery_Top_2" value
	vV_gblS_Brewery_Top_2_Background = "gblS_Brewery_Top_2" background
	vS_gblS_Brewery_Top_3_visibility = "gblS_Brewery_Top_3" visbility
	vS_gblS_Brewery_Top_3_Value = "gblS_Brewery_Top_3" value
	vV_gblS_Brewery_Top_3_Background = "gblS_Brewery_Top_3" background
	vV_insp_Pix_ArrowAllSwitch_B1 = "insp_Pix_ArrowAllSwitch_B1" background
	vV_gblS_swAllSwitch_Label_Text_Background = "gblS_Brewery_Top_3" background
	vS_gblS_swAllSwitch_Label_Text_value = "gblS_swAllSwitch_Label_Text" value
	vS_gblS_swAllSwitch_Label_Text_visibility = "gblS_swAllSwitch_Label_Text" visibility
		endif
		"gblV_Water_Switch_Status_Water" value = 403
		"gblV_Valve_Status" value = 1000
		start "sub_2_scrValveOperation" 
		wait "gblV_Valve_Status" value == 0
		endif
	"MB_34_do_GreenPump_B1" state = true
	"oldMB_15_do_QuadzillaContactor_Wo1" state = true
	"oldMB_07_PWM_Quadzilla_WO1" enabled = True
	"sw_Status_RIMs_Heat_On" state = true
	"gblS_Brewery_Bottom_1"	value = "Radiator RIMs Heater ON!"
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 3000
	"gblS_Brewery_Bottom_1" visibility = hidden
	if "sw_Restore_After_Heat" state == true
	"gblS_Brewery_Top_2" visibility = vS_gblS_Brewery_Top_2_visibility
	"gblS_Brewery_Top_2" value = vS_gblS_Brewery_Top_2_Value
	"gblS_Brewery_Top_2" background = vV_gblS_Brewery_Top_2_Background
	"gblS_Brewery_Top_3" visibility = vS_gblS_Brewery_Top_3_visibility
	"gblS_Brewery_Top_3" value = vS_gblS_Brewery_Top_3_Value
	"gblS_Brewery_Top_3" background = vV_gblS_Brewery_Top_3_Background
	"insp_Pix_ArrowAllSwitch_B1" background = vV_insp_Pix_ArrowAllSwitch_B1
	"gblS_Brewery_Top_3" background = vV_gblS_swAllSwitch_Label_Text_Background
	"gblS_swAllSwitch_Label_Text" value = vS_gblS_swAllSwitch_Label_Text_value
	"gblS_swAllSwitch_Label_Text" visibility = vS_gblS_swAllSwitch_Label_Text_visibility
	endif
endif
if "MB_19_do_RIMS_Radiator_Control_B1" state == false
	if "sw_Status_RIMs_Heat_On" state == true
	"oldMB_15_do_QuadzillaContactor_Wo1" state = false
	"oldMB_07_PWM_Quadzilla_WO1" enabled = false
	"sw_Status_RIMs_Heat_On" state = false
	if "MB_34_do_GreenPump_B1" state == true
	"gblS_Brewery_Bottom_1"	value = "Radiator RIMs Heater OFF!  You may consider turning off the Green Pump."
	else
	"gblS_Brewery_Bottom_1"	value = "Radiator RIMs Heater OFF!"
	endif
	"gblS_Brewery_Bottom_1" visibility = visible
	sleep 3000
	"gblS_Brewery_Bottom_1" visibility = hidden
	endif
endif
if "MB_34_do_GreenPump_B1" state == false
	if "sw_Status_RIMs_Heat_On" state == true
	"MB_19_do_RIMS_Radiator_Control_B1" state = false
	endif
endif
if "VGC_45_do_RadiatorTangental_On_B1" state == false
	if "sw_Status_RIMs_Heat_On" state == true
	"MB_19_do_RIMS_Radiator_Control_B1" state = false
	endif
endif
//.................................................................
goto "Heat_Loop"
stop "sub_scrHeaters"
```

## 61. sub_scrOpenAllValves

Starts by itself: No · User can start or stop it: Yes · 175 lines

```text
//sub_scrOpenAllValves
//04/16/2024:10:08
// MIT License Granted
//Copyright © OakBarn Brewery 2026
new string vSTimerName
new string vSTimerTime
new string vSTimerName
new string vSTimerName2
new string vSTimerName3
new string vSTimerTime
new time vT_Valve_Delay
vSTimerTime = "gblTValveDelay" value 
vT_Valve_Delay = "gblTValveDelay" value 
vSTimerName = "Valve Delay: " + vSTimerTime
vSTimerName2 = "Reposition will take " + vSTimerTime
vSTimerName3 = "Short Delay of " + vSTimerTime
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"tmBottomRight_B1" type = countdown
// print 1
"tmBottomRight_B1" displayname = vSTimerName
// print 2
//Element Control
"MB_19_do_RIMS_Radiator_Control_B1" state = false
"sw_Control_BigMac_Element" state = false
//Pump Control
"MB_35_do_YellowPump_B1" state = false
"MB_36_do_RedPump_B1" state = false
"MB_33_do_BluePump_B1" state = false
"MB_34_do_GreenPump_B1" state = false
"MB_32_do_WhitePump_B1" state = false
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"tmBrewDay_B1" visibility = visible
//Backgrounds
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait: Valves Repositioning"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
//Beer Name
"gblS_BrewName_B1" value = "Opening All Valves"
//Valve Staus
"gblV_Valve_Status" value = 1 
//Start Opening Valves
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "  "
"gblS_Brewery_Top_3" value = "First Set: All Valves will open in different sections.  Each set will take " + vSTimerTime
"gblS_Brewery_Top_3" visibility = visible
 //VA 1
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Top_3" visibility = visible
"VGC_49_do_WhitePumpValve_On_B1" state = true
//VB 1
"VGC_26_do_Right_MLT_Isolation_On_B1" state = true
//VC 1
"VGC_3_do_RedPumpValve_On_B1" state = true
// VD 1
"VGC_25_do_LittleMacTangental_ON_B1" state = true
// Time Delay
"tmBottomRight_B1" value = vT_Valve_Delay
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait  "tmBottomRight_B1" value <=  00:00:00
stop "tmBottomRight_B1" 
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "2nd Set: All Valves will open in different sections.  This set will take " + vSTimerTime
"gblS_Brewery_Top_3" value = " " 
"gblS_Brewery_Bottom_3" visibility = visible
//VA 2
"VGC_47_do_BigMacTangental_On_B1" state = true
//VB 2
"VGC_28_do_CrossManifold_On_B1" state = true
//VC 2
"VGC_5_do_FermentFill_On_B1" state = true
// VD 2
"VGC_23_do_BackManifold_Left_On_B1" state = true
// Time Delay
"tmBottomRight_B1" value = vT_Valve_Delay
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait  "tmBottomRight_B1" value <=  00:00:00
stop "tmBottomRight_B1" 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "  "
"gblS_Brewery_Top_3" value = "3rd Set: All Valves will open in different sections.  This set will take " + vSTimerTime
"gblS_Brewery_Top_3" visibility = visible
//VA 3
"VGC_45_do_RadiatorTangental_On_B1" state = true
//VB 3
"VGC_30_do_FireHose_On_B1" state = false
//VC 3
"VGC_7_do_Left_MLT_Isolation_On_B1" state = true
// VD 3
"VGC_15_do_YellowPumpValve_On_B1" state = true
// Time Delay
"tmBottomRight_B1" value = vT_Valve_Delay
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait  "tmBottomRight_B1" value <=  00:00:00
stop "tmBottomRight_B1"
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "4th Set: All Valves will open in different sections.  This set will take " + vSTimerTime
"gblS_Brewery_Top_3" value = " " 
"gblS_Brewery_Bottom_3" visibility = visible
//VA 4
"VGC_43_do_CoolingWater_On_B1" state = false
//VB  4
"VGC_32_do_RadiatorSupply_On_B1" state = true
//VC 4
"VGC_8_do_BluePumpValve_On_B1" state = true
// VD 4
"VGC_17_do_LittleMacIsolation_On_B1" state = true
// Time Delay
"tmBottomRight_B1" value = vT_Valve_Delay
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait  "tmBottomRight_B1" value <=  00:00:00
stop "tmBottomRight_B1" 
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "  "
"gblS_Brewery_Top_3" value = "Final Set: This is the Last Set..  This set will take " + vSTimerTime
"gblS_Brewery_Top_3" visibility = visible
//VA 5
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
//VB 5
 "VGC_34_do_BigMac_Isolation_On_B1" state = true
//VC 5
"VGC_13_do_HermsWort_On_B1" state = true
// VD 5
"VGC_19_do_BrewKettleTangental_On_B1" state = true
"VGC_39_Back_Drain_On_B1" state = true

// Time Delay
"tmBottomRight_B1" value = vT_Valve_Delay
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait  "tmBottomRight_B1" value <=  00:00:00
stop "tmBottomRight_B1" 
//Set Final
//VB 6
[ender]
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Top_3" value = "All Valves are opened. there is a short delay of  3 Seconds" 
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" value = "All Valves Open."
// Time Delay
"tmBottomRight_B1" displayname = "Cleaning Up"
"tmBottomRight_B1" value = 00:00:03
start "tmBottomRight_B1"
"tmBottomRight_B1" visibility = visible
wait  "tmBottomRight_B1" value <=  00:00:00
stop "tmBottomRight_B1"
"tmBottomRight_B1" visibility = hidden
"gblS_Brewery_Top_3" value = " " 
"gblS_Brewery_Top_3" visibility = hidden
//Beer Name
"gblS_BrewName_B1" value = "All Valves Open"
//Valve Staus
"gblV_Valve_Status" value = 0 
clear

stop "sub_scrOpenAllValves"
```

## 62. sub_scrChoose_Fermentor

Starts by itself: No · User can start or stop it: Yes · 115 lines

```text
// sub_scrChoose_Fermentor
//07/05/2026 16:15
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// MODIFIED 07/05/2026 16:15
"sw_Running_Fermentor_Chosen" state = true
//..................................
show workspace "B1 Brewery"
new value vVBrewStatus
new string vSMsg
new string vSMsg1
new string vSMsg_List
new string vS_Ferment_1
new string vS_Ferment_2
new string vS_Ferment_3
new string vS_Ferment_4
new string vS_Ferment_5
new string vS_Ferment_6
vS_Ferment_1 = "gblS_Fermentor_Name_1" value
vS_Ferment_2 = "gblS_Fermentor_Name_2" value
vS_Ferment_3 = "gblS_Fermentor_Name_3" value
vS_Ferment_4 = "gblS_Fermentor_Name_4" value
vS_Ferment_5 = "gblS_Fermentor_Name_5" value
vS_Ferment_6 = "gblS_Fermentor_Name_6" value
new value vV_Fementor_Filling
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
 vSMsg_List = vSMsg
 [Start_Choice]
"gblS_swAllSwitch_Label_Text" value = "Choose Fermentor!"
"gblS_BrewName_B1" value = "Choose One of the Above."
"gblS_Brewery_Top_2" value = vSMsg_List
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//background
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"gblS_swAllSwitch_Label_Text" background = 1
"gblVReport_B1" background = 1
"gblS_Brewery_Top_2" background = 1
"gblVReport_B1" background = 1
"gblS_swAllSwitch_Label_Text"  background = 1
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = Visible 
"gblS_BrewName_B1" visibility = Visible 
"sw_Advance_ BrewStatus" visibility = hidden
//..........................................................................................
wait "gblVReport_B1" value  > 0
[Loop_Choice]
sleep 100
if "gblVReport_B1" value  < 7
goto "Fermentor_Chosen"
endif
if "gblVReport_B1" value > 6
"gblS_Brewery_Top_2" background = 2
"gblS_Brewery_Top_2" value = "Choose from 1 to 6 Only!"
"gblS_swAllSwitch_Label_Text"  background = 2
"gblS_swAllSwitch_Label_Text" value = "Wrong Choice"
"gblS_BrewName_B1" value = "Not in List."
"gblS_swAllSwitch_Label_Text"  background = 3
sleep 3000
goto "Start_Choice"
endif
goto "Loop_Choice"
[Fermentor_Chosen]
vV_Fementor_Filling = "gblVReport_B1" value
print 108
print vV_Fementor_Filling
new value x
x = "gblVReport_B1" value
print  x
//"gblV_Fermentor_Filling" value = "gblV_Fermentor_Filling" value
"gblV_Fermentor" value = vV_Fementor_Filling
"sw_Running_Fermentor_Chosen" state = false
stop "sub_scrChoose_Fermentor"
```

## 63. sub_scrFermentor_Set_Status_Select

Starts by itself: No · User can start or stop it: Yes · 280 lines

```text
//sub_scrFermentor_Set_Status_Select
//05/25/2026 05:51
// modified 08/25/2026 14:51
// MIT License Granted
//Copyright © OakBarn Brewery 2026
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...................................
"sw_Running_Fermentor_Status_Select" state = true
new bool vB_Skip
vB_Skip = false
new value vV_Flow_Brew
vV_Flow_Brew = "gblV_Brew_Status" value
new string vSMsg
new string vSMsg1
new string vSMsg_End
new string vS_Current_Status
new string vS_Fermentor_Name
new string vS_Status
new value vV_Brew_Status
new value vV_Status
new value vV_Fermentor
vS_Current_Status = "gblS_Bottom_Text" value
vS_Fermentor_Name = "gblS_Top_Text" value
vV_Fermentor = "gblV_Fermentor" value
vV_Status = "gblV_Node_Red_Imported" value 
show workspace "B1 Brewery"
"gblS_BrewName_B1" value = vS_Current_Status

vS_Current_Status = vSMsg
"gblS_BrewName_B1" value = vS_Current_Status
vSMsg = vS_Fermentor_Name
if vV_Brew_Status < 100
vSMsg_End = "  The Fermentor Status will be reviewed again at the END of the Whirlpool"
"gblS_Brewery_Bottom_3" value = vSMsg_End
endif
if vV_Brew_Status > 90
vSMsg_End = "  The Fermentors must be Cleaned, Sanitized, Drained && ALL Fermentor Valves Closed. Ready to accept WORT.  The Status must be 5: READY!"
"gblS_Brewery_Bottom_3" value = vSMsg_End
vB_Skip = true
endif
if vV_Status == 0
	vSMsg1 = ":  The Status = Unknown. Find out what the Status is and Set It. " 
	vSMsg_End = "If left as Unknown, the Fermentor will NOT be reviewed later. "
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 1
	vSMsg1 = ":  The Status = Fermenting.  If that is still correct, Select 7 =  No Change Next. "
	vSMsg_End = "If left as Fermenting, the Fermentor will NOT be reviewed later."
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif 
if vV_Status == 2
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
if vV_Brew_Status > 90
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 3
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, the Fermentor should be Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 4
	vSMsg1 = ": Status = Sanitized.  The Sanitizer may be drained at the end of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status =  Sanitized.  If you intend to use this Fermentor, it must be made ready.  Drain the Sanitizer while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 5
vSMsg1 = ": Status = Ready.   The Sanitizer is drained and all Fermentor Drain Valves Shut!  The Fermentor is Ready for WORT."
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 6
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, it must be made ready.   A liitle late if you have not started when first warned."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_swAllSwitch_Label_Text" background = 2
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
if vV_Status == 0
// Inspector 0range
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 3
"insp_2_LeftMiddle_B1" visibility = visible
endif
if vV_Status == 1
"gblS_swAllSwitch_Label_Text" background = 1
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
endif
//............................................................//............................................................
vSMsg = vS_Fermentor
vSMsg1 = ":   Change?\n"
vSMsg = vSMsg + vSMsg1
vSMsg1 = "1 = Fermenting\n2 = Available\n3 = Clean\n4 = Sanitized\n5 = Ready\n6 = Dirty"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg 
[Redo_Choice_1]
"gblSReportLabel_B1" value = "Change Fermentor Status?"
"gblS_swAllSwitch_Label_Text" value = "7 = N0 Change"
//background
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//.....................................................
wait "gblVReport_B1" value > 0
if "gblVReport_B1" value == 1
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 2
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 3
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 4
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 5
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 6
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 7
goto "No_Change_Status1"
endif
if "gblVReport_B1" value > 7
"gblS_swAllSwitch_Label_Text" value = "1 to 7 Only"
sleep 3000
goto "Redo_Choice_1"
endif
[End_Choice_Status1]
if vV_Fermentor == 1
"gblV_FermentStatus_1" value = "gblVReport_B1" value
vSMsg = "Fermentor # 1 Status Updated"
goto "Message_Change"
endif
if vV_Fermentor == 2
"gblV_FermentStatus_2" value = "gblVReport_B1" value
vSMsg = "Fermentor # 2 Status Updated"
goto "Message_Change"
endif
if vV_Fermentor == 3
"gblV_FermentStatus_3" value = "gblVReport_B1" value
vSMsg = "Fermentor # 3 Status Updated"
goto "Message_Change"
endif
if vV_Fermentor == 4
"gblV_FermentStatus_4" value = "gblVReport_B1" value
vSMsg = "Fermentor # 4 Status Updated"
goto "Message_Change"
endif
if vV_Fermentor == 5
"gblV_FermentStatus_5" value = "gblVReport_B1" value
vSMsg = "Fermentor # 5 Status Updated"
goto "Message_Change"
endif
if vV_Fermentor == 6
"gblV_FermentStatus_6" value = "gblVReport_B1" value
vSMsg = "Fermentor # 6 Status Updated"
goto "Message_Change"
endif
[No_Change_Status1]
if vV_Fermentor == 1
vSMsg = "Fermentor # 1 Status NOT Changed!"
goto "Message_Change"
endif
if vV_Fermentor == 2
vSMsg = "Fermentor # 2 Status NOT Changed!"
goto "Message_Change"
endif
if vV_Fermentor == 3
vSMsg = "Fermentor # 3 Status NOT Changed!"
goto "Message_Change"
endif
if vV_Fermentor == 4
vSMsg = "Fermentor # 4 Status NOT Changed!"
goto "Message_Change"
endif
if vV_Fermentor == 5
vSMsg = "Fermentor # 5 Status NOT Changed!"
goto "Message_Change"
endif
if vV_Fermentor == 6
vSMsg = "Fermentor # 6 Status NOT Changed!"
goto "Message_Change"
endif
[Message_Change]
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" background = 1
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
[End_Select]
start "inscpt_scrFermentorStatus"
wait "sw_Running_Fermentor_Finished" state == false
clear
"sw_Running_Fermentor_Status_Select" state = false
stop "sub_scrFermentor_Set_Status_Select"
```

## 64. sub_scrManifold_Choice

Starts by itself: No · User can start or stop it: Yes · 1725 lines

```text
//sub_scrManifold_Choice  Modified 260729 11-51 
//08/08/2022 8:02
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// modified 07/01/2026 09:07
// set  gblV_Water_Switch_Status_Water value =   in scrBrew (or any other script)
//then call this script with the start command
// kills itself autOmatically
//.................................................
//Major Rewrite (generally Replacement) 01/04/2026 08:47
//goto "SkipTest"
//Test.........................................
//Test.........................................
//Test.........................................
"gblVEndlessLoop" value = 1.000
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
"sw_Running_Manifold_Choice" state = true
start "inscpt_scrBrewChoiceOpen"
//................................
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
"gblSReportLabel_B1" value = "New Start"
"gblV_Valve_Status" value = 1000
"sw_Flow_Skip_TimeorVolume" state = true
start "inscpt_scr_Inner_Blue"
new value vVValveSet 
vVValveSet precision = 0
vVValveSet = "gblV_Water_Switch_Status_Water" value
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vS_Manifold_Set
new string vSMsg_Adjust
new string vSMsg_Isolation
new string vS_Name_Fermentor
new bool vB_Prime_Basic
new value vV_BrewStatus
new value vV_Brew_Valves
new value vV_Vessel_Measure
new value vV_Vessel_To
new value vV_Vessel_From
new string vS_Vessel_From
new string vS_Vessel_To
new string vS_Vessel_Measure
new string vS_Vessel_Adjust
new string vS_Pump
new value vV_Volume_Vessel_To_Max
new value vV_Volume_Vessel_From_Current
new value vV_Volume_Vessel_To_Current
new value vV_Volume_Vessel_Measure_Start
new value vV_Volume_Vessel_Adjust_Start
new value vV_Volume_Vessel_To_Desired
//........................
new value vV_Isolation_Valve
start "inscpt_scrAlarm"
sleep 100
wait "sw_Running_Alarm_Clear" state == false
"gblV_Vessel_To" value = 0
"gblV_Start_From" value = 0 
"gblV_Vessel_Measure" value = 0
"gblV_Isolation_Valve" value = 0
"gblV_Pump" value  = 0
"glbV_Vessel_Adjust" value = 0
"gblV_Volume_Max" value = 0
"gblS_Vessel_From" value = "Not Set"
"gblS_Vessel_From" value = "Not Set"
"gblS_Pump" value = "Not Set"
 "gblS_Vessel_Adjust" value = "Not Set"
//...........................................
//...........................................
"gblVEndlessLoop" value = 1.100

if "sw_Status_Script_From_Script" state == true
 vV_Volume_Vessel_To_Desired = "gblV_Gals_to_Fill" value
endif
"gblVEndlessLoop" value = 1.200
//.................................................
"sw_Running_ValveOperation" state = false
"sw_Running_Prime_Basic" state = false
"sw_Running_Fermentor_Chosen" state = false
"sw_Flow_Counter_Clockwise" state = false
//.................................................
"sw_Flow_From_Big_Mac" state = false
"sw_Flow_From_External" state = false
"sw_Flow_From_MSV" state = false
"sw_Flow_From_Radiator" state = false
"sw_Flow_From_MLT" state = false
"sw_Flow_From_Brew_Kettle" state = false
"sw_Flow_From_LittleMac" state = false
//.................................................
"sw_Flow_To_BigMac" state = false
"sw_Flow_To_External" state = false
"sw_Flow_To_Fermentor" state = false
"sw_Flow_To_Radiator" state = false
"sw_Flow_To_MLT" state = false
"sw_Flow_To_BK" state = false
"sw_Flow_To_LittleMac" state = false
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//........................................................
//........................................................
"gblVEndlessLoop" value = 1.3
if vVValveSet == 101
"gblVEndlessLoop" value = 1.01
"sw_Flow_Set_Manual" state = false
vB_Prime_Basic = true
vSMsg_Adjust = "Simple Recycling: " 
vSMsg_Isolation = " "
vS_Manifold_Set = "Manifold: Big Mac Recycle"
vSMsg2 = "Setting Manifold: Big Mac  Recycle"
"gblS_BrewName_B1" value = vSMsg2
	if "sw_Flow_Big_Mac_Do_Not_Turn_Heat_On" state == true
	vSMsg = "The Manifold will be set to Recycle the Big Mac.  The Big Mac Heater will ready 	turned on."
	else
	vSMsg = "The Manifold will be set to Recycle the Big Mac.  The Big Mac Heater and White 	Pump will be turned on."
	endif
goto "Skipped for Recycle"
endif
if vVValveSet == 202
"gblVEndlessLoop" value = 2.02
"sw_Flow_Set_Manual" state = false
vB_Prime_Basic = true
vSMsg_Adjust = "Simple Recycling: " 
vSMsg_Isolation = " "
vS_Manifold_Set = "Manifold: Radiator Recycle"
vSMsg2 = "Setting Manifold: Radiator Recycle"
"gblS_BrewName_B1" value = vSMsg2
vSMsg = "The Manifold will be set to Recycle the Radiator through the HERMs Coil."
goto "Skipped for Recycle"
endif
if vVValveSet == 303
"gblVEndlessLoop" value = 3.03
"sw_Flow_Set_Manual" state = false
vB_Prime_Basic = true
vB_Prime_Basic = true
vSMsg_Adjust = "Simple Recycling: " 
vSMsg_Isolation = " "
vS_Manifold_Set = "Manifold: Mash Tun Recycle"
vSMsg2 = "Setting Manifold: Mash Tun Recycle"
"gblS_BrewName_B1" value = vSMsg2
vSMsg = "The Manifold will be set to Recycle the Mash Tun through the HERMs Coil."
goto "Skipped for Recycle"
endif
if vVValveSet == 404
"gblVEndlessLoop" value = 4.04
"sw_Flow_Set_Manual" state = false
vB_Prime_Basic = true
vSMsg_Adjust = "Simple Recycling: " 
vSMsg_Isolation = " "
vS_Manifold_Set = "Manifold: Brew Kettle Recycle"
vSMsg2 = "Setting Manifold: Brew Kettle Recycle"
"gblS_BrewName_B1" value = vSMsg2
vSMsg = "The Manifold will be set to Recycle the Brew Kettle."
goto "Skipped for Recycle"
endif
if vVValveSet == 505
"gblVEndlessLoop" value = 5.05
"sw_Flow_Set_Manual" state = false
vB_Prime_Basic = true
vSMsg = "The Manifold will be set to Recycle the Little Mac."
vSMsg_Adjust = "Simple Recycling: " 
vSMsg_Isolation = " "
vS_Manifold_Set = "Manifold: Little Mac Recycle"
vSMsg2 = "Setting Manifold: Little Mac Recycle"
"gblS_BrewName_B1" value = vSMsg2
goto "Skipped for Recycle" 
endif
if vVValveSet == 707
"gblVEndlessLoop" value = 7.07
vB_Prime_Basic = true
vSMsg_Adjust = "Simple Recycling: " 
vSMsg_Isolation = " "
vS_Manifold_Set = "External: Brewzilla Recycle"
"gblS_BrewName_B1" value = vS_Manifold_Set
vSMsg = "Manually set the Brewzilla to  Recycle."
goto "Skipped for Recycle"
endif
if vVValveSet == 808
"gblVEndlessLoop" value = 8.08
vB_Prime_Basic = true
vSMsg_Adjust = "Simple Recycling: " 
vSMsg_Isolation = " "
vS_Manifold_Set = "External:: Digiboil Recycle"
"gblS_BrewName_B1" value = vS_Manifold_Set
vSMsg = "Manually set the Digiboil to  Recycle."
goto "Skipped for Recycle"
endif
if vVValveSet == 909
"gblVEndlessLoop" value = 9.09
vB_Prime_Basic = true
vSMsg_Adjust = "Simple Recycling: " 
vSMsg_Isolation = " "
vS_Manifold_Set = "External: 20 Gal Mash Tun Recycle"
"gblS_BrewName_B1" value = vS_Manifold_Set
vSMsg = "Manually set the 20 Gal Mash Tun to  Recycle."
goto "Skipped for Recycle"
endif
sleep 100
"gblVEndlessLoop" value = 1.4
// Set Some Valves to Off.....................
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_28_do_CrossManifold_On_B1" state = false
sleep 100
"VGC_23_do_BackManifold_Left_On_B1" state = false
sleep 100
"VGC_39_Back_Drain_On_B1" state = false
//............................
//............................
"gblVEndlessLoop" value = 1.5
vV_Brew_Valves = "gblV_Brew_Status" value
"sw_Flow_Set_Manual" state = false
"gblV_Vessel_From" value = 0
"gblV_Vessel_To" value = 0
"gblV_Vessel_Measure" value = 0
"glbV_Vessel_Adjust" value = 0
"gblV_Pump" value = 0
"gblV_Isolation_Valve" value = 0
//....................................
//Set Manifold by Valve Status
vVValveSet =  "gblV_Water_Switch_Status_Water" value
//............................
	if vVValveSet > 0
		if vVValveSet < 10
		//set pump to Manifold Supply Valve
		"gblV_Vessel_From" value = 100
		endif
	endif
 //.............................
if vVValveSet == 1
"gblVEndlessLoop" value = 1.0
print "@ 254 Fill Big Mac"
vS_Manifold_Set = "Manifold:Tap Water>Fills Big Mac(Big Mac Isolated)"
"gblV_Vessel_To" value = 1
"gblV_Vessel_Measure" value = 1
"gblV_Isolation_Valve" value = 1
goto "SectionSetManual"
endif
if vVValveSet == 2
"gblVEndlessLoop" value = 2.0
vS_Manifold_Set = "Manifold:Tap Water>Fills  Radiator(Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 2
"gblV_Vessel_Measure" value = 2
"gblV_Isolation_Valve" value = 2
////vB_Radiator = true
goto "SectionSetManual"
endif
if vVValveSet == 3
"gblVEndlessLoop" value = 3.0
vS_Manifold_Set = "Manifold:Tap Water>Fills  Mash Tun (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 3
"gblV_Vessel_Measure" value = 3
"gblV_Isolation_Valve" value = 14
goto "SectionSetManual"
endif
if vVValveSet == 4
"gblVEndlessLoop" value = 4.0
vS_Manifold_Set = "Manifold:Tap Water>Fills  Brew Kettle (Clockwise)"
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 4
"gblV_Isolation_Valve" value = 4
goto "SectionSetManual"
endif
if vVValveSet == 5
"gblVEndlessLoop" value = 5.0
vS_Manifold_Set = "Manifold:Tap Water>Fills  Little Mac (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 5
"gblV_Vessel_Measure" value = 5
"gblV_Isolation_Valve" value = 5
goto "SectionSetManual"
endif
if vVValveSet == 6
"gblVEndlessLoop" value = 6.0
vS_Manifold_Set = "Manifold:Tap Water>Fills  Fermentor (Clockwise)"
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 6
"gblV_Isolation_Valve" value = 6
goto "SectionSetManual"
endif
if vVValveSet == 7
"gblVEndlessLoop" value = 7.0
"sw_Flow_Set_Manual" state = true
vS_Manifold_Set = "Manifold:Tap Water>Fills  Brewzilla (Big Mac Isolated)"
"gblV_Vessel_To" value = 7
"gblV_Vessel_Measure" value = 7
goto "SectionSetManual"
endif
if vVValveSet == 8
"gblVEndlessLoop" value = 8.0
"sw_Flow_Set_Manual" state = true
vS_Manifold_Set = "Manifold:Tap Water>Fills  Digiboil (Big Mac Isolated)"
"gblV_Vessel_To" value = 8
"gblV_Vessel_Measure" value = 8
goto "SectionSetManual"
endif
if vVValveSet == 9
"gblVEndlessLoop" value = 9.0

"sw_Flow_Set_Manual" state = true
vS_Manifold_Set = "Manifold:Tap Water>Fills  20 Gal Mash Tun (Big Mac Isolated)"
"gblV_Vessel_To" value = 9
"gblV_Vessel_Measure" value = 9
goto "SectionSetManual"
endif
//............................
//............................
	if vVValveSet > 99
		if vVValveSet < 200
		"gblV_Vessel_From" value = 1
		vS_Vessel_From = "Big Mac"
		"sw_Control_BigMac_Element" state = false
		"MB_32_do_WhitePump_B1" state = false
		endif
	endif
//.............................
if vVValveSet == 102
"gblVEndlessLoop" value = 1.02
vS_Manifold_Set = "Manifold: Big Mac > Fill Radiator (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 2
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 2
"gblV_Isolation_Valve" value = 2
//vB_Radiator = true
goto "SectionSetManual"
endif
if vVValveSet == 103
"gblVEndlessLoop" value = 1.03
vS_Manifold_Set = "Manifold: Big Mac > Fill Mash Tun (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 3
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 3
"gblV_Isolation_Valve" value = 14
"sw_Flow_Counter_Clockwise" state = true
goto "SectionSetManual"
endif
if vVValveSet == 1031
"gblVEndlessLoop" value = 1.31
print "@366 1031"
vS_Manifold_Set = "Manifold: Big Mac > Flush HERMs (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_From" value = 1
vS_Vessel_From = "Big Mac"
"MB_32_do_WhitePump_B1" state = false
"gblV_Vessel_To" value = 3
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 3
"gblV_Isolation_Valve" value = 3
"sw_Flow_Counter_Clockwise" state = true
"sw_Flow_Sparge_1" state = true
goto "SectionSetManual"
endif
if vVValveSet == 1032
"gblVEndlessLoop" value = 1.32
print "@380 1032"
vS_Manifold_Set = "Manifold: Big Mac > Sparge Via HERMs (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_From" value = 1
vS_Vessel_From = "Big Mac"
"MB_32_do_WhitePump_B1" state = false
"gblV_Vessel_To" value = 3
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 3
"gblV_Isolation_Valve" value = 3
"sw_Flow_Counter_Clockwise" state = true
goto "SectionSetManual"
"sw_Flow_Sparge_1" state = true
endif
if vVValveSet == 104
"gblVEndlessLoop" value = 1.04
vS_Manifold_Set = "Manifold: Big Mac > Fill Brew Kettle (Clockwise)"
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 4
"gblV_Isolation_Valve" value = 4
goto "SectionSetManual"
endif
if vVValveSet == 1041
"gblVEndlessLoop" value = 1.41
vS_Manifold_Set = "Manifold: Big Mac > Top Off Brew Kettle (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_From" value = 1
vS_Vessel_From = "Big Mac"
"MB_32_do_WhitePump_B1" state = false
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 4
"gblV_Isolation_Valve" value = 4
goto "SectionSetManual"
endif
if vVValveSet == 105
"gblVEndlessLoop" value = 1.05
vS_Manifold_Set = "Manifold: Big Mac > Fill Little Mac (Clockwise)"
"gblV_Vessel_To" value = 5
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 5
"gblV_Isolation_Valve" value = 5
goto "SectionSetManual"
endif
if vVValveSet == 106
"gblVEndlessLoop" value = 1.06
vS_Manifold_Set = "Manifold: Big Mac > Fill Fermentor (Clockwise)"
"gblV_Vessel_To" value = 6
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 6
"gblV_Isolation_Valve" value = 6
goto "SectionSetManual"
endif
if vVValveSet == 107
"gblVEndlessLoop" value = 1.07
vS_Manifold_Set = "Manifold: Big Mac > Fill Brewzilla (Big Mac Isolated)"
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 7
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 7
goto "SectionSetManual"
endif
if vVValveSet == 108
"gblVEndlessLoop" value = 1.08
vS_Manifold_Set = "Manifold: Big Mac > Fill Digiboil (Big Mac Isolated)"
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 8
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 8
goto "SectionSetManual"
endif
if vVValveSet == 109
"gblVEndlessLoop" value = 1.09
vS_Manifold_Set = "Manifold: Big Mac > Fill 20 Gal Mash Tun (Big Mac Isolated)"
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 9
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 9
goto "SectionSetManual"
endif
//............................
//............................
	if vVValveSet > 199
		if vVValveSet < 300
		"gblV_Vessel_From" value = 2
		"glbV_Vessel_Adjust" value = 2
		//vB_Radiator = true
		"sw_Control_RIMs_Element" state = false
		"sw_Control_Radiator_Element" state  = false
		"MB_34_do_GreenPump_B1" state = false
		endif
	endif
//.............................
if vVValveSet == 201
"gblVEndlessLoop" value = 2.01
vS_Manifold_Set = "Manifold: Radiator > Fill Big Mac (Clockwise)"
"gblV_Vessel_To" value = 1
"gblV_Vessel_Measure" value = 1
"gblV_Isolation_Valve" value = 1
goto "SectionSetManual"
endif
if vVValveSet == 203
"gblVEndlessLoop" value = 2.03
vS_Manifold_Set = "Manifold: Radiator > Fill Mash Tun (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 3
"gblV_Vessel_Measure" value = 3
"gblV_Isolation_Valve" value = 3
goto "SectionSetManual"
endif
if vVValveSet == 204
"gblVEndlessLoop" value = 2.04
vS_Manifold_Set = "Manifold: Radiator > Fill Brew Kettle (Clockwise)"
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 4
"gblV_Isolation_Valve" value = 4
goto "SectionSetManual"
endif
if vVValveSet == 205
"gblVEndlessLoop" value = 2.05
vS_Manifold_Set = "Manifold: Radiator > Fill Little Mac (Clockwise)"
"gblV_Vessel_To" value = 5
"gblV_Vessel_Measure" value = 5
"gblV_Isolation_Valve" value = 5
goto "SectionSetManual"
endif
if vVValveSet == 206
"gblVEndlessLoop" value = 2.06
vS_Manifold_Set = "Manifold: Radiator > Fill Fermentor (Clockwise)"
"gblV_Vessel_To" value = 6
"gblV_Vessel_Measure" value = 2
"glbV_Vessel_Adjust" value = 6
"gblV_Isolation_Valve" value = 6
goto "SectionSetManual"
endif
if vVValveSet == 207
"gblVEndlessLoop" value = 2.07
vS_Manifold_Set = "Manifold: Radiator > Fill Brewzilla (Clockwise)"
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 7
"gblV_Vessel_Measure" value = 7
"gblV_Isolation_Valve" value = 7
goto "SectionSetManual"
endif
if vVValveSet == 208
"gblVEndlessLoop" value = 2.08
vS_Manifold_Set = "Manifold: Radiator > Fill Digiboil (Clockwise)"
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 8
"gblV_Vessel_Measure" value = 8
"gblV_Isolation_Valve" value = 7
goto "SectionSetManual"
endif
if vVValveSet == 209
"gblVEndlessLoop" value = 2.09
vS_Manifold_Set = "Manifold: Radiator > Fill 20 Gal Mash Tun (Clockwise)"
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 9
"gblV_Vessel_Measure" value = 2
"glbV_Vessel_Adjust" value = 9
"gblV_Isolation_Valve" value = 7
goto "SectionSetManual"
endif
//............................
//............................
	if vVValveSet > 299
		if vVValveSet < 400
		"gblV_Vessel_From" value = 3
		"glbV_Vessel_Adjust" value = 3
		"MB_33_do_BluePump_B1" state = false
		endif
	endif
//.............................
if vVValveSet == 301
"gblVEndlessLoop" value = 3.01
vS_Manifold_Set = "Manifold: Mash Tun > Fill Big Mac (Clockwise)"
"gblV_Vessel_To" value = 1
"gblV_Vessel_Measure" value = 1
"gblV_Isolation_Valve" value = 1
goto "SectionSetManual"
endif
if vVValveSet == 302
"gblVEndlessLoop" value = 3.02
vS_Manifold_Set = "Manifold: Mash Tun > Fill Radiator (Clockwise)"
"gblV_Vessel_To" value = 2
"gblV_Vessel_Measure" value = 2
"gblV_Isolation_Valve" value = 2
goto "SectionSetManual"
endif
if vVValveSet == 304
"gblVEndlessLoop" value = 3.04
vS_Manifold_Set = "Manifold: Mash Tun > Fill Brew Kettle (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 4
"gblV_Isolation_Valve" value = 4
goto "SectionSetManual"
endif
if vVValveSet == 3042
"gblVEndlessLoop" value = 3.42
vS_Manifold_Set = "Manifold: Mash Tun > 2nd Run Brew Kettle (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_From" value = 3
vS_Vessel_From = "Mash Tun"
"glbV_Vessel_Adjust" value = 3
"MB_33_do_BluePump_B1" state = false
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 4
"gblV_Isolation_Valve" value = 4
goto "SectionSetManual"
endif

if vVValveSet == 305
"gblVEndlessLoop" value = 3.05
vS_Manifold_Set = "Manifold: Mash Tun > Fill Little Mac (Counter-Clockwise) "
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 5
"gblV_Vessel_Measure" value = 5
"gblV_Isolation_Valve" value = 5
goto "SectionSetManual"
endif
if vVValveSet == 306
"gblVEndlessLoop" value = 3.06
//Abormal
vS_Manifold_Set = "Manifold: Mash Tun > Fill Ferementor (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 6
"gblV_Isolation_Valve" value = 6
goto "SectionSetManual"
endif
if vVValveSet == 307
"gblVEndlessLoop" value = 3.07
vS_Manifold_Set = "Manifold: Mash Tun > Fill Brewzilla (Clockwise)"
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 7
"gblV_Vessel_Measure" value = 7
"gblV_Isolation_Valve" value = 7
goto "SectionSetManual"
endif
if vVValveSet == 308
"gblVEndlessLoop" value = 3.08
vS_Manifold_Set = "Manifold: Mash Tun > Fill Digiboil (Clockwise)"
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 8
"gblV_Vessel_Measure" value = 8
"gblV_Isolation_Valve" value = 7
goto "SectionSetManual"
endif
if vVValveSet == 309
"gblVEndlessLoop" value = 3.09
//Abnormal
vS_Manifold_Set = "Manifold: Mash Tun > Fill 20 Gal Mash Tun (Clockwise)"
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 9
"gblV_Vessel_Measure" value = 9
"gblV_Isolation_Valve" value = 7
goto "SectionSetManual"
endif
//............................
	if vVValveSet > 399
		if vVValveSet < 500
		"gblV_Vessel_From" value = 4
		"sw_Control_Burner_BK" state = false
		"MB_36_do_RedPump_B1" state = false
		endif
	endif
//..............................
if vVValveSet == 401
"gblVEndlessLoop" value = 4.01
vS_Manifold_Set = "Manifold: Brew Kettle > Fill Big Mac (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 1
"gblV_Vessel_Measure" value = 1
"gblV_Isolation_Valve" value = 1
goto "SectionSetManual"
endif
if vVValveSet == 402
"gblVEndlessLoop" value = 4.02
vS_Manifold_Set = "Manifold: Brew Kettle > Fill Radiator (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 2
"gblV_Vessel_Measure" value = 2
"gblV_Isolation_Valve" value = 2
goto "SectionSetManual"
endif
if vVValveSet == 403
"gblVEndlessLoop" value = 4.03
vS_Manifold_Set = "Manifold: Brew Kettle > Fill Mash Tun (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 3
"gblV_Vessel_Measure" value = 3
"gblV_Isolation_Valve" value = 3
goto "SectionSetManual"
endif
if vVValveSet == 405
"gblVEndlessLoop" value = 4.05
vS_Manifold_Set = "Manifold: Brew Kettle > Fill Little Mac (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 5
"gblV_Vessel_Measure" value = 5
"gblV_Isolation_Valve" value = 5
goto "SectionSetManual"
endif
if vVValveSet == 406
"gblVEndlessLoop" value = 4.06
vS_Manifold_Set = "Manifold: Brew Kettle > Fill Fermentor (Clockwise)"
"gblV_Vessel_To" value = 6
"gblV_Isolation_Valve" value = 6
goto "SectionSetManual"
endif
if vVValveSet == 407
"gblVEndlessLoop" value = 4.07
vS_Manifold_Set = "Manifold: Brew Kettle > Fill Brewzilla (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 7
"gblV_Vessel_Measure" value = 7
"gblV_Isolation_Valve" value = 11
goto "SectionSetManual"
endif
if vVValveSet == 408
"gblVEndlessLoop" value = 4.08
vS_Manifold_Set = "Manifold: Brew Kettle > Fill Digiboil (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 8
"gblV_Vessel_Measure" value = 8
"gblV_Isolation_Valve" value = 11
goto "SectionSetManual"
endif
if vVValveSet == 409
"gblVEndlessLoop" value = 4.09
vS_Manifold_Set = "Manifold: Brew Kettle > Fill 20 Gal Mash Tun (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"sw_Flow_Set_Manual" state = true
"gblV_Vessel_To" value = 9
"gblV_Vessel_Measure" value = 4
"glbV_Vessel_Adjust" value = 9
"gblV_Isolation_Valve" value = 11
goto "SectionSetManual"
endif
//............................
	if vVValveSet > 499
		if vVValveSet < 600
		"gblV_Vessel_From" value = 5
		"sw_Control_Burner_LittleMac" state = false
		"MB_35_do_YellowPump_B1" state = false
		endif
	endif
//...............................
if vVValveSet == 501
"gblVEndlessLoop" value = 5.01
vS_Manifold_Set = "Manifold: Little Mac > Fill Big Mac (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 1
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 5
"gblV_Isolation_Valve" value = 1
goto "SectionSetManual"
endif
if vVValveSet == 502
"gblVEndlessLoop" value = 5.02
vS_Manifold_Set = "Manifold: Little Mac > Fill Radiator (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 2
"gblV_Vessel_Measure" value = 5
"glbV_Vessel_Adjust" value = 3
"gblV_Isolation_Valve" value = 2
//vB_Radiator = true
goto "SectionSetManual"
endif
if vVValveSet == 503
"gblVEndlessLoop" value = 5.03
vS_Manifold_Set = "Manifold: Little Mac > Fill Mash Tun (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 3
"gblV_Vessel_Measure" value = 5
"glbV_Vessel_Adjust" value = 3
"gblV_Isolation_Valve" value = 3
goto "SectionSetManual"
endif
if vVValveSet == 504
"gblVEndlessLoop" value = 5.04
vS_Manifold_Set = "Manifold: Little Mac > Brew Kettle (Clockwise)"
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 4
"gblV_Isolation_Valve" value = 4
"glbV_Vessel_Adjust" value = 4
goto "SectionSetManual"
endif
if vVValveSet == 506
vS_Manifold_Set = "Manifold: Little Mac > Fermentor (Clockwise)" 
"gblV_Vessel_To" value = 6
"gblV_Vessel_Measure" value = 5
"glbV_Vessel_Adjust" value = 6
"gblV_Isolation_Valve" value = 6
goto "SectionSetManual"
endif
if vVValveSet == 507
"gblVEndlessLoop" value = 5.07
vS_Manifold_Set = "Manifold: Little Mac > Fill Brewzilla (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 7
"gblV_Vessel_Measure" value = 7
"glbV_Vessel_Adjust" value = 5
"gblV_Isolation_Valve" value = 11
"sw_Flow_Set_Manual" state = true
goto "SectionSetManual"
endif
if vVValveSet == 508
"gblVEndlessLoop" value = 5.08
vS_Manifold_Set = "Manifold: Little Mac > Fill Digiboil (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 8
"gblV_Vessel_Measure" value = 8
"glbV_Vessel_Adjust" value = 5
"gblV_Isolation_Valve" value = 11
"sw_Flow_Set_Manual" state = true
goto "SectionSetManual"
endif
if vVValveSet == 509
"gblVEndlessLoop" value = 5.09
vS_Manifold_Set = "Manifold: Little Mac > Fill 20 Gal Mash Tun (Counter-Clockwise)"
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 9
"gblV_Vessel_Measure" value = 5
"glbV_Vessel_Adjust" value = 9
"gblV_Isolation_Valve" value = 11
"sw_Flow_Set_Manual" state = true
goto "SectionSetManual"
endif
//............................
	if vVValveSet > 699
		if vVValveSet < 800
		"gblV_Vessel_From" value = 7
		"sw_Flow_Set_Manual" state = true
		endif
	endif
//............................
if vVValveSet == 701
"gblVEndlessLoop" value = 7.01
vS_Manifold_Set = "Manifold:(Manual) Brewzilla > Big Mac (Big Mac Isolated)" 
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 1
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 7
"gblV_Isolation_Valve" value = 1
goto "SectionSetManual"
endif
if vVValveSet == 702
"gblVEndlessLoop" value = 7.02
vS_Manifold_Set = "Manifold:(Manual) Brewzilla > Radiator (Counter-Clockwise)" 
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 2
"gblV_Vessel_Measure" value = 7
"glbV_Vessel_Adjust" value = 1
"gblV_Isolation_Valve" value = 2
goto "SectionSetManual"
endif
if vVValveSet == 703
"gblVEndlessLoop" value = 7.03
vS_Manifold_Set = "Manifold:(Manual) Brewzilla > Mash Tun (Counter-Clockwise)" 
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 7
"gblV_Vessel_Measure" value = 7
"glbV_Vessel_Adjust" value = 3
"gblV_Isolation_Valve" value = 3
goto "SectionSetManual"
endif
if vVValveSet == 704
"gblVEndlessLoop" value = 7.04
vS_Manifold_Set = "Manifold:(Manual) Brewzilla > Brew Kettle (Clockwise)" 
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 7
"glbV_Vessel_Adjust" value = 4
"gblV_Isolation_Valve" value = 4
goto "SectionSetManual"
endif
if vVValveSet == 705
"gblVEndlessLoop" value = 7.05
vS_Manifold_Set = "Manifold:(Manual) Brewzilla > Little Mac (Clockwise)" 
"gblV_Vessel_To" value = 5
"gblV_Vessel_Measure" value = 7
"glbV_Vessel_Adjust" value = 5
"gblV_Isolation_Valve" value = 5
goto "SectionSetManual"
endif
if vVValveSet == 706
"gblVEndlessLoop" value = 7.06
vS_Manifold_Set = "Manifold:(Manual) Brewzilla > Fermentor (Clockwise)" 
"gblV_Vessel_To" value = 6
"gblV_Vessel_Measure" value = 7
"glbV_Vessel_Adjust" value = 6
"gblV_Isolation_Valve" value = 6
goto "SectionSetManual"
endif
if vVValveSet == 708
"gblVEndlessLoop" value = 7.08
start "sub_2_scrPrimeandBasicManifold"
sleep 100 
if vB_Testing == true
"gblS_Inter_Script" value = "@ 774 sub_scrManifold_Choice(Brewzilla>Digiboil) start: sub_2_scrPrimeandBasicManifold"
sleep 101
endif
wait "sw_Running_Prime_Basic" state == false
vS_Manifold_Set = "Totally External to the Brewery Manifold"
goto "ExitLoopValve"
endif
if vVValveSet == 709
"gblVEndlessLoop" value = 7.09
start "sub_2_scrPrimeandBasicManifold"
sleep 100 
if vB_Testing == true
"gblS_Inter_Script" value = "@ 786 sub_scrManifold_Choice(Brewzilla>20gMLT) start: sub_2_scrPrimeandBasicManifold"
sleep 101
endif
wait "sw_Running_Prime_Basic" state == false
vS_Manifold_Set = "Totally External to the Brewery Manifold"
goto "ExitLoopValve"
endif
//............................
	if vVValveSet > 799
		if vVValveSet < 900
		"gblV_Vessel_From" value = 8
		"sw_Flow_Set_Manual" state = true
		endif
	endif
//............................
if vVValveSet == 801
"gblVEndlessLoop" value = 8.01
vS_Manifold_Set = "Manifold:(Manual) Digiboil > Big Mac" 
"gblV_Vessel_To" value = 1
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 8
"gblV_Isolation_Valve" value = 2
"gblV_Isolation_Valve" value = 1
goto "SectionSetManual"
endif
if vVValveSet == 802
vS_Manifold_Set = "Manifold:(Manual) Digiboil > Radiator (Counter-Clockwise)" 
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 2
"gblV_Vessel_Measure" value = 8
"glbV_Vessel_Adjust" value = 2
"gblV_Isolation_Valve" value = 2
goto "SectionSetManual"
endif
if vVValveSet == 803
vS_Manifold_Set = "Manifold:(Manual) Digiboil > Mash Tun (Counter-Clockwise)" 
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 3
"gblV_Vessel_Measure" value = 8
"glbV_Vessel_Adjust" value = 3
"gblV_Isolation_Valve" value = 3
goto "SectionSetManual"
endif
if vVValveSet == 804
vS_Manifold_Set = "Manifold:(Manual) Digiboil > Brew Kettle (Clockwise) " 
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 8
"glbV_Vessel_Adjust" value = 4
"gblV_Isolation_Valve" value = 4
goto "SectionSetManual"
endif
if vVValveSet == 805
vS_Manifold_Set = "Manifold:(Manual) Digiboil > Little Mac (Clockwise)" 
"gblV_Vessel_To" value = 5
"gblV_Vessel_Measure" value = 8
"glbV_Vessel_Adjust" value = 5
"gblV_Isolation_Valve" value = 5
goto "SectionSetManual"
endif
if vVValveSet == 806
vS_Manifold_Set = "Manifold:(Manual) Digiboil > Fermentor (Clockwise)" 
"gblV_Vessel_To" value = 6
"gblV_Vessel_Measure" value = 8
"glbV_Vessel_Adjust" value = 6
"gblV_Isolation_Valve" value = 6
goto "SectionSetManual"
endif
if vVValveSet == 807
start "sub_2_scrPrimeandBasicManifold"
sleep 100 
if vB_Testing == true
"gblS_Inter_Script" value = "@ 857 sub_scrManifold_Choice(Digiboil>Brewzilla) start: sub_2_scrPrimeandBasicManifold"
sleep 101
endif
wait "sw_Running_Prime_Basic" state == false
vS_Manifold_Set = "Totally External to the Brewery Manifold"
goto "ExitLoopValve"
endif
if vVValveSet == 809
start "sub_2_scrPrimeandBasicManifold"
sleep 100 
if vB_Testing == true
"gblS_Inter_Script" value = "@ 857 sub_scrManifold_Choice(Digiboil>20gMLT) start: sub_2_scrPrimeandBasicManifold"
sleep 101
endif
wait "sw_Running_Prime_Basic" state == false
vS_Manifold_Set = "Totally External to the Brewery Manifold"
goto "ExitLoopValve"
endif
//............................
	if vVValveSet > 899
		if vVValveSet < 1000
		"gblV_Vessel_From" value = 9
		"sw_Flow_Set_Manual" state = true
		endif
	endif
//............................
if vVValveSet == 901
vS_Manifold_Set = "Manifold:(Manual Purple Pump) 20 Gal Mash Tun > Big Mac" 
"gblV_Vessel_To" value = 1
"gblV_Vessel_Measure" value = 1
"glbV_Vessel_Adjust" value = 9
"gblV_Isolation_Valve" value = 1
goto "SectionSetManual"
endif
if vVValveSet == 902
vS_Manifold_Set = "Manifold:(Manual Purple Pump) 20 Gal Mash Tun > Radiator (Counter-Clockwise)" 
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 2
"gblV_Vessel_Measure" value = 2
"glbV_Vessel_Adjust" value = 9
"gblV_Isolation_Valve" value = 2
goto "SectionSetManual"
endif
if vVValveSet == 903
vS_Manifold_Set = "Manifold:(Manual Purple Pump) 20 Gal Mash Tun > Mash Tun (Counter-Clockwise)" 
"sw_Flow_Counter_Clockwise" state = true
"gblV_Vessel_To" value = 3
"gblV_Vessel_Measure" value = 3
"glbV_Vessel_Adjust" value = 9
"gblV_Isolation_Valve" value = 3
goto "SectionSetManual"
endif
if vVValveSet == 904
vS_Manifold_Set = "Manifold:(Manual Purple Pump) 20 Gal Mash Tun > Brew Kettle (Clockwise)" 
"gblV_Vessel_To" value = 4
"gblV_Vessel_Measure" value = 4
"glbV_Vessel_Adjust" value = 9
"gblV_Isolation_Valve" value = 4
goto "SectionSetManual"
endif
if vVValveSet == 905
vS_Manifold_Set = "Manifold:(Manual Purple Pump) 20 Gal Mash Tun > Little Mac (Clockwise)" 
"gblV_Vessel_To" value = 5
"gblV_Vessel_Measure" value = 5
"glbV_Vessel_Adjust" value = 9
"gblV_Isolation_Valve" value = 5
goto "SectionSetManual"
endif
if vVValveSet == 906
vS_Manifold_Set = "Manifold:(Manual Purple Pump) 20 Gal Mash Tun > Fermentor (Clockwise)" 
"gblV_Vessel_To" value = 6
"gblV_Vessel_Measure" value = 6
"glbV_Vessel_Adjust" value = 9
"gblV_Isolation_Valve" value = 6
goto "SectionSetManual"
endif
if vVValveSet == 907
start "sub_2_scrPrimeandBasicManifold"
sleep 100 
if vB_Testing == true
"gblS_Inter_Script" value = "@ 941 sub_scrManifold_Choice(20GMLT>Brewzilla) start: sub_2_scrPrimeandBasicManifold"
sleep 101
endif
wait "sw_Running_Prime_Basic" state == false
vS_Manifold_Set = "Totally External to the Brewery Manifold"
goto "ExitLoopValve"
endif
if vVValveSet == 908
start "sub_2_scrPrimeandBasicManifold"
if vB_Testing == true
"gblS_Inter_Script" value = "@ 953 sub_scrManifold_Choice(20GMLT>DigiBoil) start: sub_2_scrPrimeandBasicManifold"
sleep 101
endif
wait "sw_Running_Prime_Basic" state == false
vS_Manifold_Set = "Totally External to the Brewery Manifold"
goto "ExitLoopValve"
endif
// vVValveSet not found
show workspace "B1 Brewery"
"gblS_Brewery_Bottom_1" background = 1
vsMsg = "Water Status Number "
vSMsg1 = vVValveSet
vsMsg = vsMsg + vsMsg1
vSMsg1 = " not set in script sub_2_scrValveOperation!"
vsMsg = vsMsg + vsMsg1
"gblS_Brewery_Bottom_1" value = vsMsg 
"gblS_Brewery_Bottom_1" visibility = visible
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Bottom_1" visibility = hidden
//....................................
[SectionSetManual]
//....................................
print "@1061 Set Vessel From"
if "gblV_Vessel_From" value == 0
		"gblV_Vessel_From" value = 99
		"gblV_Pump" value = 0
		"gblV_Start_From" value = 0
		"gblS_Vessel_From" value = "Not Set"
endif
if "gblV_Vessel_From" value == 1
		"gblV_Pump" value = 1
		"gblV_Start_From" value = "gblVCurrentBigMac_Volume" value
		"gblS_Vessel_From" value = "Big Mac"
		"gblS_Pump" value  = "White Pump"
		"sw_Flow_From_Big_Mac" state = true
endif
if "gblV_Vessel_From" value == 2
		"gblV_Pump" value = 2
		"gblV_Start_From" value = "gblVCurrentRadiator_Volume" value
		"gblS_Vessel_From" value = "Radiator"
		"gblS_Pump" value  = "Green Pump"
		"sw_Flow_From_Radiator" state = true
		endif
if "gblV_Vessel_From" value == 3
		"gblV_Pump" value = 3
		"gblV_Start_From" value = "gblVCurrentMLT_Volume" value
		"gblS_Vessel_From" value = "Mash Tun"
		"gblS_Pump" value  = "Blue Pump"
		"sw_Flow_From_MLT" state = true
endif
if "gblV_Vessel_From" value == 4
		"gblV_Pump" value = 4
		"gblV_Start_From" value = "gblVCurrentBrewKettle_Volume" value
		"gblS_Vessel_From" value = "Brew Kettle"
		"gblS_Pump" value  = "Red Pump"
		"sw_Flow_From_Brew_Kettle" state = true
endif
if "gblV_Vessel_From" value == 5
		"gblV_Pump" value = 4
		"gblV_Start_From" value = "gblVCurrentLittle_Volume" value
		"gblS_Vessel_From" value = "Little Mac"
		"gblS_Pump" value  = "Yellow Pump"
		"sw_Flow_From_LittleMac" state = true
endif
if "gblV_Vessel_From" value == 7
		"gblV_Start_From" value = "gblVCurrentBrewzilla_Volume" value
		"gblS_Vessel_From" value = "Brewzilla"
		"sw_Flow_From_External" state = true
		goto "Start_Choice_Pump"
endif
//................................................
//................................................
goto "Exit_Pump_Choice"
[Wrong_Choice_Pump]
		"gblVReport_B1" visibility = hidden
		"gblVReport_B1" value = 0
		"gblS_Brewery_Top_1" background = 1
		"gblS_Brewery_Top_1" value = vSMsg1
		sleep 101
		"gblVReport_B1" visibility = visible
		"gblS_Brewery_Top_1" background = 2
		"gblS_Brewery_Top_1" value = vSMsg
[Start_Choice_Pump]
"gblS_BrewName_B1" value = "Choose a Pump"
		//........................................
		vSMsg1 = "There are ONLY TW0 Pump Choices transferring from the Brewzilla.\nChoose 1 or 2 Only!\n1 = Manual Brewzilla Manual Pump (Switch on Brewzilla\n2= Manual Purple Pump"

		vSMsg = "There are two Pump Choices transferring from the Brewzilla\n1 = Manual Brewzilla Pump (Switch on Brewzilla\n2= Manual Purple Pump\n\nChoose 1 0r 2 Only"
		//.....................................................
		"gblS_swAllSwitch_Label_Text" value =  "Choose 1 0r 2 Only"
		"gblS_Brewery_Top_1" value = vSMsg
		"gblSReportLabel_B1" value = "1=Brewzilla Pump\n2=Purple Pump"
		"gblVReport_B1" background = 1
		"gblVReport_B1" precision = 0
		"gblVReport_B1" value = 0
//........................................
//Inspector_Black
"gblV_Set_BackGround_Middle_Time" value = 1
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
[Loop_Choice_Pump]
sleep 100
if "gblVReport_B1" value == 1
"gblV_Pump" value = 7
"gblS_Pump" value  = "Manual Brewzilla Pump"
goto "Exit_Pump_Choice"
endif
if "gblVReport_B1" value == 2
"gblV_Pump" value = 2
"gblS_Pump" value  = "Manual Purple Pump"
goto "Exit_Pump_Choice"
endif
if "gblVReport_B1" value > 2
goto "Wrong_Choice_Pump"
endif
goto "Loop_Choice_Pump"
[Exit_Pump_Choice]
if "gblV_Vessel_From" value == 8
		"gblV_Pump" value = 9
		"gblV_Start_From" value = "gblVCurrentDigiboil_Volume" value
		"gblS_Vessel_From" value = "Digiboil"
		"gblS_Pump" value  = "Manual Purple Pump"
		"sw_Flow_From_External" state = true
endif
if "gblV_Vessel_From" value == 9
		"gblV_Pump" value = 9
		"gblV_Start_From" value = "gblVCurrent20GMLT_Volume" valuee
		"gblS_Vessel_From" value = "20g MLT"
		"gblS_Pump" value  = "Manual Purple Pump"
		"sw_Flow_From_External" state = true
endif
if "gblV_Vessel_From" value == 100
		"gblV_Pump" value = 100
		"gblV_Start_From" value = 99
		"gblS_Vessel_From" value = "MSV (Tap)"
		"gblS_Pump" value  = "MSV (Tap)"
		"sw_Flow_From_MSV" state = true
endif
//........................................................
//........................................................
print "@1193 Set Vessel To"
if "gblV_Vessel_To" value == 0
"gblV_Start_To" value = 0
"gblS_Vessel_To" value = "Not Set"
"gblV_Volume_Max" value = 0
endif
if "gblV_Vessel_To" value == 1
"gblV_Start_To" value = "gblVCurrentBigMac_Volume" value
"gblS_Vessel_To" value = "Big Mac"
"gblV_Volume_Max" value = 49
"sw_Flow_To_BigMac" state = true
goto "Vessel_Measure"
endif
if "gblV_Vessel_To" value == 2
"gblV_Start_To" value = "gblVCurrentRadiator_Volume" value
"gblS_Vessel_To" value = "Radiator"
"gblV_Volume_Max" value = 13.5
"sw_Flow_To_Radiator" state = true
	if "sw_Status_DeadSpace_Radiator" state == false
		"gblV_Volume_Max" value = 15.8
		"gblV_Start_Adjust" value = -2.3
			if "sw_Status_Script_From_Script" state == true
			 vV_Volume_Vessel_To_Desired = vV_Volume_Vessel_To_Desired  - 2.3
			endif
	endif
goto "Vessel_Measure"
endif
if "gblV_Vessel_To" value == 3
"gblV_Start_To" value = "gblVCurrentMLT_Volume" value
"gblS_Vessel_To" value = "Mash Tun"
"gblV_Volume_Max" value = 43
"sw_Flow_To_MLT" state = true
goto "Vessel_Measure"
endif
if "gblV_Vessel_To" value == 4
"gblV_Start_To" value = "gblVCurrentBrewKettle_Volume" value
"gblS_Vessel_To" value = "Brew Kettle"
"gblV_Volume_Max" value = 43
"sw_Flow_To_BK" state = true
goto "Vessel_Measure"
endif
if "gblV_Vessel_To" value == 5
"gblV_Start_To" value = "gblVCurrentLittle_Volume" value
"gblS_Vessel_To" value = "Little Mac"
"gblV_Volume_Max" value = 43
"sw_Flow_To_LittleMac" state = true
goto "Vessel_Measure"
endif
if "gblV_Vessel_To" value == 6
"sw_Flow_To_Fermentor" state = true
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" value = "Choose a Fermentor to fill.  There are 6 Fermentors available.  One of the six must be chosen."  
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance."
"gblS_BrewName_B1" value = "Choose 1 to 6"
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"gblS_Brewery_Top_2" background = 1
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_swAllSwitch_Label_Text" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
start "sub_scrChoose_Fermentor"
sleep 100 
if vB_Testing == true
"gblS_Inter_Script" value = "@ 1194 sub_scrManifold_Choice start: sub_scrChoose_Fermentor"
sleep 101
endif
wait "sw_Running_Fermentor_Chosen" state == false
"gblVReport_B1"  visibility = hidden
new value vV_Fermentor
vV_Fermentor = "gblV_Fermentor" value
	if vV_Fermentor == 1
	"gblS_Vessel_To" value = "gblS_Fermentor_Name_1" value
	"gblV_Volume_Max" value = "gblVFerment_Volume_1" value
	endif
	if vV_Fermentor == 2
	"gblS_Vessel_To" value = "gblS_Fermentor_Name_2" value
	"gblV_Volume_Max" value = "gblVFerment_Volume_2" value
	endif
	if vV_Fermentor == 3
	"gblS_Vessel_To" value = "gblS_Fermentor_Name_3" value
	"gblV_Volume_Max" value = "gblVFerment_Volume_3" value
	endif
	if vV_Fermentor == 4
	"gblS_Vessel_To" value = "gblS_Fermentor_Name_4" value
	"gblV_Volume_Max" value = "gblVFerment_Volume_4" value
	endif
	if vV_Fermentor == 5
	"gblS_Vessel_To" value = "gblS_Fermentor_Name_5" value
	"gblV_Volume_Max" value = "gblVFerment_Volume_5" value
	endif
	if vV_Fermentor == 6
	"gblS_Vessel_To" value = "gblS_Fermentor_Name_6" value
	"gblV_Volume_Max" value = "gblVFerment_Volume_6" value
	endif
goto "Vessel_Measure"
endif
if "gblV_Vessel_To" value == 7
"gblV_Start_To" value = "gblVCurrentBrewzilla_Volume" value
"gblS_Vessel_To" value = "Brewzilla"
"gblV_Volume_Max" value = 15
"sw_Flow_To_External" state = true
goto "Vessel_Measure"
endif
if "gblV_Vessel_To" value == 8
"gblV_Start_To" value = "gblVCurrentDigiboil_Volume" value
"gblS_Vessel_To" value = "Digiboil"
"gblV_Volume_Max" value = 8
"sw_Flow_To_External" state = true
goto "Vessel_Measure"
endif
if "gblV_Vessel_To" value == 9
"gblV_Start_To" value = "gblVCurrent20GMLT_Volume" value
"gblS_Vessel_To" value = "20g MLT"
"gblV_Volume_Max" value = 20
"sw_Flow_To_External" state = true
goto "Vessel_Measure"

endif
//........................................................
//........................................................
[Vessel_Measure]
print "@1335 Set Vessel Measure"
if "gblV_Vessel_Measure" value == 0
vV_Vessel_Measure = 0
vS_Vessel_Measure = " "
vV_Volume_Vessel_Measure_Start = 0
endif
if "gblV_Vessel_Measure" value == 1
"gblS_Vessel_Measure" value = "Big Mac"
goto "Vessel_Adjust"
endif
if "gblV_Vessel_Measure" value == 2
"gblS_Vessel_Measure" value = "Radiator"
goto "Vessel_Adjust"
endif
if "gblV_Vessel_Measure" value == 3
"gblS_Vessel_Measure" value = "Mash Tun"
goto "Vessel_Adjust"
endif
if "gblV_Vessel_Measure" value == 4
"gblS_Vessel_Measure" value = "Brew Kettle"
goto "Vessel_Adjust"
endif
if "gblV_Vessel_Measure" value == 5
"gblS_Vessel_Measure" value = "Little Mac"
goto "Vessel_Adjust"
endif
if "gblV_Vessel_Measure" value == 6
"gblS_Vessel_Measure" value = "Fermentor"
goto "Vessel_Adjust"
endif
if "gblV_Vessel_Measure" value == 7
"gblS_Vessel_Measure" value =  "Brewzilla"
goto "Vessel_Adjust"
endif
if "gblV_Vessel_Measure" value == 8
"gblS_Vessel_Measure" value =  "Digiboil"
goto "Vessel_Adjust"
endif
if "gblV_Vessel_Measure" value == 9
"gblS_Vessel_Measure" value =  "20g MLT"
goto "Vessel_Adjust"
endif
//........................................................
//........................................................
[Vessel_Adjust]
print "@1380 Set Vessel Adjust"
if "glbV_Vessel_Adjust" value == 0
"gblS_Vessel_Adjust" value = "Not Set"
vV_Volume_Vessel_Adjust_Start = 0
endif
if "glbV_Vessel_Adjust" value == 1
"gblS_Vessel_Adjust" value = "Big Mac"
"gblV_Start_Adjust" value = "gblVCurrentBigMac_Volume" value
endif
if "glbV_Vessel_Adjust" value == 2
"gblS_Vessel_Adjust" value = "Radiator"
"gblV_Start_Adjust" value = "gblVCurrentRadiator_Volume" value
endif
if "glbV_Vessel_Adjust" value == 3
"gblS_Vessel_Adjust" value = "Mash Tun"
"gblV_Start_Adjust" value = "gblVCurrentMLT_Volume" value
endif
if "glbV_Vessel_Adjust" value == 4
"gblS_Vessel_Adjust" value = "Brew Kettle"
"gblV_Start_Adjust" value = "gblVCurrentBrewKettle_Volume" value
endif
if "glbV_Vessel_Adjust" value == 5
"gblS_Vessel_Adjust" value = "Little Mac"
"gblV_Start_Adjust" value = "gblVCurrentLittle_Volume" value
endif
if "glbV_Vessel_Adjust" value == 6
"gblS_Vessel_Adjust" value = "Fermentors"
"gblV_Start_Adjust" value = 0
endif
if "glbV_Vessel_Adjust" value == 7
"gblS_Vessel_Adjust" value = "Brewzilla"
"gblV_Start_Adjust" value = "gblVCurrentBrewzilla_Volume" value
endif
if "glbV_Vessel_Adjust" value == 8
"gblS_Vessel_Adjust" value = "Digiboil"
"gblV_Start_Adjust" value = "gblVCurrentDigiboil_Volume" value
endif
if "glbV_Vessel_Adjust" value == 9
"gblS_Vessel_Adjust" value = "20g MLT"
"gblV_Start_Adjust" value = "gblVCurrent20GMLT_Volume" value
endif
//........................................................
//........................................................
[Isolation_Valve]
vV_Isolation_Valve = "gblV_Isolation_Valve" value
if vV_Isolation_Valve == 0
vSMsg_Isolation = ""
goto "Skip_Isolation"
endif
print "@1429 Isolation Valve Text Set: "
if vV_Isolation_Valve == 1
vSMsg_Isolation = "Isolation Valves : White Pump Supply && Big Mac Tangental Valve.  Both will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 2
vSMsg_Isolation = "Isolation Valve : Radiator Supply Valve. The Radiator Supply Valve will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 3
	"VGC_13_do_HermsWort_On_B1" state = false
	"VGC_8_do_BluePumpValve_On_B1" state = false
	vSMsg_Isolation = "  Isolation Valve : HERMs WORT Valve. The HERMs WORT Valve Valve will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 4
vSMsg_Isolation = "  Isolation Valves : Red Pump Supply && Brew Kettle Tangental Valve.  Both will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 5
vSMsg_Isolation = " Isolation Valve : Yellow Pump Supply && Little Mac Tangental Valve.  Both will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 6
vSMsg_Isolation = "  Isolation Valve : Fermentor Fill Valve. The Fermentor Fill Valve Valve will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 7
vSMsg_Isolation = "  Isolation Valve : Big Mac Isolation Valve. Big Mac Isolation Valve will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 8
vSMsg_Isolation = " Isolation Valve : Left MLT Isolation Valve. The Left MLT Isolation Valve will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 9
vSMsg_Isolation = " Isolation Valve : Brew Kettle Isolation Valve. The Brew Kettle Isolation Valve will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 10
vSMsg_Isolation = " Isolation Valve : Little Mac Isolation Valve. The Little Mac Isolation Valve will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 11
vSMsg_Isolation = " Isolation Valve : Back Left Manifold Valve. The Back Left Manifold Valve will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 12
vSMsg_Isolation = " Isolation Valve : Right MLT Isolation Valve. The Right MLT Isolation Valve will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 13
vSMsg_Isolation = " Isolation Valve : White Pump Valve. The White Pump Valve will Close and Open Automatically.\n"
endif
if vV_Isolation_Valve == 14
	"VGC_8_do_BluePumpValve_On_B1" state = false
	"VGC_13_do_HermsWort_On_B1" state = false
	vSMsg_Isolation = "Isolation Valves : Blue Pump Supply && HERMs WORT Valve.  Both will Close and Open Automatically.\n"
endif
//........................................................
[Skip_Isolation]	
//........................................................
// Set Transfers on V1
if vV_Vessel_To == vV_Vessel_Measure
"gblVEndVolume_Water" value = 0
endif 
if vV_Vessel_From == vV_Vessel_Measure
"gblVEndVolume_Water" value = 99
endif
if "sw_Status_Script_From_Script" state == true
"gblV_Desired_Measured_Volume_End" value = vV_Volume_Vessel_To_Desired
endif
//......................................................
//......................................................
print "@1505 Set Globals Strings"
vV_Vessel_From = "gblV_Vessel_From" value
vV_Vessel_To = "gblV_Vessel_To" value
vV_Vessel_Measure = "gblV_Vessel_Measure" value
vV_Volume_Vessel_Adjust_Start = "gblV_Start_Adjust" value
vV_Volume_Vessel_To_Max  = "gblV_Volume_Max" value
vV_Volume_Vessel_From_Current = "gblV_Start_From" value
vV_Volume_Vessel_To_Current = "gblV_Start_To" value
if vV_Vessel_Measure == vV_Vessel_From
vV_Volume_Vessel_Measure_Start = vV_Volume_Vessel_From_Current
endif
if vV_Vessel_Measure == vV_Vessel_To
vV_Volume_Vessel_Measure_Start = vV_Volume_Vessel_To_Current
endif
print "@1519 From:to:Pump:Measure:Adjust"
vS_Vessel_From = "gblS_Vessel_From" value
print vS_Vessel_From
vS_Vessel_To = "gblS_Vessel_To" value
print vS_Vessel_To 
vS_Pump = "gblS_Pump" value	
print  vS_Pump
vS_Vessel_Measure = "gblS_Vessel_Measure" value
print vS_Vessel_Measure
vS_Vessel_Adjust = "gblS_Vessel_Adjust" value
print vS_Vessel_Adjust
//........................................................
print 1531
vsMsg = "Setting "
vsMsg = vsMsg + vS_Manifold_Set
"gblS_BrewName_B1" value = vsMsg
vSMsg = "The Manifold will be set to transfer from the "
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to fill the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = "."
vSMsg = vSMsg + vSMsg1
if vVValveSet == 1031
vSMsg = "The Manifold will be set to Flush the HERMs Coil  with "
vSMsg1 = "gblV_Gals_to_Fill" value 
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons from the Big Mac. "
vSMsg = vSMsg + vSMsg1
endif
if vVValveSet == 1032
vSMsg = "The Manifold will be set to  Add Sparge Water from the Big Mac via HERMs Coil  in the amount ofthe Big Mac. "
vSMsg1 = "gblV_Gals_to_Fill" value 
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons. "
vSMsg = vSMsg + vSMsg1
endif
if vVValveSet == 1041
vSMsg = "The Manifold will be set to Top Off the Brew Kettle with "
vSMsg1 = "gblV_Gals_to_Fill" value 
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons from the Big Mac. "
vSMsg = vSMsg + vSMsg1
endif
if vVValveSet == 3042
vSMsg = "The Manifold will be set to transfer the Second Run to the Brew Kettle with "
vSMsg1 = "gblV_Gals_to_Fill" value 
vSMsg = vSMsg + vSMsg1
vSMsg1 = " gallons from the Mash Tun. "
vSMsg = vSMsg + vSMsg1
endif
//...........................
if "gblV_Vessel_Measure" value > 0
vSMsg1 = " Once the transfer is complete, the  "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_Measure
vSMsg = vSMsg + vSMsg1 
vSMsg1 = " will be measured."
vSMsg = vSMsg + vSMsg1
endif
vSMsg_Adjust = " "
if "glbV_Vessel_Adjust"  value > 0
vSMsg_Adjust = "  The  "
vSMsg1 = vS_Vessel_Adjust
vSMsg_Adjust = vSMsg_Adjust + vSMsg1
vSMsg1 = "'s Volume will be adjusted."
vSMsg_Adjust = vSMsg_Adjust + vSMsg1
vSMsg1 = "\n"
vSMsg_Adjust = vSMsg_Adjust + vSMsg1
endif
if "gblV_Pump" value > 0
	if "gblV_Pump" value  < 6
	vSMsg1 = " The   "
	vSMsg = vSMsg + vSMsg1
	vSMsg1 = vS_Pump
	vSMsg = vSMsg + vSMsg1
	vSMsg1 = " will operate automatically based on time."
	vSMsg = vSMsg + vSMsg1
	goto "Skipped for Recycle"
	endif
	if "gblV_Pump" value == 100
	vSMsg1 = " The   "
	vSMsg = vSMsg + vSMsg1
	vSMsg1 = vS_Pump
	vSMsg = vSMsg + vSMsg1
	vSMsg1 = " will operate automatically based on time."
	vSMsg = vSMsg + vSMsg1
	goto "Skipped for Recycle"
	endif 
	if "gblV_Pump" value  > 6
	vSMsg1 = " The   "
	vSMsg = vSMsg + vSMsg1
	vSMsg1 = vS_Pump
	vSMsg = vSMsg + vSMsg1
	vSMsg1 = " must be turned On and Off manually.  There will be Alarms to do so."
	vSMsg = vSMsg + vSMsg1
	endif
endif
[Skipped for Recycle]
print "@1598 Section = Skipped for Recycle"
if "sw_Flow_Set_Manual" state == true
	vSMsg1 = " Click Manifold Set?"
	vSMsg = vSMsg + vSMsg1
	"gblS_swAllSwitch_Label_Text" value = "Manifold Set?"
else
	vSMsg1 = " Click Set Manifold?"
	vSMsg = vSMsg + vSMsg1
	"gblS_swAllSwitch_Label_Text" value = "Set Manifold?"
endif
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" value = vSMsg
vSMsg = vSMsg_Adjust
vSMsg1 = vSMsg_Isolation
vSMsg = vSMsg + vSMsg1
if vVValveSet == 6
vSMsg1 = "  The Fermentor Hose in the Fermentor Room needs to be set manually to the "
vSMsg1 = vSMsg1 + vS_Name_Fermentor
vSMsg2 = "Fermentor."
goto "Skip_Normal_Manifold"
endif
if "sw_Flow_Set_Manual" state == true
vSMsg1 = "\n1:An External Hose needs to be connected to OPENED Manifold South Manual Valve.  and\n2: connected to the Manual Inlet Valve of the "
vSMsg2 = vS_Vessel_to
vSMsg1 = vSMsg1 + vSMsg2
vSMsg2 = ".\n3: The "
vSMsg1 = vSMsg1 + vSMsg2
vSMsg2 = vS_Vessel_to
vSMsg1 = vSMsg1 + vSMsg2
vSMsg2 = " Manual Inlet Valve needs to be OPEN! "
vSMsg1 = vSMsg1 + vSMsg2
goto "Skip_Normal_Manifold"
endif
vSMsg1 = "\nThe Manifold will be set once the Set Manifold? is Clicked."
[Skip_Normal_Manifold]
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Bottom_4" value = vSMsg 
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"sw_Advance_ BrewStatus" background = 1
// Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_BrewName_B1" visibility = visible
//................................................
vV_BrewStatus = "gblV_Brew_Status" value
print 1660
"gblV_Brew_Status" value = 9997
"sw_Advance_ BrewStatus" visibility = visible
wait "gblV_Brew_Status" value == 9998
"gblV_Brew_Status" value = vV_BrewStatus
"sw_Advance_ BrewStatus" visibility = hidden
print 1666
//.................................................
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
[ExitLoopValve]
if vB_Prime_Basic == true
print "@1674 vB_Prime_Basic == true"
"sw_Restore_Valves" state = false
start "sub_2_scrPrimeandBasicManifold"
sleep 100 
if vB_Testing == true
"gblS_Inter_Script" value = "@ 1590 sub_scrManifold_Choice(vB_Prime_Basic = true) start: sub_2_scrPrimeandBasicManifold"
sleep 101
endif
wait "sw_Running_Prime_Basic" state == false
goto "End_sub_scrManifold_Choice"
endif
if vB_Prime_Basic == false
print "Normal Valves"
"gblS_Water_Text" value = vS_Manifold_Set
start "sub_2_scrValveOperation"
sleep 100 
if vB_Testing == true
"gblS_Inter_Script" value = "@ 1603 sub_scrManifold_Choice(vB_Prime_Basic = false) start: sub_2_scrValveOperation"
sleep 101
endif
wait "sw_Running_ValveOperation" state == false
endif
[End_sub_scrManifold_Choice]
"gblS_Inter_Script" value = "ended: sub_scrManifold_Choice"
if vB_Testing == true
sleep 101
endif
clear
"sw_Running_Manifold_Choice" state = false
stop "sub_scrManifold_Choice"
```

## 65. sub_Stop_Testing

Starts by itself: No · User can start or stop it: No · 19 lines

```text
//sub_Start_Testing Modofied 260915 12_32
//09/15/2026 12:32
// MIT License Granted
//Copyright © OakBarn Brewery 2026
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
"gblS_Inter_Script" visibility = visible
"gblV_Brew_Status" visibility = visible
"gblV_Sub3_Status" visibility = visible
"gblV_Sub4_Status" visibility = visible
stop "step_scrTest_Time _Reset"
start "looper_scrBoilTimer_Reset"
"gblV_Brew_Status" visibility = visible
"gblT_SetTimer" visibility = visible
"sw_Advance_Timer" visibility = visible
"sw_Reset_Timer_Zero" visibility = visible
"sw_Status_Testing" state = false
"gblTValveDelay" value = 00:00:01
stop "sub_Stop_Testing"
```

## 66. sub_Start_Testing

Starts by itself: No · User can start or stop it: Yes · 17 lines

```text
// sub_Start_Testing Modofied 260915 12_32
//09/15/2026 12:32
// MIT License Granted
//Copyright © OakBarn Brewery 2026
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
"gblS_Inter_Script" visibility = visible
"gblV_Brew_Status" visibility = visible
"gblV_Sub3_Status" visibility = visible
"gblV_Sub4_Status" visibility = visible
start "step_scrTest_Time _Reset"
start "looper_scrBoilTimer_Reset"
"gblV_Brew_Status" visibility = visible
"gblT_SetTimer" visibility = visible
"sw_Advance_Timer" visibility = visible
"sw_Reset_Timer_Zero" visibility = visible
stop "sub_Start_Testing"
```

## 67. realsub_Stop_Testing

Starts by itself: No · User can start or stop it: Yes · 18 lines

```text
// sub_Stop_Testing Modofied 260915 12_32
//09/15/2026 12:32
// MIT License Granted
//Copyright © OakBarn Brewery 2026
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
"gblS_Inter_Script" visibility = hidden
stop "step_scrTest_Time _Reset"
stop "looper_scrBoilTimer_Reset"
"gblV_Brew_Status" visibility = hidden
"gblV_Sub3_Status" visibility = hidden
"gblV_Sub4_Status" visibility = hidden
"gblT_SetTimer" visibility = hidden
"sw_Advance_Timer" visibility = hidden
"sw_Reset_Timer_Zero" visibility = hidden
"gblTValveDelay" value = 00:00:07
stop "sub_Stop_Testing"
```

## 68. sub_step_scrHops_15_Min

Starts by itself: No · User can start or stop it: Yes · 607 lines

```text
//sub_step_scrHops_15_Min
//10/04/2023 14:20
// MIT License Granted
//Copyright © OakBarn Brewery 2026
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
vV_Count_Groups = 0
"gblV_Group_SoB_Hops" value = vV_Count_Groups
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
 vVGroup_EoB_Status = "gblV_Group_EoB_Hops" value
 vVGroup_Rocket_Status = "gblV_Group_Hop Rocket" value
vSText_Ten_2 = " ready to drop shortly.  Will Auto Advance."
vSText_Drop_2 = ".   Drop the Hops Now! Click the Alarm Off to Advance."
vSDisplay_Drop = "Drop Aroma Hops Now!"
vSDisplay_Ten = "10 Minute Aroma Hop Warning"
vSText_Drop_1 = "Aroma Hop Drop: "
vSText_Ten_1 = "Aroma Hop Ten Minutes Warning:  Get "
vSText_Drop_2 = ".   Drop the Aroma Hops Now! Click the Aroma Hop Alarm Off to Advance."
"alm_Hops_2_ALARM" background = 2
"alm_Hops_2_ALARM" fileindex =  2
"alm_Hops_2_ALARM" displayname = "Aroma Hops, Whrilfloc and Yeast Nutrient"
[15_Min_Hops]
wait "tmTopRight_B1" value <= 00:15:00
sleep 100
if vV_Count_Groups == 8 
goto "15_Min_Hop_End"
endif
if vVGroup_1_Status == -44
goto "Hop_1_15"
endif
if vVGroup_2_Status == -44
goto "Hop_2_15"
endif
if vVGroup_3_Status == -44
goto "Hop_3_15"
endif
if vVGroup_4_Status == -44
goto "Hop_4_15"
endif
if vVGroup_5_Status == -44
goto "Hop_5_15"
endif
if vVGroup_6_Status == -44
goto "Hop_6_15"
endif
if vVGroup_7_Status == -44
goto "Hop_7_15"
endif
if vVGroup_8_Status == -44
goto "Hop_8_15"
endif
// No Hops at 15
show workspace "Alarms"
"gblS_HopMessage_ALARM" visibility = hidden
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = "Drop Whrilfloc and Yeast Nutrient"
"gblS_HopMessage_ALARM" value = "Time to drop Yeast Nutrient and Whirlfloc.  Click the Alarm to Advance"
"alm_Hops_2_ALARM" background = 1
"alm_Hops_2_ALARM" fileindex =  1
"alm_Hops_2_ALARM" displayname = "Drop Whrilfloc and Yeast Nutrient"
"alm_Hops_2_ALARM" visibility = visible
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_2_ALARM" active = true
wait "alm_Hops_2_ALARM" active == false
"alm_Hops_2_ALARM" visibility = hidden
//Check 10 Min Warning for 5 Min Drop
if vVGroup_1_Status == -777
goto "Hop_1_15_Ten"
endif
if vVGroup_2_Status == -777
print "goto Group 2 10 Warning"
goto "Hop_2_15_Ten"
endif
if vVGroup_3_Status == -777
goto "Hop_3_15_Ten"
endif
if vVGroup_4_Status == -777
goto "Hop_4_15_Ten"
endif
if vVGroup_5_Status == -777
goto "Hop_5_15_Ten"
endif
if vVGroup_6_Status == -777
goto "Hop_6_15_Ten"
endif
if vVGroup_7_Status == -777
goto "Hop_7_15_Ten"
endif
if vVGroup_8_Status == -777
goto "Hop_8_15_Ten"
endif
goto "15_Min_Hop_End"

[Hop_1_15]
print "Hop 1 Drop = -44 at 156"
wait  "tmTopRight_B1" value <=  00:15:00
vSText = vSText_Drop_1 + vSText_Hop_1
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_2_ALARM" visibility = visible
"alm_Hops_2_ALARM" background = 2
"alm_Hops_2_ALARM" fileindex = 2
show workspace "Alarms"
"alm_Hops_2_ALARM" active = true
vVGroup_1_Status = -9999 
"gblV_Group_1_Conflict" value = vVGroup_1_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
wait "alm_Hops_2_ALARM" active == false
"alm_Hops_2_ALARM" visibility = hidden
//................................................
if vVGroup_2_Status == -777
print "goto Group 2 10 Warning"
goto "Hop_2_15_Ten"
else 
goto "15_Min_Hop_End"
endif
[Hop_2_15]
print "Hop_2 Drop = -44 at 183"
wait  "tmTopRight_B1" value <=  00:15:00
vSText = vSText_Drop_1 + vSText_Hop_2
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_2_ALARM" visibility = visible
"alm_Hops_2_ALARM" background = 2
"alm_Hops_2_ALARM" fileindex = 2
show workspace "Alarms"
"alm_Hops_2_ALARM" active = true
vVGroup_2_Status = -9999 
"gblV_Group_2_Conflict" value = vVGroup_2_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
wait "alm_Hops_2_ALARM" active == false
"alm_Hops_2_ALARM" visibility = hidden
//................................................
if vVGroup_3_Status == -777
print "goto Group_3 10 Warning"
goto "Hop_3_15_Ten"
else 
goto "15_Min_Hop_End"
endif
[Hop_3_15]
print "Hop_3 Drop = -44 at 211"
wait  "tmTopRight_B1" value <=  00:15:00
vSText = vSText_Drop_1 + vSText_Hop_3
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_2_ALARM" visibility = visible
"alm_Hops_2_ALARM" background = 2
"alm_Hops_2_ALARM" fileindex = 2
show workspace "Alarms"
"alm_Hops_2_ALARM" active = true
vVGroup_3_Status = -9999 
"gblV_Group_3_Conflict" value = vVGroup_3_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
wait "alm_Hops_2_ALARM" active == false
"alm_Hops_2_ALARM" visibility = hidden
//................................................
if vVGroup_4_Status == -777
print "goto Group_4 10 Warning"
goto "Hop_4_15_Ten"
else 
goto "15_Min_Hop_End"
endif
[Hop_4_15]
print "Hop_4 Drop = -44 at 238"
wait  "tmTopRight_B1" value <=  00:15:00
vSText = vSText_Drop_1 + vSText_Hop_4
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" dis playname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_2_ALARM" visibility = visible
"alm_Hops_2_ALARM" background = 2
"alm_Hops_2_ALARM" fileindex = 2
show workspace "Alarms"
"alm_Hops_2_ALARM" active = true
vVGroup_4_Status = -9999 
"gblV_Group_4_Conflict" value = vVGroup_4_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
wait "alm_Hops_2_ALARM" active == false
"alm_Hops_2_ALARM" visibility = hidden
//................................................
if vVGroup_5_Status == -777
print "goto Group_5 10 Warning"
goto "Hop_5_15_Ten"
else 
goto "15_Min_Hop_End"
endif
[Hop_5_15]
print "Hop_5 drop = -44 at 266"
wait  "tmTopRight_B1" value <=  00:15:00
vSText = vSText_Drop_1 + vSText_Hop_5
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_2_ALARM" visibility = visible
"alm_Hops_2_ALARM" background = 2
"alm_Hops_2_ALARM" fileindex = 2
show workspace "Alarms"
"alm_Hops_2_ALARM" active = true
vVGroup_5_Status = -9999 
"gblV_Group_5_Conflict" value = vVGroup_5_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
wait "alm_Hops_1_ALARM" active == false
"alm_Hops_2_ALARM" visibility = hidden
//................................................
if vVGroup_6_Status == -777
print "goto Group_6 10 Warning"
goto "Hop_6_15_Ten"
else 
goto "15_Min_Hop_End"
endif
[Hop_6_15]
print "Hop_6 drop = -44 at 292"
wait  "tmTopRight_B1" value <=  00:15:00
vSText = vSText_Drop_1 + vSText_Hop_6
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_2_ALARM" visibility = visible
"alm_Hops_2_ALARM" background = 2
"alm_Hops_2_ALARM" fileindex = 2
show workspace "Alarms"
"alm_Hops_2_ALARM" active = true
vVGroup_6_Status = -9999 
"gblV_Group_6_Conflict" value = vVGroup_6_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
wait "alm_Hops_1_ALARM" active == false
"alm_Hops_2_ALARM" visibility = hidden
//................................................
if vVGroup_7_Status == -777
print "goto Group_7 10 Warning"
goto "Hop_7_15_Ten"
else 
goto "15_Min_Hop_End"
endif
[Hop_7_15]
print "Hop_7 drop = -44 at 102"
wait  "tmTopRight_B1" value <=  00:15:00
vSText = vSText_Drop_1 + vSText_Hop_7
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_2_ALARM" visibility = visible
"alm_Hops_2_ALARM" background = 2
"alm_Hops_2_ALARM" fileindex = 2
show workspace "Alarms"
"alm_Hops_2_ALARM" active = true
vVGroup_7_Status = -9999 
"gblV_Group_7_Conflict" value = vVGroup_7_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
wait "alm_Hops_1_ALARM" active == false
"alm_Hops_2_ALARM" visibility = hidden
if vVGroup_8_Status == -777
print "goto Group_8 10 Warning"
goto "Hop_8_15_Ten"
else 
goto "15_Min_Hop_End"
endif
[Hop_8_15]
print "Hop_8 Drop = -44 at 339"
wait  "tmTopRight_B1" value <=  00:15:00
vSText = vSText_Drop_1 + vSText_Hop_8
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_2_ALARM" visibility = visible
"alm_Hops_2_ALARM" background = 2
"alm_Hops_2_ALARM" fileindex = 2
show workspace "Alarms"
"alm_Hops_2_ALARM" active = true
vVGroup_8_Status = -9999 
"gblV_Group_8_Conflict" value = vVGroup_8_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
wait "alm_Hops_1_ALARM" active == false
"alm_Hops_2_ALARM" visibility = hidden
//................................................
goto "15_Min_Hop_End"
[Hop_X_15_End_15]
[Hop_1_15_Ten]
print "Group 1 10 Warning only at 15 min"
"gblS_HopMessage_ALARM" visibility = hidden
vSText = vSText_Ten_1 + vSText_Hop_1
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_1_Status = -88
"gblV_Group_1_Conflict" value = vVGroup_1_Status
goto "15_Min_Hop_End"
[Hop_2_15_Ten]
print "Hop_2_15_Ten"
"gblS_HopMessage_ALARM" visibility = hidden
vSText = vSText_Ten_1 + vSText_Hop_2
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_2_Status = -88
"gblV_Group_2_Conflict" value = vVGroup_2_Status
goto "15_Min_Hop_End"
[Hop_3_15_Ten]
print "Hop_3_15_Ten"
"gblS_HopMessage_ALARM" visibility = hidden
vSText = vSText_Ten_1 + vSText_Hop_3
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_3_Status = -88
"gblV_Group_3_Conflict" value = vVGroup_3_Status
goto "15_Min_Hop_End"
[Hop_4_15_Ten]
print "Hop_4_15_Ten"
"gblS_HopMessage_ALARM" visibility = hidden
vSText = vSText_Ten_1 + vSText_Hop_4
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_4_Status = -88
"gblV_Group_4_Conflict" value = vVGroup_4_Status
goto "15_Min_Hop_End"
[Hop_5_15_Ten]
print "Hop_5_15_Ten"
"gblS_HopMessage_ALARM" visibility = hidden
vSText = vSText_Ten_1 + vSText_Hop_5
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_5_Status = -88
"gblV_Group_5_Conflict" value = vVGroup_5_Status
goto "15_Min_Hop_End"
[Hop_6_15_Ten]
print "Hop_6_15_Ten"
"gblS_HopMessage_ALARM" visibility = hidden
vSText = vSText_Ten_1 + vSText_Hop_6
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_6_Status = -88
"gblV_Group_6_Conflict" value = vVGroup_6_Status
goto "15_Min_Hop_End"
[Hop_7_15_Ten]
print "Hop_7_15_Ten"
"gblS_HopMessage_ALARM" visibility = hidden
vSText = vSText_Ten_1 + vSText_Hop_7
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_7_Status = -88
"gblV_Group_7_Conflict" value = vVGroup_7_Status
goto "15_Min_Hop_End"
[Hop_8_15_Ten]
print "Hop_8_15_Ten"
"gblS_HopMessage_ALARM" visibility = hidden
vSText = vSText_Ten_1 + vSText_Hop_8
vSText = vSText + vSText_Ten_2
"gblS_HopMessage_ALARM" background = 3
"gblS_HopMessage_ALARM" displayname = vSDisplay_Ten
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hidden_Hop_15min_Warning_ALARM" fileindex = 1
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_8_Status = -88
"gblV_Group_8_Conflict" value = vVGroup_8_Status
goto "15_Min_Hop_End"
[Check_15]
goto "15_Min_Hops"
[15_Min_Hop_End]
print "end of 15"
show workspace   "B1 Brewery"
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
if vV_Count_Groups == 8
print "Skip Gap Hops and go right to End Of Boil Hops"
goto "Skip Gap Hops"
endif 
clear
start "sub_step_scrHops_Gap"
goto "Ender15Min"
[Skip Gap Hops]
start "sub_step_scrHops_EOB"
[Ender15Min]
"sw_Running_Script_C" state = false
if vB_Testing == true
"gblS_Inter_Script" value = "ended: sub_step_scrHops_15_Min"
sleep 4001
endif
clear
stop "sub_step_scrHops_15_Min"
```

## 69. sub_step_scrHops_Gap

Starts by itself: No · User can start or stop it: Yes · 435 lines

```text
//sub_step_scrHops_Gap
//10/04/2023 14:20
// MIT License Granted
//Copyright © OakBarn Brewery 2026
"gblS_Brewery_Top_3"  visibility = hidden
print "start GapHops"
"gblVScriptFlow" value = 10
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vV10Min_Status
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
new value vV10Min_Status = 99
vV_Count_Groups = 0
"gblV_Group_SoB_Hops" value = vV_Count_Groups
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
 vVGroup_EoB_Status = "gblV_Group_EoB_Hops" value
 vVGroup_Rocket_Status = "gblV_Group_Hop Rocket" value
if vV_Count_Groups == 8 
goto "Gap_Hop_10_Min"
endif
//Group 1
print vVGroup_1_Status

if vVGroup_1_Status  !=  -9999
vT_Group_1_Ten = "gblT_Group_1_10m_Time_Wo1" value
vT_Group_1_Drop = vT_Group_1_Ten - 00:10:00
endif
// Group 2
if vVGroup_2_Status  != -9999
vT_Group_2_Ten = "gblT_Group_2_10m_Time_Wo1" value
vT_Group_2_Drop = vT_Group_2_Ten - 00:10:00
endif
// Group 3
if vVGroup_3_Status   != -9999
vT_Group_3_Ten = "gblT_Group_3_10m_Time_Wo1" value
vT_Group_3_Drop = vT_Group_3_Ten - 00:10:00
endif
//Group 4
if vVGroup_4_Status  != -9999
vT_Group_4_Ten = "gblT_Group_4_10m_Time_Wo1" value
vT_Group_4_Drop = vT_Group_4_Ten - 00:10:00
endif
// Group 5
if vVGroup_5_Status != -9999
vT_Group_5_Ten = "gblT_Group_5_10m_Time_Wo1" value
vT_Group_5_Drop = vT_Group_5_Ten - 00:10:00
endif
//Group 6
if vVGroup_6_Status != -9999
vT_Group_6_Ten = "gblT_Group_6_10m_Time_Wo1" value
vT_Group_6_Drop = vT_Group_6_Ten - 00:10:00
endif
// Group 7
if vVGroup_7_Status != -9999
vT_Group_7_Ten = "gblT_Group_7_10m_Time_Wo1" value
vT_Group_7_Drop = vT_Group_7_Ten - 00:10:00
endif
// Group 8
if vVGroup_8_Status != -9999
vT_Group_8_Ten = "gblT_Group_8_10m_Time_Wo1" value
vT_Group_8_Drop = vT_Group_8_Ten - 00:10:00
endif
vSText_Ten_2 = " ready to drop shortly.  Will Auto Advance."
vSText_Drop_2 = ".   Drop the Hops Now! Click the Alarm Off to Advance."
vSDisplay_Drop = "Drop Aroma Hops Now!"
vSDisplay_Ten = "10 Minute Aroma Hop Warning"
vSText_Drop_1 = "Aroma Hop Drop: "
vSText_Ten_1 = "Aroma Hop Ten Minutes Warning:  Get "
vSText_Drop_2 = ".   Drop the Aroma Hops Now! Click the Aroma Hop Alarm Off to Advance."
"alm_Hops_2_ALARM" background = 2
"alm_Hops_2_ALARM" fileindex =  2
"alm_Hops_2_ALARM" displayname = "Aroma Hops, Whrilfloc and Yeast Nutrient"
if vVGroup_1_Status  !=  -9999
if vT_Group_1_Drop == 00:10:00
vVGroup_1_Status = -444
"gblV_Group_1_Conflict" value = vVGroup_1_Status
endif
endif
if vVGroup_2_Status  !=  -9999
if vT_Group_2_Drop == 00:10:00
vVGroup_2_Status = -444
"gblV_Group_2_Conflict" value = vVGroup_2_Status
endif
endif
if vVGroup_3_Status  !=  -9999
if vT_Group_3_Drop == 00:10:00
vVGroup_3_Status = -444
"gblV_Group_3_Conflict" value = vVGroup_3_Status
endif
endif
if vVGroup_4_Status  !=  -9999
if vT_Group_4_Drop == 00:10:00
vVGroup_4_Status = -444
"gblV_Group_1_Conflict" value = vVGroup_3_Status
endif
endif
if vVGroup_5_Status  !=  -9999
if vT_Group_5_Drop == 00:10:00
vVGroup_5_Status = -444
"gblV_Group_5_Conflict" value = vVGroup_5_Status
endif
endif
if vVGroup_6_Status  !=  -9999
if vT_Group_6_Drop == 00:10:00
vVGroup_6_Status = -444
"gblV_Group_6_Conflict" value = vVGroup_6_Status
endif
endif
if vVGroup_7_Status  !=  -9999
if vT_Group_7_Drop == 00:10:00
vVGroup_7_Status = -444
"gblV_Group_7_Conflict" value = vVGroup_7_Status
endif
endif8
if vVGroup_8_Status  !=  -9999
if vT_Group_8_Drop == 00:10:00
vVGroup_8_Status = -444
"gblV_Group_8_Conflict" value = vVGroup_8_Status
endif
endif


[Gap_Hops]
print "start Gap Hop"
sleep 100
if vV_Count_Groups == 8 
goto "Gap_Hop_End"
endif
[Gap_Hop_1]

if vVGroup_1_Status  > 7
print ">7"
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
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_1_Status = -88
"gblV_Group_1_Conflict" value = vVGroup_1_Status
show workspace  "B1 Brewery"
endif
goto "Gap_Hop_2"
endif
if vVGroup_1_Status == -88
print "Group 1 = -88"
if  "tmTopRight_B1" value <= vT_Group_1_Drop
vSText = vSText_Drop_1 + vSText_Hop_1
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_1_Status = -9999
"gblV_Group_1_Conflict" value = vVGroup_1_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif
goto "Gap_Hop_2"
endif
if vVGroup_1_Status == -888
print "Group 1 = -888"
if  "tmTopRight_B1" value <= vT_Group_1_Drop
vSText = vSText_Drop_1 + vSText_Hop_1
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_1_Status = -9999
"gblV_Group_1_Conflict" value = vVGroup_1_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
show workspace  "B1 Brewery"
endif

if vVGroup_1_Status == 2
print "Group 2 = -888"
if  "tmTopRight_B1" value <= vT_Group_1_Drop
vSText = vSText_Drop_1 + vSText_Hop_1
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
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
"alm_Hidden_Hop_15min_Warning_ALARM" active = true
"tm_HopTimer_WO1" type = countdown
"tm_HopTimer_WO1" value = 00:00:08
start "tm_HopTimer_WO1"
wait "tm_HopTimer_WO1" value <= 00:00:00
stop "tm_HopTimer_WO1"
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"gblS_HopMessage_ALARM" visibility = hidden
vVGroup_2_Status = -88
"gblV_Group_2_Conflict" value = vVGroup_2_Status
show workspace  "B1 Brewery"
endif
goto "Gap_Hop_2"
endif
[Gap_Hop_2]

 if  "tmTopRight_B1" value >= 00:10:59
goto "Gap_Hop_10_Min_End"
endif
if vV10Min_Status == 100
goto "Gap_Hop_10_Min_End"
endif
[Gap_Hop_10_Min]
print "Gap 10 min"
if "gblVScriptFlow" value == 99
goto "Gap_Hop_10_Min_End"
endif
if  "tmTopRight_B1" value <=  00:10:00
"gblVScriptFlow" value = 99
endif
[Gap_Hop_10_Min_Group_1]
if vVGroup_1_Status  > -444
goto "Gap_Hop_10_Min_Group_2"
endif
if vVGroup_1_Status == -444
vV10Min_Status = 100
vSText = vSText_Drop_1 + vSText_Hop_1
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_1_Status = -9999
"gblV_Group_1_Conflict" value = vVGroup_1_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
sleep 1000
goto "Gap_Hop_10_Min_End"
endif
[Gap_Hop_10_Min_Group_2]
if vVGroup_2_Status == -444
vV10Min_Status = 100
vSText = vSText_Drop_1 + vSText_Hop_2
vSText = vSText + vSText_Drop_2
"gblS_HopMessage_ALARM" background = 1
"gblS_HopMessage_ALARM" displayname = vSDisplay_Drop
"gblS_HopMessage_ALARM" value = vSText
"gblS_HopMessage_ALARM" visibility = visible
"alm_Hops_1_ALARM" visibility = visible
"alm_Hops_1_ALARM" active = true
show workspace "Alarms"
wait "alm_Hops_1_ALARM" active == false
"gblS_HopMessage_ALARM" visibility = hidden
"alm_Hops_1_ALARM" visibility = hidden
vVGroup_2_Status = -9999
"gblV_Group_2_Conflict" value = vVGroup_2_Status
vV_Count_Groups  += 1
"gblV_Group_SoB_Hops" value = vV_Count_Groups
sleep 1000
endif
[Gap_Hop_10_Min_End]
if "gblV_Brew_Status" value >= 489
goto "Gap_Hop_End"
endif
if  "tmTopRight_B1" value <=  00:00:00
goto "Gap_Hop_End"
endif
goto "Gap_Hops"
[Gap_Hop_End]
print "end of Gap"
show workspace   "B1 Brewery"
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
"sw_Running_Script_C" state = false
if vB_Testing == true
"gblS_Inter_Script" value = "ended: sub_step_scrHops_Gap"
sleep 4001
endif
clear
stop "sub_step_scrHops_Gap"
```

## 70. sub_step_scrHops_EOB

Starts by itself: No · User can start or stop it: Yes · 126 lines

```text
//sub_step_scrHops_EOB
//10/04/2023 14:20
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Whirlpool Hops
//Modofied 03/02/2024 08:15
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
start "inscpt_scrAlarm"
sleep 4001
new value vVGroup_EoB_Status
new string vS_EoB_Hops
new string vS_Rocket_Hops
new string vSDisplay_Drop
new string vSText
new string vSText_1
new string vSText_2
new string vSText_3
new string vSText_4
new string vSText_Drop_1
new string vSText_Drop_2
vS_EoB_Hops = "gblS_HopGroup_EOB" value
vS_Rocket_Hops = "gblS_HopGroup_Rocket" value
vVGroup_EoB_Status = "gblVScriptFlow"  value 
if vVGroup_EoB_Status == 1100
goto "EOBAroma"
endif
if vVGroup_EoB_Status == 6100
goto "EOBAroma"
endif
if vVGroup_EoB_Status == 1200
goto "EOBRocket"
endif
if vVGroup_EoB_Status == 6200
goto "EOBRocket"
endif
if vVGroup_EoB_Status == 1300
goto "EOBBoth"
endif
if vVGroup_EoB_Status == 6300
goto "EOBBoth"
endif
//Aroma Only
[EOBAroma]
"gblS_HopMessage_ALARM" displayname = "Drop Aroma Whirlpool Hops"
vSText_1 = "Aroma Hops: "
vSText_2 = "gblS_HopGroup_EOB" value 
vSText = vSText_1 + vSText_2
vSText_Drop_2 = ".   Drop the Aroma Hops Now! Click the Whirlpool Aroma Hops Alarm Off to Advance."
vSText = vSText + vSText_Drop_2 
"gblS_HopMessage_ALARM" value = vSText
"alm_Hops_3_ALARM" background = 3
"alm_Hops_3_ALARM"  fileindex =  1
"alm_Hops_3_ALARM" displayname = "Whirlpool Aroma Hops"
show workspace "Alarms"
"alm_Hops_3_ALARM" active = true
"alm_Hops_3_ALARM" visibility = visible
"gblS_HopMessage_ALARM" visibility = visible
wait "alm_Hops_3_ALARM" active == false
"gblVStartBrew" value = 101
goto EOB_Hop_End
//Hop Rocket Only
[EOBRocket]
"gblS_HopMessage_ALARM" displayname = "Start the Hop Rocket"
vSText_1 = "Hop Rocket: "
vSText_2 = "vS_Rocket_Hops" 
vSText = vSText_1 + vSText_2
vSText_Drop_2 = ".   Start the Hop Rocket! Click the Hop Rocket Alarm Off to Advance."
vSText = vSText + vSText_Drop_2 
"gblS_HopMessage_ALARM" value = vSText
"alm_Hops_3_ALARM" background = 3
"alm_Hops_3_ALARM"  fileindex =  2
"alm_Hops_3_ALARM" displayname = "Hop Rocket"
show workspace "Alarms"
"alm_Hops_3_ALARM" active = true
stop "tmTopRight_B1" 
"alm_Hops_3_ALARM" visibility = visible
"gblS_HopMessage_ALARM" visibility = visible
wait "alm_Hops_3_ALARM" active == false
start "tmTopRight_B1"
"gblVStartBrew" value = 101
goto EOB_Hop_End
[EOBBoth]
//Aroma Only and Hop Rocket
"gblS_HopMessage_ALARM" displayname = "Start Hop Rocket & Drop Aroma Whirlpool Hops"
vSText_1 = "Aroma Hops: "
vSText_2 = "gblS_HopGroup_EOB" value 
vSText = vSText_1 + vSText_2
vSText_1 = vSText
vSText_3 = "Hop Rocket: "
vSText_4 = "vS_Rocket_Hops" 
vSText = vSText_3 + vSText_4
vSText_1 = "   " + vSText_1
vSText = vSText + vSText_1
vSText_Drop_2 = ".   Start the Hop Rocket! Drop the Aroma Hops.  Click the Rocket Hops Alarm then the Whirlpool Aroma  Off to Advance."
vSText = vSText + vSText_Drop_2 
"gblS_HopMessage_ALARM" value = vSText
"alm_Hops_3_ALARM" background = 3
"alm_Hops_3_ALARM"  fileindex =  2
"alm_Hops_3_ALARM" displayname = "Hop Rocket"
show workspace "Alarms"
"alm_Hops_3_ALARM" active = true
stop "tmTopRight_B1"
"alm_Hops_3_ALARM" visibility = visible
"gblS_HopMessage_ALARM" visibility = visible
wait "alm_Hops_3_ALARM" active == false
"alm_Hops_3_ALARM"  fileindex =  1
"alm_Hops_3_ALARM" displayname = "Whirlpool Aroma Hops"
"alm_Hops_3_ALARM" active = true
wait "alm_Hops_3_ALARM" active == false
"gblVStartBrew" value = 101
goto EOB_Hop_End
 [EOB_Hop_End]
print "end EoB"
start "inscpt_scrAlarm"
"sw_Running_Script_C" state  = false
if vB_Testing == true
"gblS_Inter_Script" value = "ended: sub_step_scrHops_EOB"
sleep 4001
endif
clear
stop "sub_step_scrHops_EOB"
```

## 71. sub_2_scrValveOperation

Starts by itself: No · User can start or stop it: Yes · 1436 lines

```text
//sub_2_scrValveOperation
//08/08/2022 8:02
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// modified 07/01/2026 09:07
// set  gblV_Water_Switch_Status_Water value =   in scrBrew (or any other script)
//then call this script with the start command
// kills itself autOmatically
//.................................................
//Major Rewrite (generally Replacement) 01/04/2026 08:47
//goto "SkipTest"
//Test.........................................
//  Set here for test if started in a script and no restore
//"gblV_Water_Switch_Status_Water" value = 102
//Test.........................................
//Test.........................................
[SkipTest]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
"gblSReportLabel_B1" value = "New Start"
//................................
if vB_Testing == true
"gblS_Script_Started" visibility = visible
"gblS_Script_Ended" visibility = visible
else
"gblS_Script_Started" visibility = hidden
"gblS_Script_Ended" visibility = hidden
endif
//................................
start "inscpt_scrAlarm"
sleep 100
wait "sw_Running_Alarm_Clear" state == false
start "inscpt_scr_Inner_Blue"
"sw_Running_ValveOperation" state = true
"gblV_Valve_Status" value = 1000
new time vT_TimerTime
vT_TimerTime = "gblTValveDelay" value
new string vSValveDelayTime
vSValveDelayTime = vT_TimerTime
new value vVValveSet 
vVValveSet precision = 0
vVValveSet = "gblV_Water_Switch_Status_Water" value
new string vSMsg
new string vSMsg1
new string vSMsg2
new string vS_Name_Fermentor
new string vS_Vessel_From
new string vS_Vessel_To
new string vS_Pump
new string vs_Isolation_Valve
new value vV_BrewStatus
new value vV_Fermentor
new value vV_Isolation_Valve
new value vVSkipSet1
new value vVSkipSet2
new value vVSkipSet3
new value vVSkipSet4
new value vVSkipSet5
new value vV_Brew_Valves
new bool vB_Heat_Off
new bool vB_Fill_Counter_Clockwise
new bool vB_Fill_Big_Mac
new bool vB_Fill_Radiator
new bool vB_Fill_Mash_Tun
new bool vB_Fill_Little_Mac
new bool vB_Fill_Brew_Kettle 
new bool vB_From_Big_Mac
//............................
//............................
new bool vB_Big_Mac_Control_Off
new bool vB_Big_Mac_Control_Off_Status
new bool vB_RIMs_Radiator_Control_Off
new bool vB_Radiator_Body_Control_Off 
new bool vB_RIMs_Radiator_Control_Status
new bool vB_Radiator_Body_Control_Status
//.............................................
new bool vB_White_Pump
new bool vB_Green_Pump
new bool vB_Blue_Pump
new bool vB_Red_Pump
new bool vB_Yellow_Pump
//Set 1................................
new bool vB_WhitePumpValve_On
new bool vB_Right_MLT_Isolation_On
new bool vB_RedPumpValve_On
new bool vB_LittleMacTangental_ON
//Set 2................................
new bool vB_BigMacTangental_On
new bool vB_CrossManifold_On
new bool vB_FermentFill_On
new bool vB_BackManifold_Left_On
//Set 3................................
new bool vB_RadiatorTangental_On
new bool vB_FireHose_On
new bool vB_Left_MLT_Isolation_On
new bool vB_YellowPumpValve_On
new bool vB_YellowPumpValve_On
//Set 4................................
new bool vB_CoolingWater_On
new bool vB_RadiatorSupply_On
new bool vB_BluePumpValve_On
new bool vB_LittleMacIsolation_On
//Set 5................................
new bool vB_BrewKettleIsolation_On
new bool vB_BigMac_Isolation_On
new bool vB_HermsWort_On
new bool vB_BrewKettleTangental_On
vB_Radiator_Body_Control_Off = false
// Set Variables to State.....................
vB_RIMs_Radiator_Control_Status = "MB_19_do_RIMS_Radiator_Control_B1" state
vB_Big_Mac_Control_Off_Status = "sw_Control_BigMac_Element" state
vB_Radiator_Body_Control_Status = "sw_Control_Radiator_Element" state
//.............................................
vB_White_Pump = "MB_32_do_WhitePump_B1" state
vB_Green_Pump = "MB_34_do_GreenPump_B1" state
vB_Blue_Pump = "MB_33_do_BluePump_B1" state
vB_Red_Pump = "MB_36_do_RedPump_B1" state
vB_Yellow_Pump = "MB_35_do_YellowPump_B1" state
//Set 1................................
vB_WhitePumpValve_On = "VGC_49_do_WhitePumpValve_On_B1" state
vB_Right_MLT_Isolation_On = "VGC_26_do_Right_MLT_Isolation_On_B1" state
vB_RedPumpValve_On = "VGC_3_do_RedPumpValve_On_B1" state
vB_LittleMacTangental_ON = "VGC_25_do_LittleMacTangental_ON_B1" state
//Set 2................................
vB_BigMacTangental_On = "VGC_47_do_BigMacTangental_On_B1" state
vB_CrossManifold_On = "VGC_28_do_CrossManifold_On_B1" state
vB_FermentFill_On = "VGC_5_do_FermentFill_On_B1" state
vB_BackManifold_Left_On = "VGC_23_do_BackManifold_Left_On_B1"  state
//Set 3................................
vB_RadiatorTangental_On = "VGC_45_do_RadiatorTangental_On_B1" state
vB_FireHose_On = false
vB_Left_MLT_Isolation_On = "VGC_7_do_Left_MLT_Isolation_On_B1" state
vB_YellowPumpValve_On = "VGC_15_do_YellowPumpValve_On_B1" state
//Set 4................................
vB_CoolingWater_On = "VGC_43_do_CoolingWater_On_B1" state
vB_RadiatorSupply_On = "VGC_32_do_RadiatorSupply_On_B1" state
vB_BluePumpValve_On = "MB_33_do_BluePump_B1" state
vB_LittleMacIsolation_On = "VGC_17_do_LittleMacIsolation_On_B1" state
//Set 5................................
vB_BrewKettleIsolation_On = "VGC_41_do_BrewKettleIsolation_On_B1" state
vB_BigMac_Isolation_On = "VGC_34_do_BigMac_Isolation_On_B1" state
vB_HermsWort_On = "VGC_13_do_HermsWort_On_B1" state
vB_BrewKettleTangental_On = "VGC_19_do_BrewKettleTangental_On_B1" state
//.............................................
//.............................................
// Set Some Valves to Off.....................
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_28_do_CrossManifold_On_B1" state = false
sleep 100
"VGC_23_do_BackManifold_Left_On_B1" state = false
sleep 100
"VGC_39_Back_Drain_On_B1" state = false
//............................
//............................
vV_Brew_Valves = "gblV_Brew_Status" value
[SectionSetTexts]
//....................................
if "gblV_Vessel_From" value == 1
		vB_From_Big_Mac = true
		vS_Vessel_From = "Big Mac"
		vS_Pump = "White Pump"
		"gblV_Start_From" value = "gblVCurrentBigMac_Volume" value
endif
if "gblV_Vessel_From" value == 2
		vS_Vessel_From = "Radiator"
		vS_Pump = "Green Pump"
		endif
if "gblV_Vessel_From" value == 3
		vS_Vessel_From = "Mash Tun"
		vS_Pump = "Blue Pump"
endif
if "gblV_Vessel_From" value == 4
		vS_Vessel_From = "Brew Kettle"
		vS_Pump = "Red Pump"
endif
if "gblV_Vessel_From" value == 5
		vS_Vessel_From = "Little Mac"
		vS_Pump = "Yellow Pump"
endif
if "gblV_Vessel_From" value == 7
		vS_Vessel_From = "Brewzilla"
		vS_Pump = "Manual Brewzilla Pump"
endif
if "gblV_Vessel_From" value == 8
		vS_Vessel_From = "Digiboil"
		vS_Pump = "Manual Purple Pump"
endif
if "gblV_Vessel_From" value == 9
		vS_Vessel_From = "20 Gal Mash Tun"
		vS_Pump = "Manual Purple Pump"
endif
if "gblV_Vessel_From" value == 100
		vS_Vessel_From = "Manifold Supply Valve"
		vS_Pump = "Manifold Supply Valve"
endif
//........................................................
if "gblV_Vessel_To" value == 1
vS_Vessel_to = "Big Mac"
vB_Fill_Big_Mac = true
endif
if "gblV_Vessel_To" value == 2
vS_Vessel_to = "Radiator"
vB_Fill_Radiator = true
endif
if "gblV_Vessel_To" value == 3
vS_Vessel_to = "Mash Tun"
vB_Fill_Mash_Tun = true
endif
if "gblV_Vessel_To" value == 4
vS_Vessel_to = "Brew Kettle"
vB_Fill_Brew_Kettle = true
endif
if "gblV_Vessel_To" value == 5
vS_Vessel_to = "Little Mac"
vB_Fill_Little_Mac = true
endif
if "gblV_Vessel_To" value == 6
vV_Fermentor = "gblV_Fermentor" value
	if vV_Fermentor == 1
	vS_Vessel_to = "gblS_Fermentor_Name_1" value
	endif
	if vV_Fermentor == 2
	vS_Vessel_to = "gblS_Fermentor_Name_2" value
	endif
	if vV_Fermentor == 3
	vS_Vessel_to = "gblS_Fermentor_Name_3" value
	endif
	if vV_Fermentor == 4
	vS_Vessel_to = "gblS_Fermentor_Name_4" value
	endif
	if vV_Fermentor == 5
	vS_Vessel_to = "gblS_Fermentor_Name_5" value
	endif
	if vV_Fermentor == 6
	vS_Vessel_to = "gblS_Fermentor_Name_6" value
	endif
vS_Name_Fermentor = vS_Vessel_to
endif
if "gblV_Vessel_To" value == 7
vS_Vessel_to = "Brewzilla"
endif
if "gblV_Vessel_To" value == 8
vS_Vessel_to = "Digiboil"
endif
if "gblV_Vessel_To" value == 9
vS_Vessel_to = "20 Gal Mash Tun"
endif
//........................................................
//........................................................
[One_Set_Variables]
//............................................
if "sw_Flow_Counter_Clockwise" state == true
vB_Fill_Counter_Clockwise = true
endif
//..............................
if "sw_Flow_To_External" state == true
print "@ 245 Fill Externals"
vB_White_Pump = false
	if vB_Fill_Counter_Clockwise == true
	vB_BigMac_Isolation_On = false
	else
	vB_BigMac_Isolation_On = true
	vB_BackManifold_Left_On = false
	endif
goto "Fill Big Mac or Externals"
endif
//..........................
if "sw_Flow_To_BigMac" state == true
print "@ 257 Fill Big Mac"
vB_White_Pump = false
if vB_Fill_Counter_Clockwise == true
vB_BigMac_Isolation_On = false
else
vB_BigMac_Isolation_On = true
vB_BackManifold_Left_On = false
goto "Fill Big Mac or Externals"
endif
goto "Skip_Fill_Big_Mac"
[Fill Big Mac or Externals]
//..................
vB_WhitePumpValve_On = false
vB_BigMacTangental_On = false
	if "sw_Flow_From_MSV" state == true
	vB_BigMac_Isolation_On = false
	vB_BackManifold_Left_On = false
	goto "From_Manifold_Supply_Valve"
	endif
	if "sw_Flow_From_External" state == true
	vB_BigMac_Isolation_On = false
	vB_BackManifold_Left_On = false
	goto "From_External"
	endif
	if "sw_Flow_From_Radiator" state == true
	vB_BigMac_Isolation_On = true
	goto "From_Radiator"
	endif
	if "sw_Flow_From_MLT" state == true
	vB_RadiatorSupply_On = false
	vB_BigMac_Isolation_On = true
	goto "From_Mash_Tun"
	endif
	if "sw_Flow_From_LittleMac" state == true
	vB_BackManifold_Left_On = true
	goto "From_Little_Mac"
	endif
	if "sw_Flow_From_Brew_Kettle" state == true
	vB_Yellow_Pump = false
	vB_YellowPumpValve_On = false
	vB_LittleMacTangental_ON = false
	vB_LittleMacIsolation_On = true
	vB_BackManifold_Left_On = true
	goto "From_Brew_Kettle"
	endif
//..................................................
[Skip_Fill_Big_Mac]
if vB_Fill_Radiator == true
print "@ 305 Fill Radiator"
vB_Green_Pump = false
vB_RadiatorTangental_On = true
vB_RIMs_Radiator_Control_Off = true
vB_Radiator_Body_Control_Off = true
	if vB_Fill_Counter_Clockwise == true
	vB_Right_MLT_Isolation_On = false
	vB_BigMac_Isolation_On = true
	else
	vB_Right_MLT_Isolation_On = true
	vB_BigMac_Isolation_On = false
	endif
//..................
	if "sw_Flow_From_MSV" state == true
	vB_White_Pump = false
	vB_BigMac_Isolation_On = true
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
		goto "From_Manifold_Supply_Valve"
	endif
	if "sw_Flow_From_External" state == true
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
	goto "From_External"
	endif
	if vB_From_Big_Mac == true
		goto "From_Big_Mac"
	endif
	if "sw_Flow_From_MLT" state == true
	goto "From_Mash_Tun"
	endif
	if "sw_Flow_From_LittleMac" state == true
	vB_White_Pump = false
	vB_BigMac_Isolation_On = true
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
		goto "From_Little_Mac"
	endif
	if "sw_Flow_From_Brew_Kettle" state == true
	vB_White_Pump = false
	vB_BigMac_Isolation_On = true
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
	vB_BackManifold_Left_On = true
	goto "From_Brew_Kettle"
	endif
endif
//.....................................
if vB_Fill_Mash_Tun == true
print "@ 354 fill Mash Tun"
	if vB_Fill_Counter_Clockwise == true
	vB_Right_MLT_Isolation_On = true
	vB_Left_MLT_Isolation_On = false
	else
	vB_Right_MLT_Isolation_On = false
	vB_Left_MLT_Isolation_On = true
	endif
//...................................
	if "sw_Flow_From_MSV" state == true
	vB_BigMac_Isolation_On = true
	vB_RadiatorSupply_On = false
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
	goto "From_Manifold_Supply_Valve"
	endif
	if "sw_Flow_From_External" state == true
	vB_RadiatorSupply_On = false
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
	goto "From_External"
	endif
	if vB_From_Big_Mac == true
	vB_RadiatorSupply_On = false
	goto "From_Big_Mac"
	endif
	if "sw_Flow_From_Radiator" state == true
	goto "From_Radiator"
	endif
	if "sw_Flow_From_LittleMac" state == true
	vB_White_Pump = false
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
	vB_BigMac_Isolation_On = true
	vB_RadiatorSupply_On = false
	vB_BackManifold_Left_On = true
	goto "From_Little_Mac"
	endif
	if "sw_Flow_From_Brew_Kettle" state == true
	vB_White_Pump = false
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
	vB_BigMac_Isolation_On = true
	vB_RadiatorSupply_On = false
	vB_BackManifold_Left_On = true
	goto "From_Brew_Kettle"
	endif
endif
//....................................................
if vB_Fill_Little_Mac == true
print "@ 404 fill Little Mac"
vB_Yellow_Pump = false
	if vB_Fill_Counter_Clockwise == true
	vB_LittleMacIsolation_On = true
	vB_BackManifold_Left_On = false
	else
	vB_LittleMacIsolation_On = false
	vB_BackManifold_Left_On = true
	endif
//.............................
	if "sw_Flow_From_MSV" state == true
	vB_BigMac_Isolation_On = false
	vB_BackManifold_Left_On = true
	goto "From_Manifold_Supply_Valve"
	endif
	if "sw_Flow_From_External" state == true
	vB_BackManifold_Left_On = true
	goto "From_External"
	endif
	if vB_From_Big_Mac == true
	vB_BackManifold_Left_On = true
	goto "From_Big_Mac"
	endif
	if "sw_Flow_From_Radiator" state == true
	vB_White_Pump = false
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
	vB_BigMac_Isolation_On = true
	vB_BackManifold_Left_On = true
	goto "From_Radiator"
	endif
	if "sw_Flow_From_MLT" state == true
	vB_FermentFill_On = false
	vB_BrewKettleIsolation_On = true
	vB_Red_Pump = false
	vB_RedPumpValve_On = false
	vB_BrewKettleTangental_On = false
	goto "From_Mash_Tun"
	endif
	if "sw_Flow_From_Brew_Kettle" state == true
vB_LittleMacIsolation_On = true
	vB_BackManifold_Left_On = false
	goto "From_Brew_Kettle"
	endif
endif
//....................................................
if vB_Fill_Brew_Kettle == true
print "@ 451 fill Brew Kettle"
vB_Red_Pump = false
//.............
	if vB_Fill_Counter_Clockwise == true
	vB_FermentFill_On = false
	vB_BrewKettleIsolation_On = true
	vB_LittleMacIsolation_On = false
	else
	vB_BrewKettleIsolation_On = false
	vB_LittleMacIsolation_On = true
	vB_BackManifold_Left_On = true
	vB_LittleMacTangental_ON = false
	vB_Yellow_Pump = false
	vB_YellowPumpValve_On = false
	endif	
//.....................................	
	if "sw_Flow_From_MSV" state == true
vB_Yellow_Pump = false
	vB_LittleMacTangental_ON = false
	vB_YellowPumpValve_On = false
	vB_LittleMacIsolation_On = true
	vB_BackManifold_Left_On = true
		goto "From_Manifold_Supply_Valve"
	endif
	if "sw_Flow_From_External" state == true
	if "sw_Flow_From_MSV" state == true
	vB_Yellow_Pump = false
	vB_LittleMacTangental_ON = false
	vB_YellowPumpValve_On = false
	vB_LittleMacIsolation_On = true
	vB_BackManifold_Left_On = true
		goto "From_External"
	endif
	if vB_From_Big_Mac == true
	if "sw_Flow_From_MSV" state == true
	vB_Yellow_Pump = false
	vB_LittleMacTangental_ON = false
	vB_YellowPumpValve_On = false
	vB_LittleMacIsolation_On = true
	vB_BackManifold_Left_On = true
		goto "From_Big_Mac"
	endif
	if "sw_Flow_From_Radiator" state == true
	vB_BigMac_Isolation_On = true
	vB_White_Pump = false
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
	vB_Yellow_Pump = false
	vB_LittleMacTangental_ON = false
	vB_YellowPumpValve_On = false
	vB_BackManifold_Left_On = true
	vB_LittleMacIsolation_On = true
	goto "From_Radiator"
	endif
	if "sw_Flow_From_MLT" state == true
		goto "From_Mash_Tun"
	endif
	if "sw_Flow_From_LittleMac" state == true
	vB_LittleMacIsolation_On = true
	goto "From_Little_Mac"
	endif
endif
//....................................................
if "sw_Flow_To_Fermentor" state == true
print "@ 515 fill Fermentor"
	if vB_Fill_Counter_Clockwise == true
	vB_Left_MLT_Isolation_On = true
	vB_BrewKettleIsolation_On = false
	else
	vB_Red_Pump = false
	vB_BrewKettleTangental_On = false
	vB_RedPumpValve_On = false
	vB_BrewKettleIsolation_On = true
	vB_Left_MLT_Isolation_On = false
	endif
//..................
	if "sw_Flow_From_MSV" state == true
	vB_BackManifold_Left_On = true
	vB_Yellow_Pump = false
	vB_LittleMacTangental_ON = false
	vB_YellowPumpValve_On = false
	vB_LittleMacIsolation_On = true
	goto "From_Manifold_Supply_Valve"
	endif
	if "sw_Flow_From_External" state == true
	vB_BackManifold_Left_On = true
	vB_Yellow_Pump = false
	vB_LittleMacTangental_ON = false
	vB_YellowPumpValve_On = false
	vB_LittleMacIsolation_On = true
		goto "From_External"
	endif
	if vB_From_Big_Mac == true
	vB_BackManifold_Left_On = true
	vB_Yellow_Pump = false
	vB_LittleMacTangental_ON = false
	vB_YellowPumpValve_On = false
	vB_LittleMacIsolation_On = true
	goto "From_Big_Mac"
	endif
	if "sw_Flow_From_Radiator" state == true
	vB_White_Pump = false
	vB_BigMac_Isolation_On = true
	vB_BigMacTangental_On = false
	vB_WhitePumpValve_On = false
	vB_BackManifold_Left_On = true
	vB_Yellow_Pump = false
	vB_LittleMacTangental_ON = false
	vB_YellowPumpValve_On = false
	vB_LittleMacIsolation_On = true
	goto "From_Radiator"
	endif
	if "sw_Flow_From_MLT" state == true
	vB_BrewKettleIsolation_On = false
	goto "From_Mash_Tun"
	endif
	if "sw_Flow_From_LittleMac" state == true
	vB_Red_Pump = false
	vB_BrewKettleTangental_On = false
	vB_RedPumpValve_On = false
	vB_BrewKettleIsolation_On = true
	goto "From_Little_Mac"
	endif
	if "sw_Flow_From_Brew_Kettle" state == true
		goto "From_Brew_Kettle"
	endif
endif
//.............................................
//.............................................
[From_External]
print "@ 581  From External "
vB_White_Pump = false
if vB_Fill_Counter_Clockwise == true
vB_BigMac_Isolation_On = true
vB_BackManifold_Left_On = false
print 586
else
print 
vB_BigMac_Isolation_On = false
vB_BackManifold_Left_On = true
endif
if vB_Fill_Big_Mac == false
vB_BigMacTangental_On = false
vB_WhitePumpValve_On = false
endif
print 594
goto "Skip_From_End"
//...............................
[From_Manifold_Supply_Valve]
print "@ 597 From_Mainifold Supply "
vB_White_Pump = false
vB_BigMacTangental_On = false
vB_WhitePumpValve_On = false
if vB_Fill_Counter_Clockwise == true
vB_BigMac_Isolation_On = true
else
vB_BigMac_Isolation_On = false
endif
goto "Skip_From_End"
//...............................
[From_Big_Mac]
print "@ 610 From Big Mac "
vB_White_Pump = false
vB_BigMacTangental_On = false
vB_WhitePumpValve_On = true
if vB_Fill_Counter_Clockwise == true
vB_BigMac_Isolation_On = true
else
vB_BigMac_Isolation_On = false
endif
goto "Skip_From_End"
//...............................
[From_Radiator]
print "@ 622  From Radiator "
	vB_Green_Pump = false
	vB_RadiatorTangental_On = false
	vB_RadiatorSupply_On = true
	vB_RIMs_Radiator_Control_Off = true
	vB_Radiator_Body_Control_Off = true
	if vB_Fill_Counter_Clockwise == true
	vB_Right_MLT_Isolation_On = true
	vB_BigMac_Isolation_On = false
	else
	vB_Right_MLT_Isolation_On = false
	vB_BigMac_Isolation_On = true
endif
	goto "Skip_From_End"
//...............................
[From_Mash_Tun]
print "@ 638  From Mash Tun "
vB_Blue_Pump = false
vB_BluePumpValve_On = true
vB_HermsWort_On = false
	if vB_Fill_Counter_Clockwise == true
	vB_Right_MLT_Isolation_On = false
	vB_Left_MLT_Isolation_On = true
	else
	vB_Right_MLT_Isolation_On = true
	vB_Left_MLT_Isolation_On = false	
	endif
goto "Skip_From_End"
//...............................
[From_Brew_Kettle]
print "@ 652 From Brew Kettle "
vB_Red_Pump = false
vB_RedPumpValve_On = true
vB_BrewKettleTangental_On = false
	if vB_Fill_Counter_Clockwise == true
	vB_BrewKettleIsolation_On = false
	vB_LittleMacIsolation_On = true
	vB_BackManifold_Left_On = false
		if vB_Fill_Little_Mac == false
		vB_Yellow_Pump = false
		vB_LittleMacTangental_ON = false
		vB_YellowPumpValve_On = false
		endif
	else
	vB_BrewKettleIsolation_On = true
	vB_LittleMacIsolation_On = false
endif
goto "Skip_From_End"
//...............................
[From_Little_Mac]
print "@ 672  From Little Mac "
vB_Yellow_Pump = false
vB_YellowPumpValve_On = true
vB_LittleMacTangental_ON = false
	if vB_Fill_Counter_Clockwise == true
	vB_LittleMacIsolation_On = false
	vB_BackManifold_Left_On = true
	else
	vB_LittleMacIsolation_On = true
	vB_BackManifold_Left_On = false
	endif
goto "Skip_From_End"
//...............................
//...............................
[Skip_From_End]
print "@687 Skip_From_End"
//.........................................
[Set_Hoses_Manually]
print "@ 690 Set_Hoses_Manually if sw_Flow_Set_Manual =  true"
if "sw_Flow_Set_Manual" state == false
goto "Skip_Manual_Hose"
endif
vSMsg = "Confrim the External Hose is set to transfer from the "
vSMsg1 = vS_Vessel_From
vSMsg = vSMsg + vSMsg1
vSMsg1 = " to the "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vS_Vessel_To
vSMsg = vSMsg + vSMsg1
vSMsg1 = ".  The Manual Inlet Valve needs to be OPEN."
vSMsg = vSMsg + vSMsg1
//...........................
if "gblV_Pump" value  > 0
	if "gblV_Pump" value == 100
	vSMsg1 = " The MSV (TAP) will operate automatically based on time.  "
	vSMsg = vSMsg + vSMsg1
	goto "Skip_MSV"
	endif
	if "gblV_Pump" value < 6
	vSMsg1 = " The   "
	vSMsg = vSMsg + vSMsg1
	vSMsg1 = vS_Pump
	vSMsg = vSMsg + vSMsg1
	vSMsg1 = " will operate automatically based on time."
	vSMsg = vSMsg + vSMsg1
	else
	vSMsg1 = " The   "
	vSMsg = vSMsg + vSMsg1
	vSMsg1 = vS_Pump
	vSMsg = vSMsg + vSMsg1
	vSMsg1 = " must be turned On and Off manually.  There will be Alarms to do so."
	vSMsg = vSMsg + vSMsg1
	endif
endif
[Skip_MSV]
	vSMsg1 = " Click Hose and Valves Set?"
	vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "Confirm Hose and Valves Set?"
"gblS_Brewery_Bottom_4" value = "The Manifold will be set once the Confirm Hose and Valves Set? is Clicked."
//...................................
if vVValveSet == 6
vSMsg1 = "The Fermentor Hose in the Fermentor Room must be set to the "
vSMsg1 = vSMsg1 + vS_Name_Fermentor
vSMsg2 = " Fermentor. Click Fermentor Hose Set? when done."
vSMsg1 = vSMsg1 + vSMsg2
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" value = vSMsg1
"gblS_swAllSwitch_Label_Text" value = "Fermentor Hose Set?"
"gblS_Brewery_Bottom_4" value = "The Manifold will be set once the Fermentor Hose Set? is Clicked."
endif
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Bottom_4" background = 2
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"sw_Advance_ BrewStatus" background = 1
// Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Bottom_4" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//................................................
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" active = true
//................................................
vV_BrewStatus = "gblV_Brew_Status" value
"gblV_Brew_Status" value = 9998
"sw_Advance_ BrewStatus" visibility = visible
wait "gblV_Brew_Status" value == 9999
"gblV_Brew_Status" value = vV_BrewStatus
"sw_Advance_ BrewStatus" visibility = hidden
//.................................................
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"MB_28_do_ManualAlarm_B1" state = false
"alm_Manual_Warning" active = false
goto "StartValveOperation"
[Skip_Manual_Hose]
[StartValveOperation]
print "@ 782 StartValveOperation"
"gblS_Brewery_Bottom_3" background = 3
//"gblS_BrewMessageText1_B1" background = 3
"gblV_Valve_Status" value = 99
"gblS_Brewery_Top_1" value = " Set Manifold Valves."
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" visibility = visible
"tm_Display_BottomRight_B1" type = countdown
"tm_Display_BottomRight_B1" value = vT_TimerTime
//Visibility
"tmTopRight_B1" visibility = hidden
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblVReport_B1" visibility = hidden
"tmBrewDay_B1" visibility = visible
"gblS_BrewName_B1" visibility = visible
//Switch
//Red Green Blue
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblS_swAllSwitch_Label_Text" background = 3
//....................................................................
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Top_1" background = 3
"gblS_swAllSwitch_Label_Text" visibility = hidden
//Element Control...................................................
new string vS_Heat_RIMS
new string vS_Heat_Radiator_Body
new string vS_Heat_BigMac
vS_Heat_RIMs = " "
vS_Heat_Radiator_Body = " "
vS_Heat_BigMac = " "
[RIMs_Off]
print "@ 829 RIMs_Off = "
print vB_RIMs_Radiator_Control_Off
print vB_RIMs_Radiator_Control_Off
if vB_RIMs_Radiator_Control_Off == true
	if vB_RIMs_Radiator_Control_Status == false
	print "@ 834 RIMs already Off"
	goto "Radiator_Body_Off"
	endif
print "@ 837 turn Off RIMs Heater"
vB_Heat_Off = true
"MB_19_do_RIMS_Radiator_Control_B1" state = false
vS_Heat_RIMs = "The RIMS Heating Element has been turned off.  If the Rims Heater is desired after the transfer, it will need to be turned on Manually.\n"
	goto "Radiator_Body_Off"
else
goto "Radiator_Body_Off"	
endif
[Radiator_Body_Off]
print "@ 847 vB_Radiator_Body_Control_Status = "
print vB_Radiator_Body_Control_Status
if vB_Radiator_Body_Control_Off == true
	if vB_Radiator_Body_Control_Status == false
	goto "Big_Mac_Heat_Off"
	endif
print "@ 852 turn Off Radiator Body Heater"
vB_Heat_Off = true
"sw_Control_Radiator_Element" state = false
vS_Heat_Radiator_Body = "The Radiator Body Heating Element has been turned off.  If the Radiator Body is desired after the transfer, it will need to be turned on Manually.\n"
goto "Big_Mac_Heat_Off"
else
goto "Big_Mac_Heat_Off"
endif
//....................
[Big_Mac_Heat_Off]
if vB_Big_Mac_Control_Off == false
goto "Heat_Off_Msg"
else
	if vB_Big_Mac_Control_Off_Status == true
goto "Heat_Off_Msg"
	endif
print "@ 870 turn Off Big Mac Heater"
vB_Heat_Off = true
"sw_Control_BigMac_Element" state = false
vS_Heat_BigMac = "The Big Mac Heater has been turned off.  If the Big Mac Heater is desired after the transfer, it will need to be turned on Manually.\n"
goto "Heat_Off_Msg"
endif
//...........................
[Heat_Off_Msg]
if vB_Heat_Off == false
goto "Pump_Control"
endif
new string vS_Heat_Msg
vS_Heat_Msg = vS_Heat_RIMs
vS_Heat_Msg = vS_Heat_Msg + vS_Heat_Radiator_Body
vS_Heat_Msg = vS_Heat_Msg + vS_Heat_BigMac
"gblS_Brewery_Top_1" value = vS_Heat_Msg
"insp_Pix_ArrowAllSwitch_B1" background = 3
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" value = " Set Manifold Valves."
[Pump_Control]
"insp_Pix_ArrowAllSwitch_B1" background = 3
delete vS_Heat_RIMS
delete vS_Heat_Radiator_Body
delete vS_Heat_BigMac
//Pump Control.......................................................
if vB_White_Pump == true
"MB_32_do_WhitePump_B1" state = true
else
"MB_32_do_WhitePump_B1" state = false
endif
if vB_Green_Pump == true
"MB_34_do_GreenPump_B1" state = true
else
"MB_34_do_GreenPump_B1" state = false
endif
if vB_Blue_Pump == true
"MB_33_do_BluePump_B1" state = true
else
"MB_33_do_BluePump_B1" state = false
endif
if vB_Red_Pump == true
"MB_36_do_RedPump_B1" state = true
else
"MB_36_do_RedPump_B1" state = false
endif
if vB_Yellow_Pump == true
"MB_35_do_YellowPump_B1" state = true
else
"MB_35_do_YellowPump_B1" state = false
endif
[Set_Manifold]
 //Valve Status................................................................
"gblV_Valve_Status" value = 1
//Start Setting Valves
show workspace "B1 Brewery"
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_3" value = "  "
"gblS_Brewery_Top_1" visibility = visible
"gblS_Brewery_Top_1" background = 3
"gblS_swAllSwitch_Label_Text" visibility = visible
//..............................................................
vSMsg = "The Manifold Supply Valve and the FireHose Valve will shutoff  first.  This will take "
vSMsg = vSMsg + vSValveDelayTime
vSMsg1 = ". Will Auto Advance."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
//..............................................................
"gblS_swAllSwitch_Label_Text" value = "Close Manifold and Firehose Valves."
//..............................................................
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_30_do_FireHose_On_B1" state = false
//........................................
// Time Delay
"tm_Display_BottomRight_B1" displayname = "MSV and FireHose Off"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
//........................................
"gblS_Brewery_Top_1" background = 3
"gblS_swAllSwitch_Label_Text" visibility = visible
[Set 1]
print "@ 960 Set 1"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//.......................................................
"gblS_swAllSwitch_Label_Text" value = "First Set of Valves."
//.......................................................
if vVSkipSet1 == 1
"gblS_Brewery_Top_1" value = "First Set: No valves in 1st set.  Will Auto Advance"
goto "SkipSet1"
endif
//..............................................................
vSMsg = "First Set: All Valves will operate in different sections.  Each set will take "
vSMsg = vSMsg + vSValveDelayTime
vSMsg1 = ". Will Auto Advance."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" visibility = visible
//Valves Set 1 ..........................................
//VA 1
if vB_WhitePumpValve_On == true
"VGC_49_do_WhitePumpValve_On_B1" state = true
else
"VGC_49_do_WhitePumpValve_On_B1" state = false
endif
//VB 1
if vB_Right_MLT_Isolation_On == true
"VGC_26_do_Right_MLT_Isolation_On_B1" state = true
else
"VGC_26_do_Right_MLT_Isolation_On_B1" state = false
endif
//VC 1
if vB_RedPumpValve_On == true
"VGC_3_do_RedPumpValve_On_B1" state = true
else
"VGC_3_do_RedPumpValve_On_B1" state = false
endif
//VD 1
if vB_LittleMacTangental_ON == true
"VGC_25_do_LittleMacTangental_ON_B1" state = true
else
"VGC_25_do_LittleMacTangental_ON_B1" state = false
endif
//end Set 1..................................................
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
goto "Set2"
[SkipSet1]
"gblS_Brewery_Top_1" visibility = visible
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Skip Set 1"
"tm_Display_BottomRight_B1" value = 00:00:03
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
[Set2]
print "@ 1036 Set 2"
//.......................................................
"gblS_swAllSwitch_Label_Text" value = "Second Set of Valves."
//.......................................................
if vVSkipSet2 == 1
"gblS_Brewery_Top_1" value = "Second Set: No valves in 2nd set.  Will Auto Advance"
goto "SkipSet2"
endif
//..............................................................
vSMsg = "Second Set: All Valves will operate in different sections.  Each set will take "
vSMsg = vSMsg + vSValveDelayTime
vSMsg1 = ". Will Auto Advance."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" visibility = visible
//Start Set 2..................................................
//Valves Set 2 ..........................................
"gblS_swAllSwitch_Label_Text" value = "Second Set of Valves."
//.......................................................
//VA 2
if vB_BigMacTangental_On == true
"VGC_47_do_BigMacTangental_On_B1" state = true
else
"VGC_47_do_BigMacTangental_On_B1" state = false
endif
//VB 2
if vB_CrossManifold_On == true
"VGC_28_do_CrossManifold_On_B1" state = true
else
"VGC_28_do_CrossManifold_On_B1" state = false
endif
//VC 2
if vB_FermentFill_On == true									
"VGC_5_do_FermentFill_On_B1" state = true
else
"VGC_5_do_FermentFill_On_B1" state = false
endif
//VD 2
if vB_BackManifold_Left_On == true
"VGC_23_do_BackManifold_Left_On_B1" state = true
else
"VGC_23_do_BackManifold_Left_On_B1" state = false
endif
//End Set 2..................................................
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
goto "Set3"
[SkipSet2]
"gblS_Brewery_Top_1" visibility = visible
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Skip Set 2"
"tm_Display_BottomRight_B1" value = 00:00:03
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
[Set3]
print "@ 1098 Set 3"
//.......................................................
"gblS_swAllSwitch_Label_Text" value = "Third Set of Valves."
//.......................................................
if vVSkipSet3 == 1
"gblS_Brewery_Top_1" value = "Third Set: No valves in 3rd set.  Will Auto Advance"
goto "SkipSet3"
endif
//..............................................................
vSMsg = "Third Set: All Valves will operate in different sections.  Each set will take "
vSMsg = vSMsg + vSValveDelayTime
vSMsg1 = ". Will Auto Advance."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" visibility = visible
//Start Set 3..................................................
//Valves Set 3 ..........................................
//VA 3
if vB_RadiatorTangental_On == true
"VGC_45_do_RadiatorTangental_On_B1" state = true
else
"VGC_45_do_RadiatorTangental_On_B1" state = false
endif
//VB 3
if vB_FireHose_On == true
"VGC_30_do_FireHose_On_B1" state = true
else
"VGC_30_do_FireHose_On_B1" state = false
endif
//VC 3
//VD 2
if vB_Left_MLT_Isolation_On == true
"VGC_7_do_Left_MLT_Isolation_On_B1" state = true
else
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
endif
//VD 3
if vB_YellowPumpValve_On == true
"VGC_15_do_YellowPumpValve_On_B1" state = true
else
"VGC_15_do_YellowPumpValve_On_B1" state = false
endif
//VD 3
if vB_BackManifold_Left_On == true
"VGC_23_do_BackManifold_Left_On_B1" state = true
else
"VGC_23_do_BackManifold_Left_On_B1" state = false
endif
//End Set 3..................................................
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Set 3"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
goto "Set4"
[SkipSet3]
"gblS_Brewery_Top_1" visibility = visible
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Skip Set 3"
"tm_Display_BottomRight_B1" value = 00:00:03
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
[Set4]
print "@ 1165 Set 4"
//.......................................................
"gblS_swAllSwitch_Label_Text" value = "Fourth Set of Valves."
//.......................................................
if vVSkipSet4 == 1
"gblS_Brewery_Top_1" value = "Fourth Set: No valves in 4th set.  Will Auto Advance"
goto "SkipSet4"
endif
//..............................................................
vSMsg = "Fourth Set: All Valves will operate in different sections.  Each set will take "
vSMsg = vSMsg + vSValveDelayTime
vSMsg1 = ". Will Auto Advance."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" visibility = visible
//Start Set 4..................................................
//Valves Set 4 ..........................................
//VA 4
if vB_CoolingWater_On == true
"VGC_43_do_CoolingWater_On_B1" state = true
else
"VGC_43_do_CoolingWater_On_B1" state = false
endif
//VB 4
if vB_RadiatorSupply_On == true
"VGC_32_do_RadiatorSupply_On_B1" state = true
else
"VGC_32_do_RadiatorSupply_On_B1" state = false
endif
//VC 4
if vB_BluePumpValve_On == true
"VGC_8_do_BluePumpValve_On_B1" state = true
else
"VGC_8_do_BluePumpValve_On_B1" state = false
endif
//VD 4
if vB_LittleMacIsolation_On == true
"VGC_17_do_LittleMacIsolation_On_B1" state = true
else
"VGC_17_do_LittleMacIsolation_On_B1" state = false
endif
//End Set 4..................................................
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Set 4"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
goto "Set5"
[SkipSet4]
"gblS_Brewery_Top_1" visibility = visible
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Skip Set 4"
"tm_Display_BottomRight_B1" value = 00:00:03
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
[Set5]
print "@ 1225 Set 5"
//.......................................................
"gblS_swAllSwitch_Label_Text" value = "Final Set of Valves."
//.......................................................
if vVSkipSet5 == 1
"gblS_Brewery_Top_1" value = "Final Set: No valves in Final set.  Will Auto Advance"
goto "SkipSet5"
endif
//..............................................................
vSMsg = "Final Set: All Valves will operate in different sections.  Each set will take "
vSMsg = vSMsg + vSValveDelayTime
vSMsg1 = ". Will Auto Advance."
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_1" value = vSMsg
"gblS_Brewery_Top_1" visibility = visible
//Start Set 5..................................................
//Valves Set 5 Final..........................................
//VA 5
if vB_BrewKettleIsolation_On == true
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
else
"VGC_41_do_BrewKettleIsolation_On_B1" state = false
endif
//VB 5
if vB_BigMac_Isolation_On == true
"VGC_34_do_BigMac_Isolation_On_B1" state = true
else
"VGC_34_do_BigMac_Isolation_On_B1" state = false
endif
//VC 5
if vB_HermsWort_On == true
"VGC_13_do_HermsWort_On_B1" state = true
else
"VGC_13_do_HermsWort_On_B1" state = false
endif
//VD 5
if vB_BrewKettleTangental_On == true
"VGC_19_do_BrewKettleTangental_On_B1" state = true
else
"VGC_19_do_BrewKettleTangental_On_B1" state = false
endif
//VE 5
"VGC_39_Back_Drain_On_B1" state = false
//End Set 5..................................................
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Set Final"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
goto "SetEnd"
[SkipSet5]
"gblS_Brewery_Top_1" visibility = visible
// Time Delay
"tm_Display_BottomRight_B1" displayname = "Skip Final Set"
"tm_Display_BottomRight_B1" value = 00:00:03
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
[SetEnd]
"tm_Display_BottomRight_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
"gblS_Brewery_Top_1" value = " " 
"gblS_Brewery_Top_1" visibility = hidden
"gblVStartBrew" value = 1
//...........................................
//...........................................
[ExitLoopValve]
// Isolation Valve Close
vV_Isolation_Valve = "gblV_Isolation_Valve" value
if vV_Isolation_Valve == 0
goto "Skip_Isolation"
endif
if vV_Isolation_Valve == 1
"VGC_49_do_WhitePumpValve_On_B1" state = false
"VGC_47_do_BigMacTangental_On_B1"  state = false
vS_Isolation_Valve = " Isolation Valves : White Pump Supply && Big Mac Tangental Valve both closed. Both will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 2
"VGC_32_do_RadiatorSupply_On_B1" state = false
vS_Isolation_Valve = " Isolation Valve : Radiator Supply Valve closed. The Radiator Supply Valve will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 3
	"VGC_13_do_HermsWort_On_B1" state = false
	"VGC_8_do_BluePumpValve_On_B1" state = false
	if "sw_Flow_Sparge_1" state == true
	vS_Isolation_Valve = " Isolation Valve : HERMs WORT Valve. The HERMs WORT Valve will open at the beginning of transfer."
	else
	"VGC_13_do_HermsWort_On_B1" state = false
	vS_Isolation_Valve = " Isolation Valves : Blue Pump Supply && HERMs WORT Valve both closed. Both will open at the beginning of transfer."
	endif
endif
if vV_Isolation_Valve == 4
"VGC_3_do_RedPumpValve_On_B1" state = false
"VGC_19_do_BrewKettleTangental_On_B1" state = false
vS_Isolation_Valve = " Isolation Valves : Red Pump Supply && Brew Kettle Tangental Valve both closed. Both will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 5
"VGC_15_do_YellowPumpValve_On_B1" state = false
"VGC_25_do_LittleMacTangental_ON_B1" state = false
vS_Isolation_Valve = " Isolation Valve : Yellow Pump Supply && Little Mac Tangental Valve both closed. Both will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 6
"VGC_5_do_FermentFill_On_B1" state = false
vS_Isolation_Valve = " Isolation Valve : Fermentor Fill Valve closed. The Fermentor Fill Valve will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 7
"VGC_34_do_BigMac_Isolation_On_B1" state = false
vS_Isolation_Valve = "Big Mac Isolation Valve closed. The Big Mac Isolation Valve will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 8
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
vS_Isolation_Valve = " Isolation Valve : Left MLT Isolation Valve closed. The Left MLT Isolation Valve will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 9
"VGC_41_do_BrewKettleIsolation_On_B1" state = false
vS_Isolation_Valve = " Isolation Valve : Brew Kettle Isolation Valve closed. The Brew Kettle Isolation Valve will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 10
"VGC_17_do_LittleMacIsolation_On_B1" state = false
vS_Isolation_Valve = "Little Mac Isolation Valve closed. The Little Mac Isolation Valv will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 11
"VGC_23_do_BackManifold_Left_On_B1" state = false
vS_Isolation_Valve = " Isolation Valve : Back Left Manifold Valve closed. The Back Left Manifold Valve will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 12
"VGC_26_do_Right_MLT_Isolation_On_B1" state = false
vS_Isolation_Valve = " Isolation Valve : Right MLT Isolation Valve closed. The Right MLT Isolation Valve will open at the beginning of transfer."
endif
if vV_Isolation_Valve == 13
"VGC_49_do_WhitePumpValve_On_B1" state = false
"VGC_47_do_BigMacTangental_On_B1"  state = false
vS_Isolation_Valve = " Isolation Valve : White Pump Valve closed. The White Pump Valve will open at the beginning of transfer."
endif
//........................................................
[Skip_Isolation]
"gblVScriptFlow" value = 101
//vSMsg = "The Manifold should be set. You are the Safety and Control.  Insure all Valves, Heaters and Pumps are set correctly. Click Start Transfer? to begin the transfer."
//if "sw_Flow_Skip_Time_or_SPG" state == true
//vSMsg1 =  "  Click Start Transfer?"
//goto "Skipper_1"
//endif
//if "sw_Status_From_Switch_Water_Pane" state == true 
//vSMsg1 =  "  Click Manifold Checked? to Start the transfer next."
//else
//vSMsg1 =  "  Click Manifold Checked? to continue and set either Time or Gallons for the transfer next."
////endif
//[Skipper_1]
//vSMsg = vSMsg + vSMsg1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_2" value = "The Manifold should be set. You are the Safety and Control.  Insure all Valves, Heaters and Pumps are set correctly. Click Start Transfer? to begin the transfer." 
if vV_Isolation_Valve > 0
"gblS_Brewery_Bottom_4" value = vS_Isolation_Valve
"gblS_Brewery_Bottom_4" background = 2
"gblS_Brewery_Bottom_4" visibility = visible
endif
"gblS_swAllSwitch_Label_Text" value = "Start Transfer?"
"gblS_BrewName_B1" value = "gblS_Water_Text" value
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"gblS_Brewery_Top_2" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblVReport_B1" visibility = hidden
"gblS_BrewName_B1" visibility = visible

//................................................
vV_BrewStatus = "gblV_Brew_Status" value
"gblV_Brew_Status" value = 9998
"sw_Advance_ BrewStatus" visibility = visible
wait "gblV_Brew_Status" value == 9999
"gblV_Brew_Status" value = vV_BrewStatus
"sw_Advance_ BrewStatus" visibility = hidden
//.................................................
"gblV_Valve_Status" value = 0
//print "@ 1432 Choice Time or Gallons"
//if "sw_Flow_Skip_Time_or_SPG" state == true
//sw_Flow_Skip_Time_or_SPG" state = false
//goto "Ender_scrValveOps"
//endif
//start "sub_scrTimeorVolume"
//"gblS_Inter_Script" value = "@ 1438  scrvalveOpertion if sw_Flow_Skip_Time_or_SPG = false //sub_scrTimeorVolume
//sleep 101
[Ender_scrValveOps]
if vB_Testing == true
"gblS_Inter_Script" value = "ended: sub_2_scrValveOperation"
sleep 101
endif
start "sub_3_scrCalculateSPG"
sleep 100
if vB_Testing == true
"gblS_Inter_Script" value = "@ 1459 sub_2_scrValveOperation > start: sub_3_scrCalculateSPG"
sleep 101
endif
"sw_Running_ValveOperation" state = false
clear
stop "sub_2_scrValveOperation"
```

## 72. sub_2_scrPrimeandBasicManifold

Starts by itself: No · User can start or stop it: Yes · 1508 lines

```text
//sub_2_scrPrimeandBasicManifold Modified 260909 06_13
//06/05/2026 08:36
//seperated from scrWater
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Modified
//Primes all Pumps and Basic Manifold (non tranferring)
//new string vSMsg
//new string vSMsg1
"sw_Running_Prime_Basic" state = true
"sw_Running_Script_D" state  = true
start "inscpt_scr_Inner_Blue"
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//................................
//................................
new string vSMsg_Top
new string vSMsg_Bottom
new time vT_Time_Prime
new time vT_TimerTime
new value vV_Saved_gblV_Brew_Status
new value vV_BrewStatus
new value vVSwitchNumber
new value vV_Brewzilla_Recyle
new string vS_Msg_Recycle
new string vS_Msg_Recycle_2
new string vS_Msg_Recycle_Label
vT_TimerTime = "gblTValveDelay" value
vS_Msg_Recycle_Label = "Message Read?"
new bool vB_Big_Mac_Heat
new bool vB_RIMs_Heat
vS_Msg_Recycle = " "
vS_Msg_Recycle_Label = " "
"sw_Flow_Skip_Time_or_SPG" state = true
//........................................................................
//........................................................................
vT_Time_Prime = 00:00:05
//........................................................................
vV_Saved_gblV_Brew_Status = "gblV_Brew_Status" value
vVSwitchNumber = "gblV_Water_Switch_Status_Water" value
new time vT_Valve_Delay 
vT_Valve_Delay = "gblTValveDelay" value
if "sw_Restore_Valves" state == true
start "sub_3_scrRestoreAfterWater"
endif
if vVSwitchNumber == 101
if "sw_Flow_Big_Mac_Do_Not_Turn_Heat_On" state == true
vS_Msg_Recycle = "The Big Mac Valves are set to recycle the Big Mac. The White Pump is ON.  The Big Mac Heater will be READY to turn on.  Wait!  Will Auto Advance"
else
vS_Msg_Recycle = "The Big Mac Valves are set to recycle the Big Mac. The White Pump is ON.  The Big Mac Heater is ON.  Wait!  Will Auto Advance"
endif
goto "Big_Mac_Recycle"
endif
if vVSwitchNumber == 202
vS_Msg_Recycle = "The Radiator Valves and Green Pump will be set to recycle the Raidator.  Wait!  Will Auto Advance"
goto "Radiator_Recycle"
endif
if vVSwitchNumber == 303
vS_Msg_Recycle = "The Mash Tun Valves will be set to recycle the Mash Tun through the HERMs Coil.  The Blue Pump will Turn On.  Wait!  Will Auto Advance"
goto "Mash_Tun_Recycle"
endif
if vVSwitchNumber == 404
vS_Msg_Recycle = "The Brew Kettle Valves and Red Pump will be set to recycle the Brew Kettle.  Wait!  Will Auto Advance"
goto "Brew_Kettle_Recycle"
endif
if vVSwitchNumber == 505
vS_Msg_Recycle = "Setting Little Mac Valves and Yellow Pump will be set to recycle the Little Mac.   Wait.  Will Auto Advance "
goto "Little_Mac_Recycle"
endif
if vVSwitchNumber == 707
start "sub_2_scrPrimeandBasicManifold_Brewzilla"
goto "End_sub_2_scrPrimeandBasicManifold"
endif
if vVSwitchNumber == 808
start "sub_2_scrPrimeandBasicManifold_External"
goto "End_sub_2_scrPrimeandBasicManifold"
endif
if vVSwitchNumber == 909
start "sub_2_scrPrimeandBasicManifold_External"
goto "End_sub_2_scrPrimeandBasicManifold"
endif
if vVSwitchNumber == 708
start "sub_2_scrPrimeandBasicManifold_External"
goto "End_sub_2_scrPrimeandBasicManifold"
endif
if vVSwitchNumber == 709
start "sub_2_scrPrimeandBasicManifold_External"
goto "End_sub_2_scrPrimeandBasicManifold"
endif
if vVSwitchNumber == 807
start "sub_2_scrPrimeandBasicManifold_External"
goto "End_sub_2_scrPrimeandBasicManifold"
endif
if vVSwitchNumber == 809
start "sub_2_scrPrimeandBasicManifold_External"
goto "End_sub_2_scrPrimeandBasicManifold"
endif
if vVSwitchNumber == 907
start "sub_2_scrPrimeandBasicManifold_External"
goto "End_sub_2_scrPrimeandBasicManifold"
endif
if vVSwitchNumber == 908
start "sub_2_scrPrimeandBasicManifold_External"
goto "End_sub_2_scrPrimeandBasicManifold"
endif
if vVSwitchNumber == 4000
goto "PrimePumps"
endif
if vVSwitchNumber == 4001
goto "Big_Mac_Recycle"
endif
if vVSwitchNumber == 4002
goto "Start_HERMs"
endif
if vVSwitchNumber == 4003
vB_RIMs_Heat = true
goto "RIMs_Heat_On"
endif
if vVSwitchNumber == 5004
goto "Whirlpool_Brew_Kettle"
endif
if vVSwitchNumber == 5005
goto "Whirlpool_Little Mac"
endif
if vVSwitchNumber == 6001
goto "Sanitize_BigMac"
endif
if vVSwitchNumber == 6002
goto "Sanitize_Radiator"
endif
if vVSwitchNumber == 6004
//Chill_Brew_Kettle
goto "Whirlpool_Brew_Kettle"
endif
if vVSwitchNumber == 6005
//Chill_Litttle_Mac
goto "Whirlpool_Little Mac"
endif
if vVSwitchNumber == 6007
goto "Chill_Brewzilla"
endif
//..........................................
//******************************************
//..........................................
[Sanitize_BigMac]
print "@178 Sanitize_BigMac"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...............................
"gblS_Top_Text" value =  "Set the Fermentor Hose in the Fermentor Room to Recycle.  Set the return Hose to the Big Mac from the Fermentor Hose.  Click Hoses Set? when done"
"gblS_Bottom_Text" value = "You are the Safety and Control. Insure the Hoses are secure!"
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" loop = true
"alm_Manual_Warning" active = true
//........................
start "inscpt_scrAdvancewithSwitch"
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"MB_28_do_ManualAlarm_B1" state = false
//...............................
//...............................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_3" value = "This will Change several Valves and prepare the Manifold to Santitize the Plate Chiller and Fermentor Hose using the Big Mac via the back Manifold.  The Isolation Valve is the Fermentor Fill Valve and will operate automatically.  Wait!  Will Auto Advance."
"gblS_swAllSwitch_Label_Text"  value = "Valves will be set.  Wait!  Will Auto Advance"
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"tm_Display_BottomRight_B1" displayname = "Set Valves "
"tm_Display_BottomRight_B1" value = 00:00:07
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Element Control
//Pump Control
"MB_32_do_WhitePump_B1" state = false
"MB_36_do_RedPump_B1" state = false
"MB_35_do_YellowPump_B1" state = false
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold: Santize Plate Chiller with Big Mac"
"gblS_Brewery_Top_3" value = "Changing Valve Set 1.  Wait!  Will Auto Advance."
"VGC_49_do_WhitePumpValve_On_B1" state = true
//"VGC_26_do_Right_MLT_Isolation_On_B1" state = false
"VGC_3_do_RedPumpValve_On_B1" state = false
"VGC_25_do_LittleMacTangental_ON_B1" state = false
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
//Set 2................................
"gblS_Brewery_Top_3" value = "Changing Valve Set 2.  Wait!  Will Auto Advance."
"VGC_47_do_BigMacTangental_On_B1" state = false
"VGC_28_do_CrossManifold_On_B1" state = false
"VGC_5_do_FermentFill_On_B1" state = false
"VGC_23_do_BackManifold_Left_On_B1" state = true
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 3................................
"gblS_Brewery_Top_3" value = "Changing Valve Set 3.  Wait!  Will Auto Advance."
"VGC_30_do_FireHose_On_B1" state = false
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
"VGC_15_do_YellowPumpValve_On_B1" state = false
"tm_Display_BottomRight_B1" displayname = "Set 3"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 4................................
"gblS_Brewery_Top_3" value = "Changing Valve Set 4.  Wait!  Will Auto Advance."
"VGC_43_do_CoolingWater_On_B1" state = false
"VGC_17_do_LittleMacIsolation_On_B1" state = true
"tm_Display_BottomRight_B1" displayname = "Set 4"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 5................................
"gblS_Brewery_Top_3" value = "Changing Valve Final Set.  Wait!  Will Auto Advance."
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"VGC_34_do_BigMac_Isolation_On_B1" state = false
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"tm_Display_BottomRight_B1" displayname = "Final Set"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = hidden
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "Manifold: Santize Plate Chiller with Big Mac"
"gblS_Water_Text" value = "Manifold: Santize Plate Chiller with Big Mac"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
//...............................
//...............................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...............................
"gblS_Top_Text" value =  "Manifold is set.  Turn on the White Pump to start sanitizing the Plate chiller and the Fermentor Hose.  The Isolation Valve (Fermentor Fill Valve) will also open.  Click White Pump?"
"gblS_Bottom_Text" value = "You are the Safety and Control.  Watch for leaks or unsecured Hoses."
"gblS_swAllSwitch_Label_Text" value = "White Pump?"
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
//...............................
//...............................
"MB_32_do_WhitePump_B1" state = true
"VGC_5_do_FermentFill_On_B1" state = true
"sw_Control_BigMac_Element" state = true
//...............................
//...............................
"gblS_Top_Text" value = "Sanitizing Plate Chiller and Fermentor Hose from the Big Mac.  Will Auto Advance"
"gblS_Bottom_Text" value = "Check Big Mac Heater ON and Temperature"
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
"sw_Use_Bottom_3" state = true
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
goto "End_sub_2_scrPrimeandBasicManifold"
//..........................................
//******************************************
//..........................................
[Sanitize_Radiator]
print "@347 Sanitize_Radiator"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"sw_Use_Sanitize_Radiator" state = false
"sw_Control_RIMs_Element" state = false
//...............................
"gblS_Top_Text" value =  "Set the Fermentor Hose in the Fermentor Room to Recycle.  Set the return Hose to the Radiator from the Fermentor Hose.  Click Hoses Set? when done"
"gblS_Bottom_Text" value = "You are the Safety and Control. Insure the Hoses are secure!"
"gblS_swAllSwitch_Label_Text" value = "Hoses Set?"
"MB_28_do_ManualAlarm_B1" state = true
"alm_Manual_Warning" fileindex = 3
"alm_Manual_Warning" loop = true
"alm_Manual_Warning" active = true
//........................
start "inscpt_scrAdvancewithSwitch"
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"MB_28_do_ManualAlarm_B1" state = false
//...............................
//...............................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_3" value = "This will Change several Valves and prepare the Manifold to Santitize the Plate Chiller and Fermentor Hose using the Radiator via the back Manifold.  The Isolation Valve is the Fermentor Fill Valve and will operate automatically.  Wait!  Will Auto Advance."
"gblS_swAllSwitch_Label_Text"  value = "Valves will be set.  Wait!  Will Auto Advance"
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"tm_Display_BottomRight_B1" displayname = "Set Valves "
"tm_Display_BottomRight_B1" value = 00:00:07
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Element Control
//Pump Control
"MB_34_do_GreenPump_B1" state = false
"MB_32_do_WhitePump_B1" state = false
"MB_36_do_RedPump_B1" state = false
"MB_35_do_YellowPump_B1" state = false
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold: Santize Plate Chiller with Radiator"
"gblS_Brewery_Top_3" value = "Changing Valve Set 1.  Wait!  Will Auto Advance."
"VGC_49_do_WhitePumpValve_On_B1" state = false
"VGC_26_do_Right_MLT_Isolation_On_B1" state = false
"VGC_3_do_RedPumpValve_On_B1" state = false
"VGC_25_do_LittleMacTangental_ON_B1" state = false
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1" 
//Set 2................................
"gblS_Brewery_Top_3" value = "Changing Valve Set 2.  Wait!  Will Auto Advance."
"VGC_47_do_BigMacTangental_On_B1" state = false
"VGC_28_do_CrossManifold_On_B1" state = false
"VGC_5_do_FermentFill_On_B1" state = false
"VGC_23_do_BackManifold_Left_On_B1" state = true
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 3................................
"gblS_Brewery_Top_3" value = "Changing Valve Set 3.  Wait!  Will Auto Advance."
"VGC_45_do_RadiatorTangental_On_B1" state = false
"VGC_30_do_FireHose_On_B1" state = false
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
"VGC_15_do_YellowPumpValve_On_B1" state = false
"tm_Display_BottomRight_B1" displayname = "Set 3"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 4................................
"gblS_Brewery_Top_3" value = "Changing Valve Set 4.  Wait!  Will Auto Advance."
"VGC_43_do_CoolingWater_On_B1" state = false
"VGC_32_do_RadiatorSupply_On_B1" state = true
"VGC_17_do_LittleMacIsolation_On_B1" state = true
"tm_Display_BottomRight_B1" displayname = "Set 4"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 5................................
"gblS_Brewery_Top_3" value = "Changing Valve Final Set.  Wait!  Will Auto Advance."
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"VGC_34_do_BigMac_Isolation_On_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"tm_Display_BottomRight_B1" displayname = "Final Set"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = hidden
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "Manifold: Santize Plate Chiller with Radiator"
"gblS_Water_Text" value = "Manifold: Santize Plate Chiller with Radiator"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
//...............................
//...............................
print "@480 Green Pump On"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...............................
"gblS_Top_Text" value =  "Manifold is set.  Turn on the Green Pump to start sanitizing the Plate chiller and the Fermentor Hose.  The Isolation Valve (Fermentor Fill Valve) will also open.  Click Green Pump?"
"gblS_Bottom_Text" value = "You are the Safety and Control.  Watch for leaks or unsecured Hoses."
"gblS_swAllSwitch_Label_Text" value = "Green Pump?"
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
//...............................
//...............................
"MB_34_do_GreenPump_B1" state = true
"VGC_5_do_FermentFill_On_B1" state = true
//...............................
//...............................
//...............................
print "@ 503 RIMs Heat On"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...............................
"gblS_Top_Text" value =  "Turn on the RIMs heater.   Click RIMs Heater?"
"gblS_Bottom_Text" value = "You are the Safety and Control.  Insure there is flow back to the Radiator!"
"gblS_swAllSwitch_Label_Text" value = "RIMs Heater?"
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
//...............................
//...............................
"sw_Use_Sanitize_Radiator" state = true
"sw_Control_RIMs_Element" state = true
//...............................
//...............................
"gblS_Top_Text" value = "Sanitizing Plate Chiller and Fermentor Hose from the Radiator.  Will Auto Advance"
"gblS_Bottom_Text" value = "Check RIMs Heater ON and Temperature"
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
"sw_Use_Bottom_3" state = true
"sw_Use_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//........................................
goto "End_sub_2_scrPrimeandBasicManifold"
//..........................................
//******************************************
//..........................................
[PrimePumps]
print "@501 Prime Pumps"
show workspace "B1 Brewery"
"gblS_Brewery_Top_3" background = 1
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_3" value = "Priming All Pumps"
"gblS_Brewery_Top_3"  visibility = visible
"VGC_32_do_RadiatorSupply_On_B1" state = true
"VGC_7_do_Left_MLT_Isolation_On_B1" state = true
//............................................................
//Short Delay  7 Seconds
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" displayname = "Short Delay"
"tm_Display_BottomRight_B1" value = 00:00:07
"tm_Display_BottomRight_B1" type = countdown
"tm_Display_BottomRight_B1" visibility = visible
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait "tm_Display_BottomRight_B1" value <= 00:00:00
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = hidden
//..........................................
print "@ 1805 Green Pump"
//Green Pump
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
"tm_Action_BottomRight_B1" value = 00:00:06
"gblS_Brewery_Top_3" value = "Priming Green Pump"
"gblS_Brewery_Top_3" visibility = visible
"tm_Action_BottomRight_B1" displayname = "Green Pump"
"VGC_36_do_ManifoldFill_On_B1" state = true
start "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" visibility = visible
wait "tm_Action_BottomRight_B1" value <= 00:00:00
stop "tm_Action_BottomRight_B1"
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_32_do_RadiatorSupply_On_B1" state = false
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
//............................................................
//Blue Pump
"tm_Action_BottomRight_B1" value = vT_Time_Prime
"gblS_Brewery_Top_3" value = "Priming Blue Pump"
"tm_Action_BottomRight_B1" displayname = "Blue Pump"
"VGC_8_do_BluePumpValve_On_B1" state = true
"VGC_34_do_BigMac_Isolation_On_B1" state = true
"VGC_36_do_ManifoldFill_On_B1" state = true
start "tm_Action_BottomRight_B1"
wait "tm_Action_BottomRight_B1" value <= 00:00:00
stop "tm_Action_BottomRight_B1"
"VGC_8_do_BluePumpValve_On_B1" state = false
//............................................................
// White Pump
"tm_Action_BottomRight_B1" value = vT_Time_Prime
"tm_Action_BottomRight_B1" displayname = "White Pump"
"tm_Action_BottomRight_B1" visibility = visible
"gblS_Brewery_Top_3" value = "Priming White Pump"
"VGC_34_do_BigMac_Isolation_On_B1" state = false
"VGC_49_do_WhitePumpValve_On_B1" state = true
"VGC_36_do_ManifoldFill_On_B1" state = true
start "tm_Action_BottomRight_B1"
wait "tm_Action_BottomRight_B1" value <= 00:00:00
stop "tm_Action_BottomRight_B1"
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_49_do_WhitePumpValve_On_B1" state = false
//............................................................
//Red Pump
"tm_Action_BottomRight_B1" value = vT_Time_Prime
"gblS_Brewery_Top_3" value = "Priming Red Pump"
"tm_Action_BottomRight_B1" displayname = "Red Pump"
"VGC_34_do_BigMac_Isolation_On_B1"  state = true
"VGC_28_do_CrossManifold_On_B1" state = true
"VGC_3_do_RedPumpValve_On_B1" state = true
"VGC_36_do_ManifoldFill_On_B1" state = true
start "tm_Action_BottomRight_B1"
wait "tm_Action_BottomRight_B1" value <= 00:00:00
stop "tm_Action_BottomRight_B1"
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_3_do_RedPumpValve_On_B1" state = false
"VGC_28_do_CrossManifold_On_B1" state = false
//............................................................
//Yellow Pump
"tm_Action_BottomRight_B1" value = vT_Time_Prime
"gblS_Brewery_Top_3" value = "Priming Yellow Pump"
"tm_Action_BottomRight_B1" displayname = "Yellow Pump"
"VGC_23_do_BackManifold_Left_On_B1" state = false
"VGC_7_do_Left_MLT_Isolation_On_B1" state = true
"VGC_15_do_YellowPumpValve_On_B1" state = true
"VGC_36_do_ManifoldFill_On_B1" state = true
start "tm_Action_BottomRight_B1"
wait "tm_Action_BottomRight_B1" value <= 00:00:00
stop "tm_Action_BottomRight_B1"
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_28_do_CrossManifold_On_B1" state = true
"VGC_15_do_YellowPumpValve_On_B1" state = false
//.................................................
//Ending Priming
"gblS_Brewery_Top_3" background = 3
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_23_do_BackManifold_Left_On_B1" state = false
"gblS_Brewery_Top_3" value = "All Pumps Primed!"
//............................................................
//Short Delay  7 Seconds 
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
"sw_Advance_ BrewStatus" visibility = hidden
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" displayname = "Short Delay"
"tm_Display_BottomRight_B1" value = 00:00:07
"tm_Display_BottomRight_B1" type = countdown
"tm_Display_BottomRight_B1" visibility = visible
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait "tm_Display_BottomRight_B1" value <= 00:00:00
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = hidden
//..............................................................
goto "End_sub_2_scrPrimeandBasicManifold"
//..........................................
//******************************************
//..........................................
[Big_Mac_Recycle]
print "@644 Big_Mac_Recycle"
start "inscpt_scrClearB1_Brewery"
sleep 100
if "sw_Status_Manifold_Recyle_MLT" state == true
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Big Mac with Heat On"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "The Manifold will be set to Recycle the Big Mac.  The Big Heater will be turned on if Off."
"gblS_Bottom_Text" value = "You are the Safety and Control!"
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
"sw_Use_Bottom_4" state = true
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//Element Control
//Pump Control
"MB_32_do_WhitePump_B1" state = false
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Big Mac with Big Mac Heat On"
"VGC_49_do_WhitePumpValve_On_B1" state = true
//...................................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"gblS_Brewery_Top_1" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text"  background = 3
// Visibility
"gblS_Brewery_Top_1" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
//.............................
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = vT_Valve_Delay
"gblS_Brewery_Top_1" value = "Set 1 Valves are repositioning. Wait. Will Auto Advance."
"gblS_swAllSwitch_Label_Text" value = "Valve Set 1. Wait. Will Auto Advance"
"tm_Display_BottomRight_B1" visibility = visible
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//........................................
//Set 2................................
"VGC_47_do_BigMacTangental_On_B1"  state = true
"VGC_28_do_CrossManifold_On_B1" state = false
"VGC_23_do_BackManifold_Left_On_B1" state = false
"VGC_34_do_BigMac_Isolation_On_B1"  state = false
//...................................................
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = vT_Valve_Delay
"gblS_Brewery_Top_1" value = "Set 2 Valves are repositioning. Wait. Will Auto Advance."
"gblS_swAllSwitch_Label_Text" value = "Valve Set 2. Wait. Will Auto Advance"
start "tm_Display_BottomRight_B1"
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//........................................
//........................................
"tm_Display_BottomRight_B1" visibility = hidden
"gblS_Brewery_Top_1" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text"  visibility = hidden
//Pump Control On
"MB_32_do_WhitePump_B1" state = true
//Element Control
"sw_Control_BigMac_Element" state = true
"gblS_BrewName_B1" value = "Manifold: Recyle Big Mac with Big Mac Heat On"
"gblS_Water_Text" value = "Manifold: Recyle Big Mac with Big Mac Heat On"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "The Manifold is set to Recycle the Big Mac.  The Big Heater is ON."
"gblS_Bottom_Text" value = "You are the Safety and Control!"
// 5 Second Delay
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
"sw_Use_Bottom_4" state = true
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
goto "End_sub_2_scrPrimeandBasicManifold"
//..........................................
//******************************************
//..........................................
[Radiator_Recycle]
print "@790 Radiator_Recycle"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Radiator with Choice of RIMs heat."
"gblS_Top_Text" value = "The Manifold will be set to Recycle the Radiator with Choice of RIMs heat."
if "sw_Control_RIMs_Element" state == true
"gblS_Top_Text" value = "The Manifold is set to Recycle the Radiator with RIMs heat already on."
"gblS_Bottom_Text" value = "You are the Safety and Control!"
"gblS_BrewName_B1" value = "Manifold: Recyle Radiator with RIMs heat ON."
endif
"gblS_Bottom_Text" value = "You are the Safety and Control!"
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
"sw_Use_Bottom_4" state = true
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
	if "sw_Control_RIMs_Element" state == true
	goto "End_sub_2_scrPrimeandBasicManifold"
	endif
//...................................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"gblS_Brewery_Top_1" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text"  background = 3
// Visibility
"gblS_Brewery_Top_1" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
//.............................
//Pump Control
"MB_33_do_BluePump_B1" state = false
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Radiator"
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 1  Wait!  Will Auto Advance"
"gblS_Brewery_Top_3" value = "No Valves in  Set 1.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = 00:00:02
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 2................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 2  Wait!  Will Auto Advance"
"gblS_Brewery_Top_3" value = "No Valves in  Set 2.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = 00:00:02
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 3................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 3  Wait!  Will Auto Advance"
"VGC_45_do_RadiatorTangental_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 3.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 3"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 4................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 4  Wait!  Will Auto Advance"
"VGC_32_do_RadiatorSupply_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 4.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 4"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 5................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Final Set.   Wait!  Will Auto Advance"
"gblS_Brewery_Top_3" value = "No Valves in  Final Set.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Final Set"
"tm_Display_BottomRight_B1" value = 00:00:02
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//........................................
//........................................
"tm_Display_BottomRight_B1" visibility = hidden
"gblS_Brewery_Top_1" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text"  visibility = hidden
//Pump Control
"MB_34_do_GreenPump_B1" state = true
"sw_Control_Radiator_Element" state = true 
"MB_58_10KRadiator_B1" displayname = "Radiator °F"
"gblV_RadiatorSetPoint_P1_B1" value = 185 
"gblS_Brewery_Top_1" value = "Do you want the RIMs Heater On.  The Radiator Body Heater is on and the SetPoint is set at 185 °F.  Make the choice:\n\n1 = Yes\n2 = No"
//.....................................................
"gblS_swAllSwitch_Label_Text" value =  "Choose 1 or 2"
"gblSReportLabel_B1" value = "1 = Turn on  RIMs Heater"
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
//..........................................................................................
//Inspector_Green
"gblV_Set_BackGround_Middle_Time" value = 2
start "inscpt_scrSet_Middle_Backgrounds"
//........................................//Background
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
[Loop_RIMs_Heat]
	if "gblVReport_B1" value == 1
		goto "Exit_Heat_On"
	endif
	if "gblVReport_B1" value == 2
		goto "Exit_Heat_OFF"
	endif
	if "gblVReport_B1" value > 2
		"gblSReportLabel_B1" value = "1Choose One or Two!!!!!"
		sleep 2000
		"gblSReportLabel_B1" value = "1 = Turn on  RIMs Heater"
			endif
goto "Loop_RIMs_Heat"
[Exit_Heat_On]
	"sw_Control_RIMs_Element" state = true
[Exit_Heat_OFF]
	if "sw_Control_RIMs_Element" state == true
		"gblS_Top_Text" value = "The Manifold is set to Recycle the Radiator. The RIMs Heater is ON."
	else
	"gblS_Top_Text" value = "The Manifold is set to Recycle the Radiator. The RIMs Heater is OFF."
	endif
"gblS_BrewName_B1" value = "Manifold: Recyle Radiator"
"gblS_Water_Text" value = "Manifold: Recyle Radiator"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Bottom_Text" value = "You are the Safety and Control!"
// 5 Second Delay
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
"sw_Use_Bottom_4" state = true
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
goto "End_sub_2_scrPrimeandBasicManifold"
//..........................................
//******************************************
//..........................................
[Mash_Tun_Recycle]
print "@931 Mash_Tun_Recycle"
start "inscpt_scrClearB1_Brewery"
sleep 100
	if vVSwitchNumber == 303
	if "sw_Status_Manifold_Recyle_MLT" state == true
goto "End_sub_2_scrPrimeandBasicManifold"
	endif
	endif

goto "End_sub_2_scrPrimeandBasicManifold"

wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Mash Tun"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "The Manifold will be set to Recycle the Mash Tun. "
if vVSwitchNumber == 4002
"gblS_BrewName_B1" value = "Setting Manifold: HERMs"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "The Manifold will be set for HERMs.  This will insure that the Mash Tun is recycling and that the Radiator is recycling and the RIMs Heater is on. "
endif




"gblS_Bottom_Text" value = "You are the Safety and Control!"
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
"sw_Use_Bottom_4" state = true
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//Pump Control
"MB_33_do_BluePump_B1" state = false
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Mash Tun"
"VGC_49_do_WhitePumpValve_On_B1" state = true
//...................................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Mash Tun"
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 1  Wait!  Will Auto Advance"
"VGC_26_do_Right_MLT_Isolation_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 1.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 2................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 2  Wait!  Will Auto Advance"
"gblS_Brewery_Top_3" value = "N0 Valves Set 2.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = 00:00:02
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 3................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 3  Wait!  Will Auto Advance"
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 3.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 3"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 4................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 4  Wait!  Will Auto Advance"
"VGC_8_do_BluePumpValve_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 4.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 4"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 5................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Final Set  Wait!  Will Auto Advance"
"VGC_13_do_HermsWort_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Final Set.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Final Set"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//........................................
//........................................
"tm_Display_BottomRight_B1" visibility = hidden
"gblS_Brewery_Top_1" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text"  visibility = hidden
//Pump Control
"MB_33_do_BluePump_B1" state = true
//Element Control
"gblS_BrewName_B1" value = "Manifold: Recyle Mash Tun"
"gblS_Water_Text" value = "Manifold: Recyle Mash Tun"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "The Manifold is set to Recycle the Mash Tun. "
"gblS_Bottom_Text" value = "You are the Safety and Control!"
// 5 Second Delay
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
"sw_Use_Bottom_4" state = true
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
goto "End_sub_2_scrPrimeandBasicManifold"
//..........................................
//******************************************
//..........................................
[Brew_Kettle_Recycle]
print "@1089 Brew_Kettle_Recycle"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Brew Kettle"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "The Manifold will be set to Recycle the Brew Kettle. "
"gblS_Bottom_Text" value = "You are the Safety and Control!"
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
"sw_Use_Bottom_4" state = true
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//Pump Control
"MB_36_do_RedPump_B1" state = false
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Brew Kettle"
"VGC_49_do_WhitePumpValve_On_B1" state = true
//...................................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Brew Kettle"
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 1  Wait!  Will Auto Advance"
"VGC_3_do_RedPumpValve_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 1.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 2................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 2  Wait!  Will Auto Advance"
"VGC_47_do_BigMacTangental_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 2.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 3................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 3  Wait!  Will Auto Advance"
"gblS_Brewery_Top_3" value = "No Valves Set 3.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 3"
"tm_Display_BottomRight_B1" value = 00:00:02
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 4................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 4  Wait!  Will Auto Advance"
"VGC_17_do_LittleMacIsolation_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 4.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 4"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 5................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Final Set  Wait!  Will Auto Advance"
"VGC_41_do_BrewKettleIsolation_On_B1" state = false
"VGC_19_do_BrewKettleTangental_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Final Set.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Final Set"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Pump Control
"MB_36_do_RedPump_B1" state = true
//Element Control
"gblS_BrewName_B1" value = "Manifold: Recyle Brew Kettle"
"gblS_Water_Text" value = "Manifold: Recyle Brew Kettle"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "The Manifold is set to Recycle the Brew Kettle. "
"gblS_Bottom_Text" value = "You are the Safety and Control!"
// 5 Second Delay
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
"sw_Use_Bottom_4" state = true
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
goto "End_sub_2_scrPrimeandBasicManifold"
//..........................................
//******************************************
//..........................................
[Little_Mac_Recycle]
print "@1203 Little_Mac_Recycle"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Little Mac"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "The Manifold will be set to Recycle the Little Mac. "
"gblS_Bottom_Text" value = "You are the Safety and Control!"
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
"sw_Use_Bottom_4" state = true
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
//Pump Control
"MB_35_do_YellowPump_B1" state = false
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Little Mac"
"VGC_49_do_WhitePumpValve_On_B1" state = true
//...................................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold: Recyle Little Mac"
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 1  Wait!  Will Auto Advance"
"VGC_25_do_LittleMacTangental_ON_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 1.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 2................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 2  Wait!  Will Auto Advance"
"VGC_23_do_BackManifold_Left_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 2.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 3................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 3  Wait!  Will Auto Advance"
"VGC_15_do_YellowPumpValve_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 3.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 3"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 4................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 4  Wait!  Will Auto Advance"
"VGC_17_do_LittleMacIsolation_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 4.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 4"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 5................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Final Set  Wait!  Will Auto Advance"
"gblS_Brewery_Top_3" value = "No Valves Final Set.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Final Set"
"tm_Display_BottomRight_B1" value = 00:00:02
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Pump Control
"MB_35_do_YellowPump_B1" state = true
//Element Control
"gblS_BrewName_B1" value = "Manifold: Recyle Little Mac"
"gblS_Water_Text" value = "Manifold: Recyle Little Mac"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "The Manifold is set to Recycle the Little Mac. "
"gblS_Bottom_Text" value = "You are the Safety and Control!"
// 5 Second Delay
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
"sw_Use_Bottom_4" state = true
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
wait "sw_Running_Message_with_Delay" state == false
goto "End_sub_2_scrPrimeandBasicManifold"
//..........................................
//******************************************
//..........................................
[Whirlpool_Brew_Kettle]
print "@192 Whirlpool_Brew_Kettlee"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_3" value = "This will Change several Valves and prepare the Manifold to Whrillpool the WORT in the Brew Kettle.  The Isolation Valve is the Fermentor Fill Valve and will operate automatically.  Wait!  Will Auto Advance."
	if vVSwitchNumber == 6004
		"gblS_Brewery_Top_3" value = "This will Change several Valves and prepare the Manifold to Whirllpool Chill the WORT in the Brew Kettle.  The Isolation Valve is the Fermentor Fill Valve and will operate automatically.  Wait!  Will Auto Advance."
	endif
"gblS_swAllSwitch_Label_Text"  value = "Valves will be set.  Wait!  Will Auto Advance"
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"tm_Display_BottomRight_B1" displayname = "Set Valves "
"tm_Display_BottomRight_B1" value = 00:00:07
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//vVSkipSet1 = 1
//Element Control
//Pump Control
"MB_36_do_RedPump_B1" state = false
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold:  Brew Kettle Whrillpooling"
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 1  Wait!  Will Auto Advance"
"VGC_3_do_RedPumpValve_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 1.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 2................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 2  Wait!  Will Auto Advance"
"VGC_5_do_FermentFill_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 2.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 3................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 3  Wait!  Will Auto Advance"
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 3.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 3"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 4................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 4  Wait!  Will Auto Advance"
"VGC_43_do_CoolingWater_On_B1" state = false
	if vVSwitchNumber == 6004
		"VGC_43_do_CoolingWater_On_B1" state = true
	endif
"VGC_17_do_LittleMacIsolation_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 4.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 4"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 5................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Final Set  Wait!  Will Auto Advance"
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Final Set.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Final Set"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
"gblS_BrewName_B1" value = "Manifold:  Brew Kettle Whrillpooling"
"gblS_Water_Text" value = "Manifold:  Brew Kettle Whrillpooling"
//...............................
//...............................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Top_Text" value =  "Turn On the Red Pump.  The Isolation Valve (Fermentor Fill) will open automatically.  Click Red Pump?"
"gblS_Bottom_Text" value = "You are the Safety and Control"
	if vVSwitchNumber == 6004
	"gblS_Bottom_Text" value = "Start any Addition Cooling Methods (ICE?) You are the Safety and Control"
	endif
"gblS_swAllSwitch_Label_Text" value = "Red Pump?"
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
//Pump Control
"MB_36_do_RedPump_B1" state = true
"VGC_5_do_FermentFill_On_B1" state = true
goto "End_sub_2_scrPrimeandBasicManifold"
//..........................................
//******************************************
//..........................................
[Whirlpool_Little Mac]
print "@1398 Whirlpool_Little_Mace"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_3" value = "This will Change several Valves and prepare the Manifold to Whrillpool the WORT in the Little Mac.  The Isolation Valve is the Fermentor Fill Valve and will operate automatically.  Wait!  Will Auto Advance."
	if vVSwitchNumber == 6005
		"gblS_Brewery_Top_3" value = "This will Change several Valves and prepare the Manifold to Whirllpool Chill the WORT in the Little Mac.  The Isolation Valve is the Fermentor Fill Valve and will operate automatically.  Wait!  Will Auto Advance."
	endif
"gblS_swAllSwitch_Label_Text"  value = "Valves will be set.  Wait!  Will Auto Advance"
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"tm_Display_BottomRight_B1" displayname = "Set Valves "
"tm_Display_BottomRight_B1" value = 00:00:07
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//vVSkipSet1 = 1
//Element Control
//Pump Control
"MB_36_do_RedPump_B1" state = false
"MB_35_do_YellowPump_B1" state = false
//Set 1................................
"gblS_BrewName_B1" value = "Setting Manifold:  Little Mac Whrillpooling"
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 1  Wait!  Will Auto Advance"
"VGC_3_do_RedPumpValve_On_B1" state = false
"VGC_25_do_LittleMacTangental_ON_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 1.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 2................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 2  Wait!  Will Auto Advance"
"VGC_28_do_CrossManifold_On_B1" state = false
"VGC_5_do_FermentFill_On_B1" state = false
"VGC_23_do_BackManifold_Left_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 2.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 3................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 3  Wait!  Will Auto Advance"
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
"VGC_15_do_YellowPumpValve_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 3.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 3"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 4................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 4  Wait!  Will Auto Advance"
"VGC_43_do_CoolingWater_On_B1" state = false
	if vVSwitchNumber == 6005
		"VGC_43_do_CoolingWater_On_B1" state = true
	endif
"VGC_17_do_LittleMacIsolation_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 4.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 4"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 5................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Final Set  Wait!  Will Auto Advance"
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Final Set.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Final Set"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
"gblS_BrewName_B1" value = "Manifold:  Little Mac Whrillpooling"
"gblS_Water_Text" value = "Manifold:  Little Mac Whrillpooling"
//...............................
//...............................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Top_Text" value =  "Turn On the Yellow Pump.  The Isolation Valve (Fermentor Fill) will open automatically.  Click Yellow Pump?"
"gblS_Bottom_Text" value = "You are the Safety and Control"
	if vVSwitchNumber == 6005
	"gblS_Bottom_Text" value = "Start any Addition Cooling Methods (ICE?) You are the Safety and Control"
	endif
"gblS_swAllSwitch_Label_Text" value = "Yellow Pump?"
//" set any switches sw_Flow_Flush_HERMs" state = true
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
//Pump Control
"MB_35_do_YellowPump_B1" state = true
"VGC_5_do_FermentFill_On_B1" state = true
goto "End_sub_2_scrPrimeandBasicManifold"
//..........................................
//******************************************
//..........................................
[Message_at_End]


[End_sub_2_scrPrimeandBasicManifold]
"gblS_BrewName_B1" value = "gblS_Water_Text" value
print "@ 790 End_sub_2_scrPrimeandBasicManifold"
	if vB_Testing == true
	"gblS_Inter_Script" value = "ended: sub_2_scrPrimeandBasicManifold"
	sleep 4001
	endif
clear 
"sw_Running_Prime_Basic" state = false
start "inscpt_scr_Inner_Blue"

stop "sub_2_scrPrimeandBasicManifold"
```

## 73. sub_2_scrPrimeandBasicManifold_External

Starts by itself: No · User can start or stop it: Yes · 144 lines

```text
//sub_2_scrPrimeandBasicManifold_External Modified 260909 06_13
//06/05/2026 08:36
//seperated from scrWater
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Modified
//Primes all Pumps and Basic Manifold (non tranferring)
//new string vSMsg
//new string vSMsg1
wait "sw_Running_Prime_Basic" state == false
"sw_Running_Prime_Basic" state = true
"sw_Running_Script_D" state  = true
start "inscpt_scr_Inner_Blue"
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//................................
//................................
new string vSMsg_Top
new string vSMsg_Bottom
new time vT_Time_Prime
new time vT_TimerTime
new value vV_Saved_gblV_Brew_Status
new value vV_BrewStatus
new value vVSwitchNumber
new value vV_Brewzilla_Recyle
new string vS_Msg_Recycle
new string vS_Msg_Recycle_2
new string vS_Msg_Recycle_Label
vT_TimerTime = "gblTValveDelay" value
vS_Msg_Recycle_Label = "Message Read?"
new bool vB_Big_Mac_Heat
new bool vB_RIMs_Heat
vS_Msg_Recycle = " "
vS_Msg_Recycle_Label = " "
"sw_Flow_Skip_Time_or_SPG" state = true
//........................................................................
//........................................................................
vT_Time_Prime = 00:00:05
//........................................................................
vV_Saved_gblV_Brew_Status = "gblV_Brew_Status" value
vVSwitchNumber = "gblV_Water_Switch_Status_Water" value
new time vT_Valve_Delay 
vT_Valve_Delay = "gblTValveDelay" value
if "sw_Restore_Valves" state == true
start "sub_3_scrRestoreAfterWater"
endif
	if vVSwitchNumber == 807
		vSMsg_Top = "You need all five steps to be completed\n1: Install the Brewzilla Outlet Assembly\n2: Attach the Brewzilla Outlet Assembly hose to the Purple WORT IN\n3: Fermentor Hose to Purple WORT Out and Place it in the Brewzilla\n4: Open Brewzilla Blue Ball Valve"
		vSMsg_Bottom = "5: Turn on Brewzilla Pump.\nYou are the Safety and Control.  You may place the Lid on the Brewzilla.  You may have to secure the Fermentor Hose to the Brewzilla.  Let it Run Hot for at least 10 minutes to Sanitize and then turn on Cooling Water."
		"gblS_swAllSwitch_Label_Text" value = "5 Steps Complete?"
		goto "End_Choice"
	endif 
if vVSwitchNumber == 909
vS_Msg_Recycle = "1. The 20 Gal Mash Tun Out Valve should be connected to the Purple Pump Inlet Hose.\n2. The 20 Gal Mash Valve turned on.\n3:Purple Pump Outlet Hose place in the 20 Gal Mash.\n4: Purple Pump turned on.\nWhen all four steps are done: Click 20 Gal Mash Tun Recycling?" 
vS_Msg_Recycle_Label = "20 Gal Mash Tun Recycling?"
goto "External_Recycle"
endif
if vVSwitchNumber == 708
vS_Msg_Recycle = "1 = The Brewzilla Pump Assembly in place.\n2 = Brewzilla Out Hose set connected to the Digiboil Out Valve.\n\nWhen all four steps are done: Click Transfering?" 
vS_Msg_Recycle_2 = "When all four steps are done: Click Transfering?\n\n3 = The Digiboil Out Valve turned on.\n4 = Brewzilla Pump  turned on."
vS_Msg_Recycle_Label = "Click Transfering?"
goto "External_Setup"
endif
if vVSwitchNumber == 709
vS_Msg_Recycle = "1 = The Brewzilla Pump Assembly in place.\n2 = Brewzilla Out Hose set connected to the 20 Gal Mash Tun Valve.\n3 = Brewzilla Pump Valve on.\nWhen all 5 steps are done: Click Transfering?" 
vS_Msg_Recycle_2 = "When all 5 steps are done: Click Transfering?\n\n4 = The 20 Gal Mash Tun Valve turned on.\n5 =Brewzilla Pump  turned on."
vS_Msg_Recycle_Label = "Click Transfering?"
goto "External_Setup"
endif
if vVSwitchNumber == 807
vS_Msg_Recycle = "1 = The Brewzilla Pump Assembly in place.\n2 = The Brewzilla Out Hose set connected to the Purple Pump Outlet.\n3 = Brewzilla Pump Valve on.\nWhen all 6 steps are done: Click Transfering?" 
vS_Msg_Recycle_2 = "When all 6 steps are done: Click Transfering?\n4= The Digiboil Out Valve connected to the Purple Pump Inlet.\n5 = The Digiboil Out Valve turned on.\n6 = Purple Pump  turned on."
vS_Msg_Recycle_Label = "Click Transfering?"
goto "External_Setup"
endif
if vVSwitchNumber == 809
vS_Msg_Recycle = "1 = The 20 Gal Mash Tun Out connected to the Purple Pump Outlet.\n2 = The Digiboil Out Valve connected to the Purple Pump Inlet. \nWhen all 5 steps are done: Click Transfering?"
vS_Msg_Recycle_2 = "When all 5 steps are done: Click Transfering?\n3 = The Digiboil Out Valve turned on.\n4 = 20 Gal Mash Tun Out Valve Turned on\n5 = Purple Pump  turned on."
vS_Msg_Recycle_Label = "Click Transfering?"
goto "External_Setup"
endif
if vVSwitchNumber == 907
vS_Msg_Recycle = "1 = The Brewzilla Pump Assembly in place.\n 2 = The Brewzilla Out Hose set connected to the Purple Pump Outlet.\n3 = The Brewzilla Pump Valve turned \nWhen all 6 steps are done: Click Transfering?" 
vS_Msg_Recycle_2 = "When all 6 steps are done: Click Transfering?\n4 = The 20 Gal Mash Tun Out Valve connected to the Purple Pump Inlet.\n5 = The 20 Gal Mash Tun Out Valve turned on.\n5 = Purple Pump turned on."
vS_Msg_Recycle_Label = "Click Transfering?"
goto "External_Setup"
endif
if vVSwitchNumber == 908
vS_Msg_Recycle = " 1 = The Digiboil Out Hose set connected to the Purple Pump Outlet.\n2. The 20 Gal Mash Tun Out Valve connected to the Purple Pump Inlet.\n\nWhen all 5 steps are done: Click Transfering?" 
vS_Msg_Recycle_2 = "When all 5 steps are done: Click Transfering?\n3 = The Digiboil Out Valve turned on.\n4 = The 20 Gal Mash Tun Out Valve turned on.\n5 = Purple Pump turned on."
vS_Msg_Recycle_Label = "Click Transfering?"
goto "External_Setup"
endif
[End_Choice]
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Top_Text" value =  vSMsg_Top
"gblS_Bottom_Text" value = vSMsg_Bottom
//" set any switches sw_Flow_Flush_HERMs" state = true
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
[External_Setup]
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Clear_B1" state == false
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
"gblS_Top_Text" value = "The transfer is totally manual.  You are the Safety and Control.  You need to stop any transfer and shut off any manual valves after the transfer is complete."
// 10 Second Delay
"gblV_Delay_Seconds" value = 10
//Restore
"sw_Delay_Save_B1" state = false
//only 1 true
"sw_Top_1" state = true
"sw_Top_2" state = false
"sw_Top_3" state = false
//1 or None  true
"sw_Bottom_1" state = false
"sw_Bottom_3" state = false
"sw_Bottom_4" state = false
start "inscpt_scrMessage_with_Delay"
sleep 100
wait "sw_Short_Delay_Time" state == false
wait "sw_Script_Message_Delay" state == false
//........................................
"gblS_Brewery_Top_1" value = "Wait!  Will Auto Advance"
// have it do something
//...............................
[End_sub_2_scrPrimeandBasicManifold]
"gblS_BrewName_B1" value = "gblS_Water_Text" value
print "@ 790 End_sub_2_scrPrimeandBasicManifold"
	if vB_Testing == true
	"gblS_Inter_Script" value = "ended: sub_2_scrPrimeandBasicManifold_External"
	sleep 4001
	endif
clear 
"sw_Running_Prime_Basic" state = false
start "inscpt_scr_Inner_Blue"
stop "sub_2_scrPrimeandBasicManifold_External"
```

## 74. sub_2_scrPrimeandBasicManifold_Brewzilla

Starts by itself: No · User can start or stop it: Yes · 279 lines

```text
//sub_2_scrPrimeandBasicManifold_Brewzilla
//06/05/2026 08:36
//seperated from scrWater
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Modified
//Primes all Pumps and Basic Manifold (non tranferring)
//new string vSMsg
//new string vSMsg1
wait "sw_Running_Prime_Basic" state == false
"sw_Running_Prime_Basic" state = true
"sw_Running_Script_D" state  = true
start "inscpt_scr_Inner_Blue"
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//................................
//................................
new string vSMsg_Top
new string vSMsg_Bottom
new time vT_Time_Prime
new time vT_TimerTime
new value vV_Saved_gblV_Brew_Status
new value vV_BrewStatus
new value vVSwitchNumber
new value vV_Brewzilla_Recyle
new string vS_Msg_Recycle
new string vS_Msg_Recycle_2
new string vS_Msg_Recycle_Label
vT_TimerTime = "gblTValveDelay" value
vS_Msg_Recycle_Label = "Message Read?"
new bool vB_Big_Mac_Heat
new bool vB_RIMs_Heat
vS_Msg_Recycle = " "
vS_Msg_Recycle_Label = " "
"sw_Flow_Skip_Time_or_SPG" state = true
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
[Brewzilla_Recycle]
print "@687 Brew_Kettle_Recycle"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//.....................................................
"gblS_swAllSwitch_Label_Text" value =  "Choose Method"
"gblS_Brewery_Top_1" value = "1:Brewzilla Pump  :  Sparge Spray Head\n2:Brewzilla Pump:Brewzilla Pump Outlet\n3:Brewzilla Pump  :   Purple Plate Chiller\n4:Brewzilla Pump:Manifold Plate Chiller\n5:Purple Pump    :    Purple Plate Chiller\n6:Purple Pump  :   Manifold Plate Chiller     "
"gblSReportLabel_B1" value = "Choose 1 to 6"
"gblSReportLabel_B1" value = "Choose 1 to 6"
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
[Loop_Brewzilla_Choice]
	if "gblVReport_B1" value >= 1
	if "gblVReport_B1" value < 7 
		vV_Brewzilla_Recyle = "gblVReport_B1" value
		goto "Exit_Brewzilla_Choice"
	else
	"gblVReport_B1" value = 0 
		"gblSReportLabel_B1" value = "You may only Choose 1 to 6!"
		sleep 3000
		"gblSReportLabel_B1" value = "Choose 1 to 6"
	endif
goto "Loop_Brewzilla_Choice"
[Exit_Brewzilla_Choice]
print vV_Brewzilla_Recyle
	if vV_Brewzilla_Recyle == 1
		vSMsg_Top = "You need all five steps to be completed\n1: Install the Brewzilla Sparge Spray Head Assembly   \n2: Place on Brewzilla Lid\n3: Place Spray Head Through the Hole in Lid"
		vSMsg_Bottom = "4: Open Brewzilla Blue Ball Valve slightly\n5: Turn on Brewzilla Pump\n\nYou are the Safety and Control.  The Blue Ball Valve will need adjustment so it does not spray out."
		"gblS_swAllSwitch_Label_Text" value = "5 Steps Complete?"
		goto "End_Choice"
	endif 
	if vV_Brewzilla_Recyle == 2
		vSMsg_Top = "You need all five steps to be completed\n1: Install Brewzilla Outlet Assembly\n2: Place on Brewzilla Lid\n3: Place Brewzilla Outlet Assembly Through the Hole in Lid"
		vSMsg_Bottom = "4: Open Brewzilla Blue Ball Valve\n5: Turn on Brewzilla Pump.\n\nYou are the Safety and Control.  The Blue Ball Valve can normally be fully open."
			"gblS_swAllSwitch_Label_Text" value = "5 Steps Complete?"
		goto "End_Choice"
	endif 
	if vV_Brewzilla_Recyle == 3
		vSMsg_Top = "You need all five steps to be completed\n1: Install the Brewzilla Outlet Assembly\n2: Attach the Brewzilla Outlet Assembly hose to the Purple WORT IN\n3: Fermentor Hose to Purple WORT Out and Place it in the Brewzilla\n4: Open Brewzilla Blue Ball Valve"
		vSMsg_Bottom = "5: Turn on Brewzilla Pump.\nYou are the Safety and Control.  You may place the Lid on the Brewzilla.  You may have to secure the Fermentor Hose to the Brewzilla.  Let it Run Hot for at least 10 minutes to Sanitize and then turn on Cooling Water."
		"gblS_swAllSwitch_Label_Text" value = "5 Steps Complete?"
		goto "End_Choice"
	endif 
	if vV_Brewzilla_Recyle == 4
		vSMsg_Top = "You need all six steps to be completed\n1: Install the Brewzilla Outlet Assembly\n2: Attach the Brewzilla Outlet Assembly hose to the Manual South Valve of the Manifold\n3: Insure the Fermentor Hose in the Fermentor Room is Looped."
		vSMsg_Bottom = "4: Return hose into the BrewZilla.\n5: Open Brewzilla Blue Ball Valve\n6: Wait for the Manifold to be set.\nYou are the Safety and Control.  You should place the Lid on the Brewzilla.  You may have to secure the Fermentor Hose to the Brewzilla.  The Manifold will set next."
		"gblS_swAllSwitch_Label_Text" value = "6 Steps Complete?"
		goto "End_Choice"
	endif 
	if vV_Brewzilla_Recyle == 5
		vSMsg_Top = "There will be about 2 Gallons that is deadspace using the Purple Pump. You need all six steps to be completed\n1: Attach the Purple Pump Inlet to the Brewzilla Manual Outlet Valve\n2: Attach Purple Pump Outlet to WORT IN of Purple Plate Chiller\n3: Attach Fermentor Hose to WORT Out"
		vSMsg_Bottom = "4: Put Fermentor Hose into Brewzilla\n5:Open Brewzilla Manual Outlet Valve\n6: Turn on Purple Pump\nYou are the Safety and Control.  Let cycle for at least 10 minute to Sanitize prior to opening Cooling Water."
		"gblS_swAllSwitch_Label_Text" value = "6 Steps Complete?"
		goto "End_Choice"
	endif 
			if vV_Brewzilla_Recyle == 6
		vSMsg_Top = "There will be about 2 Gallons that is deadspace using the Purple Pump. You need all six steps to be completed\n1: Attach the Purple Pump Inlet to the Brewzilla Manual Outlet Valve\n2: Attach Purple Pump Outlet to the Manual South Manifold Valve\n3: Insure the Fermentor Hose is Looped in the Fermentor Room"
		vSMsg_Bottom = "4: Put Fermentor Return Hose into Brewzilla\n5:Open Brewzilla Manual Outlet Valve\n6: Turn on Purple Pump\nYou are the Safety and Control.  The Manifold is next"
		"gblS_swAllSwitch_Label_Text" value = "6 Steps Complete?"
		goto "End_Choice"
	endif 
//...............................
[End_Choice]
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Top_Text" value =  vSMsg_Top
"gblS_Bottom_Text" value = vSMsg_Bottom
//" set any switches sw_Flow_Flush_HERMs" state = true
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
//...............................
	if vV_Brewzilla_Recyle == 4
		goto "Set_Manifold"
	endif
	if vV_Brewzilla_Recyle == 6
		goto "Set_Manifold"
	endif
goto "End_sub_2_scrPrimeandBasicManifold"
[Set_Manifold]
print "@ Set Manifold_Brewzilla"
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblS_Brewery_Top_3" value = "This will Change several Valves and prepare the Manifold to Chill the WORT in the Brewzilla.  The Isolation Valve is the Fermentor Fill Valve and will operate automatically.  Wait!  Will Auto Advance."
"gblS_swAllSwitch_Label_Text"  value = "Valves will be set.  Wait!  Will Auto Advance"
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Background
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"tm_Display_BottomRight_B1" displayname = "Set Valves "
"tm_Display_BottomRight_B1" value = 00:00:07
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//vVSkipSet1 = 1
//Element Control
//Pump Control
"MB_32_do_WhitePump_B1" state = false
"MB_36_do_RedPump_B1" state = false
"MB_35_do_YellowPump_B1" state = false
//Set 1................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 1  Wait!  Will Auto Advance"
"VGC_49_do_WhitePumpValve_On_B1" state = false
"VGC_3_do_RedPumpValve_On_B1" state = false
"VGC_25_do_LittleMacTangental_ON_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 1.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 1"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 2................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 2  Wait!  Will Auto Advance"
"VGC_47_do_BigMacTangental_On_B1" state = false
"VGC_28_do_CrossManifold_On_B1" state = false
"VGC_5_do_FermentFill_On_B1" state = false
"VGC_23_do_BackManifold_Left_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 2.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 2"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 3................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 3  Wait!  Will Auto Advance"
"VGC_30_do_FireHose_On_B1" state = false
"VGC_7_do_Left_MLT_Isolation_On_B1" state = false
"VGC_15_do_YellowPumpValve_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Set 3.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 3"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 4................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Set 4  Wait!  Will Auto Advance"
"VGC_43_do_CoolingWater_On_B1" state = false
"VGC_17_do_LittleMacIsolation_On_B1" state = true
"gblS_Brewery_Top_3" value = "Changing Valve Set 4.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Set 4"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//Set 5................................
"gblS_swAllSwitch_Label_Text"  value = "Valve Final Set  Wait!  Will Auto Advance"
"VGC_41_do_BrewKettleIsolation_On_B1" state = true
"VGC_34_do_BigMac_Isolation_On_B1" state = false
"VGC_19_do_BrewKettleTangental_On_B1" state = false
"gblS_Brewery_Top_3" value = "Changing Valve Final Set.  Wait!  Will Auto Advance."
"tm_Display_BottomRight_B1" displayname = "Final Set"
"tm_Display_BottomRight_B1" value = vT_TimerTime
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = visible
wait  "tm_Display_BottomRight_B1" value <=  00:00:00
stop "tm_Display_BottomRight_B1"
//............................................
//...............................
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
//...............................
"gblS_Top_Text" value =  "Open the Isolations Valve (Fermentor Fill).  Click Isolation Valve?"
"gblS_Bottom_Text" value = "Insure that the Fermentor Hose is Looped in the Fermentor Room.  Check For Leaks after Opening.  The Flow will run for 10 Minutes before the Cooling Water is turned on."
"gblS_swAllSwitch_Label_Text" value = "Isolation Valve?"
//" set any switches sw_Flow_Flush_HERMs" state = true
//........................
start "inscpt_scrAdvancewithSwitch"
//........................
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
"VGC_5_do_FermentFill_On_B1" state = true
"gblS_Brewery_Top_1" value = "The Brewzilla will cycle through the plate Chiller for 10 minutes and then the Cooling Water Valve will Open."
"gblS_Brewery_Bottom_1" value = "You need to prepare any additional cooling methods. Ice? Glycol?"
"gblS_swAllSwitch_Label_Text" value = "Wait!  Will Auto Advance"
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" displayname = "Sanitize Delay"
"tm_Display_BottomRight_B1" value = 00:10:00
"tm_Display_BottomRight_B1" visibility = visible
start "tm_Display_BottomRight_B1"
	if vB_Testing == true
print 288
		if "tm_Display_BottomRight_B1" value <= 00:09:50
			"tm_Display_BottomRight_B1" value = 00:00:03
		endif
	endif
wait "tm_Display_BottomRight_B1" value <= 00:00:00
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = hidden
"VGC_43_do_CoolingWater_On_B1" state = true
"gblS_Brewery_Top_1" value = "The Cooling Water Valve is Open."
"gblS_Brewery_Bottom_1" value = "Start any additional Cooling Methods (Ice?)"
sleep 5000
"gblS_Water_Text" value = "Brewzilla Cooling"
//........................................
[End_sub_2_scrPrimeandBasicManifold]
"gblS_BrewName_B1" value = "gblS_Water_Text" value
print "@ 790 End_sub_2_scrPrimeandBasicManifold"
	if vB_Testing == true
	"gblS_Inter_Script" value = "ended: sub_2_scrPrimeandBasicManifold_Brewzilla"
	sleep 4001
	endif
clear 
"sw_Running_Prime_Basic" state = false
start "inscpt_scr_Inner_Blue"
stop "sub_2_scrPrimeandBasicManifold_Brewzilla"
```

## 75. sub_2_scrFermentor_Set_Status

Starts by itself: No · User can start or stop it: No · 1436 lines

```text
//sub_2_scrFermentor_Set_Status
//05/25/2026 05:51
// modified 05/25/2026 05:51
// MIT License Granted
//Copyright © OakBarn Brewery 2026
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new bool vB_Skip
vB_Skip = false
new value vV_Flow_Brew
vV_Flow_Brew = "gblV_Brew_Status" value
new string vSMsg
new string vSMsg1
new string vS_Fermentor_Name_1
new string vS_Fermentor_Name_2
new string vS_Fermentor_Name_3
new string vS_Fermentor_Name_4
new string vS_Fermentor_Name_5
new string vS_Fermentor_Name_6
new string vS_Fermentor
new value vV_Status 
new string vS_Status
new string vS_Current_Status
new string vSMsg_End
new value vV_Brew_Status
vS_Fermentor_Name_1 = "gblS_Fermentor_Name_1" value
vS_Fermentor_Name_2 = "gblS_Fermentor_Name_2" value
vS_Fermentor_Name_3 = "gblS_Fermentor_Name_3" value
vS_Fermentor_Name_4 = "gblS_Fermentor_Name_4" value
vS_Fermentor_Name_5 = "gblS_Fermentor_Name_5" value
vS_Fermentor_Name_6 = "gblS_Fermentor_Name_6" value
// B1 Brewery Left value ...................................
"gblS_Brewery_Top_2" value = " "
"gblS_Brewery_Top_3" value = " "
"gblS_swAllSwitch_Label_Text" value = " "
"gblS_Brewery_Bottom_3" value = " "
"gblS_Brewery_Bottom_4" value = " "
"gblS_Brewery_Bottom_1" value = " "
// B1 Brewery Left background.................................
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"gblS_Brewery_Bottom_3" background = 1
"gblS_Brewery_Bottom_4" background = 1
"gblS_Brewery_Bottom_1" background = 1
//...................................
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
 "gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
//.................................................
show workspace "B1 Brewery"
print "@ 79 Fermentor 1"
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = hidden 
vV_Brew_Status = "gblVStartBrew" value
"gblSReportLabel_B1" value = vS_Fermentor_Name_1
vV_Status = "gblV_FermentStatus_1" value
vSMsg = "Fermentor #1 "
vSMsg1 = vS_Fermentor_Name_1
vSMsg = vSMsg + vSMsg1
vS_Fermentor = vSMsg
if vV_Status == 0
vS_Status = "Unknown"
endif
if vV_Status == 1
vS_Status = "Fementing"
endif
if vV_Status == 2
vS_Status = "Available"
endif
if vV_Status == 3
vS_Status = "Clean"
endif
if vV_Status == 4
vS_Status = "Sanitized"
endif
if vV_Status == 5
vS_Status = "Ready for WORT"
endif
if vV_Status == 6
vS_Status = "Dirty"
endif
vSMsg = "Current Status = "
vSMsg1 = vS_Status 
vSMsg = vSMsg + vSMsg1
vS_Current_Status = vSMsg
"gblS_BrewName_B1" value = vS_Current_Status
vSMsg = vS_Fermentor
if vV_Brew_Status < 100
vSMsg_End = "  The Fermentor Status will be reviewed again at the END of the Whirlpool"
"gblS_Brewery_Bottom_3" value = vSMsg_End
endif
if vV_Brew_Status > 90
vSMsg_End = "  The Fermentors must be Cleaned, Sanitized, Drained && ALL Fermentor Valves Closed. Ready to accept WORT.  The Status must be 5: READY!"
"gblS_Brewery_Bottom_3" value = vSMsg_End
vB_Skip = true
endif
if vV_Status == 0
	if vB_Skip == true
	goto "Skip_Early_A_1"
	endif
	vSMsg1 = ":  The Status = Unknown. Find out what the Status is and Set It. " 
	vSMsg_End = "If left as Unknown, the Fermentor will NOT be reviewed later. "
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 1
	if vB_Skip == true
	goto "Skip_Early_A_1"
	endif
	vSMsg1 = ":  The Status = Fermenting.  If that is still correct, Select 7 =  No Change Next. "
	vSMsg_End = "If left as Fermenting, the Fermentor will NOT be reviewed later."
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif 
if vV_Status == 2
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
if vV_Brew_Status > 90
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 3
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, the Fermentor should be Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 4
	vSMsg1 = ": Status = Sanitized.  The Sanitizer may be drained at the end of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status =  Sanitized.  If you intend to use this Fermentor, it must be made ready.  Drain the Sanitizer while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 5
vSMsg1 = ": Status = Ready.   The Sanitizer is drained and all Fermentor Drain Valves Shut!  The Fermentor is Ready for WORT."
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 6
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, it must be made ready.   A liitle late if you have not started when first warned."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_swAllSwitch_Label_Text" background = 2
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
if vV_Status == 0
// Inspector 0range
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 3
"insp_2_LeftMiddle_B1" visibility = visible
endif
if vV_Status == 1
"gblS_swAllSwitch_Label_Text" background = 1
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
endif
//............................................................//............................................................
vSMsg = vS_Fermentor
vSMsg1 = ":   Change?\n"
vSMsg = vSMsg + vSMsg1
vSMsg1 = "1 = Fermenting\n2 = Available\n3 = Clean\n4 = Sanitized\n5 = Ready\n6 = Dirty"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg 
[Redo_Choice_1]
"gblSReportLabel_B1" value = "Change Fermentor #1 Status?"
"gblS_swAllSwitch_Label_Text" value = "7 = N0 Change"
//background
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//.....................................................
wait "gblVReport_B1" value > 0
if "gblVReport_B1" value == 1
"gblV_FermentStatus_1" value = 1 
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 2
"gblV_FermentStatus_1" value = 2 
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 3
"gblV_FermentStatus_1" value = 3 
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 4
"gblV_FermentStatus_1" value = 4 
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 5
"gblV_FermentStatus_1" value = 5 
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 6
"gblV_FermentStatus_1" value = 6 
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value == 7
goto "End_Choice_Status1"
endif
if "gblVReport_B1" value > 7
"gblS_swAllSwitch_Label_Text" value = "1 to 7 Only"
sleep 3000
goto "Redo_Choice_1"
endif
[End_Choice_Status1]
if "gblV_FermentStatus_1" value == 5
goto "Skip_Volume_Zero_1"
endif
if "gblV_FermentStatus_1" value > 1
"RP_v_1_Fermentor_Volume" value = 0
endif
[Skip_Volume_Zero_1]
"gblVReport_B1" value = 0 
[Skip_Early_A_1]
print "@ 316 Fermentor #2"
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = hidden 
vV_Brew_Status = "gblVStartBrew" value
"gblSReportLabel_B1" value = vS_Fermentor_Name_2
vV_Status = "gblV_FermentStatus_2" value
vSMsg = "Fermentor #2 "
vSMsg1 = vS_Fermentor_Name_2
vSMsg = vSMsg + vSMsg1
vS_Fermentor = vSMsg
if vV_Status == 0
vS_Status = "Unknown"
endif
if vV_Status == 1
vS_Status = "Fementing"
endif
if vV_Status == 2
vS_Status = "Available"
endif
if vV_Status == 3
vS_Status = "Clean"
endif
if vV_Status == 4
vS_Status = "Sanitized"
endif
if vV_Status == 5
vS_Status = "Ready for WORT"
endif
if vV_Status == 6
vS_Status = "Dirty"
endif
vSMsg = "Current Status = "
vSMsg1 = vS_Status 
vSMsg = vSMsg + vSMsg1
vS_Current_Status = vSMsg
"gblS_BrewName_B1" value = vS_Current_Status
vSMsg = vS_Fermentor
if vV_Brew_Status < 100
vSMsg_End = "  The Fermentor Status will be reviewed again at the END of the Whirlpool"
"gblS_Brewery_Bottom_3" value = vSMsg_End
endif
if vV_Brew_Status > 90
vSMsg_End = "  The Fermentors must be Cleaned, Sanitized, Drained && ALL Fermentor Valves Closed. Ready to accept WORT.  The Status must be 5: READY!"
"gblS_Brewery_Bottom_3" value = vSMsg_End
vB_Skip = true
endif
if vV_Status == 0
	if vB_Skip == true
	goto "Skip_Early_A_2"
	endif
	vSMsg1 = ":  The Status = Unknown. Find out what the Status is and Set It. " 
	vSMsg_End = "If left as Unknown, the Fermentor will NOT be reviewed later. "
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 1
	if vB_Skip == true
	goto "Skip_Early_A_2"
	endif
	vSMsg1 = ":  The Status = Fermenting.  If that is still correct, Select 7 =  No Change Next. "
	vSMsg_End = "If left as Fermenting, the Fermentor will NOT be reviewed later."
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif 
if vV_Status == 2
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
if vV_Brew_Status > 90
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 3
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, the Fermentor should be Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 4
	vSMsg1 = ": Status = Sanitized.  The Sanitizer may be drained at the end of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status =  Sanitized.  If you intend to use this Fermentor, it must be made ready.  Drain the Sanitizer while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 5
vSMsg1 = ": Status = Ready.   The Sanitizer is drained and all Fermentor Drain Valves Shut!  The Fermentor is Ready for WORT."
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 6
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, it must be made ready.   A liitle late if you have not started when first warned."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_swAllSwitch_Label_Text" background = 2
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
if vV_Status == 0
// Inspector 0range
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 3
"insp_2_LeftMiddle_B1" visibility = visible
endif
if vV_Status == 1
"gblS_swAllSwitch_Label_Text" background = 1
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
endif
//............................................................
//............................................................
vSMsg = vS_Fermentor
vSMsg1 = ":   Change?\n"
vSMsg = vSMsg + vSMsg1
vSMsg1 = "1 = Fermenting\n2 = Available\n3 = Clean\n4 = Sanitized\n5 = Ready\n6 = Dirty"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg 
[Redo_Choice_2]
"gblSReportLabel_B1" value = "Change Fermentor #2 Status?"
"gblS_swAllSwitch_Label_Text" value = "7 = N0 Change"
//background
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//.....................................................
wait "gblVReport_B1" value > 0
if "gblVReport_B1" value == 1
"gblV_FermentStatus_2" value = 1 
goto "End_Choice_Status2"
endif
if "gblVReport_B1" value == 2
"gblV_FermentStatus_2" value = 2 
goto "End_Choice_Status2"
endif
if "gblVReport_B1" value == 3
"gblV_FermentStatus_2" value = 3 
goto "End_Choice_Status2"
endif
if "gblVReport_B1" value == 4
"gblV_FermentStatus_2" value = 4 
goto "End_Choice_Status2"
endif
if "gblVReport_B1" value == 5
"gblV_FermentStatus_2" value = 5 
goto "End_Choice_Status2"
endif
if "gblVReport_B1" value == 6
"gblV_FermentStatus_2" value = 6 
goto "End_Choice_Status2"
endif
if "gblVReport_B1" value == 7
goto "End_Choice_Status2"
endif
if "gblVReport_B1" value > 7
"gblS_swAllSwitch_Label_Text" value = "1 to 7 Only"
sleep 3000
goto "Redo_Choice_2"
endif
[End_Choice_Status2]
if "gblV_FermentStatus_2" value == 5
goto "Skip_Volume_Zero_2"
endif
if "gblV_FermentStatus_2" value > 1
"RP_v_2_Fermentor_Volume" value = 0
endif
[Skip_Volume_Zero_2]
"gblVReport_B1" value = 0
[Skip_Early_A_2]
print "@ 553 Fermentor 3"
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = hidden 
vV_Brew_Status = "gblVStartBrew" value
"gblSReportLabel_B1" value = vS_Fermentor_Name_3
vV_Status = "gblV_FermentStatus_3" value
vSMsg = "Fermentor #3 "
vSMsg1 = vS_Fermentor_Name_3
vSMsg = vSMsg + vSMsg1
vS_Fermentor = vSMsg
if vV_Status == 0
vS_Status = "Unknown"
endif
if vV_Status == 1
vS_Status = "Fementing"
endif
if vV_Status == 2
vS_Status = "Available"
endif
if vV_Status == 3
vS_Status = "Clean"
endif
if vV_Status == 4
vS_Status = "Sanitized"
endif
if vV_Status == 5
vS_Status = "Ready for WORT"
endif
if vV_Status == 6
vS_Status = "Dirty"
endif
vSMsg = "Current Status = "
vSMsg1 = vS_Status 
vSMsg = vSMsg + vSMsg1
vS_Current_Status = vSMsg
"gblS_BrewName_B1" value = vS_Current_Status
vSMsg = vS_Fermentor
if vV_Brew_Status < 100
vSMsg_End = "  The Fermentor Status will be reviewed again at the END of the Whirlpool"
"gblS_Brewery_Bottom_3" value = vSMsg_End
endif
if vV_Brew_Status > 90
vSMsg_End = "  The Fermentors must be Cleaned, Sanitized, Drained && ALL Fermentor Valves Closed. Ready to accept WORT.  The Status must be 5: READY!"
"gblS_Brewery_Bottom_3" value = vSMsg_End
vB_Skip = true
endif
if vV_Status == 0
	if vB_Skip == true
	goto "Skip_Early_A_3"
	endif
	vSMsg1 = ":  The Status = Unknown. Find out what the Status is and Set It. " 
	vSMsg_End = "If left as Unknown, the Fermentor will NOT be reviewed later. "
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 1
	if vB_Skip == true
	goto "Skip_Early_A_3"
	endif
	vSMsg1 = ":  The Status = Fermenting.  If that is still correct, Select 7 =  No Change Next." 	
vSMsg_End = "If left as Fermenting, the Fermentor will NOT be reviewed later."
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif 
if vV_Status == 2
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
if vV_Brew_Status > 90
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 3
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, the Fermentor should be Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 4
	vSMsg1 = ": Status = Sanitized.  The Sanitizer may be drained at the end of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status =  Sanitized.  If you intend to use this Fermentor, it must be made ready.  Drain the Sanitizer while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 5
vSMsg1 = ": Status = Ready.   The Sanitizer is drained and all Fermentor Drain Valves Shut!  The Fermentor is Ready for WORT."
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 6
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, it must be made ready.   A liitle late if you have not started when first warned."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_swAllSwitch_Label_Text" background = 2
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
if vV_Status == 0
// Inspector 0range
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 3
"insp_2_LeftMiddle_B1" visibility = visible
endif
if vV_Status == 1
"gblS_swAllSwitch_Label_Text" background = 1
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
endif
//............................................................
//............................................................
vSMsg = vS_Fermentor
vSMsg1 = ":   Change?\n"
vSMsg = vSMsg + vSMsg1
vSMsg1 = "1 = Fermenting\n2 = Available\n3 = Clean\n4 = Sanitized\n5 = Ready\n6 = Dirty"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg 
[Redo_Choice_3]
"gblSReportLabel_B1" value = "Change Fermentor #3 Status?"
"gblS_swAllSwitch_Label_Text" value = "7 = N0 Change"
//background
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//.....................................................
wait "gblVReport_B1" value > 0
if "gblVReport_B1" value == 1
"gblV_FermentStatus_3" value = 1 
goto "End_Choice_Status3"
endif
if "gblVReport_B1" value == 2
"gblV_FermentStatus_3" value = 2 
goto "End_Choice_Status3"
endif
if "gblVReport_B1" value == 3
"gblV_FermentStatus_3" value = 3 
goto "End_Choice_Status3"
endif
if "gblVReport_B1" value == 4
"gblV_FermentStatus_3" value = 4 
goto "End_Choice_Status3"
endif
if "gblVReport_B1" value == 5
"gblV_FermentStatus_3" value = 5 
goto "End_Choice_Status3"
endif
if "gblVReport_B1" value == 6
"gblV_FermentStatus_3" value = 6 
goto "End_Choice_Status3"
endif
if "gblVReport_B1" value == 7
goto "End_Choice_Status3"
endif
if "gblVReport_B1" value > 7
"gblS_swAllSwitch_Label_Text" value = "1 to 7 Only"
sleep 3000
goto "Redo_Choice_3"
endif
[End_Choice_Status3]
if "gblV_FermentStatus_3" value == 5
goto "Skip_Volume_Zero_3"
endif
if "gblV_FermentStatus_3" value > 1
"RP_v_3_Fermentor_Volume" value = 0
endif
[Skip_Volume_Zero_3]
"gblVReport_B1" value = 0
[Skip_Early_A_3]
print "@ 789  Fermentor 4"
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = hidden 
vV_Brew_Status = "gblVStartBrew" value
"gblSReportLabel_B1" value = vS_Fermentor_Name_4
vV_Status = "gblV_FermentStatus_4" value
vSMsg = "Fermentor #4 "
vSMsg1 = vS_Fermentor_Name_4
vSMsg = vSMsg + vSMsg1
vS_Fermentor = vSMsg
if vV_Status == 0
vS_Status = "Unknown"
endif
if vV_Status == 1
vS_Status = "Fementing"
endif
if vV_Status == 2
vS_Status = "Available"
endif
if vV_Status == 3
vS_Status = "Clean"
endif
if vV_Status == 4
vS_Status = "Sanitized"
endif
if vV_Status == 5
vS_Status = "Ready for WORT"
endif
if vV_Status == 6
vS_Status = "Dirty"
endif
vSMsg = "Current Status = "
vSMsg1 = vS_Status 
vSMsg = vSMsg + vSMsg1
vS_Current_Status = vSMsg
"gblS_BrewName_B1" value = vS_Current_Status
vSMsg = vS_Fermentor
if vV_Brew_Status < 100
vSMsg_End = "  The Fermentor Status will be reviewed again at the END of the Whirlpool"
"gblS_Brewery_Bottom_3" value = vSMsg_End
endif
if vV_Brew_Status > 90
vSMsg_End = "  The Fermentors must be Cleaned, Sanitized, Drained && ALL Fermentor Valves Closed. Ready to accept WORT.  The Status must be 5: READY!"
"gblS_Brewery_Bottom_3" value = vSMsg_End
vB_Skip = true
endif
if vV_Status == 0
	if vB_Skip == true
	goto "Skip_Early_A_4"
	endif
	vSMsg1 = ":  The Status = Unknown. Find out what the Status is and Set It. " 
	vSMsg_End = "If left as Unknown, the Fermentor will NOT be reviewed later. "
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 1
	if vB_Skip == true
	goto "Skip_Early_A_4"
	endif
	vSMsg1 = ":  The Status = Fermenting.  If that is still correct, Select 7 =  No Change Next. "
	vSMsg_End = "If left as Fermenting, the Fermentor will NOT be reviewed later."
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif 
if vV_Status == 2
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
if vV_Brew_Status > 90
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 3
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, the Fermentor should be Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 4
	vSMsg1 = ": Status = Sanitized.  The Sanitizer may be drained at the end of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status =  Sanitized.  If you intend to use this Fermentor, it must be made ready.  Drain the Sanitizer while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 5
vSMsg1 = ": Status = Ready.   The Sanitizer is drained and all Fermentor Drain Valves Shut!  The Fermentor is Ready for WORT."
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 6
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, it must be made ready.   A liitle late if you have not started when first warned."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_swAllSwitch_Label_Text" background = 2
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
if vV_Status == 0
// Inspector 0range
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 3
"insp_2_LeftMiddle_B1" visibility = visible
endif
if vV_Status == 1
"gblS_swAllSwitch_Label_Text" background = 1
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
endif
//............................................................
vSMsg = vS_Fermentor
vSMsg1 = ":   Change?\n"
vSMsg = vSMsg + vSMsg1
vSMsg1 = "1 = Fermenting\n2 = Available\n3 = Clean\n4 = Sanitized\n5 = Ready\n6 = Dirty"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg 
[Redo_Choice_4]
"gblSReportLabel_B1" value = "Change Fermentor #4 Status?"
"gblS_swAllSwitch_Label_Text" value = "7 = N0 Change"
//background
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//.....................................................
wait "gblVReport_B1" value > 0
if "gblVReport_B1" value == 1
"gblV_FermentStatus_4" value = 1 
goto "End_Choice_Status4"
endif
if "gblVReport_B1" value == 2
"gblV_FermentStatus_4" value = 2 
goto "End_Choice_Status4"
endif
if "gblVReport_B1" value == 3
"gblV_FermentStatus_4" value = 3 
goto "End_Choice_Status4"
endif
if "gblVReport_B1" value == 4
"gblV_FermentStatus_4" value = 4 
goto "End_Choice_Status4"
endif
if "gblVReport_B1" value == 5
"gblV_FermentStatus_4" value = 5 
goto "End_Choice_Status4"
endif
if "gblVReport_B1" value == 6
"gblV_FermentStatus_4" value = 6 
goto "End_Choice_Status4"
endif
if "gblVReport_B1" value == 7
goto "End_Choice_Status4"
endif
if "gblVReport_B1" value > 7
"gblS_swAllSwitch_Label_Text" value = "1 to 7 Only"
sleep 3000
goto "Redo_Choice_4"
endif
[End_Choice_Status4]
if "gblV_FermentStatus_4" value == 5
goto "Skip_Volume_Zero_4"
endif
if "gblV_FermentStatus_4" value > 1
"RP_v_4_Fermentor_Volume" value = 0
endif
[Skip_Volume_Zero_4]
"gblVReport_B1" value = 0
[Skip_Early_A_4]
print "@ 1024  Fermentor 5"
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = hidden 
vV_Brew_Status = "gblVStartBrew" value
"gblSReportLabel_B1" value = vS_Fermentor_Name_5
vV_Status = "gblV_FermentStatus_5" value
vSMsg = "Fermentor #5 "
vSMsg1 = vS_Fermentor_Name_5
vSMsg = vSMsg + vSMsg1
vS_Fermentor = vSMsg
if vV_Status == 0
vS_Status = "Unknown"
endif
if vV_Status == 1
vS_Status = "Fementing"
endif
if vV_Status == 2
vS_Status = "Available"
endif
if vV_Status == 3
vS_Status = "Clean"
endif
if vV_Status == 4
vS_Status = "Sanitized"
endif
if vV_Status == 5
vS_Status = "Ready for WORT"
endif
if vV_Status == 6
vS_Status = "Dirty"
endif
vSMsg = "Current Status = "
vSMsg1 = vS_Status 
vSMsg = vSMsg + vSMsg1
vS_Current_Status = vSMsg
"gblS_BrewName_B1" value = vS_Current_Status
vSMsg = vS_Fermentor
if vV_Brew_Status < 100
vSMsg_End = "  The Fermentor Status will be reviewed again at the END of the Whirlpool"
"gblS_Brewery_Bottom_3" value = vSMsg_End
endif
if vV_Brew_Status > 90
vSMsg_End = "  The Fermentors must be Cleaned, Sanitized, Drained && ALL Fermentor Valves Closed. Ready to accept WORT.  The Status must be 5: READY!"
"gblS_Brewery_Bottom_3" value = vSMsg_End
vB_Skip = true
endif
if vV_Status == 0
	if vB_Skip == true
	goto "Skip_Early_A_5"
	endif
	vSMsg1 = ":  The Status = Unknown. Find out what the Status is and Set It. " 
	vSMsg_End = "If left as Unknown, the Fermentor will NOT be reviewed later. "
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 1
	if vB_Skip == true
	goto "Skip_Early_A_5"
	endif
	vSMsg1 = ":  The Status = Fermenting.  If that is still correct, Select 7 =  No Change Next. "
	vSMsg_End = "If left as Fermenting, the Fermentor will NOT be reviewed later."
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif 
if vV_Status == 2
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
if vV_Brew_Status > 90
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 3
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, the Fermentor should be Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 4
	vSMsg1 = ": Status = Sanitized.  The Sanitizer may be drained at the end of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status =  Sanitized.  If you intend to use this Fermentor, it must be made ready.  Drain the Sanitizer while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 5
vSMsg1 = ": Status = Ready.   The Sanitizer is drained and all Fermentor Drain Valves Shut!  The Fermentor is Ready for WORT."
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 6
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, it must be made ready.   A liitle late if you have not started when first warned."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_swAllSwitch_Label_Text" background = 2
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
if vV_Status == 0
// Inspector 0range
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 3
"insp_2_LeftMiddle_B1" visibility = visible
endif
if vV_Status == 1
"gblS_swAllSwitch_Label_Text" background = 1
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
endif
//............................................................
vSMsg = vS_Fermentor
vSMsg1 = ":   Change?\n"
vSMsg = vSMsg + vSMsg1
vSMsg1 = "1 = Fermenting\n2 = Available\n3 = Clean\n4 = Sanitized\n5 = Ready\n6 = Dirty"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg 
[Redo_Choice_5]
"gblSReportLabel_B1" value = "Change Fermentor #5 Status?"
"gblS_swAllSwitch_Label_Text" value = "7 = N0 Change"
//background
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//.....................................................
wait "gblVReport_B1" value > 0
if "gblVReport_B1" value == 1
"gblV_FermentStatus_5" value = 1 
goto "End_Choice_Status5"
endif
if "gblVReport_B1" value == 2
"gblV_FermentStatus_5" value = 2 
goto "End_Choice_Status5"
endif
if "gblVReport_B1" value == 3
"gblV_FermentStatus_5" value = 3 
goto "End_Choice_Status5"
endif
if "gblVReport_B1" value == 4
"gblV_FermentStatus_5" value = 4 
goto "End_Choice_Status5"
endif
if "gblVReport_B1" value == 5
"gblV_FermentStatus_5" value = 5 
goto "End_Choice_Status5"
endif
if "gblVReport_B1" value == 6
"gblV_FermentStatus_5" value = 6 
goto "End_Choice_Status5"
endif
if "gblVReport_B1" value == 7
goto "End_Choice_Status5"
endif
if "gblVReport_B1" value > 7
"gblS_swAllSwitch_Label_Text" value = "1 to 7 Only"
sleep 3000
goto "Redo_Choice_5"
endif
[End_Choice_Status5]
if "gblV_FermentStatus_5" value == 5
goto "Skip_Volume_Zero_5"
endif
if "gblV_FermentStatus_5" value > 1
"RP_v_5_Fermentor_Volume" value = 0
endif
[Skip_Volume_Zero_5]
"gblVReport_B1" value = 0
[Skip_Early_A_5]
 print "@  1260 Fermentor 6"
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = hidden 
vV_Brew_Status = "gblVStartBrew" value
"gblSReportLabel_B1" value = vS_Fermentor_Name_6
vV_Status = "gblV_FermentStatus_6" value
vSMsg = "Fermentor #6 "
vSMsg1 = vS_Fermentor_Name_6
vSMsg = vSMsg + vSMsg1
vS_Fermentor = vSMsg
if vV_Status == 0
vS_Status = "Unknown"
endif
if vV_Status == 1
vS_Status = "Fementing"
endif
if vV_Status == 2
vS_Status = "Available"
endif
if vV_Status == 3
vS_Status = "Clean"
endif
if vV_Status == 4
vS_Status = "Sanitized"
endif
if vV_Status == 5
vS_Status = "Ready for WORT"
endif
if vV_Status == 6
vS_Status = "Dirty"
endif
vSMsg = "Current Status = "
vSMsg1 = vS_Status 
vSMsg = vSMsg + vSMsg1
vS_Current_Status = vSMsg
"gblS_BrewName_B1" value = vS_Current_Status
vSMsg = vS_Fermentor
if vV_Brew_Status < 100
vSMsg_End = "  The Fermentor Status will be reviewed again at the END of the Whirlpool"
"gblS_Brewery_Bottom_3" value = vSMsg_End
endif
if vV_Brew_Status > 90
vSMsg_End = "  The Fermentors must be Cleaned, Sanitized, Drained && ALL Fermentor Valves Closed. Ready to accept WORT.  The Status must be 5: READY!"
"gblS_Brewery_Bottom_3" value = vSMsg_End
vB_Skip = true
endif
if vV_Status == 0
	if vB_Skip == true
	goto "Skip_Early_A_6"
	endif
	vSMsg1 = ":  The Status = Unknown. Find out what the Status is and Set It. " 
	vSMsg_End = "If left as Unknown, the Fermentor will NOT be reviewed later. "
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 1
	if vB_Skip == true
	goto "Skip_Early_A_6"
	endif
	vSMsg1 = ":  The Status = Fermenting.  If that is still correct, Select 7 =  No Change Next.  "
	vSMsg_End = "If left as Fermenting, the Fermentor will NOT be reviewed later."
	"gblS_Brewery_Bottom_3" value = vSMsg_End
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif 
if vV_Status == 2
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
if vV_Brew_Status > 90
	vSMsg1 = ": Status = Available.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
 	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 3
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, the Fermentor should be Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Clean.  If you intend to use this Fermentor, it must be made ready.  There is about 10 minutes to do that while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 4
	vSMsg1 = ": Status = Sanitized.  The Sanitizer may be drained at the end of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status =  Sanitized.  If you intend to use this Fermentor, it must be made ready.  Drain the Sanitizer while the TRUB is settling."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 5
vSMsg1 = ": Status = Ready.   The Sanitizer is drained and all Fermentor Drain Valves Shut!  The Fermentor is Ready for WORT."
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
if vV_Status == 6
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, the Fermentor should be Cleaned and Sanitized by the END of the Boil."
	if vV_Brew_Status > 90
	vSMsg1 = ": Status = Dirty.  If you intend to use this Fermentor, it must be made ready.   A liitle late if you have not started when first warned."
	endif
	vSMsg = vSMsg + vSMsg1
	vSMsg = vSMsg + vSMsg_End
	"gblS_Brewery_Top_3" value = vSMsg
endif
 //Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
//background
"gblS_Brewery_Top_3" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_swAllSwitch_Label_Text" background = 2
//Inspector Green
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
//.........................................
if vV_Status == 0
// Inspector 0range
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 3
"insp_2_LeftMiddle_B1" visibility = visible
endif
if vV_Status == 1
"gblS_swAllSwitch_Label_Text" background = 1
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
endif
//............................................................
vSMsg = vS_Fermentor
vSMsg1 = ":   Change?\n"
vSMsg = vSMsg + vSMsg1
vSMsg1 = "1 = Fermenting\n2 = Available\n3 = Clean\n4 = Sanitized\n5 = Ready\n6 = Dirty"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_2" value = vSMsg 
[Redo_Choice_6]
"gblSReportLabel_B1" value = "Change Fermentor #6 Status?"
"gblS_swAllSwitch_Label_Text" value = "7 = N0 Change"
//background
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1" background = 1
"gblVReport_B1" background = 1
"gblVReport_B1" precision = 0
"gblVReport_B1" value = 0
// Visibility
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible 
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
//.....................................................
wait "gblVReport_B1" value > 0
if "gblVReport_B1" value == 1
"gblV_FermentStatus_6" value = 1 
goto "End_Choice_Status6"
endif
if "gblVReport_B1" value == 2
"gblV_FermentStatus_6" value = 2 
goto "End_Choice_Status6"
endif
if "gblVReport_B1" value == 3
"gblV_FermentStatus_6" value = 3 
goto "End_Choice_Status6"
endif
if "gblVReport_B1" value == 4
"gblV_FermentStatus_6" value = 4 
goto "End_Choice_Status6"
endif
if "gblVReport_B1" value == 5
"gblV_FermentStatus_6" value = 5 
goto "End_Choice_Status6"
endif
if "gblVReport_B1" value == 6
"gblV_FermentStatus_6" value = 6 
goto "End_Choice_Status6"
endif
if "gblVReport_B1" value == 7
goto "End_Choice_Status6"
endif
if "gblVReport_B1" value > 7
"gblS_swAllSwitch_Label_Text" value = "1 to 7 Only"
sleep 3000
goto "Redo_Choice_6"
endif
[End_Choice_Status6]
if "gblV_FermentStatus_6" value == 5
goto "Skip_Volume_Zero_6"
endif
if "gblV_FermentStatus_6" value > 1
"RP_v_6_Fermentor_Volume" value = 0
endif
[Skip_Volume_Zero_6]
"gblVReport_B1" value = 0 
[Skip_Early_A_6]
[Ender_Set_Status]
if "sw_Flow_Return_Fermentaion" state == False
goto "Skip_Return"
endif
if "sw_Flow_Return_Fermentaion" state == true
"sw_Flow_Return_Fermentaion" state = False
"gblS_Brewery_Top_1" value = "Return to the Main Menu if necessary."
"gblS_Brewery_Top_1" visibility = visible
 "gblS_Brewery_Top_2" visibility = hidden
"gblS_swAllSwitch_Label_Text" value = "Return to Main Menu"
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
show workspace "Fermentation"
goto "Fermentaion_Skip"
endif
[Skip_Return]
vV_Flow_Brew = vV_Flow_Brew + 1
"gblV_Brew_Status" value = vV_Flow_Brew
[Fermentaion_Skip]
start "inscpt_scrFermentorStatus"
sleep 100
wait "sw_Running_FermentorStatus" state == false
stop "inscpt_scrFermentorStatus"
if vB_Testing == true
"gblS_Inter_Script" value = "ended: sub_2_scrFermentor_Set_Status"
sleep 3000
endif
clear
"sw_Running_Script_C" state  = false
stop "sub_2_scrFermentor_Set_Status"
```

