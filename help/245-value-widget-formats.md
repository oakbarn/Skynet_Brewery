# Value Widget Formats

A **Value Widget** shows its number in the **Format** you pick in its Properties, with its **Decimals** (how many places after the decimal point) on the line under it.

| Format | 1000.12 shows as | -1000.12 shows as |
|---|---|---|
| **Fixed** | 1000.1 | -1000.1 |
| **Number** | 1,000.12 | -1,000.12 |
| **Percent** | 10.12% (for 10.12) | -10.12% |
| **Scientific** | 1.00E+03 | -1.00E+03 |
| **Accounting** | $ 1,000.12 | $ (1,000.12) |
| **Financial** | 1,000.12 | (1,000.12) |
| **Currency** | $1,000.12 | -$1,000.12 |
| **Currency rounded** | $1,000 | -$1,000 |

- A new Value Widget starts as **Fixed** with **1** Decimal. The examples above use 2 Decimals, except Fixed.
- **Percent** shows the number as it is, with a %: 10.12 shows 10.12%.
- **Currency rounded** has no Decimals.
- The **Currency sign** is $ when it is empty. Change it in the ⬢ beside **Units**, for example to € or £.
- The **Units** still show after the number, when you type some.

## In a Process

A Process picks a Format with `.format`:

```
wgt_VAL_Cost_BH.format = "Currency"
wgt_VAL_Cost_BH.format = ""
```

The second line puts back the Format picked in its Properties.

See [Value, Time and DateTime Widgets](134-value-time-and-datetime-widgets).
