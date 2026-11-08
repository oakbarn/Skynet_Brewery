# OakBarn Brewery BruControl Scripts, Part 5 of 5

> **Read only when OakBarn Brewery says so, or after asking permission** (Rule 16.8). The one standing exception: these
> Scripts are the basis for the Skynet Process Templates that are not finished yet. They are kept exactly as BruControl saved
> them (BruControl Script language, not Skynet Process code), so they are not brought up to the Skynet Rules.

Back to the [list of all Scripts](README.md).

## 124. Hops_11_Hop_Text_Drop_1 

Starts by itself: No · User can start or stop it: Yes · 181 lines

```text
//Hops_11_Hop_Text_Drop_1
//Version: 261002_16:49
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_HopGroup_1" value = "x"
if "gblVHop_Max" value > 0
if "gblVHop_Max" value <= 8
goto "TextHop1"
endif
endif
goto "SkipTextHop1"
[TextHop1]
new string vS_Hop1_Group0
new string vS_Hop_Msg_1
new string vS_Hop_Msg_2
new string vS_Hop_Msg_3
new string vS_Hop_Msg_4
new string vS_Hop_Msg_TTL
vS_Hop1_Group0 = "x"
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Group 1 Hops Texts.  There are Hops to be dropped as Group 1.   This populates the text fields for later durning the Boil."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Hops Group 1"
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
//Hop1 Group 1
if "gblV_Hop1_Group_R1" value == 1
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
if vS_Hop1_Group0 == "x"
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif
endif
//Hop2 Group 1
if "gblV_Hop2_Group_R1" value == 1
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
//Hop3 Group 1
if "gblV_Hop3_Group_R1" value == 1
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
//Hop4 Group 1
if "gblV_Hop4_Group_R1" value == 1
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
//Hop5 Group 1
if "gblV_Hop5_Group_R1" value == 1
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
//Hop6 Group 1
if "gblV_Hop6_Group_R1" value == 1
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
//Hop7 Group 1
if "gblV_Hop7_Group_R1" value == 1
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
//Hop8 Group 1
if "gblV_Hop8_Group_R1" value == 1
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
[ExitHopGroup1]
"gblS_HopGroup_1" value = vS_Hop1_Group0
if vS_Hop1_Group0 == "x"
"gblV_Group_1_Conflict" value =  -9999
else
"gblV_Group_1_Conflict" value =  9
endif
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
[SkipTextHop1]
"gblS_Inter_Script" value = "ended: Hops_11_Hop_Text_Drop_1"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value =  12
stop "Hops_11_Hop_Text_Drop_1"
```

## 125. Hops_12_Hop_Text_Drop_2

Starts by itself: No · User can start or stop it: Yes · 180 lines

```text
//Hops_12_Hop_Text_Drop_2
//Version: 261002_16:53
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_HopGroup_2" value = "x"
if "gblVHop_Max" value > 1
if "gblVHop_Max" value < 9
goto "TextHop2"
else
goto "SkipTextHop2"
endif
endif
[TextHop2]
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Group 2 Hops Texts.  There are Hops to be dropped as Group 2.   This populates the text fields for later durning the Boil."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Hops Group 2"
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
//Hop1 Group 2
if "gblV_Hop1_Group_R1" value == 2
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif
//Hop2 Group 2
if "gblV_Hop2_Group_R1" value == 2
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
//Hop3 Group 2
if "gblV_Hop3_Group_R1" value == 2
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
//Hop4 Group 2
if "gblV_Hop4_Group_R1" value == 2
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
//Hop5 Group 2
if "gblV_Hop5_Group_R1" value == 2
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
//Hop6 Group 2
if "gblV_Hop6_Group_R1" value == 2
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
//Hop7 Group 2
if "gblV_Hop7_Group_R1" value == 2
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
//Hop8 Group 2
if "gblV_Hop8_Group_R1" value == 2
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
[ExitHopGroup2]
"gblS_HopGroup_2" value = vS_Hop1_Group0
if vS_Hop1_Group0 == "x"
"gblV_Group_2_Conflict" value =  -9999
else
"gblV_Group_2_Conflict" value =  9
endif
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
[SkipTextHop2]
"gblS_Inter_Script" value = "ended: Hops_12_Hop_Text_Drop_2"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value =  13
stop "Hops_12_Hop_Text_Drop_2"
```

## 126. Hops_13_Hop_Text_Drop_3

Starts by itself: No · User can start or stop it: Yes · 181 lines

```text
Hops 13 hop text drop 3 · TXT
//Hops_13_Hop_Text_Drop_3
//Version: 261002_16:55
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_HopGroup_3" value = "x"
if "gblVHop_Max" value > 2
if "gblVHop_Max" value <= 8
goto "TextHop3"
endif
endif 
goto "SkipTextHop3"
[TextHop3]
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Group 3 Hops Texts.  There are Hops to be dropped as Group 3.   This populates the text fields for later durning the Boil."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Hops Group 3"
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
 
//Hop1 Group 3
if "gblV_Hop1_Group_R1" value == 3
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif 
//Hop2 Group 3
if "gblV_Hop2_Group_R1" value == 3
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
//Hop3 Group 3
if "gblV_Hop3_Group_R1" value == 3
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
//Hop4 Group 3
if "gblV_Hop4_Group_R1" value == 3
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
//Hop5 Group 3
if "gblV_Hop5_Group_R1" value == 3
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
//Hop6 Group 3
if "gblV_Hop6_Group_R1" value == 3
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
//Hop7 Group 3
if "gblV_Hop7_Group_R1" value == 3
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
//Hop8 Group 3
if "gblV_Hop8_Group_R1" value == 3
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
[ExitHopGroup3]
"gblS_HopGroup_3" value = vS_Hop1_Group0 
if vS_Hop1_Group0 == "x"
"gblV_Group_3_Conflict" value =  -9999
else
"gblV_Group_3_Conflict" value =  9
endif
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
[SkipTextHop3]
"gblS_Inter_Script" value = "ended: Hops_13_Hop_Text_Drop_3"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value =  14
stop "Hops_13_Hop_Text_Drop_3"
```

## 127. Hops_14_Hop_Text_Drop_4

Starts by itself: No · User can start or stop it: Yes · 179 lines

```text
//Hops_14_Hop_Text_Drop_4
//Version: 261002_16:58
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_HopGroup_4" value = "x"
if "gblVHop_Max" value > 3
if "gblVHop_Max" value <= 8
goto "TextHop4"
endif
endif
goto "SkipTextHop4"
[TextHop4]
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Group 4 Hops Texts.  There are Hops to be dropped as Group 4.   This populates the text fields for later durning the Boil."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Hops Group 4"
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
//Hop1 Group 4
if "gblV_Hop1_Group_R1" value == 4
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif
//Hop2 Group 4
if "gblV_Hop2_Group_R1" value == 4
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
//Hop3 Group 4
if "gblV_Hop3_Group_R1" value == 4
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
//Hop4 Group 4
if "gblV_Hop4_Group_R1" value == 4
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
//Hop5 Group 4
if "gblV_Hop5_Group_R1" value == 4
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
//Hop6 Group 4
if "gblV_Hop6_Group_R1" value == 4
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
//Hop7 Group 4
if "gblV_Hop7_Group_R1" value == 4
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
//Hop8 Group 4
if "gblV_Hop8_Group_R1" value == 4
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
[ExitHopGroup4]
"gblS_HopGroup_4" value = vS_Hop1_Group0
if vS_Hop1_Group0 == "x"
"gblV_Group_4_Conflict" value =  -9999
else
"gblV_Group_4_Conflict" value =  9
endif
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
[SkipTextHop4]
"gblS_Inter_Script" value = "ended: Hops_14_Hop_Text_Drop_4"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value =  15
stop "Hops_14_Hop_Text_Drop_4"
```

## 128. Hops_15_Hop_Text_Drop_5

Starts by itself: No · User can start or stop it: Yes · 183 lines

```text
//Hops_15_Hop_Text_Drop_5
//Version: 261002_17:00
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_HopGroup_5" value = "x"
new value vVMax
vVMax = "gblVHop_Max" value
if vVMax > 4
if vVMax <= 8
goto "TextHop5"
endif
endif
goto "SkipTextHop5"
[TextHop5]
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Group 5 Hops Texts.  There are Hops to be dropped as Group 5.   This populates the text fields for later durning the Boil."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Hops Group 5"
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
//Hop1 Group 5
if "gblV_Hop1_Group_R1" value == 5
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif
//Hop2 Group 5
if "gblV_Hop2_Group_R1" value == 5
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
//Hop3 Group 5
if "gblV_Hop3_Group_R1" value == 5
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
//Hop4 Group 5
if "gblV_Hop4_Group_R1" value == 5
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
//Hop5 Group 5
if "gblV_Hop5_Group_R1" value == 5
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
//Hop6 Group 5
if "gblV_Hop6_Group_R1" value == 5
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
//Hop7 Group 5
if "gblV_Hop7_Group_R1" value == 5
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
//Hop8 Group 5
if "gblV_Hop8_Group_R1" value == 5
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
[ExitHopGroup5]
"gblS_HopGroup_5" value = vS_Hop1_Group0
if vS_Hop1_Group0 == "x"
"gblV_Group_5_Conflict" value =  -9999
else
"gblV_Group_5_Conflict" value =  9
endif
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
[SkipTextHop5]
"gblS_Inter_Script" value = "ended: Hops_15_Hop_Text_Drop_5"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value =  16
stop "Hops_15_Hop_Text_Drop_5"
```

## 129. Hops_16_Hop_Text_Drop_6

Starts by itself: No · User can start or stop it: Yes · 181 lines

```text
//Hops_16_Hop_Text_Drop_6
//Version: 261002_17:03
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_HopGroup_6" value = "x"
new value vV_Max
vV_Max = "gblVHop_Max" value
if vV_Max > 5
if vV_Max <= 8
goto "TextHop6"
endif
endif
goto "SkipTextHop6"
[TextHop6]
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Group 6 Hops Texts.  There are Hops to be dropped as Group 6.   This populates the text fields for later durning the Boil."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Hops Group 6"
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
//Hop1 Group 6
if "gblV_Hop1_Group_R1" value == 6
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif
//Hop2 Group 6
if "gblV_Hop2_Group_R1" value == 6
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
//Hop3 Group 6
if "gblV_Hop3_Group_R1" value == 6
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
//Hop4 Group 6
if "gblV_Hop4_Group_R1" value == 6
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
//Hop5 Group 6
if "gblV_Hop5_Group_R1" value == 6
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
//Hop6 Group 6
if "gblV_Hop6_Group_R1" value == 6
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
//Hop7 Group 6
if "gblV_Hop7_Group_R1" value == 6
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
//Hop8 Group 6
if "gblV_Hop8_Group_R1" value == 6
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
[ExitHopGroup6]
"gblS_HopGroup_6" value = vS_Hop1_Group0
if vS_Hop1_Group0 == "x"
"gblV_Group_6_Conflict" value =  -9999
else
"gblV_Group_6_Conflict" value =  9
endif
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
[SkipTextHop6]
"gblS_Inter_Script" value = "ended: Hops_16_Hop_Text_Drop_6"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value =  17
stop "Hops_16_Hop_Text_Drop_6"
```

## 130. Hops_17_Hop_Text_Drop_7

Starts by itself: No · User can start or stop it: Yes · 181 lines

```text
//Hops_17_Hop_Text_Drop_7
//Version: 261002_17:08
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_HopGroup_7" value = "x"
new value vV_Max
vV_Max = "gblVHop_Max" value
if vV_Max > 6
if vV_Max <= 8
goto "TextHop7"
endif
endif
goto "SkipTextHop7"
[TextHop7]
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Group 7 Hops Texts.  There are Hops to be dropped as Group 7.   This populates the text fields for later durning the Boil."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Hops Group 7"
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
//Hop1 Group 7
if "gblV_Hop1_Group_R1" value == 7
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif
//Hop2 Group 7
if "gblV_Hop2_Group_R1" value == 7
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
//Hop3 Group 7
if "gblV_Hop3_Group_R1" value == 7
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
//Hop4 Group 7
if "gblV_Hop4_Group_R1" value == 7
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
//Hop5 Group 7
if "gblV_Hop5_Group_R1" value == 7
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
//Hop6 Group 7
if "gblV_Hop6_Group_R1" value == 7
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
//Hop7 Group 7
if "gblV_Hop7_Group_R1" value == 7
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
//Hop8 Group 7
if "gblV_Hop8_Group_R1" value == 7
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
[ExitHopGroup7]
"gblS_HopGroup_7" value = vS_Hop1_Group0
if vS_Hop1_Group0 == "x"
"gblV_Group_7_Conflict" value =  -9999
else
"gblV_Group_7_Conflict" value =  9
endif
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
[SkipTextHop7]
"gblS_Inter_Script" value = "ended: Hops_17_Hop_Text_Drop_7"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value =  18
stop "Hops_17_Hop_Text_Drop_7"
```

## 131. Hops_18_Hop_Text_Drop_8

Starts by itself: No · User can start or stop it: No · 179 lines

```text
//Hops_18_Hop_Text_Drop_8
//Version: 261002_17:10
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_HopGroup_8" value = "x"
new value vV_Max
vV_Max = "gblVHop_Max" value
if vV_Max == 8
goto "TextHop8"
endif
goto "SkipTextHop8"
[TextHop8]
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Group 8 Hops Texts.  There are Hops to be dropped as Group 8.   This populates the text fields for later durning the Boil."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Hops Group 8"
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
//Hop1 Group 8
if "gblV_Hop1_Group_R1" value == 8
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif
//Hop2 Group 8
if "gblV_Hop2_Group_R1" value == 8
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
//Hop3 Group 8
if "gblV_Hop3_Group_R1" value == 8
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
//Hop4 Group 8
if "gblV_Hop4_Group_R1" value == 8
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
//Hop5 Group 8
if "gblV_Hop5_Group_R1" value == 8
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
//Hop6 Group 8
if "gblV_Hop6_Group_R1" value == 8
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
//Hop7 Group 8
if "gblV_Hop7_Group_R1" value == 8
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
//Hop8 Group 8
if "gblV_Hop8_Group_R1" value == 8
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
[ExitHopGroup8]
"gblS_HopGroup_8" value = vS_Hop1_Group0
if vS_Hop1_Group0 == "x"
"gblV_Group_8_Conflict" value =  -9999
else
"gblV_Group_8_Conflict" value =  9
endif
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
[SkipTextHop8]
"gblS_Inter_Script" value = "ended: Hops_18_Hop_Text_Drop_8"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value = 19
stop "Hops_18_Hop_Text_Drop_8"
```

## 132. Hops_19_Hop_Text_Whirlpool

Starts by itself: No · User can start or stop it: Yes · 350 lines

```text
//Hops_19_Hop_Text_Whirlpool
//Version: 261002_20:45
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// 03/02/2024 08:15
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_HopGroup_EOB" value = "x"
"gblS_HopGroup_Rocket" value = "x"
	"gblV_Group_EoB_Hops" value = -9999
	"gblV_Group_Hop Rocket" value = -9999
if "sw_Status_Hops_EOB" state == false
goto "SkipEOBhHop"
endif
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Whirlpool Hops Texts.  There are Hops to be dropped 5 minutes into the Whirlpool or 154 °F, whichever comes first.  This also sets the Hop Rocket, if any. This populates the text fields for later durning the Whirlpool."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Whirlpool Hops"
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:03
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
new string vS_Hop1_GroupEOB
new string vS_Hop1_GroupHR
new string vS_Hop_Msg_1
new string vS_Hop_Msg_2
new string vS_Hop_Msg_3
new string vS_Hop_Msg_4
new string vS_Hop_Msg_TTL
//Hop1 EndofBoil
if "sw_Use_Hop1_Batch" state == false
goto "Hop2EndofBoil"
endif
if "gblV_Hop1_Group_R1" value == -999
vS_Hop1_GroupEOB = "gblS_HopGroup_EOB" value
vS_Hop1_GroupHR = "gblS_HopGroup_Rocket" value
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if "sw_Use_Rocket_Hop1_Batch" state == false
	"gblV_Group_EoB_Hops" value = 1
		if vS_Hop1_GroupEOB == "x"
		vS_Hop1_GroupEOB = vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		else
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + "; "
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		endif
	endif
	if "sw_Use_Rocket_Hop1_Batch" state == true
	"gblV_Group_Hop Rocket" value = 1
		if vS_Hop1_GroupHR == "x"
		vS_Hop1_GroupHR = vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		else
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + "; "
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		endif
	endif

endif
[Hop2EndofBoil]
if "sw_Use_Hop2_Batch" state == false
goto "Hop3EndofBoil"
endif

if "gblV_Hop2_Group_R1" value == -999
vS_Hop1_GroupEOB = "gblS_HopGroup_EOB" value
vS_Hop1_GroupHR = "gblS_HopGroup_Rocket" value
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop2_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop2_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if "sw_Use_Rocket_Hop2_Batch" state == false
	"gblV_Group_EoB_Hops" value = 1
		if vS_Hop1_GroupEOB == "x"
		vS_Hop1_GroupEOB = vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		else
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + "; "
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		endif
	endif
	if "sw_Use_Rocket_Hop2_Batch" state == true
	"gblV_Group_Hop Rocket" value = 1
		if vS_Hop1_GroupHR == "x"
		vS_Hop1_GroupHR = vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		else
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + "; "
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		endif
	endif
endif
[Hop3EndofBoil]
if "sw_Use_Hop3_Batch" state == false
goto "Hop4EndofBoil"
endif

if "gblV_Hop3_Group_R1" value == -999
vS_Hop1_GroupEOB = "gblS_HopGroup_EOB" value
vS_Hop1_GroupHR = "gblS_HopGroup_Rocket" value
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop3_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop3_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if "sw_Use_Rocket_Hop3_Batch" state == false
	"gblV_Group_EoB_Hops" value = 1
		if vS_Hop1_GroupEOB == "x"
		vS_Hop1_GroupEOB = vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		else
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + "; "
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		endif
	endif
	if "sw_Use_Rocket_Hop3_Batch" state == true
	"gblV_Group_Hop Rocket" value = 1
		if vS_Hop1_GroupHR == "x"
		vS_Hop1_GroupHR = vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		else
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + "; "
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		endif
	endif

endif
[Hop4EndofBoil]
if "sw_Use_Hop4_Batch" state == false
goto "Hop5EndofBoil"
endif
if "gblV_Hop4_Group_R1" value == -999
vS_Hop1_GroupEOB = "gblS_HopGroup_EOB" value
vS_Hop1_GroupHR = "gblS_HopGroup_Rocket" value
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop4_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop4_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if "sw_Use_Rocket_Hop4_Batch" state == false
	"gblV_Group_EoB_Hops" value = 1
		if vS_Hop1_GroupEOB == "x"
		vS_Hop1_GroupEOB = vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		else
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + "; "
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		endif
	endif
	if "sw_Use_Rocket_Hop4_Batch" state == true
	"gblV_Group_Hop Rocket" value = 1
		if vS_Hop1_GroupHR == "x"
		vS_Hop1_GroupHR = vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		else
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + "; "
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		endif
	endif
endif
[Hop5EndofBoil]
if "sw_Use_Hop5_Batch" state == false
goto "Hop6EndofBoil"
endif
if "gblV_Hop5_Group_R1" value == -999
vS_Hop1_GroupEOB = "gblS_HopGroup_EOB" value
vS_Hop1_GroupHR = "gblS_HopGroup_Rocket" value
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop5_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop5_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if "sw_Use_Rocket_Hop5_Batch" state == false
	"gblV_Group_EoB_Hops" value = 1
		if vS_Hop1_GroupEOB == "x"
		vS_Hop1_GroupEOB = vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		else
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + "; "
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		endif
	endif
	if "sw_Use_Rocket_Hop5_Batch" state == true
	"gblV_Group_Hop Rocket" value = 1
		if vS_Hop1_GroupHR == "x"
		vS_Hop1_GroupHR = vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		else
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + "; "
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		endif
	endif
endif
[Hop6EndofBoil]
if "sw_Use_Hop6_Batch" state == false
goto "Hop7EndofBoil"
endif
if "gblV_Hop6_Group_R1" value == -999
vS_Hop1_GroupEOB = "gblS_HopGroup_EOB" value
vS_Hop1_GroupHR = "gblS_HopGroup_Rocket" value
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop6_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop6_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if "sw_Use_Rocket_Hop6_Batch" state == false
	"gblV_Group_EoB_Hops" value = 1
		if vS_Hop1_GroupEOB == "x"
		vS_Hop1_GroupEOB = vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		else
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + "; "
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		endif
	endif
	if "sw_Use_Rocket_Hop6_Batch" state == true
	"gblV_Group_Hop Rocket" value = 1
		if vS_Hop1_GroupHR == "x"
		vS_Hop1_GroupHR = vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		else
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + "; "
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		endif
	endif
endif
[Hop7EndofBoil]
if "sw_Use_Hop7_Batch" state == false
goto "Hop8EndofBoil"
endif
if "gblV_Hop7_Group_R1" value == -999
vS_Hop1_GroupEOB = "gblS_HopGroup_EOB" value
vS_Hop1_GroupHR = "gblS_HopGroup_Rocket" value
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop7_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop7_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if "sw_Use_Rocket_Hop7_Batch" state == false
	"gblV_Group_EoB_Hops" value = 1
		if vS_Hop1_GroupEOB == "x"
		vS_Hop1_GroupEOB = vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		else
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + "; "
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		endif
	endif
	if "sw_Use_Rocket_Hop7_Batch" state == true
	"gblV_Group_Hop Rocket" value = 1
		if vS_Hop1_GroupHR == "x"
		vS_Hop1_GroupHR = vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		else
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + "; "
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		endif
	endif
endif
[Hop8EndofBoil]
if "sw_Use_Hop8_Batch" state == false
goto "ExitHopGroupEOB"
endif
if "gblV_Hop8_Group_R1" value == -999
vS_Hop1_GroupEOB = "gblS_HopGroup_EOB" value
vS_Hop1_GroupHR = "gblS_HopGroup_Rocket" value
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop8_R1" value
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop8_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if "sw_Use_Rocket_Hop8_Batch" state == false
	"gblV_Group_EoB_Hops" value = 1
		if vS_Hop1_GroupEOB == "x"
		vS_Hop1_GroupEOB = vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		else
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + "; "
		vS_Hop1_GroupEOB = vS_Hop1_GroupEOB + vS_Hop_Msg_TTL
		"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
		endif
	endif
	if "sw_Use_Rocket_Hop8_Batch" state == true
	"gblV_Group_Hop Rocket" value = 1
		if vS_Hop1_GroupHR == "x"
		vS_Hop1_GroupHR = vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		else
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + "; "
		vS_Hop1_GroupHR = vS_Hop1_GroupHR + vS_Hop_Msg_TTL
		"gblS_HopGroup_Rocket" value = vS_Hop1_GroupHR
		endif
	endif
endif
[ExitHopGroupEOB]
"gblS_HopGroup_EOB" value = vS_Hop1_GroupEOB
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" visibility = hidden
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
[SkipEOBhHop]
"tm_Delay_W1" displayname = "Short Delay"
"gblS_Inter_Script" value = "ended: Hops_19_Hop_Text_Whirlpool"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value = 20
stop "Hops_19_Hop_Text_Whirlpool"
```

## 133. Hops_20_Hop_Text_DryHop

Starts by itself: No · User can start or stop it: Yes · 488 lines

```text
//Hops_20_Hop_Text_DryHop
//Version: 261002_20:32
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//09/05/2023 15:21
//modified 03/13/2024 14:39
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblS_Group_DryHop" value = "x"
if "sw_Status_Hops_Dry" state == false
goto "EnderDryHop"
endif
new string vS_Msg_Brew_0
new string vS_Msg_Brew_0_1
new string vS_Msg_Brew_0_2
new string vS_Msg_Brew_0_3
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Dry Hops Texts  There Hops to be dropped in the Fermentor later.    This populates the text fields for later durning the Brew."
"gblS_Hop_Screen_Txt" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" displayname = "Dry Hops"
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
//Hop1 Group Dry Hops
if "gblV_Hop1_Group_R1" value == -111
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop1_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop1_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop1_Group0 = vS_Hop_Msg_TTL
endif 
//Hop2 Group Dry Hops
if "gblV_Hop2_Group_R1" value == -111
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
//Hop3 Group Dry Hops
if "gblV_Hop3_Group_R1" value == -111
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop3_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop3_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop4 Group Dry Hops
if "gblV_Hop4_Group_R1" value == -111
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop4_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop4_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop5 Group Dry Hops
if "gblV_Hop5_Group_R1" value == -111
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop5_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop5_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop6 Group Dry Hops
if "gblV_Hop6_Group_R1" value == -111
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop6_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop6_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop7 Group Dry Hops
if "gblV_Hop7_Group_R1" value == -111
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop7_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop7_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
//Hop8 Group Dry Hops
if "gblV_Hop8_Group_R1" value == -111
vS_Hop_Msg_1 = "gblV_Oz_Calculated_Hop8_R1" value 
vS_Hop_Msg_2 = " ounces of "
vS_Hop_Msg_TTL = vS_Hop_Msg_1 + vS_Hop_Msg_2
vS_Hop_Msg_3 = "gblS_Hop8_R1" value
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_3
vS_Hop_Msg_4 = " Hops"
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
vS_Hop_Msg_TTL = vS_Hop_Msg_TTL +  vS_Hop_Msg_4
	if vS_Hop1_Group0 == "x"
		vS_Hop1_Group0 = vS_Hop_Msg_TTL
	else 
		vS_Hop1_Group0 = vS_Hop1_Group0 + "; "
		vS_Hop1_Group0 = vS_Hop1_Group0 + vS_Hop_Msg_TTL
	endif
endif
[ExitHopGroupDry]
"gblS_Group_DryHop" value = vS_Hop1_Group0 
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" visibility = hidden
"tm_Delay_W1" value = "tmTopRight_B1" value
start "tm_Delay_W1"
"tm_Delay_W1" displayname = "tmTopRight_B1" displayname
"gblVScriptFlow" value =  1
if "gblS_Group_DryHop" value != "x"
"gblV_GroupDryHop"  value = 1
else
"gblV_GroupDryHop"  value = 0
"gblS_Group_DryHop" value = " "
endif
"gblS_Hop_Screen_Txt" visibility = visible
if "gblV_Group_Hops_Mash" value == 0 
"gblS_Hops_Mash" value = "x"
endif
if "gblV_Group_FirstWort" value == 0
"gblS_FirstWort" value = "x"
endif
if "gblV_Group_SoB_Hops" value == 0 
"gblS_HopGroup_0" value = "x"
endif
"gblS_Hop_Screen_Txt" value = "x"
//Hops in MASH
if "gblV_Group_Hops_Mash" value > 0
vS_Msg_Brew_0_1 = " There are " 
vS_Msg_Brew_0_2 = "gblS_Hops_Mash" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be place on top of the grain bed during the Mash."
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
endif
//First WORT
if "gblV_Group_FirstWort" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_FirstWort" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the First Run of the Brew Kettle."
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Start of Boil
if "gblV_Group_SoB_Hops" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_0" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the Brew Kettle at start of Boil."
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Boil Group 1
if "gblV_Group_1_Conflict" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_1" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the Brew Kettle when Boil Timer is "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = "gblT_Hop1Drop_R1" value
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = ". "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Boil Group_2
if "gblV_Group_2_Conflict" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_2" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the Brew Kettle when Boil Timer is "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = "gblT_Hop2Drop_R1" value
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = ". "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Boil Group_3
if "gblV_Group_3_Conflict" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_3" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the Brew Kettle when Boil Timer is "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = "gblT_Hop3Drop_R1" value
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = ". "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Boil Group_4
if "gblV_Group_4_Conflict" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_4" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the Brew Kettle when Boil Timer is "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = "gblT_Hop4Drop_R1" value
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = ". "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Boil Group_5
if "gblV_Group_5_Conflict" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_5" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the Brew Kettle when Boil Timer is "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = "gblT_Hop5Drop_R1" value
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = ". "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Boil Group_6
if "gblV_Group_6_Conflict" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_6" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the Brew Kettle when Boil Timer is "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = "gblT_Hop6Drop_R1" value
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = ". "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Boil Group_7
if "gblV_Group_7_Conflict" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_7" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the Brew Kettle when Boil Timer is "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = "gblT_Hop7Drop_R1" value
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = ". "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Boil Group_8
if "gblV_Group_8_Conflict" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_8" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the Brew Kettle when Boil Timer is "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = "gblT_Hop8Drop_R1" value
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = ". "
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Whirlpool Hops
if "gblV_Group_EoB_Hops" value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_EOB" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " to be placed in the Brew Kettle during the Whirlpool."
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
//Hop Rocket
if "gblV_Group_Hop Rocket"  value > 0
if "gblS_Hop_Screen_Txt" value == "x"
vS_Msg_Brew_0_1 = " There are "
else  
vS_Msg_Brew_0_1 = "; There are "
endif
vS_Msg_Brew_0_2 = "gblS_HopGroup_Rocket" value
vS_Msg_Brew_0 = vS_Msg_Brew_0_1 + vS_Msg_Brew_0_2
vS_Msg_Brew_0_2 = " in the Hop Rocket during the Whirlpool."
vS_Msg_Brew_0 = vS_Msg_Brew_0 + vS_Msg_Brew_0_2
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0
else
vS_Msg_Brew_0_2 = "gblS_Hop_Screen_Txt" value 
vS_Msg_Brew_0_3 = vS_Msg_Brew_0_2 + vS_Msg_Brew_0 
"gblS_Hop_Screen_Txt" value = vS_Msg_Brew_0_3
endif
endif
if "gblS_Hop_Screen_Txt" value == "x"
"gblS_Hop_Screen_Txt" = "There are NO Hops??????"
endif
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:00:00:03
"tm_Delay_W1" visibility = visible
start "tm_Delay_W1"
"sw_Flow_ByBass_Hop_Calc" visibility = hidden
"sw_Advance_HopsCalc" visibility = hidden
[LoopDryHopEnd]
if  "tm_Delay_W1" value <=  00:00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
"gblS_Hop_Screen_Txt" visibility = visible
"sw_Advance_Hop_Delay" visibility = hidden
goto "EnderDryHop"
endif
goto "LoopDryHopEnd"
[EnderDryHop]
"gblV_Brew_Status" value = 10
if vB_Testing == true
"gblS_Inter_Script" value = "ended: Hops_20_Hop_Text_DryHop"
sleep 4001
endif
clear
"gblVScriptFlow" value = 21
stop "Hops_20_Hop_Text_DryHop"
```

## 134. hops_scrSetHopGroupsReview

Starts by itself: No · User can start or stop it: Yes · 42 lines

```text
//hops_scrSetHopGroupsReview
// MIT License Granted
//Copyright © OakBarn Brewery 2026

//01/20/2024 10:23
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................

"gblS_Hop_Screen_Txt" displayname = "Review The Hop Group!"
new string vS_HRMsg1
new string vS_HRLine
new string vS_HRMsg2
new string vS_HRMsg3
vS_HRLine = " "
vS_HRMsg1 = "You should review the groupings.  Like Time Hops should be in the same Group.   If you have two Hops that are to be dropped at 60 minutes, and they are the first to be dropped.  They should both be Group 1.      Order Like Time Hops in the same Hop Group and put those groups in order of the drop.   As an example, our TGS has 3 Hops:"
vS_HRMsg1 = vS_HRMsg1 +   vS_HRLine  
 vS_HRMsg2 = "First to Drop is Target Hops at 60 minutes.  They will be Grouped as  1."   
 vS_HRMsg2 = vS_HRMsg2 +   vS_HRLine  
  vS_HRMsg3 = vS_HRMsg1 + vS_HRMsg2
vS_HRMsg1 = "Second (and last)  to Drop is both Stryian Golden and Hersberger.  Thay are dropped at 15 minutes.  They  both  will be Grouped as  2."
vS_HRMsg1 = vS_HRMsg1 +   vS_HRLine  
 vS_HRMsg2 = "  Make any needed  corrections then click the Main Brewery Switch  (Bottom right) to advance.  This message is displayed for 1 minute.  You may use the Advance Timer (upper right). to end message."
 vS_HRMsg2 = vS_HRMsg2 +   vS_HRLine 
  vS_HRMsg3 = vS_HRMsg3 + vS_HRMsg1
  vS_HRMsg3 = vS_HRMsg3 + vS_HRMsg2
"gblS_Hop_Screen_Txt" value = vS_HRMsg3
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = 00:01:00
"tm_Delay_W1" type = countdown
start "tm_Delay_W1" 
"tm_Delay_W1" visibility = visible
"sw_Advance_Hop_Delay" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
"gblS_Hop_Screen_Txt" visibility = hidden
"sw_Advance_Hop_Delay" visibility = hidden
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
clear
stop "hops_scrSetHopGroupsReview"
```

## 135. hops_scrHopSwitches

Starts by itself: No · User can start or stop it: Yes · 1141 lines

```text
//hops_scrHopSwitches
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//set Hop Group for switches
//02/26/2024:11:25
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new string vS_Hop_SW_Body
new string vS_Hop_SW_Msg
new string vS_Hop_SW_1
new string vS_HopName_SW_1
new string vS_HopBody_Mash_SW
new string vS_HopBody_Whirlpool_SW
new string vS_HopBody_Start_SW
new string vS_HopBody_1st_SW
new string vS_HopBody_Dry_SW
new string vS_HopBody_Boil_SW
new string vS_HopAdvance_SW
vS_HopBody_Mash_SW = " Hops should be placed on top of the Grain Bed  at the Start of the MASH.  You will get an Alarm.  Review AAu and other Attributes. "
vS_HopBody_Whirlpool_SW = " Hops should be placed in the Brew Kettle (or Hop Rocket) when the Whirlpool is at 154 °F.  You will get an Alarm.  Review AAu and other Attributes. "
vS_HopBody_Start_SW = " Hops should be placed in the Brew Kettle at the Start of the Boil. Watch for Boil Over!  You will get an Alarm.  Review AAu and other Attributes. "
vS_HopBody_1st_SW = " Hops should be placed in the Brew Kettle when transferring the first RUN.  You will get an Alarm.  Review AAu and other Attributes. "
vS_HopBody_Dry_SW = " Hops should be placed in the Fermentor Days Prior to Kegging.  Review AAu and other Attributes. Put a Note on the Fermentor!  "
vS_HopBody_Boil_SW = " Hops should be placed in the Brew Kettle durning the Boil.  You will get an Alarm.  Review AAu and other Attributes.  You will need to manually order the Hops! "
vS_HopAdvance_SW = "This message will be displayed for 1 Minute.   You should Click the Calculate Hops switch to set the IBUs and other data once you have reviewed your changes.  You may click Advance Timer on the Upper Right to advance now".
//Hop1
print "Hop1"
if "sw_Flow_Mash_Hop1"  state == true
"sw_Use_Hop1_Batch" state = true
"gblS_Hop1_R1" displayname = "Hop #1 - Top of Mash"
"insp_Name_Hop1" displayname = "Hop #1 - Top of Mash"
"gblV_Hop1_Group_R1" value = -333
"sw_Flow_Mash_Hop1"  state = false
vS_Hop_SW_1 = "Hop #1-Top of Mash: "
vS_HopName_SW_1 = "gblS_Hop1_R1" value
vS_Hop_SW_Body = vS_HopBody_Mash_SW
"gblS_Hop1_R1" background = 3
"insp_Name_Hop1" background = 3
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = hidden
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_Whrilpool_Hop1" state == true
"sw_Use_Hop1_Batch" state = true
"gblS_Hop1_R1" displayname = "Hop #1 at 154 °F Whirlpool"
"insp_Name_Hop1" displayname = "Hop #1 at 154 °F Whirlpool"
"gblV_Hop1_Group_R1" value = -999
"sw_Flow_Whrilpool_Hop1"  state = false
vS_Hop_SW_1 = "Hop #1 at 154 °F Whirlpool:  "
vS_HopName_SW_1 = "gblS_Hop1_R1" value
vS_Hop_SW_Body = vS_HopBody_Whirlpool_SW
"gblS_Hop1_R1" background = 3
"insp_Name_Hop1" background = 3
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = visible
"gblV_TimeHop1_Min_R1" value = 10
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop1_Batch" visibility = visible
"gblV_Hop1_Group_R1" visibility = hidden 
goto "HopSwMessage"
endif
if "sw_Flow_SOB_Hop1" state == true 
print "Start of Boil"
"sw_Use_Hop1_Batch" state = true
"gblS_Hop1_R1" displayname = "Hop #1 - Start of Boil"
"insp_Name_Hop1" displayname = "Hop #1 - Start of Boil"
"gblV_Hop1_Group_R1" value = -888
"sw_Flow_SOB_Hop1"  state = false
vS_Hop_SW_1 = "Hop #1 - Start of Boil:  "
vS_HopName_SW_1 = "gblS_Hop1_R1" value
vS_Hop_SW_Body = vS_HopBody_Start_SW
"gblS_Hop1_R1" background = 2
"insp_Name_Hop1" background = 2
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = hidden
"gblV_TimeHop1_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_1st_Wort_Hop1" state == true
print "1st:"
"sw_Use_Hop1_Batch" state = true
"gblS_Hop1_R1" displayname = "Hop #1 - 1st WORT"
"insp_Name_Hop1" displayname = "Hop #1 - 1st WORT"
"gblV_Hop1_Group_R1" value = -444
"sw_Flow_1st_Wort_Hop1"  state = false
vS_Hop_SW_1 = "Hop #1 - 1st WORT:  "
vS_HopName_SW_1 = "gblS_Hop1_R1" value
vS_Hop_SW_Body = vS_HopBody_1st_SW
"gblS_Hop1_R1" background = 2
"insp_Name_Hop1" background = 2
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = hidden
"gblV_TimeHop1_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = hidden
goto "HopSwMessage"	
endif
if "sw_Flow_Boil_Hop1" state ==  true
"gblV_Hop1_Group_R1" value = 919
"sw_Flow_Boil_Hop1" state = false
"gblS_Hop1_R1" displayname = "Hop #1 - Boiling"
"insp_Name_Hop1" displayname = "Hop #1 - Boiling"
vS_Hop_SW_1 = "Hop #1 - Boiling:  "
vS_HopName_SW_1 = "gblS_Hop1_R1" value
vS_Hop_SW_Body = vS_HopBody_Boil_SW
"gblS_Hop1_R1" background = 2
"insp_Name_Hop1" background = 2
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = visible
"gblT_Hop1Drop_R1" visibility = visible
"gblV_Hop1_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = visible	
goto "HopSwMessage"
endif
if "sw_Flow_Dry_Hop1" state == true
"sw_Flow_Dry_Hop1" state = false
"gblV_Hop1_Group_R1" value = -111
"gblS_Hop1_R1" displayname = "Hop #1 - Dry Hop"
"insp_Name_Hop1" displayname = "Hop #1 - Dry Hop"
vS_Hop_SW_1 = "Hop #1 - Dry Hop:  "
vS_HopName_SW_1 = "gblS_Hop1_R1" value
vS_Hop_SW_Body = vS_HopBody_Dry_SW
"gblS_Hop1_R1" background = 1
"insp_Name_Hop1" background = 1
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = visible
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
//Hop2
if "sw_Flow_Mash_Hop2"  state == true
"sw_Use_Hop2_Batch" state = true
"gblS_Hop2_R1" displayname = "Hop #2 - Top of Mash"
"insp_Name_Hop2" displayname = "Hop #2 - Top of Mash"
"gblV_Hop2_Group_R1" value = -333
"sw_Flow_Mash_Hop2"  state = false
vS_Hop_SW_1 = "Hop #2-Top of Mash: "
vS_HopName_SW_1 = "gblS_Hop2_R1" value
vS_Hop_SW_Body = vS_HopBody_Mash_SW
"gblS_Hop2_R1" background = 3
"insp_Name_Hop2" background = 3
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = hidden
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_Whrilpool_Hop2" state == true
"sw_Use_Hop2_Batch" state = true
"gblS_Hop2_R1" displayname = "Hop #2 at 154 °F Whirlpool"
"insp_Name_Hop2" displayname = "Hop #2 at 154 °F Whirlpool"
"gblV_Hop2_Group_R1" value = -999
"sw_Flow_Whrilpool_Hop2"  state = false
vS_Hop_SW_1 = "Hop #2 at 154 °F Whirlpool:  "
vS_HopName_SW_1 = "gblS_Hop2_R1" value
vS_Hop_SW_Body = vS_HopBody_Whirlpool_SW
"gblS_Hop2_R1" background = 3
"insp_Name_Hop2" background = 3
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = visible
"gblV_TimeHop2_Min_R1" value = 10
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop2_Batch" visibility = visible
"gblV_Hop2_Group_R1" visibility = hidden 
goto "HopSwMessage"
endif
if "sw_Flow_SOB_Hop2" state == true 
"sw_Use_Hop2_Batch" state = true
"gblS_Hop2_R1" displayname = "Hop #2 - Start of Boil"
"insp_Name_Hop2" displayname = "Hop #2 - Start of Boil"
"gblV_Hop2_Group_R1" value = -888
"sw_Flow_SOB_Hop2"  state = false
vS_Hop_SW_1 = "Hop #2 - Start of Boil:  "
vS_HopName_SW_1 = "gblS_Hop2_R1" value
vS_Hop_SW_Body = vS_HopBody_Start_SW
"gblS_Hop2_R1" background = 2
"insp_Name_Hop2" background = 2
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = hidden
"gblV_TimeHop2_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_1st_Wort_Hop2" state == true
"sw_Use_Hop2_Batch" state = true
"gblS_Hop2_R1" displayname = "Hop #2 - 1st WORT"
"insp_Name_Hop2" displayname = "Hop #2 - 1st WORT"
"gblV_Hop2_Group_R1" value = -444
"sw_Flow_1st_Wort_Hop2"  state = false
vS_Hop_SW_1 = "Hop #2 - 1st WORT:  "
vS_HopName_SW_1 = "gblS_Hop2_R1" value
vS_Hop_SW_Body = vS_HopBody_1st_SW
"gblS_Hop2_R1" background = 2
"insp_Name_Hop2" background = 2
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = hidden
"gblV_TimeHop2_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = hidden
goto "HopSwMessage"	
endif
if "sw_Flow_Boil_Hop2" state ==  true
"gblV_Hop2_Group_R1" value = 919
"sw_Flow_Boil_Hop2" state = false
"gblS_Hop2_R1" displayname = "Hop #2 - Boiling"
"insp_Name_Hop2" displayname = "Hop #2 - Boiling"
vS_Hop_SW_1 = "Hop #2 - Boiling:  "
vS_HopName_SW_1 = "gblS_Hop2_R1" value
vS_Hop_SW_Body = vS_HopBody_Boil_SW
"gblS_Hop2_R1" background = 2
"insp_Name_Hop2" background = 2
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = visible
"gblT_Hop2Drop_R1" visibility = visible
"gblV_Hop2_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = visible	
goto "HopSwMessage"
endif
if "sw_Flow_Dry_Hop2" state == true
"sw_Flow_Dry_Hop2" state = false
"gblV_Hop2_Group_R1" value = -111
"gblS_Hop2_R1" displayname = "Hop #2 - Dry Hop"
"insp_Name_Hop2" displayname = "Hop #2 - Dry Hop"
vS_Hop_SW_1 = "Hop #2 - Dry Hop:  "
vS_HopName_SW_1 = "gblS_Hop2_R1" value
vS_Hop_SW_Body = vS_HopBody_Dry_SW
"gblS_Hop2_R1" background = 1
"insp_Name_Hop2" background = 1
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = visible
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
//Hop3
if "sw_Flow_Mash_Hop3"  state == true
"sw_Use_Hop3_Batch" state = true
"gblS_Hop3_R1" displayname = "Hop #3 - Top of Mash"
"insp_Name_Hop3" displayname = "Hop #3 - Top of Mash"
"gblV_Hop3_Group_R1" value = -333
"sw_Flow_Mash_Hop3"  state = false
vS_Hop_SW_1 = "Hop #3-Top of Mash: "
vS_HopName_SW_1 = "gblS_Hop3_R1" value
vS_Hop_SW_Body = vS_HopBody_Mash_SW
"gblS_Hop3_R1" background = 3
"insp_Name_Hop3" background = 3
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = hidden
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_Whrilpool_Hop3" state == true
"sw_Use_Hop3_Batch" state = true
"gblS_Hop3_R1" displayname = "Hop #3 at 154 °F Whirlpool"
"insp_Name_Hop3" displayname = "Hop #3 at 154 °F Whirlpool"
"gblV_Hop3_Group_R1" value = -999
"sw_Flow_Whrilpool_Hop3"  state = false
vS_Hop_SW_1 = "Hop #3 at 154 °F Whirlpool:  "
vS_HopName_SW_1 = "gblS_Hop3_R1" value
vS_Hop_SW_Body = vS_HopBody_Whirlpool_SW
"gblS_Hop3_R1" background = 3
"insp_Name_Hop3" background = 3
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = visible
"gblV_TimeHop3_Min_R1" value = 10
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop3_Batch" visibility = visible
"gblV_Hop3_Group_R1" visibility = hidden 
goto "HopSwMessage"
endif
if "sw_Flow_SOB_Hop3" state == true 
"sw_Use_Hop3_Batch" state = true
"gblS_Hop3_R1" displayname = "Hop #3 - Start of Boil"
"insp_Name_Hop3" displayname = "Hop #3 - Start of Boil"
"gblV_Hop3_Group_R1" value = -888
"sw_Flow_SOB_Hop3"  state = false
vS_Hop_SW_1 = "Hop #3 - Start of Boil:  "
vS_HopName_SW_1 = "gblS_Hop3_R1" value
vS_Hop_SW_Body = vS_HopBody_Start_SW
"gblS_Hop3_R1" background = 2
"insp_Name_Hop3" background = 2
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = hidden
"gblV_TimeHop3_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_1st_Wort_Hop3" state == true
"sw_Use_Hop3_Batch" state = true
"gblS_Hop3_R1" displayname = "Hop #3 - 1st WORT"
"insp_Name_Hop3" displayname = "Hop #3 - 1st WORT"
"gblV_Hop3_Group_R1" value = -444
"sw_Flow_1st_Wort_Hop3"  state = false
vS_Hop_SW_1 = "Hop #3 - 1st WORT:  "
vS_HopName_SW_1 = "gblS_Hop3_R1" value
vS_Hop_SW_Body = vS_HopBody_1st_SW
"gblS_Hop3_R1" background = 2
"insp_Name_Hop3" background = 2
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = hidden
"gblV_TimeHop3_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = hidden
goto "HopSwMessage"	
endif
if "sw_Flow_Boil_Hop3" state ==  true
"gblV_Hop3_Group_R1" value = 919
"sw_Flow_Boil_Hop3" state = false
"gblS_Hop3_R1" displayname = "Hop #3 - Boiling"
"insp_Name_Hop3" displayname = "Hop #3 - Boiling"
vS_Hop_SW_1 = "Hop #3 - Boiling:  "
vS_HopName_SW_1 = "gblS_Hop3_R1" value
vS_Hop_SW_Body = vS_HopBody_Boil_SW
"gblS_Hop3_R1" background = 2
"insp_Name_Hop3" background = 2
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = visible
"gblT_Hop3Drop_R1" visibility = visible
"gblV_Hop3_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = visible	
goto "HopSwMessage"
endif
if "sw_Flow_Dry_Hop3" state == true
"sw_Flow_Dry_Hop3" state = false
"gblV_Hop3_Group_R1" value = -111
"gblS_Hop3_R1" displayname = "Hop #3 - Dry Hop"
"insp_Name_Hop3" displayname = "Hop #3 - Dry Hop"
vS_Hop_SW_1 = "Hop #3 - Dry Hop:  "
vS_HopName_SW_1 = "gblS_Hop3_R1" value
vS_Hop_SW_Body = vS_HopBody_Dry_SW
"gblS_Hop3_R1" background = 1
"insp_Name_Hop3" background = 1
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = visible
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
//Hop4
if "sw_Flow_Mash_Hop4"  state == true
"sw_Use_Hop4_Batch" state = true
"gblS_Hop4_R1" displayname = "Hop #4 - Top of Mash"
"insp_Name_Hop4" displayname = "Hop #4 - Top of Mash"
"gblV_Hop4_Group_R1" value = -333
"sw_Flow_Mash_Hop4"  state = false
vS_Hop_SW_1 = "Hop #4-Top of Mash: "
vS_HopName_SW_1 = "gblS_Hop4_R1" value
vS_Hop_SW_Body = vS_HopBody_Mash_SW
"gblS_Hop4_R1" background = 3
"insp_Name_Hop4" background = 3
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = hidden
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_Whrilpool_Hop4" state == true
"sw_Use_Hop4_Batch" state = true
"gblS_Hop4_R1" displayname = "Hop #4 at 154 °F Whirlpool"
"insp_Name_Hop4" displayname = "Hop #4 at 154 °F Whirlpool"
"gblV_Hop4_Group_R1" value = -999
"sw_Flow_Whrilpool_Hop4"  state = false
vS_Hop_SW_1 = "Hop #4 at 154 °F Whirlpool:  "
vS_HopName_SW_1 = "gblS_Hop4_R1" value
vS_Hop_SW_Body = vS_HopBody_Whirlpool_SW
"gblS_Hop4_R1" background = 3
"insp_Name_Hop4" background = 3
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = visible
"gblV_TimeHop4_Min_R1" value = 10
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop4_Batch" visibility = visible
"gblV_Hop4_Group_R1" visibility = hidden 
goto "HopSwMessage"
endif
if "sw_Flow_SOB_Hop4" state == true 
"sw_Use_Hop4_Batch" state = true
"gblS_Hop4_R1" displayname = "Hop #4 - Start of Boil"
"insp_Name_Hop4" displayname = "Hop #4 - Start of Boil"
"gblV_Hop4_Group_R1" value = -888
"sw_Flow_SOB_Hop4"  state = false
vS_Hop_SW_1 = "Hop #4 - Start of Boil:  "
vS_HopName_SW_1 = "gblS_Hop4_R1" value
vS_Hop_SW_Body = vS_HopBody_Start_SW
"gblS_Hop4_R1" background = 2
"insp_Name_Hop4" background = 2
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = hidden
"gblV_TimeHop4_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_1st_Wort_Hop4" state == true
"sw_Use_Hop4_Batch" state = true
"gblS_Hop4_R1" displayname = "Hop #4 - 1st WORT"
"insp_Name_Hop4" displayname = "Hop #4 - 1st WORT"
"gblV_Hop4_Group_R1" value = -444
"sw_Flow_1st_Wort_Hop4"  state = false
vS_Hop_SW_1 = "Hop #4 - 1st WORT:  "
vS_HopName_SW_1 = "gblS_Hop4_R1" value
vS_Hop_SW_Body = vS_HopBody_1st_SW
"gblS_Hop4_R1" background = 2
"insp_Name_Hop4" background = 2
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = hidden
"gblV_TimeHop4_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = hidden
goto "HopSwMessage"	
endif
if "sw_Flow_Boil_Hop4" state ==  true
"gblV_Hop4_Group_R1" value = 919
"sw_Flow_Boil_Hop4" state = false
"gblS_Hop4_R1" displayname = "Hop #4 - Boiling"
"insp_Name_Hop4" displayname = "Hop #4 - Boiling"
vS_Hop_SW_1 = "Hop #4 - Boiling:  "
vS_HopName_SW_1 = "gblS_Hop4_R1" value
vS_Hop_SW_Body = vS_HopBody_Boil_SW
"gblS_Hop4_R1" background = 2
"insp_Name_Hop4" background = 2
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = visible
"gblT_Hop4Drop_R1" visibility = visible
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = visible	
goto "HopSwMessage"
endif
if "sw_Flow_Dry_Hop4" state == true
"sw_Flow_Dry_Hop4" state = false
"gblV_Hop4_Group_R1" value = -111
"gblS_Hop4_R1" displayname = "Hop #4 - Dry Hop"
"insp_Name_Hop4" displayname = "Hop #4 - Dry Hop"
vS_Hop_SW_1 = "Hop #4 - Dry Hop:  "
vS_HopName_SW_1 = "gblS_Hop4_R1" value
vS_Hop_SW_Body = vS_HopBody_Dry_SW
"gblS_Hop4_R1" background = 1
"insp_Name_Hop4" background = 1
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = visible
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
//Hop5
if "sw_Flow_Mash_Hop5"  state == true
"sw_Use_Hop5_Batch" state = true
"gblS_Hop5_R1" displayname = "Hop #5 - Top of Mash"
"insp_Name_Hop5" displayname = "Hop #5 - Top of Mash"
"gblV_Hop5_Group_R1" value = -333
"sw_Flow_Mash_Hop5"  state = false
vS_Hop_SW_1 = "Hop #5-Top of Mash: "
vS_HopName_SW_1 = "gblS_Hop5_R1" value
vS_Hop_SW_Body = vS_HopBody_Mash_SW
"gblS_Hop5_R1" background = 3
"insp_Name_Hop5" background = 3
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = hidden
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_Whrilpool_Hop5" state == true
"sw_Use_Hop5_Batch" state = true
"gblS_Hop5_R1" displayname = "Hop #5 at 154 °F Whirlpool"
"insp_Name_Hop5" displayname = "Hop #5 at 154 °F Whirlpool"
"gblV_Hop5_Group_R1" value = -999
"sw_Flow_Whrilpool_Hop5"  state = false
vS_Hop_SW_1 = "Hop #5 at 154 °F Whirlpool:  "
vS_HopName_SW_1 = "gblS_Hop5_R1" value
vS_Hop_SW_Body = vS_HopBody_Whirlpool_SW
"gblS_Hop5_R1" background = 3
"insp_Name_Hop5" background = 3
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = visible
"gblV_TimeHop5_Min_R1" value = 10
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = visible
"gblV_Hop5_Group_R1" visibility = hidden 
goto "HopSwMessage"
endif
if "sw_Flow_SOB_Hop5" state == true 
"sw_Use_Hop5_Batch" state = true
"gblS_Hop5_R1" displayname = "Hop #5 - Start of Boil"
"insp_Name_Hop5" displayname = "Hop #5 - Start of Boil"
"gblV_Hop5_Group_R1" value = -888
"sw_Flow_SOB_Hop5"  state = false
vS_Hop_SW_1 = "Hop #5 - Start of Boil:  "
vS_HopName_SW_1 = "gblS_Hop5_R1" value
vS_Hop_SW_Body = vS_HopBody_Start_SW
"gblS_Hop5_R1" background = 2
"insp_Name_Hop5" background = 2
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = hidden
"gblV_TimeHop5_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_1st_Wort_Hop5" state == true
"sw_Use_Hop5_Batch" state = true
"gblS_Hop5_R1" displayname = "Hop #5 - 1st WORT"
"insp_Name_Hop5" displayname = "Hop #5 - 1st WORT"
"gblV_Hop5_Group_R1" value = -444
"sw_Flow_1st_Wort_Hop5"  state = false
vS_Hop_SW_1 = "Hop #5 - 1st WORT:  "
vS_HopName_SW_1 = "gblS_Hop5_R1" value
vS_Hop_SW_Body = vS_HopBody_1st_SW
"gblS_Hop5_R1" background = 2
"insp_Name_Hop5" background = 2
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = hidden
"gblV_TimeHop5_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = hidden
goto "HopSwMessage"	
endif
if "sw_Flow_Boil_Hop5" state ==  true
"gblV_Hop5_Group_R1" value = 919
"sw_Flow_Boil_Hop5" state = false
"gblS_Hop5_R1" displayname = "Hop #5 - Boiling"
"insp_Name_Hop5" displayname = "Hop #5 - Boiling"
vS_Hop_SW_1 = "Hop #5 - Boiling:  "
vS_HopName_SW_1 = "gblS_Hop5_R1" value
vS_Hop_SW_Body = vS_HopBody_Boil_SW
"gblS_Hop5_R1" background = 2
"insp_Name_Hop5" background = 2
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = visible
"gblT_Hop5Drop_R1" visibility = visible
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = visible	
goto "HopSwMessage"
endif
if "sw_Flow_Dry_Hop5" state == true
"sw_Flow_Dry_Hop5" state = false
"gblV_Hop5_Group_R1" value = -111
"gblS_Hop5_R1" displayname = "Hop #5 - Dry Hop"
"insp_Name_Hop5" displayname = "Hop #5 - Dry Hop"
vS_Hop_SW_1 = "Hop #5 - Dry Hop:  "
vS_HopName_SW_1 = "gblS_Hop5_R1" value
vS_Hop_SW_Body = vS_HopBody_Dry_SW
"gblS_Hop5_R1" background = 1
"insp_Name_Hop5" background = 1
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = visible
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
//Hop6
if "sw_Flow_Mash_Hop6"  state == true
"sw_Use_Hop6_Batch" state = true
"gblS_Hop6_R1" displayname = "Hop #6 - Top of Mash"
"insp_Name_Hop6" displayname = "Hop #6 - Top of Mash"
"gblV_Hop6_Group_R1" value = -333
"sw_Flow_Mash_Hop6"  state = false
vS_Hop_SW_1 = "Hop #6-Top of Mash: "
vS_HopName_SW_1 = "gblS_Hop6_R1" value
vS_Hop_SW_Body = vS_HopBody_Mash_SW
"gblS_Hop6_R1" background = 3
"insp_Name_Hop6" background = 3
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = hidden
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_Whrilpool_Hop6" state == true
"sw_Use_Hop6_Batch" state = true
"gblS_Hop6_R1" displayname = "Hop #6 at 154 °F Whirlpool"
"insp_Name_Hop6" displayname = "Hop #6 at 154 °F Whirlpool"
"gblV_Hop6_Group_R1" value = -999
"sw_Flow_Whrilpool_Hop6"  state = false
vS_Hop_SW_1 = "Hop #6 at 154 °F Whirlpool:  "
vS_HopName_SW_1 = "gblS_Hop6_R1" value
vS_Hop_SW_Body = vS_HopBody_Whirlpool_SW
"gblS_Hop6_R1" background = 3
"insp_Name_Hop6" background = 3
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = visible
"gblV_TimeHop6_Min_R1" value = 10
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop6_Batch" visibility = visible
"gblV_Hop6_Group_R1" visibility = hidden 
goto "HopSwMessage"
endif
if "sw_Flow_SOB_Hop6" state == true 
"sw_Use_Hop6_Batch" state = true
"gblS_Hop6_R1" displayname = "Hop #6 - Start of Boil"
"insp_Name_Hop6" displayname = "Hop #6 - Start of Boil"
"gblV_Hop6_Group_R1" value = -888
"sw_Flow_SOB_Hop6"  state = false
vS_Hop_SW_1 = "Hop #6 - Start of Boil:  "
vS_HopName_SW_1 = "gblS_Hop6_R1" value
vS_Hop_SW_Body = vS_HopBody_Start_SW
"gblS_Hop6_R1" background = 2
"insp_Name_Hop6" background = 2
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = hidden
"gblV_TimeHop6_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_1st_Wort_Hop6" state == true
"sw_Use_Hop6_Batch" state = true
"gblS_Hop6_R1" displayname = "Hop #6 - 1st WORT"
"insp_Name_Hop6" displayname = "Hop #6 - 1st WORT"
"gblV_Hop6_Group_R1" value = -444
"sw_Flow_1st_Wort_Hop6"  state = false
vS_Hop_SW_1 = "Hop #6 - 1st WORT:  "
vS_HopName_SW_1 = "gblS_Hop6_R1" value
vS_Hop_SW_Body = vS_HopBody_1st_SW
"gblS_Hop6_R1" background = 2
"insp_Name_Hop6" background = 2
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = hidden
"gblV_TimeHop6_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = hidden
goto "HopSwMessage"	
endif
if "sw_Flow_Boil_Hop6" state ==  true
"gblV_Hop6_Group_R1" value = 919
"sw_Flow_Boil_Hop6" state = false
"gblS_Hop6_R1" displayname = "Hop #6 - Boiling"
"insp_Name_Hop6" displayname = "Hop #6 - Boiling"
vS_Hop_SW_1 = "Hop #6 - Boiling:  "
vS_HopName_SW_1 = "gblS_Hop6_R1" value
vS_Hop_SW_Body = vS_HopBody_Boil_SW
"gblS_Hop6_R1" background = 2
"insp_Name_Hop6" background = 2
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = visible
"gblT_Hop6Drop_R1" visibility = visible
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = visible	
goto "HopSwMessage"
endif
if "sw_Flow_Dry_Hop6" state == true
"sw_Flow_Dry_Hop6" state = false
"gblV_Hop6_Group_R1" value = -111
"gblS_Hop6_R1" displayname = "Hop #6 - Dry Hop"
"insp_Name_Hop6" displayname = "Hop #6 - Dry Hop"
vS_Hop_SW_1 = "Hop #6 - Dry Hop:  "
vS_HopName_SW_1 = "gblS_Hop6_R1" value
vS_Hop_SW_Body = vS_HopBody_Dry_SW
"gblS_Hop6_R1" background = 1
"insp_Name_Hop6" background = 1
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = visible
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
//Hop7
if "sw_Flow_Mash_Hop7"  state == true
"sw_Use_Hop7_Batch" state = true
"gblS_Hop7_R1" displayname = "Hop #7- Top of Mash"
"insp_Name_Hop7" displayname = "Hop #7- Top of Mash"
"gblV_Hop7_Group_R1" value = -333
"sw_Flow_Mash_Hop7"  state = false
vS_Hop_SW_1 = "Hop #6-Top of Mash: "
vS_HopName_SW_1 = "gblS_Hop7_R1" value
vS_Hop_SW_Body = vS_HopBody_Mash_SW
"gblS_Hop7_R1" background = 3
"insp_Name_Hop7" background = 3
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = hidden
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_Whrilpool_Hop7" state == true
"sw_Use_Hop7_Batch" state = true
"gblS_Hop7_R1" displayname = "Hop #7at 154 °F Whirlpool"
"insp_Name_Hop7" displayname = "Hop #7at 154 °F Whirlpool"
"gblV_Hop7_Group_R1" value = -999
"sw_Flow_Whrilpool_Hop7"  state = false
vS_Hop_SW_1 = "Hop #7at 154 °F Whirlpool:  "
vS_HopName_SW_1 = "gblS_Hop7_R1" value
vS_Hop_SW_Body = vS_HopBody_Whirlpool_SW
"gblS_Hop7_R1" background = 3
"insp_Name_Hop7" background = 3
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = visible
"gblV_TimeHop7_Min_R1" value = 10
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop7_Batch" visibility = visible
"gblV_Hop7_Group_R1" visibility = hidden 
goto "HopSwMessage"
endif
if "sw_Flow_SOB_Hop7" state == true 
"sw_Use_Hop7_Batch" state = true
"gblS_Hop7_R1" displayname = "Hop #7- Start of Boil"
"insp_Name_Hop7" displayname = "Hop #7- Start of Boil"
"gblV_Hop7_Group_R1" value = -888
"sw_Flow_SOB_Hop7"  state = false
vS_Hop_SW_1 = "Hop #7- Start of Boil:  "
vS_HopName_SW_1 = "gblS_Hop7_R1" value
vS_Hop_SW_Body = vS_HopBody_Start_SW
"gblS_Hop7_R1" background = 2
"insp_Name_Hop7" background = 2
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = hidden
"gblV_TimeHop7_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_1st_Wort_Hop7" state == true
"sw_Use_Hop7_Batch" state = true
"gblS_Hop7_R1" displayname = "Hop #7- 1st WORT"
"insp_Name_Hop7" displayname = "Hop #7- 1st WORT"
"gblV_Hop7_Group_R1" value = -444
"sw_Flow_1st_Wort_Hop7"  state = false
vS_Hop_SW_1 = "Hop #7- 1st WORT:  "
vS_HopName_SW_1 = "gblS_Hop7_R1" value
vS_Hop_SW_Body = vS_HopBody_1st_SW
"gblS_Hop7_R1" background = 2
"insp_Name_Hop7" background = 2
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = hidden
"gblV_TimeHop7_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = hidden
goto "HopSwMessage"	
endif
if "sw_Flow_Boil_Hop7" state ==  true
"gblV_Hop7_Group_R1" value = 919
"sw_Flow_Boil_Hop7" state = false
"gblS_Hop7_R1" displayname = "Hop #7- Boiling"
"insp_Name_Hop7" displayname = "Hop #7- Boiling"
vS_Hop_SW_1 = "Hop #7- Boiling:  "
vS_HopName_SW_1 = "gblS_Hop7_R1" value
vS_Hop_SW_Body = vS_HopBody_Boil_SW
"gblS_Hop7_R1" background = 2
"insp_Name_Hop7" background = 2
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = visible
"gblT_Hop7Drop_R1" visibility = visible
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = visible	
goto "HopSwMessage"
endif
if "sw_Flow_Dry_Hop7" state == true
"sw_Flow_Dry_Hop7" state = false
"gblV_Hop7_Group_R1" value = -111
"gblS_Hop7_R1" displayname = "Hop #7- Dry Hop"
"insp_Name_Hop7" displayname = "Hop #7- Dry Hop"
vS_Hop_SW_1 = "Hop #7- Dry Hop:  "
vS_HopName_SW_1 = "gblS_Hop7_R1" value
vS_Hop_SW_Body = vS_HopBody_Dry_SW
"gblS_Hop7_R1" background = 1
"insp_Name_Hop7" background = 1
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = visible
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
//Hop8
if "sw_Flow_Mash_Hop8"  state == true
"sw_Use_Hop8_Batch" state = true
"gblS_Hop8_R1" displayname = "Hop #8- Top of Mash"
"insp_Name_Hop8" displayname = "Hop #8- Top of Mash"
"gblV_Hop8_Group_R1" value = -333
"sw_Flow_Mash_Hop8"  state = false
vS_Hop_SW_1 = "Hop #6-Top of Mash: "
vS_HopName_SW_1 = "gblS_Hop8_R1" value
vS_Hop_SW_Body = vS_HopBody_Mash_SW
"gblS_Hop8_R1" background = 3
"insp_Name_Hop8" background = 3
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = hidden
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_Whrilpool_Hop8" state == true
"sw_Use_Hop8_Batch" state = true
"gblS_Hop8_R1" displayname = "Hop #8at 154 °F Whirlpool"
"insp_Name_Hop8" displayname = "Hop #8at 154 °F Whirlpool"
"gblV_Hop8_Group_R1" value = -999
"sw_Flow_Whrilpool_Hop8"  state = false
vS_Hop_SW_1 = "Hop #8at 154 °F Whirlpool:  "
vS_HopName_SW_1 = "gblS_Hop8_R1" value
vS_Hop_SW_Body = vS_HopBody_Whirlpool_SW
"gblS_Hop8_R1" background = 3
"insp_Name_Hop8" background = 3
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = visible
"gblV_TimeHop8_Min_R1" value = 10
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop8_Batch" visibility = visible
"gblV_Hop8_Group_R1" visibility = hidden 
goto "HopSwMessage"
endif
if "sw_Flow_SOB_Hop8" state == true 
"sw_Use_Hop8_Batch" state = true
"gblS_Hop8_R1" displayname = "Hop #8- Start of Boil"
"insp_Name_Hop8" displayname = "Hop #8- Start of Boil"
"gblV_Hop8_Group_R1" value = -888
"sw_Flow_SOB_Hop8"  state = false
vS_Hop_SW_1 = "Hop #8- Start of Boil:  "
vS_HopName_SW_1 = "gblS_Hop8_R1" value
vS_Hop_SW_Body = vS_HopBody_Start_SW
"gblS_Hop8_R1" background = 2
"insp_Name_Hop8" background = 2
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = hidden
"gblV_TimeHop8_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = hidden
goto "HopSwMessage"
endif
if "sw_Flow_1st_Wort_Hop8" state == true
"sw_Use_Hop8_Batch" state = true
"gblS_Hop8_R1" displayname = "Hop #8- 1st WORT"
"insp_Name_Hop8" displayname = "Hop #8- 1st WORT"
"gblV_Hop8_Group_R1" value = -444
"sw_Flow_1st_Wort_Hop8"  state = false
vS_Hop_SW_1 = "Hop #8- 1st WORT:  "
vS_HopName_SW_1 = "gblS_Hop8_R1" value
vS_Hop_SW_Body = vS_HopBody_1st_SW
"gblS_Hop8_R1" background = 2
"insp_Name_Hop8" background = 2
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = hidden
"gblV_TimeHop8_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = hidden
goto "HopSwMessage"	
endif
if "sw_Flow_Boil_Hop8" state ==  true
"gblV_Hop8_Group_R1" value = 919
"sw_Flow_Boil_Hop8" state = false
"gblS_Hop8_R1" displayname = "Hop #8- Boiling"
"insp_Name_Hop8" displayname = "Hop #8- Boiling"
vS_Hop_SW_1 = "Hop #8- Boiling:  "
vS_HopName_SW_1 = "gblS_Hop8_R1" value
vS_Hop_SW_Body = vS_HopBody_Boil_SW
"gblS_Hop8_R1" background = 2
"insp_Name_Hop8" background = 2
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = visible
"gblT_Hop8Drop_R1" visibility = visible
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = visible	
goto "HopSwMessage"
endif
if "sw_Flow_Dry_Hop8" state == true
"sw_Flow_Dry_Hop8" state = false
"gblV_Hop8_Group_R1" value = -111
"gblS_Hop8_R1" displayname = "Hop #8- Dry Hop"
"insp_Name_Hop8" displayname = "Hop #8- Dry Hop"
vS_Hop_SW_1 = "Hop #8- Dry Hop:  "
vS_HopName_SW_1 = "gblS_Hop8_R1" value
vS_Hop_SW_Body = vS_HopBody_Dry_SW
"gblS_Hop8_R1" background = 1
"insp_Name_Hop8" background = 1
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = visible
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = hidden
goto "HopSwMessage"
endif


goto "EnderSwitch"
[HopSwMessage]
"gblVStartBrew" value = 99
show workspace "Batch1 Hops"
"gblS_Hop_Screen_Txt" displayname = "Hop Switch"
"gblS_Hop_Screen_Txt" background = 2
vS_Hop_SW_Msg = vS_Hop_SW_1 + vS_HopName_SW_1
vS_Hop_SW_Msg = vS_Hop_SW_Msg + vS_Hop_SW_Body
vS_Hop_SW_Msg = vS_Hop_SW_Msg  + vS_HopAdvance_SW
"gblS_Hop_Screen_Txt" value = vS_Hop_SW_Msg
"tm_Delay_W1" type = countdown
"tm_Delay_W1" value = 00:01:00
start "tm_Delay_W1"
"sw_Advance_Hop_Delay" visibility = visible
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" visibility = visible
[LoopHopMsg]
if "tm_Delay_W1" value  <= 00:00:00
stop "tm_Delay_W1"
"sw_Advance_Hop_Delay" visibility = hidden
"gblS_Hop_Screen_Txt" visibility = hidden
"tm_Delay_W1" visibility = hidden
goto "EnderSwitch"
endif
goto "LoopHopMsg"
[EnderSwitch]
"sw_Advance_HopsCalc" visibility = visible
"insp_Pix_ArrowHopSwitch_R1" visibility = visible
"sw_Running_Script_C" state  = false
if vB_Testing == true
"gblS_Inter_Script" value = "ended: hops_scrHopSwitches"
sleep 4001
endif
clear
stop "hops_scrHopSwitches"
```

## 136. hops_scrHopsConflicts

Starts by itself: No · User can start or stop it: Yes · 869 lines

```text
//hops_scrHopsConflicts
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//10/11/2023 09:26
[Set_Testing]
"sw_Running_Script_D" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
show workspace "B1 Brewery"
"gblS_Brewery_Top_3" value = "Wait: Checking for for Hops Conflicts for Warnings and Alarms."
"gblS_swAllSwitch_Label_Text" visibility = visible 
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Top_3" background = 3
new time vT_Conflict__Group_1_10min
new time vT_Conflict__Group_1_Drop
new time vT_Conflict__Group_2_10min
new time vT_Conflict__Group_2_Drop
new time vT_Conflict__Group_3_10min
new time vT_Conflict__Group_3_Drop
new time vT_Conflict__Group_4_10min
new time vT_Conflict__Group_4_Drop
new time vT_Conflict__Group_5_10min
new time vT_Conflict__Group_5_Drop
new time vT_Conflict__Group_6_10min
new time vT_Conflict__Group_6_Drop
new time vT_Conflict__Group_7_10min
new time vT_Conflict__Group_7_Drop
new time vT_Conflict__Group_8_10min
new time vT_Conflict__Group_8_Drop
new value vV_Conflict_Group_EoB_Statusx
new value vV_One
new value vV_Two
new value vV_Three
new value vV_Conflict_Group_SOB_Status
new value vV_Conflict_Group_1_Status
new value vV_Conflict_Group_2_Status
new value vV_Conflict_Group_3_Status
new value vV_Conflict_Group_4_Status
new value vV_Conflict_Group_5_Status
new value vV_Conflict_Group_6_Status
new value vV_Conflict_Group_7_Status
new value vV_Conflict_Group_8_Status
new value vV_Conflict_Group_EoB_Status
new value vV_Conflict_Group_Rocket_Status
new value vV_Conflict_Count
vV_Conflict_Group_SOB_Status = "gblV_Group_SoB_Hops" value
vV_Conflict_Group_1_Status = "gblV_Group_1_Conflict" value
vV_Conflict_Group_2_Status = "gblV_Group_2_Conflict" value
vV_Conflict_Group_3_Status = "gblV_Group_3_Conflict" value
vV_Conflict_Group_4_Status = "gblV_Group_4_Conflict" value
vV_Conflict_Group_5_Status = "gblV_Group_5_Conflict" value
vV_Conflict_Group_6_Status = "gblV_Group_6_Conflict" value
vV_Conflict_Group_7_Status = "gblV_Group_7_Conflict" value
vV_Conflict_Group_8_Status = "gblV_Group_8_Conflict" value
vV_Conflict_Group_EoB_Status = "gblV_Group_EoB_Hops" value 
vV_Conflict_Group_Rocket_Status = "gblV_Group_Hop Rocket" value
new value vV_Conflict_TTL_Boil
new value vVGroup1_Drop
new value vVGroup1_Ten
new value vVGroup2_Drop
new value vVGroup2_Ten
new value vVGroup3_Drop
new value vVGroup3_Ten
new value vVGroup4_Drop
new value vVGroup4_Ten
new value vVGroup5_Drop
new value vVGroup5_Ten
new value vVGroup6_Drop
new value vVGroup6_Ten
new value vVGroup7_Drop
new value vVGroup7_Ten
new value vVGroup8_Drop
new value vVGroup8_Ten
vVGroup1_Drop = 0
vVGroup1_Ten = 0
vVGroup2_Drop = 0
vVGroup2_Ten = 0
vVGroup3_Drop = 0
vVGroup3_Ten = 0
vVGroup4_Drop = 0
vVGroup4_Ten = 0
vVGroup5_Drop = 0
vVGroup5_Ten = 0
vVGroup6_Drop = 0
vVGroup6_Ten = 0
vVGroup7_Drop = 0
vVGroup7_Ten = 0
vVGroup8_Drop = 0
vVGroup8_Ten = 0
vV_Conflict_TTL_Boil = "gblVBoilTime_Minutes" value
"gblT_Group_1_10m_Time_Wo1" value = -10:00:00
"gblT_Group_2_10m_Time_Wo1" value = -10:00:00
"gblT_Group_3_10m_Time_Wo1" value = -10:00:00
"gblT_Group_4_10m_Time_Wo1" value = -10:00:00
"gblT_Group_5_10m_Time_Wo1" value = -10:00:00
"gblT_Group_6_10m_Time_Wo1" value = -10:00:00
"gblT_Group_7_10m_Time_Wo1" value = -10:00:00
"gblT_Group_8_10m_Time_Wo1" value = -10:00:00
vV_Conflict_Count = 0 
"gblV_Hop_Count_999" value = vV_Conflict_Count
if vV_Conflict_Group_SOB_Status == -9999
vV_Conflict_Count += 1
"gblV_Hop_Count_999" value = vV_Conflict_Count
endif
if vV_Conflict_Group_1_Status == -9999
vV_Conflict_Count += 1
"gblV_Hop_Count_999" value = vV_Conflict_Count
endif
if vV_Conflict_Group_2_Status == -9999
vV_Conflict_Count += 1
"gblV_Hop_Count_999" value = vV_Conflict_Count
endif
if vV_Conflict_Group_3_Status == -9999
vV_Conflict_Count += 1
"gblV_Hop_Count_999" value = vV_Conflict_Count
endif
if vV_Conflict_Group_4_Status == -9999
vV_Conflict_Count += 1
"gblV_Hop_Count_999" value = vV_Conflict_Count
endif
if vV_Conflict_Group_6_Status == -9999
vV_Conflict_Count += 1
"gblV_Hop_Count_999" value = vV_Conflict_Count
endif
if vV_Conflict_Group_7_Status == -9999
vV_Conflict_Count += 1
"gblV_Hop_Count_999" value = vV_Conflict_Count
endif
if vV_Conflict_Group_8_Status == -9999
vV_Conflict_Count += 1
"gblV_Hop_Count_999" value = vV_Conflict_Count
endif
if vV_Conflict_Group_EoB_Status == -9999
vV_Conflict_Count += 1
"gblV_Hop_Count_999" value = vV_Conflict_Count
endif
if vV_Conflict_Group_Rocket_Status == -9999
vV_Conflict_Count += 1
"gblV_Hop_Count_999" value = vV_Conflict_Count
endif


// Testing Only
new time vT_Conflict__Test_10
new time vT_Conflict__Test_Drop
new value vV_Test
vV_Test = 1
// Testing End
if vV_Conflict_Count == 11
goto "HopChecker"
else
goto "HopsGood"
endif
[HopChecker]
//Message Here
"gblS_Brewery_Top_3" value = "Have you set the Hops Correctly?   There appears to be little Hop Action.  Door # 1 restart the Process and you can recheck the Hops! Door #2 just advances as the Hops are good (like a Blackard's Black that just has Start of Boil Hops)."
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"gblS_Brewery_Top_3" background = 1
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" background = 1
"gblSReportLabel_B1" background = 1
"gblSReportLabel_B1" value = " Hop Data Good?"
"gblVReport_B1" value = 0
"gblVReport_B1" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" precision = 0
[innerLoopChoiceHopGood]
if "gblVReport_B1" value == 1
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" precision = 1
"gblVReport_B1" value = 0
goto "EnderHopsRedo"
endif
if "gblVReport_B1" value == 2
"gblS_Brewery_Top_2" visibility = hidden
"gblVReport_B1" value = 0
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" precision = 1
"gblS_Brewery_Top_3" visibility = hidden
goto "HopsGood"
endif
//Switch
//Red Green Blue
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text" value = "Wait Will Auto Advance!"
"insp_Pix_ArrowAllSwitch_B1"  visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden 
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
//........................................
//........................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
//........................................
if "gblVReport_B1" value  >= 3
"gblVReport_B1" background = 3
"gblSReportLabel_B1" background = 3
"gblVReport_B1" value = 0
"gblS_Brewery_Top_3" value = "Only 1 or 2!  Have you set the Hops Correctly?   There appears to be little Hop Action.  Door # 1 restart the Process and you can recheck the Hops! Door #2 just advances as the Hops are good (like a Blackard's Black that just has Start of Boil Hops)."
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
wait "sw_Running_Short_Delay_Time" state == false
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
endif
if "gblVReport_B1" value  <= -1
"gblVReport_B1" background = 3
"gblSReportLabel_B1" background = 3
"gblVReport_B1" value = 0
"gblS_Brewery_Top_3" value = "Only 1 or 2!  Have you set the Hops Correctly?   There appears to be little Hop Action.  Door # 1 restart the Process and you can recheck the Hops! Door #2 just advances as the Hops are good (like a Blackard's Black that just has Start of Boil Hops)."
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = visible
wait "sw_Running_Short_Delay_Time" state == false
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Top_2" visibility = visible
endif
goto "innerLoopChoiceHopGood"
//End of Loop
[EnderHopsRedo]
show workspace "B1 Brewery"
"gblVReport_B1" value = 0
"gblVReport_B1" precision = 1
"gblS_swAllSwitch_Label_Text" value = "Hops Good"
"gblS_Brewery_Top_3" value = "Hops set as Good.  Wait!  Will Auto Advance."
//BackGrounds
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
//Visibility
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
//........................................
show workspace "B1 Brewery"
//........................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
goto "Ender_hops_scrHopsConflicts"
[HopsGood]
//Set Hop Grouping from Hop Order on BATCH Workspace
[Hop1Grouping]
if "gblV_Hop1_Group_R1"  value == 8
vVGroup8_Drop = "gblV_TimeHop1_Min_R1" value
vVGroup8_Ten = vVGroup8_Drop + 10
"gblT_Group_8_10m_Time_Wo1"  value = "gblT_Hop1_10m_Time_R1" value
endif
if "gblV_Hop1_Group_R1"  value == 7
vVGroup7_Drop = "gblV_TimeHop1_Min_R1" value
vVGroup7_Ten = vVGroup7_Drop + 10
"gblT_Group_7_10m_Time_Wo1"  value = "gblT_Hop1_10m_Time_R1" value
endif
if "gblV_Hop1_Group_R1"  value == 6
vVGroup6_Drop = "gblV_TimeHop1_Min_R1" value
vVGroup6_Ten = vVGroup6_Drop + 10
"gblT_Group_6_10m_Time_Wo1"  value = "gblT_Hop1_10m_Time_R1" value
endif
if "gblV_Hop1_Group_R1"  value == 5
vVGroup5_Drop = "gblV_TimeHop1_Min_R1" value
vVGroup5_Ten = vVGroup5_Drop + 10
"gblT_Group_5_10m_Time_Wo1"  value = "gblT_Hop1_10m_Time_R1" value
endif
if "gblV_Hop1_Group_R1"  value == 4
vVGroup4_Drop = "gblV_TimeHop1_Min_R1" value
vVGroup4_Ten = vVGroup4_Drop + 10
"gblT_Group_4_10m_Time_Wo1"  value = "gblT_Hop1_10m_Time_R1" value
endif
if "gblV_Hop1_Group_R1"  value == 3
vVGroup3_Drop = "gblV_TimeHop1_Min_R1" value
vVGroup3_Ten = vVGroup3_Drop + 10
"gblT_Group_3_10m_Time_Wo1"  value = "gblT_Hop1_10m_Time_R1" value
endif
if "gblV_Hop1_Group_R1"  value == 2
vVGroup2_Drop = "gblV_TimeHop1_Min_R1" value
vVGroup2_Ten = vVGroup2_Drop + 10
"gblT_Group_2_10m_Time_Wo1"  value = "gblT_Hop1_10m_Time_R1" value
endif
if "gblV_Hop1_Group_R1"  value == 1
vVGroup1_Drop = "gblV_TimeHop1_Min_R1" value
vVGroup1_Ten = vVGroup1_Drop + 10
"gblT_Group_1_10m_Time_Wo1"  value = "gblT_Hop1_10m_Time_R1" value
endif
[Hop2Grouping]
if "gblV_Hop2_Group_R1"  value == 8
vVGroup8_Drop = "gblV_TimeHop2_Min_R1" value
vVGroup8_Ten = vVGroup8_Drop + 10
"gblT_Group_8_10m_Time_Wo1"  value = "gblT_Hop2_10m_Time_R1" value
endif
if "gblV_Hop2_Group_R1"  value == 7
vVGroup7_Drop = "gblV_TimeHop2_Min_R1" value
vVGroup7_Ten = vVGroup7_Drop + 10
"gblT_Group_7_10m_Time_Wo1"  value = "gblT_Hop2_10m_Time_R1" value
endif
if "gblV_Hop2_Group_R1"  value == 6
vVGroup6_Drop = "gblV_TimeHop2_Min_R1" value
vVGroup6_Ten = vVGroup6_Drop + 10
"gblT_Group_6_10m_Time_Wo1"  value = "gblT_Hop2_10m_Time_R1" value
endif
if "gblV_Hop2_Group_R1"  value == 5
vVGroup5_Drop = "gblV_TimeHop2_Min_R1" value
vVGroup5_Ten = vVGroup5_Drop + 10
"gblT_Group_5_10m_Time_Wo1"  value = "gblT_Hop2_10m_Time_R1" value
endif
if "gblV_Hop2_Group_R1"  value == 4
vVGroup4_Drop = "gblV_TimeHop2_Min_R1" value
vVGroup4_Ten = vVGroup4_Drop + 10
"gblT_Group_4_10m_Time_Wo1"  value = "gblT_Hop2_10m_Time_R1" value
endif
if "gblV_Hop2_Group_R1"  value == 3
vVGroup3_Drop = "gblV_TimeHop2_Min_R1" value
vVGroup3_Ten = vVGroup3_Drop + 10
"gblT_Group_3_10m_Time_Wo1"  value = "gblT_Hop2_10m_Time_R1" value
endif
if "gblV_Hop2_Group_R1"  value == 2
vVGroup2_Drop = "gblV_TimeHop2_Min_R1" value
vVGroup2_Ten = vVGroup2_Drop + 10
"gblT_Group_2_10m_Time_Wo1"  value = "gblT_Hop2_10m_Time_R1" value
endif
if "gblV_Hop2_Group_R1"  value == 1
vVGroup1_Drop = "gblV_TimeHop2_Min_R1" value
vVGroup1_Ten = vVGroup1_Drop + 10
"gblT_Group_1_10m_Time_Wo1"  value = "gblT_Hop2_10m_Time_R1" value
endif
[Hop3Grouping]
if "gblV_Hop3_Group_R1"  value == 8
vVGroup8_Drop = "gblV_TimeHop3_Min_R1" value
vVGroup8_Ten = vVGroup8_Drop + 10
"gblT_Group_8_10m_Time_Wo1"  value = "gblT_Hop3_10m_Time_R1" value
endif
if "gblV_Hop3_Group_R1"  value == 7
vVGroup7_Drop = "gblV_TimeHop3_Min_R1" value
vVGroup7_Ten = vVGroup7_Drop + 10
"gblT_Group_7_10m_Time_Wo1"  value = "gblT_Hop3_10m_Time_R1" value
endif
if "gblV_Hop3_Group_R1"  value == 6
vVGroup6_Drop = "gblV_TimeHop3_Min_R1" value
vVGroup6_Ten = vVGroup6_Drop + 10
"gblT_Group_6_10m_Time_Wo1"  value = "gblT_Hop3_10m_Time_R1" value
endif
if "gblV_Hop3_Group_R1"  value == 5
vVGroup5_Drop = "gblV_TimeHop3_Min_R1" value
vVGroup5_Ten = vVGroup5_Drop + 10
"gblT_Group_5_10m_Time_Wo1"  value = "gblT_Hop3_10m_Time_R1" value
endif
if "gblV_Hop3_Group_R1"  value == 4
vVGroup4_Drop = "gblV_TimeHop3_Min_R1" value
vVGroup4_Ten = vVGroup4_Drop + 10
"gblT_Group_4_10m_Time_Wo1"  value = "gblT_Hop3_10m_Time_R1" value
endif
if "gblV_Hop3_Group_R1"  value == 3
vVGroup3_Drop = "gblV_TimeHop3_Min_R1" value
vVGroup3_Ten = vVGroup3_Drop + 10
"gblT_Group_3_10m_Time_Wo1"  value = "gblT_Hop3_10m_Time_R1" value
endif
if "gblV_Hop3_Group_R1"  value == 2
vVGroup2_Drop = "gblV_TimeHop3_Min_R1" value
vVGroup2_Ten = vVGroup2_Drop + 10
"gblT_Group_2_10m_Time_Wo1"  value = "gblT_Hop3_10m_Time_R1" value
endif
if "gblV_Hop3_Group_R1"  value == 1
vVGroup1_Drop = "gblV_TimeHop3_Min_R1" value
vVGroup1_Ten = vVGroup1_Drop + 10
"gblT_Group_1_10m_Time_Wo1"  value = "gblT_Hop3_10m_Time_R1" value
endif
[Hop4Grouping]
if "gblV_Hop4_Group_R1"  value == 8
vVGroup8_Drop = "gblV_TimeHop4_Min_R1" value
vVGroup8_Ten = vVGroup8_Drop + 10
"gblT_Group_8_10m_Time_Wo1"  value = "gblT_Hop4_10m_Time_R1" value
endif
if "gblV_Hop4_Group_R1"  value == 7
vVGroup7_Drop = "gblV_TimeHop4_Min_R1" value
vVGroup7_Ten = vVGroup7_Drop + 10
"gblT_Group_7_10m_Time_Wo1"  value = "gblT_Hop4_10m_Time_R1" value
endif
if "gblV_Hop4_Group_R1"  value == 6
vVGroup6_Drop = "gblV_TimeHop4_Min_R1" value
vVGroup6_Ten = vVGroup6_Drop + 10
"gblT_Group_6_10m_Time_Wo1"  value = "gblT_Hop4_10m_Time_R1" value
endif
if "gblV_Hop4_Group_R1"  value == 5
vVGroup5_Drop = "gblV_TimeHop4_Min_R1" value
vVGroup5_Ten = vVGroup5_Drop + 10
"gblT_Group_5_10m_Time_Wo1"  value = "gblT_Hop4_10m_Time_R1" value
endif
if "gblV_Hop4_Group_R1"  value == 4
vVGroup4_Drop = "gblV_TimeHop4_Min_R1" value
vVGroup4_Ten = vVGroup4_Drop + 10
"gblT_Group_4_10m_Time_Wo1"  value = "gblT_Hop4_10m_Time_R1" value
endif
if "gblV_Hop4_Group_R1"  value == 3
vVGroup3_Drop = "gblV_TimeHop4_Min_R1" value
vVGroup3_Ten = vVGroup3_Drop + 10
"gblT_Group_3_10m_Time_Wo1"  value = "gblT_Hop4_10m_Time_R1" value
endif
if "gblV_Hop4_Group_R1"  value == 2
vVGroup2_Drop = "gblV_TimeHop4_Min_R1" value
vVGroup2_Ten = vVGroup2_Drop + 10
"gblT_Group_2_10m_Time_Wo1"  value = "gblT_Hop4_10m_Time_R1" value
endif
if "gblV_Hop4_Group_R1"  value == 1
vVGroup1_Drop = "gblV_TimeHop4_Min_R1" value
vVGroup1_Ten = vVGroup1_Drop + 10
"gblT_Group_1_10m_Time_Wo1"  value = "gblT_Hop4_10m_Time_R1" value
endif
[Hop5Grouping]
if "gblV_Hop5_Group_R1"  value == 8
vVGroup8_Drop = "gblV_TimeHop5_Min_R1" value
vVGroup8_Ten = vVGroup8_Drop + 10
"gblT_Group_8_10m_Time_Wo1"  value = "gblT_Hop5_10m_Time_R1" value
endif
if "gblV_Hop5_Group_R1"  value == 7
vVGroup7_Drop = "gblV_TimeHop5_Min_R1" value
vVGroup7_Ten = vVGroup7_Drop + 10
"gblT_Group_7_10m_Time_Wo1"  value = "gblT_Hop5_10m_Time_R1" value
endif
if "gblV_Hop5_Group_R1"  value == 6
vVGroup6_Drop = "gblV_TimeHop5_Min_R1" value
vVGroup6_Ten = vVGroup6_Drop + 10
"gblT_Group_6_10m_Time_Wo1"  value = "gblT_Hop5_10m_Time_R1" value
endif
if "gblV_Hop5_Group_R1"  value == 5
vVGroup5_Drop = "gblV_TimeHop5_Min_R1" value
vVGroup5_Ten = vVGroup5_Drop + 10
"gblT_Group_5_10m_Time_Wo1"  value = "gblT_Hop5_10m_Time_R1" value
endif
if "gblV_Hop5_Group_R1"  value == 4
vVGroup4_Drop = "gblV_TimeHop5_Min_R1" value
vVGroup4_Ten = vVGroup4_Drop + 10
"gblT_Group_4_10m_Time_Wo1"  value = "gblT_Hop5_10m_Time_R1" value
endif
if "gblV_Hop5_Group_R1"  value == 3
vVGroup3_Drop = "gblV_TimeHop5_Min_R1" value
vVGroup3_Ten = vVGroup3_Drop + 10
"gblT_Group_3_10m_Time_Wo1"  value = "gblT_Hop5_10m_Time_R1" value
endif
if "gblV_Hop5_Group_R1"  value == 2
vVGroup2_Drop = "gblV_TimeHop5_Min_R1" value
vVGroup2_Ten = vVGroup2_Drop + 10
"gblT_Group_2_10m_Time_Wo1"  value = "gblT_Hop5_10m_Time_R1" value
endif
if "gblV_Hop5_Group_R1"  value == 1
vVGroup1_Drop = "gblV_TimeHop5_Min_R1" value
vVGroup1_Ten = vVGroup1_Drop + 10
"gblT_Group_1_10m_Time_Wo1"  value = "gblT_Hop5_10m_Time_R1" value
endif
[Hop6Grouping]
if "gblV_Hop6_Group_R1"  value == 8
vVGroup8_Drop = "gblV_TimeHop6_Min_R1" value
vVGroup8_Ten = vVGroup8_Drop + 10
"gblT_Group_8_10m_Time_Wo1"  value = "gblT_Hop6_10m_Time_R1" value
endif
if "gblV_Hop6_Group_R1"  value == 7
vVGroup7_Drop = "gblV_TimeHop6_Min_R1" value
vVGroup7_Ten = vVGroup7_Drop + 10
"gblT_Group_7_10m_Time_Wo1"  value = "gblT_Hop6_10m_Time_R1" value
endif
if "gblV_Hop6_Group_R1"  value == 6
vVGroup6_Drop = "gblV_TimeHop6_Min_R1" value
vVGroup6_Ten = vVGroup6_Drop + 10
"gblT_Group_6_10m_Time_Wo1"  value = "gblT_Hop6_10m_Time_R1" value
endif
if "gblV_Hop6_Group_R1"  value == 5
vVGroup5_Drop = "gblV_TimeHop6_Min_R1" value
vVGroup5_Ten = vVGroup5_Drop + 10
"gblT_Group_5_10m_Time_Wo1"  value = "gblT_Hop6_10m_Time_R1" value
endif
if "gblV_Hop6_Group_R1"  value == 4
vVGroup4_Drop = "gblV_TimeHop6_Min_R1" value
vVGroup4_Ten = vVGroup4_Drop + 10
"gblT_Group_4_10m_Time_Wo1"  value = "gblT_Hop6_10m_Time_R1" value
endif
if "gblV_Hop6_Group_R1"  value == 3
vVGroup3_Drop = "gblV_TimeHop6_Min_R1" value
vVGroup3_Ten = vVGroup3_Drop + 10
"gblT_Group_3_10m_Time_Wo1"  value = "gblT_Hop6_10m_Time_R1" value
endif
if "gblV_Hop6_Group_R1"  value == 2
vVGroup2_Drop = "gblV_TimeHop6_Min_R1" value
vVGroup2_Ten = vVGroup2_Drop + 10
"gblT_Group_2_10m_Time_Wo1"  value = "gblT_Hop6_10m_Time_R1" value
endif
if "gblV_Hop6_Group_R1"  value == 1
vVGroup1_Drop = "gblV_TimeHop6_Min_R1" value
vVGroup1_Ten = vVGroup1_Drop + 10
"gblT_Group_1_10m_Time_Wo1"  value = "gblT_Hop6_10m_Time_R1" value
endif
[Hop7Grouping]
if "gblV_Hop7_Group_R1"  value == 8
vVGroup8_Drop = "gblV_TimeHop7_Min_R1" value
vVGroup8_Ten = vVGroup8_Drop + 10
"gblT_Group_8_10m_Time_Wo1"  value = "gblT_Hop7_10m_Time_R1" value
endif
if "gblV_Hop7_Group_R1"  value == 7
vVGroup7_Drop = "gblV_TimeHop7_Min_R1" value
vVGroup7_Ten = vVGroup7_Drop + 10
"gblT_Group_7_10m_Time_Wo1"  value = "gblT_Hop7_10m_Time_R1" value
endif
if "gblV_Hop7_Group_R1"  value == 6
vVGroup6_Drop = "gblV_TimeHop7_Min_R1" value
vVGroup6_Ten = vVGroup6_Drop + 10
"gblT_Group_6_10m_Time_Wo1"  value = "gblT_Hop7_10m_Time_R1" value
endif
if "gblV_Hop7_Group_R1"  value == 5
vVGroup5_Drop = "gblV_TimeHop7_Min_R1" value
vVGroup5_Ten = vVGroup5_Drop + 10
"gblT_Group_5_10m_Time_Wo1"  value = "gblT_Hop7_10m_Time_R1" value
endif
if "gblV_Hop7_Group_R1"  value == 4
vVGroup4_Drop = "gblV_TimeHop7_Min_R1" value
vVGroup4_Ten = vVGroup4_Drop + 10
"gblT_Group_4_10m_Time_Wo1"  value = "gblT_Hop7_10m_Time_R1" value
endif
if "gblV_Hop7_Group_R1"  value == 3
vVGroup3_Drop = "gblV_TimeHop7_Min_R1" value
vVGroup3_Ten = vVGroup3_Drop + 10
"gblT_Group_3_10m_Time_Wo1"  value = "gblT_Hop7_10m_Time_R1" value
endif
if "gblV_Hop7_Group_R1"  value == 2
vVGroup2_Drop = "gblV_TimeHop7_Min_R1" value
vVGroup2_Ten = vVGroup2_Drop + 10
"gblT_Group_2_10m_Time_Wo1"  value = "gblT_Hop7_10m_Time_R1" value
endif
if "gblV_Hop7_Group_R1"  value == 1
vVGroup1_Drop = "gblV_TimeHop7_Min_R1" value
vVGroup1_Ten = vVGroup1_Drop + 10
"gblT_Group_1_10m_Time_Wo1"  value = "gblT_Hop7_10m_Time_R1" value
endif
[Hop8Grouping]
if "gblV_Hop8_Group_R1"  value == 8
vVGroup8_Drop = "gblV_TimeHop8_Min_R1" value
vVGroup8_Ten = vVGroup8_Drop + 10
"gblT_Group_8_10m_Time_Wo1"  value = "gblT_Hop8_10m_Time_R1" value
endif
if "gblV_Hop8_Group_R1"  value == 7
vVGroup7_Drop = "gblV_TimeHop8_Min_R1" value
vVGroup7_Ten = vVGroup7_Drop + 10
"gblT_Group_7_10m_Time_Wo1"  value = "gblT_Hop8_10m_Time_R1" value
endif
if "gblV_Hop8_Group_R1"  value == 6
vVGroup6_Drop = "gblV_TimeHop8_Min_R1" value
vVGroup6_Ten = vVGroup6_Drop + 10
"gblT_Group_6_10m_Time_Wo1"  value = "gblT_Hop8_10m_Time_R1" value
endif
if "gblV_Hop8_Group_R1"  value == 5
vVGroup5_Drop = "gblV_TimeHop8_Min_R1" value
vVGroup5_Ten = vVGroup5_Drop + 10
"gblT_Group_5_10m_Time_Wo1"  value = "gblT_Hop8_10m_Time_R1" value
endif
if "gblV_Hop8_Group_R1"  value == 4
vVGroup4_Drop = "gblV_TimeHop8_Min_R1" value
vVGroup4_Ten = vVGroup4_Drop + 10
"gblT_Group_4_10m_Time_Wo1"  value = "gblT_Hop8_10m_Time_R1" value
endif
if "gblV_Hop8_Group_R1"  value == 3
vVGroup3_Drop = "gblV_TimeHop8_Min_R1" value
vVGroup3_Ten = vVGroup3_Drop + 10
"gblT_Group_3_10m_Time_Wo1"  value = "gblT_Hop8_10m_Time_R1" value
endif
if "gblV_Hop8_Group_R1"  value == 2
vVGroup2_Drop = "gblV_TimeHop8_Min_R1" value
vVGroup2_Ten = vVGroup2_Drop + 10
"gblT_Group_2_10m_Time_Wo1"  value = "gblT_Hop8_10m_Time_R1" value
endif
if "gblV_Hop8_Group_R1"  value == 1
vVGroup1_Drop = "gblV_TimeHop8_Min_R1" value
vVGroup1_Ten = vVGroup1_Drop + 10
"gblT_Group_1_10m_Time_Wo1"  value = "gblT_Hop8_10m_Time_R1" value
endif
// end of Hop Grouping 
if "gblT_Group_1_10m_Time_Wo1"  value == 10:00:00
"gblV_Group_2_Conflict" value = -9999
endif
if "gblT_Group_2_10m_Time_Wo1"  value == 10:00:00
"gblV_Group_2_Conflict" value = -9999
endif
if "gblT_Group_3_10m_Time_Wo1"  value == 10:00:00
"gblV_Group_3_Conflict"  value = -9999
endif
if "gblT_Group_4_10m_Time_Wo1"  value == 10:00:00
"gblV_Group_4_Conflict"  value = -9999
endif
if "gblT_Group_5_10m_Time_Wo1"  value == 10:00:00
"gblV_Group_5_Conflict" value = -9999
endif
if "gblT_Group_6_10m_Time_Wo1"  value == 10:00:00
"gblV_Group_6_Conflict"  value = -9999
endif
if "gblT_Group_7_10m_Time_Wo1"  value == 10:00:00
"gblV_Group_7_Conflict" value = -9999
endif
if "gblT_Group_8_10m_Time_Wo1"  value == 10:00:00
"gblV_Group_8_Conflict" value = -9999
endif
//Next Hop 10 Min vs  Previous Hop Drop: Conflict or Not
[Conflict1Check]
if vVGroup1_Drop == 0
goto "Conflict1CheckEnd"
else
if vVGroup1_Ten >= vV_Conflict_TTL_Boil
"gblV_Group_1_Conflict" value = 1
goto "Conflict1CheckEnd"
endif
if vVGroup2_Ten == vVGroup1_Drop
"gblV_Group_1_Conflict" value = 2
goto "Conflict1CheckEnd"
endif
if vVGroup2_Ten > vVGroup1_Drop
"gblV_Group_1_Conflict" value = 8
endif
endif
[Conflict1CheckEnd]
if vVGroup2_Drop == 0
goto "Conflict2CheckEnd"
else
if vVGroup2_Ten >= vV_Conflict_TTL_Boil
"gblV_Group_2_Conflict" value = 1
goto "Conflict2CheckEnd"
endif
if vVGroup3_Ten == vVGroup2_Drop
"gblV_Group_2_Conflict" value = 2
goto "Conflict2CheckEnd"
endif
endif
if vVGroup3_Ten > vVGroup2_Drop
"gblV_Group_2_Conflict" value = 8
endif
[Conflict2CheckEnd]
if vVGroup4_Drop == 0
goto "Conflict3CheckEnd"
else
if vVGroup3_Ten >= vV_Conflict_TTL_Boil
"gblV_Group_3_Conflict" value = 1
endif
if vVGroup4_Ten == vVGroup3_Drop
"gblV_Group_3_Conflict" value = 2
goto "Conflict3CheckEnd"
endif
endif
if vVGroup4_Ten > vVGroup3_Drop
"gblV_Group_3_Conflict" value = 8
endif
[Conflict3CheckEnd]
if vVGroup4_Drop == 0
goto "Conflict4CheckEnd"
else
if vVGroup4_Ten >= vV_Conflict_TTL_Boil
"gblV_Group_4_Conflict" value = 1
endif
if vVGroup5_Ten == vVGroup4_Drop
"gblV_Group_4_Conflict" value = 2
goto "Conflict4CheckEnd"
endif
endif
if vVGroup5_Ten > vVGroup4_Drop
"gblV_Group_4_Conflict" value = 8
endif
[Conflict4CheckEnd]
if vVGroup5_Drop == 0
goto "Conflict5CheckEnd"
else
if vVGroup6_Ten == vVGroup5_Drop
"gblV_Group_5_Conflict" value = 2
goto "Conflict5CheckEnd"
endif
endif
if vVGroup6_Ten > vVGroup5_Drop
"gblV_Group_5_Conflict" value = 8
endif
if vVGroup5_Ten >= vV_Conflict_TTL_Boil
"gblV_Group_5_Conflict" value = 1
endif
[Conflict5CheckEnd]
if vVGroup6_Drop == 0
goto "Conflict6CheckEnd"
else
if vVGroup6_Ten >= vV_Conflict_TTL_Boil
"gblV_Group_6_Conflict" value = 1
endif
if vVGroup7_Ten == vVGroup6_Drop
"gblV_Group_7_Conflict" value = 2
goto "Conflict6CheckEnd"
endif
endif
if vVGroup7_Ten > vVGroup6_Drop
"gblV_Group_7_Conflict" value = 8
endif
if vT_Conflict__Group_8_10min > 00:15:00
"gblV_Group_8_Conflict" value = 8
endif

[Conflict6CheckEnd]
if vVGroup7_Drop == 0
goto "Conflict7CheckEnd"
else
if vVGroup7_Ten >= vV_Conflict_TTL_Boil
"gblV_Group_7_Conflict" value = 1
endif
if vVGroup8_Ten == vVGroup7_Drop
"gblV_Group_7_Conflict" value = 2
goto "Conflict7CheckEnd"
endif
endif
if vVGroup8_Ten > vVGroup7_Drop
"gblV_Group_7_Conflict" value = 8
endif
[Conflict7CheckEnd]
if vVGroup8_Drop == 0
goto "Conflict8CheckEnd"
else
if vVGroup8_Ten >= vV_Conflict_TTL_Boil
"gblV_Group_8_Conflict" value = 1
else 
"gblV_Group_8_Conflict" value = 10
endif
endif
[Conflict8CheckEnd]

// 15 Min
if vVGroup1_Drop == 15
"gblV_Group_1_Conflict" value = 4
endif
if vVGroup1_Ten == 15
"gblV_Group_1_Conflict" value = -777
endif
if vVGroup2_Drop == 15
"gblV_Group_2_Conflict" value = 4
endif
if vVGroup2_Ten == 15
"gblV_Group_2_Conflict" value = -777
endif
if vVGroup3_Drop == 15
"gblV_Group_3_Conflict" value = 4
endif
if vVGroup3_Ten == 15
"gblV_Group_3_Conflict" value = -777
endif
if vVGroup4_Drop == 15
"gblV_Group_4_Conflict" value = 4
endif
if vVGroup4_Ten == 15
"gblV_Group_4_Conflict" value = -777
endif
if vVGroup5_Drop == 15
"gblV_Group_5_Conflict" value = 4
endif
if vVGroup5_Ten == 15
"gblV_Group_5_Conflict" value = -777
endif
if vVGroup6_Drop == 15
"gblV_Group_6_Conflict" value = 4
endif
if vVGroup6_Ten == 15
"gblV_Group_6_Conflict" value = -777
endif
if vVGroup7_Drop == 15
"gblV_Group_7_Conflict" value = 4
endif
if vVGroup7_Ten == 15
"gblV_Group_7_Conflict" value = -777
endif
if vVGroup8_Drop == 15
"gblV_Group_8_Conflict" value = 4
endif
if vVGroup8_Ten == 15
"gblV_Group_8_Conflict" value = -777
endif
// Gap Hops
//Gap
if "gblV_Hop1_Group_R1"  value > 4
if vVGroup1_Drop < 15
"gblV_Group_1_Conflict" value = 6
endif
endif
if "gblV_Hop2_Group_R1"  value > 4
if vVGroup2_Drop < 15
"gblV_Group_2_Conflict" value = 6
endif
endif
if "gblV_Hop3_Group_R1"  value > 4
if vVGroup3_Drop < 15
"gblV_Group_3_Conflict" value = 6
endif
endif
if "gblV_Hop4_Group_R1"  value > 4
if vVGroup4_Drop < 15
"gblV_Group_4_Conflict" value = 6
endif
endif
if "gblV_Hop5_Group_R1"  value > 4
if vVGroup5_Drop < 15
"gblV_Group_5_Conflict" value = 6
endif
endif
if "gblV_Hop6_Group_R1"  value > 4
if vVGroup6_Drop < 15
"gblV_Group_6_Conflict" value = 6
endif
endif
if "gblV_Hop7_Group_R1"  value > 4
if vVGroup7_Drop < 15
"gblV_Group_7_Conflict" value = 6
endif
endif
if "gblV_Hop8_Group_R1"  value > 4
if vVGroup8_Drop < 15
"gblV_Group_8_Conflict" value = 6
endif
endif
// 10 Min
if vVGroup1_Drop == 10
"gblV_Group_1_Conflict" value = 7
endif
if vVGroup2_Drop == 10
"gblV_Group_2_Conflict" value = 7
endif
if vVGroup3_Drop == 10
"gblV_Group_3_Conflict" value = 7
endif
if vVGroup4_Drop == 10
"gblV_Group_4_Conflict" value = 7
endif
if vVGroup5_Drop == 10
"gblV_Group_5_Conflict" value = 7
endif
if vVGroup6_Drop == 10
"gblV_Group_6_Conflict" value = 7
endif
if vVGroup7_Drop == 10
"gblV_Group_7_Conflict" value = 7
endif
if vVGroup8_Drop == 10
"gblV_Group_8_Conflict" value = 7
endif
// Both Flame Out and Hop Rocket
if vV_Conflict_Group_EoB_Status == 10
if vV_Conflict_Group_Rocket_Status == 10
"gblV_Group_EoB_Hops" value = 16
"gblV_Group_Hop Rocket" value = 16
endif
endif
[Ender_hops_scrHopsConflicts]
"gblVScriptFlow" value =  22
"gblS_Hop_Screen_Txt" visibility = hidden
if vB_Testing == true
"gblS_Inter_Script" value = "ended: hops_scrHopsConflicts"
sleep 4001
endif
clear
show workspace "Batch1 Hops"
"sw_Running_Script_D" state  = false
stop "hops_scrHopsConflicts"
```

## 137. batch_1_IBUs

Starts by itself: No · User can start or stop it: Yes · 574 lines

```text
//batch_1_IBUs
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Called from @ 57 in scrBrew0_2_2_All_Hop_Scripts_Calculation
//Calculate IBU
//03/27/2023:08:25
//Modified 02/27/2024:09:25
// Lots of Help with Orginal Code from @RiverCityBrewing
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vV_Hop1F
new value vV_Hop2F
new value vV_Hop3F
new value vV_Hop4F
new value vV_Hop5F
new value vV_Hop6F
new value vV_Hop7F
new value vV_Hop8F
new value vV_Hop1G
new value vV_Hop2G
new value vV_Hop3G
new value vV_Hop4G
new value vV_Hop5G
new value vV_Hop6G
new value vV_Hop7G
new value vV_Hop8G
new value vV_IBUHop1
new value vV_IBUHop2
new value vV_IBUHop3
new value vV_IBUHop4
new value vV_IBUHop5
new value vV_IBUHop6
new value vV_IBUHop7
new value vV_IBUHop8
new value vV_Lenght
vV_Lenght = "gblVBrewLenght_R1" Value
vV_Hop1G = "gblV_Hop1_Group_R1" value
vV_Hop2G = "gblV_Hop2_Group_R1" value
vV_Hop3G = "gblV_Hop3_Group_R1" value
vV_Hop4G = "gblV_Hop4_Group_R1" value
vV_Hop5G = "gblV_Hop5_Group_R1" value
vV_Hop6G = "gblV_Hop6_Group_R1" value
vV_Hop7G = "gblV_Hop7_Group_R1" value
vV_Hop8G = "gblV_Hop8_Group_R1" value
//Hop1
if vV_Hop1G == 0
vV_Hop1F = 0
endif
if vV_Hop1G > 0
vV_Hop1F = 1
endif
if vV_Hop1G == -111
vV_Hop1F = 0
endif
if vV_Hop1G == -333
vV_Hop1F = 0.2
endif
if vV_Hop1G == -444
vV_Hop1F = 1.106
endif
if vV_Hop1G == -888
vV_Hop1F = 1
endif
if vV_Hop1G == -999
vV_Hop1F = 0.027
endif
//Hop2
if vV_Hop2G == 0
vV_Hop2F = 0
endif
if vV_Hop2G > 0
vV_Hop2F = 1
endif
if vV_Hop2G == -111
vV_Hop2F = 0
endif
if vV_Hop2G == -333
vV_Hop2F = 0.2
endif
if vV_Hop2G == -444
vV_Hop2F = 1.106
endif
if vV_Hop2G == -888
vV_Hop2F = 1
endif
if vV_Hop2G == -999
vV_Hop2F = 0.027
endif
//Hop3
if vV_Hop3G == 0
vV_Hop3F = 0
endif
if vV_Hop3G > 0
vV_Hop3F = 1
endif
if vV_Hop3G == -111
vV_Hop3F = 0
endif
if vV_Hop3G == -333
vV_Hop3F = 0.2
endif
if vV_Hop3G == -444
vV_Hop3F = 1.106
endif
if vV_Hop3G == -888
vV_Hop3F = 1
endif
if vV_Hop3G == -999
vV_Hop3F = 0.027
endif
//Hop4
if vV_Hop4G == 0
vV_Hop4F = 0
endif
if vV_Hop4G > 0
vV_Hop4F = 1
endif
if vV_Hop4G == -111
vV_Hop4F = 0
endif
if vV_Hop4G == -333
vV_Hop4F = 0.2
endif
if vV_Hop4G == -444
vV_Hop4F = 1.106
endif
if vV_Hop4G == -888
vV_Hop4F = 1
endif
if vV_Hop4G == -999
vV_Hop4F = 0.027
endif
//Hop5
if vV_Hop5G == 0
vV_Hop5F = 0
endif
if vV_Hop5G > 0
vV_Hop5F = 1
endif
if vV_Hop5G == -111
vV_Hop5F = 0
endif
if vV_Hop5G == -333
vV_Hop5F = 0.2
endif
if vV_Hop5G == -444
vV_Hop5F = 1.106
endif
if vV_Hop5G == -888
vV_Hop5F = 1
endif
if vV_Hop5G == -999
vV_Hop5F = 0.027
endif
//Hop6
if vV_Hop6G == 0
vV_Hop6F = 0
endif
if vV_Hop6G > 0
vV_Hop6F = 1
endif
if vV_Hop6G == -111
vV_Hop6F = 0
endif
if vV_Hop6G == -333
vV_Hop6F = 0.2
endif
if vV_Hop6G == -444
vV_Hop6F = 1.106
endif
if vV_Hop6G == -888
vV_Hop6F = 1
endif
if vV_Hop6G == -999
vV_Hop6F = 0.027
endif
//Hop7
if vV_Hop7G == 0
vV_Hop7F = 0
endif
if vV_Hop7G > 0
vV_Hop7F = 1
endif
if vV_Hop7G == -111
vV_Hop7F = 0
endif
if vV_Hop7G == -333
vV_Hop7F = 0.2
endif
if vV_Hop7G == -444
vV_Hop7F = 1.106
endif
if vV_Hop7G == -888
vV_Hop7F = 1
endif
if vV_Hop7G == -999
vV_Hop7F = 0.027
endif
//Hop8
if vV_Hop8G == 0
vV_Hop8F = 0
endif
if vV_Hop8G > 0
vV_Hop8F = 1
endif
if vV_Hop8G == -111
vV_Hop8F = 0
endif
if vV_Hop8G == -333
vV_Hop8F = 0.2
endif
if vV_Hop8G == -444
vV_Hop8F = 1.106
endif
if vV_Hop8G == -888
vV_Hop8F = 1
endif
if vV_Hop8G == -999
vV_Hop8F = 0.027
endif
[CODE]
//mg/l AA = (AA rating in decimal x oz of hops x 7490) / gallons of wort
//Bigness factor = 1.65 x 0.000125^(wort gravity - 1)
//Boil Time Factor = (1- 2.71828^(-0.04 x Hop Time)) / 4.15
//AAU = Bigness Factor x Boil Time Factor
//IBU = AAU x mg/l AA
// Euler's number
new value "Euler's number"
"Euler's number" =  2.7182818284590452353602874713527
new value "e^ X"
new value "A _A_U"
new value BF
BF precision = 4
new value BFexp
BFexp precision = 4
new value BTF1
BTF1 precision = 4
new value BTF1exp
//...................................
// sw_IBU_Rager: false = Tinseth (existing formula, unchanged), true = Rager
new bool vB_UseRager
vB_UseRager = "sw_IBU_Rager" state
new value vV_RagerArg
new value vV_RagerTanhArg
new value vV_Rager_e2x
new value vV_RagerTanh
new value vV_Rager_e2xPlus1
new value vV_RagerU
new value vV_RagerGA
//Rager utilization% = 18.11 + 13.86 x tanh((Hop Time - 31.32) / 18.27)
//tanh(x) = (e^2x - 1) / (e^2x + 1)
//Rager gravity adjustment = 1 + (BoilGravity - 1.050) / 0.2, never below 1 (no credit under 1.050)
//IBU (Rager) = mg/l AA x (utilization% / 100) / gravity adjustment
vV_RagerGA = "gblV_BoilGravity_R1" Value - 1.050
vV_RagerGA /= 0.2
if vV_RagerGA < 0
vV_RagerGA = 0
endif
vV_RagerGA += 1
//calc hop 1 aa mg/l
"A _A_U" = "gblV_Hop1_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop1_R1" Value * 7490
"A _A_U" /= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop1_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop1 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop1_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop1 = "A _A_U" * vV_RagerU
vV_IBUHop1 /= vV_RagerGA
endif
vV_IBUHop1 = vV_IBUHop1 * vV_Hop1F
"gblV_Hop1_Calc_IBU_R1" value = vV_IBUHop1
//calc hop2 aa mg/l
"A _A_U" = "gblV_Hop2_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop2_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop2_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop2 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop2_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop2 = "A _A_U" * vV_RagerU
vV_IBUHop2 /= vV_RagerGA
endif
vV_IBUHop2 = vV_IBUHop2 * vV_Hop2F
"gblV_Hop2_Calc_IBU_R1" value = vV_IBUHop2
//calc hop3 aa mg/l
"A _A_U" = "gblV_Hop3_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop3_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop3_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop3 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop3_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop3 = "A _A_U" * vV_RagerU
vV_IBUHop3 /= vV_RagerGA
endif
vV_IBUHop3 = vV_IBUHop3 * vV_Hop3F
"gblV_Hop3_Calc_IBU_R1" value = vV_IBUHop3
//calc hop4 aa mg/l
"A _A_U" = "gblV_Hop4_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop4_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop4_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop4 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop4_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop4 = "A _A_U" * vV_RagerU
vV_IBUHop4 /= vV_RagerGA
endif
vV_IBUHop4 = vV_IBUHop4 * vV_Hop4F
"gblV_Hop4_Calc_IBU_R1" value = vV_IBUHop4
//calc hop5 aa mg/l
"A _A_U" = "gblV_Hop5_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop5_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop5_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop5 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop5_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop5 = "A _A_U" * vV_RagerU
vV_IBUHop5 /= vV_RagerGA
endif
vV_IBUHop5 = vV_IBUHop5 * vV_Hop5F
"gblV_Hop5_Calc_IBU_R1" value = vV_IBUHop5
//calc hop6 aa mg/l
"A _A_U" = "gblV_Hop6_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop6_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop6_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop6 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop6_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop6 = "A _A_U" * vV_RagerU
vV_IBUHop6 /= vV_RagerGA
endif
vV_IBUHop6 = vV_IBUHop6 * vV_Hop6F
"gblV_Hop6_Calc_IBU_R1" value = vV_IBUHop6
//calc hop7 aa mg/l
"A _A_U" = "gblV_Hop7_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop7_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop7_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop7 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop7_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop7 = "A _A_U" * vV_RagerU
vV_IBUHop7 /= vV_RagerGA
endif
vV_IBUHop7 = vV_IBUHop7 * vV_Hop7F
"gblV_Hop7_Calc_IBU_R1" value = vV_IBUHop7
//calc hop8 aa mg/l
"A _A_U" = "gblV_Hop8_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop8_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop8_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop8 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop8_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop8 = "A _A_U" * vV_RagerU
vV_IBUHop8 /= vV_RagerGA
endif
vV_IBUHop8 = vV_IBUHop8 * vV_Hop8F
"gblV_Hop8_Calc_IBU_R1" value = vV_IBUHop8
//calc total IBU
"gblV_HBU_R1"  Value = 0
"gblV_HBU_R1"  Value = "gblV_Hop1_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop2_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop3_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop4_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop5_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop6_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop7_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop8_Calc_IBU_R1" Value
"gblS_Inter_Script" value = "ended: batch_1_IBUs"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value = 5
stop "batch_1_IBUs"
```

## 138. xbatch_1_IBUs

Starts by itself: No · User can start or stop it: Yes · 602 lines

```text
//batch_1_IBUs modified 261002 07:56
//Version: 261002_07:56
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Called from @ 57 in scrBrew0_2_2_All_Hop_Scripts_Calculation
//Calculate IBU
//03/27/2023:08:25
//Modified 02/27/2024:09:25
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
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vV_Hop1F
new value vV_Hop2F
new value vV_Hop3F
new value vV_Hop4F
new value vV_Hop5F
new value vV_Hop6F
new value vV_Hop7F
new value vV_Hop8F
new value vV_Hop1G
new value vV_Hop2G
new value vV_Hop3G
new value vV_Hop4G
new value vV_Hop5G
new value vV_Hop6G
new value vV_Hop7G
new value vV_Hop8G
new value vV_IBUHop1
new value vV_IBUHop2
new value vV_IBUHop3
new value vV_IBUHop4
new value vV_IBUHop5
new value vV_IBUHop6
new value vV_IBUHop7
new value vV_IBUHop8
new value vV_Lenght
vV_Lenght = "gblVBrewLenght_R1" Value
vV_Hop1G = "gblV_Hop1_Group_R1" value
vV_Hop2G = "gblV_Hop2_Group_R1" value
vV_Hop3G = "gblV_Hop3_Group_R1" value
vV_Hop4G = "gblV_Hop4_Group_R1" value
vV_Hop5G = "gblV_Hop5_Group_R1" value
vV_Hop6G = "gblV_Hop6_Group_R1" value
vV_Hop7G = "gblV_Hop7_Group_R1" value
vV_Hop8G = "gblV_Hop8_Group_R1" value
//Hop1
if vV_Hop1G == 0
vV_Hop1F = 0
endif
if vV_Hop1G > 0
vV_Hop1F = 1
endif
if vV_Hop1G == -111
vV_Hop1F = 0
endif
if vV_Hop1G == -333
vV_Hop1F = 0.2
endif
if vV_Hop1G == -444
vV_Hop1F = 1.106
endif
if vV_Hop1G == -888
vV_Hop1F = 1
endif
if vV_Hop1G == -999
vV_Hop1F = 0.027
endif
//Hop2
if vV_Hop2G == 0
vV_Hop2F = 0
endif
if vV_Hop2G > 0
vV_Hop2F = 1
endif
if vV_Hop2G == -111
vV_Hop2F = 0
endif
if vV_Hop2G == -333
vV_Hop2F = 0.2
endif
if vV_Hop2G == -444
vV_Hop2F = 1.106
endif
if vV_Hop2G == -888
vV_Hop2F = 1
endif
if vV_Hop2G == -999
vV_Hop2F = 0.027
endif
//Hop3
if vV_Hop3G == 0
vV_Hop3F = 0
endif
if vV_Hop3G > 0
vV_Hop3F = 1
endif
if vV_Hop3G == -111
vV_Hop3F = 0
endif
if vV_Hop3G == -333
vV_Hop3F = 0.2
endif
if vV_Hop3G == -444
vV_Hop3F = 1.106
endif
if vV_Hop3G == -888
vV_Hop3F = 1
endif
if vV_Hop3G == -999
vV_Hop3F = 0.027
endif
//Hop4
if vV_Hop4G == 0
vV_Hop4F = 0
endif
if vV_Hop4G > 0
vV_Hop4F = 1
endif
if vV_Hop4G == -111
vV_Hop4F = 0
endif
if vV_Hop4G == -333
vV_Hop4F = 0.2
endif
if vV_Hop4G == -444
vV_Hop4F = 1.106
endif
if vV_Hop4G == -888
vV_Hop4F = 1
endif
if vV_Hop4G == -999
vV_Hop4F = 0.027
endif
//Hop5
if vV_Hop5G == 0
vV_Hop5F = 0
endif
if vV_Hop5G > 0
vV_Hop5F = 1
endif
if vV_Hop5G == -111
vV_Hop5F = 0
endif
if vV_Hop5G == -333
vV_Hop5F = 0.2
endif
if vV_Hop5G == -444
vV_Hop5F = 1.106
endif
if vV_Hop5G == -888
vV_Hop5F = 1
endif
if vV_Hop5G == -999
vV_Hop5F = 0.027
endif
//Hop6
if vV_Hop6G == 0
vV_Hop6F = 0
endif
if vV_Hop6G > 0
vV_Hop6F = 1
endif
if vV_Hop6G == -111
vV_Hop6F = 0
endif
if vV_Hop6G == -333
vV_Hop6F = 0.2
endif
if vV_Hop6G == -444
vV_Hop6F = 1.106
endif
if vV_Hop6G == -888
vV_Hop6F = 1
endif
if vV_Hop6G == -999
vV_Hop6F = 0.027
endif
//Hop7
if vV_Hop7G == 0
vV_Hop7F = 0
endif
if vV_Hop7G > 0
vV_Hop7F = 1
endif
if vV_Hop7G == -111
vV_Hop7F = 0
endif
if vV_Hop7G == -333
vV_Hop7F = 0.2
endif
if vV_Hop7G == -444
vV_Hop7F = 1.106
endif
if vV_Hop7G == -888
vV_Hop7F = 1
endif
if vV_Hop7G == -999
vV_Hop7F = 0.027
endif
//Hop8
if vV_Hop8G == 0
vV_Hop8F = 0
endif
if vV_Hop8G > 0
vV_Hop8F = 1
endif
if vV_Hop8G == -111
vV_Hop8F = 0
endif
if vV_Hop8G == -333
vV_Hop8F = 0.2
endif
if vV_Hop8G == -444
vV_Hop8F = 1.106
endif
if vV_Hop8G == -888
vV_Hop8F = 1
endif
if vV_Hop8G == -999
vV_Hop8F = 0.027
endif
[CODE]
//mg/l AA = (AA rating in decimal x oz of hops x 7490) / gallons of wort
//Bigness factor = 1.65 x 0.000125^(wort gravity - 1)
//Boil Time Factor = (1- 2.71828^(-0.04 x Hop Time)) / 4.15
//AAU = Bigness Factor x Boil Time Factor
//IBU = AAU x mg/l AA
// Euler's number
new value "Euler's number"
"Euler's number" =  2.7182818284590452353602874713527
new value "e^ X"
new value "A _A_U"
new value BF
BF precision = 4
new value BFexp
BFexp precision = 4
new value BTF1
BTF1 precision = 4
new value BTF1exp
//...................................
// sw_IBU_Rager: false = Tinseth (existing formula, unchanged), true = Rager
new bool vB_UseRager
vB_UseRager = "sw_IBU_Rager" state
new value vV_RagerArg
new value vV_RagerTanhArg
new value vV_Rager_e2x
new value vV_RagerTanh
new value vV_Rager_e2xPlus1
new value vV_RagerU
new value vV_RagerGA
//Rager utilization% = 18.11 + 13.86 x tanh((Hop Time - 31.32) / 18.27)
//tanh(x) = (e^2x - 1) / (e^2x + 1)
//Rager gravity adjustment = 1 + (BoilGravity - 1.050) / 0.2, never below 1 (no credit under 1.050)
//IBU (Rager) = mg/l AA x (utilization% / 100) / gravity adjustment
vV_RagerGA = "gblV_BoilGravity_R1" Value - 1.050
vV_RagerGA /= 0.2
if vV_RagerGA < 0
vV_RagerGA = 0
endif
vV_RagerGA += 1
//calc hop 1 aa mg/l
"A _A_U" = "gblV_Hop1_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop1_R1" Value * 7490
"A _A_U" /= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop1_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop1 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop1_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop1 = "A _A_U" * vV_RagerU
vV_IBUHop1 /= vV_RagerGA
endif
vV_IBUHop1 = vV_IBUHop1 * vV_Hop1F
"gblV_Hop1_Calc_IBU_R1" value = vV_IBUHop1
//calc hop2 aa mg/l
"A _A_U" = "gblV_Hop2_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop2_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop2_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop2 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop2_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop2 = "A _A_U" * vV_RagerU
vV_IBUHop2 /= vV_RagerGA
endif
vV_IBUHop2 = vV_IBUHop2 * vV_Hop2F
"gblV_Hop2_Calc_IBU_R1" value = vV_IBUHop2
//calc hop3 aa mg/l
"A _A_U" = "gblV_Hop3_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop3_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop3_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop3 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop3_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop3 = "A _A_U" * vV_RagerU
vV_IBUHop3 /= vV_RagerGA
endif
vV_IBUHop3 = vV_IBUHop3 * vV_Hop3F
"gblV_Hop3_Calc_IBU_R1" value = vV_IBUHop3
//calc hop4 aa mg/l
"A _A_U" = "gblV_Hop4_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop4_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop4_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop4 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop4_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop4 = "A _A_U" * vV_RagerU
vV_IBUHop4 /= vV_RagerGA
endif
vV_IBUHop4 = vV_IBUHop4 * vV_Hop4F
"gblV_Hop4_Calc_IBU_R1" value = vV_IBUHop4
//calc hop5 aa mg/l
"A _A_U" = "gblV_Hop5_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop5_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop5_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop5 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop5_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop5 = "A _A_U" * vV_RagerU
vV_IBUHop5 /= vV_RagerGA
endif
vV_IBUHop5 = vV_IBUHop5 * vV_Hop5F
"gblV_Hop5_Calc_IBU_R1" value = vV_IBUHop5
//calc hop6 aa mg/l
"A _A_U" = "gblV_Hop6_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop6_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop6_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop6 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop6_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop6 = "A _A_U" * vV_RagerU
vV_IBUHop6 /= vV_RagerGA
endif
vV_IBUHop6 = vV_IBUHop6 * vV_Hop6F
"gblV_Hop6_Calc_IBU_R1" value = vV_IBUHop6
//calc hop7 aa mg/l
"A _A_U" = "gblV_Hop7_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop7_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop7_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop7 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop7_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop7 = "A _A_U" * vV_RagerU
vV_IBUHop7 /= vV_RagerGA
endif
vV_IBUHop7 = vV_IBUHop7 * vV_Hop7F
"gblV_Hop7_Calc_IBU_R1" value = vV_IBUHop7
//calc hop8 aa mg/l
"A _A_U" = "gblV_Hop8_Actual_AAU_R1" Value / 100
"A _A_U" *= "gblV_Oz_Calculated_Hop8_R1" Value * 7490
"A _A_U"/= vV_Lenght
if vB_UseRager == false
//calc bigness factor (Tinseth)
BFexp = "gblV_BoilGravity_R1" Value - 1
BF = .000125 ^ BFexp
BF *= 1.65
//calc Boil Time Factor for each hop (Tinseth)
BTF1exp = -0.04 * "gblV_TimeHop8_Min_R1" Value
"e^ X" = "Euler's number"  ^ BTF1exp
BTF1 = 1 - "e^ X"
BTF1 /= 4.15
//calc utilization for each hop (Tinseth)
BTF1 *= BF
//calc hop addition IBU (Tinseth)
vV_IBUHop8 = "A _A_U" * BTF1
endif
if vB_UseRager == true
//calc utilization % (Rager)
vV_RagerArg = "gblV_TimeHop8_Min_R1" Value - 31.32
vV_RagerArg /= 18.27
vV_RagerTanhArg = vV_RagerArg * 2
vV_Rager_e2x = "Euler's number" ^ vV_RagerTanhArg
vV_RagerTanh = vV_Rager_e2x - 1
vV_Rager_e2xPlus1 = vV_Rager_e2x + 1
vV_RagerTanh /= vV_Rager_e2xPlus1
vV_RagerU = vV_RagerTanh * 13.86
vV_RagerU += 18.11
vV_RagerU /= 100
//calc hop addition IBU (Rager, gravity-adjusted)
vV_IBUHop8 = "A _A_U" * vV_RagerU
vV_IBUHop8 /= vV_RagerGA
endif
vV_IBUHop8 = vV_IBUHop8 * vV_Hop8F
"gblV_Hop8_Calc_IBU_R1" value = vV_IBUHop8
//calc total IBU
"gblV_HBU_R1"  Value = 0
"gblV_HBU_R1"  Value = "gblV_Hop1_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop2_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop3_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop4_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop5_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop6_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop7_Calc_IBU_R1" Value
"gblV_HBU_R1"  Value = "gblV_HBU_R1" Value + "gblV_Hop8_Calc_IBU_R1" Value
[Ender_batch_1_IBU]
"gblVScriptFlow" value = 5
"gblS_Inter_Script" value = "ended: batch_1_IBUs"
if vB_Testing == true
sleep 4001
endif
clear
"sw_Running_Script_C" state = false
stop "batch_1_IBUs"
```

## 139. batch_2_Calc_Volumes

Starts by itself: No · User can start or stop it: Yes · 160 lines

```text
//batch_2_Calc_Volumes
//Version:  261001_12:28
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// Called from @ 78 in scrBrew0_2_2_All_Hop_Scripts_Calculation
//Modified 11/29/2024
[Set_Testing]
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new string vS_Msg_Brew_0
new string vS_Msg_Brew_0_1
new string vS_Msg_Brew_0_2
new string vS_Msg_Calc 
new string vS_Msg_Calc_1 
new value vVTimetoFill
new string vS_TTL_Time
new value vVRad_Dead_Space
new value vVRad_Dead_SpaceHalf
new value vVStrike_Volume_Half
new value vVStrike_Volume_Half_Distilled_TTL
new value vVStrike_Volume_w_Dead
new value vVStrikeVolume_Half_w_Dead
new value vVAleLager
new value vVStrikeVolume
new value vVStrikeVolumeG
new value vVGrainWeight
new value vVWortThickness
new value vVMashTunVolume
new value vVFirstRun
new value vVStrikeF
new value vVGristRatio
new value vVGrainTemp
new value vVMashTemp
new value vVTempDelta
new value vVOffset
new value vVStrikewOffset
new value vVBatchSize
new value vVStartofBoil
new value vVBoilOff
new value vVBoil
new value vVSparge
new value vV_G_per_Sec
new value vV_Seconds
new value vV_SecondsR
new value vV_Minutes
new string vSMin
new string vSSec
new string vSTime
new value vVStrikeSource
new value vVTTLTapRadiator
new value vVMeasuredRadiator
vVRad_Dead_Space = "glbV_Rad_Dead_Space" value
vVAleLager = "gblVLagerAle" value
vVGrainTemp = "gblV_Grain_Temp" value
vVWortThickness = "gblVWortTickness_R1" value
vVMashTemp = "gblV_Mash_1_Temp" value
vVOffset = "gblV_StrikeOffset" value
vVGrainWeight = "gblVGrainWeight" value
vVBatchSize = "gblVBrewLenght_R1" value
vVBoil = "gblVBoilTime_Minutes" value
vVRad_Dead_SpaceHalf = vVRad_Dead_Space / 2
"gblV_Distilled_to_Add" value = 0
if vVGrainWeight == 0
show workspace "Batch1 Hops" 
"gblS_Hop_Screen_Txt" value = "Manually set the Grain Weight. Once is is set above ZERO the the calculations will advance.  This message is displayed for 10 second."
"gblS_Hop_Screen_Txt" visibility = visible
"inspAAUActualText" background = 3
"inspAAUActualText" visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" value = 00:00:10
"tm_Delay_W1" type = countdown
start "tm_Delay_W1"
"insp_BatchHide" visibility = visible
"tm_Delay_W1" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
"tm_Delay_W1" visibility = hidden
stop "tm_Delay_W1"
"gblS_Hop_Screen_Txt" visibility = hidden
wait "gblVGrainWeight" value > 0
vVGrainWeight = "gblVGrainWeight" value
"inspAAUActualText" visibility = hidden
"inspAAUActualText" background = 1
endif
//Calculations
//Strike Volume and Grist Ration
vVStrikeVolume = vVWortThickness  * vVGrainWeight
vVGristRatio = .2 / vVWortThickness
vVStrikeVolumeG = vVStrikeVolume / 4
"gblVStrikeVolume"  value = vVStrikeVolumeG
vVStrikeVolumeG = "gblVStrikeVolume"  value  
vVStrike_Volume_Half = vVStrikeVolumeG / 2
"gblVPrecision1" value = vVStrike_Volume_Half
vVStrike_Volume_Half = "gblVPrecision1" value
"gblVHalfStrike" value = vVStrike_Volume_Half
// Mash Tun Volume with Grain
vVMashTunVolume = vVGrainWeight * .08
vVMashTunVolume = vVMashTunVolume + vVStrikeVolumeG
"gblVPrecision1" value = vVMashTunVolume
vVMashTunVolume = "gblVPrecision1" value
vS_Msg_Calc = "The Mash Volume with the Grain and Strike is estimated at "
vS_Msg_Calc_1 = vVMashTunVolume
vS_Msg_Calc = vS_Msg_Calc + vS_Msg_Calc_1
vS_Msg_Calc_1 = " gallons.  Will Auto Advance after 10 seconds."
vS_Msg_Calc = vS_Msg_Calc + vS_Msg_Calc_1
"gblS_Hop_Screen_Txt" value = vS_Msg_Calc
"gblS_Hop_Screen_Txt"  visibility = visible
stop "tm_Delay_W1"
"tm_Delay_W1" value = 00:00:10
"tm_Delay_W1" type = countdown
start "tm_Delay_W1"
"gblS_Hop_Screen_Txt" visibility = visible
"insp_BatchHide" visibility = visible
"tm_Delay_W1" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
"tm_Delay_W1" visibility = hidden
stop "tm_Delay_W1"
//First Run 
vVFirstRun = vVGrainWeight * .0625
vVFirstRun = vVStrikeVolumeG - vVFirstRun 
"RP_v_First_Run_Volume" value = vVFirstRun 
//Sparge
vVSparge = vVBatchSize - vVFirstRun
"gblV_SpargeVolume" value = vVSparge
//  Strike Calc
vVTempDelta = vVMashTemp - vVGrainTemp
vVStrikeF = vVGristRatio * vVTempDelta
vVStrikeF = vVStrikeF + vVMashTemp
"gblV_Desired_Strike" value = vVStrikeF
//Strike with Offset
vVStrikewOffset = vVStrikeF + vVOffset
// Starting Volume
vVBoilOff = "gblVBoilOffperMin" value
vVBoilOff = vVBoilOff * vVBoil
vVStartofBoil = vVBatchSize + vVBoilOff 
"gblV_PreBoil_Volume_R1" value = vVStartofBoil
"gblS_Hop_Screen_Txt"  background = 3
"gblS_Hop_Screen_Txt" displayname = "Calculating Done"
"gblS_Hop_Screen_Txt" value = "Wait! First Run, Mash Volume & Intial Boil Volume calculated.  Wait! Will Auto Advance"
"gblS_Hop_Screen_Txt" visibility = visible
goto "HopScreenDisplay"
[HopScreenDisplay]
"gblS_Hop_Screen_Txt" visibility = visible
"tm_Delay_W1" value = 00:00:07
start "tm_Delay_W1"
"tm_Delay_W1" visibility = visible
wait "tm_Delay_W1" value <= 00:00:00
stop "tm_Delay_W1"
"tm_Delay_W1" visibility = hidden
"gblS_Hop_Screen_Txt" background = 3
"gblS_Hop_Screen_Txt" value = "Wait! Will Auto Advance."
// End of Strike
"gblS_Inter_Script" value = "ended: batch_2_Calc_Volumes"
if vB_Testing == true
sleep 4001
endif
clear
"gblVScriptFlow" value = 6
stop  "batch_2_Calc_Volumes"
```

## 140. batch_scrManuaLCalc

Starts by itself: No · User can start or stop it: No · 95 lines

```text
//batch_scrManuaLCalc
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//11/22.2024 12:19
//Calculate Waters
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vVAleLager
new value vVStrikeVolume
new value vVStrikeVolumeG
new value vVGrainWeight
new value vVGrainWeight
new value vVWortThickness
new value VVMashTunVolume
new value vVFirstRun
new value vVStrikeF
new value vVGristRatio
new value vVGrainTemp
new value vVMashTemp
new value vVTempDelta
new value vVOffset
new value vVStrikewOffset
new value vVBatchSize
new value vVStartofBoil
new value vVBoilOff
new value vVBoil
new value vVSparge
new value vVBMtoMLTGPS
new value vVBSpargeSeconds
new value vVBSpargeSecondsR
new value vVBSpargeMinutes
new string vSMin
new string vSSec
new string vSTime
vVAleLager = "gblVLagerAle" value
vVGrainTemp = "gblV_Grain_Temp" value
vVWortThickness = "gblVWortTickness_R1" value
vVMashTemp = "gblV_Mash_1_Temp" value
vVOffset = "gblV_StrikeOffset" value
vVGrainWeight = "gblVGrainWeight" value
vVBatchSize = "gblVBrewLenght_R1" value
vVBoil = "gblVBoilTime_Minutes" value
vVBMtoMLTGPS = "gblV_SPG_BigMac_to_MLT" value
//Calculations
//Strike Volume and Grist Ration
vVStrikeVolume = vVWortThickness  * vVGrainWeight
print "strike Volume in quarts"
print vVStrikeVolume
vVGristRatio = .2 / vVWortThickness
print "Grist Factor"
print vVGristRatio
vVStrikeVolumeG = vVStrikeVolume / 4
print "Strike Volume Gal"
print vVStrikeVolumeG
"gblVStrikeVolume"  value = vVStrikeVolumeG
// Mash Tun Volume with Grain
VVMashTunVolume = vVGrainWeight * .08
VVMashTunVolume = VVMashTunVolume + vVStrikeVolumeG
print "MLT Vol with Grain and Strike"
print VVMashTunVolume
//First Run 
vVFirstRun = vVGrainWeight * .0625
vVFirstRun = vVStrikeVolumeG - vVFirstRun 
"RP_v_First_Run_Volume" value = vVFirstRun 
print "First Run"
print vVFirstRun
//  Strike Calc
vVTempDelta = vVMashTemp - vVGrainTemp
vVStrikeF = vVGristRatio * vVTempDelta
vVStrikeF = vVStrikeF + vVMashTemp
"gblV_Desired_Strike" value = vVStrikeF
print "Desired Strike"
print vVStrikeF
//Strike with Offset
vVStrikewOffset = vVStrikeF + vVOffset
print "Strike Target Plus Loss"
print vVStrikewOffset
"gblV_RadiatorSetPoint_P1_B1" value = vVStrikewOffset
print vVStrikeF
// Starting Volume
vVBoilOff = "gblVBoilOffperMin" value
vVBoilOff = vVBoilOff * vVBoil
vVStartofBoil = vVBatchSize + vVBoilOff 
"gblV_PreBoil_Volume_R1" value = vVStartofBoil
"sw_Running_Script_C" state  = false
if vB_Testing == true
"gblS_Inter_Script" value = "ended: batch_scrManuaLCalc"
sleep 4001
endif
clear
stop "batch_scrManuaLCalc"
```

## 141. inscpt_scr_Inner_Blue

Starts by itself: No · User can start or stop it: Yes · 34 lines

```text
// inscpt_scr_Inner_Blue  Modified: 260728 16-08
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//260728 16:08
"sw_Running_InnerBlue" state = true
start "inscpt_scrClearB1_Brewery"
sleep 100
wait "sw_Running_Clear_B1" state == false
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_1" value  = "Wait!  Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait"
"gblS_Brewery_Bottom_1" value = "Wait\n   Wait\n    Wait\n     Wait\n      Wait\n       Wait\n        Wait"
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Bottom_1"  background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_Brewery_Top_1" visibility  = visible
"gblS_Brewery_Bottom_1" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"sw_Running_InnerBlue" state = false
stop "inscpt_scr_Inner_Blue"
```

## 142. inscpt_scrBasicStart

Starts by itself: No · User can start or stop it: Yes · 20 lines

```text
//inscpt_scrBasicStart Modified 26_07_20 09-26
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//07/18/2026 15:14
[Set_Testing]
//"sw_Status_Testing" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
stop "looper_scrAutoSwitch"
start "looper_scrAutoSwitch"
stop "looper_scrBackGrounds"
start "looper_scrBackGrounds"
stop "looper_scrElementControl" 
start "looper_scrElementControl"
if vB_Testing == true
start "looper_scrBoilTimer_Reset"
start "step_scrTest_Time _Reset"
endif
clear
stop "inscpt_scrBasicStart"
```

## 143. inscpt_scrAdvancewithSwitch

Starts by itself: No · User can start or stop it: Yes · 59 lines

```text
// inscpt_scrAdvancewithSwitch  Modified: 260811 12-00
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//260728 16:00
//© OakBarn Brewery
"sw_Running_Advance_with_Switch" state = true
new value vV_BrewStatus_Save
vV_BrewStatus_Save = "gblV_Brew_Status" value
"gblV_Water_Flow_Wo1" value = vV_BrewStatus_Save
//........................................................
if "sw_Restore_B1" state == true
start "sub_scrRestore_B1"
sleep 100
endif
new string vS_Beer_Name_Text
new string vS_Beer_Name_Visibility
vS_Beer_Name_Text = "gblS_BrewName_B1" value
vS_Beer_Name_Visibility = "gblS_BrewName_B1" visibility
//........................................................
"gblS_Brewery_Top_3" value  = "gblS_Top_Text" value
"gblS_Brewery_Bottom_1" value = "gblS_Bottom_Text" value
"gblS_swAllSwitch_Label_Text" value = "gblS_Water_Text" value 
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"gblS_Brewery_Top_3" background = 1
"gblS_Brewery_Bottom_1" background = 2
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
//Visibility
"gblS_Brewery_Top_3" visibility  = visible
"gblS_Brewery_Top_1" visibility  = hidden
"gblS_Brewery_Top_2" visibility  = hidden
"gblVReport_B1" visibility  = hidden
"gblS_Brewery_Bottom_1" visibility  = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = visible
"gblV_Brew_Status" value = 1
wait "gblV_Brew_Status" value == 2
"gblS_Brewery_Top_3" visibility  = hidden
"gblS_Brewery_Bottom_1" visibility  = hidden
//........................................
//........................................
[Ender_inscpt_scrAdvancewithSwitch]
"gblS_BrewName_B1" value = vS_Beer_Name_Text 
"gblS_BrewName_B1" visibility = vS_Beer_Name_Visibility
"gblV_Brew_Status" value = vV_BrewStatus_Save
clear
sleep 100
"gblVEndlessLoop" value = 0
"sw_Restore_B1" state = false
"sw_Running_Advance_with_Switch" state = false
stop "inscpt_scrAdvancewithSwitch"
sleep 100
wait "sw_Running_Advance_with_Switch" state == false
```

## 144. inscpt_scrMessage_with_Delay

Starts by itself: No · User can start or stop it: Yes · 117 lines

```text
// inscpt_scrMessage_with_Delay   Modified: 260809 17:02
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//260728 15:56
// You need to add the seconds before you call this 
// set gblV_Delay_Seconds value  
//© OakBarn Brewery
"sw_Running_Message_with_Delay" state = true
new bool  vB_Save_B1
vB_Save_B1 = "sw_Restore_B1" state
new string vS_Message_Top
vS_Message_Top =  "gblS_Top_Text" value
//........................................................
if vB_Save_B1 == true
start "sub_scrRestore_B1"
sleep 100
endif
new string vS_Beer_Name_Text
new string vS_Beer_Name_Visibility
vS_Beer_Name_Text = "gblS_BrewName_B1" value
vS_Beer_Name_Visibility = "gblS_BrewName_B1" visibility
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
"gblVReport_B1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
//........................................................
"gblS_BrewName_B1" value = "Wait"
"gblS_BrewName_B1" visibility = visible
if "sw_Use_Top_1" state == true
	"gblS_Brewery_Top_1" value =  vS_Message_Top
	"gblS_Brewery_Top_1" visibility = visible
	//Blue
	"gblS_Brewery_Top_1" background = 3
	"gblV_Set_BackGround_Middle_Time" value = 3
endif	
if "sw_Use_Top_2" state == true
	"gblS_Brewery_Top_2" value =  vS_Message_Top
	"gblS_Brewery_Top_2" visibility = visible
	//Black
	"gblS_Brewery_Top_2" background = 1
	"gblV_Set_BackGround_Middle_Time" value = 1
endif
if "sw_Use_Top_3" state == true
	"gblS_Brewery_Top_3" value =  vS_Message_Top
	"gblS_Brewery_Top_3" visibility = visible
	//Grey
	"gblS_Brewery_Top_3" background = 1
	"gblV_Set_BackGround_Middle_Time" value = 5
endif
//.............................................
if "sw_Use_Bottom_1" state == true
	new string vS_Message_Bottom
	vS_Message_Bottom =  "gblS_Bottom_Text" value
	"gblS_Brewery_Bottom_1" value = vS_Message_Bottom
	"gblS_Brewery_Bottom_1" visibility = visible
	//Blue
	"gblS_Brewery_Bottom_1" background = 3
endif
if "sw_Use_Bottom_3" state == true
	new string vS_Message_Bottom
	vS_Message_Bottom =  "gblS_Bottom_Text" value
	"gblS_Brewery_Bottom_3" value = vS_Message_Bottom
	"gblS_Brewery_Bottom_3" visibility = visible
	//Grey
	"gblS_Brewery_Bottom_3" background = 1
endif
if "sw_Use_Bottom_4" state == true
	new string vS_Message_Bottom
	vS_Message_Bottom =  "gblS_Bottom_Text" value
	"gblS_Brewery_Bottom_4" value = vS_Message_Bottom
	"gblS_Brewery_Bottom_4" visibility = visible
	//Black
	"gblS_Brewery_Bottom_4" background = 2
endif
//........................................
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
sleep 100
//........................................
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
//Background
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
// Visibility
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
new value vV_Time_Delay
vV_Time_Delay = "gblV_Delay_Seconds" value
print vV_Time_Delay
start "inscpt_scrShortDelay"
sleep 100
//........................................
wait "sw_Running_Short_Delay_Time" state == false
[Ender_Message_Delay]
	if vB_Save_B1 == true
	"gblVEndlessLoop" value = 1.1 
	wait "sw_Restore_B1" state == false
endif
"gblS_BrewName_B1" value = vS_Beer_Name_Text 
"gblS_BrewName_B1" visibility = vS_Beer_Name_Visibility 
"gblVEndlessLoop" value = 1.1
sleep 100
"gblVEndlessLoop" value = 0
clear
"sw_Running_Message_with_Delay" state = false
stop "inscpt_scrMessage_with_Delay"
```

## 145. inscpt_scrSet_Brewery_Scripts

Starts by itself: No · User can start or stop it: No · 23 lines

```text
//inscpt_scrSet_Brewery_Scripts
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//26_07_20 09-21
//Starts the Scripts needed to start Brewing
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
"gblVScriptFlow" value = -98
start "strt_1_Set_Elements_Enabled"
start "looper_scrElementControl" 
start "looper_BURNER_scrLittleMacBurner"
start "looper_BURNER_scrBrewKettleBurner"
//pump scripts
start "scrWhitePump"
start "scrYellowPump"
// Problem with DINs
//start "looper_scrDin"
"gblVScriptFlow" value = -97
clear
stop "inscpt_scrSet_Brewery_Scripts"
```

## 146. inscpt_scrAlarm

Starts by itself: No · User can start or stop it: Yes · 78 lines

```text
//inscpt_scrAlarm
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//11/24/2020 13:50
//shuts down all the alarms
"sw_Running_Alarm_Clear" state = true
stop "tm_HiddenDefault_AlarmWS"
"tm_HiddenDefault_AlarmWS" visibility = hiddenlocked
"alm_Hidden1_ALARM" active = false
"alm_Hidden1_ALARM" visibility = hiddenlocked
"alm_Hidden2_ALARM" active = false
"alm_Hidden2_ALARM" visibility = hiddenlocked
"alm_Hidden3_ALARM" active = false
"alm_Hidden3_ALARM" visibility = hiddenlocked
"alm_Hidden4_ALARM" active = false
"alm_Hidden4_ALARM" visibility = hiddenlocked
"alm_Hidden_AlarmDefault" active = false
"alm_Hidden_AlarmDefault" visibility = hiddenlocked
"alm_Manual_Warning" active = false
"alm_Manual_Warning" visibility = hiddenlocked
"alm_Hop_Delay_1" active = false
"alm_Hop_Delay_1" visibility = hiddenlocked
"alm_DINS" active = false
"alm_DINS" visibility = hiddenlocked
"alm_Hidden_Irish_Moss_Warning_ALARM" active = false
"alm_Hidden_Irish_Moss_Warning_ALARM" visibility = hiddenlocked
"alm_Hidden_Hop_15min_Warning_ALARM" active = false
"alm_Hidden_Hop_15min_Warning_ALARM" visibility = hiddenlocked
"alm_Hidden_Aroma1EndofBoil_ALARM"  active = false
"alm_Hidden_Aroma1EndofBoil_ALARM" visibility = hiddenlocked
"alm_Beep" active = false
"alm_Hops_3_ALARM" active = false
"alm_Hops_3_ALARM" visibility = hidden
"alm_Sound_3_W1" active = false
"alm_Hidden_Beer_Music_1" active = false
"alm_Hidden_Beer_Music_2" active = false
"alm_Hidden_Beer_Music_3" active = false
"alm_Hidden_Beer_Music_4" active = false
"alm_StrikeSpargeMash_ALARM" active = false
"alm_StrikeSpargeMash_ALARM" visibility = hidden
"alm_Alarm_SanitizeBoil_ALARM" active = false
"alm_Alarm_SanitizeBoil_ALARM" visibility = hidden
"alm_Hops_1_ALARM" active = false
"alm_Hops_1_ALARM" visibility = hidden
"alm_Hops_2_ALARM"  active = false
"alm_Hops_2_ALARM" visibility = hidden
"alm_Cleaner1_Alarm_WS" active = false
"alm_Cleaner1_Alarm_WS" visibility = hidden
"gblS_Pix_IrishMoss_ALARM" visibility = hidden
"gblS_HopMessage_ALARM" visibility = hidden
"alm_EndofBoil" active = false
"MB_28_do_ManualAlarm_B1" state = false
"alm_Extra_Hops" active = false
"alm_Extra_Hops" visibility = hidden
"gblS_Pix_YeastNutrient_ALARM" visibility = hidden
"gblS_Pix_Pivo_ALARM" visibility = hidden
"tm_BottomRight_ALARM" visibility = hidden
"alm_Hop_Delay_1" active = false
"alm_Hop_Delay_1" loop = false
"alm_Hop_Delay_1" fileindex = 1 

stop "tm_BottomRight_ALARM"
//Water Alarms
"alm_BigMacFloat_Water" active = false
"alm_BigMacFloat_Water" visibility = hidden
"alm_BigMacFloat_Water" active = false
"alm_BigMacFloat_Water" visibility = hidden
"tm_BottomRight_ALARM" visibility = hidden
"alm_Cleaner1_Alarm_WS" active = false
"alm_Cleaner1_Alarm_WS" visibility = hidden
//Alarm Timer
"tm_BottomRight_ALARM" visibility = hidden
stop "tm_BottomRight_ALARM"
//Manual Alarm
show workspace "B1 Brewery"
clear
"sw_Running_Alarm_Clear" state = false
stop "inscpt_scrAlarm"
```

## 147. inscpt_scrClearBatchHops

Starts by itself: No · User can start or stop it: Yes · 24 lines

```text
// MIT License Granted
//Copyright © OakBarn Brewery 2026
"sw_Running_ClearBatchHops" state = true
stop "looper_scrBlinkAAU"
"inspAAUActual" visibility = hidden
stop "looper_scrBlinkHopOz"
"inspHopOz" visibility = hidden
stop "looper_scrBlinkClick"
"insp_Pix_ArrowHopSwitch_R1" visibility = hidden
stop "looper_scrBlinkUseHop"
"insp_UseHop" visibility =  hidden
"insp_UseHopBig" visibility = hidden
"inspHopOz" visibility = hidden
"gblS_Hop_Screen_Txt" visibility = hidden
"tm_Delay_W1" visibility = hidden
"inspAAUActual" visibility = hidden
"insp_BlanK_AAU" visibility = hidden
"insp_BatchHide" visibility = hidden
"inspAAUActualText" visibility = hidden
"sw_Advance_HopsCalc" visibility = hidden
"sw_Advance_Hop_Delay" visibility = hidden
"sw_Flow_ByBass_Hop_Calc" visibility = hidden
"sw_Running_ClearBatchHops" state = false
stop "inscpt_scrClearBatchHops"
```

## 148. inscpt_scrSet_Middle_Backgrounds

Starts by itself: No · User can start or stop it: Yes · 87 lines

```text
//inscpt_scrSet_Middle_Backgrounds
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//Created 06/16/2026 09:10
//Modified  06/16/2026 09:10
if "gblV_Set_BackGround_Middle_Time" value == 1
goto "Inspector_Black"
endif
if "gblV_Set_BackGround_Middle_Time" value == 2
goto "Inspector_Green"
endif
if "gblV_Set_BackGround_Middle_Time" value == 3
goto "Inspector_Blue"
endif
if "gblV_Set_BackGround_Middle_Time" value == 4
goto "Inspector_Red"
endif
if "gblV_Set_BackGround_Middle_Time" value == 5
goto "Inspector_Gray"
endif
if "gblV_Set_BackGround_Middle_Time" value == 6
goto "Inspector_Orange"
endif
if "gblV_Set_BackGround_Middle_Time" value == 7
goto "Inspector_Blue_15_Timer_Delay"
endif
if "gblV_Set_BackGround_Middle_Time" value == 8
goto "Inspector_Blue_10_Timer_Delay"
endif
//....................................................................................
[Inspector_Black]
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 1
"insp_1_LeftMiddle_B1" visibility = visible
goto "End_Inspector"
[Inspector_Green]
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 2
"insp_1_LeftMiddle_B1" visibility = visible
goto "End_Inspector"
[Inspector_Blue]
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
goto "End_Inspector"
[Inspector_Red]
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
goto "End_Inspector"
[Inspector_Gray]
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 2
"insp_2_LeftMiddle_B1" visibility = visible
goto "End_Inspector"
[Inspector_Orange]
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 3
"insp_2_LeftMiddle_B1" visibility = visible
goto "End_Inspector"
[Inspector_Blue_15_Timer_Delay]
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"gblV_Delay_Seconds" value = 15
start "inscpt_scrShortDelay"
goto "End_Inspector"
[Inspector_Blue_10_Timer_Delay]
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"gblV_Delay_Seconds" value = 10
start "inscpt_scrShortDelay"
goto "End_Inspector"

[End_Inspector]
stop "inscpt_scrSet_Middle_Backgrounds"
```

## 149. inscpt_scrFermentorStatus

Starts by itself: No · User can start or stop it: Yes · 128 lines

```text
//inscpt_scrFermentorStatus Modified 260915 10_58
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//07/26/2023 11:56
new string vS_Status_Fermentor
new value vV_Status_Fermentor
new value vV_Fermentor
new bool vB_1
new bool vB_2
new bool vB_3
new bool vB_4
new bool vB_5
new bool vB_6
"sw_Running_FermentorStatus" state = true
print "Started inscpt_scrFermentorStatus"
[LoopStatus]
sleep 100
//Fermentors
if vB_5 == true
goto "Skip_5"
endif
if vB_4 == true
goto "Skip_4"
endif
if vB_3 == true
goto "Skip_3"
endif
if vB_2 == true
goto "Skip_2"
endif
if vB_1 == true
goto "Skip_1"
endif
vV_Fermentor = 1
vV_Status_Fermentor = "gblV_FermentStatus_1" value
goto "Set_Status"
[Skip_1]
//.................
vV_Fermentor = 2
vV_Status_Fermentor = "gblV_FermentStatus_2" value
goto "Set_Status"
[Skip_2]
//.................
vV_Fermentor = 3
vV_Status_Fermentor = "gblV_FermentStatus_3" value
goto "Set_Status"
[Skip_3]
//.................
vV_Fermentor = 4
vV_Status_Fermentor = "gblV_FermentStatus_4" value
goto "Set_Status"
[Skip_4]
//.................
vV_Fermentor = 5
vV_Status_Fermentor = "gblV_FermentStatus_5" value
goto "Set_Status"
[Skip_5]
//.................
vV_Fermentor = 6
vV_Status_Fermentor = "gblV_FermentStatus_6" value
goto "Set_Status"
[Set_Status]
if vV_Status_Fermentor == 0
vS_Status_Fermentor = "Unknown"
endif
if vV_Status_Fermentor == 1
vS_Status_Fermentor = "Fermenting"
endif
if vV_Status_Fermentor == 2
vS_Status_Fermentor = "Available"
endif
if vV_Status_Fermentor == 3
vS_Status_Fermentor = "Clean"
endif
if vV_Status_Fermentor == 4
vS_Status_Fermentor = "Sanitized"
endif
if vV_Status_Fermentor == 5
vS_Status_Fermentor = "Ready"
endif
if vV_Status_Fermentor == 6
vS_Status_Fermentor = "Dirty"
endif
//Update _Fermentors
	if vB_5 == true
		goto "5_Skip"
	endif
		if vB_4 == true
		goto "4_Skip"
	endif
		if vB_3 == true
		goto "3_Skip"
	endif
		if vB_2 == true
		goto "2_Skip"
	endif
	if vB_1 == true
		goto "1_Skip"
	endif
[Update_Status]	
"gblS_Status_Fermentor_1" value = vS_Status_Fermentor
vB_1 = true
goto "LoopStatus"
[1_Skip]
"gblS_Status_Fermentor_2" value = vS_Status_Fermentor
vB_2 = true
goto "LoopStatus"
[2_Skip]
"gblS_Status_Fermentor_3" value = vS_Status_Fermentor
vB_3 = true
goto "LoopStatus"
[3_Skip]
"gblS_Status_Fermentor_4" value = vS_Status_Fermentor
vB_4 = true
goto "LoopStatus"
[4_Skip]
"gblS_Status_Fermentor_5" value = vS_Status_Fermentor
vB_5 = true
goto "LoopStatus"
[5_Skip]
	"gblS_Status_Fermentor_6" value = vS_Status_Fermentor
	goto "Skip_6"
[Skip_6]
//Script is Done
print "Ended inscpt_scrFermentorStatus"
"sw_Running_FermentorStatus" state = false
clear
stop "inscpt_scrFermentorStatus"
```

## 150. inscpt_scrHiddenTimer10SecondDelay

Starts by itself: No · User can start or stop it: Yes · 9 lines

```text
// MIT License Granted
//Copyright © OakBarn Brewery 2026
"tm_Hidden_1" type = countdown
stop "tm_Hidden_1"
"tm_Hidden_1" value = 00:00:10
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
stop "inscpt_scrHiddenTimer10SecondDelay"
```

## 151. inscpt_scrHiddenTimer5SecondDelay

Starts by itself: No · User can start or stop it: Yes · 10 lines

```text
// MIT License Granted
//Copyright © OakBarn Brewery 2026
"tm_Hidden_1" type = countdown
stop "tm_Hidden_1"
"tm_Hidden_1" value = 00:00:05
start "tm_Hidden_1"
wait "tm_Hidden_1" value <= 00:00:00
stop "tm_Hidden_1"
stop "inscpt_scrHiddenTimer5SecondDelay"
```

## 152. inscpt_scrRestoreTop_1

Starts by itself: No · User can start or stop it: Yes · 46 lines

```text
// inscpt_scrRestoreTop_1
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//07/10/2026 11:40
// MODIFIED 07/10/2026 11:41
new value  vV_Endless_Loop
new string vS_Save_Text
new string  vS_Save_Visibility
new value vV_Save_Background
new value vV_Save_Inspector
new value vV_Save_Arrow_Background
new string  vS_Save_Arrow_Visibility
new string vS_Save_Label_Text
new value vV_Save_Label_Background
new string  vS_Save_Label_Visibility
//.........................................................................
vV_Endless_Loop = "gblVEndlessLoop" value
vS_Save_Text = "gblS_Brewery_Top_1" value
vS_Save_Visibility = "gblS_Brewery_Top_1" visibility
vV_Save_Background = "gblS_Brewery_Top_1"  background
vV_Save_Inspector = "gblV_Set_BackGround_Middle_Time" value
vV_Save_Inspector = "gblV_Set_BackGround_Middle_Time" value
 vV_Save_Arrow_Background = "insp_Pix_ArrowAllSwitch_B1" background
 vS_Save_Arrow_Visibility = "insp_Pix_ArrowAllSwitch_B1" visibility
vS_Save_Label_Text = "gblS_swAllSwitch_Label_Text" value
vV_Save_Label_Background = "gblS_swAllSwitch_Label_Text" background
vS_Save_Label_Visibility = "gblS_swAllSwitch_Label_Text" visibility
//......................................................................................................................
"gblVEndlessLoop" value = 0
wait  "gblVEndlessLoop" value == 1.1
 "gblVEndlessLoop" value = vV_Endless_Loop
"gblS_Brewery_Top_1" value = vS_Save_Text 
 "gblS_Brewery_Top_1" visibility = vS_Save_Visibility 
"gblS_Brewery_Top_1"  background = vV_Save_Background 
 "gblV_Set_BackGround_Middle_Time" value = vV_Save_Inspector 
 "insp_Pix_ArrowAllSwitch_B1" background = vV_Save_Arrow_Background 
"insp_Pix_ArrowAllSwitch_B1" visibility = vS_Save_Arrow_Visibility 
"gblS_swAllSwitch_Label_Text" value = vS_Save_Label_Text 
"gblS_swAllSwitch_Label_Text" background = vV_Save_Label_Background  
"gblS_swAllSwitch_Label_Text" visibility = vS_Save_Label_Visibility 
clear
 stop "inscpt_scrRestoreTop_1"
```

## 153. inscpt_scrBrewChoiceOpen

Starts by itself: No · User can start or stop it: Yes · 27 lines

```text
//inscpt_scrBrewChoiceOpen
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// 06/23/2026 17:39
//Modified  06/22/2026 17:15
//............................................................................
"sw_Running_Choice_BrewChoiceOpen" state = true
if "sw_Running_Choice_Number" state == false
goto "Close_Choice"
endif
//...............................................................
start "inscpt_scrSet_Middle_Backgrounds"
sleep 100
"gblS_Brewery_Top_2" background = 1
"gblSReportLabel_B1"  background = 1
"gblVReport_B1"  background = 1
"gblS_Brewery_Top_2" visibility = visible
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = visible
goto "End_Choice"
[Close_Choice]
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
[End_Choice]
"sw_Running_Choice_BrewChoiceOpen" state = false
stop "inscpt_scrBrewChoiceOpen"
```

## 154. inscpt_scrClearB1_Brewery

Starts by itself: No · User can start or stop it: Yes · 65 lines

```text
//inscpt_scrClearB1_Brewery
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//06/14/2023 11:50
// Clears B1 Brewery called from a different script
//.........................
"sw_Running_Clear_B1" state = true
"sw_Flow_Burner_BK_Lit" visibility = hidden
"gblS_Brewery_Top_1" visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
"tm_Action_TopRight_B1" visibility = hidden
//tm_DisplayTopRight_B1
"tm_Delay_TopRight_B1" visibility = hidden
"tm_Action_TopRight_B1" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"insp_Float" visibility = hidden
"gblS_Brewery_Bottom_1" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" visibility = hidden
//.....................................
"tm_Display_BottomRight_B1" visibility = hidden
"tm_Action_BottomRight_B1" visibility = hidden
"tmBottomRight_B1" visibility = hidden
//.............................................
"MB_28_do_ManualAlarm_B1" visibility = hidden
"MB_61_10kWortOut_B1" visibility = hidden
"gblV_PitchSetpoint_B1" visibility = hidden
"gblV_DeltaP1_B1" visibility = hidden
"MB_54_10K_Cool_B1" visibility = hidden
"MB_67_sm6004_BK_Temp_B1" visibility = hidden
"MB_68_sm6004_HLT_Temp_B1" visibility = hidden
//.............................................
stop "tm_Delay_TopRight_B1"
"tm_Delay_TopRight_B1" type = countdown
"tm_Delay_TopRight_B1" displayname = "Short Delay"
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" type = countdown
"tm_Display_BottomRight_B1" displayname = "Short Delay"
//.........................................................
"gblS_Brewery_Top_1" background = 1
"gblS_Brewery_Top_2" background = 1
"gblS_Brewery_Top_3" background = 1
"sw_Flow_Burner_BK_Lit" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"sw_Advance_ BrewStatus" background = 1
"sw_Advance_Endless" background = 1
"sw_Advance_Overide" background = 1 
"gblS_BrewName_B1" background = 1 
"gblSReportLabel_B1" background = 1 
"gblS_Brewery_Bottom_1" background = 1
"gblVReport_B1" background = 1
"gblS_Brewery_Bottom_4" background = 1
"gblS_Brewery_Bottom_3" background = 1
"insp_Float" visibility = hidden
//End
"sw_Running_Clear_B1" state = false
stop "inscpt_scrClearB1_Brewery"
```

## 155. inscpt_scrShortDelay

Starts by itself: No · User can start or stop it: Yes · 88 lines

```text
//inscpt_scrShortDelay
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//06/17/2026 18:33
// Does a ShortDelay
//Short Delay  vT_Short_Delay
"sw_Running_Short_Delay_Time" state = true
"sw_Running_Wait_Delay" state = true
//........................................................
new string vS_Delay
new string vS_Delay1
new string vS_Delay_DisplayName
new time vT_Short_Delay 
new value vV_Seconds
vV_Seconds = "gblV_Delay_Seconds" value
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_Endless" visibility = hidden
//.......................................................
//........................................................
	if  vV_Seconds == 3
		vT_Short_Delay = 00:00:03
	endif
	if  vV_Seconds == 4
		vT_Short_Delay = 00:00:03
	endif
	if  vV_Seconds == 5
		vT_Short_Delay = 00:00:05
	endif
	if  vV_Seconds == 07
		vT_Short_Delay = 00:00:07
	endif
	if  vV_Seconds == 10
		vT_Short_Delay = 00:00:10
	endif
	if  vV_Seconds == 15
		vT_Short_Delay = 00:00:15
	endif
	if  vV_Seconds == 20
		vT_Short_Delay = 00:00:20
	endif
	if  vV_Seconds == 30
		vT_Short_Delay = 00:00:30
	endif
	if  vV_Seconds == 45
		vT_Short_Delay = 00:00:45
	endif
	if  vV_Seconds == 60
		vT_Short_Delay = 00:01:00
	endif

vS_Delay_DisplayName = vV_Seconds
vS_Delay = "Short Delay: "
vS_Delay1 = vS_Delay_DisplayName 
vS_Delay = vS_Delay + vS_Delay1
vS_Delay1 = " Seconds"
vS_Delay = vS_Delay + vS_Delay1
"tm_Display_BottomRight_B1" displayname = vS_Delay
"gblS_swAllSwitch_Label_Text"  value = vS_Delay
//........................................
//Inspector_Blue
"gblV_Set_BackGround_Middle_Time" value = 3
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//Backgrounds
"gblS_swAllSwitch_Label_Text"  background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Visibilty
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" value = vT_Short_Delay 
"tm_Display_BottomRight_B1" type = countdown
"tm_Display_BottomRight_B1"  visibility = visible
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1"  visibility = visible
wait "tm_Display_BottomRight_B1" value <= 00:00:00
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = hidden
"gblS_Brewery_Top_1" value = "Wait"
"gblS_Brewery_Bottom_1" visibility = hidden
"gblS_swAllSwitch_Label_Text" visibility = hidden
clear
"sw_Running_Short_Delay_Time" state = false
//............................................................
[End_Short_Delay]
stop "inscpt_scrShortDelay"
```

## 156. inscpt_scrStopScriptManifold

Starts by itself: No · User can start or stop it: Yes · 14 lines

```text
// inscpt_scrStopScriptManifold
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//08/29/2026 08:51
//Modified 08/29/2026 08:51
// Kills Several Scripts
stop "sub_scrManifold_Choice"
stop  "sub_3_scrCalculateSPG"
stop "sub_2_scrValveOperation"
stop  "sub_2_scrPrimeandBasicManifold"
stop "sub_4_scrVolume_to_Time_TRANFER_SPG"
stop "sub_scrTimeorVolume"
[end_stop_Manifold_Scripts]
stop "inscpt_scrStopScriptManifold"
```

## 157. inscpt_BigMacTimer

Starts by itself: No · User can start or stop it: Yes · 14 lines

```text
// MIT License Granted
//Copyright © OakBarn Brewery 2026
new time vT_Caluculated_Time
vT_Caluculated_Time = "gblT_SetTimer_Water" value
"tmBigMac_B1" type = countup
"tmBigMac_B1" value = 00:00:00
"tmBigMac_B1" displayname = "Big Mac Fill"
"tmBigMac_B1"  visibility = visible
//.....................................................
"tm_Action_BottomRight_B1" type = countdown
"tm_Action_BottomRight_B1" value = vT_Caluculated_Time
"tm_Action_BottomRight_B1" displayname = "Big Mac Fill"
"tm_Action_BottomRight_B1"  visibility = visible
stop "inscpt_BigMacTimer"
```

## 158. inscpt_RadiatorTimer

Starts by itself: No · User can start or stop it: Yes · 14 lines

```text
// MIT License Granted
//Copyright © OakBarn Brewery 2026
new time vT_Caluculated_Time
vT_Caluculated_Time = "gblT_SetTimer_Water" value
"tmRadiator_B1" type = countup
"tmRadiator_B1" value = 00:00:00
"tmRadiator_B1" displayname = "Radiator Fill"
"tmRadiator_B1"  visibility = visible
//.....................................................
"tm_Action_BottomRight_B1" type = countdown
"tm_Action_BottomRight_B1" value = vT_Caluculated_Time
"tm_Action_BottomRight_B1" displayname = "Radiator Fill"
"tm_Action_BottomRight_B1"  visibility = visible
stop "inscpt_RadiatorTimer"
```

## 159. utility_FireHose_Manifold_Supply_Water

Starts by itself: No · User can start or stop it: Yes · 593 lines

```text
// utility_FireHose_Manifold_Supply_Water
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//07/27/2023 11:56
// All Fire Hose and Manifold Suplly Valve Water on the Fly 
//broken from scrWater 05/27/2051
// MODIFIED 06/27/2026 17:23
//...............................................
new string vSMsg
new string vSMsg1
new value vVSwitchNumber
new value vV_GBrew_Status
new string vSTimerDisplayName
new value vVPump
new string vSVesselFrom
new string vS_Label
new string vS_Timer_Type
new time vT_Set
start "utility_sub_Water_Visible"
sleep 100
start "utility_sub_RestoreAfterWater"
start "inscpt_scrAlarm"
sleep 500
vVSwitchNumber = "gblV_Water_Switch_Status_Water" value
vV_GBrew_Status = "gblV_Brew_Status" value
"gblV_Saved_Brew_Status" value = vV_GBrew_Status
print "@16 Water Valve = "
print vVSwitchNumber
if vVSwitchNumber == -9999
	goto "End_FMS_Water"
endif
if vVSwitchNumber == 999
	goto "End_FMS_Water"
endif
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_30_do_FireHose_On_B1"state = false
print "@ 37 start utility_sub_WaterSetHide"
start "utility_sub_WaterSetHide"
"sw_Advance_Endless" visibility = hidden
//Background Black
"insp_FireHosePix"  background = 3
"insp_Water_Gusher" background = 3
//.................................................
// B1 Brewery Left value ...................................
"gblS_BrewName_B1" value = "gblS_BeerName_R1" value
"gblS_Brewery_Top_2" value = "Wait! Will Auto Advance "
"gblS_Brewery_Top_3" value = "Wait! Will Auto Advance "
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance "
"gblS_Brewery_Bottom_3" value = "Wait! Will Auto Advance "
"gblS_Brewery_Bottom_4" value = "Wait! Will Auto Advance "
"gblS_Brewery_Bottom_1" value = "Wait! Will Auto Advance "
// B1 Brewery Left background.................................
"gblS_Brewery_Top_2" background = 3
"gblS_Brewery_Top_3" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_Brewery_Bottom_3" background = 3
"gblS_Brewery_Bottom_4" background = 3
"gblS_Brewery_Bottom_1" background = 3
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
"gblS_Water_Text_1_Water" visibility = hidden
//.................................................
"gblS_Brewery_Top_3" value = "Wait! Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait! Will Auto Advance"
"gblS_Brewery_Top_3" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
//...........................................
//Set Water Valve Status
//FireHose
if vVSwitchNumber  > 999
if vVSwitchNumber  < 2000
print "@ 92 Firehose Timers"
vSVesselFrom = "Fire Hose"
vVPump = 200
vSTimerDisplayName = "Firehose Timer"
vS_Label = "Get Fire Hose Ready!"
vS_Timer_Type = "countdown"
"gblV_Water_Switch_Status_Water"  value = -1
vSMsg = "Fire Hose ON for "
"insp_FireHosePix"  background = 1
goto "Timed_FireHose"
endif
endif
//...........................................
if vVSwitchNumber  > 1999
if vVSwitchNumber  < 3000
vSVesselFrom = "Manifold Supply Valve"
vVPump = 100
vSTimerDisplayName = "Manifold Supply On"
vS_Timer_Type = "countdown"
vSMsg = "Manifold Supply Valve ON for "
"insp_Water_Gusher" background = 1
goto "Manifold_Timed"
endif
endif
//..............................................
[Timed_FireHose]
print "@ 119  Timed_FireHose"
"gblVEndlessLoop" value = 799
[SectionFMS3]
wait "gblVEndlessLoop" value == 799
"gblS_Brewery_Top_3" value = "You may set the Manifold Manually how the transfer should be as needed. The Firehose can be used without setting any additional valves.  Simply set the manifold to the desired configuration by clicking on a valve to toggle between On and Off. You are the Safety and Control."
"gblS_Brewery_Bottom_3" value = "The Brewery Pane and Valves will be restored to the way they were prior."
"gblS_swAllSwitch_Label_Text" value = "Manifold Set?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"sw_Advance_Endless" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Endless" visibility = visible
[SectionFMS4]
wait "gblVEndlessLoop" value == 800
//FireHose 1 minutes
if vVSwitchNumber == 1001
vT_Set = 00:01:00
vSMsg1 = " One Minute. It will shut off when timer reaches 00:00:00!"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "FireHose on for 1 Minute"
goto "Delay_FireHose"
endif
//FireHose 2 minutes
if vVSwitchNumber == 1002
vT_Set = 00:02:00
vSMsg1 = " Two Minutes. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
goto "Delay_FireHose"
endif
//FireHose 20 Seconds
if vVSwitchNumber == 1003
vT_Set = 00:00:20
vSMsg1 = " Twenty Seconds. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
goto "Delay_FireHose"
endif
//Firehose Set Time
if vVSwitchNumber == 1004
show workspace "Water"
"gblT_SetTimer_Water" value = 00:00:00
"gblT_SetTimer_Water" visibility = visible
"insp_Water_Gusher" background = 2
"insp_Water_Gusher" visibility = visible
"insp_FireHosePix" background = 2
"insp_FireHosePix" visibility = visible
"gblS_Water_Text_1_Water" value = "Set the desired Run Time in the Set Timer slot."
"insp_WaterCoverRight" visibility = visible
"gblS_Water_Text_1_Water"  visibility = visible
"tm_Water" visibility = hidden
"gblT_SetTimer_Water" value = 00:00:00
"gblS_Water_Text_1_Water" visibility = visible
"insp_Water_Gusher" background = 3
"insp_FireHosePix" background = 1
wait "gblT_SetTimer_Water" value  > 00:00:00
show workspace "B1 Brewery"
vT_Set = "gblT_SetTimer_Water" value
vSMsg1 = " "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vT_Set
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
goto "Delay_FireHose"
endif
if vVSwitchNumber == 1005
vT_Set = 00:00:00
vSMsg1 = " The Firehose will be on until the FireHose Float is made.  A Timer will start and count up.  Click OverRide? to shut off the Firehose!"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "OverRide?"
vSTimerDisplayName = "Fire Hose Float"
goto "Delay_FireHose"
endif
//................................................................
[Delay_FireHose]
print "@ 204 Delay_FireHose"
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"gblS_Brewery_Top_3" visibility = hidden
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" displayname = "FireHose Delay!"
"tm_Display_BottomRight_B1" value = 00:00:20
"tm_Display_BottomRight_B1" type = countdown
"gblS_Brewery_Top_2" value = "FireHose ON in 20 Seconds!"
"MB_28_do_ManualAlarm_B1" displayname = "Firehose"
"gblS_swAllSwitch_Label_Text" value = "Get Fire Hose Ready!"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"MB_28_do_ManualAlarm_B1" background = 3
"gblS_Brewery_Top_2" background = 3
"gblS_Brewery_Bottom_4"  background = 2
"gblS_Brewery_Top_2" visibility = visible
start "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1"  visibility = visible
"MB_28_do_ManualAlarm_B1" state = true
"alm_Sound_2_W1" fileindex = 2
"alm_Sound_2_W1" loop = true
"alm_Sound_2_W1" active = true
wait "tm_Display_BottomRight_B1" value <= 00:00:10
//Inspector Black
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 1
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" value = "FireHose ON in 10 Seconds!"
"gblS_Brewery_Bottom_4" visibility = visible
wait "tm_Display_BottomRight_B1" value <= 00:00:05
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_Brewery_Top_2" value = "FireHose ALMOST On!"
"gblS_Brewery_Bottom_4" visibility = hidden
wait "tm_Display_BottomRight_B1" value <= 00:00:00
stop "tm_Display_BottomRight_B1"
"gblS_Brewery_Top_2" visibility = hidden
"tm_Display_BottomRight_B1" visibility = hidden
"MB_28_do_ManualAlarm_B1" state = false
"alm_Sound_2_W1" active = false
"MB_28_do_ManualAlarm_B1" displayname = "Manually"
"MB_28_do_ManualAlarm_B1" background = 1
"tm_Display_BottomRight_B1" visibility = hidden
if vVSwitchNumber == 1005
goto "Start_Timer_Floats"
endif
goto "Start_Timers"
//..............................................
[Manifold_Timed] 
print "@ 256 Manifold Timed"
vS_Label = "Manifold Supply Valve will Open!"
"gblVEndlessLoop" value = 899
[SectionFMS1]
wait "gblVEndlessLoop" value == 899
"gblS_Brewery_Top_3" value = "You need to set the Manifold Manually how the transfer should be.  Simply set the manifold to the desired configuration by clicking on a valve to toggle between On and Off.  You are the Safety and Control."
"gblS_Brewery_Bottom_3" value = "The Brewery Pane and Valves will be restored to the way they were prior."
"gblS_swAllSwitch_Label_Text" value = "Manifold Set?"
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//.........................................
//Background
"gblS_Brewery_Bottom_3" background = 1
"insp_Pix_ArrowAllSwitch_B1" background = 1
"gblS_swAllSwitch_Label_Text" background = 1
"sw_Advance_Endless" background = 1
// Visibility
"gblS_Brewery_Top_3" visibility = visible
"gblS_Brewery_Bottom_3" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Endless" visibility = visible
[SectionFMS2]
wait "gblVEndlessLoop" value == 900
//Manifold 1 minute
if vVSwitchNumber == 2001
vT_Set = 00:01:00
vSMsg1 = " One Minute. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_Brewery_Top_3" visibility = visible
goto "Delay_Manifold"
endif
//Manifold 2 minute
if vVSwitchNumber == 2002
vT_Set = 00:02:00
vSMsg1 = " Two Minutes. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_Brewery_Top_3" visibility = visible
goto "Delay_Manifold"
endif
//Manifold 3 minute
if vVSwitchNumber == 2003
vT_Set = 00:03:00
vSMsg1 = " Three Minutes. "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_Brewery_Top_3" visibility = visible
goto "Delay_Manifold"
endif
if vVSwitchNumber == 2004
show workspace "Water"
"gblT_SetTimer_Water" value = 00:00:00
"gblT_SetTimer_Water" visibility = visible
"insp_Water_Gusher" background = 2
"insp_Water_Gusher" visibility = visible
"insp_FireHosePix" background = 2
"insp_FireHosePix" visibility = visible
"gblS_Water_Text_1_Water" value = "Set the desired Run Time in the Set Timer slot."
"insp_WaterCoverRight" visibility = visible
"gblS_Water_Text_1_Water"  visibility = visible
"tm_Water" visibility = hidden
"gblT_SetTimer_Water" value = 00:00:00
"gblS_Water_Text_1_Water" visibility = visible
wait "gblT_SetTimer_Water" value  > 00:00:00
"insp_Water_Gusher" background = 1
"insp_FireHosePix" background = 3
show workspace "B1 Brewery"
vT_Set = "gblT_SetTimer_Water" value
vSMsg1 = " "
vSMsg = vSMsg + vSMsg1
vSMsg1 = vT_Set
vSMsg = vSMsg + vSMsg1
vSMsg1 = ". "
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
goto "Delay_Manifold"
endif
if vVSwitchNumber == 2005
vT_Set = 00:00:00
vSMsg1 = " The Manifold Supply Valve will be open until the Main Brewery Float is made.  A Timer will start and count up.  Click OverRide? to shut the Manifold Supply Valve!"
vSMsg = vSMsg + vSMsg1
"gblS_Brewery_Top_3" value = vSMsg
"gblS_swAllSwitch_Label_Text" value = "OverRide?"
vSTimerDisplayName = "Main Brewery Float"
goto "Delay_Manifold"
endif
[Delay_Manifold]
print "@ 342 Delay Manifold"
"sw_Advance_ BrewStatus" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_Endless" visibility = hidden
show Workspace "B1 Brewery"
"gblS_Brewery_Top_3" visibility = hidden
"tm_Display_BottomRight_B1" displayname = "Manifold Supply Valve Delay!"
"gblS_Brewery_Top_2" value = "Manifold Supply Valve ON in 20 Seconds!"
"gblS_swAllSwitch_Label_Text" value = "Get Fire Hose Ready!"
"MB_28_do_ManualAlarm_B1" displayname = "Manifold Supply Valve"
"gblS_swAllSwitch_Label_Text" value = "Manifold Supply Valve will Open!"
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" value = 00:00:20
"tm_Display_BottomRight_B1" type = countdown
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
//Background
"MB_28_do_ManualAlarm_B1" background = 2
"gblS_Brewery_Top_2" background = 3
"gblS_Brewery_Bottom_4"  background = 2
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"tm_Display_BottomRight_B1"  visibility = visible
"gblS_Brewery_Top_2" visibility = visible
start "tm_Display_BottomRight_B1"
"MB_28_do_ManualAlarm_B1" state = true
"alm_Water_Flow" fileindex = 1
"alm_Water_Flow" loop = true
"alm_Water_Flow" active = true
wait "tm_Display_BottomRight_B1" value <= 00:00:10
//Inspector Black
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 1
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = hidden
"gblS_Brewery_Bottom_4" value = "Manifold Supply Valve ON in 10 Seconds!"
"gblS_Brewery_Bottom_4" visibility = visible
wait "tm_Display_BottomRight_B1" value <= 00:00:05
// Inspector Red
"insp_1_LeftMiddle_B1" visibility = hidden
"insp_2_LeftMiddle_B1" background = 1
"insp_2_LeftMiddle_B1" visibility = visible
"gblS_Brewery_Top_2" visibility = visible
"gblS_Brewery_Top_2" value = "Manifold Supply Valve ALMOST On!"
"gblS_Brewery_Bottom_4" visibility = hidden
"gblS_Brewery_Bottom_3" visibility = visible
wait "tm_Display_BottomRight_B1" value <= 00:00:00
stop "tm_Display_BottomRight_B1" 
"tm_Display_BottomRight_B1"visibility = hidden
"gblS_Brewery_Top_2" visibility = hidden
"tm_Display_BottomRight_B1" visibility = hidden
"MB_28_do_ManualAlarm_B1" state = false
"alm_Water_Flow" active = false
"MB_28_do_ManualAlarm_B1" displayname = "Manually"
"MB_28_do_ManualAlarm_B1" background = 1
"tm_Display_BottomRight_B1" visibility = hidden
if vVSwitchNumber == 2005
goto "Start_Timer_Floats"
endif
goto "Start_Timers"
[Start_Timers]
"tm_Display_BottomRight_B1"  visibility = hidden
print "@ 395 Start Timers"
"gblT_SetTimer_Water" value = vT_Set
"tm_Water" value = vT_Set
"tm_Action_BottomRight_B1" value = vT_Set
"tm_Action_BottomRight_B1" displayname = vSTimerDisplayName
"tm_Action_BottomRight_B1" type = countdown
"tm_Water" displayname = vSTimerDisplayName
"tm_Water" type = countdown
"tm_Water" visibility = visible
"tm_Display_BottomRight_B1" visibility = hidden
"tm_Water_Up" value = 00:00:00
"tm_Water" value = vT_Set
"tm_Action_BottomRight_B1" value = vT_Set
"tm_Water" visibility = visible
"tm_Action_BottomRight_B1" visibility = visible
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = hidden
start "tm_Water"
start "tm_Water_Up"
start "tm_Action_BottomRight_B1"
//................................................................
if vVSwitchNumber < 1005
// FireHose
"VGC_30_do_FireHose_On_B1" state = true
goto "Timer_End"
endif
// Manifold Supply Valve
if vVSwitchNumber < 2005
"VGC_36_do_ManifoldFill_On_B1" state = true
goto "Timer_End"
endif
//................................................................
[Start_Timer_Floats]
"tm_Display_BottomRight_B1"  visibility = hidden
print "@ 458 Start Timers for floats"
"gblT_SetTimer_Water" value = vT_Set
"tm_Water" value = vT_Set
"tm_Action_BottomRight_B1" value = vT_Set
"tm_Action_BottomRight_B1" displayname = vSTimerDisplayName
"tm_Action_BottomRight_B1" type = countup
"tm_Water" displayname = vSTimerDisplayName
"tm_Water" type = countup
"tm_Water" visibility = visible
"tm_Display_BottomRight_B1" visibility = hidden
"tm_Water_Up" value = 00:00:00
"tm_Water" value = vT_Set
"tm_Action_BottomRight_B1" value = vT_Set
"tm_Water" visibility = visible
"tm_Action_BottomRight_B1" visibility = visible
stop "tm_Display_BottomRight_B1"
"tm_Display_BottomRight_B1" visibility = hidden
start "tm_Water"
start "tm_Water_Up"
start "tm_Action_BottomRight_B1"
if vVSwitchNumber == 1005
vVPump = 200
"VGC_30_do_FireHose_On_B1" state = true
goto "Loop_Float_Made"
endif
if vVSwitchNumber == 2005
vVPump = 100
"VGC_36_do_ManifoldFill_On_B1" state = true
goto "Loop_Float_Made"
endif
[Loop_Float_Made]
sleep 100
if "MB_40_di_Brewery_Float_Water" value ==  On
goto "Exit_Timer_End"
endif
if "MB_41_di_Manifold_Float_Water" value ==  On
goto "Exit_Timer_End"
endif
if "sw_Advance_Endless state" == true
"sw_Advance_Endless" state = false
goto "Exit_Timer_End"
endif
goto "Loop_Float_Made"
//....................................
//....................................
[Timer_End]
print "@ 426 Timer End"
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
//...............................................
"sw_Advance_Endless" background = 3
"gblS_swAllSwitch_Label_Text" background = 3
"insp_Pix_ArrowAllSwitch_B1" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Over Ride?"
"insp_Pix_ArrowAllSwitch_B1" visibility = visible
"gblS_swAllSwitch_Label_Text"  visibility = visible
"gblS_Brewery_Top_3" visibility = visible
"sw_Advance_Endless" visibility = visible
"gblVEndlessLoop" value = 999
[Loop_Timer_End]
sleep 100
if  "tm_Action_BottomRight_B1"  value <= 00:00:00
goto "Exit_Timer_End"
endif
if  "tm_Water" value  <= 00:00:00
goto "Exit_Timer_End"
endif
if "gblVEndlessLoop" value == 1000
goto "Exit_Timer_End"
endif
goto "Loop_Timer_End"
[Exit_Timer_End]
print "@ 454 Exit_Timer_End"
stop "tm_Water"
stop "tm_Water_Up"
stop "tm_Action_BottomRight_B1"
"tm_Action_BottomRight_B1" visibility = hidden
"tm_Display_BottomRight_B1" visibility = hidden
if vVPump == 100
"VGC_36_do_ManifoldFill_On_B1" state = false
endif
if vVPump == 200
"VGC_30_do_FireHose_On_B1" state = false
endif
[End_FMS_Water]
print "@465 END"
start "inscpt_scrAlarm"
sleep 500
"MB_28_do_ManualAlarm_B1" state = false
"insp_FireHosePix" visibility = hidden
"insp_Water_Gusher" visibility = hidden
"gblT_SetTimer_Water" visibility = hidden
"gblS_Water_Text_1_Water" visibility = hidden
"insp_WaterCoverRight" visibility = hidden
"tm_Display_BottomRight_B1" visibility = hidden
//  Blue Wait Between
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
"sw_Advance_Endless" visibility = hidden
"gblSReportLabel_B1" visibility = hidden 
"gblVReport_B1" visibility = hidden 
//.........................................
"gblV_Brew_Status" value = vV_GBrew_Status
"gblV_Water_Switch_Status_Water" value = -9999
//end
 "gblV_Water_Flow_Wo1" value = 5
clear
"VGC_36_do_ManifoldFill_On_B1" state = false
"VGC_30_do_FireHose_On_B1"state = false
start "inscpt_scrAlarm"
start "utility_sub_WaterSetHide"
stop "utility_FireHose_Manifold_Supply_Water"
```

## 160. utility_sub_RestoreAfterWater

Starts by itself: No · User can start or stop it: Yes · 501 lines

```text
// utility_sub_RestoreAfterWater
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//07/27/2023 11:56
//Broken from scrWater on 04/13/26 @ 12:04
// Restore All Except Heat After Water 
[Set_Testing]
"sw_Running_Script_D" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
//.......................................................
"gblV_Valve_Status" value = 0
new value vV_Count
new value vV_ValveSwitcher 
vV_ValveSwitcher =  "gblV_Water_Switch_Status_Water" value
//B1 Brewery text
// Create  Variable Texts Values
new string vS_B1_Top_Left_value
new string vS_BrewMessageText1_B1_value
new string vS_Pix_ArrowAllSwitch_B1_value
new string vS_swAllSwitch_Label_Text_value
new string vS_ReportLabel_B1_value
new string vS_VReport_B1_value
new string vS_3TextBottomLeft_B1_value
new string vS_BrewStateText_B1_value
new string vS_BigMacWarning_B1_value
new string vS_Top_Left_Valves_B1_value
// Create  Variable Texts Background
new value vV_B1_Top_Left_background
new value vV_BrewMessageText1_B1_background
new value vV_Pix_ArrowAllSwitch_B_background
new value vV_swAllSwitch_Label_Text_background
new value vV_ReportLabel_B1_background
new value vV_VReport_B1_background
new value vV_3TextBottomLeft_B1_background
new value vV_BrewStateText_B1_background
new value vV_BigMacWarning_B1_background
new value vV_Top_Left_Valves_B1_background
new value vV_insp_1_background
new value vV_insp_2_background
// Create  Variable Texts Visibility
new string vS_B1_Top_Left_visibility
new string vS_BrewMessageText1_B1_visibility
new string vS_Pix_ArrowAllSwitch_B1_visibility
new string vS_swAllSwitch_Label_Text_visibility
new string vS_sw_Advance_ BrewStatus_visibility
new string vS_sw_Advance_Overide_visibility
new string vS_ReportLabel_B1_visibility
new string vS_VReport_B1_visibility
new string vS_3TextBottomLeft_B1_visibility
new string vS_BrewStateText_B1_visibility
new string vS_BigMacWarning_B1_visibility
new string vS_Top_Left_Valves_B1_visibility
new string vS_insp_1_visibility
new string vS_insp_2_visibility// Beer name save 
new string vSBeerNameSave
vSBeerNameSave = "gblS_BrewName_B1" value
// Set Texts Values
vS_B1_Top_Left_value = "gblS_Brewery_Top_2" value 
vS_BrewMessageText1_B1_value = "gblS_Brewery_Top_3" value
vS_swAllSwitch_Label_Text_value = "gblS_swAllSwitch_Label_Text" value
vS_ReportLabel_B1_value = "gblSReportLabel_B1" value
vS_VReport_B1_value = "gblVReport_B1" value
vS_3TextBottomLeft_B1_value = "gblS_Brewery_Bottom_3" value
vS_BrewStateText_B1_value = "gblS_Brewery_Bottom_4" value
vS_BigMacWarning_B1_value = "gblS_Brewery_Bottom_1" value
vS_Top_Left_Valves_B1_value = "gblS_Brewery_Top_1" value
//Set Texts Background
vV_B1_Top_Left_background = "gblS_Brewery_Top_2" background 
vV_BrewMessageText1_B1_background = "gblS_Brewery_Top_3" background
vV_Pix_ArrowAllSwitch_B_background = "insp_Pix_ArrowAllSwitch_B1" background
vV_swAllSwitch_Label_Text_background = "gblS_swAllSwitch_Label_Text" background
vV_ReportLabel_B1_background = "gblSReportLabel_B1" background
vV_VReport_B1_background = "gblVReport_B1" background
vV_3TextBottomLeft_B1_background = "gblS_Brewery_Bottom_3" background
vV_BrewStateText_B1_background = "gblS_Brewery_Bottom_4" background
vV_BigMacWarning_B1_background = "gblS_Brewery_Bottom_1" background
vV_Top_Left_Valves_B1_background = "gblS_Brewery_Top_1" background
vV_insp_1_background = "insp_1_LeftMiddle_B1" background
vV_insp_2_background = "insp_2_LeftMiddle_B1" background
//Set Texts Visibility
vS_B1_Top_Left_visibility = "gblS_Brewery_Top_2" visibility 
vS_BrewMessageText1_B1_visibility = "gblS_Brewery_Top_3" visibility
vS_Pix_ArrowAllSwitch_B1_visibility = "insp_Pix_ArrowAllSwitch_B1" visibility
vS_swAllSwitch_Label_Text_visibility = "gblS_swAllSwitch_Label_Text" visibility
vS_sw_Advance_ BrewStatus_visibility = "sw_Advance_BrewStatus" visibility
vS_sw_Advance_Overide_visibility = "sw_Advance_Overide" visibility
vS_ReportLabel_B1_visibility = "gblSReportLabel_B1" visibility
vS_VReport_B1_visibility = "gblVReport_B1" visibility
vS_3TextBottomLeft_B1_visibility = "gblS_Brewery_Bottom_3" visibility
vS_BrewStateText_B1_visibility = "gblS_Brewery_Bottom_4" visibility
vS_BigMacWarning_B1_visibility = "gblS_Brewery_Bottom_1" visibility
vS_Top_Left_Valves_B1_visibility = "gblS_Brewery_Top_1" visibility
 vS_insp_1_visibility = "insp_1_LeftMiddle_B1" visibility 
 vS_insp_2_visibility = "insp_2_LeftMiddle_B1" visibility
//Valves
new bool vBStatus_Yellow_Pump_Valve
new bool vBStatus_LittleMac_Tangental_Valve
new bool vBStatus_LittleMac_Isolation_Valve
new bool vBStatus_Red_Pump_Valve
new bool vBStatus_BK_Tangental_Valve
new bool vBStatus_BK_Isolation_Valve
new bool vBStatus_Blue_Pump_Valve
new bool vBStatus_HERMsWORT_Valve
new bool vBStatus_Right_MLT_Isolation_Valve
new bool vBStatus_Left_MLT_Isolation_Valve
new bool vBStatus_Green_Pump_Valve
new bool vBStatus_Radiator_Tangental_Valve
new bool vBStatus_RadiatorSupply_Valve
new bool vBStatus_White_Pump_Valve
new bool vBStatus_BigMac_Tangental_Valve
new bool vBStatus_BigMac_Isolation_Valve
new bool vBStatus_Back_Manifold_Valve
new bool vBStatus_Ferment_Fill_Valve
new bool vBStatus_Cooling_Valve
new bool vBStatus_Crossflow_Valve
new bool vBStatus_Back_Drain_Valve
new bool vBStatus_Manifold_Supply_Valve
new bool vBStatus_Back_Drain_Valve_Water
new bool vBStatus_Back_Manifold_Valve 
new bool vBStatus_Manifold_Supply_Valve_Water
//Pumps
new bool vBStatus_YellowPump
new bool vBStatus_RedPump
new bool vBStatus_BluePump
new bool vBStatus_GreenPump
new bool vBStatus_WhitePump
new bool vBStatus_YellowPump_Water
new bool vBStatus_RedPump_Water
new bool vBStatus_BluePump_Water
new bool vBStatus_GreenPump_Water
new bool vBStatus_WhitePump_Water
//Heat
new bool vB_BigMac_Heat
new bool vB_Rad_Heat
new bool vB_RIMs_Heat
new bool vB_BigMac_Heat_Water
new bool vB_Rad_Heat_Water
new bool vB_RIMs_Heat_Water
// Bottom Timer
new time vT_Bottom_Value_1
new time vT_Bottom_Value_2
new string vS_Bottom_type
new string vS_Bottom_DisplayName
new bool vB_Bottom_Running
new string vS_Bottom_Visibility
//Valves Set
vBStatus_Yellow_Pump_Valve = "VGC_15_do_YellowPumpValve_On_B1" state
vBStatus_LittleMac_Tangental_Valve = "VGC_25_do_LittleMacTangental_ON_B1" state
vBStatus_LittleMac_Isolation_Valve = "VGC_17_do_LittleMacIsolation_On_B1" state
vBStatus_Red_Pump_Valve = "VGC_3_do_RedPumpValve_On_B1" state
vBStatus_BK_Tangental_Valve = "VGC_19_do_BrewKettleTangental_On_B1" state
vBStatus_BK_Isolation_Valve = "VGC_41_do_BrewKettleIsolation_On_B1" state
vBStatus_Blue_Pump_Valve = "VGC_8_do_BluePumpValve_On_B1" state
vBStatus_HERMsWORT_Valve = "VGC_13_do_HermsWort_On_B1" state
vBStatus_Right_MLT_Isolation_Valve = "VGC_26_do_Right_MLT_Isolation_On_B1" state
vBStatus_Left_MLT_Isolation_Valve = "VGC_7_do_Left_MLT_Isolation_On_B1" state
vBStatus_Radiator_Tangental_Valve = "VGC_45_do_RadiatorTangental_On_B1" state
vBStatus_RadiatorSupply_Valve = "VGC_32_do_RadiatorSupply_On_B1" state
vBStatus_White_Pump_Valve = "VGC_49_do_WhitePumpValve_On_B1" state
vBStatus_BigMac_Tangental_Valve = "VGC_47_do_BigMacTangental_On_B1" state
vBStatus_BigMac_Isolation_Valve = "VGC_34_do_BigMac_Isolation_On_B1" state
vBStatus_Ferment_Fill_Valve = "VGC_5_do_FermentFill_On_B1" state
vBStatus_Cooling_Valve = "VGC_43_do_CoolingWater_On_B1" state
vBStatus_Crossflow_Valve = "VGC_28_do_CrossManifold_On_B1" state
vBStatus_Back_Manifold_Valve = "VGC_23_do_BackManifold_Left_On_B1" state
vBStatus_Back_Drain_Valve = false
vBStatus_Manifold_Supply_Valve = "VGC_36_do_ManifoldFill_On_B1" state
//Pumps Set
vBStatus_YellowPump = "MB_35_do_YellowPump_B1" state
vBStatus_RedPump = "MB_36_do_RedPump_B1" state
vBStatus_BluePump = "MB_33_do_BluePump_B1" state
vBStatus_GreenPump = "MB_34_do_GreenPump_B1" state
vBStatus_WhitePump = "MB_32_do_WhitePump_B1" state
//Heat Set
vB_BigMac_Heat = "sw_Control_BigMac_Element" state 
vB_RIMs_Heat = "MB_19_do_RIMS_Radiator_Control_B1" state
vB_Rad_Heat = "sw_Control_Radiator_Element" state
"gblV_Water_Flow_Wo1" value = 4
//.............................................
wait  "gblV_Water_Flow_Wo1" value == 5
"gblS_Brewery_Bottom_3" visibility = hidden
//Pumps set for Water
vBStatus_YellowPump_Water = "MB_35_do_YellowPump_B1" state
vBStatus_RedPump_Water = "MB_36_do_RedPump_B1" state
vBStatus_BluePump_Water = "MB_33_do_BluePump_B1" state
vBStatus_GreenPump_Water = "MB_34_do_GreenPump_B1" state
vBStatus_WhitePump_Water = "MB_32_do_WhitePump_B1" state
//Heat Set for Water
vB_BigMac_Heat_Water = "sw_Control_BigMac_Element" state 
vB_RIMs_Heat_Water = "MB_19_do_RIMS_Radiator_Control_B1" state
vB_Rad_Heat_Water = "sw_Control_Radiator_Element" state
//Valves Set for Water
vBStatus_Back_Drain_Valve_Water = false
vBStatus_Manifold_Supply_Valve_Water = "VGC_36_do_ManifoldFill_On_B1" state
//Valves Reset
"VGC_15_do_YellowPumpValve_On_B1" state = vBStatus_Yellow_Pump_Valve
"VGC_25_do_LittleMacTangental_ON_B1" state = vBStatus_LittleMac_Tangental_Valve 
"VGC_17_do_LittleMacIsolation_On_B1" state = vBStatus_LittleMac_Isolation_Valve 
"VGC_3_do_RedPumpValve_On_B1" state = vBStatus_Red_Pump_Valve
"VGC_19_do_BrewKettleTangental_On_B1" state = vBStatus_BK_Tangental_Valve 
"VGC_41_do_BrewKettleIsolation_On_B1" state = vBStatus_BK_Isolation_Valve
"VGC_8_do_BluePumpValve_On_B1" state = vBStatus_Blue_Pump_Valve 
"VGC_13_do_HermsWort_On_B1" state = vBStatus_HERMsWORT_Valve 
"VGC_26_do_Right_MLT_Isolation_On_B1" state = vBStatus_Right_MLT_Isolation_Valve
"VGC_7_do_Left_MLT_Isolation_On_B1" state = vBStatus_Left_MLT_Isolation_Valve
"VGC_45_do_RadiatorTangental_On_B1" state = vBStatus_Radiator_Tangental_Valve
"VGC_32_do_RadiatorSupply_On_B1" state = vBStatus_RadiatorSupply_Valve 
"VGC_49_do_WhitePumpValve_On_B1" state = vBStatus_White_Pump_Valve 
"VGC_47_do_BigMacTangental_On_B1" state = vBStatus_BigMac_Tangental_Valve 
"VGC_34_do_BigMac_Isolation_On_B1" state = vBStatus_BigMac_Isolation_Valve 
"VGC_23_do_BackManifold_Left_On_B1" state = vBStatus_Back_Manifold_Valve 
"VGC_39_Back_Drain_On_B1" state = false
"VGC_5_do_FermentFill_On_B1" state = vBStatus_Ferment_Fill_Valve 
"VGC_43_do_CoolingWater_On_B1" state = vBStatus_Cooling_Valve 
"VGC_28_do_CrossManifold_On_B1" state = vBStatus_Crossflow_Valve
//.............................................................
"gblS_Brewery_Top_1" value = "Wait!. Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait!. Will Auto Advance"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
[Back_Drain]
vV_Count = 1
// print "@ 221 Back Drain"
if vBStatus_Back_Drain_Valve == true 
if vBStatus_Back_Drain_Valve_Water ==  false
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = "The Back Drain was open but is now closed.  Consider opeaning it up manually.  Wait!  Will Auto Advance."
goto "Valve_Short_Delay"
endif
endif
[Manifold_Supply_Valve]
vV_Count = 0
// print "@ 232 Manifold_Supply_Valve"
if vBStatus_Manifold_Supply_Valve == true
if vBStatus_Manifold_Supply_Valve_Water == false
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = "The Manifold Supply Valve was Opean but is now closed.  Consider Opeaning again manually.  Wait!  Will Auto Advance."
goto "Valve_Short_Delay"
endif
endif
	if vV_Count == 0
	goto "White_Pump"
	endif
[Valve_Short_Delay]
// print "@ 245 Valve_Short_Delay"
"gblS_Brewery_Top_1" visibility = visible
//......................................
// 5 Second Delay
"gblV_Delay_Seconds" value = 5
//"gblV_Set_BackGround_Middle_Time" value = 1
//"gblS_swAllSwitch_Label_Text" value = "Something"
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
"gblS_Brewery_Top_1" visibility = hidden
	if vV_Count == 0
	goto "White_Pump"
	endif
	if vV_Count == 1
	goto "Manifold_Supply_Valve"
	endif
//Pumps Reset
[White_Pump]
"gblS_Brewery_Top_1" value = "Wait!. Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait!. Will Auto Advance"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
// print "@ 29381"
if vBStatus_WhitePump == true 
if vBStatus_WhitePump_Water == false
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = "The White Pump was on but was turned Off.  Consider turning it back on manually.  Wait!  Will Auto Advance."
goto "Pump_Short_Delay"
endif
endif
[Green_Pump]
// print "@ 291 Green Pump"
vV_Count = 2
if vBStatus_GreenPump == true 
if vBStatus_GreenPump_Water == false
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = "The Green Pump was on but was turned Off.  Consider turning it back on manually.  Wait!  Will Auto Advance."
goto "Pump_Short_Delay"
endif
endif
[Blue_Pump]
vV_Count = 3
// print "@ 303 Blue Pump"
if vBStatus_BluePump == true 
if vBStatus_BluePump_Water == false
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = "The Blue Pump was on but was turned Off.  Consider turning it back on manually.  Wait!  Will Auto Advance."
goto "Pump_Short_Delay"
endif
endif
[Red_Pump]
vV_Count = 4
// print "@ 314 Red Pump"
if vBStatus_RedPump == true
if vBStatus_RedPump_Water == false
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = "The Red Pump was on but was turned Off.  Consider turning it back on manually.  Wait!  Will Auto Advance."
goto "Pump_Short_Delay"
endif
endif
[Yellow_Pump]
vV_Count = 0
// print "@ 325 Yellow Pump"
if vBStatus_YellowPump == true
if vBStatus_YellowPump_Water == false 
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = "The Yellow Pump was on but was turned Off.  Consider turning it back on manually.  Wait!  Will Auto Advance."
goto "Pump_Short_Delay"
endif
endif
if vV_Count == 0
goto "Heat Set"
endif
[Pump_Short_Delay]
//...............................
// print "@ 339 Pump_Short_Delay"
"gblS_Brewery_Top_1" visibility = visible
//Short Delay  5 seconds displayed 
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
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
"gblS_Brewery_Top_1" visibility = hidden
	if vV_Count == 0
	goto "Heat Set"
	endif
	if vV_Count == 1
	goto "Green_Pump"
	endif
	if vV_Count == 2
	goto "Blue_Pump"
	endif
	if vV_Count == 3
	goto "Red_Pump"
	endif
	if vV_Count == 4
	goto "Yellow_Pump"
	endif
[Heat Set]
// print "@ 377 Heat Set"
"gblS_Brewery_Top_1" value = "Wait!. Will Auto Advance"
"gblS_swAllSwitch_Label_Text" value = "Wait!. Will Auto Advance"
"gblS_swAllSwitch_Label_Text" visibility = visible
"gblS_Brewery_Top_1" visibility = visible
"gblS_swAllSwitch_Label_Text" visibility = visible
[Big_Mac_Heat]
vV_Count = 1
// print "@ 385 Big Mac Heat"
if vB_BigMac_Heat == true
if vB_BigMac_Heat_Water == false
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = "The Big Mac Heaters were on but now are OFF.  Consider turning them back on manually.  Wait!  Will Auto Advance."
"gblS_Brewery_Top_1" visibility = visible
goto "Heat_Short_Delay"
endif
endif
[RIMs_Heat]
vV_Count = 2
// print "@ 397 RIMs Heat"
if vB_RIMs_Heat == true 

if vB_RIMs_Heat_Water == false
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = "The RIMs Heat was on but now is OFF.  Consider turning it back on manually.  Wait!  Will Auto Advance."
"gblS_Brewery_Top_1" visibility = visible
goto "Heat_Short_Delay"
endif
endif
[Radiator_Heat]
vV_Count = 0
// print "@ 423Radiator"
if vB_Rad_Heat == true 
if vB_Rad_Heat_Water == false
"gblS_Brewery_Top_1" background = 3
"gblS_Brewery_Top_1" value = "The Radiator Body Heat was on but now is OFF.  Consider turning it back on manually.  Wait!  Will Auto Advance."
"gblS_Brewery_Top_1" visibility = visible
goto "Heat_Short_Delay"
endif
endif
//...............................
	if vV_Count == 0
	goto "Restore_Texts"
	endif
	if vV_Count == 1
	goto "RIMs_Heat"
	endif
	if vV_Count == 2
	goto "Radiator_Heat"
	endif
[Heat_Short_Delay]
// print "@ 443 Heat_Short_Delay"
"gblS_Brewery_Top_1" visibility = visible
//Short Delay  5 seconds displayed 
//Inspector Blue
"insp_2_LeftMiddle_B1" visibility = hidden
"insp_1_LeftMiddle_B1" background = 3
"insp_1_LeftMiddle_B1" visibility = visible
"gblS_swAllSwitch_Label_Text" background = 3
"gblS_swAllSwitch_Label_Text"  value = "Wait!  Short Delay"
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
"gblS_Brewery_Top_1" visibility = hidden
	if vV_Count == 0
	goto "Restore_Texts"
	endif
	if vV_Count == 1
	goto "RIMs_Heat"
	endif
	if vV_Count == 2
	goto "Radiator_Heat"
	endif
[Restore_Texts]
 //print "@ 463 Testore Texts"
// Set Texts Values
"gblS_Brewery_Top_2" value = vS_B1_Top_Left_value
"gblS_Brewery_Top_3" value = vS_BrewMessageText1_B1_value 
"gblS_swAllSwitch_Label_Text" value = vS_swAllSwitch_Label_Text_value 
"gblSReportLabel_B1" value = vS_ReportLabel_B1_value 
"gblVReport_B1" value = vS_VReport_B1_value 
"gblS_Brewery_Bottom_3" value = vS_3TextBottomLeft_B1_value 
"gblS_Brewery_Bottom_4" value = vS_BrewStateText_B1_value 
"gblS_Brewery_Bottom_1" value = vS_BigMacWarning_B1_value 
 "gblS_Brewery_Top_1" value = vS_Top_Left_Valves_B1_value
//Set Texts Background
"gblS_Brewery_Top_2" background = vV_B1_Top_Left_background 
"gblS_Brewery_Top_3" background = vV_BrewMessageText1_B1_background 
"insp_Pix_ArrowAllSwitch_B1" background = vV_Pix_ArrowAllSwitch_B_background
"gblS_swAllSwitch_Label_Text" background = vV_swAllSwitch_Label_Text_background
 "gblSReportLabel_B1" background = vV_ReportLabel_B1_background 
"gblVReport_B1" background = vV_VReport_B1_background 
"gblS_Brewery_Bottom_3" background = vV_3TextBottomLeft_B1_background 
"gblS_Brewery_Bottom_4" background = vV_BrewStateText_B1_background 
"gblS_Brewery_Bottom_1" background = vV_BigMacWarning_B1_background 
 "gblS_Brewery_Top_1" background = vV_Top_Left_Valves_B1_background 
"insp_1_LeftMiddle_B1" background = vV_insp_1_background 
"insp_2_LeftMiddle_B1" background = vV_insp_2_background 
//Set Texts Visibility
"gblS_Brewery_Top_2" visibility = vS_B1_Top_Left_visibility
"gblS_Brewery_Top_3" visibility = vS_BrewMessageText1_B1_visibility 
"insp_Pix_ArrowAllSwitch_B1" visibility = vS_Pix_ArrowAllSwitch_B1_visibility 
"gblS_swAllSwitch_Label_Text" visibility = vS_swAllSwitch_Label_Text_visibility
"sw_Advance_ BrewStatus" visibility = vS_sw_Advance_ BrewStatus_visibility 
"sw_Advance_Overide" visibility = vS_sw_Advance_Overide_visibility 
"gblSReportLabel_B1" visibility = vS_ReportLabel_B1_visibility 
"gblVReport_B1" visibility = vS_VReport_B1_visibility 
"gblS_Brewery_Bottom_3" visibility = vS_3TextBottomLeft_B1_visibility 
"gblS_Brewery_Bottom_4" visibility = vS_BrewStateText_B1_visibility 
"gblS_Brewery_Bottom_1" visibility = vS_BigMacWarning_B1_visibility 
"gblS_Brewery_Top_1" visibility = vS_Top_Left_Valves_B1_visibility 
"insp_1_LeftMiddle_B1" visibility = vS_insp_1_visibility 
"insp_2_LeftMiddle_B1" visibility = vS_insp_2_visibility
//...............................................................................
"gblS_BrewName_B1" value = vSBeerNameSave
[enderRestore]
if "gblVCurrentRadiator_Volume" value > 0
"sw_Status_DeadSpace_Radiator" state = true
endif
"gblS_Inter_Script" value = "ended: sub_3_scrRestoreAfterWater"

if vB_Testing == true
sleep 4001
endif
clear
"gblV_Water_Flow_Wo1" value = 0
"sw_Running_Script_D" state  = false
stop "utility_sub_RestoreAfterWater"
```

## 161. utility_sub_WaterSetHide

Starts by itself: No · User can start or stop it: Yes · 17 lines

```text
//utility_sub_WaterSetHide
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//06/14/2023 12:15
// Clears Water Pane called from a different script
"insp_FireHosePix" visibility = hidden
"insp_Water_Gusher" visibility = hidden
"insp_GalToAdd" visibility = hidden
"insp_SetVolume" visibility = hidden
"gblT_SetTimer_Water" visibility = hidden
"gblV_Gals_to_Fill" value = 0
"insp_WaterCoverRight" visibility = hidden
"gblS_Water_Text_1_Water" visibility = hidden
"insp_ManifoldSet" visibility = hidden
"insp_Float" visibility = hidden
//end
stop "utility_sub_WaterSetHide"
```

## 162. utility_sub_Water_Visible

Starts by itself: No · User can start or stop it: Yes · 18 lines

```text
//utility_sub_Water_Visible
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//06/14/2023 18:39
// Clears Water Pane called from a different script
"insp_FireHosePix" visibility = visible
"insp_Water_Gusher" visibility = visible
"insp_GalToAdd" visibility = hidden
"insp_SetVolume" visibility = hidden
"gblT_SetTimer_Water" visibility = hidden
"gblV_Gals_to_Fill" value = 0
"insp_WaterCoverRight" visibility = visible
"gblS_Water_Text_1_Water" visibility = hidden
"insp_ManifoldSet" visibility = hidden
"insp_Float" visibility = hidden
//end
stop "utility_sub_Water_Visible"
```

## 163. utility_EmergencyOff

Starts by itself: No · User can start or stop it: Yes · 48 lines

```text
//utility_EmergencyOff Modified  260929
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//06/05/2024 07:45
//Modified 
// Burners
"MB_25_do_LittleMacBurner_B1" state = false
"MB_24_do_BrewKettleBurner_B1" state = false
"sw_Control_Burner_LittleMac" state = false
"MB_22_do_LittleMacIgnitor_Wo1" state = false
"MB_23_do_BrewKettleIgnitor_Wo1" state = false
"sw_Control_Burner_BK" state = false
"sw_Control_Burner_LittleMac_2B" state = false
//Valves
"VGC_30_do_FireHose_On_B1" state = false
"VGC_43_do_CoolingWater_On_B1" state = false
"VGC_36_do_ManifoldFill_On_B1" state = false
//Radiator Body Element
"MB_08_PWM_Radiator_WO1" enabled = false
"sw_Control_Radiator_Element" state = false
//RIMs
"MB_14_do_RIMs_Contactor_Heat" state = false
"MB_09_PWM_RIMs_Heat" enabled = false
"sw_Control_RIMs_Element" state = false
// Big Mac Heater
"MB_17_do_BigMac2Contactor_Wo1" state = false
"MB_05_PWM_BigMacElement2_WO1" enabled = false
"sw_Control_BigMac_Element" state = false
//Pumps & 12 vdc Widgets
"MB_35_do_YellowPump_B1" state = false
"MB_36_do_RedPump_B1" state = false
"MB_33_do_BluePump_B1" state = false
"MB_34_do_GreenPump_B1" state = false
"MB_32_do_WhitePump_B1" state = false
"MB_26_do_HotBreakFan_B1" state = false
//Others
"MB_05_Hys_BigMac_H" enabled = false
"MB_08_Duty_Radiator_H" enabled = false
"MB_08_Hys_RadiatorElement_Wo1" enabled = false
"sw_Set_Stop_Water" state = true
// Old
"oldMB_15_do_QuadzillaContactor_Wo1" state = false
"oldMB_07_PWM_Quadzilla_WO1" enabled = false
"oldMB_15_do_QuadzillaContactor_Wo1" state = false
"old_MB_02_Hys_BigMacElement2_WO1" enabled = false
"old_MB_02_Duty80_BigMacElement2_Wo1" enabled = false
start "inscpt_scrAlarm"
stop "utility_EmergencyOff"
```

## 164. scrWhitePump

Starts by itself: No · User can start or stop it: No · 2 lines

```text
print " started scr WhitePump"
stop "scrWhitePump"
```

## 165. scrYellowPump

Starts by itself: No · User can start or stop it: Yes · 2 lines

```text
print  "started tellow pump"
stop "scrYellowPump"
```

## 166. scrShow_Workspace_Data

Starts by itself: No · User can start or stop it: Yes · 8 lines

```text
//scrShow_Workspace_Data
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//03/18/2026 13:03
// Modified
show workspace "Data"
stop "scrShow_Workspace_Data"
```

## 167. scrShow_Time_Workspace

Starts by itself: No · User can start or stop it: Yes · 2 lines

```text
show workspace "Time"
stop "scrShow_Time_Workspace"
```

## 168. scr_Show_workapace_Script_Switches

Starts by itself: No · User can start or stop it: Yes · 7 lines

```text
//scr_Show_workapace_Script_Switches
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//03/18/2026 13:03
// Modified
show workspace "Script_Switches"
stop "scr_Show_workapace_Script_Switches"
```

## 169. scrFermentor_Default

Starts by itself: No · User can start or stop it: Yes · 18 lines

```text
//scrFermentor_Default
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//07/05/2026 16:50
//Modified  07/05/2026 16:50
"gblS_Fermentor_Name_1" value = "BrewBuilt 10 Gallon Peltier Conical"
"gblVFerment_Volume_1" value = 10.5
"gblS_Fermentor_Name_2" value = "SS Brewtech Half Barrel Coil Conical"
"gblVFerment_Volume_2" value = 15.8
"gblS_Fermentor_Name_3" value = "SS Brewtech 1 Barrel Jacketed Conical"
"gblVFerment_Volume_3" value = 32.0
"gblS_Fermentor_Name_4" value = "Northern Brewer SS Bucket"
"gblVFerment_Volume_4" value = 5.2
"gblS_Fermentor_Name_5" value = "Fermzilla Number One"
"gblVFerment_Volume_5" value = 5.2
"gblS_Fermentor_Name_6" value = "Fermzilla Number Two"
"gblVFerment_Volume_6" value = 5.2
Stop "scrFermentor_Default"
```

## 170. scrWater

Starts by itself: No · User can start or stop it: No · 10 lines

```text
new value VV_Switch
VV_Switch = "gblV_Water_Switch_Status_Water" value
print  VV_Switch 
show workspace "B1 Brewery"
"gblV_Valve_Status" value = 1000
start "sub_2_scrValveOperation"
wait "gblV_Valve_Status" value == 0
stop "scrWater"
```

## 171. scrFementor_Days

Starts by itself: No · User can start or stop it: Yes · 643 lines

```text

//scrFementor_Days
// MIT License Granted
//Copyright © OakBarn Brewery 2026
//06/05/2024 07:45
//Modified 
new value vV_Day
new value vV_Hour
new value vV_Min
new value vV_Seconds
new time vT_Day
new time vT_Hour
new time vT_Min
new time  vT_Seconds
new string vS_Time_Value
new time  vT_Time_Value
new string vS_Zero
new string vS_ZeroZero
 vS_Zero = "0"
vS_ZeroZero = "00"
[Start_Choice_Day]
"gblS_Brewery_Top_2" value = "Enter the Days of the Timer.  It may be a posivite number up to 30 or Zero. This is normally 0. if over 30, Brucontrol will"
"gblSReportLabel_B1" value = "Number of Days"
"gblVReport_B1" value = -1
"gblVReport_B1" precision = 0
"gblS_swAllSwitch_Label_Text" value = "0 to 30 Allowed"
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//BackGround
"gblS_Brewery_Top_2" background = 1 
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_BrewName_B1" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = visible
wait  "gblVReport_B1" value > -1
 vV_Days = "gblVReport_B1" value
"gblVReport_B1" value = 0
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................................................
[Start_Choice_Hour]
"gblS_Brewery_Top_2" value = "Enter the Hours of the Timer.  It may be a posivite number or Zero."
"gblSReportLabel_B1" value = "Number of minutes"
"gblVReport_B1" value = -1
"gblVReport_B1" precision = 0
"gblS_swAllSwitch_Label_Text" value = ""
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//BackGround
"gblS_Brewery_Top_2" background = 1 
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_BrewName_B1" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = visible
wait  "gblVReport_B1" value > -1
 vV_Hour = "gblVReport_B1" value
"gblVReport_B1" value = 0
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................................................
goto "Start_Choice_Min"
[Wrong_Choice_Min]
"gblS_Brewery_Top_2" value = "Choice not allowed.  Choose Minutes from 0 to 59 only!"
"gblS_Brewery_Top_2" background = 2
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
goto "Start_Choice_Min"
[Start_Choice_Min]
"gblS_Brewery_Top_2" value = "Enter the Minutes of the Timer.  It may be a posivite number less than 60 or Zero."
"gblSReportLabel_B1" value = "Number of minutes"
"gblVReport_B1" value = -1
"gblVReport_B1" precision = 0
"gblS_swAllSwitch_Label_Text" value = ""
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//BackGround
"gblS_Brewery_Top_2" background = 1 
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_BrewName_B1" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = visible
wait  "gblVReport_B1" value > -1
 vV_Min = "gblVReport_B1" value
"gblVReport_B1" value = 0
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................................................
goto "Start_Choice_Seconds"
[Wrong_Choice_Seconds]
"gblS_Brewery_Top_2" value = "Choice not allowed.  Choose Seconds  from 0 to 59 only!"
"gblS_Brewery_Top_2" background = 2
// 4 Second Delay
"gblV_Delay_Seconds" value = 4
start "inscpt_scrShortDelay"
sleep 100
wait "sw_Running_Short_Delay_Time" state == false
//........................................
goto "Start_Choice_Seconds"
[Start_Choice_Seconds]
"gblS_Brewery_Top_2" value = "Enter the Seconds of the Timer.  It may be a posivite number less than 60 or Zero."
"gblSReportLabel_B1" value = "Number of Seconds"
"gblVReport_B1" value = -1
"gblVReport_B1" precision = 0
"gblS_swAllSwitch_Label_Text" value = ""
//........................................
//Inspector_Red
"gblV_Set_BackGround_Middle_Time" value = 4
start "inscpt_scrSet_Middle_Backgrounds"
//........................................
//BackGround
"gblS_Brewery_Top_2" background = 1 
//Visibility
"gblS_Brewery_Top_2" visibility = visible
"gblS_BrewName_B1" visibility = hidden
"insp_Pix_ArrowAllSwitch_B1" visibility = hidden
"sw_Advance_Endless" visibility = hidden
"sw_Advance_Overide" visibility = hidden
"sw_Advance_ BrewStatus" visibility = hidden
"gblSReportLabel_B1" visibility = visible
"gblVReport_B1" visibility = visible
wait  "gblVReport_B1" value > -1
vV_Seconds = "gblVReport_B1" value
"gblVReport_B1" value = 0
"gblS_Brewery_Top_2" visibility = hidden
"gblSReportLabel_B1" visibility = hidden
"gblVReport_B1" visibility = hidden
//.......................................................................
if  vV_Day == 0
vT_Day = 00:00:00:00
endif
if  vV_Hour == 0
vT_Hour = 00:00:00:00
endif
if  vV_Min == 0
vT_Min =  00:00:00
endif



if  vV_Day == 0
vT_Day = 00:00:00:00
goto "Hours"
endif
if vT_Day == 1
vT_Day = 01:00:00:00
goto "Hours"
endif
if vT_Day == 2
vT_Day = 02:00:00:00
goto "Hours"
endif
if vT_Day == 3
vT_Day = 03:00:00:00
goto "Hours"
endif
if vT_Day == 4
vT_Day = 04:00:00:00
goto "Hours"
endif
if vT_Day == 5
vT_Day = 05:00:00:00
goto "Hours"
endif
if vT_Day == 6
vT_Day = 06:00:00:00
goto "Hours"
endif
if vT_Day == 7
vT_Day = 07:00:00:00
goto "Hours"
endif
if vT_Day == 8
vT_Day = 08:00:00:00
goto "Hours"
endif
if vT_Day == 9
vT_Day = 09:00:00:00
goto "Hours"
endif
if vT_Day == 10
vT_Day = 10:00:00:00
goto "Hours"
endif
if vT_Day == 11
vT_Day = 11:00:00:00
goto "Hours"
endif
if vT_Day == 12
vT_Day = 12:00:00:00
goto "Hours"
endif
if vT_Day == 13
vT_Day = 13:00:00:00
goto "Hours"
endif
if vT_Day == 14
vT_Day = 14:00:00:00
goto "Hours"
endif
if vT_Day == 15
vT_Day =15:00:00:00
goto "Hours"
endif
if vT_Day == 16
vT_Day = 16:00:00:00
goto "Hours"
endif
if vT_Day == 17
vT_Day = 17:00:00:00
goto "Hours"
endif
if vT_Day == 18
vT_Day = 18:00:00:00
goto "Hours"
endif
if vT_Day == 19
vT_Day = 19:00:00:00
goto "Hours"
endif
if vT_Day == 20
vT_Day = 20:00:00:00
goto "Hours"
endif
if vT_Day == 21
vT_Day = 21:00:00:00
goto "Hours"
endif
if vT_Day == 22
vT_Day = 22:00:00:00
goto "Hours"
endif
if vT_Day == 23
vT_Day = 23:00:00:00
goto "Hours"
endif
if vT_Day == 24
vT_Day = 24:00:00:00
goto "Hours"
endif
if vT_Day == 25
vT_Day =25:00:00:00
goto "Hours"
endif
if vT_Day == 26
vT_Day = 26:00:00:00
goto "Hours"
endif
if vT_Day == 27
vT_Day = 27:00:00:00
goto "Hours"
endif
if vT_Day == 28
vT_Day = 18:00:00:00
goto "Hours"
endif
if vT_Day == 29
vT_Day = 29:00:00:00
goto "Hours"
endif
if vT_Day == 30
vT_Day = 30:00:00:00
goto "Hours"
endif
[Hours] 
if  vV_Hour == 0
vT_Hour = 00:00:00:00
goto "Minutes"
endif
if vV_Hour == 1
vT_Hour = 00:01:00:00
goto "Minutes"
endif
if vV_Hour == 2
vT_Hour = 00:02:00:00
goto "Minutes"
endif
if vV_Hour == 3
vT_Hour = 00:03:00:00
goto "Minutes"
endif
if vV_Hour == 4
vT_Hour = 00:04:00:00
goto "Minutes"
endif
if vV_Hour == 5
vT_Hour = 00:05:00:00
goto "Minutes"
endif
if vV_Hour == 6
vT_Hour = 00:06:00:00
goto "Minutes"
endif
if vV_Hour == 7
vT_Hour = 00:07:00:00
goto "Minutes"
endif
if vV_Hour == 8
vT_Hour = 00:08:00:00
goto "Minutes"
endif
if vV_Hour == 9
vT_Hour = 00:09:00:00
goto "Minutes"
endif
if vV_Hour == 10
vT_Hour = 00:10:00:00
goto "Minutes"
endif
if vV_Hour == 11
vT_Hour = 00:11:00:00
goto "Minutes"
endif
if vV_Hour == 12
vT_Hour = 00:12:00:00
goto "Minutes"
endif
if vV_Hour == 13
vT_Hour = 00:13:00:00
goto "Minutes"
endif
if vV_Hour == 14
vT_Hour = 00:14:00:00
goto "Minutes"
endif
if vV_Hour == 15
vT_Hour = 00:15:00:00
goto "Minutes"
endif
if vV_Hour == 16
vT_Hour = 00:16:00:00
goto "Minutes"
endif
if vV_Hour == 17
vT_Hour = 00:17:00:00
goto "Minutes"
endif
if vV_Hour == 18
vT_Hour = 00:18:00:00
goto "Minutes"
endif
if vV_Hour == 19
vT_Hour = 00:19:00:00
goto "Minutes"
endif
if vV_Hour == 20
vT_Hour = 00:20:00:00
goto "Minutes"
endif
if vV_Hour == 21
vT_Hour = 00:211:00:00
goto "Minutes"
endif
if vV_Hour == 22
vT_Hour = 00:22:00:00
goto "Minutes"
endif
if vV_Hour == 23
vT_Hour = 00:23:00:00
goto "Minutes"
endif
[Minutes]
if  vV_Min == 5
vT_Min =  00:05:00
endif
[Seconds]
if vV_Seconds == 0
vT_Seconds = 00:00:00:00
goto "Calc_Time"
endif
if vV_Seconds== 1
vT_Seconds = 00:00:00:01
goto "Calc_Time"
endif
if vV_Seconds== 2
vT_Seconds = 00:00:00:02
goto "Calc_Time"
endif
if vV_Minr == 3
vT_Seconds = 00:00:00:03
goto "Calc_Time"
endif
if vV_Seconds== 4
vT_Seconds = 00:00:00:04
goto "Calc_Time"
endif
if vV_Seconds== 5
vT_Seconds = 00:00:00:05
goto "Calc_Time"
endif
if vV_Seconds== 6
vT_Seconds = 00:00:00:06
goto "Calc_Time"
endif
if vV_Seconds== 7
vT_Seconds = 00:00:00:07
goto "Calc_Time"
endif
if vV_Seconds== 8
vT_Seconds = 00:00:00:08
goto "Calc_Time"
endif
if vV_Seconds== 9
vT_Seconds = 00:00:00:09
goto "Calc_Time"
endif
if vV_Seconds== 10
vT_Seconds = 00:00:00:10
goto "Calc_Time"
endif
if vV_Seconds== 11
vT_Seconds = 00:00:00:11
goto "Calc_Time"
endif
if vV_Seconds== 12
vT_Seconds = 00:00:00:12
goto "Calc_Time"
endif
if vV_Seconds== 13
vT_Seconds = 00:00:00:13
goto "Calc_Time"
endif
if vV_Seconds== 14
vT_Seconds = 00:00:00:14
goto "Calc_Time"
endif
if vV_Seconds== 15
vT_Seconds = 00:00:00:15
goto "Calc_Time"
endif
if vV_Seconds== 16
vT_Seconds = 00:00:00:16
goto "Calc_Time"
endif
if vV_Seconds== 17
vT_Seconds = 00:00:00:17
goto "Calc_Time"
endif
if vV_Seconds== 18
vT_Seconds = 00:00:00:18
goto "Calc_Time"
endif
if vV_Seconds== 19
vT_Seconds = 00:00:00:19
goto "Calc_Time"
endif
if vV_Seconds== 20
vT_Seconds = 00:00:00:20
goto "Calc_Time"
endif
if vV_Seconds== 21
vT_Seconds = 00:00:00:21
goto "Calc_Time"
endif
if vV_Seconds== 22
vT_Seconds = 00:00:00:22
goto "Calc_Time"
endif
if vV_Seconds== 23
vT_Seconds = 00:00:00:23
goto "Calc_Time"
endif
if vV_Seconds== 24
vT_Seconds = 00:00:00:24
goto "Calc_Time"
endif
if vV_Seconds== 25
vT_Seconds = 00:00:00:25
goto "Calc_Time"
endif
if vV_Seconds== 26
vT_Seconds = 00:00:00:26
goto "Calc_Time"
endif
if vV_Seconds== 27
vT_Seconds = 00:00:00:27
goto "Calc_Time"
endif
if vV_Seconds== 28
vT_Seconds = 00:00:00:28
goto "Calc_Time"
endif
if vV_Seconds== 29
vT_Seconds = 00:00:00:29
goto "Calc_Time"
endif
if vV_Seconds== 30
vT_Seconds = 00:00:00:30
goto "Calc_Time"
endif
if vV_Seconds== 31
vT_Seconds = 00:00:00:31
goto "Calc_Time"
endif
if vV_Seconds== 32
vT_Seconds = 00:00:00:32
goto "Calc_Time"
endif
if vV_Seconds== 33
vT_Seconds = 00:00:00:33
goto "Calc_Time"
endif
if vV_Seconds== 34
vT_Seconds = 00:00:00:34
goto "Calc_Time"
endif
if vV_Seconds== 35
vT_Seconds = 00:00:00:35
goto "Calc_Time"
endif
if vV_Seconds== 36
vT_Seconds = 00:00:00:36
goto "Calc_Time"
endif
if vV_Seconds== 37
vT_Seconds = 00:00:00:37
goto "Calc_Time"
endif
if vV_Seconds== 38
vT_Seconds = 00:00:00:38
goto "Calc_Time"
endif
if vV_Seconds== 39
vT_Seconds = 00:00:00:39
goto "Calc_Time"
endif
if vV_Seconds== 40
vT_Seconds = 00:00:00:40
goto "Calc_Time"
endif
if vV_Seconds== 41
vT_Seconds = 00:00:00:41
goto "Calc_Time"
endif
if vV_Seconds== 42
vT_Seconds = 00:00:00:42
goto "Calc_Time"
endif
if vV_Seconds== 43
vT_Seconds = 00:00:00:43
goto "Calc_Time"
endif
if vV_Seconds== 44
vT_Seconds = 00:00:00:44
goto "Calc_Time"
endif
if vV_Seconds== 45
vT_Seconds = 00:00:00:45
goto "Calc_Time"
endif
if vV_Seconds== 46
vT_Seconds = 00:00:00:46
goto "Calc_Time"
endif
if vV_Seconds== 47
vT_Seconds = 00:00:00:47
goto "Calc_Time"
endif
if vV_Seconds== 48
vT_Seconds = 00:00:00:48
goto "Calc_Time"
endif
if vV_Seconds== 49
vT_Seconds = 00:00:00:49
goto "Calc_Time"
endif
if vV_Seconds== 50
vT_Seconds = 00:00:00:50
goto "Calc_Time"
endif
if vV_Seconds== 51
vT_Seconds = 00:00:00:51
goto "Calc_Time"
endif
if vV_Seconds== 52
vT_Seconds = 00:00:00:52
goto "Calc_Time"
endif
if vV_Seconds== 53
vT_Seconds = 00:00:00:53
goto "Calc_Time"
endif
if vV_Seconds== 54
vT_Seconds = 00:00:00:54
goto "Calc_Time"
endif
if vV_Seconds== 55
vT_Seconds = 00:00:00:55
goto "Calc_Time"
endif
if vV_Seconds== 56
vT_Seconds = 00:00:00:56
goto "Calc_Time"
endif
if vV_Seconds== 57
vT_Seconds = 00:00:00:57
goto "Calc_Time"
endif
if vV_Seconds== 58
vT_Seconds = 00:00:00:58
goto "Calc_Time"
endif
if vV_Seconds== 59
vT_Seconds = 00:00:00:59
goto "Calc_Time"
endif

[Calc_Time]

vT_Time_Value = vT_Day  + vT_Day 
vT_Time_Value = vT_Min  + vT_Seconds
print vT_Time_Value
stop "Script 7"
```

## 172. sub2_XMLImportBeer_Smith

Starts by itself: No · User can start or stop it: No · 960 lines

```text
//sub2_XMLImportBeer_Smith
//02/24/2024 08:01
// MIT License Granted
//Copyright © OakBarn Brewery 2026
// called @ 195 in sub1_Brew_0_1a_Normal_Brew
[Set_Testing]
"sw_Running_Script_C" state = true
new bool vB_Testing
vB_Testing = "sw_Status_Testing" state
//...................................
new value vV_Hop1Group_XML
new value vV_Hop2Group_XML
new value vV_Hop3Group_XML
new value vV_Hop4Group_XML
new value vV_Hop5Group_XML
new value vV_Hop6Group_XML
new value vV_Hop7Group_XML
new value vV_Hop8Group_XML
new value vV_Hop1Min_XML
new value vV_Hop2Min_XML
new value vV_Hop3Min_XML
new value vV_Hop4Min_XML
new value vV_Hop5Min_XML
new value vV_Hop6Min_XML
new value vV_Hop7Min_XML
new value vV_Hop8Min_XML
vV_Hop1Group_XML = "gblV_Hop1_Group_R1" value
vV_Hop2Group_XML = "gblV_Hop2_Group_R1" value
vV_Hop3Group_XML = "gblV_Hop3_Group_R1" value
vV_Hop4Group_XML = "gblV_Hop4_Group_R1" value
vV_Hop5Group_XML = "gblV_Hop5_Group_R1" value
vV_Hop6Group_XML = "gblV_Hop6_Group_R1" value
vV_Hop7Group_XML = "gblV_Hop7_Group_R1" value
vV_Hop8Group_XML = "gblV_Hop8_Group_R1" value
vV_Hop1Min_XML = "gblV_TimeHop1_Min_R1" value
vV_Hop2Min_XML = "gblV_TimeHop2_Min_R1" value
vV_Hop3Min_XML = "gblV_TimeHop3_Min_R1" value
vV_Hop4Min_XML = "gblV_TimeHop4_Min_R1" value
vV_Hop5Min_XML = "gblV_TimeHop5_Min_R1" value
vV_Hop6Min_XML = "gblV_TimeHop6_Min_R1" value
vV_Hop7Min_XML = "gblV_TimeHop7_Min_R1" value
vV_Hop8Min_XML = "gblV_TimeHop8_Min_R1" value
//Hop1
print "@41 Hop 1"
if vV_Hop1Group_XML != 0
"sw_Use_Hop1_Batch" state = true
else
"sw_Use_Hop1_Batch" state = false
"gblS_Hop1_R1" displayname = "Hop #1"
"insp_Name_Hop1" displayname = "Hop #1"
"gblS_Hop1_R1" background = 99
"insp_Name_Hop1" background = 99
"gblV_Hop1_Oz_R1" visibility = hidden
"gblV_Hop1_Recipe_AAU_R1" visibility = hidden
"gblV_Hop1_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop1_R1" visibility = hidden
"gblV_TimeHop1_Min_R1" visibility = hidden
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = hidden
endif
if "gblV_Hop1_Group_R1" value == -999
"gblS_Hop1_R1" displayname = "Hop #1 at 154 °F Whirlpool"
"insp_Name_Hop1" displayname = "Hop #1 at 154 °F Whirlpool"
"gblS_Hop1_R1" background = 3
"insp_Name_Hop1" background = 3
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = visible
"gblV_TimeHop1_Min_R1" value = 20
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop1_Batch" visibility = visible
"gblV_Hop1_Group_R1" visibility = hidden
endif
if "gblV_Hop1_Group_R1" value == -888
"gblS_Hop1_R1" displayname = "Hop #1 - Start of Boil"
"insp_Name_Hop1" displayname = "Hop #1 - Start of Boil"
"gblS_Hop1_R1" background = 2
"insp_Name_Hop1" background = 2
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = hidden
"gblV_TimeHop1_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = hidden
endif
if "gblV_Hop1_Group_R1" value == -444
"gblS_Hop1_R1" displayname = "Hop #1 - 1st WORT"	
"insp_Name_Hop1" displayname = "Hop #1 - 1st WORT"
"gblS_Hop1_R1" background = 2
"insp_Name_Hop1" background = 2
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = hidden
"gblV_TimeHop1_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = hidden
endif
if "gblV_Hop1_Group_R1" value == -333
"gblS_Hop1_R1" displayname = "Hop #1 - Top of Mash"
"insp_Name_Hop1" displayname = "Hop #1 - Top of Mash"
"gblS_Hop1_R1" background = 3
"insp_Name_Hop1" background = 3
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = hidden
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = hidden
endif
if "gblV_Hop1_Group_R1" value == -111
"gblS_Hop1_R1" displayname = "Hop #1 - Dry Hop"
"insp_Name_Hop1" displayname = "Hop #1 - Dry Hop"
"gblS_Hop1_R1" background = 1
"insp_Name_Hop1" background = 1
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = visible
"gblT_Hop1Drop_R1" visibility = hidden
"gblV_Hop1_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = hidden
endif
if "gblV_Hop1_Group_R1" value ==  919
"gblS_Hop1_R1" displayname = "Hop #1 - Boiling"
"insp_Name_Hop1" displayname = "Hop #1 - Boiling"
"gblS_Hop1_R1" background = 2
"insp_Name_Hop1" background = 2
"gblV_Hop1_Oz_R1" visibility = visible
"gblV_Hop1_Recipe_AAU_R1" visibility = visible
"gblV_Hop1_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop1_R1" visibility = visible
"gblV_TimeHop1_Min_R1" visibility = visible
"gblT_Hop1Drop_R1" visibility = visible
"gblV_Hop1_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop1_Batch" visibility = hidden
"gblV_Hop1_Group_R1" visibility = visible	
endif
//Hop2
print "@ 154  Hop 2"
if vV_Hop2Group_XML != 0
"sw_Use_Hop2_Batch" state = true
else
"sw_Use_Hop2_Batch" state = false
"gblS_Hop2_R1" displayname = "Hop #2"
"insp_Name_Hop2" displayname = "Hop #2"
"gblS_Hop2_R1" background = 99
"insp_Name_Hop2" background = 99
"gblV_Hop2_Oz_R1" visibility = hidden
"gblV_Hop2_Recipe_AAU_R1" visibility = hidden
"gblV_Hop2_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop2_R1" visibility = hidden
"gblV_TimeHop2_Min_R1" visibility = hidden
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = hidden
endif
if "gblV_Hop2_Group_R1" value == -999
"gblS_Hop2_R1" displayname = "Hop #2 at 154 °F Whirlpool"
"insp_Name_Hop2" displayname = "Hop #2 at 154 °F Whirlpool"
"gblS_Hop2_R1" background = 3
"insp_Name_Hop2" background = 3
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = visible
"gblV_TimeHop2_Min_R1" value = 20
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop2_Batch" visibility = visible
"gblV_Hop2_Group_R1" visibility = hidden
endif
if "gblV_Hop2_Group_R1" value == -888
"gblS_Hop2_R1" displayname = "Hop #2 - Start of Boil"
"insp_Name_Hop2" displayname = "Hop #2 - Start of Boil"
"gblS_Hop2_R1" background = 2
"insp_Name_Hop2" background = 2
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = hidden
"gblV_TimeHop2_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = hidden
endif
if "gblV_Hop2_Group_R1" value == -444
"gblS_Hop2_R1" displayname = "Hop #2 - 1st WORT"
"insp_Name_Hop2" displayname = "Hop #2 - 1st WORT"
"gblS_Hop2_R1" background = 2
"insp_Name_Hop2" background = 2
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = hidden
"gblV_TimeHop2_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = hidden	
endif
if "gblV_Hop2_Group_R1" value == -333
"gblS_Hop2_R1" displayname = "Hop #2 - Top of Mash"
"insp_Name_Hop2" displayname = "Hop #2 - Top of Mash"
"gblS_Hop2_R1" background = 3
"insp_Name_Hop2" background = 3
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = hidden
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = hidden
endif
if "gblV_Hop2_Group_R1" value == -111
"gblS_Hop2_R1" displayname = "Hop #2 - Dry Hop"
"insp_Name_Hop2" displayname = "Hop #2 - Dry Hop"
"gblS_Hop2_R1" background = 1
"insp_Name_Hop2" background = 1
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = visible
"gblT_Hop2Drop_R1" visibility = hidden
"gblV_Hop2_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = hidden
endif
if "gblV_Hop2_Group_R1" value ==  919
"gblS_Hop2_R1" displayname = "Hop #2 - Boiling"	
"insp_Name_Hop2" displayname = "Hop #2 - Boiling"
"gblS_Hop2_R1" background = 2
"insp_Name_Hop2" background = 2
"gblV_Hop2_Oz_R1" visibility = visible
"gblV_Hop2_Recipe_AAU_R1" visibility = visible
"gblV_Hop2_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop2_R1" visibility = visible
"gblV_TimeHop2_Min_R1" visibility = visible
"gblT_Hop2Drop_R1" visibility = visible
"gblV_Hop2_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop2_Batch" visibility = hidden
"gblV_Hop2_Group_R1" visibility = visible 
endif
//Hop3
print "@ 267 Hop 3"
if vV_Hop3Group_XML != 0
"sw_Use_Hop3_Batch" state = true
else
"sw_Use_Hop3_Batch" state = false
"gblS_Hop3_R1" displayname = "Hop #3"
"insp_Name_Hop3" displayname = "Hop #3"
"gblS_Hop3_R1" background = 99
"insp_Name_Hop3" background = 99
"gblV_Hop3_Oz_R1" visibility = hidden
"gblV_Hop3_Recipe_AAU_R1" visibility = hidden
"gblV_Hop3_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop3_R1" visibility = hidden
"gblV_TimeHop3_Min_R1" visibility = hidden
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = hidden
endif
if "gblV_Hop3_Group_R1" value == -999
"gblS_Hop3_R1" displayname = "Hop #3 at 154 °F Whirlpool"
"insp_Name_Hop3" displayname = "Hop #3 at 154 °F Whirlpool"
"gblS_Hop3_R1" background = 3
"insp_Name_Hop3" background = 3
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = visible
"gblV_TimeHop3_Min_R1" value = 20
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop3_Batch" visibility = visible
"gblV_Hop3_Group_R1" visibility = hidden
endif
if "gblV_Hop3_Group_R1" value == -888
"gblS_Hop3_R1" displayname = "Hop #3 - Start of Boil"
"insp_Name_Hop3" displayname = "Hop #3 - Start of Boil"
"gblS_Hop3_R1" background = 2
"insp_Name_Hop3" background = 2
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = hidden
"gblV_TimeHop3_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = hidden
endif
if "gblV_Hop3_Group_R1" value == -444
"gblS_Hop3_R1" displayname = "Hop #3 - 1st WORT"	
"insp_Name_Hop3" displayname = "Hop #3 - 1st WORT"
"gblS_Hop3_R1" background = 2
"insp_Name_Hop3" background = 2
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = hidden
"gblV_TimeHop3_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = hidden
endif
if "gblV_Hop3_Group_R1" value == -333
"gblS_Hop3_R1" displayname = "Hop #3 - Top of Mash"
"insp_Name_Hop3" displayname = "Hop #3 - Top of Mash"
"gblS_Hop3_R1" background = 3
"insp_Name_Hop3" background = 3
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = hidden
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = hidden
endif
if "gblV_Hop3_Group_R1" value == -111
"gblS_Hop3_R1" displayname = "Hop #3 - Dry Hop"
"insp_Name_Hop3" displayname = "Hop #3 - Dry Hop"
"gblS_Hop3_R1" background = 1
"insp_Name_Hop3" background = 1
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = visible
"gblT_Hop3Drop_R1" visibility = hidden
"gblV_Hop3_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = hidden
endif
if "gblV_Hop3_Group_R1" value ==  919
"gblS_Hop3_R1" displayname = "Hop #3 - Boiling"
"insp_Name_Hop3" displayname = "Hop #3 - Boiling"
"gblS_Hop3_R1" background = 2
"insp_Name_Hop3" background = 2
"gblV_Hop3_Oz_R1" visibility = visible
"gblV_Hop3_Recipe_AAU_R1" visibility = visible
"gblV_Hop3_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop3_R1" visibility = visible
"gblV_TimeHop3_Min_R1" visibility = visible
"gblT_Hop3Drop_R1" visibility = visible
"gblV_Hop3_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop3_Batch" visibility = hidden
"gblV_Hop3_Group_R1" visibility = visible 	
endif
//Hop4
print "@ 379  Hop 4"
if vV_Hop4Group_XML != 0
"sw_Use_Hop4_Batch" state = true
else
"sw_Use_Hop4_Batch" state = false
"gblS_Hop4_R1" displayname = "Hop #4"
"insp_Name_Hop4" displayname = "Hop #4"
"gblS_Hop4_R1" background = 99
"insp_Name_Hop4" background = 99
"gblV_Hop4_Oz_R1" visibility = hidden
"gblV_Hop4_Recipe_AAU_R1" visibility = hidden
"gblV_Hop4_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop4_R1" visibility = hidden
"gblV_TimeHop4_Min_R1" visibility = hidden
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = hidden
endif
if "gblV_Hop4_Group_R1" value == -999
"gblS_Hop4_R1" displayname = "Hop #4 at 154 °F Whirlpool"
"insp_Name_Hop4" displayname = "Hop #4 at 154 °F Whirlpool"
"gblS_Hop4_R1" background = 3
"insp_Name_Hop4" background = 3
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = visible
"gblV_TimeHop4_Min_R1" value = 20
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop4_Batch" visibility = visible
"gblV_Hop4_Group_R1" visibility = hidden
endif
if "gblV_Hop4_Group_R1" value == -888
"gblS_Hop4_R1" displayname = "Hop #4 - Start of Boil"
"insp_Name_Hop4" displayname = "Hop #4 - Start of Boil"
"gblS_Hop4_R1" background = 2
"insp_Name_Hop4" background = 2
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = hidden
"gblV_TimeHop4_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = hidden
endif
if "gblV_Hop4_Group_R1" value == -444
"gblS_Hop4_R1" displayname = "Hop #4 - 1st WORT"	
"insp_Name_Hop4" displayname = "Hop #4 - 1st WORT"
"gblS_Hop4_R1" background = 2
"insp_Name_Hop4" background = 2
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = hidden
"gblV_TimeHop4_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = hidden
endif
if "gblV_Hop4_Group_R1" value == -333
"gblS_Hop4_R1" displayname = "Hop #4 - Top of Mash"
"insp_Name_Hop4" displayname = "Hop #4 - Top of Mash"
"gblS_Hop4_R1" background = 3
"insp_Name_Hop4" background = 3
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = hidden
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = hidden
endif
if "gblV_Hop4_Group_R1" value == -111
"gblS_Hop4_R1" displayname = "Hop #4 - Dry Hop"
"insp_Name_Hop4" displayname = "Hop #4 - Dry Hop"
"gblS_Hop4_R1" background = 1
"insp_Name_Hop4" background = 1
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = visible
"gblT_Hop4Drop_R1" visibility = hidden
"gblV_Hop4_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = hidden
endif
if "gblV_Hop4_Group_R1" value ==  919
"gblS_Hop4_R1" displayname = "Hop #4 - Boiling"
"insp_Name_Hop4" displayname = "Hop #4 - Boiling"
"gblS_Hop4_R1" background = 2
"insp_Name_Hop4" background = 2
"gblV_Hop4_Oz_R1" visibility = visible
"gblV_Hop4_Recipe_AAU_R1" visibility = visible
"gblV_Hop4_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop4_R1" visibility = visible
"gblV_TimeHop4_Min_R1" visibility = visible
"gblT_Hop4Drop_R1" visibility = visible
"gblV_Hop4_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop4_Batch" visibility = hidden
"gblV_Hop4_Group_R1" visibility = visible 	
endif
//Hop5
print "@ 492  Hop 5"
if vV_Hop5Group_XML != 0
"sw_Use_Hop5_Batch" state = true
else
"sw_Use_Hop5_Batch" state = false
"gblS_Hop5_R1" displayname = "Hop #5"
"insp_Name_Hop5" displayname = "Hop #5"
"gblS_Hop5_R1" background = 99
"insp_Name_Hop5" background = 99
"gblV_Hop5_Oz_R1" visibility = hidden
"gblV_Hop5_Recipe_AAU_R1" visibility = hidden
"gblV_Hop5_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop5_R1" visibility = hidden
"gblV_TimeHop5_Min_R1" visibility = hidden
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = hidden
endif
if "gblV_Hop5_Group_R1" value == -999
"gblS_Hop5_R1" displayname = "Hop #5 at 154 °F Whirlpool"
"insp_Name_Hop5" displayname = "Hop #5 at 154 °F Whirlpool"
"gblS_Hop5_R1" background = 3
"insp_Name_Hop5" background = 3
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = visible
"gblV_TimeHop5_Min_R1" value = 20
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = visible
"gblV_Hop5_Group_R1" visibility = hidden
endif
if "gblV_Hop5_Group_R1" value == -888
"gblS_Hop5_R1" displayname = "Hop #5 - Start of Boil"
"insp_Name_Hop5" displayname = "Hop #5 - Start of Boil"
"gblS_Hop5_R1" background = 2
"insp_Name_Hop5" background = 2
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = hidden
"gblV_TimeHop5_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = hidden
endif
if "gblV_Hop5_Group_R1" value == -444
"gblS_Hop5_R1" displayname = "Hop #5 - 1st WORT"	
"insp_Name_Hop5" displayname = "Hop #5 - 1st WORT"
"gblS_Hop5_R1" background = 2
"insp_Name_Hop5" background = 2
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = hidden
"gblV_TimeHop5_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = hidden
endif
if "gblV_Hop5_Group_R1" value == -333
"gblS_Hop5_R1" displayname = "Hop #5 - Top of Mash"
"insp_Name_Hop5" displayname = "Hop #5 - Top of Mash"
"gblS_Hop5_R1" background = 3
"insp_Name_Hop5" background = 3
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = hidden
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = hidden
endif
if "gblV_Hop5_Group_R1" value == -111
"gblS_Hop5_R1" displayname = "Hop #5 - Dry Hop"
"insp_Name_Hop5" displayname = "Hop #5 - Dry Hop"
"gblS_Hop5_R1" background = 1
"insp_Name_Hop5" background = 1
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = visible
"gblT_Hop5Drop_R1" visibility = hidden
"gblV_Hop5_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = hidden
endif
if "gblV_Hop5_Group_R1" value ==  919
"gblS_Hop5_R1" displayname = "Hop #5 - Boiling"	
"insp_Name_Hop5" displayname = "Hop #5 - Boiling"
"gblS_Hop5_R1" background = 2
"insp_Name_Hop5" background = 2
"gblV_Hop5_Oz_R1" visibility = visible
"gblV_Hop5_Recipe_AAU_R1" visibility = visible
"gblV_Hop5_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop5_R1" visibility = visible
"gblV_TimeHop5_Min_R1" visibility = visible
"gblT_Hop5Drop_R1" visibility = visible
"gblV_Hop5_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop5_Batch" visibility = hidden
"gblV_Hop5_Group_R1" visibility = visible 
endif
//Hop6
print "@ 605  Hop 6"
if vV_Hop6Group_XML != 0
"sw_Use_Hop6_Batch" state = true
else
"sw_Use_Hop6_Batch" state = false
"gblS_Hop6_R1" displayname = "Hop #6"
"insp_Name_Hop6" displayname = "Hop #6"
"gblS_Hop6_R1" background = 99
"insp_Name_Hop6" background = 99
"gblV_Hop6_Oz_R1" visibility = hidden
"gblV_Hop6_Recipe_AAU_R1" visibility = hidden
"gblV_Hop6_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop6_R1" visibility = hidden
"gblV_TimeHop6_Min_R1" visibility = hidden
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = hidden
endif
if "gblV_Hop6_Group_R1" value == -999
"gblS_Hop6_R1" displayname = "Hop #6 at 154 °F Whirlpool"
"insp_Name_Hop6" displayname = "Hop #6 at 154 °F Whirlpool"
"gblS_Hop6_R1" background = 3
"insp_Name_Hop6" background = 3
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = visible
"gblV_TimeHop6_Min_R1" value = 20
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop6_Batch" visibility = visible
"gblV_Hop6_Group_R1" visibility = hidden
endif
if "gblV_Hop6_Group_R1" value == -888
"gblS_Hop6_R1" displayname = "Hop #6 - Start of Boil"
"insp_Name_Hop6" displayname = "Hop #6 - Start of Boil"
"gblS_Hop6_R1" background = 2
"insp_Name_Hop6" background = 2
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = hidden
"gblV_TimeHop6_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = hidden
endif
if "gblV_Hop6_Group_R1" value == -444
"gblS_Hop6_R1" displayname = "Hop #6 - 1st WORT"
"insp_Name_Hop6" displayname = "Hop #6 - 1st WORT"
"gblS_Hop6_R1" background = 2
"insp_Name_Hop6" background = 2
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = hidden
"gblV_TimeHop6_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = hidden	
endif
if "gblV_Hop6_Group_R1" value == -333
"gblS_Hop6_R1" displayname = "Hop #6 - Top of Mash"
"insp_Name_Hop6" displayname = "Hop #6 - Top of Mash"
"gblS_Hop6_R1" background = 3
"insp_Name_Hop6" background = 3
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = hidden
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = hidden
endif
if "gblV_Hop6_Group_R1" value == -111
"gblS_Hop6_R1" displayname = "Hop #6 - Dry Hop"
"insp_Name_Hop6" displayname = "Hop #6 - Dry Hop"
"gblS_Hop6_R1" background = 1
"insp_Name_Hop6" background = 1
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = visible
"gblT_Hop6Drop_R1" visibility = hidden
"gblV_Hop6_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = hidden
endif
if "gblV_Hop6_Group_R1" value ==  919
"gblS_Hop6_R1" displayname = "Hop #6 - Boiling"
"insp_Name_Hop6" displayname = "Hop #6 - Boiling"
"gblS_Hop6_R1" background = 2
"insp_Name_Hop6" background = 2
"gblV_Hop6_Oz_R1" visibility = visible
"gblV_Hop6_Recipe_AAU_R1" visibility = visible
"gblV_Hop6_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop6_R1" visibility = visible
"gblV_TimeHop6_Min_R1" visibility = visible
"gblT_Hop6Drop_R1" visibility = visible
"gblV_Hop6_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop6_Batch" visibility = hidden
"gblV_Hop6_Group_R1" visibility = visible	
endif
//Hop7
print "@ 719  Hop 7"
if vV_Hop7Group_XML != 0
"sw_Use_Hop7_Batch" state = true
else
"sw_Use_Hop7_Batch" state = false
"gblS_Hop7_R1" displayname = "Hop #7"
"insp_Name_Hop7" displayname = "Hop #7"
"gblS_Hop7_R1" background = 99
"insp_Name_Hop7" background = 99
"gblV_Hop7_Oz_R1" visibility = hidden
"gblV_Hop7_Recipe_AAU_R1" visibility = hidden
"gblV_Hop7_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop7_R1" visibility = hidden
"gblV_TimeHop7_Min_R1" visibility = hidden
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = hidden
endif
if "gblV_Hop7_Group_R1" value == -999
"gblS_Hop7_R1" displayname = "Hop #7 at 154 °F Whirlpool"
"insp_Name_Hop7" displayname = "Hop #7 at 154 °F Whirlpool"
"gblS_Hop7_R1" background = 3
"insp_Name_Hop7" background = 3
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = visible
"gblV_TimeHop7_Min_R1" value = 20
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop7_Batch" visibility = visible
"gblV_Hop7_Group_R1" visibility = hidden
endif
if "gblV_Hop7_Group_R1" value == -888
"gblS_Hop7_R1" displayname = "Hop #7 - Start of Boil"
"insp_Name_Hop7" displayname = "Hop #7 - Start of Boil"
"gblS_Hop7_R1" background = 2
"insp_Name_Hop7" background = 2
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = hidden
"gblV_TimeHop7_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = hidden
endif
if "gblV_Hop7_Group_R1" value == -444
"gblS_Hop7_R1" displayname = "Hop #7 - 1st WORT"	
"insp_Name_Hop7" displayname = "Hop #7 - 1st WORT"
"gblS_Hop7_R1" background = 2
"insp_Name_Hop7" background = 2
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = hidden
"gblV_TimeHop7_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = hidden
endif
if "gblV_Hop7_Group_R1" value == -333
"gblS_Hop7_R1" displayname = "Hop #7 - Top of Mash"
"insp_Name_Hop7" displayname = "Hop #7 - Top of Mash"
"gblS_Hop7_R1" background = 3
"insp_Name_Hop7" background = 3
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = hidden
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = hidden
endif
if "gblV_Hop7_Group_R1" value == -111
"gblS_Hop7_R1" displayname = "Hop #7 - Dry Hop"
"insp_Name_Hop7" displayname = "Hop #7 - Dry Hop"
"gblS_Hop7_R1" background = 1
"insp_Name_Hop7" background = 1
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = visible
"gblT_Hop7Drop_R1" visibility = hidden
"gblV_Hop7_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = hidden
endif
if "gblV_Hop7_Group_R1" value ==  919
"gblS_Hop7_R1" displayname = "Hop #7 - Boiling"
"insp_Name_Hop7" displayname = "Hop #7 - Boiling"
"gblS_Hop7_R1" background = 2
"insp_Name_Hop7" background = 2
"gblV_Hop7_Oz_R1" visibility = visible
"gblV_Hop7_Recipe_AAU_R1" visibility = visible
"gblV_Hop7_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop7_R1" visibility = visible
"gblV_TimeHop7_Min_R1" visibility = visible
"gblT_Hop7Drop_R1" visibility = visible
"gblV_Hop7_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop7_Batch" visibility = hidden
"gblV_Hop7_Group_R1" visibility = visible 	
endif
//Hop8
print "@ 832  Hop 8"
if vV_Hop8Group_XML != 0
"sw_Use_Hop8_Batch" state = true
else
"sw_Use_Hop8_Batch" state = false
"gblS_Hop8_R1" displayname = "Hop #8"
"insp_Name_Hop8" displayname = "Hop #8"
"gblS_Hop8_R1" background = 99
"insp_Name_Hop8" background = 99
"gblV_Hop8_Oz_R1" visibility = hidden
"gblV_Hop8_Recipe_AAU_R1" visibility = hidden
"gblV_Hop8_Actual_AAU_R1" visibility = hidden
"gblV_Oz_Calculated_Hop8_R1" visibility = hidden
"gblV_TimeHop8_Min_R1" visibility = hidden
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = hidden
endif
if "gblV_Hop8_Group_R1" value == -999
"gblS_Hop8_R1" displayname = "Hop #8 at 154 °F Whirlpool"
"insp_Name_Hop8" displayname = "Hop #8 at 154 °F Whirlpool"
"gblS_Hop8_R1" background = 3
"insp_Name_Hop8" background = 3
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = visible
"gblV_TimeHop8_Min_R1" value = 20
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop8_Batch" visibility = visible
"gblV_Hop8_Group_R1" visibility = hidden
endif
if "gblV_Hop8_Group_R1" value == -888
"gblS_Hop8_R1" displayname = "Hop #8 - Start of Boil"
"insp_Name_Hop8" displayname = "Hop #8 - Start of Boil"
"gblS_Hop8_R1" background = 2
"insp_Name_Hop8" background = 2
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = hidden
"gblV_TimeHop8_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = hidden
endif
if "gblV_Hop8_Group_R1" value == -444
"gblS_Hop8_R1" displayname = "Hop #8 - 1st WORT"	
"insp_Name_Hop8" displayname = "Hop #8 - 1st WORT"
"gblS_Hop8_R1" background = 2
"insp_Name_Hop8" background = 2
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = hidden
"gblV_TimeHop8_Min_R1" value = "gblVBoilTime_Minutes" value
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = hidden
endif
if "gblV_Hop8_Group_R1" value == -333
"gblS_Hop8_R1" displayname = "Hop #8 - Top of Mash"
"insp_Name_Hop8" displayname = "Hop #8 - Top of Mash"
"gblS_Hop8_R1" background = 3
"insp_Name_Hop8" background = 3
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = hidden
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = hidden
endif
if "gblV_Hop8_Group_R1" value == -111
"gblS_Hop8_R1" displayname = "Hop #8 - Dry Hop"
"insp_Name_Hop8" displayname = "Hop #8 - Dry Hop"
"gblS_Hop8_R1" background = 1
"insp_Name_Hop8" background = 1
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = visible
"gblT_Hop8Drop_R1" visibility = hidden
"gblV_Hop8_Calc_IBU_R1" visibility = hidden
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = hidden
endif
if "gblV_Hop8_Group_R1" value ==  919
"gblS_Hop8_R1" displayname = "Hop #8 - Boiling"
"insp_Name_Hop8" displayname = "Hop #8 - Boiling"
"gblS_Hop8_R1" background = 2
"insp_Name_Hop8" background = 2
"gblV_Hop8_Oz_R1" visibility = visible
"gblV_Hop8_Recipe_AAU_R1" visibility = visible
"gblV_Hop8_Actual_AAU_R1" visibility = visible
"gblV_Oz_Calculated_Hop8_R1" visibility = visible
"gblV_TimeHop8_Min_R1" visibility = visible
"gblT_Hop8Drop_R1" visibility = visible
"gblV_Hop8_Calc_IBU_R1" visibility = visible
"sw_Use_Rocket_Hop8_Batch" visibility = hidden
"gblV_Hop8_Group_R1" visibility = visible 
endif
sleep 100
"gblS_Inter_Script" value = "@ 946 in sub2_XMLImportBeer_Smith > start D:sub_scrHopGrouping_1"
start "sub_scrHopGrouping_1"
print "@ 947   sub_scrHopGrouping_1"
sleep 100
if vB_Testing == true
sleep 3001
"gblS_Inter_Script" value = "ended: sub2_XMLImportBeer_Smith"
sleep 2001
endif
"sw_Running_Script_C" state  = false
clear
stop  "sub2_XMLImportBeer_Smith"
```

## 173. sub_2_scrValveOperation_Switch

Starts by itself: No · User can start or stop it: Yes · 0 lines

```text

```

## 174. scrWater_Measure_T0_Vessel

Starts by itself: No · User can start or stop it: No · 0 lines

```text

```

## 175. nlooper_scrBackground_Hops

Starts by itself: No · User can start or stop it: Yes · 339 lines

```text
//looper_scrBackground_Hops  MODIFIED  26_09_29  07-22
//26_07_20  14-18
//MIT License Granted for all Scripts and Configurations
//Copyright © OakBarn Brewery 2026
new value  vV_Boil_Min
vV_Boil_Min = "gblVBoilTime_Minutes" value
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
		if  "gblV_TimeHop1_Min_R1" value == vV_Boil_Min
			"gblS_Hop1_R1" background = 1
		endif
		if "gblV_TimeHop1_Min_R1"  value == 0
			"gblS_Hop1_R1" background = 3
		endif
		if "gblV_TimeHop1_Min_R1" value   < vV_Boil_Min
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
		if  "gblV_TimeHop2_Min_R1" value == vV_Boil_Min
			"gblS_Hop2_R1" background = 1
		endif
		if "gblV_TimeHop2_Min_R1"  value == 0
			"gblS_Hop2_R1" background = 3
		endif
		if "gblV_TimeHop2_Min_R1" value   < vV_Boil_Min
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
		if  "gblV_TimeHop4_Min_R1" value == vV_Boil_Min
			"gblS_Hop4_R1" background = 1
		endif
		if "gblV_TimeHop4_Min_R1"  value == 0
			"gblS_Hop4_R1" background = 3
		endif
		if "gblV_TimeHop4_Min_R1" value   < vV_Boil_Min
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
		if  "gblV_TimeHop5_Min_R1" value == vV_Boil_Min
			"gblS_Hop5_R1" background = 1
		endif
		if "gblV_TimeHop5_Min_R1"  value == 0
			"gblS_Hop5_R1" background = 3
		endif
		if "gblV_TimeHop5_Min_R1" value   < vV_Boil_Min
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
		if  "gblV_TimeHop6_Min_R1" value == vV_Boil_Min
			"gblS_Hop6_R1" background = 1
		endif
		if "gblV_TimeHop6_Min_R1"  value == 0
			"gblS_Hop6_R1" background = 3
		endif
		if "gblV_TimeHop6_Min_R1" value   < vV_Boil_Min
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
		if  "gblV_TimeHop7_Min_R1" value == vV_Boil_Min
			"gblS_Hop7_R1" background = 1
		endif
		if "gblV_TimeHop7_Min_R1"  value == 0
			"gblS_Hop7_R1" background = 3
		endif
		if "gblV_TimeHop7_Min_R1" value   < vV_Boil_Min
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
		if  "gblV_TimeHop8_Min_R1" value == vV_Boil_Min
			"gblS_Hop8_R1" background = 1
		endif
		if "gblV_TimeHop8_Min_R1"  value == 0
			"gblS_Hop8_R1" background = 3
		endif
		if "gblV_TimeHop8_Min_R1" value   < vV_Boil_Min
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

