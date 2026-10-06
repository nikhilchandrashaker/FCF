# Reach Without Revenue: Why Fan Controlled Football Failed

A research package on why Fan Controlled Football (FCF) ended after two seasons despite reported audience traction and a $40M Series A.

## What is in this folder

| File | What it is |
|---|---|
| `FCF_Why_It_Failed_Research_Paper.pdf` | The 8-page paper: abstract, background, methods, results, mechanism, limitations, conclusion, appendix. Replaces the earlier brief. |
| `FCF_failure_research_dataset_v3_corrected.xlsx` | The dataset with corrections applied, plus two new sheets: `Corrections_Log` and `Evidence_Scoring`. |
| `FCF_Explorer.jsx` | Interactive companion (React): audience families, team results, a runway calculator, a clickable mechanism diagram, and a re-codable evidence rubric. |
| `figures/` | The nine paper figures as PNGs, plus the scripts that produce them. |

## Thesis in one paragraph

FCF did not fail for lack of attention. Reported reach was never matched by any disclosed revenue stream, operations depended on investor capital with heavy crypto exposure, and only 40% of 2021 players returned for 2022. About 17 months after the Series A, the planned third season was cancelled. No audited FCF financials are public, so this is a best-supported inference, not a proven single cause.

## Figures

![Figure 1. Two measurement families on separate axes: FCF platform live views vs TV-measured averages.](figures/f1_measurement.png)
*Figure 1. Two measurement families on separate axes: FCF platform live views vs TV-measured averages.*

![Figure 2. Reach-to-revenue funnel. Solid bars are observed; hatched rows are absent from the public record.](figures/f2_funnel.png)
*Figure 2. Reach-to-revenue funnel. Solid bars are observed; hatched rows are absent from the public record.*

![Figure 3. Per-game scoring and champions, 2021-22.](figures/f3_competitive.png)
*Figure 3. Per-game scoring and champions, 2021-22.*

![Figure 4. Player retention, 2021 to 2022 (league-provided).](figures/f4_retention.png)
*Figure 4. Player retention, 2021 to 2022 (league-provided).*

![Figure 5. Capital raised vs one spring-league cost base, and the 4-to-8 team expansion.](figures/f5_capital.png)
*Figure 5. Capital raised vs one spring-league cost base, and the 4-to-8 team expansion.*

![Figure 6. Expansion-to-pivot timeline.](figures/f6_timeline.png)
*Figure 6. Expansion-to-pivot timeline.*

![Figure 7. Proposed failure mechanism.](figures/f7_pathway.png)
*Figure 7. Proposed failure mechanism.*

![Figure 8. Rubric-based evidence scores for each hypothesis.](figures/f8_evidence.png)
*Figure 8. Rubric-based evidence scores for each hypothesis.*

![Figure 9. Evidence-gap map: what the public record contains for each league.](figures/f9_gaps.png)
*Figure 9. Evidence-gap map: what the public record contains for each league.*

## Corrections made to the earlier files

1. 2021 champion was recorded as Glacier Boyz. The Wild Aces won the People's Championship 46-40 over Glacier Boyz.
2. The earlier funnel cited "20M+ reported live views in 2022". No source in the dataset supports it, so it was removed.
3. The `League_Comparator` sheet had shifted columns. It is rebuilt with an `Audience_Unit` column.
4. Series A to cancellation was -18 months. It is about 17.
5. Stray citation markers were removed from the paper text.
6. Open items to verify before publishing: USFL 2022 average (695K in the chart data, 715K in the cited source) and the 2022 opening-week 2.5M figure, which is not in the audience sheet.

## Measurement rule

FCF reports platform live views. The USFL, XFL and UFL report average viewers per game. These are never ranked on one axis; Figure 1 uses separate panels.

## Running the explorer

`FCF_Explorer.jsx` is a single-file React component with a default export. It needs `react` and `recharts`.

```bash
npm create vite@latest fcf-explorer -- --template react
cd fcf-explorer && npm install recharts
# copy FCF_Explorer.jsx into src/, then in src/main.jsx:
#   import App from "./FCF_Explorer.jsx"
npm run dev
```

All data is inline at the top of the file. No network access or storage is used.

## Rebuilding the figures and paper

```bash
pip install pandas numpy scipy matplotlib reportlab openpyxl pillow
python figures/make_figures.py   # reads the uploaded dataset path set at the top of the script
python figures/build_paper.py
```

Edit the `X=` path in `make_figures.py` to point at the corrected workbook. The scripts write figures to `figs/` and the PDF to the path set in `build_paper.py`, so adjust those paths for your machine.

## Known limits

- 12 team-seasons, no game-level audience or revenue data: description and exploratory association only.
- The evidence scores (0-2 on three criteria) are analyst judgments. Re-code them in `Evidence_Scoring` or in the explorer.
- The XFL cost comparison is an order-of-magnitude illustration. FCF's actual costs are not public.
- Table 1 in the paper (lifespans of other alternative leagues) is compiled from general knowledge, not from the workbook, and should be cited before submission.
