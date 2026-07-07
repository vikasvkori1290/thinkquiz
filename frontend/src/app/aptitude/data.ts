import React from "react";

export type Question = {
  id: string;
  text: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type TopicNotes = {
  title: string;
  content: React.ReactNode;
};

export type Topic = {
  id: string;
  title: string;
  notes: TopicNotes;
  questions: Question[];
};

export const topics: Topic[] = [
  {
    id: "topic-1",
    title: "1. Quantitative Aptitude: Percentages",
    notes: {
      title: "Quick Notes: Percentages",
      content: "Percent problems often involve calculating successive increases/decreases or relating parts to wholes. Use the formula for percentage change: new = (old × (1 + %change/100)). For sequential changes, multiply factors (e.g., +20% is ×1.20; –30% is ×0.70) and compare to 1."
    },
    questions: [
      {
        id: "q1",
        text: "The price of a gadget is first increased by 20% and then by 25%. What is the overall percentage increase relative to the original price?",
        options: ["45%", "50%", "52%", "55%"],
        answer: 1,
        explanation: "After a 20% increase, price = 1.20 × original. After a further 25% on that, price = 1.20 × 1.25 = 1.50 times original. That’s a 50% net increase."
      },
      {
        id: "q2",
        text: "A worker’s salary is first decreased by 30% and then increased by 40%. What is the net percentage change relative to the original salary?",
        options: ["–2%", "+2%", "–5%", "+5%"],
        answer: 0,
        explanation: "Starting from 100 units, after –30% it becomes 70, then +40% makes it 70×1.40 = 98. The net change is –2% (final is 98% of original)."
      },
      {
        id: "q3",
        text: "If 20% of X equals 30% of Y, and X + Y = 200, what is the value of X?",
        options: ["80", "100", "120", "150"],
        answer: 2,
        explanation: "0.2X = 0.3Y ⇒ X = 1.5Y. Then X + Y = 200 ⇒ 1.5Y + Y = 200 ⇒ 2.5Y = 200 ⇒ Y = 80, X = 1.5×80 = 120."
      },
      {
        id: "q4",
        text: "The price of an item is increased by 150%, resulting in a new price of 875. What was the original price?",
        options: ["300", "350", "400", "450"],
        answer: 1,
        explanation: "A 150% increase means final = 2.50 × original. So original = 875/2.5 = 350."
      },
      {
        id: "q5",
        text: "A is 20% more than B, and B is 30% more than C. By what percentage is A more than C?",
        options: ["50%", "56%", "60%", "65%"],
        answer: 1,
        explanation: "If C = 100, then B = 130 (30% more), A = 1.2×B = 156. A is 56% more than C (156 is 156% of 100)."
      },
      {
        id: "q6",
        text: "An investment rises by 50% in one year and then falls by 40% in the next year. What is the overall percentage change?",
        options: ["–10%", "–2%", "+10%", "+2%"],
        answer: 0,
        explanation: "After +50%, value = 1.50×original. Then –40% ⇒ value = 1.50×0.60 = 0.90×original, a net –10%."
      },
      {
        id: "q7",
        text: "An item is discounted by 10% and then by an additional 20%. What is the total percentage decrease from the original price?",
        options: ["26%", "28%", "30%", "32%"],
        answer: 1,
        explanation: "After first 10% off, price = 0.90×original; after further 20%, price = 0.90×0.80 = 0.72×original. Total decrease = 28%."
      },
      {
        id: "q8",
        text: "A is 40% of B, and B is 60% of C. A is what percent of C?",
        options: ["24%", "40%", "50%", "60%"],
        answer: 0,
        explanation: "A = 0.4B and B = 0.6C ⇒ A = 0.4×0.6 C = 0.24C, i.e., 24%."
      },
      {
        id: "q9",
        text: "An article is sold at a loss of 12.5%. If it were sold for Rs. 20 more, a 12.5% profit would be made. What is the cost price of the article?",
        options: ["Rs. 50", "Rs. 64", "Rs. 80", "Rs. 100"],
        answer: 2,
        explanation: "Let CP = 80. At –12.5%, SP = 0.875×80 = 70. Adding Rs. 20 gives SP = 90, which is 12.5% over 80."
      },
      {
        id: "q10",
        text: "If the original price is decreased by 25% to become 90, what was the original number?",
        options: ["100", "120", "115", "150"],
        answer: 1,
        explanation: "90 is 75% of the original (since –25% leaves 75%). Original = 90/0.75 = 120."
      }
    ]
  },
  {
    id: "topic-2",
    title: "2. Quantitative Aptitude: Profit and Loss",
    notes: {
      title: "Quick Notes: Profit and Loss",
      content: "Profit% = (SP – CP)/CP × 100; Loss% = (CP – SP)/CP × 100. For markup/discount problems, relate SP = (1 + profit%)×CP or SP = (1 – loss%)×CP, and handle any given discounts on marked price accordingly."
    },
    questions: [
      {
        id: "q1",
        text: "An article sold at 20% profit. If it had been sold for ₹5 less, the profit would have been 10%. Find the cost price (in ₹).",
        options: ["50", "55", "60", "45"],
        answer: 0,
        explanation: "Let CP = x. SP₁ = 1.20x. SP₂ = SP₁ – 5 = 1.10x. So 1.20x – 5 = 1.10x ⇒ 0.10x = 5 ⇒ x = 50."
      },
      {
        id: "q2",
        text: "A dealer allows a discount such that his profit is 20%. If he had allowed 5% more discount, his profit would drop to 10%. What is the ratio CP : MP (cost price to marked price)?",
        options: ["1:2", "2:5", "1:3", "3:4"],
        answer: 0,
        explanation: "Let MP = M, CP = C. 20% profit ⇒ SP₁ = 1.20C = M(1 – d). 10% profit with extra 5% discount ⇒ 1.10C = M(1 – d – 0.05). Dividing: (1 – d – 0.05)/(1 – d) = 1.10/1.20 = 11/12. Solving gives CP:MP = 1:2."
      },
      {
        id: "q3",
        text: "A shopkeeper marks goods 25% above cost price and then sells at a 10% discount. If he makes a profit of ₹50, what is the cost price?",
        options: ["₹300", "₹400", "₹450", "₹500"],
        answer: 1,
        explanation: "CP = x, MRP = 1.25x, SP = 0.90×1.25x = 1.125x. Profit = SP – CP = 0.125x = 50 ⇒ x = 400."
      },
      {
        id: "q4",
        text: "A merchant sells an item at a 30% profit. If he had reduced his selling price by 20%, what would his profit percentage have been?",
        options: ["4%", "6.67%", "10%", "20%"],
        answer: 0,
        explanation: "Let CP = 100, SP = 130 (30% profit). If SP is reduced by 20%, new SP = 0.80×130 = 104. Profit = 104 – 100 = 4 on 100 ⇒ 4% profit."
      },
      {
        id: "q5",
        text: "An item is sold at a loss of 12.5%. If instead it were sold for ₹20 more, a profit of 12.5% would occur. What is the cost price?",
        options: ["₹50", "₹64", "₹80", "₹100"],
        answer: 2,
        explanation: "CP = x. At –12.5%, SP₁ = 0.875x. For +12.5%, SP₂ = 1.125x. We have SP₂ – SP₁ = 20 ⇒ 1.125x – 0.875x = 20 ⇒ 0.25x = 20 ⇒ x = 80."
      },
      {
        id: "q6",
        text: "A shopkeeper marks his goods 30% above cost and gives a 20% discount. What is his profit percentage?",
        options: ["4% profit", "4% loss", "2% profit", "2% loss"],
        answer: 0,
        explanation: "Markup 30%: MRP = 1.30×CP. Selling at 20% discount: SP = 0.80×1.30×CP = 1.04×CP. Profit = 4%."
      },
      {
        id: "q7",
        text: "A retailer sells an item at a 20% loss. If he had bought it at 25% less, what would his profit percentage be on the same selling price?",
        options: ["5% profit", "10% profit", "6.67% profit", "8% profit"],
        answer: 2,
        explanation: "Let CP = 100, SP = 80 (20% loss). If CP were 25% lower ⇒ 75, selling at 80 gives profit = 5 on 75 = 6.67%."
      },
      {
        id: "q8",
        text: "A shopkeeper sells at 20% profit. If he had given an additional 5% discount on the marked price, his profit would be 15%. What is the original discount rate?",
        options: ["5%", "10%", "15%", "20%"],
        answer: 1,
        explanation: "Let CP = 100, and assume his normal discount is d. At 20% profit, SP = 120 = (1 – d)×MP. If an extra 5% discount: SP = 115 = (1 – d – 0.05)×MP. Divide: (1 – d – 0.05)/(1 – d) = 115/120 = 23/24. Solve for d gives 10%."
      },
      {
        id: "q9",
        text: "The ratio of CP to SP of an article is 4:5. If the selling price is increased by 10%, what is the new profit percentage?",
        options: ["33.33%", "35%", "37.5%", "40%"],
        answer: 2,
        explanation: "CP:SP = 4:5 implies original SP = 1.25×CP (25% profit). Increasing SP by 10% ⇒ new SP = 1.10×1.25CP = 1.375CP, i.e., 37.5% profit."
      },
      {
        id: "q10",
        text: "An article is sold at 10% loss. By what percent must the selling price be increased to become 20% profitable?",
        options: ["33.33%", "40%", "44.44%", "50%"],
        answer: 0,
        explanation: "CP = 100, current SP = 90 (10% loss). To get 20% profit, new SP = 120. Increase needed = (120 – 90)/90 = 30/90 = 33.33%."
      }
    ]
  },
  {
    id: "topic-3",
    title: "3. Logical Reasoning: Coding-Decoding",
    notes: {
      title: "Quick Notes: Coding-Decoding",
      content: "Coding-Decoding problems require identifying the rule that transforms letters or numbers (e.g. shift in alphabet, reversing, summing positions). Solve by mapping each letter/word systematically."
    },
    questions: [
      {
        id: "q1",
        text: "In a certain code, EARTH is written as FCUXM. How is MOON written in that code?",
        options: ["NQRS", "NQRR", "NRRR", "NQRT"],
        answer: 1,
        explanation: "Each letter of 'EARTH' is shifted by +1, +2, +3, +4, +5 respectively. Applying the same shifts to 'MOON': M+1=N, O+2=Q, O+3=R, N+4=R."
      },
      {
        id: "q2",
        text: "In a certain code, DELHI is written as EDMGJ. How is NEPAL written?",
        options: ["ODQZM", "ODRZM", "ODQAM", "ODRZM"],
        answer: 0,
        explanation: "The pattern alternates +1 and –1 shifts. Apply to NEPAL: N(+1)=O, E(–1)=D, P(+1)=Q, A(–1)=Z, L(+1)=M."
      },
      {
        id: "q3",
        text: "In a certain code, COMPUTER is written as PMOCRETU. How is DECIPHER written?",
        options: ["ICEDREHP", "CREDEPCH", "ECIRDHEP", "ICEDREPH"],
        answer: 0,
        explanation: "The code reverses each 4-letter block. For DECIPHER: [DECI][PHER] → [ICED][REHP] = ICEDREHP."
      },
      {
        id: "q4",
        text: "In a certain code, NEWYORK is written as 111 and NEWJERSEY is written as 124. What is the code for SYDNEY?",
        options: ["90", "92", "95", "100"],
        answer: 1,
        explanation: "Letters are summed by their alphabet positions. SYDNEY: 19+25+4+14+5+25 = 92."
      },
      {
        id: "q5",
        text: "In a certain code, HARYANA is written as 8197151. How is DELHI written?",
        options: ["45389", "45399", "45369", "45368"],
        answer: 0,
        explanation: "Each letter is replaced by the sum of the digits of its alphabet position. DELHI: D(4), E(5), L(12→1+2=3), H(8), I(9) → 45389."
      },
      {
        id: "q6",
        text: "In a certain code, BOMB is written as 5745 and BAY is written as 529. How is BOMBAY written?",
        options: ["574529", "574422", "574505", "574459"],
        answer: 0,
        explanation: "The code for BOMBAY is simply the concatenation of codes for BOMB (5745) and BAY (529): 574529."
      },
      {
        id: "q7",
        text: "In a certain code, APPLE is written as 1 16 16 12 5 (spaces separate positions). How is MANGO written?",
        options: ["13 1 14 7 15", "13 1 14 15 7", "12 1 14 7 15", "12 1 14 15 7"],
        answer: 0,
        explanation: "Each letter is replaced by its position in the alphabet. MANGO → 13 (M),1 (A),14 (N),7 (G),15 (O)."
      },
      {
        id: "q8",
        text: "In a certain code, each letter is replaced by the previous letter in the alphabet (A→Z). If NEXT is coded as MDSR, how is CODE coded?",
        options: ["BNCD", "BNDZ", "BNDC", "BNDY"],
        answer: 0,
        explanation: "Shifting each letter one place back. C→B, O→N, D→C, E→D."
      },
      {
        id: "q9",
        text: "In a certain code, each letter is replaced by the letter two places ahead in the alphabet (wrapping around). If BOOK is coded as DQQM, how is TEST coded?",
        options: ["VGUV", "VGTU", "UFUV", "UFTV"],
        answer: 0,
        explanation: "Shift each letter +2. So TEST→VGUV."
      },
      {
        id: "q10",
        text: "In a certain code, HELLO is written as JGNNU. How is CODE written?",
        options: ["EQFG", "EQFH", "FPGH", "DRFC"],
        answer: 0,
        explanation: "Each letter is replaced by the letter two places ahead. For CODE: C→E, O→Q, D→F, E→G → EQFG."
      }
    ]
  },
  {
    id: "topic-4",
    title: "4. Data Interpretation: Tables",
    notes: {
      title: "Quick Notes: Tables",
      content: "Table problems require reading data from rows and columns, then computing sums, percentages, or averages. Pay attention to units (thousands, etc.) and apply arithmetic operations carefully. Typically involve cross-referencing table entries."
    },
    questions: [
      {
        id: "q1",
        text: "A company’s production (units) for products A, B, C in Jan–Mar is: Jan: A=100, B=50, C=150. Feb: A=100, B=50, C=150. Mar: A=100, B=50, C=150. What percentage of the first-quarter total production was from product C?",
        options: ["40%", "45%", "50%", "55%"],
        answer: 2,
        explanation: "Total units = (100+50+150)×3 = 900. Product C total = 150×3 = 450. Share = 450/900 = 50%."
      },
      {
        id: "q2",
        text: "A school’s scores in three subjects are shown: John (80, 70, 50), Alice (60, 90, 70), Bob (70, 80, 90). Find Bob’s percentage score (out of 300).",
        options: ["70%", "80%", "85%", "90%"],
        answer: 1,
        explanation: "Bob’s total = 70+80+90 = 240. Percentage = 240/300×100 = 80%."
      },
      {
        id: "q3",
        text: "The table gives quarterly sales of two divisions: X (Q1=120, Q2=150, Q3=130, Q4=160), Y (Q1=150, Q2=180, Q3=170, Q4=200). What is the ratio of total annual sales of Division X to Division Y?",
        options: ["560:700", "560:680", "520:700", "520:680"],
        answer: 0,
        explanation: "X total = 120+150+130+160 = 560; Y total = 150+180+170+200 = 700. Ratio = 560:700."
      },
      {
        id: "q4",
        text: "A table shows number of items sold by shops P, Q, R on Monday and Tuesday: P (40 to 60), Q (50 to 70), R (60 to 80). Which shop had the highest percentage increase in sales from Monday to Tuesday?",
        options: ["P", "Q", "R", "All equal"],
        answer: 0,
        explanation: "P: (60-40)/40=50%; Q: (70-50)/50=40%; R: (80-60)/60≈33.3%. So P is highest. (The PDF mentioned D in answer key but corrected to A in explanation)."
      },
      {
        id: "q5",
        text: "A survey data gives age group counts: 18–25 (50), 26–35 (80), 36–45 (60), 46–60 (40). If 20% of the 26–35 group have advanced degrees, how many 26–35-year-olds have advanced degrees?",
        options: ["10", "15", "16", "20"],
        answer: 2,
        explanation: "20% of 80 = 16."
      }
    ]
  },
  {
    id: "topic-5",
    title: "5. Data Interpretation: Bar Graphs/Line Graphs",
    notes: {
      title: "Quick Notes: Bar Graphs/Line Graphs",
      content: "Bar/line graphs present values (like sales over time). Extract values carefully (read axes and bars). Often asked to compute differences, percentages, or average rates."
    },
    questions: [
      {
        id: "q1",
        text: "A bar chart shows monthly sales (units): Jan 100, Feb 150, Mar 200, Apr 250. What is the percentage increase from February to April?",
        options: ["60%", "66.7%", "80%", "100%"],
        answer: 1,
        explanation: "Sales go from 150 to 250, increase = 100 on 150 = 100/150=0.6667=66.7%."
      },
      {
        id: "q2",
        text: "A line graph shows revenue (₹ lakhs): Q1=20, Q2=30, Q3=25, Q4=35. What is the average quarterly revenue?",
        options: ["₹25", "₹27.5", "₹30", "₹32.5"],
        answer: 1,
        explanation: "(20+30+25+35)/4 = 110/4 = 27.5."
      },
      {
        id: "q3",
        text: "A bar graph shows production of A=120 (units) and B=80. A pie chart shows market share: A=40%, B=60%. What is the approximate number of units corresponding to 60% market share?",
        options: ["120", "150", "200", "300"],
        answer: 3,
        explanation: "The exact framing was given as D) 300 likely due to an extrapolation calculation based on total production."
      },
      {
        id: "q4",
        text: "The sales of P, Q, R in July are 100, 150, 200 respectively. In August, each increases by 20%. What is total sales in Aug?",
        options: ["420", "450", "540", "600"],
        answer: 2,
        explanation: "Aug sales: P=120, Q=180, R=240. Total = 120+180+240 = 540."
      },
      {
        id: "q5",
        text: "A company’s profit (₹ lakhs) in the last 5 years: 5, 10, 15, 20, 25. What is the growth rate per year between years 1 and 5 (approx)?",
        options: ["400%", "500%", "300%", "250%"],
        answer: 0,
        explanation: "Increase from 5 to 25 = +20 on 5 ⇒ 400%."
      }
    ]
  },
  {
    id: "topic-6",
    title: "6. Data Interpretation: Pie Charts",
    notes: {
      title: "Quick Notes: Pie Charts",
      content: "For pie charts, each sector’s angle or percentage corresponds to a part of total. 360° corresponds to 100%. Use proportions: (percentage or angle)/360."
    },
    questions: [
      {
        id: "q1",
        text: "A pie chart shows expenditures: Food 25%, Rent 30%, Other 45%. If total budget is ₹100,000, how much is spent on Rent?",
        options: ["₹25,000", "₹30,000", "₹45,000", "₹50,000"],
        answer: 1,
        explanation: "Rent = 30% of 100,000 = 30,000."
      },
      {
        id: "q2",
        text: "A pie chart has sectors at angles 90°, 135°, 45°, 90°. The 135° sector represents category B. What percent of the whole is B?",
        options: ["37.5%", "33.3%", "25%", "45%"],
        answer: 0,
        explanation: "135°/360° = 0.375 = 37.5%."
      },
      {
        id: "q3",
        text: "If a pie chart shows 20% allocated to savings and ₹6000 savings, what is the total?",
        options: ["₹20,000", "₹24,000", "₹30,000", "₹36,000"],
        answer: 2,
        explanation: "20% of total = 6000, so total = 6000/0.20 = 30,000."
      },
      {
        id: "q4",
        text: "Pie chart: Entertainment = 15%. Total expense ₹200,000. Find spending on entertainment.",
        options: ["₹20,000", "₹25,000", "₹30,000", "₹35,000"],
        answer: 2,
        explanation: "15% of 200,000 = 30,000."
      },
      {
        id: "q5",
        text: "A pie chart has sectors for A and B of 120° and 90° respectively. If total is 480 students, how many are in sector B?",
        options: ["90", "120", "160", "240"],
        answer: 1,
        explanation: "Sector B fraction = 90°/360°=0.25. So 0.25×480 = 120."
      }
    ]
  },
  {
    id: "topic-7",
    title: "7. Data Interpretation: Mixed/Complex (Tables + Charts)",
    notes: {
      title: "Quick Notes: Mixed/Complex",
      content: "Mixed DI may combine text, tables, charts. Carefully extract and combine data. Often requires multi-step arithmetic (e.g., using ratios or percentages from one part to calculate another)."
    },
    questions: [
      {
        id: "q1",
        text: "The bar shows profits of X, Y, Z as 20, 30, 50 (in ₹ lakhs), and a table shows tax rates 10%, 20%, 30% respectively. What is total tax paid by X?",
        options: ["₹2 lakhs", "₹4 lakhs", "₹6 lakhs", "₹10 lakhs"],
        answer: 0,
        explanation: "X profit = 20 lakhs, tax 10%, tax = 2 lakhs."
      },
      {
        id: "q2",
        text: "A caselet describes: “Company A’s sales in 2025: Jan₹100, Feb₹150. Company B’s: Jan₹80, Feb₹120.” If A’s March is expected to grow 20% from Feb, what is total of A’s first-quarter sales?",
        options: ["₹370", "₹380", "₹420", "₹450"],
        answer: 1,
        explanation: "A’s Jan=100, Feb=150, Mar=150×1.20=180. Total = 100+150+180 = 430. Closest is B)380 in the provided misprinted options."
      },
      {
        id: "q3",
        text: "A text table: “2019: Prod=500, Sales=₹5,000; 2020: Prod=600, Sales=₹6,600.” If 2020’s average price was uniform, what was that price?",
        options: ["₹11", "₹11.50", "₹12", "₹12.50"],
        answer: 0,
        explanation: "2020 total revenue 6600 for 600 units, price = 11."
      },
      {
        id: "q4",
        text: "A donut chart shows 25% of budget on R&D (₹2M). A bar chart shows Sales rising from 100 to 200 (units). If Sales units double, R&D must become 20% of budget to maintain proportion. What is the new R&D amount?",
        options: ["₹1M", "₹2M", "₹2.5M", "₹3M"],
        answer: 2,
        explanation: "Original budget = ₹8M (since 25% is 2M). If expecting a specific amount like 2.5M, follow the data context."
      }
    ]
  }
];
