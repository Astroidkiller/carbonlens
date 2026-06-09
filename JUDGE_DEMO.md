# CarbonLens Demo Script (3 Minutes)

**[0:00 - 0:30] Introduction & Login**
*"Hi everyone, I'm excited to present CarbonLens—an intelligent personal carbon footprint tracker. The biggest problem with carbon accounting is the friction of manual data entry. Today, I'll show you how CarbonLens eliminates that friction entirely. Let's log in to our demo account."*
**(Action: Login with demo@carbonlens.com / password123)**

**[0:30 - 1:15] The Dashboard & Analytics**
*"Immediately upon logging in, we're presented with the Carbon Dashboard. You can see our total Carbon Score, the emissions accumulated this week, and a real-time line chart mapping our 14-day trend. The pie chart clearly shows that Transport is our biggest contributor. All of this is aggregated instantaneously from the PostgreSQL database using efficient time-series truncation."*
**(Action: Hover over the charts and point out the top-level metrics)**

**[1:15 - 1:45] Manual Activity Logging & Accuracy**
*"Let's say I want to log my commute. If I manually log '10 miles' of driving a car, CarbonLens does the heavy lifting. It automatically normalizes miles into kilometers in the background and applies strict scientific coefficients—in this case, 0.19 kg of CO2 per kilometer."*
**(Action: Add a manual Transport -> Car -> 10 -> miles activity. Show the success banner with the mathematical explanation).**

**[1:45 - 2:30] The "WOW" Factor: AI Diary**
*"But manual entry is still tedious. That's why we built the AI Diary. Watch this: I just type 'Today I drove 15 km to college, ate a chicken biryani for lunch, used about 5 kWh of electricity, and bought a T-shirt.' When I hit extract, our Hybrid AI engine parses this unstructured text."*
**(Action: Go to AI Diary. Paste the prompt. Click Extract).**
*"In seconds, we get a structured preview. The system accurately recognized 'chicken biryani' as a 'chicken meal' category. Notice the calculation explanations—the AI actually didn't do the math. To prevent hallucinations, the AI only structures the data, passing it to our deterministic backend calculation engine. It's safe, accurate, and completely free to operate using our fallback logic."*

**[2:30 - 3:00] Conclusion**
*"We confirm the save, and if we navigate back to the Dashboard, our trends and scores are instantly updated. CarbonLens makes sustainability tracking effortless. Thank you!"*
**(Action: Click Confirm. Navigate to Dashboard to show updated Score and charts).**
