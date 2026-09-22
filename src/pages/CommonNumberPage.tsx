import React, { useState, useEffect, useCallback } from 'react';
import { CommonNumberEntry, SiteSettings } from '../types';
import { ArrowLeft, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { Footer } from '../components/Footer';
import { InfoModal } from '../components/InfoModal';

interface CommonNumberPageProps {
  entries: CommonNumberEntry[];
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (path: string) => void;
}

interface CommonTableData {
  direct: string;
  house: string;
  ending: string;
}

// Helper to format date as DD/MM/YYYY in IST
function getTodayISTString(): string {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 3600000 * 5.5);
  const day = String(ist.getDate()).padStart(2, '0');
  const month = String(ist.getMonth() + 1).padStart(2, '0');
  const year = ist.getFullYear();
  return `${day}/${month}/${year}`;
}

export const CommonNumberPage: React.FC<CommonNumberPageProps> = ({
  entries,
  settings,
  onBack,
  onNavigate,
}) => {
  const [currentDate, setCurrentDate] = useState<string>(getTodayISTString());
  const [tableData, setTableData] = useState<{ table1: CommonTableData; table2: CommonTableData }>({
    table1: { direct: 'X', house: 'X', ending: 'X' },
    table2: { direct: 'X', house: 'X', ending: 'X' },
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'about' | 'terms' | 'privacy' | 'contact' | null>(null);

  const updateDataForDate = useCallback((date: string) => {
    const dateEntries = entries.filter((e) => e.date === date);
    const direct = dateEntries.find((e) => e.category_label === 'Direct')?.numbers || [];
    const house = dateEntries.find((e) => e.category_label === 'House')?.numbers || [];
    const ending = dateEntries.find((e) => e.category_label === 'Ending')?.numbers || [];

    setTableData({
      table1: {
        direct: direct.slice(0, 2).join(', ') || 'X',
        house: house[0] || 'X',
        ending: ending[0] || 'X',
      },
      table2: {
        direct: direct[2] || 'X',
        house: house[1] || 'X',
        ending: ending[1] || 'X',
      },
    });
  }, [entries]);

  useEffect(() => {
    updateDataForDate(currentDate);
  }, [currentDate, updateDataForDate]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const freshDate = getTodayISTString();
      if (freshDate !== currentDate) setCurrentDate(freshDate);
    }, 30000);
    return () => window.clearInterval(timer);
  }, [currentDate]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const faqs = [
    {
      q: '1. What is a morning teer common number?',
      a: 'A morning teer common number is a predicted number that many Teer followers and analysts suggest for a specific day based on past results, frequency tracking, and traditional calculation methods. It is shared before official game results.',
    },
    {
      q: '2. Is a common number the same as an official result?',
      a: 'No, a common number is only an estimation or forecast. Official results are based on the actual count of arrows hitting the target during the morning archery rounds in Shillong.',
    },
    {
      q: '3. How are common numbers selected?',
      a: 'They are derived through statistical frequency analysis, gap monitoring, number pair tracking, community insights, and historical pattern observation from preceding days.',
    },
    {
      q: '4. Can common numbers guarantee success?',
      a: 'No. There is absolutely no guarantee of success with common numbers. They are intended as informational guides and study points rather than sure shots.',
    },
    {
      q: '5. Why do people follow morning teer common numbers?',
      a: 'Followers review common numbers to save time, spot emerging number trends, prepare choices with structured data, and participate in community discussions.',
    },
    {
      q: '6. How often should I review number trends?',
      a: 'Most experienced followers review number trends daily in the morning, comparing recent First Round (F/R) and Second Round (S/R) figures with weekly averages.',
    },
    {
      q: '7. What is the best way to use common numbers?',
      a: 'The best way is to treat them as one analytical input alongside your own historical observation and pattern tracking, always practicing responsible participation.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 pb-16">
      {/* 1. TOP BAR (Exact Screenshot Style) */}
      <header
        className="sticky top-0 z-30 px-4 py-3 border-b border-indigo-900/10 shadow-xs flex items-center justify-between"
        style={{ backgroundColor: settings.top_bar_bg_color || '#3b82f6' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-indigo-950 font-normal text-sm hover:opacity-80 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border-2 border-indigo-900 flex items-center justify-center bg-white shadow-2xs">
            <span className="text-indigo-950 text-xs">🎯</span>
          </div>
          <span className="text-base sm:text-lg font-medium text-indigo-950 font-sans uppercase tracking-tight">
            {settings.site_name || 'Morningsundayteer'}
          </span>
        </div>

        <div className="w-12"></div>
      </header>

      {/* Main Content Container matching Exact Screenshot */}
      <main className="max-w-[440px] md:max-w-2xl mx-auto px-4 pt-5 pb-12">
        {/* Date Display */}
        <div className="text-center font-medium text-lg sm:text-xl text-gray-800 py-2 tracking-tight">
          {currentDate}
        </div>

        {/* ============================================================== */}
        {/* TABLE 1: SHILLONG (Aesthetic Modern Card) */}
        {/* ============================================================== */}
        <div className="w-full rounded-2xl border border-indigo-200/80 bg-white shadow-md shadow-indigo-900/5 overflow-hidden">
          {/* Main Title Row */}
          <div className="bg-linear-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-indigo-200/80 py-2 text-center font-medium text-sm sm:text-base tracking-wider text-indigo-950 uppercase">
            SHILLONG
          </div>

          {/* Subheaders Row with Elegant Indigo Palette */}
          <div className="grid grid-cols-3 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-medium text-sm sm:text-base border-b border-indigo-800 text-center">
            <div className="py-2 border-r border-white/20">Direct</div>
            <div className="py-2 border-r border-white/20">House</div>
            <div className="py-2">Ending</div>
          </div>

          {/* Data Row 1 */}
          <div className="grid grid-cols-3 bg-white text-gray-900 font-normal text-base sm:text-xl text-center tabular-nums font-sans">
            <div className="py-3.5 border-r border-slate-100">{tableData.table1.direct}</div>
            <div className="py-3.5 border-r border-slate-100">{tableData.table1.house}</div>
            <div className="py-3.5">{tableData.table1.ending}</div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TABLE 2: SECOND ROW (Aesthetic Modern Card) */}
        {/* ============================================================== */}
        <div className="w-full rounded-2xl border border-indigo-200/80 bg-white shadow-md shadow-indigo-900/5 overflow-hidden mt-4 sm:mt-5">
          {/* Subheaders Row with Elegant Indigo Palette */}
          <div className="grid grid-cols-3 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-medium text-sm sm:text-base border-b border-indigo-800 text-center">
            <div className="py-2 border-r border-white/20">Direct</div>
            <div className="py-2 border-r border-white/20">House</div>
            <div className="py-2">Ending</div>
          </div>

          {/* Data Row 2 */}
          <div className="grid grid-cols-3 bg-white text-gray-900 font-normal text-base sm:text-xl text-center tabular-nums font-sans">
            <div className="py-3.5 border-r border-slate-100">{tableData.table2.direct}</div>
            <div className="py-3.5 border-r border-slate-100">{tableData.table2.house}</div>
            <div className="py-3.5">{tableData.table2.ending}</div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* DISCLAIMER BOX (Exact Light Cream/Yellow with Italic Font) */}
        {/* ============================================================== */}
        <div className="mt-8 mb-6 p-4 rounded-lg bg-[#fefce8] border border-[#e7dec3] text-center text-xs sm:text-sm text-gray-700 italic leading-relaxed shadow-2xs">
          Disclaimer: These common numbers are purely based on certain calculations done using past results. There is no guarantee of the accuracy of these numbers. Please play responsibly.
        </div>

        {/* ============================================================== */}
        {/* MAIN ARTICLE: Morning Teer Common Number {Date} Free FR & SR Tips */}
        {/* ============================================================== */}
        <article className="space-y-6 text-gray-800 text-[14px] sm:text-[15px] leading-relaxed">
          {/* Main Article Title */}
          <h1 className="text-lg sm:text-xl font-medium text-gray-900 leading-tight tracking-tight mt-6">
            Morning Teer Common Number {currentDate} Free FR &amp; SR Tips
          </h1>

          {/* Intro Paragraph 1 */}
          <p>
            If you follow <span className="font-medium text-gray-800">Teer games</span> regularly, you have probably heard people talk about the{' '}
            <span className="text-blue-700 font-normal hover:underline cursor-pointer">morning teer common number</span>. It is one of the most searched topics among Teer enthusiasts. Many players check these numbers before placing their choices because they believe common numbers may reflect{' '}
            <span className="font-medium text-gray-800">patterns, trends, and public predictions</span>.
          </p>

          {/* Intro Paragraph 2 */}
          <p>
            The idea behind a <span className="text-blue-700 font-normal hover:underline cursor-pointer">Morning Teer</span> common number is simple. It represents numbers that are commonly suggested by analysts, enthusiasts, and prediction followers for a particular day. These numbers are not official results. Instead, they are forecasts based on observations, past outcomes, local methods, and number trends.
          </p>

          {/* Intro Paragraph 3 */}
          <p>
            Now, we will explore everything about morning teer <span className="font-medium text-gray-800">common number</span>, how it is calculated, why people follow it, and what factors may influence daily predictions. Players also check the{' '}
            <span className="text-blue-700 font-normal hover:underline cursor-pointer">house and ending targets</span> alongside these numbers for better accuracy.
          </p>

          {/* Section: What Is a Morning Teer Common Number? */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              What Is a Morning Teer Common Number?
            </h2>
            <p>
              A morning teer common number is a predicted number that many Teer followers expect to perform well on a specific day. These numbers are often shared before the official game results are announced.
            </p>
            <p>
              Think of it like a weather forecast. A weather forecast cannot guarantee sunshine or rain. It simply uses available data to predict possible outcomes. Common numbers work in a similar way.
            </p>
            <p>
              People gather information from different sources. They examine previous results, weekly trends, seasonal patterns, and community discussions. Based on these observations, they suggest a set of numbers that appear promising.
            </p>
            <p>
              This process has become a daily habit for many Teer followers. Every morning, thousands of people search for updated common numbers before making their selections.
            </p>
          </section>

          {/* Section: Why Are Common Numbers Popular? */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Why Are Common Numbers Popular?
            </h2>
            <p>
              The popularity of morning teer common number predictions comes from human nature. People naturally look for patterns in events. When a number appears repeatedly over time, it attracts attention.
            </p>
            <p>
              Many players feel more confident when their chosen number matches a common prediction. It gives them a sense of direction. While there is no guarantee of success, common numbers often become part of a player&apos;s decision-making process.
            </p>
            <p>
              Another reason for their popularity is accessibility. Today, common numbers are shared through websites, social groups, and online communities. Information spreads quickly, making it easier than ever for players to stay updated.
            </p>
            <p>
              For many people, discussing common numbers is also a social activity. Friends and family often exchange ideas and compare predictions before results are announced.
            </p>
          </section>

          {/* Section: Common Factors Used to Predict Morning Numbers */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Common Factors Used to Predict Morning Numbers
            </h2>
            <p>
              Several factors are often considered when creating a morning teer common number list.
            </p>

            <div className="space-y-3 pl-1">
              <div>
                <h3 className="font-medium text-gray-900 text-base">Previous Result Analysis</h3>
                <p className="text-gray-700">
                  Past results are one of the most important tools. Analysts examine recent outcomes to identify trends and repeating patterns.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 text-base">Frequency Tracking</h3>
                <p className="text-gray-700">
                  Some numbers appear more often during certain periods. Tracking frequency helps identify these recurring numbers.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 text-base">Missing Number Observation</h3>
                <p className="text-gray-700">
                  A missing number is one that has not appeared for several days. Many prediction methods pay close attention to these numbers.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 text-base">Number Pair Trends</h3>
                <p className="text-gray-700">
                  Certain number pairs sometimes appear close together in result charts. Analysts monitor these relationships carefully.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 text-base">Community Insights</h3>
                <p className="text-gray-700">
                  Many experienced followers share observations and predictions. These discussions often contribute to daily common number lists.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Understanding Number Patterns */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Understanding Number Patterns
            </h2>
            <p>
              Patterns are at the heart of most prediction methods. While no pattern guarantees future results, they can provide interesting insights.
            </p>
            <p>
              For example, imagine a number appearing several times within two weeks. Some analysts may view this as a strong trend. Others may believe the number has already completed its cycle.
            </p>
            <p>
              This difference in interpretation is what makes Teer discussions so interesting. Two people can analyze the same data and reach completely different conclusions.
            </p>
            <p>
              That is why common numbers are often presented as possibilities rather than certainties.
            </p>
          </section>

          {/* Section: Morning Teer Common Number and Historical Data */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Morning Teer Common Number and Historical Data
            </h2>
            <p>
              Historical data plays a major role in prediction strategies. Many enthusiasts maintain records of previous results for months or even years.
            </p>
            <p>
              These records help identify long-term trends. They can show which numbers appear more frequently and which remain absent for extended periods.
            </p>
            <p>
              Below is a simple example of how historical analysis may be organized:
            </p>

            {/* Table: Analysis Type | Purpose */}
            <div className="overflow-x-auto my-3 border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-medium border-b border-indigo-700">
                  <tr>
                    <th className="p-2.5 border-r border-white/20">Analysis Type</th>
                    <th className="p-2.5">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-2.5 font-medium border-r border-gray-300">Daily Results</td>
                    <td className="p-2.5 text-gray-600">Track recent outcomes</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-gray-300">Weekly Trends</td>
                    <td className="p-2.5 text-gray-600">Identify short-term patterns</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-gray-300">Monthly Records</td>
                    <td className="p-2.5 text-gray-600">Study broader trends</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-gray-300">Frequency Reports</td>
                    <td className="p-2.5 text-gray-600">Count repeated numbers</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-gray-300">Missing Number Lists</td>
                    <td className="p-2.5 text-gray-600">Monitor absent numbers</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Historical data does not predict the future perfectly. However, it provides useful context for creating daily forecasts.
            </p>
          </section>

          {/* Section: How Experienced Followers Use Common Numbers */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              How Experienced Followers Use Common Numbers
            </h2>
            <p>
              Experienced Teer followers rarely depend on a single prediction. Instead, they combine multiple methods.
            </p>
            <p>
              Many people compare common numbers with historical charts. They review recent trends and check whether the suggested numbers align with their own observations.
            </p>
            <p>
              This approach helps create a more balanced view. Rather than blindly following predictions, experienced players use common numbers as one piece of a larger puzzle.
            </p>
            <p>
              Over time, many enthusiasts develop their own systems. They learn which patterns they trust and which methods work best for their personal approach.
            </p>
          </section>

          {/* Section: Benefits of Following Morning Common Numbers */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Benefits of Following Morning Common Numbers
            </h2>
            <p>
              There are several reasons why people pay attention to morning Sunday teer common number updates.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
              <li>
                <span className="font-medium text-gray-800">Better Preparation:</span> Daily predictions provide a starting point for analysis.
              </li>
              <li>
                <span className="font-medium text-gray-800">Time Saving:</span> Instead of reviewing large amounts of data, players can quickly see suggested numbers.
              </li>
              <li>
                <span className="font-medium text-gray-800">Learning Opportunity:</span> Studying common numbers helps people understand prediction techniques.
              </li>
              <li>
                <span className="font-medium text-gray-800">Community Engagement:</span> Many enthusiasts enjoy discussing daily forecasts with others.
              </li>
              <li>
                <span className="font-medium text-gray-800">Trend Awareness:</span> Common numbers often highlight trends that players may have overlooked.
              </li>
            </ul>
            <p>
              These benefits explain why common number updates remain popular among Teer followers.
            </p>
          </section>

          {/* Section: Common Myths About Morning Teer Common Number */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Common Myths About Morning Teer Common Number
            </h2>
            <p>
              There are many misconceptions about common numbers. Understanding these myths can help create realistic expectations.
            </p>
            <div className="space-y-2.5">
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-200/80">
                <h3 className="font-medium text-gray-900 text-sm">Myth 1: Common Numbers Always Win</h3>
                <p className="text-xs text-gray-600 mt-0.5">This is false. Common numbers are predictions, not guarantees.</p>
              </div>
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-200/80">
                <h3 className="font-medium text-gray-900 text-sm">Myth 2: One Method Knows Everything</h3>
                <p className="text-xs text-gray-600 mt-0.5">No prediction method is perfect. Every system has limitations.</p>
              </div>
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-200/80">
                <h3 className="font-medium text-gray-900 text-sm">Myth 3: Past Results Guarantee Future Results</h3>
                <p className="text-xs text-gray-600 mt-0.5">Historical data can reveal trends, but it cannot predict outcomes with certainty.</p>
              </div>
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-200/80">
                <h3 className="font-medium text-gray-900 text-sm">Myth 4: More Common Numbers Mean Better Chances</h3>
                <p className="text-xs text-gray-600 mt-0.5">A long list of numbers does not automatically improve accuracy.</p>
              </div>
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-200/80">
                <h3 className="font-medium text-gray-900 text-sm">Myth 5: Experts Never Make Mistakes</h3>
                <p className="text-xs text-gray-600 mt-0.5">Even experienced analysts can be wrong. Predictions are always subject to uncertainty.</p>
              </div>
            </div>
          </section>

          {/* Section: Popular Approaches for Finding Common Numbers */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Popular Approaches for Finding Common Numbers
            </h2>
            <p>
              Different analysts use different techniques when creating common number lists.
            </p>
            <p>
              Some focus heavily on mathematics and statistical trends. Others prefer traditional methods passed down through local communities.
            </p>
            <p className="font-bold text-indigo-950">Popular approaches include:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Frequency analysis</li>
              <li>Gap analysis</li>
              <li>Pair tracking</li>
              <li>Trend monitoring</li>
              <li>Historical comparison</li>
              <li>Pattern observation</li>
              <li>Community forecasting</li>
            </ul>
            <p>
              Each method offers a unique perspective. Many successful analysts combine several approaches instead of relying on just one.
            </p>
          </section>

          {/* Section: Important Things to Remember Before Using Common Numbers */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Important Things to Remember Before Using Common Numbers
            </h2>
            <p>
              Before relying on any morning teer common number, keep a few important points in mind:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
              <li>Common numbers are predictions only.</li>
              <li>No prediction system is 100% accurate.</li>
              <li>Trends can change unexpectedly.</li>
              <li>Historical data is useful but not perfect.</li>
              <li>Independent analysis is always valuable.</li>
              <li>Patience is important when studying patterns.</li>
              <li>Responsible participation should always come first.</li>
            </ul>
            <p>
              Approaching common numbers with realistic expectations can make the experience more enjoyable and informative.
            </p>
          </section>

          {/* Section: Frequently Observed Number Categories */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Frequently Observed Number Categories
            </h2>
            <p>
              Many analysts organize numbers into different categories to simplify analysis.
            </p>

            {/* Table: Category | Description */}
            <div className="overflow-x-auto my-3 border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-medium border-b border-indigo-700">
                  <tr>
                    <th className="p-2.5 border-r border-white/20">Category</th>
                    <th className="p-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-2.5 font-medium border-r border-slate-200">Hot Numbers</td>
                    <td className="p-2.5 text-gray-600">Frequently appearing numbers</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-slate-200">Cold Numbers</td>
                    <td className="p-2.5 text-gray-600">Rarely appearing numbers</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-slate-200">Missing Numbers</td>
                    <td className="p-2.5 text-gray-600">Absent for several draws</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-slate-200">Repeat Numbers</td>
                    <td className="p-2.5 text-gray-600">Recently recurring numbers</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-slate-200">Pair Numbers</td>
                    <td className="p-2.5 text-gray-600">Numbers often linked together</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              These categories help analysts structure their predictions and identify possible opportunities.
            </p>
          </section>

          {/* Section: How Daily Trends Influence Common Numbers */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              How Daily Trends Influence Common Numbers
            </h2>
            <p>
              Daily trends are among the most important elements in number forecasting. Many analysts begin their work by examining the most recent results.
            </p>
            <p>
              A number that has appeared repeatedly may attract attention. Some analysts believe the trend will continue. Others expect the pattern to slow down.
            </p>
            <p>
              For example, if a number appears several times within a short period, discussions about that number often increase. As more people notice the trend, it becomes a popular candidate for the next morning teer common number list.
            </p>
            <p>
              Daily trends can change quickly. That is why experienced followers update their analysis regularly rather than relying on old information.
            </p>
          </section>

          {/* Section: The Role of Statistical Thinking */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              The Role of Statistical Thinking
            </h2>
            <p>
              Statistics play an important role in number analysis. Many prediction methods rely on counting frequencies and comparing historical records.
            </p>
            <p>
              A simple statistical approach may involve calculating:
            </p>

            {/* Table: Statistical Measure | Purpose */}
            <div className="overflow-x-auto my-3 border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-medium border-b border-indigo-700">
                  <tr>
                    <th className="p-2.5 border-r border-white/20">Statistical Measure</th>
                    <th className="p-2.5">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-2.5 font-medium border-r border-slate-200">Frequency Count</td>
                    <td className="p-2.5 text-gray-600">Measure appearances</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-slate-200">Gap Length</td>
                    <td className="p-2.5 text-gray-600">Measure absence periods</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-slate-200">Repeat Rate</td>
                    <td className="p-2.5 text-gray-600">Track recurring numbers</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-slate-200">Pair Frequency</td>
                    <td className="p-2.5 text-gray-600">Monitor linked numbers</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium border-r border-slate-200">Monthly Average</td>
                    <td className="p-2.5 text-gray-600">Identify consistency</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              While statistics cannot guarantee future outcomes, they provide a structured way to evaluate trends.
            </p>
            <p>
              Many experienced followers use statistical thinking to reduce emotional decision-making.
            </p>
          </section>

          {/* Section: Why Some Numbers Become Community Favorites */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Why Some Numbers Become Community Favorites
            </h2>
            <p>
              Every Teer community has numbers that gain special attention. These numbers often become popular because of recent success or memorable appearances.
            </p>
            <p>
              When many people discuss the same number, it naturally becomes part of daily prediction conversations. This popularity can make a number appear on multiple common number lists.
            </p>
            <p className="font-bold text-indigo-950">Community favorites often emerge through:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Recent winning trends</li>
              <li>Strong historical records</li>
              <li>Popular forecasting methods</li>
              <li>Local traditions</li>
              <li>Group discussions</li>
            </ul>
            <p>
              The popularity of a number does not increase its certainty. However, it can influence how people approach their selections.
            </p>
          </section>

          {/* Section: Morning Teer Common Number and Pattern Recognition */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Morning Teer Common Number and Pattern Recognition
            </h2>
            <p>
              Pattern recognition is like solving a puzzle. The pieces may not always fit perfectly, but each observation contributes to a larger picture.
            </p>
            <p>
              Many enthusiasts spend time reviewing charts and historical records. They search for repeating sequences and recurring intervals.
            </p>
            <p className="font-bold text-indigo-950">Some common observations include:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Numbers repeating after fixed gaps</li>
              <li>Consecutive appearances</li>
              <li>Alternating number groups</li>
              <li>Strong pair relationships</li>
              <li>Cyclical movement patterns</li>
            </ul>
            <p>
              Recognizing these patterns requires patience and consistency. Over time, followers often become better at spotting trends.
            </p>
          </section>

          {/* Section: Common Mistakes People Make */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Common Mistakes People Make
            </h2>
            <p>
              Many beginners make the mistake of expecting instant results. They may follow a morning teer common number prediction once and assume it should work immediately.
            </p>
            <p>
              In reality, prediction analysis is about probabilities rather than certainty.
            </p>
            <p className="font-bold text-indigo-950">Common mistakes include:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Ignoring historical data</li>
              <li>Following rumors without analysis</li>
              <li>Depending on one prediction source</li>
              <li>Overreacting to short-term trends</li>
              <li>Expecting guaranteed outcomes</li>
            </ul>
            <p>
              Avoiding these mistakes can lead to a more balanced understanding of number forecasting.
            </p>
          </section>

          {/* Section: Creating a Personal Tracking System */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Creating a Personal Tracking System
            </h2>
            <p>
              A personal tracking system can help improve analysis skills. It does not need to be complicated.
            </p>
            <p className="font-bold text-indigo-950">Many enthusiasts use a notebook to record:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Daily results</li>
              <li>Common numbers</li>
              <li>Missing numbers</li>
              <li>Repeat numbers</li>
              <li>Personal observations</li>
            </ul>
            <p className="pt-1">Here is a simple example:</p>

            {/* Table: Date | Common Number | Result | Notes */}
            <div className="overflow-x-auto my-3 border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-medium border-b border-indigo-700">
                  <tr>
                    <th className="p-2 border-r border-white/20">Date</th>
                    <th className="p-2 border-r border-white/20">Common Number</th>
                    <th className="p-2 border-r border-white/20">Result</th>
                    <th className="p-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-2 font-medium border-r border-slate-200">Day 1</td>
                    <td className="p-2 border-r border-slate-200">27</td>
                    <td className="p-2 border-r border-slate-200">58</td>
                    <td className="p-2 text-gray-600">Close trend</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-r border-slate-200">Day 2</td>
                    <td className="p-2 border-r border-slate-200">84</td>
                    <td className="p-2 border-r border-slate-200">91</td>
                    <td className="p-2 text-gray-600">Match</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-r border-slate-200">Day 3</td>
                    <td className="p-2 border-r border-slate-200">22</td>
                    <td className="p-2 border-r border-slate-200">07</td>
                    <td className="p-2 text-gray-600">No match</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-r border-slate-200">Day 4</td>
                    <td className="p-2 border-r border-slate-200">39</td>
                    <td className="p-2 border-r border-slate-200">89</td>
                    <td className="p-2 text-gray-600">Near result</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Tracking information over time helps reveal strengths and weaknesses in prediction methods.
            </p>
          </section>

          {/* Section: The Importance of Consistency */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              The Importance of Consistency
            </h2>
            <p>
              Consistency matters more than complexity. A simple system followed regularly is often more useful than a complicated system used occasionally.
            </p>
            <p>
              Many successful analysts spend a few minutes each day reviewing charts and updating records.
            </p>
            <p>
              This habit builds knowledge gradually. Like planting a tree, growth happens over time. Small efforts today can lead to deeper insights in the future.
            </p>
            <p>
              Consistency also helps reduce emotional decisions and encourages objective analysis.
            </p>
          </section>

          {/* Section: Understanding Number Groups */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Understanding Number Groups
            </h2>
            <p>
              Many prediction methods organize numbers into groups. This makes large datasets easier to understand.
            </p>
            <p className="font-bold text-indigo-950">Common grouping methods include:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Odd numbers</li>
              <li>Even numbers</li>
              <li>Low numbers</li>
              <li>High numbers</li>
              <li>Double-digit patterns</li>
              <li>Repeat groups</li>
            </ul>
            <p>
              Grouping numbers allows analysts to identify trends that might otherwise remain hidden.
            </p>
            <p>
              For example, a period dominated by odd numbers may attract attention from followers who study number balance.
            </p>
          </section>

          {/* Section: How Technology Has Changed Number Analysis */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              How Technology Has Changed Number Analysis
            </h2>
            <p>
              Years ago, many people relied on handwritten records. Today, technology has made analysis easier.
            </p>
            <p>
              Online charts, digital records, and forecasting tools allow users to review large amounts of information quickly.
            </p>
            <p className="font-bold text-indigo-950">Benefits of modern analysis tools include:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Faster trend detection</li>
              <li>Better record keeping</li>
              <li>Easier comparison of results</li>
              <li>Improved historical tracking</li>
              <li>Enhanced data visualization</li>
            </ul>
            <p>
              Technology has helped make morning teer common number research more accessible to a wider audience.
            </p>
          </section>

          {/* Section: Responsible Expectations Matter */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Responsible Expectations Matter
            </h2>
            <p>
              One of the most important lessons in number analysis is maintaining realistic expectations.
            </p>
            <p>
              Predictions are forecasts. They are not guarantees.
            </p>
            <p>
              Even the most experienced analysts cannot predict every result correctly. Unexpected outcomes are a natural part of any prediction-based activity.
            </p>
            <p>
              Approaching common numbers with patience and realistic expectations creates a healthier and more enjoyable experience.
            </p>
            <p>
              The most successful followers often focus on learning and observation rather than chasing certainty.
            </p>
          </section>

          {/* Section: Future Trends in Morning Teer Common Number Forecasting */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Future Trends in Morning Teer Common Number Forecasting
            </h2>
            <p>
              The future of forecasting may involve more advanced analytical methods.
            </p>
            <p className="font-bold text-indigo-950">As data collection improves, enthusiasts may gain access to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Larger historical databases</li>
              <li>Better trend analysis tools</li>
              <li>Automated pattern recognition</li>
              <li>Improved statistical models</li>
              <li>Enhanced forecasting systems</li>
            </ul>
            <p>
              These developments may help people analyze information more efficiently.
            </p>
            <p>
              However, the core principle will remain the same. Observing patterns and interpreting trends will always be at the heart of morning teer common number discussions.
            </p>
          </section>

          {/* Section: Final Thoughts */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Final Thoughts
            </h2>
            <p>
              The world of morning teer common number analysis is built on curiosity, observation, and pattern recognition. Many enthusiasts enjoy studying trends because it adds depth and excitement to their daily routine.
            </p>
            <p>
              While no prediction system can provide certainty, common numbers offer a structured way to explore historical data and identify potential trends. They help followers organize information, compare forecasts, and learn more about number behavior.
            </p>
            <p>
              Whether you are a beginner or an experienced enthusiast, the key is to approach analysis with patience and realistic expectations. Study the data, keep records, observe patterns, and continue learning.
            </p>
            <p>
              Most importantly, remember that morning teer common number predictions are guides, not guarantees. When used wisely, they can become a valuable part of your overall understanding of Teer number trends and forecasting methods.
            </p>
          </section>

          {/* ============================================================== */}
          {/* FAQs (Matching Image 3 with Accordions) */}
          {/* ============================================================== */}
          <section className="space-y-3 pt-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 leading-snug mb-3">
              FAQs About Morning Teer Common Number
            </h2>

            <div className="space-y-2.5">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-blue-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-3.5 flex items-center justify-between gap-3 font-bold text-sm sm:text-base text-blue-700 hover:bg-blue-50/50 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="shrink-0 text-red-500">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-blue-100 bg-gray-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </article>

        {/* ============================================================== */}
        {/* BOTTOM NAVIGATION TILES STRIP (Matching Image 3) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => handleNavClick('/')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all text-center aspect-square shadow-xs cursor-pointer group"
          >
            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🎯</span>
            <span className="text-[10px] sm:text-xs font-normal uppercase tracking-tight">Teer Result</span>
          </button>

          <button
            onClick={() => handleNavClick('/dream-number')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#ff604e] text-white hover:opacity-90 transition-all text-center aspect-square shadow-xs cursor-pointer group"
          >
            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">💭</span>
            <span className="text-[10px] sm:text-xs font-normal uppercase tracking-tight">Dream Number</span>
          </button>

          <button
            onClick={() => handleNavClick('/deal')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all text-center aspect-square shadow-xs cursor-pointer group"
          >
            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🎁</span>
            <span className="text-[10px] sm:text-xs font-normal uppercase tracking-tight">Win Prizes</span>
          </button>

          <button
            onClick={() => handleNavClick('/common-number')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all text-center aspect-square shadow-xs cursor-pointer group ring-2 ring-orange-400"
          >
            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">©</span>
            <span className="text-[10px] sm:text-xs font-normal uppercase tracking-tight">Common Number</span>
          </button>

          <button
            onClick={() => handleNavClick('/previous-results')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-700 text-white hover:bg-slate-800 transition-all text-center aspect-square shadow-xs cursor-pointer group"
          >
            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">📅</span>
            <span className="text-[10px] sm:text-xs font-normal uppercase tracking-tight">Previous Result</span>
          </button>

          <button
            onClick={() => handleNavClick('/predict-target')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-center aspect-square shadow-xs cursor-pointer group"
          >
            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🏹</span>
            <span className="text-[10px] sm:text-xs font-normal uppercase tracking-tight">Predict Target</span>
          </button>
        </div>
      </main>

      {/* Aesthetic Pastel Footer matching screenshot */}
      <Footer
        onNavigateHome={() => handleNavClick('/')}
        onOpenModal={(type) => setActiveModal(type)}
      />

      {/* Info Modals for About, Terms, Privacy, Contact */}
      <InfoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};
