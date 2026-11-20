# Formats du Value Widget {#value-widget-formats}

Un **Value Widget** montre son nombre dans le **Format** que vous choisissez dans ses Properties, avec ses **Decimals** (combien de chiffres après la virgule) sur la ligne en dessous.

| Format | 1000.12 s'affiche | -1000.12 s'affiche |
|---|---|---|
| **Fixed** | 1000.1 | -1000.1 |
| **Number** | 1,000.12 | -1,000.12 |
| **Percent** | 10.12% (pour 10.12) | -10.12% |
| **Scientific** | 1.00E+03 | -1.00E+03 |
| **Accounting** | $ 1,000.12 | $ (1,000.12) |
| **Financial** | 1,000.12 | (1,000.12) |
| **Currency** | $1,000.12 | -$1,000.12 |
| **Currency rounded** | $1,000 | -$1,000 |

- Un nouveau Value Widget commence en **Fixed** avec **1** Decimal. Les exemples ci-dessus utilisent 2 Decimals, sauf Fixed.
- **Percent** montre le nombre tel quel, avec un % : 10.12 s'affiche 10.12%.
- **Currency rounded** n'a pas de Decimals.
- Le **signe monétaire** est $ quand il est vide. Changez-le dans le ⬢ à côté de **Units**, par exemple en € ou £.
- Les **Units** s'affichent toujours après le nombre, quand vous en tapez.

## Dans un Process {#in-a-process}

Un Process choisit un Format avec `.format` :

```
wgt_VAL_Cost_BH.format = "Currency"
wgt_VAL_Cost_BH.format = ""
```

La deuxième ligne remet le Format choisi dans ses Properties.

Voir [Value, Time et DateTime Widgets](134-value-time-and-datetime-widgets).
